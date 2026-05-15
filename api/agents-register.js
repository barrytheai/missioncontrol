const { cors, supabaseFetch, isAuthorized, readBody } = require("./_lib");

module.exports = async (req, res) => {
  cors(res);
  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  if (!isAuthorized(req)) return res.status(401).json({ error: "Agent token required" });

  const body = await readBody(req);
  const id = String(body.id || body.name || "unknown").toLowerCase().replace(/[^a-z0-9-]/g, "-");

  const agent = {
    id,
    name: body.name || id,
    role: body.role || "Agent",
    status: body.status || "Connected",
    model: body.model || "Unknown",
    capabilities: Array.isArray(body.capabilities) ? body.capabilities : [],
    endpoint: body.endpoint || "",
    last_seen: new Date().toISOString()
  };

  // Upsert — insert or update
  const r = await supabaseFetch("/agents", {
    method: "POST",
    headers: { "Prefer": "resolution=merge-duplicates,return=representation" },
    body: JSON.stringify(agent)
  });

  await supabaseFetch("/events", { method: "POST", body: JSON.stringify({
    level: "ok", source: agent.name, message: "Agent registered", target: agent.role,
    created_at: new Date().toISOString()
  })});

  const result = await r.json();
  return res.status(200).json({ agent: Array.isArray(result) ? result[0] : result });
};
