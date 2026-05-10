# GitHub + Vercel Handoff

This project is ready to place into a GitHub repository.

Workspace path:

```text
C:\Users\cecec\OneDrive\Documents\New project
```

Clean package:

```text
openclaw-mission-control-github-v1.zip
```

## Important Architecture Note

There are two parts:

1. **Frontend UI**: `index.html`, `styles.css`, `app.js`, `config.js`
2. **Mission Control API**: `dev-server.js`

Vercel can host the frontend immediately.

The current API stores state in a local JSON file (`data/mission-control.json`). That is perfect for running on the agent device, but it is not a production database for Vercel serverless hosting.

Recommended setup for now:

1. Agent device runs `dev-server.js`.
2. Agent device exposes that API using a stable URL, such as a LAN IP, Tailscale, Cloudflare Tunnel, or ngrok.
3. Vercel hosts the frontend.
4. The frontend points to the agent device API via `config.js`.
5. You open the Vercel URL from your device.

## What To Push To GitHub

Push these files:

```text
index.html
styles.css
app.js
config.js
dev-server.js
package.json
README.md
AGENT_API.md
RUN_ON_AGENT_DEVICE.md
GITHUB_VERCEL_HANDOFF.md
vercel.json
start-local-mission-control.bat
start-local-mission-control.ps1
.env.example
.gitignore
```

Do not push:

```text
VercelAPIkey.txt
.vercel/
.npm-cache/
.tmp/
.vercel-appdata/
.vercel-localappdata/
vercel-*.log
data/mission-control.json
```

## Configure API URL For Vercel

Before deploying the frontend to Vercel, edit:

```text
config.js
```

Set it to the public or private network URL where the agent device is running Mission Control:

```js
window.OPENCLAW_API_BASE = "https://YOUR-AGENT-DEVICE-API-URL";
```

Examples:

```js
window.OPENCLAW_API_BASE = "http://192.168.1.50:4173";
window.OPENCLAW_API_BASE = "https://your-tunnel.trycloudflare.com";
window.OPENCLAW_API_BASE = "https://your-ngrok-url.ngrok-free.app";
```

If the frontend and API are on the same server, leave it blank:

```js
window.OPENCLAW_API_BASE = "";
```

## Run On Agent Device

On the agent device:

```powershell
cd "path\to\project"
$env:OPENCLAW_AGENT_TOKEN="choose-a-shared-token"
node dev-server.js
```

Check:

```text
http://localhost:4173/api/health
```

## Deploy Frontend To Vercel

From the GitHub repository:

1. Import the repo into Vercel.
2. Framework preset: **Other** or static.
3. Build command: leave empty.
4. Output directory: leave empty / root.
5. Deploy.

The Vercel site will load the UI and call the API configured in `config.js`.

## Future Production Upgrade

If you want the whole backend hosted on Vercel later, replace the local JSON file with a hosted datastore such as Neon Postgres, Vercel Postgres, Upstash Redis, or another persistent database. Then the API can move from `dev-server.js` into Vercel Functions.
