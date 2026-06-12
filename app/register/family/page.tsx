"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase";
import { RegistrationShell } from "@/components/forms/registration-shell";
import { FieldLabel, Input, Textarea } from "@/components/ui/fields";
import { toast } from "@/components/ui/toast";
import type { Profile, Sibling } from "@/types";

export default function RegisterFamily() {
  const [form, setForm] = useState({
    father_name: "",
    father_occupation: "",
    mother_occupation: "",
    brothers: "0",
    sisters: "0",
  });
  const [brotherNotes, setBrotherNotes] = useState<string[]>([]);
  const [sisterNotes, setSisterNotes] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);

  function hydrate(p: Profile) {
    if (hydrated) return;
    setForm({
      father_name: p.father_name ?? "",
      father_occupation: p.father_occupation ?? "",
      mother_occupation: p.mother_occupation ?? "",
      brothers: (p.brothers ?? 0).toString(),
      sisters: (p.sisters ?? 0).toString(),
    });
    const sibs: Sibling[] = p.siblings ?? [];
    const b = p.brothers ?? 0;
    setBrotherNotes(sibs.slice(0, b).map((s) => s.description));
    setSisterNotes(sibs.slice(b).map((s) => s.description));
    setHydrated(true);
  }

  function resizeNotes(count: number, notes: string[]): string[] {
    const next = [...notes];
    while (next.length < count) next.push("");
    return next.slice(0, count);
  }

  const brotherCount = Math.max(0, Math.min(20, parseInt(form.brothers, 10) || 0));
  const sisterCount = Math.max(0, Math.min(20, parseInt(form.sisters, 10) || 0));

  async function save(): Promise<boolean> {
    if (!form.father_name.trim() || !form.father_occupation.trim() || !form.mother_occupation.trim()) {
      toast("Please fill all mandatory fields.", "error");
      return false;
    }
    const supabase = createClient();
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) return false;

    const siblings: Sibling[] = [
      ...resizeNotes(brotherCount, brotherNotes).map((d) => ({ description: d })),
      ...resizeNotes(sisterCount, sisterNotes).map((d) => ({ description: d })),
    ];

    const { error } = await supabase
      .from("profiles")
      .update({
        father_name: form.father_name.trim(),
        father_occupation: form.father_occupation.trim(),
        mother_occupation: form.mother_occupation.trim(),
        brothers: brotherCount,
        sisters: sisterCount,
        siblings,
        registration_step: 5,
      })
      .eq("id", userData.user.id);

    if (error) {
      toast(error.message, "error");
      return false;
    }
    return true;
  }

  return (
    <RegistrationShell step={5} title="Family Details" onSave={save}>
      {(profile) => {
        hydrate(profile);
        return (
          <>
            <FieldLabel label="Father Name" required>
              <Input
                value={form.father_name}
                onChange={(e) =>
                  setForm({ ...form, father_name: e.target.value })
                }
              />
            </FieldLabel>

            <div className="grid gap-5 sm:grid-cols-2">
              <FieldLabel label="Father Occupation" required>
                <Input
                  value={form.father_occupation}
                  onChange={(e) =>
                    setForm({ ...form, father_occupation: e.target.value })
                  }
                />
              </FieldLabel>
              <FieldLabel label="Mother Occupation" required>
                <Input
                  value={form.mother_occupation}
                  onChange={(e) =>
                    setForm({ ...form, mother_occupation: e.target.value })
                  }
                />
              </FieldLabel>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <FieldLabel label="Brothers" required>
                <Input
                  type="number"
                  min={0}
                  max={20}
                  value={form.brothers}
                  onChange={(e) => {
                    setForm({ ...form, brothers: e.target.value });
                    setBrotherNotes((n) =>
                      resizeNotes(parseInt(e.target.value, 10) || 0, n)
                    );
                  }}
                />
              </FieldLabel>
              <FieldLabel label="Sisters" required>
                <Input
                  type="number"
                  min={0}
                  max={20}
                  value={form.sisters}
                  onChange={(e) => {
                    setForm({ ...form, sisters: e.target.value });
                    setSisterNotes((n) =>
                      resizeNotes(parseInt(e.target.value, 10) || 0, n)
                    );
                  }}
                />
              </FieldLabel>
            </div>

            {brotherCount > 0 && (
              <div className="space-y-3">
                <span className="block text-sm font-semibold text-charcoal">
                  About each brother
                </span>
                {Array.from({ length: brotherCount }).map((_, i) => (
                  <Textarea
                    key={`b${i}`}
                    rows={2}
                    placeholder={`Brother ${i + 1}: age, marital status, occupation...`}
                    value={brotherNotes[i] ?? ""}
                    onChange={(e) =>
                      setBrotherNotes((n) => {
                        const next = resizeNotes(brotherCount, n);
                        next[i] = e.target.value;
                        return next;
                      })
                    }
                  />
                ))}
              </div>
            )}

            {sisterCount > 0 && (
              <div className="space-y-3">
                <span className="block text-sm font-semibold text-charcoal">
                  About each sister
                </span>
                {Array.from({ length: sisterCount }).map((_, i) => (
                  <Textarea
                    key={`s${i}`}
                    rows={2}
                    placeholder={`Sister ${i + 1}: age, marital status, occupation...`}
                    value={sisterNotes[i] ?? ""}
                    onChange={(e) =>
                      setSisterNotes((n) => {
                        const next = resizeNotes(sisterCount, n);
                        next[i] = e.target.value;
                        return next;
                      })
                    }
                  />
                ))}
              </div>
            )}
          </>
        );
      }}
    </RegistrationShell>
  );
}
