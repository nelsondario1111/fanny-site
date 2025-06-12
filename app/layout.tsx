import "./globals.css";
import { lato, playfair, pacifico } from "./fonts";

export const metadata = {
  title: "Fanny Samaniego Coaching",
  description: "Holistic financial coaching and mortgage solutions in Toronto, English and Spanish.",
  icons: [
    { rel: "icon", url: "/favicon.ico" },
    { rel: "icon", type: "image/png", sizes: "16x16", url: "/favicon-16x16.png" },
    { rel: "icon", type: "image/png", sizes: "32x32", url: "/favicon-32x32.png" },
    { rel: "apple-touch-icon", sizes: "180x180", url: "/apple-touch-icon.png" },
    { rel: "icon", type: "image/png", sizes: "192x192", url: "/android-chrome-192x192.png" },
    { rel: "icon", type: "image/png", sizes: "512x512", url: "/android-chrome-512x512.png" },
  ],
};

// ✅ themeColor is only in viewport, not in metadata
export const viewport = {
  themeColor: "#F5F2EA",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`
          ${lato.variable} ${playfair.variable} ${pacifico.variable}
          font-sans bg-brand-beige text-brand-body min-h-screen flex flex-col
          overscroll-y-none antialiased
        `}
      >
        {children}
      </body>
    </html>
  );
}
