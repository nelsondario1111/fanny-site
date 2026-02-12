"use client";

import Image from "next/image";
import Link from "next/link";
import type React from "react";
import {
  FaIdBadge,
  FaUsers,
  FaLeaf,
  FaShieldAlt,
  FaGlobeAmericas,
} from "react-icons/fa";

import {
  Reveal,
  RevealPanel,
  StaggerGroup,
  useMotionPresets,
} from "@/components/motion-safe";
import { ctaButtonClass } from "@/components/sections/hub";

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
    <main className="bg-[#FAF8F5] min-h-dvh text-brand-body">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* =============================== HERO =============================== */}
      <div
        className="relative bg-fixed bg-center bg-cover"
        style={{ backgroundImage: "url('/nature.jpg')" }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/5 to-black/10" />

        <header
          className="relative min-h-[60dvh] flex items-center justify-center overflow-hidden"
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
                <div
                  className="mt-6 flex flex-wrap items-center justify-center gap-2"
                  aria-label="Insignias de confianza"
                >
                  {[
                    {
                      icon: <FaShieldAlt aria-hidden />,
                      text: "Privado y confidencial",
                    },
                    {
                      icon: <FaGlobeAmericas aria-hidden />,
                      text: "Bilingüe (ES/EN)",
                    },
                    {
                      icon: <FaIdBadge aria-hidden />,
                      text: "Agente hipotecaria licenciada (L2)",
                    },
                  ].map((item) => (
                    <span
                      key={item.text}
                      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-brand-green/30 text-brand-green/90 text-xs md:text-sm"
                    >
                      {item.icon} {item.text}
                    </span>
                  ))}
                </div>
              </Reveal>
            </section>
          </StaggerGroup>
        </header>
      </div>

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

      {/* ==================== FILOSOFÍA DE INVITACIÓN ==================== */}
      <RevealPanel
        className="mt-16"
        aria-label="Por qué trabajamos por invitación"
      >
        <SectionTitle title="Por qué trabajamos por invitación" />
        <Reveal variants={fade}>
          <p className="font-sans text-lg text-brand-body/90 mb-4 text-center max-w-2xl mx-auto leading-relaxed">
            Los mejores resultados financieros nacen de relaciones basadas en la
            confianza y en una conexión genuina. Cada proceso comienza con una
            conversación significativa.
          </p>
        </Reveal>
        <StaggerGroup className="text-left max-w-2xl mx-auto">
          <Reveal variants={fadeUp}>
            <ul className="list-disc pl-6 text-brand-body/90 text-base space-y-2">
              <li>Confirmamos tus metas y tiempos antes de comenzar.</li>
              <li>Te conectamos con la persona adecuada para cada paso.</li>
              <li>
                Creamos un plan adaptado a tus fortalezas y estilo de decisión,
                siempre respetando las bases financieras, fiscales y legales.
              </li>
            </ul>
          </Reveal>
        </StaggerGroup>
        <Reveal variants={fade}>
          <div className="mt-6 text-center">
            <Link
              href="/es/contacto?intent=hola"
              className="text-brand-blue/80 underline decoration-2 underline-offset-4 hover:text-brand-green"
            >
              Cuando estés listo(a), envíame un mensaje →
            </Link>
          </div>
        </Reveal>
      </RevealPanel>

      {/* ============================ CREDENCIALES ============================ */}
      <RevealPanel
        className="mt-16"
        aria-label="Certificaciones y colaboradores"
      >
        <SectionTitle title="Confianza profesional, trato humano" />
        <StaggerGroup className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
          {[
            {
              icon: <FaIdBadge aria-hidden className="text-xl" />,
              text: "Agente hipotecaria licenciada (L2)",
            },
            {
              icon: <FaUsers aria-hidden className="text-xl" />,
              text: "Equipo coordinado de especialistas",
            },
            {
              icon: <FaLeaf aria-hidden className="text-xl" />,
              text: "Personalización opcional con Diseño Humano",
            },
          ].map((b) => (
            <Reveal key={b.text} variants={fadeUp}>
              <div className="group bg-white rounded-2xl p-8 shadow-md border border-brand-gold/20 flex flex-col transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-lg">
                <div className="text-2xl text-brand-green/90 flex items-center justify-center">
                  {b.icon}
                </div>
                <p className="font-semibold text-brand-blue/90 mt-2">
                  {b.text}
                </p>
              </div>
            </Reveal>
          ))}
        </StaggerGroup>
      </RevealPanel>

      {/* ======================= SERVICIOS PRINCIPALES ======================= */}
      <RevealPanel className="mt-16" aria-label="Servicios principales">
        <SectionTitle title="Cómo puedo acompañarte" />
        <StaggerGroup className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: "💡",
              title: "Orientación financiera",
              body: "Apoyo claro y humano para tus metas financieras, enfocado en tus fortalezas naturales.",
              bullets: [
                "Planes de presupuesto y flujo de efectivo prácticos",
                "Estrategias de deuda, crédito y ahorro sostenibles",
                "Opcional: Diseño Humano para afinar ritmo y seguimiento",
              ],
              href: "/es/servicios#support",
              label: "Explorar orientación financiera",
            },
            {
              icon: "🌱",
              title: "Planeación fiscal holística",
              body: "Estrategias alineadas a tus valores para conservar más de lo que generas—incluyendo opciones como la Revisión Fiscal Holística de 10 Años.",
              bullets: [
                "Para personas y pequeños negocios",
                "Enfoque cumplido y amable con tu flujo de caja",
                "Recordatorios estacionales y listas de preparación",
              ],
              href: "/es/revision-impuestos",
              label: "Explorar revisión fiscal",
            },
            {
              icon: "🏡",
              title: "Asesoría hipotecaria",
              body: "Orientación profesional para primeras compras, refinanciamientos o inversiones de 4–10 unidades.",
              bullets: [
                "Preaprobación y preparación de crédito",
                "Propiedades multi-unidad e inversión",
                "Optimización de tasa, plazo y estructura",
              ],
              href: "/es/servicios#hipoteca",
              label: "Explorar asesoría hipotecaria",
            },
          ].map((c) => (
            <Reveal key={c.title} variants={fadeUp}>
              <div className="group bg-white rounded-2xl p-8 shadow-md border border-brand-gold/20 flex flex-col transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-lg">
                <div className="w-14 h-14 mb-4 rounded-full bg-brand-green flex items-center justify-center text-white text-2xl">
                  <span aria-hidden>{c.icon}</span>
                </div>
                <h3 className="font-serif text-2xl text-brand-blue/90 mb-2 font-bold">
                  {c.title}
                </h3>
                <p className="font-sans text-brand-body/90 mb-4">{c.body}</p>
                <ul className="list-disc pl-6 text-brand-body/90 text-sm space-y-1 mb-6">
                  {c.bullets.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
                <Link
                  href={c.href}
                  aria-label={c.label}
                  className={ghostCtaClass}
                >
                  {c.label}
                </Link>
              </div>
            </Reveal>
          ))}
        </StaggerGroup>
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
              href="/es/servicios#support"
              className={ghostCtaClass}
            >
              Ver detalles del programa
            </Link>
            <Link
              href={`/es/contacto?intent=paquete&package=${encodeURIComponent(
                "Conversaciones Holísticas Familiares — Cohorte de 4 semanas"
              )}`}
              className={secondaryCtaClass}
            >
              Hablar con nosotros
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
