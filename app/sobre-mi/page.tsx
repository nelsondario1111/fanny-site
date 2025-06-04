import Image from "next/image";
import Link from "next/link";

export default function SobreMi() {
  return (
    <main className="bg-brand-beige min-h-screen py-20">
      {/* Sección principal/Hero */}
      <section className="max-w-5xl mx-auto bg-white/90 rounded-3xl shadow-xl p-10 flex flex-col md:flex-row items-center gap-10 mb-20 border border-brand-gold">
        {/* Retrato */}
        <div className="flex-shrink-0 flex justify-center">
          <Image
            src="/fanny-portrait.jpg"
            alt="Fanny Samaniego"
            width={260}
            height={340}
            className="rounded-3xl shadow-lg object-cover border-4 border-brand-gold"
            priority
          />
        </div>
        {/* Biografía */}
        <div className="flex-1 md:pl-8">
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6 text-brand-green tracking-tight">
            Conoce a Fanny: Guía Financiera por Invitación
          </h1>
          <p className="mb-4 text-lg md:text-xl text-brand-blue/90 leading-relaxed">
            Mi camino—de auditora fiscal a coach financiera holística—me enseñó que la verdadera prosperidad no es solo cuestión de números. Es claridad, compasión y alinear cada paso con tus valores y lo que realmente importa en tu vida.
          </p>
          <p className="mb-4 text-lg md:text-xl text-brand-body leading-relaxed">
            Como Coach Financiera y Agente Hipotecaria bilingüe, acompaño a personas y familias a encontrar no solo claridad financiera, sino también calma y empoderamiento en sus decisiones. Mi trabajo se basa en la escucha profunda y estrategias prácticas y personalizadas—ya sea en inglés o español.
          </p>
          <p className="mb-4 text-lg md:text-xl text-brand-body leading-relaxed">
            He aprendido que los mejores resultados surgen de una conexión genuina y afinidad mutua. Por eso trabajo solo con un grupo reducido de personas a la vez, y únicamente cuando hay una verdadera resonancia entre nosotros. Si sientes que mi enfoque conecta contigo, te invito con cariño a contactarme.
          </p>
        </div>
      </section>

      {/* Compromiso */}
      <section className="max-w-4xl mx-auto mb-16">
        <h2 className="text-2xl md:text-3xl font-serif font-semibold text-brand-blue mb-5 text-center">
          Mi compromiso contigo
        </h2>
        <ul className="list-disc ml-8 md:ml-12 text-lg md:text-xl text-brand-green space-y-3">
          <li>Presencia, integridad y transparencia en cada encuentro.</li>
          <li>Acompañamiento compasivo—honrando tu historia y necesidades únicas.</li>
          <li>Estrategias holísticas para un bienestar financiero consciente y sostenible.</li>
          <li>
            <span className="text-brand-blue">
              Una práctica basada en la invitación, para que nuestro trabajo siempre se fundamente en conexión real y respeto mutuo.
            </span>
          </li>
        </ul>
      </section>

      {/* Mini-FAQ de Filosofía */}
      <section className="max-w-3xl mx-auto mb-12 bg-brand-beige rounded-2xl shadow p-8 border border-brand-green text-center">
        <h3 className="font-serif text-xl text-brand-green font-bold mb-2">
          ¿Por qué “Guía por invitación”?
        </h3>
        <p className="font-sans text-lg text-brand-body">
          A lo largo de los años he comprobado que el trabajo más valioso ocurre cuando clienta y guía sienten una conexión natural. Mi prioridad es acompañar a quienes realmente están listos para un apoyo holístico. Por eso, te invito a comenzar con una conversación—sin compromiso, solo apertura y claridad—para ver si somos el mejor equipo.
        </p>
        {/* Sutil referencia a Human Design */}
        <p className="text-brand-body text-base mt-3 opacity-70">
          <em>
            (Por si tienes curiosidad: mi enfoque de “invitación” está inspirado en herramientas como Human Design, pero lo más importante para mí es siempre la conexión humana genuina.)
          </em>
        </p>
      </section>

      {/* Llamado a la acción */}
      <section className="text-center">
        <Link href="/contacto">
          <button className="px-10 py-4 bg-brand-gold text-brand-green font-serif font-bold rounded-full shadow-lg hover:bg-brand-blue hover:text-white transition tracking-wide text-lg">
            Solicitar una invitación para conversar
          </button>
        </Link>
      </section>
    </main>
  );
}
