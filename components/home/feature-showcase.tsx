import type { ReactNode } from "react";

/*
 * Homepage feature showcase: each row pairs a Pixel phone mockup with a
 * short headline. The mockups live in public/mockups.
 */

const SHADOW = "drop-shadow-[0_24px_30px_rgba(43,35,37,0.28)]";

/** Where each phone sits in a tilted pair: one leaning back on the left,
 *  one leaning forward on the right and overlapping it. */
const BACK = "left-0 top-[7%] -rotate-[7deg]";
const FRONT = "right-0 top-0 rotate-[5deg] z-10";

function Mockup({
  src,
  alt,
  className = "",
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      loading="lazy"
      decoding="async"
      className={`absolute w-[54%] ${SHADOW} ${className}`}
    />
  );
}

/** The search screen has a light and a dark version; show the one that
 *  matches the site theme. */
function SearchMockup({ className }: { className: string }) {
  const alt = "Search results with a profile card";
  return (
    <>
      <Mockup src="/mockups/search.webp" alt={alt} className={`plp-light-only ${className}`} />
      <Mockup src="/mockups/search-dark.webp" alt={alt} className={`plp-dark-only ${className}`} />
    </>
  );
}

/** Holds a tilted pair of phones */
function Pair({ children }: { children: ReactNode }) {
  return <div className="relative mx-auto aspect-[5/6] w-full max-w-[460px]">{children}</div>;
}

const ROWS: { title: string; text: string; visual: ReactNode }[] = [
  {
    title: "Private by design",
    text: "Members see a Profile ID, never your name. Numbers unlock only when both sides are verified.",
    visual: (
      <Pair>
        <SearchMockup className={BACK} />
        <Mockup
          src="/mockups/profile.webp"
          alt="Profile PLP-100178 shown by ID only, with a Share button"
          className={FRONT}
        />
      </Pair>
    ),
  },
  {
    title: "Share with your family",
    text: "Send any profile to your parents on WhatsApp or email in one tap.",
    visual: (
      <Pair>
        <Mockup src="/mockups/profile.webp" alt="" className={BACK} />
        <Mockup
          src="/mockups/share-menu.webp"
          alt="Share menu with WhatsApp, Email, Copy link and More options"
          className={FRONT}
        />
      </Pair>
    ),
  },
  {
    title: "Find who fits",
    text: "Filter by country, city, sect, caste, profession and age.",
    visual: (
      <Pair>
        <SearchMockup className={BACK} />
        <Mockup
          src="/mockups/filters.webp"
          alt="Search filters for gender, age, marital status, religion, caste and country"
          className={FRONT}
        />
      </Pair>
    ),
  },
];

const EXTRAS = ["Wali support", "Pay in PKR, GBP, EUR or USD", "AI matching, coming soon"];

export function FeatureShowcase() {
  return (
    <section id="about" className="overflow-hidden bg-white py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h2 className="gsap-fade-up text-center text-3xl font-bold text-charcoal sm:text-4xl">
          Built for a serious search
        </h2>

        <div className="mt-14 space-y-20">
          {ROWS.map((row, i) => (
            <div
              key={row.title}
              className={`flex flex-col items-center gap-10 lg:flex-row lg:gap-16 ${i % 2 === 1 ? "lg:flex-row-reverse" : ""}`}
            >
              <div className={`${i % 2 === 1 ? "gsap-slide-right" : "gsap-slide-left"} w-full lg:w-1/2`}>
                {row.visual}
              </div>
              <div
                className={`${i % 2 === 1 ? "gsap-slide-left" : "gsap-slide-right"} max-w-md text-center lg:w-1/2 lg:text-left`}
              >
                <h3 className="text-3xl font-extrabold text-charcoal sm:text-4xl">{row.title}</h3>
                <p className="mt-4 text-lg leading-relaxed text-charcoal/70">{row.text}</p>
              </div>
            </div>
          ))}
        </div>

        <ul className="gsap-fade-up mt-20 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-sm font-bold text-charcoal">
          {EXTRAS.map((label, i) => (
            <li key={label} className="flex items-center gap-3">
              {i > 0 && <span aria-hidden="true" className="h-1 w-1 rounded-full bg-coral" />}
              {label}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
