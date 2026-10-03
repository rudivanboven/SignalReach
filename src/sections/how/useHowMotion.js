"use client";

import { useEffect, useRef, useState } from "react";

// Shared How It Works motion helpers.

// Sets `inView` once the element scrolls into view (for staged reveals).
export function useInView(threshold = 0.2) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setInView(true);
        observer.disconnect();
      }
    }, { threshold });
    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold]);
  return [ref, inView];
}

// Cycles an active index 0..count-1 while `enabled`; `paused` holds it
// (e.g. while the user hovers a step). Skipped for reduced-motion users.
export function useAutoStep(count, { enabled, paused, interval = 3200 }) {
  const [active, setActive] = useState(0);
  useEffect(() => {
    if (!enabled || paused) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => setActive((i) => (i + 1) % count), interval);
    return () => clearInterval(id);
  }, [count, enabled, paused, interval]);
  return [active, setActive];
}
