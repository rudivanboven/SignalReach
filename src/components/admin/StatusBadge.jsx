import { statusMeta } from "@/lib/admin/requests";
import styles from "./StatusBadge.module.css";

export default function StatusBadge({ status, size = "md", className = "" }) {
  const meta = statusMeta(status);
  return (
    <span className={`${styles.badge} ${styles[meta.tone] || styles.neutral} ${styles[size]} ${className}`} data-status={meta.value}>
      <i aria-hidden="true" />
      {meta.label}
    </span>
  );
}
