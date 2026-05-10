const STORAGE_KEY = "openclaw-task-control-board-v3";

const lanes = [
  { id: "plan", title: "Plan" },
  { id: "execute", title: "Execute" },
  { id: "review", title: "Review" },
  { id: "done", title: "Done" }
];

let agents = [
  { name: "Scout", role: "", status: "Connected" },
  { name: "Analyst", role: "", status: "Connected" },
  { name: "Builder", role: "", status: "Connected" },
  { name: "Guardian", role: "", status: "Run Health" },
  { name: "Operator", role: "", status: "Connected" },
  { name: "Scribe", role: "", status: "Connected" },
  { name: "Resolver", role: "", status: "Run Health" },
  { name: "Navigator", role: "", status: "Connected" }
];

const missionAgents = [
  { name: "Designer", role: "UI/UX", status: "Connected" },
  { name: "Builder", role: "Frontend", status: "Connected" },
  { name: "Optimizer", role: "Performance", status: "Run Health" }
];

const seedTasks = [
  {
    id: "m1",
    lane: "plan",
    title: "Q2 Market Analysis",
    description: "Analyze market trends and competitor positioning.",
    priority: "High",
    due: "May 23",
    status: "Planning",
    progress: 30,
    avatars: [11, 12, 14],
    activity: ["Task created", "Scout gathered competitor list", "Analyst started market scan"]
  },
  {
    id: "m2",
    lane: "plan",
    title: "Customer Feedback Loop",
    description: "Aggregate and summarize customer feedback.",
    priority: "Medium",
    due: "May 24",
    status: "Planning",
    progress: 18,
    avatars: [16, 20],
    activity: ["Scribe connected to feedback source", "Resolver waiting on segments"]
  },
  {
    id: "m3",
    lane: "plan",
    title: "Infra Cost Optimization",
    description: "Identify and reduce cloud spend.",
    priority: "Low",
    due: "May 25",
    status: "Planning",
    progress: 12,
    avatars: [13, 32],
    activity: ["Navigator mapped cost centers", "Builder preparing recommendations"]
  },
  {
    id: "m4",
    lane: "execute",
    title: "Website Redesign",
    description: "Redesign the marketing website and improve performance.",
    priority: "High",
    due: "May 22, 2025",
    status: "Executing",
    progress: 65,
    avatars: [20, 13, 33],
    activity: ["Task moved to Execute", "Builder started task", "Optimizer run health check"]
  },
  {
    id: "m5",
    lane: "execute",
    title: "Data Pipeline Migration",
    description: "Migrate ETL pipeline to the new platform.",
    priority: "Medium",
    due: "May 27",
    status: "Executing",
    progress: 48,
    avatars: [12, 15, 32],
    activity: ["Operator opened migration window", "Analyst verified source mappings"]
  },
  {
    id: "m6",
    lane: "review",
    title: "Security Audit",
    description: "Conduct a full security audit and remediation plan.",
    priority: "High",
    due: "May 26",
    status: "Review",
    progress: 80,
    avatars: [14, 15],
    activity: ["Guardian completed scan", "Operator requested review"]
  },
  {
    id: "m7",
    lane: "review",
    title: "Onboarding Flow Update",
    description: "Improve onboarding flow and user activation.",
    priority: "Medium",
    due: "May 28",
    status: "Review",
    progress: 72,
    avatars: [11, 47],
    activity: ["Scout completed journey map", "Resolver flagged copy issue"]
  },
  {
    id: "m8",
    lane: "done",
    title: "API Docs Overhaul",
    description: "Restructure and modernize API documentation.",
    priority: "Medium",
    due: "May 20",
    status: "Done",
    progress: 100,
    avatars: [16, 13],
    activity: ["Scribe published docs", "Builder merged examples"]
  },
  {
    id: "m9",
    lane: "done",
    title: "Release v1.4.0",
    description: "Shipped v1.4.0 to production successfully.",
    priority: "High",
    due: "May 19",
    status: "Done",
    progress: 100,
    avatars: [20, 12, 15],
    activity: ["Operator promoted release", "All agents reported healthy"]
  },
  {
    id: "m10",
    lane: "done",
    title: "Bug Bash Sprint",
    description: "Resolved critical bugs from latest release.",
    priority: "Low",
    due: "May 18",
    status: "Done",
    progress: 100,
    avatars: [13, 14],
    activity: ["Guardian closed incidents", "Resolver verified fixes"]
  }
];

