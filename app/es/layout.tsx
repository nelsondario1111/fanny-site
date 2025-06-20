import NavBar from "../../components/NavBar";
import Footer from "../../components/Footer";
import BackToTopButton from "../../components/BackToTopButton";
import "../globals.css";
import { lato, playfair, pacifico } from "../fonts";

// Metadata and viewport should live in metadata.ts, not here.

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className="scroll-smooth">
      <body
        className={[
          lato.variable,
          playfair.variable,
          pacifico.variable,
          "font-sans bg-brand-beige text-brand-body min-h-screen flex flex-col antialiased",
        ].join(" ")}
      >
        {/* Barra de navegación principal */}
        <NavBar lang="es" />

        {/* Contenido principal */}
        <main className="flex-1 pt-16">{children}</main>

        {/* Pie de página */}
        <Footer lang="es" />

        {/* Botón para volver arriba */}
        <BackToTopButton />
      </body>
    </html>
  );
}
