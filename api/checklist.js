const { cors, supabaseFetch, isAuthorized, readBody } = require("./_lib");

module.exports = async (req, res) => {
  cors(res);
  if (req.method === "OPTIONS") return res.status(204).end();

  const { id } = req.query;

  // GET /api/checklist?date=YYYY-MM-DD           → today's state
  // GET /api/checklist?weekStart=YYYY-MM-DD       → week's state (for 3x/week logic)
  // GET /api/checklist?setting=_post_launch_enabled → persistent setting
  // POST /api/checklist                           → upsert item state
  // POST /api/checklist?setting=1                 → upsert persistent setting

  if (req.method === "GET") {
    const { date, weekStart, setting } = req.query;

    if (setting) {
      // Persistent settings stored with date='settings'
      const r = await supabaseFetch(`/daily_checklist_state?date=eq.settings&item_key=eq.${encodeURIComponent(setting)}&select=*`);
      const rows = await r.json();
      return res.status(200).json({ rows: Array.isArray(rows) ? rows : [] });
    }

    if (weekStart) {
      // Fetch all rows for the given week (Mon–Sun) for 3x/week logic
      // weekStart = Monday date, weekEnd = Sunday
      const start = new Date(weekStart);
      const end = new Date(start);
      end.setDate(end.getDate() + 6);
      const endStr = end.toISOString().slice(0, 10);
      const r = await supabaseFetch(
        `/daily_checklist_state?date=gte.${weekStart}&date=lte.${endStr}&checked=eq.true&select=item_key,date`
      );
      const rows = await r.json();
      return res.status(200).json({ rows: Array.isArray(rows) ? rows : [] });
    }

    if (date) {
      const r = await supabaseFetch(`/daily_checklist_state?date=eq.${date}&select=*`);
      const rows = await r.json();
      return res.status(200).json({ rows: Array.isArray(rows) ? rows : [] });
    }

    return res.status(400).json({ error: "date or weekStart required" });
  }

  if (req.method === "POST") {
    if (!isAuthorized(req)) return res.status(401).json({ error: "Unauthorized" });

    const body = await readBody(req);
    const { date, item_key, checked, value } = body;

    if (!date || !item_key) {
      return res.status(400).json({ error: "date and item_key required" });
    }

    const row = {
      date: String(date),
      item_key: String(item_key),
      checked: Boolean(checked),
      updated_at: new Date().toISOString(),
    };
    if (value !== undefined) row.value = String(value);

    const r = await supabaseFetch("/daily_checklist_state", {
      method: "POST",
      headers: { Prefer: "resolution=merge-duplicates,return=representation" },
      body: JSON.stringify(row),
    });
    const result = await r.json();
    return res.status(200).json({ row: Array.isArray(result) ? result[0] : result });
  }

  return res.status(405).json({ error: "Method not allowed" });
};
