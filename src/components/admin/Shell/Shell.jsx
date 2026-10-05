import Sidebar from "./Sidebar";
import styles from "./Shell.module.css";

export default function Shell({ email, children }) {
  return (
    <div className={styles.shell}>
      <Sidebar email={email} />
      <div className={styles.main}>
        <div className={styles.content}>{children}</div>
      </div>
    </div>
  );
}
