const STORAGE_KEY = "openclaw-task-control-board-v3";
const AGENT_IMAGE_KEY = "openclaw-agent-images-v1";
const MEMORY_KEY = "openclaw-memories-v1";
const CALENDAR_KEY = "openclaw-calendar-items-v1";
const PROJECT_KEY = "openclaw-projects-v1";

const lanes = [
  { id: "plan", title: "Backlog" },
  { id: "execute", title: "In Progress" },
  { id: "review", title: "Review" },
  { id: "done", title: "Done" }
];

const defaultProjects = [
  {
    id: "quotecore-plus",
    title: "QuoteCore+",
    description: "Roofing quoting, measuring, ordering and job management SaaS. Live at quote-core.com. Marketing site, blog, email capture, and outbound pipeline in progress.",
    status: "Active",
    owner: "Cece",
    priority: "High",
    progress: 65,
    tasks: "Live"
  },
  {
    id: "t3labs",
    title: "T3Labs",
    description: "Premium digital product studio website. Scaffolded and live. Needs proper build-out to be client-presentable.",
    status: "Active",
    owner: "Cece",
    priority: "Medium",
    progress: 20,
    tasks: "In progress"
  },
  {
    id: "mission-control",
    title: "Mission Control",
    description: "Central dashboard for tasks, projects, agent activity and team coordination. Live on Vercel with Supabase backend.",
    status: "Active",
    owner: "Cece",
    priority: "High",
    progress: 75,
    tasks: "Live"
  },
  {
    id: "quotecore-outbound",
    title: "QuoteCore+ Cold Outbound",
    description: "333 verified contacts from MillionVerifier. 3-email sequence reviewed. Waiting on app readiness and Stripe before launch.",
    status: "Planning",
    owner: "Barry",
    priority: "High",
    progress: 40,
    tasks: "Blocked"
  }
];

let projects = loadProjects();

let agents = [
  { id: "cece", name: "Cece", role: "Founder", status: "Connected", model: "Human" },
  { id: "barry", name: "Barry", role: "Growth Agent", status: "Connected", model: "claude-sonnet-4-6" },
  { id: "robbie", name: "Robbie", role: "Marketing Execution", status: "Connected", model: "claude-sonnet-4-6" },
  { id: "emma", name: "Emma", role: "Social Listening", status: "Connected", model: "moonshot/kimi-k2.5" }
];

const missionAgents = [
  { name: "Cece", role: "Founder", status: "Connected" },
  { name: "Barry", role: "Growth Agent", status: "Connected" },
  { name: "Robbie", role: "Marketing Execution", status: "Connected" },
  { name: "Emma", role: "Social Listening", status: "Connected" }
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
    activity: ["Task moved to In Progress", "Builder started task", "Optimizer run health check"]
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
  ["10:24:18", "ok", "Task", "Website Redesign moved to In Progress", "Cece"],
  ["10:24:10", "info", "Barry", "Started task: Update hero component", "Website Redesign"],
  ["10:23:47", "ok", "Barry", "Run health check completed", "All systems normal"],
  ["10:23:31", "warn", "Barry", "High memory usage detected", "82%"],
  ["10:22:59", "info", "Robbie", "Data sync completed", "Q2 Market Analysis"],
  ["10:22:41", "ok", "Robbie", "Documentation updated", "API Docs Overhaul"]
];

const state = {
  activeView: "tasks",
  tasks: loadTasks(),
  selectedId: "m4",
  query: "",
  filter: "all",
  sort: "priority",
  draggedId: null,
  editorDirty: false,
  agentImages: loadAgentImages(),
  memories: loadMemories(),
  calendarItems: loadCalendarItems(),
  calendarWeekOffset: 0,
  calendarComposerOpen: false,
  memoryComposerOpen: false,
  openMemoryId: null,
  openCalendarItemId: null,
  previewPanel: null,
  editTemplateIndex: null,
  editIntegrationIndex: null,
  templates: [
    { title: "Research Sprint", copy: "Gather sources, summarize findings, and create decision notes." },
    { title: "Frontend Build", copy: "Assign Builder, track implementation, and request review." },
    { title: "Release Prep", copy: "Coordinate checks, docs, changelog, and deployment readiness." },
    { title: "Incident Review", copy: "Collect signals, identify cause, and capture prevention notes." }
  ],
  integrations: [
    { title: "GitHub", copy: "Issues, pull requests, CI status, and code review loops." },
    { title: "Linear", copy: "Sync tasks, priorities, owners, and status transitions." },
    { title: "Calendar", copy: "Schedule runs, reviews, reminders, and availability windows." },
    { title: "Memory Store", copy: "Persist project facts, task context, and agent notes." }
  ],
  projectView: "active",
  notificationsOpen: false,
  userInitials: localStorage.getItem("OPENCLAW_USER_INITIALS") || "CC"
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
const userAvatarButton = document.querySelector("#userAvatarButton");
const notificationsPanel = document.querySelector("#notificationsPanel");
const API_BASE = (window.OPENCLAW_API_BASE || localStorage.getItem("OPENCLAW_API_BASE") || "").replace(/\/$/, "");

function loadTasks() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : seedTasks;
  } catch {
    return seedTasks;
  }
}

function loadAgentImages() {
  try {
    return JSON.parse(localStorage.getItem(AGENT_IMAGE_KEY) || "{}");
  } catch {
    return {};
  }
}

function persistAgentImages() {
  localStorage.setItem(AGENT_IMAGE_KEY, JSON.stringify(state.agentImages));
}

function loadMemories() {
  const defaults = [
    { id: "mem-1", title: "Project facts", body: "Brand voice is concise, operational, and Linear-inspired." },
    { id: "mem-2", title: "Decisions", body: "Tasks replace missions in navigation and creation flows." },
    { id: "mem-3", title: "Agent notes", body: "Barry handles growth and deployment. Robbie handles research and content. Emma handles social listening." },
    { id: "mem-4", title: "Reusable context", body: "OpenClaw agents need webhook, API key, and memory hooks." }
  ];
  try {
    return JSON.parse(localStorage.getItem(MEMORY_KEY) || "null") || defaults;
  } catch {
    return defaults;
  }
}

function persistMemories() {
  localStorage.setItem(MEMORY_KEY, JSON.stringify(state.memories));
}

function loadCalendarItems() {
  try {
    return JSON.parse(localStorage.getItem(CALENDAR_KEY) || "[]");
  } catch {
    return [];
  }
}

function persistCalendarItems() {
  localStorage.setItem(CALENDAR_KEY, JSON.stringify(state.calendarItems));
}

function loadProjects() {
  try {
    return JSON.parse(localStorage.getItem(PROJECT_KEY) || "null") || defaultProjects;
  } catch {
    return defaultProjects;
  }
}

function persistProjects() {
  localStorage.setItem(PROJECT_KEY, JSON.stringify(projects));
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
  if (state.editorDirty) return;
  try {
    const remote = await api("/api/state");
    state.tasks = remote.tasks || state.tasks;
    agents = normalizeAgents(remote.agents || agents);
    events = remote.events || events;
    persist();
    render();
  } catch (error) {
    if (!silent) showToast("Using local preview data");
  }
}

function render() {
  userAvatarButton.textContent = state.userInitials;
  renderAgents();
  renderNotifications();
  renderActiveView();
}

function renderActiveView() {
  const titles = {
    tasks: "Tasks",
    "task-detail": "Task",
    approvals: "Approvals",
    projects: "Projects",
    calendar: "Calendar",
    memory: "Memory",
    agents: "Agents",
    templates: "Templates",
    integrations: "Integrations",
    settings: "Settings"
  };

  pageTitle.textContent = titles[state.activeView] || "Tasks";

  document.querySelectorAll("[data-view]").forEach((button) => {
    button.classList.toggle("active", button.dataset.view === state.activeView);
  });

  if (state.activeView === "tasks") {
    appContent.classList.remove("single-view");
    appContent.classList.toggle("detail-closed", !state.selectedId);
    appContent.innerHTML = taskBoardMarkup();
    board = document.querySelector("#board");
    detailPanel = document.querySelector("#detailPanel");
    eventRows = document.querySelector("#eventRows");
    renderBoard();
    renderDetail();
    renderEvents();
    return;
  }

  if (state.activeView === "task-detail") {
    appContent.classList.add("single-view");
    appContent.classList.remove("detail-closed");
    appContent.innerHTML = taskWorkspaceMarkup();
    return;
  }

  appContent.classList.add("single-view");
  appContent.classList.remove("detail-closed");
  appContent.innerHTML = viewMarkup(state.activeView);
}

