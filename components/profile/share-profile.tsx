"use client";

import { useEffect, useRef, useState } from "react";
import { toast } from "@/components/ui/toast";
import { profileCode } from "@/lib/utils";
import type { PublicProfile } from "@/types";

// Shared links always point at the live site. A localhost or preview address
// is not clickable in WhatsApp and would not open for the recipient anyway.
const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://purelifepartner.com").replace(/\/$/, "");

/**
 * Small Share button under the profile header. Clicking it opens a menu to
 * send the profile link by WhatsApp, email, copy, or the phone's share sheet.
 * Only the link is sent, never the member's name or phone numbers.
 */
export function ShareProfile({ profile }: { profile: PublicProfile }) {
  const [open, setOpen] = useState(false);
  const [canNativeShare, setCanNativeShare] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setCanNativeShare(typeof navigator !== "undefined" && !!navigator.share);
  }, []);

  useEffect(() => {
    if (!open) return;
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const url = `${SITE_URL}/profile/${profile.id}`;
  const subject = `Profile ${profileCode(profile.internal_id)} on PureLifePartner`;
  const whatsappHref = `https://wa.me/?text=${encodeURIComponent(url)}`;
  const emailHref = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(url)}`;

  async function copyLink() {
    setOpen(false);
    try {
      await navigator.clipboard.writeText(url);
      toast("Profile link copied.");
    } catch {
      toast("Could not copy the link.", "error");
    }
  }

  async function nativeShare() {
    setOpen(false);
    try {
      await navigator.share({ title: subject, url });
    } catch {
      // Closing the share sheet throws; nothing to do.
    }
  }

  const item =
    "flex w-full cursor-pointer items-center gap-3 px-4 py-2.5 text-left text-sm font-semibold text-charcoal transition-colors hover:bg-coral/10";
  const iconBox = "flex h-8 w-8 shrink-0 items-center justify-center rounded-full";

  return (
    <div ref={ref} className="relative mt-3 inline-block">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="menu"
        className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-charcoal/15 px-3 py-1 text-sm font-semibold text-charcoal/70 transition-colors hover:border-coral hover:text-coral"
      >
        <ShareIcon />
        Share
      </button>

      {open && (
        <div
          role="menu"
          className="absolute left-0 top-full z-20 mt-2 w-48 overflow-hidden rounded-xl border border-charcoal/10 bg-white py-1 shadow-xl"
        >
          <a
            role="menuitem"
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setOpen(false)}
            className={item}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/whatsapp-icon.png" alt="" className="h-8 w-8 rounded-full" />
            WhatsApp
          </a>
          <a role="menuitem" href={emailHref} onClick={() => setOpen(false)} className={item}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/gmail-icon.png" alt="" className="h-8 w-8 rounded-full" />
            Email
          </a>
          <button role="menuitem" type="button" onClick={copyLink} className={item}>
            <span className={`${iconBox} bg-coral/15 text-coral`}>
              <LinkIcon />
            </span>
            Copy link
          </button>
          {canNativeShare && (
            <button role="menuitem" type="button" onClick={nativeShare} className={item}>
              <span className={`${iconBox} bg-coral/15 text-coral`}>
                <ShareIcon />
              </span>
              More options
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function ShareIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <path d="M8.6 13.5l6.8 4M15.4 6.5l-6.8 4" />
    </svg>
  );
}

function LinkIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7" />
      <path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7" />
    </svg>
  );
}
