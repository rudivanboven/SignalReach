// Server-only: builds and sends the "new Website QA Report request" notification
// through Resend. Imported only by src/app/api/free-report/notify/route.js —
// never import this from a client component (it reads RESEND_API_KEY).

export const NOTIFY_RECIPIENTS = [
  "Rudi.van.boven@signalreach.live",
  "info@signalreach.live",
  "rudi.van.boven@gmail.com",
  "thakurayush511@gmail.com",
];

export const SUPER_ADMIN_URL = "https://www.signalreach.live/super-admin";

const RESEND_ENDPOINT = "https://api.resend.com/emails";

const BRAND = {
  navy: "#0b162b",
  navy2: "#122443",
  gold: "#c99a4a",
  goldSoft: "#f1d49a",
  bg: "#f7f8fb",
  surface: "#ffffff",
  text: "#192335",
  muted: "#667085",
  line: "#e3e7ee",
  green: "#2eb67d",
};

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function withProtocol(url) {
  return /^https?:\/\//i.test(url) ? url : `https://${url}`;
}

export function websiteDomain(url) {
  try {
    return new URL(withProtocol(url)).hostname.replace(/^www\./i, "");
  } catch {
    return url;
  }
}

function formatSubmitted(date) {
  let timeZone = process.env.NOTIFY_TIMEZONE || "UTC";
  try {
    new Intl.DateTimeFormat("en-US", { timeZone });
  } catch {
    timeZone = "UTC";
  }
  const day = new Intl.DateTimeFormat("en-US", { timeZone, month: "long", day: "numeric", year: "numeric" }).format(date);
  const time = new Intl.DateTimeFormat("en-US", { timeZone, hour: "numeric", minute: "2-digit", timeZoneName: "short" }).format(date);
  return { day, time, full: `${day} at ${time}` };
}

// Ordered sections of label/value rows. Values are plain text (or null to omit);
// `href` makes a value a link. Empty "Other" follow-ups never appear.
function buildSections(s, submitted) {
  const name = `${s.first_name} ${s.last_name}`;
  const checkList = s.check_items.filter((c) => c !== "Other");
  if (s.check_other) checkList.push(`Other: ${s.check_other}`);

  return [
    {
      title: "Contact",
      rows: [
        { label: "Name", value: name },
        { label: "Email", value: s.email, href: `mailto:${s.email}` },
        { label: "Phone", value: s.phone || "Not provided", href: s.phone ? `tel:${s.phone.replace(/[^\d+]/g, "")}` : null },
      ],
    },
    {
      title: "Website",
      rows: [
        { label: "Website", value: s.website_url, href: withProtocol(s.website_url) },
        { label: "Industry", value: s.industry },
        { label: "Custom industry", value: s.industry_other },
      ],
    },
    {
      title: "Request",
      rows: [
        { label: "Service", value: s.service_needed },
        { label: "Custom service", value: s.service_other },
        { label: "Areas to check", list: checkList },
        { label: "Additional details", value: s.details },
      ],
    },
    {
      title: "Pricing",
      rows: [
        { label: "Report price", value: "$45" },
        { label: "Pricing agreement", value: s.pricing_decision === "agreed" ? "Agreed" : "Declined", badge: true },
      ],
    },
    {
      title: "Submission",
      rows: [
        { label: "Date", value: submitted.day },
        { label: "Time", value: submitted.time },
        { label: "Status", value: "New", badge: true },
      ],
    },
  ].map((section) => ({ ...section, rows: section.rows.filter((r) => (r.list ? r.list.length : r.value)) }));
}

function renderRowHtml(row) {
  let value;
  if (row.list) {
    value = row.list.map((item) => `<div style="margin:0 0 4px;">&bull;&nbsp; ${escapeHtml(item)}</div>`).join("");
  } else if (row.badge) {
    value = `<span style="display:inline-block;padding:3px 10px;border-radius:999px;background:#e6f6ee;color:${BRAND.green};font-size:12px;font-weight:700;letter-spacing:.04em;text-transform:uppercase;">${escapeHtml(row.value)}</span>`;
  } else if (row.href) {
    value = `<a href="${escapeHtml(row.href)}" style="color:${BRAND.navy2};text-decoration:underline;word-break:break-all;">${escapeHtml(row.value)}</a>`;
  } else {
    value = escapeHtml(row.value).replace(/\r?\n/g, "<br>");
  }
  return `
            <tr>
              <td style="padding:8px 0;width:150px;vertical-align:top;color:${BRAND.muted};font-size:13px;">${escapeHtml(row.label)}</td>
              <td style="padding:8px 0;vertical-align:top;color:${BRAND.text};font-size:15px;line-height:1.5;">${value}</td>
            </tr>`;
}

