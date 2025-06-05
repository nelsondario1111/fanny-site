import NavBar from "../../components/NavBar";
import Footer from "../../components/Footer";
import BackToTopButton from "../../components/BackToTopButton";
import "../globals.css";
import { lato, playfair, pacifico } from "../fonts";

export const metadata = {
  title: "Fanny Samaniego Coaching",
  description: "Coaching financiero holístico y soluciones hipotecarias en Toronto, en inglés y español.",
};

export default function EsLayout({ children }: { children: React.ReactNode }) {
  const lang = "es";
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
