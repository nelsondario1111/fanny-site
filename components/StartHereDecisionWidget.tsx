"use client";

import Link from "next/link";

type Lang = "en" | "es";

type StartHereDecisionWidgetProps = {
  lang: Lang;
  className?: string;
};

type DecisionOption = {
  label: string;
  href: string;
};

type DecisionBucket = {
  title: string;
  subtitle: string;
  options: DecisionOption[];
};

const COPY: Record<
  Lang,
  {
    title: string;
    subtitle: string;
    buckets: DecisionBucket[];
  }
> = {
  en: {
    title: "What are you here for?",
    subtitle: "Choose the pathway that fits your current priority.",
    buckets: [
      {
        title: "Mortgage",
        subtitle: "buy / refinance / invest 4-10",
        options: [
          { label: "Buy a home", href: "/en/services#mortgage" },
          { label: "Refinance or renew", href: "/en/services#mortgage" },
          { label: "Invest 4-10 units", href: "/en/tools/multiplex-readiness" },
        ],
      },
      {
        title: "Tax",
        subtitle: "10-year review / season prep / business",
        options: [
          { label: "10-year review", href: "/en/tax-review" },
          { label: "Tax season prep", href: "/en/tools/tax-prep" },
          { label: "Business tax strategy", href: "/en/services#business" },
        ],
      },
      {
        title: "Money Strategy",
        subtitle: "cash-flow / debt / systems",
        options: [
          { label: "Cash-flow plan", href: "/en/tools/budget-cashflow" },
          { label: "Debt strategy", href: "/en/tools/debt-snowball" },
          { label: "Financial systems", href: "/en/services#strategic-maps" },
        ],
      },
    ],
  },
  es: {
    title: "Que buscas hoy?",
    subtitle: "Elige la ruta que mejor encaje con tu prioridad actual.",
    buckets: [
      {
        title: "Hipoteca",
        subtitle: "comprar / refinanciar / invertir 4-10",
        options: [
          { label: "Comprar vivienda", href: "/es/servicios#mortgage" },
          { label: "Refinanciar o renovar", href: "/es/servicios#mortgage" },
          { label: "Invertir en 4-10 unidades", href: "/es/herramientas/preparacion-multiplex" },
        ],
      },
      {
        title: "Impuestos",
        subtitle: "revision 10 anos / temporada / negocio",
        options: [
          { label: "Revision de 10 anos", href: "/es/revision-impuestos" },
          { label: "Preparacion de temporada", href: "/es/herramientas/preparacion-impuestos" },
          { label: "Estrategia fiscal para negocio", href: "/es/servicios#business" },
        ],
      },
      {
        title: "Estrategia financiera",
        subtitle: "flujo / deuda / sistemas",
        options: [
          { label: "Plan de flujo de caja", href: "/es/herramientas/presupuesto-flujo" },
          { label: "Estrategia de deuda", href: "/es/herramientas/deuda-bola-nieve" },
          { label: "Sistemas financieros", href: "/es/servicios#strategic-maps" },
        ],
      },
    ],
  },
};

export default function StartHereDecisionWidget({
  lang,
  className = "",
}: StartHereDecisionWidgetProps) {
  const copy = COPY[lang];

  return (
    <section
      className={`rounded-3xl border border-brand-gold/35 bg-white/95 p-6 md:p-8 shadow-sm ${className}`.trim()}
      aria-label={copy.title}
    >
      <div className="text-center">
        <h2 className="font-brand text-2xl md:text-3xl font-semibold tracking-tight text-brand-green">
          {copy.title}
        </h2>
        <p className="mt-2 text-brand-blue/90">{copy.subtitle}</p>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {copy.buckets.map((bucket) => (
          <article
            key={bucket.title}
            className="rounded-2xl border border-brand-gold/30 bg-brand-gold/5 p-4"
          >
            <h3 className="font-sans text-xl text-brand-green font-semibold">{bucket.title}</h3>
            <p className="mt-1 text-xs uppercase tracking-wide text-brand-blue/75">{bucket.subtitle}</p>

            <div className="mt-4 flex flex-col gap-2">
              {bucket.options.map((option) => (
                <Link
                  key={`${bucket.title}-${option.label}`}
                  href={option.href}
                  className="inline-flex items-center justify-center rounded-full border border-brand-blue/35 bg-white px-3 py-2 text-sm font-semibold text-brand-blue transition hover:bg-brand-blue hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue/40"
                  data-track="cta_click"
                  data-track-type="pathway"
                  data-track-label={option.label}
                >
                  {option.label}
                </Link>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
