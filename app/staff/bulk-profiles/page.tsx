"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/toast";
import {
  COLUMNS,
  completedStep,
  downloadCsvTemplate,
  downloadLogins,
  downloadTemplate,
  readSpreadsheet,
  validateRows,
  type CreatedLogin,
  type ParsedRow,
} from "@/lib/bulk-profiles";
import { cn } from "@/lib/utils";

const BATCH_SIZE = 25;
const STEP_LABELS = ["Template", "Upload", "Review", "Create"];
const MISSING_SECTION = ["Personal", "Religion", "Residence"];

type Filter = "all" | "ready" | "errors";
interface FailedRow {
  rowNumber: number;
  name: string;
  error: string;
}

export default function BulkProfilesPage() {
  const router = useRouter();
  const [authorized, setAuthorized] = useState<boolean | null>(null);
  const [role, setRole] = useState<string>("");

  const [fileName, setFileName] = useState("");
  const [rows, setRows] = useState<ParsedRow[] | null>(null);
  const [parsing, setParsing] = useState(false);
  const [filter, setFilter] = useState<Filter>("all");
  const [skipErrors, setSkipErrors] = useState(false);

  const [creating, setCreating] = useState(false);
  const [progress, setProgress] = useState({ done: 0, total: 0 });
  const [logins, setLogins] = useState<CreatedLogin[]>([]);
  const [failed, setFailed] = useState<FailedRow[]>([]);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    const supabase = createClient();    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) {
        router.replace("/login?next=/staff/bulk-profiles");
        return;
      }
      const { data: r } = await supabase.rpc("get_my_role");
      if (r !== "admin" && r !== "agent") {
        toast("Only admins and agents can create profiles in bulk.", "error");
        router.replace("/dashboard");
        return;
      }
      setRole(r);
      setAuthorized(true);
    });
  }, [router]);

  // Warn before leaving mid-creation or with unsaved logins on screen.
  useEffect(() => {
    if (!creating && logins.length === 0) return;
    const onBeforeUnload = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [creating, logins.length]);

  const stats = useMemo(() => {
    const list = rows ?? [];
    const withErrors = list.filter((r) => r.errors.length > 0).length;
    return {
      total: list.length,
      ready: list.length - withErrors,
      withErrors,
      incomplete: list.filter((r) => r.errors.length === 0 && completedStep(r.data) < 4).length,
    };
  }, [rows]);

  const currentStep = finished || creating ? 4 : rows ? 3 : 2;

  async function handleFile(file: File) {
    if (!/\.(xlsx|xls|csv)$/i.test(file.name)) {
      toast("Please upload an Excel (.xlsx) or CSV file.", "error");
      return;
    }
    setParsing(true);
    setFileName(file.name);
    resetResults();
    try {
      const sheetRows = await readSpreadsheet(file);
      const headers = new Set(Object.keys(sheetRows[0] ?? {}).map((h) => h.trim().toLowerCase()));
      const missing = COLUMNS.filter((c) => c.required && !headers.has(c.header.toLowerCase()));
      if (sheetRows.length > 0 && missing.length > 0) {
        toast(`Missing columns: ${missing.map((c) => c.header).join(", ")}. Use the template.`, "error");
        setRows(null);
        return;
      }

      const supabase = createClient();
      const { data } = await supabase.from("profiles").select("user_id_handle");
      const taken = new Set(
        (data ?? [])
          .map((p: { user_id_handle: string | null }) => p.user_id_handle?.toLowerCase())
          .filter((h): h is string => !!h)
      );

      const parsed = validateRows(sheetRows, taken);
      if (parsed.length === 0) toast("No filled rows found in this file.", "error");
      if (parsed.length > 1000) {
        toast("Please upload at most 1,000 rows at a time.", "error");
        setRows(null);
        return;
      }
      setRows(parsed);
      setFilter(parsed.some((r) => r.errors.length) ? "errors" : "all");
    } catch (e) {
      toast(e instanceof Error ? e.message : "Could not read this file.", "error");
      setRows(null);
    } finally {
      setParsing(false);
    }
  }

  function resetResults() {
    setLogins([]);
    setFailed([]);
    setFinished(false);
    setProgress({ done: 0, total: 0 });
  }

  function startOver() {
    if (logins.length > 0 && !confirm("Have you downloaded the logins? They cannot be shown again.")) return;
    setRows(null);
    setFileName("");
    setSkipErrors(false);
    resetResults();
  }

  async function createProfiles() {
    if (!rows) return;
    const toCreate = rows.filter((r) => r.errors.length === 0);
    if (toCreate.length === 0) return;
    if (!confirm(`Create ${toCreate.length} profile${toCreate.length === 1 ? "" : "s"} now?`)) return;

    setCreating(true);
    resetResults();
    setProgress({ done: 0, total: toCreate.length });
    const supabase = createClient();
    const created: CreatedLogin[] = [];
    const failures: FailedRow[] = [];

    for (let i = 0; i < toCreate.length; i += BATCH_SIZE) {
      const batch = toCreate.slice(i, i + BATCH_SIZE);
      const { data, error } = await supabase.functions.invoke("staff-accounts", {
        body: {
          action: "bulk_create",
          rows: batch.map((r) => ({ ...r.data, ref: r.rowNumber, custom_values: r.customValues })),
        },
      });

      if (error || !data?.results) {
        const message = await functionErrorMessage(error);
        batch.forEach((r) =>
          failures.push({ rowNumber: r.rowNumber, name: String(r.data.name_private ?? ""), error: message })
        );
      } else {
        for (const result of data.results as {
          ref: number;
          ok: boolean;
          user_id_handle?: string;
          password?: string;
          error?: string;
        }[]) {
          const row = batch.find((r) => r.rowNumber === result.ref);
          const name = String(row?.data.name_private ?? "");
          if (result.ok) {
            created.push({
              rowNumber: result.ref,
              name,
              whatsapp: String(row?.data.whatsapp_no ?? ""),
              userId: result.user_id_handle!,
              password: result.password!,
            });
          } else {
            failures.push({ rowNumber: result.ref, name, error: result.error ?? "Failed." });
          }
        }
      }
      setLogins([...created]);
      setFailed([...failures]);
      setProgress({ done: Math.min(i + batch.length, toCreate.length), total: toCreate.length });
    }

    setCreating(false);
    setFinished(true);
    if (created.length > 0) {
      toast(`${created.length} profile${created.length === 1 ? "" : "s"} created.`);
      downloadLogins(created);
    }
    if (failures.length > 0) toast(`${failures.length} row${failures.length === 1 ? "" : "s"} could not be created.`, "error");
  }

  if (authorized === null) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-12">
        <Skeleton className="h-10 w-72" />
        <Skeleton className="mt-6 h-72 w-full rounded-2xl" />
      </div>
    );
  }

  const visibleRows = (rows ?? []).filter((r) =>
    filter === "all" ? true : filter === "errors" ? r.errors.length > 0 : r.errors.length === 0
  );
  const canCreate = stats.ready > 0 && (stats.withErrors === 0 || skipErrors) && !creating && !finished;

  return (
    <div className="bg-off-white py-10">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Header */}
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="inline-block rounded-full bg-coral/10 px-3 py-1 text-xs font-bold uppercase tracking-wide text-coral">
              {role === "admin" ? "Admin" : "Agent"} tools
            </span>
            <h1 className="mt-3 text-3xl font-bold text-charcoal">Bulk Create Profiles</h1>
            <p className="mt-2 max-w-2xl text-charcoal/60">
              Create accounts for people who do not have an email. Each person gets a User ID and
              password to sign in with. No emails are sent.
            </p>
          </div>
          <Stepper current={currentStep} />
        </div>

        {/* 1. Template */}
        <Card className="mt-8">
          <CardTitle number={1} title="Download the template" done={currentStep > 1} />
          <div className="mt-5 grid gap-4 sm:grid-cols-3">
            <InfoTile icon="📝" title="Required for every row">
              Gender, date of birth, WhatsApp number and full name.
            </InfoTile>
            <InfoTile icon="🔑" title="Logins made for you">
              Leave User ID and Password blank and we generate them.
            </InfoTile>
            <InfoTile icon="📋" title="Complete profiles">
              Add personal, religion and residence details, or finish them later.
            </InfoTile>
          </div>
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <Button variant="outline" onClick={() => downloadTemplate()}>
              ⬇ Excel template (.xlsx)
            </Button>
            <Button variant="ghost" onClick={() => downloadCsvTemplate()}>
              ⬇ CSV template
            </Button>
            <span className="text-sm text-charcoal/50">
              The Excel file also includes instructions and the allowed values.
            </span>
          </div>
        </Card>

        {/* 2. Upload */}
        <Card className="mt-6">
          <CardTitle number={2} title="Upload your filled spreadsheet" done={!!rows} />
          <DropZone
            fileName={fileName}
            parsing={parsing}
            disabled={creating}
            onFile={handleFile}
          />
        </Card>

        {/* 3. Review */}
        {rows && rows.length > 0 && (
          <Card className="mt-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <CardTitle number={3} title="Review before creating" done={finished} />
              {!creating && (
                <button
                  onClick={startOver}
                  className="cursor-pointer text-sm font-bold text-charcoal/50 hover:text-coral"
                >
                  Start over
                </button>
              )}
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
              <Stat label="Rows found" value={stats.total} />
              <Stat label="Ready to create" value={stats.ready} tone="good" />
              <Stat label="Need fixing" value={stats.withErrors} tone={stats.withErrors ? "bad" : undefined} />
              <Stat label="Incomplete profiles" value={stats.incomplete} tone={stats.incomplete ? "warn" : undefined} />
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              {(
                [
                  ["all", `All (${stats.total})`],
                  ["errors", `Need fixing (${stats.withErrors})`],
                  ["ready", `Ready (${stats.ready})`],
                ] as [Filter, string][]
              ).map(([f, label]) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={cn(
                    "cursor-pointer rounded-full px-4 py-1.5 text-sm font-bold transition-colors",
                    filter === f ? "bg-coral text-white" : "bg-off-white text-charcoal hover:bg-coral/10"
                  )}
                >
                  {label}
                </button>
              ))}
            </div>

            <div className="mt-4 max-h-[520px] overflow-auto rounded-xl border border-gray-100">
              <table className="w-full min-w-[860px] text-left text-sm">
                <thead className="sticky top-0 z-10 bg-white">
                  <tr className="border-b border-gray-100 text-xs uppercase tracking-wide text-charcoal/50">
                    <th className="px-3 py-2.5">Row</th>
                    <th className="px-3 py-2.5">Name</th>
                    <th className="px-3 py-2.5">Gender</th>
                    <th className="px-3 py-2.5">Age</th>
                    <th className="px-3 py-2.5">WhatsApp</th>
                    <th className="px-3 py-2.5">User ID</th>
                    <th className="px-3 py-2.5">Profile</th>
                    <th className="px-3 py-2.5">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {visibleRows.map((r) => (
                    <ReviewRow key={r.rowNumber} row={r} />
                  ))}
                  {visibleRows.length === 0 && (
                    <tr>
                      <td colSpan={8} className="px-3 py-8 text-center text-charcoal/50">
                        Nothing to show here.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {!finished && (
              <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-xl bg-off-white p-4">
                <div className="text-sm text-charcoal/70">
                  {stats.withErrors > 0 ? (
                    <label className="flex cursor-pointer items-center gap-2">
                      <input
                        type="checkbox"
                        checked={skipErrors}
                        onChange={(e) => setSkipErrors(e.target.checked)}
                        className="h-4 w-4 accent-[#e63946]"
                      />
                      Skip the {stats.withErrors} row{stats.withErrors === 1 ? "" : "s"} that need fixing
                      and create the rest
                    </label>
                  ) : (
                    <>All rows look good. Logins download automatically when done.</>
                  )}
                </div>
                <Button onClick={createProfiles} loading={creating} disabled={!canCreate}>
                  Create {stats.ready} profile{stats.ready === 1 ? "" : "s"}
                </Button>
              </div>
            )}
          </Card>
        )}

        {/* 4. Progress and results */}
        {(creating || finished) && (
          <Card className="mt-6">
            <CardTitle number={4} title={creating ? "Creating profiles..." : "Done"} done={finished} />
            <div className="mt-5">
              <div className="mb-2 flex justify-between text-sm font-semibold">
                <span className="text-charcoal">
                  {progress.done} of {progress.total} processed
                </span>
                <span className="text-coral">
                  {progress.total ? Math.round((progress.done / progress.total) * 100) : 0}%
                </span>
              </div>
              <div className="h-2.5 w-full overflow-hidden rounded-full bg-gray-200">
                <div
                  className="h-full rounded-full bg-coral transition-all duration-500"
                  style={{ width: `${progress.total ? (progress.done / progress.total) * 100 : 0}%` }}
                />
              </div>
            </div>

            {logins.length > 0 && (
              <>
                <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-gold/40 bg-gold/10 p-4">
                  <p className="text-sm text-charcoal">
                    <span className="font-bold">Save these logins now.</span> Passwords are shown only
                    once. If one is lost, reset it from the Admin Panel.
                  </p>
                  <Button size="sm" onClick={() => downloadLogins(logins)}>
                    ⬇ Download logins ({logins.length})
                  </Button>
                </div>
                <div className="mt-4 max-h-[420px] overflow-auto rounded-xl border border-gray-100">
                  <table className="w-full min-w-[640px] text-left text-sm">
                    <thead className="sticky top-0 bg-white">
                      <tr className="border-b border-gray-100 text-xs uppercase tracking-wide text-charcoal/50">
                        <th className="px-3 py-2.5">Row</th>
                        <th className="px-3 py-2.5">Name</th>
                        <th className="px-3 py-2.5">WhatsApp</th>
                        <th className="px-3 py-2.5">User ID</th>
                        <th className="px-3 py-2.5">Password</th>
                        <th className="px-3 py-2.5" />
                      </tr>
                    </thead>
                    <tbody>
                      {logins.map((l) => (
                        <tr key={l.rowNumber} className="border-b border-gray-50">
                          <td className="px-3 py-2.5 text-charcoal/50">{l.rowNumber}</td>
                          <td className="px-3 py-2.5 font-semibold">{l.name}</td>
                          <td className="px-3 py-2.5">{l.whatsapp}</td>
                          <td className="px-3 py-2.5 font-mono font-bold text-coral">{l.userId}</td>
                          <td className="px-3 py-2.5 font-mono">{l.password}</td>
                          <td className="px-3 py-2.5 text-right">
                            <CopyButton
                              text={`PureLifePartner login\nUser ID: ${l.userId}\nPassword: ${l.password}\nSign in: https://purelifepartner.com/login`}
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}

            {failed.length > 0 && (
              <div className="mt-6 rounded-xl border border-coral/30 bg-coral/5 p-4">
                <p className="text-sm font-bold text-coral">
                  {failed.length} row{failed.length === 1 ? "" : "s"} not created
                </p>
                <ul className="mt-2 space-y-1 text-sm text-charcoal/80">
                  {failed.map((f) => (
                    <li key={f.rowNumber}>
                      <span className="font-bold">Row {f.rowNumber}</span>
                      {f.name ? ` (${f.name})` : ""}: {f.error}
                    </li>
                  ))}
                </ul>
                <p className="mt-2 text-xs text-charcoal/50">
                  Fix these rows in your spreadsheet and upload only them again.
                </p>
              </div>
            )}

            {finished && (
              <div className="mt-6 flex flex-wrap gap-3">
                <Button variant="outline" onClick={startOver}>
                  Upload another file
                </Button>
                {role === "admin" && (
                  <Button variant="ghost" onClick={() => router.push("/admin")}>
                    Go to Admin Panel →
                  </Button>
                )}
              </div>
            )}
          </Card>
        )}
      </div>
    </div>
  );
}

async function functionErrorMessage(error: unknown): Promise<string> {
  const context = (error as { context?: Response } | null)?.context;
  if (context && typeof context.json === "function") {
    try {
      const body = await context.json();
      if (body?.error) return body.error;
    } catch {
      // Fall through to the generic message.
    }
  }
  return error instanceof Error ? error.message : "Could not reach the server. Please try again.";
}

/* ---------------- pieces ---------------- */

function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return <section className={cn("rounded-2xl bg-white p-6 shadow-sm sm:p-8", className)}>{children}</section>;
}

function CardTitle({ number, title, done }: { number: number; title: string; done?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <span
        className={cn(
          "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold",
          done ? "bg-green-100 text-green-700" : "bg-coral text-white"
        )}
      >
        {done ? "✓" : number}
      </span>
      <h2 className="text-lg font-bold text-charcoal">{title}</h2>
    </div>
  );
}

function Stepper({ current }: { current: number }) {
  return (
    <ol className="flex flex-wrap items-center gap-2">
      {STEP_LABELS.map((label, i) => {
        const n = i + 1;
        const state = n < current ? "done" : n === current ? "active" : "todo";
        return (
          <li key={label} className="flex items-center gap-2">
            <span
              className={cn(
                "rounded-full px-3 py-1 text-xs font-bold",
                state === "active" && "bg-coral text-white",
                state === "done" && "bg-coral/10 text-coral",
                state === "todo" && "bg-white text-charcoal/40"
              )}
            >
              {n}. {label}
            </span>
            {n < STEP_LABELS.length && <span className="h-px w-3 bg-charcoal/20" />}
          </li>
        );
      })}
    </ol>
  );
}

function InfoTile({ icon, title, children }: { icon: string; title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl bg-off-white p-4">
      <div className="text-2xl">{icon}</div>
      <div className="mt-2 font-bold text-charcoal">{title}</div>
      <p className="mt-1 text-sm text-charcoal/60">{children}</p>
    </div>
  );
}

function Stat({ label, value, tone }: { label: string; value: number; tone?: "good" | "bad" | "warn" }) {
  return (
    <div className="rounded-xl bg-off-white p-4">
      <div
        className={cn(
          "text-3xl font-bold",
          tone === "good" && "text-green-700",
          tone === "bad" && "text-coral",
          tone === "warn" && "text-gold",
          !tone && "text-charcoal"
        )}
      >
        {value.toLocaleString()}
      </div>
      <div className="mt-1 text-xs font-semibold uppercase tracking-wide text-charcoal/50">{label}</div>
    </div>
  );
}

function DropZone({
  fileName,
  parsing,
  disabled,
  onFile,
}: {
  fileName: string;
  parsing: boolean;
  disabled: boolean;
  onFile: (file: File) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        if (!disabled) setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragging(false);
        const file = e.dataTransfer.files[0];
        if (file && !disabled) onFile(file);
      }}
      onClick={() => !disabled && inputRef.current?.click()}
      className={cn(
        "mt-5 flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-10 text-center transition-colors",
        dragging ? "border-coral bg-coral/5" : "border-coral/30 hover:border-coral hover:bg-coral/5",
        disabled && "cursor-not-allowed opacity-60"
      )}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".xlsx,.xls,.csv"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onFile(file);
          e.target.value = "";
        }}
      />
      {parsing ? (
        <>
          <span className="h-8 w-8 animate-spin rounded-full border-4 border-coral border-t-transparent" />
          <p className="mt-3 font-semibold text-charcoal">Checking your rows...</p>
        </>
      ) : (
        <>
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-coral/10 text-2xl">📤</div>
          <p className="mt-3 font-bold text-charcoal">
            {fileName ? fileName : "Drop your spreadsheet here, or click to choose"}
          </p>
          <p className="mt-1 text-sm text-charcoal/50">
            {fileName ? "Click or drop to replace it" : "Excel (.xlsx) or CSV, up to 1,000 rows"}
          </p>
        </>
      )}
    </div>
  );
}

