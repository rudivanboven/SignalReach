import { redirect } from "next/navigation";
import AdminLogo from "@/components/admin/AdminLogo";
import AdminIcon from "@/components/admin/AdminIcon";
import { ADMIN_HOME, getAdminSession, safeAdminPath } from "@/lib/admin/auth";
import LoginForm from "./LoginForm";
import styles from "./login.module.css";

export const metadata = { title: "Sign in" };

export default async function SuperAdminLoginPage({ searchParams }) {
  // Middleware already handles this, but re-check so a signed-in admin never
  // sees the login form even if middleware were bypassed.
  const { user, isAdmin } = await getAdminSession();
  if (user && isAdmin) redirect(ADMIN_HOME);

  const reason = typeof searchParams?.reason === "string" ? searchParams.reason : "";
  const signedOut = searchParams?.signed_out === "1";
  const next = safeAdminPath(searchParams?.next);

  return (
    <div className={styles.page}>
      <div className={styles.bg} aria-hidden="true">
        <span className={styles.grid} />
        <span className={styles.glowBlue} />
        <span className={styles.glowGold} />
        <span className={styles.beam} />
      </div>

      <main className={styles.main}>
        <div className={styles.brand}>
          <AdminLogo tone="light" href="/" badge={null} />
        </div>

        <section className={styles.card} aria-labelledby="login-title">
          <div className={styles.cardHead}>
            <span className={styles.lock}><AdminIcon name="shield" size={20} /></span>
            <h1 id="login-title">Super Admin</h1>
            <p>Sign in to manage website QA requests.</p>
          </div>

          <LoginForm next={next} reason={reason} signedOut={signedOut} />

          <p className={styles.foot}>
            <AdminIcon name="lock" size={13} />
            Access is restricted to authorised SignalReach administrators.
          </p>
        </section>
      </main>
    </div>
  );
}
