import styles from "./Platforms.module.css";

const platforms = [
  ["React / Next.js", "Modern custom frontend builds, responsive UI and implementation support."],
  ["Webflow", "Visual builds, CMS, forms, responsive QA and production refinements."],
  ["WordPress", "Content-led sites, theme QA, speed and page-level improvement reviews."],
  ["Shopify", "Storefront UX, product journey, mobile conversion and visual consistency."],
];

export default function Platforms() {
  return (
    <section className={`${styles.section} section`}>
      <div className={`container ${styles.grid}`}>
        <div>
          <span className="eyebrow">Platforms we understand</span>
          <h2>Recommendations grounded in how the website is actually built.</h2>
          <p>SignalReach can review any public website. Knowing the common platforms helps make the implementation advice more realistic.</p>
        </div>
        <div className={styles.cards}>
          {platforms.map((item,index) => (
            <article key={item[0]}>
              <span>{String(index+1).padStart(2,"0")}</span>
              <h3>{item[0]}</h3>
              <p>{item[1]}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
