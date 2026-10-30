import { NextResponse } from "next/server";
import { validateSubmission } from "@/lib/free-report/validate";
import { sendNotificationEmail } from "@/lib/free-report/notify-email";

// POST /api/free-report/notify
//
// Called by the /free-report form only AFTER Supabase has confirmed the insert.
// Sends one notification email to the fixed SignalReach team recipients.
//
// Not an open relay: recipients and sender are fixed server-side, the body must
// pass the same validation as the form, the request must come from this site's
// own origin, and each IP is rate limited. Failures are logged here and never
// surfaced to the visitor — the database row is the source of truth.

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_BODY_BYTES = 16 * 1024;
const RATE_WINDOW_MS = 10 * 60 * 1000;
const RATE_MAX = 5;

// Best-effort per-instance limiter (serverless instances do not share memory).
const hits = new Map();

function rateLimited(ip) {
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((t) => now - t < RATE_WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) {
    for (const [key, times] of hits) if (!times.some((t) => now - t < RATE_WINDOW_MS)) hits.delete(key);
  }
  return recent.length > RATE_MAX;
}

function sameOrigin(request) {
  const origin = request.headers.get("origin");
  const host = request.headers.get("x-forwarded-host") || request.headers.get("host");
  if (!origin || !host) return false;
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

export async function POST(request) {
  if (!sameOrigin(request)) return NextResponse.json({ ok: false }, { status: 403 });
  if (!(request.headers.get("content-type") || "").includes("application/json")) {
    return NextResponse.json({ ok: false }, { status: 415 });
  }

  const ip = (request.headers.get("x-forwarded-for") || "").split(",")[0].trim() || "unknown";
  if (rateLimited(ip)) return NextResponse.json({ ok: false }, { status: 429 });

  let body;
  try {
    const raw = await request.text();
    if (raw.length > MAX_BODY_BYTES) return NextResponse.json({ ok: false }, { status: 413 });
    body = JSON.parse(raw);
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const result = validateSubmission(body);
  if (!result.ok) {
    console.warn("[free-report/notify] rejected submission:", result.error);
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  try {
    const sent = await sendNotificationEmail(result.value);
    return NextResponse.json({ ok: true, id: sent?.id ?? null });
  } catch (error) {
    console.error(`[free-report/notify] email failed for submission ${result.value.submission_id}:`, error);
    return NextResponse.json({ ok: false }, { status: 502 });
  }
}
