import Reveal from "@/components/ui/Reveal/Reveal";
import Icon from "@/components/ui/Icon/Icon";
import styles from "./Support.module.css";

// Four stages on one 8s loop; stage i is active during its quarter.
const areas = ["Design", "Development", "UX", "Responsive QA", "Content", "Functionality"];

function FindingsMini() {
  return (
    <ul className={styles.findings}>
      {[["high", "Mobile menu overlaps logo"], ["mid", "CTA contrast too low"], ["low", "Card spacing uneven"]].map(([lvl, t], i) => (
        <li key={t} style={{ "--k": i }}><i data-lvl={lvl} />{t}</li>
      ))}
    </ul>
  );
}

function AreasMini() {
  return (
    <div className={styles.areas}>
      {areas.map((a, i) => <span key={a} data-hot={i === 1 || i === 3 || undefined}>{a}</span>)}
    </div>
  );
}

function RecommendationMini() {
  return (
    <div className={styles.rec}>
      <span><Icon name="sparkle" /></span>
      <div><strong>Move nav below 480px</strong><b /><b /></div>
    </div>
  );
}

function ImplementationMini() {
  return (
    <div className={styles.impl}>
      <code><em>&lt;</em>nav<em>&gt;</em> responsive fix</code>
      <div className={styles.progress}><i /></div>
      <small><Icon name="check" />Ready to build</small>
    </div>
  );
}

const stages = [
  { title: "Review Findings", text: "Every issue documented with where it happens and why it matters.", icon: "report", Mini: FindingsMini },
  { title: "Prioritized Service Area", text: "Findings grouped by area — design, development, UX, responsive QA, content or functionality.", icon: "target", Mini: AreasMini },
  { title: "Clear Recommendation", text: "A specific, practical change for each important issue.", icon: "sparkle", Mini: RecommendationMini },
  { title: "Implementation Direction", text: "Guidance your team can build from with confidence.", icon: "code", Mini: ImplementationMini },
];

export default function Support() {
  return (
    <section className={`${styles.section} section`}>
      <div className={styles.bg} aria-hidden="true"><span /><span /><span /></div>
      <div className="container">
        <Reveal>
          <div className={styles.head}>
            <span className="eyebrow">How we support</span>
            <h2>From Audit Insights To Clear Action.</h2>
            <p>SignalReach does not just identify issues — we help translate findings into practical next steps across design, development, content, UX and responsiveness.</p>
          </div>
        </Reveal>

        <Reveal delay={120}>
          <div className={styles.flow}>
            <div className={styles.plane}>
              <div className={styles.track} aria-hidden="true"><i /></div>
              {stages.map(({ title, text, icon, Mini }, i) => (
                <article key={title} className={styles.card} style={{ "--i": i }}>
                  <span className={styles.node} aria-hidden="true" />
                  <div className={styles.cardTop}>
                    <span className={styles.icon}><Icon name={icon} /></span>
                    <span className={styles.step}>Step {String(i + 1).padStart(2, "0")}</span>
                  </div>
                  <h3>{title}</h3>
                  <p>{text}</p>
                  <div className={styles.mini} aria-hidden="true"><Mini /></div>
                </article>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
