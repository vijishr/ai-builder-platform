# Docker-Based Code Executor

## Overview

The Container Executor provides a secure, isolated environment for executing AI-generated code. Instead of running untrusted code directly on the host, it runs inside lightweight Docker containers with strict resource limits.

## Features

- ✅ **Sandboxed Execution**: Code runs in isolated containers with no host access
- ✅ **Resource Limits**: Memory capped at 256MB, CPU at 50% (configurable)
- ✅ **Timeout Protection**: 30-second execution limit prevents infinite loops
- ✅ **Security Validation**: Syntax, structure, and security checks before execution
- ✅ **Non-Root User**: Container runs as unprivileged user (nodejs:nodejs)
- ✅ **Signal Handling**: Proper cleanup with dumb-init

## Architecture

```
┌─────────────────────────────────────────────────────┐
│  Frontend: Request Auto Run                         │
└────────────────────┬────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────┐
│  Backend: Agent Runner Service                      │
│  ├─ Generate code                                   │
│  ├─ Validate syntax/security                        │
│  └─ Queue execution                                 │
└────────────────────┬────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────┐
│  Container Executor Service                         │
│  ├─ Spin up Docker container                        │
│  ├─ Mount artifact volume (read-only)               │
│  ├─ Execute test suite                              │
│  └─ Capture output & exit code                      │
└────────────────────┬────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────┐
│  Docker Container (Ephemeral)                       │
│  ├─ Node 18 Alpine (~150MB)                         │
│  ├─ Run test.js                                     │
│  ├─ Memory limit: 256MB                             │
│  └─ CPU limit: 0.5 cores                            │
└──────────────────────────────────────────────────────┘
```

## Installation & Setup

### Prerequisites

- Docker Engine 20.10+ installed and running
- Docker Compose 1.29+ (for multi-service orchestration)
- Node.js 18+ on host (for development)

### Quick Start with Docker Compose

```bash
# Production setup with MongoDB + Backend + Frontend
docker-compose -f docker-compose.production.yml up -d

# With optional executor service
docker-compose -f docker-compose.production.yml --profile executor up -d

# View logs
docker-compose -f docker-compose.production.yml logs -f

# Stop all services
docker-compose -f docker-compose.production.yml down
```

### Manual Setup (Dev)

```bash
# Build executor image
docker build -f Dockerfile.executor -t ai-executor:latest .

# Run container for testing
docker run --rm \
  -m 256m \
  --cpus 0.5 \
  -v $(pwd)/backend/data/agent_runs:/agent-work:ro \
  ai-executor:latest \
  node /agent-work/test.js
```

## Configuration

### Container Limits (Edit `backend/src/services/containerExecutor.js`)

```javascript
const CONTAINER_IMAGE = 'node:18-alpine'     // Base image
const CONTAINER_TIMEOUT = 30000              // 30 seconds
const MEMORY_LIMIT = '256m'                  // RAM limit
const CPU_LIMIT = '0.5'                      // CPU cores
```

### Docker Compose Env (Edit `docker-compose.production.yml`)

```yaml
environment:
  MONGODB_URI: mongodb://admin:admin123@mongodb:27017/ai_builder
  JWT_SECRET: your-production-secret
  CORS_ORIGIN: https://your-domain.com
```

## Integration with Agent Runner

### Option 1: Automatic (Future Enhancement)

```javascript
// In backend/src/services/agentRunner.js
import { executeInContainer } from './containerExecutor.js'

export async function runAgent(agentId, options = {}) {
  // ... generate code ...
  
  // Execute in container instead of simulating
  if (process.env.USE_CONTAINER_EXECUTOR === 'true') {
    const result = await executeInContainer(agentId, runId, generated)
    log.push(`[${new Date().toISOString()}] Container execution completed`)
    log.push(`Exit code: ${result.exitCode}`)
    log.push(...result.stdout.split('\n'))
  }
}
```

### Option 2: Manual (Current)

```bash
# After a run completes, manually test with Docker
docker run --rm \
  -v backend/data/agent_runs/my-agent/1234567890:/app:ro \
  -m 256m --cpus 0.5 \
  node:18-alpine \
  node /app/test.js
```

## Validation Layers

The executor performs multiple security checks:

### 1. Syntax Validation
- Ensures JavaScript code can be parsed
- Detects obvious syntax errors before execution

### 2. Structure Validation
- Verifies HTML, CSS, JS files are present
- Checks for expected content markers
- Example: HTML contains `<html` tag

### 3. Security Validation
- Scans for dangerous patterns:
  - `eval()` calls
  - `innerHTML` assignments
  - `document.write()`
- Prevents common XSS vulnerabilities

### 4. Performance Validation
- Checks total artifact size (max 100KB)
- Warns if code is bloated
- Helps identify runaway generators

## Example Output

### Successful Run

