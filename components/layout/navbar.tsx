"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/ui/logo";
import { Button } from "@/components/ui/button";
import { UserMenu } from "@/components/layout/user-menu";
import { createClient } from "@/lib/supabase";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/#how-it-works", label: "How It Works" },
  { href: "/success-stories", label: "Success Stories" },
  { href: "/#pricing", label: "Pricing" },
  { href: "/#about", label: "About" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [signedIn, setSignedIn] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => setSignedIn(!!data.user));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) =>
      setSignedIn(!!session?.user)
    );
    return () => sub.subscription.unsubscribe();
  }, [pathname]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 flex justify-center px-3 pt-3">
      <nav className="flex h-14 w-full max-w-6xl items-center justify-between rounded-full bg-white/85 px-4 shadow-[0_12px_40px_-18px_rgba(26,21,22,0.35)] ring-1 ring-black/5 backdrop-blur-xl sm:px-5">
        <Link href="/" aria-label="PureLifePartner home">
          <Logo />
        </Link>

        <div className="hidden items-center gap-7 lg:flex">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.label}
              href={l.href}
              className="rounded-full px-3.5 py-2 text-sm font-semibold text-charcoal/75 transition-colors hover:bg-coral/10 hover:text-charcoal"
            >
              {l.label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-2 lg:flex">
          {signedIn ? (
            <UserMenu />
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Sign In
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm">Get Started</Button>
              </Link>
            </>
          )}
        </div>

        <div className="flex items-center gap-3 lg:hidden">
          {signedIn && <UserMenu />}
          <button
            className="flex h-10 w-10 cursor-pointer flex-col items-center justify-center gap-1.5"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            <span className={cn("h-0.5 w-6 bg-charcoal transition-transform", open && "translate-y-2 rotate-45")} />
            <span className={cn("h-0.5 w-6 bg-charcoal transition-opacity", open && "opacity-0")} />
            <span className={cn("h-0.5 w-6 bg-charcoal transition-transform", open && "-translate-y-2 -rotate-45")} />
          </button>
        </div>
      </nav>

      {/* Mobile drawer: site navigation (account actions live in the avatar menu) */}
      <div
        className={cn(
          "fixed inset-y-0 right-0 z-50 w-72 transform bg-white p-6 shadow-2xl transition-transform duration-300 lg:hidden",
          open ? "translate-x-0" : "translate-x-full"
        )}
      >
        <button
          className="mb-6 ml-auto block cursor-pointer text-2xl text-charcoal"
          onClick={() => setOpen(false)}
          aria-label="Close menu"
        >
          ×
        </button>
        <div className="flex flex-col gap-5">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.label}
              href={l.href}
              onClick={() => setOpen(false)}
              className="text-lg font-semibold text-charcoal hover:text-coral"
            >
              {l.label}
            </Link>
          ))}
          {!signedIn && (
            <>
              <hr className="border-gray-100" />
              <Link href="/login" onClick={() => setOpen(false)}>
                <Button variant="outline" className="w-full">
                  Sign In
                </Button>
              </Link>
              <Link href="/register" onClick={() => setOpen(false)}>
                <Button className="w-full">Get Started</Button>
              </Link>
            </>
          )}
        </div>
      </div>
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}
    </header>
  );
}
