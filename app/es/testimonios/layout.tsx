import type { Metadata } from "next";
import type { ReactNode } from "react";
import { buildMetadata } from "@/app/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Testimonios",
  description:
    "Historias reales de clientes acompañados con coaching financiero y planificación hipotecaria.",
  path: "/es/testimonios",
  locale: "es",
});

export default function TestimoniosLayout({
  children,
}: {
  children: ReactNode;
}) {
  return children;
}
