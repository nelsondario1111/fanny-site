import Link from "next/link";
import type { Metadata } from "next";
import { buildMetadata } from "@/app/metadata";
import PageShell from "@/components/ui/PageShell";

export const metadata: Metadata = buildMetadata({
  title: "Pago Exitoso",
  description: "Página de confirmación de pago exitoso.",
  path: "/es/success",
  locale: "es",
  noIndex: true,
});

export default function ExitoPage() {
  return (
    <PageShell
      title="Gracias por tu Pago"
      subtitle="Tu pago fue exitoso. Recibirás confirmación y recibo por correo electrónico."
      maxWidthClass="max-w-xl"
    >
      <p className="text-center text-brand-body">
        Gracias por confiar en nuestro acompañamiento para tu bienestar
        financiero.
      </p>
      <div className="mt-6 flex justify-center">
        <Link
          href="/es"
          className="inline-flex items-center rounded-full bg-brand-gold px-8 py-3 font-semibold text-brand-green shadow transition hover:bg-brand-blue hover:text-white"
        >
          Volver al Inicio
        </Link>
      </div>
    </PageShell>
  );
}
