import Link from "next/link";
import Reveal from "@/components/ui/Reveal/Reveal";
import Icon from "@/components/ui/Icon/Icon";
import styles from "./AuditPreview.module.css";

const findings = [
  ["Header", "Navigation spacing breaks at tablet width", "High"],
  ["Hero", "Text width and CTA alignment need adjustment", "Medium"],
  ["Mobile", "Button overlaps content at 390px", "Critical"],
  ["Functionality", "Form confirmation feedback is missing", "High"],
];

export default function AuditPreview() {
  return (
    <section className={`section ${styles.section}`}>
      <div className={`container ${styles.grid}`}>
        <Reveal>
          <div className={styles.copy}>
            <span className="eyebrow">Report preview</span>
            <h2>See exactly what your website QA report includes.</h2>
            <p>
              Findings are documented by page and section, with visual context, severity and a clear recommendation for every issue.
            </p>
            <div className={styles.points}>
              <span>✓ Page and section context</span>
              <span>✓ Critical-to-low severity</span>
              <span>✓ Clear improvement recommendation</span>
            </div>
            <Link className="btnPrimary" href="/free-report">Get My Free Report <span className="btnIcon"><Icon name="arrowRight" /></span></Link>
          </div>
        </Reveal>
        <Reveal delay={140}>
          <div className={styles.report}>
            <div className={styles.topbar}>
              <div><i /><i /><i /></div>
              <span>Sample Website QA Report</span>
              <b>SignalReach</b>
            </div>
            <div className={styles.scoreRow}>
              <div className={styles.donut}><strong>74</strong><span>overall</span></div>
              <div>
                <small>Home page review</small>
                <h3>Clear findings, organized by section.</h3>
                <p>Header, hero, services, images, mobile behavior and interactions.</p>
              </div>
            </div>
            <div className={styles.findings}>
              {findings.map(([tag,title,priority]) => (
                <div key={title} className={styles.finding}>
                  <span>{tag}</span><strong>{title}</strong><em>{priority}</em>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
