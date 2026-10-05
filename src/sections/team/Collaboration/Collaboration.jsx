"use client";

import Icon from "@/components/ui/Icon/Icon";
import { useInView } from "../useTeamMotion";
import styles from "./Collaboration.module.css";

// "How we work together" — compact light section closing the Team page.
// Three expertise nodes converge on a SignalReach review node, which resolves
// into one clear recommendation. Nodes are real HTML (legible at any size);
// the connectors are an SVG whose viewBox matches the container's aspect
// ratio, so percentage-positioned nodes land exactly on the line ends.
//
// Two coordinate layouts: a wide left→right flow (desktop/tablet) and a
// top→bottom flow for narrow screens. CSS shows one at a time.

const inputs = [
  { id: "strategy", label: "Strategy", icon: "target", tone: "blue" },
  { id: "technology", label: "Technology", icon: "code", tone: "cyan" },
  { id: "qa", label: "Website QA", icon: "scan", tone: "teal" },
];

const layouts = {
  wide: {
    viewBox: "0 0 640 380",
    nodes: { strategy: [11, 16], technology: [11, 50], qa: [11, 84], center: [50, 50], output: [88, 50] },
    paths: {
      strategy: "M70.4 60.8 C 170 60.8, 220 190, 320 190",
      technology: "M70.4 190 L 320 190",
      qa: "M70.4 319.2 C 170 319.2, 220 190, 320 190",
      output: "M320 190 L 563.2 190",
    },
  },
  tall: {
    viewBox: "0 0 320 420",
    nodes: { strategy: [16, 12], technology: [50, 12], qa: [84, 12], center: [50, 52], output: [50, 88] },
    paths: {
      strategy: "M51.2 50.4 C 51.2 140, 160 120, 160 218.4",
      technology: "M160 50.4 L 160 218.4",
      qa: "M268.8 50.4 C 268.8 140, 160 120, 160 218.4",
      output: "M160 218.4 L 160 369.6",
    },
  },
};

function Diagram({ layout, name }) {
  const { viewBox, nodes, paths } = layouts[layout];
  const pos = (id) => ({ left: `${nodes[id][0]}%`, top: `${nodes[id][1]}%` });
  return (
    <div className={`${styles.diagram} ${styles[layout]}`} data-layout={layout} aria-hidden={name ? undefined : true}>
      <svg className={styles.lines} viewBox={viewBox} aria-hidden="true">
        {["strategy", "technology", "qa", "output"].map((key, i) => (
          <g key={key} style={{ "--i": i }}>
            <path className={styles.track} d={paths[key]} pathLength="1" />
            <path className={`${styles.draw} ${key === "output" ? styles.drawGold : ""}`} d={paths[key]} pathLength="1" />
            <path className={`${styles.light} ${key === "output" ? styles.lightGold : ""}`} d={paths[key]} pathLength="1" />
          </g>
        ))}
      </svg>

      {inputs.map((n, i) => (
        <div key={n.id} className={`${styles.node} ${styles.input}`} data-tone={n.tone} style={{ ...pos(n.id), "--i": i }}>
          <span className={styles.label}>{n.label}</span>
          <span className={styles.dot}><Icon name={n.icon} /></span>
        </div>
      ))}

      <div className={`${styles.node} ${styles.center}`} style={pos("center")}>
        <span className={styles.ring} />
        <span className={styles.ring} />
        <span className={styles.core}>
          <svg viewBox="0 0 64 52" aria-hidden="true">
            <rect x="4" y="8" width="43" height="34" rx="7" fill="none" stroke="currentColor" strokeWidth="4" />
            <path d="M5 18h41" stroke="currentColor" strokeWidth="4" />
            <circle cx="12" cy="13" r="2" fill="currentColor" /><circle cx="19" cy="13" r="2" fill="currentColor" /><circle cx="26" cy="13" r="2" fill="currentColor" />
            <path d="M20 38c12-2 22-9 31-21" fill="none" stroke="#c99a4a" strokeWidth="5" strokeLinecap="round" />
            <path d="M47 15l11-2-4 11" fill="none" stroke="#c99a4a" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        <span className={styles.label}>SignalReach Review</span>
      </div>

      <div className={`${styles.node} ${styles.output}`} style={pos("output")}>
        <span className={styles.outDot}><Icon name="check" /></span>
        <span className={styles.label}>Clear Recommendations</span>
      </div>
    </div>
  );
}

export default function Collaboration() {
  const [ref, inView] = useInView(0.3);

  return (
    <section ref={ref} className={styles.section} data-inview={inView || undefined} aria-labelledby="collab-title">
      <div className={styles.bg} aria-hidden="true">
        <span className={styles.dots} />
        <span className={styles.glow} />
        <span className={styles.glowGold} />
      </div>

      <div className={`container ${styles.inner}`}>
        <div className={styles.copy}>
          <span className="eyebrow">One team, one review</span>
          <h2 id="collab-title">Different Expertise. <span>One Clear Website Review.</span></h2>
          <p>SignalReach brings strategy, technology and hands-on website review together so every finding is considered from more than one perspective before it becomes a recommendation.</p>
          <ul className={styles.points}>
            <li><i /><span><strong>Strategy</strong> frames what the website needs to achieve.</span></li>
            <li><i /><span><strong>Technology</strong> checks what is realistic to build and fix.</span></li>
            <li><i /><span><strong>Website QA</strong> finds what users actually run into.</span></li>
          </ul>
        </div>

        <div className={styles.visual}>
          <Diagram layout="wide" />
          <Diagram layout="tall" />
          <p className={styles.srOnly}>Diagram: Strategy, Technology and Website QA feed into the SignalReach review, which produces clear recommendations.</p>
        </div>
      </div>
    </section>
  );
}
