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
import RevealSection from "@/components/service-detail/RevealSection";
import SectionTracker from "@/components/service-detail/SectionTracker";

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
  return `/en/contact?${qs.toString()}`;
}

export function generateStaticParams(): PageParams[] {
  return getServiceIds("en").map((service) => ({ service }));
}

export async function generateMetadata(
  { params }: { params: Promise<PageParams> }
): Promise<Metadata> {
  const { service } = await params;
  const detail = getServiceDetail("en", service);
  if (!detail) return {};

  const path = `/en/services/${service}`;
  const enUrl = absolute(path);
  const esUrl = absolute(`/es/servicios/${service}`);
  const description = `${detail.subtitle} ${detail.outcome}`;

  return {
    title: `${detail.title} | Service Details`,
    description,
    alternates: {
      canonical: enUrl,
      languages: {
        "en-CA": enUrl,
        "es-CA": esUrl,
      },
    },
    openGraph: {
      title: `${detail.title} | Fanny Samaniego`,
      description,
      url: enUrl,
      type: "website",
      locale: "en_CA",
      siteName:
        "Fanny Samaniego — Holistic Financial Consultant | Taxes • Mortgages • Money Strategy",
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
  const detail = getServiceDetail("en", service);
  if (!detail) notFound();

  const discoveryHref = "/en/contact?intent=consult&package=Free%20Discovery%20Call%20(15%20min)";
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
      tier: "Tier 1",
      investment: "$2,500 CAD",
      timeline: "2-6 weeks",
      focus: "One high-priority goal",
    },
    {
      id: "map-tier-2",
      tier: "Tier 2",
      investment: "$3,500 CAD",
      timeline: "8-12 weeks",
      focus: "Integrated multi-priority plan",
    },
    {
      id: "map-tier-3",
      tier: "Tier 3",
      investment: "$5,000 CAD",
      timeline: "3-6 months",
      focus: "Holistic long-range strategy",
    },
  ] as const;
  const sectionItems: Array<{ id: string; label: string }> = [
    { id: "ideal-for", label: "Ideal For" },
    { id: "what-includes", label: "What This Includes" },
    { id: "how-works", label: "How It Works" },
    { id: "expected-outcome", label: "Expected Outcome" },
  ];

  if (isStrategicMapTier) {
    sectionItems.push({ id: "tiers-glance", label: "Strategic Map Tiers" });
  }

  if (detail.scopeNote) {
    sectionItems.push({ id: "scope-note", label: "Scope Note" });
  }

  return (
    <main className="min-h-screen bg-brand-beige pb-16">
      <section className="relative overflow-hidden bg-gradient-to-b from-brand-green/10 via-brand-green/5 to-brand-beige border-b border-brand-gold/30">
        <div className="max-w-content mx-auto px-4 py-11 sm:py-12">
          <nav className="mb-4 text-xs sm:text-sm text-brand-blue/80" aria-label="Breadcrumb">
            <Link href="/en" className="hover:underline">Home</Link>
            <span className="mx-2">/</span>
            <Link href="/en/services" className="hover:underline">Services</Link>
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
              <Coins size={13} aria-hidden /> Investment: {detail.price}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-gold/40 bg-white/90 px-3 py-1.5 text-brand-blue/85">
              <Hourglass size={13} aria-hidden /> Duration: {detail.duration}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-gold/40 bg-white/90 px-3 py-1.5 text-brand-blue/85">
              <Globe2 size={13} aria-hidden /> Language: EN/ES
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
              Book a Discovery Call
            </Link>
            <Link
              href="/en/services"
              className={CTA_GHOST_CLASS}
            >
              <ArrowLeft size={14} aria-hidden />
              Back to Services
            </Link>
          </div>
        </div>
      </section>

      <section className="px-4 py-8 lg:py-12">
        <div className="max-w-content mx-auto grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
          <article className="space-y-5">
            <RevealSection>
              <section id="ideal-for" className={`${PANEL_CLASS} p-6 md:p-7 scroll-mt-[170px]`}>
                <h2 className="font-brand text-2xl text-brand-green">Ideal For</h2>
                <ul className="mt-4 space-y-2.5">
                  {detail.idealFor.map((item) => (
                    <li key={`${detail.id}-ideal-${item}`} className="flex items-start gap-2.5 text-brand-blue/90">
                      <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-brand-green/80" aria-hidden />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </section>
            </RevealSection>

            <RevealSection>
              <section id="what-includes" className={`${PANEL_CLASS} p-6 md:p-7 scroll-mt-[170px]`}>
                <h2 className="font-brand text-2xl text-brand-green">What This Includes</h2>
                <ul className="mt-4 space-y-2.5">
                  {detail.includes.map((item) => (
                    <li key={`${detail.id}-includes-${item}`} className="flex items-start gap-2.5 text-brand-blue/90">
                      <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-brand-green/80" aria-hidden />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </section>
            </RevealSection>

            <RevealSection>
              <section id="how-works" className={`${PANEL_CLASS} p-6 md:p-7 scroll-mt-[170px]`}>
                <h2 className="font-brand text-2xl text-brand-green">How It Works</h2>
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
            </RevealSection>

            <RevealSection>
              <section id="expected-outcome" className={`${PANEL_CLASS} p-6 md:p-7 scroll-mt-[170px]`}>
                <h2 className="font-brand text-2xl text-brand-green">Expected Outcome</h2>
                <p className="mt-4 leading-relaxed text-brand-blue/90">{detail.outcome}</p>
              </section>
            </RevealSection>

            {isStrategicMapTier && (
              <RevealSection>
                <section id="tiers-glance" className={`${PANEL_CLASS} overflow-hidden scroll-mt-[170px]`}>
                  <div className="p-6 md:p-7 pb-0">
                    <h2 className="font-brand text-2xl text-brand-green">Strategic Map Tiers at a Glance</h2>
                    <p className="mt-2 text-sm text-brand-blue/85">
                      Compare the three map levels quickly and choose the scope that matches your current stage.
                    </p>
                  </div>
                  <div className="mt-4 overflow-x-auto">
                    <table className="min-w-full text-sm">
                      <thead className="bg-brand-green/5 border-y border-brand-gold/25">
                        <tr>
                          <th className="px-4 py-3 text-left font-semibold text-brand-green">Tier</th>
                          <th className="px-4 py-3 text-left font-semibold text-brand-green">Investment</th>
                          <th className="px-4 py-3 text-left font-semibold text-brand-green">Typical Timeline</th>
                          <th className="px-4 py-3 text-left font-semibold text-brand-green">Best For</th>
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
                                {row.tier} {active ? "• Current" : ""}
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
                      href="/en/services#strategic-maps"
                      className="text-sm text-brand-blue hover:text-brand-green underline underline-offset-4"
                    >
                      Compare all Strategic Map options on the Services page
                    </Link>
                  </div>
                </section>
              </RevealSection>
            )}

            {detail.scopeNote && (
              <RevealSection>
                <section id="scope-note" className="rounded-2xl border border-brand-gold/45 bg-brand-gold/12 p-5 scroll-mt-[170px]">
                  <h2 className="text-sm font-semibold tracking-wide uppercase text-brand-blue/85">
                    Scope Note
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-brand-blue/90">{detail.scopeNote}</p>
                </section>
              </RevealSection>
            )}
          </article>

          <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
            <SectionTracker title="On this page" items={sectionItems} />

            <RevealSection>
              <section className={`${PANEL_CLASS} p-5`}>
                <h2 className="font-brand text-xl text-brand-green">Quick Facts</h2>
                <dl className="mt-3 space-y-2 text-sm text-brand-blue/85">
                  <div>
                    <dt className="font-semibold text-brand-green">Service</dt>
                    <dd>{detail.title}</dd>
                  </div>
                  <div>
                    <dt className="font-semibold text-brand-green">Investment</dt>
                    <dd>{detail.price}</dd>
                  </div>
                  <div>
                    <dt className="font-semibold text-brand-green">Duration</dt>
                    <dd>{detail.duration}</dd>
                  </div>
                </dl>
              </section>
            </RevealSection>

            <RevealSection>
              <section className="rounded-3xl border border-brand-gold/35 bg-brand-green/8 shadow-[0_10px_24px_rgba(47,74,53,0.08)] p-5">
                <h2 className="font-brand text-xl text-brand-green">Language</h2>
                <p className="mt-3 text-sm text-brand-blue/90">
                  This page is also available in Spanish.
                </p>
                <Link
                  href={`/es/servicios/${detail.id}`}
                  className="mt-3 inline-flex items-center rounded-full px-4 py-2 text-sm border border-brand-green text-brand-green hover:bg-brand-green hover:text-white transition"
                >
                  Ver en Español
                </Link>
              </section>
            </RevealSection>

            <RevealSection>
              <section className={`${PANEL_CLASS} p-5`}>
                <h2 className="font-brand text-xl text-brand-green">Need Help Choosing?</h2>
                <p className="mt-3 text-sm text-brand-blue/90">
                  If this service feels close but not exact, start with a discovery call and we&apos;ll route you clearly.
                </p>
                <Link href={discoveryHref} className={`mt-4 w-full ${CTA_PRIMARY_CLASS}`}>
                  <CalendarClock size={14} aria-hidden />
                  Start with Discovery
                </Link>
              </section>
            </RevealSection>
          </aside>
        </div>
      </section>
    </main>
  );
}
