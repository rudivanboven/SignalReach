"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import LogoMark from "../LogoMark/LogoMark";
import styles from "./Header.module.css";

const links = [
  ["/", "Home"],
  ["/about", "About"],
  ["/services", "Services"],
  ["/team", "Team"],
  ["/how-it-works", "How It Works"],
];

// Routes whose hero is dark, so the header starts transparent over it.
const overlayRoutes = ["/", "/how-it-works", "/services", "/about", "/team", "/free-report"];

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
    <header className={`${styles.header} ${overlayRoutes.includes(pathname) ? styles.homeHeader : ""} ${scrolled ? styles.scrolled : ""}`}>
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
          {links.map(([href, label]) => (
            <Link
              key={href}
              href={href}
              className={pathname === href ? styles.active : ""}
              aria-current={pathname === href ? "page" : undefined}
              onClick={() => setOpen(false)}
            >
              {label}
            </Link>
          ))}
          <Link className={styles.mobileCta} href="/free-report" aria-current={pathname === "/free-report" ? "page" : undefined} onClick={() => setOpen(false)}>
            Get Your Free QA Report
          </Link>
        </nav>
        <Link className={`btnPrimary ${styles.desktopCta}`} href="/free-report" aria-current={pathname === "/free-report" ? "page" : undefined}>
          Get Your Free QA Report
          <span aria-hidden="true">↗</span>
        </Link>
      </div>
    </header>
  );
}
