// app/es/testimonios/page.tsx
"use client";

import * as React from "react";
import Link from "next/link";

// ✅ Primitivas de animación seguras para hidratar
import { Reveal, StaggerGroup, useMotionPresets } from "@/components/motion-safe";
import {
  HubPanel as Panel,
  HubSectionTitle as SectionTitle,
  PageHero,
  ctaButtonClass,
} from "@/components/sections/hub";

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
  const { fadeUp } = useMotionPresets();

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
      <PageHero
        homeHref="/es"
        homeLabel="Inicio"
        currentLabel="Testimonios"
        title="Historias de Transformación Financiera"
        subtitle="Testimonios reales compartidos con permiso. Cada camino es único-estas reflexiones muestran la mezcla de claridad, estructura y compasión en el corazón de nuestro trabajo."
        primaryCta={{ label: "Reservar llamada de descubrimiento", href: "/es/contacto?intent=consult" }}
        secondaryCta={{ label: "Explorar servicios", href: "/es/servicios", variant: "secondary" }}
      />

      {/* Lista de testimonios */}
      <section className="px-4 mt-8">
        <Panel>
          <SectionTitle
            id="historias"
            tint="green"
            title="Historias de clientes"
            subtitle="Las citas pueden estar ligeramente editadas por claridad. Los resultados varían según las circunstancias de cada persona."
          />

          <StaggerGroup className="space-y-6">
            {TESTIMONIOS.map(({ quote, name, context, year }, i) => (
              <Reveal key={`${name}-${i}`} variants={fadeUp}>
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
              className={ctaButtonClass("primary")}
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
