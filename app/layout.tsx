import "./globals.css";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import BackToTopButton from "../components/BackToTopButton";

// Google Fonts imports...
import { Lato, Playfair_Display, Pacifico } from "next/font/google";

const lato = Lato({ subsets: ["latin"], weight: ["400", "700"], variable: "--font-lato", display: "swap" });
const playfair = Playfair_Display({ subsets: ["latin"], weight: ["400", "700"], variable: "--font-playfair", display: "swap" });
const pacifico = Pacifico({ subsets: ["latin"], weight: "400", variable: "--font-pacifico", display: "swap" });

export const metadata = {
  title: "Fanny Samaniego Coaching",
  description: "Holistic financial coaching and mortgage solutions in Toronto, English and Spanish.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // "use client" is not needed here, but we use browser APIs
  let lang = "en";
  if (typeof window !== "undefined") {
    const path = window.location.pathname;
    if (
      path.startsWith("/inicio") ||
      path.startsWith("/herramientas") ||
      path.startsWith("/recursos") ||
      path.startsWith("/servicios") ||
      path.startsWith("/sobre-mi") ||
      path.startsWith("/testimonios") ||
      path.startsWith("/contacto") ||
      path.startsWith("/calculadora-presupuesto") ||
      path.startsWith("/calculadora-hipotecaria")
    ) {
      lang = "es";
    }
  }

  // Fallback for server-side rendering
  if (typeof window === "undefined") {
    // Default to "en" for static generation; can add advanced detection later.
    lang = "en";
  }

  return (
    <html lang={lang}>
      <body
        className={`
          ${lato.variable} ${playfair.variable} ${pacifico.variable}
          font-sans bg-brand-beige text-brand-body min-h-screen flex flex-col
        `}
      >
        <NavBar lang={lang} />
        <div className="flex-1">{children}</div>
        <Footer lang={lang} />
        <BackToTopButton />
      </body>
    </html>
  );
}
