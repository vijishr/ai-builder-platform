# 🚀 AI Builder Platform - One-Click Auto Start

## ✅ Status: READY!

Both **backend** (port 5000) and **frontend** (port 3000) are now configured to start with a single click.

---

## 🎯 Quick Start (Choose One)

### Option 1: Interactive GUI (Recommended)
**Double-click** this file in File Explorer:
```
D:\vijish web work\ai-builder-platform\RUN_ALL.bat
```

This will:
- ✓ Kill any lingering processes on ports 3000 & 5000
- ✓ Start backend server (window 1) → waits for health check
- ✓ Start frontend server (window 2) → waits for readiness
- ✓ Automatically open your browser to `http://localhost:3000`

### Option 2: Same Terminal (Non-Interactive)
Run in PowerShell:
```powershell
cd 'D:\vijish web work\ai-builder-platform'
.\RUN_ALL_NONINTERACTIVE.bat
```

This will:
- ✓ Start both services in background
- ✓ Show combined logs (prefixed `[BACKEND]` and `[FRONTEND]`) in current terminal
- ✓ Press `Ctrl+C` to stop log tailing (servers keep running)

---

## 🧪 Manual E2E Test (Verify Everything Works)

1. **Sign up** at `http://localhost:3000/signup`:
   - Enter email: `test@example.com`
   - Enter password: `P@ssw0rd123`
   - Click "Sign up"

2. **Verify email** at `http://localhost:3000/dashboard-dev`:
   - Click "Fetch OTP"
   - Copy the OTP shown
   - Paste into the verify form and click "Verify Email"

3. **Log in** at `http://localhost:3000/login`:
   - Email: `test@example.com`
   - Password: `P@ssw0rd123`
   - Click "Login"

---

## 📊 Services Running

| Service | Port | URL |
|---------|------|-----|
| Backend API | 5000 | `http://localhost:5000/api/v1` |
| Backend Health | 5000 | `http://localhost:5000/api/v1/health` |
| Frontend | 3000 | `http://localhost:3000` |
| Frontend Login | 3000 | `http://localhost:3000/login` |
| Frontend Signup | 3000 | `http://localhost:3000/signup` |
| Frontend Dashboard Dev | 3000 | `http://localhost:3000/dashboard-dev` |
| API Docs (Swagger) | 5000 | `http://localhost:5000/api/v1/docs` |

---

## 🔍 Troubleshooting

### If backend doesn't start:
```powershell
# Check the logs
Get-Content 'D:\vijish web work\ai-builder-platform\backend\backend.log' -Tail 50
```

### If frontend doesn't start:
```powershell
# Check the logs
Get-Content 'D:\vijish web work\ai-builder-platform\frontend\frontend.log' -Tail 50
```

### Kill all servers (if stuck):
```powershell
taskkill /F /IM node.exe
```

### Check if ports are in use:
```powershell
netstat -aon | findstr :3000
netstat -aon | findstr :5000
```

---

## 📚 Features Included

✅ **User Authentication**
- Register with email & password
- OTP-based email verification
- JWT access/refresh tokens
- Login/logout flows

✅ **Development Tools**
- Debug endpoint to fetch OTPs (`/api/v1/debug/otps`)
- Dev dashboard to test verification (`/dashboard-dev`)
- Swagger API documentation
- File-based JSON persistence (no DB setup needed)
- Optional MongoDB support (set `MONGODB_URI` in `.env`)

✅ **Startup Automation**
- One-click batch orchestrator (`RUN_ALL.bat`)
- Non-interactive variant (`RUN_ALL_NONINTERACTIVE.bat`)
- Health checks with automatic retry loops
- Process cleanup on startup
- Combined logging

---

## 📝 Next Steps

1. **Run `RUN_ALL.bat`** (double-click from File Explorer or run in PowerShell)
2. **Wait ~10-30 seconds** for both services to start
3. **Browser opens automatically** to `http://localhost:3000`
4. **Test the auth flow** (signup → verify → login)
5. **Develop** — the servers auto-reload on file changes

---

## 🛠️ Manual Commands (Optional)

Start **backend only**:
```powershell
cd 'D:\vijish web work\ai-builder-platform\backend'
.\start-backend.bat
```

Start **frontend only**:
```powershell
cd 'D:\vijish web work\ai-builder-platform\frontend'
.\start-frontend.bat
```

---

## 📞 Support

If something fails:
1. Check the logs (see Troubleshooting section)
2. Kill any lingering processes: `taskkill /F /IM node.exe`
3. Try running `RUN_ALL.bat` again
4. Check that Node.js and npm are installed: `node --version` and `npm --version`

---

**Version:** 1.0.0 | **Last Updated:** December 2024
