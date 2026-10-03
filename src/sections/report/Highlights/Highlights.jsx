"use client";

import { useEffect, useRef, useState } from "react";
import Icon from "@/components/ui/Icon/Icon";
import styles from "./Highlights.module.css";

// "Why request a review" — large white section between the dark hero and the
// dark request form. A website panel is scanned while seven QA checkpoints
// around it activate one by one (connector light → page area highlight →
// checkmark), then a "Review ready" card lights up and the cycle repeats.
// Desktop adds a light cursor parallax and proximity glow on the connectors.

// x/y: checkpoint position in % of the stage. area: panel region it reviews.
const checkpoints = [
  { label: "Layout", icon: "layout", x: 14, y: 16, area: "hero" },
  { label: "Navigation", icon: "link", x: 50, y: 0, area: "nav" },
  { label: "Mobile", icon: "smartphone", x: 86, y: 16, area: "mobile" },
  { label: "Forms", icon: "form", x: 91, y: 54, area: "form" },
  { label: "Functionality", icon: "cursor", x: 83, y: 90, area: "cta" },
  { label: "Usability", icon: "target", x: 17, y: 90, area: "cards" },
  { label: "Content", icon: "text", x: 9, y: 54, area: "text" },
];

const CENTER = [50, 50];
const STEP_MS = 1500;
const HOLD_MS = 3200;

// gentle curve from the panel centre out to a checkpoint (viewBox 100 x 100)
const curve = ({ x, y }) => {
  const [cx, cy] = CENTER;
  const mx = (cx + x) / 2;
  return `M${cx} ${cy} C ${mx} ${cy} ${mx} ${y} ${x} ${y}`;
};

function useSequence(enabled) {
  // phase 0..n-1 = reviewing checkpoint i; n = review ready (hold)
  const [phase, setPhase] = useState(-1);
  useEffect(() => {
    if (!enabled) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { setPhase(checkpoints.length); return; }
    let i = -1;
    let t;
    const tick = () => {
      i = i >= checkpoints.length ? 0 : i + 1;
      setPhase(i);
      t = setTimeout(tick, i === checkpoints.length ? HOLD_MS : STEP_MS);
    };
    t = setTimeout(tick, 900);
    return () => clearTimeout(t);
  }, [enabled]);
  return phase;
}

