import Link from "next/link";
import { Button } from "@/components/ui/button";

const STORIES = [
  {
    couple: "Fatima & Ahmed",
    location: "London, UK",
    year: "2025",
    story:
      "We matched within two months. The verification process made both families feel safe, and the team was there at every step. May Allah bless this platform.",
  },
  {
    couple: "Zainab & Omar",
    location: "Lahore, Pakistan",
    year: "2025",
    story:
      "I had tried other apps but they never felt right. PureLifePartner felt respectful from day one. Alhamdulillah, we had our Nikah last spring.",
  },
  {
    couple: "Maryam & Bilal",
    location: "Toronto, Canada",
    year: "2024",
    story:
      "Living abroad made finding someone with the same values difficult. The region and sect filters helped us find each other across continents.",
  },
  {
    couple: "Khadija & Yusuf",
    location: "Berlin, Germany",
    year: "2024",
    story:
      "Our fathers spoke first, exactly how we both wanted it. The guardian support feature made the whole journey feel honourable and transparent.",
  },
  {
    couple: "Aisha & Hamza",
    location: "Karachi, Pakistan",
    year: "2025",
    story:
      "From the first WhatsApp message to the Nikah ceremony took only five months. JazakAllah khair to the whole PureLifePartner team.",
  },
  {
    couple: "Sumaya & Ibrahim",
    location: "New York, USA",
    year: "2024",
    story:
      "The verified profiles gave us confidence that everyone was serious. No games, no time wasting, just genuine people looking for marriage.",
  },
];

export default function SuccessStories() {
  return (
    <div className="bg-off-white">
      {/* Header with the two illustrations */}
      <section className="py-14 sm:py-20">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <div className="flex items-end justify-center gap-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/illustrations/sister-waving.svg" alt="" className="w-32 sm:w-40" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/illustrations/brother-greeting.svg" alt="" className="w-32 sm:w-40" />
          </div>
          <h1 className="mt-8 text-4xl font-extrabold text-charcoal sm:text-6xl">
            Alhamdulillah, they found each other
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-lg text-charcoal/60">
            Couples who began their journey to nikah here.
          </p>
        </div>
      </section>

      {/* Stories as an editorial list: who on the left, their words on the right */}
      <section className="bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <ol className="border-b border-charcoal/15">
          {STORIES.map((s) => (
            <li
              key={s.couple}
              className="grid gap-4 border-t border-charcoal/15 py-10 sm:py-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] lg:gap-12"
            >
              <div>
                <p className="text-xl font-bold text-charcoal">{s.couple}</p>
                <p className="mt-1 text-sm text-charcoal/55">
                  {s.location} · Married {s.year}
                </p>
              </div>
              <blockquote className="text-2xl font-bold leading-snug text-charcoal sm:text-3xl">
                <span className="text-coral">&ldquo;</span>
                {s.story}
                <span className="text-coral">&rdquo;</span>
              </blockquote>
            </li>
          ))}
        </ol>
        </div>
      </section>

      {/* Closing call to action with the parents illustration */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto grid max-w-5xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/illustrations/parents-phone.svg"
            alt=""
            className="mx-auto w-full max-w-[420px]"
          />
          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-extrabold text-charcoal sm:text-5xl">
              Your story could be next
            </h2>
            <Link href="/register" className="mt-8 inline-block">
              <Button size="lg">Create Free Profile</Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
