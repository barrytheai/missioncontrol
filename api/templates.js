const { cors, isAuthorized, readBody } = require("./_lib");

// Templates are stored in-memory/state on the frontend (localStorage)
// This endpoint allows agents to suggest new templates which get added to the feed
// Frontend polls this and merges into state.templates

let agentTemplates = [];

module.exports = async (req, res) => {
  cors(res);
  if (req.method === "OPTIONS") return res.status(204).end();

  if (req.method === "GET") {
    return res.status(200).json({ templates: agentTemplates });
  }

  if (req.method === "POST") {
    if (!isAuthorized(req)) return res.status(401).json({ error: "Agent token required" });
    const body = await readBody(req);
    const template = {
      id: crypto.randomUUID(),
      title: String(body.title || "Untitled").trim(),
      copy: String(body.copy || body.description || "").trim(),
      addedBy: body.agentId || "agent",
      addedAt: new Date().toISOString()
    };
    agentTemplates.unshift(template);
    return res.status(201).json({ template });
  }

  return res.status(405).json({ error: "Method not allowed" });
};
