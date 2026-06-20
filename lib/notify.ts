import { createClient } from "@/lib/supabase";
import { WHATSAPP_NUMBER } from "@/lib/utils";

/**
 * Fire-and-forget call to the `whatsapp-notify` Supabase Edge Function.
 * Notifications must never block or break the user flow, so every error is
 * swallowed. The Edge Function sends the WhatsApp message (when provider
 * credentials are configured) and records it in `whatsapp_logs`.
 */
async function invoke(body: Record<string, unknown>) {
  try {
    const supabase = createClient();
    const { error } = await supabase.functions.invoke("whatsapp-notify", {
      body,
    });
    if (error) console.error("whatsapp-notify error:", error.message);
  } catch (e) {
    console.error("whatsapp-notify failed:", e);
  }
}

/** Alert the admin number when a new user registers (item 10). */
export async function notifyNewRegistration(args: {
  name: string;
  email: string;
}) {
  const when = new Date().toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
  await invoke({
    to: WHATSAPP_NUMBER,
    kind: "new_registration",
    message:
      "New PureLifePartner registration\n" +
      `Name / User ID: ${args.name}\n` +
      `Email: ${args.email}\n` +
      `Registered: ${when}`,
  });
}

/** Notify a member that new matches were found for their requirements (item 9). */
export async function notifyNewMatches(profileId: string, count: number) {
  await invoke({
    profile_id: profileId,
    kind: "new_matches",
    message:
      `Good news! We found ${count} new match${count === 1 ? "" : "es"} ` +
      "for your partner requirements on PureLifePartner. Sign in to view them.",
  });
}
