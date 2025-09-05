// app/en/layout.tsx
import * as React from "react";
import type { Metadata } from "next";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import BackToTopButton from "@/components/BackToTopButton";

export const metadata: Metadata = {
  title: {
    default: "Fanny Samaniego — Coaching & Mortgage Solutions",
    template: "%s • Fanny Samaniego",
  },
  description:
    "Human-centered financial coaching & mortgage solutions in Toronto. Bilingual (EN/ES).",
};

export default function EnLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* Unified, locale-aware header */}
      <NavBar />

      <main id="main" className="flex-1">
        {children}
      </main>

      {/* Unified, locale-aware footer */}
      <Footer lang="en" />
      <BackToTopButton />
    </>
  );
}
