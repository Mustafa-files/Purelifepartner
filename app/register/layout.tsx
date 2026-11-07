import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create a Free Muslim Marriage Profile | PureLifePartner",
  description:
    "Join PureLifePartner free and create your Muslim marriage profile. Private by default, verified members, family and wali friendly.",
  alternates: { canonical: "/register" },
};

export default function RegisterLayout({ children }: { children: React.ReactNode }) {
  return children;
}
