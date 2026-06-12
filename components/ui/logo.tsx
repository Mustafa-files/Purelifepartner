import { cn } from "@/lib/utils";

export function LogoMark({ className }: { className?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/logo.png"
      alt="PureLifePartner logo"
      className={cn("h-9 w-auto", className)}
    />
  );
}

export function Logo({
  className,
  textClass = "text-coral",
}: {
  className?: string;
  textClass?: string;
}) {
  return (
    <span className={cn("flex items-center gap-2", className)}>
      <LogoMark />
      <span className={cn("text-xl font-extrabold tracking-tight", textClass)}>
        PureLifePartner
      </span>
    </span>
  );
}
