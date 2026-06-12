"use client";

import { useRef, useState } from "react";
import { createClient } from "@/lib/supabase";
import {
  RegistrationShell,
  saveDynamicValue,
} from "@/components/forms/registration-shell";
import { FieldLabel, Input, Select, Textarea } from "@/components/ui/fields";
import { RadioGroup } from "@/components/ui/fields";
import { toast } from "@/components/ui/toast";
import {
  CASTES,
  PRACTICE_OPTIONS,
  RELIGIONS,
  SECTS_BY_RELIGION,
  SUB_CASTES_BY_CASTE,
} from "@/lib/constants";
import type { Profile } from "@/types";

export default function RegisterReligion() {
  const [form, setForm] = useState({
    religion: "",
    religion_other: "",
    sect: "",
    sect_other: "",
    practice_nazar: "",
    caste: "",
    caste_other: "",
    sub_caste: "",
    sub_caste_other: "",
    describe_yourself: "",
    job_details: "",
    income_details: "",
  });
  const [hydrated, setHydrated] = useState(false);
  const [docUploading, setDocUploading] = useState(false);
  const [docUploaded, setDocUploaded] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  function hydrate(p: Profile) {
    if (hydrated) return;
    setForm((prev) => ({
      ...prev,
      religion: p.religion ?? "",
      sect: p.sect ?? "",
      practice_nazar: p.practice_nazar ?? "",
      caste: p.caste ?? "",
      sub_caste: p.sub_caste ?? "",
      describe_yourself: p.describe_yourself ?? "",
      job_details: p.job_details ?? "",
      income_details: p.income_details ?? "",
    }));
    setDocUploaded(p.doc_verification_status === "pending_review");
    setHydrated(true);
  }

  const sects = [...(SECTS_BY_RELIGION[form.religion] ?? [])].sort((a, b) =>
    a === "Others" ? 1 : b === "Others" ? -1 : a.localeCompare(b)
  );
  const subCastes = [...(SUB_CASTES_BY_CASTE[form.caste] ?? [])].sort((a, b) =>
    a === "Others" ? 1 : b === "Others" ? -1 : a.localeCompare(b)
  );

  async function uploadDocument(file: File) {
    setDocUploading(true);
    const supabase = createClient();
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) return;
    const path = `${userData.user.id}/${Date.now()}-${file.name}`;
    const { error } = await supabase.storage
      .from("documents")
      .upload(path, file);
    if (error) {
      toast("Document upload failed: " + error.message, "error");
    } else {
      // TODO: AI verification of Name + DOB against the document.
      // Until then every upload is flagged for manual agent review.
      await supabase
        .from("profiles")
        .update({ doc_verification_status: "pending_review" })
        .eq("id", userData.user.id);
      setDocUploaded(true);
      toast("Document uploaded. Our team will verify it shortly.");
    }
    setDocUploading(false);
  }

  async function save(): Promise<boolean> {
    if (!form.religion || !form.caste) {
      toast("Please fill all mandatory fields.", "error");
      return false;
    }
    const supabase = createClient();
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) return false;

    const resolve = async (
      selected: string,
      other: string,
      category: string
    ): Promise<string> => {
      if ((selected === "Others" || selected === "Other") && other.trim()) {
        await saveDynamicValue(category, other);
        return other.trim();
      }
      return selected;
    };

    const religion = await resolve(form.religion, form.religion_other, "religion");
    const sect = await resolve(form.sect, form.sect_other, "sect");
    const caste = await resolve(form.caste, form.caste_other, "caste");
    const subCaste = await resolve(form.sub_caste, form.sub_caste_other, "sub_caste");

    const { error } = await supabase
      .from("profiles")
      .update({
        religion,
        sect: sect || null,
        practice_nazar: form.practice_nazar || null,
        caste,
        sub_caste: subCaste || null,
        describe_yourself: form.describe_yourself.trim() || null,
        job_details: form.job_details.trim() || null,
        income_details: form.income_details.trim() || null,
        registration_step: 3,
      })
      .eq("id", userData.user.id);

    if (error) {
      toast(error.message, "error");
      return false;
    }
    return true;
  }

  return (
    <RegistrationShell step={3} title="Religion, Caste & About You" onSave={save}>
      {(profile) => {
        hydrate(profile);
        return (
          <>
            <FieldLabel label="Religion" required>
              <Select
                options={RELIGIONS}
                placeholder="Select religion"
                value={form.religion}
                onChange={(e) =>
                  setForm({ ...form, religion: e.target.value, sect: "" })
                }
              />
            </FieldLabel>
            {form.religion === "Other" && (
              <FieldLabel label="Specify Religion" required>
                <Input
                  value={form.religion_other}
                  onChange={(e) =>
                    setForm({ ...form, religion_other: e.target.value })
                  }
                />
              </FieldLabel>
            )}

            {sects.length > 0 && (
              <FieldLabel label="Sect" required>
                <Select
                  options={sects}
                  placeholder="Select sect"
                  value={form.sect}
                  onChange={(e) => setForm({ ...form, sect: e.target.value })}
                />
              </FieldLabel>
            )}
            {form.sect === "Others" && (
              <FieldLabel label="Specify Sect" required>
                <Input
                  value={form.sect_other}
                  onChange={(e) =>
                    setForm({ ...form, sect_other: e.target.value })
                  }
                />
              </FieldLabel>
            )}

            <FieldLabel label="Practice Nazar, Nayaz and Khatam" required>
              <RadioGroup
                name="practice_nazar"
                options={PRACTICE_OPTIONS}
                value={form.practice_nazar}
                onChange={(v) => setForm({ ...form, practice_nazar: v })}
              />
            </FieldLabel>

            <FieldLabel label="Caste" required>
              <Select
                options={CASTES}
                placeholder="Select caste"
                value={form.caste}
                onChange={(e) =>
                  setForm({ ...form, caste: e.target.value, sub_caste: "" })
                }
              />
            </FieldLabel>
            {form.caste === "Others" && (
              <FieldLabel label="Specify Caste" required>
                <Input
                  value={form.caste_other}
                  onChange={(e) =>
                    setForm({ ...form, caste_other: e.target.value })
                  }
                />
              </FieldLabel>
            )}

            {subCastes.length > 0 && (
              <FieldLabel label="Sub Caste" required>
                <Select
                  options={subCastes}
                  placeholder="Select sub caste"
                  value={form.sub_caste}
                  onChange={(e) =>
                    setForm({ ...form, sub_caste: e.target.value })
                  }
                />
              </FieldLabel>
            )}
            {form.sub_caste === "Others" && (
              <FieldLabel label="Specify Sub Caste" required>
                <Input
                  value={form.sub_caste_other}
                  onChange={(e) =>
                    setForm({ ...form, sub_caste_other: e.target.value })
                  }
                />
              </FieldLabel>
            )}

            <FieldLabel label="Describe Yourself" required>
              <Textarea
                value={form.describe_yourself}
                onChange={(e) =>
                  setForm({ ...form, describe_yourself: e.target.value })
                }
                placeholder="Your personality, values, lifestyle and what matters to you"
              />
            </FieldLabel>

            <div className="rounded-xl border-2 border-dashed border-coral/40 bg-coral/5 p-5">
              <h3 className="font-bold text-charcoal">
                📄 Document Verification
              </h3>
              <p className="mt-1 text-sm text-charcoal/70">
                Scan or photograph your NIC, Passport, or Driving License. We
                use it to verify your Name and Date of Birth, then it is
                deleted. If automatic verification fails, an agent reviews it
                manually.
              </p>
              <input
                ref={fileRef}
                type="file"
                accept="image/*,.pdf"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) uploadDocument(f);
                }}
              />
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                disabled={docUploading}
                className="mt-3 cursor-pointer rounded-full bg-coral px-5 py-2 text-sm font-bold text-white transition-colors hover:bg-coral-muted disabled:opacity-50"
              >
                {docUploading
                  ? "Uploading..."
                  : docUploaded
                    ? "✓ Uploaded. Replace document"
                    : "Upload Document"}
              </button>
            </div>

            <h2 className="border-t border-gray-100 pt-6 text-lg font-bold text-charcoal">
              Job / Business / Income
            </h2>

            <FieldLabel label="Job / Business Details" required>
              <Textarea
                value={form.job_details}
                onChange={(e) =>
                  setForm({ ...form, job_details: e.target.value })
                }
                placeholder="Describe your job or business"
              />
            </FieldLabel>

            <FieldLabel label="Income Details" required>
              <Textarea
                value={form.income_details}
                onChange={(e) =>
                  setForm({ ...form, income_details: e.target.value })
                }
                placeholder="Monthly or yearly income details"
              />
            </FieldLabel>
          </>
        );
      }}
    </RegistrationShell>
  );
}
