"use client";

import Icon from "@/components/ui/Icon/Icon";
import { useInView, tiltHandlers } from "../useTeamMotion";
import styles from "./Expertise.module.css";

const areas = [
  { title: "Website QA", text: "Page-by-page review of layout, content, images and interactions.", icon: "scan", group: "Review", tags: ["Pages", "Sections"] },
  { title: "UI / UX Review", text: "Hierarchy, clarity, navigation and the friction people actually feel.", icon: "cursor", group: "Review", tags: ["Usability", "Flow"] },
  { title: "Responsive Testing", text: "Desktop, tablet, mobile and small-screen behavior, section by section.", icon: "smartphone", group: "Review", tags: ["Breakpoints", "Devices"] },
  { title: "Functional Testing", text: "Buttons, forms, menus, popups and the user flows that matter.", icon: "form", group: "Review", tags: ["Forms", "Flows"] },
  { title: "Frontend Review", text: "Spacing, components and implementation details that break the polish.", icon: "code", group: "Build", tags: ["Components", "Spacing"] },
  { title: "Platform Knowledge", text: "React, Next.js, Webflow, WordPress and Shopify builds.", icon: "layout", group: "Build", tags: ["Frameworks", "CMS"] },
  { title: "Implementation Guidance", text: "Recommendations shaped by how the website is really built.", icon: "ruler", group: "Advise", tags: ["Realistic", "Buildable"] },
  { title: "Design & Content Review", text: "Typography, color, imagery and how content is presented.", icon: "image", group: "Advise", tags: ["Visual", "Content"] },
];

export default function Expertise() {
  const [ref, inView] = useInView(0.15);
  const tilt = tiltHandlers(10);

  return (
    <section className={`${styles.section} section`} data-inview={inView || undefined}>
      <div className={styles.bg} aria-hidden="true"><span /><span /><i /></div>
      <div className="container">
        <div className={styles.head}>
          <div>
            <span className="eyebrow">Our expertise</span>
            <h2>Eight Strengths, One <span>Connected Review.</span></h2>
          </div>
          <div className={styles.headSide}>
            <p>Every SignalReach review draws on QA, UX, design and development experience — so issues are understood, not just listed.</p>
            <div className={styles.groups} aria-hidden="true">
              <span data-group="Review">Review</span>
              <span data-group="Build">Build</span>
              <span data-group="Advise">Advise</span>
            </div>
          </div>
        </div>

        <div ref={ref} className={styles.grid} {...tilt}>
          {areas.map((a, i) => (
            <article key={a.title} className={styles.card} data-tilt data-group={a.group} style={{ "--i": i }}>
              <span className={styles.glare} aria-hidden="true" />
              <div className={styles.top}>
                <span className={styles.icon}>
                  <span className={styles.orbit} aria-hidden="true" />
                  <Icon name={a.icon} />
                </span>
                <span className={styles.num}>{String(i + 1).padStart(2, "0")}</span>
              </div>
              <span className={styles.group}>{a.group}</span>
              <h3>{a.title}</h3>
              <p>{a.text}</p>
              <div className={styles.tags}>{a.tags.map((t) => <span key={t}>{t}</span>)}</div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
