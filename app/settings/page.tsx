"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { FieldLabel, Input, Select } from "@/components/ui/fields";
import { PhoneInput } from "@/components/ui/phone-input";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/toast";
import {
  AGE_ERROR,
  calcAge,
  cn,
  parseFlexibleDate,
  toISODate,
  validateEmail,
  validatePassword,
} from "@/lib/utils";
import type { NotificationPrefs, Profile } from "@/types";

function formatDobInput(iso: string): string {
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}

const VISIBILITY_OPTIONS = ["Everyone", "Verified members only"];
const toDb = (v: string) => (v === "Verified members only" ? "verified" : "everyone");
const fromDb = (v: string | undefined) =>
  v === "verified" ? "Verified members only" : "Everyone";

export default function SettingsPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) {
        router.replace("/login?next=/settings");
        return;
      }
      const { data: prof } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", data.user.id)
        .single();
      setProfile(prof as Profile);
      setLoading(false);
    });
  }, [router]);

  if (loading || !profile) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-12">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="mt-6 h-64 w-full rounded-2xl" />
        <Skeleton className="mt-6 h-64 w-full rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="bg-off-white py-12">
      <div className="mx-auto max-w-2xl space-y-6 px-4">
        <h1 className="text-3xl font-bold text-charcoal">Settings</h1>
        <AccountSection profile={profile} />
        <PrivacySection profile={profile} />
        <NotificationSection profile={profile} />
      </div>
    </div>
  );
}

function Section({
  id,
  title,
  description,
  children,
}: {
  id: string;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24 rounded-2xl bg-white p-6 shadow-sm sm:p-8">
      <h2 className="text-xl font-bold text-charcoal">{title}</h2>
      <p className="mt-1 text-sm text-charcoal/60">{description}</p>
      <div className="mt-6 space-y-5">{children}</div>
    </section>
  );
}

function AccountSection({ profile }: { profile: Profile }) {
  const [email, setEmail] = useState(profile.email ?? "");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [phone, setPhone] = useState(profile.whatsapp_no ?? "+92 ");
  const [dobText, setDobText] = useState(
    profile.dob ? formatDobInput(profile.dob) : ""
  );
  const [dobError, setDobError] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const supabase = createClient();

  async function updateEmail() {
    if (!validateEmail(email)) return toast("Enter a valid email address.", "error");
    setBusy("email");
    const { error } = await supabase.auth.updateUser({ email: email.trim() });
    setBusy(null);
    if (error) toast(error.message, "error");
    else
      toast(
        "Confirmation links sent. Check both your old and new inbox to finish the change.",
        "info"
      );
  }

  async function updatePassword() {
    const err = validatePassword(password);
    if (err) return toast(err, "error");
    if (password !== password2) return toast("Passwords do not match.", "error");
    setBusy("password");
    const { error } = await supabase.auth.updateUser({ password });
    setBusy(null);
    if (error) toast(error.message, "error");
    else {
      toast("Password updated.");
      setPassword("");
      setPassword2("");
    }
  }

  async function updatePhone() {
    if (phone.replace(/[^\d]/g, "").length < 8)
      return toast("Enter a valid phone number.", "error");
    setBusy("phone");
    const { error } = await supabase
      .from("profiles")
      .update({ whatsapp_no: phone.trim() })
      .eq("id", profile.id);
    setBusy(null);
    if (error) toast(error.message, "error");
    else toast("Phone number updated.");
  }

  async function updateDob() {
    const date = parseFlexibleDate(dobText);
    if (!date) {
      setDobError("Enter a valid date (DD/MM/YYYY, MM/DD/YYYY or YYYY/MM/DD).");
      return;
    }
    const age = calcAge(date);
    if (age < 16 || age > 35) {
      setDobError(AGE_ERROR);
      return;
    }
    setDobError(null);
    setBusy("dob");
    const { error } = await supabase
      .from("profiles")
      .update({ dob: toISODate(date), age })
      .eq("id", profile.id);
    setBusy(null);
    if (error) toast(error.message, "error");
    else toast("Date of birth updated.");
  }

  return (
    <Section
      id="account"
      title="Account Settings"
      description="Manage your login email, password, and contact phone."
    >
      <div className="flex items-end gap-3">
        <div className="flex-1">
          <FieldLabel label="Email">
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </FieldLabel>
        </div>
        <Button size="sm" onClick={updateEmail} loading={busy === "email"}>
          Update
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <FieldLabel
          label="New Password"
          hint="Min 8 chars with uppercase, lowercase and a number"
        >
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </FieldLabel>
        <FieldLabel label="Repeat New Password">
          <Input
            type="password"
            value={password2}
            onChange={(e) => setPassword2(e.target.value)}
          />
        </FieldLabel>
      </div>
      <Button size="sm" onClick={updatePassword} loading={busy === "password"}>
        Change Password
      </Button>

      <div className="border-t border-gray-100 pt-5">
        <FieldLabel label="WhatsApp / Contact No">
          <PhoneInput value={phone} onChange={setPhone} />
        </FieldLabel>
        <Button
          size="sm"
          className="mt-3"
          onClick={updatePhone}
          loading={busy === "phone"}
        >
          Save Phone
        </Button>
      </div>

      <div className="border-t border-gray-100 pt-5">
        <FieldLabel
          label="Date of Birth"
          hint="DD/MM/YYYY, MM/DD/YYYY or YYYY/MM/DD"
          error={dobError}
        >
          <Input
            value={dobText}
            onChange={(e) => setDobText(e.target.value)}
            placeholder="25/06/2000"
          />
        </FieldLabel>
        <Button
          size="sm"
          className="mt-3"
          onClick={updateDob}
          loading={busy === "dob"}
        >
          Save Date of Birth
        </Button>
      </div>
    </Section>
  );
}

