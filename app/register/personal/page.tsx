"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase";
import {
  RegistrationShell,
  saveDynamicValue,
} from "@/components/forms/registration-shell";
import { FieldLabel, Input, Select, Textarea } from "@/components/ui/fields";
import { MultiSelect } from "@/components/ui/multi-select";
import { toast } from "@/components/ui/toast";
import { MARITAL_STATUSES, PROFESSIONS, QUALIFICATIONS } from "@/lib/constants";
import { cmToFtIn, ftInToCm } from "@/lib/utils";
import type { Profile } from "@/types";

export default function RegisterPersonal() {
  const [form, setForm] = useState({
    name_private: "",
    marital_status: "",
    height_ft: "",
    height_in: "",
    height_cm: "",
    weight_kg: "",
    qualification: "",
    qualification_other: "",
    profession: [] as string[],
    profession_other: "",
    profession_detail: "",
  });
  const [hydrated, setHydrated] = useState(false);

  function hydrate(p: Profile) {
    if (hydrated) return;
    setForm({
      name_private: p.name_private ?? "",
      marital_status: p.marital_status ?? "",
      height_ft: p.height_ft?.toString() ?? "",
      height_in: p.height_in?.toString() ?? "",
      height_cm: p.height_cm?.toString() ?? "",
      weight_kg: p.weight_kg?.toString() ?? "",
      qualification: p.qualification ?? "",
      qualification_other: "",
      profession: p.profession ?? [],
      profession_other: "",
      profession_detail: p.profession_detail ?? "",
    });
    setHydrated(true);
  }

  function setFtIn(ft: string, inches: string) {
    const f = parseInt(ft, 10);
    const i = parseInt(inches, 10);
    const cm =
      !isNaN(f) && !isNaN(i) ? ftInToCm(f, i).toString() : form.height_cm;
    setForm((prev) => ({ ...prev, height_ft: ft, height_in: inches, height_cm: cm }));
  }

  function setCm(cm: string) {
    const v = parseFloat(cm);
    if (!isNaN(v)) {
      const { ft, inches } = cmToFtIn(v);
      setForm((prev) => ({
        ...prev,
        height_cm: cm,
        height_ft: ft.toString(),
        height_in: inches.toString(),
      }));
    } else {
      setForm((prev) => ({ ...prev, height_cm: cm }));
    }
  }

  async function save(): Promise<boolean> {
    if (!form.name_private.trim() || !form.marital_status || !form.qualification) {
      toast("Please fill all mandatory fields.", "error");
      return false;
    }
    const supabase = createClient();
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) return false;

    const qualification =
      form.qualification === "Others" && form.qualification_other.trim()
        ? form.qualification_other.trim()
        : form.qualification;
    if (form.qualification === "Others" && form.qualification_other.trim()) {
      await saveDynamicValue("qualification", form.qualification_other);
    }

    let profession = [...form.profession];
    if (profession.includes("Others") && form.profession_other.trim()) {
      profession = profession.filter((p) => p !== "Others");
      profession.push(form.profession_other.trim());
      await saveDynamicValue("profession", form.profession_other);
    }

    const { error } = await supabase
      .from("profiles")
      .update({
        name_private: form.name_private.trim(),
        marital_status: form.marital_status,
        height_ft: form.height_ft ? parseInt(form.height_ft, 10) : null,
        height_in: form.height_in ? parseInt(form.height_in, 10) : null,
        height_cm: form.height_cm ? parseFloat(form.height_cm) : null,
        weight_kg: form.weight_kg ? parseFloat(form.weight_kg) : null,
        qualification,
        profession,
        profession_detail: form.profession_detail.trim() || null,
        registration_step: 2,
      })
      .eq("id", userData.user.id);

    if (error) {
      toast(error.message, "error");
      return false;
    }
    return true;
  }

  return (
    <RegistrationShell step={2} title="Personal Information" onSave={save}>
      {(profile) => {
        hydrate(profile);
        return (
          <>
            <FieldLabel
              label="Name"
              required
              hint="For office use only. Never shown publicly."
            >
              <Input
                value={form.name_private}
                onChange={(e) =>
                  setForm({ ...form, name_private: e.target.value })
                }
                placeholder="Your full real name"
              />
            </FieldLabel>

            <FieldLabel label="Marital Status" required>
              <Select
                options={MARITAL_STATUSES}
                placeholder="Select status"
                value={form.marital_status}
                onChange={(e) =>
                  setForm({ ...form, marital_status: e.target.value })
                }
              />
            </FieldLabel>

            <div>
              <span className="mb-1.5 block text-sm font-semibold text-charcoal">
                Height<span className="ml-0.5 text-coral">*</span>
              </span>
              <div className="grid grid-cols-3 gap-3">
                <Input
                  type="number"
                  min={3}
                  max={8}
                  placeholder="Feet"
                  value={form.height_ft}
                  onChange={(e) => setFtIn(e.target.value, form.height_in)}
                />
                <Input
                  type="number"
                  min={0}
                  max={11}
                  placeholder="Inches"
                  value={form.height_in}
                  onChange={(e) => setFtIn(form.height_ft, e.target.value)}
                />
                <Input
                  type="number"
                  min={90}
                  max={250}
                  placeholder="OR cm"
                  value={form.height_cm}
                  onChange={(e) => setCm(e.target.value)}
                />
              </div>
              <span className="mt-1 block text-xs text-gray-500">
                Enter feet + inches or centimetres; the other converts
                automatically.
              </span>
            </div>

            <FieldLabel label="Weight (KG)" hint="Optional">
              <Input
                type="number"
                min={30}
                max={250}
                value={form.weight_kg}
                onChange={(e) => setForm({ ...form, weight_kg: e.target.value })}
                placeholder="e.g. 70"
              />
            </FieldLabel>

            <h2 className="border-t border-gray-100 pt-6 text-lg font-bold text-charcoal">
              Educational Details
            </h2>

            <FieldLabel label="Qualification" required>
              <Select
                options={[...QUALIFICATIONS].sort((a, b) => a.localeCompare(b))}
                placeholder="Select qualification"
                value={form.qualification}
                onChange={(e) =>
                  setForm({ ...form, qualification: e.target.value })
                }
              />
            </FieldLabel>
            {form.qualification === "Others" && (
              <FieldLabel label="Specify Qualification" required>
                <Input
                  value={form.qualification_other}
                  onChange={(e) =>
                    setForm({ ...form, qualification_other: e.target.value })
                  }
                  placeholder="Enter your qualification"
                />
              </FieldLabel>
            )}

            <FieldLabel label="Profession" required>
              <MultiSelect
                options={PROFESSIONS}
                value={form.profession}
                onChange={(v) => setForm({ ...form, profession: v })}
                placeholder="Select one or more professions"
              />
            </FieldLabel>
            {form.profession.includes("Others") && (
              <FieldLabel label="Specify Profession" required>
                <Input
                  value={form.profession_other}
                  onChange={(e) =>
                    setForm({ ...form, profession_other: e.target.value })
                  }
                  placeholder="Enter your profession"
                />
              </FieldLabel>
            )}

            <FieldLabel label="Professional / Qualification Detail">
              <Textarea
                value={form.profession_detail}
                onChange={(e) =>
                  setForm({ ...form, profession_detail: e.target.value })
                }
                placeholder="Tell us more about your education and work"
              />
            </FieldLabel>
          </>
        );
      }}
    </RegistrationShell>
  );
}
