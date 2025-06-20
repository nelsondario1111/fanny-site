import NavBar from "../../components/NavBar";
import Footer from "../../components/Footer";
import BackToTopButton from "../../components/BackToTopButton";
import "../globals.css";
import { lato, playfair, pacifico } from "../fonts";

// Metadata (title, description, viewport) should live in metadata.ts, not here.

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={[
          lato.variable,
          playfair.variable,
          pacifico.variable,
          "font-sans bg-brand-beige text-brand-body min-h-screen flex flex-col antialiased",
        ].join(" ")}
      >
        {/* Sticky Top Navigation */}
        <NavBar lang="en" />

        {/* Main Content Area */}
        <main className="flex-1 pt-16 sm:pt-16">{children}</main>

        {/* Footer */}
        <Footer lang="en" />

        {/* Back to Top Button */}
        <BackToTopButton />
      </body>
    </html>
  );
}
