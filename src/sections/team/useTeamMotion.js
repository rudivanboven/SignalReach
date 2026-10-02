"use client";

import { useEffect, useRef, useState } from "react";

// Shared Team-page motion helpers.

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

// Pointer handlers for a container of [data-tilt] cards: each card gets
// --rx/--ry (tilt) and --gx/--gy (glare position). Fine pointers only.
export function tiltHandlers(max = 8) {
  const fine = () => typeof window !== "undefined" && window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  return {
    onPointerMove(e) {
      const card = e.target.closest("[data-tilt]");
      if (!card || !fine()) return;
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width;
      const y = (e.clientY - r.top) / r.height;
      card.style.setProperty("--rx", `${((0.5 - y) * max).toFixed(2)}deg`);
      card.style.setProperty("--ry", `${((x - 0.5) * max).toFixed(2)}deg`);
      card.style.setProperty("--gx", `${(x * 100).toFixed(1)}%`);
      card.style.setProperty("--gy", `${(y * 100).toFixed(1)}%`);
    },
    onPointerOut(e) {
      const card = e.target.closest("[data-tilt]");
      if (!card || card.contains(e.relatedTarget)) return;
      card.style.setProperty("--rx", "0deg");
      card.style.setProperty("--ry", "0deg");
    },
  };
}
