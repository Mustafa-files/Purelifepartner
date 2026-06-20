"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";

type Status = "verifying" | "success" | "expired" | "error";

/**
 * Handles the email confirmation link Supabase sends after sign up.
 *
 * Supabase verifies the token server side then redirects here. Depending on
 * the project's auth flow that arrives as one of:
 *   - ?token_hash=...&type=signup   (verifyOtp, works on any device)
 *   - ?code=...                     (PKCE, exchanged for a session)
 *   - #access_token=...             (implicit, set directly)
 *   - ?error=...&error_description= (expired or already used link)
 *
 * We handle every case and always show a clean message instead of a raw error.
 */
function ConfirmInner() {
  const router = useRouter();
  const [status, setStatus] = useState<Status>("verifying");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const supabase = createClient();
    const url = new URL(window.location.href);
    const params = url.searchParams;
    // Errors can come back in the query string or the URL hash fragment.
    const hash = new URLSearchParams(url.hash.replace(/^#/, ""));

    const errorDescription =
      params.get("error_description") || hash.get("error_description");
    const errorCode =
      params.get("error_code") || hash.get("error_code") || params.get("error");

    async function run() {
      if (errorDescription || errorCode) {
        const expired =
          /expired|otp_expired|invalid|already/i.test(errorDescription ?? "") ||
          /expired|otp_expired|access_denied/i.test(errorCode ?? "");
        setStatus(expired ? "expired" : "error");
        setMessage(
          errorDescription?.replace(/\+/g, " ") ||
            "We could not confirm this link."
        );
        return;
      }

      const tokenHash = params.get("token_hash");
      const type = params.get("type");
      const code = params.get("code");
      const accessToken = hash.get("access_token");
      const refreshToken = hash.get("refresh_token");

      try {
        if (tokenHash && type) {
          const { error } = await supabase.auth.verifyOtp({
            type: type as "signup" | "email" | "recovery" | "email_change",
            token_hash: tokenHash,
          });
          if (error) throw error;
        } else if (code) {
          const { error } = await supabase.auth.exchangeCodeForSession(code);
          if (error) throw error;
        } else if (accessToken && refreshToken) {
          const { error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });
          if (error) throw error;
        } else {
          // No token at all: the user may already be confirmed.
          const { data } = await supabase.auth.getUser();
          if (!data.user) {
            setStatus("error");
            setMessage("This confirmation link is missing its token.");
            return;
          }
        }

        setStatus("success");
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        const expired = /expired|invalid|already|used/i.test(msg);
        setStatus(expired ? "expired" : "error");
        setMessage(msg);
      }
    }

    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Once verified, send the user on to continue their registration.
  useEffect(() => {
    if (status !== "success") return;
    const t = setTimeout(() => router.replace("/register/personal"), 1800);
    return () => clearTimeout(t);
  }, [status, router]);

  return (
    <div className="bg-off-white py-20">
      <div className="mx-auto max-w-lg px-4">
        <div className="rounded-2xl bg-white p-10 text-center shadow-sm">
          {status === "verifying" && (
            <>
              <div className="text-5xl">⏳</div>
              <h1 className="mt-4 text-2xl font-bold text-charcoal">
                Confirming your email...
              </h1>
              <p className="mt-3 text-charcoal/70">
                This only takes a moment.
              </p>
            </>
          )}

          {status === "success" && (
            <>
              <div className="text-5xl">✅</div>
              <h1 className="mt-4 text-2xl font-bold text-charcoal">
                Email confirmed
              </h1>
              <p className="mt-3 text-charcoal/70">
                Your email is verified. Taking you to the next step...
              </p>
              <Link href="/register/personal" className="mt-6 inline-block">
                <Button>Continue Registration</Button>
              </Link>
            </>
          )}

          {status === "expired" && (
            <>
              <div className="text-5xl">⌛</div>
              <h1 className="mt-4 text-2xl font-bold text-charcoal">
                This link has expired
              </h1>
              <p className="mt-3 text-charcoal/70">
                Your confirmation link is no longer valid or has already been
                used. If your email is already confirmed you can simply sign in.
                Otherwise, request a fresh link below.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <Link href="/login">
                  <Button>Go to Sign In</Button>
                </Link>
                <ResendButton />
              </div>
            </>
          )}

          {status === "error" && (
            <>
              <div className="text-5xl">😕</div>
              <h1 className="mt-4 text-2xl font-bold text-charcoal">
                We could not confirm your email
              </h1>
              <p className="mt-3 text-charcoal/70">
                {message || "Something went wrong with this link."}
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <Link href="/login">
                  <Button>Go to Sign In</Button>
                </Link>
                <ResendButton />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function ResendButton() {
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);

  async function resend() {
    if (!email.trim()) {
      toast("Enter your email to resend the confirmation link.", "error");
      return;
    }
    setSending(true);
    const supabase = createClient();
    const { error } = await supabase.auth.resend({
      type: "signup",
      email: email.trim(),
      options: {
        emailRedirectTo: `${window.location.origin}/auth/confirm`,
      },
    });
    setSending(false);
    if (error) toast(error.message, "error");
    else toast("A new confirmation link is on its way. Check your inbox.");
  }

  return (
    <div className="flex w-full flex-col items-center gap-2 sm:flex-row sm:justify-center">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@example.com"
        className="w-full max-w-xs rounded-xl border border-gray-300 px-4 py-2.5 text-sm"
      />
      <Button variant="outline" onClick={resend} loading={sending}>
        Resend Link
      </Button>
    </div>
  );
}

export default function ConfirmPage() {
  return (
    <Suspense>
      <ConfirmInner />
    </Suspense>
  );
}
