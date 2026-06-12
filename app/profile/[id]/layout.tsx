// Cloudflare Pages (next-on-pages) requires dynamic routes to run on the
// Edge runtime; this segment config applies it to the profile pages.
export const runtime = "edge";

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
