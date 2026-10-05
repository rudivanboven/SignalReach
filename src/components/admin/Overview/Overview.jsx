"use client";

import Link from "next/link";
import { useMemo } from "react";
import AdminIcon from "@/components/admin/AdminIcon";
import LocalDate, { LocalTime, useTimeZone } from "@/components/admin/LocalDate";
import StatCards from "@/components/admin/StatCards/StatCards";
import StatusBadge from "@/components/admin/StatusBadge";
import { displayDomain, fullName, initials, monthKey, monthLabel, statusBreakdown } from "@/lib/admin/requests";
import styles from "./Overview.module.css";

const RECENT_LIMIT = 6;

export default function Overview({ requests, loadError }) {
  const timeZone = useTimeZone();
  const recent = useMemo(() => requests.slice(0, RECENT_LIMIT), [requests]);
  const breakdown = useMemo(() => statusBreakdown(requests), [requests]);
  const maxCount = Math.max(1, ...breakdown.map((b) => b.count));

  const industries = useMemo(() => {
    const counts = new Map();
    for (const r of requests) if (r.industry) counts.set(r.industry, (counts.get(r.industry) || 0) + 1);
    return [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5);
  }, [requests]);

  // Real monthly volume for the last 6 months (no invented data: empty months are 0).
  const months = useMemo(() => {
    const now = new Date();
    const keys = [];
    for (let i = 5; i >= 0; i--) keys.push(monthKey(new Date(now.getFullYear(), now.getMonth() - i, 1), timeZone));
    const counts = Object.fromEntries(keys.map((k) => [k, 0]));
    for (const r of requests) {
      const k = monthKey(r.created_at, timeZone);
      if (k in counts) counts[k]++;
    }
    return keys.map((k) => ({ key: k, count: counts[k] }));
  }, [requests, timeZone]);
  const maxMonth = Math.max(1, ...months.map((m) => m.count));

  return (
    <div className={styles.page}>
      <header className={styles.head}>
        <div>
          <span className={styles.eyebrow}>Overview</span>
          <h1>Dashboard</h1>
          <p>A live snapshot of website QA requests submitted through SignalReach.</p>
        </div>
        <Link href="/super-admin/requests" className={styles.primary}>
          Open QA Requests
          <AdminIcon name="arrowRight" size={16} />
        </Link>
      </header>

      {loadError && (
        <div className={styles.error} role="alert">
          <AdminIcon name="alert" size={18} />
          <div>
            <strong>We couldn’t load the requests.</strong>
            <span>Please refresh the page. If this keeps happening, check the Supabase project status.</span>
          </div>
        </div>
      )}

      <StatCards requests={requests} />

      {requests.length === 0 && !loadError ? (
        <div className={styles.empty}>
          <span className={styles.emptyIcon}><AdminIcon name="inbox" size={26} /></span>
          <h2>No QA requests yet.</h2>
          <p>New submissions from the “Get Your Free QA Report” form will appear here automatically.</p>
        </div>
      ) : (
        <div className={styles.columns}>
          <section className={`${styles.panel} ${styles.recent}`} aria-labelledby="recent-title">
            <header className={styles.panelHead}>
              <div>
                <h2 id="recent-title">Recent requests</h2>
                <p>The latest {Math.min(RECENT_LIMIT, requests.length)} submissions.</p>
              </div>
              <Link href="/super-admin/requests" className={styles.link}>View all <AdminIcon name="arrowRight" size={14} /></Link>
            </header>
            <ul className={styles.recentList}>
              {recent.map((r, i) => (
                <li key={r.id} style={{ "--i": i }}>
                  <Link href={`/super-admin/requests?id=${r.id}`} className={styles.recentRow}>
                    <span className={styles.avatar}>{initials(r)}</span>
                    <span className={styles.recentMain}>
                      <strong>{fullName(r)}</strong>
                      <small>{displayDomain(r.website_url)} · {r.email}</small>
                    </span>
                    <span className={styles.recentMeta}>
                      <StatusBadge status={r.status} size="sm" />
                      <small><LocalDate value={r.created_at} short /> · <LocalTime value={r.created_at} /></small>
                    </span>
                    <AdminIcon name="arrowRight" size={16} className={styles.chev} />
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          <div className={styles.side}>
            <section className={styles.panel} aria-labelledby="status-title">
              <header className={styles.panelHead}>
                <div>
                  <h2 id="status-title">Pipeline</h2>
                  <p>Requests by status.</p>
                </div>
              </header>
              <ul className={styles.bars}>
                {breakdown.map((b) => (
                  <li key={b.value}>
                    <Link href={`/super-admin/requests?status=${b.value}`} className={styles.barRow}>
                      <span className={styles.barLabel}><StatusBadge status={b.value} size="sm" /></span>
                      <span className={styles.barTrack}><i data-tone={b.tone} style={{ width: `${(b.count / maxCount) * 100}%` }} /></span>
                      <span className={styles.barCount}>{b.count}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>

            <section className={styles.panel} aria-labelledby="volume-title">
              <header className={styles.panelHead}>
                <div>
                  <h2 id="volume-title">Volume</h2>
                  <p>Requests per month, last 6 months.</p>
                </div>
              </header>
              <div className={styles.chart} role="img" aria-label={`Monthly request volume: ${months.map((m) => `${monthLabel(m.key)} ${m.count}`).join(", ")}`}>
                {months.map((m) => (
                  <div key={m.key} className={styles.col}>
                    <span className={styles.colCount}>{m.count}</span>
                    <span className={styles.colBar}><i style={{ height: `${Math.max(4, (m.count / maxMonth) * 100)}%` }} data-empty={m.count === 0 || undefined} /></span>
                    <span className={styles.colLabel}>{monthLabel(m.key).slice(0, 3)}</span>
                  </div>
                ))}
              </div>
            </section>

            {industries.length > 0 && (
              <section className={styles.panel} aria-labelledby="industry-title">
                <header className={styles.panelHead}>
                  <div>
                    <h2 id="industry-title">Top industries</h2>
                    <p>Where requests come from.</p>
                  </div>
                </header>
                <ul className={styles.industries}>
                  {industries.map(([name, count]) => (
                    <li key={name}>
                      <Link href={`/super-admin/requests?industry=${encodeURIComponent(name)}`}>
                        <span>{name}</span>
                        <strong>{count}</strong>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
