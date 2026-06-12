"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase";
import { RegistrationShell } from "@/components/forms/registration-shell";
import { FieldLabel } from "@/components/ui/fields";
import { PhoneInput } from "@/components/ui/phone-input";
import { toast } from "@/components/ui/toast";
import type { Profile } from "@/types";

export default function RegisterContact() {
  const [form, setForm] = useState({
    father_contact: "+92 ",
    mother_contact: "+92 ",
    candidate_contact: "+92 ",
  });
  const [hydrated, setHydrated] = useState(false);

  function hydrate(p: Profile) {
    if (hydrated) return;
    setForm({
      father_contact: p.father_contact ?? "+92 ",
      mother_contact: p.mother_contact ?? "+92 ",
      candidate_contact: p.candidate_contact ?? p.whatsapp_no ?? "+92 ",
    });
    setHydrated(true);
  }

  async function save(): Promise<boolean> {
    const digits = (v: string) => v.replace(/[^\d]/g, "").length;
    if (
      digits(form.father_contact) < 8 ||
      digits(form.mother_contact) < 8 ||
      digits(form.candidate_contact) < 8
    ) {
      toast("Please provide all three contact numbers.", "error");
      return false;
    }
    const supabase = createClient();
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) return false;

    const { error } = await supabase
      .from("profiles")
      .update({
        father_contact: form.father_contact.trim(),
        mother_contact: form.mother_contact.trim(),
        candidate_contact: form.candidate_contact.trim(),
        registration_step: 7,
      })
      .eq("id", userData.user.id);

    if (error) {
      toast(error.message, "error");
      return false;
    }
    toast("Registration complete. Welcome to PureLifePartner!");
    return true;
  }

  return (
    <RegistrationShell step={7} title="Contact Details" onSave={save}>
      {(profile) => {
        hydrate(profile);
        return (
          <>
            <p className="rounded-xl bg-off-white p-4 text-sm text-charcoal/70">
              🔒 These numbers are <strong>never shown publicly</strong>. They
              are only shared with verified members after agent approval, in
              line with our privacy-first policy.
            </p>

            <FieldLabel label="Father Contact No" required>
              <PhoneInput
                value={form.father_contact}
                onChange={(v) => setForm({ ...form, father_contact: v })}
              />
            </FieldLabel>

            <FieldLabel label="Mother Contact No" required>
              <PhoneInput
                value={form.mother_contact}
                onChange={(v) => setForm({ ...form, mother_contact: v })}
              />
            </FieldLabel>

            <FieldLabel label="Candidate Contact No" required>
              <PhoneInput
                value={form.candidate_contact}
                onChange={(v) => setForm({ ...form, candidate_contact: v })}
              />
            </FieldLabel>
          </>
        );
      }}
    </RegistrationShell>
  );
}
