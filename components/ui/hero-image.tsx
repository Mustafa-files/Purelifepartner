"use client";

import { useEffect, useRef, useState } from "react";
import { HeroIllustration } from "@/components/ui/hero-illustration";

/**
 * Renders the hero illustration. It prefers the brand PNG at
 * `public/hero-illustration.png`; if that file is missing it falls back to the
 * inline SVG so the hero never breaks. Drop the real image into `public/` and
 * it appears automatically with no code change.
 */
export function HeroImage({ className }: { className?: string }) {
  const [failed, setFailed] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  // The native `error` event can fire before React hydrates and attaches the
  // onError handler, which would leave a broken-image icon on screen. After
  // mount, re-check the image: if it finished loading with no pixels, it failed
  // and we fall back to the SVG.
  useEffect(() => {
    const img = imgRef.current;
    if (img && img.complete && img.naturalWidth === 0) setFailed(true);
  }, []);

  if (failed) return <HeroIllustration className={className} />;

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      ref={imgRef}
      src="/hero-illustration.png"
      alt="Verified members from around the world seeking a life partner"
      className={className}
      onError={() => setFailed(true)}
    />
  );
}
