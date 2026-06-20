"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { FieldLabel, Input, RadioGroup } from "@/components/ui/fields";
import { PhoneInput } from "@/components/ui/phone-input";
import { ProgressBar } from "@/components/ui/progress-bar";
import { GoogleButton, OrDivider } from "@/components/ui/google-button";
import { toast } from "@/components/ui/toast";
import { notifyNewRegistration } from "@/lib/notify";
import { GENDERS } from "@/lib/constants";
import {
  AGE_ERROR,
  calcAge,
  parseFlexibleDate,
  toISODate,
  validateEmail,
  validatePassword,
} from "@/lib/utils";

type HandleState = "idle" | "checking" | "available" | "taken";

export default function RegisterStep1() {
  const router = useRouter();
  const [gender, setGender] = useState("");
  const [dobText, setDobText] = useState("");
  const [age, setAge] = useState<number | null>(null);
  const [dobError, setDobError] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("+92 ");
  const [handle, setHandle] = useState("");
  const [handleState, setHandleState] = useState<HandleState>("idle");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Live age calculation from flexible DOB input
  useEffect(() => {
    if (!dobText.trim()) {
      setAge(null);
      setDobError(null);
      return;
    }
    const date = parseFlexibleDate(dobText);
    if (!date) {
      setAge(null);
      setDobError("Enter a valid date (DD/MM/YYYY, MM/DD/YYYY or YYYY/MM/DD).");
      return;
    }
    const a = calcAge(date);
    setAge(a);
    setDobError(a < 16 || a > 35 ? AGE_ERROR : null);
  }, [dobText]);

  // Real-time username availability via Supabase RPC
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    const value = handle.trim();
    if (value.length < 3) {
      setHandleState("idle");
      return;
    }
    setHandleState("checking");
    debounceRef.current = setTimeout(async () => {
      const supabase = createClient();
      const { data, error } = await supabase.rpc("check_handle_available", {
        handle: value,
      });
      if (error) {
        setHandleState("idle");
      } else {
        setHandleState(data ? "available" : "taken");
      }
    }, 450);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [handle]);

  function validate(): boolean {
    const e: Record<string, string> = {};
    if (!gender) e.gender = "Please select your gender.";
    const date = parseFlexibleDate(dobText);
    if (!date) e.dob = "Enter a valid date of birth.";
    else {
      const a = calcAge(date);
      if (a < 16 || a > 35) e.dob = AGE_ERROR;
    }
    if (!validateEmail(email)) e.email = "Enter a valid email address.";
    if (whatsapp.replace(/[^\d]/g, "").length < 8)
      e.whatsapp = "Enter a valid WhatsApp number.";
    if (handle.trim().length < 3)
      e.handle = "User ID must be at least 3 characters.";
    else if (handleState === "taken") e.handle = "This User ID is already taken.";
    const pwErr = validatePassword(password);
    if (pwErr) e.password = pwErr;
    if (password !== password2) e.password2 = "Passwords do not match.";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSave() {
    if (!validate()) return;
    setSubmitting(true);
    const supabase = createClient();
    const date = parseFlexibleDate(dobText)!;

    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: {
          gender,
          dob: toISODate(date),
          age: calcAge(date),
          user_id_handle: handle.trim(),
          whatsapp_no: whatsapp.trim(),
        },
        emailRedirectTo:
          typeof window !== "undefined"
            ? `${window.location.origin}/auth/confirm`
            : undefined,
      },
    });

    if (error) {
      toast(error.message, "error");
      setSubmitting(false);
      return;
    }

    // Alert the admin on WhatsApp about the new registration (best effort).
    notifyNewRegistration({ name: handle.trim(), email: email.trim() });

    // If email confirmation is disabled a session exists right away;
    // otherwise the user must confirm via the email we just sent.
    if (data.session) {
      toast("Account created. Welcome to PureLifePartner!");
      router.push("/register/personal");
    } else {
      setEmailSent(true);
    }
    setSubmitting(false);
  }

  if (emailSent) {
    return (
      <div className="bg-off-white py-20">
        <div className="mx-auto max-w-lg rounded-2xl bg-white p-10 text-center shadow-sm">
          <div className="text-5xl">📬</div>
          <h1 className="mt-4 text-2xl font-bold text-charcoal">
            Confirm your email
          </h1>
          <p className="mt-3 text-charcoal/70">
            We sent a confirmation link to{" "}
            <span className="font-bold">{email}</span>. Click the link to verify
            your email and continue your registration. You must confirm your
            email before you can sign in.
          </p>
          <Link href="/login" className="mt-6 inline-block">
            <Button variant="outline">Go to Sign In</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-off-white py-12">
      <div className="mx-auto max-w-2xl px-4">
        <ProgressBar step={1} />
        <div className="rounded-2xl bg-white p-6 shadow-sm sm:p-10">
          <h1 className="mb-2 text-2xl font-bold text-charcoal">
            Create Your Account
          </h1>
          <p className="mb-8 text-sm text-charcoal/60">
            Already a member?{" "}
            <Link href="/login" className="font-bold text-coral hover:underline">
              Sign in here
            </Link>
          </p>

          <div className="mb-6 space-y-4">
            <GoogleButton next="/dashboard" />
            <OrDivider />
          </div>

          <div className="space-y-5">
            <FieldLabel label="Gender" required error={errors.gender}>
              <RadioGroup
                name="gender"
                options={GENDERS}
                value={gender}
                onChange={setGender}
              />
            </FieldLabel>

            <div className="grid gap-5 sm:grid-cols-2">
              <FieldLabel
                label="Date of Birth"
                required
                hint="DD/MM/YYYY, MM/DD/YYYY or YYYY/MM/DD"
                error={errors.dob || dobError}
              >
                <Input
                  value={dobText}
                  onChange={(e) => setDobText(e.target.value)}
                  placeholder="25/06/2000"
                />
              </FieldLabel>
              <FieldLabel label="Age" hint="Calculated automatically">
                <Input value={age ?? ""} readOnly placeholder="--" />
              </FieldLabel>
            </div>

            <FieldLabel label="Email" required error={errors.email}>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
              />
            </FieldLabel>

            <FieldLabel label="WhatsApp / Contact No" required error={errors.whatsapp}>
              <PhoneInput value={whatsapp} onChange={setWhatsapp} />
            </FieldLabel>

            <FieldLabel
              label="User ID"
              required
              hint="Shown publicly instead of your real name"
              error={errors.handle}
            >
              <div className="relative">
                <Input
                  value={handle}
                  onChange={(e) =>
                    setHandle(e.target.value.replace(/[^a-zA-Z0-9_]/g, ""))
                  }
                  placeholder="e.g. Ahmed_92"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold">
                  {handleState === "checking" && (
                    <span className="text-gray-400">Checking...</span>
                  )}
                  {handleState === "available" && (
                    <span className="text-green-600">✓ Available</span>
                  )}
                  {handleState === "taken" && (
                    <span className="text-red-600">✗ Taken</span>
                  )}
                </span>
              </div>
            </FieldLabel>

            <div className="grid gap-5 sm:grid-cols-2">
              <FieldLabel
                label="Password"
                required
                hint="Min 8 chars with uppercase, lowercase and a number"
                error={errors.password}
              >
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </FieldLabel>
              <FieldLabel label="Repeat Password" required error={errors.password2}>
                <Input
                  type="password"
                  value={password2}
                  onChange={(e) => setPassword2(e.target.value)}
                />
              </FieldLabel>
            </div>
          </div>

          <div className="mt-10 flex justify-end">
            <Button onClick={handleSave} loading={submitting}>
              Save & Continue →
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
