import Reveal from "@/components/ui/Reveal/Reveal";
import Icon from "@/components/ui/Icon/Icon";
import styles from "./Story.module.css";

// One 9s loop shared by the visual and the step list: each third of the
// cycle belongs to one stage (Website → Human review → Clear improvement).
const steps = [
  ["01", "Website", "Every page, section and breakpoint is inspected."],
  ["02", "Human review", "Issues are judged in context, not just detected."],
  ["03", "Clear improvement", "Findings become a prioritized, realistic plan."],
];

const issues = [
  { label: "Spacing", x: "22%", y: "40%" },
  { label: "Mobile nav", x: "74%", y: "18%" },
  { label: "CTA contrast", x: "36%", y: "70%" },
];

const checks = ["Layout & spacing", "Mobile behavior", "Conversion flow"];

export default function Story() {
  return (
    <section className={`${styles.section} section`}>
      <div className={styles.bg} aria-hidden="true"><span /><span /></div>
      <div className={`container ${styles.grid}`}>
        <Reveal>
          <div className={styles.copy}>
            <span className="eyebrow">Why SignalReach exists</span>
            <h2>Good website QA requires both a user’s eye and a developer’s understanding.</h2>
            <p className={styles.lead}>SignalReach bridges the gap between “something feels off” and a clear, evidence-based plan for what to change.</p>
            <p>We inspect the website as a complete system—how every section looks, how it responds across screens, how interactions behave, and how easily people move toward their goal. Frontend experience keeps every recommendation realistic and implementable.</p>
            <ol className={styles.steps}>
              {steps.map(([n, title, text], i) => (
                <li key={n} style={{ "--i": i }}>
                  <span>{n}</span>
                  <div><strong>{title}</strong><small>{text}</small></div>
                </li>
              ))}
            </ol>
          </div>
        </Reveal>

        <Reveal delay={140}>
          <div className={styles.visual} role="img" aria-label="Animated illustration: a website is scanned, reviewed by a person and turned into a clear improvement plan">
            <div className={styles.panelGrid} />
            <span className={styles.panelGlow} />

            <svg className={styles.flow} viewBox="0 0 560 500" preserveAspectRatio="none">
              <path className={styles.track} d="M372 150 C 440 150 470 190 470 222" />
              <path className={`${styles.run} ${styles.runA}`} pathLength="1" d="M372 150 C 440 150 470 190 470 222" />
              <path className={styles.track} d="M400 356 C 380 400 340 404 300 404" />
              <path className={`${styles.run} ${styles.runB}`} pathLength="1" d="M400 356 C 380 400 340 404 300 404" />
            </svg>

            {/* 01 — Website */}
            <div className={`${styles.card} ${styles.site}`} style={{ "--i": 0 }}>
              <div className={styles.chrome}><i /><i /><i /><span>yourwebsite.com</span></div>
              <div className={styles.page}>
                <b className={styles.nav} />
                <div className={styles.hero}><div><b /><b /><b className={styles.btn} /></div><span /></div>
                <div className={styles.cards}><b /><b /><b /></div>
                <span className={styles.scan} />
                {issues.map((it, i) => (
                  <em key={it.label} className={styles.pin} style={{ left: it.x, top: it.y, "--p": i }}>
                    <i>{i + 1}</i><small>{it.label}</small>
                  </em>
                ))}
              </div>
              <span className={styles.stageTag}>01 · Website</span>
            </div>

            {/* 02 — Human review */}
            <div className={`${styles.card} ${styles.review}`} style={{ "--i": 1 }}>
              <div className={styles.reviewHead}>
                <span><Icon name="user" /></span>
                <div><small>02 · Human review</small><strong>Judged in context</strong></div>
              </div>
              <ul>
                {checks.map((c, i) => <li key={c} style={{ "--c": i }}><i><Icon name="check" /></i>{c}</li>)}
              </ul>
            </div>

            {/* 03 — Clear improvement */}
            <div className={`${styles.card} ${styles.result}`} style={{ "--i": 2 }}>
              <div className={styles.resultHead}>
                <span><Icon name="arrowUp" /></span>
                <div><small>03 · Clear improvement</small><strong>Prioritized fix list</strong></div>
              </div>
              <div className={styles.bar}><i /></div>
              <div className={styles.barLegend}><span>Before</span><span>After fixes</span></div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
