"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export type ToastKind = "success" | "error" | "info";

interface ToastItem {
  id: number;
  kind: ToastKind;
  message: string;
}

let counter = 0;

export function toast(message: string, kind: ToastKind = "success") {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent("plp-toast", { detail: { id: ++counter, kind, message } })
  );
}

export function Toaster() {
  const [items, setItems] = useState<ToastItem[]>([]);

  useEffect(() => {
    function onToast(e: Event) {
      const detail = (e as CustomEvent<ToastItem>).detail;
      setItems((prev) => [...prev, detail]);
      setTimeout(() => {
        setItems((prev) => prev.filter((t) => t.id !== detail.id));
      }, 4500);
    }
    window.addEventListener("plp-toast", onToast);
    return () => window.removeEventListener("plp-toast", onToast);
  }, []);

  return (
    <div className="pointer-events-none fixed bottom-24 right-4 z-[100] flex flex-col gap-2">
      {items.map((t) => (
        <div
          key={t.id}
          className={cn(
            "plp-toast pointer-events-auto max-w-sm rounded-xl px-5 py-3 text-sm font-semibold text-white shadow-lg",
            t.kind === "success" && "bg-ink",
            t.kind === "error" && "bg-red-600",
            t.kind === "info" && "bg-coral"
          )}
        >
          {t.message}
        </div>
      ))}
    </div>
  );
}
