import ContactForm from "./ContactForm";

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

        <ContactForm />

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
