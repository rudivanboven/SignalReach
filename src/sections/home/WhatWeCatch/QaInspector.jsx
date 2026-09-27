"use client";

import { useEffect, useRef, useState } from "react";
import Icon from "@/components/ui/Icon/Icon";
import { categories, issues, severities } from "./content";
import styles from "./QaInspector.module.css";

/*
  One loop of the inspection (LOOP ms):
  idle → desktop sweep → switch to mobile → mobile sweep → hold findings → clear.
  Zones fire in top-to-bottom order as the beam passes their vertical centre.
*/
const LOOP = 17000;
const T = {
  desktop: [0.05, 0.47],
  switch: [0.47, 0.54],
  phone: [0.54, 0.73],
  hold: [0.73, 0.92],
  clear: [0.92, 1],
};

const desktopZones = ["nav", "hierarchy", "cta", "heroImage", "spacing", "form", "footer"];
const phoneZones = ["overflow", "crop", "cards"];
const passes = { heroImage: "Image looks good", footer: "Footer checks out" };
const issueByKey = Object.fromEntries(issues.map((item, index) => [item.key, { ...item, number: String(index + 1).padStart(2, "0") }]));
const statusByStage = {
  idle: "Starting review",
  desktop: "Reviewing desktop",
  switch: "Switching to mobile",
  phone: "Reviewing mobile",
  hold: `${issues.length} issues documented`,
  clear: "Preparing next pass",
};

