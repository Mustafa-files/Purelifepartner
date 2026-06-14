"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { SplitText } from "gsap/SplitText";

/**
 * GSAP ScrollTrigger reveals for the landing page.
 * Desktop gets the full treatment (slides, zooms, SplitText lag on the
 * smoother). Phones get a lighter, Android-safe variant: native scrolling,
 * y-only fades, `once: true`, and ignoreMobileResize so Chrome's address
 * bar showing/hiding cannot break trigger positions mid-scroll.
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
    ScrollTrigger.config({ ignoreMobileResize: true });

    const mm = gsap.matchMedia();

    // Phones and small tablets: simple, reliable reveals on native scroll
    mm.add(
      "(max-width: 1023px) and (prefers-reduced-motion: no-preference)",
      () => {
        gsap.from(".gsap-hero", {
          opacity: 0,
          y: 24,
          duration: 0.6,
          ease: "power2.out",
          stagger: 0.1,
        });

        gsap.utils
          .toArray<HTMLElement>(
            ".gsap-fade-up, .gsap-slide-left, .gsap-slide-right"
          )
          .forEach((el) => {
            gsap.from(el, {
              opacity: 0,
              y: 28,
              duration: 0.55,
              ease: "power2.out",
              scrollTrigger: { trigger: el, start: "top 92%", once: true },
            });
          });

        gsap.utils.toArray<HTMLElement>(".gsap-zoom").forEach((el, i) => {
          gsap.from(el, {
            opacity: 0,
            scale: 0.75,
            duration: 0.5,
            ease: "back.out(1.4)",
            delay: (i % 4) * 0.06,
            scrollTrigger: { trigger: el, start: "top 94%", once: true },
          });
        });

        // Mobile parallax for the "Pure Hearts" echo: each ghost layer
        // shifts at its own speed as the section scrolls past, faked with
        // a scrub'd ScrollTrigger (no ScrollSmoother on phones).
        const echo = document.querySelector(".plp-echo");
        if (echo) {
          gsap.utils
            .toArray<HTMLElement>(".plp-echo-ghost")
            .forEach((ghost) => {
              const speed = parseFloat(ghost.dataset.speed ?? "1");
              const drift = (1 - speed) * 220; // 0.7 -> 66px shift
              gsap.fromTo(
                ghost,
                { y: -drift },
                {
                  y: drift,
                  ease: "none",
                  scrollTrigger: {
                    trigger: echo,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: 0.4,
                  },
                }
              );
            });
        }

        // Mobile "together forever": split into characters and let them
        // ripple in with a stagger on first scroll into view.
        const splitTarget = document.getElementById("split-stagger");
        let mSplit: SplitText | null = null;
        if (splitTarget) {
          mSplit = new SplitText(splitTarget, { type: "chars" });
          gsap.from(mSplit.chars, {
            opacity: 0,
            y: 24,
            rotate: -8,
            stagger: 0.04,
            duration: 0.5,
            ease: "back.out(1.6)",
            scrollTrigger: {
              trigger: splitTarget,
              start: "top 88%",
              once: true,
            },
          });
        }

        return () => {
          mSplit?.revert();
        };
      }
    );

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
