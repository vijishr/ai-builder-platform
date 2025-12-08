@echo off
REM Auto-start AI Builder Platform - One Click Execution
REM This script starts both backend and frontend servers automatically

color 0A
title AI Builder Platform - Auto Start
cls

echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║     AI BUILDER PLATFORM - AUTO START SCRIPT               ║
echo ║     Backend: http://localhost:5000                        ║
echo ║     Frontend: http://localhost:3000                       ║
echo ╚════════════════════════════════════════════════════════════╝
echo.

REM Kill existing node processes
echo [*] Cleaning up existing processes...
taskkill /F /IM node.exe >nul 2>&1
timeout /t 2 /nobreak

REM Start Backend
echo [*] Starting Backend Server on port 5000...
cd /d "%~dp0backend"
start "AI Builder Backend" cmd /k "node src/server.js"
timeout /t 3 /nobreak

REM Start Frontend
echo [*] Starting Frontend Server on port 3000...
cd /d "%~dp0frontend"
start "AI Builder Frontend" cmd /k "npm run dev"
timeout /t 2 /nobreak

echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║           ✓ SERVERS STARTED SUCCESSFULLY                  ║
echo ╠════════════════════════════════════════════════════════════╣
echo ║                                                             ║
echo ║  🔗 Dashboard:     http://localhost:3000                   ║
echo ║  🔗 Signup:        http://localhost:3000/signup            ║
echo ║  🔗 AI Generator:  http://localhost:3000/ai                ║
echo ║  🔗 AI Agents:     http://localhost:3000/agents            ║
echo ║  🔗 Pricing Plans: http://localhost:3000/pricing           ║
echo ║  🔗 Projects:      http://localhost:3000/projects          ║
echo ║  🔗 Dev Tools:     http://localhost:3000/dashboard-dev     ║
echo ║  🔗 API Health:    http://localhost:5000/api/v1/health     ║
echo ║                                                             ║
echo ║  Plans:                                                    ║
echo ║  ✓ FREE - ₹0/month (7 free AI generations)                ║
echo ║  ✓ PRO - ₹500/month (MOST POPULAR)                        ║
echo ║  ✓ BUSINESS - ₹1000/month                                 ║
echo ║                                                             ║
echo ║  Features:                                                 ║
echo ║  • AI Content Generator                                    ║
echo ║  • AI Code Generator                                       ║
echo ║  • AI Agent Automation                                     ║
echo ║  • Project Management                                      ║
echo ║  • Email Verification OTP System                           ║
echo ║  • MongoDB Database Integration                            ║
echo ║                                                             ║
echo ║  Press Ctrl+C in either window to stop servers             ║
echo ║                                                             ║
echo ╚════════════════════════════════════════════════════════════╝
echo.
pause
