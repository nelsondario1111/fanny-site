import type { Metadata } from "next";
import ClientLibraryStarter from "@/components/ClientLibraryStarter";
import { buildMetadata } from "@/app/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Biblioteca de Clientes",
  description:
    "Biblioteca de clientes con checklists, tiempos esperados, guia de documentos y enlaces de intake para clientes de Toronto y Ontario.",
  path: "/es/biblioteca-clientes",
  locale: "es",
});

export default function BibliotecaClientesPage() {
  return <ClientLibraryStarter lang="es" />;
}
