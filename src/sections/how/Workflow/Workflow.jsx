"use client";

import { useState } from "react";
import Icon from "@/components/ui/Icon/Icon";
import { useInView, useAutoStep } from "../useHowMotion";
import styles from "./Workflow.module.css";

// "The QA workflow" — five steps on an animated process map. On desktop the
// steps sit above/below a curved signal path (odd steps above, even below);
// below 900px it becomes a vertical timeline. The active step auto-advances
// and follows hover/focus.

const steps = [
  { icon: "link", title: "Share your website", text: "Submit your URL and tell us what you want to improve." },
  { icon: "scan", title: "We QA the full website", text: "Pages, sections, design, responsiveness, content, images, forms, navigation and functionality." },
  { icon: "alert", title: "We document the issues", text: "Every finding is organized by page, section, severity and impact, with clear visual context." },
  { icon: "report", title: "You receive the report", text: "Screenshots, clear issue descriptions and practical recommended improvements." },
  { icon: "sparkle", title: "We can help improve it", text: "If required, we can redesign or implement the recommended fixes in a separate phase." },
];

// Node positions along the path (viewBox 1000 x 120): columns at 10/30/50/70/90%.
const nodes = [[100, 30], [300, 90], [500, 30], [700, 90], [900, 30]];
const path = "M100 30 C 200 30 200 90 300 90 S 400 30 500 30 S 600 90 700 90 S 800 30 900 30";

export default function Workflow() {
  const [ref, inView] = useInView(0.2);
  const [hovering, setHovering] = useState(false);
  const [active, setActive] = useAutoStep(steps.length, { enabled: inView, paused: hovering });

  return (
    <section ref={ref} className={`${styles.section} section`} data-inview={inView || undefined}>
      <div className="container">
        <div className={styles.head}>
          <div>
            <span className="eyebrow">The QA workflow</span>
            <h2>A human-led review with <span>clear checkpoints.</span></h2>
          </div>
          <p>SignalReach follows a hands-on review process designed to understand how your website actually performs for real visitors across devices, pages and interactions.</p>
        </div>

        <div
          className={styles.map}
          style={{ "--progress": active / (steps.length - 1) }}
          onPointerEnter={() => setHovering(true)}
          onPointerLeave={() => setHovering(false)}
        >
          <div className={styles.mapBg} aria-hidden="true">
            <div className={styles.grid} />
            <span className={styles.orbit} />
            <span className={styles.orbit} />
            <span className={styles.glow} />
          </div>

          <div className={styles.band} aria-hidden="true">
            <svg viewBox="0 0 1000 120" preserveAspectRatio="none">
              <path className={styles.track} d={path} />
              <path className={styles.draw} pathLength="1" d={path} />
              <path className={styles.fill} pathLength="1" d={path} />
              <path className={styles.pulse} pathLength="1" d={path} />
            </svg>
            {nodes.map(([x, y], i) => (
              <span
                key={x}
                className={styles.node}
                data-state={i === active ? "active" : i < active ? "done" : undefined}
                style={{ left: `${x / 10}%`, top: `${y}px`, "--i": i }}
              />
            ))}
          </div>

          <ol className={styles.steps}>
            {steps.map((step, i) => (
              <li
                key={step.title}
                className={styles.step}
                data-active={i === active || undefined}
                data-pos={i % 2 ? "below" : "above"}
                style={{ "--col": i + 1, "--i": i }}
                tabIndex={0}
                onPointerEnter={() => setActive(i)}
                onFocus={() => { setActive(i); setHovering(true); }}
                onBlur={() => setHovering(false)}
              >
                <div className={styles.stepTop}>
                  <span className={styles.icon}><Icon name={step.icon} /></span>
                  <span className={styles.num}>{String(i + 1).padStart(2, "0")}</span>
                </div>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
