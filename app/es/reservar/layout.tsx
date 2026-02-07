import type { Metadata } from "next";
import type { ReactNode } from "react";
import { buildMetadata } from "@/app/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Reservar Consulta",
  description:
    "Agenda una consulta de descubrimiento con Fanny Samaniego para definir tu siguiente paso.",
  path: "/es/reservar",
  locale: "es",
});

export default function ReservarLayout({ children }: { children: ReactNode }) {
  return children;
}