let events = [
  ["10:24:18", "ok", "Task", "Website Redesign moved to Execute", "Alex Kim"],
  ["10:24:10", "info", "Builder", "Started task: Update hero component", "Website Redesign"],
  ["10:23:47", "ok", "Optimizer", "Run health check completed", "All systems normal"],
  ["10:23:31", "warn", "Guardian", "High memory usage detected", "82%"],
  ["10:22:59", "info", "Analyst", "Data sync completed", "Q2 Market Analysis"],
  ["10:22:41", "ok", "Scribe", "Documentation updated", "API Docs Overhaul"]
];

const state = {
  activeView: "mission-control",
  tasks: loadTasks(),
  selectedId: "m4",
  query: ""
};

const appContent = document.querySelector("#appContent");
const pageTitle = document.querySelector("#pageTitle");
const agentList = document.querySelector("#agentList");
let board = document.querySelector("#board");
let detailPanel = document.querySelector("#detailPanel");
let eventRows = document.querySelector("#eventRows");
const searchInput = document.querySelector("#searchInput");
const missionDialog = document.querySelector("#missionDialog");
const missionForm = document.querySelector("#missionForm");
const toast = document.querySelector("#toast");
const API_BASE = (window.OPENCLAW_API_BASE || localStorage.getItem("OPENCLAW_API_BASE") || "").replace(/\/$/, "");

function loadTasks() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : seedTasks;
  } catch {
    return seedTasks;
  }
}

function persist() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.tasks));
}

async function api(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {})
    },
    ...options
  });
  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }
  return response.json();
}

async function loadRemoteState(silent = false) {
  try {
    const remote = await api("/api/state");
    state.tasks = remote.tasks || state.tasks;
    agents = remote.agents || agents;
    events = remote.events || events;
    persist();
    render();
  } catch (error) {
    if (!silent) showToast("Using local preview data");
  }
}

function render() {
  renderAgents();
  renderActiveView();
}

function renderActiveView() {
  const titles = {
    "mission-control": "Mission Control",
    tasks: "Tasks",
    calendar: "Calendar",
    memory: "Memory",
    agents: "Agents",
    templates: "Templates",
    integrations: "Integrations",
    settings: "Settings"
  };

  pageTitle.textContent = titles[state.activeView] || "Mission Control";

  document.querySelectorAll("[data-view]").forEach((button) => {
    button.classList.toggle("active", button.dataset.view === state.activeView);
  });

  if (state.activeView === "mission-control" || state.activeView === "tasks") {
    appContent.classList.remove("single-view");
    appContent.innerHTML = taskBoardMarkup(state.activeView === "tasks");
    board = document.querySelector("#board");
    detailPanel = document.querySelector("#detailPanel");
    eventRows = document.querySelector("#eventRows");
    renderBoard();
    renderDetail();
    renderEvents();
    return;
  }

  appContent.classList.add("single-view");
  appContent.innerHTML = viewMarkup(state.activeView);
}

function taskBoardMarkup(compact = false) {
  return `
    <div class="board-area ${compact ? "tasks-focus" : ""}">
      <div class="board-toolbar">
        <button class="create-button" id="newMissionButton" type="button">
          Create Task
          <span></span>
          <svg viewBox="0 0 24 24"><path d="m7 10 5 5 5-5"></path></svg>
        </button>
        <div class="filter-actions">
          <button class="tool-button" type="button">
            <svg viewBox="0 0 24 24"><path d="M4 5h16l-6 7v5l-4 2v-7z"></path></svg>
            All Tasks
            <svg viewBox="0 0 24 24"><path d="m7 10 5 5 5-5"></path></svg>
          </button>
          <button class="tool-button" type="button">
            <svg viewBox="0 0 24 24"><path d="M4 7h16"></path><path d="M7 12h10"></path><path d="M10 17h4"></path></svg>
            Sort: Priority
            <svg viewBox="0 0 24 24"><path d="m7 10 5 5 5-5"></path></svg>
          </button>
        </div>
      </div>

      <div class="mission-board" id="board"></div>

      <section class="event-console">
        <div class="console-tabs">
          <button class="active" type="button">Event Console</button>
          <button type="button">Agent Status</button>
          <button type="button">System Health</button>
          <div class="console-tools">
            <button type="button">Pause</button>
            <button type="button">Clear</button>
            <button type="button">Filter</button>
          </div>
        </div>
        <div id="eventRows" class="event-rows"></div>
      </section>
    </div>

    <aside class="detail-panel" id="detailPanel"></aside>
  `;
}

