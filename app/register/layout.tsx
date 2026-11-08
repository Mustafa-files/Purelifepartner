import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create a Free Marriage Profile | PureLifePartner",
  description:
    "Join PureLifePartner free and create your marriage profile. Open to every religion and country, private by default, verified members, family friendly.",
  alternates: { canonical: "/register" },
};

export default function RegisterLayout({ children }: { children: React.ReactNode }) {
  return children;
}
