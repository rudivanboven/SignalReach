import Link from "next/link";
import Icon from "@/components/ui/Icon/Icon";
import styles from "./InnerHero.module.css";

// Shared premium hero for inner pages. Each variant keeps the SignalReach
// language (dark field, grid, glow, signal lines) but has its own palette,
// background motion and page-specific visual.

const wave = (y, amp) => {
  let d = `M-720 ${y}`;
  for (let i = 0; i < 8; i += 1) d += ` q180 ${i % 2 ? amp : -amp} 360 0`;
  return d;
};

function BgScene({ variant }) {
  if (variant === "process") {
    return (
      <svg className={styles.scene} viewBox="0 0 1440 700" preserveAspectRatio="xMidYMid slice">
        <path className={styles.bgLine} d="M-40 560 C 300 560 420 420 720 430 S 1150 270 1480 230" />
        <path className={styles.bgLine} d="M-40 640 C 360 650 560 510 860 520 S 1240 400 1480 360" />
        <path className={styles.bgPulse} pathLength="1" d="M-40 560 C 300 560 420 420 720 430 S 1150 270 1480 230" />
        {[[720, 430], [1080, 300], [860, 520], [1240, 410]].map(([x, y]) => (
          <circle key={`${x}-${y}`} className={styles.bgNode} cx={x} cy={y} r="4" />
        ))}
      </svg>
    );
  }
  if (variant === "services") {
    return (
      <svg className={styles.scene} viewBox="0 0 1440 700" preserveAspectRatio="xMidYMid slice">
        {[[1300, 170, 96, 60], [1330, 330, 84, 54], [1010, 590, 110, 70], [40, 300, 96, 60], [220, 600, 80, 52], [1350, 560, 64, 42]].map(([x, y, w, h], i) => (
          <rect key={`${x}-${y}`} className={styles.bgModule} x={x} y={y} width={w} height={h} rx="12" style={{ animationDelay: `${i * -1.6}s` }} />
        ))}
      </svg>
    );
  }
  if (variant === "about") {
    return (
      <svg className={styles.scene} viewBox="0 0 1440 700" preserveAspectRatio="xMidYMid slice">
        <g className={styles.waves}>
          <path className={styles.bgWave} d={wave(470, 34)} />
          <path className={styles.bgWave} d={wave(540, 22)} />
          <path className={styles.bgWave} d={wave(610, 42)} />
        </g>
      </svg>
    );
  }
  if (variant === "team") {
    const pts = [[120, 150], [300, 90], [520, 200], [1180, 120], [1330, 300], [1240, 560], [180, 620], [980, 640]];
    const edges = [[0, 1], [1, 2], [3, 4], [4, 5], [5, 7], [0, 6]];
    return (
      <svg className={styles.scene} viewBox="0 0 1440 700" preserveAspectRatio="xMidYMid slice">
        <circle className={styles.bgOrbit} cx="1060" cy="380" r="250" />
        <circle className={styles.bgOrbit} cx="1060" cy="380" r="330" />
        <circle className={styles.bgOrbitTrace} pathLength="1" cx="1060" cy="380" r="250" />
        <circle className={styles.bgOrbitTrace} pathLength="1" cx="1060" cy="380" r="330" />
        {edges.map(([a, b]) => <line key={`${a}-${b}`} className={styles.bgEdge} x1={pts[a][0]} y1={pts[a][1]} x2={pts[b][0]} y2={pts[b][1]} />)}
        {[[240, 520], [420, 600], [700, 560], [860, 640], [1380, 460], [60, 400]].map(([x, y], i) => (
          <circle key={`m-${x}`} className={styles.bgMote} cx={x} cy={y} r="2.5" style={{ animationDelay: `${i * -2}s` }} />
        ))}
        {pts.map(([x, y], i) => <circle key={`${x}-${y}`} className={styles.bgNode} cx={x} cy={y} r="3.5" style={{ animationDelay: `${i * -0.7}s` }} />)}
      </svg>
    );
  }
  return (
    <>
      <span className={styles.scanBand} />
      {[[8, 24], [92, 20], [84, 82], [14, 78]].map(([x, y], i) => (
        <i key={`${x}-${y}`} className={styles.blip} style={{ left: `${x}%`, top: `${y}%`, animationDelay: `${i * -1.4}s` }} />
      ))}
    </>
  );
}

