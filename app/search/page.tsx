"use client";

import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";
import { ProfileCard } from "@/components/profile/profile-card";
import { ProfileCardSkeleton } from "@/components/ui/skeleton";
import {
  DEFAULT_FILTERS,
  SearchFilters,
  type SearchFilterState,
} from "@/components/search/search-filters";
import { countriesForRegions } from "@/lib/constants";
import { toast } from "@/components/ui/toast";
import type { PublicProfile } from "@/types";

export default function SearchPage() {
  const [filters, setFilters] = useState<SearchFilterState>(DEFAULT_FILTERS);
  const [profiles, setProfiles] = useState<PublicProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  const runSearch = useCallback(async (f: SearchFilterState) => {
    setLoading(true);
    const supabase = createClient();
    let query = supabase
      .from("public_profiles")
      .select("*")
      .gte("age", f.minAge)
      .lte("age", f.maxAge)
      .order("created_at", { ascending: false })
      .limit(60);

    if (f.gender) query = query.eq("gender", f.gender);
    if (f.maritalStatus) query = query.eq("marital_status", f.maritalStatus);
    if (f.religions.length) query = query.in("religion", f.religions);
    if (f.sects.length) query = query.in("sect", f.sects);
    if (f.castes.length) query = query.in("caste", f.castes);
    if (f.qualifications.length) query = query.in("qualification", f.qualifications);
    if (f.professions.length) query = query.overlaps("profession", f.professions);
    if (f.cities.length) {
      query = query.overlaps("city", f.cities);
    } else if (f.countries.length) {
      query = query.overlaps("residence_country", f.countries);
    } else if (f.regions.length) {
      query = query.overlaps(
        "residence_country",
        countriesForRegions(f.regions)
      );
    }

    const { data, error } = await query;
    if (error) {
      toast("Search failed: " + error.message, "error");
      setProfiles([]);
    } else {
      setProfiles((data ?? []) as PublicProfile[]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    runSearch(DEFAULT_FILTERS);
  }, [runSearch]);

  return (
    <div className="bg-off-white py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-charcoal">
              Browse Profiles
            </h1>
            <p className="mt-1 text-charcoal/60">
              Contact details stay hidden until both members are verified
            </p>
          </div>
          <button
            className="cursor-pointer rounded-full border-2 border-coral px-5 py-2 text-sm font-bold text-coral lg:hidden"
            onClick={() => setShowFilters(!showFilters)}
          >
            {showFilters ? "Hide Filters" : "Show Filters"}
          </button>
        </div>

        <div className="grid gap-8 lg:grid-cols-[300px_1fr]">
          <div className={showFilters ? "block" : "hidden lg:block"}>
            <SearchFilters
              filters={filters}
              onChange={setFilters}
              onApply={() => runSearch(filters)}
              onReset={() => {
                setFilters(DEFAULT_FILTERS);
                runSearch(DEFAULT_FILTERS);
              }}
              loading={loading}
            />
          </div>

          <div>
            {loading ? (
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <ProfileCardSkeleton key={i} />
                ))}
              </div>
            ) : profiles.length === 0 ? (
              <div className="rounded-2xl bg-white p-16 text-center shadow-sm">
                <div className="text-5xl">🔍</div>
                <h2 className="mt-4 text-xl font-bold text-charcoal">
                  No profiles found
                </h2>
                <p className="mt-2 text-charcoal/60">
                  Try widening your filters, or check back soon as new members
                  join every day.
                </p>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {profiles.map((p) => (
                  <ProfileCard key={p.id} profile={p} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
