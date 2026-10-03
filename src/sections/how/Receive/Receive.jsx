"use client";

import { useState } from "react";
import Icon from "@/components/ui/Icon/Icon";
import { useInView, useAutoStep } from "../useHowMotion";
import styles from "./Receive.module.css";

// "What you receive" — four deliverables beside an animated report mockup.
// The active deliverable (auto-advancing, or hovered/focused) highlights its
// matching zone in the mockup. Mockup content is illustrative sample data.

const items = [
  { icon: "layout", title: "Page-by-page findings", text: "See exactly where each issue appears and which section it affects." },
  { icon: "image", title: "Screenshots & context", text: "Understand the visible problem and why it matters to real visitors." },
  { icon: "alert", title: "Severity & impact", text: "Know what is critical, high, medium or low priority." },
  { icon: "ruler", title: "Recommended fixes", text: "Give designers and developers a practical next step for every issue." },
];

const pages = ["Home", "Pricing", "Contact", "Blog"];

const issues = [
  ["critical", "Mobile menu overlaps the logo", "Critical"],
  ["high", "Primary CTA contrast is too low", "High"],
  ["medium", "Form error message is unclear", "Medium"],
];

const chips = [
  { zone: 0, icon: "layout", label: "Pricing page · Hero" },
  { zone: 1, icon: "smartphone", label: "Mobile · 390px" },
  { zone: 2, icon: "gauge", label: "High impact" },
  { zone: 3, icon: "check", label: "Fix ready to hand off" },
];

export default function Receive() {
  const [ref, inView] = useInView(0.2);
  const [hovering, setHovering] = useState(false);
  const [active, setActive] = useAutoStep(items.length, { enabled: inView, paused: hovering, interval: 3600 });

  const zone = (i) => ({ "data-zone": i, "data-on": i === active || undefined });

  return (
    <section ref={ref} className={`${styles.section} section`} data-inview={inView || undefined}>
      <div className={styles.bg} aria-hidden="true">
        <div className={styles.grid} />
        <span className={styles.glowA} />
        <span className={styles.glowB} />
        <span className={styles.beam} />
        <span className={styles.beam} />
      </div>

      <div className={`container ${styles.inner}`}>
        <div className={styles.copy}>
          <span className="eyebrow">What you receive</span>
          <h2>A Website QA report built to be used, <span>not filed away.</span></h2>
          <p className={styles.lead}>The final report is structured to help your team understand each issue quickly, prioritize what matters, and take practical next steps.</p>

          <ul className={styles.list} onPointerLeave={() => setHovering(false)}>
            {items.map((item, i) => (
              <li key={item.title} style={{ "--i": i }}>
                <button
                  type="button"
                  className={styles.item}
                  data-active={i === active || undefined}
                  aria-pressed={i === active}
                  onPointerEnter={() => { setActive(i); setHovering(true); }}
                  onFocus={() => { setActive(i); setHovering(true); }}
                  onBlur={() => setHovering(false)}
                  onClick={() => setActive(i)}
                >
                  <span className={styles.itemIcon}><Icon name={item.icon} /></span>
                  <span className={styles.itemText}>
                    <small>{String(i + 1).padStart(2, "0")}</small>
                    <strong>{item.title}</strong>
                    <span><span>{item.text}</span></span>
                  </span>
                  <i className={styles.timer} />
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.visual} aria-hidden="true">
          <div className={styles.report} data-focus={active}>
            <div className={styles.bar}>
              <i /><i /><i />
              <span>Website QA Report</span>
              <em>yourwebsite.com</em>
            </div>

            <div className={styles.body}>
              <div className={styles.pages} {...zone(0)}>
                <small>Pages</small>
                {pages.map((p, i) => <span key={p} data-current={i === 1 || undefined}>{p}<b>{[3, 5, 2, 1][i]}</b></span>)}
              </div>

              <div className={styles.main}>
                <div className={styles.shot} {...zone(1)}>
                  <b className={styles.shotHero} />
                  <div className={styles.shotRow}><b /><b /><b /></div>
                  <span className={styles.annot}><i>1</i></span>
                  <span className={styles.scan} />
                </div>

                <div className={styles.issues} {...zone(2)}>
                  {issues.map(([level, text, label], i) => (
                    <div key={text} className={styles.issue} style={{ "--i": i }}>
                      <i data-level={level} />
                      <span>{text}</span>
                      <em data-level={level}>{label}</em>
                    </div>
                  ))}
                </div>

                <div className={styles.fix} {...zone(3)}>
                  <small><Icon name="sparkle" />Recommended fix</small>
                  <span /><span /><span />
                </div>
              </div>
            </div>
          </div>

          {chips.map((c, i) => (
            <span key={c.label} className={styles.chip} data-chip={i} data-on={c.zone === active || undefined}>
              <Icon name={c.icon} />{c.label}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
