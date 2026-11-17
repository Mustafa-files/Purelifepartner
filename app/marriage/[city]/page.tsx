import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { JsonLd } from "@/components/seo/json-ld";
import { CityMembers } from "@/components/city/city-members";
import {
  COUNTRY,
  MARRIAGE_CITIES,
  getMarriageCity,
  marriageCityTitle,
  type MarriageCity,
} from "@/lib/marriage-cities";
import { SITE_URL } from "@/lib/seo";
import { ARTICLES } from "@/lib/blog";

// Every city is known at build time; anything else is a 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return MARRIAGE_CITIES.map((c) => ({ city: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ city: string }>;
}): Promise<Metadata> {
  const c = getMarriageCity((await params).city);
  if (!c) return {};
  const title = marriageCityTitle(c);
  const description = `Find a life partner in ${c.name}, ${c.stateShort}. A marriage website for every religion, with verified profiles, private by default and families welcome. Join PureLifePartner free.`;
  const url = `/marriage/${c.slug}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, type: "website" },
    twitter: { card: "summary", title, description },
  };
}

function sharedFaqs(c: MarriageCity) {
  return [
    {
      q: `Is PureLifePartner free in ${c.name}?`,
      a: `Yes. Creating a profile and browsing members in ${c.name} is free. Verification is a one-off paid step that unlocks contact details once both members are verified.`,
    },
    {
      q: `Can people of any religion use PureLifePartner in ${c.name}?`,
      a: "Yes. PureLifePartner is open to every religion and background. You can search for someone who shares your faith, or be open to partners from other faiths.",
    },
  ];
}

export default async function MarriageCityPage({
  params,
}: {
  params: Promise<{ city: string }>;
}) {
  const c = getMarriageCity((await params).city);
  if (!c) notFound();

  const faqs = [...c.faqs, ...sharedFaqs(c)];
  const nearby = c.nearby
    .map(getMarriageCity)
    .filter((n): n is MarriageCity => !!n);
  // General guides first; faith-specific ones are linked from their own section
  const guides = ARTICLES.filter(
    (a) => a.category !== "Islamic Guidance" && !a.slug.includes("muslim")
  ).slice(0, 4);

  return (
    <div className="bg-off-white">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
                {
                  "@type": "ListItem",
                  position: 2,
                  name: "Marriage by City",
                  item: `${SITE_URL}/marriage`,
                },
                {
                  "@type": "ListItem",
                  position: 3,
                  name: `Marriage in ${c.name}`,
                  item: `${SITE_URL}/marriage/${c.slug}`,
                },
              ],
            },
            {
              "@type": "FAQPage",
              mainEntity: faqs.map(({ q, a }) => ({
                "@type": "Question",
                name: q,
                acceptedAnswer: { "@type": "Answer", text: a },
              })),
            },
          ],
        }}
      />

      {/* Hero */}
      <section className="mx-auto max-w-5xl px-4 pt-10 pb-14 sm:px-6 sm:pt-14">
        <nav aria-label="Breadcrumb" className="text-sm text-charcoal/60">
          <Link href="/" className="hover:text-coral">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/marriage" className="hover:text-coral">Marriage by City</Link>
          <span className="mx-2">/</span>
          <span className="text-charcoal">{c.name}</span>
        </nav>
        <p className="mt-8 text-sm font-bold uppercase tracking-widest text-coral">
          {c.name}, {c.state}
        </p>
        <h1 className="mt-3 text-4xl font-extrabold leading-tight text-charcoal sm:text-5xl">
          Find a Life Partner in {c.name}
        </h1>
        <p className="mt-5 max-w-3xl text-lg leading-relaxed text-charcoal/75">{c.intro}</p>
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <Link href="/register">
            <Button size="lg">Create Free Profile</Button>
          </Link>
          <Link href={`/search?country=${encodeURIComponent(COUNTRY)}`}>
            <Button size="lg" variant="outline">
              Browse Profiles in the USA
            </Button>
          </Link>
        </div>
      </section>

      {/* Live members */}
      <section className="bg-white py-14">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <h2 className="mb-6 text-3xl font-extrabold text-charcoal">
            Members in {c.name}
          </h2>
          <CityMembers
            cityName={c.name}
            aliases={c.aliases}
            country={COUNTRY}
            restrictToCountry
          />
        </div>
      </section>

      {/* Faith and community */}
      <section className="mx-auto max-w-5xl px-4 py-14 sm:px-6">
        <h2 className="text-3xl font-extrabold text-charcoal">
          Faith and community in {c.name}
        </h2>
        <p className="mt-4 max-w-3xl leading-relaxed text-charcoal/75">{c.faith}</p>
        <ul className="mt-5 flex flex-wrap gap-2" aria-label={`Faith communities in ${c.name}`}>
          {c.faiths.map((f) => (
            <li key={f} className="rounded-full bg-white px-3 py-1 text-sm font-semibold text-charcoal/80 shadow-sm">
              {f}
            </li>
          ))}
        </ul>

        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <h3 className="font-bold text-charcoal">Areas around {c.name}</h3>
            <ul className="mt-4 flex flex-wrap gap-2">
              {c.areas.map((a) => (
                <li key={a} className="rounded-full bg-off-white px-3 py-1 text-sm text-charcoal/80">
                  {a}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <h3 className="font-bold text-charcoal">Places of worship and landmarks</h3>
            <ul className="mt-4 space-y-2 text-sm text-charcoal/80">
              {c.landmarks.map((l) => (
                <li key={l}>{l}</li>
              ))}
            </ul>
          </div>
        </div>
        <p className="mt-6 max-w-3xl text-charcoal/75">{c.localNote}</p>
        {c.muslimSlug && (
          <p className="mt-4 text-sm text-charcoal/70">
            Looking for a Muslim spouse?{" "}
            <Link href={`/muslim-marriage/${c.muslimSlug}`} className="font-bold text-coral hover:underline">
              See Muslim marriage in {c.name}
            </Link>
          </p>
        )}
      </section>

      {/* Why us */}
      <section className="bg-white py-14">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <h2 className="text-3xl font-extrabold text-charcoal">
            Why singles in {c.name} choose PureLifePartner
          </h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-3">
            {[
              {
                t: "Made for marriage",
                d: "A marriage website, not a dating app. Every member is here to find a spouse.",
              },
              {
                t: "Every faith welcome",
                d: "Search by religion and background, or stay open to partners from other faiths.",
              },
              {
                t: "Private and family friendly",
                d: "Your name and number are never public, families can take part, and contact details are shared only when both sides are verified.",
              },
            ].map((x) => (
              <div key={x.t} className="rounded-2xl bg-off-white p-6">
                <h3 className="font-bold text-charcoal">{x.t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-charcoal/70">{x.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
        <h2 className="text-3xl font-extrabold text-charcoal">
          Marriage in {c.name}: common questions
        </h2>
        <div className="mt-6 space-y-3">
          {faqs.map((f) => (
            <details key={f.q} className="rounded-2xl bg-white p-5 shadow-sm">
              <summary className="cursor-pointer list-none font-bold text-charcoal">{f.q}</summary>
              <p className="mt-3 leading-relaxed text-charcoal/70">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {guides.length > 0 && (
        <section className="mx-auto max-w-5xl px-4 pb-14 sm:px-6">
          <h2 className="text-2xl font-extrabold text-charcoal">Guides before you start</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {guides.map((g) => (
              <Link
                key={g.slug}
                href={`/blog/${g.slug}`}
                className="rounded-2xl bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
              >
                <p className="text-xs font-bold uppercase tracking-widest text-coral">{g.category}</p>
                <p className="mt-2 font-bold text-charcoal">{g.title}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Nearby + CTA */}
      <section className="bg-white py-14">
        <div className="mx-auto max-w-5xl px-4 text-center sm:px-6">
          <h2 className="text-3xl font-extrabold text-charcoal">
            Start your search in {c.name} today
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-charcoal/70">
            Join free in about five minutes. Your name stays private.
          </p>
          <Link href="/register" className="mt-6 inline-block">
            <Button size="lg">Create Free Profile</Button>
          </Link>

          {nearby.length > 0 && (
            <div className="mt-12">
              <h3 className="font-bold text-charcoal">Marriage in nearby cities</h3>
              <ul className="mt-4 flex flex-wrap justify-center gap-3">
                {nearby.map((n) => (
                  <li key={n.slug}>
                    <Link
                      href={`/marriage/${n.slug}`}
                      className="inline-block rounded-full border border-gray-200 px-4 py-2 text-sm font-semibold text-charcoal transition-colors hover:border-coral hover:text-coral"
                    >
                      {n.name}
                    </Link>
                  </li>
                ))}
              </ul>
              <Link
                href="/marriage"
                className="mt-6 inline-block text-sm font-bold text-coral underline-offset-4 hover:underline"
              >
                See all US cities
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
