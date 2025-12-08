@echo off
REM AI Builder - Diagnostic and Setup Script
REM This script checks everything and provides fixes

setlocal enabledelayedexpansion

cls
echo.
echo ╔════════════════════════════════════════════════╗
echo ║     AI BUILDER - DIAGNOSTIC & SETUP           ║
echo ╚════════════════════════════════════════════════╝
echo.

set ROOT_DIR=d:\vijish web work\ai-builder-platform
set BACKEND_DIR=%ROOT_DIR%\backend
set FRONTEND_DIR=%ROOT_DIR%\frontend

REM Test 1: Node.js
echo [TEST 1/5] Checking Node.js...
node -v >nul 2>&1
if errorlevel 1 (
    echo ✗ FAIL: Node.js not found or not in PATH
    echo Install from: https://nodejs.org/
    pause
    exit /b 1
) else (
    for /f "tokens=*" %%i in ('node -v') do set NODE_VER=%%i
    echo ✓ PASS: !NODE_VER!
)

REM Test 2: npm
echo [TEST 2/5] Checking npm...
npm -v >nul 2>&1
if errorlevel 1 (
    echo ✗ FAIL: npm not found
    pause
    exit /b 1
) else (
    for /f "tokens=*" %%i in ('npm -v') do set NPM_VER=%%i
    echo ✓ PASS: !NPM_VER!
)

REM Test 3: Check project directories
echo [TEST 3/5] Checking project structure...
if not exist "%BACKEND_DIR%" (
    echo ✗ FAIL: Backend directory not found
    pause
    exit /b 1
)
if not exist "%FRONTEND_DIR%" (
    echo ✗ FAIL: Frontend directory not found
    pause
    exit /b 1
)
echo ✓ PASS: Project directories exist

REM Test 4: Create .env files
echo [TEST 4/5] Setting up environment files...
if not exist "%BACKEND_DIR%\.env" (
    (
        echo NODE_ENV=development
        echo PORT=5000
        echo FRONTEND_URL=http://localhost:3000
        echo JWT_SECRET=dev_secret_key_12345
        echo JWT_REFRESH_SECRET=dev_refresh_secret_12345
    ) > "%BACKEND_DIR%\.env"
    echo Created %BACKEND_DIR%\.env
)
if not exist "%FRONTEND_DIR%\.env.local" (
    (
        echo NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
        echo NEXT_PUBLIC_APP_NAME=AI Builder
        echo NEXT_PUBLIC_APP_URL=http://localhost:3000
    ) > "%FRONTEND_DIR%\.env.local"
    echo Created %FRONTEND_DIR%\.env.local
)
echo ✓ PASS: Environment files ready

REM Test 5: Port availability
echo [TEST 5/5] Checking port availability...
netstat -ano | findstr :5000 >nul
if not errorlevel 1 (
    echo ⚠ WARNING: Port 5000 already in use (may be OK if backend is already running)
)
netstat -ano | findstr :3000 >nul
if not errorlevel 1 (
    echo ⚠ WARNING: Port 3000 already in use (may be OK if frontend is already running)
)
echo ✓ PASS: Port check complete

echo.
echo ════════════════════════════════════════════════
echo ALL DIAGNOSTICS PASSED - READY TO START
echo ════════════════════════════════════════════════
echo.

REM Ask user what to do
echo Choose an option:
echo [1] Start Backend only (in this window)
echo [2] Start Frontend only (in this window)  
echo [3] Install dependencies only (no start)
echo [4] Exit
echo.

set /p choice="Enter choice (1-4): "

if "%choice%"=="1" (
    cls
    echo.
    echo Starting Backend Server...
    echo.
    cd /d "%BACKEND_DIR%"
    if not exist node_modules (
        echo Installing backend dependencies...
        call npm install --legacy-peer-deps
    )
    echo.
    echo ════════════════════════════════════════════════
    echo Backend starting on http://localhost:5000
    echo ════════════════════════════════════════════════
    echo.
    node src/server.js
    pause
)

if "%choice%"=="2" (
    cls
    echo.
    echo Starting Frontend Server...
    echo.
    cd /d "%FRONTEND_DIR%"
    if not exist node_modules (
        echo Installing frontend dependencies...
        call npm install
    )
    echo.
    echo ════════════════════════════════════════════════
    echo Frontend starting on http://localhost:3000
    echo ════════════════════════════════════════════════
    echo.
    call npm run dev
    pause
)

if "%choice%"=="3" (
    echo.
    echo Installing backend dependencies...
    cd /d "%BACKEND_DIR%"
    call npm install --legacy-peer-deps
    echo ✓ Backend dependencies installed
    echo.
    echo Installing frontend dependencies...
    cd /d "%FRONTEND_DIR%"
    call npm install
    echo ✓ Frontend dependencies installed
    echo.
    pause
)

if "%choice%"=="4" (
    exit /b 0
)

echo Invalid choice. Please run again.
pause
