import type { MetadataRoute } from "next";
import { PRIVATE_PATHS, SITE_URL } from "@/lib/seo";

// Built once at build time; no request-time function on Cloudflare.
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    // One rule for every crawler, AI assistants included (GPTBot, ClaudeBot,
    // PerplexityBot, Google-Extended), so the site can be cited in AI answers.
    rules: [{ userAgent: "*", allow: "/", disallow: PRIVATE_PATHS }],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
