"use client";

import { useState } from "react";
import Link from "next/link";

const QUOTES = [
  {
    quote: "We matched in two months, and both families felt safe.",
    name: "Fatima & Ahmed",
  },
  {
    quote: "As a father, I was part of my daughter's search from day one.",
    name: "Muhammad S.",
  },
  {
    quote: "It felt respectful from the start. Alhamdulillah, we had our nikah last spring.",
    name: "Zainab & Omar",
  },
];

function Arrow({ flip = false }: { flip?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={`h-5 w-5 ${flip ? "rotate-180" : ""}`} aria-hidden="true">
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}

/** One large quote at a time, with arrows and dots to move between them */
export function Testimonials() {
  const [i, setI] = useState(0);
  const go = (step: number) => setI((n) => (n + step + QUOTES.length) % QUOTES.length);
  const q = QUOTES[i];

  return (
    <section className="bg-white py-20 sm:py-28">
      <div className="gsap-fade-up mx-auto max-w-4xl px-4 text-center sm:px-6">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-coral">
          Alhamdulillah, they found each other
        </p>

        <figure className="mt-8" aria-live="polite">
          <blockquote
            key={i}
            className="plp-quote font-[family-name:var(--font-display)] text-3xl font-extrabold leading-tight text-charcoal sm:text-5xl"
          >
            &ldquo;{q.quote}&rdquo;
          </blockquote>
          <figcaption className="mt-6 font-bold text-charcoal/60">{q.name}</figcaption>
        </figure>

        <div className="mt-10 flex items-center justify-center gap-5">
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label="Previous story"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-charcoal/20 text-charcoal transition-colors hover:border-coral hover:text-coral"
          >
            <Arrow />
          </button>
          <div className="flex gap-2">
            {QUOTES.map((item, n) => (
              <button
                key={item.name}
                type="button"
                onClick={() => setI(n)}
                aria-label={`Story ${n + 1}`}
                aria-current={n === i}
                className={`h-2 rounded-full transition-all ${n === i ? "w-6 bg-coral" : "w-2 bg-charcoal/20"}`}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={() => go(1)}
            aria-label="Next story"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-charcoal/20 text-charcoal transition-colors hover:border-coral hover:text-coral"
          >
            <Arrow flip />
          </button>
        </div>

        <Link
          href="/success-stories"
          className="mt-10 inline-block font-bold text-coral underline-offset-4 hover:underline"
        >
          Read more stories →
        </Link>
      </div>
    </section>
  );
}
