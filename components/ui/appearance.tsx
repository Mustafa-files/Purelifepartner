"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";

export type Theme = "light" | "dark";

/** Shared light/dark theme state, backed by the `dark` class + localStorage. */
export function useTheme(): [Theme, (mode: Theme) => void] {
  const [theme, setThemeState] = useState<Theme>("light");

  useEffect(() => {
    setThemeState(
      document.documentElement.classList.contains("dark") ? "dark" : "light"
    );
  }, []);

  function setTheme(mode: Theme) {
    setThemeState(mode);
    document.documentElement.classList.toggle("dark", mode === "dark");
    try {
      localStorage.setItem("plp-theme", mode);
    } catch {
      // storage unavailable; theme still applies for this visit
    }
  }

  return [theme, setTheme];
}

/** The two-option Light / Dark control reused in menus. */
export function ThemeOptions({
  theme,
  setTheme,
}: {
  theme: Theme;
  setTheme: (m: Theme) => void;
}) {
  return (
    <div className="space-y-0.5">
      {(["light", "dark"] as Theme[]).map((mode) => (
        <button
          key={mode}
          onClick={() => setTheme(mode)}
          className={cn(
            "flex w-full cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-off-white",
            theme === mode
              ? "font-bold text-coral"
              : "font-semibold text-charcoal/70"
          )}
        >
          {mode === "light" ? "☀️ Light Theme" : "🌙 Dark Theme"}
          {theme === mode && <span className="ml-auto">✓</span>}
        </button>
      ))}
    </div>
  );
}

/**
 * Standalone Appearance control for visitors (not signed in). Renders an
 * icon button that opens a small Light/Dark popover. Portaled to body so a
 * backdrop-filter ancestor can't trap the fixed popover (Android bug).
 */
export function AppearanceToggle() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useTheme();
  const [coords, setCoords] = useState({ top: 0, right: 0 });
  const btnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => setMounted(true), []);

  function toggle() {
    if (!open && btnRef.current) {
      const r = btnRef.current.getBoundingClientRect();
      setCoords({ top: r.bottom + 8, right: window.innerWidth - r.right });
    }
    setOpen((v) => !v);
  }

  return (
    <>
      <button
        ref={btnRef}
        onClick={toggle}
        aria-label="Appearance"
        title="Appearance"
        className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-charcoal/75 transition-colors hover:bg-coral/10 hover:text-charcoal"
      >
        {theme === "dark" ? (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
            <circle cx="12" cy="12" r="4" />
            <path strokeLinecap="round" d="M12 2v2m0 16v2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 12.8A8.5 8.5 0 1 1 11.2 3a6.6 6.6 0 0 0 9.8 9.8z" />
          </svg>
        )}
      </button>

      {mounted &&
        open &&
        createPortal(
          <>
            <div
              className="fixed inset-0 z-[55]"
              onClick={() => setOpen(false)}
            />
            <div
              className="fixed z-[60] w-44 rounded-2xl border border-gray-100 bg-white p-2 shadow-2xl"
              style={{ top: coords.top, right: coords.right }}
            >
              <p className="px-3 pb-1 pt-1 text-xs font-bold uppercase tracking-wide text-charcoal/40">
                Appearance
              </p>
              <ThemeOptions
                theme={theme}
                setTheme={(m) => {
                  setTheme(m);
                }}
              />
            </div>
          </>,
          document.body
        )}
    </>
  );
}