function ReviewRow({ row }: { row: ParsedRow }) {
  const [open, setOpen] = useState(false);
  const d = row.data;
  const step = completedStep(d);
  const hasErrors = row.errors.length > 0;
  const notes = hasErrors ? row.errors : row.warnings;

  return (
    <>
      <tr className={cn("border-b border-gray-50", hasErrors && "bg-coral/5")}>
        <td className="px-3 py-2.5 text-charcoal/50">{row.rowNumber}</td>
        <td className="px-3 py-2.5 font-semibold">{String(d.name_private ?? "")}</td>
        <td className="px-3 py-2.5">{String(d.gender ?? "")}</td>
        <td className="px-3 py-2.5">{d.age != null ? String(d.age) : ""}</td>
        <td className="px-3 py-2.5">{String(d.whatsapp_no ?? "")}</td>
        <td className="px-3 py-2.5">
          {d.user_id_handle ? (
            <span className="font-mono">{String(d.user_id_handle)}</span>
          ) : (
            <span className="text-charcoal/40">Auto</span>
          )}
        </td>
        <td className="px-3 py-2.5">
          {step >= 4 ? (
            <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-bold text-green-700">
              Complete
            </span>
          ) : (
            <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-bold text-amber-700">
              Missing {MISSING_SECTION[step - 1]}
            </span>
          )}
        </td>
        <td className="px-3 py-2.5">
          {hasErrors ? (
            <button
              onClick={() => setOpen((v) => !v)}
              className="cursor-pointer rounded-full bg-coral px-2.5 py-0.5 text-xs font-bold text-white"
            >
              {row.errors.length} to fix {open ? "▴" : "▾"}
            </button>
          ) : row.warnings.length > 0 ? (
            <button
              onClick={() => setOpen((v) => !v)}
              className="cursor-pointer rounded-full bg-gold/20 px-2.5 py-0.5 text-xs font-bold text-charcoal"
            >
              Ready, {row.warnings.length} note{row.warnings.length === 1 ? "" : "s"} {open ? "▴" : "▾"}
            </button>
          ) : (
            <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-bold text-green-700">
              Ready
            </span>
          )}
        </td>
      </tr>
      {open && notes.length > 0 && (
        <tr className={cn("border-b border-gray-50", hasErrors ? "bg-coral/5" : "bg-gold/5")}>
          <td />
          <td colSpan={7} className="px-3 pb-3">
            <ul className="list-disc space-y-0.5 pl-5 text-xs text-charcoal/80">
              {notes.map((n) => (
                <li key={n}>{n}</li>
              ))}
            </ul>
          </td>
        </tr>
      )}
    </>
  );
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        } catch {
          toast("Could not copy. Select the text instead.", "error");
        }
      }}
      className="cursor-pointer rounded-full border border-gray-200 px-3 py-1 text-xs font-bold text-charcoal transition-colors hover:border-coral hover:text-coral"
    >
      {copied ? "Copied ✓" : "Copy for WhatsApp"}
    </button>
  );
}
