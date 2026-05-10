const http = require("http");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const port = Number(process.env.PORT || 4173);
const host = process.env.HOST || "0.0.0.0";
const root = process.cwd();
const dataDir = path.join(root, "data");
const dataFile = path.join(dataDir, "mission-control.json");
const agentToken = process.env.OPENCLAW_AGENT_TOKEN || "local-dev-token";

const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8"
};

const seedState = {
  agents: [
    { id: "scout", name: "Scout", role: "Research", status: "Connected", lastSeen: new Date().toISOString(), capabilities: ["research", "summarize"] },
    { id: "analyst", name: "Analyst", role: "Analysis", status: "Connected", lastSeen: new Date().toISOString(), capabilities: ["analysis", "reports"] },
    { id: "builder", name: "Builder", role: "Frontend", status: "Connected", lastSeen: new Date().toISOString(), capabilities: ["code", "ui"] },
    { id: "guardian", name: "Guardian", role: "Run Health", status: "Run Health", lastSeen: new Date().toISOString(), capabilities: ["monitoring", "security"] },
    { id: "operator", name: "Operator", role: "Ops", status: "Connected", lastSeen: new Date().toISOString(), capabilities: ["deploy", "routing"] },
    { id: "scribe", name: "Scribe", role: "Documentation", status: "Connected", lastSeen: new Date().toISOString(), capabilities: ["docs", "memory"] }
  ],
  tasks: [
    createTaskSeed("m1", "plan", "Q2 Market Analysis", "Analyze market trends and competitor positioning.", "High", "May 23", "Planning", 30, ["scout", "analyst"]),
    createTaskSeed("m2", "plan", "Customer Feedback Loop", "Aggregate and summarize customer feedback.", "Medium", "May 24", "Planning", 18, ["scribe"]),
    createTaskSeed("m3", "plan", "Infra Cost Optimization", "Identify and reduce cloud spend.", "Low", "May 25", "Planning", 12, ["operator"]),
    createTaskSeed("m4", "execute", "Website Redesign", "Redesign the marketing website and improve performance.", "High", "May 22, 2025", "Executing", 65, ["builder", "guardian"]),
    createTaskSeed("m5", "execute", "Data Pipeline Migration", "Migrate ETL pipeline to the new platform.", "Medium", "May 27", "Executing", 48, ["operator", "analyst"]),
    createTaskSeed("m6", "review", "Security Audit", "Conduct a full security audit and remediation plan.", "High", "May 26", "Review", 80, ["guardian"]),
    createTaskSeed("m7", "review", "Onboarding Flow Update", "Improve onboarding flow and user activation.", "Medium", "May 28", "Review", 72, ["scout", "scribe"]),
    createTaskSeed("m8", "done", "API Docs Overhaul", "Restructure and modernize API documentation.", "Medium", "May 20", "Done", 100, ["scribe", "builder"]),
    createTaskSeed("m9", "done", "Release v1.4.0", "Shipped v1.4.0 to production successfully.", "High", "May 19", "Done", 100, ["operator"]),
    createTaskSeed("m10", "done", "Bug Bash Sprint", "Resolved critical bugs from latest release.", "Low", "May 18", "Done", 100, ["guardian", "builder"])
  ],
  events: [
    createEvent("ok", "Task", "Website Redesign moved to Execute", "Alex Kim"),
    createEvent("info", "Builder", "Started task: Update hero component", "Website Redesign"),
    createEvent("ok", "Optimizer", "Run health check completed", "All systems normal"),
    createEvent("warn", "Guardian", "High memory usage detected", "82%"),
    createEvent("info", "Analyst", "Data sync completed", "Q2 Market Analysis"),
    createEvent("ok", "Scribe", "Documentation updated", "API Docs Overhaul")
  ],
  memories: [
    { id: "mem-1", title: "Project facts", body: "Brand voice is concise, operational, and Linear-inspired.", updatedAt: new Date().toISOString() },
    { id: "mem-2", title: "Decisions", body: "Tasks replace missions in navigation and creation flows.", updatedAt: new Date().toISOString() },
    { id: "mem-3", title: "Agent notes", body: "Builder owns UI implementation; Guardian owns run health.", updatedAt: new Date().toISOString() }
  ]
};

function createTaskSeed(id, lane, title, description, priority, due, status, progress, agentIds) {
  return {
    id,
    lane,
    title,
    description,
    priority,
    due,
    status,
    progress,
    agentIds,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    activity: ["Task created"]
  };
}

function createEvent(level, source, message, target = "") {
  return {
    id: crypto.randomUUID(),
    time: new Date().toISOString(),
    level,
    source,
    message,
    target
  };
}

function readState() {
  ensureDataFile();
  return JSON.parse(fs.readFileSync(dataFile, "utf8"));
}

