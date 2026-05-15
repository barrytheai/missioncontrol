const { cors, supabaseFetch, isAuthorized, readBody } = require("./_lib");
module.exports = async (req, res) => {
  cors(res);
  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  if (!isAuthorized(req)) return res.status(401).json({ error: "Agent token required" });
  const body = await readBody(req);
  if (!body.id) return res.status(400).json({ error: "Agent id required" });
  const updates = { status: body.status || "Connected", last_seen: new Date().toISOString(), ...(body.load !== undefined && { load: Number(body.load) }) };
  const r = await supabaseFetch(`/agents?id=eq.${body.id}`, { method: "PATCH", body: JSON.stringify(updates) });
  const result = await r.json();
  if (!result || (Array.isArray(result) && result.length === 0)) return res.status(404).json({ error: "Agent not registered" });
  return res.status(200).json({ agent: Array.isArray(result) ? result[0] : result });
};
