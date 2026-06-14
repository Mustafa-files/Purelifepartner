"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

const STORAGE_KEY = "cookieConsent";
const COOKIE_NAME = "cookieConsent";
const DAYS = 30;

const FAQ = [
  {
    q: "What are cookies?",
    a: "Cookies are small text files stored on your device that help us improve your browsing experience.",
  },
  {
    q: "How do you use my data?",
    a: "We use them to remember your preferences and improve site performance.",
  },
];

function readConsent(): boolean {
  try {
    if (localStorage.getItem(STORAGE_KEY) === "true") return true;
  } catch {
    // localStorage unavailable
  }
  return document.cookie.split("; ").some((c) => c.startsWith(`${COOKIE_NAME}=true`));
}

function persistConsent() {
  try {
    localStorage.setItem(STORAGE_KEY, "true");
  } catch {
    // ignore
  }
  const maxAge = DAYS * 24 * 60 * 60;
  document.cookie = `${COOKIE_NAME}=true; Path=/; Max-Age=${maxAge}; SameSite=Lax`;
}

/**
 * Cookie consent system: a non-intrusive bottom banner that disappears for
 * 30 days after Accept, plus a shared FAQ modal opened from any
 * `data-open-cookie-faq` button anywhere in the app (footer links).
 */
export function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);
  const [showFaq, setShowFaq] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!readConsent()) setShowBanner(true);

    function onOpenFaq() {
      setShowFaq(true);
    }
    window.addEventListener("plp-open-cookie-faq", onOpenFaq);

    // Footer link integration: any element with data-open-cookie-faq
    function onClick(e: MouseEvent) {
      const t = (e.target as HTMLElement).closest("[data-open-cookie-faq]");
      if (t) {
        e.preventDefault();
        setShowFaq(true);
      }
    }
    document.addEventListener("click", onClick);

    return () => {
      window.removeEventListener("plp-open-cookie-faq", onOpenFaq);
      document.removeEventListener("click", onClick);
    };
  }, []);

  function accept() {
    persistConsent();
    setShowBanner(false);
  }

  if (!mounted) return null;

  return (
    <>
      {showBanner &&
        createPortal(
          <div
            role="region"
            aria-label="Cookie consent"
            className="fixed inset-x-3 bottom-3 z-[80] mx-auto max-w-3xl rounded-2xl border border-gray-100 bg-white p-4 shadow-2xl sm:p-5"
          >
            <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-5">
              <p className="flex-1 text-sm leading-relaxed text-charcoal/80">
                We use cookies to remember your preferences and improve site
                performance.{" "}
                <button
                  onClick={() => setShowFaq(true)}
                  className="cursor-pointer font-bold text-coral underline-offset-2 hover:underline"
                >
                  Learn more
                </button>
              </p>
              <button
                onClick={accept}
                className="cursor-pointer rounded-full bg-coral px-6 py-2 text-sm font-bold text-white transition-colors hover:bg-coral-muted"
              >
                Accept
              </button>
            </div>
          </div>,
          document.body
        )}

      {showFaq &&
        createPortal(
          <div
            className="fixed inset-0 z-[110] flex items-center justify-center bg-black/50 p-4"
            onClick={() => setShowFaq(false)}
          >
            <div
              className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl sm:p-8"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mb-4 flex items-start justify-between gap-3">
                <h2 className="text-xl font-bold text-charcoal">
                  Privacy &amp; Cookies
                </h2>
                <button
                  onClick={() => setShowFaq(false)}
                  aria-label="Close"
                  className="cursor-pointer text-2xl text-charcoal/60 hover:text-charcoal"
                >
                  ×
                </button>
              </div>
              <div className="space-y-3">
                {FAQ.map((item) => (
                  <details
                    key={item.q}
                    className="group rounded-xl bg-off-white p-4"
                  >
                    <summary className="cursor-pointer list-none text-sm font-bold text-charcoal">
                      <span className="mr-2 inline-block text-coral transition-transform group-open:rotate-90">
                        ▸
                      </span>
                      {item.q}
                    </summary>
                    <p className="mt-2 pl-6 text-sm leading-relaxed text-charcoal/70">
                      {item.a}
                    </p>
                  </details>
                ))}
              </div>
              <button
                onClick={() => setShowFaq(false)}
                className="mt-6 w-full cursor-pointer rounded-full bg-coral py-2.5 text-sm font-bold text-white transition-colors hover:bg-coral-muted"
              >
                Got it
              </button>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
