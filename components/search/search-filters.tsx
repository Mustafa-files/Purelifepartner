"use client";

import { FieldLabel, Select } from "@/components/ui/fields";
import { MultiSelect } from "@/components/ui/multi-select";
import { Button } from "@/components/ui/button";
import {
  CASTES,
  MARITAL_STATUSES,
  PROFESSIONS,
  QUALIFICATIONS,
  REGIONS,
  RELIGIONS,
  SECTS_BY_RELIGION,
  countriesForRegions,
  citiesForCountries,
} from "@/lib/constants";

export interface SearchFilterState {
  gender: string;
  minAge: number;
  maxAge: number;
  maritalStatus: string;
  religions: string[];
  sects: string[];
  castes: string[];
  regions: string[];
  countries: string[];
  cities: string[];
  qualifications: string[];
  professions: string[];
}

export const DEFAULT_FILTERS: SearchFilterState = {
  gender: "",
  minAge: 16,
  maxAge: 35,
  maritalStatus: "",
  religions: [],
  sects: [],
  castes: [],
  regions: [],
  countries: [],
  cities: [],
  qualifications: [],
  professions: [],
};

export function SearchFilters({
  filters,
  onChange,
  onApply,
  onReset,
  loading,
}: {
  filters: SearchFilterState;
  onChange: (f: SearchFilterState) => void;
  onApply: () => void;
  onReset: () => void;
  loading?: boolean;
}) {
  const sectOptions = Array.from(
    new Set(filters.religions.flatMap((r) => SECTS_BY_RELIGION[r] ?? []))
  ).sort((a, b) => a.localeCompare(b));

  const countryOptions = countriesForRegions(
    filters.regions.length ? filters.regions : REGIONS
  );
  const cityOptions = citiesForCountries(filters.countries);

  return (
    <aside className="space-y-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-bold text-charcoal">Filters</h2>

      <FieldLabel label="Looking for">
        <Select
          options={["Female", "Male"]}
          placeholder="Any gender"
          value={filters.gender}
          onChange={(e) => onChange({ ...filters, gender: e.target.value })}
        />
      </FieldLabel>

      <div>
        <span className="mb-1.5 block text-sm font-semibold text-charcoal">
          Age: {filters.minAge} to {filters.maxAge}
        </span>
        <div className="space-y-2">
          <input
            type="range"
            min={16}
            max={35}
            value={filters.minAge}
            onChange={(e) =>
              onChange({ ...filters, minAge: parseInt(e.target.value, 10) })
            }
            className="w-full accent-[#D5453A]"
          />
          <input
            type="range"
            min={16}
            max={35}
            value={filters.maxAge}
            onChange={(e) =>
              onChange({ ...filters, maxAge: parseInt(e.target.value, 10) })
            }
            className="w-full accent-[#D5453A]"
          />
        </div>
      </div>

      <FieldLabel label="Marital Status">
        <Select
          options={MARITAL_STATUSES}
          placeholder="Any"
          value={filters.maritalStatus}
          onChange={(e) =>
            onChange({ ...filters, maritalStatus: e.target.value })
          }
        />
      </FieldLabel>

      <FieldLabel label="Religion">
        <MultiSelect
          options={[...RELIGIONS].sort((a, b) => a.localeCompare(b))}
          value={filters.religions}
          onChange={(v) => onChange({ ...filters, religions: v, sects: [] })}
          placeholder="Any religion"
        />
      </FieldLabel>

      {sectOptions.length > 0 && (
        <FieldLabel label="Sect">
          <MultiSelect
            options={sectOptions}
            value={filters.sects}
            onChange={(v) => onChange({ ...filters, sects: v })}
            placeholder="Any sect"
          />
        </FieldLabel>
      )}

      <FieldLabel label="Caste">
        <MultiSelect
          options={CASTES.filter((c) => c !== "Others")}
          value={filters.castes}
          onChange={(v) => onChange({ ...filters, castes: v })}
          placeholder="Any caste"
        />
      </FieldLabel>

      <FieldLabel label="Region">
        <MultiSelect
          options={REGIONS}
          value={filters.regions}
          onChange={(v) =>
            onChange({ ...filters, regions: v, countries: [], cities: [] })
          }
          placeholder="Any region"
        />
      </FieldLabel>

      <FieldLabel label="Country">
        <MultiSelect
          options={countryOptions}
          value={filters.countries}
          onChange={(v) => onChange({ ...filters, countries: v, cities: [] })}
          placeholder="Any country"
        />
      </FieldLabel>

      {cityOptions.length > 0 && (
        <FieldLabel label="City">
          <MultiSelect
            options={cityOptions}
            value={filters.cities}
            onChange={(v) => onChange({ ...filters, cities: v })}
            placeholder="Any city"
          />
        </FieldLabel>
      )}

      <FieldLabel label="Qualification">
        <MultiSelect
          options={[...QUALIFICATIONS]
            .filter((q) => q !== "Others")
            .sort((a, b) => a.localeCompare(b))}
          value={filters.qualifications}
          onChange={(v) => onChange({ ...filters, qualifications: v })}
          placeholder="Any qualification"
        />
      </FieldLabel>

      <FieldLabel label="Profession">
        <MultiSelect
          options={PROFESSIONS.filter((p) => p !== "Others")}
          value={filters.professions}
          onChange={(v) => onChange({ ...filters, professions: v })}
          placeholder="Any profession"
        />
      </FieldLabel>

      <div className="flex gap-3 pt-2">
        <Button className="flex-1" onClick={onApply} loading={loading}>
          Apply
        </Button>
        <Button variant="ghost" onClick={onReset}>
          Reset
        </Button>
      </div>
    </aside>
  );
}
