"use client";

import { useEffect, useRef, useState } from "react";
import {
  CONTACT_EMAIL,
  GMAIL_COMPOSE_LINK,
  WHATSAPP_LINK,
  WHATSAPP_NUMBER,
} from "@/lib/utils";

/**
 * "Contact Us" entry in the footer. Clicking it reveals two choices,
 * WhatsApp and Email, each opening in a new tab (wa.me / Gmail compose).
 */
export function ContactUsMenu() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="cursor-pointer text-sm text-charcoal/60 transition-colors hover:text-coral"
      >
        Contact Us {open ? "▴" : "▾"}
      </button>

      {open && (
        <div className="absolute bottom-full left-0 z-20 mb-2 w-64 overflow-hidden rounded-xl border border-gray-700 bg-ink shadow-2xl">
          <a
            href={WHATSAPP_LINK}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-black"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/whatsapp-icon.png"
              alt=""
              className="h-9 w-9 shrink-0 rounded-full"
            />
            <span>
              <span className="block text-sm font-bold text-white">WhatsApp</span>
              <span className="block text-xs text-gray-400">{WHATSAPP_NUMBER}</span>
            </span>
          </a>
          <a
            href={GMAIL_COMPOSE_LINK}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 border-t border-gray-700 px-4 py-3 transition-colors hover:bg-black"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/gmail-icon.png"
              alt=""
              className="h-9 w-9 shrink-0 rounded-full"
            />
            <span>
              <span className="block text-sm font-bold text-white">Email</span>
              <span className="block text-xs text-gray-400">{CONTACT_EMAIL}</span>
            </span>
          </a>
        </div>
      )}
    </div>
  );
}