function viewMarkup(view) {
  const views = {
    calendar: {
      eyebrow: "Schedule",
      title: "Calendar",
      copy: "Preview task timing, due dates, agent availability, and planned runs before wiring in a real calendar source.",
      body: calendarMarkup()
    },
    memory: {
      eyebrow: "Knowledge",
      title: "Memory",
      copy: "A place for agent memory, project facts, decisions, reusable context, and long-running task notes.",
      body: memoryMarkup()
    },
    agents: {
      eyebrow: "OpenClaw roster",
      title: "Agents",
      copy: "Review connected agents, run health, ownership, and what each agent is ready to do.",
      body: agentsMarkup()
    },
    templates: {
      eyebrow: "Reusable work",
      title: "Templates",
      copy: "Save repeatable task recipes for research, builds, reviews, releases, and incident response.",
      body: templatesMarkup()
    },
    integrations: {
      eyebrow: "Connections",
      title: "Integrations",
      copy: "Connect OpenClaw to GitHub, Linear, Slack, calendars, memory stores, and deployment systems.",
      body: integrationsMarkup()
    },
    settings: {
      eyebrow: "Workspace",
      title: "Settings",
      copy: "Configure workspace defaults, agent permissions, notifications, and audit preferences.",
      body: settingsMarkup()
    }
  };

  const current = views[view] || views.calendar;
  return `
    <div class="preview-area">
      <section class="preview-hero">
        <p>${current.eyebrow}</p>
        <h2>${current.title}</h2>
        <span>${current.copy}</span>
      </section>
      ${current.body}
    </div>
  `;
}

function calendarMarkup() {
  const days = ["Mon 20", "Tue 21", "Wed 22", "Thu 23", "Fri 24"];
  const items = [
    ["09:00", "Q2 Market Analysis", "Scout, Analyst"],
    ["11:30", "Website Redesign", "Designer, Builder"],
    ["14:00", "Security Audit", "Guardian"],
    ["16:30", "Data Pipeline Migration", "Operator"]
  ];
  return `
    <div class="calendar-preview">
      ${days.map((day, index) => `
        <section>
          <h3>${day}</h3>
          ${items.slice(0, index === 2 ? 4 : 2).map(([time, title, owner]) => `
            <button type="button">
              <strong>${time}</strong>
              <span>${title}</span>
              <small>${owner}</small>
            </button>
          `).join("")}
        </section>
      `).join("")}
    </div>
  `;
}

function memoryMarkup() {
  const memories = [
    ["Project facts", "Brand voice is concise, operational, and Linear-inspired."],
    ["Decisions", "Tasks replace missions in navigation and creation flows."],
    ["Agent notes", "Builder owns UI implementation; Optimizer owns run health."],
    ["Reusable context", "OpenClaw agents need webhook, API key, and memory hooks."]
  ];
  return `
    <div class="memory-grid">
      ${memories.map(([title, copy]) => `
        <article>
          <h3>${title}</h3>
          <p>${copy}</p>
          <button type="button">Open Memory</button>
        </article>
      `).join("")}
    </div>
  `;
}

function agentsMarkup() {
  return `
    <div class="preview-table">
      ${agents.map((agent, index) => `
        <button type="button">
          ${avatar(agent.name, index)}
          <span><strong>${agent.name}</strong><small>${agent.status}</small></span>
          <em>${agent.status === "Run Health" ? "Needs attention" : "Ready"}</em>
        </button>
      `).join("")}
    </div>
  `;
}

function templatesMarkup() {
  return cardGridMarkup([
    ["Research Sprint", "Gather sources, summarize findings, and create decision notes."],
    ["Frontend Build", "Assign Builder, track implementation, and request review."],
    ["Release Prep", "Coordinate checks, docs, changelog, and deployment readiness."],
    ["Incident Review", "Collect signals, identify cause, and capture prevention notes."]
  ]);
}

function integrationsMarkup() {
  return cardGridMarkup([
    ["GitHub", "Issues, pull requests, CI status, and code review loops."],
    ["Linear", "Sync tasks, priorities, owners, and status transitions."],
    ["Calendar", "Schedule runs, reviews, reminders, and availability windows."],
    ["Memory Store", "Persist project facts, task context, and agent notes."]
  ]);
}

