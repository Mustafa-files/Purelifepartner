// Supabase Edge Function: staff-accounts
//
// Staff-only account management that needs the service role key, which never
// leaves Supabase:
//   - action "bulk_create": admins and agents create member accounts for
//     people without an email. Each login gets a placeholder email
//     (<user id>@members.purelifepartner.com) that is marked confirmed, so no
//     email is ever sent or bounced. Members sign in with User ID + password.
//   - action "reset_password": admins (or the agent who owns the profile) set
//     a new generated password for a member.
//
// Deployed WITH JWT verification; the caller's role is re-checked below.
//
// deno-lint-ignore-file no-explicit-any
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const MEMBER_EMAIL_DOMAIN = "members.purelifepartner.com";
const MAX_ROWS_PER_REQUEST = 50;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const TEXT_FIELDS = [
  "marital_status",
  "qualification",
  "profession_detail",
  "religion",
  "sect",
  "practice_nazar",
  "caste",
  "sub_caste",
  "describe_yourself",
  "job_details",
  "income_details",
  "family_details",
  "residence_type",
  "property_size",
  "story_type",
  "other_properties",
] as const;
const ARRAY_FIELDS = [
  "profession",
  "nationality",
  "residence_country",
  "city",
] as const;
const DYNAMIC_CATEGORIES = new Set([
  "qualification",
  "profession",
  "religion",
  "sect",
  "caste",
  "sub_caste",
]);

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const url = Deno.env.get("SUPABASE_URL")!;
    const admin = createClient(url, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    // Identify the caller from their own JWT, then read their role.
    const jwt = (req.headers.get("Authorization") ?? "").replace(/^Bearer\s+/i, "");
    const { data: userData, error: userErr } = await admin.auth.getUser(jwt);
    if (userErr || !userData.user) return json({ error: "Not signed in." }, 401);
    const callerId = userData.user.id;
    const { data: caller } = await admin
      .from("profiles")
      .select("role")
      .eq("id", callerId)
      .maybeSingle();
    const role = caller?.role;
    if (role !== "admin" && role !== "agent") {
      return json({ error: "Only admins and agents can do this." }, 403);
    }

    const body = await req.json();
    if (body.action === "bulk_create") {
      return await bulkCreate(admin, callerId, role, body);
    }
    if (body.action === "reset_password") {
      return await resetPassword(admin, callerId, role, body);
    }
    return json({ error: "Unknown action." }, 400);
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return json({ error: msg }, 500);
  }
});

