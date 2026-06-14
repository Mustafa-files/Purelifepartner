"use client";

import { useEffect, useState } from "react";

/**
 * Best-effort screenshot blocker for sensitive parts of a profile.
 * Browsers can't truly block the OS screenshot key, but we can:
 *  - Listen for visibility/focus loss (most screenshot tools steal focus)
 *  - Intercept PrintScreen and Ctrl/Cmd+Shift screen-capture shortcuts
 *  - Disable right-click, drag, and long-press save on protected images
 * When triggered we hide the wrapped content behind an opaque shield so
 * any capture in flight grabs the shield instead.
 */
export function ScreenshotGuard({ children }: { children: React.ReactNode }) {
  const [shielded, setShielded] = useState(false);

  useEffect(() => {
    let revealTimer: ReturnType<typeof setTimeout> | null = null;

    function trip(durationMs = 1200) {
      setShielded(true);
      if (revealTimer) clearTimeout(revealTimer);
      revealTimer = setTimeout(() => setShielded(false), durationMs);
    }

    function onVisibility() {
      if (document.visibilityState === "hidden") trip();
    }
    function onBlur() {
      trip();
    }
    function onKey(e: KeyboardEvent) {
      // PrintScreen on Windows; Cmd+Shift+3/4/5 on macOS; Ctrl+Shift+S
      const k = e.key;
      const cmd = e.ctrlKey || e.metaKey;
      if (
        k === "PrintScreen" ||
        (cmd && e.shiftKey && ["3", "4", "5", "S", "s"].includes(k))
      ) {
        e.preventDefault();
        // PrintScreen fires on KEYUP but capture may already have happened;
        // shield for longer so any held capture grabs nothing useful.
        trip(2500);
      }
    }
    function onContext(e: Event) {
      const t = e.target as HTMLElement;
      if (t.closest("[data-no-screenshot]")) e.preventDefault();
    }
    function onDragStart(e: DragEvent) {
      const t = e.target as HTMLElement;
      if (t.closest("[data-no-screenshot]")) e.preventDefault();
    }

    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("blur", onBlur);
    window.addEventListener("keydown", onKey);
    document.addEventListener("contextmenu", onContext);
    document.addEventListener("dragstart", onDragStart);

    return () => {
      if (revealTimer) clearTimeout(revealTimer);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("blur", onBlur);
      window.removeEventListener("keydown", onKey);
      document.removeEventListener("contextmenu", onContext);
      document.removeEventListener("dragstart", onDragStart);
    };
  }, []);

  return (
    <div data-no-screenshot className="relative">
      <div
        style={{
          // Hint to browsers (still ignored by OS-level capture, but suppresses
          // some in-browser tab-capture utilities)
          WebkitUserSelect: "none",
          userSelect: "none",
          WebkitTouchCallout: "none",
        }}
      >
        {children}
      </div>

      {shielded && (
        <div
          aria-hidden="true"
          className="absolute inset-0 z-50 flex flex-col items-center justify-center rounded-2xl bg-charcoal/95 p-6 text-center text-white"
        >
          <div className="text-4xl">🛡️</div>
          <p className="mt-3 text-lg font-bold">Screenshot blocked</p>
          <p className="mt-1 text-sm text-white/70">
            For privacy, photos and contact details are hidden when capture is
            detected.
          </p>
        </div>
      )}
    </div>
  );
}
