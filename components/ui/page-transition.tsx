"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

type Phase = "idle" | "cover" | "covered" | "reveal";

const RISE_MS = 450;
/** Give up waiting for a page that never arrives */
const MAX_WAIT_MS = 8000;

/**
 * Arch reveal between pages: a pink arch (the shape behind the site's
 * illustrations) rises to fill the screen while the next page loads, then
 * carries on up and away to show it.
 *
 * It listens for clicks on same-site links that change the page. Links
 * inside the same page (#sections, ?query only), new tabs, downloads and
 * clicks on buttons inside a link (like the shortlist heart) are left alone.
 */
export function PageTransition() {
  const router = useRouter();
  const pathname = usePathname();
  const [phase, setPhase] = useState<Phase>("idle");
  const [slow, setSlow] = useState(false);
  const phaseRef = useRef<Phase>("idle");
  const arrived = useRef(false);
  const timers = useRef<number[]>([]);

  const set = (p: Phase) => {
    phaseRef.current = p;
    setPhase(p);
  };
  const later = (fn: () => void, ms: number) => {
    timers.current.push(window.setTimeout(fn, ms));
  };
  const clearTimers = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };

  function reveal() {
    clearTimers();
    set("reveal");
    setSlow(false);
    later(() => set("idle"), RISE_MS + 50);
  }

  // Start the arch on internal link clicks
  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (e.defaultPrevented || e.button !== 0) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const target = e.target as Element | null;
      const link = target?.closest("a");
      if (!link || !link.href) return;
      // A button inside the link (shortlist heart) does its own thing
      const button = target?.closest("button");
      if (button && link.contains(button)) return;
      if (link.target && link.target !== "_self") return;
      if (link.hasAttribute("download") || link.dataset.noTransition !== undefined) return;

      const url = new URL(link.href, window.location.href);
      if (url.origin !== window.location.origin) return;
      // Same page (only a #section or ?query changes): no curtain
      if (url.pathname === window.location.pathname) return;
      if (phaseRef.current !== "idle") {
        e.preventDefault();
        return;
      }

      e.preventDefault();
      arrived.current = false;
      clearTimers();
      set("cover");
      router.push(url.pathname + url.search + url.hash);
      later(() => {
        if (arrived.current) reveal();
        else {
          set("covered");
          later(() => setSlow(true), 500);
        }
      }, RISE_MS);
      later(reveal, MAX_WAIT_MS);
    }
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  // New page is in: lift the arch once it has finished covering
  useEffect(() => {
    if (phaseRef.current === "cover") arrived.current = true;
    else if (phaseRef.current === "covered") reveal();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  useEffect(() => clearTimers, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[95] overflow-hidden"
      style={{ visibility: phase === "idle" ? "hidden" : "visible" }}
    >
      <div
        className="plp-arch absolute bottom-0 left-1/2 flex items-start justify-center"
        data-phase={phase}
      >
        {/* Only shows if the next page is slow to arrive */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/logo.png"
          alt=""
          className="plp-arch-logo h-14 w-auto"
          style={{ opacity: slow ? 1 : 0 }}
        />
      </div>
    </div>
  );
}
