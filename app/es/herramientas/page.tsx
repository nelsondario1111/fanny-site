"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaCalculator, FaHome, FaBook } from "react-icons/fa";

export default function Tools() {
  const pathname = usePathname();
  const langPrefix = pathname.startsWith("/en") ? "/en" : "/es";

  return (
    <main className="bg-brand-beige min-h-screen py-12 px-2">
      {/* Tarjeta Principal */}
      <section className="max-w-5xl mx-auto bg-white/90 rounded-3xl shadow-xl p-10 border border-brand-gold mb-16">
        {/* Título y Línea Dorada */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4 text-brand-green tracking-tight flex items-center gap-3 justify-center">
            <span aria-hidden="true">🛠️</span>
            Herramientas para tu Bienestar Financiero
          </h1>
          <div className="flex justify-center mb-8">
            <div className="w-20 border-t-4 border-brand-gold rounded-full"></div>
          </div>
          <p className="text-lg text-brand-blue mb-3">
            Toma decisiones financieras con confianza y alineadas a tus valores usando estas herramientas prácticas y amigables.
          </p>
          <p className="text-brand-body mb-2">
            Calculadoras y recursos para apoyarte en cada etapa de tu camino—siempre privado, siempre gratis.
          </p>
        </div>

        {/* Grid de Herramientas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 mb-12">
          {/* Calculadora de Presupuesto */}
          <div className="rounded-2xl border border-brand-gold/30 bg-white/95 shadow-xl p-8 flex flex-col items-center text-center hover:-translate-y-1 hover:shadow-2xl transition">
            <div className="mb-4 w-14 h-14 flex items-center justify-center rounded-full bg-brand-green/10 shadow-lg border">
              <FaCalculator className="text-brand-gold text-3xl" />
            </div>
            <h2 className="text-2xl font-serif font-bold text-brand-blue mb-2">
              Calculadora de Presupuesto Holístico
            </h2>
            <p className="text-brand-green mb-4">
              Crea un presupuesto que refleje verdaderamente tu vida y valores—simple, intuitivo y privado.
            </p>
            <Link href={`${langPrefix}/calculadora-presupuesto`}>
              <button
                type="button"
                className="px-7 py-3 bg-brand-gold text-brand-green font-serif font-bold rounded-full shadow hover:bg-brand-blue hover:text-white transition-all text-lg focus:outline-none focus:ring-2 focus:ring-brand-gold"
                aria-label="Usar Calculadora de Presupuesto"
              >
                Usar Calculadora
              </button>
            </Link>
          </div>

          {/* Calculadora Hipotecaria */}
          <div className="rounded-2xl border border-brand-gold/30 bg-white/95 shadow-xl p-8 flex flex-col items-center text-center hover:-translate-y-1 hover:shadow-2xl transition">
            <div className="mb-4 w-14 h-14 flex items-center justify-center rounded-full bg-brand-blue/10 shadow-lg border">
              <FaHome className="text-brand-blue text-3xl" />
            </div>
            <h2 className="text-2xl font-serif font-bold text-brand-blue mb-2">
              Calculadora Hipotecaria
            </h2>
            <p className="text-brand-green mb-4">
              Calcula al instante tus pagos hipotecarios—aún para propiedades de inversión o multi-unidad.
            </p>
            <Link href={`${langPrefix}/calculadora-hipotecaria`}>
              <button
                type="button"
                className="px-7 py-3 bg-brand-gold text-brand-green font-serif font-bold rounded-full shadow hover:bg-brand-blue hover:text-white transition-all text-lg focus:outline-none focus:ring-2 focus:ring-brand-gold"
                aria-label="Usar Calculadora Hipotecaria"
              >
                Usar Calculadora
              </button>
            </Link>
          </div>
        </div>

        {/* Más Recursos */}
        <div className="rounded-2xl border-l-4 border-brand-gold bg-brand-beige p-8 shadow text-center">
          <FaBook className="inline-block text-brand-green text-2xl mb-2" />
          <h3 className="text-xl font-serif font-bold text-brand-green mb-2 flex items-center gap-2 justify-center">
            <span aria-hidden="true">📚</span>
            ¿Buscas más recursos?
          </h3>
          <p className="text-brand-body mb-4">
            Explora guías, hojas de trabajo y artículos prácticos en la sección de recursos.
          </p>
          <Link href={`${langPrefix}/recursos`}>
            <button
              type="button"
              className="px-8 py-3 bg-brand-green text-white font-serif font-bold rounded-full shadow hover:bg-brand-blue hover:text-brand-gold transition-all text-lg focus:outline-none focus:ring-2 focus:ring-brand-green"
              aria-label="Ir a Recursos"
            >
              Ir a Recursos
            </button>
          </Link>
        </div>
      </section>
    </main>
  );
}
