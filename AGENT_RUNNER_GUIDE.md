# AI Agent Runner Guide

## Overview

The AI Agent Runner is an automated system that allows your agents to execute end-to-end workflows: generate code/content, validate the output, simulate test runs, and provide detailed execution logs in real-time.

## Architecture

### Components

1. **Agent Runner Service** (`backend/src/services/agentRunner.js`)
   - Orchestrates agent execution
   - Persists generated artifacts to disk
   - Runs simulated tests on generated code
   - Streams live logs via Server-Sent Events (SSE)

2. **Agent Routes** (`backend/src/routes/ai.js`)
   - Protected by JWT auth (`auth.verifyToken`)
   - RESTful API for triggering, monitoring, and fetching runs
   - SSE endpoint for real-time log streaming

3. **Frontend UI** (`frontend/src/pages/agents.js`)
   - "Auto Run" button on each agent card
   - Live log viewer with color-coded status indicators
   - Download and result inspection features

## API Reference

### Start an Agent Run

**Endpoint:** `POST /api/v1/ai/agents/:id/auto-run`

**Authentication:** Required (Bearer JWT)

**Request Body:**
```json
{
  "prompt": "Your prompt for the agent",
  "options": { "key": "value" }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Agent run started",
  "data": {
    "id": "1733548234567",
    "agentId": "my-agent",
    "status": "completed",
    "logs": [
      "[2025-12-07T10:30:34.567Z] Starting agent run...",
      "[2025-12-07T10:30:35.123Z] Generating code...",
      "[2025-12-07T10:30:36.456Z] Generated files written",
      "[2025-12-07T10:30:37.789Z] Tests PASSED - All basic checks passed"
    ],
    "testResult": {
      "passed": true,
      "summary": "All basic checks passed",
      "details": { "hasHtml": true, "hasJs": true }
    }
  }
}
```

### List Agent Runs

**Endpoint:** `GET /api/v1/ai/agents/:id/runs`

**Authentication:** Required (Bearer JWT)

**Response:**
```json
{
  "success": true,
  "data": {
    "agentId": "my-agent",
    "runs": ["1733548234567", "1733548100000"]
  }
}
```

### Get Run Details

**Endpoint:** `GET /api/v1/ai/agents/:id/runs/:runId`

**Authentication:** Required (Bearer JWT)

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "1733548234567",
    "agentId": "my-agent",
    "startedAt": "2025-12-07T10:30:34.567Z",
    "finishedAt": "2025-12-07T10:30:38.000Z",
    "status": "completed",
    "logs": [...],
    "testResult": {...},
    "outputDir": "backend/data/agent_runs/my-agent/1733548234567"
  }
}
```

### Stream Live Logs (SSE)

**Endpoint:** `GET /api/v1/ai/agents/:id/runs/:runId/stream`

**Authentication:** Required (Bearer JWT)

**Protocol:** Server-Sent Events (SSE)

**Events:**
```javascript
// Log batch event
{ "type": "logs", "data": ["log1", "log2", "log3"] }

// Status update event
{ "type": "status", "data": "completed" }

// Final event with full run data
{ "type": "end", "data": { ...run object... } }

// Error event
{ "type": "error", "data": "Error message" }
```

**JavaScript Example:**
```javascript
const token = localStorage.getItem('accessToken');
const agentId = 'my-agent';
const runId = '1733548234567';

const eventSource = new EventSource(
  `/api/v1/ai/agents/${agentId}/runs/${runId}/stream`
);

eventSource.onmessage = (event) => {
  const message = JSON.parse(event.data);
  
  if (message.type === 'logs') {
    console.log('New logs:', message.data);
  } else if (message.type === 'end') {
    console.log('Run completed:', message.data);
    eventSource.close();
  }
};

eventSource.onerror = (error) => {
  console.error('Stream error:', error);
  eventSource.close();
};
```

## Usage Examples

### PowerShell Example

```powershell
# Get access token (from login response)
$token = "your_jwt_token_here"

# Start a run
$body = @{
    prompt = "Build a landing page for an eco-friendly sneaker company"
    options = @{
        style = "modern"
        colorTheme = "green"
    }
} | ConvertTo-Json

$response = Invoke-RestMethod `
  -Method Post `
  -Uri "http://localhost:5000/api/v1/ai/agents/code-gen/auto-run" `
  -Headers @{ Authorization = "Bearer $token" } `
  -Body $body `
  -ContentType 'application/json'

$runId = $response.data.id
Write-Host "Run started: $runId"

# Get run details
$details = Invoke-RestMethod `
  -Method Get `
  -Uri "http://localhost:5000/api/v1/ai/agents/code-gen/runs/$runId" `
  -Headers @{ Authorization = "Bearer $token" }

Write-Host "Status: $($details.data.status)"
Write-Host "Logs: $($details.data.logs)"
```

### JavaScript/Node.js Example

```javascript
const api = axios.create({
  baseURL: 'http://localhost:5000/api/v1',
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
  }
});

// Start a run
async function startRun(agentId, prompt) {
  const response = await api.post(`/ai/agents/${agentId}/auto-run`, { prompt });
  return response.data.data;
}

