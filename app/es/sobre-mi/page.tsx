import Image from "next/image";
import Link from "next/link";

export default function SobreMi() {
  return (
    <main className="bg-brand-beige min-h-screen py-20bg-brand-beige min-h-screen py-12 px-2">
      {/* Sección Principal / Sobre Fanny */}
      <section className="max-w-5xl mx-auto bg-white/90 rounded-3xl shadow-xl p-10 flex flex-col md:flex-row items-center gap-10 mb-20 border border-brand-gold">
        {/* Retrato */}
        <div className="flex-shrink-0 flex justify-center">
          <Image
            src="/fanny-portrait.jpg"
            alt="Retrato de Fanny Samaniego, Coach Financiera Holística y Agente Hipotecaria en Toronto"
            width={260}
            height={340}
            className="rounded-3xl shadow-lg object-cover border-4 border-brand-gold"
            priority
          />
        </div>
        {/* Bio */}
        <div className="flex-1 md:pl-8">
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6 text-brand-green tracking-tight flex items-center gap-3">
            
            Sobre Fanny: Guía Financiera Holística por Invitación
          </h1>
           <div className="flex justify-center mb-8">
          <div className="w-20 border-t-4 border-brand-gold rounded-full"></div>
        </div>
          <p className="mb-4 text-lg md:text-xl text-brand-blue/90 leading-relaxed">
            Mi camino—de auditora fiscal a coach y asesora financiera holística—me enseñó que la prosperidad va mucho más allá de los números. Se trata de claridad, compasión y alinear cada paso con tus valores más profundos y tu visión de vida.
          </p>
          <p className="mb-4 text-lg md:text-xl text-brand-body leading-relaxed">
            Como asesora financiera, coach holística y agente hipotecaria bilingüe, ayudo a personas y familias a descubrir claridad financiera, calma interior y empoderamiento en sus decisiones. Mi enfoque está basado en la escucha profunda, estrategias a medida y respeto por tu historia única—ofreciendo siempre mis servicios en español e inglés.
          </p>
          <p className="mb-4 text-lg md:text-xl text-brand-body leading-relaxed">
            Los mejores resultados surgen de la conexión auténtica y el encaje mutuo. Por eso trabajo con un número reducido de personas a la vez, y solo cuando hay verdadera resonancia. Si sientes afinidad con mi enfoque, te invito a iniciar una conversación.
          </p>
        </div>
      </section>

      {/* Compromiso */}
      <section className="max-w-4xl mx-auto mb-16">
        <h2 className="text-2xl md:text-3xl font-serif font-semibold text-brand-blue mb-5 text-center flex items-center gap-2 justify-center">
          <span aria-hidden="true">💎</span>
          Mi compromiso contigo
        </h2>
        <ul className="list-disc ml-8 md:ml-12 text-lg md:text-xl text-brand-green space-y-3 text-left">
          <li>Presencia, integridad y transparencia en cada interacción.</li>
          <li>Acompañamiento compasivo—honrando tu historia y necesidades únicas.</li>
          <li>Estrategias holísticas para tu bienestar financiero consciente y sostenible.</li>
          <li>
            <span className="text-brand-blue">
              Una práctica basada en la invitación, para que nuestro trabajo siempre se construya sobre la conexión real y el respeto mutuo.
            </span>
          </li>
        </ul>
      </section>

      {/* Filosofía / Mini-FAQ */}
      <section className="max-w-3xl mx-auto mb-12 bg-brand-beige rounded-2xl shadow p-8 border border-brand-green text-center">
        <h3 className="font-serif text-xl text-brand-green font-bold mb-2 flex items-center gap-2 justify-center">
          <span aria-hidden="true">💬</span>
          ¿Por qué “Guía por Invitación”?
        </h3>
        <p className="font-sans text-lg text-brand-body">
          A lo largo de los años acompañando a otros, he comprobado que el trabajo más significativo sucede cuando cliente y guía sienten una conexión genuina. Me enfoco en quienes realmente están listos para un acompañamiento holístico. Por eso te invito a comenzar con una conversación—sin compromiso, solo apertura—para ver si somos el equipo ideal.
        </p>
        <p className="text-brand-body text-base mt-3 opacity-70">
          <em>
            (¿Te da curiosidad? Mi filosofía de “invitación” está inspirada en Human Design, pero siempre enraizada en la conexión humana auténtica.)
          </em>
        </p>
      </section>

      {/* Llamado a la acción */}
      <section className="text-center">
        <Link href="/es/contacto">
          <button
            type="button"
            className="px-10 py-4 bg-brand-gold text-brand-green font-serif font-bold rounded-full shadow-lg hover:bg-brand-blue hover:text-white transition tracking-wide text-lg focus:outline-none focus:ring-2 focus:ring-brand-gold"
            aria-label="Solicitar una invitación para conectar"
          >
            Solicitar una invitación para conectar
          </button>
        </Link>
      </section>
    </main>
  );
}
