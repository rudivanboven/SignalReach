import Reveal from "@/components/ui/Reveal/Reveal";
import styles from "./Deliverables.module.css";

const cards = [
  ["Page-by-page findings", "See exactly where each issue appears and which section it affects."],
  ["Screenshots & context", "Understand the visible problem and why it matters to real visitors."],
  ["Severity & impact", "Know what is critical, high, medium or low priority."],
  ["Recommended fixes", "Give designers and developers a practical next step for every issue."],
];

export default function Deliverables() {
  return (
    <section className={`${styles.section} section`}>
      <div className="container">
        <div className={styles.head}>
          <span className="eyebrow">What you receive</span>
          <h2>A Website QA report built to be used, not filed away.</h2>
        </div>
        <div className={styles.grid}>
          {cards.map((card,index) => (
            <Reveal key={card[0]} delay={index*80}>
              <article>
                <span>0{index+1}</span>
                <h3>{card[0]}</h3>
                <p>{card[1]}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
