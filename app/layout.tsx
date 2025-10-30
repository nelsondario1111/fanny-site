// app/layout.tsx
import "./globals.css";
import { lato, playfair, pacifico } from "./fonts";
import type { Metadata, Viewport } from "next";
import Script from "next/script";

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
 *  ✅ Add this line to fix metadataBase warning
 * ------------------------------------------------------------- */
export const metadataBase = new URL("https://www.fannysamaniego.com");

/** -------------------------------------------------------------
 *  Root metadata (title, description, favicon, etc.)
 * ------------------------------------------------------------- */
export const metadata: Metadata = {
  title: {
    default: "Fanny Samaniego",
    template: "%s • Fanny Samaniego",
  },
  description:
    "Human-centered financial coaching & mortgage solutions in Toronto. Bilingual (EN/ES).",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
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
        {/* Header/Footer are rendered by locale layouts at app/(en) and app/(es).
            Keeping root neutral avoids duplicate headers/footers and hydration issues. */}
        {children}
      </body>
    </html>
  );
}
