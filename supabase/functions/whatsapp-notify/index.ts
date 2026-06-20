// Supabase Edge Function: whatsapp-notify
//
// Sends an outbound WhatsApp message and records it in `whatsapp_logs`.
// Used for:
//   - new user registration alerts to the admin (item 10)
//   - "new matches found" notifications to members (item 9)
//
// Provider: Meta WhatsApp Cloud API. Set these as function secrets to make
// real sending live (until then the message is still logged):
//   supabase secrets set WHATSAPP_TOKEN=... WHATSAPP_PHONE_NUMBER_ID=...
//
// Deploy WITHOUT JWT verification so the registration alert (which happens
// before the user has a session) can call it:
//   supabase functions deploy whatsapp-notify --no-verify-jwt
//
// deno-lint-ignore-file no-explicit-any
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

interface NotifyBody {
  to?: string;
  message: string;
  profile_id?: string | null;
  kind?: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const body = (await req.json()) as NotifyBody;
    const message = (body.message ?? "").trim();
    if (!message) {
      return json({ error: "message is required" }, 400);
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const admin = createClient(supabaseUrl, serviceKey);

    // Resolve the destination number: explicit `to`, else the member's number.
    let to = body.to ?? null;
    if (!to && body.profile_id) {
      const { data } = await admin
        .from("profiles")
        .select("whatsapp_no, candidate_contact")
        .eq("id", body.profile_id)
        .maybeSingle();
      to = data?.whatsapp_no ?? data?.candidate_contact ?? null;
    }

    // Attempt to send via the Meta WhatsApp Cloud API when configured.
    let sent = false;
    let sendError: string | null = null;
    const token = Deno.env.get("WHATSAPP_TOKEN");
    const phoneId = Deno.env.get("WHATSAPP_PHONE_NUMBER_ID");
    if (token && phoneId && to) {
      const recipient = to.replace(/[^\d]/g, "");
      try {
        const resp = await fetch(
          `https://graph.facebook.com/v21.0/${phoneId}/messages`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              messaging_product: "whatsapp",
              to: recipient,
              type: "text",
              text: { body: message },
            }),
          }
        );
        sent = resp.ok;
        if (!resp.ok) sendError = await resp.text();
      } catch (e) {
        sendError = e instanceof Error ? e.message : String(e);
      }
    }

    // Always log the attempt so it shows in the admin WhatsApp Log.
    await admin.from("whatsapp_logs").insert({
      profile_id: body.profile_id ?? null,
      direction: "outbound",
      message:
        message +
        (to ? `\n[to: ${to}]` : "") +
        (sendError ? `\n[send error: ${sendError}]` : sent ? "" : "\n[logged only: provider not configured]"),
    });

    return json({ ok: true, sent });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return json({ error: msg }, 500);
  }
});

function json(payload: unknown, status = 200): Response {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
