import Link from "next/link";
import PageShell from "@/components/ui/PageShell";

export default function CancelPageEs() {
  return (
    <PageShell
      title="Transacción Cancelada"
      subtitle="Tu pago fue cancelado o no se completó. No se realizó ningún cargo."
      maxWidthClass="max-w-xl"
    >
      <p className="text-center text-brand-body">
        Si deseas orientación para elegir el siguiente paso, Fanny y su equipo
        están aquí para ayudarte.
      </p>
      <div className="mt-6 flex justify-center">
        <Link
          href="/es/servicios"
          className="inline-flex items-center rounded-full bg-brand-gold px-8 py-3 font-semibold text-brand-green shadow transition hover:bg-brand-blue hover:text-white"
        >
          Volver a Servicios
        </Link>
      </div>
    </PageShell>
  );
}
