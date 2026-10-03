"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import Icon from "@/components/ui/Icon/Icon";
import { useInView } from "@/sections/how/useHowMotion";
import Severity from "../Severity/Severity";
import data from "../reportData.json";
import styles from "./ReportViewer.module.css";

// Interactive sample report: table of contents on the left, a paper-style
// document page on the right. Content comes from reportData.json — the same
// data used to build the downloadable Word report.

const sevOrder = data.severities.map((s) => s.id);
const findingsIn = (id) => data.findings.filter((f) => f.section === id);

const chapters = [
  { id: "cover", label: "Cover" },
  { id: "summary", label: "Executive Summary" },
  ...data.sections.map((s) => ({ id: s.id, label: s.short, count: findingsIn(s.id).length })),
  { id: "recommendations", label: "Recommendations" },
];

export function DownloadButton({ className = "", children = "Download Sample Word Report" }) {
  return (
    <a className={`${styles.download} ${className}`} href={data.meta.docx} download>
      <span className={styles.downloadIcon}><Icon name="fileText" /><em>W</em></span>
      {children}
      <Icon name="download" />
    </a>
  );
}

function Finding({ f }) {
  return (
    <article className={styles.finding} id={`finding-${f.id}`}>
      <div className={styles.findingMeta}>
        <span className={styles.findingNum}>Finding {f.id}</span>
        <span>{f.page} — {f.area}</span>
        <span className={styles.device}>{f.device}</span>
      </div>
      <h4>{f.title}</h4>
      <figure className={styles.shot} data-shape={f.shape}>
        <a href={f.image} target="_blank" rel="noopener noreferrer" aria-label={`Open screenshot for finding ${f.id} in a new tab`}>
          <img src={f.image} width={f.w} height={f.h} loading="lazy" alt={`Demo website screenshot — ${f.page}, ${f.area} (${f.device}), with the issue highlighted`} />
          <span className={styles.shotScan} aria-hidden="true" />
        </a>
        <figcaption>Screenshot · {f.page}, {f.area} · {f.device}</figcaption>
      </figure>
      <dl className={styles.details}>
        <div><dt>Issue</dt><dd>{f.found}</dd></div>
        <div><dt>Why it matters</dt><dd>{f.why}</dd></div>
        <div><dt>Priority</dt><dd><Severity level={f.severity} /></dd></div>
        <div className={styles.fix}><dt>Recommended improvement</dt><dd>{f.fix}</dd></div>
      </dl>
    </article>
  );
}

function Cover() {
  return (
    <div className={styles.cover}>
      <div className={styles.coverBand}>
        <strong>SignalReach</strong>
        <small>Sample / Demonstration Report</small>
        <h3>{data.meta.title}</h3>
        <p>{data.meta.website}</p>
      </div>
      <img className={styles.coverShot} src={data.findings[0].image} width={data.findings[0].w} height={data.findings[0].h} alt="Demo website homepage used throughout this sample report" />
      <dl className={styles.metaTable}>
        {[["Website", data.meta.website], ["Report type", data.meta.reportType], ["Status", data.meta.status], ["Reviewed at", data.meta.reviewedOn], ["Prepared by", data.meta.preparedBy]].map(([k, v]) => (
          <div key={k}><dt>{k}</dt><dd>{v}</dd></div>
        ))}
      </dl>
      <p className={styles.note}>{data.disclaimer}</p>
    </div>
  );
}

function Summary() {
  const counts = data.severities.map((s) => ({ ...s, count: data.findings.filter((f) => f.severity === s.id).length }));
  const max = Math.max(...counts.map((c) => c.count));
  return (
    <div>
      <h3>Executive Summary</h3>
      <p>{data.summary.text}</p>
      <p>{data.summary.overall}</p>
      <div className={styles.counts}>
        <span className={styles.kicker}>Findings by priority <em>Demo data</em></span>
        {counts.map((c, i) => (
          <div key={c.id} className={styles.countRow} style={{ "--w": `${(c.count / max) * 100}%`, "--i": i }}>
            <Severity level={c.id} />
            <span className={styles.track}><i data-level={c.id} /></span>
            <strong>{c.count}</strong>
          </div>
        ))}
        <small>Sample counts for demonstration — not measured client results. {data.findings.length} findings in total.</small>
      </div>
      <span className={styles.kicker}>Areas covered in a SignalReach review</span>
      <div className={styles.cats}>
        {data.categories.map((c) => (
          <div key={c.title}><strong>{c.title}</strong><span>{c.items.join(" · ")}</span></div>
        ))}
      </div>
    </div>
  );
}

