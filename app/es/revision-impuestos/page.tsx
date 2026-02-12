import { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import HowItWorksTimeline from "@/components/HowItWorksTimeline";
import TrustChips from "@/components/TrustChips";
import Section from "@/components/ui/Section";

export const metadata: Metadata = {
  title: "Revisión Holística de Impuestos de 10 Años | Fanny Samaniego",
  description:
    "Descubre si tienes reembolsos o beneficios del CRA sin reclamar de los ultimos 10 años. Agenda una consulta gratuita de 15 minutos para clientes en Toronto y Ontario con Fanny Samaniego.",
  alternates: {
    canonical: "https://www.fannysamaniego.com/es/revision-impuestos",
    languages: {
      "en-CA": "https://www.fannysamaniego.com/en/tax-review",
      "es-CA": "https://www.fannysamaniego.com/es/revision-impuestos",
    },
  },
  openGraph: {
    title: "Revisión de Impuestos de 10 Años — Fanny Samaniego",
    description:
      "Podrias tener derecho a cientos en reembolsos del CRA. Agenda una consulta gratuita de 15 minutos para apoyo en Toronto y Ontario.",
    url: "https://www.fannysamaniego.com/es/revision-impuestos",
    type: "website",
    locale: "es_CA",
    siteName:
      "Fanny Samaniego — Consultora Financiera Holística | Impuestos • Hipotecas • Estrategia financiera",
    images: [
      {
        url: "https://www.fannysamaniego.com/og/og-tax-review-es.png", // ✅ static Canva OG banner (Spanish)
        width: 1200,
        height: 630,
        alt: "Revisión Holística de Impuestos de 10 Años — Fanny Samaniego",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    creator: "@fannysamaniego",
    title: "Revisión de Impuestos de 10 Años — Fanny Samaniego",
    description:
      "Podrias tener derecho a cientos en reembolsos del CRA. Agenda una consulta gratuita de 15 minutos para apoyo en Toronto y Ontario.",
    images: ["https://www.fannysamaniego.com/og/og-tax-review-es.png"],
  },
};

export default function RevisionImpuestosPage() {
  const pkg = "Revisión Holística de Impuestos de 10 Años";
  const queryPkg = encodeURIComponent(pkg);
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Para quien es la revision holistica de 10 años?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Esta revision esta pensada para personas con cambios de vida e ingresos en los ultimos años que quieren identificar beneficios y reembolsos del CRA no reclamados.",
        },
      },
      {
        "@type": "Question",
        name: "Tiene costo inicial?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "No tiene costo inicial. Solo se cobra un honorario de exito si se recupera dinero.",
        },
      },
      {
        "@type": "Question",
        name: "Los reembolsos pasan por su firma?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "No. Cualquier reembolso o beneficio elegible es pagado directamente por el CRA.",
        },
      },
    ],
  } as const;

  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Revision Holistica de Impuestos de 10 Años",
    serviceType: "Revision y coordinacion fiscal",
    areaServed: {
      "@type": "AdministrativeArea",
      name: "Toronto, Ontario, Canada",
    },
    provider: {
      "@type": "Organization",
      name: "Fanny Samaniego",
    },
    offers: {
      "@type": "Offer",
      priceCurrency: "CAD",
      price: "0",
      description: "Sin costo inicial; honorario de exito cuando se recupera dinero.",
    },
    url: "https://www.fannysamaniego.com/es/revision-impuestos",
  } as const;

  return (
    <main className="flex flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
      />
      {/* ================= HERO ================= */}
      <PageHero
        title="Revisión Holística de Impuestos de 10 Años"
        subtitle="Es posible que tengas reembolsos o beneficios del CRA sin reclamar de los últimos 10 años."
        image="/images/resources/tax-review-leaves.jpg"
        imageAlt="Fondo de hojas que representa un proceso calmado de revision fiscal"
      />

      <Section className="py-8 md:py-10">
        <TrustChips lang="es" />
      </Section>

      {/* ================= OPORTUNIDADES PRINCIPALES ================= */}
      <Section className="animate-fade-up py-16 md:py-20">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl text-brand-green font-semibold mb-8">
            🌟 5 Reembolsos y Beneficios Comunes Olvidados
          </h2>
          <ul className="text-lg md:text-xl space-y-5 list-disc list-inside text-gray-800 text-left md:text-center leading-relaxed">
            <li>💸 <strong>Cheques del CRA sin cobrar</strong> — Pagos emitidos pero nunca depositados.</li>
            <li>🧑‍🦽 <strong>Crédito por Discapacidad (DTC)</strong> — Para condiciones médicas elegibles.</li>
            <li>🎓 <strong>Créditos Educativos</strong> — No usados o transferibles de un dependiente.</li>
            <li>👶 <strong>Beneficio Infantil / GST-HST</strong> — Perdido por errores al declarar.</li>
            <li>💼 <strong>Gastos Médicos y Laborales</strong> — Viajes, terapias o costos de oficina en casa.</li>
          </ul>
        </div>
      </Section>

      {/* ================= CÓMO FUNCIONA ================= */}
      <Section className="bg-brand-beige animate-fade-up py-16 md:py-20">
        <div className="max-w-5xl mx-auto">
          <HowItWorksTimeline
            title="Como funciona"
            subtitle="Proceso claro desde la primera llamada hasta los siguientes pasos coordinados."
            steps={[
              {
                title: "Llamada de descubrimiento",
                detail: "Inicia con una llamada gratuita de 15 minutos para validar ajuste y linea de tiempo.",
              },
              {
                title: "Intake de claridad",
                detail: "Completa intake y autorizacion ante CRA para revisar tus registros correctamente.",
              },
              {
                title: "Revision, implementacion y coordinacion",
                detail: "Recibe hallazgos, pasos sugeridos y acompanamiento para ejecutar las correcciones.",
              },
            ]}
          />
          <p className="mt-6 text-sm text-gray-600 leading-relaxed text-center">
            Esta revision complementa — y no reemplaza — el trabajo de tu contador o asesor fiscal.
            El CRA define elegibilidad y tiempos; nuestro rol es ayudarte a avanzar con claridad.
          </p>
        </div>
      </Section>

      {/* ================= CTA ================= */}
      <Section className="animate-fade-up py-16 md:py-20 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-brand-green">
            Reclama lo que es Tuyo por Derecho
          </h2>
          <p className="text-lg md:text-xl mb-10 text-gray-700 leading-relaxed">
            Muchos canadienses pierden miles en beneficios no reclamados cada año.  
            Asegurémonos de que tu dinero regrese a ti, de manera segura y compasiva.
          </p>

          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href={`/es/contacto?intent=question&package=${queryPkg}`}
              className="inline-flex items-center rounded-full px-5 py-2.5 text-sm font-serif font-bold shadow transition bg-brand-green text-white hover:opacity-90"
            >
              Verificar si calificas
            </Link>
            <Link
              href={`/es/reservar?package=${queryPkg}`}
              className="inline-flex items-center rounded-full px-5 py-2.5 text-sm font-serif font-bold shadow transition border-2 border-brand-blue text-brand-blue hover:bg-brand-blue hover:text-white"
            >
              Reservar llamada de 15 min
            </Link>
            <Link
              href={`/es/contacto?intent=package&package=${queryPkg}`}
              className="inline-flex items-center rounded-full px-5 py-2.5 text-sm font-serif font-bold shadow transition border-2 border-brand-green text-brand-green hover:bg-brand-green hover:text-white"
            >
              Iniciar revisión de impuestos
            </Link>
          </div>
        </div>
      </Section>
    </main>
  );
}
