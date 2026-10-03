import Link from "next/link";
import Icon from "@/components/ui/Icon/Icon";
import Reveal from "@/components/ui/Reveal/Reveal";
import styles from "./MemberProfile.module.css";

// Individual team member page (/team/[slug]). Content comes from
// sections/team/teamData.js. Calm, editorial layout: photo + biography first,
// with only light background motion.

const dots = [[8, 22], [91, 14], [86, 64], [4, 78], [48, 92]];

function LinkedIn({ url, name }) {
  if (url) {
    return (
      <a className={styles.linkedin} href={url} target="_blank" rel="noopener noreferrer" aria-label={`${name} on LinkedIn (opens in a new tab)`}>
        LinkedIn <Icon name="arrowUpRight" />
      </a>
    );
  }
  // No URL supplied yet: show the button inactive rather than linking anywhere.
  return (
    <span className={`${styles.linkedin} ${styles.linkedinPending}`} aria-disabled="true" title="LinkedIn profile coming soon">
      LinkedIn <Icon name="arrowUpRight" />
    </span>
  );
}

export default function MemberProfile({ member }) {
  const { name, role, image, imagePosition, eyebrow = "The team", intro, bio, strengths, experience = [], technologies = [], linkedin } = member;
  const firstName = name.split(" ")[0];

  return (
    <article className={styles.page}>
      <div className={styles.bg} aria-hidden="true">
        <div className={styles.grid} />
        <span className={styles.glowA} />
        <span className={styles.glowB} />
        {dots.map(([x, y], i) => (
          <i key={`${x}-${y}`} className={styles.dot} style={{ left: `${x}%`, top: `${y}%`, animationDelay: `${i * -2.4}s` }} />
        ))}
      </div>

      <div className={`container ${styles.top}`}>
        <Link className={styles.back} href="/team">
          <Icon name="arrowRight" />
          Back to Team
        </Link>

        <header className={styles.hero}>
          <figure className={styles.portrait}>
            {image ? (
              <img src={image} alt={`${name}, ${role}`} style={{ objectPosition: imagePosition }} />
            ) : (
              <span className={styles.placeholder} role="img" aria-label={`Photo placeholder for ${name}`}>
                <Icon name="user" />
              </span>
            )}
          </figure>

          <div className={styles.intro}>
            <span className="eyebrow">{eyebrow}</span>
            <h1>{name}</h1>
            <p className={styles.role}>{role}</p>
            <p className={styles.lead}>{intro}</p>
            <LinkedIn url={linkedin} name={name} />
          </div>
        </header>
      </div>

      {bio.length > 0 && (
        <section className={styles.bio}>
          <div className={`container ${styles.narrow}`}>
            <Reveal>
              <span className="eyebrow">Biography</span>
              <h2>About {firstName}</h2>
            </Reveal>
            <ol className={styles.chapters}>
              {bio.map((part, i) => (
                <li key={part.title}>
                  <Reveal delay={i * 80}>
                    <span className={styles.chapterNum}>{String(i + 1).padStart(2, "0")}</span>
                    <h3>{part.title}</h3>
                    <p>{part.text}</p>
                  </Reveal>
                </li>
              ))}
            </ol>
          </div>
        </section>
      )}

      {strengths.length > 0 && (
        <section className={styles.strengths}>
          <div className="container">
            <Reveal>
              <h2>Core Strengths</h2>
              <ul>
                {strengths.map((s) => (
                  <li key={s}><Icon name="check" />{s}</li>
                ))}
              </ul>
            </Reveal>
          </div>
        </section>
      )}

      {experience.length > 0 && (
        <section className={styles.experience}>
          <div className={`container ${styles.narrow}`}>
            <Reveal>
              <span className="eyebrow">Background</span>
              <h2>Experience</h2>
            </Reveal>
            {experience.map((item) => (
              <Reveal key={item.title} className={styles.job}>
                <div className={styles.jobHead}>
                  <h3>{item.title}</h3>
                  {item.meta && <span>{item.meta}</span>}
                </div>
                <p>{item.text}</p>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {technologies.length > 0 && (
        <section className={styles.tech}>
          <div className="container">
            <Reveal>
              <h2>Technologies</h2>
              <ul>
                {technologies.map((t) => <li key={t}>{t}</li>)}
              </ul>
            </Reveal>
          </div>
        </section>
      )}
    </article>
  );
}
