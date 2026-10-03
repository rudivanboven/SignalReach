"use client";

import Link from "next/link";
import Icon from "@/components/ui/Icon/Icon";
import { useInView } from "../useHowMotion";
import styles from "./AfterReview.module.css";

// "What happens after the review?" — dark section: a four-stage journey
// (report → priorities → roadmap → improvements) linked by a flowing signal
// line whose light passes each stage in turn, then a closing CTA.

const stages = [
  { icon: "report", title: "Review the findings", text: "Walk through each issue with its screenshots, page and context." },
  { icon: "target", title: "Prioritize what matters", text: "Start with the critical and high-impact issues first." },
  { icon: "layout", title: "Follow the roadmap", text: "Plan improvements in a clear, practical order your team can work through." },
  { icon: "code", title: "Improve the website", text: "Make the fixes in-house — or, if needed, SignalReach can help implement them." },
];

export default function AfterReview() {
  const [ref, inView] = useInView(0.2);

  return (
    <section ref={ref} className={`${styles.section} section`} data-inview={inView || undefined}>
      <div className={styles.bg} aria-hidden="true">
        <div className={styles.grid} />
        <span className={styles.orbit} />
        <span className={styles.orbit} />
        <span className={styles.glowA} />
        <span className={styles.glowB} />
      </div>

      <div className="container">
        <div className={styles.head}>
          <span className="eyebrow">After the report</span>
          <h2>What happens <span>after the review?</span></h2>
          <p>Once your QA report is delivered, your team has a clearer picture of what needs attention, what to prioritize first, and how to move toward a stronger website experience.</p>
        </div>

        <ol className={styles.journey}>
          <li className={styles.rail} aria-hidden="true"><span /></li>
          {stages.map((s, i) => (
            <li key={s.title} className={styles.stage} style={{ "--i": i }}>
              <span className={styles.node}>
                <Icon name={s.icon} />
                <i className={styles.ping} />
              </span>
              <div className={styles.card}>
                <small>{["Audit", "Priorities", "Roadmap", "Improvements"][i]}</small>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </div>
            </li>
          ))}
        </ol>

        <div className={styles.cta}>
          <div>
            <h3>Start with a clear picture of your website.</h3>
            <p>Share your URL and get a human-led QA report your team can act on.</p>
          </div>
          <div className={styles.actions}>
            <Link className="btnSecondary" href="/free-report">
              Get Your Free Website QA Report
              <span className="btnIcon"><Icon name="arrowRight" /></span>
            </Link>
            <Link className={`btnGhost ${styles.ghost}`} href="/services">See What We Check</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
