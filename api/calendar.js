const { cors, supabaseFetch, readBody } = require("./_lib");

module.exports = async (req, res) => {
  cors(res);
  if (req.method === "OPTIONS") return res.status(204).end();

  const { id } = req.query;

  if (req.method === "GET") {
    const url = id ? `/calendar?id=eq.${id}&select=*` : "/calendar?select=*&order=date.asc,time.asc";
    const r = await supabaseFetch(url);
    const events = await r.json();
    return res.status(200).json({ events: Array.isArray(events) ? events : [] });
  }

  if (req.method === "POST") {
    const body = await readBody(req);
    const event = {
      title: String(body.title || "Untitled").trim(),
      date: body.date || "",
      time: body.time || "",
      description: String(body.description || "").trim(),
      recurring: body.recurring || "none",
      agent_ids: Array.isArray(body.agentIds) ? body.agentIds : [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    const r = await supabaseFetch("/calendar", { method: "POST", body: JSON.stringify(event) });
    const result = await r.json();
    return res.status(201).json({ event: Array.isArray(result) ? result[0] : result });
  }

  if (req.method === "PATCH" && id) {
    const body = await readBody(req);
    const updates = {
      ...(body.title && { title: body.title }),
      ...(body.date !== undefined && { date: body.date }),
      ...(body.time !== undefined && { time: body.time }),
      ...(body.description !== undefined && { description: body.description }),
      ...(body.agentIds && { agent_ids: body.agentIds }),
      ...(body.recurring !== undefined && { recurring: body.recurring }),
      updated_at: new Date().toISOString()
    };
    const r = await supabaseFetch(`/calendar?id=eq.${id}`, { method: "PATCH", body: JSON.stringify(updates) });
    const result = await r.json();
    return res.status(200).json({ event: Array.isArray(result) ? result[0] : result });
  }

  if (req.method === "DELETE" && id) {
    await supabaseFetch(`/calendar?id=eq.${id}`, { method: "DELETE" });
    return res.status(200).json({ ok: true });
  }

  return res.status(405).json({ error: "Method not allowed" });
};
