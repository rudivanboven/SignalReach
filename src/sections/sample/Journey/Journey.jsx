"use client";

import Icon from "@/components/ui/Icon/Icon";
import { useInView } from "@/sections/how/useHowMotion";
import styles from "./Journey.module.css";

// "From website to report" — five stages joined by a flowing connector; a
// light runs along it and each node glows as it passes.

const stages = [
  { icon: "link", title: "Your Website", text: "You share the URL and your goals." },
  { icon: "scan", title: "Manual QA", text: "Every page and device is reviewed by hand." },
  { icon: "image", title: "Screenshots + Findings", text: "Each issue is captured and explained." },
  { icon: "target", title: "Prioritized Recommendations", text: "Fixes ordered by severity and impact." },
  { icon: "fileText", title: "Your QA Report", text: "A clear, practical report you can act on." },
];

export default function Journey() {
  const [ref, inView] = useInView(0.25);
  return (
    <section ref={ref} className={`${styles.section} section`} data-inview={inView || undefined}>
      <div className={styles.bg} aria-hidden="true"><div className={styles.dots} /><span className={styles.ring} /></div>
      <div className="container">
        <div className={styles.head}>
          <span className="eyebrow">From website to report</span>
          <h2>How your website becomes <span>a clear QA report.</span></h2>
        </div>
        <ol className={styles.chain}>
          <li className={styles.rail} aria-hidden="true"><span /></li>
          {stages.map((s, i) => (
            <li key={s.title} className={styles.stage} style={{ "--i": i }}>
              <span className={styles.node}><Icon name={s.icon} /><i className={styles.ping} /></span>
              <small>{String(i + 1).padStart(2, "0")}</small>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
