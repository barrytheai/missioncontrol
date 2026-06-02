const STORAGE_KEY = "openclaw-task-control-board-v3";
const DOCS_KEY = "openclaw-docs-v1";
const SCRAPER_KEY = "openclaw-scraper-intel-v1";
const AGENT_IMAGE_KEY = "openclaw-agent-images-v1";
const MEMORY_KEY = "openclaw-memories-v1";
const CALENDAR_KEY = "openclaw-calendar-items-v1";
const PROJECT_KEY = "openclaw-projects-v1";
const TEMPLATES_KEY = "openclaw-templates-v1";
const INTEGRATIONS_KEY = "openclaw-integrations-v1";

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

const scraperSources = [
  { id: "reddit", title: "Reddit", subtitle: "Roofing, ContractorUK, small business, construction" },
  { id: "news", title: "News & Trade", subtitle: "NFRC, FMB, Roofing Today" },
  { id: "producthunt", title: "Social Trends", subtitle: "TikTok trends, LinkedIn topics, hashtags, viral trades content" },
  { id: "web", title: "Web Search", subtitle: "Broader queries and direct source fetches" },
  { id: "done", title: "Done", subtitle: "Reviewed scrape items" }
];

const defaultScraperItems = [
  {
    id: "reddit-quoting-delays",
    source: "reddit",
    platform: "r/Roofing",
    title: "Roofers frustrated by quoting delays",
    url: "https://www.reddit.com/r/Roofing/",
    score: "HIGH",
    pain: "Contractors are losing jobs because estimates take too long to prepare and follow up.",
    suggestion: "Use this as a QuoteCore+ content angle and outreach hook around quote speed.",
    quotes: ["I spend nights catching up on estimates.", "By the time I price it properly the customer has moved on."],
    draftComments: [
      "This is exactly the hidden cost of estimating. A lot of roofers do the hard part well, then lose momentum because the quote takes too long to send.",
      "Curious if the delay is usually measurements, materials pricing, or turning the quote into something customer-ready?"
    ],
    tags: ["quoting pain", "lead loss", "comment ready"],
    capturedAt: "2026-05-18T09:15:00.000Z"
  },
  {
    id: "reddit-lead-gen-complaints",
    source: "reddit",
    platform: "r/smallbusiness",
    title: "Lead-gen services getting blamed for poor quality",
    url: "https://www.reddit.com/r/smallbusiness/",
    score: "MED",
    pain: "Small contractors want predictable lead flow but distrust paid lead platforms.",
    suggestion: "Draft a post comparing owned website capture with paid lead platforms.",
    quotes: ["Half the leads are cold or already taken.", "I need fewer leads, better qualified."],
    draftComments: [
      "A lot of trades businesses seem to hit the same wall: more leads is not useful if the context is weak.",
      "The best setup I have seen is usually fewer form fills but better job detail before the first call."
    ],
    tags: ["lead quality", "content angle"],
    capturedAt: "2026-05-18T10:05:00.000Z"
  },
  {
    id: "news-cost-pressure",
    source: "news",
    platform: "Roofing Today",
    title: "Cost pressure signal for roofing materials",
    url: "https://roofingtoday.co.uk/",
    score: "HIGH",
    pain: "Rising material and labour costs make quoting accuracy more important.",
    suggestion: "Turn into a short LinkedIn or blog angle about why quote tools need live pricing discipline.",
    quotes: ["Cost volatility is making margins harder to protect."],
    draftComments: [
      "Useful signal for anyone quoting roofing work right now. Cost movement makes speed and accuracy feel less like admin and more like margin protection."
    ],
    tags: ["industry trend", "social post"],
    capturedAt: "2026-05-18T11:20:00.000Z"
  },
  {
    id: "news-awards-angle",
    source: "news",
    platform: "NFRC",
    title: "Awards/event post opportunity",
    url: "https://www.nfrc.co.uk/",
    score: "LOW",
    pain: "Award winners create timely, positive engagement opportunities.",
    suggestion: "Congratulate winners and connect craftsmanship to better project operations.",
    quotes: ["Recognition for quality workmanship and training."],
    draftComments: [
      "Great to see roofing businesses being recognised for quality work. The operational side behind good delivery rarely gets enough attention."
    ],
    tags: ["engagement", "relationship building"],
    capturedAt: "2026-05-18T12:40:00.000Z"
  },
  {
    id: "producthunt-contractor-saas",
    source: "producthunt",
    platform: "ProductHunt",
    title: "Contractor SaaS launch comment target",
    url: "https://www.producthunt.com/",
    score: "MED",
    pain: "New contractor tools are positioning around admin reduction, not quoting specificity.",
    suggestion: "Comment with a genuine question about trade-specific quoting workflows.",
    quotes: ["Automate admin for small service businesses."],
    draftComments: [
      "Nice launch. Do you see most service businesses wanting a broad admin system first, or do they usually come in through one painful workflow like quoting or scheduling?"
    ],
    tags: ["competitive landscape", "comment target"],
    capturedAt: "2026-05-18T13:10:00.000Z"
  },
  {
    id: "web-x-searches",
    source: "web",
    platform: "Manual X searches",
    title: "Suggested X searches for Cece",
    url: "https://x.com/search",
    score: "MED",
    pain: "X cannot be scraped without auth, but the agent can prepare manual searches.",
    suggestion: "Run the suggested searches manually and paste useful URLs back to the scraper agent.",
    quotes: ["roofer quoting software", "roofing estimate takes too long", "contractor lead gen"],
    draftComments: [
      "Try: \"roofing quote software\" OR \"roofing estimate\"",
      "Try: \"contractor leads\" \"waste of money\""
    ],
    tags: ["manual follow-up", "X search"],
    capturedAt: "2026-05-18T14:00:00.000Z"
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

// Read-only scraper mode — activated via ?scraper_readonly=1 in URL
const SCRAPER_READONLY = new URLSearchParams(window.location.search).get("scraper_readonly") === "1";

const state = {
  activeView: "tasks",
  tasks: loadTasks(),
  selectedId: null,
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
  docs: loadDocs(),
  docComposerOpen: false,
  openDocId: null,
  scraperItems: loadScraperItems(),
  selectedScrapeId: "reddit-quoting-delays",
  scraperBoardScrollLeft: Number(sessionStorage.getItem("OPENCLAW_SCRAPER_SCROLL_LEFT") || 0),
  openProjectId: null,
  openMemoryId: null,
  openCalendarItemId: null,
  previewPanel: null,
  editTemplateIndex: null,
  editIntegrationIndex: null,
  templates: JSON.parse(localStorage.getItem(TEMPLATES_KEY) || "null") || [
    { title: "Research Sprint", copy: "Gather sources, summarize findings, and create decision notes." },
    { title: "Frontend Build", copy: "Assign Builder, track implementation, and request review." },
    { title: "Release Prep", copy: "Coordinate checks, docs, changelog, and deployment readiness." },
    { title: "Incident Review", copy: "Collect signals, identify cause, and capture prevention notes." }
  ],
  integrations: JSON.parse(localStorage.getItem(INTEGRATIONS_KEY) || "null") || [
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
let calendarSaveLockUntil = 0; // timestamp ms — blocks loadCalendarFromAPI after a save
let taskSaveLockUntil = 0; // timestamp ms — blocks loadRemoteState after a task save

// ── Checklist state ──────────────────────────────────────────────────────────
const WEEKLY_ITEMS = ["instagram", "tiktok", "linkedin", "facebook"];
const CHECKLIST_DEF = [
  { section: "daily", key: "reddit_sp", label: "u/Stock-Performer4939", freq: "daily", children: [
    { key: "reddit_sp_1", label: "Post 1" }, { key: "reddit_sp_2", label: "Post 2" }, { key: "reddit_sp_3", label: "Post 3" }
  ]},
  { section: "daily", key: "reddit_roofboss", label: "u/RoofBossBarry", freq: "daily", children: [
    { key: "reddit_roofboss_1", label: "Post 1" }, { key: "reddit_roofboss_2", label: "Post 2" }, { key: "reddit_roofboss_3", label: "Post 3" }
  ]},
  { section: "daily", key: "reddit_lowtourist", label: "u/Low-Tourist-5813", freq: "daily", children: [
    { key: "reddit_lowtourist_1", label: "Post 1" }, { key: "reddit_lowtourist_2", label: "Post 2" }, { key: "reddit_lowtourist_3", label: "Post 3" }
  ]},
  { section: "daily", key: "reddit_someeye", label: "u/Some_Eye4231", freq: "daily", children: [
    { key: "reddit_someeye_1", label: "Post 1" }, { key: "reddit_someeye_2", label: "Post 2" }, { key: "reddit_someeye_3", label: "Post 3" }
  ]},
  { section: "daily", key: "x", label: "X / Twitter", freq: "daily", children: [
    { key: "x_post", label: "Post today's content (use morning brief)" },
    { key: "x_engage", label: "Engage with 3 relevant threads" }
  ]},
  { section: "daily", key: "instagram", label: "Instagram", freq: "3x/week" },
  { section: "daily", key: "tiktok", label: "TikTok", freq: "3x/week" },
  { section: "daily", key: "linkedin", label: "LinkedIn", freq: "3x/week" },
  { section: "daily", key: "facebook", label: "Facebook", freq: "3x/week" },
  { section: "daily", key: "dms", label: "DMs & Comments Sweep", freq: "daily", children: [
    { key: "dms_reddit", label: "Reddit - check replies and DMs" },
    { key: "dms_instagram", label: "Instagram - check comments and DMs" },
    { key: "dms_x", label: "X - check mentions and replies" },
    { key: "dms_tiktok", label: "TikTok - check comments" },
    { key: "dms_linkedin", label: "LinkedIn - check notifications" }
  ]},
  { section: "daily", key: "cal", label: "Calendar & Calls", freq: "daily", children: [
    { key: "cal_calendly", label: "Check Calendly - any demos booked today?" },
    { key: "cal_calls", label: "Any calls to prep for?" }
  ]},
  { section: "daily", key: "inbox", label: "Inbox & Follow-Ups", freq: "daily", children: [
    { key: "inbox_check", label: "Check info@quote-core.com - any inbound leads?" },
    { key: "inbox_followup", label: "Follow up on any unanswered emails" }
  ]},
  { section: "daily", key: "reviews", label: "Reviews", freq: "daily", children: [
    { key: "reviews_trustpilot", label: "Trustpilot - any new reviews to respond to?" },
    { key: "reviews_g2", label: "G2 - any new reviews?" },
    { key: "reviews_capterra", label: "Capterra - any new reviews?" }
  ]},
  { section: "daily", key: "mc_review", label: "Mission Control", freq: "daily", note: "Check Review tab - anything pending approval?" },
  { section: "daily", key: "gsc", label: "Google Search Console", freq: "daily", note: "Check GSC - new indexed pages or coverage issues?" },
  // Post-launch section
  { section: "postlaunch", key: "cold_calls", label: "Cold Calls", freq: "daily", inputType: "number", note: "Calls made today" },
  { section: "postlaunch", key: "instantly", label: "Cold Email / Instantly", freq: "daily", children: [
    { key: "instantly_replies", label: "Check Instantly for replies" },
    { key: "instantly_demos", label: "Any new demo bookings to confirm?" }
  ]},
  { section: "postlaunch", key: "producthunt", label: "ProductHunt Warmup", freq: "daily", children: [
    { key: "ph_cece", label: "Cece's account - 5+ upvotes/comments" },
    { key: "ph_barry", label: "Barry's account - 5+ upvotes/comments" },
    { key: "ph_shaun", label: "Shaun's account - 5+ upvotes/comments" },
    { key: "ph_qc", label: "QC+ account - 5+ upvotes/comments" }
  ]}
];

let checklistState = {}; // { [item_key]: { checked, value } }
let checklistWeekCounts = {}; // { [item_key]: count this week }
let postLaunchEnabled = false;

function getUKDate() {
  return new Date().toLocaleDateString("en-CA", { timeZone: "Europe/London" });
}

function getMondayOfWeek(dateStr) {
  const d = new Date(dateStr + "T00:00:00");
  const day = d.getDay(); // 0=Sun
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  return d.toISOString().slice(0, 10);
}

async function loadChecklistFromAPI() {
  const date = getUKDate();
  const weekStart = getMondayOfWeek(date);
  try {
    const [dayRes, weekRes, settingRes] = await Promise.all([
      fetch(`${API_BASE}/api/state?checklist=1&date=${date}`),
      fetch(`${API_BASE}/api/state?checklist=1&weekStart=${weekStart}`),
      fetch(`${API_BASE}/api/state?checklist=1&setting=_post_launch_enabled`)
    ]);
    const dayData = await dayRes.json();
    const weekData = await weekRes.json();
    const settingData = await settingRes.json();

    // Build state map
    checklistState = {};
    if (Array.isArray(dayData.rows)) {
      for (const row of dayData.rows) {
        checklistState[row.item_key] = { checked: row.checked, value: row.value };
      }
    }

    // Build week counts for 3x/week items
    checklistWeekCounts = {};
    if (Array.isArray(weekData.rows)) {
      for (const row of weekData.rows) {
        if (WEEKLY_ITEMS.includes(row.item_key)) {
          checklistWeekCounts[row.item_key] = (checklistWeekCounts[row.item_key] || 0) + 1;
        }
      }
    }

    // Post-launch setting
    const settingRows = settingData.rows || [];
    postLaunchEnabled = settingRows.length > 0 && settingRows[0].checked === true;

    if (state.activeView === "checklist") render();
  } catch (e) {
    console.error("checklist load error", e);
  }
}

async function saveChecklistItem(item_key, checked, value) {
  const date = getUKDate();
  const body = { date, item_key, checked };
  if (value !== undefined) body.value = value;
  checklistState[item_key] = { checked, value };
  if (WEEKLY_ITEMS.includes(item_key)) {
    const prev = checklistWeekCounts[item_key] || 0;
    checklistWeekCounts[item_key] = checked ? Math.max(prev, prev + 1) : Math.max(0, prev - 1);
  }
  render();
  try {
    await fetch(`${API_BASE}/api/state?checklist=1`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${localStorage.getItem("OPENCLAW_AGENT_TOKEN") || "mc-openclaw-2026-secure"}` },
      body: JSON.stringify(body)
    });
  } catch (e) {
    console.error("checklist save error", e);
  }
}

async function savePostLaunchSetting(enabled) {
  postLaunchEnabled = enabled;
  render();
  try {
    await fetch(`${API_BASE}/api/state?checklist=1`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${localStorage.getItem("OPENCLAW_AGENT_TOKEN") || "mc-openclaw-2026-secure"}` },
      body: JSON.stringify({ date: "settings", item_key: "_post_launch_enabled", checked: enabled })
    });
  } catch (e) {
    console.error("checklist setting save error", e);
  }
}

function isChecked(key) { return !!(checklistState[key]?.checked); }
function getValue(key) { return checklistState[key]?.value || ""; }

function checklistProgressCounts() {
  let done = 0, total = 0;
  for (const item of CHECKLIST_DEF) {
    if (item.section === "postlaunch" && !postLaunchEnabled) continue;
    if (item.freq === "3x/week") {
      const count = checklistWeekCounts[item.key] || 0;
      if (count >= 3) continue; // done for week - don't count
    }
    total++;
    if (item.inputType === "number") {
      const v = parseInt(getValue(item.key), 10);
      if (v > 0) done++;
    } else {
      if (isChecked(item.key)) done++;
    }
  }
  return { done, total };
}

function checklistMarkup() {
  const today = getUKDate();
  const { done, total } = checklistProgressCounts();
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;

  const dailyItems = CHECKLIST_DEF.filter(i => i.section === "daily");
  const postItems = CHECKLIST_DEF.filter(i => i.section === "postlaunch");

  return `
    <div class="checklist-wrap">
      <div class="checklist-header">
        <div class="checklist-date">${new Date(today + "T12:00:00").toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</div>
        <div class="checklist-progress-row">
          <span class="checklist-progress-label">${done} / ${total} tasks complete today</span>
          <div class="checklist-progress-bar"><div class="checklist-progress-fill" style="width:${pct}%"></div></div>
          <span class="checklist-progress-pct">${pct}%</span>
        </div>
      </div>

      <div class="checklist-section">
        <div class="checklist-section-title">DAILY OPERATIONS</div>
        ${dailyItems.map(item => renderChecklistItem(item)).join("")}
      </div>

      <div class="checklist-section checklist-postlaunch ${postLaunchEnabled ? "" : "checklist-locked"}">
        <div class="checklist-section-title">
          POST-LAUNCH
          ${postLaunchEnabled
            ? `<button class="checklist-lock-btn" data-checklist-postlaunch="disable" title="Lock post-launch section">🔓 Enabled</button>`
            : `<span class="checklist-lock-badge">🔒</span> <button class="checklist-lock-btn" data-checklist-postlaunch="enable" title="Enable post-launch section">Enable</button>`
          }
        </div>
        ${!postLaunchEnabled ? `<p class="checklist-locked-note">Locked until app is live and Stripe is connected. Click Enable to unlock.</p>` : ""}
        ${postLaunchEnabled ? postItems.map(item => renderChecklistItem(item)).join("") : ""}
      </div>
    </div>
  `;
}

function renderChecklistItem(item) {
  const checked = isChecked(item.key);
  const children = item.children || [];
  const allChildrenChecked = children.length === 0 || children.every(c => isChecked(c.key));
  const childDone = children.filter(c => isChecked(c.key)).length;
  const parentLocked = children.length > 0 && !allChildrenChecked;

  const isWeekly = item.freq === "3x/week";
  const weekCount = isWeekly ? (checklistWeekCounts[item.key] || 0) : 0;
  const doneForWeek = isWeekly && weekCount >= 3;

  const note = item.note || "";

  if (item.inputType === "number") {
    const val = getValue(item.key);
    return `
      <div class="checklist-item checklist-item-input">
        <div class="checklist-item-main">
          <label class="checklist-label">${item.label}</label>
          <span class="checklist-item-note">${note}</span>
          <input type="number" min="0" class="checklist-number-input" data-checklist-number="${item.key}" value="${val}" placeholder="0" />
        </div>
      </div>
    `;
  }

  return `
    <div class="checklist-item ${doneForWeek ? "checklist-done-week" : ""}">
      <div class="checklist-item-main">
        <input type="checkbox" class="checklist-cb" id="cl_${item.key}" data-checklist-key="${item.key}"
          ${checked ? "checked" : ""}
          ${parentLocked ? "disabled" : ""}
          ${doneForWeek ? "disabled" : ""}
        />
        <label class="checklist-label ${parentLocked ? "checklist-label-locked" : ""}" for="cl_${item.key}">
          ${item.label}
          ${children.length > 0 ? `<span class="checklist-sub-count">${childDone}/${children.length}</span>` : ""}
          ${isWeekly ? `<span class="checklist-freq-badge">${doneForWeek ? "Done for the week" : `${weekCount}/3 this week`}</span>` : ""}
        </label>
        ${note ? `<span class="checklist-item-note">${note}</span>` : ""}
      </div>
      ${children.length > 0 ? `
        <div class="checklist-children">
          ${children.map(child => `
            <div class="checklist-child">
              <input type="checkbox" class="checklist-cb" id="cl_${child.key}" data-checklist-key="${child.key}" ${isChecked(child.key) ? "checked" : ""} />
              <label for="cl_${child.key}">${child.label}</label>
            </div>
          `).join("")}
        </div>
      ` : ""}
    </div>
  `;
}

function loadTasks() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return normalizeLoadedTasks(saved ? JSON.parse(saved) : seedTasks);
  } catch {
    return normalizeLoadedTasks(seedTasks);
  }
}

