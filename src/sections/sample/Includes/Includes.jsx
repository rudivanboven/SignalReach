"use client";

import { useState } from "react";
import Icon from "@/components/ui/Icon/Icon";
import { useInView, useAutoStep } from "@/sections/how/useHowMotion";
import styles from "./Includes.module.css";

// "What your report includes" — nine deliverables beside an animated report
// page. The active item (auto-advancing, or hovered/focused) lights up the
// matching part of the page.

const items = [
  { icon: "layout", label: "Page-by-page findings", zone: "pages" },
  { icon: "image", label: "Website screenshots", zone: "shot" },
  { icon: "text", label: "Clear issue descriptions", zone: "desc" },
  { icon: "alert", label: "Severity & impact", zone: "sev" },
  { icon: "smartphone", label: "Responsive QA", zone: "devices" },
  { icon: "form", label: "Functional issues", zone: "func" },
  { icon: "cursor", label: "UX observations", zone: "ux" },
  { icon: "ruler", label: "Practical recommendations", zone: "fix" },
  { icon: "target", label: "Prioritized improvements", zone: "prio" },
];

export default function Includes() {
  const [ref, inView] = useInView(0.2);
  const [hovering, setHovering] = useState(false);
  const [active, setActive] = useAutoStep(items.length, { enabled: inView, paused: hovering, interval: 2200 });
  const zone = (name) => ({ "data-zone": name, "data-on": items[active].zone === name || undefined });

  return (
    <section ref={ref} className={`${styles.section} section`} data-inview={inView || undefined}>
      <div className={styles.bg} aria-hidden="true">
        <div className={styles.grid} />
        <span className={styles.glowA} />
        <span className={styles.glowB} />
        <span className={styles.orbit} />
      </div>

      <div className={`container ${styles.inner}`}>
        <div className={styles.copy}>
          <span className="eyebrow">What your report includes</span>
          <h2>Everything your team needs <span>to act with confidence.</span></h2>
          <p>Your report is built to be used — each part has a job, from showing the issue to deciding what to fix first.</p>
          <ul className={styles.list} onPointerLeave={() => setHovering(false)}>
            {items.map((it, i) => (
              <li key={it.label} style={{ "--i": i }}>
                <button
                  type="button"
                  data-active={i === active || undefined}
                  aria-pressed={i === active}
                  onPointerEnter={() => { setActive(i); setHovering(true); }}
                  onFocus={() => { setActive(i); setHovering(true); }}
                  onBlur={() => setHovering(false)}
                  onClick={() => setActive(i)}
                >
                  <span className={styles.icon}><Icon name={it.icon} /></span>
                  {it.label}
                  <i className={styles.tick}><Icon name="check" /></i>
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.visual} aria-hidden="true">
          <span className={`${styles.sheet} ${styles.sheet2}`} />
          <span className={`${styles.sheet} ${styles.sheet1}`} />
          <div className={styles.doc}>
            <div className={styles.docHead}><b>SignalReach</b><span>QA Report</span><em>Sample</em></div>
            <div className={styles.docBody}>
              <div className={styles.pages} {...zone("pages")}>
                {["Home", "Services", "About", "Contact"].map((p, i) => <span key={p} data-current={i === 0 || undefined}>{p}</span>)}
              </div>
              <div className={styles.main}>
                <div className={styles.shot} {...zone("shot")}><b /><b /><span className={styles.mark}><i>1</i></span><span className={styles.scan} /></div>
                <div className={styles.row}>
                  <div className={styles.desc} {...zone("desc")}><b /><b /><b /></div>
                  <em className={styles.sev} {...zone("sev")}>High</em>
                </div>
                <div className={styles.row}>
                  <div className={styles.devices} {...zone("devices")}><i /><i /><i /></div>
                  <div className={styles.func} {...zone("func")}><b /><i /></div>
                  <div className={styles.ux} {...zone("ux")}><Icon name="cursor" /><b /></div>
                </div>
                <div className={styles.fix} {...zone("fix")}><Icon name="check" /><span><b /><b /></span></div>
                <div className={styles.prio} {...zone("prio")}>
                  {["critical", "high", "medium"].map((l) => <span key={l}><i data-level={l} /><b /></span>)}
                </div>
              </div>
            </div>
          </div>
          <span className={styles.label}>{items[active].label}</span>
        </div>
      </div>
    </section>
  );
}
