import Link from "next/link";
import Reveal from "@/components/ui/Reveal/Reveal";
import Icon from "@/components/ui/Icon/Icon";
import styles from "./FinalCTA.module.css";

export default function FinalCTA() {
  return (
    <section className="section">
      <div className="container">
        <Reveal>
          <div className={styles.box}>
            <div className={styles.radar} aria-hidden="true"><span /><span /><span /><em className={styles.sweep} /><i><Icon name="arrowUpRight" /></i></div>
            <span className="eyebrow">Ready when you are</span>
            <h2>Ready to see what your website is really missing?</h2>
            <p>Share your URL and we’ll manually QA the pages, sections and interactions that shape your complete website experience.</p>
            <div className={styles.actions}>
              <Link className="btnSecondary" href="/free-report">Get Your Free Website QA Report <span className="btnIcon"><Icon name="arrowRight" /></span></Link>
              <Link className={`linkArrow ${styles.textLink}`} href="/services">See What We Check <Icon name="arrowRight" /></Link>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
