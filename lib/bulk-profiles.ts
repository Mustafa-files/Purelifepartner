// Spreadsheet columns, parsing and validation for staff bulk profile creation.
// The staff-accounts Edge Function re-checks the account fields server side.

import {
  ALL_COUNTRIES,
  CASTES,
  GENDERS,
  MARITAL_STATUSES,
  PRACTICE_OPTIONS,
  PROFESSIONS,
  QUALIFICATIONS,
  RELIGIONS,
  RESIDENCE_TYPES,
  SECTS_BY_RELIGION,
  STORY_TYPES,
  SUB_CASTES_BY_CASTE,
} from "@/lib/constants";
import { calcAge, parseFlexibleDate, toISODate, validatePassword } from "@/lib/utils";

export const MEMBER_EMAIL_DOMAIN = "members.purelifepartner.com";

/** Bulk created accounts use a placeholder email derived from the User ID. */
export function memberEmailFor(handle: string): string {
  return `${handle.trim().toLowerCase()}@${MEMBER_EMAIL_DOMAIN}`;
}

export function isPlaceholderEmail(email: string | null | undefined): boolean {
  return !!email && email.toLowerCase().endsWith(`@${MEMBER_EMAIL_DOMAIN}`);
}

export type ColumnGroup = "Account" | "Personal" | "Religion" | "Residence" | "Optional";

type Options = { list: string[]; strict: boolean; category?: string };

export interface Column {
  key: string;
  header: string;
  group: ColumnGroup;
  required?: boolean;
  multi?: boolean;
  hint: string;
  options?: Options;
}

const uniq = (xs: string[]) => Array.from(new Set(xs));
const ALL_SECTS = uniq(Object.values(SECTS_BY_RELIGION).flat());
const ALL_SUB_CASTES = uniq(Object.values(SUB_CASTES_BY_CASTE).flat());

export const COLUMNS: Column[] = [
  { key: "gender", header: "Gender", group: "Account", required: true, hint: "Male or Female", options: { list: [...GENDERS], strict: true } },
  { key: "dob", header: "Date of Birth", group: "Account", required: true, hint: "DD/MM/YYYY. Age must be 16 to 35" },
  { key: "whatsapp_no", header: "WhatsApp Number", group: "Account", required: true, hint: "With country code, e.g. +92 300 1234567" },
  { key: "name_private", header: "Full Name", group: "Account", required: true, hint: "Private, only staff can see it" },
  { key: "user_id_handle", header: "User ID", group: "Account", hint: "Leave blank to generate. Letters, numbers, underscore" },
  { key: "password", header: "Password", group: "Account", hint: "Leave blank to generate. 8+ chars, upper, lower, number" },

  { key: "marital_status", header: "Marital Status", group: "Personal", hint: MARITAL_STATUSES.join(", "), options: { list: MARITAL_STATUSES, strict: true } },
  { key: "height_ft", header: "Height (ft)", group: "Personal", hint: "3 to 8" },
  { key: "height_in", header: "Height (in)", group: "Personal", hint: "0 to 11" },
  { key: "qualification", header: "Qualification", group: "Personal", hint: "See Allowed Values", options: { list: uniq(QUALIFICATIONS), strict: false, category: "qualification" } },
  { key: "profession", header: "Profession", group: "Personal", multi: true, hint: "See Allowed Values. Separate several with commas", options: { list: uniq(PROFESSIONS), strict: false, category: "profession" } },

  { key: "religion", header: "Religion", group: "Religion", hint: "See Allowed Values", options: { list: uniq(RELIGIONS), strict: false, category: "religion" } },
  { key: "sect", header: "Sect", group: "Religion", hint: "See Allowed Values", options: { list: ALL_SECTS, strict: false, category: "sect" } },
  { key: "practice_nazar", header: "Practice Nazar Nayaz Khatam", group: "Religion", hint: PRACTICE_OPTIONS.join(", "), options: { list: PRACTICE_OPTIONS, strict: true } },
  { key: "caste", header: "Caste", group: "Religion", hint: "See Allowed Values", options: { list: uniq(CASTES), strict: false, category: "caste" } },
  { key: "sub_caste", header: "Sub Caste", group: "Religion", hint: "See Allowed Values", options: { list: ALL_SUB_CASTES, strict: false, category: "sub_caste" } },
  { key: "describe_yourself", header: "Describe Yourself", group: "Religion", hint: "A few sentences" },

  { key: "nationality", header: "Nationality", group: "Residence", multi: true, hint: "Country names, separate several with commas", options: { list: ALL_COUNTRIES, strict: true } },
  { key: "residence_country", header: "Residence Country", group: "Residence", multi: true, hint: "Country name", options: { list: ALL_COUNTRIES, strict: true } },
  { key: "residence_type", header: "Residence Type", group: "Residence", hint: RESIDENCE_TYPES.join(", "), options: { list: RESIDENCE_TYPES, strict: true } },

  { key: "weight_kg", header: "Weight (kg)", group: "Optional", hint: "25 to 250" },
  { key: "profession_detail", header: "Profession Detail", group: "Optional", hint: "Free text" },
  { key: "job_details", header: "Job / Business", group: "Optional", hint: "Free text" },
  { key: "income_details", header: "Income", group: "Optional", hint: "Free text" },
  { key: "family_details", header: "Family Details", group: "Optional", hint: "Free text" },
  { key: "city", header: "City", group: "Optional", multi: true, hint: "Separate several with commas" },
  { key: "property_size", header: "Property Size", group: "Optional", hint: "e.g. 10 Marla, 3 Bedrooms" },
  { key: "story_type", header: "Story Type", group: "Optional", hint: STORY_TYPES.join(", "), options: { list: STORY_TYPES, strict: true } },
  { key: "other_properties", header: "Other Properties", group: "Optional", hint: "Free text" },
];