const clamp01 = (v) => Math.min(Math.max(v, 0), 1);
const ease = (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
const stageAt = (phase) => {
  if (phase < T.desktop[0]) return "idle";
  if (phase < T.switch[0]) return "desktop";
  if (phase < T.phone[0]) return "switch";
  if (phase < T.hold[0]) return "phone";
  if (phase < T.clear[0]) return "hold";
  return "clear";
};

export default function QaInspector() {
  const rootRef = useRef(null);
  const stageRef = useRef(null);
  const viewportRef = useRef(null);
  const screenRef = useRef(null);
  const deskTrackRef = useRef(null);
  const phoneTrackRef = useRef(null);
  const cursorRef = useRef(null);
  const zoneRefs = useRef({});
  const [view, setView] = useState({ stage: "idle", d: 0, p: 0 });
  const [ripple, setRipple] = useState(0);

  useEffect(() => {
    const root = rootRef.current;
    const viewport = viewportRef.current;
    const screen = screenRef.current;
    if (!root || !viewport || !screen) return undefined;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setView({ stage: "hold", d: desktopZones.length, p: phoneZones.length });
      return undefined;
    }

    let dTriggers = [];
    let pTriggers = [];
    const measure = () => {
      const vp = viewport.getBoundingClientRect();
      const sc = screen.getBoundingClientRect();
      const rel = (key, box) => {
        const el = zoneRefs.current[key];
        if (!el || !box.height) return 1;
        const r = el.getBoundingClientRect();
        return (r.top - box.top + r.height * 0.5) / box.height;
      };
      dTriggers = desktopZones.map((key) => rel(key, vp));
      pTriggers = phoneZones.map((key) => rel(key, sc));
    };
    measure();

    let frame = 0;
    let running = false;
    let elapsed = 0;
    let last = 0;
    let prev = { stage: "", d: -1, p: -1 };

    const tick = (now) => {
      elapsed = (elapsed + Math.min(now - last, 64)) % LOOP;
      last = now;
      const phase = elapsed / LOOP;
      const stage = stageAt(phase);
      const dProg = ease(clamp01((phase - T.desktop[0]) / (T.desktop[1] - T.desktop[0])));
      const pProg = ease(clamp01((phase - T.phone[0]) / (T.phone[1] - T.phone[0])));

      if (deskTrackRef.current) {
        deskTrackRef.current.style.transform = `translate3d(0, ${(dProg * 100).toFixed(2)}%, 0)`;
        deskTrackRef.current.style.opacity = stage === "desktop" ? "1" : "0";
      }
      if (phoneTrackRef.current) {
        phoneTrackRef.current.style.transform = `translate3d(0, ${(pProg * 100).toFixed(2)}%, 0)`;
        phoneTrackRef.current.style.opacity = stage === "phone" ? "1" : "0";
      }

      const cleared = stage === "idle" || stage === "clear";
      const d = cleared ? 0 : dTriggers.filter((t) => dProg >= t).length;
      const p = cleared || phase < T.phone[0] ? 0 : pTriggers.filter((t) => pProg >= t).length;

      if (stage !== prev.stage || d !== prev.d || p !== prev.p) {
        prev = { stage, d, p };
        setView(prev);
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

    const observer = new IntersectionObserver(([entry]) => (entry.isIntersecting ? start() : stop()), { threshold: 0.12 });
    observer.observe(root);
    const resizeObserver = new ResizeObserver(measure);
    resizeObserver.observe(root);

    // gentle pointer tilt on large pointer devices only
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

  // Move the cursor to the most recently inspected zone.
  const latestKey = view.p > 0 ? phoneZones[view.p - 1] : view.d > 0 ? desktopZones[view.d - 1] : null;
  useEffect(() => {
    const cursor = cursorRef.current;
    const stage = stageRef.current;
    if (!cursor || !stage) return;
    const el = latestKey ? zoneRefs.current[latestKey] : null;
    if (!el || view.stage === "clear" || view.stage === "idle") {
      cursor.style.opacity = "0";
      return;
    }
    const s = stage.getBoundingClientRect();
    const r = el.getBoundingClientRect();
    const x = r.left - s.left + Math.min(r.width * 0.68, r.width - 18);
    const y = r.top - s.top + r.height * 0.55;
    cursor.style.opacity = "1";
    cursor.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
    setRipple((n) => n + 1);
  }, [latestKey, view.stage]);

  const firedKeys = new Set([...desktopZones.slice(0, view.d), ...phoneZones.slice(0, view.p)]);
  const firedIssues = issues.filter((item) => firedKeys.has(item.key));
  const latestIssue = latestKey && issueByKey[latestKey] ? issueByKey[latestKey] : null;
  const catCounts = firedIssues.reduce((acc, item) => ({ ...acc, [item.category]: (acc[item.category] || 0) + 1 }), {});
  const phoneShown = view.stage === "switch" || view.stage === "phone" || view.stage === "hold";

  const zone = (key, extra = "") => {
    const issue = issueByKey[key];
    return {
      ref: (el) => { zoneRefs.current[key] = el; },
      className: `${styles.zone} ${extra}`,
      "data-hit": firedKeys.has(key) ? "true" : "false",
      "data-sev": issue ? issue.severity : "pass",
      "data-latest": latestKey === key ? "true" : "false",
    };
  };
  const tag = (key, side = "right") => {
    const issue = issueByKey[key];
    if (issue) {
      return (
        <span className={styles.tag} data-side={side}>
          <b>{issue.number}</b>
          <span className={styles.tagText}>{issue.label}<small>{issue.detail}</small></span>
          <i className={styles.tagIcon}><Icon name="alert" /></i>
        </span>
      );
    }
    return (
      <span className={`${styles.tag} ${styles.tagPass}`} data-side={side}>
        <i className={styles.tagIcon}><Icon name="check" /></i>
        <span className={styles.tagText}>{passes[key]}</span>
      </span>
    );
  };

  return (
    <div ref={rootRef} className={styles.root} data-stage={view.stage}>
      <div className={styles.stageWrap}>
        <div className={styles.glowA} />
        <div className={styles.glowB} />

        <div ref={stageRef} className={styles.stage} role="img" aria-label="Animated illustration of a website being reviewed for QA issues such as navigation, content hierarchy, broken buttons, spacing, forms, mobile overflow, image cropping and responsive layout">
          <div className={styles.browser}>
            <div className={styles.bar}>
              <i /><i /><i />
              <span className={styles.url}><Icon name="link" />yourwebsite.com</span>
              <span className={styles.device} data-on={phoneShown ? "phone" : "desktop"}>
                <i><Icon name="layout" /></i>
                <i><Icon name="smartphone" /></i>
              </span>
              <span className={styles.status}>{statusByStage[view.stage]}</span>
            </div>

            <div ref={viewportRef} className={styles.viewport}>
              <div className={styles.page}>
                {/* Header */}
                <div {...zone("nav", styles.mHeader)}>
                  <b className={styles.mLogo} />
                  <span className={styles.mLinks}><i /><i /><i /><i /></span>
                  <b className={styles.mNavBtn} />
                  <em className={styles.mBurger}><i /><i /><i /></em>
                  {tag("nav", "inside")}
                </div>

                {/* Hero */}
                <div className={styles.mHero}>
                  <div className={styles.mHeroText}>
                    <div {...zone("hierarchy", styles.mHeadline)}>
                      <b /><i /><i /><i />
                      {tag("hierarchy", "right")}
                    </div>
                    <div {...zone("cta", styles.mCtas)}>
                      <b className={styles.mCtaMain} />
                      <b className={styles.mCtaAlt} />
                      {tag("cta", "right")}
                    </div>
                  </div>
                  <div {...zone("heroImage", styles.mImage)}>
                    <span className={styles.imgClip}>
                      <span className={styles.sun} />
                      <span className={styles.hillBack} />
                      <span className={styles.hillFront} />
                    </span>
                    {tag("heroImage", "inside-bottom")}
                  </div>
                </div>

                {/* Cards */}
                <div {...zone("spacing", styles.mCards)}>
                  <span className={styles.mCard}><i /><b /><em /><em /></span>
                  <span className={styles.mCard}><i /><b /><em /><em /></span>
                  <span className={styles.mCard}><i /><b /><em /><em /></span>
                  <i className={`${styles.measure} ${styles.measureL}`}><small>40</small></i>
                  <i className={`${styles.measure} ${styles.measureR}`}><small>18</small></i>
                  {tag("spacing", "left")}
                </div>

                {/* Form */}
                <div {...zone("form", styles.mForm)}>
                  <span className={styles.mFormHead}><b /><i /></span>
                  <span className={styles.mFields}>
                    <i /><i />
                    <em />
                    <b className={styles.mSubmit} />
                  </span>
                  {tag("form", "left")}
                </div>

                {/* Footer */}
                <div {...zone("footer", styles.mFooter)}>
                  <b />
                  <span><i /><i /><i /></span>
                  <span><i /><i /><i /></span>
                  <span><i /><i /></span>
                  {tag("footer", "left")}
                </div>
              </div>

              <div ref={deskTrackRef} className={styles.track}>
                <div className={styles.beam} />
              </div>
            </div>
          </div>

          {/* Phone mockup */}
          <div className={styles.phone} data-on={phoneShown ? "true" : "false"} aria-hidden="true">
            <span className={styles.notch} />
            <div ref={screenRef} className={styles.screen}>
              <div className={styles.pHeader}><b /><em><i /><i /></em></div>
              <div {...zone("crop", styles.pImage)}>
                <span className={styles.imgClip}>
                  <span className={styles.sun} />
                  <span className={styles.hillBack} />
                  <span className={styles.hillFront} />
                </span>
                {tag("crop", "above")}
              </div>
              <div className={styles.pText}><b /><i /><i /></div>
              <div {...zone("overflow", styles.pCtaWrap)}>
                <b className={styles.pCta} />
                {tag("overflow", "above")}
              </div>
              <div {...zone("cards", styles.pCards)}>
                <span /><span /><span />
                {tag("cards", "mid-right")}
              </div>
              <div ref={phoneTrackRef} className={styles.track}>
                <div className={styles.beam} />
              </div>
            </div>
          </div>

          {/* Cursor */}
          <div ref={cursorRef} className={styles.cursor} aria-hidden="true">
            <i key={ripple} className={styles.ripple} />
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M5 3.5 18.5 11.4l-6.2 1.3-2.6 6.1z" fill="#fff" stroke="#0b162b" strokeWidth="1.4" strokeLinejoin="round" />
            </svg>
          </div>
        </div>

        {/* Findings strip */}
        <div className={styles.strip}>
          <div className={styles.count}>
            <span>Issues found</span>
            <strong>{firedIssues.length}<em>/{issues.length}</em></strong>
          </div>
          <div className={styles.latest} data-on={latestIssue ? "true" : "false"}>
            {latestIssue ? (
              <>
                <b data-sev={latestIssue.severity}>{latestIssue.number}</b>
                <span>{latestIssue.title}</span>
                <small>{latestIssue.text}</small>
              </>
            ) : (
              <span className={styles.latestIdle}>Scanning pages, sections and interactions…</span>
            )}
          </div>
          <ul className={styles.legend}>
            {severities.map((s) => (
              <li key={s.key} data-sev={s.key}><i />{s.label}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Category list */}
      <ul className={styles.categories}>
        {categories.map((cat, index) => {
          const count = catCounts[cat.key] || 0;
          const active = latestIssue && latestIssue.category === cat.key;
          return (
            <li
              key={cat.key}
              className={styles.category}
              data-hit={count > 0 ? "true" : "false"}
              data-active={active ? "true" : "false"}
              style={{ "--i": index }}
            >
              <span className={styles.catIcon}><Icon name={cat.icon} /></span>
              <span className={styles.catBody}>
                <strong>{cat.title}</strong>
                <small>{cat.text}</small>
              </span>
              <span className={styles.catBadge} aria-hidden="true">
                <b>{count}</b>
                <i />
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
