import type { MetadataRoute } from "next";
import { PUBLIC_PAGES, SITE_URL } from "@/lib/seo";
import { CITIES } from "@/lib/cities";

// Built once at build time; no request-time function on Cloudflare.
export const dynamic = "force-static";

/**
 * Member profile pages are left out on purpose: they are thin pages (an ID,
 * age and city) and members expect their profile not to be pushed to Google.
 * Add new landing pages and guides to PUBLIC_PAGES in lib/seo.ts.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  const pages: MetadataRoute.Sitemap = PUBLIC_PAGES.map(({ path, priority }) => ({
    url: `${SITE_URL}${path === "/" ? "" : path}`,
    lastModified,
    changeFrequency: path === "/" || path === "/search" ? "daily" : "monthly",
    priority,
  }));
  const cityPages: MetadataRoute.Sitemap = CITIES.map((c) => ({
    url: `${SITE_URL}/muslim-marriage/${c.slug}`,
    lastModified,
    changeFrequency: "weekly",
    priority: 0.8,
  }));
  return [...pages, ...cityPages];
}
