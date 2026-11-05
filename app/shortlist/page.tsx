"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { ProfileCard } from "@/components/profile/profile-card";
import { ProfileCardSkeleton } from "@/components/ui/skeleton";
import { useShortlist } from "@/components/profile/shortlist";
import { Button } from "@/components/ui/button";
import type { PublicProfile } from "@/types";

/** Profiles the member saved with the heart, newest first */
export default function ShortlistPage() {
  const router = useRouter();
  const saved = useShortlist();
  const [profiles, setProfiles] = useState<PublicProfile[] | null>(null);

  useEffect(() => {
    (async () => {
      const supabase = createClient();
      const { data: auth } = await supabase.auth.getUser();
      if (!auth.user) {
        router.push("/login?next=/shortlist");
        return;
      }
      const { data: rows } = await supabase
        .from("shortlists")
        .select("profile_id")
        .order("created_at", { ascending: false });
      const ids = (rows ?? []).map((r) => r.profile_id as string);
      if (!ids.length) {
        setProfiles([]);
        return;
      }
      const { data } = await supabase.from("public_profiles").select("*").in("id", ids);
      const byId = new Map((data ?? []).map((p) => [p.id, p as PublicProfile]));
      setProfiles(ids.map((id) => byId.get(id)).filter(Boolean) as PublicProfile[]);
    })();
  }, [router]);

  // Hide a card as soon as its heart is turned off (only ids the shared
  // store has already reported, so nothing hides before it loads)
  const seen = useRef(new Set<string>());
  saved.forEach((id) => seen.current.add(id));
  const shown =
    profiles?.filter((p) => !(seen.current.has(p.id) && !saved.has(p.id))) ?? null;

  return (
    <div className="bg-off-white py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <h1 className="text-3xl font-bold text-charcoal sm:text-4xl">Your shortlist</h1>
        <p className="mt-1 mb-8 text-charcoal/60">
          Profiles you saved with the heart. Share any of them with your family.
        </p>

        {shown === null ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <ProfileCardSkeleton key={i} />
            ))}
          </div>
        ) : shown.length === 0 ? (
          <div className="rounded-2xl bg-white px-6 py-12 text-center shadow-sm sm:p-16">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/illustrations/parents-phone.svg" alt="" className="mx-auto w-full max-w-[280px]" />
            <h2 className="mt-4 text-xl font-bold text-charcoal">Save profiles you like</h2>
            <p className="mt-2 text-charcoal/60">
              Tap the heart on any profile to keep it here.
            </p>
            <Link href="/search" className="mt-6 inline-block">
              <Button>Browse profiles</Button>
            </Link>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {shown.map((p) => (
              <ProfileCard key={p.id} profile={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
