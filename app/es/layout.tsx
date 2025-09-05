// app/es/layout.tsx
import "../globals.css";
import type { Metadata } from "next";
import { lato, playfair, pacifico } from "../fonts";

import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import BackToTopButton from "@/components/BackToTopButton";

export const metadata: Metadata = {
  title: "Fanny Samaniego — Coaching & Soluciones Hipotecarias",
  description:
    "Coaching financiero con enfoque humano y soluciones hipotecarias en Toronto.",
};

export default function LayoutEs({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body
        className={[
          lato.variable,
          playfair.variable,
          pacifico.variable,
          // token-aligned base styles
          "font-sans bg-brand-beige text-brand-body min-h-dvh flex flex-col antialiased",
        ].join(" ")}
      >
        {/* Unified, locale-aware header */}
        <NavBar />

        {/* Sticky header already reserves space; no extra padding needed */}
        <main id="main" className="flex-1">
          {children}
        </main>

        {/* Unified, locale-aware footer */}
        <Footer lang="es" />
        <BackToTopButton />
      </body>
    </html>
  );
}
