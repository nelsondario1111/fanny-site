import type { Metadata } from "next";
import type { ReactNode } from "react";
import { buildMetadata } from "@/app/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Servicios",
  description:
    "Explora servicios de hipotecas, impuestos y coaching financiero para familias, profesionales y emprendedores en Toronto y Ontario.",
  path: "/es/servicios",
  locale: "es",
});

export default function ServiciosLayout({ children }: { children: ReactNode }) {
  return children;
}
