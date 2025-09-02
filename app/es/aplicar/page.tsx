import Link from "next/link";

export default function TestimonialsEs() {
  return (
    <main className="bg-brand-beige min-h-screen py-12 px-2">
      <section className="max-w-3xl mx-auto bg-white/90 rounded-3xl shadow-xl p-10 border border-brand-gold">
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-brand-green mb-8 text-center tracking-tight">
          Historias de Transformación Financiera
        </h1>
        <div className="flex justify-center mb-10">
          <div className="w-20 border-t-4 border-brand-gold rounded-full"></div>
        </div>

        <section className="space-y-8 mb-12">
          {/* Testimonio 1 */}
          <blockquote className="border-l-4 border-brand-green pl-6 py-4 bg-brand-beige/80 rounded-2xl shadow-lg">
            <p className="italic mb-2 text-lg md:text-xl text-brand-green">
              “El enfoque reflexivo de Fanny nos ayudó a ver nuestras finanzas con claridad por primera vez. Compramos nuestra primera propiedad de inversión con confianza, sabiendo que cada paso estaba alineado con nuestros valores y metas a largo plazo. ¡Altamente recomendada!”
            </p>
            <div className="font-semibold text-brand-green">— Luisa & Javier, Toronto</div>
          </blockquote>
          {/* Testimonio 2 */}
          <blockquote className="border-l-4 border-brand-green pl-6 py-4 bg-brand-beige/80 rounded-2xl shadow-lg">
            <p className="italic mb-2 text-lg md:text-xl text-brand-green">
              “Trabajar con Fanny transformó nuestra ansiedad financiera en claridad y confianza. Combina experiencia y compasión de una manera realmente única.”
            </p>
            <div className="font-semibold text-brand-green">— María & Carlos, Toronto</div>
          </blockquote>
        </section>

        <div className="text-center mt-10">
          <Link href="/es/contacto">
            <button className="px-10 py-4 bg-brand-gold text-brand-green font-serif font-bold rounded-full shadow-lg hover:bg-brand-blue hover:text-white transition text-lg tracking-wide">
              Agenda tu Sesión de Descubrimiento
            </button>
          </Link>
        </div>
      </section>
    </main>
  );
}
