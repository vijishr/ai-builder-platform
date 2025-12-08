# Advanced Reasoning Agent - Testing Guide

**Version:** 1.0.0  
**Date:** December 7, 2025

## Quick Start Test

### 1. Access the Reasoning UI

1. Open browser: `http://localhost:3000/reasoning`
2. You should see:
   - Objective input textarea
   - Context parameters panel
   - Auto-execute toggle
   - Three-tab interface (Plan, Execution, Reasoning)

### 2. Test Basic Reasoning

**Objective:**
```
Find machine learning frameworks suitable for web applications
```

**Steps:**
1. Paste objective into textarea
2. Leave context empty (optional)
3. Toggle "Auto Execute" ON
4. Click "Start Reasoning"
5. Watch the plan generation → execution → results

**Expected Outcome:**
- ✅ Plan shows multiple steps (search, analyze, synthesize)
- ✅ Execution tab shows results from each step
- ✅ Reasoning tab shows full decision chain
- ✅ Final results with summary and recommendations

---

## API Testing with cURL

### Test 1: Generate Plan

```powershell
# PowerShell command
$token = "YOUR_JWT_TOKEN"
$body = @{
    objective = "Analyze Python web frameworks"
    context = @{
        useCase = "API development"
        budget = "open-source"
    }
} | ConvertTo-Json

$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

$response = Invoke-WebRequest -Uri "http://localhost:5000/api/v1/reasoning/plan" `
    -Method POST `
    -Headers $headers `
    -Body $body

$response.Content | ConvertFrom-Json | ConvertTo-Json -Depth 10
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Reasoning plan generated",
  "data": {
    "objective": "Analyze Python web frameworks",
    "steps": [ { ...step1... }, { ...step2... } ],
    "reasoning": [ { ...analysis... } ]
  }
}
```

### Test 2: Execute Plan

```powershell
$token = "YOUR_JWT_TOKEN"

# First, get a plan
$planResponse = Invoke-WebRequest -Uri "http://localhost:5000/api/v1/reasoning/plan" `
    -Method POST `
    -Headers @{ "Authorization" = "Bearer $token"; "Content-Type" = "application/json" } `
    -Body (@{ objective = "Analyze Python frameworks" } | ConvertTo-Json)

$plan = ($planResponse.Content | ConvertFrom-Json).data

# Now execute the plan
$execBody = @{
    plan = $plan
    maxSteps = 10
} | ConvertTo-Json -Depth 10

$execResponse = Invoke-WebRequest -Uri "http://localhost:5000/api/v1/reasoning/execute" `
    -Method POST `
    -Headers @{ "Authorization" = "Bearer $token"; "Content-Type" = "application/json" } `
    -Body $execBody

$execResponse.Content | ConvertFrom-Json | ConvertTo-Json -Depth 10
```

### Test 3: End-to-End Reasoning

```powershell
$token = "YOUR_JWT_TOKEN"

$body = @{
    objective = "Find the best JavaScript testing framework for React"
    context = @{
        preference = "easy-to-use"
        teamSize = "small"
    }
    autoExecute = $true
    maxSteps = 10
} | ConvertTo-Json

$response = Invoke-WebRequest -Uri "http://localhost:5000/api/v1/reasoning/reason" `
    -Method POST `
    -Headers @{ "Authorization" = "Bearer $token"; "Content-Type" = "application/json" } `
    -Body $body

$response.Content | ConvertFrom-Json | ConvertTo-Json -Depth 10
```

### Test 4: Database Search

```powershell
$token = "YOUR_JWT_TOKEN"

$body = @{
    query = "machine learning frameworks"
    filters = @{
        language = @("Python", "JavaScript")
    }
    limit = 5
    sortBy = "relevance"
} | ConvertTo-Json

$response = Invoke-WebRequest -Uri "http://localhost:5000/api/v1/reasoning/search" `
    -Method POST `
    -Headers @{ "Authorization" = "Bearer $token"; "Content-Type" = "application/json" } `
    -Body $body

