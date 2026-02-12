// app/es/para-profesionales/page.tsx
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Para Profesionales — Planificación clara y de confianza",
  description:
    "Pre-aprobación concierge, orden de flujo de caja y pasos fiscales inteligentes para familias e individuos profesionales en el GTA—bilingüe, práctico y sereno.",
  alternates: {
    languages: {
      es: "/es/para-profesionales",
      en: "/en/for-professionals",
    },
  },
  openGraph: {
    title: "Para Profesionales — Planificación clara y de confianza",
    description:
      "Pre-aprobación concierge, orden de flujo de caja y pasos fiscales inteligentes para profesionales en Toronto.",
    images: ["/og-fanny-coaching.png"],
  },
};

export default function Page() {
  return (
    <main id="main" className="min-h-screen bg-brand-beige">
      <section className="bg-brand-green/5 border-b border-brand-gold/30">
        <div className="max-w-screen-xl mx-auto px-4 py-10">
          <nav className="mb-3 text-sm text-brand-blue/80">
            <a href="/es" className="hover:underline">Inicio</a>
            <span className="mx-2">/</span>
            <span className="text-brand-green">Para Profesionales</span>
          </nav>
          <h1 className="font-brand text-3xl md:text-4xl font-semibold tracking-tight text-brand-green">
            Planificación de confianza para profesionales ocupados
          </h1>
          <p className="mt-3 max-w-3xl text-brand-blue/90">
            Pre-aprobación concierge, orden de flujo de caja y decisiones fiscales inteligentes—con cuidado humano para que tu próximo paso sea claro.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              href="/es/contacto"
              className="inline-flex items-center gap-2 rounded-full bg-brand-gold text-brand-green px-4 py-2 font-semibold hover:opacity-90"
            >
              Reserva tu llamada de descubrimiento
            </Link>
            <Link
              href="/es/recursos"
              className="inline-flex items-center gap-2 rounded-full border border-brand-gold/40 px-4 py-2 text-brand-green hover:bg-neutral-50"
            >
              Ver recursos
            </Link>
          </div>
        </div>
      </section>

      <section className="py-10">
        <div className="max-w-screen-xl mx-auto px-4 grid gap-6 md:grid-cols-2">
          {[
            {
              title: "Empieza aquí (45 segundos)",
              body:
                "Contame tu objetivo y tu tiempo. Te muestro el camino más corto y qué te vamos a resolver—antes de pedir documentos.",
              bullets: ["Objetivo y timing", "Sensación vs. matemática", "Próximos 2–3 pasos"],
            },
            {
              title: "Pre-aprobación sin caos",
              body:
                "Traduzco requisitos de prestamistas en un flujo claro: qué juntamos, qué ves y cuándo firmás.",
              bullets: ["Escenarios de stress-test", "Match de prestamistas", "Tasación hasta el cierre"],
            },
            {
              title: "Plan de primera vivienda (con FHSA)",
              body:
                "Ahorro inteligente y una cuota que no te apriete. Mapeamos anticipo, FHSA en pareja y condiciones que te protegen.",
              bullets: ["FHSA + ritmo de ahorro", "Asequibilidad y margen", "Condiciones de oferta seguras"],
            },
            {
              title: "Independiente, pero simple",
              body:
                "Ritmo de 90 días, papeles limpios y plan fiscal tranquilo—para que prestamistas y CRA vean una historia creíble.",
              bullets: ["Orden de flujo de caja", "Aparte de impuestos realista", "Registros listos para revisión"],
            },
          ].map((c) => (
            <div key={c.title} className="rounded-3xl border border-brand-gold/40 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-brand-green">{c.title}</h2>
              <p className="mt-2 text-brand-blue/90">{c.body}</p>
              <ul className="mt-3 list-disc pl-5 text-sm text-brand-blue/90 space-y-1">
                {c.bullets.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="py-4">
        <div className="max-w-screen-xl mx-auto px-4 rounded-3xl border border-brand-gold/40 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-brand-green">Cómo trabajamos (concierge)</h2>
          <div className="mt-4 grid gap-6 md:grid-cols-3">
            {[
              {
                step: "1",
                title: "Llamada de claridad (20–30 min)",
                body:
                  "Alineamos objetivo, tiempos y límites. Te envío un checklist preciso—solo lo necesario.",
              },
              {
                step: "2",
                title: "Pre-aprobación y plan (1–2 semanas)",
                body:
                  "Modelo escenarios (tasas, plazos, margen), elijo prestamistas y mantengo documentación liviana.",
              },
              {
                step: "3",
                title: "Oferta y cierre (2–4 semanas+)",
                body:
                  "Guiones y condiciones que te cuidan, y te acompaño en tasación y cierre.",
              },
            ].map((s) => (
              <div key={s.step} className="rounded-2xl border border-brand-gold/30 p-4">
                <div className="text-xs font-semibold text-brand-blue/70">Paso {s.step}</div>
                <h3 className="mt-1 text-lg font-semibold text-brand-green">{s.title}</h3>
                <p className="mt-1 text-sm text-brand-blue/90">{s.body}</p>
              </div>
            ))}
          </div>
          <div className="mt-5">
            <Link
              href="/es/contacto"
              className="inline-flex items-center gap-2 rounded-full bg-brand-gold text-brand-green px-4 py-2 font-semibold hover:opacity-90"
            >
              Reserva tu llamada de descubrimiento
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ visible + JSON-LD */}
      <section className="py-10">
        <div className="max-w-screen-xl mx-auto px-4 grid gap-6 md:grid-cols-2">
          {[
            {
              q: "¿Podemos hacerlo completamente en inglés o español?",
              a: "Sí—todo puede ser EN o ES. Siempre tendrás un resumen claro del próximo paso.",
            },
            {
              q: "¿Trabajás con titulares de permiso de trabajo y PR?",
              a: "Sí. Aclaro documentos desde el inicio para que la pre-aprobación sea fluida y predecible.",
            },
            {
              q: "¿Y si soy independiente?",
              a: "Ordenamos flujo de caja, papeles limpios y una historia creíble para prestamistas.",
            },
            {
              q: "¿Qué pasa después de la llamada de descubrimiento?",
              a: "Recibís un plan corto con pasos, tiempos realistas y los documentos exactos que vamos a pedir.",
            },
          ].map((f) => (
            <div key={f.q} className="rounded-3xl border border-brand-gold/40 bg-white p-6 shadow-sm">
              <h3 className="font-semibold text-brand-green">{f.q}</h3>
              <p className="mt-2 text-brand-blue/90">{f.a}</p>
            </div>
          ))}
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "¿Podemos hacerlo completamente en inglés o español?",
                "acceptedAnswer": { "@type": "Answer", "text": "Sí—todo puede ser EN o ES. Siempre tendrás un resumen claro del próximo paso." }
              },
              {
                "@type": "Question",
                "name": "¿Trabajás con titulares de permiso de trabajo y PR?",
                "acceptedAnswer": { "@type": "Answer", "text": "Sí. Aclaro documentos desde el inicio para que la pre-aprobación sea fluida y predecible." }
              },
              {
                "@type": "Question",
                "name": "¿Y si soy independiente?",
                "acceptedAnswer": { "@type": "Answer", "text": "Ordenamos flujo de caja, papeles limpios y una historia creíble para prestamistas." }
              },
              {
                "@type": "Question",
                "name": "¿Qué pasa después de la llamada de descubrimiento?",
                "acceptedAnswer": { "@type": "Answer", "text": "Recibís un plan corto con pasos, tiempos realistas y los documentos exactos que vamos a pedir." }
              }
            ],
          }),
        }}
      />
    </main>
  );
}
