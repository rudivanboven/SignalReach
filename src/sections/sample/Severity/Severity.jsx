import styles from "./Severity.module.css";

const labels = { critical: "Critical", high: "High", medium: "Medium", low: "Low", quickwin: "Quick Win" };

// Priority chip used across the sample report (matches the Word document).
export default function Severity({ level, className = "" }) {
  return <span className={`${styles.chip} ${className}`} data-level={level}><i />{labels[level]}</span>;
}
