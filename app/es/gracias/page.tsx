import Link from "next/link";
import PageShell from "@/components/ui/PageShell";

export default function GraciasPageEs() {
  return (
    <PageShell
      title="Gracias por Suscribirte"
      subtitle="Ya quedaste inscrito(a). Revisa tu correo para recibir guía práctica y tranquila sobre dinero, hipotecas e impuestos."
      maxWidthClass="max-w-3xl"
    >
      <p className="text-center text-brand-body">
        Mientras tanto, puedes explorar nuestras herramientas y recursos
        gratuitos.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Link
          href="/es/recursos"
          className="inline-flex items-center rounded-full bg-brand-green px-6 py-3 font-semibold text-white transition hover:bg-brand-blue"
        >
          Ver Recursos
        </Link>
        <Link
          href="/es/herramientas"
          className="inline-flex items-center rounded-full border border-brand-green px-6 py-3 font-semibold text-brand-green transition hover:bg-brand-green hover:text-white"
        >
          Abrir Herramientas
        </Link>
      </div>
    </PageShell>
  );
}
