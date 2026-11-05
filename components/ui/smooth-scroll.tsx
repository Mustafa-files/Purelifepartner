"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";

/** Space left above a section so it lands below the fixed navbar */
const NAV_OFFSET = 96;

/**
 * Glide to a section on the current page ("#about"), or to the top when
 * hash is null. Uses the desktop smoother when it exists, native smooth
 * scrolling otherwise.
 */
export function scrollToSection(hash: string | null) {
  const el = hash ? document.querySelector(hash) : null;
  if (hash && !el) return;
  const smoother = ScrollSmoother.get();
  if (smoother) {
    if (el) smoother.scrollTo(el, true, `top ${NAV_OFFSET}px`);
    else smoother.scrollTo(0, true);
    return;
  }
  const top = el ? el.getBoundingClientRect().top + window.scrollY - NAV_OFFSET : 0;
  window.scrollTo({ top, behavior: "smooth" });
}

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
        smoother.scrollTo(0, false);
      }
      // Arriving from another page with a section in the link: start at the
      // top, then glide down to it
      if (el) scrollToSection(window.location.hash);
    });
    return () => cancelAnimationFrame(raf);
  }, [pathname]);

  // Same-page anchor jumps (e.g. /#how-it-works clicked while on /).
  useEffect(() => {
    function onHashChange() {
      if (window.location.hash) scrollToSection(window.location.hash);
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
