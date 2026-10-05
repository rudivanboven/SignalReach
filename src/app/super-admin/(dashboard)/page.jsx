import Overview from "@/components/admin/Overview/Overview";
import { fetchRequests } from "@/lib/admin/queries";
import { createServerSupabase } from "@/lib/supabase-server";

export const metadata = { title: "Dashboard" };

export default async function SuperAdminDashboardPage() {
  const supabase = createServerSupabase();
  const { requests, error } = await fetchRequests(supabase);
  return <Overview requests={requests} loadError={error} />;
}
