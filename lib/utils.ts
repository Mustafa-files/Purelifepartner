export function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(" ");
}

export const WHATSAPP_NUMBER = "+447748528207";
export const WHATSAPP_LINK = "https://wa.me/447748528207";
export const CONTACT_EMAIL = "Youasktv@gmail.com";
// Opens Gmail compose in a new tab with the recipient pre-filled
export const GMAIL_COMPOSE_LINK = `https://mail.google.com/mail/?view=cm&fs=1&to=${CONTACT_EMAIL}`;

/**
 * Parses flexible date input: DD/MM/YYYY, MM/DD/YYYY, YYYY/MM/DD, with /, - or . separators.
 * When the day/month order is ambiguous it prefers DD/MM/YYYY.
 */
export function parseFlexibleDate(input: string): Date | null {
  const trimmed = input.trim();
  if (!trimmed) return null;
  const parts = trimmed.split(/[\/\-.]/).map((p) => p.trim());
  if (parts.length !== 3) return null;

  let year: number, month: number, day: number;
  const nums = parts.map((p) => parseInt(p, 10));
  if (nums.some((n) => isNaN(n))) return null;

  if (parts[0].length === 4) {
    // YYYY/MM/DD
    [year, month, day] = nums;
  } else if (parts[2].length === 4) {
    year = nums[2];
    if (nums[0] > 12 && nums[1] <= 12) {
      // must be DD/MM/YYYY
      day = nums[0];
      month = nums[1];
    } else if (nums[1] > 12 && nums[0] <= 12) {
      // must be MM/DD/YYYY
      month = nums[0];
      day = nums[1];
    } else {
      // ambiguous: prefer DD/MM/YYYY
      day = nums[0];
      month = nums[1];
    }
  } else {
    return null;
  }

  if (month < 1 || month > 12 || day < 1 || day > 31) return null;
  const date = new Date(year, month - 1, day);
  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null;
  }
  return date;
}

export function calcAge(dob: Date): number {
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const m = today.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--;
  return age;
}

export function toISODate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function ftInToCm(ft: number, inches: number): number {
  return Math.round((ft * 30.48 + inches * 2.54) * 10) / 10;
}

export function cmToFtIn(cm: number): { ft: number; inches: number } {
  const totalInches = cm / 2.54;
  const ft = Math.floor(totalInches / 12);
  const inches = Math.round(totalInches % 12);
  if (inches === 12) return { ft: ft + 1, inches: 0 };
  return { ft, inches };
}

export function formatHeight(
  ft: number | null,
  inches: number | null,
  cm: number | null
): string {
  if (ft != null && inches != null) return `${ft}' ${inches}"`;
  if (cm != null) {
    const { ft: f, inches: i } = cmToFtIn(cm);
    return `${f}' ${i}"`;
  }
  return "N/A";
}

export function formatDate(iso: string | null | undefined): string {
  if (!iso) return "N/A";
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function formatDateTime(iso: string | null | undefined): string {
  if (!iso) return "N/A";
  return new Date(iso).toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function validatePassword(pw: string): string | null {
  if (pw.length < 8) return "Password must be at least 8 characters.";
  if (!/[A-Z]/.test(pw)) return "Password must include at least 1 uppercase letter.";
  if (!/[a-z]/.test(pw)) return "Password must include at least 1 lowercase letter.";
  if (!/[0-9]/.test(pw)) return "Password must include at least 1 number.";
  return null;
}

export function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export const AGE_ERROR =
  "Sorry, you must be between 16 and 35 years old to register.";
