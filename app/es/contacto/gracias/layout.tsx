import type { Metadata } from "next";
import type { ReactNode } from "react";
import { buildMetadata } from "@/app/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Confirmación de Contacto",
  description: "Confirmación tras enviar el formulario de contacto.",
  path: "/es/contacto/gracias",
  locale: "es",
  noIndex: true,
});

export default function ContactGraciasLayout({
  children,
}: {
  children: ReactNode;
}) {
  return children;
}
