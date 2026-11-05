// Supabase Edge Function: welcome-email
//
// Sends the welcome email (via Resend) once a member confirms their email.
// Called by the `send_welcome_email` trigger on auth.users through pg_net.
//
// Safe to expose without JWT verification: it only takes a user id, checks
// the account itself, and records every send in `welcome_emails`, so each
// member can get the email at most once.
//
// Secrets:
//   Resend_api       required (the Resend API key)
//   RESEND_FROM      optional, defaults to "PureLifePartner <welcome@purelifepartner.com>"
//
// Deploy:  supabase functions deploy welcome-email --no-verify-jwt
//
// deno-lint-ignore-file no-explicit-any
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { WELCOME_HTML, WELCOME_SUBJECT } from "./template.ts";

// Staff-created profiles use placeholder addresses that cannot receive mail.
const PLACEHOLDER_DOMAIN = "@members.purelifepartner.com";

Deno.serve(async (req: Request) => {
  if (req.method !== "POST") return json({ error: "POST only" }, 405);

  let userId: string | undefined;
  try {
    userId = (await req.json())?.user_id;
  } catch {
    /* fall through */
  }
  if (!userId) return json({ error: "user_id is required" }, 400);

  // The secret is saved in Supabase as `Resend_api` (names are case-sensitive).
  const apiKey = Deno.env.get("Resend_api") ?? Deno.env.get("RESEND_API_KEY");
  if (!apiKey) return json({ error: "Resend_api secret is not set" }, 500);
  const from =
    Deno.env.get("RESEND_FROM") ??
    "PureLifePartner <welcome@purelifepartner.com>";

  const admin = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  const { data: userRes, error: userErr } = await admin.auth.admin
    .getUserById(userId);
  const user = userRes?.user;
  if (userErr || !user) return json({ error: "user not found" }, 404);

  const email = user.email?.toLowerCase() ?? "";
  if (!email || email.endsWith(PLACEHOLDER_DOMAIN)) {
    return json({ skipped: "no deliverable email" });
  }
  if (!user.email_confirmed_at) {
    return json({ skipped: "email not confirmed" });
  }

  // Claim the send. The primary key on user_id makes this a one-time action.
  const { error: claimErr } = await admin
    .from("welcome_emails")
    .insert({ user_id: userId, email, status: "sending" });
  if (claimErr) return json({ skipped: "already sent" });

  // Greet by name when we have one (often not filled in yet at this point).
  const { data: profile } = await admin
    .from("profiles")
    .select("name_private, user_id_handle")
    .eq("id", userId)
    .maybeSingle();
  const name = firstName(profile?.name_private) ?? profile?.user_id_handle;
  const greeting = name
    ? `Assalamu alaikum, ${escapeHtml(name)}`
    : "Assalamu alaikum";

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [email],
      subject: WELCOME_SUBJECT,
      html: WELCOME_HTML.replaceAll("{{greeting}}", greeting),
    }),
  });
  const result: any = await res.json().catch(() => ({}));

  if (!res.ok) {
    await admin
      .from("welcome_emails")
      .update({ status: "failed", error: JSON.stringify(result).slice(0, 500) })
      .eq("user_id", userId);
    return json({ error: "send failed", detail: result }, 502);
  }

  await admin
    .from("welcome_emails")
    .update({ status: "sent", resend_id: result.id ?? null, sent_at: new Date().toISOString() })
    .eq("user_id", userId);
  return json({ sent: true, id: result.id });
});

function firstName(full?: string | null) {
  const first = full?.trim().split(/\s+/)[0];
  return first ? first : null;
}

function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!
  );
}

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}
