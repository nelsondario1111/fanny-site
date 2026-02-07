import type { Metadata } from "next";
import type { ReactNode } from "react";
import { buildMetadata } from "@/app/metadata";

export const metadata: Metadata = buildMetadata({
  title: "About",
  description:
    "Meet Fanny Samaniego and learn the human-centered approach to mortgages, money, and tax guidance.",
  path: "/en/about",
  locale: "en",
});

export default function AboutLayout({ children }: { children: ReactNode }) {
  return children;
}