const steps = [
  ["01", "Review", "11.4%", "80.6%"],
  ["02", "Test", "38.6%", "55.6%"],
  ["03", "Document", "65.9%", "38.9%"],
  ["04", "Prioritize", "88.6%", "16.7%"],
];
const flowPath = "M50 290 C 110 290 120 200 170 200 S 240 140 290 140 S 360 60 390 60";

function ProcessVisual() {
  return (
    <div className={styles.flow}>
      <svg viewBox="0 0 440 360">
        <path className={styles.flowTrack} pathLength="1" d={flowPath} />
        <path className={styles.flowRun} pathLength="1" d={flowPath} />
      </svg>
      {steps.map(([n, label, x, y], i) => (
        <div key={n} className={styles.step} style={{ "--i": i, left: x, top: y }}>
          {n}
          <small>{label}</small>
        </div>
      ))}
      <div className={`${styles.panel} ${styles.flowTag}`}>
        <Icon name="sparkle" />
        Human-led, step by step
      </div>
      <div className={`${styles.panel} ${styles.planCard}`}>
        <small>Action plan</small>
        <strong>Prioritized fixes</strong>
        <span><i /><i /><i /></span>
      </div>
    </div>
  );
}

const modules = [
  ["layout", "Layout & UI", "0%", "4%"],
  ["smartphone", "Responsive", "68%", "0%"],
  ["cursor", "Interactions", "74%", "42%"],
  ["gauge", "Performance", "0%", "62%"],
  ["text", "Content", "42%", "88%"],
];

function ServicesVisual() {
  return (
    <div className={styles.toolkit}>
      <div className={`${styles.panel} ${styles.window}`}>
        <div className={styles.windowBar}><i /><i /><i /><span>yourwebsite.com</span></div>
        <div className={styles.windowBody}>
          <b className={styles.wHero} />
          <div className={styles.wRow}><b /><b /></div>
          <div className={styles.wCards}><b /><b /><b /></div>
          <span className={styles.scanBox} />
        </div>
      </div>
      <div className={styles.device}><i /><i /><i /></div>
      {modules.map(([icon, label, x, y], i) => (
        <div key={label} className={`${styles.panel} ${styles.module}`} style={{ "--i": i, left: x, top: y }}>
          <Icon name={icon} />
          {label}
        </div>
      ))}
    </div>
  );
}

function AboutVisual() {
  return (
    <div className={styles.human}>
      <span className={styles.ring} />
      <span className={styles.ring} />
      <svg viewBox="0 0 460 380">
        <path className={styles.arc} d="M83 114 Q 230 20 377 114" />
        <path className={styles.link} pathLength="1" d="M83 180 C 83 236 170 266 230 266" />
        <path className={styles.link} pathLength="1" d="M377 180 C 377 236 290 266 230 266" />
        <path className={styles.linkRun} pathLength="1" d="M83 180 C 83 236 170 266 230 266" />
        <path className={`${styles.linkRun} ${styles.linkRunWarm}`} pathLength="1" d="M377 180 C 377 236 290 266 230 266" />
      </svg>
      <div className={styles.persp} style={{ left: "18%", top: "30%" }}>
        <span><Icon name="cursor" /></span>
        <small>User perspective</small>
      </div>
      <div className={`${styles.persp} ${styles.perspWarm}`} style={{ left: "82%", top: "30%" }}>
        <span><Icon name="ruler" /></span>
        <small>Developer perspective</small>
      </div>
      <div className={`${styles.panel} ${styles.core}`}>
        <Icon name="sparkle" />
        <div>
          <strong>Clear recommendations</strong>
          <small>UX thinking + implementation experience</small>
        </div>
      </div>
    </div>
  );
}

const issues = [
  ["critical", "Mobile menu overlaps the logo"],
  ["major", "Primary CTA contrast is too low"],
  ["minor", "Hero image crops on tablet"],
];