$response.Content | ConvertFrom-Json | ConvertTo-Json -Depth 10
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "query": "machine learning frameworks",
    "resultCount": 3,
    "results": [
      {
        "relevanceScore": 95.5,
        "matchedTerms": ["machine", "learning", "frameworks"]
      }
    ],
    "stats": { "queriesExecuted": 1, "cacheHits": 0 }
  }
}
```

### Test 5: Advanced Search with Facets

```powershell
$token = "YOUR_JWT_TOKEN"

$body = @{
    query = "web frameworks"
    limit = 20
    facetFields = @("category", "language", "popularity")
} | ConvertTo-Json

$response = Invoke-WebRequest -Uri "http://localhost:5000/api/v1/reasoning/search/advanced" `
    -Method POST `
    -Headers @{ "Authorization" = "Bearer $token"; "Content-Type" = "application/json" } `
    -Body $body

$response.Content | ConvertFrom-Json | ConvertTo-Json -Depth 10
```

### Test 6: List Tools

```powershell
$token = "YOUR_JWT_TOKEN"

$response = Invoke-WebRequest -Uri "http://localhost:5000/api/v1/reasoning/tools" `
    -Method GET `
    -Headers @{ "Authorization" = "Bearer $token" }

$response.Content | ConvertFrom-Json | ConvertTo-Json -Depth 5
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "availableTools": ["search", "database", "analyze", "generate"],
    "toolCount": 4,
    "tools": [
      {
        "name": "search",
        "description": "Search for information..."
      }
    ]
  }
}
```

### Test 7: Execute Custom Tool

```powershell
$token = "YOUR_JWT_TOKEN"

$body = @{
    params = @{
        query = "Node.js frameworks"
        limit = 10
    }
} | ConvertTo-Json

$response = Invoke-WebRequest -Uri "http://localhost:5000/api/v1/reasoning/tool/search" `
    -Method POST `
    -Headers @{ "Authorization" = "Bearer $token"; "Content-Type" = "application/json" } `
    -Body $body

$response.Content | ConvertFrom-Json | ConvertTo-Json -Depth 10
```

---

## Automated Test Suite

Create `test-reasoning.ps1`:

```powershell
# Set variables
$baseUrl = "http://localhost:5000/api/v1/reasoning"
$testPassed = 0
$testFailed = 0

# Function to make requests
function Test-ReasoningAPI {
    param(
        [string]$endpoint,
        [string]$method = "GET",
        [hashtable]$body = $null,
        [string]$testName
    )
    
    Write-Host "Testing: $testName" -ForegroundColor Cyan
    
    try {
        $token = "YOUR_JWT_TOKEN"
        $headers = @{ "Authorization" = "Bearer $token"; "Content-Type" = "application/json" }
        
        if ($body) {
            $bodyJson = $body | ConvertTo-Json -Depth 10
            $response = Invoke-WebRequest -Uri "$baseUrl$endpoint" -Method $method -Headers $headers -Body $bodyJson
        } else {
            $response = Invoke-WebRequest -Uri "$baseUrl$endpoint" -Method $method -Headers $headers
        }
        
        $data = $response.Content | ConvertFrom-Json
        
        if ($data.success) {
            Write-Host "✅ PASSED" -ForegroundColor Green
            $global:testPassed++
        } else {
            Write-Host "❌ FAILED: $($data.message)" -ForegroundColor Red
            $global:testFailed++
        }
    } catch {
        Write-Host "❌ FAILED: $_" -ForegroundColor Red
        $global:testFailed++
    }
    
    Write-Host ""
}

# Run tests
Write-Host "========================================" -ForegroundColor Yellow
Write-Host "Advanced Reasoning API Tests" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Yellow
Write-Host ""

# Test 1: List tools
Test-ReasoningAPI -endpoint "/tools" -method "GET" -testName "List Available Tools"

# Test 2: Generate plan
Test-ReasoningAPI -endpoint "/plan" -method "POST" `
    -body @{ objective = "Test objective"; context = @{} } `
    -testName "Generate Reasoning Plan"

