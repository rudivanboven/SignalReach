import Link from "next/link";
import styles from "./LogoMark.module.css";

export default function LogoMark({ compact = false, className = "" }) {
  return (
    <Link className={`${styles.logo} ${className}`} href="/" aria-label="SignalReach home">
      <span className={styles.icon} aria-hidden="true">
        <svg viewBox="0 0 64 52" role="img">
          <rect x="4" y="8" width="43" height="34" rx="7" fill="none" stroke="currentColor" strokeWidth="4" />
          <path d="M5 18h41" stroke="currentColor" strokeWidth="4" />
          <circle cx="12" cy="13" r="2" fill="currentColor" />
          <circle cx="19" cy="13" r="2" fill="currentColor" />
          <circle cx="26" cy="13" r="2" fill="currentColor" />
          <path d="M20 38c12-2 22-9 31-21" fill="none" stroke="var(--logo-gold)" strokeWidth="5" strokeLinecap="round" />
          <path d="M47 15l11-2-4 11" fill="none" stroke="var(--logo-gold)" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M14 34h5v5h-5zM23 30h5v9h-5zM32 25h5v14h-5z" fill="var(--logo-gold)" opacity=".95" />
        </svg>
      </span>
      {!compact && (
        <span className={styles.wordmark}>
          <strong>Signal</strong><em>Reach</em>
        </span>
      )}
    </Link>
  );
}
