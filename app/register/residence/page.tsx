"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase";
import { RegistrationShell } from "@/components/forms/registration-shell";
import { FieldLabel, Input, Select, Textarea } from "@/components/ui/fields";
import { MultiSelect } from "@/components/ui/multi-select";
import { toast } from "@/components/ui/toast";
import {
  ALL_COUNTRIES,
  PROPERTY_UNITS,
  RESIDENCE_TYPES,
  STORY_TYPES,
  citiesForCountries,
} from "@/lib/constants";
import type { Profile } from "@/types";

export default function RegisterResidence() {
  const [form, setForm] = useState({
    nationality: [] as string[],
    residence_country: [] as string[],
    city: [] as string[],
    residence_type: "",
    size_value: "",
    size_unit: "",
    story_type: "",
    other_properties: "",
  });
  const [hydrated, setHydrated] = useState(false);

  function hydrate(p: Profile) {
    if (hydrated) return;
    const [sizeValue = "", sizeUnit = ""] = (p.property_size ?? "").split(" ");
    setForm({
      nationality: p.nationality ?? [],
      residence_country: p.residence_country ?? [],
      city: p.city ?? [],
      residence_type: p.residence_type ?? "",
      size_value: sizeValue,
      size_unit: sizeUnit,
      story_type: p.story_type ?? "",
      other_properties: p.other_properties ?? "",
    });
    setHydrated(true);
  }

  const cityOptions = citiesForCountries(form.residence_country);

  async function save(): Promise<boolean> {
    if (
      form.nationality.length === 0 ||
      form.residence_country.length === 0 ||
      !form.residence_type
    ) {
      toast("Please fill all mandatory fields.", "error");
      return false;
    }
    const supabase = createClient();
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) return false;

    const { error } = await supabase
      .from("profiles")
      .update({
        nationality: form.nationality,
        residence_country: form.residence_country,
        city: form.city,
        residence_type: form.residence_type,
        property_size:
          form.size_value && form.size_unit
            ? `${form.size_value} ${form.size_unit}`
            : null,
        story_type: form.story_type || null,
        other_properties: form.other_properties.trim() || null,
        registration_step: 4,
      })
      .eq("id", userData.user.id);

    if (error) {
      toast(error.message, "error");
      return false;
    }
    return true;
  }

  return (
    <RegistrationShell step={4} title="Residence Details" onSave={save}>
      {(profile) => {
        hydrate(profile);
        return (
          <>
            <FieldLabel label="Nationality" required>
              <MultiSelect
                options={ALL_COUNTRIES}
                value={form.nationality}
                onChange={(v) => setForm({ ...form, nationality: v })}
                placeholder="Select nationality (one or more)"
              />
            </FieldLabel>

            <FieldLabel label="Current Residence Country" required>
              <MultiSelect
                options={ALL_COUNTRIES}
                value={form.residence_country}
                onChange={(v) =>
                  setForm({
                    ...form,
                    residence_country: v,
                    city: form.city.filter((c) =>
                      citiesForCountries(v).includes(c)
                    ),
                  })
                }
                placeholder="Select country (one or more)"
              />
            </FieldLabel>

            <FieldLabel
              label="City"
              required
              hint="Cities update based on selected countries"
            >
              <MultiSelect
                options={cityOptions}
                value={form.city}
                onChange={(v) => setForm({ ...form, city: v })}
                placeholder={
                  form.residence_country.length === 0
                    ? "Select a country first"
                    : "Select city (one or more)"
                }
              />
            </FieldLabel>

            <FieldLabel label="Residence Type" required>
              <Select
                options={RESIDENCE_TYPES}
                placeholder="Select type"
                value={form.residence_type}
                onChange={(e) =>
                  setForm({ ...form, residence_type: e.target.value })
                }
              />
            </FieldLabel>

            <div>
              <span className="mb-1.5 block text-sm font-semibold text-charcoal">
                Size<span className="ml-0.5 text-coral">*</span>
              </span>
              <div className="grid grid-cols-2 gap-3">
                <Input
                  type="number"
                  min={0}
                  placeholder="e.g. 5"
                  value={form.size_value}
                  onChange={(e) =>
                    setForm({ ...form, size_value: e.target.value })
                  }
                />
                <Select
                  options={PROPERTY_UNITS}
                  placeholder="Unit"
                  value={form.size_unit}
                  onChange={(e) =>
                    setForm({ ...form, size_unit: e.target.value })
                  }
                />
              </div>
            </div>

            <FieldLabel label="Story" required>
              <Select
                options={STORY_TYPES}
                placeholder="Select story type"
                value={form.story_type}
                onChange={(e) =>
                  setForm({ ...form, story_type: e.target.value })
                }
              />
            </FieldLabel>

            <FieldLabel label="Other Properties">
              <Textarea
                value={form.other_properties}
                onChange={(e) =>
                  setForm({ ...form, other_properties: e.target.value })
                }
                placeholder="Any other properties you own"
              />
            </FieldLabel>
          </>
        );
      }}
    </RegistrationShell>
  );
}
