"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { FieldLabel, Input, Select, Textarea } from "@/components/ui/fields";
import { RoleBadge } from "@/components/ui/role-badge";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/toast";
import { CURRENCIES, PROFILE_STATUSES } from "@/lib/constants";
import { cn, formatDateTime } from "@/lib/utils";
import type {
  AgentProfile,
  BankAccount,
  DynamicValue,
  OfficeNote,
  Payment,
  Profile,
  WhatsAppLog,
} from "@/types";

const TABS = [
  "Users",
  "Agents",
  "Payments",
  "Dropdown Values",
  "WhatsApp Log",
  "Notes",
  "Bank Accounts",
] as const;
type Tab = (typeof TABS)[number];

export default function AdminDashboard() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("Users");
  const [authorized, setAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) {
        router.replace("/login?next=/admin");
        return;
      }
      const { data: role } = await supabase.rpc("get_my_role");
      if (role !== "admin") {
        toast("Admin access required.", "error");
        router.replace("/dashboard");
        return;
      }
      setAuthorized(true);
    });
  }, [router]);

  if (authorized === null) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-12">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="mt-6 h-96 w-full rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="bg-off-white py-10">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h1 className="text-3xl font-bold text-charcoal">Admin Panel</h1>
        <div className="mt-6 flex flex-wrap gap-2">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={cn(
                "cursor-pointer rounded-full px-4 py-2 text-sm font-bold transition-colors",
                tab === t
                  ? "bg-coral text-white"
                  : "bg-white text-charcoal hover:bg-coral/10"
              )}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="mt-6">
          {tab === "Users" && <UsersTab />}
          {tab === "Agents" && <AgentsTab />}
          {tab === "Payments" && <PaymentsTab />}
          {tab === "Dropdown Values" && <DynamicValuesTab />}
          {tab === "WhatsApp Log" && <WhatsAppTab />}
          {tab === "Notes" && <NotesTab />}
          {tab === "Bank Accounts" && <BankAccountsTab />}
        </div>
      </div>
    </div>
  );
}

function Panel({ children }: { children: React.ReactNode }) {
  return (
    <div className="overflow-x-auto rounded-2xl bg-white p-6 shadow-sm">
      {children}
    </div>
  );
}

/* ---------------- Users ---------------- */

