import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="bg-off-white py-16 sm:py-24">
      <div className="mx-auto max-w-xl px-4 text-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/illustrations/brother-greeting.svg"
          alt=""
          className="mx-auto w-48 sm:w-60"
        />
        <p className="mt-8 text-sm font-bold uppercase tracking-[0.2em] text-coral">404</p>
        <h1 className="mt-3 text-3xl font-extrabold text-charcoal sm:text-5xl">
          We couldn&apos;t find that page
        </h1>
        <p className="mt-4 text-lg text-charcoal/60">
          It may have moved, or the link has a typo.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/">
            <Button>Back to home</Button>
          </Link>
          <Link href="/search">
            <Button variant="outline">Browse profiles</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
