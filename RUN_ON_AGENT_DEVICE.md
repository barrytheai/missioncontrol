# Run OpenClaw Mission Control On The Agent Device

This folder is self-contained. It runs a local web app and HTTP API that OpenClaw agents can plug into.

## Requirements

- Node.js 18 or newer
- The project folder from this package

No npm install is required.

## Start

From this folder:

```powershell
$env:OPENCLAW_AGENT_TOKEN="choose-a-shared-token"
node dev-server.js
```

Or:

```powershell
$env:OPENCLAW_AGENT_TOKEN="choose-a-shared-token"
npm start
```

Open:

```text
http://localhost:4173
```

## Agent Plug-In URL

If agents are on the same device:

```text
http://localhost:4173
```

If agents are on another device on the same network:

```text
http://MISSION_CONTROL_DEVICE_IP:4173
```

Every agent write request should include:

```text
Authorization: Bearer choose-a-shared-token
```

## Check It Is Running

Open this in a browser or call it from an agent:

```text
http://localhost:4173/api/health
```

Expected response includes:

```json
{
  "ok": true,
  "service": "OpenClaw Mission Control"
}
```

## Agent API

See `AGENT_API.md`.

## Local Data

The app creates local state here:

```text
data/mission-control.json
```

Delete that file to reset the workspace back to seed data.
