"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

/** Where a visitor's search waits while they sign up (set by the search
 *  page's join card, read back on their first visit as a member) */
export const PENDING_SEARCH_KEY = "plp-pending-search";

const AGES = [
  ["18-24", "18 to 24"],
  ["25-30", "25 to 30"],
  ["31-35", "31 to 35"],
  ["36-45", "36 to 45"],
  ["18-60", "any age"],
] as const;

const COUNTRIES = [
  ["", "anywhere"],
  ["United Kingdom", "the UK"],
  ["Pakistan", "Pakistan"],
  ["United States", "the USA"],
  ["Canada", "Canada"],
  ["United Arab Emirates", "the UAE"],
  ["Saudi Arabia", "Saudi Arabia"],
  ["Germany", "Germany"],
] as const;

/**
 * "I'm looking for a bride aged 25 to 30 in the UK" as one sentence of
 * dropdowns. Opens /search with those filters already applied.
 */
export function HeroSearch() {
  const router = useRouter();
  const [gender, setGender] = useState("Female");
  const [age, setAge] = useState("25-30");
  const [country, setCountry] = useState("");

  function go(e: React.FormEvent) {
    e.preventDefault();
    const [min, max] = age.split("-");
    const q = new URLSearchParams({ gender, minAge: min, maxAge: max });
    if (country) q.set("country", country);

    router.push(`/search?${q.toString()}`);
  }

  return (
    <form
      onSubmit={go}
      className="mx-auto flex w-full max-w-3xl flex-col gap-2 rounded-3xl border border-charcoal/10 bg-white p-3 shadow-[0_20px_50px_-30px_rgba(43,35,37,0.45)] sm:flex-row sm:items-center sm:rounded-full sm:p-2 sm:pl-6"
    >
      <Field label="I'm looking for a">
        <Pick value={gender} onChange={setGender} label="Looking for">
          <option value="Female">bride</option>
          <option value="Male">groom</option>
        </Pick>
      </Field>
      <Divider />
      <Field label="aged">
        <Pick value={age} onChange={setAge} label="Age">
          {AGES.map(([v, l]) => (
            <option key={v} value={v}>
              {l}
            </option>
          ))}
        </Pick>
      </Field>
      <Divider />
      <Field label="in">
        <Pick value={country} onChange={setCountry} label="Country">
          {COUNTRIES.map(([v, l]) => (
            <option key={l} value={v}>
              {l}
            </option>
          ))}
        </Pick>
      </Field>
      <button
        type="submit"
        className="mt-1 flex h-12 cursor-pointer items-center justify-center gap-2 rounded-full bg-coral px-7 font-bold text-white transition-colors hover:bg-coral-muted sm:ml-auto sm:mt-0"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" className="h-5 w-5" aria-hidden="true">
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" />
        </svg>
        Search
      </button>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-2 rounded-2xl px-3 py-2 sm:justify-start sm:px-0 sm:py-0">
      <span className="whitespace-nowrap text-charcoal/60">{label}</span>
      {children}
    </div>
  );
}

function Pick({
  value,
  onChange,
  label,
  children,
}: {
  value: string;
  onChange: (v: string) => void;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <span className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label={label}
        className="cursor-pointer appearance-none rounded-full bg-coral/10 py-1.5 pl-3 pr-8 font-bold text-coral outline-none focus-visible:ring-2 focus-visible:ring-coral"
      >
        {children}
      </select>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-coral" aria-hidden="true">
        <path d="m6 9 6 6 6-6" />
      </svg>
    </span>
  );
}

function Divider() {
  return <span aria-hidden="true" className="hidden h-6 w-px bg-charcoal/15 sm:block sm:mx-1" />;
}
