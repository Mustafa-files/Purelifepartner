"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { ProfileCard } from "@/components/profile/profile-card";
import { ProfileCardSkeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
  AGE_MAX,
  AGE_MIN,
  DEFAULT_FILTERS,
  SearchFilters,
  type SearchFilterState,
} from "@/components/search/search-filters";
import { countriesForRegions } from "@/lib/constants";
import { PENDING_SEARCH_KEY } from "@/components/home/hero-search";
import { toast } from "@/components/ui/toast";
import type { PublicProfile } from "@/types";

const PAGE_SIZE = 24;
/** Visitors without an account see this many cards, then a join card */
const PREVIEW_SIZE = 6;

const SORTS = {
  newest: "Newest",
  verified: "Verified first",
  youngest: "Youngest first",
} as const;
type Sort = keyof typeof SORTS;

/** Array filters that become one removable chip per value */
const ARRAY_KEYS = [
  "religions",
  "sects",
  "castes",
  "regions",
  "countries",
  "cities",
  "qualifications",
  "professions",
] as const;

function buildQuery(f: SearchFilterState, sort: Sort, from: number, size = PAGE_SIZE) {
  const supabase = createClient();
  let query = supabase
    .from("public_profiles")
    .select("*", { count: "exact" })
    .gte("age", f.minAge)
    .lte("age", f.maxAge);

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
    query = query.overlaps("residence_country", countriesForRegions(f.regions));
  }

  // "Verified" sorts after "To Be Verified", so descending puts it first
  if (sort === "verified") query = query.order("status", { ascending: false });
  if (sort === "youngest") query = query.order("age", { ascending: true });
  query = query.order("created_at", { ascending: false });

  return query.range(from, from + size - 1);
}

