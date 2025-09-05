"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";

/* --------------------------- UI primitives --------------------------- */
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
/* -------------------------------------------------------------------- */

type Testimonio = {
  quote: string;
  name: string;
  context?: string;
  year?: string;
};

const TESTIMONIOS: Testimonio[] = [
  {
    quote:
      "Trabajar con Fanny y su equipo cambió cómo tomamos decisiones con el dinero. Por fin entendemos nuestros patrones y tenemos un plan que sí seguimos. El enfoque con Diseño Humano hizo que los próximos pasos se sintieran simples y alineados.",
    name: "Luisa & Javier",
    context: "Toronto — Plan para primera inversión",
    year: "2024",
  },
  {
    quote:
      "La guía holística y cuidadosa de Fanny nos ayudó a transformar la ansiedad financiera en calma y claridad. La combinación de pericia y compasión nos hizo sentir acompañados en cada paso.",
    name: "María & Carlos",
    context: "Toronto — Estrategia de flujo de caja y deudas",
    year: "2023",
  },
  {
    quote:
      "Después de años probando herramientas que no se quedaban, esta fue la primera vez que un plan se sintió natural. La mezcla de escucha profunda, estructura clara y coaching sensible al comportamiento nos destrabó como familia.",
    name: "Sofía & Andrés",
    context: "Mississauga — Presupuesto alineado a valores",
    year: "2023",
  },
];

/* ------------------------------- Animations ------------------------------- */
const fadeUp = { opacity: 0, y: 20 };
const fadeUpVisible = { opacity: 1, y: 0 };
const listVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08, when: "beforeChildren" },
  },
} as const;
const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
} as const;
/* ------------------------------------------------------------------------- */

export default function Testimonios() {
  // JSON-LD (esquema de reseñas sin calificación numérica)
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
        <motion.div
          initial={fadeUp}
          animate={fadeUpVisible}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <Panel>
            <SectionTitle
              title="Historias de Transformación Financiera"
              subtitle="Testimonios reales compartidos con permiso. Cada proceso es único — estas voces resaltan la mezcla de claridad, estructura y compasión que guía nuestro trabajo."
            />
            <p className="text-sm text-brand-body/80 text-center">
              Las citas pueden estar ligeramente editadas por claridad. Los resultados varían según cada situación.
            </p>
          </Panel>
        </motion.div>
      </section>

      {/* Lista de testimonios */}
      <section className="px-4 mt-8">
        <motion.div
          initial={fadeUp}
          animate={fadeUpVisible}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
        >
          <Panel>
            <motion.div
              variants={listVariants}
              initial="hidden"
              animate="show"
              className="space-y-6"
            >
              {TESTIMONIOS.map(({ quote, name, context, year }, i) => (
                <motion.figure
                  key={`${name}-${i}`}
                  variants={itemVariants}
                  className="border-l-4 border-brand-green pl-6 py-5 bg-brand-beige/80 rounded-2xl shadow-lg"
                >
                  <blockquote className="italic mb-3 text-lg md:text-xl text-brand-green">
                    “{quote}”
                  </blockquote>
                  <figcaption className="font-semibold text-brand-green">
                    — {name}
                    {context ? (
                      <span className="text-brand-body/80 font-normal">, {context}</span>
                    ) : null}
                    {year ? (
                      <span className="text-brand-body/60 font-normal"> · {year}</span>
                    ) : null}
                  </figcaption>
                </motion.figure>
              ))}
            </motion.div>

            {/* CTA */}
            <div className="text-center mt-10">
              <Link
                href="/es/contacto?service=llamada-descubrimiento"
                className="inline-block px-8 py-3 bg-brand-gold text-brand-green font-serif font-bold rounded-full shadow-lg hover:bg-brand-blue hover:text-white transition text-base md:text-lg tracking-wide"
                aria-label="Agenda tu llamada de descubrimiento"
              >
                Agenda tu Llamada de Descubrimiento
              </Link>
            </div>
          </Panel>
        </motion.div>
      </section>

      {/* JSON-LD */}
      <script
        type="application/ld+json"
         
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </main>
  );
}
