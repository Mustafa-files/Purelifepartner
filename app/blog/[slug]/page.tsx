import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { JsonLd } from "@/components/seo/json-ld";
import { ARTICLES, formatArticleDate, getArticle, type Article } from "@/lib/blog";
import { SITE_NAME, SITE_URL } from "@/lib/seo";

export const dynamicParams = false;

export function generateStaticParams() {
  return ARTICLES.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const a = getArticle((await params).slug);
  if (!a) return {};
  const url = `/blog/${a.slug}`;
  return {
    title: a.metaTitle,
    description: a.description,
    alternates: { canonical: url },
    openGraph: {
      title: a.title,
      description: a.description,
      url,
      type: "article",
      publishedTime: a.published,
      modifiedTime: a.updated,
    },
    twitter: { card: "summary", title: a.title, description: a.description },
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const a = getArticle((await params).slug);
  if (!a) notFound();
  const related = a.related.map(getArticle).filter((r): r is Article => !!r);
  const url = `${SITE_URL}/blog/${a.slug}`;

  return (
    <div className="bg-off-white">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "Article",
              headline: a.title,
              description: a.description,
              datePublished: a.published,
              dateModified: a.updated,
              mainEntityOfPage: url,
              url,
              inLanguage: "en",
              author: { "@type": "Organization", name: `${SITE_NAME} Team`, url: SITE_URL },
              publisher: { "@id": `${SITE_URL}/#organization` },
              image: `${SITE_URL}/plp-logo-circle.png`,
            },
            {
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
                { "@type": "ListItem", position: 2, name: "Guides", item: `${SITE_URL}/blog` },
                { "@type": "ListItem", position: 3, name: a.title, item: url },
              ],
            },
            {
              "@type": "FAQPage",
              mainEntity: a.faqs.map(({ q, a: ans }) => ({
                "@type": "Question",
                name: q,
                acceptedAnswer: { "@type": "Answer", text: ans },
              })),
            },
          ],
        }}
      />

      <article className="mx-auto max-w-3xl px-4 pt-10 pb-16 sm:px-6 sm:pt-14">
        <nav aria-label="Breadcrumb" className="text-sm text-charcoal/60">
          <Link href="/" className="hover:text-coral">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/blog" className="hover:text-coral">Guides</Link>
        </nav>

        <p className="mt-8 text-sm font-bold uppercase tracking-widest text-coral">
          {a.category}
        </p>
        <h1 className="mt-3 text-4xl font-extrabold leading-tight text-charcoal sm:text-5xl">
          {a.title}
        </h1>
        <p className="mt-4 text-sm text-charcoal/60">
          By the {SITE_NAME} Team · {formatArticleDate(a.published)} · {a.readMinutes} min read
        </p>

        {/* Answer first: the short answer AI tools and skimmers look for */}
        <div className="mt-8 rounded-2xl border-l-4 border-coral bg-white p-6 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-widest text-charcoal/50">
            The short answer
          </p>
          <p className="mt-2 text-lg leading-relaxed text-charcoal">{a.summary}</p>
        </div>

        <div className="mt-10 space-y-10">
          {a.sections.map((s) => (
            <section key={s.heading}>
              <h2 className="text-2xl font-extrabold text-charcoal sm:text-3xl">{s.heading}</h2>
              {s.paragraphs?.map((p, i) => (
                <p key={i} className="mt-4 text-[17px] leading-relaxed text-charcoal/80">
                  {p}
                </p>
              ))}
              {s.bullets && (
                <ul className="mt-4 space-y-2.5">
                  {s.bullets.map((b) => (
                    <li key={b} className="flex gap-3 text-[17px] leading-relaxed text-charcoal/80">
                      <span aria-hidden="true" className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-coral" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              )}
              {s.after?.map((p, i) => (
                <p key={i} className="mt-4 text-[17px] leading-relaxed text-charcoal/80">
                  {p}
                </p>
              ))}
            </section>
          ))}
        </div>

        {a.scholarNote && (
          <p className="mt-10 rounded-2xl bg-white p-5 text-sm leading-relaxed text-charcoal/70 shadow-sm">
            This guide shares general Islamic guidance for people searching for
            a spouse. It is not a fatwa. For questions about your own situation,
            please speak to a qualified scholar or your local imam.
          </p>
        )}

        <section className="mt-12">
          <h2 className="text-2xl font-extrabold text-charcoal sm:text-3xl">Common questions</h2>
          <div className="mt-5 space-y-3">
            {a.faqs.map((f) => (
              <details key={f.q} className="rounded-2xl bg-white p-5 shadow-sm">
                <summary className="cursor-pointer list-none font-bold text-charcoal">{f.q}</summary>
                <p className="mt-3 leading-relaxed text-charcoal/70">{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        <div className="mt-12 rounded-2xl bg-white px-6 py-10 text-center shadow-sm">
          <h2 className="text-2xl font-bold text-charcoal">Ready to start your search?</h2>
          <p className="mx-auto mt-2 max-w-md text-charcoal/60">
            Join PureLifePartner free. Verified Muslim profiles, private by
            default, with family and wali involvement.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
            <Link href="/register">
              <Button size="lg">Create Free Profile</Button>
            </Link>
            <Link href="/muslim-marriage" className="font-bold text-coral underline-offset-4 hover:underline">
              Find members in your city
            </Link>
          </div>
        </div>

        {related.length > 0 && (
          <section className="mt-12">
            <h2 className="text-xl font-bold text-charcoal">Keep reading</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {related.map((r) => (
                <Link
                  key={r.slug}
                  href={`/blog/${r.slug}`}
                  className="rounded-2xl bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
                >
                  <p className="text-xs font-bold uppercase tracking-widest text-coral">{r.category}</p>
                  <p className="mt-2 font-bold text-charcoal">{r.title}</p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </article>
    </div>
  );
}
