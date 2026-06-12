"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { cn } from "@/lib/utils";
import type { Profile } from "@/types";

type Theme = "light" | "dark";

const MENU_LINKS = [
  { icon: "👤", label: "My Profile", href: "/dashboard" },
  { icon: "⚙️", label: "Account Settings", href: "/settings#account" },
  { icon: "🔒", label: "Privacy Settings", href: "/settings#privacy" },
  { icon: "🔔", label: "Notification Preferences", href: "/settings#notifications" },
  { icon: "💬", label: "Help & Support", href: "/help" },
];

export function UserMenu() {
  const [open, setOpen] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [appearanceOpen, setAppearanceOpen] = useState(false);
  const [theme, setThemeState] = useState<Theme>("light");
  const [confirmingSignOut, setConfirmingSignOut] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) return;
      const { data: prof } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", data.user.id)
        .single();
      setProfile(prof as Profile);
    });
    setThemeState(
      document.documentElement.classList.contains("dark") ? "dark" : "light"
    );
  }, []);

  // Close on outside click and Escape
  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) close();
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") close();
    }
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  function close() {
    setOpen(false);
    setConfirmingSignOut(false);
    setAppearanceOpen(false);
  }

  function setTheme(mode: Theme) {
    setThemeState(mode);
    document.documentElement.classList.toggle("dark", mode === "dark");
    try {
      localStorage.setItem("plp-theme", mode);
    } catch {
      // storage unavailable; theme still applies for this visit
    }
  }

  async function signOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    close();
    router.push("/login");
    router.refresh();
  }

  const displayName =
    profile?.name_private || profile?.user_id_handle || "Member";

  const avatar = profile?.avatar_url ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={profile.avatar_url}
      alt="Your profile"
      className="h-9 w-9 rounded-full object-cover"
    />
  ) : (
    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-coral text-sm font-bold text-white">
      {displayName.charAt(0).toUpperCase()}
    </span>
  );

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => (open ? close() : setOpen(true))}
        aria-label="Open account menu"
        aria-expanded={open}
        className="cursor-pointer rounded-full ring-2 ring-transparent transition-shadow hover:ring-coral"
      >
        {avatar}
      </button>

      {/* Mobile backdrop */}
      {open && (
        <div className="fixed inset-0 z-40 bg-black/40 lg:hidden" onClick={close} />
      )}

      {/* Panel: slide-out drawer on mobile, popover on desktop */}
      <div
        className={cn(
          "fixed inset-y-0 right-0 z-50 w-80 max-w-[85vw] transform overflow-y-auto bg-white p-4 shadow-2xl transition-transform duration-300",
          open ? "translate-x-0" : "translate-x-full",
          "lg:absolute lg:inset-y-auto lg:right-0 lg:top-full lg:mt-3 lg:w-80 lg:transform-none lg:rounded-2xl lg:border lg:border-gray-100 lg:transition-none",
          !open && "lg:hidden"
        )}
      >
        <button
          className="mb-2 ml-auto block cursor-pointer text-2xl text-charcoal lg:hidden"
          onClick={close}
          aria-label="Close menu"
        >
          ×
        </button>

        {/* User header */}
        <div className="flex items-center gap-3 border-b border-gray-100 px-2 pb-4">
          {profile?.avatar_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={profile.avatar_url}
              alt=""
              className="h-12 w-12 rounded-full object-cover"
            />
          ) : (
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-coral text-lg font-bold text-white">
              {displayName.charAt(0).toUpperCase()}
            </span>
          )}
          <div className="min-w-0">
            <div className="truncate font-bold text-charcoal">{displayName}</div>
            <div className="truncate text-xs text-charcoal/50">
              {profile?.email}
            </div>
          </div>
        </div>

        <nav className="mt-2 space-y-0.5">
          {MENU_LINKS.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              onClick={close}
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-charcoal transition-colors hover:bg-off-white"
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
            </Link>
          ))}

          {/* Appearance: expands to Light / Dark */}
          <button
            onClick={() => setAppearanceOpen(!appearanceOpen)}
            className="flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-charcoal transition-colors hover:bg-off-white"
          >
            <span className="text-base">🎨</span>
            Appearance
            <span className="ml-auto text-xs text-charcoal/40">
              {appearanceOpen ? "▴" : "▾"}
            </span>
          </button>
          {appearanceOpen && (
            <div className="ml-9 space-y-0.5">
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
          )}

          <div className="!my-2 border-t border-gray-100" />

          {/* Sign out with inline confirmation */}
          {confirmingSignOut ? (
            <div className="rounded-xl bg-off-white p-3">
              <p className="text-sm font-semibold text-charcoal">
                Sign out of PureLifePartner?
              </p>
              <div className="mt-3 flex gap-2">
                <button
                  onClick={signOut}
                  className="flex-1 cursor-pointer rounded-full bg-red-500 py-1.5 text-sm font-bold text-white transition-colors hover:bg-red-600"
                >
                  Sign Out
                </button>
                <button
                  onClick={() => setConfirmingSignOut(false)}
                  className="flex-1 cursor-pointer rounded-full border border-gray-300 py-1.5 text-sm font-bold text-charcoal transition-colors hover:bg-off-white"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setConfirmingSignOut(true)}
              className="flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-red-500 transition-colors hover:bg-red-50"
            >
              <span className="text-base">🚪</span>
              Sign Out
            </button>
          )}
        </nav>
      </div>
    </div>
  );
}
