// app/es/testimonios/page.tsx
"use client";

import * as React from "react";
import Link from "next/link";

// ✅ Primitivas de animación seguras para hidratar
import { Reveal, StaggerGroup } from "@/components/motion-safe";

/* --------------------------- UI local --------------------------- */
function Panel({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={[
        "max-w-4xl mx-auto px-5 sm:px-8 py-10 sm:py-14",
        "bg-white/95 rounded-[28px] border border-brand-gold shadow-xl",
        "backdrop-blur-[1px]",
        className,
      ].join(" ")}
    >
      {children}
    </div>
  );
}

function SectionTitle({
  title,
  subtitle,
  center = true,
}: {
  title: string;
  subtitle?: React.ReactNode;
  center?: boolean;
}) {
  return (
    <header className={center ? "text-center mb-6" : "mb-6"}>
      <h1 className="font-serif font-extrabold text-4xl md:text-5xl text-brand-green tracking-tight">
        {title}
      </h1>
      <div className="flex justify-center my-4" aria-hidden="true">
        <div className="w-16 h-[3px] rounded-full bg-brand-gold" />
      </div>
      {subtitle && (
        <p className="text-brand-blue/90 text-lg md:text-xl max-w-2xl mx-auto">{subtitle}</p>
      )}
    </header>
  );
}
/* ---------------------------------------------------------------- */

type Testimonial = {
  quote: string;
  name: string;
  context?: string;
  year?: string;
};

const TESTIMONIOS: Testimonial[] = [
  {
    quote:
      "Trabajar con Fanny y su equipo cambió la forma en que tomamos decisiones con el dinero. Por fin entendemos nuestros propios patrones y tenemos un plan que sí seguimos. El enfoque informado por Human Design hizo que los siguientes pasos se sintieran simples y alineados.",
    name: "Luisa & Javier",
    context: "Toronto — Planificación de inversión por primera vez",
    year: "2024",
  },
  {
    quote:
      "La guía reflexiva e integral de Fanny nos ayudó a convertir la ansiedad financiera en calma y claridad. La combinación de experiencia y compasión nos hizo sentir acompañados en cada paso.",
    name: "María & Carlos",
    context: "Toronto — Flujo de caja familiar y estrategia de deudas",
    year: "2023",
  },
  {
    quote:
      "Tras años probando herramientas que no perduraban, esta fue la primera vez que un plan se sintió natural. La mezcla de escucha profunda, estructura clara y acompañamiento consciente del comportamiento nos desbloqueó como familia.",
    name: "Sofía & Andrés",
    context: "Mississauga — Presupuesto alineado a valores",
    year: "2023",
  },
];

/* --------------------------------- Página --------------------------------- */
export default function TestimonialsPage() {
  // JSON-LD para SEO (Review schema sin calificaciones)
  const jsonLd = React.useMemo(() => {
    const reviews = TESTIMONIOS.map((t) => ({
      "@type": "Review",
      reviewBody: t.quote,
      author: { "@type": "Person", name: t.name },
      datePublished: t.year ? `${t.year}-01-01` : undefined,
      about: t.context,
      itemReviewed: {
        "@type": "Service",
        name: "Coaching Financiero Holístico",
        provider: { "@type": "Organization", name: "Fanny Samaniego" },
      },
    }));
    return {
      "@context": "https://schema.org",
      "@type": "ItemList",
      itemListElement: reviews.map((r, idx) => ({
        "@type": "ListItem",
        position: idx + 1,
        item: r,
      })),
    };
  }, []);

  return (
    <main className="bg-brand-beige min-h-screen pb-16">
      {/* Hero */}
      <section className="pt-10 px-4">
        <Reveal>
          <Panel>
            <SectionTitle
              title="Historias de Transformación Financiera"
              subtitle="Testimonios reales compartidos con permiso. Cada camino es único—estas reflexiones muestran la mezcla de claridad, estructura y compasión que está en el corazón de nuestro trabajo."
            />
            <p className="text-sm text-brand-body/80 text-center">
              Las citas pueden estar ligeramente editadas por claridad. Los resultados varían según las circunstancias de cada persona.
            </p>
          </Panel>
        </Reveal>
      </section>

      {/* Lista de testimonios */}
      <section className="px-4 mt-8">
        <Panel>
          <StaggerGroup className="space-y-6">
            {TESTIMONIOS.map(({ quote, name, context, year }, i) => (
              <Reveal key={`${name}-${i}`}>
                <figure className="border-l-4 border-brand-green pl-6 py-5 bg-brand-beige/80 rounded-2xl shadow-lg">
                  <blockquote className="italic mb-3 text-lg md:text-xl text-brand-green">“{quote}”</blockquote>
                  <figcaption className="font-semibold text-brand-green">
                    — {name}
                    {context ? <span className="text-brand-body/80 font-normal">, {context}</span> : null}
                    {year ? <span className="text-brand-body/60 font-normal"> · {year}</span> : null}
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </StaggerGroup>

          {/* CTA */}
          <div className="text-center mt-10">
            <Link
              href="/es/contacto?intent=consult"
              className="inline-block px-8 py-3 bg-brand-gold text-brand-green font-serif font-bold rounded-full shadow-lg hover:bg-brand-blue hover:text-white transition text-base md:text-lg tracking-wide"
              aria-label="Reservar una consulta gratuita"
            >
              Reserva una consulta gratuita
            </Link>
          </div>
        </Panel>
      </section>

      {/* JSON-LD */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </main>
  );
}
