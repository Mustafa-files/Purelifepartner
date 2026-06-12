import Link from "next/link";
import { Button } from "@/components/ui/button";

const STORIES = [
  {
    couple: "Fatima & Ahmed",
    location: "London, UK",
    year: "2025",
    story:
      "We matched within two months. The verification process made both families feel safe, and the team was there at every step. May Allah bless this platform.",
    initials: "FA",
  },
  {
    couple: "Zainab & Omar",
    location: "Lahore, Pakistan",
    year: "2025",
    story:
      "I had tried other apps but they never felt right. PureLifePartner felt respectful from day one. Alhamdulillah, we had our Nikah last spring.",
    initials: "ZO",
  },
  {
    couple: "Maryam & Bilal",
    location: "Toronto, Canada",
    year: "2024",
    story:
      "Living abroad made finding someone with the same values difficult. The region and sect filters helped us find each other across continents.",
    initials: "MB",
  },
  {
    couple: "Khadija & Yusuf",
    location: "Berlin, Germany",
    year: "2024",
    story:
      "Our fathers spoke first, exactly how we both wanted it. The guardian support feature made the whole journey feel honourable and transparent.",
    initials: "KY",
  },
  {
    couple: "Aisha & Hamza",
    location: "Karachi, Pakistan",
    year: "2025",
    story:
      "From the first WhatsApp message to the Nikah ceremony took only five months. JazakAllah khair to the whole PureLifePartner team.",
    initials: "AH",
  },
  {
    couple: "Sumaya & Ibrahim",
    location: "New York, USA",
    year: "2024",
    story:
      "The verified profiles gave us confidence that everyone was serious. No games, no time wasting, just genuine people looking for marriage.",
    initials: "SI",
  },
];

export default function SuccessStories() {
  return (
    <div className="bg-off-white py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <h1 className="text-center text-4xl font-extrabold text-charcoal">
          Alhamdulillah They Found Each Other
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-center text-charcoal/60">
          Real couples who began their journey to Nikah on PureLifePartner.
          Your story could be next.
        </p>

        <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {STORIES.map((s) => (
            <div
              key={s.couple}
              className="flex flex-col rounded-2xl bg-white p-8 shadow-sm"
            >
              <div className="flex gap-1 text-coral">
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg
                    key={i}
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="h-5 w-5"
                  >
                    <path d="M10 1.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L10 14.9l-5.2 2.7 1-5.8L1.5 7.7l5.9-.9L10 1.5z" />
                  </svg>
                ))}
              </div>
              <p className="mt-4 flex-1 leading-relaxed text-charcoal/80">
                &ldquo;{s.story}&rdquo;
              </p>
              <div className="mt-6 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-coral font-bold text-white">
                  {s.initials}
                </div>
                <div>
                  <div className="font-bold text-charcoal">{s.couple}</div>
                  <div className="text-xs text-charcoal/50">
                    {s.location} · Married {s.year}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-14 text-center">
          <h2 className="text-2xl font-bold text-charcoal">
            Ready to write your own story?
          </h2>
          <Link href="/register" className="mt-6 inline-block">
            <Button size="lg">Create Free Profile</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
