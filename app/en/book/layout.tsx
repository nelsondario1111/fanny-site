import type { Metadata } from "next";
import type { ReactNode } from "react";
import { buildMetadata } from "@/app/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Book a Consultation",
  description:
    "Book a discovery consultation with Fanny Samaniego to map your best next step.",
  path: "/en/book",
  locale: "en",
});

export default function BookLayout({ children }: { children: ReactNode }) {
  return children;
}
