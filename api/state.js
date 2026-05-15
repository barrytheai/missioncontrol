const { cors, supabaseFetch } = require("./_lib");
module.exports = async (req, res) => {
  cors(res);
  if (req.method === "OPTIONS") return res.status(204).end();
  const [ar, tr, er, mr] = await Promise.all([
    supabaseFetch("/agents?select=*&order=last_seen.desc"),
    supabaseFetch("/tasks?select=*&order=created_at.desc"),
    supabaseFetch("/events?select=*&order=created_at.desc&limit=80"),
    supabaseFetch("/memories?select=*&order=updated_at.desc")
  ]);
  const [agents, tasks, events, memories] = await Promise.all([ar.json(), tr.json(), er.json(), mr.json()]);
  res.status(200).json({ agents: Array.isArray(agents) ? agents : [], tasks: Array.isArray(tasks) ? tasks : [], events: Array.isArray(events) ? events : [], memories: Array.isArray(memories) ? memories : [], serverTime: new Date().toISOString() });
};
