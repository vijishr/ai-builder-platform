# Advanced Reasoning Agent - Quick Reference

**Cheat Sheet for Developers**

---

## Quick Start (60 seconds)

### 1. Open UI
```
http://localhost:3000/reasoning
```

### 2. Enter Objective
```
Analyze Python web frameworks for my startup
```

### 3. Click "Start Reasoning"
Results in 10-30 seconds ⚡

---

## API Endpoints Cheat Sheet

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/reasoning/plan` | POST | Generate step-by-step plan |
| `/reasoning/execute` | POST | Run plan steps |
| `/reasoning/reason` | POST | Plan + execute (all-in-one) |
| `/reasoning/search` | POST | Database search with filters |
| `/reasoning/search/advanced` | POST | Search with facets/aggregations |
| `/reasoning/tools` | GET | List available tools |
| `/reasoning/tool/:name` | POST | Execute specific tool |
| `/reasoning/stats` | GET | Performance statistics |

---

## Quick Code Examples

### Generate Plan Only
```javascript
const res = await api.post('/reasoning/plan', {
  objective: 'Your question here'
})
```

### Full End-to-End
```javascript
const res = await api.post('/reasoning/reason', {
  objective: 'Your question here',
  autoExecute: true
})
```

### With Context & Options
```javascript
const res = await api.post('/reasoning/reason', {
  objective: 'Your question here',
  context: { key: 'value' },
  autoExecute: true,
  maxSteps: 10
})
```

### Search with Filters
```javascript
const res = await api.post('/reasoning/search', {
  query: 'your search',
  filters: { category: 'AI', language: 'Python' },
  limit: 10
})
```

### Advanced Search (with Categories)
```javascript
const res = await api.post('/reasoning/search/advanced', {
  query: 'machine learning',
  facetFields: ['category', 'language', 'popularity']
})
```

---

## Request Structure

### Minimal Request
```json
{
  "objective": "Your question (5+ words required)"
}
```

### Full Request
```json
{
  "objective": "Find best Python frameworks",
  "context": {
    "useCase": "web API",
    "teamSize": "small",
    "budget": "open-source"
  },
  "autoExecute": true,
  "maxSteps": 10
}
```

### Search Request
```json
{
  "query": "search terms",
  "filters": {
    "category": ["AI", "ML"],
    "score": { "min": 50, "max": 100 }
  },
  "limit": 10,
  "sortBy": "relevance"
}
```

---

## Response Structure

### Plan Response
```json
{
  "success": true,
  "data": {
    "objective": "...",
    "steps": [ { number, type, action } ],
    "reasoning": [ { step, type, content } ]
  }
}
```

### Execution Response
```json
{
  "success": true,
  "data": {
    "planId": "...",
    "executedSteps": [ { stepNumber, action, result, status } ],
    "finalResult": { summary, keyInsights, recommendedAction }
  }
}
```

### Search Response
```json
{
  "success": true,
  "data": {
    "query": "...",
    "resultCount": 5,
    "results": [ { id, title, relevanceScore, matchedTerms } ],
    "stats": { queriesExecuted, cacheHits, averageTime }
  }
}
```

---

## Available Tools

```
✅ search       - Query information
✅ database     - Structured queries
✅ analyze      - Pattern detection
✅ generate     - Content generation
```

Get list:
```javascript
const res = await api.get('/reasoning/tools')
console.log(res.data.data.availableTools)
```

Execute specific tool:
```javascript
const res = await api.post('/reasoning/tool/search', {
  params: { query: 'AI frameworks', limit: 5 }
})
```

---

## Common Patterns

### Pattern 1: Quick Answer
```javascript
const res = await api.post('/reasoning/reason', {
  objective: 'What is the best database for real-time apps?',
  maxSteps: 5
})
console.log(res.data.data.execution.finalResult.summary)
```

### Pattern 2: Detailed Analysis
```javascript
const res = await api.post('/reasoning/reason', {
  objective: 'Compare machine learning frameworks',
  context: { languages: ['Python', 'JavaScript'], purpose: 'web' },
  maxSteps: 15
})
// Access: plan, execution, reasoningChain
```

### Pattern 3: Plan Review Before Execute
```javascript
// Step 1: Get plan
const plan = await api.post('/reasoning/plan', { objective: '...' })

// Step 2: Show user, get approval
console.log('Plan steps:', plan.data.data.steps)

