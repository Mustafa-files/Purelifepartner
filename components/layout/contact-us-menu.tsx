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
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#25D366] text-white">
              <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm5 14.2c-.2.6-1.2 1.2-1.7 1.2-.4.1-1 .1-1.6-.1a13 13 0 0 1-5.8-5.1c-.6-1-.9-2-.9-2.7 0-.8.4-1.4.7-1.7.3-.3.6-.4.8-.4h.6c.2 0 .4 0 .6.5l.9 2c.1.2.1.4 0 .6l-.4.6-.3.4c-.1.2-.2.3 0 .6.2.4.9 1.5 2 2.4 1.3 1.2 2.4 1.5 2.7 1.7.3.1.5.1.7-.1l1-1.2c.2-.3.4-.2.7-.1l2 1c.3.1.5.2.5.4.1 0 .1.4-.1 1z" />
              </svg>
            </span>
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
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-coral text-white">
              <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                <path d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zm0 4.2-8 5-8-5V6.4l8 5 8-5v1.8z" />
              </svg>
            </span>
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