function settingsMarkup() {
  return cardGridMarkup([
    ["Workspace", "Name, default task lanes, and visible navigation."],
    ["Permissions", "Which agents can read, write, deploy, or request approval."],
    ["Notifications", "Task updates, run health alerts, and review reminders."],
    ["Audit Trail", "Retention, event visibility, and export settings."]
  ]);
}

function cardGridMarkup(items) {
  return `
    <div class="memory-grid">
      ${items.map(([title, copy]) => `
        <article>
          <h3>${title}</h3>
          <p>${copy}</p>
          <button type="button">Preview</button>
        </article>
      `).join("")}
    </div>
  `;
}

function filteredTasks() {
  const query = state.query.trim().toLowerCase();
  if (!query) return state.tasks;
  return state.tasks.filter((mission) => {
    return [mission.title, mission.description, mission.priority, mission.status].join(" ").toLowerCase().includes(query);
  });
}

function renderAgents() {
  agentList.innerHTML = agents.map((agent, index) => `
    <button class="agent-row" type="button">
      ${avatar(agent.name, index)}
      <span>
        <strong>${agent.name}</strong>
        <small><i class="${agent.status === "Run Health" ? "warn" : ""}"></i>${agent.status || "Connected"}</small>
      </span>
    </button>
  `).join("");
}

function renderBoard() {
  const tasks = filteredTasks();
  board.innerHTML = lanes.map((lane) => {
    const laneTasks = tasks.filter((mission) => mission.lane === lane.id);
    return `
      <section class="lane ${lane.id === "execute" ? "focused" : ""}">
        <header class="lane-head">
          <h2>${lane.title}</h2>
          <span>${laneTasks.length}</span>
        </header>
        <div class="mission-stack">
          ${laneTasks.map(renderTaskCard).join("")}
        </div>
        <button class="add-mission" type="button" data-add-lane="${lane.id}">+ Add Task</button>
      </section>
    `;
  }).join("");
}

function renderTaskCard(mission) {
  const selected = mission.id === state.selectedId;
  const avatarIds = mission.avatars || (mission.agentIds || []).map((id, index) => index + id.length);
  return `
    <button class="mission-card ${selected ? "selected" : ""}" type="button" data-select="${mission.id}">
      <span class="card-menu">...</span>
      <strong>${mission.title}</strong>
      <p>${mission.description}</p>
      <span class="avatar-stack">
        ${avatarIds.map((id, index) => avatar(String(id), Number(id) + index || index)).join("")}
      </span>
      <span class="card-meta">
        <span class="priority ${mission.priority.toLowerCase()}">${mission.priority}</span>
        <span class="status-chip ${mission.status.toLowerCase()}">${statusIcon(mission.status)} ${mission.status}</span>
        <span class="due">
          <svg viewBox="0 0 24 24"><path d="M8 2v4"></path><path d="M16 2v4"></path><path d="M4 9h16"></path><path d="M5 5h14v16H5z"></path></svg>
          ${mission.due}
        </span>
      </span>
    </button>
  `;
}

function renderDetail() {
  const mission = state.tasks.find((item) => item.id === state.selectedId) || state.tasks[0];
  if (!mission) return;

  detailPanel.innerHTML = `
    <div class="detail-header">
      <span class="detail-status ${mission.status.toLowerCase()}">${mission.status}</span>
      <span>Task</span>
      <button type="button" aria-label="Close">x</button>
    </div>
    <h2>${mission.title}</h2>
    <p class="detail-description">${mission.description}</p>

    <div class="detail-grid">
      <div>
        <small>Priority</small>
        <strong><i class="${mission.priority.toLowerCase()}"></i>${mission.priority}</strong>
      </div>
      <div>
        <small>Due</small>
        <strong>
          <svg viewBox="0 0 24 24"><path d="M8 2v4"></path><path d="M16 2v4"></path><path d="M4 9h16"></path><path d="M5 5h14v16H5z"></path></svg>
          ${mission.due}
        </strong>
      </div>
    </div>

    <section class="detail-section">
      <h3>Agents</h3>
      <div class="detail-agents">
        ${missionAgents.map((agent, index) => `
          <div class="detail-agent">
            ${avatar(agent.name, index + 20)}
            <span>
              <strong>${agent.name}</strong>
              <small>${agent.role}</small>
            </span>
            <em class="${agent.status === "Run Health" ? "warn" : ""}">${agent.status}</em>
          </div>
        `).join("")}
        <button class="secondary-button" type="button">+ Add Agent</button>
      </div>
    </section>

    <section class="detail-section">
      <div class="progress-head">
        <h3>Progress</h3>
        <strong>${mission.progress}%</strong>
      </div>
      <div class="progress"><span style="width:${mission.progress}%"></span></div>
    </section>

    <section class="detail-section">
      <h3>Activity</h3>
      <ol class="activity">
        ${mission.activity.map((item, index) => `
          <li>
            <span class="${index === 1 ? "agent" : ""}">${index === 1 ? "*" : "ok"}</span>
            <div>
              <strong>${item}</strong>
              <small>${index === 0 ? "by Alex Kim" : index === 1 ? "index.html update" : "All systems normal"}</small>
            </div>
            <time>${index === 0 ? "2h ago" : index === 1 ? "1h ago" : "58m ago"}</time>
          </li>
        `).join("")}
      </ol>
    </section>

    <button class="open-mission" type="button">Open Task <span>-&gt;</span></button>
  `;
}