function taskBoardMarkup() {
  return `
    <div class="board-area tasks-focus">
      <div class="board-toolbar">
        <button class="create-button" id="newMissionButton" type="button">
          Create Task
          <span></span>
          <svg viewBox="0 0 24 24"><path d="m7 10 5 5 5-5"></path></svg>
        </button>
        <div class="filter-actions">
          <button class="tool-button" type="button" data-filter-toggle>
            <svg viewBox="0 0 24 24"><path d="M4 5h16l-6 7v5l-4 2v-7z"></path></svg>
            ${filterLabel()}
            <svg viewBox="0 0 24 24"><path d="m7 10 5 5 5-5"></path></svg>
          </button>
          <button class="tool-button" type="button" data-sort-toggle>
            <svg viewBox="0 0 24 24"><path d="M4 7h16"></path><path d="M7 12h10"></path><path d="M10 17h4"></path></svg>
            Sort: ${sortLabel()}
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

    ${state.selectedId ? `<aside class="detail-panel" id="detailPanel"></aside>` : ""}
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
    approvals: {
      eyebrow: "Waiting on you",
      title: "Approvals",
      copy: "A focused queue for anything your agents need you to approve before they continue.",
      body: approvalsMarkup()
    },
    projects: {
      eyebrow: "Portfolio",
      title: "Projects",
      copy: "See the active workstreams your agents are moving forward and what needs attention.",
      body: projectsMarkup()
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

function taskWorkspaceMarkup() {
  const task = state.tasks.find((item) => item.id === state.selectedId);
  if (!task) {
    state.activeView = "tasks";
    return taskBoardMarkup();
  }
  const assignedAgents = getTaskAgents(task);
  return `
    <div class="task-workspace">
      <div class="workspace-bar">
        <button class="secondary-button" type="button" data-back-to-tasks>Back to Tasks</button>
        <div class="workspace-actions">
          <button class="secondary-button" type="button" data-save-task-edit="${task.id}">Save Changes</button>
          <button class="danger-button" type="button" data-delete-task="${task.id}">Delete Task</button>
        </div>
      </div>
      <section class="workspace-hero">
        <span class="detail-status ${task.status.toLowerCase()}">${task.status}</span>
        <label class="workspace-field">
          Task title
          <input data-edit-title value="${escapeAttribute(task.title)}">
        </label>
        <label class="workspace-field">
          Description
          <textarea data-edit-description rows="3">${escapeHtml(task.description)}</textarea>
        </label>
      </section>
      <div class="workspace-grid">
        <article>
          <h3>Task Details</h3>
          <div class="edit-grid">
            <label>Project<select data-edit-project>${projectOptions(task.projectId)}</select></label>
            <label>Priority<select data-edit-priority>${["High", "Medium", "Low"].map((priority) => `<option ${task.priority === priority ? "selected" : ""}>${priority}</option>`).join("")}</select></label>
            <label>Due<input type="date" data-edit-due value="${dateInputValue(task.due)}"></label>
            <label>Progress<input type="number" min="0" max="100" data-edit-progress value="${Number(task.progress || 0)}"></label>
            <label>Lane<select data-edit-lane>${lanes.map((lane) => `<option value="${lane.id}" ${task.lane === lane.id ? "selected" : ""}>${lane.title}</option>`).join("")}</select></label>
          </div>
        </article>
        <article>
          <h3>Assigned Agents</h3>
          <div class="workspace-agents assigned-only">
            ${assignedAgents.length ? assignedAgents.map((agent, index) => `
              <div class="detail-agent">
                ${agentAvatar(agent, index + 30)}
                <span><strong>${agent.name}</strong><small>${agent.role || "Agent"} · ${agent.model || "Model not reported"}</small></span>
                <em class="${agent.status === "Run Health" ? "warn" : ""}">${agent.status || "Connected"}</em>
                <button class="agent-remove" type="button" data-workspace-remove-agent="${agentKey(agent)}">Remove</button>
              </div>
            `).join("") : `<p class="empty-agents">No agents assigned yet.</p>`}
            <div class="add-agent-control">
              <select data-workspace-agent-select>
                ${agents
                  .filter((agent) => !assignedAgents.some((assigned) => agentKey(assigned) === agentKey(agent)))
                  .map((agent) => `<option value="${agentKey(agent)}">${agent.name}</option>`)
                  .join("")}
              </select>
              <button class="secondary-button" type="button" data-workspace-add-agent>+ Add Agent</button>
            </div>
          </div>
        </article>
        <article>
          <h3>Activity</h3>
          <ol class="activity compact">
            ${(task.activity || []).map((item) => {
              const activity = normalizeActivity(item, task);
              return `
              <li>
                <button class="activity-icon" type="button" data-activity-detail="${escapeAttribute(activity.detail)}">i</button>
                <button class="activity-row-button" type="button" data-activity-detail="${escapeAttribute(activity.detail)}">
                  <span><strong>${activity.label}</strong><small>by ${activity.actor}</small></span>
                  <time>${formatActivityTime(activity.at)}</time>
                </button>
              </li>
            `;}).join("")}
          </ol>
        </article>
      </div>
    </div>
  `;
}

function approvalsMarkup() {
  const approvalTasks = state.tasks.filter((task) => task.lane === "review" || task.priority === "High");
  return `
    <div class="approval-list">
      ${approvalTasks.map((task) => `
        <article class="approval-card">
          <div>
            <span class="detail-status ${task.status.toLowerCase()}">${task.status}</span>
            <h3>${task.title}</h3>
            <p>${task.description}</p>
            <small>${getTaskAgents(task).map((agent) => agent.name).join(", ") || "No agent assigned"} wants approval by ${formatDueDate(task.due)}.</small>
          </div>
          <div class="approval-actions">
            <button class="secondary-button" type="button" data-open-approval="${task.id}">Review</button>
            <button class="create-button compact" type="button" data-approve-task="${task.id}">Approve</button>
            <button class="danger-button compact" type="button" data-reject-task="${task.id}">Reject</button>
          </div>
        </article>
      `).join("") || `<article class="approval-card"><div><h3>No approvals waiting</h3><p>Your approval queue is clear.</p></div></article>`}
    </div>
  `;
}

function projectsMarkup() {
  const activeProjects = projects.filter((project) => !project.archivedAt);
  const archivedProjects = projects.filter((project) => project.archivedAt);
  const visibleProjects = state.projectView === "archived" ? archivedProjects : activeProjects;
  return `
    <div class="projects-header">
      <strong>${projects.length} total</strong>
      <span>${activeProjects.length} active</span>
      <span>${archivedProjects.length} archived</span>
      <button class="${state.projectView === "active" ? "active" : ""}" type="button" data-project-view="active">Active</button>
      <button class="${state.projectView === "archived" ? "active" : ""}" type="button" data-project-view="archived">Archived</button>
    </div>
    <div class="projects-grid">
      ${visibleProjects.map((project, index) => `
        <article class="project-card">
          <div class="project-top">
            <input class="project-title-input" value="${escapeAttribute(project.title)}" data-project-field="${project.id}" data-field="title" ${project.archivedAt ? "disabled" : ""}>
            <select class="${project.status.toLowerCase()}" data-project-field="${project.id}" data-field="status" ${project.archivedAt ? "disabled" : ""}>
              ${["Active", "Planning", "Paused"].map((status) => `<option ${project.status === status ? "selected" : ""}>${status}</option>`).join("")}
            </select>
          </div>
          <textarea class="project-description-input" rows="2" data-project-field="${project.id}" data-field="description" ${project.archivedAt ? "disabled" : ""}>${escapeHtml(project.description)}</textarea>
          <div class="project-progress">
            <span style="width:${project.progress}%"></span>
          </div>
          <div class="project-meta">
            ${avatar(project.owner, index + 8)}
            <input value="${escapeAttribute(project.owner)}" data-project-field="${project.id}" data-field="owner" ${project.archivedAt ? "disabled" : ""}>
            <input value="${escapeAttribute(project.tasks)}" data-project-field="${project.id}" data-field="tasks" ${project.archivedAt ? "disabled" : ""}>
            <select class="${project.priority.toLowerCase()}" data-project-field="${project.id}" data-field="priority" ${project.archivedAt ? "disabled" : ""}>
              ${["High", "Medium", "Low"].map((priority) => `<option ${project.priority === priority ? "selected" : ""}>${priority}</option>`).join("")}
            </select>
          </div>
          <div class="project-edit-row">
            <label>Progress <input type="number" min="0" max="100" value="${project.progress}" data-project-field="${project.id}" data-field="progress" ${project.archivedAt ? "disabled" : ""}></label>
            ${project.archivedAt
              ? `<span>Archived ${formatDateTime(project.archivedAt)}</span>
                 <button class="danger-button compact" type="button" data-delete-project="${project.id}">Delete</button>`
              : `<button class="secondary-button" type="button" data-save-project="${project.id}">Save</button>
                 <button class="secondary-button compact" type="button" data-archive-project="${project.id}">Archive</button>
                 <button class="danger-button compact" type="button" data-delete-project="${project.id}">Delete</button>`}
          </div>
        </article>
      `).join("") || `<article class="project-card"><h3>No ${state.projectView} projects</h3><p>Nothing to show here yet.</p></article>`}
    </div>
  `;
}

function projectOptions(selectedId = "") {
  return `<option value="">No project</option>${projects.filter((project) => !project.archivedAt).map((project) => `
    <option value="${project.id}" ${selectedId === project.id ? "selected" : ""}>${project.title}</option>
  `).join("")}`;
}

function canArchiveProject(project) {
  const [done, total] = String(project.tasks || "0/0").split("/").map((value) => Number(value));
  return Number(project.progress) >= 100 && total > 0 && done >= total;
}

function saveProject(id) {
  saveProjectFields(id);
  state.editorDirty = false;
  persistProjects();
  render();
  showToast("Project saved");
}

function saveProjectFields(id) {
  const project = projects.find((item) => item.id === id);
  if (!project || project.archivedAt) return;
  document.querySelectorAll(`[data-project-field="${id}"]`).forEach((field) => {
    const key = field.dataset.field;
    project[key] = key === "progress" ? Number(field.value || 0) : field.value;
  });
}

function archiveProject(id) {
  saveProjectFields(id);
  const project = projects.find((item) => item.id === id);
  if (!project) return;
  project.archivedAt = new Date().toISOString();
  project.status = "Archived";
  state.editorDirty = false;
  persistProjects();
  state.projectView = "archived";
  render();
  showToast("Project archived");
}

function deleteProject(id) {
  const project = projects.find((item) => item.id === id);
  projects = projects.filter((item) => item.id !== id);
  state.editorDirty = false;
  persistProjects();
  render();
  showToast(`${project?.title || "Project"} deleted`);
}

function projectTitle(id) {
  return projects.find((project) => project.id === id)?.title || "No project";
}

function laneTitle(id) {
  return lanes.find((lane) => lane.id === id)?.title || id || "No lane";
}

function agentNames(joinedIds) {
  if (!joinedIds) return "none";
  return joinedIds.split(",").filter(Boolean).map((id) => agents.find((agent) => agentKey(agent) === id)?.name || id).join(", ") || "none";
}

function weekDays(offset) {
  const today = new Date();
  const monday = new Date(today);
  const day = monday.getDay() || 7;
  monday.setDate(monday.getDate() - day + 1 + offset * 7);
  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(monday);
    date.setDate(monday.getDate() + index);
    return {
      date: dateInputValue(date),
      label: date.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" })
    };
  });
}

function calendarItemsForDay(date) {
  const seeded = [
    { id: "seed-cal-1", date: weekDays(0)[0].date, time: "09:00", title: "Q2 Market Analysis", owner: "Scout, Analyst", notes: "Market trend review and competitor scan." },
    { id: "seed-cal-2", date: weekDays(0)[1].date, time: "11:30", title: "Website Redesign", owner: "Designer, Builder", notes: "Design and frontend implementation check-in." },
    { id: "seed-cal-3", date: weekDays(0)[2].date, time: "14:00", title: "Security Audit", owner: "Guardian", notes: "Security audit review and remediation planning." }
  ];
  const liveItems = state.calendarItems.filter((item) => !item.deleted);
  const overridden = new Set(state.calendarItems.map((item) => item.id));
  return [...seeded.filter((item) => !overridden.has(item.id)), ...expandedRecurringItems(liveItems, date)]
    .filter((item) => item.date === date);
}

function allCalendarItems() {
  const seeded = weekDays(0).flatMap((day) => calendarItemsForDay(day.date)).filter((item) => String(item.id).startsWith("seed-"));
  return [...seeded, ...state.calendarItems.filter((item) => !item.deleted)];
}

function expandedRecurringItems(items, date) {
  return items.flatMap((item) => {
    if (!item.recurring || item.recurring === "none" || item.date === date) return [item];
    const start = parseDueDate(item.date);
    const current = parseDueDate(date);
    if (!start || !current || current < start) return [];
    if (item.recurring === "daily") return [{ ...item, date }];
    if (item.recurring === "weekly" && current.getDay() === start.getDay()) return [{ ...item, date }];
    if (item.recurring === "monthly" && current.getDate() === start.getDate()) return [{ ...item, date }];
    return [];
  });
}

function calendarComposerMarkup() {
  const item = state.openCalendarItemId ? allCalendarItems().find((entry) => entry.id === state.openCalendarItemId) : null;
  const recurring = item?.recurring || "none";
  return `
    <section class="inline-composer">
      <label>Title<input data-calendar-title placeholder="Planning review" value="${escapeAttribute(item?.title || "")}"></label>
      <label>Date<input type="date" data-calendar-date value="${item?.date || weekDays(state.calendarWeekOffset)[0].date}"></label>
      <label>Time<input data-calendar-time value="${escapeAttribute(item?.time || "09:00")}"></label>
      <label>Owner<input data-calendar-owner value="${escapeAttribute(item?.owner || "Cece")}"></label>
      <label>Recurring
        <select data-calendar-recurring>
          ${["none", "daily", "weekly", "monthly"].map((option) => `<option value="${option}" ${recurring === option ? "selected" : ""}>${option === "none" ? "Does not repeat" : option[0].toUpperCase() + option.slice(1)}</option>`).join("")}
        </select>
      </label>
      <label class="wide">Notes<textarea data-calendar-notes rows="2" placeholder="Add useful context">${escapeHtml(item?.notes || "")}</textarea></label>
      <div class="composer-actions">
        <button class="secondary-button" type="button" data-calendar-cancel>Cancel</button>
        ${item ? `<button class="danger-button compact" type="button" data-calendar-delete="${item.id}">Delete Item</button>` : ""}
        <button class="create-button compact" type="button" data-calendar-save>${item ? "Save Changes" : "Save Item"}</button>
      </div>
    </section>
  `;
}

function memoryComposerMarkup() {
  const memory = state.openMemoryId ? state.memories.find((item) => item.id === state.openMemoryId) : null;
  return `
    <section class="inline-composer memory-composer">
      <label>Title<input data-memory-title placeholder="Decision, project fact, reusable context..." value="${escapeAttribute(memory?.title || "")}"></label>
      <label class="wide">Memory<textarea data-memory-body rows="3" placeholder="Write the memory">${escapeHtml(memory?.body || "")}</textarea></label>
      <div class="composer-actions">
        <button class="secondary-button" type="button" data-memory-cancel>Cancel</button>
        ${memory ? `<button class="danger-button compact" type="button" data-memory-delete="${memory.id}">Delete Memory</button>` : ""}
        <button class="create-button compact" type="button" data-memory-save>${memory ? "Save Changes" : "Save Memory"}</button>
      </div>
    </section>
  `;
}

function calendarMarkup() {
  const days = weekDays(state.calendarWeekOffset);
  return `
    <div class="view-actions">
      <button class="secondary-button" type="button" data-calendar-prev>Previous Week</button>
      <button class="create-button compact" type="button" data-calendar-add>Add Calendar Item</button>
      <button class="secondary-button" type="button" data-calendar-next>Next Week</button>
    </div>
    ${(state.calendarComposerOpen || state.openCalendarItemId) ? calendarComposerMarkup() : ""}
    <div class="calendar-preview">
      ${days.map((day) => `
        <section>
          <h3>${day.label}</h3>
          ${calendarItemsForDay(day.date).map((item) => `
            <button type="button" data-calendar-open="${item.id}">
              <strong>${item.time}</strong>
              <span>${item.title}</span>
              <small>${item.owner}</small>
            </button>
          `).join("") || `<p class="empty-day">No items</p>`}
        </section>
      `).join("")}
    </div>
  `;
}

function memoryMarkup() {
  return `
    <div class="view-actions">
      <button class="create-button compact" type="button" data-add-memory>Create Memory</button>
    </div>
    ${(state.memoryComposerOpen || state.openMemoryId) ? memoryComposerMarkup() : ""}
    <div class="memory-grid">
      ${state.memories.map((memory) => `
        <article>
          <h3>${memory.title}</h3>
          <p>${memory.body}</p>
          <button type="button" data-open-memory="${memory.id}">Open Memory</button>
        </article>
      `).join("")}
    </div>
  `;
}

function agentsMarkup() {
  return `
    <div class="preview-table agent-directory">
      ${agents.map((agent, index) => `
        <article class="agent-directory-row">
          ${agentAvatar(agent, index)}
          <span><strong>${agent.name}</strong><small>${agent.role || "Agent"} · ${agent.model || "Model not reported"}</small></span>
          <em class="${agentStatusClass(agent)}">${agentStatusLabel(agent)}</em>

        </article>
      `).join("")}
    </div>
  `;
}

function templatesMarkup() {
  const items = state.templates;
  return `
    <div class="memory-grid">
      ${items.map((tpl, i) => `
        <article>
          ${state.editTemplateIndex === i ? `
            <input type="text" data-template-edit-title value="${escapeAttribute(tpl.title)}" style="width:100%;margin-bottom:6px;">
            <textarea data-template-edit-copy rows="3" style="width:100%;">${escapeHtml(tpl.copy)}</textarea>
            <div style="display:flex;gap:8px;margin-top:8px;">
              <button type="button" data-save-template="${i}">Save</button>
              <button type="button" class="secondary-button" data-cancel-template-edit>Cancel</button>
            </div>
          ` : `
            <h3>${escapeHtml(tpl.title)}</h3>
            <p>${escapeHtml(tpl.copy)}</p>
            <div style="display:flex;gap:8px;">
              <button type="button" data-preview-card="${escapeAttribute(tpl.title)}" data-preview-copy="${escapeAttribute(tpl.copy)}">Preview</button>
              <button type="button" class="secondary-button" data-edit-template="${i}">Edit</button>
              <button type="button" class="secondary-button" data-delete-template="${i}">Delete</button>
            </div>
          `}
        </article>
      `).join("")}
    </div>
    ${state.previewPanel ? `
      <section class="inline-detail-panel">
        <div>
          <h3>${state.previewPanel.title}</h3>
          <p>${state.previewPanel.copy}</p>
        </div>
        <button class="close-button icon-close" type="button" data-close-preview>&times;</button>
      </section>
    ` : ""}
  `;
}

function integrationsMarkup() {
  const items = state.integrations;
  return `
    <div class="memory-grid">
      ${items.map((item, i) => `
        <article>
          ${state.editIntegrationIndex === i ? `
            <input type="text" data-integration-edit-title value="${escapeAttribute(item.title)}" style="width:100%;margin-bottom:6px;">
            <textarea data-integration-edit-copy rows="3" style="width:100%;">${escapeHtml(item.copy)}</textarea>
            <div style="display:flex;gap:8px;margin-top:8px;">
              <button type="button" data-save-integration="${i}">Save</button>
              <button type="button" class="secondary-button" data-cancel-integration-edit>Cancel</button>
            </div>
          ` : `
            <h3>${escapeHtml(item.title)}</h3>
            <p>${escapeHtml(item.copy)}</p>
            <div style="display:flex;gap:8px;">
              <button type="button" data-preview-card="${escapeAttribute(item.title)}" data-preview-copy="${escapeAttribute(item.copy)}">Preview</button>
              <button type="button" class="secondary-button" data-edit-integration="${i}">Edit</button>
              <button type="button" class="secondary-button" data-delete-integration="${i}">Delete</button>
            </div>
          `}
        </article>
      `).join("")}
    </div>
    ${state.previewPanel ? `
      <section class="inline-detail-panel">
        <div>
          <h3>${state.previewPanel.title}</h3>
          <p>${state.previewPanel.copy}</p>
        </div>
        <button class="close-button icon-close" type="button" data-close-preview>&times;</button>
      </section>
    ` : ""}
  `;
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
          <button type="button" data-preview-card="${escapeAttribute(title)}" data-preview-copy="${escapeAttribute(copy)}">Preview</button>
        </article>
      `).join("")}
    </div>
    ${state.previewPanel ? `
      <section class="inline-detail-panel">
        <div>
          <h3>${state.previewPanel.title}</h3>
          <p>${state.previewPanel.copy}</p>
        </div>
        <button class="close-button icon-close" type="button" data-close-preview>&times;</button>
      </section>
    ` : ""}
  `;
}

function filteredTasks() {
  const query = state.query.trim().toLowerCase();
  const priorityRank = { High: 0, Medium: 1, Low: 2 };
  return state.tasks
    .filter((mission) => {
      if (state.filter === "active" && !["plan", "execute", "review"].includes(mission.lane)) return false;
      if (state.filter === "high" && mission.priority !== "High") return false;
      if (state.filter === "approval" && mission.lane !== "review" && mission.priority !== "High") return false;
      if (!query) return true;
      return [mission.title, mission.description, mission.priority, mission.status].join(" ").toLowerCase().includes(query);
    })
    .sort((a, b) => {
      if (state.sort === "due") return (parseDueDate(a.due)?.getTime() || 0) - (parseDueDate(b.due)?.getTime() || 0);
      if (state.sort === "progress") return Number(b.progress || 0) - Number(a.progress || 0);
      return (priorityRank[a.priority] ?? 9) - (priorityRank[b.priority] ?? 9);
    });
}

function renderAgents() {
  agentList.innerHTML = agents.map((agent, index) => `
    <button class="agent-row" type="button">
      ${agentAvatar(agent, index)}
      <span>
        <strong>${agent.name}</strong>
        <small><i class="${agentStatusClass(agent)}"></i>${agent.status || "Connected"} · ${agent.model || "Model unknown"}</small>
      </span>
    </button>
  `).join("");
}

function renderDialogAgents() {
  const dialogAgentList = document.querySelector("#dialogAgentList");
  const projectSelect = document.querySelector("#taskProjectSelect");
  if (projectSelect) projectSelect.innerHTML = projectOptions();
  if (!dialogAgentList) return;
  dialogAgentList.innerHTML = agents.map((agent, index) => `
    <label>
      <input type="checkbox" name="agentIds" value="${agentKey(agent)}">
      ${agentAvatar(agent, index)}
      <span><strong>${agent.name}</strong><small>${agent.role || agent.status || "Agent"}</small></span>
    </label>
  `).join("");
}

function renderBoard() {
  const tasks = filteredTasks();
  board.innerHTML = lanes.map((lane) => {
    const laneTasks = tasks.filter((mission) => mission.lane === lane.id);
    return `
      <section class="lane ${lane.id === "execute" ? "focused" : ""}" data-lane="${lane.id}">
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
  const assignedAgents = getTaskAgents(mission);
  const avatarIds = mission.avatars || [];
  return `
    <button class="mission-card ${selected ? "selected" : ""}" type="button" data-select="${mission.id}" draggable="true">
      <span class="card-menu">...</span>
      <strong>${mission.title}</strong>
      <p>${mission.description}</p>
      <span class="avatar-stack">
        ${assignedAgents.length
          ? assignedAgents.map((agent, index) => agentAvatar(agent, index + 10)).join("")
          : avatarIds.map((id, index) => avatar(String(id), Number(id) + index || index)).join("")}
      </span>
      <span class="card-meta">
        <span class="priority ${mission.priority.toLowerCase()}">${mission.priority}</span>
        <span class="status-chip ${mission.status.toLowerCase()}">${statusIcon(mission.status)} ${mission.status}</span>
        <span class="due">
          <svg viewBox="0 0 24 24"><path d="M8 2v4"></path><path d="M16 2v4"></path><path d="M4 9h16"></path><path d="M5 5h14v16H5z"></path></svg>
          ${formatDueDate(mission.due)}
        </span>
      </span>
    </button>
  `;
}

