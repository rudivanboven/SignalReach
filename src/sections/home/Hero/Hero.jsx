"use client";

import { Fragment, useEffect, useRef } from "react";
import Link from "next/link";
import Icon from "@/components/ui/Icon/Icon";
import styles from "./Hero.module.css";

// Headline words: revealed one by one through a mask.
const lead = ["See", "What", "Your", "Website", "Is"];
const accent = ["Really", "Missing."];

// Stage space is 560×520 with the signal core at (280, 236). Each review
// angle sits on the main orbit and exchanges signals with the core.
const CORE = [280, 236];
const angles = [
  { label: "User experience", icon: "cursor", at: [138, 96] },
  { label: "Layout review", icon: "layout", at: [422, 96] },
  { label: "Mobile QA", icon: "smartphone", at: [482, 262] },
  { label: "Functionality", icon: "form", at: [78, 262], warm: true },
];

const curve = ([x, y]) => {
  const [cx, cy] = CORE;
  return `M${x} ${y} Q ${(x + cx) / 2} ${y + (cy - y) * 0.85} ${cx} ${cy}`;
};

const pct = ([x, y]) => ({ left: `${(x / 560) * 100}%`, top: `${(y / 520) * 100}%` });

const wave = (y, amp) => {
  let d = `M-720 ${y}`;
  for (let i = 0; i < 8; i += 1) d += ` q180 ${i % 2 ? amp : -amp} 360 0`;
  return d;
};

const motes = [[10, 26, 0], [30, 80, -6], [48, 14, -11], [66, 70, -3], [84, 22, -8], [92, 84, -13]];

