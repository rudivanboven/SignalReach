"use client";

import { useMemo } from "react";
import AdminIcon from "@/components/admin/AdminIcon";
import { DEFAULT_FILTERS, RANGE_OPTIONS, STATUSES, activeFilterCount, uniqueValues } from "@/lib/admin/requests";
import styles from "./Workspace.module.css";

export default function FilterBar({ filters, onChange, requests, resultCount }) {
  const industries = useMemo(() => uniqueValues(requests, "industry"), [requests]);
  const services = useMemo(() => uniqueValues(requests, "service_needed"), [requests]);
  const statusCounts = useMemo(() => {
    const counts = { all: requests.length };
    for (const r of requests) counts[r.status] = (counts[r.status] || 0) + 1;
    return counts;
  }, [requests]);

  const set = (key) => (e) => onChange({ ...filters, [key]: e.target.value });
  const active = activeFilterCount(filters);
  const hasQuery = filters.query.trim().length > 0;

  return (
    <div className={styles.filters}>
      <div className={styles.filterRow}>
        <label className={styles.search}>
          <AdminIcon name="search" size={17} />
          <input
            type="search"
            placeholder="Search by name, email or website…"
            value={filters.query}
            onChange={set("query")}
            aria-label="Search requests"
          />
          {hasQuery && (
            <button type="button" onClick={() => onChange({ ...filters, query: "" })} aria-label="Clear search">
              <AdminIcon name="close" size={14} />
            </button>
          )}
        </label>

        <div className={styles.selects}>
          <label className={styles.select}>
            <AdminIcon name="calendar" size={15} />
            <select value={filters.range} onChange={set("range")} aria-label="Date filter">
              {RANGE_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
            <AdminIcon name="chevronDown" size={14} className={styles.caret} />
          </label>

          {filters.range === "custom" && (
            <label className={`${styles.select} ${styles.month}`}>
              <input type="month" value={filters.month} onChange={set("month")} aria-label="Month" />
            </label>
          )}

          <label className={styles.select}>
            <AdminIcon name="building" size={15} />
            <select value={filters.industry} onChange={set("industry")} aria-label="Industry filter">
              <option value="all">All industries</option>
              {industries.map((v) => <option key={v} value={v}>{v}</option>)}
            </select>
            <AdminIcon name="chevronDown" size={14} className={styles.caret} />
          </label>

          <label className={styles.select}>
            <AdminIcon name="tag" size={15} />
            <select value={filters.service} onChange={set("service")} aria-label="Service filter">
              <option value="all">All services</option>
              {services.map((v) => <option key={v} value={v}>{v}</option>)}
            </select>
            <AdminIcon name="chevronDown" size={14} className={styles.caret} />
          </label>

          <button
            type="button"
            className={styles.sort}
            onClick={() => onChange({ ...filters, sort: filters.sort === "newest" ? "oldest" : "newest" })}
            aria-label={`Sort: ${filters.sort === "newest" ? "newest first" : "oldest first"}. Click to toggle.`}
            title="Toggle sort order"
          >
            <AdminIcon name="sort" size={15} />
            {filters.sort === "newest" ? "Newest first" : "Oldest first"}
          </button>
        </div>
      </div>

      <div className={styles.filterRow}>
        <div className={styles.chips} role="group" aria-label="Status filter">
          <button type="button" className={styles.chip} data-active={filters.status === "all" || undefined} onClick={() => onChange({ ...filters, status: "all" })}>
            All <span>{statusCounts.all}</span>
          </button>
          {STATUSES.map((s) => (
            <button
              key={s.value}
              type="button"
              className={styles.chip}
              data-active={filters.status === s.value || undefined}
              data-tone={s.tone}
              onClick={() => onChange({ ...filters, status: filters.status === s.value ? "all" : s.value })}
            >
              <i aria-hidden="true" />
              {s.label} <span>{statusCounts[s.value] || 0}</span>
            </button>
          ))}
        </div>

        <div className={styles.summary}>
          <span>
            Showing <strong>{resultCount}</strong> of <strong>{requests.length}</strong>
          </span>
          {(active > 0 || hasQuery) && (
            <button type="button" className={styles.clear} onClick={() => onChange(DEFAULT_FILTERS)}>
              <AdminIcon name="close" size={13} />
              Clear {active > 0 ? `${active} filter${active > 1 ? "s" : ""}` : "search"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
