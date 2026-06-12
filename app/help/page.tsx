import type { Metadata } from "next";
import {
  CONTACT_EMAIL,
  GMAIL_COMPOSE_LINK,
  WHATSAPP_LINK,
  WHATSAPP_NUMBER,
} from "@/lib/utils";

export const metadata: Metadata = {
  title: "Help & Support | PureLifePartner",
};

const FAQS = [
  {
    q: "How do I get verified?",
    a: "Go to the Payments page from your profile menu, choose your currency (PKR, GBP, EUR, or USD), transfer the fee to the listed bank account, and submit your transaction reference. An admin confirms it, usually within 24 hours, and your status changes to Verified.",
  },
  {
    q: "Why can't I see someone's contact details?",
    a: "Contact numbers are only released when both you and the other member are Verified. If you are not verified yet, the button guides you to the payment page. If the other member is not verified, our agent is notified and will follow up with you on WhatsApp.",
  },
  {
    q: "Who can see my photos and video?",
    a: "By default everyone can see them. You can restrict both to verified members only from Privacy Settings in your profile menu. Your real name and phone numbers are never shown publicly regardless of these settings.",
  },
  {
    q: "How do I edit my profile?",
    a: "Open the profile menu (your photo, top right), choose My Profile, then Edit Profile. You can update any registration step and your changes save as you go.",
  },
  {
    q: "How do I change my email or password?",
    a: "Open Account Settings from your profile menu. Email changes require confirmation links sent to both your old and new address.",
  },
  {
    q: "How do I withdraw my profile?",
    a: "Message us on WhatsApp and we will set your status to Withdrawn by Client, which removes you from search. You can also request full deletion of your data.",
  },
];

export default function HelpPage() {
  return (
    <div className="bg-off-white py-16">
      <div className="mx-auto max-w-3xl px-4">
        <h1 className="text-4xl font-extrabold text-charcoal">
          Help &amp; Support
        </h1>
        <p className="mt-3 text-charcoal/60">
          Answers to common questions, and two ways to reach a real person.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <a
            href={WHATSAPP_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 rounded-2xl bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
          >
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#25D366] text-2xl text-white">
              💬
            </span>
            <span>
              <span className="block font-bold text-charcoal">WhatsApp</span>
              <span className="block text-sm text-charcoal/60">
                {WHATSAPP_NUMBER}
              </span>
            </span>
          </a>
          <a
            href={GMAIL_COMPOSE_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 rounded-2xl bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
          >
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-coral text-2xl text-white">
              ✉️
            </span>
            <span>
              <span className="block font-bold text-charcoal">Email</span>
              <span className="block text-sm text-charcoal/60">
                {CONTACT_EMAIL}
              </span>
            </span>
          </a>
        </div>

        <h2 className="mt-12 text-2xl font-bold text-charcoal">
          Frequently Asked Questions
        </h2>
        <div className="mt-6 space-y-3">
          {FAQS.map((f) => (
            <details
              key={f.q}
              className="group rounded-2xl bg-white p-5 shadow-sm"
            >
              <summary className="cursor-pointer list-none font-bold text-charcoal">
                <span className="mr-2 inline-block text-coral transition-transform group-open:rotate-90">
                  ▸
                </span>
                {f.q}
              </summary>
              <p className="mt-3 pl-6 text-sm leading-relaxed text-charcoal/70">
                {f.a}
              </p>
            </details>
          ))}
        </div>
      </div>
    </div>
  );
}
