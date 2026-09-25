"use client";

import { useEffect, useRef, useState } from "react";

const format = (value, pad) => String(value).padStart(pad, "0");

export default function CountUp({ end, start = 0, suffix = "", prefix = "", pad = 0, duration = 1200, delay = 0 }) {
  const [value, setValue] = useState(start);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    let frame = 0;
    let timer = 0;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setValue(end);
      return;
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting || started.current) return;
      started.current = true;
      observer.disconnect();
      timer = window.setTimeout(() => {
        const t0 = performance.now();
        const tick = (now) => {
          const progress = Math.min((now - t0) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          setValue(Math.round(start + (end - start) * eased));
          if (progress < 1) frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
      }, delay);
    }, { threshold: 0.4 });

    observer.observe(node);
    return () => {
      observer.disconnect();
      window.clearTimeout(timer);
      cancelAnimationFrame(frame);
    };
  }, [end, start, duration, delay]);

  return <span ref={ref}>{prefix}{format(value, pad)}{suffix}</span>;
}
