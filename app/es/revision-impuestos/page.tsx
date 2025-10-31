import { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import Section from "@/components/ui/Section";
import ToContactButtons from "@/components/ToContactButtons";

export const metadata: Metadata = {
  title: "Revisión Holística de Impuestos de 10 Años | Fanny Samaniego",
  description:
    "Descubre si tienes reembolsos o beneficios del CRA sin reclamar de los últimos 10 años. Agenda una consulta gratuita de 15 minutos con Fanny Samaniego, Coach Financiera Holística en Toronto.",
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
      "Podrías tener derecho a cientos en reembolsos del CRA. Agenda una consulta gratuita de 15 minutos para averiguarlo.",
    url: "https://www.fannysamaniego.com/es/revision-impuestos",
    type: "website",
    locale: "es_CA",
    siteName: "Fanny Samaniego — Hipotecas • Dinero • Impuestos",
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
      "Podrías tener derecho a cientos en reembolsos del CRA. Agenda una consulta gratuita de 15 minutos para averiguarlo.",
    images: ["https://www.fannysamaniego.com/og/og-tax-review-es.png"],
  },
};

export default function RevisionImpuestosPage() {
  return (
    <main className="flex flex-col">
      {/* ================= HERO ================= */}
      <PageHero
        title="Revisión Holística de Impuestos de 10 Años"
        subtitle="Es posible que tengas reembolsos o beneficios del CRA sin reclamar de los últimos 10 años."
        image="/images/resources/tax-review-leaves.jpg"
      />

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
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl text-brand-green font-semibold mb-8">
            Cómo Funciona
          </h2>
          <ol
            aria-label="Pasos del proceso para la revisión de impuestos de 10 años"
            className="space-y-6 list-decimal list-inside text-lg md:text-xl text-gray-800 text-left md:text-center leading-relaxed"
          >
            <li>Envía tu correo electrónico o agenda una llamada de descubrimiento de 15 minutos.</li>
            <li>
              Agrega a Fanny como representante del CRA (ID de Representante:{" "}
              <span className="font-semibold text-brand-body">FD26QH9</span>).
            </li>
            <li>
              Fanny revisa los últimos 10 años de tus declaraciones de impuestos con un enfoque holístico.
            </li>
            <li>Recibe cualquier reembolso o beneficio directamente del CRA.</li>
            <li>
              🆓 <strong>Sin costo inicial:</strong> solo pagas si se recupera dinero.
            </li>
          </ol>
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

          <ToContactButtons lang="es" align="center" />
        </div>
      </Section>
    </main>
  );
}
