const { cors, supabaseFetch, isAuthorized, readBody } = require("./_lib");

function normalizeScore(score) {
  const value = String(score || "MED").toUpperCase();
  return ["HIGH", "MED", "LOW"].includes(value) ? value : "MED";
}

module.exports = async (req, res) => {
  cors(res);
  if (req.method === "OPTIONS") return res.status(204).end();

  const { id } = req.query;

  if (req.method === "GET") {
    const r = await supabaseFetch("/scraper_items?select=*&order=captured_at.desc");
    const items = await r.json();
    return res.status(200).json({ items: Array.isArray(items) ? items : [] });
  }

  if (req.method === "POST") {
    if (!isAuthorized(req)) return res.status(401).json({ error: "Agent token required" });
    const body = await readBody(req);
    const item = {
      source: String(body.source || "web").trim(),
      platform: String(body.platform || body.sourceName || "Web Search").trim(),
      title: String(body.title || "Untitled scrape").trim(),
      url: String(body.url || body.link || "").trim(),
      score: normalizeScore(body.score || body.opportunity_score),
      pain: String(body.pain || body.pain_point || body.summary || "").trim(),
      suggestion: String(body.suggestion || body.suggested_action || body.action || "").trim(),
      quotes: Array.isArray(body.quotes) ? body.quotes : [],
      draft_comments: Array.isArray(body.draftComments) ? body.draftComments : (Array.isArray(body.draft_comments) ? body.draft_comments : []),
      tags: Array.isArray(body.tags) ? body.tags : [],
      captured_at: body.capturedAt || body.captured_at || new Date().toISOString()
    };
    const r = await supabaseFetch("/scraper_items", { method: "POST", body: JSON.stringify(item) });
    const result = await r.json();
    return res.status(201).json({ item: Array.isArray(result) ? result[0] : result });
  }

  if (req.method === "DELETE" && id) {
    if (!isAuthorized(req)) return res.status(401).json({ error: "Agent token required" });
    await supabaseFetch(`/scraper_items?id=eq.${id}`, { method: "DELETE" });
    return res.status(200).json({ ok: true });
  }

  return res.status(405).json({ error: "Method not allowed" });
};