export default function Hero() {
  const heroRef = useRef(null);
  const ripplesRef = useRef(null);

  // Pointer effects (desktop only): eased parallax (--px/--py, -1..1) plus a
  // "liquid light" layer — a lead glow (--mx/--my), a slower trail that
  // stretches toward it (--tx/--ty/--ang/--stretch) and occasional ripples.
  useEffect(() => {
    const hero = heroRef.current;
    if (!hero || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const fine = matchMedia("(hover: hover) and (pointer: fine) and (min-width: 1024px)");
    const target = { x: 0, y: 0 };
    const current = { x: 0, y: 0 };
    const pointer = { x: 0, y: 0 };
    const lead = { x: 0, y: 0 };
    const trail = { x: 0, y: 0 };
    const lastRipple = { x: 0, y: 0, t: 0 };
    let frame = 0;
    const render = () => {
      frame = 0;
      current.x += (target.x - current.x) * 0.06;
      current.y += (target.y - current.y) * 0.06;
      lead.x += (pointer.x - lead.x) * 0.14;
      lead.y += (pointer.y - lead.y) * 0.14;
      trail.x += (lead.x - trail.x) * 0.04;
      trail.y += (lead.y - trail.y) * 0.04;
      const dx = lead.x - trail.x;
      const dy = lead.y - trail.y;
      const dist = Math.hypot(dx, dy);
      hero.style.setProperty("--px", current.x.toFixed(4));
      hero.style.setProperty("--py", current.y.toFixed(4));
      hero.style.setProperty("--mx", `${lead.x.toFixed(1)}px`);
      hero.style.setProperty("--my", `${lead.y.toFixed(1)}px`);
      hero.style.setProperty("--tx", `${trail.x.toFixed(1)}px`);
      hero.style.setProperty("--ty", `${trail.y.toFixed(1)}px`);
      hero.style.setProperty("--ang", `${Math.atan2(dy, dx).toFixed(3)}rad`);
      hero.style.setProperty("--stretch", (1 + Math.min(dist / 500, 0.45)).toFixed(3));
      const settling = Math.abs(target.x - current.x) > 0.0005 || Math.abs(target.y - current.y) > 0.0005 || Math.abs(pointer.x - lead.x) > 0.5 || dist > 0.5;
      if (settling) frame = requestAnimationFrame(render);
    };
    const request = () => { if (!frame) frame = requestAnimationFrame(render); };
    const ripple = (x, y) => {
      const host = ripplesRef.current;
      if (!host || host.childElementCount >= 4) return;
      const el = document.createElement("span");
      el.className = styles.ripple;
      el.style.left = `${x}px`;
      el.style.top = `${y}px`;
      el.addEventListener("animationend", () => el.remove(), { once: true });
      host.appendChild(el);
    };
    const move = (e) => {
      if (!fine.matches) return;
      const r = hero.getBoundingClientRect();
      pointer.x = e.clientX - r.left;
      pointer.y = e.clientY - r.top;
      if (hero.dataset.hover !== "on") {
        // Start the glow at the cursor instead of sweeping in from the corner.
        lead.x = trail.x = pointer.x;
        lead.y = trail.y = pointer.y;
        hero.dataset.hover = "on";
      }
      target.x = (pointer.x / r.width) * 2 - 1;
      target.y = (pointer.y / r.height) * 2 - 1;
      const now = performance.now();
      if (now - lastRipple.t > 420 && Math.hypot(pointer.x - lastRipple.x, pointer.y - lastRipple.y) > 160) {
        ripple(pointer.x, pointer.y);
        lastRipple.x = pointer.x;
        lastRipple.y = pointer.y;
        lastRipple.t = now;
      }
      request();
    };
    const leave = () => { target.x = 0; target.y = 0; hero.dataset.hover = "off"; request(); };
    hero.addEventListener("pointermove", move, { passive: true });
    hero.addEventListener("pointerleave", leave);
    return () => {
      hero.removeEventListener("pointermove", move);
      hero.removeEventListener("pointerleave", leave);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <section ref={heroRef} className={styles.hero}>
      <div className={styles.bg} aria-hidden="true">
        <div className={styles.sheen} />
        <div className={styles.grid} />
        <div className={styles.glow}><span /><span /><span /><span /></div>
        <div className={styles.flow}>
          <div className={styles.spot} />
          <span className={styles.flowTrail} />
          <span className={styles.flowLead} />
          <div ref={ripplesRef} />
        </div>
        <svg className={styles.waves} viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice">
          <g>
            <path d={wave(660, 34)} />
            <path d={wave(740, 46)} />
          </g>
        </svg>
        {motes.map(([x, y, d]) => (
          <span key={`${x}-${y}`} className={styles.mote} style={{ left: `${x}%`, top: `${y}%`, animationDelay: `${d}s` }} />
        ))}
      </div>

      <div className={`container ${styles.inner}`}>
        <div className={styles.copy}>
          <span className={styles.badge}><i className={styles.liveDot} />Complete website QA</span>
          <h1>
            {lead.map((word, i) => (
              <Fragment key={word}>
                <span className={styles.mask}><span style={{ "--d": `${0.12 + i * 0.07}s` }}>{word}</span></span>{" "}
              </Fragment>
            ))}
            <span className={styles.accent}>
              {accent.map((word, i) => (
                <Fragment key={word}>
                  <span className={styles.mask}><span style={{ "--d": `${0.5 + i * 0.09}s` }}>{word}</span></span>{" "}
                </Fragment>
              ))}
            </span>
          </h1>
          <p className={styles.fade} style={{ "--d": ".62s" }}>
            We manually review your website page by page and section by section—checking design, layout, mobile responsiveness, images, content, usability, functionality and conversion issues.
          </p>
          <div className={`${styles.actions} ${styles.fade}`} style={{ "--d": ".74s" }}>
            <Link className="btnSecondary" href="/free-report">Get Your Free Website Report<span className="btnIcon"><Icon name="arrowRight" /></span></Link>
            <Link className={`btnGhost ${styles.howBtn}`} href="/how-it-works"><span className={styles.playIcon}><Icon name="play" /></span>See What We Check</Link>
          </div>
          <ul className={`${styles.assurances} ${styles.fade}`} style={{ "--d": ".86s" }}>
            <li><Icon name="check" />Complete website QA</li>
            <li><Icon name="check" />Manual expert review</li>
            <li><Icon name="check" />Prioritized by impact</li>
          </ul>
        </div>

        <div className={styles.stage} role="img" aria-label="Animated illustration: SignalReach reviews a website from several angles and turns it into clear recommendations">
          <div className={styles.orbits}>
            <span className={`${styles.ring} ${styles.ringHalo}`} />
            <span className={`${styles.comet} ${styles.cometHalo}`} />
            <span className={`${styles.comet} ${styles.cometWarm}`} />
            <span className={`${styles.ring} ${styles.ringMain}`} />
            <span className={`${styles.comet} ${styles.cometMain}`} />
            <span className={`${styles.ring} ${styles.ringInner}`} />
            <span className={styles.sweep} />
          </div>

          <svg className={styles.signals} viewBox="0 0 560 520">
            <defs>
              <linearGradient id="heroLine" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0" stopColor="#5b8cff" stopOpacity=".55" />
                <stop offset="1" stopColor="#86ece0" stopOpacity=".55" />
              </linearGradient>
            </defs>
            {angles.map((a, i) => (
              <g key={a.label} style={{ "--i": i }}>
                <path className={styles.line} pathLength="1" d={curve(a.at)} />
                <path className={`${styles.pulse} ${a.warm ? styles.pulseWarm : ""}`} pathLength="1" d={curve(a.at)} />
                <path className={styles.reply} pathLength="1" d={curve(a.at)} />
              </g>
            ))}
          </svg>

          <div className={styles.core}>
            <span className={styles.emit} />
            <span className={styles.emit} />
            <span className={styles.coreRing} />
            <span className={styles.coreArc} />
            <i><Icon name="scan" /></i>
          </div>

          {angles.map((a, i) => (
            <div key={a.label} className={`${styles.node} ${a.warm ? styles.nodeWarm : ""}`} style={{ "--i": i, ...pct(a.at) }}>
              <span className={styles.orb}><Icon name={a.icon} /></span>
              <span className={styles.label}><i />{a.label}</span>
            </div>
          ))}

          <div className={`${styles.tag} ${styles.tagIssue}`}>
            <span><Icon name="alert" /></span>
            <div><small>QA signal</small><b>Issue found</b></div>
          </div>
          <div className={`${styles.tag} ${styles.tagFix}`}>
            <span><Icon name="arrowUp" /></span>
            <div><small>Next step</small><b>Improvement</b></div>
          </div>

          <div className={styles.card}>
            <span className={styles.cardIcon}><Icon name="sparkle" /></span>
            <div>
              <strong>Clear recommendations</strong>
              <small>Prioritized by impact</small>
            </div>
            <div className={styles.levels}><i /><i /><i /><i /></div>
          </div>
        </div>
      </div>
    </section>
  );
}
