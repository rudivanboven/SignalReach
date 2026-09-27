import Link from "next/link";
import SectionHeading from "@/components/ui/SectionHeading/SectionHeading";
import Reveal from "@/components/ui/Reveal/Reveal";
import Icon from "@/components/ui/Icon/Icon";
import FixJourney from "./FixJourney";
import { examples, priorities } from "./content";
import styles from "./FindingToFix.module.css";

export default function FindingToFix() {
  return (
    <section className={`section ${styles.section}`} aria-labelledby="fix-heading">
      <div className={styles.decor} aria-hidden="true"><span /><span /></div>

      <div className="container">
        <Reveal className={styles.head}>
          <div id="fix-heading">
            <SectionHeading
              eyebrow="Actionable QA"
              title="We Don’t Just Find Problems. We Show You What To Do Next."
              text="Every important finding is explained clearly, prioritized by impact, and paired with a practical recommendation your team can act on."
              align="center"
            />
          </div>
        </Reveal>

        <FixJourney />

        {/* Example findings */}
        <div className={styles.examples}>
          <Reveal className={styles.examplesHead}>
            <div>
              <h3>How findings are written</h3>
              <p>Every entry pairs the problem with the recommendation. Illustrative examples only — not client results.</p>
            </div>
          </Reveal>
          <div className={styles.exampleGrid}>
            {examples.map((item, index) => (
              <Reveal key={item.tag} delay={index * 90} className={styles.exampleCell}>
                <article className={styles.example}>
                  <div className={styles.exHead}>
                    <span className={styles.exIcon}><Icon name={item.icon} /></span>
                    <span className={styles.exTag}>{item.tag}</span>
                    <em className={styles.sev} data-sev={item.severity}>{item.severityLabel}</em>
                  </div>
                  <div className={styles.exRow} data-kind="problem">
                    <small>Problem</small>
                    <p>{item.problem}</p>
                  </div>
                  <span className={styles.exArrow} aria-hidden="true"><Icon name="arrowRight" /></span>
                  <div className={styles.exRow} data-kind="fix">
                    <small>Recommendation</small>
                    <p>{item.fix}</p>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>

        {/* Priority system */}
        <Reveal className={styles.priority}>
          <div className={styles.priorityInner}>
            <div className={styles.priorityHead}>
              <span className={styles.priorityIcon}><Icon name="gauge" /></span>
              <div>
                <h3>Prioritized by impact</h3>
                <p>Every finding carries a priority, so your team knows what to fix first.</p>
              </div>
            </div>
            <div className={styles.scale}>
              <span className={styles.scaleBar} aria-hidden="true"><i /><i /><i /><i /></span>
              <ol className={styles.scaleItems}>
                {priorities.map((item) => (
                  <li key={item.key} data-sev={item.key}>
                    <span className={styles.pill}><i />{item.label}</span>
                    <small>{item.text}</small>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </Reveal>

        {/* CTA */}
        <Reveal className={styles.cta}>
          <div className={styles.ctaInner}>
            <h2>Ready To See What Your Website Needs?</h2>
            <div className={styles.ctaActions}>
              <Link className="btnSecondary" href="/free-report">Get Your Free Website QA Report <span className="btnIcon"><Icon name="arrowRight" /></span></Link>
              <Link className="btnGhost" href="/how-it-works">See How It Works</Link>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
