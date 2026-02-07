import type { Metadata } from "next";
import type { ReactNode } from "react";
import { buildMetadata } from "@/app/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Contact Confirmation",
  description: "Confirmation after submitting the contact form.",
  path: "/en/contact/thanks",
  locale: "en",
  noIndex: true,
});

export default function ContactThanksLayout({
  children,
}: {
  children: ReactNode;
}) {
  return children;
}
