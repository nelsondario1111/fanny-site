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

/* ============================= Section Title ============================= */
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
      {/* =============================== HERO =============================== */}
<div
  className="relative bg-fixed bg-center bg-cover"
  style={{ backgroundImage: "url('/nature.jpg')" }}
>
  <div className="absolute inset-0 bg-gradient-to-b from-black/5 via-black/0 to-black/5" />

  <header
    className="relative min-h-[60dvh] flex items-center justify-center overflow-hidden"
    aria-label="Hero"
  >
    <StaggerGroup className="w-full px-4">
      <section className="max-w-content mx-auto px-5 sm:px-8 pt-6 sm:pt-8 pb-10 sm:pb-14 bg-white/90 rounded-2xl border border-brand-gold/20 shadow-md backdrop-blur-[2px] text-center relative">
        {/* espacio interno suave en lugar de margen */}

        <Reveal variants={fadeUp}>
          <h1 className="font-serif font-extrabold text-5xl md:text-6xl text-brand-green/90 mb-4 tracking-tight">
            Números claros, decisiones con calma.
          </h1>
        </Reveal>

        <Reveal variants={fade}>
          <p className="font-sans text-lg md:text-xl text-brand-blue/90 mb-6 leading-relaxed max-w-2xl mx-auto">
            Cuando estés lista(o) para un acompañamiento financiero humano y
            consciente, estoy aquí para caminar contigo—ofreciendo apoyo que
            honra tu proceso único.
          </p>
        </Reveal>

        <Reveal variants={fade}>
          <nav
            aria-label="Acciones principales"
            className="flex flex-col items-center gap-2"
          >
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/es/servicios"
                aria-label="Explorar servicios"
                className="px-8 py-3 bg-brand-green text-white rounded-full font-semibold border-2 border-brand-green hover:bg-brand-gold hover:text-brand-green transition"
              >
                Explorar Servicios
              </Link>
              <Link
                href="/es/herramientas"
                aria-label="Ver herramientas"
                className="px-8 py-3 bg-transparent text-brand-blue/90 rounded-full font-semibold border-2 border-brand-blue/60 hover:bg-brand-blue/80 hover:text-white transition"
              >
                Ver Herramientas
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
              { icon: <FaShieldAlt aria-hidden />, text: "Privado y confidencial" },
              { icon: <FaGlobeAmericas aria-hidden />, text: "Bilingüe (ES/EN)" },
              { icon: <FaIdBadge aria-hidden />, text: "Agente hipotecaria licenciada (L2)" },
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
              dueños de negocio que buscan resultados prácticos sin perder la
              paz interior ni sus valores.
            </p>
            <ul className="list-disc pl-6 text-brand-body/90 text-base space-y-2 mb-8">
              <li>
                Planes que se adaptan a tu vida—basados en cómo tomas decisiones
                naturalmente.
              </li>
              <li>
                Lente opcional de Diseño Humano para personalizar comunicación y
                ritmo—sin reemplazar fundamentos financieros o legales.
              </li>
              <li>Próximos pasos claros después de cada sesión—sin estrés.</li>
            </ul>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/es/sobre-mi"
                aria-label="Descubre la trayectoria de Fanny Samaniego"
                className="px-8 py-3 bg-transparent text-brand-green rounded-full font-semibold border-2 border-brand-green hover:bg-brand-green hover:text-white transition-all"
              >
                Descubrir Mi Trayectoria
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
      <RevealPanel className="mt-16" aria-label="Por qué trabajamos por invitación">
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
      <RevealPanel className="mt-16" aria-label="Certificaciones y colaboradores">
        <SectionTitle title="Confianza profesional, trato humano" />
        <StaggerGroup className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
          {[
            { icon: <FaIdBadge aria-hidden className="text-xl" />, text: "Agente hipotecaria licenciada (L2)" },
            { icon: <FaUsers aria-hidden className="text-xl" />, text: "Equipo coordinado de especialistas" },
            { icon: <FaLeaf aria-hidden className="text-xl" />, text: "Personalización opcional con Diseño Humano" },
          ].map((b) => (
            <Reveal key={b.text} variants={fadeUp}>
              <div className="group bg-white rounded-2xl p-8 shadow-md border border-brand-gold/20 flex flex-col hover:-translate-y-0.5 hover:shadow-lg transition-transform duration-200">
                <div className="text-2xl text-brand-green/90 flex items-center justify-center">{b.icon}</div>
                <p className="font-semibold text-brand-blue/90 mt-2">{b.text}</p>
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
              title: "Orientación Financiera",
              body: "Apoyo claro y humano para tus metas financieras, enfocado en tus fortalezas naturales.",
              bullets: [
                "Planes de presupuesto y flujo de efectivo prácticos",
                "Estrategias de deuda, crédito y ahorro sostenibles",
                "Opcional: Diseño Humano para afinar ritmo y seguimiento",
              ],
              href: "/es/servicios#fundamentos",
              label: "Explorar Orientación Financiera",
            },
            {
              icon: "🌱",
              title: "Planeación Fiscal Holística",
              body: "Estrategias alineadas a tus valores para conservar más de lo que generas.",
              bullets: [
                "Para personas y pequeños negocios",
                "Enfoque cumplido y amable con tu flujo de caja",
                "Recordatorios estacionales y listas de preparación",
              ],
              href: "/es/servicios#fiscal",
              label: "Explorar Planeación Fiscal",
            },
            {
              icon: "🏡",
              title: "Asesoría Hipotecaria",
              body: "Orientación profesional para primeras compras, refinanciamientos o inversiones de 4–10 unidades.",
              bullets: [
                "Preaprobación y preparación de crédito",
                "Propiedades multi-unidad e inversión",
                "Optimización de tasa, plazo y estructura",
              ],
              href: "/es/servicios#hipoteca",
              label: "Explorar Asesoría Hipotecaria",
            },
          ].map((c) => (
            <Reveal key={c.title} variants={fadeUp}>
              <div className="group bg-white rounded-2xl p-8 shadow-md border border-brand-gold/20 flex flex-col hover:-translate-y-0.5 hover:shadow-lg transition-transform duration-200">
                <div className="w-14 h-14 mb-4 rounded-full bg-brand-green flex items-center justify-center text-white text-2xl">
                  <span aria-hidden>{c.icon}</span>
                </div>
                <h3 className="font-serif text-2xl text-brand-blue/90 mb-2 font-bold">{c.title}</h3>
                <p className="font-sans text-brand-body/90 mb-4">{c.body}</p>
                <ul className="list-disc pl-6 text-brand-body/90 text-sm space-y-1 mb-6">
                  {c.bullets.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
                <Link
                  href={c.href}
                  aria-label={c.label}
                  className="px-8 py-3 bg-transparent text-brand-green rounded-full font-semibold border-2 border-brand-green hover:bg-brand-green hover:text-white transition-all inline-block"
                >
                  {c.label}
                </Link>
              </div>
            </Reveal>
          ))}
        </StaggerGroup>
      </RevealPanel>

      {/* ================ PROGRAMA MESA DE DIÁLOGO ================= */}
      <RevealPanel className="mt-16" aria-label="Conversaciones de Mesa — programa grupal de 4 semanas">
        <SectionTitle title="Conversaciones de Mesa" kicker="Programa grupal de 4 semanas" />
        <Reveal variants={fade}>
          <p className="text-center text-brand-body/90 mt-2 max-w-2xl mx-auto leading-relaxed">
            Círculos pequeños y cercanos, guiados por Fanny y su equipo—como una charla alrededor de la mesa—donde puedes hacer preguntas, obtener claridad y salir con pasos concretos.
          </p>
        </Reveal>

        <StaggerGroup className="grid md:grid-cols-3 gap-6 mt-8">
          {[
            { title: "Para quién es", items: ["Compradores primerizos y recién llegados", "Familias alineando valores y presupuesto", "Inversionistas con propiedades multi-unidad (4–10)"] },
            { title: "Qué abordamos", items: ["Pasos, tasas y preparación hipotecaria", "Estrategia de flujo, deuda y crédito", "Planeación consciente y sin estrés"] },
            { title: "Cómo funciona", items: ["Grupos pequeños (amables y enfocados)", "4 sesiones semanales de 45–60 min", "Acciones simples después de cada encuentro"] },
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
              href="/es/servicios#familia"
              className="px-8 py-3 bg-transparent text-brand-green rounded-full font-semibold border-2 border-brand-green hover:bg-brand-green hover:text-white transition"
            >
              Ver detalles del programa
            </Link>
            <Link
              href={`/es/contacto?intent=paquete&package=${encodeURIComponent("Conversaciones Holísticas Familiares — Cohorte de 4 semanas")}`}
              className="px-8 py-3 bg-transparent text-brand-blue/90 rounded-full font-semibold border-2 border-brand-blue/50 hover:bg-brand-blue/80 hover:text-white transition"
            >
              Hablar con nosotros
            </Link>
          </div>
        </Reveal>
      </RevealPanel>

      {/* ======================= HERRAMIENTAS Y ARTÍCULOS ======================= */}
      <RevealPanel className="mt-16" aria-label="Herramientas y artículos útiles">
        <SectionTitle title="Herramientas y artículos útiles" />
        <StaggerGroup className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Reveal variants={fadeUp}>
            <div className="group bg-white rounded-2xl p-8 shadow-md border border-brand-gold/20 flex flex-col hover:-translate-y-0.5 hover:shadow-lg transition-transform">
              <h3 className="font-serif text-2xl text-brand-blue/90 font-bold mb-2">Herramientas</h3>
              <p className="text-brand-body/90 mb-6">
                Calculadoras simples, listas y guías prácticas para mantener el orden financiero sin complicaciones.
              </p>
              <ul className="list-disc pl-6 text-brand-body/90 text-sm space-y-1 mb-6">
                <li>Plantilla de presupuesto y flujo de caja</li>
                <li>Lista de preparación hipotecaria</li>
                <li>Checklist para temporada de impuestos</li>
              </ul>
              <Link
                href="/es/herramientas"
                aria-label="Ver herramientas"
                className="px-8 py-3 bg-transparent text-brand-green rounded-full font-semibold border-2 border-brand-green hover:bg-brand-green hover:text-white transition"
              >
                Ver Herramientas
              </Link>
            </div>
          </Reveal>

          <Reveal variants={fadeUp}>
            <div className="group bg-white rounded-2xl p-8 shadow-md border border-brand-gold/20 flex flex-col hover:-translate-y-0.5 hover:shadow-lg transition-transform">
              <h3 className="font-serif text-2xl text-brand-blue/90 font-bold mb-2">Artículos</h3>
              <p className="text-brand-body/90 mb-6">
                Lecturas breves y útiles sobre hipotecas, comportamiento financiero y conceptos fiscales, sin jerga ni tecnicismos.
              </p>
              <ul className="list-disc pl-6 text-brand-body/90 text-sm space-y-1 mb-6">
                <li>Guía para comprar tu primera vivienda (Toronto)</li>
                <li>Estrategia de deuda sin culpa</li>
                <li>Impuestos para pequeños negocios: qué registrar</li>
              </ul>
              <Link
                href="/es/recursos"
                aria-label="Leer artículos"
                className="px-8 py-3 bg-transparent text-brand-green rounded-full font-semibold border-2 border-brand-green hover:bg-brand-green hover:text-white transition"
              >
                Leer Artículos
              </Link>
            </div>
          </Reveal>
        </StaggerGroup>
      </RevealPanel>

      {/* ============================ SUSCRIPCIÓN ============================ */}
      <RevealPanel className="mt-20" aria-label="Suscripción a consejos y recursos">
        <Reveal variants={fadeUp}>
          <div className="text-center max-w-3xl mx-auto bg-white/80 rounded-2xl p-10 shadow-sm border border-brand-gold/20">
            <h3 className="font-serif text-2xl text-brand-green/90 font-bold mb-2">Mantente al tanto</h3>
            <p className="text-brand-body/90 mb-6">
              Recibe consejos, listas y recordatorios mensuales—bilingües y sin spam.
            </p>
            <Link
              href="/es/suscripcion"
              aria-label="Ir a la página de suscripción"
              className="px-10 py-3 bg-brand-green text-white rounded-full font-semibold border-2 border-brand-green hover:bg-brand-gold hover:text-brand-green transition"
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
            Sin prisa y sin presión—solo orientación clara cuando sientas que es el momento.
          </p>
          <Link
            href="/es/contacto?intent=hola"
            aria-label="Iniciar una conversación"
            className="px-8 py-3 bg-transparent text-brand-blue/90 rounded-full font-semibold border-2 border-brand-blue/60 hover:bg-brand-blue/80 hover:text-white transition"
          >
            Iniciar Conversación
          </Link>
          <p className="text-xs text-brand-blue/60 mt-3 max-w-xl mx-auto">
            El Diseño Humano es opcional—solo se usa para personalizar comunicación y ritmo. Nunca reemplaza fundamentos financieros, fiscales ni legales.
          </p>
        </section>
      </Reveal>
    </main>
  );
}
