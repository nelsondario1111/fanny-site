// --- SEO METADATA (Next.js 13/14 App Router) --- //
export const metadata = {
  title: "Contacto | Fanny Samaniego Coaching – Agenda tu Sesión de Descubrimiento Gratis",
  description:
    "Ponte en contacto con Fanny Samaniego para coaching financiero holístico. Agenda tu sesión gratis, envía preguntas o comunícate por WhatsApp o correo electrónico—español o inglés.",
  openGraph: {
    title: "Contacto | Fanny Samaniego Coaching",
    description:
      "Contacta a Fanny para coaching financiero holístico. Agenda una sesión gratis, envía preguntas o escribe por WhatsApp/correo.",
    url: "https://fannysamaniego.com/es/contacto",
    siteName: "Fanny Samaniego Coaching",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Contacto | Fanny Samaniego Coaching",
    description:
      "Agenda tu llamada gratis o envía tu mensaje a Fanny Samaniego, coach financiera holística.",
  },
};

export default function Contacto() {
  return (
    <main className="bg-brand-beige min-h-screen py-20">
      <section className="max-w-3xl mx-auto bg-white/90 rounded-3xl shadow-xl p-10 border border-brand-gold">
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-brand-green mb-8 text-center tracking-tight">
          Conectemos y Transforma tu Vida Financiera
        </h1>
        <p className="mb-10 text-brand-green text-center text-lg">
          Me encantaría escucharte. Agenda una sesión de descubrimiento gratis, envía tus preguntas o comunícate directamente por WhatsApp.
        </p>

        {/* Formulario de Contacto */}
        <form className="bg-brand-beige/70 rounded-2xl p-8 mb-12 shadow-lg border border-brand-gold/40 space-y-5 max-w-xl mx-auto">
          <div>
            <label className="block font-semibold mb-1 text-brand-blue" htmlFor="name">Nombre</label>
            <input
              className="w-full p-3 rounded-xl border border-brand-green/30 bg-white focus:border-brand-gold focus:ring-2 focus:ring-brand-gold transition text-brand-green"
              type="text"
              id="name"
              name="name"
              autoComplete="off"
            />
          </div>
          <div>
            <label className="block font-semibold mb-1 text-brand-blue" htmlFor="email">Correo electrónico</label>
            <input
              className="w-full p-3 rounded-xl border border-brand-green/30 bg-white focus:border-brand-gold focus:ring-2 focus:ring-brand-gold transition text-brand-green"
              type="email"
              id="email"
              name="email"
              autoComplete="off"
            />
          </div>
          <div>
            <label className="block font-semibold mb-1 text-brand-blue" htmlFor="phone">Teléfono</label>
            <input
              className="w-full p-3 rounded-xl border border-brand-green/30 bg-white focus:border-brand-gold focus:ring-2 focus:ring-brand-gold transition text-brand-green"
              type="tel"
              id="phone"
              name="phone"
              autoComplete="off"
            />
          </div>
          {/* Dropdown de Paquete/Servicio */}
          <div>
            <label className="block font-semibold mb-1 text-brand-blue" htmlFor="servicio">
              ¿Qué servicio o paquete te interesa?
            </label>
            <select
              className="w-full p-3 rounded-xl border border-brand-green/30 bg-white focus:border-brand-gold focus:ring-2 focus:ring-brand-gold transition text-brand-green"
              id="servicio"
              name="servicio"
              defaultValue=""
              required
            >
              <option value="" disabled>
                Selecciona una opción...
              </option>
              <option value="Solo quiero conectar">Solo quiero conectar / No estoy seguro aún</option>
              <option value="Llamada de Descubrimiento">Llamada de Descubrimiento (Gratis)</option>
              <option value="Sesión de Claridad Financiera">Sesión de Claridad Financiera</option>
              <option value="Paquete Bienestar 3 Meses">Paquete Bienestar 3 Meses</option>
              <option value="Paquete Holístico 6 Meses">Paquete Holístico 6 Meses</option>
              <option value="Retención Continua">Retención Continua (Solo ex-clientes)</option>
              <option value="Círculo de Dinero">Círculo de Dinero</option>
              <option value="Taller">Taller (Comunidad/Corporativo)</option>
              <option value="Otro">Otro (describir abajo)</option>
            </select>
          </div>
          <div>
            <label className="block font-semibold mb-1 text-brand-blue" htmlFor="message">Mensaje</label>
            <textarea
              className="w-full p-3 rounded-xl border border-brand-green/30 bg-white focus:border-brand-gold focus:ring-2 focus:ring-brand-gold transition text-brand-green"
              id="message"
              name="message"
              rows={4}
              placeholder="Cuéntame cómo puedo ayudarte, o deja cualquier pregunta."
            ></textarea>
          </div>
          <button
            type="submit"
            className="w-full px-8 py-3 bg-brand-gold text-brand-green rounded-full font-serif font-bold shadow-lg hover:bg-brand-blue hover:text-white transition text-lg"
          >
            Invitame
          </button>
        </form>

        {/* Contacto Directo */}
        <div className="bg-white rounded-2xl p-6 shadow text-brand-green text-center space-y-2 border border-brand-gold/40">
          <div>
            <span className="font-semibold">Correo:</span>{" "}
            <a className="underline hover:text-brand-blue transition" href="mailto:info@fannysamaniego.com">
              info@fannysamaniego.com
            </a>
          </div>
          <div>
            <span className="font-semibold">WhatsApp:</span>{" "}
            <a className="underline hover:text-brand-blue transition" href="https://wa.me/14167268420" target="_blank" rel="noopener noreferrer">
              (416) 726-8420
            </a>
          </div>
          <div>
            <span className="font-semibold">Teléfono:</span>{" "}
            <a className="underline hover:text-brand-blue transition" href="tel:4167268420">
              (416) 726-8420
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
