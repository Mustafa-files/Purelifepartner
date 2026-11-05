import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ScrollAnimations } from "@/components/ui/scroll-animations";
import { HeroSearch } from "@/components/home/hero-search";
import { FeatureShowcase } from "@/components/home/feature-showcase";
import { Testimonials } from "@/components/home/testimonials";
import { CountUp } from "@/components/home/count-up";

export default function LandingPage() {
  return (
    <>
      <ScrollAnimations />
      <Hero />
      <StatsBar />
      <ParallaxBand />
      <HowItWorks />
      <FeatureShowcase />
      <ForFamilies />
      <StaggerBand />
      <Testimonials />
      <BigStats />
      <FAQ />
      <DownloadCTA />
    </>
  );
}

function AppBadges() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/play-badge.png"
        alt="Get it on Google Play"
        className="h-12 w-auto cursor-pointer transition-transform hover:scale-105"
      />
      <span className="text-sm font-semibold text-charcoal/70">
        iOS Version Coming Soon
      </span>
    </div>
  );
}

/** Minimal hero: the two illustrations either side of the headline, and a
 *  one-sentence search so visitors see real profiles in one click */
function Hero() {
  return (
    <section className="wash bg-off-white">
      <div className="mx-auto flex min-h-[calc(100svh-5rem)] max-w-7xl flex-col justify-center px-4 py-14 sm:px-6">
        {/* Phones: both illustrations side by side above the headline */}
        <div className="gsap-hero mb-6 flex items-end justify-center gap-2 lg:hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/illustrations/sister-waving.svg" alt="" className="w-28 sm:w-36" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/illustrations/brother-greeting.svg" alt="" className="w-28 sm:w-36" />
        </div>

        <div className="grid items-end gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,2.4fr)_minmax(0,1fr)]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/illustrations/sister-waving.svg"
            alt="Smiling sister in a burqa waving"
            className="gsap-hero hidden w-full max-w-[280px] justify-self-start lg:block"
          />

          <div className="text-center">
            <h1 className="gsap-hero text-4xl font-extrabold leading-tight text-charcoal sm:text-6xl">
              Where pure hearts <span className="text-coral">find their match</span>
            </h1>
            <p className="gsap-hero mx-auto mt-5 max-w-xl text-lg text-charcoal/70">
              Free to join. Names stay private. Made for nikah.
            </p>
          </div>

          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/illustrations/brother-greeting.svg"
            alt="Smiling bearded brother with his hand on his heart"
            className="gsap-hero hidden w-full max-w-[280px] justify-self-end lg:block"
          />
        </div>

        <div className="gsap-hero mt-10">
          <HeroSearch />
        </div>

        <p className="gsap-hero mt-6 text-center text-sm text-charcoal/60">
          or{" "}
          <Link href="/register" className="font-bold text-coral underline-offset-4 hover:underline">
            create your free profile
          </Link>
        </p>
      </div>
    </section>
  );
}

function ParallaxBand() {
  const ghostSpeeds = [0.95, 0.9, 0.85, 0.8, 0.75, 0.7];
  return (
    <section
      aria-hidden="true"
      className="flex items-center justify-center bg-off-white pb-[24vh] pt-[12vh]"
    >
      <div className="plp-echo">
        <p className="plp-echo-solid">Pure Hearts</p>
        {ghostSpeeds.map((speed) => (
          <p key={speed} className="plp-echo-ghost" data-speed={speed}>
            Pure Hearts
          </p>
        ))}
      </div>
    </section>
  );
}

function StaggerBand() {
  return (
    <section className="bg-white py-10 sm:py-14">
      <h3
        id="split-stagger"
        className="whitespace-nowrap text-center font-extrabold tracking-wide text-coral"
        style={{ fontSize: "clamp(36px, 7vw, 96px)", lineHeight: 1 }}
      >
        together forever...
      </h3>
    </section>
  );
}

