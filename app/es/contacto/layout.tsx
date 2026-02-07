import type { Metadata } from "next";
import type { ReactNode } from "react";
import { buildMetadata } from "@/app/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Contacto",
  description:
    "Contacta a Fanny Samaniego para recibir orientación en hipotecas, impuestos y planificación financiera.",
  path: "/es/contacto",
  locale: "es",
});

export default function ContactoLayout({ children }: { children: ReactNode }) {
  return children;
}
