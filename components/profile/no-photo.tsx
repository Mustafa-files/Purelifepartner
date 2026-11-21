/**
 * Shown in place of a member photo when none has been added: the brand logo,
 * faded, on a soft pink panel. Size and shape come from `className`.
 */
export function NoPhoto({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`flex items-center justify-center bg-soft-pink ${className}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/plp-logo-circle.png" alt="" className="h-1/2 w-auto opacity-40" />
    </div>
  );
}
