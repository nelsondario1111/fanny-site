import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  CalendarClock,
  CheckCircle2,
  Coins,
  Globe2,
  Hourglass,
  Sparkles,
} from "lucide-react";
import { getServiceDetail, getServiceIds } from "@/lib/services/details";

type PageParams = { service: string };

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, "") ||
  "https://www.fannysamaniego.com";

function absolute(path: string) {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

function packageHref(title: string) {
  const qs = new URLSearchParams();
  qs.set("intent", "package");
  qs.set("package", title);
  return `/es/contacto?${qs.toString()}`;
}

export function generateStaticParams(): PageParams[] {
  return getServiceIds("es").map((service) => ({ service }));
}

export async function generateMetadata(
  { params }: { params: Promise<PageParams> }
): Promise<Metadata> {
  const { service } = await params;
  const detail = getServiceDetail("es", service);
  if (!detail) return {};

  const path = `/es/servicios/${service}`;
  const esUrl = absolute(path);
  const enUrl = absolute(`/en/services/${service}`);
  const description = `${detail.subtitle} ${detail.outcome}`;

  return {
    title: `${detail.title} | Detalle del servicio`,
    description,
    alternates: {
      canonical: esUrl,
      languages: {
        "es-CA": esUrl,
        "en-CA": enUrl,
      },
    },
    openGraph: {
      title: `${detail.title} | Fanny Samaniego`,
      description,
      url: esUrl,
      type: "website",
      locale: "es_CA",
      siteName:
        "Fanny Samaniego — Consultora Financiera Holística | Impuestos • Hipotecas • Estrategia financiera",
    },
    twitter: {
      card: "summary_large_image",
      creator: "@fannysamaniego",
      title: `${detail.title} | Fanny Samaniego`,
      description,
    },
  };
}

export default async function ServiceDetailPage(
  { params }: { params: Promise<PageParams> }
) {
  const { service } = await params;
  const detail = getServiceDetail("es", service);
  if (!detail) notFound();

  const discoveryHref =
    "/es/contacto?intent=consult&package=Llamada%20de%20Descubrimiento%20Gratis%20(15%20min)";
  const CTA_PRIMARY_CLASS =
    "inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-full bg-brand-green text-white font-semibold border border-brand-green/20 shadow-[0_8px_20px_rgba(47,74,53,0.2)] hover:-translate-y-[1px] hover:bg-brand-green/90 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold";
  const CTA_SECONDARY_CLASS =
    "inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-full border border-brand-green/30 bg-white text-brand-green font-semibold shadow-sm hover:bg-brand-green/5 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green/40";
  const CTA_GHOST_CLASS =
    "inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-full border border-brand-gold/40 bg-white text-brand-green font-semibold hover:bg-brand-gold/15 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold";
  const PANEL_CLASS =
    "rounded-3xl border border-brand-gold/30 bg-white/95 shadow-[0_12px_30px_rgba(47,74,53,0.1)]";
  const isStrategicMapTier = detail.id === "map-tier-1" || detail.id === "map-tier-2" || detail.id === "map-tier-3";
  const strategicMapRows = [
    {
      id: "map-tier-1",
      tier: "Nivel 1",
      investment: "$2,500 CAD",
      timeline: "2-6 semanas",
      focus: "Una meta prioritaria",
    },
    {
      id: "map-tier-2",
      tier: "Nivel 2",
      investment: "$3,500 CAD",
      timeline: "8-12 semanas",
      focus: "Plan integrado de múltiples prioridades",
    },
    {
      id: "map-tier-3",
      tier: "Nivel 3",
      investment: "$5,000 CAD",
      timeline: "3-6 meses",
      focus: "Estrategia holística de largo plazo",
    },
  ] as const;

  return (
    <main className="min-h-screen bg-brand-beige pb-16">
      <section className="relative overflow-hidden bg-gradient-to-b from-brand-green/10 via-brand-green/5 to-brand-beige border-b border-brand-gold/30">
        <div className="max-w-content mx-auto px-4 py-11 sm:py-12">
          <nav className="mb-4 text-xs sm:text-sm text-brand-blue/80" aria-label="Breadcrumb">
            <Link href="/es" className="hover:underline">Inicio</Link>
            <span className="mx-2">/</span>
            <Link href="/es/servicios" className="hover:underline">Servicios</Link>
            <span className="mx-2">/</span>
            <span className="text-brand-green">{detail.title}</span>
          </nav>

          <h1 className="max-w-4xl font-brand text-3xl md:text-5xl font-semibold tracking-tight text-brand-green">
            {detail.title}
          </h1>
          <p className="mt-3 max-w-2xl text-base md:text-lg leading-relaxed text-brand-blue/90">
            {detail.subtitle}
          </p>

          <div className="mt-5 flex flex-wrap gap-2 text-xs">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-gold/40 bg-white/90 px-3 py-1.5 text-brand-green">
              <Coins size={13} aria-hidden /> Inversión: {detail.price}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-gold/40 bg-white/90 px-3 py-1.5 text-brand-blue/85">
              <Hourglass size={13} aria-hidden /> Duración: {detail.duration}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-gold/40 bg-white/90 px-3 py-1.5 text-brand-blue/85">
              <Globe2 size={13} aria-hidden /> Idioma: ES/EN
            </span>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href={packageHref(detail.packageTitle)}
              className={CTA_PRIMARY_CLASS}
            >
              <Sparkles size={14} aria-hidden />
              {detail.primaryCtaLabel}
            </Link>
            <Link
              href={discoveryHref}
              className={CTA_SECONDARY_CLASS}
            >
              <CalendarClock size={14} aria-hidden />
              Reservar llamada de descubrimiento
            </Link>
            <Link
              href="/es/servicios"
              className={CTA_GHOST_CLASS}
            >
              <ArrowLeft size={14} aria-hidden />
              Volver a servicios
            </Link>
          </div>
        </div>
      </section>

      <section className="px-4 py-8 lg:py-12">
        <div className="max-w-content mx-auto grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
          <article className="space-y-5">
            <section className={`${PANEL_CLASS} p-6 md:p-7`}>
              <h2 className="font-brand text-2xl text-brand-green">Ideal Para</h2>
              <ul className="mt-4 space-y-2.5">
                {detail.idealFor.map((item) => (
                  <li key={`${detail.id}-ideal-${item}`} className="flex items-start gap-2.5 text-brand-blue/90">
                    <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-brand-green/80" aria-hidden />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section className={`${PANEL_CLASS} p-6 md:p-7`}>
              <h2 className="font-brand text-2xl text-brand-green">Qué Incluye</h2>
              <ul className="mt-4 space-y-2.5">
                {detail.includes.map((item) => (
                  <li key={`${detail.id}-includes-${item}`} className="flex items-start gap-2.5 text-brand-blue/90">
                    <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-brand-green/80" aria-hidden />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section className={`${PANEL_CLASS} p-6 md:p-7`}>
              <h2 className="font-brand text-2xl text-brand-green">Cómo Funciona</h2>
              <ol className="mt-4 space-y-2.5">
                {detail.process.map((item, index) => (
                  <li key={`${detail.id}-process-${item}`} className="flex items-start gap-3 text-brand-blue/90">
                    <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-brand-gold/45 bg-white text-xs font-semibold text-brand-green">
                      {index + 1}
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ol>
            </section>

            <section className={`${PANEL_CLASS} p-6 md:p-7`}>
              <h2 className="font-brand text-2xl text-brand-green">Resultado Esperado</h2>
              <p className="mt-4 leading-relaxed text-brand-blue/90">{detail.outcome}</p>
            </section>

            {isStrategicMapTier && (
              <section className={`${PANEL_CLASS} overflow-hidden`}>
                <div className="p-6 md:p-7 pb-0">
                  <h2 className="font-brand text-2xl text-brand-green">Comparativo rápido de niveles</h2>
                  <p className="mt-2 text-sm text-brand-blue/85">
                    Compara los tres niveles de mapa estratégico y elige el alcance que mejor encaja con tu etapa actual.
                  </p>
                </div>
                <div className="mt-4 overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead className="bg-brand-green/5 border-y border-brand-gold/25">
                      <tr>
                        <th className="px-4 py-3 text-left font-semibold text-brand-green">Nivel</th>
                        <th className="px-4 py-3 text-left font-semibold text-brand-green">Inversión</th>
                        <th className="px-4 py-3 text-left font-semibold text-brand-green">Tiempo típico</th>
                        <th className="px-4 py-3 text-left font-semibold text-brand-green">Ideal para</th>
                      </tr>
                    </thead>
                    <tbody>
                      {strategicMapRows.map((row) => {
                        const active = row.id === detail.id;
                        return (
                          <tr
                            key={row.id}
                            className={[
                              "border-b border-brand-gold/20 last:border-b-0",
                              active ? "bg-brand-green/10" : "bg-white",
                            ].join(" ")}
                          >
                            <td className="px-4 py-3 text-brand-green font-semibold">
                              {row.tier} {active ? "• Actual" : ""}
                            </td>
                            <td className="px-4 py-3 text-brand-blue/90">{row.investment}</td>
                            <td className="px-4 py-3 text-brand-blue/90">{row.timeline}</td>
                            <td className="px-4 py-3 text-brand-blue/90">{row.focus}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                <div className="px-6 py-4 border-t border-brand-gold/20">
                  <Link
                    href="/es/servicios#strategic-maps"
                    className="text-sm text-brand-blue hover:text-brand-green underline underline-offset-4"
                  >
                    Comparar todos los Mapas Estratégicos en la página de servicios
                  </Link>
                </div>
              </section>
            )}

            {detail.scopeNote && (
              <section className="rounded-2xl border border-brand-gold/45 bg-brand-gold/12 p-5">
                <h2 className="text-sm font-semibold tracking-wide uppercase text-brand-blue/85">
                  Nota de alcance
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-brand-blue/90">{detail.scopeNote}</p>
              </section>
            )}
          </article>

          <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
            <section className={`${PANEL_CLASS} p-5`}>
              <h2 className="font-brand text-xl text-brand-green">Resumen Rápido</h2>
              <dl className="mt-3 space-y-2 text-sm text-brand-blue/85">
                <div>
                  <dt className="font-semibold text-brand-green">Servicio</dt>
                  <dd>{detail.title}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-brand-green">Inversión</dt>
                  <dd>{detail.price}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-brand-green">Duración</dt>
                  <dd>{detail.duration}</dd>
                </div>
              </dl>
            </section>

            <section className="rounded-3xl border border-brand-gold/35 bg-brand-green/8 shadow-[0_10px_24px_rgba(47,74,53,0.08)] p-5">
              <h2 className="font-brand text-xl text-brand-green">Idioma</h2>
              <p className="mt-3 text-sm text-brand-blue/90">
                Esta página también está disponible en inglés.
              </p>
              <Link
                href={`/en/services/${detail.id}`}
                className="mt-3 inline-flex items-center rounded-full px-4 py-2 text-sm border border-brand-green text-brand-green hover:bg-brand-green hover:text-white transition"
              >
                Ver en inglés
              </Link>
            </section>

            <section className={`${PANEL_CLASS} p-5`}>
              <h2 className="font-brand text-xl text-brand-green">¿Necesitas elegir mejor?</h2>
              <p className="mt-3 text-sm text-brand-blue/90">
                Si este servicio se siente cercano pero no exacto, empieza con una llamada de descubrimiento y te guiamos con claridad.
              </p>
              <Link href={discoveryHref} className={`mt-4 w-full ${CTA_PRIMARY_CLASS}`}>
                <CalendarClock size={14} aria-hidden />
                Empezar con descubrimiento
              </Link>
            </section>
          </aside>
        </div>
      </section>
    </main>
  );
}
