import RequestsWorkspace from "@/components/admin/Requests/RequestsWorkspace";
import { fetchRequests } from "@/lib/admin/queries";
import { DEFAULT_FILTERS, STATUSES } from "@/lib/admin/requests";
import { createServerSupabase } from "@/lib/supabase-server";

export const metadata = { title: "QA Requests" };

const str = (v) => (typeof v === "string" ? v : "");

export default async function QaRequestsPage({ searchParams }) {
  const supabase = createServerSupabase();
  const { requests, error } = await fetchRequests(supabase);

  // Deep links from the overview page (status / industry / selected id).
  const status = str(searchParams?.status);
  const initialFilters = {
    ...DEFAULT_FILTERS,
    status: STATUSES.some((s) => s.value === status) ? status : "all",
    industry: str(searchParams?.industry) || "all",
    service: str(searchParams?.service) || "all",
  };

  return (
    <RequestsWorkspace
      initialRequests={requests}
      loadError={error}
      initialFilters={initialFilters}
      initialSelectedId={str(searchParams?.id) || null}
    />
  );
}
