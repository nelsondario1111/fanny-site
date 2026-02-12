import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
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

  return (
    <main className="min-h-screen bg-white">
      <section className="bg-brand-green/5 border-b border-brand-gold/30">
        <div className="max-w-screen-xl mx-auto px-4 py-8 lg:py-10">
          <nav className="text-sm text-brand-blue/80">
            <Link href="/es" className="hover:underline">Inicio</Link>
            <span className="mx-2">/</span>
            <Link href="/es/servicios" className="hover:underline">Servicios</Link>
            <span className="mx-2">/</span>
            <span className="text-brand-green">{detail.title}</span>
          </nav>

          <h1 className="mt-4 font-serif text-3xl md:text-4xl font-semibold tracking-tight text-brand-green">
            {detail.title}
          </h1>
          <p className="mt-4 max-w-3xl text-lg text-brand-blue/90">{detail.subtitle}</p>

          <div className="mt-4 flex flex-wrap gap-2 text-xs">
            <span className="rounded-full border border-brand-gold/40 bg-white/80 px-2.5 py-1 text-brand-green">
              Inversión: {detail.price}
            </span>
            <span className="rounded-full border border-brand-gold/40 bg-white/80 px-2.5 py-1 text-brand-blue/80">
              Duración: {detail.duration}
            </span>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href={packageHref(detail.packageTitle)}
              className="inline-flex items-center justify-center px-5 py-2.5 bg-brand-green text-white rounded-full font-semibold hover:bg-brand-gold hover:text-brand-green border border-brand-green/20 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold"
            >
              {detail.primaryCtaLabel}
            </Link>
            <Link
              href={discoveryHref}
              className="inline-flex items-center justify-center px-5 py-2.5 rounded-full border border-brand-blue/40 text-brand-blue hover:bg-brand-blue hover:text-white transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue/40"
            >
              Reservar llamada de descubrimiento
            </Link>
            <Link
              href="/es/servicios"
              className="inline-flex items-center justify-center px-5 py-2.5 rounded-full border border-brand-gold/40 text-brand-green hover:bg-brand-gold hover:text-brand-green transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold"
            >
              Volver a servicios
            </Link>
          </div>
        </div>
      </section>

      <section className="py-8 lg:py-12">
        <div className="max-w-screen-xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_19rem] gap-6">
          <article className="rounded-3xl border border-brand-gold/40 bg-white shadow-sm p-6 md:p-8 space-y-8">
            <section>
              <h2 className="font-serif text-2xl text-brand-green">Ideal Para</h2>
              <ul className="mt-3 list-disc pl-5 space-y-2 text-brand-blue/90">
                {detail.idealFor.map((item) => (
                  <li key={`${detail.id}-ideal-${item}`}>{item}</li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="font-serif text-2xl text-brand-green">Qué Incluye</h2>
              <ul className="mt-3 list-disc pl-5 space-y-2 text-brand-blue/90">
                {detail.includes.map((item) => (
                  <li key={`${detail.id}-includes-${item}`}>{item}</li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="font-serif text-2xl text-brand-green">Cómo Funciona</h2>
              <ol className="mt-3 list-decimal pl-5 space-y-2 text-brand-blue/90">
                {detail.process.map((item) => (
                  <li key={`${detail.id}-process-${item}`}>{item}</li>
                ))}
              </ol>
            </section>

            <section>
              <h2 className="font-serif text-2xl text-brand-green">Resultado Esperado</h2>
              <p className="mt-3 text-brand-blue/90">{detail.outcome}</p>
            </section>

            {detail.scopeNote && (
              <section className="rounded-2xl border border-brand-gold/40 bg-brand-gold/10 p-4">
                <h2 className="text-sm font-semibold tracking-wide uppercase text-brand-blue/80">
                  Nota de alcance
                </h2>
                <p className="mt-2 text-sm text-brand-blue/90">{detail.scopeNote}</p>
              </section>
            )}
          </article>

          <aside className="space-y-4">
            <section className="rounded-3xl border border-brand-gold/40 bg-white shadow-sm p-5">
              <h2 className="font-serif text-xl text-brand-green">Resumen Rápido</h2>
              <p className="mt-3 text-sm text-brand-blue/80">
                <strong>Servicio:</strong> {detail.title}
              </p>
              <p className="mt-1 text-sm text-brand-blue/80">
                <strong>Inversión:</strong> {detail.price}
              </p>
              <p className="mt-1 text-sm text-brand-blue/80">
                <strong>Duración:</strong> {detail.duration}
              </p>
            </section>

            <section className="rounded-3xl border border-brand-gold/40 bg-brand-green/5 shadow-sm p-5">
              <h2 className="font-serif text-xl text-brand-green">Idioma</h2>
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
          </aside>
        </div>
      </section>
    </main>
  );
}
