// Server-side data access for the Super Admin dashboard. Every query runs with
// the signed-in admin's session, so Row Level Security is always enforced —
// a non-admin session simply gets zero rows / permission errors.

export const REQUEST_COLUMNS =
  "id, first_name, last_name, email, phone, website_url, industry, industry_other, service_needed, service_other, check_items, check_other, details, status, admin_notes, created_at, updated_at";

export async function fetchRequests(supabase) {
  const { data, error } = await supabase
    .from("qa_report_requests")
    .select(REQUEST_COLUMNS)
    .order("created_at", { ascending: false })
    .limit(2000);

  if (error) {
    // Log the raw error server-side only; the UI shows a generic message.
    console.error("[super-admin] failed to load qa_report_requests:", error.message);
    return { requests: [], error: true };
  }
  return { requests: data ?? [], error: false };
}
