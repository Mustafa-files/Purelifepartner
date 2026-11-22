"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Renders the hero picture from `public/hero-illustration.webp`. If the file
 * fails to load it renders nothing rather than a broken-image icon.
 */
export function HeroImage({ className }: { className?: string }) {
  const [failed, setFailed] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  // The native `error` event can fire before React hydrates and attaches the
  // onError handler. After mount, re-check the image: if it finished loading
  // with no pixels, it failed and we hide it.
  useEffect(() => {
    const img = imgRef.current;
    if (img && img.complete && img.naturalWidth === 0) setFailed(true);
  }, []);

  if (failed) return null;

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      ref={imgRef}
      src="/hero-illustration.webp"
      alt="Verified members from around the world seeking a life partner"
      className={className}
      onError={() => setFailed(true)}
    />
  );
}