function UsersTab() {
  const [users, setUsers] = useState<Profile[]>([]);
  const [agents, setAgents] = useState<Profile[]>([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  const load = useCallback(async () => {
    setLoading(true);
    let q = supabase
      .from("profiles")
      .select("*")
      .order("internal_id", { ascending: true });
    if (statusFilter) q = q.eq("status", statusFilter);
    const { data } = await q;
    const all = (data ?? []) as Profile[];
    setUsers(all);
    setAgents(all.filter((p) => p.role === "agent"));
    setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  useEffect(() => {
    load();
  }, [load]);

  async function update(id: string, fields: Partial<Profile>) {
    const { error } = await supabase.from("profiles").update(fields).eq("id", id);
    if (error) toast(error.message, "error");
    else {
      toast("Updated.");
      load();
    }
  }

  async function remove(id: string, handle: string | null) {
    if (!confirm(`Delete profile ${handle ?? id}? This cannot be undone.`)) return;
    // TODO: also delete the auth.users row via a service-role edge function;
    // deleting the profile row alone leaves the login account orphaned.
    const { error } = await supabase.from("profiles").delete().eq("id", id);
    if (error) toast(error.message, "error");
    else {
      toast("Profile deleted.");
      load();
    }
  }

  return (
    <Panel>
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <Select
          options={PROFILE_STATUSES}
          placeholder="All statuses"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="max-w-xs"
        />
        <span className="text-sm text-charcoal/50">{users.length} users</span>
      </div>
      {loading ? (
        <Skeleton className="h-48 w-full" />
      ) : (
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead>
            <tr className="border-b border-gray-100 text-xs uppercase tracking-wide text-charcoal/50">
              <th className="py-2 pr-3">No.</th>
              <th className="py-2 pr-3">User ID</th>
              <th className="py-2 pr-3">Name (private)</th>
              <th className="py-2 pr-3">Email</th>
              <th className="py-2 pr-3">Status</th>
              <th className="py-2 pr-3">Role</th>
              <th className="py-2 pr-3">Agent</th>
              <th className="py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-b border-gray-50">
                <td className="py-2.5 pr-3 font-bold">{u.internal_id}</td>
                <td className="py-2.5 pr-3">{u.user_id_handle}</td>
                <td className="py-2.5 pr-3">{u.name_private}</td>
                <td className="py-2.5 pr-3">{u.email}</td>
                <td className="py-2.5 pr-3">
                  <select
                    value={u.status}
                    onChange={(e) =>
                      update(u.id, {
                        status: e.target.value as Profile["status"],
                        ...(e.target.value === "Verified"
                          ? { verified_at: new Date().toISOString() }
                          : {}),
                      })
                    }
                    className="cursor-pointer rounded-lg border border-gray-200 px-2 py-1 text-xs"
                  >
                    {PROFILE_STATUSES.map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                </td>
                <td className="py-2.5 pr-3">
                  <div className="flex flex-col items-start gap-1.5">
                    <RoleBadge role={u.role} />
                    <select
                      value={u.role}
                      onChange={(e) =>
                        update(u.id, { role: e.target.value as Profile["role"] })
                      }
                      className="cursor-pointer rounded-lg border border-gray-200 px-2 py-1 text-xs"
                    >
                      {["user", "agent", "system", "admin"].map((r) => (
                        <option key={r}>{r}</option>
                      ))}
                    </select>
                  </div>
                </td>
                <td className="py-2.5 pr-3">
                  <select
                    value={u.agent_id ?? ""}
                    onChange={(e) =>
                      update(u.id, { agent_id: e.target.value || null })
                    }
                    className="cursor-pointer rounded-lg border border-gray-200 px-2 py-1 text-xs"
                  >
                    <option value="">None</option>
                    {agents.map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.user_id_handle ?? a.email}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="py-2.5">
                  <button
                    onClick={() => remove(u.id, u.user_id_handle)}
                    className="cursor-pointer text-xs font-bold text-red-500 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </Panel>
  );
}

/* ---------------- Agents ---------------- */

function AgentsTab() {
  const [rows, setRows] = useState<(AgentProfile & { profile?: Profile })[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    Promise.all([
      supabase.from("agent_profiles").select("*"),
      supabase.from("profiles").select("*"),
    ]).then(([agentsRes, profilesRes]) => {
      const profiles = (profilesRes.data ?? []) as Profile[];
      const agents = (agentsRes.data ?? []) as AgentProfile[];
      setRows(
        agents.map((a) => ({
          ...a,
          profile: profiles.find((p) => p.id === a.profile_id),
        }))
      );
      setLoading(false);
    });
  }, []);

  if (loading) return <Panel><Skeleton className="h-48 w-full" /></Panel>;

  return (
    <Panel>
      {rows.length === 0 ? (
        <p className="text-sm text-charcoal/50">No agent applications yet.</p>
      ) : (
        <table className="w-full min-w-[800px] text-left text-sm">
          <thead>
            <tr className="border-b border-gray-100 text-xs uppercase tracking-wide text-charcoal/50">
              <th className="py-2 pr-3">Name</th>
              <th className="py-2 pr-3">Contact</th>
              <th className="py-2 pr-3">Bank</th>
              <th className="py-2 pr-3">Branch</th>
              <th className="py-2 pr-3">Account Name</th>
              <th className="py-2 pr-3">Account No</th>
              <th className="py-2">IBAN</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((a) => (
              <tr key={a.id} className="border-b border-gray-50">
                <td className="py-2.5 pr-3 font-bold">
                  {a.profile?.name_private ?? a.profile?.email}
                </td>
                <td className="py-2.5 pr-3">{a.profile?.whatsapp_no}</td>
                <td className="py-2.5 pr-3">{a.bank_name}</td>
                <td className="py-2.5 pr-3">{a.branch}</td>
                <td className="py-2.5 pr-3">{a.account_name}</td>
                <td className="py-2.5 pr-3">{a.account_no}</td>
                <td className="py-2.5">{a.iban}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </Panel>
  );
}

/* ---------------- Payments ---------------- */

function PaymentsTab() {
  const [payments, setPayments] = useState<(Payment & { profile?: Profile })[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  const load = useCallback(async () => {
    const [paysRes, profilesRes] = await Promise.all([
      supabase.from("payments").select("*").order("created_at", { ascending: false }),
      supabase.from("profiles").select("*"),
    ]);
    const profiles = (profilesRes.data ?? []) as Profile[];
    setPayments(
      ((paysRes.data ?? []) as Payment[]).map((p) => ({
        ...p,
        profile: profiles.find((pr) => pr.id === p.profile_id),
      }))
    );
    setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function confirmPayment(p: Payment) {
    const { data: userData } = await supabase.auth.getUser();
    const { error } = await supabase
      .from("payments")
      .update({ status: "Confirmed", verified_by: userData.user?.id })
      .eq("id", p.id);
    if (error) return toast(error.message, "error");

    // Confirming a payment verifies the member
    await supabase
      .from("profiles")
      .update({ status: "Verified", verified_at: new Date().toISOString() })
      .eq("id", p.profile_id);

    // Log the outbound WhatsApp notification
    await supabase.from("whatsapp_logs").insert({
      profile_id: p.profile_id,
      direction: "outbound",
      message: `Assalamu alaikum! Your PureLifePartner payment of ${p.amount} ${p.currency} is confirmed and your profile is now Verified. You can now view contact details of other verified members.`,
    });

    toast("Payment confirmed and member verified.");
    load();
  }

  if (loading) return <Panel><Skeleton className="h-48 w-full" /></Panel>;

  return (
    <Panel>
      {payments.length === 0 ? (
        <p className="text-sm text-charcoal/50">No payments yet.</p>
      ) : (
        <table className="w-full min-w-[700px] text-left text-sm">
          <thead>
            <tr className="border-b border-gray-100 text-xs uppercase tracking-wide text-charcoal/50">
              <th className="py-2 pr-3">Member</th>
              <th className="py-2 pr-3">Amount</th>
              <th className="py-2 pr-3">Method</th>
              <th className="py-2 pr-3">Reference</th>
              <th className="py-2 pr-3">Date</th>
              <th className="py-2 pr-3">Status</th>
              <th className="py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((p) => (
              <tr key={p.id} className="border-b border-gray-50">
                <td className="py-2.5 pr-3 font-bold">
                  {p.profile?.user_id_handle ?? p.profile_id.slice(0, 8)}
                </td>
                <td className="py-2.5 pr-3">
                  {p.amount.toLocaleString()} {p.currency}
                </td>
                <td className="py-2.5 pr-3">{p.payment_method}</td>
                <td className="py-2.5 pr-3">{p.transaction_ref}</td>
                <td className="py-2.5 pr-3">{formatDateTime(p.created_at)}</td>
                <td className="py-2.5 pr-3">
                  <span
                    className={cn(
                      "rounded-full px-2.5 py-0.5 text-xs font-bold",
                      p.status === "Confirmed"
                        ? "bg-green-100 text-green-700"
                        : "bg-amber-100 text-amber-700"
                    )}
                  >
                    {p.status}
                  </span>
                </td>
                <td className="py-2.5">
                  {p.status !== "Confirmed" && (
                    <Button size="sm" onClick={() => confirmPayment(p)}>
                      Confirm
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </Panel>
  );
}

/* ---------------- Dynamic Values ---------------- */

function DynamicValuesTab() {
  const [values, setValues] = useState<DynamicValue[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  const load = useCallback(async () => {
    const { data } = await supabase
      .from("dynamic_values")
      .select("*")
      .order("created_at", { ascending: false });
    setValues((data ?? []) as DynamicValue[]);
    setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function setApproved(id: string, approved: boolean) {
    const { error } = await supabase
      .from("dynamic_values")
      .update({ approved })
      .eq("id", id);
    if (error) toast(error.message, "error");
    else load();
  }

  async function remove(id: string) {
    await supabase.from("dynamic_values").delete().eq("id", id);
    load();
  }

  if (loading) return <Panel><Skeleton className="h-48 w-full" /></Panel>;

  return (
    <Panel>
      <p className="mb-4 text-sm text-charcoal/60">
        Custom values submitted by users via &ldquo;Others&rdquo;. Approve to
        include them in future dropdowns.
      </p>
      {values.length === 0 ? (
        <p className="text-sm text-charcoal/50">No custom values submitted.</p>
      ) : (
        <table className="w-full min-w-[600px] text-left text-sm">
          <thead>
            <tr className="border-b border-gray-100 text-xs uppercase tracking-wide text-charcoal/50">
              <th className="py-2 pr-3">Category</th>
              <th className="py-2 pr-3">Value</th>
              <th className="py-2 pr-3">Submitted</th>
              <th className="py-2 pr-3">Approved</th>
              <th className="py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {values.map((v) => (
              <tr key={v.id} className="border-b border-gray-50">
                <td className="py-2.5 pr-3 font-bold capitalize">
                  {v.category.replace("_", " ")}
                </td>
                <td className="py-2.5 pr-3">{v.value}</td>
                <td className="py-2.5 pr-3">{formatDateTime(v.created_at)}</td>
                <td className="py-2.5 pr-3">{v.approved ? "✓ Yes" : "No"}</td>
                <td className="py-2.5 space-x-3">
                  <button
                    onClick={() => setApproved(v.id, !v.approved)}
                    className="cursor-pointer text-xs font-bold text-coral hover:underline"
                  >
                    {v.approved ? "Revoke" : "Approve"}
                  </button>
                  <button
                    onClick={() => remove(v.id)}
                    className="cursor-pointer text-xs font-bold text-red-500 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </Panel>
  );
}

/* ---------------- WhatsApp Log ---------------- */

function WhatsAppTab() {
  const [logs, setLogs] = useState<(WhatsAppLog & { profile?: Profile })[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    Promise.all([
      supabase.from("whatsapp_logs").select("*").order("created_at", { ascending: false }).limit(200),
      supabase.from("profiles").select("*"),
    ]).then(([logsRes, profilesRes]) => {
      const profiles = (profilesRes.data ?? []) as Profile[];
      setLogs(
        ((logsRes.data ?? []) as WhatsAppLog[]).map((l) => ({
          ...l,
          profile: profiles.find((p) => p.id === l.profile_id),
        }))
      );
      setLoading(false);
    });
  }, []);

  if (loading) return <Panel><Skeleton className="h-48 w-full" /></Panel>;

  return (
    <Panel>
      <p className="mb-4 text-sm text-charcoal/60">
        All inbound and outbound WhatsApp messages.
        {/* TODO: inbound messages need the WhatsApp Business API webhook.
            Point the webhook at a Supabase Edge Function that inserts into
            whatsapp_logs with direction = 'inbound'. */}
      </p>
      {logs.length === 0 ? (
        <p className="text-sm text-charcoal/50">No messages logged yet.</p>
      ) : (
        <div className="space-y-3">
          {logs.map((l) => (
            <div
              key={l.id}
              className={cn(
                "rounded-xl border p-4 text-sm",
                l.direction === "outbound"
                  ? "border-coral/20 bg-coral/5"
                  : "border-gray-100 bg-off-white"
              )}
            >
              <div className="mb-1 flex justify-between text-xs text-charcoal/50">
                <span className="font-bold uppercase">
                  {l.direction} · {l.profile?.user_id_handle ?? "Unknown"}
                </span>
                <span>{formatDateTime(l.created_at)}</span>
              </div>
              {l.message}
            </div>
          ))}
        </div>
      )}
    </Panel>
  );
}

/* ---------------- Notes ---------------- */

function NotesTab() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [selected, setSelected] = useState("");
  const [notes, setNotes] = useState<OfficeNote[]>([]);
  const [newNote, setNewNote] = useState("");
  const supabase = createClient();

  useEffect(() => {
    supabase
      .from("profiles")
      .select("*")
      .order("internal_id")
      .then(({ data }) => setProfiles((data ?? []) as Profile[]));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadNotes = useCallback(
    async (profileId: string) => {
      const { data } = await supabase
        .from("office_notes")
        .select("*")
        .eq("profile_id", profileId)
        .order("created_at", { ascending: false });
      setNotes((data ?? []) as OfficeNote[]);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  useEffect(() => {
    if (selected) loadNotes(selected);
  }, [selected, loadNotes]);

  async function addNote() {
    if (!selected || !newNote.trim()) return;
    const { data: userData } = await supabase.auth.getUser();
    const { error } = await supabase.from("office_notes").insert({
      profile_id: selected,
      created_by: userData.user?.id,
      note: newNote.trim(),
    });
    if (error) toast(error.message, "error");
    else {
      setNewNote("");
      toast("Note added.");
      loadNotes(selected);
    }
  }

  return (
    <Panel>
      <FieldLabel label="Select profile">
        <select
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
          className="w-full max-w-md cursor-pointer rounded-xl border border-gray-300 px-4 py-2.5"
        >
          <option value="">Choose a member...</option>
          {profiles.map((p) => (
            <option key={p.id} value={p.id}>
              {p.internal_id} · {p.user_id_handle ?? p.email}
            </option>
          ))}
        </select>
      </FieldLabel>

      {selected && (
        <>
          <div className="mt-5 flex gap-3">
            <Textarea
              rows={2}
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              placeholder="Add a timestamped office note..."
            />
            <Button onClick={addNote}>Add</Button>
          </div>
          <div className="mt-5 space-y-3">
            {notes.map((n) => (
              <div key={n.id} className="rounded-xl bg-off-white p-4 text-sm">
                <div className="mb-1 text-xs font-bold text-charcoal/50">
                  {formatDateTime(n.created_at)}
                </div>
                {n.note}
              </div>
            ))}
            {notes.length === 0 && (
              <p className="text-sm text-charcoal/50">
                No notes for this profile yet.
              </p>
            )}
          </div>
        </>
      )}
    </Panel>
  );
}

/* ---------------- Bank Accounts ---------------- */

function BankAccountsTab() {
  const [accounts, setAccounts] = useState<BankAccount[]>([]);
  const [form, setForm] = useState({
    currency: "PKR",
    bank_name: "",
    branch: "",
    account_name: "",
    account_no: "",
    iban: "",
  });
  const supabase = createClient();

  const load = useCallback(async () => {
    const { data } = await supabase.from("bank_accounts").select("*");
    setAccounts((data ?? []) as BankAccount[]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function add() {
    if (!form.bank_name.trim() || !form.account_name.trim()) {
      toast("Bank name and account name are required.", "error");
      return;
    }
    const currency = CURRENCIES.find((c) => c.code === form.currency)!;
    const { error } = await supabase.from("bank_accounts").insert({
      ...form,
      country: currency.country,
      active: true,
    });
    if (error) toast(error.message, "error");
    else {
      toast("Bank account added.");
      setForm({ ...form, bank_name: "", branch: "", account_name: "", account_no: "", iban: "" });
      load();
    }
  }

  async function toggle(a: BankAccount) {
    await supabase
      .from("bank_accounts")
      .update({ active: !a.active })
      .eq("id", a.id);
    load();
  }

  return (
    <Panel>
      <h2 className="mb-4 font-bold text-charcoal">
        Receiving accounts per currency
      </h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Select
          options={CURRENCIES.map((c) => c.code)}
          value={form.currency}
          onChange={(e) => setForm({ ...form, currency: e.target.value })}
        />
        <Input
          placeholder="Bank name"
          value={form.bank_name}
          onChange={(e) => setForm({ ...form, bank_name: e.target.value })}
        />
        <Input
          placeholder="Branch"
          value={form.branch}
          onChange={(e) => setForm({ ...form, branch: e.target.value })}
        />
        <Input
          placeholder="Account name"
          value={form.account_name}
          onChange={(e) => setForm({ ...form, account_name: e.target.value })}
        />
        <Input
          placeholder="Account no"
          value={form.account_no}
          onChange={(e) => setForm({ ...form, account_no: e.target.value })}
        />
        <Input
          placeholder="IBAN"
          value={form.iban}
          onChange={(e) => setForm({ ...form, iban: e.target.value })}
        />
      </div>
      <Button className="mt-4" onClick={add}>
        Add Account
      </Button>

      <div className="mt-6 space-y-3">
        {accounts.map((a) => (
          <div
            key={a.id}
            className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-gray-100 p-4 text-sm"
          >
            <div>
              <span className="mr-2 rounded-full bg-coral/10 px-2.5 py-0.5 text-xs font-bold text-coral">
                {a.currency}
              </span>
              <span className="font-bold">{a.bank_name}</span>
              <span className="text-charcoal/60">
                {" "}
                · {a.account_name} · {a.account_no ?? a.iban}
              </span>
            </div>
            <button
              onClick={() => toggle(a)}
              className={cn(
                "cursor-pointer rounded-full px-3 py-1 text-xs font-bold",
                a.active
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-100 text-gray-500"
              )}
            >
              {a.active ? "Active" : "Inactive"}
            </button>
          </div>
        ))}
      </div>
    </Panel>
  );
}
