import NavBar from "../../components/NavBar";
import Footer from "../../components/Footer";
import BackToTopButton from "../../components/BackToTopButton";
import "../globals.css";
import { Lato, Playfair_Display, Pacifico } from "next/font/google";

const lato = Lato({ subsets: ["latin"], weight: ["400", "700"], variable: "--font-lato", display: "swap" });
const playfair = Playfair_Display({ subsets: ["latin"], weight: ["400", "700"], variable: "--font-playfair", display: "swap" });
const pacifico = Pacifico({ subsets: ["latin"], weight: "400", variable: "--font-pacifico", display: "swap" });

export const metadata = {
  title: "Fanny Samaniego Coaching",
  description: "Holistic financial coaching and mortgage solutions in Toronto, English and Spanish.",
};

export default function EnLayout({ children }: { children: React.ReactNode }) {
  const lang = "en";
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
