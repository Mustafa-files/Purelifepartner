"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { ShareProfile } from "@/components/profile/share-profile";
import { RoleBadge } from "@/components/ui/role-badge";
import { ScreenshotGuard } from "@/components/ui/screenshot-guard";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/toast";
import { formatHeight, profileCode } from "@/lib/utils";
import type { ContactDetails, PublicProfile } from "@/types";

export default function ProfileView({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [profile, setProfile] = useState<PublicProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [contacts, setContacts] = useState<ContactDetails | null>(null);
  const [revealing, setRevealing] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("public_profiles")
      .select("*")
      .eq("id", id)
      .maybeSingle()
      .then(({ data }) => {
        setProfile((data as PublicProfile) ?? null);
        setLoading(false);
      });
  }, [id]);

  async function viewContacts() {
    setRevealing(true);
    const supabase = createClient();
    const { data: userData } = await supabase.auth.getUser();

    if (!userData.user) {
      router.push(`/login?next=/profile/${id}`);
      return;
    }

    const { data, error } = await supabase.rpc("get_contact_details", {
      target: id,
    });

    if (error) {
      if (error.message.includes("SEARCHER_NOT_VERIFIED")) {
        toast(
          "Complete payment verification to unlock contact details.",
          "info"
        );
        router.push("/payment");
      } else if (error.message.includes("TARGET_NOT_VERIFIED")) {
        // Log a pending request; an agent verifies both profiles and then
        // shares details via WhatsApp.
        await supabase.rpc("request_contact", { target: id });
        toast(
          "This member is not verified yet. Our agent has been notified and will contact you on WhatsApp.",
          "info"
        );
      } else {
        toast(error.message, "error");
      }
    } else if (data && data.length > 0) {
      setContacts(data[0] as ContactDetails);
      toast("Contact details unlocked.");
    }
    setRevealing(false);
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12">
        <Skeleton className="h-32 w-full rounded-2xl" />
        <Skeleton className="mt-6 h-64 w-full rounded-2xl" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-24 text-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/illustrations/sister-waving.svg" alt="" className="mx-auto w-40" />
        <h1 className="mt-4 text-2xl font-bold text-charcoal">
          Profile not found
        </h1>
        <p className="mt-2 text-charcoal/60">
          This profile may have been removed or is not public.
        </p>
      </div>
    );
  }

  const location = [
    ...(profile.city ?? []),
    ...(profile.residence_country ?? []),
  ].join(", ");

  const sections: { title: string; rows: [string, string | null | undefined][] }[] = [
    {
      title: "Basic information",
      rows: [
        ["Gender", profile.gender],
        ["Age", profile.age?.toString()],
        ["Height", formatHeight(profile.height_ft, profile.height_in, profile.height_cm)],
        ["Marital status", profile.marital_status],
      ],
    },
    {
      title: "Religion and caste",
      rows: [
        ["Religion", profile.religion],
        ["Sect", profile.sect],
        ["Caste", profile.caste],
        ["Sub caste", profile.sub_caste],
      ],
    },
    {
      title: "Education and work",
      rows: [
        ["Qualification", profile.qualification],
        ["Profession", profile.profession?.join(", ")],
      ],
    },
    {
      title: "Location",
      rows: [
        ["Nationality", profile.nationality?.join(", ")],
        ["Country", profile.residence_country?.join(", ")],
        ["City", profile.city?.join(", ")],
      ],
    },
  ];

  return (
    <div className="bg-off-white py-10 sm:py-14">
      <div className="mx-auto max-w-4xl px-4">
        {/* Header */}
        <ScreenshotGuard>
          <div className="rounded-2xl bg-white p-6 shadow-sm sm:p-10">
            <div className="flex flex-col items-center gap-6 text-center sm:flex-row sm:text-left">
              {profile.avatar_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={profile.avatar_url}
                  alt={`Profile ${profileCode(profile.internal_id)}`}
                  className="h-32 w-32 shrink-0 rounded-full object-cover ring-4 ring-soft-pink"
                />
              ) : (
                // No photo: the site illustration that matches the member
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={
                    profile.gender === "Female"
                      ? "/illustrations/sister-waving.svg"
                      : "/illustrations/brother-greeting.svg"
                  }
                  alt=""
                  className="h-32 w-32 shrink-0 rounded-full bg-soft-pink object-cover object-top ring-4 ring-soft-pink"
                />
              )}
              <div className="min-w-0 flex-1">
                <h1 className="text-3xl font-bold tracking-tight text-charcoal sm:text-4xl">
                  {profileCode(profile.internal_id)}
                </h1>
                <div className="mt-3 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                  {profile.status === "Verified" ? (
                    <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">
                      ✓ Verified
                    </span>
                  ) : (
                    <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-700">
                      Verification pending
                    </span>
                  )}
                  {profile.role && <RoleBadge role={profile.role} />}
                </div>
                {/* The view only returns the User ID to staff and the owner */}
                {profile.user_id_handle && (
                  <p className="mt-2 text-sm text-charcoal/50">
                    User ID: {profile.user_id_handle}
                  </p>
                )}
                {(profile.age != null || location) && (
                  <p className="mt-2 text-lg text-charcoal/70">
                    {profile.age != null && `${profile.age} years`}
                    {profile.age != null && location && " · "}
                    {location}
                  </p>
                )}
                <ShareProfile profile={profile} />
              </div>
            </div>

            {profile.describe_yourself && (
              <p className="mt-8 border-t border-charcoal/10 pt-6 text-lg leading-relaxed text-charcoal/80">
                {profile.describe_yourself}
              </p>
            )}
          </div>
        </ScreenshotGuard>

        {/* Photo gallery */}
        {profile.photos && profile.photos.length > 0 && (
          <ScreenshotGuard>
            <div className="mt-6 rounded-2xl bg-white p-6 shadow-sm sm:p-10">
              <SectionTitle>Photos</SectionTitle>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                {profile.photos.map((url) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    key={url}
                    src={url}
                    alt="Member photo"
                    loading="lazy"
                    className="aspect-square w-full rounded-xl object-cover"
                  />
                ))}
              </div>
            </div>
          </ScreenshotGuard>
        )}

        {/* Video introduction */}
        {profile.video_url && (
          <div className="mt-6 rounded-2xl bg-white p-6 shadow-sm sm:p-10">
            <SectionTitle>Video introduction</SectionTitle>
            <video
              src={profile.video_url}
              controls
              preload="metadata"
              className="w-full rounded-xl bg-black"
            />
          </div>
        )}

        {/* Details: one card, four sections with thin rules */}
        <div className="mt-6 grid gap-x-12 gap-y-10 rounded-2xl bg-white p-6 shadow-sm sm:grid-cols-2 sm:p-10">
          {sections.map((sec) => (
            <DetailSection key={sec.title} title={sec.title} rows={sec.rows} />
          ))}
        </div>

        {/* Contact details gate */}
        <ScreenshotGuard>
          <div className="mt-6 rounded-2xl bg-white p-6 shadow-sm sm:p-10">
            {contacts ? (
              <>
                <SectionTitle>Contact details</SectionTitle>
                <dl className="divide-y divide-charcoal/10">
                  <ContactRow label="Name" value={contacts.full_name} />
                  <ContactRow label="Candidate" value={contacts.candidate_contact} />
                  <ContactRow label="Father" value={contacts.father_contact} />
                  <ContactRow label="Mother" value={contacts.mother_contact} />
                  <ContactRow label="WhatsApp" value={contacts.whatsapp_no} />
                </dl>
              </>
            ) : (
              <div className="flex flex-col items-center gap-6 text-center sm:flex-row sm:text-left">
                <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-coral/10 text-coral">
                  <LockIcon />
                </span>
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-charcoal">Contact details</h2>
                  <p className="mt-1 text-charcoal/60">
                    Name and numbers unlock when you and this member are both
                    verified.
                  </p>
                </div>
                <Button onClick={viewContacts} loading={revealing}>
                  View contact details
                </Button>
              </div>
            )}
          </div>
        </ScreenshotGuard>
      </div>
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-coral">
      {children}
    </h2>
  );
}

function LockIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6" aria-hidden="true">
      <rect x="5" y="11" width="14" height="10" rx="2" />
      <path d="M8 11V7a4 4 0 0 1 8 0v4" />
    </svg>
  );
}

function DetailSection({
  title,
  rows,
}: {
  title: string;
  rows: [string, string | null | undefined][];
}) {
  return (
    <section>
      <SectionTitle>{title}</SectionTitle>
      <dl className="divide-y divide-charcoal/10 border-y border-charcoal/10">
        {rows.map(([label, value]) => (
          <div key={label} className="flex justify-between gap-3 py-3">
            <dt className="text-charcoal/55">{label}</dt>
            <dd className="text-right font-semibold text-charcoal">{value || "N/A"}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

function ContactRow({ label, value }: { label: string; value: string | null }) {
  if (!value) return null;
  return (
    <div className="flex justify-between gap-3 py-3">
      <dt className="text-charcoal/55">{label}</dt>
      <dd className="font-bold text-charcoal">{value}</dd>
    </div>
  );
}
