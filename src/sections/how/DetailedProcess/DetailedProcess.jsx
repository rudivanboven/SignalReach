import Reveal from "@/components/ui/Reveal/Reveal";
import SectionHeading from "@/components/ui/SectionHeading/SectionHeading";
import styles from "./DetailedProcess.module.css";

const steps = [
  ["01", "Share your website", "Submit your URL and tell us what you want to improve."],
  ["02", "We QA the full website", "We review pages, sections, design, responsiveness, content, images, forms, navigation and functionality."],
  ["03", "We document the issues", "Every finding is organized by page, section, severity and impact, with clear visual context."],
  ["04", "You receive the report", "You get screenshots, clear issue descriptions and practical recommended improvements."],
  ["05", "We can help improve it", "If required, we can redesign or implement the recommended fixes in a separate phase."],
];

export default function DetailedProcess() {
  return (
    <section className="section">
      <div className="container">
        <SectionHeading eyebrow="The QA workflow" title="A human-led review with clear checkpoints." text="SignalReach is intentionally manual: real judgment, device-by-device context and recommendations tied to your actual pages and goals." />
        <div className={styles.list}>
          {steps.map((step, index) => (
            <Reveal key={step[0]} delay={index * 70}>
              <article className={styles.row}>
                <span>{step[0]}</span>
                <h3>{step[1]}</h3>
                <p>{step[2]}</p>
                <i>↗</i>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
