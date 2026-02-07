import type { Metadata } from "next";
import type { ReactNode } from "react";
import { buildMetadata } from "@/app/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Sobre Mí",
  description:
    "Conoce a Fanny Samaniego y su enfoque humano para hipotecas, dinero e impuestos.",
  path: "/es/sobre-mi",
  locale: "es",
});

export default function SobreMiLayout({ children }: { children: ReactNode }) {
  return children;
}
