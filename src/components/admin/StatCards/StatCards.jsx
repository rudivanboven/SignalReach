"use client";

import { useMemo } from "react";
import AdminIcon from "@/components/admin/AdminIcon";
import { useTimeZone } from "@/components/admin/LocalDate";
import { computeStats } from "@/lib/admin/requests";
import styles from "./StatCards.module.css";

const CARDS = [
  { key: "total", label: "Total Requests", icon: "inbox", tone: "navy" },
  { key: "new", label: "New Requests", icon: "spark", tone: "cyan" },
  { key: "thisMonth", label: "This Month", icon: "calendar", tone: "blue" },
  { key: "today", label: "Today", icon: "clock", tone: "gold" },
  { key: "contacted", label: "Contacted", icon: "phone", tone: "teal" },
];

// Live counts computed from the real request list. Dates are evaluated in the
// admin's local time zone after hydration (UTC during the server pass).
export default function StatCards({ requests, compact = false, onSelectStat }) {
  const timeZone = useTimeZone();
  const stats = useMemo(() => computeStats(requests, { timeZone }), [requests, timeZone]);

  return (
    <div className={`${styles.grid} ${compact ? styles.compact : ""}`} role="list" aria-label="Request statistics">
      {CARDS.map((card, i) => {
        const Comp = onSelectStat ? "button" : "div";
        return (
          <Comp
            key={card.key}
            role="listitem"
            className={`${styles.card} ${styles[card.tone]}`}
            style={{ "--i": i }}
            type={onSelectStat ? "button" : undefined}
            onClick={onSelectStat ? () => onSelectStat(card.key) : undefined}
          >
            <span className={styles.icon}><AdminIcon name={card.icon} size={17} /></span>
            <span className={styles.value}>{stats[card.key].toLocaleString("en-US")}</span>
            <span className={styles.label}>{card.label}</span>
          </Comp>
        );
      })}
    </div>
  );
}
