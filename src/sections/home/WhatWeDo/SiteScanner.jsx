"use client";

import { useEffect, useRef, useState } from "react";
import Icon from "@/components/ui/Icon/Icon";
import styles from "./SiteScanner.module.css";

// Order = top-to-bottom order of the zones in the mock page.
const checks = [
  { key: "ux", label: "Navigation", pop: "Header", icon: "cursor" },
  { key: "design", label: "Design", pop: "Layout", icon: "layout" },
  { key: "seo", label: "Content", pop: "Content", icon: "report" },
  { key: "speed", label: "Images", pop: "Image", icon: "gauge" },
  { key: "mobile", label: "Responsive", pop: "Mobile", icon: "smartphone" },
  { key: "conversion", label: "Functionality", pop: "Button", icon: "target" },
];

const LOOP = 8000; // ms for one full scan cycle
const SWEEP = 0.72; // share of the loop spent moving the beam
const RESET = 0.93; // when results clear for the next pass

export default function SiteScanner() {
  const rootRef = useRef(null);
  const viewportRef = useRef(null);
  const trackRef = useRef(null);
  const percentRef = useRef(null);
  const barRef = useRef(null);
  const zoneRefs = useRef({});
  const [done, setDone] = useState(0);
  const [complete, setComplete] = useState(false);

  useEffect(() => {
    const root = rootRef.current;
    const viewport = viewportRef.current;
    if (!root || !viewport) return undefined;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setDone(checks.length);
      setComplete(true);
      return undefined;
    }

    // Trigger point for each zone = its vertical centre inside the viewport (0..1).
    let triggers = [];
    const measure = () => {
      const h = viewport.clientHeight || 1;
      triggers = checks.map(({ key }) => {
        const el = zoneRefs.current[key];
        return el ? (el.offsetTop + el.offsetHeight * 0.45) / h : 1;
      });
    };
    measure();

    let frame = 0;
    let running = false;
    let elapsed = 0;
    let last = 0;
    let lastDone = -1;
    let lastComplete = null;

    const tick = (now) => {
      elapsed = (elapsed + Math.min(now - last, 64)) % LOOP;
      last = now;
      const phase = elapsed / LOOP;
      const raw = Math.min(phase / SWEEP, 1);
      const progress = raw < 0.5 ? 2 * raw * raw : 1 - Math.pow(-2 * raw + 2, 2) / 2;
      const clearing = phase >= RESET;

      if (trackRef.current) {
        trackRef.current.style.transform = `translate3d(0, ${(progress * 100).toFixed(2)}%, 0)`;
        trackRef.current.style.opacity = phase > SWEEP + 0.04 || phase < 0.02 ? "0" : "1";
      }
      const pct = clearing ? 0 : Math.round(progress * 100);
      if (percentRef.current) percentRef.current.textContent = `${pct}%`;
      if (barRef.current) barRef.current.style.transform = `scaleX(${clearing ? 0 : progress})`;

      const count = clearing ? 0 : triggers.filter((t) => progress >= t).length;
      if (count !== lastDone) {
        lastDone = count;
        setDone(count);
      }
      const isComplete = !clearing && raw >= 1;
      if (isComplete !== lastComplete) {
        lastComplete = isComplete;
        setComplete(isComplete);
      }

      if (running) frame = requestAnimationFrame(tick);
    };

    const start = () => {
      if (running) return;
      running = true;
      last = performance.now();
      frame = requestAnimationFrame(tick);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(frame);
    };

    const observer = new IntersectionObserver(([entry]) => (entry.isIntersecting ? start() : stop()), { threshold: 0.15 });
    observer.observe(root);

    const resizeObserver = new ResizeObserver(measure);
    resizeObserver.observe(viewport);

    // gentle pointer tilt on desktop only
    const fine = window.matchMedia("(hover: hover) and (pointer: fine) and (min-width: 1024px)");
    const onMove = (event) => {
      if (!fine.matches) return;
      const rect = root.getBoundingClientRect();
      root.style.setProperty("--tx", (((event.clientX - rect.left) / rect.width) * 2 - 1).toFixed(3));
      root.style.setProperty("--ty", (((event.clientY - rect.top) / rect.height) * 2 - 1).toFixed(3));
    };
    const onLeave = () => {
      root.style.setProperty("--tx", "0");
      root.style.setProperty("--ty", "0");
    };
    root.addEventListener("pointermove", onMove, { passive: true });
    root.addEventListener("pointerleave", onLeave);

    return () => {
      stop();
      observer.disconnect();
      resizeObserver.disconnect();
      root.removeEventListener("pointermove", onMove);
      root.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  const zone = (key) => ({
    ref: (el) => { zoneRefs.current[key] = el; },
    "data-hit": checks.findIndex((c) => c.key === key) < done ? "true" : "false",
  });
  const pop = (key) => {
    const c = checks.find((item) => item.key === key);
    return <span className={styles.pop}><Icon name="check" />{c.pop}</span>;
  };

  return (
    <div ref={rootRef} className={styles.stage} role="img" aria-label="Animated illustration: complete website QA for design, layout, content, images, responsive behavior and functionality">
      <div className={styles.glowA} />
      <div className={styles.glowB} />

      <div className={styles.tilt}>
        <div className={styles.browser}>
          <div className={styles.bar}>
            <i /><i /><i />
            <span className={styles.url}><Icon name="seo" />yourwebsite.com</span>
            <span className={`${styles.status} ${complete ? styles.statusDone : ""}`}>
              {complete ? "QA complete" : "Reviewing"}
            </span>
          </div>

          <div ref={viewportRef} className={styles.viewport}>
            <div className={`${styles.zone} ${styles.nav}`} {...zone("ux")}>
              <b className={styles.logo} />
              <span className={styles.links}><i /><i /><i /></span>
              <b className={styles.navBtn} />
              {pop("ux")}
            </div>

            <div className={styles.heroRow}>
              <div className={styles.heroText}>
                <div className={`${styles.zone} ${styles.headline}`} {...zone("design")}>
                  <b /><b />
                  {pop("design")}
                </div>
                <div className={`${styles.zone} ${styles.body}`} {...zone("seo")}>
                  <i /><i /><i />
                  {pop("seo")}
                </div>
              </div>
              <div className={`${styles.zone} ${styles.media}`} {...zone("speed")}>
                <span className={styles.mediaSun} />
                <span className={styles.mediaHill} />
                {pop("speed")}
              </div>
            </div>

            <div className={`${styles.zone} ${styles.cards}`} {...zone("mobile")}>
              <span><i /><b /><b /></span>
              <span><i /><b /><b /></span>
              <span><i /><b /><b /></span>
              {pop("mobile")}
            </div>

            <div className={`${styles.zone} ${styles.cta}`} {...zone("conversion")}>
              <b className={styles.ctaMain} />
              <b className={styles.ctaAlt} />
              {pop("conversion")}
            </div>

            <div ref={trackRef} className={styles.track}>
              <div className={styles.beam} />
            </div>
          </div>
        </div>

        <aside className={styles.panel}>
          <div className={styles.panelHead}>
            <span>Live website QA</span>
            <strong>{done}/{checks.length}</strong>
          </div>
          <ul className={styles.list}>
            {checks.map((item, index) => {
              const state = index < done ? styles.isDone : index === done && !complete ? styles.isActive : "";
              return (
                <li key={item.key} className={state}>
                  <span className={styles.itemIcon}><Icon name={item.icon} /></span>
                  <span className={styles.itemLabel}>{item.label}</span>
                  <span className={styles.tick}><Icon name="check" /></span>
                </li>
              );
            })}
          </ul>
          <div className={styles.progress}>
            <div className={styles.progressHead}>
              <span>Review progress</span>
              <strong ref={percentRef}>0%</strong>
            </div>
            <span className={styles.progressTrack}><b ref={barRef} /></span>
          </div>
          <div className={`${styles.ready} ${complete ? styles.readyOn : ""}`}>
            <Icon name="report" />
            Report ready
          </div>
        </aside>
      </div>
    </div>
  );
}
