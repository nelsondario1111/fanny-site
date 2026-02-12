import type { Metadata } from "next";
import Link from "next/link";
import { buildMetadata } from "@/app/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Conversaciones en la Mesa",
  description:
    "Conversaciones en la Mesa es un programa grupal de 4 semanas para familias, recién llegados y compradores primerizos que buscan números claros y decisiones con calma.",
  path: "/es/conversaciones-en-la-mesa",
  locale: "es",
});

export default function ConversacionesMesaPage() {
  const packageName = "Conversaciones en la Mesa — Cohorte 4 semanas";
  const packageHref = `/es/contacto?intent=package&package=${encodeURIComponent(packageName)}`;

  return (
    <main className="min-h-screen bg-white">
      <section className="bg-brand-green/5 border-b border-brand-gold/30">
        <div className="max-w-screen-xl mx-auto px-4 py-10 lg:py-12">
          <nav className="text-sm text-brand-blue/80">
            <Link href="/es" className="hover:underline">Inicio</Link>
            <span className="mx-2">/</span>
            <span className="text-brand-green">Conversaciones en la Mesa</span>
          </nav>

          <h1 className="mt-4 font-serif text-4xl md:text-5xl font-extrabold text-brand-green tracking-tight">
            Conversaciones en la Mesa
          </h1>
          <p className="mt-4 max-w-3xl text-lg text-brand-blue/90 leading-relaxed">
            Un programa cercano y práctico de 4 semanas en grupo pequeño, donde traes
            preguntas reales, recibes claridad y sales con pasos concretos que sí puedes aplicar.
          </p>
          <p className="mt-3 max-w-3xl text-brand-blue/80">
            Consultora financiera holística | Impuestos • Hipotecas • Estrategia financiera | Números claros, decisiones con calma.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href={packageHref}
              className="inline-flex items-center justify-center px-5 py-2.5 bg-brand-green text-white rounded-full font-semibold hover:bg-brand-gold hover:text-brand-green border border-brand-green/20 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold"
            >
              Unirme a la cohorte de 4 semanas
            </Link>
            <Link
              href="/es/contacto?intent=consult&package=Llamada%20de%20Descubrimiento%20Gratis%20(15%20min)"
              className="inline-flex items-center justify-center px-5 py-2.5 rounded-full border border-brand-blue/40 text-brand-blue hover:bg-brand-blue hover:text-white transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue/40"
            >
              Reservar llamada de descubrimiento
            </Link>
            <Link
              href="/es/servicios#support"
              className="inline-flex items-center justify-center px-5 py-2.5 rounded-full border border-brand-gold/40 text-brand-green hover:bg-brand-gold hover:text-white transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold"
            >
              Volver a servicios
            </Link>
          </div>
        </div>
      </section>

      <section className="py-10 lg:py-12">
        <div className="max-w-screen-xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-6">
          <article className="rounded-3xl border border-brand-gold/40 bg-white shadow-sm p-6">
            <h2 className="font-serif text-2xl text-brand-green">Para Quién Es</h2>
            <ul className="mt-4 list-disc pl-5 space-y-2 text-brand-blue/90">
              <li>Compradores primerizos y recién llegados</li>
              <li>Familias alineando valores y presupuesto</li>
              <li>Personas que aprenden mejor en conversación guiada</li>
            </ul>
          </article>

          <article className="rounded-3xl border border-brand-gold/40 bg-white shadow-sm p-6">
            <h2 className="font-serif text-2xl text-brand-green">Qué Trabajamos</h2>
            <ul className="mt-4 list-disc pl-5 space-y-2 text-brand-blue/90">
              <li>Pasos hipotecarios, tasas y preparación</li>
              <li>Estrategia de flujo de caja, deuda y crédito</li>
              <li>Claridad fiscal y hábitos prácticos de planificación</li>
            </ul>
          </article>

          <article className="rounded-3xl border border-brand-gold/40 bg-white shadow-sm p-6">
            <h2 className="font-serif text-2xl text-brand-green">Cómo Funciona</h2>
            <ul className="mt-4 list-disc pl-5 space-y-2 text-brand-blue/90">
              <li>Formato en grupo pequeño (amable y enfocado)</li>
              <li>4 sesiones semanales de 45-60 minutos</li>
              <li>Acciones simples al finalizar cada sesión</li>
            </ul>
          </article>
        </div>
      </section>

      <section className="pb-14">
        <div className="max-w-screen-xl mx-auto px-4">
          <div className="rounded-3xl border border-brand-gold/40 bg-brand-green/5 p-6 md:p-8">
            <h2 className="font-serif text-2xl md:text-3xl text-brand-green">Resultado Esperado</h2>
            <p className="mt-4 text-brand-blue/90 max-w-3xl leading-relaxed">
              Terminas el programa con decisiones más calmadas, mejores conversaciones de dinero en casa
              y una secuencia clara para tus próximos pasos en hipoteca, impuestos y flujo de caja.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
