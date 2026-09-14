// Supabase Edge Function: handle-login
//
// Signs a member in with their User ID + password when their login email is a
// real address. The browser first tries the placeholder email that bulk
// created accounts use (derivable from the User ID), and only falls back to
// this function, so the member's real email never reaches the browser.
//
// Deployed WITHOUT JWT verification because the caller is not signed in yet.
// It only ever returns a session for a correct password, and every failure
// returns the same generic message so User IDs cannot be probed for emails.
//
// deno-lint-ignore-file no-explicit-any
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const GENERIC_ERROR = "Incorrect User ID or password.";

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const handle = String(body.user_id ?? "").trim();
    const password = String(body.password ?? "");
    if (!/^[A-Za-z0-9_]{3,30}$/.test(handle) || !password) {
      return json({ error: GENERIC_ERROR }, 401);
    }

    const url = Deno.env.get("SUPABASE_URL")!;
    const admin = createClient(url, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    // Case-insensitive exact match; escape LIKE wildcards (underscore).
    const { data: profile } = await admin
      .from("profiles")
      .select("id")
      .ilike("user_id_handle", handle.replace(/[\\%_]/g, (c) => `\\${c}`))
      .maybeSingle();
    if (!profile) return json({ error: GENERIC_ERROR }, 401);

    // Read the current login email from auth, not profiles.email, so members
    // who later changed or added an email still sign in with their User ID.
    const { data: authUser } = await admin.auth.admin.getUserById(profile.id);
    const email = authUser?.user?.email;
    if (!email) return json({ error: GENERIC_ERROR }, 401);

    const anon = createClient(url, Deno.env.get("SUPABASE_ANON_KEY")!, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
    const { data, error } = await anon.auth.signInWithPassword({ email, password });
    if (error || !data.session) {
      if (error && /not confirmed/i.test(error.message)) {
        return json(
          { error: "Please confirm your email first. Check your inbox for the link.", code: "email_not_confirmed" },
          403
        );
      }
      return json({ error: GENERIC_ERROR }, 401);
    }

    return json({
      access_token: data.session.access_token,
      refresh_token: data.session.refresh_token,
    });
  } catch {
    return json({ error: GENERIC_ERROR }, 401);
  }
});

function json(payload: unknown, status = 200): Response {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
