"use client";

import { Fragment } from "react";
import Link from "next/link";
import Icon from "@/components/ui/Icon/Icon";
import { useInView } from "../useTeamMotion";
import { team } from "../teamData";
import RoleBadge from "../RoleBadge/RoleBadge";
import styles from "./Members.module.css";

const lineOne = ["The", "People", "Behind"];
const lineTwo = ["Every", "Review."];

const points = [[6, 30], [94, 22], [12, 78], [88, 70], [50, 96]];

function LeaderCard({ person, index }) {
  return (
    <article className={styles.card} data-accent={person.accent} style={{ "--i": index }}>
      <span className={styles.trace} aria-hidden="true" />
      <div className={styles.photo}>
        {person.image ? (
          <img src={person.image} alt={`${person.name}, ${person.role}`} style={{ objectPosition: person.imagePosition }} />
        ) : (
          <span className={styles.placeholder} role="img" aria-label={`Photo placeholder for ${person.name}`}>
            <Icon name="user" />
          </span>
        )}
      </div>
      <span className={styles.num} aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
      <RoleBadge className={styles.badge} role={person.cardRole ?? person.role} icon={person.roleIcon} accent={person.accent} />
      <h3>{person.name}</h3>
      <p>{person.shortBio}</p>
      <Link className={styles.more} href={`/team/${person.slug}`} aria-label={`Read more about ${person.name}`}>
        Read More <Icon name="arrowRight" />
      </Link>
    </article>
  );
}

export default function Members() {
  const [ref, inView] = useInView(0.12);

  return (
    <section ref={ref} className={`${styles.section} section`} data-inview={inView || undefined}>
      <div className={styles.bg} aria-hidden="true">
        <div className={styles.grid} />
        <span className={styles.glowA} />
        <span className={styles.glowB} />
        <span className={styles.ring} />
        <span className={styles.ring} />
        <svg className={styles.signals} viewBox="0 0 1440 900" preserveAspectRatio="none">
          <path className={styles.signalPath} d="M-20 360 C 300 300 520 420 760 380 S 1200 300 1460 340" />
          <path className={styles.signalRun} pathLength="1" d="M-20 360 C 300 300 520 420 760 380 S 1200 300 1460 340" />
          <path className={styles.signalPath} d="M-20 760 C 360 720 640 820 960 780 S 1300 720 1460 750" />
          <path className={`${styles.signalRun} ${styles.signalRunSlow}`} pathLength="1" d="M-20 760 C 360 720 640 820 960 780 S 1300 720 1460 750" />
        </svg>
        {points.map(([x, y], i) => (
          <i key={`${x}-${y}`} className={styles.point} style={{ left: `${x}%`, top: `${y}%`, animationDelay: `${i * -2.2}s` }} />
        ))}
      </div>

      <div className="container">
        <div className={styles.head}>
          <span className="eyebrow">The team</span>
          <h2>
            {lineOne.map((w, i) => (
              <Fragment key={w}><span className={styles.mask}><span style={{ "--d": `${i * 70}ms` }}>{w}</span></span>{" "}</Fragment>
            ))}
            <span className={styles.accent}>
              {lineTwo.map((w, i) => (
                <Fragment key={w}><span className={styles.mask}><span style={{ "--d": `${240 + i * 90}ms` }}>{w}</span></span>{" "}</Fragment>
              ))}
            </span>
          </h2>
          <p>QA, UX and frontend experience — seeing your website the way users and developers do.</p>
        </div>

        <div className={styles.groupHead}>
          <span className={styles.groupLabel}>Leadership Team</span>
          <p>The people guiding SignalReach’s strategy, technology, operations and review process.</p>
        </div>

        <div className={styles.cards}>
          {team.map((person, i) => <LeaderCard key={person.slug} person={person} index={i} />)}
        </div>
      </div>

      {/* hand-off line into the Specialists section below */}
      <div className={styles.divider} aria-hidden="true"><span /></div>
    </section>
  );
}
