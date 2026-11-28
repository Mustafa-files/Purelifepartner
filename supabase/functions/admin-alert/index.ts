// Supabase Edge Function: admin-alert
//
// Emails the site owners (via Resend) when someone creates an account or
// requests a member's contact details. Called by the `send_admin_alert`
// triggers on public.profiles and public.contact_requests through pg_net.
//
// Safe to expose without JWT verification: it only takes a row id, reads the
// row itself, ignores rows older than 15 minutes, and records every alert in
// `admin_alerts` (unique per kind and row), so each event emails at most once.
//
// Secrets:
//   Resend_api          required (the Resend API key, shared with welcome-email)
//   ADMIN_ALERT_EMAILS  optional, comma separated; defaults to the two owners below
//   ADMIN_ALERT_FROM    optional, defaults to "PureLifePartner Alerts <alerts@purelifepartner.com>"
//
// Deploy:  supabase functions deploy admin-alert --no-verify-jwt
//
// deno-lint-ignore-file no-explicit-any
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const DEFAULT_TO = ["abdullahmahmood155@gmail.com", "youasktv@gmail.com"];
const SITE = "https://purelifepartner.com";
const MAX_AGE_MS = 15 * 60 * 1000;
// Staff bulk-created profiles use this placeholder domain; skip them so a
// bulk import does not send hundreds of emails.
const PLACEHOLDER_DOMAIN = "@members.purelifepartner.com";

type Kind = "new_account" | "contact_request";

Deno.serve(async (req: Request) => {
  if (req.method !== "POST") return json({ error: "POST only" }, 405);

  let kind: Kind | undefined;
  let id: string | undefined;
  try {
    const body = await req.json();
    kind = body?.kind;
    id = body?.id;
  } catch {
    /* fall through */
  }
  if ((kind !== "new_account" && kind !== "contact_request") || !id) {
    return json({ error: "kind and id are required" }, 400);
  }

  const apiKey = Deno.env.get("Resend_api") ?? Deno.env.get("RESEND_API_KEY");
  if (!apiKey) return json({ error: "Resend_api secret is not set" }, 500);
  const from =
    Deno.env.get("ADMIN_ALERT_FROM") ??
    "PureLifePartner Alerts <alerts@purelifepartner.com>";
  const to = (Deno.env.get("ADMIN_ALERT_EMAILS") ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const recipients = to.length ? to : DEFAULT_TO;

  const admin = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  const built = kind === "new_account"
    ? await buildNewAccount(admin, id)
    : await buildContactRequest(admin, id);
  if ("skipped" in built) return json(built);

  // Claim the alert. The unique key on (kind, ref_id) makes it one-time.
  const { error: claimErr } = await admin
    .from("admin_alerts")
    .insert({ kind, ref_id: id, status: "sending" });
  if (claimErr) return json({ skipped: "already sent" });

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: recipients,
      subject: built.subject,
      html: built.html,
    }),
  });
  const result: any = await res.json().catch(() => ({}));

  await admin
    .from("admin_alerts")
    .update(
      res.ok
        ? { status: "sent", resend_id: result.id ?? null, sent_at: new Date().toISOString() }
        : { status: "failed", error: JSON.stringify(result).slice(0, 500) },
    )
    .eq("kind", kind)
    .eq("ref_id", id);

  return res.ok
    ? json({ sent: true, id: result.id })
    : json({ error: "send failed", detail: result }, 502);
});

async function buildNewAccount(admin: any, id: string) {
  const { data: p } = await admin
    .from("profiles")
    .select("user_id_handle, name_private, email, gender, age, whatsapp_no, role, created_at")
    .eq("id", id)
    .maybeSingle();
  if (!p) return { skipped: "profile not found" };
  if (!isFresh(p.created_at)) return { skipped: "too old" };
  const email = (p.email ?? "").toLowerCase();
  if (email.endsWith(PLACEHOLDER_DOMAIN)) return { skipped: "staff created profile" };

  const who = p.user_id_handle || p.name_private || p.email || "A new member";
  return {
    subject: `New account on PureLifePartner: ${who}`,
    html: card("New account created", [
      ["User ID", p.user_id_handle],
      ["Name", p.name_private],
      ["Email", p.email],
      ["Gender", p.gender],
      ["Age", p.age],
      ["WhatsApp", p.whatsapp_no],
      ["Account type", p.role],
      ["Created", when(p.created_at)],
    ], `${SITE}/admin`, "Open the admin panel"),
  };
}

async function buildContactRequest(admin: any, id: string) {
  const { data: r } = await admin
    .from("contact_requests")
    .select("searcher_id, target_id, status, created_at")
    .eq("id", id)
    .maybeSingle();
  if (!r) return { skipped: "request not found" };
  if (!isFresh(r.created_at)) return { skipped: "too old" };

  const { data: people } = await admin
    .from("profiles")
    .select("id, user_id_handle, name_private, email, whatsapp_no")
    .in("id", [r.searcher_id, r.target_id]);
  const by = (pid: string) => (people ?? []).find((x: any) => x.id === pid) ?? {};
  const s: any = by(r.searcher_id);
  const t: any = by(r.target_id);

  return {
    subject: `Contact request: ${s.user_id_handle || "a member"} wants to contact ${t.user_id_handle || "a member"}`,
    html: card("New contact request", [
      ["Requested by", s.user_id_handle],
      ["Their name", s.name_private],
      ["Their email", s.email],
      ["Their WhatsApp", s.whatsapp_no],
      ["Wants to contact", t.user_id_handle],
      ["Member's name", t.name_private],
      ["Status", r.status],
      ["Requested", when(r.created_at)],
    ], `${SITE}/profile/${r.target_id}`, "View the requested profile"),
  };
}

function isFresh(iso?: string | null) {
  return !!iso && Date.now() - new Date(iso).getTime() < MAX_AGE_MS;
}

function when(iso?: string | null) {
  if (!iso) return "";
  return new Date(iso).toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/London",
  }) + " (UK time)";
}

function card(title: string, rows: [string, unknown][], link: string, linkText: string) {
  const body = rows
    .filter(([, v]) => v !== null && v !== undefined && String(v).trim() !== "")
    .map(([k, v]) =>
      `<tr><td style="padding:6px 16px 6px 0;color:#6b6b6b;white-space:nowrap">${escapeHtml(k)}</td>` +
      `<td style="padding:6px 0;color:#1f1f1f">${escapeHtml(String(v))}</td></tr>`
    )
    .join("");
  return `<div style="font-family:Arial,Helvetica,sans-serif;font-size:15px;max-width:560px">
<h2 style="font-size:18px;color:#1f1f1f;margin:0 0 12px">${escapeHtml(title)}</h2>
<table style="border-collapse:collapse">${body}</table>
<p style="margin:20px 0 0"><a href="${link}" style="color:#e2614b;font-weight:bold">${escapeHtml(linkText)}</a></p>
<p style="margin:24px 0 0;color:#9a9a9a;font-size:12px">Automatic alert from PureLifePartner.</p>
</div>`;
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
