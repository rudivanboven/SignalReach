"use client";

import { useEffect, useRef, useState } from "react";
import Reveal from "@/components/ui/Reveal/Reveal";
import Icon from "@/components/ui/Icon/Icon";
import { channels, scanSignals, points, sources, reasons } from "./content";
import styles from "./WhyItMatters.module.css";

// Story timeline — ms spent on each step before moving on:
// 0 waiting → 1 website + scan → 2 search → 3 AI → 4 visitors → 5 UX →
// 6 everything connected (hold), then loop back to 1.
const HOLD = [350, 1900, 1800, 1800, 1700, 1400, 7600];
const FINAL = HOLD.length - 1;

const motes = [[6, 22, 0], [18, 78, -5], [34, 12, -9], [52, 90, -3], [71, 16, -11], [86, 64, -7], [94, 30, -13]];

const clamp = (v, min, max) => Math.min(max, Math.max(min, v));
const f = (n) => n.toFixed(1);

// Bezier from the website's nearest edge to the node's facing edge. Vertical
// links leave the top/bottom edge, horizontal ones the side; `bend` lets the
// pointer pull the curve slightly and `wob` gives straight runs a soft S.
function connector(site, node, bend, wob) {
  const scx = site.x + site.w / 2;
  const scy = site.y + site.h / 2;
  const ncx = node.x + node.w / 2;
  const ncy = node.y + node.h / 2;
  const dx = ncx - scx;
  const dy = ncy - scy;
  const vertical = Math.abs(dy) * site.w > Math.abs(dx) * site.h;
  let a;
  let b;
  let dir;
  if (vertical) {
    const down = dy > 0;
    a = [clamp(ncx, site.x + site.w * 0.2, site.x + site.w * 0.8), down ? site.y + site.h : site.y];
    b = [ncx, down ? node.y : node.y + node.h];
    dir = [0, down ? 1 : -1];
  } else {
    const right = dx > 0;
    a = [right ? site.x + site.w : site.x, clamp(ncy, site.y + site.h * 0.25, site.y + site.h * 0.75)];
    b = [right ? node.x : node.x + node.w, ncy];
    dir = [right ? 1 : -1, 0];
  }
  const span = Math.abs(vertical ? b[1] - a[1] : b[0] - a[0]);
  const k = Math.max(span * 0.55, 24);
  const perp = [-dir[1] * wob, dir[0] * wob];
  const c1 = [a[0] + dir[0] * k + perp[0] + bend[0], a[1] + dir[1] * k + perp[1] + bend[1]];
  const c2 = [b[0] - dir[0] * k - perp[0] + bend[0], b[1] - dir[1] * k - perp[1] + bend[1]];
  return { d: `M${f(a[0])} ${f(a[1])} C ${f(c1[0])} ${f(c1[1])} ${f(c2[0])} ${f(c2[1])} ${f(b[0])} ${f(b[1])}`, a, b };
}

function SearchViz() {
  return (
    <div className={styles.searchViz} aria-hidden="true">
      <div className={styles.query}>
        <Icon name="seo" />
        <span><i /></span>
        <b />
      </div>
      <ul className={styles.indexList}>
        {["Page structure", "Headings", "Key content"].map((label, k) => (
          <li key={label} style={{ "--k": k }}>
            <span className={styles.idxBar}><i /></span>
            <em>{label}</em>
            <Icon name="check" />
          </li>
        ))}
      </ul>
    </div>
  );
}

const net = [[12, 34], [62, 14], [62, 54], [120, 34], [178, 12], [178, 56], [228, 34]];
const edges = [[0, 1], [0, 2], [1, 3], [2, 3], [1, 2], [3, 4], [3, 5], [4, 6], [5, 6]];

function AiViz() {
  return (
    <div className={styles.aiViz} aria-hidden="true">
      <svg className={styles.neural} viewBox="0 0 240 68">
        {edges.map(([p, q], k) => {
          const d = `M${net[p][0]} ${net[p][1]} L${net[q][0]} ${net[q][1]}`;
          return (
            <g key={`${p}-${q}`} style={{ "--k": k }}>
              <path className={styles.edge} d={d} />
              <path className={styles.packet} pathLength="1" d={d} />
            </g>
          );
        })}
        {net.map(([x, y], k) => (
          <circle key={`${x}-${y}`} className={styles.neuron} cx={x} cy={y} r={k === 3 ? 5.5 : 3.6} style={{ "--k": k }} />
        ))}
      </svg>
      <ol className={styles.chain}>
        {["Discovers", "Understands", "Connects"].map((label, k) => (
          <li key={label} style={{ "--k": k }}>{label}</li>
        ))}
      </ol>
    </div>
  );
}

