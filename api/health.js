const { cors, supabaseFetch } = require("./_lib");

module.exports = async (req, res) => {
  cors(res);
  if (req.method === "OPTIONS") return res.status(204).end();

  const r = await supabaseFetch("/agents?select=id");
  const agents = await r.json();
  const r2 = await supabaseFetch("/tasks?select=id");
  const tasks = await r2.json();

  res.status(200).json({
    ok: true,
    service: "OpenClaw Mission Control",
    serverTime: new Date().toISOString(),
    agents: Array.isArray(agents) ? agents.length : 0,
    tasks: Array.isArray(tasks) ? tasks.length : 0
  });
};