function PrivacySection({ profile }: { profile: Profile }) {
  const [photoVis, setPhotoVis] = useState(fromDb(profile.photo_visibility));
  const [videoVis, setVideoVis] = useState(fromDb(profile.video_visibility));
  const [saving, setSaving] = useState(false);
  const supabase = createClient();

  async function save() {
    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update({
        photo_visibility: toDb(photoVis),
        video_visibility: toDb(videoVis),
      })
      .eq("id", profile.id);
    setSaving(false);
    if (error) toast(error.message, "error");
    else toast("Privacy settings saved.");
  }

  return (
    <Section
      id="privacy"
      title="Privacy Settings"
      description="Control who can see your photos and videos."
    >
      <FieldLabel label="Who can see my profile photo">
        <Select
          options={VISIBILITY_OPTIONS}
          value={photoVis}
          onChange={(e) => setPhotoVis(e.target.value)}
        />
      </FieldLabel>
      <FieldLabel label="Who can see my video introduction">
        <Select
          options={VISIBILITY_OPTIONS}
          value={videoVis}
          onChange={(e) => setVideoVis(e.target.value)}
        />
      </FieldLabel>
      <p className="rounded-xl bg-off-white p-4 text-sm text-charcoal/70">
        🔒 Your contact details (your number and your parents&apos; numbers)
        are always hidden. They are only released to verified members through
        our agent-controlled process, never publicly.
      </p>
      <Button size="sm" onClick={save} loading={saving}>
        Save Privacy Settings
      </Button>
    </Section>
  );
}

function NotificationSection({ profile }: { profile: Profile }) {
  const [prefs, setPrefs] = useState<NotificationPrefs>(
    profile.notification_prefs ?? { matches: true, payments: true, marketing: false }
  );
  const [saving, setSaving] = useState(false);
  const supabase = createClient();

  const items: { key: keyof NotificationPrefs; label: string; hint: string }[] = [
    {
      key: "matches",
      label: "Match updates",
      hint: "New compatible profiles and contact request updates",
    },
    {
      key: "payments",
      label: "Payment and verification updates",
      hint: "Confirmation when your payment is processed and your status changes",
    },
    {
      key: "marketing",
      label: "News and offers",
      hint: "Occasional updates about new features and promotions",
    },
  ];

  async function save() {
    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update({ notification_prefs: prefs })
      .eq("id", profile.id);
    setSaving(false);
    if (error) toast(error.message, "error");
    else toast("Notification preferences saved.");
  }

  return (
    <Section
      id="notifications"
      title="Notification Preferences"
      description="Choose which WhatsApp and email notifications you receive."
    >
      {items.map((item) => (
        <button
          key={item.key}
          onClick={() => setPrefs({ ...prefs, [item.key]: !prefs[item.key] })}
          className="flex w-full cursor-pointer items-center justify-between gap-4 rounded-xl border border-gray-200 p-4 text-left transition-colors hover:border-coral-muted"
        >
          <span>
            <span className="block text-sm font-bold text-charcoal">
              {item.label}
            </span>
            <span className="block text-xs text-charcoal/60">{item.hint}</span>
          </span>
          <span
            className={cn(
              "relative h-6 w-11 shrink-0 rounded-full transition-colors",
              prefs[item.key] ? "bg-coral" : "bg-gray-200"
            )}
          >
            <span
              className={cn(
                "absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all",
                prefs[item.key] ? "left-[22px]" : "left-0.5"
              )}
            />
          </span>
        </button>
      ))}
      <Button size="sm" onClick={save} loading={saving}>
        Save Preferences
      </Button>
    </Section>
  );
}
