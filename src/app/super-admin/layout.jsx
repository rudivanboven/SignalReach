import styles from "./admin.module.css";

// Private area. Never indexed, never linked from the public site.
export const metadata = {
  title: { default: "Super Admin", template: "%s · SignalReach Admin" },
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
};

export const dynamic = "force-dynamic";

export default function SuperAdminLayout({ children }) {
  return <div className={styles.root}>{children}</div>;
}