function StatsBar() {
  const stats = ["10,000+ profiles", "6 continents", "Verified members", "Halal and safe"];
  return (
    <section className="border-y border-gray-100 bg-off-white">
      <ul className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-4 gap-y-2 px-4 py-6 text-sm font-bold text-charcoal sm:px-6">
        {stats.map((label, i) => (
          <li key={label} className="flex items-center gap-4">
            {i > 0 && <span aria-hidden="true" className="h-1 w-1 rounded-full bg-coral" />}
            {label}
          </li>
        ))}
      </ul>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    { title: "Create a profile", text: "Free, in about five minutes." },
    { title: "Search with filters", text: "Find what matters to your family." },
    { title: "Get verified", text: "Unlock contact details and take the next step." },
  ];
  return (
    <section id="how-it-works" className="bg-off-white py-20 sm:py-28">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] lg:gap-16">
        <div className="gsap-fade-up">
          <h2 className="text-4xl font-extrabold leading-tight text-charcoal sm:text-5xl">
            Three steps <br className="hidden lg:block" />
            to nikah
          </h2>
          <Link
            href="/register"
            className="mt-6 inline-block font-bold text-coral underline-offset-4 hover:underline"
          >
            Create your free profile →
          </Link>
        </div>

        <ol className="border-b border-charcoal/20">
          {steps.map((s, i) => (
            <li
              key={s.title}
              className="gsap-fade-up flex items-baseline gap-6 border-t border-charcoal/20 py-7 sm:gap-10"
            >
              <span className="w-14 shrink-0 font-[family-name:var(--font-display)] text-4xl font-extrabold text-coral sm:w-20 sm:text-6xl">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <h3 className="text-xl font-bold text-charcoal sm:text-2xl">{s.title}</h3>
                <p className="mt-1 text-charcoal/60">{s.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function BigStats() {
  const stats = [
    { value: "10,000+", label: "Members" },
    { value: "6", label: "Continents" },
    { value: "500+", label: "Successful Matches" },
    { value: "4", label: "Currencies Supported" },
  ];
  return (
    <section className="plp-pattern-light bg-coral py-16">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-4 text-center text-white sm:px-6 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="gsap-zoom">
            <div className="text-4xl font-extrabold sm:text-5xl">
              <CountUp value={s.value} />
            </div>
            <div className="mt-2 text-sm font-semibold uppercase tracking-wider text-white/85">
              {s.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/** Parents and walis: the third illustration beside one short line */
function ForFamilies() {
  return (
    <section className="overflow-hidden bg-off-white py-20 sm:py-24">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/illustrations/parents-phone.svg"
          alt="Smiling mother and father looking at a profile on a phone together"
          loading="lazy"
          className="gsap-slide-left mx-auto w-full max-w-[460px]"
        />
        <div className="gsap-slide-right text-center lg:text-left">
          <h2 className="text-3xl font-extrabold text-charcoal sm:text-5xl">
            Made for families too
          </h2>
          <p className="mx-auto mt-5 max-w-md text-lg leading-relaxed text-charcoal/70 lg:mx-0">
            A parent or wali can set up a profile with you, and every profile
            can be shared with family in one tap.
          </p>
          <Link
            href="/register"
            className="mt-6 inline-block font-bold text-coral underline-offset-4 hover:underline"
          >
            Create a profile together →
          </Link>
        </div>
      </div>
    </section>
  );
}

const FAQS = [
  {
    q: "Is it free to join?",
    a: "Yes. Creating a profile and browsing is free. You only pay when you get verified to unlock contact details.",
  },
  {
    q: "Who can see my name and number?",
    a: "Other members only see your Profile ID. Your contact details are shared only after verification.",
  },
  {
    q: "Can a parent create a profile for me?",
    a: "Yes. A parent or wali can register on your behalf, with your full knowledge and consent.",
  },
  {
    q: "How do I share a profile with my family?",
    a: "Every profile has a Share button for WhatsApp, email or a copied link.",
  },
  {
    q: "Which currencies can I pay in?",
    a: "PKR, GBP, EUR or USD.",
  },
];

function FAQ() {
  return (
    <section id="faq" className="bg-white py-20 sm:py-28">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] lg:gap-16">
        <h2 className="gsap-fade-up text-4xl font-extrabold leading-tight text-charcoal sm:text-5xl">
          Questions, <br className="hidden lg:block" />
          answered
        </h2>
        <div className="border-b border-charcoal/20">
          {FAQS.map((f) => (
            <details key={f.q} className="plp-faq group border-t border-charcoal/20">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-6 text-lg font-bold text-charcoal sm:text-xl">
                {f.q}
                <span
                  aria-hidden="true"
                  className="relative h-4 w-4 shrink-0 text-coral before:absolute before:left-0 before:top-1/2 before:h-0.5 before:w-4 before:-translate-y-1/2 before:bg-current after:absolute after:left-1/2 after:top-0 after:h-4 after:w-0.5 after:-translate-x-1/2 after:bg-current after:transition-transform group-open:after:scale-y-0"
                />
              </summary>
              <p className="-mt-2 max-w-xl pb-6 text-charcoal/70">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

function DownloadCTA() {
  return (
    <section id="download" className="wash bg-off-white py-20">
      <div className="gsap-fade-up mx-auto max-w-3xl px-4 text-center sm:px-6">
        <h2 className="text-3xl font-bold text-charcoal sm:text-4xl">
          Ready to Begin Your Journey?
        </h2>
        <p className="mt-4 text-lg text-charcoal/60">
          Join thousands of Muslims finding their match.
        </p>
        <div className="mt-8">
          <AppBadges />
        </div>
        <div className="mt-8">
          <Link href="/register">
            <Button size="lg">Create Free Account</Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
