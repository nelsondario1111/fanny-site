import Link from "next/link";
import { ArrowRight, Languages } from "lucide-react";
import ToolShell from "@/components/ToolShell";

export default function ListaAutonomosPage() {
  return (
    <ToolShell
      lang="es"
      title="Toolkit para Autónomos"
      subtitle="La versión completa de esta herramienta está disponible en inglés por ahora."
    >
      <section className="tool-card-compact">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 rounded-full border border-brand-gold/70 bg-brand-beige/70 p-2 text-brand-green">
            <Languages className="h-5 w-5" aria-hidden />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-brand-green">Acceso en inglés (EN)</h2>
            <p className="mt-2 text-brand-blue/90">
              Incluye checklist completo, estimador de ingresos ajustados, exportación CSV,
              auto-guardado y recomendaciones prácticas para preparar tu expediente hipotecario.
            </p>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/en/tools/self-employed-checklist" className="tool-btn-primary">
            Abrir toolkit en inglés
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
          <Link href="/es/herramientas" className="tool-btn-blue">
            Volver a herramientas
          </Link>
        </div>
      </section>

      <section className="tool-card-compact mt-6">
        <p className="text-sm text-brand-blue/80">
          Nota: seguimos ampliando la versión en español para mantener la misma calidad y claridad en todas las herramientas.
        </p>
      </section>
    </ToolShell>
  );
}