function renderDetail() {
  if (!detailPanel) return;
  const mission = state.tasks.find((item) => item.id === state.selectedId);
  if (!mission) {
    return;
  }
  const assignedAgents = getTaskAgents(mission);

  detailPanel.innerHTML = `
    <div class="detail-header">
      <span class="detail-status ${mission.status.toLowerCase()}">${mission.status}</span>
      <span>Task</span>
      <button class="close-button icon-close" type="button" aria-label="Close" data-close-detail>&times;</button>
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
          ${formatDueDate(mission.due)}
        </strong>
      </div>
    </div>

    <section class="detail-section">
      <h3>Agents</h3>
      <div class="detail-agents">
        ${assignedAgents.length ? assignedAgents.map((agent, index) => `
          <div class="detail-agent">
            ${agentAvatar(agent, index + 20)}
            <span>
              <strong>${agent.name}</strong>
              <small>${agent.role || "Agent"}</small>
            </span>
            <em class="${agent.status === "Run Health" ? "warn" : ""}">${agent.status || "Connected"}</em>
            <button class="agent-remove" type="button" data-remove-agent="${agent.id || agent.name}">Remove</button>
          </div>
        `).join("") : `<p class="empty-agents">No agents assigned yet.</p>`}
        <button class="secondary-button" type="button" data-add-agent>+ Add Agent</button>
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
        ${mission.activity.map((item, index) => {
          const activity = normalizeActivity(item, mission);
          return `
          <li>
            <button class="activity-icon ${index === 1 ? "agent" : ""}" type="button" data-activity-detail="${escapeAttribute(activity.detail)}">i</button>
            <div>
              <strong>${activity.label}</strong>
              <small>by ${activity.actor}</small>
            </div>
            <time>${formatActivityTime(activity.at)}</time>
          </li>
        `;}).join("")}
      </ol>
    </section>

    <div class="detail-actions-row">
      <button class="open-mission" type="button" data-open-task>Open Task</button>
      <button class="danger-button" type="button" data-delete-task="${mission.id}">Delete Task</button>
    </div>
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

function formatDueDate(value) {
  if (!value) return "No date";
  const parsed = parseDueDate(value);
  if (!parsed) return value;
  return parsed.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric"
  });
}

function formatDateTime(value) {
  const date = value ? new Date(value) : new Date();
  if (Number.isNaN(date.getTime())) return String(value || "");
  return `${date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric"
  })}, ${date.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit"
  })}`;
}

function formatActivityTime(value) {
  return formatDateTime(value || new Date().toISOString());
}

function dateInputValue(value) {
  const parsed = parseDueDate(value);
  if (!parsed) return "";
  const year = parsed.getFullYear();
  const month = String(parsed.getMonth() + 1).padStart(2, "0");
  const day = String(parsed.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function parseDueDate(value) {
  if (value instanceof Date) return value;
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const [year, month, day] = value.split("-").map(Number);
    return new Date(year, month - 1, day);
  }
  const currentYear = new Date().getFullYear();
  const cleanValue = String(value).trim();
  const missingYear = /^[A-Za-z]+ \d{1,2}$/.test(cleanValue) || /^\d{1,2} [A-Za-z]+$/.test(cleanValue);
  const inferred = missingYear ? new Date(`${cleanValue} ${currentYear}`) : null;
  if (inferred && !Number.isNaN(inferred.getTime())) return inferred;

  const withYear = new Date(cleanValue);
  if (!Number.isNaN(withYear.getTime())) return withYear;
  return null;
}

function escapeHtml(value = "") {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function escapeAttribute(value = "") {
  return escapeHtml(value).replace(/"/g, "&quot;");
}

function getTaskAgents(task) {
  const ids = Array.isArray(task.agentIds) ? task.agentIds
    : Array.isArray(task.agent_ids) ? task.agent_ids
    : null;
  if (ids && ids.length > 0) {
    return ids
      .map((id) => agents.find((agent) => agent.id === id || agent.name === id))
      .filter(Boolean);
  }
  if (ids && ids.length === 0) return [];
  return missionAgents.map((agent, index) => ({
    id: agent.name.toLowerCase(),
    ...agent,
    fallbackIndex: index
  }));
}

function normalizeAgents(nextAgents) {
  const defaults = new Map(agents.map((agent) => [agentKey(agent), agent]));
  return nextAgents.map((agent) => {
    const fallback = defaults.get(agentKey(agent)) || {};
    return {
      ...fallback,
      ...agent,
      model: agent.model || fallback.model || "Model not reported"
    };
  });
}

function statusFromLane(lane) {
  if (lane === "execute") return "Executing";
  if (lane === "review") return "Review";
  if (lane === "done") return "Done";
  return "Planning";
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

function agentKey(agent) {
  return String(agent.id || agent.name).toLowerCase().replace(/[^a-z0-9-]/g, "-");
}

function agentAvatar(agent, index) {
  const key = agentKey(agent);
  const image = state.agentImages[key];
  if (image) return `<span class="avatar-face image-avatar"><img src="${image}" alt=""></span>`;
  return avatar(agent.name || key, index);
}

function agentStatusClass(agent) {
  if (agent.status === "Run Health") return "warn";
  if (agent.status === "Disconnected" || agent.status === "Offline") return "offline";
  return "live";
}

function agentStatusLabel(agent) {
  if (agent.status === "Run Health") return "Needs attention";
  if (agent.status === "Disconnected" || agent.status === "Offline") return "Offline";
  return "Live";
}

function filterLabel() {
  return {
    all: "All Tasks",
    active: "Active Tasks",
    high: "High Priority",
    approval: "Needs Approval"
  }[state.filter] || "All Tasks";
}

function sortLabel() {
  return {
    priority: "Priority",
    due: "Due Date",
    progress: "Progress"
  }[state.sort] || "Priority";
}

function cycleFilter() {
  const filters = ["all", "active", "high", "approval"];
  state.filter = filters[(filters.indexOf(state.filter) + 1) % filters.length];
  render();
  showToast(filterLabel());
}

function cycleSort() {
  const sorts = ["priority", "due", "progress"];
  state.sort = sorts[(sorts.indexOf(state.sort) + 1) % sorts.length];
  render();
  showToast(`Sorted by ${sortLabel().toLowerCase()}`);
}

function openDialog(lane = "plan") {
  missionForm.reset();
  renderDialogAgents();
  missionForm.elements.lane.value = lane;
  missionDialog.showModal();
  missionForm.elements.title.focus();
}

async function saveTask(formData) {
  const mission = {
    lane: formData.get("lane"),
    title: formData.get("title").trim(),
    description: formData.get("description").trim(),
    projectId: formData.get("projectId"),
    priority: formData.get("priority"),
    due: formData.get("due").trim() || `${new Date().getFullYear()}-05-30`,
    status: formData.get("lane") === "execute" ? "Executing" : formData.get("lane") === "review" ? "Review" : formData.get("lane") === "done" ? "Done" : "Planning",
    progress: 5,
    agentIds: formData.getAll("agentIds"),
    activity: [{
      label: "Task created",
      actor: "Cece",
      at: new Date().toISOString(),
      detail: "Cece created this task."
    }, "Waiting for first run"]
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

async function patchTask(id, patch) {
  const task = state.tasks.find((item) => item.id === id);
  if (!task) return null;

  Object.assign(task, patch);
  if (patch.lane && !patch.status) task.status = statusFromLane(patch.lane);
  task.updatedAt = new Date().toISOString();
  persist();
  render();

  try {
    const result = await api(`/api/tasks/${id}`, {
      method: "PATCH",
      body: JSON.stringify(task)
    });
    Object.assign(task, result.task);
    persist();
    render();
  } catch {
    showToast("Saved locally");
  }

  return task;
}

async function deleteTask(id) {
  const task = state.tasks.find((item) => item.id === id);
  state.tasks = state.tasks.filter((item) => item.id !== id);
  state.selectedId = null;
  state.activeView = "tasks";
  persist();
  render();

  try {
    await api(`/api/tasks/${id}`, { method: "DELETE" });
  } catch {
    showToast("Deleted locally");
    return;
  }

  showToast(`${task?.title || "Task"} deleted`);
}

function saveTaskEdit(id) {
  const task = state.tasks.find((item) => item.id === id);
  const title = document.querySelector("[data-edit-title]")?.value.trim();
  const description = document.querySelector("[data-edit-description]")?.value.trim();
  const agentIds = getTaskAgents(task || {}).map((agent) => agentKey(agent));
  const patch = {
    title: title || "Untitled task",
    description: description || "",
    projectId: document.querySelector("[data-edit-project]")?.value || "",
    priority: document.querySelector("[data-edit-priority]")?.value || "Medium",
    due: document.querySelector("[data-edit-due]")?.value || "",
    progress: Number(document.querySelector("[data-edit-progress]")?.value || 0),
    lane: document.querySelector("[data-edit-lane]")?.value || "plan",
    agentIds
  };
  patch.status = statusFromLane(patch.lane);
  patch.activity = buildEditActivity(task, patch);
  state.editorDirty = false;
  patchTask(id, patch);
  showToast("Task updated");
}

function buildEditActivity(task, patch) {
  const activity = [...(task?.activity || [])];
  const changes = [];
  if (task && patch.title && patch.title !== task.title) {
    changes.push({
      label: "Cece changed the title",
      actor: "Cece",
      at: new Date().toISOString(),
      detail: `Title changed from "${task.title}" to "${patch.title}".`
    });
  }
  if (task && patch.description !== undefined && patch.description !== task.description) {
    changes.push({
      label: "Cece updated the description",
      actor: "Cece",
      at: new Date().toISOString(),
      detail: `Description changed from "${task.description || "empty"}" to "${patch.description || "empty"}".`
    });
  }
  if (task && patch.projectId !== undefined && patch.projectId !== (task.projectId || "")) {
    changes.push({
      label: "Cece changed the project",
      actor: "Cece",
      at: new Date().toISOString(),
      detail: `Project changed from "${projectTitle(task.projectId)}" to "${projectTitle(patch.projectId)}".`
    });
  }
  if (task && patch.priority !== task.priority) {
    changes.push({
      label: "Cece changed the priority",
      actor: "Cece",
      at: new Date().toISOString(),
      detail: `Priority changed from "${task.priority}" to "${patch.priority}".`
    });
  }
  if (task && patch.due !== undefined && patch.due !== (task.due || "")) {
    changes.push({
      label: "Cece changed the due date",
      actor: "Cece",
      at: new Date().toISOString(),
      detail: `Due date changed from "${formatDueDate(task.due)}" to "${formatDueDate(patch.due)}".`
    });
  }
  if (task && patch.progress !== undefined && Number(patch.progress) !== Number(task.progress || 0)) {
    changes.push({
      label: "Cece changed progress",
      actor: "Cece",
      at: new Date().toISOString(),
      detail: `Progress changed from "${task.progress || 0}%" to "${patch.progress}%".`
    });
  }
  if (task && patch.lane !== task.lane) {
    changes.push({
      label: "Cece moved the task",
      actor: "Cece",
      at: new Date().toISOString(),
      detail: `Lane changed from "${laneTitle(task.lane)}" to "${laneTitle(patch.lane)}".`
    });
  }
  const oldAgents = getTaskAgents(task || {}).map((agent) => agentKey(agent)).sort().join(",");
  const newAgents = [...(patch.agentIds || [])].sort().join(",");
  if (oldAgents !== newAgents) {
    changes.push({
      label: "Cece updated assigned agents",
      actor: "Cece",
      at: new Date().toISOString(),
      detail: `Assigned agents changed from "${agentNames(oldAgents)}" to "${agentNames(newAgents)}".`
    });
  }
  return [...changes, ...activity].slice(0, 12);
}

function normalizeActivity(item, task) {
  if (item && typeof item === "object") {
    return {
      label: item.label || item.message || "Task updated",
      actor: item.actor || item.source || "Cece",
              detail: item.detail || item.message || "No detailed change log was stored for this update.",
              at: item.at || item.time || item.createdAt
    };
  }
  const label = String(item || "Task updated");
  return { label, actor: activityActor(label), detail: activityDetail(label, task), at: task?.updatedAt || task?.createdAt };
}

function activityActor(label) {
  const known = agents.find((agent) => label.toLowerCase().includes(agent.name.toLowerCase()));
  return known ? known.name : "Cece";
}

function activityDetail(label, task) {
  if (label.includes("title")) return `Title was updated on "${task.title}". Older updates did not store before/after values.`;
  if (label.includes("description")) return `Description was updated on "${task.title}". Older updates did not store before/after values.`;
  if (label.includes("assigned agents")) return `Assigned agents changed on "${task.title}". Older updates did not store before/after values.`;
  if (label.includes("Task updated")) return `This older update did not store exact before/after fields. New edits now record the exact changed field and old/new values.`;
  return label;
}

function updateWorkspaceAgents(nextAgentIds) {
  const task = state.tasks.find((item) => item.id === state.selectedId);
  if (!task) return;
  const patch = {
    agentIds: nextAgentIds,
    activity: [{
      label: "Cece updated assigned agents",
      actor: "Cece",
      at: new Date().toISOString(),
      detail: `Assigned agents changed from "${agentNames(getTaskAgents(task).map((agent) => agentKey(agent)).sort().join(","))}" to "${agentNames(nextAgentIds.sort().join(","))}".`
    }, ...(task.activity || [])].slice(0, 12)
  };
  state.editorDirty = false;
  patchTask(task.id, patch);
}

function addCalendarItem() {
  state.calendarComposerOpen = true;
  render();
}

function saveCalendarItem() {
  const title = document.querySelector("[data-calendar-title]")?.value.trim();
  const date = document.querySelector("[data-calendar-date]")?.value;
  if (!title || !date) {
    showToast("Add a title and date");
    return;
  }
  const isEditing = Boolean(state.openCalendarItemId);
  const item = {
    id: state.openCalendarItemId || crypto.randomUUID(),
    title,
    date,
    time: document.querySelector("[data-calendar-time]")?.value.trim() || "09:00",
    owner: document.querySelector("[data-calendar-owner]")?.value.trim() || "Cece",
    notes: document.querySelector("[data-calendar-notes]")?.value.trim() || "",
    recurring: document.querySelector("[data-calendar-recurring]")?.value || "none"
  };
  if (isEditing) {
    state.calendarItems = state.calendarItems.filter((item) => item.id !== state.openCalendarItemId);
  }
  state.calendarItems.push(item);
  state.calendarComposerOpen = false;
  state.openCalendarItemId = null;
  state.editorDirty = false;
  persistCalendarItems();
  render();
  showToast(isEditing ? "Calendar item updated" : "Calendar item added");
}

function openCalendarItem(id) {
  state.openCalendarItemId = id;
  state.calendarComposerOpen = false;
  render();
}

function deleteCalendarItem(id) {
  const existing = state.calendarItems.find((item) => item.id === id);
  state.calendarItems = state.calendarItems.filter((item) => item.id !== id);
  if (!existing && String(id).startsWith("seed-")) {
    state.calendarItems.push({ id, deleted: true });
  }
  state.openCalendarItemId = null;
  state.calendarComposerOpen = false;
  state.editorDirty = false;
  persistCalendarItems();
  render();
  showToast("Calendar item deleted");
}

function addMemoryItem() {
  state.memoryComposerOpen = true;
  render();
}

function saveMemoryItem() {
  const title = document.querySelector("[data-memory-title]")?.value.trim();
  const body = document.querySelector("[data-memory-body]")?.value.trim();
  if (!title || !body) {
    showToast("Add a title and memory");
    return;
  }
  if (state.openMemoryId) {
    const memory = state.memories.find((item) => item.id === state.openMemoryId);
    if (memory) {
      memory.title = title;
      memory.body = body;
    }
  } else {
    state.memories.unshift({ id: crypto.randomUUID(), title, body });
  }
  state.memoryComposerOpen = false;
  state.openMemoryId = null;
  state.editorDirty = false;
  persistMemories();
  render();
  showToast("Memory saved");
}

function openMemoryItem(id) {
  const memory = state.memories.find((item) => item.id === id);
  if (!memory) return;
  state.openMemoryId = id;
  state.memoryComposerOpen = false;
  render();
}

function deleteMemoryItem(id) {
  state.memories = state.memories.filter((item) => item.id !== id);
  state.openMemoryId = null;
  state.memoryComposerOpen = false;
  state.editorDirty = false;
  persistMemories();
  render();
  showToast("Memory deleted");
}

function addAgentToSelectedTask() {
  const task = state.tasks.find((item) => item.id === state.selectedId);
  if (!task) return;
  const current = task.agentIds || [];
  const available = agents.find((agent) => !current.includes(agent.id));
  if (!available) {
    showToast("All agents already added");
    return;
  }
  patchTask(task.id, { agentIds: [...current, available.id] });
  showToast(`${available.name} added`);
}

function removeAgentFromSelectedTask(agentId) {
  const task = state.tasks.find((item) => item.id === state.selectedId);
  if (!task) return;
  const current = task.agentIds || getTaskAgents(task).map((agent) => agent.id || agent.name);
  patchTask(task.id, { agentIds: current.filter((id) => id !== agentId) });
  showToast("Agent removed");
}

function renderNotifications() {
  if (!notificationsPanel) return;
  const items = events.slice(0, 6).map((event) => {
    const normalized = Array.isArray(event)
      ? { level: event[1], source: event[2], message: event[3], target: event[4] }
      : event;
    return `
      <button type="button" data-notification-jump>
        <span class="event-icon ${normalized.level || "info"}">${normalized.level === "warn" ? "!" : "ok"}</span>
        <span>
          <strong>${normalized.message || "Task update"}</strong>
          <small>${normalized.source || "System"}${normalized.target ? ` - ${normalized.target}` : ""}</small>
        </span>
      </button>
    `;
  }).join("");
  notificationsPanel.innerHTML = `<h3>Notifications</h3>${items || "<p>No notifications yet.</p>"}`;
  notificationsPanel.hidden = !state.notificationsOpen;
}

function changeAvatarInitials() {
  const next = window.prompt("Enter your avatar initials", state.userInitials);
  if (!next) return;
  state.userInitials = next.trim().slice(0, 3).toUpperCase();
  localStorage.setItem("OPENCLAW_USER_INITIALS", state.userInitials);
  render();
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
  const closeDetail = event.target.closest("[data-close-detail]");
  const openTask = event.target.closest("[data-open-task]");
  const saveTaskEditButton = event.target.closest("[data-save-task-edit]");
  const workspaceAddAgent = event.target.closest("[data-workspace-add-agent]");
  const workspaceRemoveAgent = event.target.closest("[data-workspace-remove-agent]");
  const filterToggle = event.target.closest("[data-filter-toggle]");
  const sortToggle = event.target.closest("[data-sort-toggle]");
  const backToTasks = event.target.closest("[data-back-to-tasks]");
  const deleteTaskButton = event.target.closest("[data-delete-task]");
  const openApproval = event.target.closest("[data-open-approval]");
  const approveTask = event.target.closest("[data-approve-task]");
  const rejectTask = event.target.closest("[data-reject-task]");
  const addAgent = event.target.closest("[data-add-agent]");
  const removeAgent = event.target.closest("[data-remove-agent]");
  const avatarButton = event.target.closest("#userAvatarButton");
  const bellButton = event.target.closest(".bell");
  const notificationJump = event.target.closest("[data-notification-jump]");
  const previewCard = event.target.closest("[data-preview-card]");
  const editTemplate = event.target.closest("[data-edit-template]");
  const saveTemplate = event.target.closest("[data-save-template]");
  const cancelTemplateEdit = event.target.closest("[data-cancel-template-edit]");
  const editIntegration = event.target.closest("[data-edit-integration]");
  const saveIntegration = event.target.closest("[data-save-integration]");
  const cancelIntegrationEdit = event.target.closest("[data-cancel-integration-edit]");
  const deleteTemplate = event.target.closest("[data-delete-template]");
  const deleteIntegration = event.target.closest("[data-delete-integration]");
  const activityDetailButton = event.target.closest("[data-activity-detail]");
  const calendarAdd = event.target.closest("[data-calendar-add]");
  const calendarSave = event.target.closest("[data-calendar-save]");
  const calendarCancel = event.target.closest("[data-calendar-cancel]");
  const calendarDelete = event.target.closest("[data-calendar-delete]");
  const calendarOpen = event.target.closest("[data-calendar-open]");
  const calendarNext = event.target.closest("[data-calendar-next]");
  const calendarPrev = event.target.closest("[data-calendar-prev]");
  const addMemory = event.target.closest("[data-add-memory]");
  const memorySave = event.target.closest("[data-memory-save]");
  const memoryCancel = event.target.closest("[data-memory-cancel]");
  const memoryDelete = event.target.closest("[data-memory-delete]");
  const openMemory = event.target.closest("[data-open-memory]");
  const closePreview = event.target.closest("[data-close-preview]");
  const projectView = event.target.closest("[data-project-view]");
  const saveProjectButton = event.target.closest("[data-save-project]");
  const archiveProjectButton = event.target.closest("[data-archive-project]");
  const deleteProjectButton = event.target.closest("[data-delete-project]");

  if (nav) {
    state.activeView = nav.dataset.view;
    render();
    return;
  }

  if (projectView) {
    state.projectView = projectView.dataset.projectView;
    render();
    return;
  }

  if (saveProjectButton) {
    saveProject(saveProjectButton.dataset.saveProject);
    return;
  }

  if (archiveProjectButton) {
    archiveProject(archiveProjectButton.dataset.archiveProject);
    return;
  }

  if (deleteProjectButton) {
    deleteProject(deleteProjectButton.dataset.deleteProject);
    return;
  }

  if (select) {
    state.selectedId = select.dataset.select;
    render();
    return;
  }

  if (state.activeView === "tasks" && state.selectedId && event.target.closest(".board-area")) {
    state.selectedId = null;
    render();
    return;
  }

  if (addLane) {
    openDialog(addLane.dataset.addLane);
    return;
  }

  if (createTask) {
    openDialog("plan");
    return;
  }

  if (filterToggle) {
    cycleFilter();
    return;
  }

  if (sortToggle) {
    cycleSort();
    return;
  }

  if (closeDetail) {
    state.selectedId = null;
    render();
    return;
  }

  if (openTask) {
    state.activeView = "task-detail";
    render();
    showToast("Task opened");
    return;
  }

  if (saveTaskEditButton) {
    saveTaskEdit(saveTaskEditButton.dataset.saveTaskEdit);
    return;
  }

  if (workspaceAddAgent) {
    const task = state.tasks.find((item) => item.id === state.selectedId);
    const selected = document.querySelector("[data-workspace-agent-select]")?.value;
    if (!task || !selected) return;
    const current = getTaskAgents(task).map((agent) => agentKey(agent));
    updateWorkspaceAgents([...new Set([...current, selected])]);
    return;
  }

  if (workspaceRemoveAgent) {
    const task = state.tasks.find((item) => item.id === state.selectedId);
    if (!task) return;
    const current = getTaskAgents(task).map((agent) => agentKey(agent));
    updateWorkspaceAgents(current.filter((id) => id !== workspaceRemoveAgent.dataset.workspaceRemoveAgent));
    return;
  }

  if (backToTasks) {
    state.activeView = "tasks";
    render();
    return;
  }

  if (deleteTaskButton) {
    deleteTask(deleteTaskButton.dataset.deleteTask);
    return;
  }

  if (openApproval) {
    state.selectedId = openApproval.dataset.openApproval;
    state.activeView = "task-detail";
    render();
    return;
  }

  if (approveTask) {
    patchTask(approveTask.dataset.approveTask, { lane: "done", status: "Done", progress: 100 });
    showToast("Approved");
    return;
  }

  if (rejectTask) {
    patchTask(rejectTask.dataset.rejectTask, { lane: "plan", status: "Planning" });
    showToast("Sent back to backlog");
    return;
  }

  if (addAgent) {
    addAgentToSelectedTask();
    return;
  }

  if (removeAgent) {
    removeAgentFromSelectedTask(removeAgent.dataset.removeAgent);
    return;
  }

  if (avatarButton) {
    changeAvatarInitials();
    return;
  }

  if (bellButton) {
    state.notificationsOpen = !state.notificationsOpen;
    renderNotifications();
    return;
  }

  if (notificationJump) {
    state.notificationsOpen = false;
    state.activeView = "tasks";
    render();
    return;
  }

  if (editTemplate) {
    state.editTemplateIndex = parseInt(editTemplate.dataset.editTemplate, 10);
    render();
    return;
  }

  if (saveTemplate) {
    const idx = parseInt(saveTemplate.dataset.saveTemplate, 10);
    const titleEl = document.querySelector("[data-template-edit-title]");
    const copyEl = document.querySelector("[data-template-edit-copy]");
    if (titleEl && copyEl && state.templates[idx]) {
      state.templates[idx] = { title: titleEl.value.trim(), copy: copyEl.value.trim() };
    }
    state.editTemplateIndex = null;
    render();
    return;
  }

  if (cancelTemplateEdit) {
    state.editTemplateIndex = null;
    render();
    return;
  }

  if (editIntegration) {
    state.editIntegrationIndex = parseInt(editIntegration.dataset.editIntegration, 10);
    render();
    return;
  }

  if (saveIntegration) {
    const idx = parseInt(saveIntegration.dataset.saveIntegration, 10);
    const titleEl = document.querySelector("[data-integration-edit-title]");
    const copyEl = document.querySelector("[data-integration-edit-copy]");
    if (titleEl && copyEl && state.integrations[idx]) {
      state.integrations[idx] = { title: titleEl.value.trim(), copy: copyEl.value.trim() };
    }
    state.editIntegrationIndex = null;
    render();
    return;
  }

  if (cancelIntegrationEdit) {
    state.editIntegrationIndex = null;
    render();
    return;
  }

  if (deleteTemplate) {
    const idx = parseInt(deleteTemplate.dataset.deleteTemplate, 10);
    state.templates.splice(idx, 1);
    state.editTemplateIndex = null;
    render();
    return;
  }

  if (deleteIntegration) {
    const idx = parseInt(deleteIntegration.dataset.deleteIntegration, 10);
    state.integrations.splice(idx, 1);
    state.editIntegrationIndex = null;
    render();
    return;
  }

  if (previewCard) {
    state.previewPanel = {
      title: previewCard.dataset.previewCard,
      copy: previewCard.dataset.previewCopy || ""
    };
    render();
    return;
  }

  if (closePreview) {
    state.previewPanel = null;
    render();
    return;
  }

  if (activityDetailButton) {
    window.alert(activityDetailButton.dataset.activityDetail);
    return;
  }

  if (calendarAdd) {
    addCalendarItem();
    return;
  }

  if (calendarSave) {
    saveCalendarItem();
    return;
  }

  if (calendarCancel) {
    state.calendarComposerOpen = false;
    state.openCalendarItemId = null;
    state.editorDirty = false;
    render();
    return;
  }

  if (calendarDelete) {
    deleteCalendarItem(calendarDelete.dataset.calendarDelete);
    return;
  }

  if (calendarOpen) {
    openCalendarItem(calendarOpen.dataset.calendarOpen);
    return;
  }

  if (calendarNext || calendarPrev) {
    state.calendarWeekOffset += calendarNext ? 1 : -1;
    render();
    return;
  }

  if (addMemory) {
    addMemoryItem();
    return;
  }

  if (memorySave) {
    saveMemoryItem();
    return;
  }

  if (memoryCancel) {
    state.memoryComposerOpen = false;
    state.openMemoryId = null;
    state.editorDirty = false;
    render();
    return;
  }

  if (memoryDelete) {
    deleteMemoryItem(memoryDelete.dataset.memoryDelete);
    return;
  }

  if (openMemory) {
    openMemoryItem(openMemory.dataset.openMemory);
  }
});

document.addEventListener("dblclick", (event) => {
  if (event.target.closest("#detailPanel")) {
    state.activeView = "task-detail";
    render();
  }
});

document.addEventListener("change", (event) => {
  if (event.target.closest(".task-workspace") || event.target.closest(".inline-composer") || event.target.closest(".project-card")) {
    state.editorDirty = true;
  }
  const upload = event.target.closest("[data-upload-agent]");
  if (!upload || !upload.files?.[0]) return;
  saveAgentImage(upload.dataset.uploadAgent, upload.files[0]);
});

function saveAgentImage(agentId, file) {
  const reader = new FileReader();
  reader.addEventListener("load", () => {
    const image = new Image();
    image.addEventListener("load", () => {
      const canvas = document.createElement("canvas");
      const size = 160;
      canvas.width = size;
      canvas.height = size;
      const context = canvas.getContext("2d");
      const scale = Math.max(size / image.width, size / image.height);
      const width = image.width * scale;
      const height = image.height * scale;
      context.drawImage(image, (size - width) / 2, (size - height) / 2, width, height);
      state.agentImages[agentId] = canvas.toDataURL("image/jpeg", 0.82);
      try {
        persistAgentImages();
        render();
        showToast("Agent image updated");
      } catch {
        showToast("Image was too large to save");
      }
    });
    image.src = reader.result;
  });
  reader.readAsDataURL(file);
}

document.addEventListener("input", (event) => {
  if (event.target.closest(".task-workspace") || event.target.closest(".inline-composer") || event.target.closest(".project-card")) {
    state.editorDirty = true;
  }
});

document.addEventListener("dragstart", (event) => {
  const card = event.target.closest("[data-select]");
  if (!card) return;
  state.draggedId = card.dataset.select;
  event.dataTransfer.effectAllowed = "move";
  event.dataTransfer.setData("text/plain", state.draggedId);
});

document.addEventListener("dragover", (event) => {
  const lane = event.target.closest("[data-lane]");
  if (!lane) return;
  event.preventDefault();
  lane.classList.add("drag-over");
});

document.addEventListener("dragleave", (event) => {
  const lane = event.target.closest("[data-lane]");
  if (lane) lane.classList.remove("drag-over");
});

document.addEventListener("drop", (event) => {
  const lane = event.target.closest("[data-lane]");
  if (!lane) return;
  event.preventDefault();
  lane.classList.remove("drag-over");
  const id = event.dataTransfer.getData("text/plain") || state.draggedId;
  if (!id) return;
  patchTask(id, {
    lane: lane.dataset.lane,
    status: statusFromLane(lane.dataset.lane)
  });
  state.draggedId = null;
});
document.querySelector("#closeDialogButton").addEventListener("click", () => missionDialog.close());
document.querySelector("#cancelDialogButton").addEventListener("click", () => missionDialog.close());

searchInput.addEventListener("input", (event) => {
  state.query = event.target.value;
  if (state.activeView === "tasks") {
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