export default function Highlights() {
  const sectionRef = useRef(null);
  const stageRef = useRef(null);
  const [inView, setInView] = useState(false);
  const [near, setNear] = useState(-1);
  const phase = useSequence(inView);
  const ready = phase === checkpoints.length;
  const activeArea = checkpoints[phase]?.area;

  useEffect(() => {
    const node = sectionRef.current;
    const observer = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setInView(true); observer.disconnect(); }
    }, { threshold: 0.25 });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  // cursor parallax + proximity glow (fine pointers only)
  useEffect(() => {
    const section = sectionRef.current;
    const stage = stageRef.current;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let frame = 0;
    const onMove = (e) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const s = section.getBoundingClientRect();
        section.style.setProperty("--gx", `${e.clientX - s.left}px`);
        section.style.setProperty("--gy", `${e.clientY - s.top}px`);
        const r = stage.getBoundingClientRect();
        const mx = Math.max(-1, Math.min(1, ((e.clientX - r.left) / r.width) * 2 - 1));
        const my = Math.max(-1, Math.min(1, ((e.clientY - r.top) / r.height) * 2 - 1));
        stage.style.setProperty("--mx", mx.toFixed(3));
        stage.style.setProperty("--my", my.toFixed(3));
        let best = -1;
        let bestD = 150;
        checkpoints.forEach((c, i) => {
          const d = Math.hypot(e.clientX - (r.left + (c.x / 100) * r.width), e.clientY - (r.top + (c.y / 100) * r.height));
          if (d < bestD) { bestD = d; best = i; }
        });
        setNear(best);
      });
    };
    const onLeave = () => {
      stage.style.setProperty("--mx", "0");
      stage.style.setProperty("--my", "0");
      setNear(-1);
    };
    section.addEventListener("pointermove", onMove);
    section.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(frame);
      section.removeEventListener("pointermove", onMove);
      section.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  const state = (i) => (ready || i < phase ? "done" : i === phase ? "active" : undefined);
  const area = (name) => ({ "data-area": name, "data-on": activeArea === name || undefined });

  return (
    <section ref={sectionRef} className={styles.section} data-inview={inView || undefined}>
      <div className={styles.bg} aria-hidden="true">
        <div className={styles.dots} />
        <span className={styles.orbit} />
        <span className={styles.orbit} />
        <span className={styles.glow} />
        <span className={styles.cursorGlow} />
      </div>

      <div className="container">
        <div className={styles.head}>
          <span className="eyebrow">Why request a review</span>
          <h2>A Human-Led Review That Shows <span>What Your Website Needs Next.</span></h2>
          <p>SignalReach reviews your website manually across design, usability, responsiveness, content and functionality, then turns the findings into clear, practical recommendations.</p>
        </div>

        <div ref={stageRef} className={styles.stage} data-ready={ready || undefined}>
          {/* connectors */}
          <svg className={styles.links} viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
            {checkpoints.map((c, i) => (
              <g key={c.label} data-state={state(i)} data-near={near === i || undefined}>
                <path className={styles.link} d={curve(c)} />
                <path className={styles.linkRun} pathLength="1" d={curve(c)} />
              </g>
            ))}
          </svg>

          {/* website panel */}
          <div className={styles.panelWrap} aria-hidden="true">
            <div className={styles.panel}>
              <div className={styles.bar}><i /><i /><i /><span>yourwebsite.com</span></div>
              <div className={styles.page}>
                <div className={styles.nav} {...area("nav")}><b className={styles.logo} /><span><b /><b /><b /></span></div>
                <div className={styles.hero} {...area("hero")}>
                  <div className={styles.heroText} {...area("text")}><b /><b /><b /></div>
                  <b className={styles.cta} {...area("cta")} />
                </div>
                <div className={styles.row}>
                  <div className={styles.cards} {...area("cards")}><b /><b /><b /></div>
                  <div className={styles.form} {...area("form")}><b /><b /><i /></div>
                </div>
                <span className={styles.scan} />
              </div>
              <div className={styles.phone} {...area("mobile")}><b /><b /><b /><b /></div>
            </div>
          </div>

          {/* checkpoints */}
          {checkpoints.map((c, i) => (
            <div
              key={c.label}
              className={styles.point}
              data-state={state(i)}
              data-near={near === i || undefined}
              style={{ left: `${c.x}%`, top: `${c.y}%`, "--i": i }}
            >
              <span className={styles.pointIcon}><Icon name={c.icon} /></span>
              {c.label}
              <i className={styles.pointCheck}><Icon name="check" /></i>
            </div>
          ))}

          {/* outcome */}
          <div className={styles.status} aria-hidden="true">
            <span className={styles.statusIcon}><Icon name={ready ? "check" : "scan"} /></span>
            <span>
              <strong>{ready ? "Review ready" : "Reviewing your website…"}</strong>
              <small>{ready ? "Clear, practical recommendations" : `${Math.max(0, Math.min(phase, checkpoints.length))} of ${checkpoints.length} checkpoints`}</small>
            </span>
          </div>
        </div>

        <ul className={styles.pillars} data-ready={ready || undefined}>
          {["Manual Review", "Real Website Context", "Practical Recommendations"].map((t, i) => (
            <li key={t} style={{ "--i": i }}><i />{t}</li>
          ))}
        </ul>
      </div>

      {/* curved hand-off into the dark form section */}
      <svg className={styles.curve} viewBox="0 0 1440 90" preserveAspectRatio="none" aria-hidden="true">
        <path className={styles.curveRun} pathLength="1" d="M0 0 A 720 89 0 0 0 1440 0" />
      </svg>
    </section>
  );
}
