"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";

/**
 * Site-wide GSAP ScrollSmoother. Everything that scrolls lives inside
 * #smooth-content; fixed UI (navbar, WhatsApp button, toasts) stays outside
 * the wrapper because ScrollSmoother transforms the content.
 * effects: true activates data-speed / data-lag parallax attributes.
 */
export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const smootherRef = useRef<ScrollSmoother | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

    const smoother = ScrollSmoother.create({
      wrapper: "#smooth-wrapper",
      content: "#smooth-content",
      smooth: 1.2,
      effects: true,
      normalizeScroll: true,
      ignoreMobileResize: true,
    });
    smootherRef.current = smoother;

    return () => {
      smoother.kill();
      smootherRef.current = null;
    };
  }, []);

  // After each route change: re-parse parallax attributes on the new page,
  // recalculate trigger positions, and land on the top (or the hash target).
  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      const smoother = smootherRef.current;
      if (!smoother) return;
      smoother.effects("[data-speed], [data-lag]");
      ScrollTrigger.refresh();
      const el = window.location.hash
        ? document.querySelector(window.location.hash)
        : null;
      if (el) smoother.scrollTo(el, false, "top 96px");
      else smoother.scrollTo(0, false);
    });
    return () => cancelAnimationFrame(raf);
  }, [pathname]);

  // Same-page anchor jumps (e.g. /#how-it-works clicked while on /) need to
  // be routed through the smoother since the body no longer scrolls natively.
  useEffect(() => {
    function onHashChange() {
      const smoother = smootherRef.current;
      const el = window.location.hash
        ? document.querySelector(window.location.hash)
        : null;
      if (smoother && el) smoother.scrollTo(el, true, "top 96px");
    }
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  return (
    <div id="smooth-wrapper">
      <div id="smooth-content" className="pt-20">
        {children}
      </div>
    </div>
  );
}