function ReportVisual() {
  return (
    <div className={styles.action}>
      <div className={`${styles.panel} ${styles.url}`}>
        <Icon name="link" />
        <span className={styles.urlText}>https://yourwebsite.com</span>
        <i className={styles.caret} />
        <b>Review <Icon name="arrowRight" /></b>
      </div>
      <div className={styles.reportCard}>
        <div className={styles.reportHead}>
          <div><small>Website QA report</small><strong>yourwebsite.com</strong></div>
          <em><Icon name="scan" />Reviewing</em>
        </div>
        <div className={styles.progress}><i /></div>
        <ul>
          {issues.map(([level, text], i) => (
            <li key={text} style={{ "--i": i }}><i data-level={level} />{text}<span>{level}</span></li>
          ))}
        </ul>
        <span className={styles.beam} />
      </div>
      <div className={styles.eta}><Icon name="clock" />Delivered in 6–12 hours</div>
    </div>
  );
}

// Team: four expertise placeholders (no real people) linked into one mesh
// around a shared hub. Replace avatars with real photos when available.
const members = [
  { role: "QA", icon: "scan", at: [96, 92] },
  { role: "Design", icon: "layout", at: [364, 112] },
  { role: "Development", icon: "code", at: [346, 292], warm: true },
  { role: "UX", icon: "cursor", at: [112, 282] },
];
const HUB = [230, 196];
const loop = `M${members.map((m) => m.at.join(" ")).join(" L")} Z`;

function TeamVisual() {
  return (
    <div className={styles.teamStage}>
      <span className={styles.teamOrbit} />
      <svg viewBox="0 0 460 380">
        <path className={styles.mesh} d={loop} />
        {members.map((m) => <path key={m.role} className={styles.spoke} d={`M${m.at[0]} ${m.at[1]} L${HUB[0]} ${HUB[1]}`} />)}
        <path className={styles.meshRun} pathLength="1" d={loop} />
        {members.map((m, i) => <path key={`p-${m.role}`} className={styles.spokeRun} style={{ "--i": i }} pathLength="1" d={`M${m.at[0]} ${m.at[1]} L${HUB[0]} ${HUB[1]}`} />)}
      </svg>
      <div className={styles.hub} style={{ left: `${(HUB[0] / 460) * 100}%`, top: `${(HUB[1] / 380) * 100}%` }}>
        <span className={styles.hubPulse} />
        <i><Icon name="sparkle" /></i>
      </div>
      {members.map((m, i) => (
        <div key={m.role} className={`${styles.member} ${m.warm ? styles.memberWarm : ""}`} style={{ "--i": i, left: `${(m.at[0] / 460) * 100}%`, top: `${(m.at[1] / 380) * 100}%` }}>
          <span className={styles.avatar}><Icon name="user" /><em><Icon name={m.icon} /></em></span>
          <small>{m.role}</small>
        </div>
      ))}
    </div>
  );
}

const visuals = { team: TeamVisual, process: ProcessVisual, services: ServicesVisual, about: AboutVisual, report: ReportVisual };

export default function InnerHero({
  variant = "process",
  eyebrow,
  title,
  accent,
  text,
  primary = "Get Your Free Website QA Report",
  primaryHref = "/free-report",
  secondary,
  secondaryHref = "/",
}) {
  const Visual = visuals[variant] ?? ProcessVisual;
  return (
    <section className={`${styles.hero} ${styles[variant]}`}>
      <div className={styles.bg} aria-hidden="true">
        <div className={styles.grid} />
        <span className={styles.glowA} />
        <span className={styles.glowB} />
        <BgScene variant={variant} />
      </div>
      <div className={`container ${styles.inner}`}>
        <div className={styles.copy}>
          <span className="eyebrow">{eyebrow}</span>
          <h1>
            {title}
            {accent && <> <span>{accent}</span></>}
          </h1>
          <p>{text}</p>
          <div className={styles.actions}>
            <Link className="btnSecondary" href={primaryHref}>
              {primary}
              <span className="btnIcon"><Icon name="arrowRight" /></span>
            </Link>
            {secondary && <Link className={`btnGhost ${styles.ghost}`} href={secondaryHref}>{secondary}</Link>}
          </div>
        </div>
        <div className={styles.visual} aria-hidden="true">
          <Visual />
        </div>
      </div>
    </section>
  );
}