function writeState(state) {
  fs.mkdirSync(dataDir, { recursive: true });
  fs.writeFileSync(dataFile, JSON.stringify(state, null, 2));
}

function ensureDataFile() {
  if (!fs.existsSync(dataFile)) {
    writeState(seedState);
  }
}

function sendJson(response, status, payload) {
  response.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST,PATCH,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type,Authorization,X-Agent-Token"
  });
  response.end(JSON.stringify(payload));
}

function sendError(response, status, message) {
  sendJson(response, status, { error: message });
}

function readBody(request) {
  return new Promise((resolve, reject) => {
    let body = "";
    request.on("data", (chunk) => {
      body += chunk;
      if (body.length > 1_000_000) {
        reject(new Error("Body too large"));
        request.destroy();
      }
    });
    request.on("end", () => {
      if (!body) {
        resolve({});
        return;
      }
      try {
        resolve(JSON.parse(body));
      } catch {
        reject(new Error("Invalid JSON"));
      }
    });
  });
}

function isAgentAuthorized(request) {
  const auth = request.headers.authorization || "";
  const bearer = auth.startsWith("Bearer ") ? auth.slice(7) : "";
  return bearer === agentToken || request.headers["x-agent-token"] === agentToken;
}

function publicState(state) {
  return {
    agents: state.agents,
    tasks: state.tasks,
    events: state.events.slice(0, 80),
    memories: state.memories || [],
    serverTime: new Date().toISOString()
  };
}

