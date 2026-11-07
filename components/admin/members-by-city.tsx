"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { CITIES, type City } from "@/lib/cities";

const NEW_DAYS = 30;

type Row = {
  key: string;
  name: string;
  /** The raw spellings members typed that were grouped into this row */
  spellings: Set<string>;
  countries: Map<string, number>;
  members: number;
  recent: number;
  page?: City;
};

// Alias (lowercase) -> landing page city, so "East London" counts as London
const ALIAS_TO_CITY = new Map<string, City>();
for (const c of CITIES) for (const a of c.aliases) ALIAS_TO_CITY.set(a.toLowerCase(), c);

/** "karachi ( Family residence)" -> "Karachi" */
function cleanCity(raw: string) {
  const s = raw.replace(/\(.*?\)/g, "").replace(/\s+/g, " ").trim();
  return s.replace(/\b\w/g, (ch) => ch.toUpperCase());
}

function topCountry(m: Map<string, number>) {
  let best = "";
  let n = 0;
  for (const [k, v] of m) if (v > n) [best, n] = [k, v];
  return best;
}

/**
 * Admin report: where members live, grouped the same way as the city
 * landing pages, so cities with demand but no page stand out.
 */
export function MembersByCity() {
  const [profiles, setProfiles] = useState<
    { city: string[] | null; residence_country: string[] | null; created_at: string }[] | null
  >(null);
  const [onlyMissing, setOnlyMissing] = useState(false);
  const [view, setView] = useState<"cities" | "countries">("cities");

  useEffect(() => {
    createClient()
      .from("profiles")
      .select("city, residence_country, created_at")
      .eq("role", "user")
      .then(({ data }) => setProfiles(data ?? []));
  }, []);

  const { cities, countries, total, totalRecent, noCity } = useMemo(() => {
    const cutoff = Date.now() - NEW_DAYS * 24 * 60 * 60 * 1000;
    const byCity = new Map<string, Row>();
    const byCountry = new Map<string, { members: number; recent: number }>();
    let totalRecent = 0;
    let noCity = 0;

    for (const p of profiles ?? []) {
      const isRecent = new Date(p.created_at).getTime() >= cutoff;
      if (isRecent) totalRecent++;
      const country = p.residence_country?.[0]?.trim() || "Not set";

      const cc = byCountry.get(country) ?? { members: 0, recent: 0 };
      cc.members++;
      if (isRecent) cc.recent++;
      byCountry.set(country, cc);

      const raw = (p.city ?? []).map((c) => c.trim()).filter(Boolean);
      if (raw.length === 0) {
        noCity++;
        continue;
      }
      // Count each member once per group, even with several city entries
      const seen = new Set<string>();
      for (const r of raw) {
        const cleaned = cleanCity(r);
        const page = ALIAS_TO_CITY.get(cleaned.toLowerCase());
        const key = page ? `page:${page.slug}` : cleaned.toLowerCase();
        if (seen.has(key)) continue;
        seen.add(key);
        const row: Row = byCity.get(key) ?? {
          key,
          name: page?.name ?? cleaned,
          spellings: new Set(),
          countries: new Map(),
          members: 0,
          recent: 0,
          page,
        };
        row.spellings.add(cleaned);
        row.countries.set(country, (row.countries.get(country) ?? 0) + 1);
        row.members++;
        if (isRecent) row.recent++;
        byCity.set(key, row);
      }
    }

    const cities = [...byCity.values()].sort(
      (a, b) => b.members - a.members || b.recent - a.recent || a.name.localeCompare(b.name)
    );
    const countries = [...byCountry.entries()]
      .map(([name, v]) => ({ name, ...v }))
      .sort((a, b) => b.members - a.members || a.name.localeCompare(b.name));
    return { cities, countries, total: profiles?.length ?? 0, totalRecent, noCity };
  }, [profiles]);

  if (profiles === null) {
    return <Skeleton className="h-96 w-full rounded-2xl" />;
  }

  const shown = onlyMissing ? cities.filter((c) => !c.page) : cities;
  const pagesWithMembers = cities.filter((c) => c.page).length;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-4">
        <Stat label="Members" value={total} />
        <Stat label={`New in last ${NEW_DAYS} days`} value={totalRecent} />
        <Stat label="City pages with members" value={`${pagesWithMembers} of ${CITIES.length}`} />
        <Stat label="Members with no city" value={noCity} />
      </div>

      <div className="overflow-x-auto rounded-2xl bg-white p-6 shadow-sm">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex gap-2">
            {(["cities", "countries"] as const).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={cn(
                  "cursor-pointer rounded-full px-4 py-1.5 text-sm font-bold capitalize transition-colors",
                  view === v ? "bg-coral text-white" : "bg-off-white text-charcoal hover:bg-coral/10"
                )}
              >
                By {v === "cities" ? "city" : "country"}
              </button>
            ))}
          </div>
          {view === "cities" && (
            <label className="flex cursor-pointer items-center gap-2 text-sm text-charcoal/70">
              <input
                type="checkbox"
                checked={onlyMissing}
                onChange={(e) => setOnlyMissing(e.target.checked)}
                className="accent-coral"
              />
              Only cities without a landing page
            </label>
          )}
        </div>

        {view === "cities" ? (
          shown.length === 0 ? (
            <p className="text-sm text-charcoal/50">No cities to show.</p>
          ) : (
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-xs uppercase tracking-wide text-charcoal/50">
                  <th className="py-2 pr-3">City</th>
                  <th className="py-2 pr-3">Country</th>
                  <th className="py-2 pr-3 text-right">Members</th>
                  <th className="py-2 pr-3 text-right">New ({NEW_DAYS}d)</th>
                  <th className="py-2">Landing page</th>
                </tr>
              </thead>
              <tbody>
                {shown.map((r) => {
                  const others = [...r.spellings].filter((s) => s !== r.name);
                  return (
                    <tr key={r.key} className="border-b border-gray-50 align-top">
                      <td className="py-2.5 pr-3">
                        <span className="font-bold">{r.name}</span>
                        {others.length > 0 && (
                          <span className="block text-xs text-charcoal/50">
                            Includes {others.join(", ")}
                          </span>
                        )}
                      </td>
                      <td className="py-2.5 pr-3">{topCountry(r.countries)}</td>
                      <td className="py-2.5 pr-3 text-right font-bold">{r.members}</td>
                      <td className="py-2.5 pr-3 text-right">
                        {r.recent > 0 ? (
                          <span className="font-bold text-green-700">+{r.recent}</span>
                        ) : (
                          <span className="text-charcoal/40">0</span>
                        )}
                      </td>
                      <td className="py-2.5">
                        {r.page ? (
                          <Link
                            href={`/muslim-marriage/${r.page.slug}`}
                            target="_blank"
                            className="font-bold text-coral hover:underline"
                          >
                            View page
                          </Link>
                        ) : (
                          <span className="rounded-full bg-gold/15 px-2.5 py-1 text-xs font-bold text-charcoal/70">
                            No page yet
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )
        ) : (
          <table className="w-full min-w-[420px] text-left text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-xs uppercase tracking-wide text-charcoal/50">
                <th className="py-2 pr-3">Country</th>
                <th className="py-2 pr-3 text-right">Members</th>
                <th className="py-2 text-right">New ({NEW_DAYS}d)</th>
              </tr>
            </thead>
            <tbody>
              {countries.map((c) => (
                <tr key={c.name} className="border-b border-gray-50">
                  <td className="py-2.5 pr-3 font-bold">{c.name}</td>
                  <td className="py-2.5 pr-3 text-right font-bold">{c.members}</td>
                  <td className="py-2.5 text-right">
                    {c.recent > 0 ? (
                      <span className="font-bold text-green-700">+{c.recent}</span>
                    ) : (
                      <span className="text-charcoal/40">0</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <p className="mt-4 text-xs text-charcoal/50">
          Cities are grouped the same way as the landing pages, so East and
          North London count as London and Rawalpindi counts as Islamabad.
          Cities near the top marked &quot;No page yet&quot; are the best
          candidates for the next landing pages.
        </p>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm">
      <p className="text-xs font-bold uppercase tracking-wide text-charcoal/50">{label}</p>
      <p className="mt-1 text-2xl font-extrabold text-charcoal">{value}</p>
    </div>
  );
}
