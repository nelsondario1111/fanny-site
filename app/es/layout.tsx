// app/es/layout.tsx
import * as React from "react";
import type { Metadata } from "next";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import BackToTopButton from "@/components/BackToTopButton";

export const metadata: Metadata = {
  title: "Fanny Samaniego — Consultora Financiera Holística",
  description:
    "Agente hipotecaria (Nivel 2), ex-auditora de impuestos para la CRA y consultora financiera holística en Toronto. Guía clara en impuestos, hipotecas y estrategia financiera.",
};

export default function EsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <React.Suspense fallback={null}>
        <NavBar />
      </React.Suspense>

      <main id="main" className="flex-1">
        <React.Suspense fallback={null}>{children}</React.Suspense>
      </main>

      <React.Suspense fallback={null}>
        <Footer lang="es" />
      </React.Suspense>

      <BackToTopButton />
    </>
  );
}
