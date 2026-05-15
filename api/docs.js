const { cors, supabaseFetch, isAuthorized, readBody } = require("./_lib");

module.exports = async (req, res) => {
  cors(res);
  if (req.method === "OPTIONS") return res.status(204).end();

  const { id } = req.query;

  if (req.method === "GET") {
    const r = await supabaseFetch("/docs?select=*&order=updated_at.desc");
    const docs = await r.json();
    return res.status(200).json({ docs: Array.isArray(docs) ? docs : [] });
  }

  if (req.method === "POST") {
    if (!isAuthorized(req)) return res.status(401).json({ error: "Agent token required" });

    const body = await readBody(req);
    const doc = {
      title: String(body.title || "Untitled doc").trim(),
      type: String(body.type || "Notes").trim(),
      status: String(body.status || "Ready for Review").trim(),
      author: String(body.author || body.agentId || "agent").trim(),
      body: String(body.body || body.content || "").trim(),
      updated_at: new Date().toISOString()
    };

    const r = await supabaseFetch("/docs", {
      method: "POST",
      body: JSON.stringify(doc)
    });

    const result = await r.json();
    return res.status(201).json({ doc: Array.isArray(result) ? result[0] : result });
  }

  if (req.method === "PATCH" && id) {
    if (!isAuthorized(req)) return res.status(401).json({ error: "Agent token required" });

    const body = await readBody(req);
    const updates = {
      ...(body.title !== undefined && { title: body.title }),
      ...(body.type !== undefined && { type: body.type }),
      ...(body.status !== undefined && { status: body.status }),
      ...(body.author !== undefined && { author: body.author }),
      ...(body.body !== undefined && { body: body.body }),
      updated_at: new Date().toISOString()
    };

    const r = await supabaseFetch(`/docs?id=eq.${id}`, {
      method: "PATCH",
      body: JSON.stringify(updates)
    });

    const result = await r.json();
    return res.status(200).json({ doc: Array.isArray(result) ? result[0] : result });
  }

  if (req.method === "DELETE" && id) {
    if (!isAuthorized(req)) return res.status(401).json({ error: "Agent token required" });
    await supabaseFetch(`/docs?id=eq.${id}`, { method: "DELETE" });
    return res.status(200).json({ ok: true });
  }

  return res.status(405).json({ error: "Method not allowed" });
};
