"use client";

import { Fragment } from "react";
import Icon from "@/components/ui/Icon/Icon";
import { useInView } from "../useTeamMotion";
import { team } from "./teamMembers";
import styles from "./Members.module.css";

const lineOne = ["The", "People", "Behind"];
const lineTwo = ["Every", "Review."];

function ProfileCard({ person, index }) {
  return (
    <article className={styles.card} style={{ "--i": index }}>
      <div className={styles.photo}>
        {person.photo ? (
          <img src={person.photo} alt={`${person.name}, ${person.role}`} />
        ) : (
          <span className={styles.placeholder} role="img" aria-label={`Photo placeholder for ${person.role}`}>
            <Icon name="user" />
          </span>
        )}
      </div>
      <span className={styles.num} aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
      <h3>{person.name}</h3>
      <p>{person.bio}</p>
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

        <div className={styles.cards}>
          {team.map((person, i) => <ProfileCard key={`${person.role}-${i}`} person={person} index={i} />)}
        </div>
      </div>
    </section>
  );
}
