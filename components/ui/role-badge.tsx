import { cn } from "@/lib/utils";
import type { UserRole } from "@/types";

/** Short label shown on a badge in the admin user list. */
export function roleBadgeLabel(role: UserRole): string {
  if (role === "admin") return "Admin";
  if (role === "agent") return "Agent";
  if (role === "system") return "System";
  return "User";
}

/** Longer label shown to a member on their own dashboard. */
export function accountTypeLabel(role: UserRole): string {
  if (role === "admin") return "Admin";
  if (role === "agent") return "Agent";
  if (role === "system") return "System";
  return "Member";
}

function roleClasses(role: UserRole): string {
  if (role === "admin") return "bg-amber-100 text-amber-700";
  if (role === "agent" || role === "system") return "bg-coral/10 text-coral";
  return "bg-gray-100 text-gray-500";
}

export function RoleBadge({
  role,
  className,
}: {
  role: UserRole;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-block w-fit rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide",
        roleClasses(role),
        className
      )}
    >
      {roleBadgeLabel(role)}
    </span>
  );
}