export interface CustomValue {
  category: string;
  value: string;
}

export interface ParsedRow {
  /** 1-based spreadsheet row number, header is row 1. */
  rowNumber: number;
  data: Record<string, string | string[] | number>;
  errors: string[];
  warnings: string[];
  customValues: CustomValue[];
}

function cellText(v: unknown): string {
  if (v == null) return "";
  if (v instanceof Date) return toISODate(v);
  return String(v).trim();
}

function matchOption(value: string, list: string[]): string | null {
  const lower = value.toLowerCase();
  return list.find((o) => o.toLowerCase() === lower) ?? null;
}

const HEADER_TO_KEY = new Map(
  COLUMNS.flatMap((c) => [
    [c.header.toLowerCase(), c.key],
    [c.key.toLowerCase(), c.key],
  ])
);

/**
 * Validates spreadsheet rows (objects keyed by header text). `takenHandles`
 * holds lowercase User IDs already in use on the site.
 */
export function validateRows(
  sheetRows: Record<string, unknown>[],
  takenHandles: Set<string>
): ParsedRow[] {
  const seenHandles = new Map<string, number>();

  return sheetRows
    .map((sheetRow, i) => {
      const cells: Record<string, unknown> = {};
      for (const [header, value] of Object.entries(sheetRow)) {
        const key = HEADER_TO_KEY.get(header.trim().toLowerCase());
        if (key) cells[key] = value;
      }
      return { rowNumber: i + 2, cells };
    })
    .filter(({ cells }) => Object.values(cells).some((v) => cellText(v) !== ""))
    .map(({ rowNumber, cells }) => {
      const errors: string[] = [];
      const warnings: string[] = [];
      const customValues: CustomValue[] = [];
      const data: ParsedRow["data"] = {};

      for (const col of COLUMNS) {
        const rawValue = cells[col.key];
        const text = cellText(rawValue);

        if (!text) {
          if (col.required) errors.push(`${col.header} is required.`);
          continue;
        }

        if (col.key === "dob") {
          const date = rawValue instanceof Date ? rawValue : parseFlexibleDate(text);
          if (!date || isNaN(date.getTime())) {
            errors.push("Date of Birth is not a valid date. Use DD/MM/YYYY.");
          } else {
            const age = calcAge(date);
            if (age < 16 || age > 35) errors.push(`Age is ${age}; must be 16 to 35.`);
            data.dob = toISODate(date);
            data.age = age;
          }
          continue;
        }

        if (col.key === "whatsapp_no") {
          if (text.replace(/\D/g, "").length < 8) errors.push("WhatsApp Number is too short.");
          // Excel stores "+92300..." typed without quotes as a number, which
          // drops the "+"; restore it for international style numbers.
          data.whatsapp_no = /^[1-9]\d{10,14}$/.test(text) ? `+${text}` : text;
          continue;
        }

        if (col.key === "user_id_handle") {
          if (!/^[A-Za-z0-9_]{3,30}$/.test(text)) {
            errors.push("User ID must be 3 to 30 letters, numbers or underscores.");
          } else {
            const lower = text.toLowerCase();
            if (takenHandles.has(lower)) errors.push(`User ID "${text}" is already taken.`);
            const first = seenHandles.get(lower);
            if (first) errors.push(`User ID "${text}" is also used on row ${first}.`);
            else seenHandles.set(lower, rowNumber);
          }
          data.user_id_handle = text;
          continue;
        }

        if (col.key === "password") {
          const pwErr = validatePassword(text);
          if (pwErr) errors.push(pwErr);
          data.password = text;
          continue;
        }

        if (col.key === "height_ft" || col.key === "height_in" || col.key === "weight_kg") {
          const n = Number(text);
          const [min, max] =
            col.key === "height_ft" ? [3, 8] : col.key === "height_in" ? [0, 11] : [25, 250];
          const integer = col.key !== "weight_kg";
          if (isNaN(n) || n < min || n > max || (integer && !Number.isInteger(n))) {
            errors.push(`${col.header} must be ${integer ? "a whole number " : ""}from ${min} to ${max}.`);
          } else {
            data[col.key] = n;
          }
          continue;
        }

        const values = col.multi
          ? text.split(/[,;]/).map((s) => s.trim()).filter(Boolean)
          : [text];

        const resolved: string[] = [];
        for (const v of values) {
          if (!col.options) {
            resolved.push(v);
            continue;
          }
          const match = matchOption(v, col.options.list);
          if (match) {
            resolved.push(match);
          } else if (col.options.strict) {
            errors.push(`${col.header} "${v}" is not an allowed value.`);
          } else {
            resolved.push(v);
            warnings.push(`${col.header} "${v}" is new and will be sent for admin approval.`);
            if (col.options.category) customValues.push({ category: col.options.category, value: v });
          }
        }
        if (resolved.length) data[col.key] = col.multi ? resolved : resolved[0];
      }

      if (data.height_in != null && data.height_ft == null) {
        errors.push("Height (in) needs Height (ft) as well.");
      }

      return { rowNumber, data, errors, warnings, customValues };
    });
}

