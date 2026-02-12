// app/es/sobre-mi/page.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import * as React from "react";
import type { ReactNode } from "react";
import {
  Building2,
  Calculator,
  PiggyBank,
  Scale,
  Shield,
  FileText,
  Users,
} from "lucide-react";

import {
  Reveal,
  RevealPanel,
  StaggerGroup,
  useMotionPresets,
} from "@/components/motion-safe";
import { HUB_CARD_CLASS, ctaButtonClass } from "@/components/sections/hub";

/* ============================= Título de sección ============================= */
function SectionTitle({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: ReactNode;
}) {
  const { fade, fadeUp } = useMotionPresets();
  return (
    <div className="text-center mb-6">
      <Reveal variants={fadeUp}>
        <h1 className="font-brand font-bold text-4xl md:text-5xl text-brand-green tracking-tight">
          {title}
        </h1>
      </Reveal>

      <Reveal variants={fade}>
        <div className="flex justify-center my-4" aria-hidden="true">
          <div className="w-16 h-[3px] rounded-full bg-brand-gold" />
        </div>
      </Reveal>

      {subtitle && (
        <Reveal variants={fadeUp}>
          <p className="text-brand-blue/90 text-lg md:text-xl max-w-3xl mx-auto">
            {subtitle}
          </p>
        </Reveal>
      )}
    </div>
  );
}