function VisitorViz() {
  return (
    <div className={styles.visitViz} aria-hidden="true">
      <div className={styles.miniScene}>
        <div className={styles.miniPage}>
          <span className={styles.miniBar} />
          <span className={styles.miniLine} />
          <span className={`${styles.miniLine} ${styles.miniShort}`} />
          <span className={styles.miniCta}><i /></span>
          <svg className={styles.miniCursor} viewBox="0 0 24 24"><path d="M5 3.5 19 11l-6.2 1.7L9.6 19z" /></svg>
        </div>
        <div className={styles.miniPhone}>
          <span /><span /><b /><i />
        </div>
      </div>
      <ol className={styles.journey}>
        {["Arrive", "Explore", "Act"].map((label, k) => (
          <li key={label} style={{ "--k": k }}>{label}</li>
        ))}
      </ol>
    </div>
  );
}

const uxChecks = [["smartphone", "Mobile"], ["gauge", "Speed"], ["form", "Forms"], ["cursor", "Usability"]];

function UxViz() {
  return (
    <ul className={styles.uxViz} aria-hidden="true">
      {uxChecks.map(([icon, label], k) => (
        <li key={label} style={{ "--k": k }}>
          <Icon name={icon} />
          <span>{label}</span>
          <i />
        </li>
      ))}
    </ul>
  );
}

const vizFor = { search: SearchViz, ai: AiViz, visitors: VisitorViz, ux: UxViz };