async function handleApi(request, response, pathname) {
  if (request.method === "OPTIONS") {
    sendJson(response, 204, {});
    return;
  }

  const state = readState();

  if (request.method === "GET" && pathname === "/api/state") {
    sendJson(response, 200, publicState(state));
    return;
  }

  if (request.method === "GET" && pathname === "/api/health") {
    sendJson(response, 200, {
      ok: true,
      service: "OpenClaw Mission Control",
      serverTime: new Date().toISOString(),
      tasks: state.tasks.length,
      agents: state.agents.length
    });
    return;
  }

  if (request.method === "GET" && pathname === "/api/tasks") {
    sendJson(response, 200, { tasks: state.tasks });
    return;
  }

  if (request.method === "POST" && pathname === "/api/tasks") {
    const body = await readBody(request);
    const task = {
      id: crypto.randomUUID(),
      lane: body.lane || "plan",
      title: String(body.title || "Untitled task").trim(),
      description: String(body.description || "").trim(),
      priority: body.priority || "Medium",
      due: body.due || "Unscheduled",
      status: body.status || statusFromLane(body.lane || "plan"),
      progress: Number(body.progress || 0),
      agentIds: Array.isArray(body.agentIds) ? body.agentIds : [],
      activity: ["Task created"],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    state.tasks.unshift(task);
    state.events.unshift(createEvent("ok", "Task", `${task.title} created`, "Mission Control"));
    writeState(state);
    sendJson(response, 201, { task });
    return;
  }

  const taskMatch = pathname.match(/^\/api\/tasks\/([^/]+)$/);
  if (taskMatch && request.method === "PATCH") {
    const task = state.tasks.find((item) => item.id === taskMatch[1]);
    if (!task) {
      sendError(response, 404, "Task not found");
      return;
    }
    const body = await readBody(request);
    Object.assign(task, pick(body, ["lane", "title", "description", "priority", "due", "status", "progress", "agentIds"]));
    task.status = body.status || statusFromLane(task.lane);
    task.updatedAt = new Date().toISOString();
    task.activity = [`Task updated`, ...(task.activity || [])].slice(0, 12);
    state.events.unshift(createEvent("info", "Task", `${task.title} updated`, task.status));
    writeState(state);
    sendJson(response, 200, { task });
    return;
  }

  const claimMatch = pathname.match(/^\/api\/tasks\/([^/]+)\/claim$/);
  if (claimMatch && request.method === "POST") {
    if (!isAgentAuthorized(request)) {
      sendError(response, 401, "Agent token required");
      return;
    }
    const body = await readBody(request);
    const task = state.tasks.find((item) => item.id === claimMatch[1]);
    if (!task) {
      sendError(response, 404, "Task not found");
      return;
    }
    const agentId = String(body.agentId || "").trim();
    if (agentId && !task.agentIds.includes(agentId)) {
      task.agentIds.push(agentId);
    }
    task.lane = "execute";
    task.status = "Executing";
    task.updatedAt = new Date().toISOString();
    task.activity = [`${agentId || "Agent"} claimed task`, ...(task.activity || [])].slice(0, 12);
    state.events.unshift(createEvent("info", agentId || "Agent", `Claimed task: ${task.title}`, task.title));
    writeState(state);
    sendJson(response, 200, { task });
    return;
  }

  const updateMatch = pathname.match(/^\/api\/tasks\/([^/]+)\/updates$/);
  if (updateMatch && request.method === "POST") {
    if (!isAgentAuthorized(request)) {
      sendError(response, 401, "Agent token required");
      return;
    }
    const body = await readBody(request);
    const task = state.tasks.find((item) => item.id === updateMatch[1]);
    if (!task) {
      sendError(response, 404, "Task not found");
      return;
    }
    const source = body.agentId || body.source || "Agent";
    const message = String(body.message || "Posted an update").trim();
    if (body.progress !== undefined) task.progress = Number(body.progress);
    if (body.status) task.status = body.status;
    if (body.lane) task.lane = body.lane;
    task.updatedAt = new Date().toISOString();
    task.activity = [message, ...(task.activity || [])].slice(0, 12);
    state.events.unshift(createEvent(body.level || "info", source, message, task.title));
    writeState(state);
    sendJson(response, 201, { task });
    return;
  }

  if (request.method === "POST" && pathname === "/api/agents/register") {
    if (!isAgentAuthorized(request)) {
      sendError(response, 401, "Agent token required");
      return;
    }
    const body = await readBody(request);
    const id = String(body.id || body.name || crypto.randomUUID()).toLowerCase().replace(/[^a-z0-9-]/g, "-");
    let agent = state.agents.find((item) => item.id === id);
    if (!agent) {
      agent = { id };
      state.agents.push(agent);
    }
    Object.assign(agent, {
      name: body.name || agent.name || id,
      role: body.role || agent.role || "Agent",
      status: body.status || "Connected",
      capabilities: Array.isArray(body.capabilities) ? body.capabilities : agent.capabilities || [],
      endpoint: body.endpoint || agent.endpoint || "",
      lastSeen: new Date().toISOString()
    });
    state.events.unshift(createEvent("ok", agent.name, "Agent registered", agent.role));
    writeState(state);
    sendJson(response, 200, { agent });
    return;
  }

  if (request.method === "POST" && pathname === "/api/agents/heartbeat") {
    if (!isAgentAuthorized(request)) {
      sendError(response, 401, "Agent token required");
      return;
    }
    const body = await readBody(request);
    const agent = state.agents.find((item) => item.id === body.id);
    if (!agent) {
      sendError(response, 404, "Agent not registered");
      return;
    }
    agent.status = body.status || "Connected";
    agent.lastSeen = new Date().toISOString();
    if (body.load !== undefined) agent.load = Number(body.load);
    writeState(state);
    sendJson(response, 200, { agent });
    return;
  }

  if (request.method === "GET" && pathname === "/api/agent-contract") {
    sendJson(response, 200, {
      baseUrl: `http://<mission-control-ip>:${port}`,
      tokenHeader: "Authorization: Bearer <OPENCLAW_AGENT_TOKEN>",
      endpoints: {
        register: "POST /api/agents/register",
        heartbeat: "POST /api/agents/heartbeat",
        listTasks: "GET /api/tasks",
        claimTask: "POST /api/tasks/:id/claim",
        postUpdate: "POST /api/tasks/:id/updates"
      }
    });
    return;
  }

  sendError(response, 404, "API route not found");
}

function statusFromLane(lane) {
  if (lane === "execute") return "Executing";
  if (lane === "review") return "Review";
  if (lane === "done") return "Done";
  return "Planning";
}

function pick(source, keys) {
  return keys.reduce((acc, key) => {
    if (source[key] !== undefined) acc[key] = source[key];
    return acc;
  }, {});
}

function serveStatic(request, response, pathname) {
  if (pathname === "/") pathname = "/index.html";

  const filePath = path.normalize(path.join(root, pathname));
  if (!filePath.startsWith(root)) {
    response.writeHead(403);
    response.end("Forbidden");
    return;
  }

  fs.readFile(filePath, (error, data) => {
    if (error) {
      response.writeHead(404);
      response.end("Not found");
      return;
    }

    response.writeHead(200, {
      "Content-Type": types[path.extname(filePath)] || "application/octet-stream"
    });
    response.end(data);
  });
}

http.createServer(async (request, response) => {
  const pathname = decodeURIComponent(request.url.split("?")[0]);
  try {
    if (pathname.startsWith("/api/")) {
      await handleApi(request, response, pathname);
      return;
    }
    serveStatic(request, response, pathname);
  } catch (error) {
    sendError(response, 500, error.message || "Unexpected server error");
  }
}).listen(port, host, () => {
  ensureDataFile();
  console.log(`OpenClaw Mission Control running at http://localhost:${port}`);
  console.log(`Agent API listening on http://<this-device-ip>:${port}/api`);
  console.log("Agent token loaded from OPENCLAW_AGENT_TOKEN or local default.");
});
