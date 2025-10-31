import { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import Section from "@/components/ui/Section";
import ToContactButtons from "@/components/ToContactButtons";

export const metadata: Metadata = {
  title: "Revisión Holística de Impuestos de 10 Años | Fanny Samaniego",
  description:
    "Descubre si tienes reembolsos o beneficios del CRA no reclamados de los últimos 10 años. Reserva una llamada gratuita de 15 minutos con Fanny Samaniego, Coach Financiera Holística en Toronto.",
  openGraph: {
    title: "Revisión Holística de Impuestos de 10 Años | Fanny Samaniego",
    description:
      "Averigua si tienes reembolsos no reclamados o beneficios perdidos de los últimos 10 años. Análisis completo con un enfoque humano y profesional.",
    url: "https://fannysamaniego.com/es/revision-impuestos",
    type: "website",
    images: [
      {
        url: "/images/resources/tax-review-leaves.jpg",
        width: 1200,
        height: 630,
        alt: "Revisión de Impuestos de 10 Años – Fanny Samaniego",
      },
    ],
  },
};

export default function RevisionImpuestosPage() {
  return (
    <main className="flex flex-col">
      {/* ================= HERO ================= */}
      <PageHero
        title="Revisión Holística de Impuestos de 10 Años"
        subtitle="Podrías tener reembolsos o beneficios del CRA que nunca supiste que existían."
        image="/images/resources/tax-review-leaves.jpg"
      />

      {/* ================= TOP 5 OPORTUNIDADES ================= */}
      <Section className="animate-fade-up py-16 md:py-20">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl text-brand-green font-semibold mb-6">
            🌟 5 Oportunidades Comunes de Reembolso Perdidas
          </h2>
          <ul className="text-lg md:text-xl space-y-4 list-disc list-inside text-gray-800 text-left md:text-center">
            <li>
              💸 <strong>Cheques del CRA sin cobrar</strong> — Pagos emitidos pero nunca depositados
            </li>
            <li>
              🧑‍🦽 <strong>Crédito por Discapacidad (DTC)</strong> — Disponible para condiciones médicas elegibles
            </li>
            <li>
              🎓 <strong>Créditos Educativos</strong> — No usados o transferibles de un dependiente
            </li>
            <li>
              👶 <strong>Beneficio Infantil de Canadá / GST-HST</strong> — Omitidos por errores en la declaración
            </li>
            <li>
              💼 <strong>Gastos Médicos y de Trabajo</strong> — Viajes, terapias o gastos de oficina en casa
            </li>
          </ul>
        </div>
      </Section>

      {/* ================= CÓMO FUNCIONA ================= */}
      <Section className="bg-brand-beige animate-fade-up py-16 md:py-20">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl text-brand-green font-semibold mb-6">
            Cómo Funciona
          </h2>
          <ol className="space-y-5 list-decimal list-inside text-lg md:text-xl text-gray-800 text-left md:text-center">
            <li>Envía tu correo electrónico o reserva una llamada de 15 minutos</li>
            <li>
              Agrega a Fanny como representante del CRA (ID de representante:{" "}
              <span className="font-semibold text-brand-body">FD26QH9</span>)
            </li>
            <li>Fanny revisa cuidadosamente tus declaraciones de impuestos de los últimos 10 años</li>
            <li>Recibe cualquier reembolso, beneficio o crédito que te corresponda</li>
            <li>🆓 <strong>No pagas nada por adelantado</strong> — Solo pagas si se recupera dinero</li>

          </ol>
        </div>
      </Section>

      {/* ================= CTA ================= */}
      <Section className="animate-fade-up py-16 md:py-20 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-brand-green">
            Recupera lo que es legítimamente tuyo
          </h2>
          <p className="text-lg md:text-xl mb-8 text-gray-700">
            Muchos canadienses pierden miles de dólares en beneficios no reclamados.
            Asegurémonos de que tu dinero regrese a ti.
          </p>

          <ToContactButtons lang="es" align="center" />
        </div>
      </Section>
    </main>
  );
}