# Test 3: Database search
Test-ReasoningAPI -endpoint "/search" -method "POST" `
    -body @{ query = "test"; limit = 5; sortBy = "relevance" } `
    -testName "Database Search"

# Test 4: Advanced search
Test-ReasoningAPI -endpoint "/search/advanced" -method "POST" `
    -body @{ query = "test"; facetFields = @("category") } `
    -testName "Advanced Search with Facets"

# Summary
Write-Host "========================================" -ForegroundColor Yellow
Write-Host "Test Summary" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Yellow
Write-Host "Passed: $testPassed" -ForegroundColor Green
Write-Host "Failed: $testFailed" -ForegroundColor Red
Write-Host ""
```

Run tests:
```powershell
powershell -ExecutionPolicy Bypass -File test-reasoning.ps1
```

---

## Frontend Integration Tests

Create `test-reasoning-frontend.js`:

```javascript
// Test file for frontend reasoning integration
// Add to frontend/src/pages/tests/reasoning.test.js

import api from '@/services/api'

describe('Advanced Reasoning Agent', () => {
  
  it('should generate a reasoning plan', async () => {
    const response = await api.post('/reasoning/plan', {
      objective: 'Test objective for reasoning'
    })
    
    expect(response.data.success).toBe(true)
    expect(response.data.data).toHaveProperty('steps')
    expect(response.data.data.steps.length).toBeGreaterThan(0)
  })

  it('should execute a reasoning plan', async () => {
    // First get a plan
    const planRes = await api.post('/reasoning/plan', {
      objective: 'Test execution'
    })
    
    const plan = planRes.data.data
    
    // Execute it
    const execRes = await api.post('/reasoning/execute', {
      plan,
      maxSteps: 5
    })
    
    expect(execRes.data.success).toBe(true)
    expect(execRes.data.data).toHaveProperty('executedSteps')
  })

  it('should perform end-to-end reasoning', async () => {
    const response = await api.post('/reasoning/reason', {
      objective: 'Test end-to-end reasoning',
      autoExecute: true
    })
    
    expect(response.data.success).toBe(true)
    expect(response.data.data).toHaveProperty('plan')
    expect(response.data.data).toHaveProperty('execution')
  })

  it('should search database', async () => {
    const response = await api.post('/reasoning/search', {
      query: 'test query',
      limit: 5
    })
    
    expect(response.data.success).toBe(true)
    expect(response.data.data).toHaveProperty('results')
  })

  it('should list available tools', async () => {
    const response = await api.get('/reasoning/tools')
    
    expect(response.data.success).toBe(true)
    expect(response.data.data.availableTools.length).toBeGreaterThan(0)
  })
})
```

---

## Performance Testing

### Load Test Script

```powershell
# test-reasoning-load.ps1
# Test reasoning API under load

param(
    [int]$iterations = 10,
    [string]$objective = "Test load performance"
)

$token = "YOUR_JWT_TOKEN"
$url = "http://localhost:5000/api/v1/reasoning/reason"
$times = @()

Write-Host "Starting load test with $iterations iterations..." -ForegroundColor Cyan
Write-Host ""