```json
{
  "id": "1733548234567",
  "agentId": "code-gen",
  "status": "completed",
  "logs": [
    "[2025-12-07T10:30:34.567Z] Starting agent run 1733548234567",
    "[2025-12-07T10:30:35.123Z] Generating code...",
    "[2025-12-07T10:30:36.456Z] Generated files written to backend/data/agent_runs/code-gen/1733548234567",
    "[2025-12-07T10:30:37.789Z] Running validation checks",
    "[2025-12-07T10:30:38.100Z] Tests PASSED - All basic checks passed"
  ],
  "validationResults": {
    "syntax": { "passed": true },
    "structure": { "passed": true },
    "security": { "passed": true },
    "performance": { "passed": true }
  }
}
```

### Failed Run (Security Issue)

```json
{
  "id": "1733548234568",
  "status": "failed",
  "logs": [
    "[2025-12-07T10:30:40.123Z] Starting agent run...",
    "[2025-12-07T10:30:41.456Z] Generating code...",
    "[2025-12-07T10:30:42.789Z] Security: Issues found - eval() detected"
  ],
  "validationResults": {
    "security": { 
      "passed": false,
      "message": "Security: Issues found",
      "details": { "hasDangerousPatterns": true }
    }
  }
}
```

## Monitoring & Debugging

### View Container Logs

```bash
# Real-time logs
docker logs -f ai-builder-executor

# Last 100 lines
docker logs --tail 100 ai-builder-executor

# Follow logs with timestamps
docker logs -f --timestamps ai-builder-executor
```

### Inspect Container Resources

```bash
# CPU and memory usage
docker stats ai-builder-executor

# Container details
docker inspect ai-builder-executor

# View mounted volumes
docker inspect -f '{{json .Mounts}}' ai-builder-executor | jq
```

### Test Container Manually

```bash
# Create test artifact
mkdir -p backend/data/test_run
echo "console.log('Hello from container')" > backend/data/test_run/test.js

# Run container
docker run --rm \
  -v $(pwd)/backend/data/test_run:/app:ro \
  -m 256m --cpus 0.5 \
  node:18-alpine \
  node /app/test.js

# Expected output:
# Hello from container
```

## Troubleshooting

### Docker Not Found

```
Error: spawn docker ENOENT
```

**Solution:** Install Docker Desktop or Docker Engine
- macOS/Windows: https://docker.com/products/docker-desktop
- Linux: `sudo apt-get install docker.io` or equivalent

### Container Timeout

```
Error: SIGKILL - container killed due to timeout
```

**Solution:** Increase timeout in `containerExecutor.js`:
```javascript
const CONTAINER_TIMEOUT = 60000  // 60 seconds
```

### Out of Memory

```
OOMKilled: container ran out of memory
```

**Solution:** Increase memory limit:
```javascript
const MEMORY_LIMIT = '512m'  // Increase from 256m
```

### Volume Mount Permission Denied

```
Error: permission denied while trying to connect to Docker daemon
```

**Solution (Linux only):**
```bash
# Add user to docker group
sudo usermod -aG docker $USER
newgrp docker

# Verify
docker ps
```

### Container Can't Write to Output

**Solution:** Use read-only volume mount with separate output dir:
```bash
docker run --rm \
  -v artifacts:/agent-work:ro \
  -v output:/agent-work/output \
  ai-executor:latest
```

## Performance Tuning

### For High-Load Scenarios

```javascript
// Use CPU limits strategically
const CPU_LIMIT = '1.0'          // Allow full core on powerful host
const MEMORY_LIMIT = '512m'      // Increase for larger artifacts
const CONTAINER_TIMEOUT = 60000  // Allow more time if needed
```

### For Resource-Constrained Environments

```javascript
const CPU_LIMIT = '0.25'         // Quarter core
const MEMORY_LIMIT = '128m'      // Minimal RAM
const CONTAINER_TIMEOUT = 15000  // 15 second timeout
```

## Security Best Practices

1. **Always use image tags** (not `latest`)
   ```bash
   docker build -t ai-executor:v1.0.0 .
   ```

2. **Run as non-root**
   - Executor runs as nodejs:nodejs user
   - Never run containers as root

3. **Use read-only volumes**
   ```bash
   -v /path/to/artifacts:/work:ro
   ```

4. **Set resource limits**
   - Always set `-m` (memory) and `--cpus` (CPU)
   - Prevents denial-of-service via runaway containers

5. **Sign and verify images** (production)
   ```bash
   docker content trust enable
   docker build -t myregistry.com/ai-executor:latest .
   docker push myregistry.com/ai-executor:latest
   ```

## Future Enhancements

- [ ] Kubernetes integration (scale horizontally)
- [ ] Result caching (skip re-execution of identical code)
- [ ] Custom test harness language (not just Node.js)
- [ ] Browser automation (Puppeteer) for full E2E tests
- [ ] Artifact download & preview UI
- [ ] Execution metrics (CPU%, memory%, duration)
- [ ] Multi-language support (Python, Go, Rust)

## References

- Docker Documentation: https://docs.docker.com
- Docker Compose: https://docs.docker.com/compose
- Node Alpine Images: https://hub.docker.com/_/node
- Security Best Practices: https://docs.docker.com/engine/security

---

**Version:** 1.0.0  
**Last Updated:** December 7, 2025
