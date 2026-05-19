const { cors, supabaseFetch } = require("./_lib");
module.exports = async (req, res) => {
  cors(res);
  if (req.method === "OPTIONS") return res.status(204).end();
  const [ar, tr] = await Promise.all([
    supabaseFetch("/agents?select=id"),
    supabaseFetch("/tasks?select=id")
  ]);
  const [agents, tasks] = await Promise.all([ar.json(), tr.json()]);
  res.status(200).json({ ok: true, service: "OpenClaw Mission Control", serverTime: new Date().toISOString(), agents: Array.isArray(agents) ? agents.length : 0, tasks: Array.isArray(tasks) ? tasks.length : 0 });
};
