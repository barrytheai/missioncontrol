# OpenClaw Mission Control

A Linear-inspired mission control interface for dispatching, monitoring, and reviewing OpenClaw agent work.

## Run locally

Run the included local server:

```powershell
$env:OPENCLAW_AGENT_TOKEN="choose-a-token"
node dev-server.js
```

Then visit:

```text
http://localhost:4173
```

Tasks, agents, events, and memory are saved to `data/mission-control.json`.

## Agent integration

Agents on another device can call the local HTTP API exposed by the same server. See `AGENT_API.md` for the request contract.

For GitHub and Vercel handoff, see `GITHUB_VERCEL_HANDOFF.md`.

For the full handoff instructions, send `RUN_ON_AGENT_DEVICE.md` and `AGENT_API.md` with the project folder.

Set a shared token before starting the server:

```powershell
$env:OPENCLAW_AGENT_TOKEN="choose-a-token"
node dev-server.js
```
