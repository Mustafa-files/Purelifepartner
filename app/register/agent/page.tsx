"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { FieldLabel, Input } from "@/components/ui/fields";
import { PhoneInput } from "@/components/ui/phone-input";
import { toast } from "@/components/ui/toast";
import { validateEmail, validatePassword } from "@/lib/utils";

export default function AgentRegistration() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    contact: "+92 ",
    email: "",
    password: "",
    bank_name: "",
    branch: "",
    account_name: "",
    account_no: "",
    iban: "",
  });
  const [submitting, setSubmitting] = useState(false);

  async function submit() {
    if (!form.name.trim()) return toast("Name is required.", "error");
    if (!validateEmail(form.email)) return toast("Enter a valid email.", "error");
    const pwErr = validatePassword(form.password);
    if (pwErr) return toast(pwErr, "error");
    if (!form.bank_name.trim() || !form.account_name.trim())
      return toast("Bank name and account name are required.", "error");

    setSubmitting(true);
    const supabase = createClient();

    const { data, error } = await supabase.auth.signUp({
      email: form.email.trim(),
      password: form.password,
      options: {
        data: {
          name_private: form.name.trim(),
          whatsapp_no: form.contact.trim(),
          user_id_handle: `agent_${Date.now().toString(36)}`,
        },
      },
    });

    if (error) {
      toast(error.message, "error");
      setSubmitting(false);
      return;
    }

    // Bank details require an active session; with email confirmation enabled
    // they are stored after first sign-in instead.
    if (data.session && data.user) {
      const { error: bankErr } = await supabase.from("agent_profiles").insert({
        profile_id: data.user.id,
        bank_name: form.bank_name.trim(),
        branch: form.branch.trim() || null,
        account_name: form.account_name.trim(),
        account_no: form.account_no.trim() || null,
        iban: form.iban.trim() || null,
      });
      if (bankErr) toast(bankErr.message, "error");
      toast(
        "Agent application submitted. An admin will activate your agent role."
      );
      router.push("/dashboard");
    } else {
      toast(
        "Application received. Confirm your email, then sign in. An admin will activate your agent role.",
        "info"
      );
      router.push("/login");
    }
    setSubmitting(false);
  }

  return (
    <div className="bg-off-white py-12">
      <div className="mx-auto max-w-2xl px-4">
        <div className="rounded-2xl bg-white p-6 shadow-sm sm:p-10">
          <h1 className="text-2xl font-bold text-charcoal">
            Agent Registration
          </h1>
          <p className="mt-2 mb-8 text-sm text-charcoal/60">
            Join PureLifePartner as a verification agent. Admin approval is
            required before your agent account becomes active.
          </p>

          <div className="space-y-5">
            <FieldLabel label="Name" required>
              <Input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </FieldLabel>

            <FieldLabel label="Contact No" required>
              <PhoneInput
                value={form.contact}
                onChange={(v) => setForm({ ...form, contact: v })}
              />
            </FieldLabel>

            <div className="grid gap-5 sm:grid-cols-2">
              <FieldLabel label="Email" required>
                <Input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </FieldLabel>
              <FieldLabel label="Password" required>
                <Input
                  type="password"
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                />
              </FieldLabel>
            </div>

            <h2 className="border-t border-gray-100 pt-6 text-lg font-bold text-charcoal">
              Bank Details
            </h2>

            <div className="grid gap-5 sm:grid-cols-2">
              <FieldLabel label="Bank Name" required>
                <Input
                  value={form.bank_name}
                  onChange={(e) =>
                    setForm({ ...form, bank_name: e.target.value })
                  }
                />
              </FieldLabel>
              <FieldLabel label="Branch">
                <Input
                  value={form.branch}
                  onChange={(e) => setForm({ ...form, branch: e.target.value })}
                />
              </FieldLabel>
              <FieldLabel label="Account Name" required>
                <Input
                  value={form.account_name}
                  onChange={(e) =>
                    setForm({ ...form, account_name: e.target.value })
                  }
                />
              </FieldLabel>
              <FieldLabel label="Account No">
                <Input
                  value={form.account_no}
                  onChange={(e) =>
                    setForm({ ...form, account_no: e.target.value })
                  }
                />
              </FieldLabel>
            </div>

            <FieldLabel label="IBAN No">
              <Input
                value={form.iban}
                onChange={(e) => setForm({ ...form, iban: e.target.value })}
                placeholder="PK00XXXX0000000000000000"
              />
            </FieldLabel>
          </div>

          <div className="mt-10 flex justify-end">
            <Button onClick={submit} loading={submitting}>
              Submit Application
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
