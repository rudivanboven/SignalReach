"use client";

import Icon from "@/components/ui/Icon/Icon";
import { useInView } from "../useHowMotion";
import styles from "./WhyHuman.module.css";

// "Why human-led QA works better" — white section: a comparison card plus
// five feature cards whose icons draw in on scroll.

const features = [
  { icon: "cursor", title: "Manual review, not a tool score", text: "Every page is reviewed by a person, so findings reflect what visitors actually experience — not just a generated number." },
  { icon: "layout", title: "Real context, page by page", text: "Issues are captured across layouts, pages and interactions, with the context that explains why they matter." },
  { icon: "smartphone", title: "Checked together, not in isolation", text: "Responsiveness, content, usability and functionality are reviewed side by side, the way users meet them." },
  { icon: "target", title: "Tied to your business goals", text: "Recommendations focus on what affects your visitors, your credibility and the actions you want people to take." },
  { icon: "check", title: "Easy to understand and act on", text: "Plain-language findings your designers, developers and stakeholders can quickly prioritize and fix." },
];

const compare = {
  tool: ["A generic score", "Long lists of flags", "Little page context"],
  human: ["Issues seen as users see them", "Clear priorities by impact", "Practical, buildable fixes"],
};

export default function WhyHuman() {
  const [ref, inView] = useInView(0.15);

  return (
    <section ref={ref} className={`${styles.section} section`} data-inview={inView || undefined}>
      <div className={styles.bg} aria-hidden="true">
        <span className={styles.ring} />
        <span className={styles.ring} />
        <span className={styles.glow} />
      </div>

      <div className="container">
        <div className={styles.head}>
          <span className="eyebrow">Why it works</span>
          <h2>Why human-led QA <span>works better.</span></h2>
          <p>Automated scans are useful, but they can’t judge how a website feels to use. SignalReach combines hands-on review with design and development experience.</p>
        </div>

        <div className={styles.grid}>
          <article className={styles.compare} style={{ "--i": 0 }}>
            <div className={styles.col}>
              <small>Automated scan</small>
              <ul>{compare.tool.map((t) => <li key={t} data-kind="tool"><span>–</span>{t}</li>)}</ul>
            </div>
            <div className={styles.vs} aria-hidden="true"><i>vs</i></div>
            <div className={`${styles.col} ${styles.colHuman}`}>
              <small>SignalReach review</small>
              <ul>{compare.human.map((t) => <li key={t}><Icon name="check" />{t}</li>)}</ul>
            </div>
          </article>

          {features.map((f, i) => (
            <article key={f.title} className={styles.card} style={{ "--i": i + 1 }}>
              <span className={styles.icon}><Icon name={f.icon} /></span>
              <h3>{f.title}</h3>
              <p>{f.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
