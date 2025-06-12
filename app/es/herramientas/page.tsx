import Link from "next/link";
import { FaCalculator, FaHome, FaBook } from "react-icons/fa";

export default function Herramientas() {
  return (
    <main className="bg-brand-beige min-h-screen py-16 px-2">
      {/* Encabezado */}
      <section className="max-w-3xl mx-auto text-center mb-10">
        <h1 className="font-serif text-4xl md:text-5xl text-brand-green font-bold mb-3">
          Herramientas para tu Bienestar Financiero
        </h1>
        <p className="text-lg text-brand-blue mb-3">
          Toma decisiones inteligentes y alineadas usando estas herramientas prácticas y sencillas.
        </p>
        <p className="text-brand-body mb-2">
          Calculadoras y recursos diseñados para apoyarte en cada etapa de tu camino financiero.
        </p>
      </section>

      {/* Grid de herramientas */}
      <section className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-10 mb-16">
        {/* Calculadora de presupuesto */}
        <div className="rounded-2xl border-2 bg-white border-brand-gold/30 shadow-xl p-8 flex flex-col items-center text-center hover:-translate-y-1 hover:shadow-2xl transition">
          <div className="mb-4 w-14 h-14 flex items-center justify-center rounded-full bg-brand-green/10 shadow-lg border">
            <FaCalculator className="text-brand-gold text-3xl" />
          </div>
          <h2 className="text-2xl font-serif font-bold text-brand-blue mb-2">
            Calculadora de Presupuesto
          </h2>
          <p className="text-brand-green mb-4">
            Crea un presupuesto que refleje tu estilo de vida y tus metas. Simple, intuitiva y privada.
          </p>
          <Link href="/es/calculadora-presupuesto">
            <button className="px-7 py-3 bg-brand-gold text-brand-green font-serif font-bold rounded-full shadow hover:bg-brand-blue hover:text-white transition-all text-lg">
              Usar calculadora
            </button>
          </Link>
        </div>

        {/* Calculadora Hipotecaria */}
        <div className="rounded-2xl border-2 bg-white border-brand-gold/30 shadow-xl p-8 flex flex-col items-center text-center hover:-translate-y-1 hover:shadow-2xl transition">
          <div className="mb-4 w-14 h-14 flex items-center justify-center rounded-full bg-brand-blue/10 shadow-lg border">
            <FaHome className="text-brand-blue text-3xl" />
          </div>
          <h2 className="text-2xl font-serif font-bold text-brand-blue mb-2">
            Calculadora Hipotecaria
          </h2>
          <p className="text-brand-green mb-4">
            Calcula tus pagos hipotecarios al instante—también para propiedades multi-unidad.
          </p>
          <Link href="/es/calculadora-hipotecaria">
            <button className="px-7 py-3 bg-brand-gold text-brand-green font-serif font-bold rounded-full shadow hover:bg-brand-blue hover:text-white transition-all text-lg">
              Usar calculadora
            </button>
          </Link>
        </div>
      </section>

      {/* Más recursos */}
      <section className="max-w-3xl mx-auto mb-12">
        <div className="rounded-2xl border-l-4 border-brand-gold bg-brand-beige p-8 shadow text-center">
          <FaBook className="inline-block text-brand-green text-2xl mb-2" />
          <h3 className="text-xl font-serif font-bold text-brand-green mb-2">
            ¿Buscas más recursos?
          </h3>
          <p className="text-brand-body mb-4">
            Explora guías, hojas de trabajo y artículos prácticos en la sección de recursos.
          </p>
          <Link href="/es/recursos">
            <button className="px-8 py-3 bg-brand-green text-white font-serif font-bold rounded-full shadow hover:bg-brand-blue hover:text-brand-gold transition-all text-lg">
              Ir a Recursos
            </button>
          </Link>
        </div>
      </section>
    </main>
  );
}
