import Reveal from "@/components/ui/Reveal/Reveal";
import Icon from "@/components/ui/Icon/Icon";
import styles from "./HowWeThink.module.css";

// Diagram space is 520×520: four perspectives across the top converge into
// the review node at (260, 290), which feeds the recommendation card below.
const REVIEW = [260, 290];
const perspectives = [
  { label: "User Experience", icon: "cursor", at: [66, 78] },
  { label: "Design", icon: "layout", at: [195, 58] },
  { label: "Development", icon: "code", at: [325, 58] },
  { label: "Functionality", icon: "form", at: [454, 78] },
];

const converge = ([x, y]) => `M${x} ${y + 34} C ${x} ${y + 150} ${REVIEW[0]} ${REVIEW[1] - 150} ${REVIEW[0]} ${REVIEW[1] - 50}`;
const pct = ([x, y]) => ({ left: `${(x / 520) * 100}%`, top: `${(y / 520) * 100}%` });

export default function HowWeThink() {
  return (
    <section className={`${styles.section} section`}>
      <div className={styles.bg} aria-hidden="true"><span /><span /></div>
      <div className={`container ${styles.grid}`}>
        <Reveal>
          <div className={styles.copy}>
            <span className="eyebrow">How we think</span>
            <h2>Good QA Starts With Understanding the Real User Experience.</h2>
            <p className={styles.lead}>A website issue is rarely just a visual problem. We look at how design, development, content and user behavior work together before recommending a change.</p>
            <ul className={styles.points}>
              <li><Icon name="check" />Several perspectives on every issue</li>
              <li><Icon name="check" />One reviewed, connected conclusion</li>
              <li><Icon name="check" />A recommendation your team can act on</li>
            </ul>
          </div>
        </Reveal>

        <Reveal delay={140}>
          <div className={styles.diagram} role="img" aria-label="Diagram: user experience, design, development and functionality perspectives converge into a SignalReach review, which produces a clear recommendation">
            <span className={styles.glow} />
            <svg viewBox="0 0 520 520">
              {perspectives.map((p, i) => (
                <g key={p.label} style={{ "--i": i }}>
                  <path className={styles.link} pathLength="1" d={converge(p.at)} />
                  <path className={styles.pulse} pathLength="1" d={converge(p.at)} />
                </g>
              ))}
              <path className={styles.link} pathLength="1" d="M260 342 L260 404" style={{ "--i": 4 }} />
              <path className={`${styles.pulse} ${styles.pulseDown}`} pathLength="1" d="M260 342 L260 404" />
            </svg>

            {perspectives.map((p, i) => (
              <div key={p.label} className={styles.node} style={{ "--i": i, ...pct(p.at) }}>
                <span><Icon name={p.icon} /></span>
                <small>{p.label}</small>
              </div>
            ))}

            <div className={styles.review} style={pct(REVIEW)}>
              <span className={styles.ring} />
              <span className={styles.emit} />
              <i><Icon name="scan" /></i>
              <small>SignalReach Review</small>
            </div>

            <div className={styles.result}>
              <span className={styles.resultIcon}><Icon name="check" /></span>
              <div>
                <strong>Clear Recommendation</strong>
                <span className={styles.lines}><b /><b /></span>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
