import { MongoClient } from 'mongodb';
import fs from 'fs';
import path from 'path';

async function main() {
  const uri = process.env.MONGODB_URI || process.argv[2];
  if (!uri) {
    console.error('Usage: MONGODB_URI must be set in env or passed as first arg');
    process.exit(1);
  }

  const client = new MongoClient(uri, { useUnifiedTopology: true });
  try {
    await client.connect();
    console.log('[migrate] Connected to MongoDB');

    const dbName = process.env.MONGODB_DB || 'ai_builder';
    const db = client.db(dbName);
    const usersColl = db.collection('users');
    const otpsColl = db.collection('otps');

    const dataPath = path.resolve(process.cwd(), 'backend', 'data', 'db.json');
    if (!fs.existsSync(dataPath)) {
      console.error('[migrate] db.json not found at', dataPath);
      process.exit(1);
    }

    const raw = fs.readFileSync(dataPath, 'utf8');
    const data = JSON.parse(raw);
    const users = data.users || [];
    const otps = data.otps || [];

    console.log(`[migrate] Found ${users.length} users and ${otps.length} otps`);

    for (const u of users) {
      try {
        const filter = { email: u.email };
        const update = { $set: { ...u } };
        await usersColl.updateOne(filter, update, { upsert: true });
        console.log(`[migrate] Upserted user ${u.email}`);
      } catch (e) {
        console.error('[migrate] user upsert error', e.message);
      }
    }

    for (const o of otps) {
      try {
        const filter = { email: o.email, otp: o.otp };
        const update = { $set: { ...o } };
        await otpsColl.updateOne(filter, update, { upsert: true });
        console.log(`[migrate] Upserted otp for ${o.email}`);
      } catch (e) {
        console.error('[migrate] otp upsert error', e.message);
      }
    }

    console.log('[migrate] Migration complete');
  } catch (err) {
    console.error('[migrate] Error:', err.message);
    process.exit(1);
  } finally {
    await client.close();
  }
}

main();
