// app/es/layout.tsx
import * as React from "react";
import type { Metadata } from "next";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import BackToTopButton from "@/components/BackToTopButton";

export const metadata: Metadata = {
  title: "Fanny Samaniego — Coaching & Soluciones Hipotecarias",
  description:
    "Coaching financiero con enfoque humano y soluciones hipotecarias en Toronto.",
};

export default function EsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <NavBar />
      <main id="main" className="flex-1">
        {children}
      </main>
      <Footer lang="es" />
      <BackToTopButton />
    </>
  );
}
