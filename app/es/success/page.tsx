import Link from "next/link";
import PageShell from "@/components/ui/PageShell";

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
