import type { Metadata } from "next";
import type { ReactNode } from "react";
import { buildMetadata } from "@/app/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Sobre Mí",
  description:
    "Conoce a Fanny Samaniego, agente hipotecaria (Nivel 2) y ex-auditora de la CRA, y su enfoque humano para hipotecas, dinero e impuestos.",
  path: "/es/sobre-mi",
  locale: "es",
});

export default function SobreMiLayout({ children }: { children: ReactNode }) {
  return children;
}
