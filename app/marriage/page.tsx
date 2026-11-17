import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MARRIAGE_CITIES } from "@/lib/marriage-cities";

export const metadata: Metadata = {
  title: "Marriage & Matrimony by City in the USA | PureLifePartner",
  description:
    "Find a life partner near you in the United States. PureLifePartner is a marriage website for every religion, with local pages for New York, Los Angeles, Chicago, Houston and more.",
  alternates: { canonical: "/marriage" },
};

export default function MarriageHub() {
  const cities = [...MARRIAGE_CITIES].sort((a, b) => a.name.localeCompare(b.name));
  return (
    <div className="bg-off-white">
      <section className="mx-auto max-w-5xl px-4 pt-14 pb-10 sm:px-6">
        <p className="text-sm font-bold uppercase tracking-widest text-coral">
          United States
        </p>
        <h1 className="mt-3 text-4xl font-extrabold leading-tight text-charcoal sm:text-5xl">
          Marriage by City in the USA
        </h1>
        <p className="mt-5 max-w-3xl text-lg leading-relaxed text-charcoal/75">
          PureLifePartner helps people of every religion and background find a
          life partner for marriage. Choose your city to see members near you,
          learn about the local faith communities, and start your search with
          verified, private profiles.
        </p>
      </section>

      <section className="mx-auto max-w-5xl px-4 pb-16 sm:px-6">
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {cities.map((c) => (
            <li key={c.slug}>
              <Link
                href={`/marriage/${c.slug}`}
                className="flex items-center justify-between rounded-2xl bg-white px-5 py-4 shadow-sm transition-shadow hover:shadow-md"
              >
                <span className="font-bold text-charcoal">Marriage in {c.name}</span>
                <span className="text-sm text-charcoal/50">{c.stateShort}</span>
              </Link>
            </li>
          ))}
        </ul>

        <p className="mt-8 text-sm text-charcoal/70">
          Looking for a Muslim spouse?{" "}
          <Link href="/muslim-marriage" className="font-bold text-coral hover:underline">
            See Muslim marriage by city
          </Link>
        </p>

        <div className="mt-12 rounded-2xl bg-white px-6 py-10 text-center shadow-sm">
          <h2 className="text-2xl font-bold text-charcoal">Don&apos;t see your city?</h2>
          <p className="mx-auto mt-2 max-w-md text-charcoal/60">
            Members join from every state and country. Create a free profile
            and search by any city.
          </p>
          <Link href="/register" className="mt-6 inline-block">
            <Button size="lg">Create Free Profile</Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
