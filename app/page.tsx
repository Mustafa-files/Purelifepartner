import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ScrollAnimations } from "@/components/ui/scroll-animations";
import { WHATSAPP_NUMBER } from "@/lib/utils";

export default function LandingPage() {
  return (
    <>
      <ScrollAnimations />
      <Hero />
      <StatsBar />
      <ParallaxBand />
      <HowItWorks />
      <Features />
      <StaggerBand />
      <Testimonials />
      <BigStats />
      <DownloadCTA />
    </>
  );
}

function AppBadges() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <div className="flex h-12 cursor-pointer items-center gap-2 rounded-lg bg-ink px-4 text-white transition-colors hover:bg-black">
        <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
          <path d="M18.7 12.6c0-2.5 2-3.7 2.1-3.8-1.2-1.7-3-1.9-3.6-1.9-1.5-.2-3 .9-3.8.9-.8 0-2-.9-3.3-.9-1.7 0-3.3 1-4.2 2.5-1.8 3.1-.5 7.7 1.3 10.2.9 1.2 1.9 2.6 3.2 2.5 1.3 0 1.8-.8 3.4-.8s2 .8 3.4.8c1.4 0 2.3-1.2 3.1-2.5 1-1.4 1.4-2.8 1.4-2.9-.1 0-2.9-1.1-3-4.1zM16.2 5c.7-.9 1.2-2 1-3.2-1 0-2.3.7-3 1.5-.7.8-1.2 2-1.1 3.1 1.2.1 2.4-.5 3.1-1.4z" />
        </svg>
        <div className="text-left leading-tight">
          <div className="text-[10px]">Download on the</div>
          <div className="text-sm font-bold">App Store</div>
        </div>
      </div>
      <div className="flex h-12 cursor-pointer items-center gap-2 rounded-lg bg-ink px-4 text-white transition-colors hover:bg-black">
        <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
          <path d="M3.6 2.3 13.7 12 3.6 21.7c-.4-.2-.6-.6-.6-1.1V3.4c0-.5.2-.9.6-1.1zm11.5 11.1 2.6 2.5-11.4 6.4 8.8-8.9zm3.9-2.9c.6.4 1 .9 1 1.5s-.3 1.1-1 1.5l-2.4 1.4-2.9-2.9 2.9-2.9 2.4 1.4zM6.3 1.7l11.4 6.4-2.6 2.5-8.8-8.9z" />
        </svg>
        <div className="text-left leading-tight">
          <div className="text-[10px]">Get it on</div>
          <div className="text-sm font-bold">Google Play</div>
        </div>
      </div>
    </div>
  );
}

function PhoneMockup() {
  return (
    <div className="relative mx-auto w-64 sm:w-72">
      <div className="rounded-[2.5rem] border-[10px] border-ink bg-white p-3 shadow-2xl">
        <div className="mx-auto mb-3 h-1.5 w-16 rounded-full bg-gray-200" />
        <div className="rounded-2xl bg-off-white p-3">
          <div className="mb-3 flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-coral text-sm font-bold text-white">
              A
            </div>
            <div>
              <div className="text-xs font-bold text-charcoal">Ayesha_K</div>
              <div className="text-[10px] text-gray-500">London, UK · 26</div>
            </div>
            <span className="ml-auto rounded-full bg-green-100 px-2 py-0.5 text-[9px] font-bold text-green-700">
              Verified
            </span>
          </div>
          <div className="mb-3 flex h-36 items-center justify-center rounded-xl bg-gradient-to-br from-coral/20 to-coral/40 text-4xl">
            🌸
          </div>
          <div className="space-y-1.5">
            <div className="h-2 w-3/4 rounded bg-gray-200" />
            <div className="h-2 w-1/2 rounded bg-gray-200" />
          </div>
          <div className="mt-3 flex gap-2">
            <div className="flex-1 rounded-full bg-coral py-1.5 text-center text-[10px] font-bold text-white">
              View Profile
            </div>
            <div className="flex-1 rounded-full border border-coral py-1.5 text-center text-[10px] font-bold text-coral">
              Save
            </div>
          </div>
        </div>
        <div className="mt-3 flex justify-around text-lg">
          <span>🏠</span>
          <span>🔍</span>
          <span className="opacity-40">💬</span>
          <span className="opacity-40">👤</span>
        </div>
      </div>
      <div className="absolute -right-4 -top-4 rounded-2xl bg-white px-3 py-2 shadow-lg">
        <span className="text-xs font-bold text-charcoal">💍 500+ matches</span>
      </div>
      <div className="absolute -bottom-3 -left-6 rounded-2xl bg-white px-3 py-2 shadow-lg">
        <span className="text-xs font-bold text-charcoal">🕌 Halal & Safe</span>
      </div>
    </div>
  );
}

