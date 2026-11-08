import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Browse Marriage Profiles Worldwide | PureLifePartner",
  description:
    "Search verified marriage profiles from around the world by age, religion, country, city and more. Find your life partner on PureLifePartner.",
  alternates: { canonical: "/search" },
};

export default function SearchLayout({ children }: { children: React.ReactNode }) {
  return children;
}
