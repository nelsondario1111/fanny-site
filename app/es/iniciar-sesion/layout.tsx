import type { Metadata } from "next";
import type { ReactNode } from "react";
import { buildMetadata } from "@/app/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Iniciar Sesión",
  description: "Área privada de acceso.",
  path: "/es/iniciar-sesion",
  locale: "es",
  noIndex: true,
});

export default function LoginEsLayout({ children }: { children: ReactNode }) {
  return children;
}