function Hero() {
  return (
    <section className="wash bg-off-white">
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2">
        <div className="text-center lg:text-left">
          <h1 className="gsap-hero text-4xl font-extrabold leading-tight text-charcoal sm:text-5xl lg:text-6xl">
            Where Pure Hearts <span className="text-coral">Find Their Match</span>
          </h1>
          <p className="gsap-hero mx-auto mt-5 max-w-xl text-lg text-charcoal/70 lg:mx-0">
            A halal, respectful, and modern platform for Muslims seeking a life
            partner
          </p>
          <div className="gsap-hero mt-8 flex flex-wrap items-center justify-center gap-4 lg:justify-start">
            <Link href="/register">
              <Button size="lg">Create Free Profile</Button>
            </Link>
            <Link href="/search">
              <Button size="lg" variant="outline">
                Browse Profiles
              </Button>
            </Link>
          </div>
          <div className="gsap-hero mt-8 lg:[&>div]:justify-start">
            <AppBadges />
          </div>
        </div>
        {/* data-speed instead of an entrance tween: both writing to y would fight */}
        <div className="hidden lg:block" data-speed="0.9">
          <PhoneMockup />
        </div>
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
    <section className="bg-white pb-12 pt-28">
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
  const stats = [
    { icon: "👥", label: "10,000+ Profiles" },
    { icon: "🌍", label: "6 Continents" },
    { icon: "✅", label: "Verified Members" },
    { icon: "🕌", label: "Halal & Safe" },
  ];
  return (
    <section className="border-y border-gray-100 bg-off-white">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-12 gap-y-4 px-4 py-6 sm:px-6">
        {stats.map((s) => (
          <div key={s.label} className="flex items-center gap-2">
            <span className="text-xl">{s.icon}</span>
            <span className="text-sm font-bold text-charcoal">{s.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function HowItWorks() {
  const cards = [
    {
      icon: "🕌",
      title: "Create Your Profile",
      text: "Sign up free, fill in your personal details, preferences, and upload your photo.",
    },
    {
      icon: "🔍",
      title: "Search & Connect",
      text: "Use our powerful filters to find compatible matches by region, country, caste, sect, and more.",
    },
    {
      icon: "💍",
      title: "Get Verified & Meet",
      text: "Complete payment verification to unlock contact details and take the next step.",
    },
  ];
  return (
    <section id="how-it-works" className="bg-off-white py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <h2 className="gsap-fade-up text-center text-3xl font-bold text-charcoal sm:text-4xl">
          Your Journey to Nikah
        </h2>
        <p className="gsap-fade-up mx-auto mt-3 max-w-2xl text-center text-charcoal/60">
          Three simple steps stand between you and your future spouse
        </p>
        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {cards.map((c, i) => (
            <div
              key={c.title}
              className="gsap-fade-up rounded-2xl border-t-4 border-coral bg-white p-8 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="mb-4 flex items-center gap-3">
                <span className="text-4xl">{c.icon}</span>
                <span className="text-sm font-extrabold text-coral">
                  STEP {i + 1}
                </span>
              </div>
              <h3 className="text-xl font-bold text-charcoal">{c.title}</h3>
              <p className="mt-3 leading-relaxed text-charcoal/70">{c.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const FEATURES = [
  {
    icon: "🎯",
    title: "Advanced Matching Filters",
    text: "Search by region, country, city, caste, sub-caste, sect, profession, and qualification. Every filter is designed to help you find a truly compatible match, not just a nearby one.",
    badge: null,
  },
  {
    icon: "🔒",
    title: "Privacy First",
    text: "Contact details are only visible to verified members. Your real name is never shown publicly, and your photos stay hidden from unverified visitors.",
    badge: null,
  },
  {
    icon: "💬",
    title: "WhatsApp Integration",
    text: `Stay connected via WhatsApp (${WHATSAPP_NUMBER}). Our team shares verified profile details and answers your questions directly on WhatsApp.`,
    badge: null,
  },
  {
    icon: "👨‍👧",
    title: "Wali/Guardian Support",
    text: "Include a guardian in your search journey. Father and mother contact details are part of every profile, keeping the process transparent and family-centred.",
    badge: null,
  },
  {
    icon: "🤖",
    title: "AI-Powered Matching",
    text: "Smart profile suggestions based on your preferences. The more you tell us about your ideal partner, the better our recommendations become.",
    badge: "Coming Soon",
  },
  {
    icon: "💳",
    title: "Multi-Currency Payments",
    text: "Pay in PKR, GBP, EUR, or USD. Local bank accounts in Pakistan, the UK, Germany, and the USA make verification simple wherever you live.",
    badge: null,
  },
];

function Features() {
  return (
    <section id="about" className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <h2 className="gsap-fade-up text-center text-3xl font-bold text-charcoal sm:text-4xl">
          Built for a Serious Search
        </h2>
        <p className="gsap-fade-up mx-auto mt-3 max-w-2xl text-center text-charcoal/60">
          Every feature exists for one purpose: helping you reach Nikah the
          halal way
        </p>
        <div className="mt-16 space-y-16">
          {FEATURES.map((f, i) => (
            <div
              key={f.title}
              className={`flex flex-col items-center gap-10 lg:flex-row ${
                i % 2 === 1 ? "lg:flex-row-reverse" : ""
              }`}
            >
              <div
                className={`${i % 2 === 1 ? "gsap-slide-right" : "gsap-slide-left"} flex h-52 w-full max-w-md items-center justify-center rounded-3xl bg-gradient-to-br from-off-white to-coral/10 text-7xl lg:h-64`}
                data-speed={i % 2 === 1 ? "1.06" : "0.94"}
              >
                {f.icon}
              </div>
              <div
                className={`${i % 2 === 1 ? "gsap-slide-left" : "gsap-slide-right"} max-w-xl text-center lg:text-left`}
              >
                <div className="flex items-center justify-center gap-3 lg:justify-start">
                  <h3 className="text-2xl font-bold text-charcoal">{f.title}</h3>
                  {f.badge && (
                    <span className="rounded-full bg-coral px-3 py-1 text-xs font-bold text-white">
                      {f.badge}
                    </span>
                  )}
                </div>
                <p className="mt-4 leading-relaxed text-charcoal/70">{f.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const TESTIMONIALS = [
  {
    quote:
      "We matched within two months. The verification process made both families feel safe, and the team was there at every step. May Allah bless this platform.",
    name: "Fatima & Ahmed",
    initials: "FA",
  },
  {
    quote:
      "As a father, I appreciated being part of my daughter's search. The guardian support and transparent profiles are exactly what our community needed.",
    name: "Muhammad S.",
    initials: "MS",
  },
  {
    quote:
      "I had tried other apps but they never felt right. PureLifePartner felt respectful from day one. Alhamdulillah, we had our Nikah last spring.",
    name: "Zainab & Omar",
    initials: "ZO",
  },
];

function Stars() {
  return (
    <div className="flex gap-1 text-coral">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
          <path d="M10 1.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L10 14.9l-5.2 2.7 1-5.8L1.5 7.7l5.9-.9L10 1.5z" />
        </svg>
      ))}
    </div>
  );
}

function Testimonials() {
  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <h2 className="gsap-fade-up text-center text-3xl font-bold text-charcoal sm:text-4xl">
          Alhamdulillah They Found Each Other
        </h2>
        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <div
              key={t.name}
              className="gsap-fade-up flex flex-col rounded-2xl bg-off-white p-8"
            >
              <Stars />
              <p className="mt-4 flex-1 leading-relaxed text-charcoal/80">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="mt-6 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-coral font-bold text-white">
                  {t.initials}
                </div>
                <span className="font-bold text-charcoal">{t.name}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link href="/success-stories">
            <Button variant="outline">Read More Stories</Button>
          </Link>
        </div>
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
    <section id="pricing" className="bg-coral py-16">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-4 text-center text-white sm:px-6 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="gsap-zoom">
            <div className="text-4xl font-extrabold sm:text-5xl">{s.value}</div>
            <div className="mt-2 text-sm font-semibold uppercase tracking-wider text-white/85">
              {s.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function DownloadCTA() {
  return (
    <section className="wash bg-off-white py-20">
      <div className="gsap-fade-up mx-auto max-w-3xl px-4 text-center sm:px-6">
        <h2 className="text-3xl font-bold text-charcoal sm:text-4xl">
          Ready to Begin Your Journey?
        </h2>
        <p className="mt-4 text-lg text-charcoal/60">
          Join thousands of Muslims finding their perfect match on
          PureLifePartner
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
