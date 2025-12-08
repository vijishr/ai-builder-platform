# FIX-OTP-AND-FORGOT-PASSWORD.ps1
# Fixes: OTP not found + Forgot password not working

$root = "d:\vijish web work\ai-builder-platform"
Set-Location $root

Write-Host "================================================" -ForegroundColor Cyan
Write-Host "Fixing OTP and Forgot Password Issues" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan

Write-Host "`n✓ Changes Applied:" -ForegroundColor Green
Write-Host "  1. resend-otp now stores OTP in database" -ForegroundColor White
Write-Host "  2. forgot-password validates user exists" -ForegroundColor White
Write-Host "  3. reset-password updates user password in DB" -ForegroundColor White
Write-Host "  4. Added MongoDB updateUserPassword function" -ForegroundColor White

Write-Host "`nRestarting backend..." -ForegroundColor Yellow
taskkill /F /IM node.exe >$null 2>&1
taskkill /F /IM npm.exe >$null 2>&1
Start-Sleep -Seconds 2

Write-Host "Starting backend server..." -ForegroundColor Cyan
Start-Process -FilePath "cmd.exe" -ArgumentList "/k cd /d `"$root\backend`" && npm run dev" -WorkingDirectory "$root\backend"
Start-Sleep -Seconds 8

Write-Host "Testing backend health..." -ForegroundColor Yellow
$ok = $false
for ($i = 0; $i -lt 5; $i++) {
  try {
    $r = Invoke-RestMethod -Uri "http://localhost:5000/api/v1/health" -TimeoutSec 2 -ErrorAction Stop
    Write-Host "  ✓ Backend responding" -ForegroundColor Green
    $ok = $true
    break
  } catch {
    Start-Sleep -Seconds 1
  }
}

if (-not $ok) {
  Write-Host "  ✗ Backend not responding" -ForegroundColor Red
  Write-Host "  Check backend log:" -ForegroundColor Red
  Get-Content "$root\backend\backend.log" -Tail 50 | Write-Host
  exit 1
}

Write-Host "`n✅ Backend Restarted Successfully!" -ForegroundColor Green

Write-Host "`n================================================" -ForegroundColor Cyan
Write-Host "Test Instructions" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan

Write-Host "`n1. Sign up test (OTP should now be stored):" -ForegroundColor Yellow
Write-Host "   curl -X POST http://localhost:5000/api/v1/auth/register \" -ForegroundColor White
Write-Host "     -H 'Content-Type: application/json' \" -ForegroundColor White
Write-Host "     -d '{\"email\":\"test@example.com\",\"password\":\"Pass123456\",\"name\":\"Test\",\"userType\":\"business\"}'" -ForegroundColor White

Write-Host "`n2. Fetch OTP (now should find it):" -ForegroundColor Yellow
Write-Host "   curl 'http://localhost:5000/api/v1/debug/otps?email=test@example.com'" -ForegroundColor White

Write-Host "`n3. Resend OTP test:" -ForegroundColor Yellow
Write-Host "   curl -X POST http://localhost:5000/api/v1/auth/resend-otp \" -ForegroundColor White
Write-Host "     -H 'Content-Type: application/json' \" -ForegroundColor White
Write-Host "     -d '{\"email\":\"test@example.com\"}'" -ForegroundColor White

Write-Host "`n4. Forgot password test:" -ForegroundColor Yellow
Write-Host "   curl -X POST http://localhost:5000/api/v1/auth/forgot-password \" -ForegroundColor White
Write-Host "     -H 'Content-Type: application/json' \" -ForegroundColor White
Write-Host "     -d '{\"email\":\"test@example.com\"}'" -ForegroundColor White

Write-Host "`n5. Reset password test (use token from step 4):" -ForegroundColor Yellow
Write-Host "   curl -X POST http://localhost:5000/api/v1/auth/reset-password \" -ForegroundColor White
Write-Host "     -H 'Content-Type: application/json' \" -ForegroundColor White
Write-Host "     -d '{\"token\":\"<token_from_above>\",\"newPassword\":\"NewPass123456\"}'" -ForegroundColor White

Write-Host "`n================================================" -ForegroundColor Cyan
Write-Host "OR Use the UI:" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "1. Go to http://localhost:3000/signup" -ForegroundColor White
Write-Host "2. Fill form and submit" -ForegroundColor White
Write-Host "3. Go to http://localhost:3000/dashboard-dev" -ForegroundColor White
Write-Host "4. Click 'Fetch OTPs' - now should show the OTP" -ForegroundColor White
Write-Host "5. Copy OTP and paste in verify page" -ForegroundColor White

Write-Host "`n✅ Ready to test!" -ForegroundColor Green

# Objective: "Find the best Python web framework"
# → Auto-Execute: ON
# → Click: Start Reasoning
# → Result: Complete analysis in 10-30 seconds
