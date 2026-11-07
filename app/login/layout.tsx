import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Member Login | PureLifePartner",
  description: "Sign in to your PureLifePartner Muslim marriage profile.",
  alternates: { canonical: "/login" },
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return children;
}