export default function WhyItMatters() {
  const sectionRef = useRef(null);
  const stageRef = useRef(null);
  const siteRef = useRef(null);
  const svgRef = useRef(null);
  const nodeRefs = useRef([]);
  const [step, setStep] = useState(0);
  const [live, setLive] = useState(false);
  const [reduced, setReduced] = useState(false);

  // Run the story only while the stage is on screen.
  useEffect(() => {
    setReduced(matchMedia("(prefers-reduced-motion: reduce)").matches);
    const stage = stageRef.current;
    if (!stage) return;
    const observer = new IntersectionObserver(([entry]) => setLive(entry.isIntersecting), { threshold: 0.18 });
    observer.observe(stage);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (reduced) {
      setStep(FINAL);
      return;
    }
    if (!live) return;
    const id = setTimeout(() => setStep((s) => (s >= FINAL ? 1 : s + 1)), HOLD[step]);
    return () => clearTimeout(id);
  }, [live, step, reduced]);

  // Connector geometry + pointer effects. Layout is read with offset* (which
  // ignores the parallax transforms) and the same parallax offsets are added
  // back here, so the links stay attached while the elements drift.
  useEffect(() => {
    const section = sectionRef.current;
    const stage = stageRef.current;
    const svg = svgRef.current;
    if (!section || !stage || !svg) return;
    const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fine = matchMedia("(hover: hover) and (pointer: fine) and (min-width: 1100px)");
    const spine = matchMedia("(max-width: 640px)");
    const groups = [...svg.querySelectorAll("g[data-chan]")].map((g) => ({
      paths: [...g.querySelectorAll("path")],
      ports: [...g.querySelectorAll("circle")],
    }));
    const geo = { site: null, nodes: [] };
    const target = { x: 0, y: 0 };
    const cur = { x: 0, y: 0 };
    const ptr = { x: 0, y: 0 };
    const glow = { x: 0, y: 0 };
    const glowTarget = { x: 0, y: 0 };
    let hover = 0;
    let hoverTarget = 0;
    let frame = 0;

    const box = (el) => ({ x: el.offsetLeft, y: el.offsetTop, w: el.offsetWidth, h: el.offsetHeight });

    const measure = () => {
      geo.site = box(siteRef.current);
      geo.nodes = nodeRefs.current.map(box);
      svg.setAttribute("viewBox", `0 0 ${stage.clientWidth} ${stage.clientHeight}`);
    };

    const draw = () => {
      if (spine.matches || !geo.site) return;
      const s = { ...geo.site, x: geo.site.x + cur.x * 7, y: geo.site.y + cur.y * 6 };
      channels.forEach((c, i) => {
        const n0 = geo.nodes[i];
        if (!n0) return;
        const n = { ...n0, x: n0.x - cur.x * c.depth * 12, y: n0.y - cur.y * c.depth * 9 };
        const mx = (s.x + s.w / 2 + n.x + n.w / 2) / 2;
        const my = (s.y + s.h / 2 + n.y + n.h / 2) / 2;
        const bend = [clamp((ptr.x - mx) * 0.07, -20, 20) * hover, clamp((ptr.y - my) * 0.07, -20, 20) * hover];
        const { d, a, b } = connector(s, n, bend, i % 2 ? 14 : -14);
        groups[i].paths.forEach((p) => p.setAttribute("d", d));
        groups[i].ports[0].setAttribute("cx", f(a[0]));
        groups[i].ports[0].setAttribute("cy", f(a[1]));
        groups[i].ports[1].setAttribute("cx", f(b[0]));
        groups[i].ports[1].setAttribute("cy", f(b[1]));
        const dist = Math.hypot(ptr.x - (n.x + n.w / 2), ptr.y - (n.y + n.h / 2));
        nodeRefs.current[i].style.setProperty("--near", (hover * clamp(1 - dist / 360, 0, 1)).toFixed(3));
      });
    };

    const render = () => {
      frame = 0;
      cur.x += (target.x - cur.x) * 0.07;
      cur.y += (target.y - cur.y) * 0.07;
      glow.x += (glowTarget.x - glow.x) * 0.12;
      glow.y += (glowTarget.y - glow.y) * 0.12;
      hover += (hoverTarget - hover) * 0.08;
      section.style.setProperty("--px", cur.x.toFixed(4));
      section.style.setProperty("--py", cur.y.toFixed(4));
      section.style.setProperty("--mx", `${glow.x.toFixed(1)}px`);
      section.style.setProperty("--my", `${glow.y.toFixed(1)}px`);
      draw();
      const settling =
        Math.abs(target.x - cur.x) > 0.0005 ||
        Math.abs(target.y - cur.y) > 0.0005 ||
        Math.abs(glowTarget.x - glow.x) > 0.5 ||
        Math.abs(glowTarget.y - glow.y) > 0.5 ||
        Math.abs(hoverTarget - hover) > 0.002;
      if (settling) frame = requestAnimationFrame(render);
    };
    const request = () => { if (!frame) frame = requestAnimationFrame(render); };

    const move = (e) => {
      if (!fine.matches) return;
      const sr = section.getBoundingClientRect();
      const st = stage.getBoundingClientRect();
      glowTarget.x = e.clientX - sr.left;
      glowTarget.y = e.clientY - sr.top;
      if (section.dataset.hover !== "on") {
        glow.x = glowTarget.x;
        glow.y = glowTarget.y;
        section.dataset.hover = "on";
      }
      ptr.x = e.clientX - st.left;
      ptr.y = e.clientY - st.top;
      target.x = clamp(((e.clientX - st.left) / st.width) * 2 - 1, -1, 1);
      target.y = clamp(((e.clientY - st.top) / st.height) * 2 - 1, -1, 1);
      hoverTarget = 1;
      request();
    };
    const leave = () => {
      target.x = 0;
      target.y = 0;
      hoverTarget = 0;
      section.dataset.hover = "off";
      request();
    };

    const sync = () => { measure(); draw(); };
    sync();
    const resize = new ResizeObserver(sync);
    resize.observe(stage);
    document.fonts?.ready.then(sync);
    if (!reducedMotion) {
      section.addEventListener("pointermove", move, { passive: true });
      section.addEventListener("pointerleave", leave);
    }
    return () => {
      resize.disconnect();
      section.removeEventListener("pointermove", move);
      section.removeEventListener("pointerleave", leave);
      cancelAnimationFrame(frame);
    };
  }, []);

  const pointStep = step >= FINAL - 1 ? FINAL : step;

  return (
    <section ref={sectionRef} className={styles.section} aria-labelledby="why-heading">
      <div className={styles.bg} aria-hidden="true">
        <span className={styles.grid} />
        <span className={styles.glowBlue} />
        <span className={styles.glowCyan} />
        <span className={styles.glowGold} />
        <span className={styles.cursorGlow} />
        <svg className={styles.signalLines} viewBox="0 0 1440 1000" preserveAspectRatio="none">
          <path pathLength="1" d="M-40 210 C 300 140 520 300 820 230 S 1300 120 1480 190" />
          <path pathLength="1" d="M-40 780 C 260 860 600 700 900 790 S 1260 900 1480 820" />
          <path pathLength="1" d="M-40 520 C 380 470 640 590 1000 520 S 1360 470 1480 500" />
        </svg>
        {motes.map(([x, y, d]) => (
          <span key={`${x}-${y}`} className={styles.mote} style={{ left: `${x}%`, top: `${y}%`, animationDelay: `${d}s` }} />
        ))}
      </div>

      <div className="container">
        <div className={styles.head}>
          <Reveal>
            <span className={`eyebrow ${styles.eyebrow}`}>Why website QA matters</span>
            <h2 id="why-heading">
              Your Website Needs to Be <em>Understood</em>
              <br className={styles.br} /> By People, <em>Search Engines</em> and <em>AI</em>.
            </h2>
          </Reveal>
          <Reveal delay={120}>
            <div className={styles.insight}>
              <span className={styles.insightGlow} aria-hidden="true" />

              <div className={styles.why}>
                <span className={styles.whyLabel}>
                  <i><Icon name="scan" /></i>The why
                </span>
                <p className={styles.whyStatement}>
                  Your website is often the first place <b>people</b>, <b>search engines</b> and <b>AI&nbsp;systems</b> go to understand your business.
                </p>
                <div className={styles.whyFlow}>
                  <ul className={styles.sources}>
                    {sources.map((s) => (
                      <li key={s.label} className={styles[s.tone]}><Icon name={s.icon} />{s.label}</li>
                    ))}
                  </ul>
                  <svg className={styles.flowLines} viewBox="0 0 60 90" preserveAspectRatio="none" aria-hidden="true">
                    {[15, 45, 75].map((y, k) => (
                      <g key={y} style={{ "--k": k }}>
                        <path d={`M0 ${y} C 30 ${y} 30 45 60 45`} />
                        <path className={styles.flowPulse} pathLength="1" d={`M0 ${y} C 30 ${y} 30 45 60 45`} />
                      </g>
                    ))}
                  </svg>
                  <span className={styles.target}>
                    <i><Icon name="layout" /></i>
                    Understand your website
                  </span>
                </div>
              </div>

              <ol className={styles.reasons}>
                {reasons.map((r, k) => (
                  <li key={r.title} className={styles.reason} style={{ "--k": k }}>
                    <span className={styles.reasonIcon} aria-hidden="true"><Icon name={r.icon} /></span>
                    <div>
                      <h3><small aria-hidden="true">{r.number}</small>{r.title}</h3>
                      <p>{r.text}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </Reveal>
        </div>

        <div
          ref={stageRef}
          className={styles.stage}
          data-step={step}
          data-live={live || reduced ? "true" : "false"}
        >
          <svg ref={svgRef} className={styles.links} aria-hidden="true">
            {channels.map((c, i) => (
              <g key={c.key} data-chan={i} className={`${styles.link} ${styles[c.key]}`} data-on={step >= c.step}>
                <path className={styles.track} pathLength="1" />
                <path className={styles.draw} pathLength="1" />
                <path className={styles.flow} pathLength="1" />
                <circle className={styles.port} r="3.5" />
                <circle className={styles.port} r="3.5" />
              </g>
            ))}
          </svg>

          <div ref={siteRef} className={styles.site} role="img" aria-label="A business website being reviewed for navigation, structure, content clarity, performance, functionality, UX and responsiveness">
            <span className={styles.orbit} />
            <span className={`${styles.orbit} ${styles.orbitOuter}`} />
            <span className={styles.siteHalo} />
            <span className={`${styles.layer} ${styles.layerBack}`} />
            <span className={`${styles.layer} ${styles.layerMid}`} />
            <div className={styles.window}>
              <div className={styles.chrome}>
                <i /><i /><i />
                <span className={styles.url}><b /></span>
              </div>
              <div className={styles.page}>
                <div className={`${styles.blk} ${styles.nav}`} style={{ "--t": 0.06 }}>
                  <span className={styles.logo} />
                  <span className={styles.navLinks}><i /><i /><i /><i /></span>
                  <span className={styles.navCta} />
                </div>
                <div className={styles.heroRow}>
                  <div className={styles.heroCopy}>
                    <span className={`${styles.blk} ${styles.headline}`} style={{ "--t": 0.2 }}><i /><i /></span>
                    <span className={`${styles.blk} ${styles.para}`} style={{ "--t": 0.42 }}><i /><i /><i /></span>
                    <span className={`${styles.blk} ${styles.cta}`} style={{ "--t": 0.52 }}><i /></span>
                  </div>
                  <div className={`${styles.blk} ${styles.media}`} style={{ "--t": 0.32 }}>
                    <svg viewBox="0 0 120 90" preserveAspectRatio="xMidYMid slice">
                      <circle cx="88" cy="26" r="10" />
                      <path d="M0 90 L34 48 L58 70 L82 42 L120 80 L120 90 Z" />
                    </svg>
                  </div>
                </div>
                <div className={styles.cards}>
                  {[0, 1, 2].map((k) => (
                    <span key={k} className={`${styles.blk} ${styles.card}`} style={{ "--t": 0.72 }}><b /><i /><i /></span>
                  ))}
                </div>
                <div className={`${styles.blk} ${styles.foot}`} style={{ "--t": 0.9 }}><i /><i /><i /></div>
                <span className={styles.scan} />
              </div>
            </div>
            <div className={`${styles.phone} ${styles.blk}`} style={{ "--t": 0.88 }}>
              <span /><span /><span /><b />
            </div>
            <div className={styles.signals} aria-hidden="true">
              {scanSignals.map((s) => (
                <span
                  key={s.label}
                  className={`${styles.chip} ${s.minor ? styles.minor : ""}`}
                  data-side={s.side}
                  style={{ "--t": s.t, top: `${s.t * 100}%` }}
                >
                  <i />{s.label}
                </span>
              ))}
            </div>
          </div>

          {channels.map((c, i) => {
            const Viz = vizFor[c.key];
            return (
              <article
                key={c.key}
                ref={(el) => { nodeRefs.current[i] = el; }}
                className={`${styles.node} ${styles[c.key]}`}
                data-on={step >= c.step}
                data-current={step === c.step}
                style={{ "--depth": c.depth }}
              >
                <span className={styles.nodeGlow} aria-hidden="true" />
                <span className={styles.rail} aria-hidden="true" />
                <div className={styles.nodeText}>
                  <div className={styles.nodeHead}>
                    <span className={styles.nodeIcon}>
                      <Icon name={c.icon} />
                      <i className={styles.ping} />
                    </span>
                    <div>
                      <small>{c.kicker}</small>
                      <h3>{c.label}</h3>
                    </div>
                    <span className={styles.status} aria-hidden="true" />
                  </div>
                  <p>{c.text}</p>
                </div>
                <Viz />
              </article>
            );
          })}
        </div>

        <ol className={styles.points}>
          {points.map((p) => (
            <li
              key={p.number}
              className={styles.point}
              data-on={pointStep >= p.step}
              data-current={pointStep === p.step || pointStep === FINAL}
            >
              <span className={styles.pointBar} aria-hidden="true"><i /></span>
              <span className={styles.pointNum} aria-hidden="true">{p.number}</span>
              <div>
                <h3>{p.title}</h3>
                <p>{p.text}</p>
              </div>
            </li>
          ))}
        </ol>

        <Reveal className={styles.closing}>
          <svg className={styles.closingWave} viewBox="0 0 600 40" preserveAspectRatio="none" aria-hidden="true">
            <path pathLength="1" d="M0 20 C 50 4 100 4 150 20 S 250 36 300 20 S 400 4 450 20 S 550 36 600 20" />
            <path pathLength="1" d="M0 20 C 50 4 100 4 150 20 S 250 36 300 20 S 400 4 450 20 S 550 36 600 20" />
          </svg>
          <p>
            Your website sends signals everywhere.
            <span>Make sure they are the right ones.</span>
          </p>
        </Reveal>
      </div>
    </section>
  );
}
