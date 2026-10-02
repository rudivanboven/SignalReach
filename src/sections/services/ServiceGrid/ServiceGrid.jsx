"use client";

import { useRef } from "react";
import Reveal from "@/components/ui/Reveal/Reveal";
import SectionHeading from "@/components/ui/SectionHeading/SectionHeading";
import Icon from "@/components/ui/Icon/Icon";
import styles from "./ServiceGrid.module.css";

// The first service is the core product and gets the featured card.
const services = [
  { title: "Website QA", text: "Manual page-by-page review of design, layout, images, content, interactions and usability.", icon: "scan", kind: "Review" },
  { title: "UI/UX Review", text: "Visual hierarchy, consistency, page flow, navigation clarity and conversion friction.", icon: "cursor", kind: "Review" },
  { title: "Responsive QA", text: "Section-level checks across desktop, tablet, mobile and small mobile screens.", icon: "smartphone", kind: "Review" },
  { title: "Functional Testing", text: "Buttons, links, forms, menus, dropdowns, tabs, popups and key user flows.", icon: "form", kind: "Review" },
  { title: "Website Redesign", text: "Translate the findings into a clearer, more consistent and more effective interface.", icon: "layout", kind: "Improve" },
  { title: "Frontend Development", text: "Implement approved improvements in responsive, production-ready frontend code.", icon: "code", kind: "Improve" },
  { title: "Website Improvements", text: "Focused fixes for layouts, components, content presentation and conversion paths.", icon: "sparkle", kind: "Improve" },
];

const coverage = ["Design", "Layout", "Images", "Content", "Interactions", "Usability"];

export default function ServiceGrid() {
  const gridRef = useRef(null);

  // Cursor spotlight: each card reads --sx/--sy for its hover glow.
  const track = (e) => {
    const card = e.target.closest("article");
    if (!card || !gridRef.current?.contains(card)) return;
    const r = card.getBoundingClientRect();
    card.style.setProperty("--sx", `${e.clientX - r.left}px`);
    card.style.setProperty("--sy", `${e.clientY - r.top}px`);
  };

  return (
    <section className={`${styles.section} section`}>
      <div className={styles.bg} aria-hidden="true"><span /><span /></div>
      <div className="container">
        <div className={styles.head}>
          <SectionHeading eyebrow="Core services" title="Find the issues. Understand the impact. Improve the website." text="Our core product is practical website QA backed by the design and development experience needed to recommend realistic fixes." />
          <div className={styles.legend} aria-hidden="true">
            <span><i data-kind="Review" />Review</span>
            <span><i data-kind="Improve" />Improve</span>
          </div>
        </div>

        <div ref={gridRef} className={styles.grid} onPointerMove={track}>
          {services.map((s, i) => (
            <Reveal key={s.title} delay={(i % 4) * 90} className={`${styles.cell} ${i === 0 ? styles.featuredCell : ""}`}>
              <article className={`${styles.card} ${i === 0 ? styles.featured : ""}`} data-kind={s.kind}>
                <span className={styles.border} aria-hidden="true" />
                <span className={styles.spot} aria-hidden="true" />
                <div className={styles.top}>
                  <span className={styles.icon}><Icon name={s.icon} /></span>
                  <span className={styles.num}>{String(i + 1).padStart(2, "0")}</span>
                </div>
                <span className={styles.kind}>{s.kind}</span>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
                {i === 0 && (
                  <div className={styles.coverage} aria-label="What a Website QA review covers">
                    {coverage.map((c, j) => <span key={c} style={{ "--j": j }}><Icon name="check" />{c}</span>)}
                    <em className={styles.scan} aria-hidden="true" />
                  </div>
                )}
                <span className={styles.line} aria-hidden="true" />
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
