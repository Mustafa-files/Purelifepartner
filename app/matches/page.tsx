"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { ProfileCard } from "@/components/profile/profile-card";
import { ProfileCardSkeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { countriesForRegions } from "@/lib/constants";
import { notifyNewMatches } from "@/lib/notify";
import type { PublicProfile, Requirements } from "@/types";

// Sentinel "All X" values mean "no restriction", so they are ignored.
function real(values: string[] | null | undefined): string[] {
  return (values ?? []).filter((v) => !v.startsWith("All "));
}

export default function MatchesPage() {
  const router = useRouter();
  const [profiles, setProfiles] = useState<PublicProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasRequirements, setHasRequirements] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) {
        router.replace("/login?next=/matches");
        return;
      }

      const [{ data: me }, { data: req }] = await Promise.all([
        supabase.from("profiles").select("gender").eq("id", data.user.id).single(),
        supabase
          .from("requirements")
          .select("*")
          .eq("profile_id", data.user.id)
          .maybeSingle(),
      ]);

      if (!req) {
        setHasRequirements(false);
        setLoading(false);
        return;
      }

      const r = req as Requirements;
      let query = supabase
        .from("public_profiles")
        .select("*")
        .neq("id", data.user.id)
        .gte("age", r.min_age ?? 16)
        .lte("age", r.max_age ?? 60)
        .order("status", { ascending: true }) // Verified members surface first
        .order("created_at", { ascending: false })
        .limit(60);

      // Show the opposite gender only.
      const oppositeGender =
        me?.gender === "Male" ? "Female" : me?.gender === "Female" ? "Male" : null;
      if (oppositeGender) query = query.eq("gender", oppositeGender);

      const religions = real(r.religions);
      const sects = real(r.sects);
      const castes = real(r.castes);
      const qualifications = real(r.qualifications);
      const professions = real(r.professions);
      const cities = real(r.cities);
      const countries = real(r.countries);
      const regions = real(r.regions);

      if (religions.length) query = query.in("religion", religions);
      if (sects.length) query = query.in("sect", sects);
      if (castes.length) query = query.in("caste", castes);
      if (qualifications.length) query = query.in("qualification", qualifications);
      if (professions.length) query = query.overlaps("profession", professions);

      if (cities.length) {
        query = query.overlaps("city", cities);
      } else if (countries.length) {
        query = query.overlaps("residence_country", countries);
      } else if (regions.length) {
        query = query.overlaps("residence_country", countriesForRegions(regions));
      }

      const { data: rows } = await query;
      const matches = (rows ?? []) as PublicProfile[];
      setProfiles(matches);
      setLoading(false);

      // Best effort notification about the new matches; never blocks the page.
      if (matches.length > 0) {
        notifyNewMatches(data.user.id, matches.length);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="bg-off-white py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-charcoal">Your Matches</h1>
          <p className="mt-1 text-charcoal/60">
            Profiles that fit the partner requirements you just saved. Contact
            details stay hidden until both members are verified.
          </p>
        </div>

        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <ProfileCardSkeleton key={i} />
            ))}
          </div>
        ) : !hasRequirements ? (
          <div className="rounded-2xl bg-white p-16 text-center shadow-sm">
            <div className="text-5xl">📝</div>
            <h2 className="mt-4 text-xl font-bold text-charcoal">
              Set your requirements first
            </h2>
            <p className="mt-2 text-charcoal/60">
              Tell us what you are looking for and we will find compatible
              matches automatically.
            </p>
            <Link href="/register/requirements" className="mt-6 inline-block">
              <Button>Set Partner Requirements</Button>
            </Link>
          </div>
        ) : profiles.length === 0 ? (
          <div className="rounded-2xl bg-white p-16 text-center shadow-sm">
            <div className="text-5xl">🔍</div>
            <h2 className="mt-4 text-xl font-bold text-charcoal">
              No matches just yet
            </h2>
            <p className="mt-2 text-charcoal/60">
              No current profiles fit every requirement. Try widening your
              preferences, or check back as new members join every day.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link href="/register/requirements">
                <Button variant="outline">Adjust Requirements</Button>
              </Link>
              <Link href="/search">
                <Button>Browse All Profiles</Button>
              </Link>
            </div>
          </div>
        ) : (
          <>
            <p className="mb-4 text-sm font-semibold text-coral">
              {profiles.length} match{profiles.length === 1 ? "" : "es"} found
            </p>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {profiles.map((p) => (
                <ProfileCard key={p.id} profile={p} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
