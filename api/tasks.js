const { cors, supabaseFetch, readBody } = require("./_lib");
function statusFromLane(lane) {
  if (lane === "execute") return "Executing";
  if (lane === "review") return "Review";
  if (lane === "done") return "Done";
  return "Planning";
}
module.exports = async (req, res) => {
  cors(res);
  if (req.method === "OPTIONS") return res.status(204).end();
  const { id } = req.query;
  if (req.method === "GET") {
    const url = id ? `/tasks?id=eq.${id}&select=*` : "/tasks?select=*&order=created_at.desc";
    const r = await supabaseFetch(url);
    const tasks = await r.json();
    return res.status(200).json({ tasks: Array.isArray(tasks) ? tasks : [] });
  }
  if (req.method === "POST") {
    const body = await readBody(req);
    const task = { id: crypto.randomUUID(), lane: body.lane || "plan", title: String(body.title || "Untitled").trim(), description: String(body.description || "").trim(), priority: body.priority || "Medium", due: body.due || "Unscheduled", status: body.status || statusFromLane(body.lane || "plan"), progress: Number(body.progress || 0), agent_ids: Array.isArray(body.agentIds) ? body.agentIds : [], activity: ["Task created"], created_at: new Date().toISOString(), updated_at: new Date().toISOString() };
    const r = await supabaseFetch("/tasks", { method: "POST", body: JSON.stringify(task) });
    const result = await r.json();
    await supabaseFetch("/events", { method: "POST", body: JSON.stringify({ level: "ok", source: "Task", message: `${task.title} created`, target: "Mission Control", created_at: new Date().toISOString() }) });
    return res.status(201).json({ task: Array.isArray(result) ? result[0] : result });
  }
  if (req.method === "PATCH" && id) {
    const body = await readBody(req);
    const updates = { ...(body.lane && { lane: body.lane }), ...(body.title && { title: body.title }), ...(body.description !== undefined && { description: body.description }), ...(body.priority && { priority: body.priority }), ...(body.due && { due: body.due }), ...(body.status && { status: body.status }), ...(body.progress !== undefined && { progress: Number(body.progress) }), ...(body.agentIds && { agent_ids: body.agentIds }), updated_at: new Date().toISOString() };
    const r = await supabaseFetch(`/tasks?id=eq.${id}`, { method: "PATCH", body: JSON.stringify(updates) });
    const result = await r.json();
    return res.status(200).json({ task: Array.isArray(result) ? result[0] : result });
  }
  if (req.method === "DELETE" && id) {
    await supabaseFetch(`/tasks?id=eq.${id}`, { method: "DELETE" });
    return res.status(200).json({ ok: true });
  }
  return res.status(405).json({ error: "Method not allowed" });
};
