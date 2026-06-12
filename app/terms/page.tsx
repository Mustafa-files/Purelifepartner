import type { Metadata } from "next";
import { WHATSAPP_NUMBER } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Terms & Conditions | PureLifePartner",
};

const SECTIONS: { title: string; body: string[] }[] = [
  {
    title: "1. Acceptance of Terms",
    body: [
      "By creating an account on PureLifePartner, you agree to these Terms and Conditions and our Privacy Policy. If you do not agree with any part of these terms, please do not use the platform.",
      "PureLifePartner is a matrimonial introduction service intended solely for Muslims who are genuinely seeking marriage (Nikah). It is not a dating platform and must not be used as one.",
    ],
  },
  {
    title: "2. Eligibility",
    body: [
      "You must be between 16 and 35 years of age to register as a candidate. By registering you confirm that the date of birth you provide is accurate.",
      "You must be legally free to marry under the laws of your country of residence. If you are currently married and your circumstances permit a further marriage under applicable law, you must state your marital status truthfully on your profile.",
      "You may register on behalf of a family member only with their full knowledge and consent, for example as a parent or guardian (Wali).",
    ],
  },
  {
    title: "3. Account and Profile Accuracy",
    body: [
      "All information you provide, including your name, age, education, profession, family details, and photos, must be truthful, current, and belong to you.",
      "Your real name is stored for office use only and is never displayed publicly. Your public identity on the platform is your chosen User ID.",
      "We may ask you to verify your identity with a national identity card, passport, or driving licence. Profiles that fail verification may be suspended pending manual review.",
      "You are responsible for keeping your password confidential. Notify us immediately of any unauthorised use of your account.",
    ],
  },
  {
    title: "4. Verification and Payments",
    body: [
      "Contact details of members are only released when both parties hold Verified status. Verification requires a one-time payment in PKR, GBP, EUR, or USD.",
      "Payments are confirmed manually by our team. Once confirmed, your status changes from To Be Verified to Verified.",
      "Verification fees are non-refundable once contact details have been shared with you. If verification cannot be completed for reasons attributable to us, a refund will be issued to the original payment method.",
    ],
  },
  {
    title: "5. Conduct",
    body: [
      "You agree to interact with other members respectfully and within the bounds of Islamic etiquette. Harassment, abusive language, indecent content, or attempts to use the platform for anything other than seeking marriage will result in immediate account termination without refund.",
      "You must not share another member's contact details, photos, or personal information with any third party without their consent.",
      "Creating multiple accounts, impersonating another person, or misrepresenting your marital status, age, or identity is strictly prohibited.",
    ],
  },
  {
    title: "6. Our Role and Limitations",
    body: [
      "PureLifePartner is an introduction service. We verify documents and payments with reasonable care, but we cannot guarantee the accuracy of every statement made by members.",
      "You and your family are responsible for carrying out your own due diligence before progressing any match, including meeting in an appropriate setting with a guardian present.",
      "We are not a party to any agreement, engagement, or marriage between members and accept no liability arising from interactions between members, whether on or off the platform.",
    ],
  },
  {
    title: "7. Content and Media",
    body: [
      "By uploading photos or a video introduction, you grant PureLifePartner permission to display that media on your profile to other visitors of the platform.",
      "You must own the rights to any media you upload. Media depicting anyone other than yourself requires that person's consent.",
      "We may remove any content that we consider inappropriate, misleading, or in breach of these terms.",
    ],
  },
  {
    title: "8. Termination",
    body: [
      "You may withdraw your profile at any time by contacting our team. Your status will be recorded as Withdrawn by Client.",
      "We may suspend or terminate accounts that breach these terms, provide false information, or remain inactive for an extended period.",
    ],
  },
  {
    title: "9. Changes to These Terms",
    body: [
      "We may update these Terms and Conditions from time to time. Continued use of the platform after changes are published constitutes acceptance of the revised terms.",
    ],
  },
  {
    title: "10. Contact",
    body: [
      `Questions about these terms can be sent via WhatsApp to ${WHATSAPP_NUMBER} or by email to Youasktv@gmail.com.`,
    ],
  },
];

export default function TermsPage() {
  return (
    <div className="bg-off-white py-16">
      <div className="mx-auto max-w-3xl px-4">
        <h1 className="text-4xl font-extrabold text-charcoal">
          Terms &amp; Conditions
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
