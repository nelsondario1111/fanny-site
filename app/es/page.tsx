"use client";

import Image from "next/image";
import Link from "next/link";
import type React from "react";

import {
  Reveal,
  RevealPanel,
  StaggerGroup,
  useMotionPresets,
} from "@/components/motion-safe";
import { ctaButtonClass } from "@/components/sections/hub";
import StartHereDecisionWidget from "@/components/StartHereDecisionWidget";
import TrustChips from "@/components/TrustChips";
import HeroScrollAccents from "@/components/ui/HeroScrollAccents";

/* ============================= Título de sección ============================= */
function SectionTitle({ title, kicker }: { title: string; kicker?: string }) {
  const { fade, fadeUp } = useMotionPresets();
  return (
    <div className="text-center mb-10">
      {kicker && (
        <Reveal variants={fade}>
          <div className="text-brand-blue/70 text-base md:text-lg mb-2">
            {kicker}
          </div>
        </Reveal>
      )}
      <Reveal variants={fadeUp}>
        <h2 className="font-serif text-3xl md:text-4xl text-brand-green/90 font-bold tracking-tight">
          {title}
        </h2>
      </Reveal>
      <Reveal variants={fade}>
        <div className="flex justify-center mt-3" aria-hidden="true">
          <div className="w-14 h-[2px] rounded-full bg-brand-gold/40" />
        </div>
      </Reveal>
    </div>
  );
}

