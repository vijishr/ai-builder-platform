@echo off
REM AI Builder Platform - Complete Startup (Backend + Frontend)
REM Run this file to start both servers automatically

setlocal enabledelayedexpansion

cls
echo.
echo ╔════════════════════════════════════════════════╗
echo ║     AI BUILDER PLATFORM - AUTO STARTUP        ║
echo ║     Starting Backend + Frontend               ║
echo ╚════════════════════════════════════════════════╝
echo.

REM Define paths
set ROOT_DIR=d:\vijish web work\ai-builder-platform
set BACKEND_DIR=%ROOT_DIR%\backend
set FRONTEND_DIR=%ROOT_DIR%\frontend

REM Check if Node is installed
echo [Step 1/4] Checking Node.js installation...
node -v >nul 2>&1
if errorlevel 1 (
    echo.
    echo ✗ ERROR: Node.js not found!
    echo Please install Node.js from https://nodejs.org/
    echo.
    pause
    exit /b 1
)
echo ✓ Node.js found
echo.

REM Clean and reinstall backend
echo [Step 2/4] Setting up backend dependencies...
cd /d "%BACKEND_DIR%"
if exist node_modules (
    echo Removing old node_modules...
    rmdir /s /q node_modules >nul 2>&1
)
if exist package-lock.json (
    del package-lock.json >nul 2>&1
)
echo Installing backend dependencies...
call npm install --legacy-peer-deps
if errorlevel 1 (
    echo ✗ Backend npm install failed!
    pause
    exit /b 1
)
echo ✓ Backend ready
echo.

REM Clean and reinstall frontend
echo [Step 3/4] Setting up frontend dependencies...
cd /d "%FRONTEND_DIR%"
if exist node_modules (
    echo Removing old node_modules...
    rmdir /s /q node_modules >nul 2>&1
)
if exist package-lock.json (
    del package-lock.json >nul 2>&1
)
echo Installing frontend dependencies...
call npm install
if errorlevel 1 (
    echo ✗ Frontend npm install failed!
    pause
    exit /b 1
)
echo ✓ Frontend ready
echo.

REM Create .env files if missing
echo [Step 4/4] Creating environment files...
if not exist "%BACKEND_DIR%\.env" (
    echo Creating backend .env...
    (
        echo NODE_ENV=development
        echo PORT=5000
        echo FRONTEND_URL=http://localhost:3000
        echo JWT_SECRET=dev_secret_key
        echo JWT_REFRESH_SECRET=dev_refresh_secret
    ) > "%BACKEND_DIR%\.env"
)

if not exist "%FRONTEND_DIR%\.env.local" (
    echo Creating frontend .env.local...
    (
        echo NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
        echo NEXT_PUBLIC_APP_NAME=AI Builder
        echo NEXT_PUBLIC_APP_URL=http://localhost:3000
    ) > "%FRONTEND_DIR%\.env.local"
)
echo ✓ Environment files ready
echo.

REM Start servers
echo ════════════════════════════════════════════════
echo STARTING SERVERS...
echo ════════════════════════════════════════════════
echo.
echo Backend will open in a new window on PORT 5000
echo Frontend will open in a new window on PORT 3000
echo.
echo Waiting for servers to start (30 seconds)...
echo.

REM Start backend in new window
start "AI Builder - Backend (5000)" cmd /k "cd /d "%BACKEND_DIR%" && node src/server.js"

REM Wait for backend to initialize
timeout /t 5 /nobreak

REM Start frontend in new window
start "AI Builder - Frontend (3000)" cmd /k "cd /d "%FRONTEND_DIR%" && npm run dev"

REM Wait for frontend to start
timeout /t 10 /nobreak

REM Open browser
echo.
echo ════════════════════════════════════════════════
echo OPENING BROWSER...
echo ════════════════════════════════════════════════
echo.
start http://localhost:3000

echo ✓ Both servers started!
echo.
echo Backend:  http://localhost:5000
echo Frontend: http://localhost:3000
echo.
echo Keep all windows open. Press Ctrl+C in each to stop.
echo.
pause
