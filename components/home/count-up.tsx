"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Shows a stat like "10,000+" that counts up from 0 the first time it
 * scrolls into view. The final value is rendered on the server, so the
 * number is right even before scripts load or with reduced motion.
 */
export function CountUp({ value, duration = 1400 }: { value: string; duration?: number }) {
  const match = value.match(/^([^\d]*)([\d,]+)(.*)$/);
  const target = match ? Number(match[2].replace(/,/g, "")) : NaN;
  const [shown, setShown] = useState(value);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !match || Number.isNaN(target)) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const [, before, , after] = match;
    const format = (n: number) => `${before}${n.toLocaleString("en-US")}${after}`;
    let frame = 0;

    // Already on screen when the page loads: leave the final value
    if (el.getBoundingClientRect().top < window.innerHeight) return;
    setShown(format(0));

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        const start = performance.now();
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / duration);
          const eased = 1 - Math.pow(1 - t, 3);
          setShown(format(Math.round(target * eased)));
          if (t < 1) frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
      },
      { threshold: 0.4 }
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
    // value is static per instance
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <span ref={ref} className="tabular-nums">
      {shown}
    </span>
  );
}
