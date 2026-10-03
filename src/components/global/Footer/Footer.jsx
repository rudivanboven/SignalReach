import Link from "next/link";
import LogoMark from "../LogoMark/LogoMark";
import Reveal from "@/components/ui/Reveal/Reveal";
import Icon from "@/components/ui/Icon/Icon";
import styles from "./Footer.module.css";

const EMAIL = "hello@signalreach.example";

const explore = [
  ["Home", "/"],
  ["How It Works", "/how-it-works"],
  ["Services", "/services"],
  ["About", "/about"],
  ["Free Website QA Report", "/free-report"],
];

const review = ["Design & Layout", "Responsive QA", "UI / UX", "Images & Content", "Functional Testing", "Forms & Interactions", "Conversion Flow"];

const technology = ["React", "Next.js", "Webflow", "WordPress", "Shopify", "Frontend QA"];

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.bg} aria-hidden="true">
        <span className={styles.gridBg} />
        <span className={styles.glowBlue} />
        <span className={styles.glowGold} />
        <span className={styles.scan} />
        <div className={styles.dots}>{Array.from({ length: 9 }, (_, i) => <i key={i} />)}</div>
      </div>

      <div className={`container ${styles.inner}`}>
        <Reveal>
          <div className={styles.columns}>
            <div className={styles.brand}>
              <div className={styles.logo}><LogoMark /></div>
              <p>Human-led website QA for stronger design, smoother functionality and better user experiences.</p>
              <span className={styles.tagline}>Review. Understand. Improve. Reach.</span>
            </div>

            <nav className={styles.col} aria-label="Footer">
              <h6>Explore</h6>
              {explore.map(([label, href]) => (
                <Link key={href} className={styles.link} href={href}>{label}<Icon name="arrowUpRight" /></Link>
              ))}
            </nav>

            <div className={styles.col}>
              <h6>What we review</h6>
              {review.map((item) => (
                <Link key={item} className={styles.link} href="/services">{item}<Icon name="arrowUpRight" /></Link>
              ))}
            </div>

            <div className={styles.col}>
              <h6>Technology</h6>
              <div className={styles.chips}>
                {technology.map((item) => <span key={item}>{item}</span>)}
              </div>
            </div>

            <div className={styles.col}>
              <h6>Contact</h6>
              <div className={styles.contactItem}>
                <small>Email</small>
                <a className={styles.link} href={`mailto:${EMAIL}`}>{EMAIL}</a>
              </div>
              <Link className={styles.consult} href="/free-report">
                Book a Consultation <Icon name="arrowRight" />
              </Link>
            </div>
          </div>
        </Reveal>
      </div>

      {/* ---------- Credits ---------- */}
      <div className={`container ${styles.bottom}`}>
        <span>© 2026 SignalReach. All rights reserved.</span>
        <span className={styles.credit}>
          Website designed &amp; developed by <strong>Ayush Thakur</strong>
        </span>
      </div>
    </footer>
  );
}
