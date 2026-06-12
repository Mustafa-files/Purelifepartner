import type { Metadata } from "next";
import { WHATSAPP_NUMBER } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Privacy Policy | PureLifePartner",
};

const SECTIONS: { title: string; body: string[] }[] = [
  {
    title: "1. Who We Are",
    body: [
      "PureLifePartner is a halal matrimonial platform for Muslims seeking a life partner. This policy explains what personal data we collect, why we collect it, and how we protect it.",
    ],
  },
  {
    title: "2. Data We Collect",
    body: [
      "Account data: email address, password (stored in encrypted form), WhatsApp number, gender, and date of birth.",
      "Profile data: marital status, height, weight, education, profession, religion, sect, caste, residence, family details, partner preferences, and the description you write about yourself.",
      "Contact data: your phone number and the phone numbers of your father and mother, provided for the matchmaking process.",
      "Media: profile photos and an optional video introduction.",
      "Verification documents: a scan of your national identity card, passport, or driving licence, used only to verify your name and date of birth.",
      "Payment data: amount, currency, and bank transfer reference. We do not store card numbers.",
      "Communication logs: WhatsApp messages sent to you by our team, recorded with timestamps for quality and dispute resolution.",
    ],
  },
  {
    title: "3. How We Use Your Data",
    body: [
      "To operate your matrimonial profile and show it to other users searching for a match.",
      "To verify your identity and your payment, which unlocks the exchange of contact details.",
      "To facilitate introductions: when both parties are verified, we may share contact numbers between them, including via WhatsApp.",
      "To respond to your questions and provide support.",
    ],
  },
  {
    title: "4. What Is Public and What Is Private",
    body: [
      "Public (visible to all visitors): your User ID, age, gender, marital status, height, education, profession, religion, sect, caste, location, your written description, your profile photo, and your video introduction.",
      "Never public: your real name, email address, date of birth, weight, family contact numbers, your own contact numbers, income details, verification documents, and payment records.",
      "Contact numbers are released only to verified members through our controlled process, and every release is logged.",
    ],
  },
  {
    title: "5. Verification Documents",
    body: [
      "Identity documents are uploaded to private storage that only you and our authorised staff can access. They are used solely to confirm your name and date of birth and are deleted after verification is complete. They are never shown to other members.",
    ],
  },
  {
    title: "6. Data Sharing",
    body: [
      "We do not sell your personal data to anyone.",
      "Data is shared only with: other members (public profile fields only), our verification agents (to process your registration), and our infrastructure provider Supabase (which hosts our database and storage under industry-standard security).",
      "We may disclose data where required by law.",
    ],
  },
  {
    title: "7. Data Retention",
    body: [
      "Your profile data is retained while your account is active. If you withdraw, your profile is removed from search and your status is recorded as Withdrawn by Client.",
      "You may request full deletion of your account and data at any time by contacting us; we will remove your data except where we are legally required to keep payment records.",
    ],
  },
  {
    title: "8. Security",
    body: [
      "All traffic is encrypted with HTTPS. Database access is protected by row-level security so that each user, agent, and administrator can only access the data their role permits.",
      "Despite our safeguards, no online service is completely secure. Use a strong password and never share your login details.",
    ],
  },
  {
    title: "9. Your Rights",
    body: [
      "You may access, correct, or delete your personal data, withdraw consent, and request a copy of the data we hold about you. Contact us using the details below and we will respond promptly.",
    ],
  },
  {
    title: "10. Contact",
    body: [
      `For any privacy question or request, reach us on WhatsApp at ${WHATSAPP_NUMBER} or by email at Youasktv@gmail.com.`,
    ],
  },
];

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-off-white py-16">
      <div className="mx-auto max-w-3xl px-4">
        <h1 className="text-4xl font-extrabold text-charcoal">
          Privacy Policy
        </h1>
        <p className="mt-3 text-sm text-charcoal/50">
          Last updated: 11 June 2026
        </p>
        <div className="mt-10 space-y-8 rounded-2xl bg-white p-8 shadow-sm sm:p-10">
          {SECTIONS.map((s) => (
            <section key={s.title}>
              <h2 className="text-lg font-bold text-charcoal">{s.title}</h2>
              {s.body.map((p, i) => (
                <p key={i} className="mt-2 leading-relaxed text-charcoal/75">
                  {p}
                </p>
              ))}
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
