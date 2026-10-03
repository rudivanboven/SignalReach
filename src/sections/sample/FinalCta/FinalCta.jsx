"use client";

import Link from "next/link";
import Icon from "@/components/ui/Icon/Icon";
import { useInView } from "@/sections/how/useHowMotion";
import data from "../reportData.json";
import styles from "./FinalCta.module.css";

export default function FinalCta() {
  const [ref, inView] = useInView(0.3);
  return (
    <section ref={ref} className={`${styles.section} section`} data-inview={inView || undefined}>
      <div className={styles.bg} aria-hidden="true">
        <div className={styles.grid} />
        <span className={styles.glow} />
        {[0, 1, 2].map((i) => <span key={i} className={styles.page} style={{ "--i": i }} />)}
      </div>
      <div className={`container ${styles.inner}`}>
        <span className="eyebrow">Your turn</span>
        <h2>Ready to See What Your Website <span>Is Missing?</span></h2>
        <p>Submit your website and we’ll manually review the experience page by page, then send you a practical QA report like the example above.</p>
        <div className={styles.actions}>
          <Link className="btnSecondary" href="/free-report">
            Get Your Free QA Report
            <span className="btnIcon"><Icon name="arrowRight" /></span>
          </Link>
          <a className={`btnGhost ${styles.ghost}`} href={data.meta.docx} download>
            <Icon name="download" />Download Sample Report
          </a>
        </div>
      </div>
    </section>
  );
}
