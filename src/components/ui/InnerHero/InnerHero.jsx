import Link from "next/link";
import styles from "./InnerHero.module.css";

export default function InnerHero({ eyebrow, title, text, primary = "Get Your Free Website QA Report", secondary, secondaryHref = "/" }) {
  return (
    <section className={`${styles.hero} gridNoise`}>
      <div className={`container ${styles.inner}`}>
        <div className={styles.copy}>
          <span className="eyebrow">{eyebrow}</span>
          <h1>{title}</h1>
          <p>{text}</p>
          <div className={styles.actions}>
            <Link className="btnPrimary" href="/free-report">{primary}</Link>
            {secondary && <Link className="btnGhost" href={secondaryHref}>{secondary}</Link>}
          </div>
        </div>
        <div className={styles.visual} aria-hidden="true">
          <div className={styles.ringOne} />
          <div className={styles.ringTwo} />
          <div className={styles.arrow}>↗</div>
          <div className={styles.card}>
            <span>Website signal</span>
            <strong>Clearer direction</strong>
            <i />
          </div>
        </div>
      </div>
    </section>
  );
}
