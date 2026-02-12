import type { Metadata } from "next";
import { buildMetadata } from "@/app/metadata";
import PageShell from "@/components/ui/PageShell";

export const metadata: Metadata = buildMetadata({
  title: "Cuenta",
  description: "Área privada de cuenta para clientes.",
  path: "/es/cuenta",
  locale: "es",
  noIndex: true,
});

export default function CuentaEs() {
  return (
    <PageShell
      title="Tu Cuenta"
      subtitle="Esta área privada reunirá tus documentos, herramientas y próximos pasos."
      center={false}
      maxWidthClass="max-w-4xl"
    >
      <section className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-brand-gold/30 bg-white p-5 shadow-sm">
          <h2 className="font-brand text-xl font-semibold text-brand-green">
            Herramientas y Regalos
          </h2>
          <p className="mt-2 text-sm text-brand-body/80">
            Próximamente: descargas personalizadas, trackers y recursos guiados.
          </p>
        </div>
        <div className="rounded-2xl border border-brand-gold/30 bg-white p-5 shadow-sm">
          <h2 className="font-brand text-xl font-semibold text-brand-green">
            Documentos
          </h2>
          <p className="mt-2 text-sm text-brand-body/80">
            Aquí tendrás subida segura y compartición privada de archivos.
          </p>
        </div>
      </section>
    </PageShell>
  );
}
