"use client";

import { useEffect, useRef, useState } from "react";
import Icon from "@/components/ui/Icon/Icon";
import { journeySteps } from "./content";
import styles from "./FixJourney.module.css";

const LAST = journeySteps.length - 1;
const AUTOPLAY_MS = 1900;

/*
  Desktop / tablet (>= 900px): the visual is sticky and the four step blocks
  drive it as they scroll through the middle of the viewport.
  Mobile (< 900px): the visual plays through the four states once when it
  enters the viewport; the rail and step list stay tappable.
*/
export default function FixJourney() {
  const rootRef = useRef(null);
  const stageRef = useRef(null);
  const timerRef = useRef(0);
  const playedRef = useRef(false);
  const [step, setStep] = useState(0);
  const [mode, setMode] = useState("desktop");

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 899px)");
    const apply = () => setMode(mq.matches ? "mobile" : "desktop");
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    const stage = stageRef.current;
    if (!root || !stage) return undefined;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setStep(LAST);
      return undefined;
    }

    if (mode === "desktop") {
      const blocks = [...root.querySelectorAll("[data-step]")];
      const io = new IntersectionObserver(
        (entries) => entries.forEach((entry) => entry.isIntersecting && setStep(Number(entry.target.dataset.step))),
        { rootMargin: "-42% 0px -42%" }
      );
      blocks.forEach((block) => io.observe(block));
      return () => io.disconnect();
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          window.clearInterval(timerRef.current);
          return;
        }
        if (playedRef.current) return;
        playedRef.current = true;
        setStep(0);
        timerRef.current = window.setInterval(() => {
          setStep((current) => {
            if (current >= LAST) {
              window.clearInterval(timerRef.current);
              return current;
            }
            return current + 1;
          });
        }, AUTOPLAY_MS);
      },
      { threshold: 0.45 }
    );
    io.observe(stage);
    return () => {
      io.disconnect();
      window.clearInterval(timerRef.current);
    };
  }, [mode]);

  const jump = (index) => {
    window.clearInterval(timerRef.current);
    playedRef.current = true;
    if (mode === "desktop") {
      const block = rootRef.current?.querySelector(`[data-step="${index}"]`);
      if (block) block.scrollIntoView({ behavior: "smooth", block: "center" });
    }
    setStep(index);
  };

  const replay = () => {
    window.clearInterval(timerRef.current);
    setStep(0);
    timerRef.current = window.setInterval(() => {
      setStep((current) => {
        if (current >= LAST) {
          window.clearInterval(timerRef.current);
          return current;
        }
        return current + 1;
      });
    }, AUTOPLAY_MS);
  };

  const stateOf = (index) => (index === step ? "active" : index < step ? "done" : "todo");

  return (
    <div ref={rootRef} className={styles.journey} data-mode={mode}>
      <div className={styles.sticky}>
        {/* Rail: Before → Issue found → Recommendation → Improved */}
        <ol className={styles.rail} aria-label="Finding to fix steps">
          <li className={styles.railLine} aria-hidden="true"><span style={{ transform: `scaleX(${step / LAST})` }} /></li>
          {journeySteps.map((item, index) => (
            <li key={item.key} className={styles.railItem} data-state={stateOf(index)}>
              <button type="button" onClick={() => jump(index)} aria-current={index === step ? "step" : undefined}>
                <span className={styles.railDot}>
                  <b>{index + 1}</b>
                  <i><Icon name="check" /></i>
                </span>
                <span className={styles.railLabel}>{item.label}</span>
              </button>
            </li>
          ))}
        </ol>

        {/* Stage */}
        <div ref={stageRef} className={styles.stage} data-step={step} role="img" aria-label="Illustration of a mobile page before review, the issue found, the recommendation, and the improved version with the call to action moved into the first screen">
          <div className={styles.device}>
            <div className={styles.phone}>
              <span className={styles.notch} />
              <div className={styles.screen}>
                <div className={styles.sbar}><i /><span><b /><b /><b /></span></div>
                <div className={styles.nav}><b /><em><i /><i /></em></div>

                <div className={styles.content}>
                  <div className={styles.img}>
                    <span className={styles.sun} />
                    <span className={styles.hillBack} />
                    <span className={styles.hillFront} />
                  </div>
                  <div className={styles.h}><b /><b /></div>
                  <div className={styles.p}><i /><i /><i /><i /></div>
                  <div className={styles.meta}><span /><span /><span /><b /></div>
                  <div className={styles.cta}>
                    <b />
                    <i className={styles.pin}>01</i>
                  </div>
                  <div className={styles.link} />
                </div>

                <div className={styles.belowFold} />
                <div className={styles.fold}>
                  <span className={styles.foldBefore}>Fold on common phones</span>
                  <span className={styles.foldAfter}><Icon name="check" />Above the fold</span>
                </div>
                <div className={styles.ghost} />
                <svg className={styles.arrow} viewBox="0 0 240 470" aria-hidden="true">
                  <defs>
                    <marker id="fixArrowHead" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                      <path d="M0 0 10 5 0 10z" fill="currentColor" />
                    </marker>
                  </defs>
                  <path pathLength="1" d="M192 386 C 236 380, 236 326, 196 320" markerEnd="url(#fixArrowHead)" />
                </svg>
                <span className={styles.improvedBadge}><Icon name="check" />Improved</span>
              </div>
            </div>

            <div className={styles.thumb} aria-hidden="true">
              <small>Before</small>
              <span className={styles.thumbImg} />
              <span className={styles.thumbLine} />
              <span className={styles.thumbLine} />
              <span className={styles.thumbCta} />
            </div>
          </div>

          <div className={styles.notes}>
            <div className={styles.note} data-kind="before">
              <small><i><Icon name="scan" /></i>Reviewing<b className={styles.pulse} /></small>
              <strong>Current mobile layout</strong>
              <p>Looks fine at first glance. The review checks what a visitor actually sees in the first screen.</p>
            </div>
            <div className={styles.note} data-kind="issue">
              <small><i><Icon name="alert" /></i>Issue found<em>High</em></small>
              <strong>CTA is difficult to find on mobile</strong>
              <p>Primary action sits below the fold with low contrast and competes with the image.</p>
              <span className={styles.resolved}><Icon name="check" />Resolved</span>
            </div>
            <div className={styles.note} data-kind="fix">
              <small><i><Icon name="sparkle" /></i>Recommendation</small>
              <strong>Move primary CTA higher and improve contrast.</strong>
              <ul>
                <li><Icon name="arrowUp" />Bring the button into the first screen</li>
                <li><Icon name="image" />Shorten the hero image on mobile</li>
                <li><Icon name="target" />Use a high-contrast button style</li>
              </ul>
            </div>
            <div className={styles.note} data-kind="done">
              <i><Icon name="check" /></i>
              <span><strong>Improved</strong><small>CTA visible before scrolling</small></span>
            </div>
          </div>

          <button type="button" className={styles.replay} onClick={replay} aria-label="Replay the before and after animation">
            <Icon name="play" />Replay
          </button>
        </div>
      </div>

      {/* Steps: drive the visual on desktop, tappable list on mobile */}
      <div className={styles.steps}>
        {journeySteps.map((item, index) => (
          <article
            key={item.key}
            className={styles.step}
            data-step={index}
            data-state={stateOf(index)}
            onClick={() => (mode === "mobile" ? jump(index) : undefined)}
          >
            <span className={styles.stepNo}>0{index + 1}</span>
            <div className={styles.stepBody}>
              <span className={styles.stepLabel}>{item.label}</span>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
