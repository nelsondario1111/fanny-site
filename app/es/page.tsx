// --- SEO METADATA (Next.js 13/14 App Router) --- //
export const metadata = {
  title: "Fanny Samaniego Coaching | Guía Financiera Holística y Soluciones Hipotecarias",
  description:
    "Coaching financiero de corazón, asesoría fiscal holística y acompañamiento en hipotecas en Toronto. Apoyo bilingüe (español e inglés) para tu bienestar y abundancia.",
  openGraph: {
    title: "Fanny Samaniego Coaching | Guía Financiera Holística y Hipotecas",
    description:
      "Acompañamiento personalizado, planificación fiscal holística, asesoría hipotecaria y herramientas prácticas para tu abundancia en español e inglés.",
    url: "https://fannysamaniego.com/es",
    siteName: "Fanny Samaniego Coaching",
    type: "website",
    images: [
      {
        url: "https://fannysamaniego.com/og-fanny-coaching.png", // Reemplaza con tu URL real
        width: 1200,
        height: 630,
        alt: "Fanny Samaniego Coaching – Guía Financiera Holística",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Fanny Samaniego Coaching | Guía Financiera Holística",
    description: "Coaching financiero, fiscal y hipotecario de corazón en Toronto. Español e inglés.",
    images: ["https://fannysamaniego.com/og-fanny-coaching.png"],
  },
};

import Link from "next/link";
import Image from "next/image";

export default function HomeEs() {
  return (
    <main className="bg-brand-beige min-h-screen">
      {/* Sección Hero */}
      <section
        className="relative min-h-[65vh] flex items-center justify-center overflow-hidden
        bg-[url('/nature.jpg')] bg-cover bg-center bg-no-repeat bg-fixed"
      >
        <div className="z-10 relative bg-white/80 backdrop-blur-lg p-12 rounded-3xl shadow-2xl text-center max-w-2xl mx-auto border border-brand-gold">
          <h1 className="font-serif font-extrabold text-5xl md:text-6xl text-brand-green mb-4 drop-shadow-md">
            Guía por Invitación. Claridad con Diseño.
          </h1>
          <p className="font-sans text-2xl text-brand-blue mb-8">
            Cuando estés listo para una guía financiera holística y centrada en el corazón, estoy aquí para acompañarte—con apoyo que honra tu camino único.
          </p>
          <Link href="/es/contacto" legacyBehavior>
            <a>
              <button
                type="button"
                className="px-10 py-4 rounded-full bg-gradient-to-r from-brand-green to-brand-blue text-white font-semibold text-lg shadow-xl hover:scale-105 hover:from-brand-gold hover:to-brand-green transition-all duration-200 border-none focus:outline-none focus:ring-2 focus:ring-brand-gold"
                aria-label="Solicitar una Invitación"
              >
                <span className="mr-2" aria-hidden="true">🤝</span>Solicitar una Invitación
              </button>
            </a>
          </Link>
        </div>
      </section>

      {/* Sobre Mí */}
      <section className="py-24 bg-white flex flex-col md:flex-row items-center max-w-6xl mx-auto gap-12">
        <div className="md:w-1/2 flex justify-center">
          <Image
            src="/fanny.jpg"
            alt="Retrato de Fanny Samaniego, tu guía financiera holística"
            width={340}
            height={340}
            className="rounded-full shadow-xl object-cover border-4 border-brand-green"
            priority
          />
        </div>
        <div className="md:w-1/2 md:pl-12">
          <h2 className="font-serif text-3xl md:text-4xl text-brand-green mb-4 font-bold">
            Sabiduría Compartida con Corazón
          </h2>
          <p className="font-sans text-lg md:text-xl text-brand-body mb-8 leading-relaxed">
            Soy Fanny Samaniego—Guía Financiera Bilingüe, Agente Hipotecaria, y estudiante de por vida de los ciclos de la vida. Mi trabajo más profundo ocurre en verdadera alianza con quienes están listos para transformar no solo sus finanzas, sino toda su relación con la abundancia.
            <br /><br />
            Con los años, he aprendido que la prosperidad real surge al alinear tus números con tu corazón, tus valores y tu visión. Trabajo con un número limitado de clientes a la vez, para ofrecer acompañamiento genuino y atención presente.
          </p>
          <Link href="/es/sobre-mi" legacyBehavior>
            <a>
              <button
                type="button"
                className="px-8 py-3 bg-brand-blue text-white rounded-full font-semibold shadow hover:bg-brand-green hover:text-brand-blue border-2 border-brand-gold transition-all focus:outline-none focus:ring-2 focus:ring-brand-gold"
                aria-label="Conoce Mi Historia"
              >
                Conoce Mi Historia
              </button>
            </a>
          </Link>
        </div>
      </section>

      {/* Por qué trabajo por invitación */}
      <section className="py-10 bg-brand-beige max-w-3xl mx-auto text-center rounded-2xl shadow-sm border border-brand-green my-8">
        <h3 className="font-serif text-2xl text-brand-green font-bold mb-3 flex items-center justify-center gap-2">
          <span aria-hidden="true">🌿</span>
          ¿Por Qué Trabajo por Invitación?
        </h3>
        <p className="font-sans text-lg text-brand-body mb-2">
          Después de años de experiencia, descubrí que los resultados más significativos ocurren cuando hay conexión y confianza genuina. Por eso trabajo por invitación: cada relación comienza con una conversación real, para que ambos sepamos si es el momento y la guía adecuada.
        </p>
        <p className="text-brand-body text-base mt-3 opacity-60">
          <em>(Mi enfoque se inspira en una filosofía que valora el reconocimiento profundo y el tiempo correcto. Si te interesa, ¡pregúntame más!)</em>
        </p>
      </section>

      {/* Servicios */}
      <section className="py-24 bg-gradient-to-b from-brand-beige to-white">
        <h2 className="font-serif text-3xl md:text-4xl text-brand-green text-center mb-16 font-bold flex items-center justify-center gap-2">
          <span aria-hidden="true">🪴</span>
          Formas en que Puedo Acompañarte
        </h2>
        <div className="flex flex-col md:flex-row gap-10 justify-center max-w-6xl mx-auto">
          {/* Guía Financiera */}
          <div className="flex-1 bg-white rounded-2xl p-10 shadow-lg text-center border border-brand-gold flex flex-col items-center transition-transform hover:-translate-y-1 hover:shadow-2xl">
            <div className="w-14 h-14 mb-4 rounded-full bg-brand-green flex items-center justify-center text-white text-2xl shadow-md">
              💡
            </div>
            <h3 className="font-serif text-2xl text-brand-blue mb-2 font-bold">
              Guía Financiera
            </h3>
            <p className="font-sans text-brand-body">
              Encuentra claridad y confianza a través de conversaciones honestas y centradas en tu corazón—sin fórmulas ni presiones.
            </p>
          </div>
          {/* Planificación Fiscal Holística */}
          <div className="flex-1 bg-white rounded-2xl p-10 shadow-lg text-center border border-brand-gold flex flex-col items-center transition-transform hover:-translate-y-1 hover:shadow-2xl">
            <div className="w-14 h-14 mb-4 rounded-full bg-brand-blue flex items-center justify-center text-white text-2xl shadow-md">
              🌱
            </div>
            <h3 className="font-serif text-2xl text-brand-blue mb-2 font-bold">
              Planificación Fiscal Holística
            </h3>
            <p className="font-sans text-brand-body">
              Exploramos estrategias prácticas alineadas con tus valores. Co-creamos un plan que te brinde paz financiera sostenible.
            </p>
          </div>
          {/* Guía Hipotecaria */}
          <div className="flex-1 bg-white rounded-2xl p-10 shadow-lg text-center border border-brand-gold flex flex-col items-center transition-transform hover:-translate-y-1 hover:shadow-2xl">
            <div className="w-14 h-14 mb-4 rounded-full bg-brand-gold flex items-center justify-center text-brand-green text-2xl shadow-md">
              🏡
            </div>
            <h3 className="font-serif text-2xl text-brand-blue mb-2 font-bold">
              Guía Hipotecaria
            </h3>
            <p className="font-sans text-brand-body">
              Acompañamiento integral para tu camino hipotecario—incluyendo inversiones y propiedades multifamiliares—siempre con una mirada personalizada.
            </p>
          </div>
        </div>
        <div className="mt-16 text-center">
          <Link href="/es/servicios" legacyBehavior>
            <a>
              <button
                type="button"
                className="px-10 py-4 bg-brand-gold text-brand-green rounded-full font-semibold shadow-lg hover:bg-brand-green hover:text-white border-2 border-brand-blue transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-gold"
                aria-label="Formas de Trabajar Juntos"
              >
                Formas de Trabajar Juntos
              </button>
            </a>
          </Link>
        </div>
      </section>

      {/* Círculos de Conversación */}
      <section className="py-14 bg-white max-w-4xl mx-auto rounded-2xl shadow border border-brand-green my-8 text-center">
        <h3 className="font-serif text-2xl text-brand-green font-bold mb-2 flex items-center justify-center gap-2">
          <span aria-hidden="true">☕</span>
          Círculos de Conversación
        </h3>
        <p className="font-sans text-lg text-brand-body mb-4">
          Únete a sesiones en grupo íntimas—como si estuviéramos en la mesa de una cocina—donde compartimos, reflexionamos y nos apoyamos en comunidad.
        </p>
        <Link href="/es/contacto" legacyBehavior>
          <a>
            <button
              type="button"
              className="px-8 py-3 bg-brand-blue text-white rounded-full font-semibold shadow hover:bg-brand-gold hover:text-brand-green border-2 border-brand-blue transition-all focus:outline-none focus:ring-2 focus:ring-brand-gold"
              aria-label="Solicita Unirte a un Círculo"
            >
              Solicita Unirte a un Círculo
            </button>
          </a>
        </Link>
      </section>

      {/* Herramientas */}
      <section className="py-20 bg-white max-w-6xl mx-auto">
        <h2 className="font-serif text-3xl md:text-4xl text-brand-green text-center mb-12 font-bold flex items-center justify-center gap-2">
          <span aria-hidden="true">🛠️</span>
          Herramientas para Nutrir tu Camino Financiero
        </h2>
        <div className="flex flex-col md:flex-row gap-10">
          <div className="flex-1 bg-brand-blue/10 rounded-2xl p-10 shadow text-center border border-brand-gold hover:shadow-lg transition">
            <h3 className="font-serif text-2xl text-brand-blue mb-2 font-bold">
              Planificador de Presupuesto Holístico
            </h3>
            <p className="font-sans text-brand-body mb-6">
              Crea un presupuesto que se sienta expansivo, no restrictivo—alineado con tus valores y estilo de vida.
            </p>
            <Link href="/es/tools/calculadora-presupuesto" legacyBehavior>
              <a>
                <button
                  type="button"
                  className="px-8 py-3 bg-brand-green text-white rounded-full font-semibold hover:bg-brand-gold hover:text-brand-green border-2 border-brand-blue transition focus:outline-none focus:ring-2 focus:ring-brand-gold"
                  aria-label="Probar Herramienta"
                >
                  Probar Herramienta
                </button>
              </a>
            </Link>
          </div>
          <div className="flex-1 bg-brand-blue/10 rounded-2xl p-10 shadow text-center border border-brand-gold hover:shadow-lg transition">
            <h3 className="font-serif text-2xl text-brand-blue mb-2 font-bold">
              Herramientas Hipotecarias
            </h3>
            <p className="font-sans text-brand-body mb-6">
              Estima tus pagos y explora estrategias conscientes para comprar, refinanciar o invertir.
            </p>
            <Link href="/es/tools/calculadora-hipotecaria" legacyBehavior>
              <a>
                <button
                  type="button"
                  className="px-8 py-3 bg-brand-green text-white rounded-full font-semibold hover:bg-brand-gold hover:text-brand-green border-2 border-brand-blue transition focus:outline-none focus:ring-2 focus:ring-brand-gold"
                  aria-label="Explorar Herramientas"
                >
                  Explorar Herramientas
                </button>
              </a>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonios */}
      <section className="py-24 bg-brand-beige">
        <div className="max-w-2xl mx-auto text-center">
          <blockquote className="font-serif italic text-2xl text-brand-blue mb-8 border-l-4 border-brand-gold pl-6">
            “Ser invitado a trabajar con Fanny me brindó más que números—me dio paz, seguridad y confianza en mi camino. Ella escucha, guía y ve lo que necesitas, incluso antes de que tú lo sepas.”
          </blockquote>
          <div className="font-sans font-semibold text-lg text-brand-green mb-8">
            – María y Carlos, Toronto
          </div>
          <Link href="/es/testimonios" legacyBehavior>
            <a>
              <button
                type="button"
                className="px-10 py-3 bg-brand-green text-white rounded-full font-semibold shadow-md hover:bg-brand-gold hover:text-brand-green border-2 border-brand-gold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-gold"
                aria-label="Historias de Guía y Transformación"
              >
                Historias de Guía y Transformación
              </button>
            </a>
          </Link>
        </div>
      </section>
    </main>
  );
}
