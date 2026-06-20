"use client";

import { useState } from "react";
import { HeroIllustration } from "@/components/ui/hero-illustration";

/**
 * Renders the hero illustration. It prefers the brand PNG at
 * `public/hero-illustration.png`; if that file is missing it falls back to the
 * inline SVG so the hero never breaks. Drop the real image into `public/` and
 * it appears automatically with no code change.
 */
export function HeroImage({ className }: { className?: string }) {
  const [failed, setFailed] = useState(false);

  if (failed) return <HeroIllustration className={className} />;

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/hero-illustration.png"
      alt="Verified members from around the world seeking a life partner"
      className={className}
      onError={() => setFailed(true)}
    />
  );
}
