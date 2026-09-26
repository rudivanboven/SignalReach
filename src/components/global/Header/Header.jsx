"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import LogoMark from "../LogoMark/LogoMark";
import styles from "./Header.module.css";

const disabledLinks = ["How It Works", "Services", "About"];

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    let frame;
    const update = () => {
      frame = 0;
      setScrolled(window.scrollY > 24);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ""}`}>
      <div className={`container ${styles.inner}`}>
        <LogoMark className={styles.headerLogo} />
        <button
          className={styles.menuButton}
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
        >
          <span />
          <span />
        </button>
        <nav className={`${styles.nav} ${open ? styles.navOpen : ""}`}>
          <Link
            href="/"
            className={pathname === "/" ? styles.active : ""}
            onClick={() => setOpen(false)}
          >
            Home
          </Link>
          {disabledLinks.map((label) => (
            <span key={label} className={styles.disabledLink} aria-disabled="true">
              {label}
            </span>
          ))}
          <span className={`${styles.mobileCta} ${styles.disabledCta}`} aria-disabled="true">
            Get Your Free QA Report
          </span>
        </nav>
        <span className={`btnPrimary ${styles.desktopCta} ${styles.disabledCta}`} aria-disabled="true">
          Get Your Free QA Report
          <span aria-hidden="true">↗</span>
        </span>
      </div>
    </header>
  );
}
