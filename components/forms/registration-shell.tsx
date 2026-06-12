"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { ProgressBar } from "@/components/ui/progress-bar";
import { toast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { REGISTRATION_STEPS } from "@/lib/constants";
import type { Profile } from "@/types";

interface ShellProps {
  step: number; // 1-based index into REGISTRATION_STEPS
  title: string;
  children: (profile: Profile) => React.ReactNode;
  onSave: () => Promise<boolean>; // returns true when save succeeded
}

/**
 * Wrapper for registration steps 2-7: loads the signed-in user's profile,
 * renders a progress bar, and provides Back / Save & Continue navigation.
 * Each step writes its fields to Supabase on save (form auto-save per step).
 */
export function RegistrationShell({ step, title, children, onSave }: ShellProps) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) {
        router.replace("/login?next=" + REGISTRATION_STEPS[step - 1].path);
        return;
      }
      const { data: prof, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", data.user.id)
        .single();
      if (error || !prof) {
        toast("Could not load your profile. Please try again.", "error");
      } else {
        setProfile(prof as Profile);
      }
      setLoading(false);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleNext() {
    setSaving(true);
    const ok = await onSave();
    setSaving(false);
    if (!ok) return;
    toast("Progress saved.");
    const next = REGISTRATION_STEPS[step]; // step is 1-based, so this is the next one
    router.push(next ? next.path : "/dashboard");
  }

  function handleBack() {
    const prev = REGISTRATION_STEPS[step - 2];
    if (prev) router.push(prev.path);
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16">
        <div className="plp-skeleton h-3 w-full rounded-full" />
        <div className="plp-skeleton mt-8 h-64 w-full rounded-2xl" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center text-charcoal/70">
        Your profile could not be loaded. Please sign in again.
      </div>
    );
  }

  return (
    <div className="bg-off-white py-12">
      <div className="mx-auto max-w-2xl px-4">
        <ProgressBar step={step} />
        <div className="rounded-2xl bg-white p-6 shadow-sm sm:p-10">
          <h1 className="mb-8 text-2xl font-bold text-charcoal">{title}</h1>
          <div className="space-y-5">{children(profile)}</div>
          <div className="mt-10 flex items-center justify-between">
            {step > 1 ? (
              <Button variant="ghost" onClick={handleBack}>
                ← Back
              </Button>
            ) : (
              <span />
            )}
            <Button onClick={handleNext} loading={saving}>
              Save & Continue →
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Records an "Others" custom value so admins can approve it for future dropdowns. */
export async function saveDynamicValue(category: string, value: string, country?: string) {
  if (!value.trim()) return;
  const supabase = createClient();
  await supabase.from("dynamic_values").insert({
    category,
    value: value.trim(),
    country: country ?? null,
  });
}