export function buildNotificationEmail(submission, submittedAt = new Date()) {
  const domain = websiteDomain(submission.website_url);
  const name = `${submission.first_name} ${submission.last_name}`;
  const submitted = formatSubmitted(submittedAt);
  const sections = buildSections(submission, submitted);

  const subject = `New SignalReach Website QA Report Request — ${domain}`;

  const sectionsHtml = sections
    .map(
      (section) => `
        <tr>
          <td style="padding:24px 32px 0;">
            <div style="font-size:11px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:${BRAND.gold};padding-bottom:6px;border-bottom:1px solid ${BRAND.line};">${escapeHtml(section.title)}</div>
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin-top:4px;">${section.rows.map(renderRowHtml).join("")}
            </table>
          </td>
        </tr>`
    )
    .join("");

  const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapeHtml(subject)}</title>
</head>
<body style="margin:0;padding:0;background:${BRAND.bg};font-family:'Helvetica Neue',Arial,sans-serif;">
  <div style="display:none;max-height:0;overflow:hidden;">${escapeHtml(name)} requested a $45 website QA report for ${escapeHtml(domain)}.</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${BRAND.bg};">
    <tr>
      <td align="center" style="padding:32px 16px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:${BRAND.surface};border-radius:14px;overflow:hidden;border:1px solid ${BRAND.line};">
          <tr>
            <td style="background:${BRAND.navy};padding:24px 32px;">
              <span style="font-size:20px;font-weight:700;color:#ffffff;letter-spacing:-.01em;">Signal<span style="color:${BRAND.gold};">Reach</span></span>
            </td>
          </tr>
          <tr>
            <td style="padding:32px 32px 0;">
              <div style="font-size:11px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:${BRAND.gold};">New Website QA Report Request</div>
              <h1 style="margin:10px 0 12px;font-size:24px;line-height:1.25;color:${BRAND.navy};">New Website QA Report Request</h1>
              <p style="margin:0 0 6px;font-size:15px;line-height:1.6;color:${BRAND.muted};">A new website review request has been submitted through SignalReach.</p>
              <p style="margin:0;font-size:15px;line-height:1.6;color:${BRAND.text};"><strong>${escapeHtml(name)}</strong> has submitted <strong>${escapeHtml(domain)}</strong> for review. Report price: <strong>$45</strong>.</p>
            </td>
          </tr>${sectionsHtml}
          <tr>
            <td style="padding:32px;" align="left">
              <a href="${SUPER_ADMIN_URL}" style="display:inline-block;background:${BRAND.navy};color:#ffffff;text-decoration:none;font-size:15px;font-weight:700;padding:13px 24px;border-radius:10px;border-bottom:3px solid ${BRAND.gold};">Open Super Admin</a>
            </td>
          </tr>
          <tr>
            <td style="padding:18px 32px;background:${BRAND.bg};border-top:1px solid ${BRAND.line};font-size:12px;line-height:1.5;color:${BRAND.muted};">
              Automated notification from the SignalReach /free-report form. Reply to this email to contact ${escapeHtml(submission.first_name)} directly.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  const textBody = [
    "SignalReach",
    "",
    "NEW WEBSITE QA REPORT REQUEST",
    "",
    "A new website review request has been submitted through SignalReach.",
    `${name} has submitted ${domain} for review. Report price: $45.`,
    ...sections.flatMap((section) => [
      "",
      "--------------------------------",
      section.title.toUpperCase(),
      ...section.rows.flatMap((row) => ["", `${row.label}:`, ...(row.list ? row.list : [row.value])]),
    ]),
    "",
    "--------------------------------",
    "",
    `Open Super Admin: ${SUPER_ADMIN_URL}`,
  ].join("\n");

  return { subject, html, text: textBody };
}

// Sends one email addressed to every recipient. The Idempotency-Key makes
// Resend drop any repeat of the same submission (e.g. a retried request), so a
// single form submission can only ever produce one notification.
export async function sendNotificationEmail(submission) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;
  if (!apiKey || !from) {
    throw new Error(`Email not configured: missing ${[!apiKey && "RESEND_API_KEY", !from && "EMAIL_FROM"].filter(Boolean).join(", ")}`);
  }

  const { subject, html, text } = buildNotificationEmail(submission);

  const response = await fetch(RESEND_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "Idempotency-Key": `free-report-notify/${submission.submission_id}`,
    },
    body: JSON.stringify({
      from,
      to: NOTIFY_RECIPIENTS,
      reply_to: submission.email,
      subject,
      html,
      text,
    }),
    signal: AbortSignal.timeout(10_000),
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(`Resend responded ${response.status}: ${detail.slice(0, 500)}`);
  }
  return response.json();
}
