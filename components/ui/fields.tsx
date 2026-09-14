"use client";

import { cn } from "@/lib/utils";
import {
  InputHTMLAttributes,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
  forwardRef,
  useState,
} from "react";

const baseField =
  "w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-charcoal placeholder-gray-400 outline-none transition-colors focus:border-coral focus:ring-2 focus:ring-coral/20 disabled:bg-off-white disabled:text-gray-500";

export function FieldLabel({
  label,
  required,
  hint,
  children,
  error,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
  error?: string | null;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-semibold text-charcoal">
        {label}
        {required && <span className="ml-0.5 text-coral">*</span>}
      </span>
      {children}
      {hint && !error && (
        <span className="mt-1 block text-xs text-gray-500">{hint}</span>
      )}
      {error && (
        <span className="mt-1 block text-xs font-semibold text-red-600">
          {error}
        </span>
      )}
    </label>
  );
}

export const Input = forwardRef<
  HTMLInputElement,
  InputHTMLAttributes<HTMLInputElement>
>(function Input({ className, ...props }, ref) {
  return <input ref={ref} className={cn(baseField, className)} {...props} />;
});

/** Password input with an eye button that shows or hides the characters. */
export const PasswordInput = forwardRef<
  HTMLInputElement,
  Omit<InputHTMLAttributes<HTMLInputElement>, "type">
>(function PasswordInput({ className, ...props }, ref) {
  const [visible, setVisible] = useState(false);
  return (
    <div className="relative">
      <input
        ref={ref}
        type={visible ? "text" : "password"}
        className={cn(baseField, "pr-12", className)}
        {...props}
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        aria-label={visible ? "Hide password" : "Show password"}
        aria-pressed={visible}
        title={visible ? "Hide password" : "Show password"}
        className="absolute inset-y-0 right-0 flex w-12 cursor-pointer items-center justify-center rounded-r-xl text-gray-400 transition-colors hover:text-coral focus-visible:text-coral focus-visible:outline-none"
      >
        {/* The icon shows the current state: crossed-out eye while hidden,
            open eye while visible. The label describes the click action. */}
        {visible ? <EyeIcon /> : <EyeOffIcon />}
      </button>
    </div>
  );
});

function EyeIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M10.6 5.1A10.7 10.7 0 0 1 12 5c6.5 0 10 7 10 7a17.6 17.6 0 0 1-3.2 4.2" />
      <path d="M6.6 6.6C3.8 8.4 2 12 2 12s3.5 7 10 7a9.7 9.7 0 0 0 5.4-1.6" />
      <path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" />
      <path d="m2 2 20 20" />
    </svg>
  );
}

export const Textarea = forwardRef<
  HTMLTextAreaElement,
  TextareaHTMLAttributes<HTMLTextAreaElement>
>(function Textarea({ className, ...props }, ref) {
  return (
    <textarea
      ref={ref}
      rows={4}
      className={cn(baseField, "resize-y", className)}
      {...props}
    />
  );
});

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  options: string[];
  placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  function Select({ className, options, placeholder, ...props }, ref) {
    return (
      <select ref={ref} className={cn(baseField, "cursor-pointer", className)} {...props}>
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    );
  }
);

export function RadioGroup({
  name,
  options,
  value,
  onChange,
}: {
  name: string;
  options: readonly string[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-3">
      {options.map((o) => (
        <label
          key={o}
          className={cn(
            "cursor-pointer rounded-full border-2 px-5 py-2 text-sm font-semibold transition-colors",
            value === o
              ? "border-coral bg-coral text-white"
              : "border-gray-300 bg-white text-charcoal hover:border-coral-muted"
          )}
        >
          <input
            type="radio"
            name={name}
            value={o}
            checked={value === o}
            onChange={() => onChange(o)}
            className="sr-only"
          />
          {o}
        </label>
      ))}
    </div>
  );
}
