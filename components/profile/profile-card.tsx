import Link from "next/link";
import { ShortlistButton } from "@/components/profile/shortlist";
import { formatHeight, profileCode } from "@/lib/utils";
import type { PublicProfile } from "@/types";

const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

/**
 * Compact search result: photo, Profile ID, and two short lines. Empty
 * fields are left out instead of showing "N/A".
 */
export function ProfileCard({
  profile,
  reason,
  preview = false,
  onPreviewClick,
}: {
  profile: PublicProfile;
  /** Optional line under the details, e.g. why this is a match */
  reason?: string;
  /** Visitor preview: blurred photo, no heart, and the card leads to sign up */
  preview?: boolean;
  onPreviewClick?: () => void;
}) {
  const cover = profile.avatar_url ?? profile.photos?.[0] ?? null;
  const place = [profile.city?.[0], shortCountry(profile.residence_country?.[0])]
    .filter(Boolean)
    .join(", ");
  const line1 = [profile.age != null ? String(profile.age) : null, place]
    .filter(Boolean)
    .join(" · ");
  const height =
    profile.height_ft != null || profile.height_cm != null
      ? formatHeight(profile.height_ft, profile.height_in, profile.height_cm)
      : null;
  const line2 = [profile.sect || profile.religion, profile.caste, height, profile.marital_status]
    .filter(Boolean)
    .join(" · ");
  const isNew =
    !!profile.created_at && Date.now() - new Date(profile.created_at).getTime() < WEEK_MS;

  return (
    <Link
      href={preview ? "/register?from=search" : `/profile/${profile.id}`}
      onClick={preview ? onPreviewClick : undefined}
      className="group flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="relative overflow-hidden">
        {cover ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={cover}
            alt={`Profile ${profileCode(profile.internal_id)}`}
            loading="lazy"
            decoding="async"
            className={
              preview
                ? "aspect-[4/3] w-full scale-110 object-cover blur-lg"
                : "aspect-[4/3] w-full object-cover"
            }
          />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={
              profile.gender === "Female"
                ? "/illustrations/sister-waving.svg"
                : "/illustrations/brother-greeting.svg"
            }
            alt=""
            className="aspect-[4/3] w-full bg-off-white object-contain object-bottom pt-4"
          />
        )}
        {profile.status === "Verified" && (
          <span className="absolute left-3 top-3 flex items-center gap-1 rounded-full bg-[#ffffff]/95 px-2.5 py-1 text-[11px] font-bold text-green-700 shadow-sm">
            ✓ Verified
          </span>
        )}
        {profile.video_url && (
          <span className="absolute bottom-3 left-3 rounded-full bg-black/60 px-2.5 py-1 text-[11px] font-bold text-white">
            ▶ Video
          </span>
        )}
        {preview ? (
          cover && (
            <span className="absolute right-3 top-3 rounded-full bg-[#ffffff]/95 px-2.5 py-1 text-[11px] font-bold text-[#2b2325] shadow-sm">
              Join to see photo
            </span>
          )
        ) : (
          <ShortlistButton profileId={profile.id} className="absolute right-3 top-3" />
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <span className="text-lg font-bold text-charcoal group-hover:text-coral">
          {profileCode(profile.internal_id)}
        </span>
        {line1 && <span className="mt-0.5 text-sm text-charcoal/70">{line1}</span>}
        {line2 && <span className="text-sm text-charcoal/70">{line2}</span>}
        {reason && (
          <span className="mt-2 text-sm font-semibold text-green-700">✓ {reason}</span>
        )}
        {isNew && !reason && (
          <span className="mt-2 text-xs font-semibold text-coral">Joined this week</span>
        )}
      </div>
    </Link>
  );
}

/** Keeps the card line short: "United Kingdom" reads as "UK" */
function shortCountry(country: string | undefined) {
  if (!country) return null;
  const short: Record<string, string> = {
    "United Kingdom": "UK",
    "United States": "USA",
    "United Arab Emirates": "UAE",
    "Saudi Arabia": "KSA",
  };
  return short[country] ?? country;
}
