"use client";

import { useEffect, useRef, useState } from "react";
import Icon from "@/components/ui/Icon/Icon";
import styles from "./Platforms.module.css";

// Monograms are generic, element-style marks — not platform logos.
const platforms = [
  { name: "React / Next.js", mark: "Rx", kind: "Custom frontend", text: "Modern custom frontend builds, responsive UI and implementation support.", focus: ["Custom frontend builds", "Responsive UI", "Implementation support"], hue: "#5fd8f0" },
  { name: "Webflow", mark: "Wf", kind: "Visual builder", text: "Visual builds, CMS, forms, responsive QA and production refinements.", focus: ["CMS & forms", "Responsive QA", "Production refinements"], hue: "#7f9dff" },
  { name: "WordPress", mark: "Wp", kind: "Content platform", text: "Content-led sites, theme QA, speed and page-level improvement reviews.", focus: ["Theme QA", "Speed", "Page-level reviews"], hue: "#86ece0" },
  { name: "Shopify", mark: "Sh", kind: "Commerce", text: "Storefront UX, product journey, mobile conversion and visual consistency.", focus: ["Storefront UX", "Product journey", "Mobile conversion"], hue: "#f1d49a" },
];

export default function Platforms() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const sceneRef = useRef(null);

  // Auto-advance through the stack until the visitor takes over.
  useEffect(() => {
    if (paused || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => setActive((a) => (a + 1) % platforms.length), 4200);
    return () => clearInterval(id);
  }, [paused]);

  // Subtle tilt toward the pointer (desktop only).
  const tilt = (e) => {
    const el = sceneRef.current;
    if (!el || !matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--rx", `${(((e.clientY - r.top) / r.height) * 2 - 1) * -5}deg`);
    el.style.setProperty("--ry", `${(((e.clientX - r.left) / r.width) * 2 - 1) * 7}deg`);
  };
  const untilt = () => {
    sceneRef.current?.style.setProperty("--rx", "0deg");
    sceneRef.current?.style.setProperty("--ry", "0deg");
  };

  return (
    <section className={`${styles.section} section`}>
      <div className={styles.bg} aria-hidden="true"><span /><span /><span /></div>
      <div className={`container ${styles.grid}`}>
        <div className={styles.copy}>
          <span className="eyebrow">Platforms we understand</span>
          <h2>Recommendations grounded in how the website is actually built.</h2>
          <p>SignalReach can review any public website. Knowing the common platforms helps make the implementation advice more realistic.</p>

          <div className={styles.tabs} role="tablist" aria-label="Platforms">
            {platforms.map((p, i) => (
              <button
                key={p.name}
                type="button"
                role="tab"
                aria-selected={active === i}
                className={styles.tab}
                style={{ "--hue": p.hue }}
                onClick={() => { setActive(i); setPaused(true); }}
                onMouseEnter={() => { setActive(i); setPaused(true); }}
              >
                <span className={styles.tabMark}>{p.mark}</span>
                <span className={styles.tabText}><strong>{p.name}</strong><small>{p.kind}</small></span>
                <span className={styles.tabNum}>{String(i + 1).padStart(2, "0")}</span>
                <i className={styles.tabBar} aria-hidden="true" />
              </button>
            ))}
          </div>
        </div>

        <div
          ref={sceneRef}
          className={styles.scene}
          onPointerMove={tilt}
          onPointerLeave={untilt}
          onMouseEnter={() => setPaused(true)}
        >
          <div className={styles.floor} aria-hidden="true"><span /><span /><span /></div>
          <div className={styles.stack}>
            {platforms.map((p, i) => {
              const pos = (i - active + platforms.length) % platforms.length;
              return (
                <article
                  key={p.name}
                  className={styles.panel}
                  data-pos={pos}
                  style={{ "--hue": p.hue }}
                  aria-hidden={pos !== 0}
                >
                  <div className={styles.panelHead}>
                    <span className={styles.mark}><b>{p.mark}</b><small>{String(i + 1).padStart(2, "0")}</small></span>
                    <div><small>{p.kind}</small><h3>{p.name}</h3></div>
                    <em><Icon name="check" />Reviewed</em>
                  </div>
                  <p>{p.text}</p>
                  <ul>
                    {p.focus.map((f, j) => <li key={f} style={{ "--j": j }}><Icon name="check" />{f}</li>)}
                  </ul>
                  <div className={styles.mini} aria-hidden="true">
                    <div className={styles.miniBar}><i /><i /><i /><span /></div>
                    <div className={styles.miniBody}><b /><b /><b /><em /></div>
                  </div>
                </article>
              );
            })}
          </div>
          <span className={`${styles.chip} ${styles.chipA}`} aria-hidden="true"><Icon name="smartphone" />Responsive</span>
          <span className={`${styles.chip} ${styles.chipB}`} aria-hidden="true"><Icon name="gauge" />Performance</span>
          <span className={`${styles.chip} ${styles.chipC}`} aria-hidden="true"><Icon name="code" />Implementation</span>
        </div>
      </div>
    </section>
  );
}
