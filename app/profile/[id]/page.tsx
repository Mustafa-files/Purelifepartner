"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { ScreenshotGuard } from "@/components/ui/screenshot-guard";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/toast";
import { formatHeight } from "@/lib/utils";
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
        <div className="text-5xl">🫥</div>
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

  return (
    <div className="bg-off-white py-10">
      <div className="mx-auto max-w-3xl px-4">
        {/* Header */}
        <ScreenshotGuard>
          <div className="rounded-2xl bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-wrap items-center gap-5">
            {profile.avatar_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={profile.avatar_url}
                alt={profile.user_id_handle ?? "Profile"}
                className="h-24 w-24 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-coral/15 text-4xl">
                {profile.gender === "Female" ? "🌸" : "🌙"}
              </div>
            )}
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-bold text-charcoal">
                  {profile.user_id_handle ?? `Member ${profile.internal_id}`}
                </h1>
                {profile.status === "Verified" ? (
                  <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">
                    ✓ Verified
                  </span>
                ) : (
                  <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-700">
                    Verification pending
                  </span>
                )}
              </div>
              <p className="mt-1 text-charcoal/60">
                Profile No. {profile.internal_id}
                {profile.age != null && ` · ${profile.age} years`}
                {location && ` · ${location}`}
              </p>
            </div>
          </div>

          {profile.describe_yourself && (
            <p className="mt-6 leading-relaxed text-charcoal/80">
              {profile.describe_yourself}
            </p>
          )}
          </div>
        </ScreenshotGuard>

        {/* Video introduction */}
        {profile.video_url && (
          <div className="mt-6 rounded-2xl bg-white p-6 shadow-sm sm:p-8">
            <h2 className="mb-4 text-lg font-bold text-charcoal">
              Video Introduction
            </h2>
            <video
              src={profile.video_url}
              controls
              preload="metadata"
              className="w-full rounded-xl bg-black"
            />
          </div>
        )}

        {/* Details grid */}
        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          <DetailCard
            title="Basic Information"
            rows={[
              ["Gender", profile.gender],
              ["Age", profile.age?.toString()],
              ["Height", formatHeight(profile.height_ft, profile.height_in, profile.height_cm)],
              ["Marital Status", profile.marital_status],
            ]}
          />
          <DetailCard
            title="Religion & Caste"
            rows={[
              ["Religion", profile.religion],
              ["Sect", profile.sect],
              ["Caste", profile.caste],
              ["Sub Caste", profile.sub_caste],
            ]}
          />
          <DetailCard
            title="Education & Work"
            rows={[
              ["Qualification", profile.qualification],
              ["Profession", profile.profession?.join(", ")],
            ]}
          />
          <DetailCard
            title="Location"
            rows={[
              ["Nationality", profile.nationality?.join(", ")],
              ["Country", profile.residence_country?.join(", ")],
              ["City", profile.city?.join(", ")],
            ]}
          />
        </div>

        {/* Contact details gate */}
        <ScreenshotGuard>
        <div className="mt-6 rounded-2xl bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-lg font-bold text-charcoal">Contact Details</h2>
          {contacts ? (
            <dl className="mt-4 space-y-2 text-sm">
              <ContactRow label="Candidate" value={contacts.candidate_contact} />
              <ContactRow label="Father" value={contacts.father_contact} />
              <ContactRow label="Mother" value={contacts.mother_contact} />
              <ContactRow label="WhatsApp" value={contacts.whatsapp_no} />
            </dl>
          ) : (
            <>
              <p className="mt-2 text-sm text-charcoal/60">
                🔒 Phone numbers are visible only when both you and this member
                are verified. Unverified? You will be guided to the payment
                page.
              </p>
              <Button className="mt-4" onClick={viewContacts} loading={revealing}>
                View Contact Details
              </Button>
            </>
          )}
        </div>
        </ScreenshotGuard>
      </div>
    </div>
  );
}

function DetailCard({
  title,
  rows,
}: {
  title: string;
  rows: [string, string | null | undefined][];
}) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-lg font-bold text-charcoal">{title}</h2>
      <dl className="space-y-2 text-sm">
        {rows.map(([label, value]) => (
          <div key={label} className="flex justify-between gap-3">
            <dt className="text-charcoal/50">{label}</dt>
            <dd className="text-right font-semibold text-charcoal">
              {value || "N/A"}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

function ContactRow({ label, value }: { label: string; value: string | null }) {
  if (!value) return null;
  return (
    <div className="flex justify-between gap-3">
      <dt className="text-charcoal/50">{label}</dt>
      <dd className="font-bold text-charcoal">{value}</dd>
    </div>
  );
}
