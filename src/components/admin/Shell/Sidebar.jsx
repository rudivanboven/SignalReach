"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useFormStatus } from "react-dom";
import AdminIcon from "@/components/admin/AdminIcon";
import AdminLogo from "@/components/admin/AdminLogo";
import { signOut } from "@/app/super-admin/actions";
import styles from "./Shell.module.css";

const NAV = [
  { href: "/super-admin", label: "Dashboard", icon: "grid", exact: true },
  { href: "/super-admin/requests", label: "QA Requests", icon: "inbox" },
];

function LogoutButton({ compact = false }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className={compact ? styles.logoutIcon : styles.logout} disabled={pending} aria-busy={pending} aria-label="Log out">
      <AdminIcon name="logout" size={18} />
      {!compact && <span>{pending ? "Signing out…" : "Logout"}</span>}
    </button>
  );
}

export default function Sidebar({ email }) {
  const pathname = usePathname();
  const isActive = (item) => (item.exact ? pathname === item.href : pathname.startsWith(item.href));

  return (
    <aside className={styles.sidebar}>
      <div className={styles.sideTop}>
        <AdminLogo tone="light" className={styles.logo} />
        <AdminLogo tone="light" compact className={styles.logoCompact} />
      </div>

      <nav className={styles.nav} aria-label="Admin">
        {NAV.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`${styles.navLink} ${isActive(item) ? styles.navActive : ""}`}
            aria-current={isActive(item) ? "page" : undefined}
          >
            <AdminIcon name={item.icon} size={18} />
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className={styles.sideBottom}>
        <div className={styles.account} title={email}>
          <span className={styles.avatar}><AdminIcon name="user" size={15} /></span>
          <span className={styles.accountText}>
            <strong>Super Admin</strong>
            <small>{email}</small>
          </span>
        </div>
        <form action={signOut} className={styles.logoutForm}>
          <LogoutButton />
        </form>
        <form action={signOut} className={styles.logoutFormCompact}>
          <LogoutButton compact />
        </form>
      </div>
    </aside>
  );
}
