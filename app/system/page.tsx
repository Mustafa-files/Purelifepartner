"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { FieldLabel, Input, Select, Textarea } from "@/components/ui/fields";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/toast";
import { PROFILE_STATUSES } from "@/lib/constants";
import { formatDateTime } from "@/lib/utils";
import type { OfficeNote, Profile } from "@/types";

export default function SystemDashboard() {
  const router = useRouter();
  const [authorized, setAuthorized] = useState<boolean | null>(null);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Profile | null>(null);
  const supabase = createClient();

  const load = useCallback(async () => {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .order("internal_id");
    setProfiles((data ?? []) as Profile[]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) {
        router.replace("/login?next=/system");
        return;
      }
      const { data: role } = await supabase.rpc("get_my_role");
      if (role !== "system" && role !== "admin") {
        toast("System user access required.", "error");
        router.replace("/dashboard");
        return;
      }
      setAuthorized(true);
      load();
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router, load]);

  if (authorized === null) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-12">
        <Skeleton className="h-96 w-full rounded-2xl" />
      </div>
    );
  }

  const filtered = profiles.filter((p) => {
    const q = query.toLowerCase();
    return (
      !q ||
      p.user_id_handle?.toLowerCase().includes(q) ||
      p.email?.toLowerCase().includes(q) ||
      p.name_private?.toLowerCase().includes(q) ||
      p.internal_id.toString().includes(q)
    );
  });

  return (
    <div className="bg-off-white py-10">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h1 className="text-3xl font-bold text-charcoal">System Panel</h1>
        <p className="mt-1 text-charcoal/60">
          View and update any member profile, and keep office notes.
        </p>

        <div className="mt-6 grid gap-6 lg:grid-cols-[340px_1fr]">
          {/* Profile list */}
          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <Input
              placeholder="Search by ID, name, email..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <div className="mt-4 max-h-[600px] space-y-1 overflow-y-auto">
              {filtered.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setSelected(p)}
                  className={`block w-full cursor-pointer rounded-xl px-4 py-2.5 text-left text-sm transition-colors ${
                    selected?.id === p.id
                      ? "bg-coral text-white"
                      : "hover:bg-off-white"
                  }`}
                >
                  <span className="font-bold">{p.internal_id}</span> ·{" "}
                  {p.user_id_handle ?? p.email}
                </button>
              ))}
            </div>
          </div>

          {/* Editor */}
          {selected ? (
            <ProfileEditor
              key={selected.id}
              profile={selected}
              onSaved={load}
            />
          ) : (
            <div className="flex items-center justify-center rounded-2xl bg-white p-16 text-charcoal/40 shadow-sm">
              Select a profile to view and edit
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ProfileEditor({
  profile,
  onSaved,
}: {
  profile: Profile;
  onSaved: () => void;
}) {
  const [form, setForm] = useState({
    status: profile.status as string,
    name_private: profile.name_private ?? "",
    agent_registration_no: profile.agent_registration_no ?? "",
    describe_yourself: profile.describe_yourself ?? "",
    family_details: profile.family_details ?? "",
  });
  const [notes, setNotes] = useState<OfficeNote[]>([]);
  const [newNote, setNewNote] = useState("");
  const [saving, setSaving] = useState(false);
  const supabase = createClient();

  const loadNotes = useCallback(async () => {
    const { data } = await supabase
      .from("office_notes")
      .select("*")
      .eq("profile_id", profile.id)
      .order("created_at", { ascending: false });
    setNotes((data ?? []) as OfficeNote[]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile.id]);

  useEffect(() => {
    loadNotes();
  }, [loadNotes]);

  async function save() {
    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update({
        status: form.status,
        name_private: form.name_private.trim() || null,
        agent_registration_no: form.agent_registration_no.trim() || null,
        describe_yourself: form.describe_yourself.trim() || null,
        family_details: form.family_details.trim() || null,
        ...(form.status === "Verified" && profile.status !== "Verified"
          ? { verified_at: new Date().toISOString() }
          : {}),
      })
      .eq("id", profile.id);
    setSaving(false);
    if (error) toast(error.message, "error");
    else {
      toast("Profile updated.");
      onSaved();
    }
  }

  async function addNote() {
    if (!newNote.trim()) return;
    const { data: userData } = await supabase.auth.getUser();
    const { error } = await supabase.from("office_notes").insert({
      profile_id: profile.id,
      created_by: userData.user?.id,
      note: newNote.trim(),
    });
    if (error) toast(error.message, "error");
    else {
      setNewNote("");
      loadNotes();
      toast("Note added.");
    }
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="mb-1 text-xl font-bold text-charcoal">
          {profile.user_id_handle ?? profile.email}
        </h2>
        <p className="mb-5 text-sm text-charcoal/50">
          Profile No. {profile.internal_id} · {profile.email} ·{" "}
          {profile.whatsapp_no}
        </p>

        <div className="grid gap-4 sm:grid-cols-2">
          <FieldLabel label="Status">
            <Select
              options={PROFILE_STATUSES}
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
            />
          </FieldLabel>
          <FieldLabel label="Agent Registration No">
            <Input
              value={form.agent_registration_no}
              onChange={(e) =>
                setForm({ ...form, agent_registration_no: e.target.value })
              }
            />
          </FieldLabel>
          <FieldLabel label="Name (office use)">
            <Input
              value={form.name_private}
              onChange={(e) =>
                setForm({ ...form, name_private: e.target.value })
              }
            />
          </FieldLabel>
        </div>

        <div className="mt-4 space-y-4">
          <FieldLabel label="Describe Yourself">
            <Textarea
              rows={2}
              value={form.describe_yourself}
              onChange={(e) =>
                setForm({ ...form, describe_yourself: e.target.value })
              }
            />
          </FieldLabel>
          <FieldLabel label="Family Details">
            <Textarea
              rows={3}
              value={form.family_details}
              onChange={(e) =>
                setForm({ ...form, family_details: e.target.value })
              }
              placeholder="Details about family and siblings"
            />
          </FieldLabel>
        </div>

        <Button className="mt-5" onClick={save} loading={saving}>
          Save Changes
        </Button>
      </div>

      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <h3 className="mb-4 font-bold text-charcoal">Office Notes</h3>
        <div className="flex gap-3">
          <Textarea
            rows={2}
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder="Add a timestamped note..."
          />
          <Button onClick={addNote}>Add</Button>
        </div>
        <div className="mt-4 space-y-3">
          {notes.map((n) => (
            <div key={n.id} className="rounded-xl bg-off-white p-4 text-sm">
              <div className="mb-1 text-xs font-bold text-charcoal/50">
                {formatDateTime(n.created_at)}
              </div>
              {n.note}
            </div>
          ))}
          {notes.length === 0 && (
            <p className="text-sm text-charcoal/50">No notes yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
