/** Shared SEO constants so the sitemap, robots, metadata and JSON-LD agree. */
export const SITE_URL = "https://purelifepartner.com";
export const SITE_NAME = "PureLifePartner";

// Keywords target Muslims globally, not one country or community.
export const DEFAULT_TITLE =
  "Halal Muslim Marriage & Matrimonial Website | PureLifePartner";

export const DEFAULT_DESCRIPTION =
  "PureLifePartner is a halal Muslim marriage website for Muslims worldwide, across the UK, Europe, North America, the Middle East, Asia, Africa and Australia. Verified profiles, private by default, with family and wali involvement, made for nikah.";

export const SITE_KEYWORDS = [
  "Muslim marriage website",
  "Muslim matrimonial site",
  "halal marriage",
  "Muslim matrimony",
  "Islamic marriage website",
  "Muslim marriage bureau",
  "nikah",
  "Muslim singles for marriage",
  "find a Muslim spouse",
  "rishta",
];

/** Public pages worth indexing, with a rough priority for the sitemap. */
export const PUBLIC_PAGES: { path: string; priority: number }[] = [
  { path: "/", priority: 1 },
  { path: "/search", priority: 0.9 },
  { path: "/register", priority: 0.9 },
  { path: "/muslim-marriage", priority: 0.8 },
  { path: "/success-stories", priority: 0.7 },
  { path: "/help", priority: 0.6 },
  { path: "/login", priority: 0.4 },
  { path: "/privacy-policy", priority: 0.2 },
  { path: "/terms", priority: 0.2 },
];

/** Signed-in, staff and account areas that should never appear in search. */
export const PRIVATE_PATHS = [
  "/admin",
  "/staff",
  "/system",
  "/dashboard",
  "/settings",
  "/payment",
  "/matches",
  "/shortlist",
  "/auth",
  "/register/",
];
