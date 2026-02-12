// app/layout.tsx
import "./globals.css";
import { lato, playfair, pacifico } from "./fonts";
import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import TrackingEvents from "@/components/TrackingEvents";

/** -------------------------------------------------------------
 *  Viewport meta (no change)
 * ------------------------------------------------------------- */
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#7D9A7E",
  colorScheme: "light",
};

/** -------------------------------------------------------------
 *  ✅ metadataBase now belongs inside metadata
 * ------------------------------------------------------------- */
export const metadata: Metadata = {
  metadataBase: new URL("https://www.fannysamaniego.com"),
  title: {
    default: "Fanny Samaniego",
    template: "%s • Fanny Samaniego",
  },
  description:
    "Human-centered financial coaching & mortgage solutions in Toronto. Bilingual (EN/ES).",
  manifest: "/site.webmanifest",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-32x32.png", type: "image/png", sizes: "32x32" },
      {
        url: "/android-chrome-192x192.png",
        type: "image/png",
        sizes: "192x192",
      },
    ],
    shortcut: ["/favicon.ico"],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
};

/** -------------------------------------------------------------
 *  Root layout
 * ------------------------------------------------------------- */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="no-js" suppressHydrationWarning>
      <head>
        {/* Flip no-js -> js before hydration so CSS can key off it */}
        <Script id="set-js-flag" strategy="beforeInteractive">
          {`document.documentElement.classList.remove('no-js');document.documentElement.classList.add('js');`}
        </Script>

        {/* No-JS fallback: never hide content */}
        <noscript>
          <style>{`.fade-in{animation:none!important}`}</style>
        </noscript>
      </head>

      <body
        className={[
          lato.variable,
          playfair.variable,
          pacifico.variable,
          "font-sans bg-brand-beige text-brand-body min-h-dvh antialiased flex flex-col",
        ].join(" ")}
      >
        {children}
        <TrackingEvents />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