async function bulkCreate(admin: any, callerId: string, role: string, body: any) {
  const rows: any[] = Array.isArray(body.rows) ? body.rows : [];
  if (rows.length === 0) return json({ error: "No rows to create." }, 400);
  if (rows.length > MAX_ROWS_PER_REQUEST) {
    return json({ error: `Send at most ${MAX_ROWS_PER_REQUEST} rows per request.` }, 400);
  }

  const results = [];
  const customValues = new Map<string, { category: string; value: string }>();

  for (let i = 0; i < rows.length; i++) {
    const raw = rows[i] ?? {};
    const ref = raw.ref ?? i;
    try {
      const account = validateAccount(raw);
      if (typeof account === "string") {
        results.push({ ref, ok: false, error: account });
        continue;
      }

      let handle = account.handle;
      if (handle) {
        if (!(await handleAvailable(admin, handle))) {
          results.push({ ref, ok: false, error: `User ID "${handle}" is already taken.` });
          continue;
        }
      } else {
        handle = await generateHandle(admin);
      }
      const password = account.password || generatePassword();

      const { data: created, error: createErr } = await admin.auth.admin.createUser({
        email: `${handle.toLowerCase()}@${MEMBER_EMAIL_DOMAIN}`,
        password,
        email_confirm: true,
        user_metadata: {
          gender: account.gender,
          dob: account.dob,
          age: account.age,
          user_id_handle: handle,
          whatsapp_no: account.whatsapp_no,
          name_private: account.name_private,
          created_by_staff: callerId,
        },
      });
      if (createErr || !created?.user) {
        results.push({ ref, ok: false, error: createErr?.message ?? "Could not create login." });
        continue;
      }
      const userId = created.user.id;

      const profileFields = pickProfileFields(raw);
      const { error: updateErr } = await admin
        .from("profiles")
        .update({
          ...profileFields,
          agent_id: role === "agent" ? callerId : null,
          registration_step: registrationStep(profileFields),
        })
        .eq("id", userId);
      if (updateErr) {
        // Roll back so a half-created account is never left behind.
        await admin.auth.admin.deleteUser(userId);
        results.push({ ref, ok: false, error: updateErr.message });
        continue;
      }

      for (const cv of Array.isArray(raw.custom_values) ? raw.custom_values : []) {
        const category = String(cv?.category ?? "");
        const value = String(cv?.value ?? "").trim().slice(0, 200);
        if (DYNAMIC_CATEGORIES.has(category) && value) {
          customValues.set(`${category}:${value.toLowerCase()}`, { category, value });
        }
      }

      results.push({ ref, ok: true, id: userId, user_id_handle: handle, password });
    } catch (e) {
      results.push({ ref, ok: false, error: e instanceof Error ? e.message : String(e) });
    }
  }

  // Custom dropdown values go to the admin approval queue, like the sign up
  // form's "Others" option. Skip ones already queued.
  if (customValues.size > 0) {
    const { data: existing } = await admin.from("dynamic_values").select("category, value");
    const seen = new Set(
      (existing ?? []).map((d: any) => `${d.category}:${String(d.value).toLowerCase()}`)
    );
    const fresh = [...customValues.entries()]
      .filter(([k]) => !seen.has(k))
      .map(([, v]) => v);
    if (fresh.length > 0) await admin.from("dynamic_values").insert(fresh);
  }

  return json({ results });
}

async function resetPassword(admin: any, callerId: string, role: string, body: any) {
  const profileId = String(body.profile_id ?? "");
  const { data: target } = await admin
    .from("profiles")
    .select("id, role, agent_id, user_id_handle")
    .eq("id", profileId)
    .maybeSingle();
  if (!target) return json({ error: "Profile not found." }, 404);
  if (target.role === "admin" && target.id !== callerId) {
    return json({ error: "Admin passwords cannot be reset here." }, 403);
  }
  if (role === "agent" && target.agent_id !== callerId) {
    return json({ error: "Agents can only reset profiles they manage." }, 403);
  }

  const password = generatePassword();
  const { error } = await admin.auth.admin.updateUserById(profileId, { password });
  if (error) return json({ error: error.message }, 400);
  return json({ ok: true, user_id_handle: target.user_id_handle, password });
}

/* ---------------- validation ---------------- */

function validateAccount(raw: any) {
  const gender = str(raw.gender);
  if (gender !== "Male" && gender !== "Female") return "Gender must be Male or Female.";

  const dob = str(raw.dob);
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dob);
  const date = m ? new Date(Date.UTC(+m[1], +m[2] - 1, +m[3])) : null;
  if (!date || isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== dob) {
    return "Date of birth is not a valid date.";
  }
  const age = ageOn(date);
  if (age < 16 || age > 35) return "Age must be between 16 and 35.";

  const whatsapp_no = str(raw.whatsapp_no);
  if (whatsapp_no.replace(/\D/g, "").length < 8) return "WhatsApp number is too short.";

  const name_private = str(raw.name_private);
  if (!name_private) return "Name is required.";

  const handle = str(raw.user_id_handle);
  if (handle && !/^[A-Za-z0-9_]{3,30}$/.test(handle)) {
    return "User ID must be 3 to 30 letters, numbers or underscores.";
  }

  const password = str(raw.password);
  if (password) {
    if (
      password.length < 8 ||
      !/[A-Z]/.test(password) ||
      !/[a-z]/.test(password) ||
      !/[0-9]/.test(password)
    ) {
      return "Password needs 8+ characters with uppercase, lowercase and a number.";
    }
  }

  return {
    gender,
    dob,
    age,
    whatsapp_no: whatsapp_no.slice(0, 40),
    name_private: name_private.slice(0, 200),
    handle,
    password,
  };
}

