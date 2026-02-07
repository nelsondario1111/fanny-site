import type { Metadata } from "next";
import type { ReactNode } from "react";
import { buildMetadata } from "@/app/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Términos",
  description: "Términos y condiciones de uso del sitio y servicios de Fanny Samaniego.",
  path: "/es/terminos",
  locale: "es",
});

export default function TerminosLayout({ children }: { children: ReactNode }) {
  return children;
}
