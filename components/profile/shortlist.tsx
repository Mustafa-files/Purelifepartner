"use client";

import { useEffect, useSyncExternalStore } from "react";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { toast } from "@/components/ui/toast";
import { cn } from "@/lib/utils";

/*
 * The signed-in member's shortlist, loaded once and shared by every heart
 * on the page. Rows live in public.shortlists (RLS: own rows only).
 */
let ids = new Set<string>();
let userId: string | null = null;
let loaded: Promise<void> | null = null;
const listeners = new Set<() => void>();

function emit() {
  ids = new Set(ids);
  listeners.forEach((l) => l());
}

function load() {
  if (!loaded) {
    loaded = (async () => {
      const supabase = createClient();
      const { data } = await supabase.auth.getUser();
      userId = data.user?.id ?? null;
      if (!userId) return;
      const { data: rows } = await supabase.from("shortlists").select("profile_id");
      ids = new Set((rows ?? []).map((r) => r.profile_id as string));
      emit();
    })();
  }
  return loaded;
}

function subscribe(l: () => void) {
  listeners.add(l);
  return () => listeners.delete(l);
}

/** Set of shortlisted profile ids for the signed-in member */
export function useShortlist() {
  useEffect(() => {
    load();
  }, []);
  return useSyncExternalStore(subscribe, () => ids, () => ids);
}

async function toggle(profileId: string) {
  const supabase = createClient();
  const has = ids.has(profileId);
  // Optimistic: flip first, undo on failure
  if (has) ids.delete(profileId);
  else ids.add(profileId);
  emit();
  const { error } = has
    ? await supabase.from("shortlists").delete().eq("user_id", userId!).eq("profile_id", profileId)
    : await supabase.from("shortlists").insert({ user_id: userId, profile_id: profileId });
  if (error) {
    if (has) ids.add(profileId);
    else ids.delete(profileId);
    emit();
    toast("Couldn't update your shortlist. Try again.", "error");
    return;
  }
  toast(has ? "Removed from your shortlist" : "Added to your shortlist");
}

export function ShortlistButton({
  profileId,
  className,
}: {
  profileId: string;
  className?: string;
}) {
  const list = useShortlist();
  const router = useRouter();
  const pathname = usePathname();
  const on = list.has(profileId);

  async function onClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    await load();
    if (!userId) {
      router.push(`/login?next=${encodeURIComponent(pathname)}`);
      return;
    }
    if (userId === profileId) return;
    toggle(profileId);
  }

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={on}
      aria-label={on ? "Remove from shortlist" : "Add to shortlist"}
      className={cn(
        "flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-[#ffffff]/95 text-coral shadow-sm transition-transform hover:scale-110",
        className
      )}
    >
      <svg
        viewBox="0 0 24 24"
        fill={on ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-5 w-5"
        aria-hidden="true"
      >
        <path d="M19.5 12.6 12 20l-7.5-7.4A5 5 0 1 1 12 6a5 5 0 1 1 7.5 6.6z" />
      </svg>
    </button>
  );
}
