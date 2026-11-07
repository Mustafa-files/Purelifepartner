import type { Metadata } from "next";
import Link from "next/link";
import { ARTICLES, formatArticleDate } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Muslim Marriage Guides & Advice | PureLifePartner",
  description:
    "Guides for Muslims looking for a spouse: questions to ask before nikah, the wali's role, whether online matchmaking is halal, and writing a great marriage profile.",
  alternates: { canonical: "/blog" },
};

export default function BlogIndex() {
  const articles = [...ARTICLES].sort((a, b) => b.published.localeCompare(a.published));
  return (
    <div className="bg-off-white">
      <section className="mx-auto max-w-5xl px-4 pt-14 pb-10 sm:px-6">
        <p className="text-sm font-bold uppercase tracking-widest text-coral">Guides</p>
        <h1 className="mt-3 text-4xl font-extrabold leading-tight text-charcoal sm:text-5xl">
          Muslim Marriage Guides
        </h1>
        <p className="mt-5 max-w-3xl text-lg leading-relaxed text-charcoal/75">
          Practical, faith-centred advice for Muslims and their families on
          finding a spouse, preparing for nikah and searching online the halal
          way.
        </p>
      </section>

      <section className="mx-auto max-w-5xl px-4 pb-16 sm:px-6">
        <div className="grid gap-6 sm:grid-cols-2">
          {articles.map((a) => (
            <Link
              key={a.slug}
              href={`/blog/${a.slug}`}
              className="group flex flex-col rounded-2xl bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
            >
              <p className="text-xs font-bold uppercase tracking-widest text-coral">{a.category}</p>
              <h2 className="mt-3 text-xl font-bold text-charcoal group-hover:text-coral">
                {a.title}
              </h2>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-charcoal/70">{a.description}</p>
              <p className="mt-4 text-xs text-charcoal/50">
                {formatArticleDate(a.published)} · {a.readMinutes} min read
              </p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
