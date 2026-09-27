import SectionHeading from "@/components/ui/SectionHeading/SectionHeading";
import Reveal from "@/components/ui/Reveal/Reveal";
import Icon from "@/components/ui/Icon/Icon";
import QaInspector from "./QaInspector";
import styles from "./WhatWeCatch.module.css";

const signalPaths = [
  "M-60 640 C 260 540, 480 800, 880 660 S 1300 440, 1520 540",
  "M-60 170 C 240 250, 430 40, 760 130 S 1220 300, 1520 160",
  "M180 980 C 480 720, 700 930, 1010 740 S 1360 560, 1520 660",
];
const nodes = [
  { x: 8, y: 22, d: 0, t: 14 }, { x: 22, y: 78, d: -4, t: 17 }, { x: 36, y: 14, d: -7, t: 15 },
  { x: 48, y: 88, d: -2, t: 19 }, { x: 61, y: 30, d: -9, t: 16 }, { x: 73, y: 70, d: -5, t: 18 },
  { x: 86, y: 18, d: -1, t: 14 }, { x: 93, y: 58, d: -8, t: 20 }, { x: 54, y: 52, d: -11, t: 21 },
];
const meta = [
  { icon: "smartphone", text: "Reviewed at every breakpoint" },
  { icon: "cursor", text: "Real interactions, not scores" },
  { icon: "report", text: "Every finding documented" },
];

export default function WhatWeCatch() {
  return (
    <section className={`section ${styles.section}`} aria-labelledby="catch-heading">
      <div className={styles.bg} aria-hidden="true">
        <div className={styles.grid} />
        <div className={styles.lightA} />
        <div className={styles.lightB} />
        <div className={styles.scanGlow} />
        <div className={styles.rings}><span /><span /><span /></div>
        <svg className={styles.paths} viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice">
          {signalPaths.map((d, i) => (
            <path key={d} className={styles.path} d={d} style={{ animationDelay: `${i * -3}s` }} />
          ))}
          {signalPaths.map((d, i) => (
            <circle key={`t-${d}`} className={styles.traveller} r="3" style={{ animationDelay: `${i * -2}s` }}>
              <animateMotion dur={`${16 + i * 4}s`} repeatCount="indefinite" path={d} />
            </circle>
          ))}
        </svg>
        {nodes.map((n) => (
          <span key={`${n.x}-${n.y}`} className={styles.node} style={{ left: `${n.x}%`, top: `${n.y}%`, animationDelay: `${n.d}s`, animationDuration: `${n.t}s` }} />
        ))}
      </div>

      <div className="container">
        <Reveal className={styles.head}>
          <div className={styles.headGrid}>
            <div id="catch-heading">
              <SectionHeading
                eyebrow="Beyond the obvious"
                title="We Find the Issues Visitors Actually Notice."
                text="A website can look fine at first glance and still have dozens of small problems that affect trust, usability and conversion. SignalReach reviews the real experience — not just automated scores."
              />
            </div>
            <ul className={styles.meta}>
              {meta.map((item) => (
                <li key={item.text}><span><Icon name={item.icon} /></span>{item.text}</li>
              ))}
            </ul>
          </div>
        </Reveal>

        <Reveal delay={120}>
          <QaInspector />
        </Reveal>
      </div>
    </section>
  );
}
