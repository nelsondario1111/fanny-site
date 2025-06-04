import Link from "next/link";

export default function HomeEs() {
  return (
    <main className="bg-brand-beige min-h-screen">
      {/* Hero Section with Parallax Background */}
      <section
        className="relative min-h-[65vh] flex items-center justify-center overflow-hidden
          bg-[url('/nature.jpg')] bg-cover bg-center bg-fixed"
      >
        {/* Overlay Card */}
        <div className="z-10 relative bg-white/80 backdrop-blur-lg p-12 rounded-3xl shadow-2xl text-center max-w-2xl mx-auto border border-brand-gold">
          <h1 className="font-serif font-extrabold text-5xl md:text-6xl text-brand-green mb-4 drop-shadow-md">
            Orientación por Invitación. Claridad con Corazón.
          </h1>
          <p className="font-sans text-2xl text-brand-blue mb-8">
            Cuando sientas que es el momento de invitar una guía financiera holística y compasiva, aquí estoy para acompañarte—ofreciendo apoyo que honra tu camino único.
          </p>
          <Link href="/contacto" legacyBehavior>
            <a>
              <button className="px-10 py-4 rounded-full bg-gradient-to-r from-brand-green to-brand-blue text-white font-semibold text-lg shadow-xl hover:scale-105 hover:from-brand-gold hover:to-brand-green transition-all duration-200 border-none">
                <span className="mr-2">🤝</span>
                Solicita una Invitación
              </button>
            </a>
          </Link>
        </div>
      </section>

      {/* About Brief */}
      <section className="py-24 bg-white flex flex-col md:flex-row items-center max-w-6xl mx-auto gap-12">
        <div className="md:w-1/2 flex justify-center">
          <img
            src="/fanny.jpg"
            alt="Fanny Samaniego"
            width={340}
            height={340}
            className="rounded-full shadow-xl object-cover border-4 border-brand-green"
            loading="lazy"
          />
        </div>
        <div className="md:w-1/2 md:pl-12">
          <h2 className="font-serif text-3xl md:text-4xl text-brand-green mb-4 font-bold">
            Sabiduría Invitada, Compartida con el Corazón
          </h2>
          <p className="font-sans text-lg md:text-xl text-brand-body mb-8 leading-relaxed">
            Soy Fanny Samaniego—Coach Financiera bilingüe, Agente Hipotecaria y eterna aprendiz de los ciclos de la vida. Mi trabajo más profundo surge en verdadera colaboración con personas que valoran la claridad y están listas para un cambio consciente, no solo en sus finanzas, sino en toda su relación con la abundancia.
            <br /><br />
            He aprendido que la verdadera prosperidad es alinear tus números con tu corazón, tus valores y tu visión de futuro. Solo acompaño a un número limitado de personas a la vez, para ofrecer atención, presencia y apoyo genuino.
          </p>
          <Link href="/sobre-mi" legacyBehavior>
            <a>
              <button className="px-8 py-3 bg-brand-blue text-white rounded-full font-semibold shadow hover:bg-brand-green hover:text-brand-blue border-2 border-brand-gold transition-all">
                Conoce más sobre Fanny
              </button>
            </a>
          </Link>
        </div>
      </section>

      {/* Why I Work by Invitation */}
      <section className="py-10 bg-brand-beige max-w-3xl mx-auto text-center rounded-2xl shadow-sm border border-brand-green my-8">
        <h3 className="font-serif text-2xl text-brand-green font-bold mb-3">
          ¿Por qué trabajo por invitación?
        </h3>
        <p className="font-sans text-lg text-brand-body mb-2">
          Tras años de experiencia, he comprobado que los mejores resultados surgen cuando existe una conexión genuina y confianza mutua. Por eso, solo acepto nuevos procesos mediante invitación: cada acompañamiento inicia con una conversación real, para sentir si de verdad somos el mejor equipo.
        </p>
        {/* Nota opcional y suave sobre Human Design */}
        {/* <p className="text-brand-body text-base mt-3 opacity-60">
          <em>
            (Si te da curiosidad: mi estilo está inspirado en filosofías que valoran el reconocimiento y el momento adecuado. ¡Pregúntame si quieres saber más!)
          </em>
        </p> */}
      </section>

      {/* Core Services Overview */}
      <section className="py-24 bg-gradient-to-b from-brand-beige to-white">
        <h2 className="font-serif text-3xl md:text-4xl text-brand-green text-center mb-16 font-bold">
          Cómo te Puedo Acompañar
        </h2>
        <div className="flex flex-col md:flex-row gap-10 justify-center max-w-6xl mx-auto">
          {/* Service Card */}
          <div className="flex-1 bg-white rounded-2xl p-10 shadow-lg text-center border border-brand-gold flex flex-col items-center">
            <div className="w-14 h-14 mb-4 rounded-full bg-brand-green flex items-center justify-center text-white text-2xl">
              <span>💡</span>
            </div>
            <h3 className="font-serif text-2xl text-brand-blue mb-2 font-bold">
              Coaching Financiero
            </h3>
            <p className="font-sans text-brand-body">
              Descubre claridad y confianza a través de conversaciones profundas—sin fórmulas ni presión, solo guía honesta para tu propio camino.
            </p>
          </div>
          <div className="flex-1 bg-white rounded-2xl p-10 shadow-lg text-center border border-brand-gold flex flex-col items-center">
            <div className="w-14 h-14 mb-4 rounded-full bg-brand-blue flex items-center justify-center text-white text-2xl">
              <span>🌱</span>
            </div>
            <h3 className="font-serif text-2xl text-brand-blue mb-2 font-bold">
              Planificación Fiscal Holística
            </h3>
            <p className="font-sans text-brand-body">
              Estrategias prácticas alineadas con tus valores. Co-creamos un plan que te brinde tranquilidad y estructura.
            </p>
          </div>
          <div className="flex-1 bg-white rounded-2xl p-10 shadow-lg text-center border border-brand-gold flex flex-col items-center">
            <div className="w-14 h-14 mb-4 rounded-full bg-brand-gold flex items-center justify-center text-brand-green text-2xl">
              <span>🏡</span>
            </div>
            <h3 className="font-serif text-2xl text-brand-blue mb-2 font-bold">
              Soluciones Hipotecarias
            </h3>
            <p className="font-sans text-brand-body">
              Te acompaño en cualquier etapa de tu camino hipotecario—including inversión en propiedades multi-unidad—siempre con una mirada holística y cercana.
            </p>
          </div>
        </div>
        <div className="mt-16 text-center">
          <Link href="/servicios" legacyBehavior>
            <a>
              <button className="px-10 py-4 bg-brand-gold text-brand-green rounded-full font-semibold shadow-lg hover:bg-brand-green hover:text-white border-2 border-brand-blue transition-all duration-200">
                Descubre las Formas de Acompañamiento
              </button>
            </a>
          </Link>
        </div>
      </section>

      {/* Kitchen Table Conversations Section */}
      <section className="py-14 bg-white max-w-4xl mx-auto rounded-2xl shadow border border-brand-green my-8 text-center">
        <h3 className="font-serif text-2xl text-brand-green font-bold mb-2">
          Conversaciones de Mesa de Cocina
        </h3>
        <p className="font-sans text-lg text-brand-body mb-4">
          Encuentros grupales íntimos—como sentarse alrededor de la mesa de la cocina—donde compartimos dudas, experiencias y nos apoyamos mutuamente. Si quieres recibir invitación para un próximo círculo, escríbeme abajo.
        </p>
        <Link href="/mesa-de-cocina" legacyBehavior>
          <a>
            <button className="px-8 py-3 bg-brand-blue text-white rounded-full font-semibold shadow hover:bg-brand-gold hover:text-brand-green border-2 border-brand-blue transition-all">
              Solicita un Cupo en el Círculo
            </button>
          </a>
        </Link>
      </section>

      {/* Tools Section */}
      <section className="py-20 bg-white max-w-6xl mx-auto">
        <h2 className="font-serif text-3xl md:text-4xl text-brand-green text-center mb-12 font-bold">
          Herramientas para Nutrir tu Bienestar Financiero
        </h2>
        <div className="flex flex-col md:flex-row gap-10">
          <div className="flex-1 bg-brand-blue/10 rounded-2xl p-10 shadow text-center border border-brand-gold">
            <h3 className="font-serif text-2xl text-brand-blue mb-2 font-bold">
              Calculadora de Presupuesto
            </h3>
            <p className="font-sans text-brand-body mb-6">
              Diseña un presupuesto que nutra tu vida—alineado con tus valores y prioridades.
            </p>
            <Link href="/herramientas" legacyBehavior>
              <a>
                <button className="px-8 py-3 bg-brand-green text-white rounded-full font-semibold hover:bg-brand-gold hover:text-brand-green border-2 border-brand-blue transition">
                  Probar la Calculadora
                </button>
              </a>
            </Link>
          </div>
          <div className="flex-1 bg-brand-blue/10 rounded-2xl p-10 shadow text-center border border-brand-gold">
            <h3 className="font-serif text-2xl text-brand-blue mb-2 font-bold">
              Calculadora Hipotecaria
            </h3>
            <p className="font-sans text-brand-body mb-6">
              Calcula tus pagos y explora opciones holísticas para cualquier etapa de tu proyecto inmobiliario.
            </p>
            <Link href="/herramientas" legacyBehavior>
              <a>
                <button className="px-8 py-3 bg-brand-green text-white rounded-full font-semibold hover:bg-brand-gold hover:text-brand-green border-2 border-brand-blue transition">
                  Probar la Calculadora Hipotecaria
                </button>
              </a>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="py-24 bg-brand-beige">
        <div className="max-w-2xl mx-auto text-center">
          <blockquote className="font-serif italic text-2xl text-brand-blue mb-8 border-l-4 border-brand-gold pl-6">
            “Ser invitada a trabajar con Fanny transformó nuestra relación con el dinero: ahora sentimos paz, claridad y confianza en nuestro camino. Ella escucha, guía y reconoce lo que necesitas, incluso antes de que lo veas.”
          </blockquote>
          <div className="font-sans font-semibold text-lg text-brand-green mb-8">
            – María & Carlos, Toronto
          </div>
          <Link href="/testimonios" legacyBehavior>
            <a>
              <button className="px-10 py-3 bg-brand-green text-white rounded-full font-semibold shadow-md hover:bg-brand-gold hover:text-brand-green border-2 border-brand-gold transition-all duration-200">
                Historias de Acompañamiento
              </button>
            </a>
          </Link>
        </div>
      </section>
    </main>
  );
}
