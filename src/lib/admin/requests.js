// Domain helpers for QA report requests used by the Super Admin dashboard.
// Pure functions only — safe to import from server and client components.

export const STATUSES = [
  { value: "new", label: "New", tone: "new" },
  { value: "contacted", label: "Contacted", tone: "contacted" },
  { value: "reviewing", label: "Reviewing", tone: "reviewing" },
  { value: "report_in_progress", label: "Report In Progress", tone: "progress" },
  { value: "report_sent", label: "Report Sent", tone: "sent" },
  { value: "completed", label: "Completed", tone: "completed" },
];

const STATUS_BY_VALUE = Object.fromEntries(STATUSES.map((s) => [s.value, s]));

export function statusMeta(value) {
  return STATUS_BY_VALUE[value] || { value, label: humanize(value || "unknown"), tone: "neutral" };
}

export function humanize(value) {
  return String(value)
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export function fullName(r) {
  return [r.first_name, r.last_name].filter(Boolean).join(" ").trim() || "Unnamed";
}

export function initials(r) {
  const a = (r.first_name || "").trim()[0] || "";
  const b = (r.last_name || "").trim()[0] || "";
  return (a + b).toUpperCase() || "?";
}

// Builds a safe http(s) URL from whatever the visitor typed ("yourwebsite.com").
// Returns null if the value cannot be turned into an http(s) URL.
export function normalizeWebsite(raw) {
  if (!raw) return null;
  let value = String(raw).trim();
  if (!value) return null;
  if (!/^[a-z][a-z0-9+.-]*:\/\//i.test(value)) value = `https://${value}`;
  try {
    const url = new URL(value);
    if (url.protocol !== "http:" && url.protocol !== "https:") return null;
    return url.toString();
  } catch {
    return null;
  }
}

export function displayDomain(raw) {
  const url = normalizeWebsite(raw);
  if (!url) return raw || "";
  try {
    const u = new URL(url);
    const path = u.pathname && u.pathname !== "/" ? u.pathname.replace(/\/$/, "") : "";
    return u.host.replace(/^www\./, "") + path;
  } catch {
    return raw;
  }
}

export function telHref(phone) {
  if (!phone) return null;
  const cleaned = String(phone).replace(/[^\d+]/g, "");
  if (cleaned.replace(/\D/g, "").length < 5) return null;
  return `tel:${cleaned}`;
}

export const EMAIL_SUBJECT = "SignalReach — Your Website QA Request";

export function mailtoHref(email, subject = EMAIL_SUBJECT) {
  if (!email) return null;
  return `mailto:${encodeURIComponent(email).replace(/%40/g, "@")}?subject=${encodeURIComponent(subject)}`;
}

// ---------- Dates --------------------------------------------------------
// All formatters accept an optional IANA timeZone so server-rendered output can
// be made deterministic ("UTC") and then re-rendered in the admin's local zone
// after hydration (see components/admin/LocalDate.jsx).

export function toDate(value) {
  const d = value instanceof Date ? value : new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

export function formatDate(value, { timeZone, short = false } = {}) {
  const d = toDate(value);
  if (!d) return "";
  return new Intl.DateTimeFormat("en-US", { timeZone, year: "numeric", month: short ? "short" : "long", day: "numeric" }).format(d);
}

export function formatTime(value, { timeZone } = {}) {
  const d = toDate(value);
  if (!d) return "";
  return new Intl.DateTimeFormat("en-US", { timeZone, hour: "numeric", minute: "2-digit" }).format(d);
}

export function formatDateTime(value, opts) {
  const d = toDate(value);
  if (!d) return "";
  return `${formatDate(d, opts)} · ${formatTime(d, opts)}`;
}

// "2026-10-05" in the given zone (en-CA yields ISO-like ordering).
export function dayKey(value, timeZone) {
  const d = toDate(value);
  if (!d) return "";
  return new Intl.DateTimeFormat("en-CA", { timeZone, year: "numeric", month: "2-digit", day: "2-digit" }).format(d);
}

// "2026-10"
export function monthKey(value, timeZone) {
  return dayKey(value, timeZone).slice(0, 7);
}

export function monthLabel(key, timeZone) {
  if (!key) return "";
  const [y, m] = key.split("-").map(Number);
  return new Intl.DateTimeFormat("en-US", { timeZone: "UTC", month: "long", year: "numeric" }).format(new Date(Date.UTC(y, m - 1, 1)));
}

// ---------- Stats --------------------------------------------------------

export function computeStats(requests, { timeZone, now = new Date() } = {}) {
  const today = dayKey(now, timeZone);
  const month = monthKey(now, timeZone);
  let newCount = 0, contacted = 0, thisMonth = 0, todayCount = 0;
  for (const r of requests) {
    if (r.status === "new") newCount++;
    if (r.status === "contacted") contacted++;
    const dk = dayKey(r.created_at, timeZone);
    if (dk === today) todayCount++;
    if (dk.slice(0, 7) === month) thisMonth++;
  }
  return { total: requests.length, new: newCount, contacted, thisMonth, today: todayCount };
}

export function statusBreakdown(requests) {
  const counts = Object.fromEntries(STATUSES.map((s) => [s.value, 0]));
  for (const r of requests) counts[r.status] = (counts[r.status] || 0) + 1;
  return STATUSES.map((s) => ({ ...s, count: counts[s.value] || 0 }));
}

// ---------- Search / filter / sort ------------------------------------------

export const DEFAULT_FILTERS = {
  query: "",
  status: "all",
  range: "all", // all | today | 7d | 30d | month | custom
  month: "", // YYYY-MM when range === "custom"
  industry: "all",
  service: "all",
  sort: "newest", // newest | oldest
};

export const RANGE_OPTIONS = [
  { value: "all", label: "All time" },
  { value: "today", label: "Today" },
  { value: "7d", label: "Last 7 days" },
  { value: "30d", label: "Last 30 days" },
  { value: "month", label: "This month" },
  { value: "custom", label: "Specific month…" },
];

export function industryLabel(r) {
  return r.industry === "Other" && r.industry_other ? `Other · ${r.industry_other}` : r.industry || "";
}

export function serviceLabel(r) {
  return r.service_needed === "Other" && r.service_other ? `Other · ${r.service_other}` : r.service_needed || "";
}

export function uniqueValues(requests, key) {
  const set = new Set();
  for (const r of requests) if (r[key]) set.add(r[key]);
  return [...set].sort((a, b) => a.localeCompare(b));
}

export function matchesQuery(r, query) {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  const hay = [r.first_name, r.last_name, fullName(r), r.email, r.website_url, displayDomain(r.website_url)]
    .filter(Boolean)
    .join(" \u0000 ")
    .toLowerCase();
  return hay.includes(q);
}

export function matchesRange(r, filters, { timeZone, now = new Date() } = {}) {
  const { range, month } = filters;
  if (range === "all") return true;
  const created = toDate(r.created_at);
  if (!created) return false;
  if (range === "today") return dayKey(created, timeZone) === dayKey(now, timeZone);
  if (range === "7d") return now - created <= 7 * 86400000;
  if (range === "30d") return now - created <= 30 * 86400000;
  if (range === "month") return monthKey(created, timeZone) === monthKey(now, timeZone);
  if (range === "custom") return month ? monthKey(created, timeZone) === month : true;
  return true;
}

export function applyFilters(requests, filters, ctx) {
  const out = requests.filter(
    (r) =>
      matchesQuery(r, filters.query) &&
      (filters.status === "all" || r.status === filters.status) &&
      (filters.industry === "all" || r.industry === filters.industry) &&
      (filters.service === "all" || r.service_needed === filters.service) &&
      matchesRange(r, filters, ctx)
  );
  out.sort((a, b) => {
    const da = toDate(a.created_at)?.getTime() ?? 0;
    const db = toDate(b.created_at)?.getTime() ?? 0;
    return filters.sort === "oldest" ? da - db : db - da;
  });
  return out;
}

export function activeFilterCount(filters) {
  let n = 0;
  if (filters.status !== "all") n++;
  if (filters.range !== "all") n++;
  if (filters.industry !== "all") n++;
  if (filters.service !== "all") n++;
  return n;
}
