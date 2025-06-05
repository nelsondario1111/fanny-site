import NavBar from "../../components/NavBar";
import Footer from "../../components/Footer";
import BackToTopButton from "../../components/BackToTopButton";
import "../globals.css";
import { lato, playfair, pacifico } from "../fonts";

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
