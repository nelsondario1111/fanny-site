"use client";

import Image from "next/image";
import Link from "next/link";
import type React from "react";
import { FaIdBadge, FaUsers, FaLeaf, FaShieldAlt, FaGlobeAmericas } from "react-icons/fa";

import { Reveal, RevealPanel, StaggerGroup, useMotionPresets } from "@/components/motion-safe";

/* ============================= Título de sección ============================= */
function SectionTitle({ title, kicker }: { title: string; kicker?: string }) {
  const { fade, fadeUp } = useMotionPresets();
  return (
    <div className="text-center mb-8">
      {kicker && (
        <Reveal variants={fade}>
          <div className="text-brand-blue/80 text-base md:text-lg mb-2">{kicker}</div>
        </Reveal>
      )}
      <Reveal variants={fadeUp}>
        <h2 className="font-serif text-3xl md:text-4xl text-brand-green font-bold tracking-tight">
          {title}
        </h2>
      </Reveal>
      <Reveal variants={fade}>
        <div className="flex justify-center mt-3" aria-hidden="true">
          <div className="w-16 h-[3px] rounded-full bg-brand-gold" />
        </div>
      </Reveal>
    </div>
  );
}

/* ================================= Página ================================= */
export default function HomeEs() {
  const { fade, fadeUp } = useMotionPresets();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Fanny Samaniego",
    url: "https://www.fannysamaniego.com/es/",
    logo: "https://www.fannysamaniego.com/apple-touch-icon.png",
    founder: {
      "@type": "Person",
      name: "Fanny Samaniego",
      jobTitle: "Asesora Financiera y Agente Hipotecaria",
      worksFor: { "@type": "Organization", name: "Fanny Samaniego" },
    },
    makesOffer: [
      {
        "@type": "Offer",
        category: "Coaching Financiero",
        itemOffered: { "@type": "Service", name: "Coaching y Planificación Financiera Premium" },
      },
      {
        "@type": "Offer",
        category: "Servicios Hipotecarios",
        itemOffered: { "@type": "Service", name: "Preparación Hipotecaria y Preaprobación" },
      },
      {
        "@type": "Offer",
        category: "Planificación Fiscal",
        itemOffered: { "@type": "Service", name: "Ritmo y Estrategia Fiscal Holística" },
      },
    ],
  } as const;

  return (
    <main className="bg-brand-beige min-h-dvh">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* =============================== HERO =============================== */}
      <header className="relative min-h-[60dvh] flex items-center justify-center overflow-hidden mt-6" aria-label="Hero">
        <div className="absolute inset-0 -z-10">
          <Image src="/nature.jpg" alt="" aria-hidden fill priority sizes="100vw" className="object-cover object-center" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/0 to-black/10" />
        </div>

        <StaggerGroup className="w-full px-4">
          <section className="max-w-content mx-auto px-5 sm:px-8 py-8 sm:py-12 bg-white/95 rounded-[28px] border border-brand-gold/40 shadow-lg backdrop-blur-[1px] text-center relative">
            {/* acento dorado sutil */}
            <div aria-hidden className="absolute -top-1 left-8 right-8 h-[3px] rounded-full bg-brand-gold/80 shadow-[0_1px_0_rgba(0,0,0,0.06)]" />

            <Reveal variants={fadeUp}>
              <h1 className="font-serif font-extrabold text-5xl md:text-6xl text-brand-green mb-4 tracking-tight">
                Números claros, decisiones con calma
              </h1>
            </Reveal>

            <Reveal variants={fade}>
              <p className="font-sans text-xl md:text-2xl text-brand-blue mb-7 leading-relaxed">
                Cuando estés listo para una guía financiera holística y con corazón, estoy aquí para
                caminar a tu lado—ofreciendo un acompañamiento que honra tu camino único.
              </p>
            </Reveal>

            <Reveal variants={fade}>
              <nav aria-label="Acciones principales" className="flex flex-col items-center gap-2">
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link
                    href="/es/servicios"
                    aria-label="Explorar servicios"
                    className="px-8 py-3 bg-brand-green text-white rounded-full font-semibold border-2 border-brand-green hover:bg-brand-gold hover:text-brand-green transition inline-block"
                  >
                    Explorar Servicios
                  </Link>
                  <Link
                    href="/es/herramientas"
                    aria-label="Ver herramientas"
                    className="px-8 py-3 bg-transparent text-brand-blue rounded-full font-semibold border-2 border-brand-blue hover:bg-brand-blue hover:text-white transition inline-block"
                  >
                    Ver Herramientas
                  </Link>
                </div>
                <Link
                  href="/es/contacto?intent=hola"
                  className="px-4 py-2 mt-1 rounded-full border border-brand-blue text-[15px] text-brand-blue hover:bg-brand-blue hover:text-white transition"
                >
                  Iniciar una conversación
                </Link>
              </nav>
            </Reveal>

            <Reveal variants={fade}>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-2" aria-label="Insignias de confianza">
                <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-brand-gold/60 text-brand-green text-sm">
                  <FaShieldAlt aria-hidden /> Privado y confidencial
                </span>
                <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-brand-gold/60 text-brand-green text-sm">
                  <FaGlobeAmericas aria-hidden /> Bilingüe (ES/EN)
                </span>
                <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-brand-gold/60 text-brand-green text-sm">
                  <FaIdBadge aria-hidden /> Agente hipotecaria con licencia (Nivel 2)
                </span>
              </div>
            </Reveal>
          </section>
        </StaggerGroup>
      </header>

      {/* ============================ SOBRE FANNY ============================ */}
      <RevealPanel className="mt-10" aria-label="Sobre Fanny Samaniego">
        <StaggerGroup className="flex flex-col md:flex-row items-center gap-8">
          <Reveal variants={fadeUp} className="md:w-1/2 flex justify-center">
            <Image
              src="/fanny.jpg"
              alt="Fanny Samaniego — Asesora Financiera y Agente Hipotecaria en Toronto"
              width={360}
              height={360}
              className="rounded-full shadow-xl object-cover border-4 border-brand-green"
              priority
            />
          </Reveal>
          <Reveal variants={fadeUp} className="md:w-1/2">
            <h2 className="font-serif text-3xl md:text-4xl text-brand-green mb-4 font-bold">Sabiduría por invitación, compartida con el corazón</h2>
            <p className="font-sans text-lg md:text-xl text-brand-body mb-6 leading-relaxed">
              Soy Fanny Samaniego—<b>asesora financiera bilingüe, coach holística y agente hipotecaria con licencia</b> en Toronto. Con un equipo coordinado, guiamos a familias profesionales, ejecutivos y dueños de negocio que buscan resultados prácticos sin perder de vista la paz mental y los valores.
            </p>
            <ul className="list-disc pl-6 text-brand-body text-base md:text-lg space-y-2 mb-8">
              <li>Planes que encajan con tu vida—basados en cómo decides y cumples de manera natural.</li>
              <li>Enfoque opcional de Diseño Humano para personalizar comunicación y ritmo—sin reemplazar fundamentos financieros o legales.</li>
              <li>Próximos pasos claros después de cada llamada—sin abrumarte.</li>
            </ul>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/es/sobre-mi"
                aria-label="Conoce la historia de Fanny Samaniego"
                className="px-8 py-3 bg-transparent text-brand-blue rounded-full font-semibold border-2 border-brand-blue hover:bg-brand-green hover:text-white transition-all inline-block"
              >
                Conoce mi historia
              </Link>
              <Link
                href="/es/contacto?intent=question"
                aria-label="Iniciar una conversación"
                className="self-center text-brand-blue underline decoration-2 underline-offset-4 hover:text-brand-green"
              >
                Exploremos tus opciones
              </Link>
            </div>
          </Reveal>
        </StaggerGroup>
      </RevealPanel>

      {/* ==================== FILOSOFÍA DE INVITACIÓN ==================== */}
      <RevealPanel className="mt-8" aria-label="Por qué trabajamos por invitación">
        <SectionTitle title="Por qué trabajamos por invitación" />
        <Reveal variants={fade}>
          <p className="font-sans text-lg text-brand-body mb-4 text-center max-w-3xl mx-auto leading-relaxed">
            Los resultados financieros sólidos nacen de relaciones basadas en la confianza y el buen encaje. Todo comienza con una conversación.
          </p>
        </Reveal>
        <StaggerGroup className="text-left max-w-2xl mx-auto">
          <Reveal variants={fadeUp}>
            <ul className="list-disc pl-6 text-brand-body text-base space-y-2">
              <li>Confirmamos tus metas y tiempos antes de empezar.</li>
              <li>Conoces a la persona adecuada de nuestro equipo para cada paso.</li>
              <li>Diseñamos un plan según tus fortalezas y estilo de decisión (Diseño Humano opcional), manteniendo los fundamentos financieros, fiscales y legales.</li>
            </ul>
          </Reveal>
        </StaggerGroup>
        <Reveal variants={fade}>
          <div className="mt-6 text-center">
            <Link href="/es/contacto?intent=hola" className="text-brand-blue underline decoration-2 underline-offset-4 hover:text-brand-green">
              Cuando estés listo, envía un mensaje →
            </Link>
          </div>
        </Reveal>
      </RevealPanel>

      {/* ============================ INSIGNIAS ============================ */}
      <RevealPanel className="mt-8" aria-label="Certificaciones y aliados">
        <StaggerGroup className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
          {[
            { icon: <FaIdBadge aria-hidden className="text-xl" />, text: "Agente Hipotecaria con Licencia (Nivel 2)" },
            { icon: <FaUsers aria-hidden className="text-xl" />, text: "Equipo coordinado de especialistas" },
            { icon: <FaLeaf aria-hidden className="text-xl" />, text: "Personalización con Diseño Humano (opcional)" },
          ].map((b) => (
            <Reveal key={b.text} variants={fadeUp}>
              <div className="group bg-white rounded-2xl p-8 shadow-lg border border-brand-gold flex flex-col transition-transform duration-200 will-change-transform hover:-translate-y-1 hover:shadow-xl">
                <div className="text-2xl text-brand-green flex items-center justify-center">{b.icon}</div>
                <p className="font-semibold text-brand-blue mt-2">{b.text}</p>
              </div>
            </Reveal>
          ))}
        </StaggerGroup>
      </RevealPanel>

      {/* ======================= PREVIA DE SERVICIOS ======================= */}
      <RevealPanel className="mt-8" aria-label="Servicios principales">
        <SectionTitle title="Formas en que podemos guiarte" />
        <StaggerGroup className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: "💡",
              title: "Orientación Financiera",
              body: "Acompañamiento claro y con corazón para tus metas financieras—anclado en tus fortalezas naturales.",
              bullets: [
                "Presupuesto y flujo de caja que sí usarás",
                "Estrategia de deudas, reparación de crédito y sistemas de ahorro",
                "Diseño Humano opcional para afinar ritmo y accountability",
              ],
              href: "/es/servicios#fundamentos",
              label: "Explorar Orientación Financiera",
              secondary: { label: "¿Tienes preguntas?", href: "/es/contacto?intent=question" },
            },
            {
              icon: "🌱",
              title: "Planificación Fiscal Holística",
              body: "Estrategias prácticas y alineadas a tus valores para conservar más de lo que ganas.",
              bullets: [
                "Consideraciones personales y de pequeños negocios",
                "Planificación amigable con el flujo de caja y enfocada en el cumplimiento",
                "Recordatorios estacionales y listas de preparación",
              ],
              href: "/es/servicios#legado",
              label: "Explorar Planificación Fiscal",
              secondary: { label: "¿Tienes preguntas?", href: "/es/contacto?intent=question" },
            },
            {
              icon: "🏡",
              title: "Asesoría Hipotecaria",
              body: "Consejería con licencia para primera vivienda, mejoras, refinanciación e inversiones multi-unidad.",
              bullets: [
                "Preaprobación y verificación de preparación",
                "Propiedades de 4–10 unidades y estrategia de inversión",
                "Optimización de tasa, plazo y estructura",
              ],
              href: "/es/servicios#hipoteca",
              label: "Explorar Asesoría Hipotecaria",
              secondary: { label: "Conversemos", href: "/es/contacto?intent=preapproval" },
            },
          ].map((c) => (
            <Reveal key={c.title} variants={fadeUp}>
              <div className="group bg-white rounded-2xl p-8 shadow-lg border border-brand-gold flex flex-col transition-transform duration-200 will-change-transform hover:-translate-y-1 hover:shadow-xl">
                <div className="w-14 h-14 mb-4 rounded-full bg-brand-green flex items-center justify-center text-white text-2xl">
                  <span aria-hidden>{c.icon}</span>
                </div>
                <h3 className="font-serif text-2xl text-brand-blue mb-2 font-bold">{c.title}</h3>
                <p className="font-sans text-brand-body mb-4">{c.body}</p>
                <ul className="list-disc pl-6 text-brand-body text-sm space-y-1 mb-6">
                  {c.bullets.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
                <div className="mt-auto space-y-2">
                  <Link
                    href={c.href}
                    aria-label={c.label}
                    className="px-8 py-3 bg-transparent text-brand-green rounded-full font-semibold border-2 border-brand-green hover:bg-brand-green hover:text-white transition-all inline-block"
                  >
                    {c.label}
                  </Link>
                  {c.secondary && (
                    <div>
                      <Link href={c.secondary.href} className="text-sm text-brand-blue/80 underline decoration-2 underline-offset-4 hover:text-brand-green">
                        {c.secondary.label}
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </Reveal>
          ))}
        </StaggerGroup>
      </RevealPanel>

      {/* ============== CONVERSACIONES EN LA MESA — PROGRAMA 4 SEMANAS ============== */}
      <RevealPanel className="mt-8" aria-label="Conversaciones en la Mesa — programa grupal de 4 semanas">
        <SectionTitle title="Conversaciones en la Mesa" kicker="Programa grupal de 4 semanas" />
        <Reveal variants={fade}>
          <p className="text-center text-brand-body mt-2 max-w-3xl mx-auto">
            Círculos pequeños y cercanos, dirigidos por Fanny y su equipo—como sentarse alrededor de la mesa—donde podrás hacer preguntas, obtener respuestas claras y salir con próximos pasos que realmente seguirás.
          </p>
        </Reveal>

        <StaggerGroup className="grid md:grid-cols-3 gap-6 mt-8">
          {[
            { title: "Para quién es", items: ["Compradores por primera vez y recién llegados", "Familias alineando valores y presupuesto", "Inversionistas explorando multi-unidad (4–10)"] },
            { title: "Qué cubrimos", items: ["Pasos, tasas y preparación hipotecaria", "Flujo de caja, deudas y estrategia de crédito", "Planificación sin estrés, alineada a tus valores"] },
            { title: "Cómo funciona", items: ["Grupos pequeños (amables y enfocados)", "4 sesiones semanales • 45–60 min", "Próximos pasos simples tras cada llamada"] },
          ].map((col) => (
            <Reveal key={col.title} variants={fadeUp}>
              <div className="rounded-2xl border border-brand-green/30 p-6 transition-transform duration-200 hover:-translate-y-0.5">
                <h4 className="font-serif text-xl text-brand-blue font-bold mb-2">{col.title}</h4>
                <ul className="list-disc pl-6 text-brand-body space-y-1">
                  {col.items.map((it) => (
                    <li key={it}>{it}</li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </StaggerGroup>

        <Reveal variants={fade}>
          <div className="text-center mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/es/servicios#familia" className="px-8 py-3 bg-transparent text-brand-green rounded-full font-semibold border-2 border-brand-green hover:bg-brand-green hover:text-white transition inline-block">
              Ver detalles del programa
            </Link>
            <Link
              href={`/es/contacto?intent=package&package=${encodeURIComponent("Conversaciones Familiares Holísticas — Cohorte de 4 semanas")}`}
              className="px-8 py-3 bg-transparent text-brand-blue rounded-full font-semibold border-2 border-brand-blue hover:bg-brand-blue hover:text-white transition inline-block"
            >
              Hablemos
            </Link>
          </div>
        </Reveal>
      </RevealPanel>

      {/* ======================= HERRAMIENTAS Y ARTÍCULOS ======================= */}
      <RevealPanel className="mt-8" aria-label="Herramientas y artículos útiles">
        <SectionTitle title="Herramientas y artículos útiles" />
        <StaggerGroup className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Reveal variants={fadeUp}>
            <div className="group bg-white rounded-2xl p-8 shadow-lg border border-brand-gold flex flex-col transition-transform duration-200 hover:-translate-y-1 hover:shadow-xl">
              <h3 className="font-serif text-2xl text-brand-blue font-bold mb-2">Herramientas</h3>
              <p className="text-brand-body mb-6">Calculadoras, listas y apoyos de decisión para avanzar—pensadas para cómo realmente cumples.</p>
              <ul className="list-disc pl-6 text-brand-body text-sm space-y-1 mb-6">
                <li>Hoja de presupuesto y flujo de caja</li>
                <li>Lista de preparación hipotecaria</li>
                <li>Checklist de temporada de impuestos</li>
              </ul>
              <Link
                href="/es/herramientas"
                aria-label="Ver herramientas"
                className="px-8 py-3 bg-transparent text-brand-green rounded-full font-semibold border-2 border-brand-green hover:bg-brand-green hover:text-white transition inline-block"
              >
                Ver Herramientas
              </Link>
            </div>
          </Reveal>

          <Reveal variants={fadeUp}>
            <div className="group bg-white rounded-2xl p-8 shadow-lg border border-brand-gold flex flex-col transition-transform duration-200 hover:-translate-y-1 hover:shadow-xl">
              <h3 className="font-serif text-2xl text-brand-blue font-bold mb-2">Artículos</h3>
              <p className="text-brand-body mb-6">Lecturas breves y prácticas sobre hipotecas, comportamiento del dinero y básicos fiscales—sin jerga, solo próximos pasos.</p>
              <ul className="list-disc pl-6 text-brand-body text-sm space-y-1 mb-6">
                <li>Ruta a tu primera vivienda (edición Toronto)</li>
                <li>Estrategia de deudas sin espiral de culpa</li>
                <li>Impuestos para pequeños negocios: qué registrar</li>
              </ul>
              <Link
                href="/es/recursos"
                aria-label="Leer artículos"
                className="px-8 py-3 bg-transparent text-brand-green rounded-full font-semibold border-2 border-brand-green hover:bg-brand-green hover:text-white transition inline-block"
              >
                Leer Artículos
              </Link>
            </div>
          </Reveal>
        </StaggerGroup>
      </RevealPanel>

      {/* ============================ SUSCRIPCIÓN ============================ */}
      <RevealPanel className="mt-8" aria-label="Suscríbete para recibir consejos y recursos">
        <Reveal variants={fadeUp}>
          <div className="text-center max-w-3xl mx-auto">
            <h3 className="font-serif text-2xl text-brand-green font-bold mb-2">Mantente al día</h3>
            <p className="text-brand-body mb-6">Recibe consejos mensuales, checklists y recordatorios suaves—bilingües y sin spam.</p>
            <Link
              href="/es/suscribirme"
              aria-label="Ir a la página de suscripción"
              className="px-10 py-3 bg-brand-green text-white rounded-full font-semibold shadow hover:bg-brand-gold hover:text-brand-green border-2 border-brand-blue transition inline-block"
            >
              Suscribirme
            </Link>
          </div>
        </Reveal>
      </RevealPanel>

      {/* =========================== BANDA FINAL =========================== */}
      <Reveal variants={fade}>
        <section className="py-16 text-center">
          <h3 className="font-serif text-2xl md:text-3xl text-brand-green font-bold mb-3">La claridad nace de la conversación.</h3>
          <p className="text-brand-body mb-5 max-w-xl mx-auto">Sin presión ni prisa—solo guía reflexiva cuando sea el momento adecuado para ti.</p>
          <Link
            href="/es/contacto?intent=hola"
            aria-label="Iniciar una conversación"
            className="px-8 py-3 bg-transparent text-brand-blue rounded-full font-semibold border-2 border-brand-blue hover:bg-brand-blue hover:text-white transition inline-block"
          >
            Iniciar una conversación
          </Link>
          <p className="text-xs text-brand-blue/70 mt-3 max-w-xl mx-auto">
            El Diseño Humano es opcional—solo se usa para personalizar comunicación y ritmo. Nunca reemplaza los fundamentos financieros, fiscales o legales.
          </p>
        </section>
      </Reveal>
    </main>
  );
}
