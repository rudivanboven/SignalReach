"use client";

import Icon from "@/components/ui/Icon/Icon";
import { useInView } from "@/sections/how/useHowMotion";
import styles from "./Steps.module.css";

// Compact white intro: submit → manual review → report, joined by a flowing line.

const steps = [
  { icon: "link", title: "Submit Your Website", text: "Share your URL and what you’d like us to focus on." },
  { icon: "scan", title: "We Review It Manually", text: "Pages, sections and devices — checked by a person, not just a tool." },
  { icon: "fileText", title: "You Receive Your QA Report", text: "Screenshots, clear findings, priorities and practical fixes." },
];

export default function Steps() {
  const [ref, inView] = useInView(0.3);
  return (
    <section ref={ref} className={styles.section} data-inview={inView || undefined}>
      <div className="container">
        <div className={styles.head}>
          <span className="eyebrow">How it works</span>
          <h2>Three steps from your website <span>to your report.</span></h2>
        </div>
        <ol className={styles.flow}>
          <li className={styles.rail} aria-hidden="true"><span /></li>
          {steps.map((s, i) => (
            <li key={s.title} className={styles.step} style={{ "--i": i }}>
              <span className={styles.node}><Icon name={s.icon} /><em>{String(i + 1).padStart(2, "0")}</em></span>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
