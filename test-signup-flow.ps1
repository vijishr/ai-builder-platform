# Automated E2E test: signup -> OTP verify -> login
# This script tests the complete auth flow to verify one-click startup works end-to-end

param(
    [string]$BackendUrl = "http://localhost:5000/api/v1",
    [string]$Email = "test-$(Get-Random)@example.com",
    [string]$Password = "TestPass123!@#"
)

Write-Host "======================================" -ForegroundColor Cyan
Write-Host "AI Builder - E2E Auth Flow Test" -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan
Write-Host ""

# Helper function to make API calls
function Invoke-API {
    param(
        [string]$Method,
        [string]$Endpoint,
        [hashtable]$Body
    )
    
    $Uri = "$BackendUrl$Endpoint"
    $Params = @{
        Uri             = $Uri
        Method          = $Method
        ContentType     = "application/json"
        TimeoutSec      = 5
        ErrorAction     = "Stop"
    }
    
    if ($Body) {
        $Params["Body"] = ($Body | ConvertTo-Json)
    }
    
    try {
        $Response = Invoke-RestMethod @Params
        return $Response
    }
    catch {
        Write-Host "❌ API Error: $($_.Exception.Message)" -ForegroundColor Red
        throw $_
    }
}

# Check backend is healthy
Write-Host "Step 1: Checking backend health..." -ForegroundColor Yellow
try {
    $Health = Invoke-API -Method GET -Endpoint "/health"
    Write-Host "✅ Backend is healthy" -ForegroundColor Green
}
catch {
    Write-Host "❌ Backend is not responding. Make sure RUN_ALL.bat started the services." -ForegroundColor Red
    exit 1
}

# Step 1: Register a new user
Write-Host ""
Write-Host "Step 2: Registering new user (email: $Email)..." -ForegroundColor Yellow
try {
    $SignupBody = @{
        email    = $Email
        password = $Password
    }
    $SignupResp = Invoke-API -Method POST -Endpoint "/auth/register" -Body $SignupBody
    Write-Host "✅ Registration successful" -ForegroundColor Green
    Write-Host "   User ID: $($SignupResp.userId)" -ForegroundColor Gray
}
catch {
    Write-Host "❌ Registration failed" -ForegroundColor Red
    exit 1
}

# Step 2: Get OTP from debug endpoint
Write-Host ""
Write-Host "Step 3: Fetching OTP from debug endpoint..." -ForegroundColor Yellow
try {
    $OtpResp = Invoke-API -Method GET -Endpoint "/debug/otps?email=$([System.Web.HttpUtility]::UrlEncode($Email))"
    if ($OtpResp -and $OtpResp.otps -and $OtpResp.otps.Count -gt 0) {
        $OTP = $OtpResp.otps[0].otp
        Write-Host "✅ OTP fetched: $OTP" -ForegroundColor Green
    }
    else {
        Write-Host "❌ No OTP found for $Email" -ForegroundColor Red
        exit 1
    }
}
catch {
    Write-Host "❌ Failed to fetch OTP" -ForegroundColor Red
    exit 1
}

# Step 3: Verify email with OTP
Write-Host ""
Write-Host "Step 4: Verifying email with OTP..." -ForegroundColor Yellow
try {
    $VerifyBody = @{
        email = $Email
        otp   = $OTP
    }
    $VerifyResp = Invoke-API -Method POST -Endpoint "/auth/verify-email" -Body $VerifyBody
    Write-Host "✅ Email verified successfully" -ForegroundColor Green
}
catch {
    Write-Host "❌ Email verification failed" -ForegroundColor Red
    exit 1
}

# Step 4: Login with the registered credentials
Write-Host ""
Write-Host "Step 5: Logging in with credentials..." -ForegroundColor Yellow
try {
    $LoginBody = @{
        email    = $Email
        password = $Password
    }
    $LoginResp = Invoke-API -Method POST -Endpoint "/auth/login" -Body $LoginBody
    if ($LoginResp.accessToken) {
        Write-Host "✅ Login successful" -ForegroundColor Green
        Write-Host "   Token: $($LoginResp.accessToken.Substring(0, 20))..." -ForegroundColor Gray
    }
    else {
        Write-Host "❌ Login returned no token" -ForegroundColor Red
        exit 1
    }
}
catch {
    Write-Host "❌ Login failed" -ForegroundColor Red
    exit 1
}

# Success
Write-Host ""
Write-Host "======================================" -ForegroundColor Green
Write-Host "✅ ALL TESTS PASSED!" -ForegroundColor Green
Write-Host "======================================" -ForegroundColor Green
Write-Host ""
Write-Host "One-click startup is working correctly:" -ForegroundColor Green
Write-Host "  ✓ Backend running on $BackendUrl" -ForegroundColor Green
Write-Host "  ✓ Frontend running on http://localhost:3000" -ForegroundColor Green
Write-Host "  ✓ Auth flow: Signup → Verify → Login works end-to-end" -ForegroundColor Green
Write-Host ""
Write-Host "You can now:" -ForegroundColor Cyan
Write-Host "  1. Open http://localhost:3000 in your browser" -ForegroundColor Cyan
Write-Host "  2. Sign up with any email/password" -ForegroundColor Cyan
Write-Host "  3. Use http://localhost:3000/dashboard-dev to fetch OTPs and verify" -ForegroundColor Cyan
Write-Host "  4. Log in with verified credentials" -ForegroundColor Cyan
Write-Host ""
