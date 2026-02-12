// app/en/layout.tsx
import * as React from "react";
import type { Metadata } from "next";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import BackToTopButton from "@/components/BackToTopButton";

export const metadata: Metadata = {
  title: {
    default: "Fanny Samaniego — Holistic Financial Consultant",
    template: "%s • Fanny Samaniego",
  },
  description:
    "Mortgage Agent (Level 2), former CRA Income Tax Auditor, and holistic financial consultant in Toronto. Clear guidance for taxes, mortgages, and money strategy. Bilingual (EN/ES).",
};

export default function EnLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <React.Suspense fallback={null}>
        <NavBar />
      </React.Suspense>

      <main id="main" className="flex-1">
        <React.Suspense fallback={null}>{children}</React.Suspense>
      </main>

      <React.Suspense fallback={null}>
        <Footer lang="en" />
      </React.Suspense>

      <BackToTopButton />
    </>
  );
}
