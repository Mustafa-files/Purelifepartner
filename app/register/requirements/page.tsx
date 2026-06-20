"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";
import { RegistrationShell } from "@/components/forms/registration-shell";
import { FieldLabel, Input, Textarea } from "@/components/ui/fields";
import { MultiSelect } from "@/components/ui/multi-select";
import { toast } from "@/components/ui/toast";
import {
  CASTES,
  LANGUAGES,
  PROFESSIONS,
  QUALIFICATIONS,
  REGIONS,
  RELIGIONS,
  SECTS_BY_RELIGION,
  SUB_CASTES_BY_CASTE,
  citiesForCountries,
  countriesForRegions,
} from "@/lib/constants";
import type { Profile } from "@/types";

export default function RegisterRequirements() {
  const [form, setForm] = useState({
    min_age: 16,
    max_age: 35,
    height_range: "",
    religions: [] as string[],
    sects: [] as string[],
    languages: [] as string[],
    castes: [] as string[],
    sub_castes: [] as string[],
    regions: [] as string[],
    countries: [] as string[],
    cities: [] as string[],
    qualifications: [] as string[],
    professions: [] as string[],
    others: "",
  });
  const [loaded, setLoaded] = useState(false);

  // Requirements live in their own table, so load them once on mount
  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) return;
      const { data: req } = await supabase
        .from("requirements")
        .select("*")
        .eq("profile_id", data.user.id)
        .maybeSingle();
      if (req) {
        setForm({
          min_age: req.min_age ?? 16,
          max_age: req.max_age ?? 35,
          height_range: req.height_range ?? "",
          religions: req.religions ?? [],
          sects: req.sects ?? [],
          languages: req.languages ?? [],
          castes: req.castes ?? [],
          sub_castes: req.sub_castes ?? [],
          regions: req.regions ?? [],
          countries: req.countries ?? [],
          cities: req.cities ?? [],
          qualifications: req.qualifications ?? [],
          professions: req.professions ?? [],
          others: req.others ?? "",
        });
      }
      setLoaded(true);
    });
  }, []);

  const sectOptions = Array.from(
    new Set(form.religions.flatMap((r) => SECTS_BY_RELIGION[r] ?? []))
  ).sort((a, b) => a.localeCompare(b));

  const subCasteOptions = Array.from(
    new Set(
      form.castes
        .filter((c) => c !== "All Castes")
        .flatMap((c) => SUB_CASTES_BY_CASTE[c] ?? [])
    )
  ).sort((a, b) => a.localeCompare(b));

  const allRegions = form.regions.includes("All Regions");
  const countryOptions = allRegions
    ? countriesForRegions(REGIONS)
    : countriesForRegions(form.regions);

  const allCountries = form.countries.includes("All Countries");
  const cityOptions = allCountries
    ? citiesForCountries(countryOptions)
    : citiesForCountries(form.countries);

  async function save(): Promise<boolean> {
    if (form.min_age > form.max_age) {
      toast("Minimum age cannot be greater than maximum age.", "error");
      return false;
    }
    const supabase = createClient();
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) return false;

    const { error } = await supabase.from("requirements").upsert(
      {
        profile_id: userData.user.id,
        min_age: form.min_age,
        max_age: form.max_age,
        height_range: form.height_range.trim() || null,
        religions: form.religions,
        sects: form.sects,
        languages: form.languages,
        castes: form.castes,
        sub_castes: form.sub_castes,
        regions: form.regions,
        countries: form.countries,
        cities: form.cities,
        qualifications: form.qualifications,
        professions: form.professions,
        others: form.others.trim() || null,
      },
      { onConflict: "profile_id" }
    );

    if (error) {
      toast(error.message, "error");
      return false;
    }
    await supabase
      .from("profiles")
      .update({ registration_step: 5 })
      .eq("id", userData.user.id);
    return true;
  }

  return (
    <RegistrationShell
      step={5}
      title="Your Requirements (Partner Preferences)"
      onSave={save}
      completionPath="/matches"
    >
      {() => {
        if (!loaded) return <div className="plp-skeleton h-64 rounded-xl" />;
        return (
          <>
            <div className="grid gap-5 sm:grid-cols-2">
              <FieldLabel label={`Minimum Age: ${form.min_age}`} required>
                <input
                  type="range"
                  min={16}
                  max={35}
                  value={form.min_age}
                  onChange={(e) =>
                    setForm({ ...form, min_age: parseInt(e.target.value, 10) })
                  }
                  className="w-full accent-[#D5453A]"
                />
              </FieldLabel>
              <FieldLabel label={`Maximum Age: ${form.max_age}`} required>
                <input
                  type="range"
                  min={16}
                  max={35}
                  value={form.max_age}
                  onChange={(e) =>
                    setForm({ ...form, max_age: parseInt(e.target.value, 10) })
                  }
                  className="w-full accent-[#D5453A]"
                />
              </FieldLabel>
            </div>

            <FieldLabel label="Height" hint="e.g. 5'2&quot; to 5'8&quot;">
              <Input
                value={form.height_range}
                onChange={(e) =>
                  setForm({ ...form, height_range: e.target.value })
                }
                placeholder="Preferred height range"
              />
            </FieldLabel>

            <FieldLabel label="Religion" required>
              <MultiSelect
                options={[...RELIGIONS].sort((a, b) => a.localeCompare(b))}
                value={form.religions}
                onChange={(v) => setForm({ ...form, religions: v, sects: [] })}
                placeholder="Select religions"
              />
            </FieldLabel>

            {sectOptions.length > 0 && (
              <FieldLabel label="Sect">
                <MultiSelect
                  options={sectOptions}
                  value={form.sects}
                  onChange={(v) => setForm({ ...form, sects: v })}
                  placeholder="Select sects"
                />
              </FieldLabel>
            )}

            <FieldLabel label="Language">
              <MultiSelect
                options={LANGUAGES}
                value={form.languages}
                onChange={(v) => setForm({ ...form, languages: v })}
                placeholder="Select languages"
              />
            </FieldLabel>

            <FieldLabel label="Caste">
              <MultiSelect
                options={CASTES.filter((c) => c !== "Others")}
                value={form.castes}
                onChange={(v) => setForm({ ...form, castes: v, sub_castes: [] })}
                placeholder="Select castes"
                allLabel="All Castes"
              />
            </FieldLabel>

            <FieldLabel label="Sub Caste">
              <MultiSelect
                options={subCasteOptions.filter((c) => c !== "Others")}
                value={form.sub_castes}
                onChange={(v) => setForm({ ...form, sub_castes: v })}
                placeholder={
                  form.castes.length === 0
                    ? "Select a caste first"
                    : "Select sub castes"
                }
                allLabel="All Sub Castes"
              />
            </FieldLabel>

            <FieldLabel label="Region" required>
              <MultiSelect
                options={REGIONS}
                value={form.regions}
                onChange={(v) =>
                  setForm({ ...form, regions: v, countries: [], cities: [] })
                }
                placeholder="Select regions"
                allLabel="All Regions"
              />
            </FieldLabel>

            <FieldLabel label="Country" hint="Filtered by selected regions">
              <MultiSelect
                options={countryOptions}
                value={form.countries}
                onChange={(v) => setForm({ ...form, countries: v, cities: [] })}
                placeholder={
                  form.regions.length === 0
                    ? "Select a region first"
                    : "Select countries"
                }
                allLabel="All Countries"
              />
            </FieldLabel>

            <FieldLabel label="Cities" hint="Filtered by selected countries">
              <MultiSelect
                options={cityOptions}
                value={form.cities}
                onChange={(v) => setForm({ ...form, cities: v })}
                placeholder={
                  form.countries.length === 0
                    ? "Select a country first"
                    : "Select cities"
                }
                allLabel="All Cities"
              />
            </FieldLabel>

            <FieldLabel label="Qualification">
              <MultiSelect
                options={[...QUALIFICATIONS]
                  .filter((q) => q !== "Others")
                  .sort((a, b) => a.localeCompare(b))}
                value={form.qualifications}
                onChange={(v) => setForm({ ...form, qualifications: v })}
                placeholder="Select qualifications"
              />
            </FieldLabel>

            <FieldLabel label="Profession">
              <MultiSelect
                options={PROFESSIONS.filter((p) => p !== "Others")}
                value={form.professions}
                onChange={(v) => setForm({ ...form, professions: v })}
                placeholder="Select professions"
              />
            </FieldLabel>

            <FieldLabel label="Others">
              <Textarea
                value={form.others}
                onChange={(e) => setForm({ ...form, others: e.target.value })}
                placeholder="Any other requirements for your future partner"
              />
            </FieldLabel>
          </>
        );
      }}
    </RegistrationShell>
  );
}