function renderEvents() {
  eventRows.innerHTML = events.map((event) => {
    const normalized = Array.isArray(event)
      ? { time: event[0], level: event[1], source: event[2], message: event[3], target: event[4] }
      : event;
    const time = formatEventTime(normalized.time);
    const level = normalized.level || "info";
    const source = normalized.source || "System";
    const message = normalized.message || "";
    const target = normalized.target || "";
    return `
      <div class="event-row">
        <time>${time}</time>
        <span class="event-icon ${level}">${level === "warn" ? "!" : level === "info" ? "i" : "ok"}</span>
        <strong>${source}</strong>
        <p>${message}</p>
        <em>${target}</em>
        <button type="button">...</button>
      </div>
    `;
  }).join("");
}

function formatEventTime(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value || "";
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
}
function statusIcon(status) {
  if (status === "Done") return "ok";
  if (status === "Review") return "review";
  if (status === "Executing") return "run";
  return "";
}

function avatar(name, index) {
  const label = Number.isNaN(Number(name)) ? name.slice(0, 1) : ["A", "K", "M", "S", "B", "N"][index % 6];
  return `<span class="avatar-face" style="--avatar-hue:${(index * 47) % 360}">${label}</span>`;
}

function openDialog(lane = "plan") {
  missionForm.reset();
  missionForm.elements.lane.value = lane;
  missionDialog.showModal();
  missionForm.elements.title.focus();
}

async function saveTask(formData) {
  const mission = {
    lane: formData.get("lane"),
    title: formData.get("title").trim(),
    description: formData.get("description").trim(),
    priority: formData.get("priority"),
    due: formData.get("due").trim() || "May 30",
    status: formData.get("lane") === "execute" ? "Executing" : formData.get("lane") === "review" ? "Review" : formData.get("lane") === "done" ? "Done" : "Planning",
    progress: 5,
    avatars: [11, 13],
    activity: ["Task created", "Scout assigned", "Waiting for first run"]
  };
  try {
    const result = await api("/api/tasks", {
      method: "POST",
      body: JSON.stringify(mission)
    });
    state.tasks.unshift(result.task);
    state.selectedId = result.task.id;
    await loadRemoteState();
  } catch {
    mission.id = crypto.randomUUID();
    state.tasks.unshift(mission);
    state.selectedId = mission.id;
    persist();
    render();
  }
  showToast("Task created");
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(showToast.timeout);
  showToast.timeout = setTimeout(() => toast.classList.remove("show"), 1600);
}

document.addEventListener("click", (event) => {
  const nav = event.target.closest("[data-view]");
  const select = event.target.closest("[data-select]");
  const addLane = event.target.closest("[data-add-lane]");
  const createTask = event.target.closest("#newMissionButton");

  if (nav) {
    state.activeView = nav.dataset.view;
    render();
  }

  if (select) {
    state.selectedId = select.dataset.select;
    render();
  }

  if (addLane) {
    openDialog(addLane.dataset.addLane);
  }

  if (createTask) {
    openDialog("plan");
  }
});
document.querySelector("#closeDialogButton").addEventListener("click", () => missionDialog.close());
document.querySelector("#cancelDialogButton").addEventListener("click", () => missionDialog.close());

searchInput.addEventListener("input", (event) => {
  state.query = event.target.value;
  if (state.activeView === "mission-control" || state.activeView === "tasks") {
    renderBoard();
  }
});

missionForm.addEventListener("submit", (event) => {
  event.preventDefault();
  saveTask(new FormData(missionForm));
  missionDialog.close();
});

render();
loadRemoteState();
setInterval(() => loadRemoteState(true), 5000);
