import { redirect } from "next/navigation";
import Shell from "@/components/admin/Shell/Shell";
import { ADMIN_LOGIN, getAdminSession } from "@/lib/admin/auth";

export const dynamic = "force-dynamic";

// Second line of defence after the middleware: every dashboard page is wrapped
// by this server layout, which re-validates the session AND the super_admin
// role in Postgres before rendering anything.
export default async function DashboardLayout({ children }) {
  const { user, isAdmin } = await getAdminSession();
  if (!user) redirect(ADMIN_LOGIN);
  if (!isAdmin) redirect(`${ADMIN_LOGIN}?reason=forbidden`);

  return <Shell email={user.email}>{children}</Shell>;
}