/** Which sign up step a row completes, matching the Edge Function. */
export function completedStep(data: ParsedRow["data"]): number {
  const has = (k: string) =>
    Array.isArray(data[k]) ? (data[k] as string[]).length > 0 : Boolean(data[k]);
  if (!(has("marital_status") && has("qualification") && has("profession"))) return 1;
  if (!(has("religion") && has("caste"))) return 2;
  if (!(has("nationality") && has("residence_country") && has("residence_type"))) return 3;
  return 4;
}

/* ---------------- spreadsheet files ---------------- */

type XLSX = typeof import("xlsx");
const loadXlsx = (): Promise<XLSX> => import("xlsx");

const XLSX_MIME = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

/**
 * Saves a file with an explicit type and extension. SheetJS's writeFile uses
 * a generic octet-stream blob, which some browsers and embedded webviews save
 * without the .xlsx extension.
 */
function saveBlob(parts: BlobPart[], type: string, filename: string) {
  const url = URL.createObjectURL(new Blob(parts, { type }));
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.rel = "noopener";
  document.body.appendChild(a);
  a.click();
  a.remove();
  // Revoking straight away can cancel the download in some browsers.
  setTimeout(() => URL.revokeObjectURL(url), 60_000);
}

function saveWorkbook(xlsx: XLSX, wb: import("xlsx").WorkBook, filename: string) {
  const data = xlsx.write(wb, { bookType: "xlsx", type: "array", compression: true });
  saveBlob([data], XLSX_MIME, filename);
}

const EXAMPLE_ROW: Record<string, string | number> = {
    Gender: "Female",
    "Date of Birth": "14/03/2001",
    "WhatsApp Number": "+92 300 1234567",
    "Full Name": "Ayesha Khan",
    "User ID": "",
    Password: "",
    "Marital Status": "Never Married",
    "Height (ft)": 5,
    "Height (in)": 4,
    Qualification: "Graduation",
    Profession: "Teacher",
    Religion: "Islam",
    Sect: "Sunni",
    "Practice Nazar Nayaz Khatam": "Yes",
    Caste: "Rajput",
    "Sub Caste": "Bhatti",
    "Describe Yourself": "Kind, family oriented and fond of reading.",
    Nationality: "Pakistan",
    "Residence Country": "Pakistan",
    "Residence Type": "Own",
    City: "Lahore",
};

