import Icon from "@/components/ui/Icon/Icon";
import styles from "./RoleBadge.module.css";

// Shared role/title highlight for Team cards.
//   variant "lead"   — navy panel with accent icon (Leadership cards)
//   variant "subtle" — light tinted pill (Specialists)
//   accent           — "gold" | "cyan" | "teal" | "blue"
// The light sweep plays once when an ancestor gets [data-inview]; parents can
// set --badge-lift (e.g. on card hover) to brighten it.
export default function RoleBadge({ role, icon, accent = "cyan", variant = "lead", className = "" }) {
  return (
    <span className={`${styles.badge} ${styles[variant]} ${className}`} data-accent={accent}>
      {icon && <span className={styles.icon} aria-hidden="true"><Icon name={icon} /></span>}
      <span className={styles.label}>{role}</span>
      <span className={styles.sheen} aria-hidden="true" />
    </span>
  );
}
