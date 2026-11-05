import type { Metadata } from "next";
import { createServerSupabase } from "@/lib/supabase-server";
import { profileCode } from "@/lib/utils";

/**
 * Link preview for shared profiles (WhatsApp, email, social apps). It shows
 * the Profile ID, age and location with the site logo, never the member's
 * photo or name.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const supabase = await createServerSupabase();
  const { data } = await supabase
    .from("public_profiles")
    .select("internal_id, age, gender, city, residence_country, marital_status")
    .eq("id", id)
    .maybeSingle();

  if (!data) return { title: "Profile | PureLifePartner" };

  const location = [...(data.city ?? []), ...(data.residence_country ?? [])].join(", ");
  const summary = [
    data.age != null ? `${data.age} years` : null,
    data.gender,
    data.marital_status,
    location || null,
  ]
    .filter(Boolean)
    .join(" · ");

  const title = `${profileCode(data.internal_id)} | PureLifePartner`;
  const description = summary
    ? `${summary}. View this profile on PureLifePartner.`
    : "View this profile on PureLifePartner.";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `/profile/${id}`,
      siteName: "PureLifePartner",
      images: [{ url: "/plp-logo-circle.png" }],
      type: "profile",
    },
    twitter: { card: "summary", title, description, images: ["/plp-logo-circle.png"] },
  };
}

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  return children;
}
