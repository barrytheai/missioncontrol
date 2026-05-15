const { cors, supabaseFetch, isAuthorized, readBody } = require("./_lib");

module.exports = async (req, res) => {
  cors(res);
  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  if (!isAuthorized(req)) return res.status(401).json({ error: "Agent token required" });

  const { id } = req.query;
  const body = await readBody(req);

  const r = await supabaseFetch(`/tasks?id=eq.${id}&select=*`);
  const tasks = await r.json();
  if (!tasks || !tasks[0]) return res.status(404).json({ error: "Task not found" });

  const task = tasks[0];
  const source = body.agentId || body.source || "Agent";
  const message = String(body.message || "Posted an update").trim();
  const activity = [message, ...(task.activity || [])].slice(0, 12);

  const updates = {
    activity,
    updated_at: new Date().toISOString(),
    ...(body.progress !== undefined && { progress: Number(body.progress) }),
    ...(body.status && { status: body.status }),
    ...(body.lane && { lane: body.lane })
  };

  const r2 = await supabaseFetch(`/tasks?id=eq.${id}`, { method: "PATCH", body: JSON.stringify(updates) });

  await supabaseFetch("/events", { method: "POST", body: JSON.stringify({
    level: body.level || "info", source, message, target: task.title,
    created_at: new Date().toISOString()
  })});

  const result = await r2.json();
  return res.status(201).json({ task: Array.isArray(result) ? result[0] : result });
};
