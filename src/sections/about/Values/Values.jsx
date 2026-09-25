import SectionHeading from "@/components/ui/SectionHeading/SectionHeading";
import styles from "./Values.module.css";

const values = [
  ["Complete coverage", "Pages, sections, breakpoints and interactions are reviewed as one connected experience."],
  ["Human judgment", "Real QA catches contextual design and behavior issues automated tools cannot understand."],
  ["Practical recommendations", "Every important issue should point toward a realistic next step."],
  ["Implementation thinking", "Advice should respect the website’s technology, team and business goal."],
];

export default function Values() {
  return (
    <section className={`${styles.section} section`}>
      <div className="container">
        <SectionHeading eyebrow="Our principles" title="A simple standard for every review." text="SignalReach should feel useful to a business owner, designer and developer — all at the same time." align="center" />
        <div className={styles.grid}>
          {values.map((item,index) => (
            <article key={item[0]}>
              <span>0{index+1}</span>
              <h3>{item[0]}</h3>
              <p>{item[1]}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