for ($i = 1; $i -le $iterations; $i++) {
    $stopwatch = [System.Diagnostics.Stopwatch]::StartNew()
    
    try {
        $body = @{
            objective = "$objective #$i"
            autoExecute = $false
            maxSteps = 3
        } | ConvertTo-Json
        
        $response = Invoke-WebRequest -Uri $url `
            -Method POST `
            -Headers @{ "Authorization" = "Bearer $token"; "Content-Type" = "application/json" } `
            -Body $body
        
        $stopwatch.Stop()
        $times += $stopwatch.ElapsedMilliseconds
        
        Write-Host "[$i/$iterations] Time: $($stopwatch.ElapsedMilliseconds)ms" -ForegroundColor Green
    } catch {
        Write-Host "[$i/$iterations] FAILED: $_" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "========== Performance Results ==========" -ForegroundColor Yellow
Write-Host "Total requests: $iterations"
Write-Host "Average time: $([math]::Round($times | Measure-Object -Average | Select-Object -ExpandProperty Average))ms"
Write-Host "Min time: $($times | Measure-Object -Minimum | Select-Object -ExpandProperty Minimum)ms"
Write-Host "Max time: $($times | Measure-Object -Maximum | Select-Object -ExpandProperty Maximum)ms"
Write-Host "Total time: $($times | Measure-Object -Sum | Select-Object -ExpandProperty Sum)ms"
```

Run:
```powershell
powershell -ExecutionPolicy Bypass -File test-reasoning-load.ps1 -iterations 20
```

---

## Checklist: What to Test

### Functionality
- [ ] Plan generation for various objectives
- [ ] Plan execution with multiple steps
- [ ] End-to-end reasoning workflow
- [ ] Database search with filters
- [ ] Advanced search with facets
- [ ] Tool listing and execution
- [ ] Error handling for invalid inputs
- [ ] Authentication and authorization

### Performance
- [ ] Response time < 1 second for plan generation
- [ ] Search results returned < 500ms
- [ ] Concurrent requests handled properly
- [ ] Memory usage remains stable
- [ ] Cache improves repeated queries

### UI/UX
- [ ] Objective input accepts 5+ word objectives
- [ ] Context parameters add/remove correctly
- [ ] Auto-execute toggle works
- [ ] Plan tab displays all steps
- [ ] Execution tab shows results
- [ ] Reasoning tab shows full chain
- [ ] Loading states display properly
- [ ] Error messages are clear

### Edge Cases
- [ ] Empty objective rejected
- [ ] Very long objective handled
- [ ] Special characters in query work
- [ ] Missing context doesn't break flow
- [ ] Invalid token rejected with 401
- [ ] Non-existent tool returns proper error

---

## Debugging

### Enable Detailed Logging

Edit `backend/src/routes/reasoning.js`:

```javascript
// Add before route handlers
app.use((req, res, next) => {
  console.log(`[REASONING] ${req.method} ${req.path}`)
  console.log('[REASONING] Body:', req.body)
  next()
})
```

### Check Engine State

In `backend/src/services/reasoningEngine.js`:

```javascript
// Log reasoning chain
console.log('=== REASONING CHAIN ===')
console.log(JSON.stringify(reasoningChain, null, 2))

// Log plan
console.log('=== EXECUTION PLAN ===')
console.log(JSON.stringify(plan, null, 2))

// Log results
console.log('=== FINAL RESULTS ===')
console.log(JSON.stringify(results, null, 2))
```

### Monitor Database Search

In `backend/src/services/databaseSearchTool.js`:

```javascript
// Log search execution
console.log(`[SEARCH] Query: "${query}"`)
console.log(`[SEARCH] Filters:`, filters)
console.log(`[SEARCH] Results found: ${results.length}`)
console.log(`[SEARCH] Cache stats:`, this.getStats())
```

---

## Common Issues & Solutions

| Issue | Symptom | Solution |
|-------|---------|----------|
| No results in search | Empty results array | Broaden query, check filters |
| Plan not generating | Empty plan object | Objective must be 5+ words |
| Slow execution | Response > 2s | Enable caching, reduce maxSteps |
| 401 Unauthorized | Auth error | Verify JWT token in headers |
| Tool not found | Error message | Register tool in ToolRegistry |
| Memory leak | Increasing RAM | Clear cache periodically |
| Duplicate results | Repeated items | Check for data duplication |

---

## Success Criteria

✅ **All tests passing if:**
- [ ] All 7 API endpoints respond with 200 status
- [ ] Plan generation < 500ms
- [ ] Search results < 300ms
- [ ] Execution completes within maxSteps
- [ ] No error messages (except for intentional error tests)
- [ ] Frontend UI loads without JavaScript errors
- [ ] All buttons and inputs respond correctly
- [ ] Reasoning chain is complete and logical

---

**Test Version:** 1.0.0  
**Last Updated:** December 7, 2025
