@echo off
title AI Builder - Full Stack Startup (no-pause)
color 0A

cls
echo Starting AI Builder Platform (no pause)...
echo.

setlocal
cd /d "d:\vijish web work\ai-builder-platform"

REM Start backend
start "AI Builder Backend (5000)" cmd /k ^
  "cd backend && ^
   title Backend Server - Port 5000 && ^
   echo Installing backend dependencies... && ^
   npm install --legacy-peer-deps && ^
   echo. && ^
   echo ════════════════════════════════════════ && ^
   echo Backend starting on http://localhost:5000 && ^
   echo ════════════════════════════════════════ && ^
   echo. && ^
   node src/server.js"

REM Wait 3 seconds for backend to start
timeout /t 3 /nobreak

REM Start frontend
start "AI Builder Frontend (3000)" cmd /k ^
  "cd frontend && ^
   title Frontend Server - Port 3000 && ^
   echo Installing frontend dependencies... && ^
   npm install && ^
   echo. && ^
   echo ════════════════════════════════════════ && ^
   echo Frontend starting on http://localhost:3000 && ^
   echo ════════════════════════════════════════ && ^
   echo. && ^
   npm run dev"

REM Wait for frontend to start then open browser
timeout /t 5 /nobreak
start http://localhost:3000

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
