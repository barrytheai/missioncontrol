# OpenClaw Agent API

Mission Control runs a local HTTP API from `dev-server.js`.

## Start Mission Control

```powershell
cd "C:\Users\cecec\OneDrive\Documents\New project"
$env:OPENCLAW_AGENT_TOKEN="choose-a-token"
node dev-server.js
```

The browser UI is:

```text
http://localhost:4173
```

Agents on another device should call:

```text
http://YOUR_COMPUTER_LAN_IP:4173
```

Use the same token in every agent request:

```text
Authorization: Bearer choose-a-token
```

## Endpoints

### Health

```http
GET /api/health
```

### Register Agent

```http
POST /api/agents/register
Authorization: Bearer choose-a-token
Content-Type: application/json
```

```json
{
  "id": "builder",
  "name": "Builder",
  "role": "Frontend",
  "capabilities": ["code", "ui"],
  "endpoint": "http://AGENT_DEVICE_IP:9000"
}
```

### Heartbeat

```http
POST /api/agents/heartbeat
Authorization: Bearer choose-a-token
Content-Type: application/json
```

```json
{
  "id": "builder",
  "status": "Connected",
  "load": 42
}
```

### List Tasks

```http
GET /api/tasks
```

### Claim Task

```http
POST /api/tasks/TASK_ID/claim
Authorization: Bearer choose-a-token
Content-Type: application/json
```

```json
{
  "agentId": "builder"
}
```

### Post Task Update

```http
POST /api/tasks/TASK_ID/updates
Authorization: Bearer choose-a-token
Content-Type: application/json
```

```json
{
  "agentId": "builder",
  "level": "info",
  "message": "Started implementing the task",
  "progress": 35,
  "status": "Executing",
  "lane": "execute"
}
```

## Data Storage

Mission Control stores local state in:

```text
data/mission-control.json
```

That file can be backed up or reset if needed.