// Listen to live logs
function streamLogs(agentId, runId) {
  return new Promise((resolve, reject) => {
    const eventSource = new EventSource(
      `/api/v1/ai/agents/${agentId}/runs/${runId}/stream`
    );

    const logs = [];

    eventSource.onmessage = (event) => {
      const message = JSON.parse(event.data);
      
      if (message.type === 'logs') {
        logs.push(...message.data);
        console.log('📝 Logs:', message.data);
      } else if (message.type === 'end') {
        eventSource.close();
        resolve({ ...message.data, logs });
      }
    };

    eventSource.onerror = (error) => {
      eventSource.close();
      reject(error);
    };
  });
}

// Example usage
(async () => {
  const run = await startRun('my-agent', 'Generate a React component');
  console.log('✅ Run started:', run.id);
  
  const result = await streamLogs('my-agent', run.id);
  console.log('✨ Run completed!');
  console.log('Status:', result.status);
  console.log('Test Results:', result.testResult);
})();
```

## Artifact Storage

Generated artifacts are stored in: `backend/data/agent_runs/{agentId}/{runId}/`

Contents:
- `generated.html` - Generated HTML markup
- `generated.css` - Generated CSS styles
- `generated.js` - Generated JavaScript code
- `{runId}.json` - Run metadata and logs

Example structure:
```
backend/data/agent_runs/
├── code-gen/
│   ├── 1733548234567/
│   │   ├── generated.html
│   │   ├── generated.css
│   │   └── generated.js
│   └── 1733548234567.json
└── content-gen/
    └── 1733548100000/
        ├── generated.html
        └── 1733548100000.json
```

## Run Status Flow

```
starting → in-progress → completed
                      ↘ failed
                      ↘ error
```

- **starting**: Run initialized, about to generate
- **in-progress**: Currently running (not actively used in current implementation)
- **completed**: Run finished successfully, tests passed
- **failed**: Run finished, tests failed
- **error**: Unexpected error during execution

## UI Features

### Agent Card
- **Auto Run Button**: Starts a new run, shows spinner while running
- **Configure Button**: Placeholder for agent settings (coming soon)
- **Delete Button**: Remove an agent with confirmation

### Run Details Panel
- **Live Logs**: Real-time log stream with syntax highlighting (monospace font)
- **Status Badge**: Color-coded status indicator
  - 🟢 Green (completed)
  - 🔴 Red (failed/error)
  - 🔵 Blue (starting/in-progress)
  - 🟡 Yellow (fallback status)
- **Test Results**: Summary of simulated test execution
- **Download Button**: Export generated artifacts (feature)

## Security

All endpoints require JWT authentication via `Authorization: Bearer <token>` header.

- The `auth.verifyToken` middleware validates tokens before allowing access
- Tokens are obtained through the login flow and stored in `localStorage.accessToken`
- Invalid or expired tokens receive a 401 Unauthorized response

## Limitations & Future Enhancements

### Current Limitations
1. **Simulated Tests Only**: Generated code is validated structurally, not executed on the host
2. **No Real Code Execution**: For safety, no untrusted code runs on the server
3. **Single Agent Runs**: Runs are sequential per agent (no queueing yet)

### Planned Enhancements
1. **Docker-Based Executor**: Safe containerized execution for generated code
2. **Job Queue**: Support multiple concurrent runs with a queue system
3. **Webhook Notifications**: POST to external URLs when runs complete
4. **Run History Dashboard**: View and manage past runs with filtering
5. **Custom Test Suites**: Allow agents to define and execute custom test logic
6. **Artifact Versioning**: Keep multiple versions of generated files
7. **Performance Metrics**: Track run times, success rates, and logs per agent

## Troubleshooting

### Run Stuck on "Starting"
- Check backend logs: `tail -f backend/backend.log` (if enabled)
- Verify database connectivity (MongoDB or file DB fallback)
- Restart the backend: `node backend/src/server.js`

### SSE Connection Fails, Falls Back to Polling
- Check browser console for CORS errors
- Verify `Access-Control-Allow-Origin` header is set correctly
- Polling still works as a fallback (updates every 2 seconds)

### Logs Not Appearing in UI
- Open browser DevTools → Network tab
- Check if SSE stream is initiated (GET `.../stream`)
- Verify JWT token is valid and not expired
- Check `backend/src/server.js` logs for stream errors

### Generated Files Not Found
- Check `backend/data/agent_runs/` directory permissions
- Verify disk space is available
- Ensure Node.js process has write permissions

## Configuration

### Environment Variables (optional)

Add to `backend/.env`:

```env
# Agent runner timeout (ms)
AGENT_RUN_TIMEOUT=120000

# Max concurrent runs per agent
MAX_CONCURRENT_RUNS=5

# Artifact retention (days)
ARTIFACT_RETENTION_DAYS=30
```

### Modify Log Rotation

Edit `backend/src/services/agentRunner.js`:

```javascript
// Change log polling interval (ms)
const streamInterval = setInterval(async () => { ... }, 500)  // Default: 500ms
```

## Support

For issues or feature requests, refer to:
- Conversation logs in `COMPLETION_SUMMARY.md`
- API reference above
- GitHub issues (if applicable)

---

**Last Updated:** December 7, 2025  
**Version:** 1.0.0
