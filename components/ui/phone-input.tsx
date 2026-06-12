"use client";

import { COUNTRY_CODES } from "@/lib/constants";
import { Input } from "./fields";

interface PhoneInputProps {
  value: string; // stored as "+44 7748528207"
  onChange: (v: string) => void;
  placeholder?: string;
}

export function PhoneInput({ value, onChange, placeholder }: PhoneInputProps) {
  const match = COUNTRY_CODES.find((c) => value.startsWith(c.code + " "));
  const code = match?.code ?? "+92";
  const number = match ? value.slice(match.code.length + 1) : value.replace(/^\+\d+\s?/, "");

  return (
    <div className="flex gap-2">
      <select
        value={code}
        onChange={(e) => onChange(`${e.target.value} ${number}`)}
        className="w-32 shrink-0 cursor-pointer rounded-xl border border-gray-300 bg-white px-2 py-2.5 text-sm outline-none focus:border-coral"
      >
        {COUNTRY_CODES.map((c) => (
          <option key={c.code + c.country} value={c.code}>
            {c.code} {c.country}
          </option>
        ))}
      </select>
      <Input
        type="tel"
        inputMode="numeric"
        value={number}
        onChange={(e) =>
          onChange(`${code} ${e.target.value.replace(/[^\d\s]/g, "")}`)
        }
        placeholder={placeholder ?? "3001234567"}
      />
    </div>
  );
}
