@echo off
title AI Builder - Full Stack Startup
color 0A

cls
echo.
echo ████████████████████████████████████████████████
echo █  AI BUILDER PLATFORM - PRODUCTION READY     █
echo ████████████████████████████████████████████████
echo.
echo This script will:
echo  1. Install backend dependencies
echo  2. Install frontend dependencies
echo  3. Start backend on port 5000
echo  4. Start frontend on port 3000
echo.
echo Proceeding to start servers...
timeout /t 1 /nobreak >nul

cls
echo Starting AI Builder Platform...
echo.

setlocal
cd /d "d:\vijish web work\ai-builder-platform"

REM Ensure ports 3000 and 5000 are free (kill any existing processes)
echo Checking ports 3000 and 5000 and killing existing listeners if any...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :5000') do (
  echo Killing PID %%a on port 5000
  taskkill /PID %%a /F >nul 2>&1
)
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :3000') do (
  echo Killing PID %%a on port 3000
  taskkill /PID %%a /F >nul 2>&1
)

REM Aggressively kill any stray Node/npm processes to avoid EADDRINUSE
echo Killing lingering node/npm processes if any...
taskkill /F /IM node.exe >nul 2>&1
taskkill /F /IM npm.exe >nul 2>&1
taskkill /F /IM node >nul 2>&1

REM Start backend using wrapper (logs to backend\backend.log)
start "AI Builder Backend (5000)" cmd /k ^
  "cd /d "d:\vijish web work\ai-builder-platform\backend" && ^
   title Backend Server - Port 5000 && ^
   call start-backend.bat"

REM Wait for backend to become healthy (poll /api/v1/health)
echo Waiting for backend to respond on http://localhost:5000/api/v1/health ...
set BACKEND_OK=0
for /L %%i in (1,1,30) do (
  powershell -NoProfile -Command "try{ Invoke-RestMethod -Uri 'http://localhost:5000/api/v1/health' -TimeoutSec 2 | Out-Null; exit 0 } catch { exit 1 }"
  if %%ERRORLEVEL%%==0 (
    set BACKEND_OK=1
    goto :backend_ready
  )
  timeout /t 1 /nobreak >nul
)
:backend_ready
if "%BACKEND_OK%"=="1" (
  echo Backend is responding.
) else (
  echo Backend did not become ready within timeout. Showing last 200 lines of backend.log
  powershell -NoProfile -Command "Get-Content -Path 'D:\vijish web work\ai-builder-platform\backend\backend.log' -Tail 200 | Out-String | Write-Host"
  echo Aborting.
  exit /b 1
)

REM Start frontend using wrapper (logs to frontend\frontend.log)
start "AI Builder Frontend (3000)" cmd /k ^
  "cd /d "d:\vijish web work\ai-builder-platform\frontend" && ^
   title Frontend Server - Port 3000 && ^
   call start-frontend.bat"

REM Wait for frontend to respond on http://localhost:3000
echo Waiting for frontend to respond on http://localhost:3000 ...
set FRONTEND_OK=0
for /L %%i in (1,1,60) do (
  powershell -NoProfile -Command "try{ Invoke-RestMethod -Uri 'http://localhost:3000' -TimeoutSec 2 -Method Head | Out-Null; exit 0 } catch { exit 1 }"
  if %%ERRORLEVEL%%==0 (
    set FRONTEND_OK=1
    goto :frontend_ready
  )
  timeout /t 1 /nobreak >nul
)
:frontend_ready
if "%FRONTEND_OK%"=="1" (
  echo Frontend is responding.
  start "" "http://localhost:3000"
) else (
  echo Frontend did not become ready within timeout. Showing last 200 lines of frontend.log
  powershell -NoProfile -Command "Get-Content -Path 'D:\vijish web work\ai-builder-platform\frontend\frontend.log' -Tail 200 | Out-String | Write-Host"
  echo Continuing anyway; you may need to check logs.
)

cls
echo.
echo ✓ Both servers are starting...
echo.
echo Backend:  http://localhost:5000
echo Frontend: http://localhost:3000
echo.
echo Check the two command windows that opened.
echo The browser should open automatically.
echo.
echo Keep both windows open while developing.
echo Press Ctrl+C in either window to stop that server.
echo.
pause

set MONGODB_URI=mongodb+srv://<user>:<pass>@cluster0.mongodb.net
set MONGODB_DB=ai_builder