function normalizeLoadedTasks(tasks) {
  return tasks.map((task) => {
    if (task.projectId || task.project_id) return task;
    const projectId = defaultTaskProjectId(task);
    return projectId ? { ...task, projectId } : task;
  });
}

function defaultTaskProjectId(task) {
  const title = String(task.title || "").toLowerCase();
  if (["m1", "m4"].includes(task.id) || title.includes("market") || title.includes("feedback")) return "quotecore-plus";
  if (["m2", "m5", "m8"].includes(task.id) || title.includes("website") || title.includes("api docs") || title.includes("bug bash")) return "mission-control";
  if (["m3", "m6"].includes(task.id) || title.includes("security") || title.includes("cost")) return "t3labs";
  if (["m7", "m9"].includes(task.id) || title.includes("onboarding") || title.includes("release")) return "quotecore-outbound";
  return "";
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

function normalizeRemoteMemory(memory) {
  return {
    id: memory.id || crypto.randomUUID(),
    title: memory.title || "Untitled",
    body: memory.body || ""
  };
}

function mergeById(remoteItems, localItems) {
  const remoteIds = new Set(remoteItems.map((item) => item.id));
  return [...remoteItems, ...localItems.filter((item) => !remoteIds.has(item.id))];
}

async function loadMemoriesFromAPI() {
  if (state.editorDirty || state.memoryComposerOpen || state.openMemoryId) return;
  const active = document.activeElement;
  if (active && (active.tagName === "INPUT" || active.tagName === "TEXTAREA")) return;
  try {
    const response = await fetch(`${API_BASE}/api/memories`);
    const data = await response.json();
    if (Array.isArray(data.memories) && data.memories.length > 0) {
      state.memories = mergeById(data.memories.map(normalizeRemoteMemory), state.memories);
      persistMemories();
      if (state.activeView === "memory") render();
    }
  } catch {
    // Local fallback stays active.
  }
}

function loadDocs() {
  const defaults = [
    {
      id: "doc-1",
      title: "Example Blog Draft",
      type: "Blog",
      author: "Barry",
      status: "Draft",
      body: "Agents can store blog drafts, reports, briefs, and notes here for Cece to review.",
      updatedAt: new Date().toISOString()
    }
  ];
  try {
    return JSON.parse(localStorage.getItem(DOCS_KEY) || "null") || defaults;
  } catch {
    return defaults;
  }
}

function persistDocs() {
  localStorage.setItem(DOCS_KEY, JSON.stringify(state.docs));
}

function normalizeRemoteDoc(doc) {
  return {
    id: doc.id || crypto.randomUUID(),
    title: doc.title || "Untitled doc",
    type: doc.type || "Notes",
    author: doc.author || doc.agent_id || "Agent",
    status: doc.status || "Draft",
    body: doc.body || "",
    updatedAt: doc.updated_at || doc.updatedAt || new Date().toISOString()
  };
}

function loadScraperItems() {
  try {
    return JSON.parse(localStorage.getItem(SCRAPER_KEY) || "null") || defaultScraperItems;
  } catch {
    return defaultScraperItems;
  }
}

function persistScraperItems() {
  localStorage.setItem(SCRAPER_KEY, JSON.stringify(state.scraperItems));
}

function normalizeScraperItem(item) {
  return {
    id: item.id || crypto.randomUUID(),
    source: item.source || item.platformId || "web",
    platform: item.platform || item.sourceName || "Web Search",
    title: item.title || "Untitled scrape",
    url: item.url || item.link || "",
    score: String(item.score || item.opportunity_score || "MED").toUpperCase(),
    pain: item.pain || item.pain_point || item.summary || "",
    suggestion: item.suggestion || item.suggested_action || item.action || "",
    quotes: Array.isArray(item.quotes) ? item.quotes : [],
    draftComments: Array.isArray(item.draftComments) ? item.draftComments : (Array.isArray(item.draft_comments) ? item.draft_comments : []),
    tags: Array.isArray(item.tags) ? item.tags : [],
    capturedAt: item.capturedAt || item.captured_at || item.updated_at || new Date().toISOString(),
    done: Boolean(item.done || item.completed)
  };
}

async function loadScraperFromAPI() {
  if (state.editorDirty) return;
  const scraperBoard = document.querySelector(".scraper-board");
  if (state.activeView === "scraper" && scraperBoard?.matches(":hover")) return;
  try {
    const response = await fetch(`${API_BASE}/api/scraper`);
    const data = await response.json();
    if (Array.isArray(data.items) && data.items.length > 0) {
      state.scraperItems = data.items.map((item) => {
        const normalized = normalizeScraperItem(item);
        const local = state.scraperItems.find((existing) => existing.id === normalized.id);
        return { ...normalized, done: Boolean(local?.done || normalized.done) };
      });
      if (!state.scraperItems.some((item) => item.id === state.selectedScrapeId)) {
        state.selectedScrapeId = null;
      }
      persistScraperItems();
      if (state.activeView === "scraper") render();
    }
  } catch {
    // Local fallback stays active.
  }
}

async function loadDocsFromAPI() {
  if (state.editorDirty || state.docComposerOpen || state.openDocId) return;
  const active = document.activeElement;
  if (active && (active.tagName === "INPUT" || active.tagName === "TEXTAREA")) return;
  try {
    const response = await fetch(`${API_BASE}/api/docs`);
    const data = await response.json();
    if (Array.isArray(data.docs)) {
      state.docs = mergeById(data.docs.map(normalizeRemoteDoc), state.docs);
      persistDocs();
      if (state.activeView === "docs") render();
    }
  } catch {
    // Local fallback stays active.
  }
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

function normalizeRemoteCalendarEvent(event) {
  const local = state.calendarItems.find((item) => item.id === event.id);
  return {
    id: event.id,
    title: event.title || local?.title || "Untitled event",
    date: event.date || local?.date || dateInputValue(new Date()),
    time: event.time || local?.time || "09:00",
    owner: (event.agent_ids || event.agentIds || [])[0] || local?.owner || "Cece",
    notes: event.description || event.notes || local?.notes || "",
    recurring: event.recurring || local?.recurring || "none",
    deleted: Boolean(local?.deleted)
  };
}

function mergeRemoteCalendarEvents(events) {
  const remoteItems = events.map(normalizeRemoteCalendarEvent);
  const remoteIds = new Set(remoteItems.map((item) => item.id));
  const localOnlyItems = state.calendarItems.filter((item) => !remoteIds.has(item.id));
  return [...remoteItems, ...localOnlyItems];
}

async function loadCalendarFromAPI() {
  if (state.editorDirty || state.calendarComposerOpen || state.openCalendarItemId) return;
  if (Date.now() < calendarSaveLockUntil) return;
  try {
    const r = await fetch(`${API_BASE}/api/calendar`);
    const d = await r.json();
    if (Array.isArray(d.events) && d.events.length > 0) {
      state.calendarItems = mergeRemoteCalendarEvents(d.events);
      localStorage.setItem(CALENDAR_KEY, JSON.stringify(state.calendarItems));
      if (state.activeView === "calendar") render();
    }
  } catch {}
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
  if (Date.now() < taskSaveLockUntil) return;
  if (state.activeView === "docs" && state.openDocId && !state.docComposerOpen) return;
  const active = document.activeElement;
  if (active && (active.tagName === "INPUT" || active.tagName === "TEXTAREA" || active.tagName === "SELECT")) return;
  try {
    const remote = await api("/api/state");
    state.tasks = remote.tasks || state.tasks;
    agents = normalizeAgents(remote.agents || agents);
    events = remote.events || events;
    if (Array.isArray(remote.scraperItems) && remote.scraperItems.length > 0) {
      state.scraperItems = remote.scraperItems.map((item) => {
        const normalized = normalizeScraperItem(item);
        const local = state.scraperItems.find((existing) => existing.id === normalized.id);
        return { ...normalized, done: Boolean(local?.done || normalized.done) };
      });
      persistScraperItems();
    }
    if (Array.isArray(remote.calendarEvents) && remote.calendarEvents.length > 0) {
      state.calendarItems = mergeRemoteCalendarEvents(remote.calendarEvents);
    }
    persist();
    render();
  } catch (error) {
    if (!silent) showToast("Using local preview data");
  }
}

function render() {
  const scrollState = captureScrollState();
  userAvatarButton.textContent = state.userInitials;
  renderAgents();
  renderNotifications();
  renderActiveView();
  // Defer scroll restore until after browser paints new DOM
  requestAnimationFrame(() => restoreScrollState(scrollState));
}

function captureScrollState() {
  const appContent = document.querySelector("#appContent") || document.querySelector(".app-content") || document.documentElement;
  return {
    boardArea: document.querySelector(".board-area")?.scrollLeft || 0,
    scraperBoard: document.querySelector(".scraper-board")?.scrollLeft || 0,
    appContent: appContent?.scrollTop || window.scrollY || 0,
    taskLanes: Array.from(document.querySelectorAll(".lane[data-lane]")).map((lane) => ({
      lane: lane.dataset.lane,
      top: lane.querySelector(".mission-stack")?.scrollTop || 0
    })),
    scraperStacks: Array.from(document.querySelectorAll(".scraper-stack")).map((stack, i) => ({
      index: i,
      top: stack.scrollTop || 0
    }))
  };
}

function restoreScrollState(scrollState) {
  if (!scrollState) return;
  const boardArea = document.querySelector(".board-area");
  if (boardArea) boardArea.scrollLeft = scrollState.boardArea || 0;
  const scraperBoard = document.querySelector(".scraper-board");
  if (scraperBoard && scrollState.scraperBoard) scraperBoard.scrollLeft = scrollState.scraperBoard;
  const appContent = document.querySelector("#appContent") || document.querySelector(".app-content");
  if (appContent && scrollState.appContent) {
    appContent.scrollTop = scrollState.appContent;
  } else if (scrollState.appContent) {
    window.scrollTo(0, scrollState.appContent);
  }
  (scrollState.taskLanes || []).forEach((item) => {
    const stack = document.querySelector(`.lane[data-lane="${CSS.escape(item.lane)}"] .mission-stack`);
    if (stack) stack.scrollTop = item.top || 0;
  });
  const scraperStackEls = document.querySelectorAll(".scraper-stack");
  (scrollState.scraperStacks || []).forEach((item) => {
    const el = scraperStackEls[item.index];
    if (el && item.top) el.scrollTop = item.top;
  });
}

function renderActiveView() {
  const titles = {
    tasks: "Tasks",
    "task-detail": "Task",
    approvals: "Approvals",
    projects: "Projects",
    "project-detail": "Project",
    calendar: "Calendar",
    memory: "Memory",
    docs: "Docs",
    scraper: "Scraper Intel",
    agents: "Agents",
    templates: "Templates",
    "template-detail": "Template",
    integrations: "Integrations",
    settings: "Settings"
  };

  pageTitle.textContent = titles[state.activeView] || "Tasks";

  document.querySelectorAll("[data-view]").forEach((button) => {
    button.classList.toggle("active", button.dataset.view === state.activeView || (state.activeView === "project-detail" && button.dataset.view === "projects"));
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

  if (state.activeView === "project-detail") {
    appContent.classList.add("single-view");
    appContent.classList.remove("detail-closed");
    appContent.innerHTML = projectDetailMarkup();
    return;
  }

  if (state.activeView === "template-detail") {
    appContent.classList.add("single-view");
    appContent.classList.remove("detail-closed");
    appContent.innerHTML = templateWorkspaceMarkup();
    return;
  }

  appContent.classList.add("single-view");
  appContent.classList.remove("detail-closed");
  appContent.innerHTML = viewMarkup(state.activeView);
  if (state.activeView === "scraper") {
    restoreScraperBoardScroll();
  }
}

function restoreScraperBoardScroll() {
  requestAnimationFrame(() => {
    const scraperBoard = document.querySelector(".scraper-board");
    if (!scraperBoard) return;
    scraperBoard.scrollLeft = state.scraperBoardScrollLeft || 0;
  });
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
    docs: {
      eyebrow: "Review library",
      title: "Docs",
      copy: "Review drafts, reports, blogs, briefs, research, and other outputs created by your agents.",
      body: docsMarkup()
    },
    checklist: {
      eyebrow: "Daily operations",
      title: "Checklist",
      copy: "Daily operations reset. Tracks Reddit accounts, social posting, DMs, reviews, and post-launch activities.",
      body: checklistMarkup()
    },
    scraper: {
      eyebrow: "Social intelligence",
      title: "Scraper Intel",
      copy: "Review scraped platform signals, opportunity scores, source links, and ready-to-use draft comments.",
      body: scraperMarkup()
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
  const approvalTasks = state.tasks.filter((task) => task.lane === "review");
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
      <button class="create-button compact" type="button" data-add-project>Create Project</button>
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
                 <button class="secondary-button compact" type="button" data-open-project="${project.id}">Open Project</button>
                 <button class="danger-button compact" type="button" data-delete-project="${project.id}">Delete</button>`
              : `<button class="secondary-button compact" type="button" data-open-project="${project.id}">Open Project</button>
                 <button class="secondary-button" type="button" data-save-project="${project.id}">Save</button>
                 <button class="secondary-button compact" type="button" data-archive-project="${project.id}">Archive</button>
                 <button class="danger-button compact" type="button" data-delete-project="${project.id}">Delete</button>`}
          </div>
          ${(() => {
            const projectTasks = state.tasks.filter(t => t.project_id === project.id || t.projectId === project.id);
            if (!projectTasks.length) return '';
            const done = projectTasks.filter(t => t.lane === 'done');
            const active = projectTasks.filter(t => t.lane !== 'done');
            return `<div class="project-tasks-list">
              <p class="project-tasks-label">Tasks (${done.length}/${projectTasks.length} done)</p>
              ${active.map(t => `<div class="project-task-item">${escapeHtml(t.title)}</div>`).join('')}
              ${done.map(t => `<div class="project-task-item done">${escapeHtml(t.title)}</div>`).join('')}
            </div>`;
          })()}
        </article>
      `).join("") || `<article class="project-card"><h3>No ${state.projectView} projects</h3><p>Nothing to show here yet.</p></article>`}
    </div>
  `;
}

function projectTasksFor(projectId) {
  return state.tasks.filter((task) => task.projectId === projectId || task.project_id === projectId);
}

function projectTaskStats(projectId) {
  const tasks = projectTasksFor(projectId);
  const complete = tasks.filter((task) => task.lane === "done" || task.status === "Done" || Number(task.progress || 0) >= 100);
  return {
    total: tasks.length,
    complete: complete.length,
    active: tasks.length - complete.length
  };
}

function projectDetailMarkup() {
  const project = projects.find((item) => item.id === state.openProjectId) || projects.find((item) => !item.archivedAt) || projects[0];
  if (!project) {
    state.activeView = "projects";
    return viewMarkup("projects");
  }
  state.openProjectId = project.id;
  const stats = projectTaskStats(project.id);
  const projectTasks = projectTasksFor(project.id);
  return `
    <div class="project-workspace">
      <div class="workspace-bar">
        <button class="secondary-button" type="button" data-back-to-projects>Back to Projects</button>
        <div class="workspace-actions">
          <button class="secondary-button" type="button" data-save-project="${project.id}">Save Project</button>
          ${project.archivedAt
            ? `<button class="danger-button" type="button" data-delete-project="${project.id}">Delete Project</button>`
            : `<button class="secondary-button compact" type="button" data-archive-project="${project.id}">Archive</button>
               <button class="danger-button" type="button" data-delete-project="${project.id}">Delete Project</button>`}
        </div>
      </div>
      <section class="project-detail-hero">
        <div>
          <span class="detail-status ${String(project.status).toLowerCase()}">${project.archivedAt ? "Archived" : project.status}</span>
          <label class="workspace-field">
            Project title
            <input data-project-field="${project.id}" data-field="title" value="${escapeAttribute(project.title)}" ${project.archivedAt ? "disabled" : ""}>
          </label>
          <label class="workspace-field">
            Description
            <textarea data-project-field="${project.id}" data-field="description" rows="2" ${project.archivedAt ? "disabled" : ""}>${escapeHtml(project.description)}</textarea>
          </label>
        </div>
        <div class="project-stats">
          <article><strong>${stats.total}</strong><span>Assigned tasks</span></article>
          <article><strong>${stats.active}</strong><span>Still active</span></article>
          <article><strong>${stats.complete}</strong><span>Completed</span></article>
        </div>
      </section>

      <div class="project-detail-grid">
        <article class="project-settings-card">
          <h3>Project Details</h3>
          <div class="edit-grid">
            <label>Status
              <select data-project-field="${project.id}" data-field="status" ${project.archivedAt ? "disabled" : ""}>
                ${["Active", "Planning", "Paused"].map((status) => `<option ${project.status === status ? "selected" : ""}>${status}</option>`).join("")}
              </select>
            </label>
            <label>Owner<input data-project-field="${project.id}" data-field="owner" value="${escapeAttribute(project.owner)}" ${project.archivedAt ? "disabled" : ""}></label>
            <label>Priority
              <select data-project-field="${project.id}" data-field="priority" ${project.archivedAt ? "disabled" : ""}>
                ${["High", "Medium", "Low"].map((priority) => `<option ${project.priority === priority ? "selected" : ""}>${priority}</option>`).join("")}
              </select>
            </label>
            <label>Progress<input type="number" min="0" max="100" data-project-field="${project.id}" data-field="progress" value="${project.progress}" ${project.archivedAt ? "disabled" : ""}></label>
          </div>
        </article>
        <article class="project-planner-card">
          <div class="project-planner-head">
            <h3>Assigned Tasks</h3>
            <span>${stats.complete}/${stats.total} complete</span>
          </div>
          ${projectTasks.length ? projectPlannerMarkup(projectTasks) : `
            <div class="empty-project-board">
              <strong>No tasks assigned to this project yet.</strong>
              <span>Assign a task to ${escapeHtml(project.title)} from the task detail page, then it will appear here.</span>
            </div>
          `}
        </article>
      </div>
    </div>
  `;
}

function projectPlannerMarkup(projectTasks) {
  return `
    <div class="project-planner-board">
      ${lanes.map((lane) => {
        const laneTasks = projectTasks.filter((task) => task.lane === lane.id);
        return `
          <section class="planner-column">
            <header>
              <h4>${lane.title}</h4>
              <span>${laneTasks.length}</span>
            </header>
            <div class="planner-stack">
              ${laneTasks.map(projectPlannerTaskMarkup).join("") || `<p class="empty-lane">No tasks</p>`}
            </div>
          </section>
        `;
      }).join("")}
    </div>
  `;
}

function projectPlannerTaskMarkup(task) {
  const assignedAgents = getTaskAgents(task);
  return `
    <button class="planner-task-card ${task.lane === "done" ? "completed" : ""}" type="button" data-project-task-open="${task.id}">
      <span class="planner-task-top">
        <strong>${escapeHtml(task.title)}</strong>
        <em>${Number(task.progress || 0)}%</em>
      </span>
      <p>${escapeHtml(task.description || "")}</p>
      <span class="planner-task-meta">
        <span class="priority ${String(task.priority || "Medium").toLowerCase()}">${task.priority || "Medium"}</span>
        <span>${formatDueDate(task.due)}</span>
      </span>
      <span class="planner-task-agents">${assignedAgents.map((agent) => agent.name).join(", ") || "No agent assigned"}</span>
    </button>
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

function addProject() {
  const project = {
    id: crypto.randomUUID(),
    title: "New Project",
    description: "Describe the project, owner, goals, and current focus.",
    status: "Planning",
    owner: "Cece",
    priority: "Medium",
    progress: 0,
    tasks: "0/0"
  };
  projects.unshift(project);
  persistProjects();
  state.projectView = "active";
  state.openProjectId = project.id;
  state.activeView = "project-detail";
  render();
  showToast("Project created");
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
  if (state.openProjectId === id) {
    state.openProjectId = null;
    state.activeView = "projects";
  }
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
  const liveItems = state.calendarItems.filter((item) => !item.deleted);
  return expandedRecurringItems(liveItems, date).filter((item) => item.date === date);
}

function allCalendarItems() {
  return state.calendarItems.filter((item) => !item.deleted);
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
  const hours = calendarHours();
  return `
    <div class="view-actions">
      <button class="secondary-button" type="button" data-calendar-prev>Previous Week</button>
      <button class="create-button compact" type="button" data-calendar-add>Add Calendar Item</button>
      <button class="secondary-button" type="button" data-calendar-next>Next Week</button>
    </div>
    ${(state.calendarComposerOpen || state.openCalendarItemId) ? calendarComposerMarkup() : ""}
    <div class="calendar-preview">
      <div class="calendar-time-rail" aria-hidden="true">
        <span></span>
        ${hours.map((hour) => `<time>${String(hour).padStart(2, "0")}:00</time>`).join("")}
      </div>
      ${days.map((day) => {
        const items = calendarItemsForDay(day.date);
        return `
          <section class="calendar-day-column">
            <h3>${day.label}</h3>
            <div class="calendar-day-body">
              ${hours.map(() => `<span class="calendar-hour-line"></span>`).join("")}
              ${layoutCalendarItems(items).map(({ item, col, totalCols }) => `
                <button class="calendar-event" style="${calendarEventStyle(item, col, totalCols)}" type="button" data-calendar-open="${item.id}" title="${escapeAttribute(`${item.time} ${item.title}`)}">
                  <strong>${escapeHtml(item.time)}</strong>
                  <span>${escapeHtml(item.title)}</span>
                </button>
              `).join("")}
            </div>
          </section>
        `;
      }).join("")}
    </div>
  `;
}

function calendarHours() {
  return Array.from({ length: 14 }, (_, index) => index + 6);
}

function getEventMinutes(item) {
  const [h, m] = String(item.time || "09:00").split(":").map(Number);
  return (Number.isFinite(h) ? h : 9) * 60 + (Number.isFinite(m) ? m : 0);
}

function layoutCalendarItems(items) {
  const sorted = [...items].sort((a, b) => getEventMinutes(a) - getEventMinutes(b));
  const result = [];
  const groups = [];
  for (const item of sorted) {
    const start = getEventMinutes(item);
    const end = start + 60;
    let placed = false;
    for (const group of groups) {
      const overlaps = group.some(g => {
        const gs = getEventMinutes(g.item);
        const ge = gs + 60;
        return start < ge && end > gs;
      });
      if (overlaps) {
        const col = group.length;
        group.push({ item, col });
        placed = true;
        break;
      }
    }
    if (!placed) groups.push([{ item, col: 0 }]);
  }
  for (const group of groups) {
    const totalCols = group.length;
    for (const { item, col } of group) {
      result.push({ item, col, totalCols });
    }
  }
  return result;
}

function calendarEventStyle(item, col = 0, totalCols = 1) {
  const [hourPart, minutePart] = String(item.time || "09:00").split(":").map((value) => Number(value));
  const hour = Number.isFinite(hourPart) ? hourPart : 9;
  const minute = Number.isFinite(minutePart) ? minutePart : 0;
  const startHour = 6;
  const rowHeight = 52;
  const top = Math.max(0, Math.min((calendarHours().length - 1) * rowHeight, ((hour - startHour) * rowHeight) + ((minute / 60) * rowHeight)));
  const width = totalCols > 1 ? `calc(${100 / totalCols}% - 3px)` : "calc(100% - 8px)";
  const left = totalCols > 1 ? `calc(${(col / totalCols) * 100}% + 2px)` : "4px";
  return `top: ${top}px; width: ${width}; left: ${left};`;
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

function scraperMarkup() {
  const activeItems = state.scraperItems.filter((item) => !item.done);
  const selected = state.scraperItems.find((item) => item.id === state.selectedScrapeId) || null;
  return `
    <section class="scraper-shell">
      <div class="scraper-board">
        ${scraperSources.map((source) => scraperLaneMarkup(source)).join("")}
      </div>
      ${scraperDetailMarkup(selected)}
    </section>
    ${scraperSummaryMarkup(selected)}
  `;
}

function scraperLaneMarkup(source) {
  const items = state.scraperItems.filter((item) => source.id === "done" ? item.done : item.source === source.id && !item.done);
  return `
    <section class="scraper-lane ${source.id === "done" ? "done-lane" : ""}">
      <header>
        <div>
          <h3>${source.title}</h3>
          <p>${source.subtitle}</p>
        </div>
        <span>${items.length}</span>
      </header>
      <div class="scraper-stack">
        ${items.map((item) => scraperCardMarkup(item)).join("") || `<p class="empty-lane">No scraped items yet.</p>`}
      </div>
    </section>
  `;
}

function scraperCardMarkup(item) {
  return `
    <button class="scraper-card ${state.selectedScrapeId === item.id ? "selected" : ""}" type="button" data-scraper-select="${item.id}">
      <h4>${escapeHtml(item.title)}</h4>
      <p>${escapeHtml(item.pain)}</p>
      <span class="scraper-card-meta">
        <span class="platform-chip">${escapeHtml(item.platform)}</span>
        <strong class="score ${item.score.toLowerCase()}">${escapeHtml(item.score)}</strong>
        <span class="scraper-date">Populated ${formatDateTime(item.capturedAt)}</span>
      </span>
    </button>
  `;
}

function scraperDetailMarkup(item) {
  if (!item) {
    return "";
  }

  return `
    <aside class="scraper-detail">
      <div class="scraper-detail-head">
        <span class="score ${item.score.toLowerCase()}">${escapeHtml(item.score)}</span>
        <span>${escapeHtml(item.platform)}</span>
        <button class="close-button icon-close" type="button" aria-label="Close scraper detail" data-close-scraper-detail>&times;</button>
      </div>
      <h3>${escapeHtml(item.title)}</h3>
      <p>${escapeHtml(item.pain)}</p>
      ${item.url ? `
        <div class="source-reference">
          <span>Source</span>
          ${SCRAPER_READONLY ? `<span class="scraper-url-text">${escapeHtml(item.url)}</span>` : `<a href="${escapeAttribute(item.url)}" target="_blank" rel="noreferrer">${escapeHtml(item.url)}</a>`}
        </div>
      ` : ""}
      ${SCRAPER_READONLY ? "" : `
      <div style="display:flex;gap:8px;">
        <button class="${item.done ? "secondary-button" : "create-button"} compact" type="button" data-scraper-toggle-done="${escapeAttribute(item.id)}">
          ${item.done ? "Move Back" : "Mark Done"}
        </button>
        <button class="danger-button compact" type="button" data-scraper-delete="${escapeAttribute(item.id)}">Delete</button>
      </div>
      `}
      <div class="scraper-section">
        <h4>Suggested action</h4>
        <p>${escapeHtml(item.suggestion || "Review and decide whether this is worth acting on.")}</p>
      </div>
      <div class="scraper-section">
        <h4>Key quotes</h4>
        <ul>
          ${(item.quotes || []).map((quote) => `<li>${escapeHtml(quote)}</li>`).join("") || "<li>No quotes captured yet.</li>"}
        </ul>
      </div>
      <div class="scraper-section">
        <h4>Draft comments</h4>
        ${(item.draftComments || []).map((comment) => `<blockquote>${escapeHtml(comment)}</blockquote>`).join("") || "<p>No draft comments yet.</p>"}
      </div>
    </aside>
  `;
}

function scraperSummaryMarkup(selected) {
  const summaryDate = new Date();
  const dailyItems = state.scraperItems.filter((item) => !item.done && isSameCalendarDay(item.capturedAt, summaryDate));
  const highCount = dailyItems.filter((item) => item.score === "HIGH").length;
  const top = dailyItems.find((item) => item.score === "HIGH") || dailyItems[0] || null;
  const phrases = [...new Set(dailyItems.flatMap((item) => item.quotes || []))].slice(0, 4);
  if (dailyItems.length === 0) {
    return `
      <section class="scraper-summary">
        <article class="scraper-summary-empty">
          <h3>Daily summary</h3>
          <time>${formatSummaryDate(summaryDate)}</time>
          <p>No scraper intelligence populated for this date yet.</p>
        </article>
      </section>
    `;
  }
  return `
    <section class="scraper-summary">
      <article>
        <h3>What mattered</h3>
        <time>${formatSummaryDate(summaryDate)}</time>
        <ul>
          <li>${dailyItems.length} scrape item${dailyItems.length === 1 ? "" : "s"} populated today.</li>
          <li>${highCount} high-opportunity item${highCount === 1 ? "" : "s"} ready for review.</li>
          <li>${escapeHtml(top?.pain || "No top pain point captured yet.")}</li>
        </ul>
      </article>
      <article>
        <h3>Top opportunity</h3>
        <p><strong>${escapeHtml(top?.platform || "No source")}</strong> - ${escapeHtml(top?.pain || "No pain point captured yet.")}</p>
      </article>
      <article>
        <h3>Best draft comment</h3>
        <p>${escapeHtml(top?.draftComments?.[0] || "No draft comment yet.")}</p>
      </article>
      <article>
        <h3>Phrases to steal</h3>
        <div class="scraper-tags">
          ${phrases.map((phrase) => `<span>${escapeHtml(phrase)}</span>`).join("") || "<span>No phrases yet</span>"}
        </div>
      </article>
      <article>
        <h3>Suggested X searches</h3>
        <p>"roofing quote software", "roofing estimate takes too long", "contractor lead gen"</p>
      </article>
    </section>
  `;
}

function templatesMarkup() {
  const items = state.templates;
  return `
    <div class="view-actions">
      <button class="create-button compact" type="button" data-add-template>Create Template</button>
    </div>
    <div class="resource-grid">
      ${items.map((tpl, i) => `
        <article class="resource-card">
          <h3>${escapeHtml(tpl.title)}</h3>
          <p>${escapeHtml(tpl.copy)}</p>
          <div class="resource-actions">
            <button class="secondary-button compact" type="button" data-preview-card="${escapeAttribute(tpl.title)}" data-preview-copy="${escapeAttribute(tpl.copy)}">Preview</button>
            <button class="secondary-button compact" type="button" data-edit-template="${i}">Edit</button>
            <button class="danger-button compact" type="button" data-delete-template="${i}">Delete</button>
          </div>
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

function templateWorkspaceMarkup() {
  const index = Number.isInteger(state.editTemplateIndex) ? state.editTemplateIndex : 0;
  const template = state.templates[index];
  if (!template) {
    state.activeView = "templates";
    state.editTemplateIndex = null;
    return viewMarkup("templates");
  }
  return `
    <div class="task-workspace template-workspace">
      <div class="workspace-bar">
        <button class="secondary-button" type="button" data-cancel-template-edit>Back to Templates</button>
        <div class="workspace-actions">
          <button class="secondary-button" type="button" data-save-template="${index}">Save Changes</button>
          <button class="danger-button" type="button" data-delete-template="${index}">Delete Template</button>
        </div>
      </div>
      <section class="workspace-hero">
        <span class="detail-status planning">Template</span>
        <label class="workspace-field">
          Template title
          <input type="text" data-template-edit-title value="${escapeAttribute(template.title)}">
        </label>
        <label class="workspace-field">
          Instructions
          <textarea data-template-edit-copy rows="8">${escapeHtml(template.copy)}</textarea>
        </label>
      </section>
      <div class="workspace-grid template-workspace-grid">
        <article>
          <h3>How this template is used</h3>
          <p>Agents can use this as a repeatable recipe when creating new work. Keep the title short and write the instructions as the exact operating brief you want reused.</p>
        </article>
        <article>
          <h3>Preview</h3>
          <div class="template-preview-box">
            <strong>${escapeHtml(template.title)}</strong>
            <p>${escapeHtml(template.copy)}</p>
          </div>
        </article>
      </div>
    </div>
  `;
}

function addTemplateItem() {
  state.templates.unshift({
    title: "New Template",
    copy: "Describe the repeatable task recipe here."
  });
  localStorage.setItem(TEMPLATES_KEY, JSON.stringify(state.templates));
  state.editTemplateIndex = 0;
  state.activeView = "template-detail";
  render();
}

function toggleScraperDone(id) {
  const item = state.scraperItems.find((scrape) => scrape.id === id);
  if (!item) return;
  item.done = !item.done;
  // Keep item selected so user can still read it after marking done
  state.selectedScrapeId = id;
  persistScraperItems();
  render();
  showToast(item.done ? "Scrape item moved to Done" : "Scrape item moved back to review");
}

function integrationsMarkup() {
  const items = state.integrations;
  return `
    <div class="resource-grid">
      ${items.map((item, i) => `
        <article class="resource-card">
          ${state.editIntegrationIndex === i ? `
            <label class="resource-field">Integration name
              <input type="text" data-integration-edit-title value="${escapeAttribute(item.title)}">
            </label>
            <label class="resource-field">Notes
              <textarea data-integration-edit-copy rows="4">${escapeHtml(item.copy)}</textarea>
            </label>
            <div class="resource-actions">
              <button class="create-button compact" type="button" data-save-integration="${i}">Save</button>
              <button class="secondary-button compact" type="button" data-cancel-integration-edit>Cancel</button>
            </div>
          ` : `
            <h3>${escapeHtml(item.title)}</h3>
            <p>${escapeHtml(item.copy)}</p>
            <div class="resource-actions">
              <button class="secondary-button compact" type="button" data-preview-card="${escapeAttribute(item.title)}" data-preview-copy="${escapeAttribute(item.copy)}">Preview</button>
              <button class="secondary-button compact" type="button" data-edit-integration="${i}">Edit</button>
              <button class="danger-button compact" type="button" data-delete-integration="${i}">Delete</button>
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
  if (!agentList) return;
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

function formatSummaryDate(value) {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric"
  });
}

function isSameCalendarDay(value, reference) {
  if (!value) return false;
  const date = new Date(value);
  const target = reference instanceof Date ? reference : new Date(reference);
  if (Number.isNaN(date.getTime()) || Number.isNaN(target.getTime())) return false;
  return date.getFullYear() === target.getFullYear()
    && date.getMonth() === target.getMonth()
    && date.getDate() === target.getDate();
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
  taskSaveLockUntil = Date.now() + 5000; // block refresh for 5s after save
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

function docsMarkup() {
  const openDoc = state.openDocId
    ? state.docs.find((doc) => doc.id === state.openDocId)
    : null;
  const showGrid = !openDoc && !state.docComposerOpen;
  const gridHtml = showGrid ? `
    <div class="docs-grid">
      ${state.docs.filter((doc) => doc.status !== "Archived").map((doc) => `
        <article class="doc-card">
          <div class="doc-card-top">
            <span class="doc-type">${escapeHtml(doc.type || "Notes")}</span>
            <span class="doc-status">${escapeHtml(doc.status || "Draft")}</span>
          </div>
          <h3>${escapeHtml(doc.title)}</h3>
          <p>${escapeHtml(doc.body).slice(0, 180)}${doc.body.length > 180 ? "..." : ""}</p>
          <div class="doc-meta">
            <span>${escapeHtml(doc.author || "Agent")}</span>
            <span>${formatDateTime(doc.updatedAt)}</span>
          </div>
          <button type="button" data-open-doc="${doc.id}">Open Doc</button>
        </article>
      `).join("") || `<article class="doc-card"><h3>No docs yet</h3><p>Agent outputs will appear here.</p></article>`}
    </div>
  ` : "";

  return `
    <div class="view-actions">
      <button class="create-button compact" type="button" data-add-doc>Create Doc</button>
    </div>

    ${state.docComposerOpen ? docComposerMarkup(openDoc) : ""}
    ${openDoc && !state.docComposerOpen ? docReaderMarkup(openDoc) : ""}
    ${gridHtml}
  `;
}

function docReaderMarkup(doc) {
  return `
    <section class="doc-reader">
      <div class="doc-reader-header">
        <div>
          <span class="doc-type">${escapeHtml(doc.type || "Notes")}</span>
          <span class="doc-status">${escapeHtml(doc.status || "Draft")}</span>
          <span class="doc-author">${escapeHtml(doc.author || "Agent")}</span>
        </div>
        <div class="doc-reader-actions">
          <button class="secondary-button compact" type="button" data-edit-doc="${doc.id}">Edit</button>
          <button class="secondary-button compact" type="button" data-doc-cancel>Close</button>
        </div>
      </div>
      <h2 class="doc-reader-title">${escapeHtml(doc.title)}</h2>
      <div class="doc-reader-body">${escapeHtml(doc.body).replace(/\n/g, "<br>")}</div>
    </section>
  `;
}

function docComposerMarkup(doc) {
  return `
    <section class="inline-composer doc-composer">
      <label>
        Title
        <input data-doc-title value="${escapeAttribute(doc?.title || "")}" placeholder="Blog draft, report, brief...">
      </label>

      <label>
        Type
        <select data-doc-type>
          ${["Blog", "Report", "Brief", "Copy", "Research", "Notes"].map((type) => `
            <option ${doc?.type === type ? "selected" : ""}>${type}</option>
          `).join("")}
        </select>
      </label>

      <label>
        Status
        <select data-doc-status>
          ${["Draft", "Ready for Review", "Approved", "Archived"].map((status) => `
            <option ${doc?.status === status ? "selected" : ""}>${status}</option>
          `).join("")}
        </select>
      </label>

      <label>
        Author
        <input data-doc-author value="${escapeAttribute(doc?.author || "Cece")}" placeholder="Cece, Barry, Robbie...">
      </label>

      <label class="wide">
        Content
        <textarea data-doc-body rows="12" placeholder="Paste or write the document here...">${escapeHtml(doc?.body || "")}</textarea>
      </label>

      <div class="composer-actions wide">
        <button class="secondary-button" type="button" data-doc-cancel>Cancel</button>
        ${doc ? `<button class="danger-button compact" type="button" data-doc-delete="${doc.id}">Delete Doc</button>` : ""}
        ${doc ? `<button class="secondary-button compact" type="button" data-doc-archive="${doc.id}">Archive</button>` : ""}
        <button class="create-button compact" type="button" data-doc-save>${doc ? "Save Changes" : "Save Doc"}</button>
      </div>
    </section>
  `;
}

function addDocItem() {
  state.docComposerOpen = true;
  state.openDocId = null;
  render();
}

function openDocItem(id) {
  state.openDocId = id;
  state.docComposerOpen = false;
  render();
}

function saveDocItem() {
  const title = document.querySelector("[data-doc-title]")?.value.trim();
  const body = document.querySelector("[data-doc-body]")?.value.trim();

  if (!title || !body) {
    showToast("Add a title and content");
    return;
  }

  const doc = {
    id: state.openDocId || crypto.randomUUID(),
    title,
    type: document.querySelector("[data-doc-type]")?.value || "Notes",
    status: document.querySelector("[data-doc-status]")?.value || "Draft",
    author: document.querySelector("[data-doc-author]")?.value.trim() || "Cece",
    body,
    updatedAt: new Date().toISOString()
  };

  state.docs = state.docs.filter((item) => item.id !== doc.id);
  state.docs.unshift(doc);

  state.docComposerOpen = false;
  state.openDocId = null;
  state.editorDirty = false;
  persistDocs();
  render();
  showToast("Doc saved");
}

function deleteDocItem(id) {
  const doc = state.docs.find((item) => item.id === id);
  state.docs = state.docs.filter((item) => item.id !== id);
  state.openDocId = null;
  state.docComposerOpen = false;
  state.editorDirty = false;
  persistDocs();
  fetch(`${API_BASE}/api/docs/${id}`, {
    method: "DELETE",
    headers: { "Authorization": `Bearer ${localStorage.getItem("OPENCLAW_AGENT_TOKEN") || "mc-openclaw-2026-secure"}` }
  }).catch(() => {});
  render();
  showToast(`${doc?.title || "Doc"} deleted`);
}

function archiveDocItem(id) {
  const doc = state.docs.find((item) => item.id === id);
  if (!doc) return;
  doc.status = "Archived";
  doc.updatedAt = new Date().toISOString();
  state.openDocId = null;
  state.docComposerOpen = false;
  state.editorDirty = false;
  persistDocs();
  fetch(`${API_BASE}/api/docs/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", "Authorization": `Bearer ${localStorage.getItem("OPENCLAW_AGENT_TOKEN") || "mc-openclaw-2026-secure"}` },
    body: JSON.stringify({ status: "Archived" })
  }).catch(() => {});
  render();
  showToast("Doc archived");
}

function addCalendarItem() {
  state.calendarComposerOpen = true;
  state.openCalendarItemId = null;
  state.editorDirty = false;
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
    fetch(`${API_BASE}/api/calendar/${state.openCalendarItemId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: item.title, date: item.date, time: item.time, description: item.notes, recurring: item.recurring, agentIds: item.owner ? [item.owner.toLowerCase()] : [] })
    }).catch(() => {});
  } else {
    fetch(`${API_BASE}/api/calendar`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: item.title, date: item.date, time: item.time, description: item.notes, recurring: item.recurring, agentIds: item.owner ? [item.owner.toLowerCase()] : [] })
    }).then(r => r.json()).then(d => {
      if (d.event?.id) {
        item.id = d.event.id;
        persistCalendarItems();
      }
    }).catch(() => {});
  }
  state.calendarItems.push(item);
  state.calendarComposerOpen = false;
  state.openCalendarItemId = null;
  state.editorDirty = false;
  persistCalendarItems();
  calendarSaveLockUntil = Date.now() + 5000; // block refresh for 5s
  render();
  showToast(isEditing ? "Calendar item updated" : "Calendar item added");
  // Reload from API after 2s to confirm save landed
  setTimeout(() => loadCalendarFromAPI(), 2000);
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
  if (!String(id).startsWith("seed-")) {
    fetch(`${API_BASE}/api/calendar/${id}`, { method: "DELETE" }).catch(() => {});
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
  const editingId = state.openMemoryId;
  if (editingId) {
    const memory = state.memories.find((item) => item.id === editingId);
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
  if (editingId) {
    fetch(`${API_BASE}/api/memories/${editingId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${localStorage.getItem("OPENCLAW_AGENT_TOKEN") || "mc-openclaw-2026-secure"}` },
      body: JSON.stringify({ title, body })
    }).catch(() => {});
  } else {
    const newMemory = state.memories[0];
    fetch(`${API_BASE}/api/memories`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${localStorage.getItem("OPENCLAW_AGENT_TOKEN") || "mc-openclaw-2026-secure"}` },
      body: JSON.stringify({ title, body })
    }).then((response) => response.json()).then((data) => {
      if (data.memory?.id) {
        newMemory.id = data.memory.id;
        persistMemories();
      }
    }).catch(() => {});
  }
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
  fetch(`${API_BASE}/api/memories/${id}`, {
    method: "DELETE",
    headers: { "Authorization": `Bearer ${localStorage.getItem("OPENCLAW_AGENT_TOKEN") || "mc-openclaw-2026-secure"}` }
  }).catch(() => {});
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
  const addTemplate = event.target.closest("[data-add-template]");
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
  const addDoc = event.target.closest("[data-add-doc]");
  const openDoc = event.target.closest("[data-open-doc]");
  const editDoc = event.target.closest("[data-edit-doc]");
  const saveDoc = event.target.closest("[data-doc-save]");
  const cancelDoc = event.target.closest("[data-doc-cancel]");
  const deleteDoc = event.target.closest("[data-doc-delete]");
  const archiveDoc = event.target.closest("[data-doc-archive]");
  const scraperSelect = event.target.closest("[data-scraper-select]");
  const scraperToggleDone = event.target.closest("[data-scraper-toggle-done]");
  const scraperDelete = event.target.closest("[data-scraper-delete]");
  const scraperCloseDetail = event.target.closest("[data-close-scraper-detail]");
  const addMemory = event.target.closest("[data-add-memory]");
  const memorySave = event.target.closest("[data-memory-save]");
  const memoryCancel = event.target.closest("[data-memory-cancel]");
  const memoryDelete = event.target.closest("[data-memory-delete]");
  const openMemory = event.target.closest("[data-open-memory]");
  const closePreview = event.target.closest("[data-close-preview]");
  const projectView = event.target.closest("[data-project-view]");
  const addProjectButton = event.target.closest("[data-add-project]");
  const saveProjectButton = event.target.closest("[data-save-project]");
  const archiveProjectButton = event.target.closest("[data-archive-project]");
  const deleteProjectButton = event.target.closest("[data-delete-project]");
  const openProjectButton = event.target.closest("[data-open-project]");
  const backToProjects = event.target.closest("[data-back-to-projects]");
  const openProjectTask = event.target.closest("[data-project-task-open]");

  if (nav) {
    state.activeView = nav.dataset.view;
    render();
    if (nav.dataset.view === "scraper") loadScraperFromAPI();
    if (nav.dataset.view === "memory") loadMemoriesFromAPI();
    if (nav.dataset.view === "docs") loadDocsFromAPI();
    if (nav.dataset.view === "calendar") loadCalendarFromAPI();
    if (nav.dataset.view === "checklist") loadChecklistFromAPI();
    return;
  }

  if (projectView) {
    state.projectView = projectView.dataset.projectView;
    render();
    return;
  }

  if (addProjectButton) {
    addProject();
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

  if (openProjectButton) {
    saveProjectFields(openProjectButton.dataset.openProject);
    state.openProjectId = openProjectButton.dataset.openProject;
    state.activeView = "project-detail";
    state.editorDirty = false;
    render();
    return;
  }

  if (backToProjects) {
    state.activeView = "projects";
    render();
    return;
  }

  if (openProjectTask) {
    state.selectedId = openProjectTask.dataset.projectTaskOpen;
    state.activeView = "task-detail";
    render();
    return;
  }

  if (select) {
    state.selectedId = select.dataset.select;
    if (window.matchMedia("(max-width: 768px)").matches) {
      state.activeView = "task-detail";
    }
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

  if (addTemplate) {
    addTemplateItem();
    return;
  }

  if (editTemplate) {
    state.editTemplateIndex = parseInt(editTemplate.dataset.editTemplate, 10);
    state.activeView = "template-detail";
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
    localStorage.setItem(TEMPLATES_KEY, JSON.stringify(state.templates));
    state.editTemplateIndex = null;
    state.activeView = "templates";
    render();
    return;
  }

  if (cancelTemplateEdit) {
    state.editTemplateIndex = null;
    state.activeView = "templates";
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
    localStorage.setItem(INTEGRATIONS_KEY, JSON.stringify(state.integrations));
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
    localStorage.setItem(TEMPLATES_KEY, JSON.stringify(state.templates));
    state.editTemplateIndex = null;
    state.activeView = "templates";
    render();
    return;
  }

  if (deleteIntegration) {
    const idx = parseInt(deleteIntegration.dataset.deleteIntegration, 10);
    state.integrations.splice(idx, 1);
    localStorage.setItem(INTEGRATIONS_KEY, JSON.stringify(state.integrations));
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

  if (addDoc) {
    addDocItem();
    return;
  }

  if (openDoc) {
    openDocItem(openDoc.dataset.openDoc);
    return;
  }

  if (editDoc) {
    state.openDocId = editDoc.dataset.editDoc;
    state.docComposerOpen = true;
    render();
    return;
  }

  if (saveDoc) {
    saveDocItem();
    return;
  }

  if (cancelDoc) {
    state.docComposerOpen = false;
    state.openDocId = null;
    state.editorDirty = false;
    render();
    return;
  }

  if (deleteDoc) {
    deleteDocItem(deleteDoc.dataset.docDelete);
    return;
  }

  if (archiveDoc) {
    archiveDocItem(archiveDoc.dataset.docArchive);
    return;
  }

  if (scraperSelect) {
    state.selectedScrapeId = scraperSelect.dataset.scraperSelect;
    render();
    return;
  }

  if (scraperCloseDetail) {
    state.selectedScrapeId = null;
    render();
    return;
  }

  if (scraperToggleDone) {
    toggleScraperDone(scraperToggleDone.dataset.scraperToggleDone);
    return;
  }

  if (scraperDelete) {
    const id = scraperDelete.dataset.scraperDelete;
    state.scraperItems = state.scraperItems.filter((item) => item.id !== id);
    if (state.selectedScrapeId === id) state.selectedScrapeId = state.scraperItems.find((i) => !i.done)?.id || null;
    persistScraperItems();
    fetch(`${API_BASE}/api/scraper/${id}`, {
      method: "DELETE",
      headers: { "Authorization": `Bearer ${localStorage.getItem("OPENCLAW_AGENT_TOKEN") || "mc-openclaw-2026-secure"}` }
    }).catch(() => {});
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
  const taskCard = event.target.closest("[data-select]");
  if (taskCard) {
    state.selectedId = taskCard.dataset.select;
    state.activeView = "task-detail";
    render();
    return;
  }

  if (event.target.closest("#detailPanel")) {
    state.activeView = "task-detail";
    render();
  }
});

document.addEventListener("change", (event) => {
  if (event.target.closest(".task-workspace") || event.target.closest(".inline-composer") || event.target.closest(".project-card") || event.target.closest(".project-workspace")) {
    state.editorDirty = true;
  }
  const upload = event.target.closest("[data-upload-agent]");
  if (upload && upload.files?.[0]) { saveAgentImage(upload.dataset.uploadAgent, upload.files[0]); return; }

  // Checklist checkbox
  const clCb = event.target.closest("[data-checklist-key]");
  if (clCb && clCb.type === "checkbox") {
    saveChecklistItem(clCb.dataset.checklistKey, clCb.checked);
    return;
  }
  // Checklist number input
  const clNum = event.target.closest("[data-checklist-number]");
  if (clNum) {
    const v = clNum.value;
    saveChecklistItem(clNum.dataset.checklistNumber, parseInt(v, 10) > 0, v);
    return;
  }
});

document.addEventListener("click", (event) => {
  const plBtn = event.target.closest("[data-checklist-postlaunch]");
  if (plBtn) {
    savePostLaunchSetting(plBtn.dataset.checklistPostlaunch === "enable");
  }
}, true); // capture phase so it runs before the main click handler

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
  if (event.target.closest(".task-workspace") || event.target.closest(".inline-composer") || event.target.closest(".project-card") || event.target.closest(".project-workspace")) {
    state.editorDirty = true;
  }
});

document.addEventListener("scroll", (event) => {
  const scraperBoard = event.target.closest?.(".scraper-board");
  if (!scraperBoard) return;
  state.scraperBoardScrollLeft = scraperBoard.scrollLeft;
  sessionStorage.setItem("OPENCLAW_SCRAPER_SCROLL_LEFT", String(state.scraperBoardScrollLeft));
}, true);

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
loadMemoriesFromAPI();
loadDocsFromAPI();
loadScraperFromAPI();
loadCalendarFromAPI();
loadChecklistFromAPI();
setInterval(() => {
  loadRemoteState(true);
  loadMemoriesFromAPI();
  loadDocsFromAPI();
  loadScraperFromAPI();
  loadCalendarFromAPI();
  loadChecklistFromAPI();
}, 30000);

// ── Mobile sidebar toggle ──
const hamburgerBtn = document.getElementById("hamburgerBtn");
const sidebarEl = document.querySelector(".sidebar");
const sidebarOverlay = document.getElementById("sidebarOverlay");

function openSidebar() {
  sidebarEl.classList.add("sidebar-open");
  sidebarOverlay.classList.add("active");
}

function closeSidebar() {
  sidebarEl.classList.remove("sidebar-open");
  sidebarOverlay.classList.remove("active");
}

if (hamburgerBtn) {
  hamburgerBtn.addEventListener("click", () => {
    if (sidebarEl.classList.contains("sidebar-open")) {
      closeSidebar();
    } else {
      openSidebar();
    }
  });
}

if (sidebarOverlay) {
  sidebarOverlay.addEventListener("click", closeSidebar);
}

// Close sidebar when a nav item is tapped on mobile
document.querySelectorAll(".nav-item").forEach(btn => {
  btn.addEventListener("click", () => {
    if (window.innerWidth <= 768) closeSidebar();
  });
});
