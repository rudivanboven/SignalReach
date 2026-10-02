// Discovery channels around the central website, in story order. `step` is
// the point in the sequence at which the channel lights up; `depth` scales
// its pointer parallax.
export const channels = [
  {
    key: "search",
    step: 2,
    depth: 0.8,
    icon: "seo",
    kicker: "Signal 01",
    label: "Search Visibility",
    text: "Clear structure helps search systems understand your website.",
  },
  {
    key: "ai",
    step: 3,
    depth: 1.25,
    icon: "sparkle",
    kicker: "Signal 02",
    label: "AI-Driven Discovery",
    text: "AI-powered discovery depends on clear, useful and understandable website information.",
  },
  {
    key: "visitors",
    step: 4,
    depth: 1.1,
    icon: "user",
    kicker: "Signal 03",
    label: "Real Visitors",
    text: "Once visitors arrive, clarity, trust and usability determine what happens next.",
  },
  {
    key: "ux",
    step: 5,
    depth: 0.7,
    icon: "smartphone",
    kicker: "Signal 04",
    label: "User Experience",
    text: "Responsive layouts, speed and working functionality shape every visit.",
  },
];

// QA indicators revealed as the scan line passes. `t` is the vertical
// position (0–1) within the page area, which also sets the reveal timing.
export const scanSignals = [
  { label: "Navigation", t: 0.06, side: "r" },
  { label: "Structure", t: 0.2, side: "l" },
  { label: "Performance", t: 0.32, side: "r", minor: true },
  { label: "Content clarity", t: 0.42, side: "l" },
  { label: "Functionality", t: 0.52, side: "r", minor: true },
  { label: "UX", t: 0.72, side: "l" },
  { label: "Responsive", t: 0.88, side: "l", minor: true },
];

export const points = [
  {
    number: "01",
    step: 2,
    title: "Be Discoverable",
    text: "Clear structure and useful content make it easier for search and discovery systems to understand your business.",
  },
  {
    number: "02",
    step: 3,
    title: "Be Understandable",
    text: "AI-driven experiences work best when your website clearly explains who you are, what you offer and who you serve.",
  },
  {
    number: "03",
    step: 4,
    title: "Be Convincing",
    text: "Once someone reaches your website, design, usability and functionality determine whether they trust and engage with it.",
  },
];

// Intro insight panel: who reads the website, and why its quality matters.
export const sources = [
  { label: "Search engines", icon: "seo", tone: "toneSearch" },
  { label: "AI discovery", icon: "sparkle", tone: "toneAi" },
  { label: "Customers", icon: "user", tone: "toneVisitors" },
];

export const reasons = [
  {
    number: "01",
    icon: "layout",
    title: "Clear Structure",
    text: "Logical structure and useful content help search engines and AI-powered discovery understand what you offer.",
  },
  {
    number: "02",
    icon: "smartphone",
    title: "Better Experience",
    text: "Responsive design, strong usability and reliable functionality help visitors navigate and trust you.",
  },
  {
    number: "03",
    icon: "scan",
    title: "Complete QA",
    text: "SignalReach reviews the complete experience to identify issues limiting clarity, trust and performance.",
  },
];
