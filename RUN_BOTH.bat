@echo off
REM AI Builder Platform - Complete Setup and Troubleshooting
REM This batch file sets everything up and diagnoses issues

setlocal enabledelayedexpansion

echo.
echo ╔════════════════════════════════════════════╗
echo ║   AI BUILDER PLATFORM - AUTO SETUP        ║
echo ╚════════════════════════════════════════════╝
echo.

REM Check Node and npm
echo [1/5] Checking Node.js and npm...
node -v >nul 2>&1
if errorlevel 1 (
    echo ✗ Node.js not found! Please install from https://nodejs.org/
    pause
    exit /b 1
)
echo ✓ Node.js found: 
node -v

npm -v >nul 2>&1
if errorlevel 1 (
    echo ✗ npm not found!
    pause
    exit /b 1
)
echo ✓ npm found:
npm -v
echo.

REM Backend setup
echo [2/5] Setting up backend...
cd /d "d:\vijish web work\ai-builder-platform\backend"
if not exist node_modules (
    echo Installing backend dependencies...
    call npm install --legacy-peer-deps
)
echo ✓ Backend ready
echo.

REM Frontend setup
echo [3/5] Setting up frontend...
cd /d "d:\vijish web work\ai-builder-platform\frontend"
if not exist node_modules (
    echo Installing frontend dependencies...
    call npm install --legacy-peer-deps
)

REM Create .env.local if missing
if not exist .env.local (
    echo Creating .env.local for frontend...
    (
        echo NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
        echo NEXT_PUBLIC_APP_NAME=AI Builder
        echo NEXT_PUBLIC_APP_URL=http://localhost:3000
    ) > .env.local
)
echo ✓ Frontend ready
echo.

REM Start servers
echo [4/5] Starting servers...
echo.
echo ════════════════════════════════════════════
echo IMPORTANT: Keep this window open!
echo ════════════════════════════════════════════
echo.
echo Backend will start in a new window on port 5000
echo Frontend will start here on port 3000
echo.
echo Once you see "ready - started server on 0.0.0.0:3000"
echo Open your browser to: http://localhost:3000
echo.
pause

REM Start backend in a new window
start "Backend Server" cmd /k "cd /d d:\vijish web work\ai-builder-platform\backend && node src/server.js"

REM Wait for backend to start
timeout /t 2 /nobreak

REM Start frontend
echo [5/5] Starting frontend dev server...
echo.
cd /d "d:\vijish web work\ai-builder-platform\frontend"
call npm run dev

pause