function pickProfileFields(raw: any) {
  const out: Record<string, unknown> = {};
  for (const f of TEXT_FIELDS) {
    const v = str(raw[f]);
    if (v) out[f] = v.slice(0, 4000);
  }
  for (const f of ARRAY_FIELDS) {
    if (Array.isArray(raw[f])) {
      const arr = raw[f].map((x: unknown) => str(x).slice(0, 200)).filter(Boolean);
      if (arr.length) out[f] = arr.slice(0, 20);
    }
  }
  const ft = int(raw.height_ft, 3, 8);
  const inch = int(raw.height_in, 0, 11);
  if (ft != null) {
    out.height_ft = ft;
    out.height_in = inch ?? 0;
    out.height_cm = Math.round((ft * 30.48 + (inch ?? 0) * 2.54) * 10) / 10;
  }
  const weight = Number(raw.weight_kg);
  if (raw.weight_kg !== "" && raw.weight_kg != null && weight >= 25 && weight <= 250) {
    out.weight_kg = weight;
  }
  return out;
}

// Mirrors the sign up steps: a step only counts once its required fields are
// present and every earlier step is complete. Partner requirements (step 5)
// are always left for later.
function registrationStep(p: Record<string, unknown>): number {
  const has = (k: string) =>
    Array.isArray(p[k]) ? (p[k] as unknown[]).length > 0 : Boolean(p[k]);
  if (!(has("marital_status") && has("qualification") && has("profession"))) return 1;
  if (!(has("religion") && has("caste"))) return 2;
  if (!(has("nationality") && has("residence_country") && has("residence_type"))) return 3;
  return 4;
}

/* ---------------- helpers ---------------- */

async function handleAvailable(admin: any, handle: string): Promise<boolean> {
  const { data, error } = await admin.rpc("check_handle_available", { handle });
  if (error) throw new Error(error.message);
  return data === true;
}

async function generateHandle(admin: any): Promise<string> {
  for (let i = 0; i < 10; i++) {
    const n = crypto.getRandomValues(new Uint32Array(1))[0] % 900000 + 100000;
    const handle = `PLP${n}`;
    if (await handleAvailable(admin, handle)) return handle;
  }
  throw new Error("Could not generate a unique User ID. Please try again.");
}

function generatePassword(): string {
  // No look-alike characters (0/O, 1/l/I) so it is easy to read out.
  const upper = "ABCDEFGHJKLMNPQRSTUVWXYZ";
  const lower = "abcdefghijkmnpqrstuvwxyz";
  const digits = "23456789";
  const all = upper + lower + digits;
  const pick = (set: string) => set[crypto.getRandomValues(new Uint32Array(1))[0] % set.length];
  const chars = [pick(upper), pick(lower), pick(digits)];
  while (chars.length < 10) chars.push(pick(all));
  for (let i = chars.length - 1; i > 0; i--) {
    const j = crypto.getRandomValues(new Uint32Array(1))[0] % (i + 1);
    [chars[i], chars[j]] = [chars[j], chars[i]];
  }
  return chars.join("");
}

function ageOn(dob: Date): number {
  const now = new Date();
  let age = now.getUTCFullYear() - dob.getUTCFullYear();
  const m = now.getUTCMonth() - dob.getUTCMonth();
  if (m < 0 || (m === 0 && now.getUTCDate() < dob.getUTCDate())) age--;
  return age;
}

function str(v: unknown): string {
  return v == null ? "" : String(v).trim();
}

function int(v: unknown, min: number, max: number): number | null {
  if (v === "" || v == null) return null;
  const n = Number(v);
  return Number.isInteger(n) && n >= min && n <= max ? n : null;
}

function json(payload: unknown, status = 200): Response {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
