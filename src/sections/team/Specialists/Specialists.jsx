"use client";

import Icon from "@/components/ui/Icon/Icon";
import { useInView } from "../useTeamMotion";
import { specialists } from "../teamData";
import RoleBadge from "../RoleBadge/RoleBadge";
import styles from "./Specialists.module.css";

// "Our specialists" — the extended team, shown below Leadership on a light
// surface. Entries are TEMPORARY placeholders (see teamData.js) with no profile
// page; until an `image` is set, cards show a neutral role illustration.

function SpecialistCard({ person, index }) {
  return (
    <article className={styles.card} data-accent={person.accent} style={{ "--i": index }}>
      <div className={styles.photo}>
        {person.image ? (
          <img src={person.image} alt={`${person.name}, ${person.role}`} />
        ) : (
          <span className={styles.placeholder} role="img" aria-label={`Placeholder image for ${person.name}`}>
            <span className={styles.placeholderIcon}><Icon name={person.roleIcon} /></span>
          </span>
        )}
      </div>
      <RoleBadge className={styles.badge} variant="subtle" role={person.role} icon={person.roleIcon} accent={person.accent} />
      <h3>{person.name}</h3>
      <p>{person.text}</p>
    </article>
  );
}

export default function Specialists() {
  const [ref, inView] = useInView(0.15);

  return (
    <section ref={ref} className={`${styles.section} section`} data-inview={inView || undefined}>
      <div className={styles.bg} aria-hidden="true">
        <div className={styles.grid} />
        <span className={styles.circle} />
        <span className={styles.circle} />
        <span className={styles.glow} />
      </div>

      <div className="container">
        <div className={styles.head}>
          <span className="eyebrow">Our specialists</span>
          <h2>The Team <span>Behind the Work</span></h2>
          <p>A multidisciplinary team supporting website review, design, content, development and digital quality.</p>
        </div>

        <div className={styles.cards}>
          {specialists.map((person, i) => <SpecialistCard key={person.name} person={person} index={i} />)}
        </div>
      </div>
    </section>
  );
}
