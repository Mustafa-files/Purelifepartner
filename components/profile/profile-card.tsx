import Link from "next/link";
import { RoleBadge } from "@/components/ui/role-badge";
import { formatHeight } from "@/lib/utils";
import type { PublicProfile } from "@/types";

export function ProfileCard({ profile }: { profile: PublicProfile }) {
  const location = [profile.city?.[0], profile.residence_country?.[0]]
    .filter(Boolean)
    .join(", ");
  const cover = profile.avatar_url ?? profile.photos?.[0] ?? null;

  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-shadow hover:shadow-md">
      {/* Photo */}
      <Link href={`/profile/${profile.id}`} className="relative block">
        {cover ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={cover}
            alt={profile.user_id_handle ?? "Profile"}
            loading="lazy"
            decoding="async"
            className="h-52 w-full object-cover"
          />
        ) : (
          <div className="flex h-52 w-full items-center justify-center bg-gradient-to-br from-coral/10 to-coral/25 text-6xl">
            {profile.gender === "Female" ? "🌸" : "🌙"}
          </div>
        )}
        {profile.status === "Verified" && (
          <span className="absolute right-3 top-3 rounded-full bg-green-600 px-2.5 py-1 text-[10px] font-bold text-white shadow">
            ✓ Verified
          </span>
        )}
        {profile.video_url && (
          <span className="absolute left-3 top-3 rounded-full bg-black/60 px-2.5 py-1 text-[10px] font-bold text-white shadow">
            ▶ Video
          </span>
        )}
      </Link>

      {/* Essential information */}
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-baseline justify-between gap-2">
          <span className="text-lg font-bold text-charcoal">
            {profile.user_id_handle ?? `Member ${profile.internal_id}`}
          </span>
          {profile.age != null && (
            <span className="shrink-0 text-sm font-semibold text-charcoal/60">
              {profile.age} yrs
            </span>
          )}
        </div>
        {profile.role && <RoleBadge role={profile.role} className="mt-1" />}
        {location && (
          <span className="mt-0.5 text-sm text-charcoal/60">📍 {location}</span>
        )}

        <dl className="mt-4 flex-1 space-y-1.5 text-sm">
          <Row
            label="Height"
            value={formatHeight(profile.height_ft, profile.height_in, profile.height_cm)}
          />
          <Row label="Marital Status" value={profile.marital_status ?? "N/A"} />
          <Row
            label="Religion"
            value={
              [profile.religion, profile.sect].filter(Boolean).join(" · ") || "N/A"
            }
          />
          <Row label="Caste" value={profile.caste ?? "N/A"} />
          <Row label="Qualification" value={profile.qualification ?? "N/A"} />
          <Row
            label="Profession"
            value={profile.profession?.slice(0, 2).join(", ") || "N/A"}
          />
        </dl>

        <Link
          href={`/profile/${profile.id}`}
          className="mt-4 rounded-full bg-coral py-2 text-center text-sm font-bold text-white transition-colors hover:bg-coral-muted"
        >
          View Profile
        </Link>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-2">
      <dt className="shrink-0 text-charcoal/50">{label}</dt>
      <dd className="truncate text-right font-semibold text-charcoal">
        {value}
      </dd>
    </div>
  );
}
