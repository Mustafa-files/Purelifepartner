"use client";

import { LogoMark } from "@/components/ui/logo";
import { ContactUsMenu } from "@/components/layout/contact-us-menu";
import {
  CONTACT_EMAIL,
  GMAIL_COMPOSE_LINK,
  WHATSAPP_LINK,
  WHATSAPP_NUMBER,
} from "@/lib/utils";

/** Per UX decision: every footer link smooth-scrolls to the top of the
 *  current page rather than navigating elsewhere. */
function scrollToTop(e: React.MouseEvent) {
  e.preventDefault();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

const COLUMNS = [
  {
    title: "About",
    links: [
      { label: "Our Story", href: "/#about" },
      { label: "How It Works", href: "/#how-it-works" },
      { label: "Success Stories", href: "/success-stories" },
      { label: "Pricing", href: "/#pricing" },
    ],
  },
  {
    title: "Quick Links",
    links: [
      { label: "Create Profile", href: "/register" },
      { label: "Browse Profiles", href: "/search" },
      { label: "Sign In", href: "/login" },
      { label: "Agent Registration", href: "/register/agent" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Payment Help", href: "/payment" },
      { label: "Privacy Policy", href: "/privacy-policy" },
      { label: "Terms & Conditions", href: "/terms" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-gray-100 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2.5">
              <LogoMark className="h-9" />
              <span className="text-xl font-extrabold text-coral">
                PureLifePartner
              </span>
            </div>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-charcoal/65">
              A halal, respectful, and modern platform for Muslims seeking a
              life partner. Your journey to Nikah starts here.
            </p>
            <div className="mt-5 flex gap-3">
              <a
                href={WHATSAPP_LINK}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="block h-9 w-9 rounded-full transition-transform hover:scale-110"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/whatsapp-icon.png"
                  alt=""
                  className="h-full w-full rounded-full"
                />
              </a>
              <SocialIcon href="https://instagram.com" label="Instagram">
                <path d="M12 2c2.7 0 3 0 4.1.1 1 0 1.6.2 2 .4.5.2.9.4 1.3.8.4.4.6.8.8 1.3.2.4.4 1 .4 2C20.7 7.7 20.7 8 20.7 12s0 4.3-.1 5.4c0 1-.2 1.6-.4 2-.2.5-.4.9-.8 1.3-.4.4-.8.6-1.3.8-.4.2-1 .4-2 .4-1.1.1-1.4.1-4.1.1s-3 0-4.1-.1c-1 0-1.6-.2-2-.4a3.6 3.6 0 0 1-1.3-.8 3.6 3.6 0 0 1-.8-1.3c-.2-.4-.4-1-.4-2C3.3 16.3 3.3 16 3.3 12s0-4.3.1-5.4c0-1 .2-1.6.4-2 .2-.5.4-.9.8-1.3.4-.4.8-.6 1.3-.8.4-.2 1-.4 2-.4C9 2 9.3 2 12 2zm0 4.9a5.1 5.1 0 1 0 0 10.2 5.1 5.1 0 0 0 0-10.2zm0 8.4a3.3 3.3 0 1 1 0-6.6 3.3 3.3 0 0 1 0 6.6zm6.5-8.6a1.2 1.2 0 1 1-2.4 0 1.2 1.2 0 0 1 2.4 0z" />
              </SocialIcon>
              <SocialIcon href="https://facebook.com" label="Facebook">
                <path d="M22 12a10 10 0 1 0-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.5h-1.3c-1.2 0-1.6.8-1.6 1.6V12h2.8l-.4 2.9h-2.4v7A10 10 0 0 0 22 12z" />
              </SocialIcon>
            </div>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-charcoal/70">
                {col.title}
              </h3>
              <ul className="space-y-2.5">
                {col.title === "Support" && (
                  <li>
                    <ContactUsMenu />
                  </li>
                )}
                {col.links.map((l) => (
                  <li key={l.label}>
                    <a
                      href="#"
                      onClick={scrollToTop}
                      className="text-sm text-charcoal/60 transition-colors hover:text-coral"
                    >
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-gray-300">
              Contact
            </h3>
            <ul className="space-y-2.5 text-sm text-charcoal/60">
              <li>
                WhatsApp:{" "}
                <a
                  href={WHATSAPP_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-coral hover:text-coral-muted"
                >
                  {WHATSAPP_NUMBER}
                </a>
              </li>
              <li>
                Email:{" "}
                <a
                  href={GMAIL_COMPOSE_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-coral hover:text-coral-muted"
                >
                  {CONTACT_EMAIL}
                </a>
              </li>
              <li>Available worldwide</li>
              <li>6 continents served</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-100">
        <div className="mx-auto max-w-7xl px-4 py-5 text-center text-sm text-charcoal/50 sm:px-6">
          © 2025 PureLifePartner. All rights reserved. | Made with{" "}
          <span className="text-coral">❤️</span> for the Ummah
        </div>
      </div>
    </footer>
  );
}

function SocialIcon({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="flex h-9 w-9 items-center justify-center rounded-full bg-coral/10 text-coral transition-colors hover:bg-coral hover:text-white"
    >
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-4.5 w-4.5">
        {children}
      </svg>
    </a>
  );
}
