import type { Metadata } from "next";
import { Quicksand } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { WhatsAppButton } from "@/components/layout/whatsapp-button";
import { Toaster } from "@/components/ui/toast";
import { SmoothScroll } from "@/components/ui/smooth-scroll";
import { CookieConsent } from "@/components/layout/cookie-consent";
import { PageTransition } from "@/components/ui/page-transition";
import { JsonLd } from "@/components/seo/json-ld";
import {
  DEFAULT_DESCRIPTION,
  DEFAULT_TITLE,
  SITE_KEYWORDS,
  SITE_NAME,
  SITE_URL,
} from "@/lib/seo";
import { CONTACT_EMAIL, WHATSAPP_NUMBER } from "@/lib/utils";

// Quicksand for headings and body. Only the weights actually used; every
// extra weight is another font file phones must download.
// Quicksand tops out at 700, so extra-bold body text renders at bold
const sansFont = Quicksand({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans-app",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: DEFAULT_TITLE,
  description: DEFAULT_DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: SITE_KEYWORDS,
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    url: "/",
    images: [{ url: "/plp-logo-circle.png", width: 560, height: 560, alt: SITE_NAME }],
  },
  twitter: {
    card: "summary",
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    images: ["/plp-logo-circle.png"],
  },
  // Served from public/ instead of an app/icon.png metadata route, which
  // would generate a non-edge function that Cloudflare Pages rejects.
  icons: { icon: "/icon.png" },
};

/** Tells Google and AI assistants who we are, in a form they can quote. */
const SITE_JSON_LD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: SITE_NAME,
      url: SITE_URL,
      logo: `${SITE_URL}/plp-logo-circle.png`,
      description: DEFAULT_DESCRIPTION,
      areaServed: "Worldwide",
      knowsAbout: ["Muslim marriage", "Islamic matrimony", "Nikah"],
      email: CONTACT_EMAIL,
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "customer support",
        telephone: WHATSAPP_NUMBER,
        email: CONTACT_EMAIL,
        availableLanguage: ["English"],
      },
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      name: SITE_NAME,
      url: SITE_URL,
      description: DEFAULT_DESCRIPTION,
      inLanguage: "en",
      publisher: { "@id": `${SITE_URL}/#organization` },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={sansFont.variable}
      suppressHydrationWarning
    >
      <head>
        {/* Warm up the Supabase connection before the first data query */}
        <link
          rel="preconnect"
          href="https://iucizzrqvpsuotatmvrc.supabase.co"
          crossOrigin="anonymous"
        />
        {/* Styled dropdown lists; kept out of the CSS build (see the file) */}
        {/* eslint-disable-next-line @next/next/no-css-tags */}
        <link rel="stylesheet" href="/dropdowns.css" />
        {/* Apply the saved theme before first paint to avoid a flash */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.getItem('plp-theme');if(t==='dark'||(!t&&window.matchMedia('(prefers-color-scheme: dark)').matches)){document.documentElement.classList.add('dark')}}catch(e){}`,
          }}
        />
      </head>
      <body className="antialiased">
        <JsonLd data={SITE_JSON_LD} />
        <Navbar />
        <SmoothScroll>
          <div className="flex min-h-screen flex-col">
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </SmoothScroll>
        <WhatsAppButton />
        <Toaster />
        <CookieConsent />
        <PageTransition />
      </body>
    </html>
  );
}