export default function SearchPage() {
  const router = useRouter();
  // `draft` is what the filter panel is editing; `applied` is what the
  // results show (and what the chips describe)
  const [draft, setDraft] = useState<SearchFilterState>(DEFAULT_FILTERS);
  const [applied, setApplied] = useState<SearchFilterState>(DEFAULT_FILTERS);
  const [sort, setSort] = useState<Sort>("newest");
  const [profiles, setProfiles] = useState<PublicProfile[]>([]);
  const [total, setTotal] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [idQuery, setIdQuery] = useState("");
  // null until we know; visitors get the preview
  const [member, setMember] = useState<boolean | null>(null);

  const runSearch = useCallback(async (f: SearchFilterState, s: Sort) => {
    setLoading(true);
    setApplied(f);
    setDraft(f);
    const { data: auth } = await createClient().auth.getSession();
    const isMember = !!auth.session;
    setMember(isMember);
    const { data, error, count } = await buildQuery(f, s, 0, isMember ? PAGE_SIZE : PREVIEW_SIZE);
    if (error) {
      toast("Search failed: " + error.message, "error");
      setProfiles([]);
      setTotal(0);
    } else {
      setProfiles((data ?? []) as PublicProfile[]);
      setTotal(count ?? null);
    }
    setLoading(false);
  }, []);

  async function loadMore() {
    setLoadingMore(true);
    const { data, error } = await buildQuery(applied, sort, profiles.length);
    if (error) toast("Couldn't load more profiles. Try again.", "error");
    else setProfiles((prev) => [...prev, ...((data ?? []) as PublicProfile[])]);
    setLoadingMore(false);
  }

  // Start from the homepage search sentence when it sent us here
  // (/search?gender=Female&minAge=25&maxAge=30&country=United+Kingdom)
  useEffect(() => {
    let q = new URLSearchParams(window.location.search);
    // No query: use a homepage search saved before the member signed up
    if (![...q.keys()].length) {
      try {
        const pending = localStorage.getItem(PENDING_SEARCH_KEY);
        if (pending) {
          q = new URLSearchParams(pending);
          localStorage.removeItem(PENDING_SEARCH_KEY);
        }
      } catch {
        // Storage blocked: default search
      }
    }
    const num = (key: string, fallback: number) => {
      const n = Number(q.get(key));
      return Number.isFinite(n) && n >= AGE_MIN && n <= AGE_MAX ? n : fallback;
    };
    const gender = q.get("gender");
    const country = q.get("country");
    runSearch(
      {
        ...DEFAULT_FILTERS,
        gender: gender === "Female" || gender === "Male" ? gender : "",
        minAge: num("minAge", DEFAULT_FILTERS.minAge),
        maxAge: num("maxAge", DEFAULT_FILTERS.maxAge),
        countries: country ? [country] : [],
      },
      "newest"
    );
  }, [runSearch]);

  // Lock page scrolling behind the phone filter sheet
  useEffect(() => {
    document.body.style.overflow = sheetOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [sheetOpen]);

  /** Keep the visitor's current search for their first visit as a member */
  function rememberSearch() {
    const q = new URLSearchParams({
      gender: applied.gender,
      minAge: String(applied.minAge),
      maxAge: String(applied.maxAge),
    });
    if (!applied.gender) q.delete("gender");
    if (applied.countries[0]) q.set("country", applied.countries[0]);
    try {
      localStorage.setItem(PENDING_SEARCH_KEY, q.toString());
    } catch {
      // Storage blocked: they start from the default search
    }
  }

  async function findById(e: React.FormEvent) {
    e.preventDefault();
    const digits = idQuery.trim().toLowerCase().replace(/^plp[-\s]?/, "");
    if (!/^\d+$/.test(digits)) {
      toast("Enter a Profile ID like PLP-100178", "error");
      return;
    }
    const supabase = createClient();
    const { data } = await supabase
      .from("public_profiles")
      .select("id")
      .eq("internal_id", Number(digits))
      .maybeSingle();
    if (data?.id) router.push(`/profile/${data.id}`);
    else toast(`No profile found with ID PLP-${digits}`, "error");
  }

  // One chip per active filter value, each with its own "remove"
  const chips: { label: string; remove: () => SearchFilterState }[] = [];
  if (applied.gender)
    chips.push({ label: applied.gender, remove: () => ({ ...applied, gender: "" }) });
  if (applied.minAge !== DEFAULT_FILTERS.minAge || applied.maxAge !== DEFAULT_FILTERS.maxAge)
    chips.push({
      label: `${applied.minAge} to ${applied.maxAge}`,
      remove: () => ({ ...applied, minAge: DEFAULT_FILTERS.minAge, maxAge: DEFAULT_FILTERS.maxAge }),
    });
  if (applied.maritalStatus)
    chips.push({ label: applied.maritalStatus, remove: () => ({ ...applied, maritalStatus: "" }) });
  for (const key of ARRAY_KEYS) {
    for (const value of applied[key]) {
      chips.push({
        label: value,
        remove: () => ({ ...applied, [key]: applied[key].filter((v) => v !== value) }),
      });
    }
  }

  const filterPanel = (bare: boolean) => (
    <SearchFilters
      bare={bare}
      filters={draft}
      onChange={setDraft}
      onApply={() => {
        setSheetOpen(false);
        runSearch(draft, sort);
      }}
      onReset={() => {
        setSheetOpen(false);
        runSearch(DEFAULT_FILTERS, sort);
      }}
      loading={loading}
    />
  );

  const hasMore = total != null && profiles.length < total;

  return (
    <div className="bg-off-white py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-charcoal sm:text-4xl">Browse profiles</h1>
          <p className="mt-1 text-charcoal/60">
            Contact details stay hidden until both members are verified
          </p>
        </div>

        {/* Profile ID lookup, plus the filter button on phones */}
        <div className="mb-4 flex gap-3">
          <form onSubmit={findById} className="relative flex-1">
            <SearchIcon />
            <input
              value={idQuery}
              onChange={(e) => setIdQuery(e.target.value)}
              placeholder="Search by Profile ID, like PLP-100178"
              aria-label="Search by Profile ID"
              inputMode="text"
              className="h-12 w-full rounded-full border border-gray-200 bg-white pl-11 pr-4 text-charcoal outline-none transition-colors placeholder:text-charcoal/40 focus:border-coral"
            />
          </form>
          <button
            type="button"
            onClick={() => setSheetOpen(true)}
            className="flex h-12 shrink-0 cursor-pointer items-center gap-2 rounded-full border border-gray-200 bg-white px-4 font-bold text-charcoal lg:hidden"
          >
            <FilterIcon />
            Filters{chips.length > 0 && <span className="text-coral">· {chips.length}</span>}
          </button>
        </div>

        <div className="grid gap-8 lg:grid-cols-[300px_1fr]">
          <div className="hidden lg:block">{filterPanel(false)}</div>

          <div>
            {/* Active filters as removable chips */}
            {chips.length > 0 && (
              <div className="mb-4 flex flex-wrap items-center gap-2">
                {chips.map((c) => (
                  <button
                    key={c.label}
                    type="button"
                    onClick={() => runSearch(c.remove(), sort)}
                    className="flex cursor-pointer items-center gap-1.5 rounded-full bg-coral/10 px-3 py-1.5 text-sm font-semibold text-coral transition-colors hover:bg-coral/20"
                    aria-label={`Remove filter ${c.label}`}
                  >
                    {c.label}
                    <span aria-hidden="true">×</span>
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => runSearch(DEFAULT_FILTERS, sort)}
                  className="cursor-pointer px-2 text-sm font-semibold text-charcoal/60 hover:text-coral"
                >
                  Clear all
                </button>
              </div>
            )}

            {/* Count and sort */}
            <div className="mb-5 flex items-center justify-between border-b border-charcoal/10 pb-3">
              <span className="font-bold text-charcoal">
                {loading ? "Searching…" : `${total ?? profiles.length} profile${(total ?? profiles.length) === 1 ? "" : "s"}`}
              </span>
              <label className="flex items-center gap-2 text-sm text-charcoal/60">
                Sort
                <select
                  value={sort}
                  onChange={(e) => {
                    const s = e.target.value as Sort;
                    setSort(s);
                    runSearch(applied, s);
                  }}
                  className="cursor-pointer rounded-full border border-gray-200 bg-white px-3 py-1.5 font-semibold text-charcoal outline-none focus:border-coral"
                >
                  {Object.entries(SORTS).map(([k, v]) => (
                    <option key={k} value={k}>
                      {v}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            {loading ? (
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <ProfileCardSkeleton key={i} />
                ))}
              </div>
            ) : profiles.length === 0 ? (
              <div className="rounded-2xl bg-white px-6 py-12 text-center shadow-sm sm:p-16">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/illustrations/parents-phone.svg" alt="" className="mx-auto w-full max-w-[280px]" />
                <h2 className="mt-4 text-xl font-bold text-charcoal">No profiles found</h2>
                <p className="mt-2 text-charcoal/60">
                  Try removing a filter, or check back soon as new members join every day.
                </p>
              </div>
            ) : (
              <>
                <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                  {profiles.map((p) => (
                    <ProfileCard
                      key={p.id}
                      profile={p}
                      preview={member === false}
                      onPreviewClick={rememberSearch}
                    />
                  ))}
                </div>
                {member === false && (
                  <JoinCard
                    more={Math.max(0, (total ?? profiles.length) - profiles.length)}
                    onJoin={rememberSearch}
                  />
                )}
                {member !== false && hasMore && (
                  <div className="mt-10 text-center">
                    <Button variant="outline" onClick={loadMore} loading={loadingMore}>
                      Load more
                    </Button>
                    <p className="mt-2 text-sm text-charcoal/50">
                      Showing {profiles.length} of {total}
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Phones: filters slide up from the bottom */}
      <div
        className={`fixed inset-0 z-[60] bg-black/40 transition-opacity lg:hidden ${sheetOpen ? "opacity-100" : "pointer-events-none opacity-0"}`}
        onClick={() => setSheetOpen(false)}
        aria-hidden="true"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Filters"
        className={`fixed inset-x-0 bottom-0 z-[61] max-h-[85vh] overflow-y-auto rounded-t-3xl bg-white px-5 pb-8 pt-3 shadow-2xl transition-transform duration-300 lg:hidden ${sheetOpen ? "translate-y-0" : "translate-y-full"}`}
      >
        <div className="mx-auto mb-3 h-1.5 w-12 rounded-full bg-charcoal/15" />
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-charcoal">Filters</h2>
          <button
            type="button"
            onClick={() => setSheetOpen(false)}
            className="cursor-pointer text-2xl leading-none text-charcoal/60"
            aria-label="Close filters"
          >
            ×
          </button>
        </div>
        {filterPanel(true)}
      </div>
    </div>
  );
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-charcoal/40" aria-hidden="true">
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}

function FilterIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" className="h-5 w-5" aria-hidden="true">
      <path d="M4 6h16M7 12h10M10 18h4" />
    </svg>
  );
}

/** Shown to visitors under the preview cards */
function JoinCard({ more, onJoin }: { more: number; onJoin: () => void }) {
  return (
    <div className="mt-8 rounded-2xl bg-white px-6 py-10 text-center shadow-sm sm:px-10">
      <h2 className="text-2xl font-bold text-charcoal sm:text-3xl">
        {more > 0
          ? `${more} more profile${more === 1 ? "" : "s"} match your search`
          : "See full profiles and photos"}
      </h2>
      <p className="mx-auto mt-2 max-w-md text-charcoal/60">
        Join free to see photos, open profiles and save the ones you like.
        Your name stays private.
      </p>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
        <Link href="/register?from=search" onClick={onJoin}>
          <Button size="lg">Create free account</Button>
        </Link>
        <Link
          href="/login?next=/search"
          onClick={onJoin}
          className="font-bold text-coral underline-offset-4 hover:underline"
        >
          Sign in
        </Link>
      </div>
    </div>
  );
}
