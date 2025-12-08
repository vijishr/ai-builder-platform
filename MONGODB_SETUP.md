# MongoDB Setup Guide

## Overview
The AI Builder Platform supports **optional MongoDB**. If MongoDB is not configured or unavailable, the system automatically falls back to file-based storage (`backend/data/db.json`).

---

## Option 1: Using File-Based Storage (Default - No Setup Required)

The platform uses file-based JSON storage by default. This is perfect for development and testing.

**No configuration needed** — just run `RUN_ALL.bat` and everything works.

Data is stored in: `D:\vijish web work\ai-builder-platform\backend\data\db.json`

---

## Option 2: Using MongoDB Atlas (Cloud)

If you want to use MongoDB Atlas (recommended for production):

### Step 1: Create a MongoDB Atlas Account
1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up for a free account
3. Create a new project

### Step 2: Create a Database Cluster
1. Click "Create a Cluster"
2. Choose the free tier (M0)
3. Select your preferred region
4. Click "Create"
5. Wait for the cluster to be ready (~5 minutes)

### Step 3: Get Your Connection String
1. Click "Connect" on your cluster
2. Choose "Drivers" → "Node.js"
3. Copy the connection string (looks like: `mongodb+srv://username:password@cluster0.mongodb.net`)

### Step 4: Update `.env` File
Edit `D:\vijish web work\ai-builder-platform\backend\.env`:

Replace:
```dotenv
MONGODB_URI=mongodb+srv://<user>:<password>@cluster0.mongodb.net
MONGODB_DB=ai_builder
```

With your actual connection string:
```dotenv
MONGODB_URI=mongodb+srv://your_username:your_password@cluster0.mongodb.net
MONGODB_DB=ai_builder
```

**Important:**
- Replace `your_username` and `your_password` with your MongoDB Atlas credentials
- Do NOT include angle brackets `<>`
- Make sure you've added your IP to the MongoDB Atlas IP whitelist (or allow `0.0.0.0/0` for development)

### Step 5: Restart the Backend
1. Kill the backend: `taskkill /F /IM node.exe`
2. Run `RUN_ALL.bat` again
3. Backend will now connect to MongoDB

---

## How the System Works

### Startup Flow
1. Backend checks if `MONGODB_URI` is set and valid
2. If valid, it tries to connect to MongoDB (5 second timeout)
3. If connection fails, or if `MONGODB_URI` is empty/placeholder, backend falls back to file DB
4. Both databases are always checked for user lookups (MongoDB first, then file DB as fallback)

### This Means:
- ✅ You can start without MongoDB and it just works
- ✅ If you add MongoDB later, existing users in file DB are still accessible
- ✅ New users can be stored in MongoDB while old ones stay in file DB
- ✅ If MongoDB goes down, file DB is used automatically
- ✅ No data loss — both are checked on every read

---

## Troubleshooting

### MongoDB Not Connecting?

Check the backend logs:
```powershell
Get-Content 'D:\vijish web work\ai-builder-platform\backend\backend.log' -Tail 100
```

Look for messages like:
- `[MongoDB] Connection failed: ...` — MongoDB is down or credentials are wrong
- `[MongoDB] URI not configured or contains placeholders` — `.env` file not updated
- `[MongoDB] Connected successfully` — Connection OK, using MongoDB

### I Want to Use File DB Only

Just leave the `.env` as-is (with placeholder `<user>:<password>`), and the system uses file DB automatically.

### I Want to Switch Back to File DB

Remove or comment out the `MONGODB_URI` line in `.env`:
```dotenv
# MONGODB_URI=mongodb+srv://...
```

Then restart the backend.

---

## Production Recommendations

For production:
- Use MongoDB Atlas (cloud-hosted, secure, no maintenance)
- Set strong passwords for MongoDB credentials
- Add only necessary IPs to the IP whitelist (not `0.0.0.0/0`)
- Use environment variables instead of hardcoding credentials
- Enable backups in MongoDB Atlas

For development:
- Use file DB (no setup)
- Or use local MongoDB with `mongodb://localhost:27017`

---

## Data Migration (File DB → MongoDB)

If you want to migrate existing users/OTPs from file DB to MongoDB:

1. Ensure `.env` has valid MongoDB connection
2. Backend automatically reads from both on startup
3. To explicitly migrate, edit `backend/data/db.json`, copy users/otps, and insert them into MongoDB

Or simply start fresh in MongoDB (old file DB data is still available as a backup).

---

**Status:** MongoDB is optional and fully integrated with file DB fallback. No risk of data loss.