export async function downloadTemplate() {
  const xlsx = await loadXlsx();
  const wb = xlsx.utils.book_new();

  const profiles = xlsx.utils.json_to_sheet([EXAMPLE_ROW], {
    header: COLUMNS.map((c) => c.header),
  });
  profiles["!cols"] = COLUMNS.map((c) => ({ wch: Math.max(14, c.header.length + 2) }));
  xlsx.utils.book_append_sheet(wb, profiles, "Profiles");

  const guide = xlsx.utils.aoa_to_sheet([
    ["Column", "Section", "Required", "How to fill it"],
    ...COLUMNS.map((c) => [c.header, c.group, c.required ? "Yes" : "No", c.hint]),
    [],
    ["Replace the example row with your own. One row per person."],
    ["Allowed values for dropdown style columns are on the Allowed Values sheet."],
    ["Profiles missing Personal, Religion or Residence details are created as incomplete."],
  ]);
  guide["!cols"] = [{ wch: 28 }, { wch: 12 }, { wch: 10 }, { wch: 60 }];
  xlsx.utils.book_append_sheet(wb, guide, "Instructions");

  const listCols = COLUMNS.filter((c) => c.options && c.key !== "residence_country");
  const longest = Math.max(...listCols.map((c) => c.options!.list.length));
  const allowed = xlsx.utils.aoa_to_sheet([
    listCols.map((c) => (c.key === "nationality" ? "Countries" : c.header)),
    ...Array.from({ length: longest }, (_, r) => listCols.map((c) => c.options!.list[r] ?? "")),
  ]);
  allowed["!cols"] = listCols.map(() => ({ wch: 24 }));
  xlsx.utils.book_append_sheet(wb, allowed, "Allowed Values");

  saveWorkbook(xlsx, wb, "PureLifePartner-bulk-profiles-template.xlsx");
}

/** CSV version of the template (header plus the example row). */
export async function downloadCsvTemplate() {
  const xlsx = await loadXlsx();
  const sheet = xlsx.utils.json_to_sheet([EXAMPLE_ROW], {
    header: COLUMNS.map((c) => c.header),
  });
  // The byte order mark makes Excel open the file as UTF-8, so non-Latin
  // names (Urdu, Arabic, Russian) display correctly.
  saveBlob(["﻿", xlsx.utils.sheet_to_csv(sheet)], "text/csv;charset=utf-8", "PureLifePartner-bulk-profiles-template.csv");
}

export async function readSpreadsheet(file: File): Promise<Record<string, unknown>[]> {
  const xlsx = await loadXlsx();
  // raw: CSV text stays as typed, so "05/11/1995" is read by our DD/MM/YYYY
  // parser instead of SheetJS guessing a US month-first date. Real Excel date
  // cells are unaffected and still arrive as Date objects.
  // CSVs are decoded as UTF-8 first; reading their raw bytes would garble
  // non-Latin names such as Cyrillic.
  const wb = /\.csv$/i.test(file.name)
    ? xlsx.read((await file.text()).replace(/^﻿/, ""), { type: "string", cellDates: true, raw: true })
    : xlsx.read(await file.arrayBuffer(), { cellDates: true, raw: true });
  const sheetName = wb.SheetNames.includes("Profiles") ? "Profiles" : wb.SheetNames[0];
  return xlsx.utils.sheet_to_json<Record<string, unknown>>(wb.Sheets[sheetName], {
    defval: "",
    raw: true,
  });
}

export interface CreatedLogin {
  rowNumber: number;
  name: string;
  whatsapp: string;
  userId: string;
  password: string;
}

export async function downloadLogins(logins: CreatedLogin[]) {
  const xlsx = await loadXlsx();
  const wb = xlsx.utils.book_new();
  const sheet = xlsx.utils.json_to_sheet(
    logins.map((l) => ({
      Row: l.rowNumber,
      "Full Name": l.name,
      "WhatsApp Number": l.whatsapp,
      "User ID": l.userId,
      Password: l.password,
      "Sign in at": "https://purelifepartner.com/login",
    }))
  );
  sheet["!cols"] = [{ wch: 6 }, { wch: 24 }, { wch: 20 }, { wch: 16 }, { wch: 14 }, { wch: 34 }];
  xlsx.utils.book_append_sheet(wb, sheet, "Logins");
  const stamp = new Date().toISOString().slice(0, 16).replace(/[T:]/g, "-");
  saveWorkbook(xlsx, wb, `PureLifePartner-logins-${stamp}.xlsx`);
}
