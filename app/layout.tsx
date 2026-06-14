import type { Metadata } from "next";
import { Bricolage_Grotesque, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { WhatsAppButton } from "@/components/layout/whatsapp-button";
import { Toaster } from "@/components/ui/toast";
import { SmoothScroll } from "@/components/ui/smooth-scroll";
import { CookieConsent } from "@/components/layout/cookie-consent";

// Only the weights actually used; every extra weight is another font file
// phones must download before text settles
const displayFont = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["700", "800"],
  variable: "--font-display",
});

const sansFont = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  variable: "--font-sans-app",
});

export const metadata: Metadata = {
  title: "PureLifePartner | Where Pure Hearts Find Their Match",
  description:
    "A halal, respectful, and modern platform for Muslims seeking a life partner. Verified members, advanced matching, and guardian support.",
  // Served from public/ instead of an app/icon.png metadata route, which
  // would generate a non-edge function that Cloudflare Pages rejects.
  icons: { icon: "/icon.png" },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${displayFont.variable} ${sansFont.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* Warm up the Supabase connection before the first data query */}
        <link
          rel="preconnect"
          href="https://iucizzrqvpsuotatmvrc.supabase.co"
          crossOrigin="anonymous"
        />
        {/* Apply the saved theme before first paint to avoid a flash */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.getItem('plp-theme');if(t==='dark'||(!t&&window.matchMedia('(prefers-color-scheme: dark)').matches)){document.documentElement.classList.add('dark')}}catch(e){}`,
          }}
        />
      </head>
      <body className="antialiased">
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
      </body>
    </html>
  );
}
