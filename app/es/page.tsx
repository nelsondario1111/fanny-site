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

/* ================================ Página principal ================================ */
export default function Home() {
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
      <header
        className="relative min-h-[60dvh] flex items-center justify-center overflow-hidden mt-6"
        aria-label="Hero"
      >
        <div className="absolute inset-0 -z-10">
          <Image
            src="/nature.jpg"
            alt=""
            aria-hidden
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/5 via-black/0 to-black/5" />
        </div>

        <StaggerGroup className="w-full px-4">
          <section className="max-w-content mx-auto px-5 sm:px-8 py-10 sm:py-14 bg-white/90 rounded-2xl border border-brand-gold/20 shadow-md backdrop-blur-[2px] text-center relative">
            <Reveal variants={fadeUp}>
              <h1 className="font-serif font-extrabold text-5xl md:text-6xl text-brand-green/90 mb-4 tracking-tight">
                Números claros, decisiones con calma.
              </h1>
            </Reveal>

            <Reveal variants={fade}>
              <p className="font-sans text-lg md:text-xl text-brand-blue/90 mb-6 leading-relaxed max-w-2xl mx-auto">
                Cuando estés lista/o para recibir asesoría financiera humana y
                holística, estoy aquí para caminar contigo—ofreciendo un
                acompañamiento que honra tu camino único.
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
                aria-label="Sellos de confianza"
              >
                {[
                  {
                    icon: <FaShieldAlt aria-hidden />,
                    text: "Privado y Confidencial",
                  },
                  {
                    icon: <FaGlobeAmericas aria-hidden />,
                    text: "Bilingüe (ES/EN)",
                  },
                  {
                    icon: <FaIdBadge aria-hidden />,
                    text: "Agente Hipotecaria (Nivel 2)",
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

      {/* ============================ SOBRE FANNY ============================ */}
      <RevealPanel className="mt-16" aria-label="Sobre Fanny Samaniego">
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
              Sabiduría Invitada, Compartida con el Corazón
            </h2>
            <p className="font-sans text-lg text-brand-body/90 mb-6 leading-relaxed max-w-2xl">
              Soy Fanny Samaniego—una <b>asesora financiera bilingüe, coach holística y agente hipotecaria licenciada</b> en Toronto. Con un equipo coordinado, acompañamos a familias profesionales, ejecutivos y emprendedores que desean resultados prácticos sin perder de vista sus valores ni su tranquilidad.
            </p>
            <ul className="list-disc pl-6 text-brand-body/90 text-base space-y-2 mb-8">
              <li>Planes adaptados a tu estilo de vida y forma natural de decidir.</li>
              <li>Enfoque opcional desde el Diseño Humano para personalizar la comunicación y ritmo—sin reemplazar fundamentos financieros o legales.</li>
              <li>Próximos pasos claros después de cada conversación—sin saturarte.</li>
            </ul>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/es/sobre-mi"
                aria-label="Conocer el recorrido de Fanny Samaniego"
                className="px-8 py-3 bg-transparent text-brand-green rounded-full font-semibold border-2 border-brand-green hover:bg-brand-green hover:text-white transition-all"
              >
                Conoce mi historia
              </Link>
              <Link
                href="/es/contacto?intent=pregunta"
                aria-label="Explorar opciones"
                className="self-center text-brand-blue/80 underline decoration-2 underline-offset-4 hover:text-brand-green"
              >
                Exploremos tus opciones
              </Link>
            </div>
          </Reveal>
        </StaggerGroup>
      </RevealPanel>
      {/* ======================= FILOSOFÍA DE INVITACIÓN ======================= */}
      <RevealPanel className="mt-16" aria-label="Filosofía de trabajo por invitación">
        <SectionTitle title="¿Por qué trabajamos por invitación?" />
        <Reveal variants={fade}>
          <p className="font-sans text-lg text-brand-body/90 mb-4 text-center max-w-2xl mx-auto leading-relaxed">
            Los mejores resultados financieros nacen de relaciones basadas en confianza y afinidad. Cada proceso comienza con una conversación.
          </p>
        </Reveal>
        <StaggerGroup className="text-left max-w-2xl mx-auto">
          <Reveal variants={fadeUp}>
            <ul className="list-disc pl-6 text-brand-body/90 text-base space-y-2">
              <li>Validamos tus objetivos y tiempos antes de empezar.</li>
              <li>Te conectamos con la especialista adecuada para cada etapa.</li>
              <li>Diseñamos un plan personalizado a tu estilo de decisión, manteniendo siempre las bases financieras y legales.</li>
            </ul>
          </Reveal>
        </StaggerGroup>
        <Reveal variants={fade}>
          <div className="mt-6 text-center">
            <Link
              href="/es/contacto?intent=hola"
              className="text-brand-blue/80 underline decoration-2 underline-offset-4 hover:text-brand-green"
            >
              Cuando estés lista/o, escríbeme →
            </Link>
          </div>
        </Reveal>
      </RevealPanel>

      {/* ======================= CERTIFICACIONES ======================= */}
      <RevealPanel className="mt-16" aria-label="Certificaciones y equipo">
        <SectionTitle title="Confianza profesional, enfoque humano" />
        <StaggerGroup className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
          {[
            { icon: <FaIdBadge aria-hidden className="text-xl" />, text: "Agente Hipotecaria Nivel 2" },
            { icon: <FaUsers aria-hidden className="text-xl" />, text: "Equipo Coordinado de Especialistas" },
            { icon: <FaLeaf aria-hidden className="text-xl" />, text: "Personalización opcional con Diseño Humano" },
          ].map((b) => (
            <Reveal key={b.text} variants={fadeUp}>
              <div className="group bg-white rounded-2xl p-8 shadow-md border border-brand-gold/20 flex flex-col transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-lg">
                <div className="text-2xl text-brand-green/90 flex items-center justify-center">{b.icon}</div>
                <p className="font-semibold text-brand-blue/90 mt-2">{b.text}</p>
              </div>
            </Reveal>
          ))}
        </StaggerGroup>
      </RevealPanel>

      {/* ======================= SERVICIOS ======================= */}
      <RevealPanel className="mt-16" aria-label="Servicios principales">
        <SectionTitle title="Formas en que puedo guiarte" />
        <StaggerGroup className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: "💡",
              title: "Guía Financiera",
              body: "Acompañamiento claro y empático para tus metas financieras—basado en tus fortalezas naturales.",
              bullets: [
                "Planes de flujo y presupuesto aplicables",
                "Estrategia de deudas y ahorro personalizado",
                "Opcional: Diseño Humano para ajustar ritmo y seguimiento",
              ],
              href: "/es/servicios#fundamentos",
              label: "Explorar Guía Financiera",
            },
            {
              icon: "🌱",
              title: "Planeación Fiscal Holística",
              body: "Estrategias alineadas a tus valores para conservar más de lo que generas.",
              bullets: [
                "Enfoque personal y de pequeño negocio",
                "Cumplimiento primero, sin estrés",
                "Recordatorios y listas de verificación estacionales",
              ],
              href: "/es/servicios#legado",
              label: "Explorar Planeación Fiscal",
            },
            {
              icon: "🏡",
              title: "Guía Hipotecaria",
              body: "Asesoría licenciada para primeras compras, renovación o inversión (hasta 10 unidades).",
              bullets: [
                "Pre-aprobación y preparación estratégica",
                "Propiedades de 4–10 unidades y análisis de inversión",
                "Optimización de tasa, plazo y estructura",
              ],
              href: "/es/servicios#hipoteca",
              label: "Explorar Guía Hipotecaria",
            },
          ].map((c) => (
            <Reveal key={c.title} variants={fadeUp}>
              <div className="group bg-white rounded-2xl p-8 shadow-md border border-brand-gold/20 flex flex-col transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-lg">
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

      {/* ======================= PROGRAMA FAMILIAR ======================= */}
      <RevealPanel className="mt-16" aria-label="Conversaciones Familiares — Programa de 4 semanas">
        <SectionTitle title="Conversaciones de Mesa Familiar" kicker="Programa de 4 semanas" />
        <Reveal variants={fade}>
          <p className="text-center text-brand-body/90 mt-2 max-w-2xl mx-auto leading-relaxed">
            Círculos pequeños, íntimos y guiados por Fanny y su equipo—como en la mesa de la cocina—donde puedes preguntar, entender, y avanzar con pasos claros.
          </p>
        </Reveal>

        <StaggerGroup className="grid md:grid-cols-3 gap-6 mt-8">
          {[
            { title: "Ideal para", items: ["Compradores primerizos", "Familias que quieren alinear valores y presupuesto", "Inversionistas interesados en 4–10 unidades"] },
            { title: "Cubrimos", items: ["Pasos de hipoteca, tasas y preparación", "Flujo, crédito y estrategia de deuda", "Planificación sin estrés, alineada a tus valores"] },
            { title: "Formato", items: ["Grupos pequeños (cálidos y enfocados)", "4 sesiones semanales de 45–60 min", "Acción concreta después de cada encuentro"] },
          ].map((col) => (
            <Reveal key={col.title} variants={fadeUp}>
              <div className="rounded-2xl border border-brand-green/30 p-6 hover:-translate-y-0.5 transition-transform duration-200">
                <h4 className="font-serif text-xl text-brand-blue/90 font-bold mb-2">{col.title}</h4>
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
              href="/es/servicios#familiar"
              className="px-8 py-3 bg-transparent text-brand-green rounded-full font-semibold border-2 border-brand-green hover:bg-brand-green hover:text-white transition"
            >
              Ver detalles del programa
            </Link>
            <Link
              href={`/es/contacto?intent=paquete&package=${encodeURIComponent("Conversaciones Familiares — 4 Semanas")}`}
              className="px-8 py-3 bg-transparent text-brand-blue/90 rounded-full font-semibold border-2 border-brand-blue/50 hover:bg-brand-blue/80 hover:text-white transition"
            >
              Habla con nosotras
            </Link>
          </div>
        </Reveal>
      </RevealPanel>

      {/* ======================= HERRAMIENTAS Y ARTÍCULOS ======================= */}
      <RevealPanel className="mt-16" aria-label="Herramientas y artículos">
        <SectionTitle title="Herramientas & Artículos Útiles" />
        <StaggerGroup className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Reveal variants={fadeUp}>
            <div className="group bg-white rounded-2xl p-8 shadow-md border border-brand-gold/20 flex flex-col hover:-translate-y-0.5 hover:shadow-lg transition-transform">
              <h3 className="font-serif text-2xl text-brand-blue/90 font-bold mb-2">Herramientas</h3>
              <p className="text-brand-body/90 mb-6">Hojas de cálculo, listas y ayudas para decisiones que realmente usarás.</p>
              <ul className="list-disc pl-6 text-brand-body/90 text-sm space-y-1 mb-6">
                <li>Plantilla de flujo mensual</li>
                <li>Lista de verificación hipotecaria</li>
                <li>Checklist para la temporada de impuestos</li>
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
              <p className="text-brand-body/90 mb-6">Lecturas breves y prácticas sobre hipotecas, dinero y planificación fiscal sin jerga técnica.</p>
              <ul className="list-disc pl-6 text-brand-body/90 text-sm space-y-1 mb-6">
                <li>Guía para comprar tu primera casa en Toronto</li>
                <li>Estrategias de deuda sin culpa</li>
                <li>Lo esencial para impuestos en pequeños negocios</li>
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

      {/* ======================= SUSCRIPCIÓN ======================= */}
      <RevealPanel className="mt-20" aria-label="Suscríbete a tips financieros">
        <Reveal variants={fadeUp}>
          <div className="text-center max-w-3xl mx-auto bg-white/80 rounded-2xl p-10 shadow-sm border border-brand-gold/20">
            <h3 className="font-serif text-2xl text-brand-green/90 font-bold mb-2">Mantente al tanto</h3>
            <p className="text-brand-body/90 mb-6">Recibe tips mensuales, listas prácticas y recordatorios — sin spam, en español o inglés.</p>
            <Link
              href="/es/suscribirse"
              aria-label="Página de suscripción"
              className="px-10 py-3 bg-brand-green text-white rounded-full font-semibold border-2 border-brand-green hover:bg-brand-gold hover:text-brand-green transition"
            >
              Suscribirme
            </Link>
          </div>
        </Reveal>
      </RevealPanel>

      {/* ======================= CIERRE ======================= */}
      <Reveal variants={fade}>
        <section className="py-20 text-center border-t border-brand-gold/10 mt-20">
          <h3 className="font-serif text-2xl md:text-3xl text-brand-green/90 font-bold mb-3">
            La claridad nace del diálogo.
          </h3>
          <p className="text-brand-body/90 mb-5 max-w-xl mx-auto">
            Sin presión ni apuro—solo guía consciente cuando tú estés lista/o.
          </p>
          <Link
            href="/es/contacto?intent=hola"
            aria-label="Iniciar una conversación"
            className="px-8 py-3 bg-transparent text-brand-blue/90 rounded-full font-semibold border-2 border-brand-blue/60 hover:bg-brand-blue/80 hover:text-white transition"
          >
            Iniciar una conversación
          </Link>
          <p className="text-xs text-brand-blue/60 mt-3 max-w-xl mx-auto">
            El enfoque de Diseño Humano es opcional y solo se usa para adaptar el acompañamiento. No reemplaza asesoría financiera, legal ni fiscal.
          </p>
        </section>
      </Reveal>
    </main>
  );
}