function Section({ id }) {
  const s = data.sections.find((x) => x.id === id);
  const list = findingsIn(id);
  return (
    <div>
      <span className={styles.kicker}>Section · {s.short}</span>
      <h3>{s.title}</h3>
      <p>{s.intro}</p>
      <ul className={styles.index}>
        {list.map((f) => (
          <li key={f.id}>
            <a href={`#finding-${f.id}`}><b>{f.id}</b>{f.title}</a>
            <Severity level={f.severity} />
          </li>
        ))}
      </ul>
      {list.map((f) => <Finding key={f.id} f={f} />)}
    </div>
  );
}

function Recommendations() {
  const sorted = [...data.findings].sort((a, b) => sevOrder.indexOf(a.severity) - sevOrder.indexOf(b.severity) || a.id.localeCompare(b.id));
  return (
    <div>
      <h3>Prioritized Recommendations</h3>
      <p>All findings in recommended order of work, from the most to the least urgent.</p>
      <ol className={styles.recs}>
        {sorted.map((f) => (
          <li key={f.id}>
            <span className={styles.recNum}>{f.id}</span>
            <div><Severity level={f.severity} /><strong>{f.title}</strong><span>{f.fix}</span></div>
          </li>
        ))}
      </ol>
      <h4 className={styles.subhead}>Suggested next steps</h4>
      <ol className={styles.steps}>{data.nextSteps.map((t) => <li key={t}>{t}</li>)}</ol>
      <p className={styles.note}>{data.disclaimer}</p>
    </div>
  );
}

export default function ReportViewer() {
  const [ref, inView] = useInView(0.08);
  const [active, setActive] = useState(0);
  const paperRef = useRef(null);
  const chapter = chapters[active];

  const go = (i) => {
    if (i < 0 || i >= chapters.length) return;
    setActive(i);
    const top = paperRef.current?.getBoundingClientRect().top ?? 0;
    if (top < 80) window.scrollTo({ top: window.scrollY + top - 100, behavior: "smooth" });
  };

  return (
    <section ref={ref} id="report" className={styles.section} data-inview={inView || undefined}>
      <div className={styles.bg} aria-hidden="true"><div className={styles.grid} /><span className={styles.glow} /></div>

      <div className="container">
        <div className={styles.head}>
          <span className="eyebrow">See the report in action</span>
          <h2>A Realistic Example of How We <span>Document Website Issues.</span></h2>
          <p>Every finding includes visual context, a clear explanation and a practical recommendation so you know exactly what needs attention and why.</p>
        </div>

        <div className={styles.bar}>
          <div className={styles.barText}>
            <strong>Review the sample first.</strong>
            <span>Then submit your website to receive your own personalized report.</span>
          </div>
          <div className={styles.barActions}>
            <DownloadButton />
            <Link className={styles.cta} href="/free-report">Get Your Free QA Report <Icon name="arrowRight" /></Link>
          </div>
        </div>

        <div className={styles.viewer}>
          <aside className={styles.toc}>
            <div className={styles.tocHead}>
              <span className={styles.demo}>Sample / Demonstration Report</span>
              <strong>{data.meta.website}</strong>
            </div>
            <label className={styles.select}>
              <span>Report section</span>
              <select value={active} onChange={(e) => go(Number(e.target.value))}>
                {chapters.map((c, i) => <option key={c.id} value={i}>{String(i + 1).padStart(2, "0")} · {c.label}{c.count ? ` (${c.count})` : ""}</option>)}
              </select>
            </label>
            <nav aria-label="Report contents">
              <ol>
                {chapters.map((c, i) => (
                  <li key={c.id}>
                    <button type="button" data-active={i === active || undefined} aria-current={i === active ? "true" : undefined} onClick={() => go(i)}>
                      <em>{String(i + 1).padStart(2, "0")}</em>
                      <span>{c.label}</span>
                      {c.count ? <b>{c.count}</b> : null}
                    </button>
                  </li>
                ))}
              </ol>
            </nav>
            <DownloadButton className={styles.tocDownload}>Download .docx</DownloadButton>
          </aside>

          <div className={styles.stack} ref={paperRef}>
            <div className={styles.paper}>
              <div className={styles.paperHead}>
                <span><b>SignalReach</b> · Sample Website QA Report</span>
                <em>Sample / Demo</em>
              </div>
              <div key={chapter.id} className={styles.page}>
                {chapter.id === "cover" && <Cover />}
                {chapter.id === "summary" && <Summary />}
                {chapter.id === "recommendations" && <Recommendations />}
                {data.sections.some((s) => s.id === chapter.id) && <Section id={chapter.id} />}
              </div>
              <div className={styles.paperFoot}>
                <button type="button" onClick={() => go(active - 1)} disabled={active === 0}><Icon name="arrowRight" />Previous</button>
                <span>Section {active + 1} of {chapters.length}</span>
                <button type="button" onClick={() => go(active + 1)} disabled={active === chapters.length - 1}>Next<Icon name="arrowRight" /></button>
              </div>
            </div>
          </div>
        </div>

        <p className={styles.disclaimer}><Icon name="alert" />{data.disclaimer}</p>
      </div>
    </section>
  );
}
