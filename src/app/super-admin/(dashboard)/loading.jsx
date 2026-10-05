import styles from "./loading.module.css";

export default function DashboardLoading() {
  return (
    <div className={styles.wrap} aria-busy="true" aria-label="Loading">
      <div className={styles.head}>
        <span className={`${styles.bar} ${styles.title}`} />
        <span className={`${styles.bar} ${styles.sub}`} />
      </div>
      <div className={styles.cards}>
        {Array.from({ length: 5 }, (_, i) => <span key={i} className={styles.card} />)}
      </div>
      <div className={styles.list}>
        {Array.from({ length: 4 }, (_, i) => <span key={i} className={styles.row} />)}
      </div>
    </div>
  );
}
