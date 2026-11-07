"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase";
import { ProfileCard } from "@/components/profile/profile-card";
import { ProfileCardSkeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import type { PublicProfile } from "@/types";

const SHOW = 6;

/**
 * Live members for a city page. Visitors see the same blurred preview cards
 * as /search; signed-in members get normal cards that open the profile.
 */
export function CityMembers({
  cityName,
  aliases,
  country,
}: {
  cityName: string;
  aliases: string[];
  country: string;
}) {
  const [profiles, setProfiles] = useState<PublicProfile[] | null>(null);
  const [total, setTotal] = useState(0);
  const [member, setMember] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const supabase = createClient();
      const [{ data: auth }, { data, count }] = await Promise.all([
        supabase.auth.getSession(),
        supabase
          .from("public_profiles")
          .select("*", { count: "exact" })
          .overlaps("city", aliases)
          .order("created_at", { ascending: false })
          .limit(SHOW),
      ]);
      if (cancelled) return;
      setMember(!!auth.session);
      setProfiles((data ?? []) as PublicProfile[]);
      setTotal(count ?? 0);
    })();
    return () => {
      cancelled = true;
    };
  }, [aliases]);

  const browseHref = `/search?country=${encodeURIComponent(country)}`;

  if (profiles === null) {
    return (
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <ProfileCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (profiles.length === 0) {
    return (
      <div className="rounded-2xl bg-white px-6 py-10 text-center shadow-sm">
        <h3 className="text-xl font-bold text-charcoal">
          Be one of the first members in {cityName}
        </h3>
        <p className="mx-auto mt-2 max-w-md text-charcoal/60">
          Our {cityName} community is just starting. Create your free profile
          today, and browse members across {country} and worldwide in the
          meantime.
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
          <Link href="/register">
            <Button>Create Free Profile</Button>
          </Link>
          <Link href={browseHref} className="font-bold text-coral underline-offset-4 hover:underline">
            Browse {country}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <p className="mb-5 text-charcoal/70">
        {total} member{total === 1 ? "" : "s"} in and around {cityName}
      </p>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {profiles.map((p) => (
          <ProfileCard key={p.id} profile={p} preview={!member} />
        ))}
      </div>
      <div className="mt-8 text-center">
        <Link href={member ? browseHref : "/register"}>
          <Button variant="outline">
            {member ? `Browse all of ${country}` : "Join free to see full profiles"}
          </Button>
        </Link>
      </div>
    </div>
  );
}
