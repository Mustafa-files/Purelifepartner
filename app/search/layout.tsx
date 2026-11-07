import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Browse Muslim Marriage Profiles Worldwide | PureLifePartner",
  description:
    "Search verified Muslim marriage profiles from around the world by age, country, city, sect and more. Find a halal spouse for nikah on PureLifePartner.",
  alternates: { canonical: "/search" },
};

export default function SearchLayout({ children }: { children: React.ReactNode }) {
  return children;
}