// Step 3: Execute
const result = await api.post('/reasoning/execute', {
  plan: plan.data.data,
  maxSteps: 10
})
```

### Pattern 4: Faceted Search
```javascript
const res = await api.post('/reasoning/search/advanced', {
  query: 'web frameworks',
  facetFields: ['language', 'category']
})
// Use facets for UI filters
const filters = res.data.data.facets
```

---

## Status Codes & Errors

| Code | Meaning | Action |
|------|---------|--------|
| 200 | Success | Process result |
| 400 | Bad request | Check objective (5+ words) |
| 401 | Unauthorized | Verify JWT token |
| 404 | Not found | Check endpoint URL |
| 500 | Server error | Check backend logs |

Common errors:
```json
{ "error": "Objective must be at least 5 words" }
{ "error": "Authentication required" }
{ "error": "Tool not found: toolname" }
```

---

## Performance Targets

| Operation | Target Time | Notes |
|-----------|------------|-------|
| Plan generation | < 500ms | Fast analysis |
| Search | < 300ms | Query cache |
| Execution | 1-3s | Depends on steps |
| Full reason | 5-15s | With execution |

---

## Tips & Tricks

### ✅ Do This
- Use specific, detailed objectives
- Provide relevant context
- Use filters for targeted search
- Cache plan for reuse

### ❌ Don't Do This
- Very vague objectives ("tell me about AI")
- Missing context for complex tasks
- Searching with no filters (gets all results)
- Single-word or 2-word objectives

### 🚀 Pro Tips
- Keep objectives under 20 words
- Use faceted search to understand data
- Reuse plans for similar objectives
- Monitor stats for performance insights

---

## Request Templates (Copy-Paste)

### PowerShell
```powershell
$token = "YOUR_JWT"
$body = @{
    objective = "Your objective here"
} | ConvertTo-Json

$response = Invoke-WebRequest -Uri "http://localhost:5000/api/v1/reasoning/reason" `
    -Method POST `
    -Headers @{ "Authorization" = "Bearer $token"; "Content-Type" = "application/json" } `
    -Body $body

$response.Content | ConvertFrom-Json | ConvertTo-Json -Depth 10
```

### JavaScript
```javascript
const response = await api.post('/reasoning/reason', {
  objective: 'Your objective here'
})
console.log(response.data.data)
```

### cURL
```bash
curl -X POST "http://localhost:5000/api/v1/reasoning/reason" \
  -H "Authorization: Bearer YOUR_JWT" \
  -H "Content-Type: application/json" \
  -d '{"objective": "Your objective here"}'
```

---

## Debug Checklist

- [ ] JWT token valid? (401 = invalid)
- [ ] Objective 5+ words? (400 = too short)
- [ ] Backend running? (port 5000)
- [ ] Frontend running? (port 3000)
- [ ] Network accessible? (check firewall)
- [ ] Request headers correct? (Content-Type, Authorization)
- [ ] JSON valid? (use JSON validator)

Check backend logs:
```powershell
# In backend terminal window
# Look for errors or check logs file
```

Check frontend console:
```javascript
// Open DevTools (F12) → Console tab
// Look for network errors or JS errors
```

---

## Environment Setup

### .env File
```env
# Backend
PORT=5000
MONGODB_URI=your_mongodb_url

# Reasoning Engine
REASONING_MAX_STEPS=10
REASONING_TIMEOUT=30000
```

### Start Services
```bash
# Terminal 1: Backend
npm run dev

# Terminal 2: Frontend
npm run dev
```

Or use auto-start:
```powershell
.\AUTO-START.bat
```

---

## Useful Commands

### Get All Tools
```javascript
const res = await api.get('/reasoning/tools')
```

### Get Statistics
```javascript
const res = await api.get('/reasoning/stats')
```

### Execute Custom Tool
```javascript
const res = await api.post('/reasoning/tool/database', {
  params: { query: 'find users' }
})
```

### Search With All Filters
```javascript
const res = await api.post('/reasoning/search', {
  query: 'test',
  filters: {
    category: ['AI', 'ML'],
    score: { min: 70, max: 100 },
    language: 'Python'
  },
  limit: 20,
  sortBy: 'relevance'
})
```

---

## Frontend Components

### Use in React
```javascript
import api from '@/services/api'

export default function MyComponent() {
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleReason = async (objective) => {
    setLoading(true)
    try {
      const res = await api.post('/reasoning/reason', {
        objective,
        autoExecute: true
      })
      setResult(res.data.data)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <button onClick={() => handleReason('Your objective')}>
        {loading ? 'Reasoning...' : 'Start'}
      </button>
      {result && <pre>{JSON.stringify(result, null, 2)}</pre>}
    </div>
  )
}
```

---

## Response Field Guide

| Field | Content | Type |
|-------|---------|------|
| `success` | Operation succeeded | boolean |
| `message` | Status message | string |
| `data` | Response payload | object |
| `steps` | Execution steps | array |
| `reasoning` | Decision chain | array |
| `results` | Search results | array |
| `stats` | Performance metrics | object |
| `error` | Error message | string |

---

## Timeout & Limits

- **Max objective length:** No limit
- **Max context size:** Large objects OK
- **Max results:** 1000 per query
- **Max steps:** 50 (default 10)
- **Timeout per step:** 30 seconds
- **Total timeout:** 5 minutes

---

## Support URLs

- **API Base:** `http://localhost:5000/api/v1/reasoning`
- **Frontend:** `http://localhost:3000/reasoning`
- **Dashboard:** `http://localhost:3000/dashboard`
- **Agents:** `http://localhost:3000/agents`

---

## File Locations

- **Routes:** `backend/src/routes/reasoning.js`
- **Engine:** `backend/src/services/reasoningEngine.js`
- **Database Tool:** `backend/src/services/databaseSearchTool.js`
- **Frontend:** `frontend/src/pages/reasoning.js`
- **API Client:** `frontend/src/services/api.js`

---

**Last Updated:** December 7, 2025  
**Version:** 1.0.0  
**Keep this handy!** 📌
