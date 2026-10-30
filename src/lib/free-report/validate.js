import { checks, EMAIL, industries, services, URL_TEST } from "./fields";

// Server-side re-check of a /free-report submission, mirroring the form's own
// rules (required fields, allowed option values, "Other" follow-ups). Returns
// { ok: true, value } with the normalised submission, or { ok: false, error }.

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const LIMITS = { name: 100, email: 254, phone: 40, url: 2048, other: 200, details: 5000 };

function text(value, max, { required = false } = {}) {
  if (value == null || value === "") return required ? { error: "missing" } : { value: null };
  if (typeof value !== "string") return { error: "invalid" };
  const trimmed = value.trim();
  if (!trimmed) return required ? { error: "missing" } : { value: null };
  if (trimmed.length > max) return { error: "too long" };
  return { value: trimmed };
}

export function validateSubmission(body) {
  if (!body || typeof body !== "object" || Array.isArray(body)) return { ok: false, error: "Invalid body" };

  const out = {};
  const take = (key, max, opts) => {
    const r = text(body[key], max, opts);
    if (r.error) throw new Error(`${key}: ${r.error}`);
    out[key] = r.value;
  };

  try {
    if (typeof body.submission_id !== "string" || !UUID.test(body.submission_id)) throw new Error("submission_id: invalid");
    out.submission_id = body.submission_id.toLowerCase();

    if (body.pricing_decision !== "agreed" && body.pricing_decision !== "declined") throw new Error("pricing_decision: invalid");
    out.pricing_decision = body.pricing_decision;

    take("first_name", LIMITS.name, { required: true });
    take("last_name", LIMITS.name, { required: true });
    take("email", LIMITS.email, { required: true });
    if (!EMAIL.test(out.email)) throw new Error("email: invalid");
    take("phone", LIMITS.phone);

    take("website_url", LIMITS.url, { required: true });
    if (!URL_TEST.test(out.website_url)) throw new Error("website_url: invalid");

    take("industry", LIMITS.other, { required: true });
    if (!industries.includes(out.industry)) throw new Error("industry: invalid");
    take("industry_other", LIMITS.other, { required: out.industry === "Other" });
    if (out.industry !== "Other") out.industry_other = null;

    take("service_needed", LIMITS.other, { required: true });
    if (!services.includes(out.service_needed)) throw new Error("service_needed: invalid");
    take("service_other", LIMITS.other, { required: out.service_needed === "Other" });
    if (out.service_needed !== "Other") out.service_other = null;

    const items = body.check_items;
    if (!Array.isArray(items) || !items.length || items.length > checks.length) throw new Error("check_items: invalid");
    if (items.some((c) => !checks.includes(c))) throw new Error("check_items: invalid");
    out.check_items = checks.filter((c) => items.includes(c));
    const hasOther = out.check_items.includes("Other");
    take("check_other", LIMITS.other, { required: hasOther });
    if (!hasOther) out.check_other = null;

    take("details", LIMITS.details);
  } catch (error) {
    return { ok: false, error: error.message };
  }

  return { ok: true, value: out };
}
