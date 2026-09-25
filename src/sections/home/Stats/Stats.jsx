import CountUp from "@/components/ui/CountUp/CountUp";
import Reveal from "@/components/ui/Reveal/Reveal";
import Icon from "@/components/ui/Icon/Icon";
import SectionHeading from "@/components/ui/SectionHeading/SectionHeading";
import styles from "./Stats.module.css";

const metrics = [
  {
    icon: "clock",
    tag: "Turnaround",
    value: <><CountUp end={6} duration={900} /><span className={styles.dash}>–</span><CountUp end={12} start={6} duration={1500} /></>,
    unit: "Hours",
    label: "Typical report turnaround",
    note: "From URL submission to your report",
  },
  {
    icon: "scan",
    tag: "Coverage",
    value: <CountUp end={100} duration={1400} />,
    unit: "%",
    label: "Full website QA",
    note: "Page-by-page and section-by-section",
  },
  {
    icon: "report",
    tag: "Report",
    value: <CountUp end={1} pad={2} duration={700} />,
    unit: "Human",
    label: "Manual review",
    note: "Real QA—not just an automated score",
  },
  {
    icon: "target",
    tag: "Roadmap",
    value: <CountUp end={1} pad={2} duration={700} />,
    unit: "Report",
    label: "Actionable recommendations",
    note: "Clear next steps ranked by impact",
  },
];

export default function Stats() {
  return (
    <section className={styles.section} aria-labelledby="stats-heading">
      <div className={styles.background} aria-hidden="true">
        <span className={styles.glow} />
        <span className={styles.radar}><i /><i /><i /></span>
        <span className={styles.ribbon} />
      </div>
      <div className="container">
        <Reveal className={styles.heading}>
          <div id="stats-heading">
            <SectionHeading
              eyebrow="What you receive"
              title="Real Website QA, Not Just an Automated Score."
              text="We review your website manually, section by section, and deliver a clear report with prioritized recommendations."
              align="center"
            />
          </div>
        </Reveal>
        <div className={styles.grid}>
          {metrics.map((item, index) => (
            <Reveal key={item.label} delay={120 + index * 90} className={styles.cell}>
              <article className={styles.card}>
                <div className={styles.top}>
                  <span className={styles.icon}><Icon name={item.icon} /></span>
                  <span className={styles.tag}>{item.tag}</span>
                </div>
                <div className={styles.value}><strong>{item.value}</strong><em>{item.unit}</em></div>
                <span className={styles.label}>{item.label}</span>
                <span className={styles.note}>{item.note}</span>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
