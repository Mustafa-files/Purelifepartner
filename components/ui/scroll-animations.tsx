"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { SplitText } from "gsap/SplitText";

/**
 * GSAP ScrollTrigger reveals for the landing page, desktop only.
 * On phones every section renders instantly: hiding content behind
 * scroll-triggered reveals proved unreliable on Android (sections appeared
 * late or not at all), and instant content is faster anyway.
 *
 * Tag elements with:
 *   .gsap-hero        entrance stagger on load (no scroll needed)
 *   .gsap-fade-up     fades and rises in when scrolled into view
 *   .gsap-slide-left  slides in from the left
 *   .gsap-slide-right slides in from the right
 *   .gsap-zoom        scales up into place (stat numbers)
 *   #split-stagger    SplitText chars trail the scroll with increasing lag
 */
export function ScrollAnimations() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger, ScrollSmoother, SplitText);

    const mm = gsap.matchMedia();

    mm.add(
      "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
      () => {
        gsap.from(".gsap-hero", {
          opacity: 0,
          y: 36,
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.14,
        });

        gsap.utils.toArray<HTMLElement>(".gsap-fade-up").forEach((el, i) => {
          gsap.from(el, {
            opacity: 0,
            y: 32,
            duration: 0.85,
            ease: "back.out(1.2)",
            delay: (i % 3) * 0.08,
            scrollTrigger: { trigger: el, start: "top 88%" },
          });
        });

        gsap.utils.toArray<HTMLElement>(".gsap-slide-left").forEach((el) => {
          gsap.from(el, {
            opacity: 0,
            x: -56,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 85%" },
          });
        });

        gsap.utils.toArray<HTMLElement>(".gsap-slide-right").forEach((el) => {
          gsap.from(el, {
            opacity: 0,
            x: 56,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 85%" },
          });
        });

        gsap.utils.toArray<HTMLElement>(".gsap-zoom").forEach((el, i) => {
          gsap.from(el, {
            opacity: 0,
            scale: 0.6,
            duration: 0.6,
            ease: "back.out(1.7)",
            delay: (i % 4) * 0.1,
            scrollTrigger: { trigger: el, start: "top 90%" },
          });
        });

        // SplitText + ScrollSmoother lag: each character loosens its
        // connection to the scroll a little more than the last. Runs a frame
        // later so the smoother (created in a parent effect) exists.
        let split: SplitText | null = null;
        const charEffects: ScrollTrigger[] = [];
        const raf = requestAnimationFrame(() => {
          const smoother = ScrollSmoother.get();
          const target = document.getElementById("split-stagger");
          if (!smoother || !target) return;
          split = new SplitText(target, { type: "words,chars" });
          split.chars.forEach((char, i) => {
            charEffects.push(
              ...smoother.effects(char, { speed: 1, lag: (i + 1) * 0.06 })
            );
          });
        });

        return () => {
          cancelAnimationFrame(raf);
          charEffects.forEach((t) => t.kill());
          split?.revert();
        };
      }
    );

    return () => mm.revert();
  }, []);

  return null;
}
