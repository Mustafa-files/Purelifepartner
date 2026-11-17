/** Shared SEO constants so the sitemap, robots, metadata and JSON-LD agree. */
export const SITE_URL = "https://purelifepartner.com";
export const SITE_NAME = "PureLifePartner";

// Keywords target everyone looking for marriage: every religion and country.
// Faith terms sit alongside each other so no one community is the headline.
export const DEFAULT_TITLE =
  "Global Marriage & Matrimonial Website for All Religions | PureLifePartner";

export const DEFAULT_DESCRIPTION =
  "PureLifePartner is a global marriage website for people of every religion, background and country. Search any city or country to find a life partner through verified profiles, private by default, with families welcome to take part.";

export const SITE_KEYWORDS = [
  "marriage website",
  "matrimonial site",
  "matrimony",
  "marriage bureau",
  "marriage platform",
  "online marriage bureau",
  "best marriage platform near me",
  "find a life partner",
  "find a spouse",
  "singles for marriage",
  "international marriage website",
  "interfaith marriage",
  "Christian marriage website",
  "Hindu matrimony",
  "Muslim marriage website",
  "Sikh matrimony",
  "Buddhist marriage",
];

/** Public pages worth indexing, with a rough priority for the sitemap. */
export const PUBLIC_PAGES: { path: string; priority: number }[] = [
  { path: "/", priority: 1 },
  { path: "/search", priority: 0.9 },
  { path: "/register", priority: 0.9 },
  { path: "/muslim-marriage", priority: 0.8 },
  { path: "/blog", priority: 0.7 },
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
