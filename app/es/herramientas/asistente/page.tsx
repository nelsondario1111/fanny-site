import Link from "next/link";
import { MessageCircle, Sparkles, ArrowLeft } from "lucide-react";
import ToolShell from "@/components/ToolShell";

export default function AssistantToolPageEs() {
  return (
    <ToolShell
      lang="es"
      title="Asistente IA"
      subtitle="Soporte guiado en beta para dudas de hipoteca, impuestos y flujo de caja."
    >
      <section className="tool-card-compact">
        <p className="inline-flex items-center gap-2 rounded-full border border-brand-gold/40 bg-brand-gold/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-brand-green">
          <Sparkles size={14} aria-hidden /> Utilidad beta
        </p>

        <p className="mt-4 text-brand-blue/90 leading-relaxed">
          Por ahora, la forma más rápida de recibir próximos pasos personalizados es iniciar una conversación y compartir qué necesitas resolver.
        </p>

        <ul className="mt-6 list-disc pl-5 space-y-1.5 text-brand-blue/90">
          <li>Preguntas de hipoteca, impuestos y flujo de caja en un solo lugar</li>
          <li>Atención bilingüe (español / inglés)</li>
          <li>Próximos pasos prácticos según tu situación</li>
        </ul>

        <div className="mt-7 flex flex-wrap gap-3">
          <Link href="/es/contacto?intent=assistant" className="tool-btn-primary">
            <MessageCircle size={14} aria-hidden />
            Iniciar conversación
          </Link>
          <Link href="/es/herramientas" className="tool-btn-blue">
            <ArrowLeft size={14} aria-hidden />
            Volver a herramientas
          </Link>
        </div>
      </section>

      <section className="tool-card-compact mt-6">
        <p className="text-xs text-brand-blue/70">
          Soporte solo educativo. La guía es general y no constituye asesoría legal, fiscal, hipotecaria ni de inversión.
        </p>
      </section>
    </ToolShell>
  );
}
