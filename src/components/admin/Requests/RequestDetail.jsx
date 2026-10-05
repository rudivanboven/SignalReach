"use client";

import { useEffect, useState } from "react";
import AdminIcon from "@/components/admin/AdminIcon";
import LocalDate, { LocalTime, useHydrated } from "@/components/admin/LocalDate";
import StatusBadge from "@/components/admin/StatusBadge";
import {
  STATUSES,
  displayDomain,
  fullName,
  initials,
  mailtoHref,
  normalizeWebsite,
  telHref,
} from "@/lib/admin/requests";
import styles from "./RequestDetail.module.css";

// Optional: an approved scheduling link. Only rendered when configured.
const RAW_CALENDLY = process.env.NEXT_PUBLIC_CALENDLY_URL || "";
const CALENDLY_URL = /^https:\/\//i.test(RAW_CALENDLY) ? RAW_CALENDLY : "";

function relativeTime(iso) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.round(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins} min ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  const days = Math.round(hours / 24);
  if (days < 30) return `${days} day${days === 1 ? "" : "s"} ago`;
  const months = Math.round(days / 30);
  return `${months} month${months === 1 ? "" : "s"} ago`;
}

function Row({ label, children }) {
  if (children === null || children === undefined || children === "" || (Array.isArray(children) && children.length === 0)) return null;
  return (
    <div className={styles.row}>
      <dt>{label}</dt>
      <dd>{children}</dd>
    </div>
  );
}

function Section({ icon, title, children }) {
  const items = Array.isArray(children) ? children.filter(Boolean) : [children];
  if (items.length === 0) return null;
  return (
    <section className={styles.section}>
      <h3><AdminIcon name={icon} size={15} />{title}</h3>
      <dl>{children}</dl>
    </section>
  );
}

