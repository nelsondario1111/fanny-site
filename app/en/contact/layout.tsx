import type { Metadata } from "next";
import type { ReactNode } from "react";
import { buildMetadata } from "@/app/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Contact",
  description:
    "Contact Fanny Samaniego for mortgage guidance, tax clarity, and practical financial planning support.",
  path: "/en/contact",
  locale: "en",
});

export default function ContactLayout({ children }: { children: ReactNode }) {
  return children;
}
