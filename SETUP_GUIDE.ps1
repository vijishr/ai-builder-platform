# Quick Setup Guide for AI Builder Platform
# Run these commands in SEPARATE PowerShell terminals

Write-Host "╔════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║  AI BUILDER - QUICK SETUP                ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

Write-Host "STEP 1: Set execution policy (run once)" -ForegroundColor Yellow
Write-Host "────────────────────────────────────────────" -ForegroundColor Gray
Write-Host "Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser -Force" -ForegroundColor Green
Write-Host ""

Write-Host "STEP 2: In TERMINAL 1 - Start Backend" -ForegroundColor Yellow
Write-Host "────────────────────────────────────────────" -ForegroundColor Gray
Write-Host "cd `"d:\vijish web work\ai-builder-platform\backend`"" -ForegroundColor Green
Write-Host "npm install" -ForegroundColor Green
Write-Host "npm run dev" -ForegroundColor Green
Write-Host ""
Write-Host "Expected output: 'Ready to accept requests!' on port 5000" -ForegroundColor Gray
Write-Host ""

Write-Host "STEP 3: In TERMINAL 2 - Start Frontend" -ForegroundColor Yellow
Write-Host "────────────────────────────────────────────" -ForegroundColor Gray
Write-Host "cd `"d:\vijish web work\ai-builder-platform\frontend`"" -ForegroundColor Green
Write-Host "npm install" -ForegroundColor Green
Write-Host "npm run dev" -ForegroundColor Green
Write-Host ""
Write-Host "Expected output: 'ready - started server on port 3000'" -ForegroundColor Gray
Write-Host ""

Write-Host "STEP 4: Open your browser" -ForegroundColor Yellow
Write-Host "────────────────────────────────────────────" -ForegroundColor Gray
Write-Host "http://localhost:3000" -ForegroundColor Green
Write-Host ""

Write-Host "DONE! Both servers running:" -ForegroundColor Green
Write-Host "  • Frontend: http://localhost:3000" -ForegroundColor Green
Write-Host "  • Backend:  http://localhost:5000" -ForegroundColor Green
