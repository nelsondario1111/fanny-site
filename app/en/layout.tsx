// app/en/layout.tsx
import * as React from "react";
import type { Metadata } from "next";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";

// Optional: locale metadata (you also have app/en/metadata.ts; keep whichever you prefer)
export const metadata: Metadata = {
  title: {
    default: "Fanny Samaniego — English",
    template: "%s • Fanny Samaniego",
  },
  description:
    "Human-centered financial coaching & mortgage solutions (EN).",
};

export default function EnLayout({ children }: { children: React.ReactNode }) {
  // ❗ Do NOT render <html> or <body> here — only in app/layout.tsx
  return (
    <>
      <NavBar />
      <main>{children}</main>
      <Footer />
    </>
  );
}
