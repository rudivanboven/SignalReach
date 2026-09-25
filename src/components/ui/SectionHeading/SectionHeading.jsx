import styles from "./SectionHeading.module.css";

export default function SectionHeading({ eyebrow, title, text, align = "left" }) {
  return (
    <div className={`${styles.wrap} ${align === "center" ? styles.center : ""}`}>
      {eyebrow && <span className="eyebrow">{eyebrow}</span>}
      <h2>{title}</h2>
      {text && <p>{text}</p>}
    </div>
  );
}