/* ============================== Contenido de página ============================== */
function AboutInnerEs() {
  const { fade, fadeUp } = useMotionPresets();

  return (
    <main className="bg-brand-beige min-h-screen pb-16">
      {/* HERO / BIO */}
      <section className="pt-6 sm:pt-8 px-4" aria-label="Hero y biografía">
        <RevealPanel>
          <SectionTitle
            title="Sobre Fanny — Guía profesional con corazón humano"
            subtitle={
              <>
                Soy agente hipotecaria (Nivel 2), ex-auditora de impuestos para la CRA y consultora financiera holística, bilingüe, con base en Toronto.
                Integro experiencia en financiamiento, ritmo fiscal y disciplina contable para ayudarte a tomar
                decisiones claras y alineadas a tus valores—y sentir calma con el dinero. Acompañamos a una
                lista selecta de familias profesionales, ejecutivos y dueños de negocio.
              </>
            }
          />

          <StaggerGroup className="mt-10 flex flex-col md:flex-row items-center gap-10">
            <Reveal variants={fadeUp} className="flex-shrink-0 flex justify-center">
              <Image
                src="/fanny-portrait.jpg"
                alt="Retrato de Fanny Samaniego, Agente Hipotecaria (Nivel 2) y Consultora Financiera en Toronto"
                width={300}
                height={380}
                className="rounded-3xl shadow-lg object-cover border-4 border-brand-gold"
                priority
              />
            </Reveal>

            <Reveal variants={fadeUp} className="flex-1 md:pl-4">
              <p className="mb-4 text-lg md:text-xl text-brand-body leading-relaxed">
                Me especializo en alinear la estrategia hipotecaria, los sistemas de flujo de caja y la
                preparación para temporada fiscal—para que tus pasos de corto plazo apoyen tus metas de largo
                plazo. En el día a día, evalúo situaciones financieras, aclaro opciones de hipoteca y coordino
                con prestamistas para que las solicitudes avancen sin drama.
              </p>
              <p className="mb-4 text-lg md:text-xl text-brand-body leading-relaxed">
                En la parte de planificación, diseño rutinas holísticas y prácticas; y cuando hace falta,
                apoyo a clientes durante revisiones de la CRA con documentación organizada, comunicación clara
                y cumplimiento total.
              </p>
              <p className="mb-0 text-lg md:text-xl text-brand-body leading-relaxed">
                Trabajamos por invitación para cuidar la presencia y la calidad. Si nuestra forma de trabajar
                te resuena, estás cordialmente invitado a iniciar una conversación.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href="/es/contacto?intent=consult&package=Llamada%20de%20Descubrimiento%20Privada"
                  aria-label="Reservar una Llamada de Descubrimiento Privada"
                  className={ctaButtonClass("primary")}
                >
                  Reservar Llamada de Descubrimiento
                </Link>
                <Link
                  href="/es/servicios"
                  className={ctaButtonClass("secondary")}
                >
                  Explorar servicios
                </Link>
              </div>
            </Reveal>
          </StaggerGroup>
        </RevealPanel>
      </section>

      {/* CREDENCIALES / HECHOS RÁPIDOS */}
      <section className="px-4 mt-8" aria-label="Credenciales y datos rápidos">
        <RevealPanel>
          <Reveal variants={fadeUp}>
            <h2 className="text-2xl md:text-3xl font-brand font-semibold text-brand-blue mb-5 text-center">
              Credenciales y datos rápidos
            </h2>
          </Reveal>

          <StaggerGroup className="grid gap-3 text-lg md:text-xl text-brand-green max-w-3xl mx-auto list-disc ml-6 md:ml-10">
            {[
              "Agente Hipotecaria (Nivel 2), Ontario",
              "ex-auditora de impuestos para la CRA",
              "10+ años entre planificación financiera, impuestos y servicios hipotecarios",
              "Formación en contabilidad y reportes financieros",
              "Colaboración con prestamistas para aprobaciones fluidas",
              
              "Bilingüe: Español / English",
            ].map((item) => (
              <Reveal key={item} variants={fadeUp}>
                <li>{item}</li>
              </Reveal>
            ))}
          </StaggerGroup>
        </RevealPanel>
      </section>

      {/* EQUIPO MULTIDISCIPLINARIO */}
      <section className="px-4 mt-8" aria-label="Equipo multidisciplinario">
        <RevealPanel>
          <Reveal variants={fadeUp}>
            <h2 className="text-2xl md:text-3xl font-brand font-semibold text-brand-blue mb-5 text-center">
              Un equipo multidisciplinario—bajo un mismo paraguas
            </h2>
          </Reveal>

          <Reveal variants={fade}>
            <p className="max-w-3xl mx-auto text-brand-blue/90 text-base md:text-lg text-center">
              Junto a Fanny, tendrás acceso coordinado a profesionales calificados. Cada especialista opera
              de forma independiente—los integramos cuando el momento aporta valor a tu plan, para que tu
              hipoteca, flujo de caja y ritmo fiscal funcionen de verdad en conjunto.
            </p>
          </Reveal>

          <StaggerGroup className="mt-6 grid gap-4 md:grid-cols-3">
            {[
              {
                icon: <Building2 className="text-brand-green" size={22} />,
                title: "Prestamistas y Underwriters",
                body: "Claridad de políticas y encaje del producto—expedientes que inspiran confianza al prestamista.",
              },
              {
                icon: <Calculator className="text-brand-green" size={22} />,
                title: "Asesores fiscales / CPAs",
                body: "Estrategias proactivas, registros listos para auditoría y temporadas fiscales serenas.",
              },
              {
                icon: <PiggyBank className="text-brand-green" size={22} />,
                title: "Flujo de caja y bookkeeping",
                body: "Sistemas amigables al comportamiento con base en buenas prácticas contables.",
              },
              {
                icon: <Scale className="text-brand-green" size={22} />,
                title: "Abogados inmobiliarios",
                body: "Cierres limpios y comunicación clara—sin drama el día de la posesión.",
              },
              {
                icon: <Shield className="text-brand-green" size={22} />,
                title: "Brokers de seguros",
                body: "Coberturas alineadas a tu perfil de riesgo y a los requisitos del prestamista.",
              },
              {
                icon: <FileText className="text-brand-green" size={22} />,
                title: "Soporte ante la CRA",
                body: "Preparación y representación cuando la CRA requiere una revisión más profunda.",
              },
            ].map((card) => (
              <Reveal key={card.title} variants={fadeUp}>
                <div className={`${HUB_CARD_CLASS} p-5`}>
                  <div className="flex items-center gap-2 font-sans text-lg text-brand-green font-semibold">
                    {card.icon}
                    {card.title}
                  </div>
                  <p className="mt-2 text-sm text-brand-blue/90">{card.body}</p>
                </div>
              </Reveal>
            ))}
          </StaggerGroup>

          <Reveal variants={fade}>
            <div className="mt-6 flex items-center justify-center gap-2 text-sm text-brand-blue/70">
              <Users size={16} />
              <span>Solo presentamos especialistas cuando aportan valor claro a tu plan.</span>
            </div>
          </Reveal>
        </RevealPanel>
      </section>

      {/* CÓMO USAMOS IA */}
      <section className="px-4 mt-8" aria-label="Cómo usamos IA">
        <RevealPanel>
          <div className="text-center">
            <h3 className="font-sans text-xl md:text-2xl font-semibold text-brand-green">
              Cómo usamos IA (con revisión humana)
            </h3>
            <p className="mt-2 text-brand-blue/90 max-w-3xl mx-auto">
              Utilizamos herramientas de IA que respetan la privacidad para acelerar la preparación:
              resumir documentos, organizar checklists, traducción ES/EN y borradores de presupuesto.
              Toda recomendación y cada número se revisa por Fanny o un profesional calificado.{" "}
              <strong>No</strong> automatizamos decisiones crediticias—los prestamistas siempre realizan
              la aprobación final. Puedes optar por no participar en cualquier momento—solo avísanos.
            </p>
          </div>
        </RevealPanel>
      </section>

      {/* FILOSOFÍA */}
      <section className="px-4 mt-8" aria-label="Nuestra filosofía">
        <RevealPanel className="text-center">
          <Reveal variants={fadeUp}>
            <h3 className="font-sans text-xl md:text-2xl text-brand-green font-semibold mb-2">
              ¿Por qué “Guía por invitación”?
            </h3>
          </Reveal>

          <Reveal variants={fade}>
            <p className="font-sans text-lg text-brand-body max-w-3xl mx-auto">
              El trabajo más significativo ocurre cuando cliente y guía sienten un encaje natural.
              Empezamos con una breve conversación—sin presión, con claridad—para confirmar metas,
              tiempos y alcance.
            </p>
          </Reveal>

          <Reveal variants={fade}>
            <p className="text-brand-body text-base mt-3 opacity-75 max-w-3xl mx-auto">
              <em>
                A solicitud, podemos usar un enfoque ligero de Diseño Humano para personalizar
                la comunicación y el ritmo. No sustituye fundamentos financieros, fiscales o legales:
                solo ayuda a que tu plan se adapte a tu vida.
              </em>
            </p>
          </Reveal>

          <div className="mt-6">
            <Link href="/es/servicios" className="text-brand-blue underline hover:text-brand-green">
              Mira cómo trabajamos y qué ofrecemos →
            </Link>
          </div>
        </RevealPanel>
      </section>

      {/* A QUIÉN SERVIMOS */}
      <section className="px-4 mt-8" aria-label="A quién servimos">
        <RevealPanel>
          <Reveal variants={fadeUp}>
            <h2 className="text-2xl md:text-3xl font-brand font-semibold text-brand-blue mb-5 text-center">
              A quién servimos mejor
            </h2>
          </Reveal>

          <StaggerGroup className="grid gap-3 text-brand-blue/90 max-w-3xl mx-auto list-disc ml-6 md:ml-10">
            {[
              "Recién llegados y compradores por primera vez construyendo preparación",
              "Familias que equilibran flujo de caja con metas de largo plazo",
              "Profesionales por cuenta propia que requieren documentación creíble para prestamistas",
              "Inversionistas pequeños optimizando financiamiento y ritmo fiscal",
            ].map((item) => (
              <Reveal key={item} variants={fadeUp}>
                <li>{item}</li>
              </Reveal>
            ))}
          </StaggerGroup>
        </RevealPanel>
      </section>

      {/* CUMPLIMIENTO Y NOTAS */}
      <section className="px-4 mt-8" aria-label="Cumplimiento y notas importantes">
        <RevealPanel>
          <h3 className="font-sans text-xl md:text-2xl font-semibold text-brand-green text-center">
            Notas sobre cumplimiento y alcance
          </h3>
          <div className="mt-3 text-sm md:text-base text-brand-blue/90 max-w-4xl mx-auto space-y-2">
            <p>
              Los precios (cuando se muestran) están en CAD y pueden estar sujetos a HST. Los servicios
              hipotecarios suelen ser gratuitos para prestatarios residenciales calificados porque la
              compensación la paga el prestamista al cierre. Pueden aplicar honorarios en escenarios
              no-prime/privados/comerciales y siempre se informarán por adelantado. Todas las hipotecas
              están sujetas a aprobación crediticia (O.A.C.).
            </p>
            <p>
              El coaching y los servicios de asesoría independiente son ajenos a la compensación hipotecaria
              y no reemplazan asesoría legal, fiscal o contable. Coordinamos con tus profesionales cuando
              sea necesario. Los documentos se recopilan mediante enlaces seguros. Soporte bilingüe (ES/EN).
            </p>
            <p className="m-0">
              El Diseño Humano es opcional y se usa solo para personalizar comunicación y ritmo; no es
              asesoría financiera, fiscal, contable, legal ni de inversión.
            </p>
          </div>
        </RevealPanel>
      </section>

      {/* CTA */}
      <section className="px-4 mt-8" aria-label="Llamado a la acción de contacto">
        <RevealPanel className="text-center">
          <Reveal variants={fadeUp}>
            <h2 className="text-2xl md:text-3xl font-brand font-semibold text-brand-green mb-3">
              ¿Listo para comenzar la conversación?
            </h2>
          </Reveal>

          <Reveal variants={fade}>
            <p className="text-brand-body mb-6">
              En 20–30 minutos de llamada de descubrimiento tendrás 2–3 próximos pasos claros—sin presión.
            </p>
          </Reveal>

          <div className="flex flex-wrap gap-3 justify-center">
            <Link
              href="/es/contacto?intent=consult&package=Llamada%20de%20Descubrimiento%20Privada"
              aria-label="Reservar una Llamada de Descubrimiento Privada"
              className={ctaButtonClass("primary")}
            >
              Reservar llamada
            </Link>
            <Link
              href="/es/recursos"
              className={ctaButtonClass("secondary")}
            >
              Ver artículos y herramientas
            </Link>
          </div>
        </RevealPanel>
      </section>
    </main>
  );
}

/* ============================ Suspense wrapper ============================ */
export default function AboutEs() {
  return (
    <React.Suspense fallback={<main className="min-h-screen bg-brand-beige" />}>
      <AboutInnerEs />
    </React.Suspense>
  );
}
