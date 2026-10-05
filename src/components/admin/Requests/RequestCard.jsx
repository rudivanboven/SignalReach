"use client";

import AdminIcon from "@/components/admin/AdminIcon";
import LocalDate, { LocalTime } from "@/components/admin/LocalDate";
import StatusBadge from "@/components/admin/StatusBadge";
import { displayDomain, fullName, initials } from "@/lib/admin/requests";
import styles from "./RequestCard.module.css";

export default function RequestCard({ request: r, selected, onSelect }) {
  return (
    <button type="button" className={styles.card} data-selected={selected || undefined} onClick={onSelect} aria-pressed={selected}>
      <span className={styles.avatar} aria-hidden="true">{initials(r)}</span>

      <span className={styles.body}>
        <span className={styles.top}>
          <strong className={styles.name}>{fullName(r)}</strong>
          <StatusBadge status={r.status} size="sm" className={styles.badge} />
        </span>

        <span className={styles.site}>
          <AdminIcon name="globe" size={14} />
          {displayDomain(r.website_url)}
        </span>

        <span className={styles.contact}>
          <span><AdminIcon name="mail" size={13} />{r.email}</span>
          {r.phone && <span><AdminIcon name="phone" size={13} />{r.phone}</span>}
        </span>

        <span className={styles.when}>
          <AdminIcon name="clock" size={13} />
          <LocalDate value={r.created_at} short />
          <i aria-hidden="true">·</i>
          <LocalTime value={r.created_at} />
          {r.admin_notes && <em title="Has admin notes"><AdminIcon name="notes" size={13} /> Notes</em>}
        </span>
      </span>

      <AdminIcon name="arrowRight" size={16} className={styles.chev} />
    </button>
  );
}
