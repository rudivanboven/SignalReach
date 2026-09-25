import Link from "next/link";
import SectionHeading from "@/components/ui/SectionHeading/SectionHeading";
import Reveal from "@/components/ui/Reveal/Reveal";
import Icon from "@/components/ui/Icon/Icon";
import SiteScanner from "./SiteScanner";
import { auditAreas, reviewPoints } from "./content";
import styles from "./WhatWeDo.module.css";

export default function WhatWeDo() {
  return (
    <section className={`section ${styles.section}`}>
      <div className="container">
        <div className={styles.intro}>
          <Reveal className={styles.visual}>
            <SiteScanner />
          </Reveal>

          <Reveal className={styles.head} delay={120}>
            <SectionHeading
              eyebrow="What we review"
              title="Every Page. Every Section. Every Interaction."
              text="SignalReach reviews the complete website experience—how it looks, how it works, how it responds across devices, and how easy it is for visitors to use."
            />
            <ul className={styles.points}>
              {reviewPoints.map((point) => (
                <li key={point}><span><Icon name="check" /></span>{point}</li>
              ))}
            </ul>
            <Link className="linkArrow" href="/how-it-works">
              See how the review works <Icon name="arrowRight" />
            </Link>
          </Reveal>
        </div>

        <div className={styles.grid}>
          {auditAreas.map((item, index) => (
            <Reveal key={item.title} delay={(index % 3) * 90} className={styles.cell}>
              <article className={styles.card}>
                <span className={styles.number} aria-hidden="true">{item.number}</span>
                <span className={styles.icon}><Icon name={item.icon} /></span>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
                <span className={styles.arrow}><Icon name="arrowUpRight" /></span>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
