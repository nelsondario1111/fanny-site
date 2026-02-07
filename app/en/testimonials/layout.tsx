import type { Metadata } from "next";
import type { ReactNode } from "react";
import { buildMetadata } from "@/app/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Testimonials",
  description:
    "Read client stories and outcomes from holistic financial coaching and mortgage planning work.",
  path: "/en/testimonials",
  locale: "en",
});

export default function TestimonialsLayout({
  children,
}: {
  children: ReactNode;
}) {
  return children;
}