export default function RequestDetail({ request: r, saving, onClose, onUpdate, onToast }) {
  const hydrated = useHydrated();
  const [notes, setNotes] = useState(r.admin_notes || "");
  const [copied, setCopied] = useState("");
  const [savingNotes, setSavingNotes] = useState(false);

  useEffect(() => setNotes(r.admin_notes || ""), [r.id, r.admin_notes]);
  useEffect(() => {
    if (!copied) return undefined;
    const t = setTimeout(() => setCopied(""), 1600);
    return () => clearTimeout(t);
  }, [copied]);

  const website = normalizeWebsite(r.website_url);
  const tel = telHref(r.phone);
  const mailto = mailtoHref(r.email);
  const notesDirty = (notes || "") !== (r.admin_notes || "");

  const copy = async (key, value) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(key);
    } catch {
      onToast("error", "Copy isn’t available in this browser.");
    }
  };

  const changeStatus = async (e) => {
    const status = e.target.value;
    if (status === r.status) return;
    const ok = await onUpdate({ status });
    if (ok) onToast("success", `Status updated to “${STATUSES.find((s) => s.value === status)?.label || status}”.`);
  };

  const saveNotes = async () => {
    setSavingNotes(true);
    const ok = await onUpdate({ admin_notes: notes.trim() ? notes.trim() : null });
    setSavingNotes(false);
    if (ok) onToast("success", "Admin notes saved.");
  };

  const checks = Array.isArray(r.check_items) ? r.check_items : [];

  return (
    <div className={styles.panel}>
      <div className={styles.toolbar}>
        <button type="button" className={styles.back} onClick={onClose}>
          <AdminIcon name="back" size={16} />
          Back to list
        </button>
        <span className={styles.ref} title={r.id}>Ref #{r.id.slice(0, 8)}</span>
        <button type="button" className={styles.close} onClick={onClose} aria-label="Close details">
          <AdminIcon name="close" size={16} />
        </button>
      </div>

      <header className={styles.head}>
        <span className={styles.avatar} aria-hidden="true">{initials(r)}</span>
        <div className={styles.headText}>
          <h2>{fullName(r)}</h2>
          {website ? (
            <a href={website} target="_blank" rel="noopener noreferrer" className={styles.site}>
              <AdminIcon name="globe" size={14} />{displayDomain(r.website_url)}<AdminIcon name="external" size={12} />
            </a>
          ) : (
            <span className={styles.site}><AdminIcon name="globe" size={14} />{r.website_url}</span>
          )}
          <span className={styles.submitted}>
            <AdminIcon name="clock" size={13} />
            Submitted <LocalDate value={r.created_at} /> at <LocalTime value={r.created_at} />
            {hydrated && <em> · {relativeTime(r.created_at)}</em>}
          </span>
        </div>
        <StatusBadge status={r.status} className={styles.headBadge} />
      </header>

      <div className={styles.actions}>
        <a className={styles.action} href={mailto || undefined} aria-disabled={!mailto}>
          <AdminIcon name="mail" size={17} /><span>Email Client</span>
        </a>
        {tel ? (
          <a className={styles.action} href={tel}><AdminIcon name="phone" size={17} /><span>Call Client</span></a>
        ) : (
          <span className={`${styles.action} ${styles.disabled}`} title="No phone number was supplied" aria-disabled="true">
            <AdminIcon name="phone" size={17} /><span>No phone</span>
          </span>
        )}
        {website && (
          <a className={styles.action} href={website} target="_blank" rel="noopener noreferrer">
            <AdminIcon name="external" size={17} /><span>Open Website</span>
          </a>
        )}
        <button type="button" className={styles.action} onClick={() => copy("email", r.email)} data-copied={copied === "email" || undefined}>
          <AdminIcon name={copied === "email" ? "check" : "copy"} size={17} /><span>{copied === "email" ? "Copied!" : "Copy Email"}</span>
        </button>
        <button type="button" className={styles.action} onClick={() => copy("site", website || r.website_url)} data-copied={copied === "site" || undefined}>
          <AdminIcon name={copied === "site" ? "check" : "copy"} size={17} /><span>{copied === "site" ? "Copied!" : "Copy Website"}</span>
        </button>
        {CALENDLY_URL && (
          <a className={`${styles.action} ${styles.gold}`} href={CALENDLY_URL} target="_blank" rel="noopener noreferrer">
            <AdminIcon name="calendar" size={17} /><span>Book Meeting</span>
          </a>
        )}
      </div>

      <div className={styles.statusBox}>
        <div>
          <span className={styles.boxLabel}>Status</span>
          <p>Track where this request is in your workflow.</p>
        </div>
        <label className={styles.statusSelect} data-saving={saving || undefined}>
          <select value={r.status} onChange={changeStatus} disabled={saving} aria-label="Request status">
            {STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
          <AdminIcon name={saving ? "refresh" : "chevronDown"} size={15} className={saving ? styles.spin : ""} />
        </label>
      </div>

      <div className={styles.sections}>
        <Section icon="user" title="Contact">
          <Row label="First name">{r.first_name}</Row>
          <Row label="Last name">{r.last_name}</Row>
          <Row label="Email">{mailto ? <a href={mailto}>{r.email}</a> : r.email}</Row>
          <Row label="Phone">{tel ? <a href={tel}>{r.phone}</a> : r.phone}</Row>
        </Section>

        <Section icon="globe" title="Website">
          <Row label="Website URL">{website ? <a href={website} target="_blank" rel="noopener noreferrer">{r.website_url}</a> : r.website_url}</Row>
          <Row label="Industry">{r.industry}</Row>
          <Row label="Industry (other)">{r.industry_other}</Row>
        </Section>

        <Section icon="tag" title="Request">
          <Row label="Service needed">{r.service_needed}</Row>
          <Row label="Service (other)">{r.service_other}</Row>
          <Row label="Wants checked">
            {checks.length > 0 ? <span className={styles.chips}>{checks.map((c) => <span key={c}>{c}</span>)}</span> : null}
          </Row>
          <Row label="Other check">{r.check_other}</Row>
          <Row label="Additional details">{r.details ? <span className={styles.prose}>{r.details}</span> : null}</Row>
        </Section>

        <Section icon="clock" title="Submission">
          <Row label="Date"><LocalDate value={r.created_at} /></Row>
          <Row label="Time"><LocalTime value={r.created_at} /></Row>
          <Row label="Status"><StatusBadge status={r.status} size="sm" /></Row>
          <Row label="Last updated">{r.updated_at && r.updated_at !== r.created_at ? <LocalDate value={r.updated_at} short withTime /> : null}</Row>
        </Section>
      </div>

      <section className={styles.notes} aria-labelledby="notes-title">
        <div className={styles.notesHead}>
          <h3 id="notes-title"><AdminIcon name="notes" size={15} />Admin notes</h3>
          <span>Internal only — never shown publicly.</span>
        </div>
        <textarea
          rows={4}
          placeholder="e.g. Contacted client — waiting for reply."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          disabled={savingNotes}
        />
        <div className={styles.notesFoot}>
          <button type="button" className={styles.ghost} onClick={() => setNotes(r.admin_notes || "")} disabled={!notesDirty || savingNotes}>Discard</button>
          <button type="button" className={styles.save} onClick={saveNotes} disabled={!notesDirty || savingNotes} aria-busy={savingNotes}>
            {savingNotes ? <><AdminIcon name="refresh" size={15} className={styles.spin} />Saving…</> : <><AdminIcon name="check" size={15} />Save notes</>}
          </button>
        </div>
      </section>
    </div>
  );
}
