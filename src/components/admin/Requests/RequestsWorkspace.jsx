"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import AdminIcon from "@/components/admin/AdminIcon";
import { useTimeZone } from "@/components/admin/LocalDate";
import StatCards from "@/components/admin/StatCards/StatCards";
import { getBrowserSupabase } from "@/lib/supabase-browser";
import { REQUEST_COLUMNS } from "@/lib/admin/queries";
import { DEFAULT_FILTERS, activeFilterCount, applyFilters } from "@/lib/admin/requests";
import FilterBar from "./FilterBar";
import RequestCard from "./RequestCard";
import RequestDetail from "./RequestDetail";
import styles from "./Workspace.module.css";

const LOAD_ERROR = "We couldn’t load the requests. Please try refreshing.";
const SAVE_ERROR = "That change couldn’t be saved. Please try again.";

export default function RequestsWorkspace({ initialRequests, loadError, initialFilters, initialSelectedId }) {
  const timeZone = useTimeZone();
  const [requests, setRequests] = useState(initialRequests);
  const [filters, setFilters] = useState(initialFilters || DEFAULT_FILTERS);
  const [selectedId, setSelectedId] = useState(initialSelectedId);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(loadError ? LOAD_ERROR : "");
  const [toast, setToast] = useState(null);
  const [saving, setSaving] = useState(false);
  const toastTimer = useRef(null);
  const listRef = useRef(null);

  const filtered = useMemo(() => applyFilters(requests, filters, { timeZone }), [requests, filters, timeZone]);
  const selected = useMemo(() => requests.find((r) => r.id === selectedId) || null, [requests, selectedId]);
  const filterCount = activeFilterCount(filters);
  const isSearching = filters.query.trim().length > 0 || filterCount > 0;

  // Keep ?id= in the URL so a refresh re-opens the same request (no navigation).
  useEffect(() => {
    if (typeof window === "undefined") return;
    const url = new URL(window.location.href);
    if (selectedId) url.searchParams.set("id", selectedId);
    else url.searchParams.delete("id");
    window.history.replaceState(window.history.state, "", url);
  }, [selectedId]);

  // Mobile: lock page scroll while the detail overlay is open; Esc closes it.
  useEffect(() => {
    if (!selectedId) return undefined;
    const mq = window.matchMedia("(max-width: 900px)");
    const apply = () => { document.body.style.overflow = mq.matches ? "hidden" : ""; };
    apply();
    mq.addEventListener("change", apply);
    const onKey = (e) => { if (e.key === "Escape") setSelectedId(null); };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      mq.removeEventListener("change", apply);
      window.removeEventListener("keydown", onKey);
    };
  }, [selectedId]);

  const showToast = useCallback((tone, text) => {
    clearTimeout(toastTimer.current);
    setToast({ tone, text });
    toastTimer.current = setTimeout(() => setToast(null), 3200);
  }, []);

  useEffect(() => () => clearTimeout(toastTimer.current), []);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const { data, error: err } = await getBrowserSupabase()
        .from("qa_report_requests")
        .select(REQUEST_COLUMNS)
        .order("created_at", { ascending: false })
        .limit(2000);
      if (err) throw err;
      setRequests(data ?? []);
    } catch (err) {
      console.error("[super-admin] refresh failed:", err?.message || err);
      setError(LOAD_ERROR);
    } finally {
      setLoading(false);
    }
  }, []);

  // Optimistic update of admin-editable fields (status / admin_notes).
  const updateRequest = useCallback(
    async (id, patch) => {
      const previous = requests.find((r) => r.id === id);
      if (!previous) return false;
      setSaving(true);
      setRequests((list) => list.map((r) => (r.id === id ? { ...r, ...patch } : r)));
      try {
        const { data, error: err } = await getBrowserSupabase()
          .from("qa_report_requests")
          .update(patch)
          .eq("id", id)
          .select(REQUEST_COLUMNS)
          .single();
        if (err) throw err;
        setRequests((list) => list.map((r) => (r.id === id ? data : r)));
        return true;
      } catch (err) {
        console.error("[super-admin] update failed:", err?.message || err);
        setRequests((list) => list.map((r) => (r.id === id ? previous : r)));
        showToast("error", SAVE_ERROR);
        return false;
      } finally {
        setSaving(false);
      }
    },
    [requests, showToast]
  );

  const handleStat = (key) => {
    const next = { ...DEFAULT_FILTERS, query: filters.query };
    if (key === "new") next.status = "new";
    if (key === "contacted") next.status = "contacted";
    if (key === "thisMonth") next.range = "month";
    if (key === "today") next.range = "today";
    setFilters(next);
    listRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className={styles.page}>
      <header className={styles.head}>
        <div>
          <span className={styles.eyebrow}>QA Requests</span>
          <h1>QA Report Requests</h1>
          <p>Manage website review requests submitted through SignalReach.</p>
        </div>
        <button type="button" className={styles.refresh} onClick={refresh} disabled={loading} aria-busy={loading}>
          <AdminIcon name="refresh" size={16} className={loading ? styles.spin : ""} />
          {loading ? "Refreshing…" : "Refresh"}
        </button>
      </header>

      <StatCards requests={requests} compact onSelectStat={handleStat} />

      <FilterBar filters={filters} onChange={setFilters} requests={requests} resultCount={filtered.length} />

      {error && (
        <div className={styles.error} role="alert">
          <AdminIcon name="alert" size={18} />
          <div>
            <strong>{error}</strong>
            <span>No submission data is shown until the connection is restored.</span>
          </div>
          <button type="button" onClick={refresh}>Try again</button>
        </div>
      )}

      <div ref={listRef} className={`${styles.master} ${selected ? styles.hasDetail : ""}`}>
        <section className={styles.list} aria-label="Request list" aria-busy={loading}>
          {loading ? (
            <ul className={styles.cards} aria-hidden="true">
              {Array.from({ length: 5 }, (_, i) => <li key={i} className={styles.skeleton} style={{ "--i": i }} />)}
            </ul>
          ) : filtered.length === 0 ? (
            <div className={styles.empty}>
              <span className={styles.emptyIcon}><AdminIcon name={isSearching ? "search" : "inbox"} size={24} /></span>
              <h2>{requests.length === 0 && !error ? "No QA requests yet." : "No matching requests found."}</h2>
              <p>
                {requests.length === 0 && !error
                  ? "New submissions from the public form will appear here."
                  : "Try a different search term or clear some filters."}
              </p>
              {isSearching && (
                <button type="button" className={styles.clear} onClick={() => setFilters(DEFAULT_FILTERS)}>Clear search & filters</button>
              )}
            </div>
          ) : (
            <ul className={styles.cards}>
              {filtered.map((r, i) => (
                <li key={r.id} style={{ "--i": Math.min(i, 12) }}>
                  <RequestCard request={r} selected={r.id === selectedId} onSelect={() => setSelectedId(r.id)} />
                </li>
              ))}
            </ul>
          )}
        </section>

        <aside className={`${styles.detail} ${selected ? styles.detailOpen : ""}`} aria-label="Request details" aria-hidden={!selected}>
          {selected ? (
            <RequestDetail
              key={selected.id}
              request={selected}
              saving={saving}
              onClose={() => setSelectedId(null)}
              onUpdate={(patch) => updateRequest(selected.id, patch)}
              onToast={showToast}
            />
          ) : (
            <div className={styles.detailEmpty}>
              <span className={styles.emptyIcon}><AdminIcon name="notes" size={24} /></span>
              <h2>Select a request</h2>
              <p>Choose a request from the list to see the full submission, change its status, and add internal notes.</p>
            </div>
          )}
        </aside>
      </div>

      <div className={styles.toasts} aria-live="polite">
        {toast && (
          <div className={`${styles.toast} ${styles[toast.tone]}`} role="status">
            <AdminIcon name={toast.tone === "error" ? "alert" : "check"} size={16} />
            {toast.text}
          </div>
        )}
      </div>
    </div>
  );
}
