import NavBar from "../../components/NavBar";
import Footer from "../../components/Footer";
import BackToTopButton from "../../components/BackToTopButton";
import "../globals.css";
import { lato, playfair, pacifico } from "../fonts";

export const metadata = {
  title: "Fanny Samaniego Coaching",
  description: "Coaching financiero holístico y soluciones hipotecarias en Toronto, inglés y español.",
};

export const viewport = {
  themeColor: "#F5F2EA", // Cambiado a tu beige de marca; vuelve a #ffffff si prefieres blanco puro.
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className="scroll-smooth">
      <body
        className={`
          ${lato.variable} ${playfair.variable} ${pacifico.variable}
          font-sans bg-brand-beige text-brand-body min-h-screen flex flex-col antialiased
        `}
      >
        {/* Barra de navegación principal */}
        <NavBar lang="es" />

        {/* Contenido principal con espacio para navbar sticky */}
        <main className="flex-1 pt-16">{children}</main>

        {/* Pie de página */}
        <Footer lang="es" />

        {/* Botón para volver arriba */}
        <BackToTopButton />
      </body>
    </html>
  );
}
