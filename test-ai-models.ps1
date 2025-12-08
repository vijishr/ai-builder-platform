# Test Multi-Model AI Integration
# PowerShell Version for Windows

$API_URL = "http://localhost:5000/api/v1"
$TOKEN = "your-jwt-token-here"  # Replace with real token

Write-Host "🧪 Testing Multi-Model AI Integration" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

# Function to make API calls
function Test-Endpoint {
    param(
        [string]$Name,
        [string]$Method = "GET",
        [string]$Endpoint,
        [object]$Body
    )
    
    Write-Host "✓ $Name" -ForegroundColor Green
    
    try {
        $params = @{
            Uri = "$API_URL$Endpoint"
            Method = $Method
            Headers = @{
                "Authorization" = "Bearer $TOKEN"
                "Content-Type" = "application/json"
            }
        }
        
        if ($Body) {
            $params["Body"] = $Body | ConvertTo-Json -Depth 10
        }
        
        $response = Invoke-RestMethod @params
        $response | ConvertTo-Json | Write-Host
    }
    catch {
        Write-Host "FAILED: $($_.Exception.Message)" -ForegroundColor Red
    }
    
    Write-Host ""
}

# Test 1: Health Check
Write-Host "Test 1: Health Check" -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$API_URL/health"
    $response | ConvertTo-Json | Write-Host
}
catch {
    Write-Host "FAILED: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test 2: Get Available Models
Test-Endpoint `
    -Name "Test 2: Get Available Models" `
    -Endpoint "/ai-models/models"

# Test 3: Generate with Model
Test-Endpoint `
    -Name "Test 3: Generate with Claude" `
    -Method "POST" `
    -Endpoint "/ai-models/generate" `
    -Body @{
        prompt = "What is machine learning in 2 sentences?"
        model = "claude"
    }

# Test 4: Generate Code
Test-Endpoint `
    -Name "Test 4: Generate Code" `
    -Method "POST" `
    -Endpoint "/ai-models/generate-code" `
    -Body @{
        requirements = "Create a function that validates email addresses"
        language = "javascript"
        model = "claude"
    }

# Test 5: Compare Models
Test-Endpoint `
    -Name "Test 5: Compare Models" `
    -Method "POST" `
    -Endpoint "/ai-models/compare-models" `
    -Body @{
        prompt = "Explain blockchain technology"
        models = @("claude", "openai", "gemini")
    }

# Test 6: Get Consensus
Test-Endpoint `
    -Name "Test 6: Get Consensus" `
    -Method "POST" `
    -Endpoint "/ai-models/consensus" `
    -Body @{
        prompt = "Best practices for database indexing"
    }

# Test 7: Multi-turn Chat
Test-Endpoint `
    -Name "Test 7: Multi-turn Chat" `
    -Method "POST" `
    -Endpoint "/ai-models/chat" `
    -Body @{
        message = "What is React?"
        model = "claude"
    }

# Test 8: Get Agent Status
Test-Endpoint `
    -Name "Test 8: Get Agent Status" `
    -Endpoint "/ai-models/status"

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "✅ All tests completed!" -ForegroundColor Green
Write-Host ""
Write-Host "Notes:" -ForegroundColor Yellow
Write-Host "- Replace 'your-jwt-token-here' with a real JWT token" -ForegroundColor Gray
Write-Host "- Tests require API keys to be configured in .env" -ForegroundColor Gray
Write-Host "- Some tests may fail if models are not configured" -ForegroundColor Gray
Write-Host ""
Write-Host "For more info, see AI_MODELS_GUIDE.md" -ForegroundColor Cyan
