const { cors, supabaseFetch, isAuthorized, readBody } = require("./_lib");

module.exports = async (req, res) => {
  cors(res);
  if (req.method === "OPTIONS") return res.status(204).end();

  const { id } = req.query;

  if (req.method === "GET") {
    const r = await supabaseFetch("/memories?select=*&order=updated_at.desc");
    const memories = await r.json();
    return res.status(200).json({ memories: Array.isArray(memories) ? memories : [] });
  }

  if (req.method === "POST") {
    if (!isAuthorized(req)) return res.status(401).json({ error: "Agent token required" });
    const body = await readBody(req);
    const memory = {
      title: String(body.title || "Untitled").trim(),
      body: String(body.body || "").trim(),
      updated_at: new Date().toISOString()
    };
    const r = await supabaseFetch("/memories", { method: "POST", body: JSON.stringify(memory) });
    const result = await r.json();
    return res.status(201).json({ memory: Array.isArray(result) ? result[0] : result });
  }

  if (req.method === "PATCH" && id) {
    if (!isAuthorized(req)) return res.status(401).json({ error: "Agent token required" });
    const body = await readBody(req);
    const updates = {
      ...(body.title && { title: body.title }),
      ...(body.body !== undefined && { body: body.body }),
      updated_at: new Date().toISOString()
    };
    const r = await supabaseFetch(`/memories?id=eq.${id}`, { method: "PATCH", body: JSON.stringify(updates) });
    const result = await r.json();
    return res.status(200).json({ memory: Array.isArray(result) ? result[0] : result });
  }

  if (req.method === "DELETE" && id) {
    if (!isAuthorized(req)) return res.status(401).json({ error: "Agent token required" });
    await supabaseFetch(`/memories?id=eq.${id}`, { method: "DELETE" });
    return res.status(200).json({ ok: true });
  }

  return res.status(405).json({ error: "Method not allowed" });
};
