"use client";

import { useEffect, useRef, useState } from "react";
import SectionHeading from "@/components/ui/SectionHeading/SectionHeading";
import Icon from "@/components/ui/Icon/Icon";
import styles from "./Values.module.css";

const values = [
  ["Complete coverage", "Pages, sections, breakpoints and interactions are reviewed as one connected experience.", "scan"],
  ["Human judgment", "Real QA catches contextual design and behavior issues automated tools cannot understand.", "user"],
  ["Practical recommendations", "Every important issue should point toward a realistic next step.", "target"],
  ["Implementation thinking", "Advice should respect the website’s technology, team and business goal.", "code"],
];

export default function Values() {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  // Staged reveal: number → icon → heading → description, card by card.
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setInView(true);
        observer.disconnect();
      }
    }, { threshold: 0.2 });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <section className={`${styles.section} section`} data-inview={inView || undefined}>
      <div className={styles.bg} aria-hidden="true"><span /><span /></div>
      <div className="container">
        <SectionHeading eyebrow="Our principles" title="A simple standard for every review." text="SignalReach should feel useful to a business owner, designer and developer — all at the same time." align="center" />
        <div ref={ref} className={styles.grid}>
          <span className={styles.rail} aria-hidden="true"><i /></span>
          {values.map(([title, text, icon], index) => (
            <article key={title} className={styles.card} style={{ "--i": index }}>
              <span className={styles.line} aria-hidden="true" />
              <div className={styles.top}>
                <span className={styles.num}>0{index + 1}</span>
                <span className={styles.icon}><Icon name={icon} /></span>
              </div>
              <h3>{title}</h3>
              <p>{text}</p>
              <span className={styles.orb} aria-hidden="true" />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
