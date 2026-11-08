"use client";

import { cn } from "@/lib/utils";
import { tidyPlaceName } from "@/lib/locations";
import { useEffect, useRef, useState } from "react";

interface MultiSelectProps {
  options: string[];
  value: string[];
  onChange: (v: string[]) => void;
  placeholder?: string;
  allLabel?: string; // e.g. "All Castes": selecting it clears specific picks
  allowCustomPlace?: boolean; // members can add a place that is not listed
}

export function MultiSelect({
  options,
  value,
  onChange,
  placeholder = "Select...",
  allLabel,
  allowCustomPlace = false,
}: MultiSelectProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const allSelected = allLabel != null && value.includes(allLabel);
  const filtered = options.filter((o) =>
    o.toLowerCase().includes(query.toLowerCase())
  );

  function toggle(option: string) {
    if (allLabel && option === allLabel) {
      onChange(allSelected ? [] : [allLabel]);
      return;
    }
    const without = value.filter((v) => v !== option && v !== allLabel);
    if (value.includes(option)) {
      onChange(without);
    } else {
      onChange([...without, option]);
    }
  }

  // What the search box would add: a listed spelling wins over the typed one
  const typed = allowCustomPlace ? tidyPlaceName(query) : "";
  const known = [...options, ...value].find(
    (o) => o.toLowerCase() === typed.toLowerCase()
  );
  const customPlace = typed && !known ? typed : "";

  function addTyped() {
    const place = known ?? customPlace;
    if (!place) return;
    if (!value.includes(place)) toggle(place);
    setQuery("");
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full min-h-[46px] cursor-pointer flex-wrap items-center gap-1.5 rounded-xl border border-gray-300 bg-white px-3 py-2 text-left transition-colors focus:border-coral focus:ring-2 focus:ring-coral/20"
      >
        {value.length === 0 && (
          <span className="text-gray-400">{placeholder}</span>
        )}
        {value.map((v) => (
          <span
            key={v}
            className="inline-flex items-center gap-1 rounded-full bg-coral/10 px-2.5 py-0.5 text-sm font-semibold text-coral"
          >
            {v}
            <span
              role="button"
              tabIndex={0}
              onClick={(e) => {
                e.stopPropagation();
                toggle(v);
              }}
              className="text-coral hover:text-charcoal"
            >
              ×
            </span>
          </span>
        ))}
        <span className="ml-auto text-gray-400">{open ? "▴" : "▾"}</span>
      </button>

      {open && (
        <div className="absolute z-30 mt-1 max-h-64 w-full overflow-auto rounded-xl border border-gray-200 bg-white shadow-lg">
          <div className="sticky top-0 border-b border-gray-100 bg-white p-2">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key !== "Enter") return;
                e.preventDefault();
                if (allowCustomPlace) addTyped();
              }}
              placeholder={allowCustomPlace ? "Type any city..." : "Type to filter..."}
              className="w-full rounded-lg border border-gray-200 px-3 py-1.5 text-sm outline-none focus:border-coral"
            />
          </div>
          {allLabel && (
            <OptionRow
              label={allLabel}
              selected={allSelected}
              onClick={() => toggle(allLabel)}
            />
          )}
          {customPlace && (
            <button
              type="button"
              disabled={allSelected}
              onClick={addTyped}
              className="flex w-full cursor-pointer items-center gap-2 px-4 py-2 text-left text-sm font-bold text-coral transition-colors hover:bg-off-white disabled:cursor-not-allowed disabled:opacity-40"
            >
              + Add &quot;{customPlace}&quot;
            </button>
          )}
          {filtered.length === 0 && !customPlace && (
            <div className="px-4 py-3 text-sm text-gray-400">
              {allowCustomPlace ? "Type your city to add it" : "No options"}
            </div>
          )}
          {filtered.map((o) => (
            <OptionRow
              key={o}
              label={o}
              selected={value.includes(o)}
              disabled={allSelected}
              onClick={() => toggle(o)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function OptionRow({
  label,
  selected,
  disabled,
  onClick,
}: {
  label: string;
  selected: boolean;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "flex w-full cursor-pointer items-center gap-2 px-4 py-2 text-left text-sm transition-colors hover:bg-off-white disabled:cursor-not-allowed disabled:opacity-40",
        selected && "font-bold text-coral"
      )}
    >
      <span
        className={cn(
          "flex h-4 w-4 items-center justify-center rounded border text-[10px] text-white",
          selected ? "border-coral bg-coral" : "border-gray-300 bg-white"
        )}
      >
        {selected && "✓"}
      </span>
      {label}
    </button>
  );
}
