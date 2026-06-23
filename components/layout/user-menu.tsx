"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { ThemeOptions, useTheme } from "@/components/ui/appearance";
import { cn } from "@/lib/utils";
import type { Profile } from "@/types";

const MENU_LINKS = [
  { icon: "👤", label: "My Profile", href: "/dashboard" },
  { icon: "⚙️", label: "Account Settings", href: "/settings#account" },
  { icon: "🔒", label: "Privacy Settings", href: "/settings#privacy" },
  { icon: "🔔", label: "Notification Preferences", href: "/settings#notifications" },
  { icon: "💬", label: "Help & Support", href: "/help" },
];

export function UserMenu() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [appearanceOpen, setAppearanceOpen] = useState(false);
  const [theme, setTheme] = useTheme();
  const [confirmingSignOut, setConfirmingSignOut] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) return;
      const { data: prof } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", data.user.id)
        .single();
      setProfile(prof as Profile);

      // Authorize the admin shortcut with the same security-definer RPC the
      // admin page uses, so the link shows exactly when /admin is reachable -
      // independent of whether the profiles select above succeeds (RLS/keys).
      const { data: role } = await supabase.rpc("get_my_role");
      setIsAdmin(role === "admin");
    });
  }, []);

  // Close on outside click (checks both the trigger and the portaled panel)
  // and on Escape.
  useEffect(() => {
    function onPointerDown(e: PointerEvent) {
      const t = e.target as Node;
      if (
        triggerRef.current?.contains(t) ||
        panelRef.current?.contains(t)
      )
        return;
      close();
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") close();
    }
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  function close() {
    setOpen(false);
    setConfirmingSignOut(false);
    setAppearanceOpen(false);
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
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <div className="relative">
      <button
        ref={triggerRef}
        onClick={() => (open ? close() : setOpen(true))}
        aria-label="Open account menu"
        aria-expanded={open}
        className="block cursor-pointer rounded-full ring-2 ring-transparent transition-shadow hover:ring-coral"
      >
        {profile?.avatar_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={profile.avatar_url}
            alt="Your profile"
            className="h-9 w-9 rounded-full object-cover"
          />
        ) : (
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-coral text-sm font-bold text-white">
            {initial}
          </span>
        )}
      </button>

      {/* Portaled to body so the navbar's backdrop-filter can't trap this
          fixed panel inside the nav pill (breaks the drawer on Android). */}
      {mounted &&
        open &&
        createPortal(
          <>
            <div
              className="fixed inset-0 z-[55] bg-black/40"
              onClick={close}
              aria-hidden="true"
            />
            <div
              ref={panelRef}
              className={cn(
                "fixed z-[60] flex max-h-[calc(100vh-1rem)] flex-col overflow-y-auto bg-white p-4 shadow-2xl",
                // Mobile: full-height drawer from the right
                "inset-y-0 right-0 w-80 max-w-[85vw]",
                // Desktop: compact popover under the navbar
                "sm:inset-y-auto sm:right-3 sm:top-[68px] sm:max-h-[calc(100vh-84px)] sm:w-80 sm:rounded-2xl sm:border sm:border-gray-100"
              )}
            >
              <button
                className="mb-2 ml-auto block cursor-pointer text-2xl text-charcoal sm:hidden"
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
                    {initial}
                  </span>
                )}
                <div className="min-w-0">
                  <div className="truncate font-bold text-charcoal">
                    {displayName}
                  </div>
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

                {/* Admins get a shortcut to the (otherwise unlinked) admin
                    panel; the page itself re-checks the role server-side. */}
                {isAdmin && (
                  <Link
                    href="/admin"
                    onClick={close}
                    className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-coral transition-colors hover:bg-coral/10"
                  >
                    <span className="text-base">🛡️</span>
                    Admin Panel
                  </Link>
                )}

                {/* Appearance: expands to Light / Dark */}
                <button
                  onClick={() => setAppearanceOpen((v) => !v)}
                  className="flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-charcoal transition-colors hover:bg-off-white"
                >
                  <span className="text-base">🎨</span>
                  Appearance
                  <span className="ml-auto text-xs text-charcoal/40">
                    {appearanceOpen ? "▴" : "▾"}
                  </span>
                </button>
                {appearanceOpen && (
                  <div className="ml-9">
                    <ThemeOptions theme={theme} setTheme={setTheme} />
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
          </>,
          document.body
        )}
    </div>
  );
}