/* ================================ Página ================================ */
export default function HomeEs() {
  const { fade, fadeUp } = useMotionPresets();
  const primaryCtaClass = ctaButtonClass("primary");
  const secondaryCtaClass = ctaButtonClass("secondary");
  const ghostCtaClass = ctaButtonClass("ghost");

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Fanny Samaniego",
    url: "https://www.fannysamaniego.com/",
    logo: "https://www.fannysamaniego.com/apple-touch-icon.png",
    founder: {
      "@type": "Person",
      name: "Fanny Samaniego",
      jobTitle: "Asesora Financiera y Agente Hipotecaria",
      worksFor: { "@type": "Organization", name: "Fanny Samaniego" },
    },
  } as const;

  return (
    <main className="bg-brand-beige min-h-dvh text-brand-body">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* =============================== HERO =============================== */}
      <div
        className="relative bg-scroll md:bg-fixed bg-center bg-cover"
        style={{ backgroundImage: "url('/nature.jpg')" }}
      >
        <HeroScrollAccents className="z-[1]" />
        <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/10 via-black/5 to-black/10" />

        <header
          className="relative z-20 min-h-[60dvh] flex items-center justify-center overflow-hidden"
          aria-label="Hero"
        >
          <StaggerGroup className="w-full px-4">
            <section className="max-w-content mx-auto px-5 sm:px-8 pt-6 sm:pt-8 pb-10 sm:pb-14 bg-white/90 rounded-2xl border border-brand-gold/20 shadow-md backdrop-blur-[2px] text-center relative">
              <Reveal variants={fadeUp}>
                <h1 className="font-serif font-extrabold text-5xl md:text-6xl text-brand-green/90 mb-4 tracking-tight">
                  Números claros, decisiones con calma.
                </h1>
              </Reveal>

              <Reveal variants={fade}>
                <p className="font-sans text-lg md:text-xl text-brand-blue/90 mb-6 leading-relaxed max-w-xl mx-auto">
                  Consultora financiera holística | Impuestos • Hipotecas •
                  Estrategia financiera. Cuando estés lista/o, estoy aquí para
                  acompañarte con números claros y decisiones en calma.
                </p>
              </Reveal>

              <Reveal variants={fade}>
                <nav
                  aria-label="Acciones principales"
                  className="flex flex-col items-center gap-2"
                >
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Link
                      href="/es/revision-impuestos" // ajusta la ruta si usas otro slug
                      aria-label="Explorar Revisión Fiscal de 10 Años"
                      className={primaryCtaClass}
                    >
                      Revisar Impuestos de 10 Años
                    </Link>
                    <Link
                      href="/es/servicios"
                      aria-label="Explorar servicios"
                      className={secondaryCtaClass}
                    >
                      Explorar Servicios
                    </Link>
                  </div>
                  <Link
                    href="/es/contacto?intent=hola"
                    className="text-sm text-brand-blue/80 mt-2 hover:text-brand-green underline underline-offset-4"
                  >
                    Iniciar una conversación
                  </Link>
                </nav>
              </Reveal>

              <Reveal variants={fade}>
                <TrustChips lang="es" />
              </Reveal>
            </section>
          </StaggerGroup>
        </header>
      </div>

      <RevealPanel className="mt-10" aria-label="Rutas para empezar">
        <StartHereDecisionWidget lang="es" />
      </RevealPanel>

      {/* =================== SERVICIO DESTACADO: REVISIÓN FISCAL =================== */}
      <RevealPanel
        className="mt-16 lg:mt-20"
        aria-label="Servicio destacado: Revisión Fiscal Holística de 10 Años"
      >
        <div className="max-w-5xl mx-auto bg-white/90 rounded-3xl border border-brand-gold/20 shadow-sm px-6 sm:px-10 py-10 sm:py-12">
          <SectionTitle
            title="Revisión Fiscal Holística de 10 Años"
            kicker="Servicio destacado"
          />
          <StaggerGroup className="flex flex-col md:flex-row gap-8 items-center">
            <Reveal variants={fadeUp} className="md:w-1/2">
              <p className="font-sans text-lg text-brand-body/90 leading-relaxed mb-4">
                Si has vivido y trabajado en Canadá por varios años, existe una
                posibilidad real de que la CRA pueda deberte dinero del que
                nunca te hablaron—especialmente si en tu camino ha habido
                mudanzas, cambios de trabajo, hijos o variaciones de ingreso.
              </p>
              <p className="font-sans text-base text-brand-body/90 leading-relaxed mb-4">
                La Revisión Fiscal Holística de 10 Años es un proceso tranquilo
                y ordenado donde miramos hacia atrás la última década para
                detectar beneficios, créditos y oportunidades que podrías aún
                reclamar—sin culpa, sin reproches y sin abrumarte.
              </p>
              <ul className="list-disc pl-6 text-brand-body/90 text-sm space-y-1 mb-6">
                <li>Revisamos hasta 10 años de declaraciones y eventos de vida.</li>
                <li>Identificamos créditos y beneficios que podrías recuperar.</li>
                <li>Te mantenemos informada(o) y en control en cada paso.</li>
              </ul>
              <div className="flex flex-wrap gap-3 items-center">
                <Link
                  href="/es/revision-impuestos" // ajusta si usas otro slug
                  aria-label="Saber más sobre la Revisión Fiscal de 10 Años"
                  className={primaryCtaClass}
                >
                  Saber más
                </Link>
                <Link
                  href="/es/contacto?intent=tax-review"
                  aria-label="Agendar llamada de 15 minutos sobre la revisión fiscal"
                  className={secondaryCtaClass}
                >
                  Agendar llamada de 15 min
                </Link>
              </div>
              <p className="mt-2 text-xs text-brand-blue/70">
                Sin presión y sin compromiso inicial—solo una conversación breve
                para ver si este proceso es adecuado para ti.
              </p>
            </Reveal>

            <Reveal variants={fadeUp} className="md:w-1/2 md:mt-4">
              <div className="bg-white rounded-2xl border border-brand-gold/30 shadow-md p-6">
                <h3 className="font-serif text-xl text-brand-blue/90 font-bold mb-3">
                  Quién se beneficia más
                </h3>
                <ul className="list-disc pl-6 text-brand-body/90 text-sm space-y-1 mb-4">
                  <li>Familias con hijos, apoyos o cambios en beneficios.</li>
                  <li>
                    Profesionales que se han mudado, cambiado de empleo o tenido
                    variaciones fuertes de ingreso.
                  </li>
                  <li>
                    Personas recién llegadas a Canadá que no recibieron una
                    guía completa sobre el sistema fiscal.
                  </li>
                </ul>
                <p className="text-xs text-brand-blue/70 leading-relaxed">
                  Todo el trabajo es privado y confidencial. Cualquier devolución
                  elegible la paga directamente la CRA; nuestro rol es ayudarte
                  a ver lo que es posible y acompañarte con pasos claros y
                  tranquilos.
                </p>
              </div>
            </Reveal>
          </StaggerGroup>
        </div>
      </RevealPanel>

      {/* ============================ ACERCA DE ============================ */}
      <RevealPanel className="mt-16" aria-label="Acerca de Fanny Samaniego">
        <StaggerGroup className="flex flex-col md:flex-row items-center gap-10">
          <Reveal variants={fadeUp} className="md:w-1/2 flex justify-center">
            <Image
              src="/fanny.jpg"
              alt="Fanny Samaniego — Asesora Financiera y Agente Hipotecaria en Toronto"
              width={360}
              height={360}
              className="rounded-full shadow-md object-cover border-4 border-brand-green/80"
              priority
            />
          </Reveal>

          <Reveal variants={fadeUp} className="md:w-1/2">
            <h2 className="font-serif text-3xl md:text-4xl text-brand-green/90 mb-4 font-bold">
              Sabiduría invitada, compartida con el corazón
            </h2>
            <p className="font-sans text-lg text-brand-body/90 mb-6 leading-relaxed max-w-2xl">
              Soy Fanny Samaniego—<b>asesora financiera, coach holística y
              agente hipotecaria licenciada</b> en Toronto. Junto a mi equipo
              coordinado, acompañamos a familias profesionales, ejecutivos y
              dueños de negocio que buscan resultados prácticos sin perder sus
              valores ni su paz interior.
            </p>
            <ul className="list-disc pl-6 text-brand-body/90 text-base space-y-2 mb-8">
              <li>
                Planes que se adaptan a tu vida—basados en cómo decides y
                ejecutas naturalmente.
              </li>
              <li>
                Lente opcional de Diseño Humano para personalizar comunicación y
                ritmo—sin reemplazar fundamentos financieros o legales.
              </li>
              <li>Próximos pasos claros después de cada sesión—sin sobrecarga.</li>
            </ul>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/es/sobre-mi"
                aria-label="Descubre la trayectoria de Fanny Samaniego"
                className={ghostCtaClass}
              >
                Descubrir mi trayectoria
              </Link>
              <Link
                href="/es/contacto?intent=pregunta"
                aria-label="Iniciar una conversación"
                className="self-center text-brand-blue/80 underline decoration-2 underline-offset-4 hover:text-brand-green"
              >
                Conversemos tus opciones
              </Link>
            </div>
          </Reveal>
        </StaggerGroup>
      </RevealPanel>

      {/* ==================== ENTRADA A SERVICIOS ==================== */}
      <RevealPanel className="mt-16" aria-label="Explorar catálogo completo de servicios">
        <Reveal variants={fadeUp}>
          <div className="mx-auto max-w-3xl rounded-2xl border border-brand-gold/30 bg-gradient-to-r from-white via-brand-beige/70 to-white p-6 text-center">
            <p className="text-sm text-brand-blue/80 mb-4">
              ¿Lista/o para ver el mapa completo?
            </p>
            <Link
              href="/es/servicios"
              aria-label="Explorar todos los servicios"
              className={[
                ghostCtaClass,
                "group relative overflow-hidden border-2 border-brand-gold/50 bg-white/90 px-8 py-3 shadow-sm",
                "motion-safe:transition-all motion-safe:duration-300 motion-safe:hover:-translate-y-0.5 motion-safe:hover:shadow-md",
              ].join(" ")}
            >
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-y-0 left-0 w-1/3 -translate-x-full bg-gradient-to-r from-transparent via-brand-gold/35 to-transparent motion-safe:transition-transform motion-safe:duration-700 motion-safe:group-hover:translate-x-[360%]"
              />
              <span className="relative z-10 inline-flex items-center gap-2">
                Explorar todos los servicios
                <span
                  aria-hidden="true"
                  className="motion-safe:transition-transform motion-safe:duration-300 motion-safe:group-hover:translate-x-1"
                >
                  →
                </span>
              </span>
            </Link>
          </div>
        </Reveal>
      </RevealPanel>

      {/* ================ PROGRAMA MESA DE DIÁLOGO ================= */}
      <RevealPanel
        className="mt-16"
        aria-label="Conversaciones de Mesa — programa grupal de 4 semanas"
      >
        <SectionTitle
          title="Conversaciones de Mesa"
          kicker="Programa grupal de 4 semanas"
        />
        <Reveal variants={fade}>
          <p className="text-center text-brand-body/90 mt-2 max-w-2xl mx-auto leading-relaxed">
            Círculos pequeños y cercanos, guiados por Fanny y su equipo—como una
            charla alrededor de la mesa—donde puedes hacer preguntas, obtener
            claridad y salir con pasos concretos que realmente vas a seguir.
          </p>
        </Reveal>

        <StaggerGroup className="grid md:grid-cols-3 gap-6 mt-8">
          {[
            {
              title: "Para quién es",
              items: [
                "Compradores primerizos y recién llegados",
                "Familias alineando valores y presupuesto",
                "Inversionistas con propiedades multi-unidad (4–10)",
              ],
            },
            {
              title: "Qué abordamos",
              items: [
                "Pasos, tasas y preparación hipotecaria",
                "Estrategia de flujo, deuda y crédito",
                "Planeación consciente y sin estrés",
              ],
            },
            {
              title: "Cómo funciona",
              items: [
                "Grupos pequeños (amables y enfocados)",
                "4 sesiones semanales de 45–60 min",
                "Acciones simples después de cada encuentro",
              ],
            },
          ].map((col) => (
            <Reveal key={col.title} variants={fadeUp}>
              <div className="rounded-2xl border border-brand-green/30 p-6 hover:-translate-y-0.5 transition-transform duration-200">
                <h4 className="font-serif text-xl text-brand-blue/90 font-bold mb-2">
                  {col.title}
                </h4>
                <ul className="list-disc pl-6 text-brand-body/90 space-y-1">
                  {col.items.map((it) => (
                    <li key={it}>{it}</li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </StaggerGroup>

        <Reveal variants={fade}>
          <div className="text-center mt-10 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href={`/es/contacto?intent=package&package=${encodeURIComponent(
                "Conversaciones en la Mesa — Cohorte 4 semanas"
              )}`}
              className={secondaryCtaClass}
            >
              Unirme a la próxima cohorte
            </Link>
          </div>
        </Reveal>
      </RevealPanel>

      {/* ======================= HERRAMIENTAS Y ARTÍCULOS ======================= */}
      <RevealPanel
        className="mt-16"
        aria-label="Herramientas y artículos útiles"
      >
        <SectionTitle title="Herramientas y artículos útiles" />
        <StaggerGroup className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Reveal variants={fadeUp}>
            <div className="group bg-white rounded-2xl p-8 shadow-md border border-brand-gold/20 flex flex-col hover:-translate-y-0.5 hover:shadow-lg transition-transform">
              <h3 className="font-serif text-2xl text-brand-blue/90 font-bold mb-2">
                Herramientas
              </h3>
              <p className="text-brand-body/90 mb-6">
                Calculadoras simples, listas y guías prácticas para mantener el
                orden financiero sin complicaciones.
              </p>
              <ul className="list-disc pl-6 text-brand-body/90 text-sm space-y-1 mb-6">
                <li>Plantilla de presupuesto y flujo de caja</li>
                <li>Lista de preparación hipotecaria</li>
                <li>Checklist para temporada de impuestos</li>
              </ul>
              <Link
                href="/es/herramientas"
                aria-label="Ver herramientas"
                className={ghostCtaClass}
              >
                Ver herramientas
              </Link>
            </div>
          </Reveal>

          <Reveal variants={fadeUp}>
            <div className="group bg-white rounded-2xl p-8 shadow-md border border-brand-gold/20 flex flex-col hover:-translate-y-0.5 hover:shadow-lg transition-transform">
              <h3 className="font-serif text-2xl text-brand-blue/90 font-bold mb-2">
                Artículos
              </h3>
              <p className="text-brand-body/90 mb-6">
                Lecturas breves y útiles sobre hipotecas, comportamiento
                financiero y conceptos fiscales, sin jerga ni tecnicismos.
              </p>
              <ul className="list-disc pl-6 text-brand-body/90 text-sm space-y-1 mb-6">
                <li>Guía para comprar tu primera vivienda (Toronto)</li>
                <li>Estrategia de deuda sin culpa</li>
                <li>Impuestos para pequeños negocios: qué registrar</li>
              </ul>
              <Link
                href="/es/recursos"
                aria-label="Leer artículos"
                className={ghostCtaClass}
              >
                Leer artículos
              </Link>
            </div>
          </Reveal>
        </StaggerGroup>
      </RevealPanel>

      {/* ============================ SUSCRIPCIÓN ============================ */}
      <RevealPanel
        className="mt-20"
        aria-label="Suscripción a consejos y recursos"
      >
        <Reveal variants={fadeUp}>
          <div className="text-center max-w-3xl mx-auto bg-white/80 rounded-2xl p-10 shadow-sm border border-brand-gold/20">
            <h3 className="font-serif text-2xl text-brand-green/90 font-bold mb-2">
              Mantente al tanto
            </h3>
            <p className="text-brand-body/90 mb-6">
              Recibe consejos, listas y recordatorios mensuales—bilingües y sin
              spam.
            </p>
            <Link
              href="/es/suscribir"
              aria-label="Ir a la página de suscripción"
              className={primaryCtaClass}
            >
              Suscribirme
            </Link>
          </div>
        </Reveal>
      </RevealPanel>

      {/* =========================== CIERRE FINAL =========================== */}
      <Reveal variants={fade}>
        <section className="py-20 text-center border-t border-brand-gold/10 mt-20">
          <h3 className="font-serif text-2xl md:text-3xl text-brand-green/90 font-bold mb-3">
            La claridad nace del diálogo.
          </h3>
          <p className="text-brand-body/90 mb-5 max-w-xl mx-auto">
            Sin prisa y sin presión—solo orientación clara cuando sientas que es
            el momento adecuado para ti.
          </p>
          <Link
            href="/es/contacto?intent=hola"
            aria-label="Iniciar una conversación"
            className={secondaryCtaClass}
          >
            Iniciar conversación
          </Link>
          <p className="text-xs text-brand-blue/60 mt-3 max-w-xl mx-auto">
            El Diseño Humano es opcional—solo se usa para personalizar la
            comunicación y el ritmo. Nunca reemplaza fundamentos financieros,
            fiscales ni legales.
          </p>
        </section>
      </Reveal>
    </main>
  );
}
