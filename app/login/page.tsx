"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { FieldLabel, Input } from "@/components/ui/fields";
import { GoogleButton, OrDivider } from "@/components/ui/google-button";
import { toast } from "@/components/ui/toast";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function signIn() {
    if (!email || !password) {
      toast("Enter your email and password.", "error");
      return;
    }
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    setLoading(false);
    if (error) {
      toast(error.message, "error");
      return;
    }
    router.push(params.get("next") ?? "/dashboard");
    router.refresh();
  }

  async function resetPassword() {
    if (!email) {
      toast("Enter your email first, then click reset.", "error");
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

          <div className="mb-6 space-y-4">
            <GoogleButton next={params.get("next") ?? "/dashboard"} />
            <OrDivider />
          </div>

          <div className="space-y-5">
            <FieldLabel label="Email" required>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && signIn()}
              />
            </FieldLabel>
            <FieldLabel label="Password" required>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && signIn()}
              />
            </FieldLabel>
          </div>

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

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
