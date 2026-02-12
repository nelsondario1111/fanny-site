import type { Metadata } from "next";
import type { ReactNode } from "react";
import { buildMetadata } from "@/app/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Services",
  description:
    "Explore mortgage, tax, and financial coaching services for families, professionals, and entrepreneurs in Toronto and across Ontario.",
  path: "/en/services",
  locale: "en",
});

export default function ServicesLayout({ children }: { children: ReactNode }) {
  return children;
}
