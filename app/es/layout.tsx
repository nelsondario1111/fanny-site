import NavBar from "../../components/NavBar";
import Footer from "../../components/Footer";
import BackToTopButton from "../../components/BackToTopButton";
import "../globals.css";
import { lato, playfair, pacifico } from "../fonts";

export const metadata = {
  title: "Fanny Samaniego Coaching",
  description: "Coaching financiero holístico y soluciones hipotecarias en Toronto, inglés y español.",
};

// ✅ Add viewport export for themeColor and mobile support
export const viewport = {
  themeColor: "#ffffff", // Adjust if you want another brand color
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body
        className={`
          ${lato.variable} ${playfair.variable} ${pacifico.variable}
          font-sans bg-brand-beige text-brand-body min-h-screen flex flex-col
        `}
      >
        <NavBar lang="es" />
        <main className="flex-1 pt-16">{children}</main>
        <Footer lang="es" />
        <BackToTopButton />
      </body>
    </html>
  );
}
