"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";

/**
 * Site-wide GSAP ScrollSmoother, desktop only. Phones and tablets keep
 * fast native scrolling: smoothing/normalizing touch input causes janky,
 * late-loading content on Android, so the smoother is never created there.
 * Fixed UI (navbar, WhatsApp button, toasts) stays outside the wrapper
 * because ScrollSmoother transforms the content.
 * effects: true activates data-speed / data-lag parallax attributes.
 */
export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const smootherRef = useRef<ScrollSmoother | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // Desktop-class pointer + viewport only
    const desktop = window.matchMedia(
      "(hover: hover) and (pointer: fine) and (min-width: 1024px)"
    ).matches;
    if (!desktop) return;

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
      const el = window.location.hash
        ? document.querySelector(window.location.hash)
        : null;
      const smoother = smootherRef.current;
      if (smoother) {
        smoother.effects("[data-speed], [data-lag]");
        ScrollTrigger.refresh();
        if (el) smoother.scrollTo(el, false, "top 96px");
        else smoother.scrollTo(0, false);
      } else if (el) {
        // Native scrolling (mobile): align under the fixed navbar
        el.scrollIntoView();
        window.scrollBy(0, -96);
      }
    });
    return () => cancelAnimationFrame(raf);
  }, [pathname]);

  // Same-page anchor jumps (e.g. /#how-it-works clicked while on /).
  useEffect(() => {
    function onHashChange() {
      const el = window.location.hash
        ? document.querySelector(window.location.hash)
        : null;
      if (!el) return;
      const smoother = smootherRef.current;
      if (smoother) smoother.scrollTo(el, true, "top 96px");
      else {
        el.scrollIntoView({ behavior: "smooth" });
      }
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
