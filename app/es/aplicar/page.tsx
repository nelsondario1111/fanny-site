import Link from "next/link";
import PageShell from "@/components/ui/PageShell";

export default function AplicarPageEs() {
  return (
    <PageShell
      title="Proceso de Aplicación"
      subtitle="Cuéntanos tus metas y tiempos para orientarte al servicio correcto."
      maxWidthClass="max-w-3xl"
    >
      <p className="text-center text-brand-body">
        El formulario completo de aplicación guiada está en preparación. Por
        ahora, agenda una consulta breve para definir tus próximos pasos.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Link
          href="/es/reservar"
          className="inline-flex items-center rounded-full bg-brand-green px-6 py-3 font-semibold text-white transition hover:bg-brand-blue"
        >
          Reservar Consulta
        </Link>
        <Link
          href="/es/contacto?intent=consult"
          className="inline-flex items-center rounded-full border border-brand-green px-6 py-3 font-semibold text-brand-green transition hover:bg-brand-green hover:text-white"
        >
          Contactar al Equipo
        </Link>
      </div>
    </PageShell>
  );
}
