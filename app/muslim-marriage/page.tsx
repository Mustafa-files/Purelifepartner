import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { citiesByCountry } from "@/lib/cities";

export const metadata: Metadata = {
  title: "Muslim Marriage by City Worldwide | PureLifePartner",
  description:
    "Find a Muslim spouse near you. PureLifePartner connects Muslims for marriage in cities across the UK, USA, Canada, the Gulf, Pakistan, Europe, Australia and Asia.",
  alternates: { canonical: "/muslim-marriage" },
};

export default function CityHub() {
  const groups = citiesByCountry();
  return (
    <div className="bg-off-white">
      <section className="mx-auto max-w-5xl px-4 pt-14 pb-10 sm:px-6">
        <p className="text-sm font-bold uppercase tracking-widest text-coral">
          Muslim marriage worldwide
        </p>
        <h1 className="mt-3 text-4xl font-extrabold leading-tight text-charcoal sm:text-5xl">
          Muslim Marriage by City
        </h1>
        <p className="mt-5 max-w-3xl text-lg leading-relaxed text-charcoal/75">
          PureLifePartner brings Muslims together for nikah all over the world.
          Choose your city to see members near you, learn about the local
          Muslim community, and start your search with verified, private
          profiles.
        </p>
      </section>

      <section className="mx-auto max-w-5xl px-4 pb-16 sm:px-6">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {groups.map(([country, cities]) => (
            <div key={country} className="rounded-2xl bg-white p-6 shadow-sm">
              <h2 className="text-lg font-bold text-charcoal">{country}</h2>
              <ul className="mt-3 space-y-2">
                {cities.map((c) => (
                  <li key={c.slug}>
                    <Link
                      href={`/muslim-marriage/${c.slug}`}
                      className="text-charcoal/75 transition-colors hover:text-coral"
                    >
                      Muslim marriage in {c.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 rounded-2xl bg-white px-6 py-10 text-center shadow-sm">
          <h2 className="text-2xl font-bold text-charcoal">Don&apos;t see your city?</h2>
          <p className="mx-auto mt-2 max-w-md text-charcoal/60">
            Members join from all over the world. Create a free profile and
            search by any country or city.
          </p>
          <Link href="/register" className="mt-6 inline-block">
            <Button size="lg">Create Free Profile</Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
