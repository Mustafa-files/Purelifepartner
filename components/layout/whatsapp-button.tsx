import { WHATSAPP_LINK } from "@/lib/utils";

export function WhatsAppButton() {
  return (
    <a
      href={WHATSAPP_LINK}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="fixed bottom-5 right-5 z-[90] block h-14 w-14 rounded-full shadow-lg transition-transform hover:scale-110"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/whatsapp-icon.png"
        alt=""
        className="h-full w-full rounded-full"
      />
    </a>
  );
}
