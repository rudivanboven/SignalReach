import Reveal from "@/components/ui/Reveal/Reveal";
import styles from "./Story.module.css";

export default function Story() {
  return (
    <section className="section">
      <div className={`container ${styles.grid}`}>
        <Reveal>
          <div className={styles.visual}>
            <div className={styles.window}>
              <div className={styles.top}><i/><i/><i/></div>
              <div className={styles.signal}><span/><span/><span/></div>
              <b>↗</b>
            </div>
            <div className={styles.tag}>Built around clarity, not complexity.</div>
          </div>
        </Reveal>
        <Reveal delay={120}>
          <div>
            <span className="eyebrow">Why SignalReach exists</span>
            <h2>Good website QA requires both a user’s eye and a developer’s understanding.</h2>
            <p className={styles.lead}>SignalReach bridges the gap between “something feels off” and a clear, evidence-based plan for what to change.</p>
            <p>We inspect the website as a complete system—how every section looks, how it responds across screens, how interactions behave, and how easily people move toward their goal. Frontend experience keeps every recommendation realistic and implementable.</p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
