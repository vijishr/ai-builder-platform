import { MongoClient } from 'mongodb';

let client;
let usersColl;
let otpsColl;
let connected = false;
let connectionAttempts = 0;

// Connection retry configuration from env or defaults
const RETRY_COUNT = parseInt(process.env.MONGODB_RETRY_COUNT || '3');
const RETRY_DELAY_MS = parseInt(process.env.MONGODB_RETRY_DELAY_MS || '2000');

async function connectMongo() {
  if (connected) return true;
  
  const uri = process.env.MONGODB_URI;
  if (!uri || uri.includes('<user>') || uri.includes('<password>')) {
    console.log('[MongoDB] URI not configured or contains placeholders — using file DB fallback');
    return false;
  }

  if (connectionAttempts >= RETRY_COUNT) {
    console.log(`[MongoDB] Max connection attempts (${RETRY_COUNT}) reached — using file DB fallback`);
    return false;
  }

  connectionAttempts++;
  console.log(`[MongoDB] Connection attempt ${connectionAttempts}/${RETRY_COUNT}...`);

  try {
    client = new MongoClient(uri, {
      connectTimeoutMS: 8000,
      serverSelectionTimeoutMS: 8000,
      retryWrites: true,
      w: 'majority'
    });
    await client.connect();
    const dbName = process.env.MONGODB_DB || 'ai_builder';
    const db = client.db(dbName);
    usersColl = db.collection('users');
    otpsColl = db.collection('otps');

    // ensure index on email
    try {
      await usersColl.createIndex({ email: 1 }, { unique: true });
      console.log('[MongoDB] Email index created');
    } catch (e) {
      console.warn('[MongoDB] Could not create email index:', e.message);
    }

    connected = true;
    console.log('[MongoDB] ✓ Connected successfully to', dbName);
    return true;
  } catch (error) {
    console.warn(`[MongoDB] Connection attempt ${connectionAttempts} failed: ${error.message}`);
    
    if (connectionAttempts < RETRY_COUNT) {
      console.log(`[MongoDB] Retrying in ${RETRY_DELAY_MS}ms...`);
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY_MS));
      return connectMongo(); // Retry recursively
    } else {
      console.log('[MongoDB] All connection attempts failed — using file DB fallback');
      return false;
    }
  }
}

// Attempt initial connection on module load
connectMongo().catch(err => {
  console.error('[MongoDB] Init error:', err.message);
});

export async function isMongo() {
  const uri = process.env.MONGODB_URI;
  if (!uri || uri.includes('<user>') || uri.includes('<password>')) {
    return false;
  }
  return connected;
}

export async function findUserByEmail(email) {
  if (!(await connectMongo())) return null;
  try {
    return await usersColl.findOne({ email });
  } catch (e) {
    console.error('[MongoDB] findUserByEmail error:', e.message);
    return null;
  }
}

export async function createUser(user) {
  if (!(await connectMongo())) return null;
  try {
    const res = await usersColl.insertOne(user);
    return res;
  } catch (e) {
    console.error('[MongoDB] createUser error:', e.message);
    return null;
  }
}

export async function markUserVerified(email) {
  if (!(await connectMongo())) return null;
  try {
    return await usersColl.updateOne({ email }, { $set: { otpVerified: true } });
  } catch (e) {
    console.error('[MongoDB] markUserVerified error:', e.message);
    return null;
  }
}

export async function addOtp(otpObj) {
  if (!(await connectMongo())) return null;
  try {
    return await otpsColl.insertOne(otpObj);
  } catch (e) {
    console.error('[MongoDB] addOtp error:', e.message);
    return null;
  }
}

export async function findOtp(email, otp) {
  if (!(await connectMongo())) return null;
  try {
    return await otpsColl.findOne({ email, otp });
  } catch (e) {
    console.error('[MongoDB] findOtp error:', e.message);
    return null;
  }
}

export async function removeOtp(email, otp) {
  if (!(await connectMongo())) return null;
  try {
    return await otpsColl.deleteOne({ email, otp });
  } catch (e) {
    console.error('[MongoDB] removeOtp error:', e.message);
    return null;
  }
}

export async function updateUserPassword(userId, hashedPassword) {
  if (!(await connectMongo())) return null;
  try {
    return await usersColl.updateOne({ id: userId }, { $set: { password: hashedPassword } });
  } catch (e) {
    console.error('[MongoDB] updateUserPassword error:', e.message);
    return null;
  }
}

export default {
  connectMongo,
  findUserByEmail,
  createUser,
  markUserVerified,
  addOtp,
  findOtp,
  removeOtp,
  updateUserPassword,
};
