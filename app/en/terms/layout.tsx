import type { Metadata } from "next";
import type { ReactNode } from "react";
import { buildMetadata } from "@/app/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Terms",
  description: "Terms and conditions for using Fanny Samaniego's website and services.",
  path: "/en/terms",
  locale: "en",
});

export default function TermsLayout({ children }: { children: ReactNode }) {
  return children;
}
