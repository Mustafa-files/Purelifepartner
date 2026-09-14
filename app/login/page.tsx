"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { FieldLabel, Input } from "@/components/ui/fields";
import { toast } from "@/components/ui/toast";
import { memberEmailFor } from "@/lib/bulk-profiles";
import { safeNextPath } from "@/lib/safe-next";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [needsConfirm, setNeedsConfirm] = useState(false);
  // When a confirmation/auth link fails, the confirm page bounces the user
  // here so they cannot proceed as if signed in. Tell them clearly why.
  useEffect(() => {
    if (params.get("error") === "auth_failed") {
      toast(
        "Authentication failed. You have not been signed in. Please sign in or create a new account.",
        "error"
      );
    } else if (params.get("confirmed") === "1") {
      toast("Email confirmed. Please sign in to continue.");
    }
  }, [params]);

  const isEmail = email.includes("@");

  async function signIn() {
    const identifier = email.trim();
    if (!identifier || !password) {
      toast("Enter your email or User ID and password.", "error");
      return;
    }
    setLoading(true);
    setNeedsConfirm(false);
    const error = isEmail
      ? await signInWithEmail(identifier, password)
      : await signInWithUserId(identifier, password);
    setLoading(false);
    if (error) {
      // Supabase blocks sign in until the email is confirmed.
      if (/email not confirmed|not confirmed|email_not_confirmed/i.test(error)) {
        setNeedsConfirm(isEmail);
        toast(
          "Please confirm your email first. Check your inbox for the link.",
          "error"
        );
        return;
      }
      toast(error, "error");
      return;
    }
    router.push(safeNextPath(params.get("next")) ?? "/dashboard");
    router.refresh();
  }

  async function resendConfirmation() {
    if (!isEmail) {
      toast("Enter your email first.", "error");
      return;
    }
    const supabase = createClient();
    const { error } = await supabase.auth.resend({
      type: "signup",
      email: email.trim(),
      options: { emailRedirectTo: `${window.location.origin}/auth/confirm` },
    });
    if (error) toast(error.message, "error");
    else toast("A new confirmation link is on its way. Check your inbox.");
  }

  async function resetPassword() {
    if (!isEmail) {
      toast(
        "Enter your email first, then click reset. Signed up with a User ID only? Contact us on WhatsApp to reset your password.",
        "error"
      );
      return;
    }
    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/login`,
    });
    if (error) toast(error.message, "error");
    else toast("Password reset email sent. Check your inbox.");
  }

  return (
    <div className="bg-off-white py-20">
      <div className="mx-auto max-w-md px-4">
        <div className="rounded-2xl bg-white p-8 shadow-sm sm:p-10">
          <h1 className="text-2xl font-bold text-charcoal">Welcome Back</h1>
          <p className="mt-2 mb-8 text-sm text-charcoal/60">
            New to PureLifePartner?{" "}
            <Link
              href="/register"
              className="font-bold text-coral hover:underline"
            >
              Create a free profile
            </Link>
          </p>

          <div className="space-y-5">
            <FieldLabel label="Email or User ID" required>
              <Input
                type="text"
                autoComplete="username"
                autoCapitalize="none"
                spellCheck={false}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && signIn()}
              />
            </FieldLabel>
            <FieldLabel label="Password" required>
              <Input
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && signIn()}
              />
            </FieldLabel>
          </div>

          {needsConfirm && (
            <div className="mt-6 rounded-xl bg-amber-50 p-4 text-sm text-amber-800">
              Your email is not confirmed yet. Please click the link in the
              confirmation email we sent you.{" "}
              <button
                onClick={resendConfirmation}
                className="cursor-pointer font-bold underline"
              >
                Resend confirmation link
              </button>
            </div>
          )}

          <Button className="mt-8 w-full" onClick={signIn} loading={loading}>
            Sign In
          </Button>

          <button
            onClick={resetPassword}
            className="mt-4 block w-full cursor-pointer text-center text-sm font-semibold text-charcoal/60 hover:text-coral"
          >
            Forgot your password?
          </button>
        </div>
      </div>
    </div>
  );
}

/** Returns an error message, or null when signed in. */
async function signInWithEmail(email: string, password: string): Promise<string | null> {
  const supabase = createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  return error ? error.message : null;
}

async function signInWithUserId(userId: string, password: string): Promise<string | null> {
  if (!/^[A-Za-z0-9_]{3,30}$/.test(userId)) {
    return "Enter a valid email address or User ID.";
  }
  const supabase = createClient();

  // Accounts created by staff sign in with a placeholder email derived from
  // the User ID, so try that directly first.
  const direct = await supabase.auth.signInWithPassword({
    email: memberEmailFor(userId),
    password,
  });
  if (!direct.error) return null;

  // Otherwise the account has a real email; the server looks it up so it is
  // never exposed to the browser.
  const { data, error } = await supabase.functions.invoke("handle-login", {
    body: { user_id: userId, password },
  });
  if (error || !data?.access_token) {
    const context = (error as { context?: Response } | null)?.context;
    try {
      const body = context ? await context.json() : null;
      if (body?.error) return body.error;
    } catch {
      // Fall through to the generic message.
    }
    return "Incorrect User ID or password.";
  }
  const { error: sessionError } = await supabase.auth.setSession({
    access_token: data.access_token,
    refresh_token: data.refresh_token,
  });
  return sessionError ? sessionError.message : null;
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
