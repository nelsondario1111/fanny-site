"use client";

import Image from "next/image";
import Link from "next/link";
import { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { Variants, Easing, Transition } from "framer-motion";
import { FaIdBadge, FaUsers, FaLeaf, FaShieldAlt, FaGlobeAmericas } from "react-icons/fa";

/* ---------------------- Ayudas de animación ---------------------- */
const easing: Easing = [0.22, 1, 0.36, 1];

function useAnims() {
  const prefersReduced = useReducedMotion();

  const base: Transition = prefersReduced ? { duration: 0 } : { duration: 0.6, ease: easing };
  const baseUp: Transition = prefersReduced ? { duration: 0 } : { duration: 0.6, ease: easing };
  const group: Transition = prefersReduced ? {} : { staggerChildren: 0.12, delayChildren: 0.05 };

  const fade: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: base },
  };

  const fadeUp: Variants = {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: baseUp },
  };

  const stagger: Variants = {
    hidden: {},
    visible: { transition: group },
  };

  return { fade, fadeUp, stagger };
}

/* ---------------- Primitivos de panel (alineados con Servicios/Herramientas) ---------------- */
function Panel({
  children,
  className = "",
  as,
}: {
  children: ReactNode;
  className?: string;
  as?: React.ElementType;
}) {
  const Tag: React.ElementType = as ?? "section";
  return (
    <Tag
      className={[
        "max-w-content mx-auto px-5 sm:px-8 py-8 sm:py-12",
        // Paneles más suaves, menos “boxy”
        "bg-white/95 rounded-[28px] border border-brand-gold/40 shadow-lg",
        "backdrop-blur-[1px]",
        className,
      ].join(" ")}
    >
      {children}
    </Tag>
  );
}

function MotionPanel({
  children,
  className = "",
  viewportAmount = 0.18,
}: {
  children: ReactNode;
  className?: string;
  viewportAmount?: number;
}) {
  const { fadeUp } = useAnims();
  return (
    <motion.section
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: viewportAmount }}
      className={className}
    >
      <Panel>{children}</Panel>
    </motion.section>
  );
}

/* Título de sección con divisor de marca */
function SectionTitle({ title, kicker }: { title: string; kicker?: string }) {
  const { fade, fadeUp } = useAnims();
  return (
    <motion.div
      variants={fade}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      className="text-center mb-8"
    >
      {kicker && (
        <motion.div variants={fade} className="text-brand-blue/80 text-base md:text-lg mb-2">
          {kicker}
        </motion.div>
      )}
      <motion.h2
        variants={fadeUp}
        className="font-serif text-3xl md:text-4xl text-brand-green font-bold tracking-tight"
      >
        {title}
      </motion.h2>
      <motion.div variants={fade} className="flex justify-center mt-3" aria-hidden="true">
        <div className="w-16 h-[3px] rounded-full bg-brand-gold" />
      </motion.div>
    </motion.div>
  );
}

/* ------------------------------- Página ------------------------------- */
export default function HomeEs() {
  const { fade, fadeUp, stagger } = useAnims();

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
        category: "Planeación Fiscal",
        itemOffered: { "@type": "Service", name: "Ritmo y Estrategia Fiscal Holística" },
      },
    ],
  };

  return (
    <main className="bg-brand-beige min-h-dvh">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ======================= HERO ======================= */}
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
          <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/0 to-black/10" />
        </div>

        <motion.div
          variants={stagger}
          initial="hidden"
          animate="visible"
          className="z-10 relative px-6 sm:px-10 py-10 rounded-[32px] text-center max-w-3xl mx-auto"
          style={{
            background: "rgba(255,255,255,0.9)",
            boxShadow: "0 12px 40px rgba(0,0,0,0.08)",
            backdropFilter: "blur(6px)",
          }}
        >
          {/* acento dorado sutil */}
          <div
            aria-hidden
            className="absolute -top-1 left-8 right-8 h-[3px] rounded-full bg-brand-gold/80 shadow-[0_1px_0_rgba(0,0,0,0.06)]"
          />
          <motion.h1
            variants={fadeUp}
            className="font-serif font-extrabold text-5xl md:text-6xl text-brand-green mb-4 tracking-tight"
          >
            Guía por invitación. Claridad con diseño.
          </motion.h1>

          <motion.p
            variants={fade}
            className="font-sans text-xl md:text-2xl text-brand-blue mb-7 leading-relaxed"
          >
            Cuando quieras una guía financiera integral y con corazón, camino contigo:
            apoyo claro que respeta tu forma única de decidir y avanzar.
          </motion.p>

          {/* Jerarquía clara de CTA */}
          <motion.nav
            variants={fade}
            aria-label="Acciones principales"
            className="flex flex-col items-center gap-2"
          >
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/es/servicios"
                aria-label="Explorar servicios"
                className="px-8 py-3 bg-brand-green text-white rounded-full font-semibold border-2 border-brand-green hover:bg-brand-gold hover:text-brand-green transition inline-block"
              >
                Explorar servicios
              </Link>
              <Link
                href="/es/herramientas"
                aria-label="Ver herramientas"
                className="px-8 py-3 bg-transparent text-brand-blue rounded-full font-semibold border-2 border-brand-blue hover:bg-brand-blue hover:text-white transition inline-block"
              >
                Ver herramientas
              </Link>
            </div>
            <Link
              href="/es/contacto?intent=hola"
              className="px-4 py-2 mt-1 rounded-full border border-brand-blue text-[15px] text-brand-blue hover:bg-brand-blue hover:text-white transition"
            >
              Iniciar una conversación
            </Link>
          </motion.nav>

          {/* Insignias de confianza */}
          <motion.div
            variants={fade}
            className="mt-6 flex flex-wrap items-center justify-center gap-2"
            aria-label="Insignias de confianza"
          >
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-brand-gold/60 text-brand-green text-sm">
              <FaShieldAlt aria-hidden /> Privado y confidencial
            </span>
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-brand-gold/60 text-brand-green text-sm">
              <FaGlobeAmericas aria-hidden /> Bilingüe (ES/EN)
            </span>
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-brand-gold/60 text-brand-green text-sm">
              <FaIdBadge aria-hidden /> Agente hipotecaria licenciada (L2)
            </span>
          </motion.div>
        </motion.div>
      </header>

      {/* ============================ SOBRE ============================ */}
      <MotionPanel className="mt-10" aria-label="Sobre Fanny Samaniego">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="flex flex-col md:flex-row items-center gap-8"
        >
          <motion.div variants={fadeUp} className="md:w-1/2 flex justify-center">
            <Image
              src="/fanny.jpg"
              alt="Fanny Samaniego — asesora financiera y agente hipotecaria en Toronto"
              width={360}
              height={360}
              className="rounded-full shadow-xl object-cover border-4 border-brand-green"
              priority
            />
          </motion.div>
          <motion.div variants={fadeUp} className="md:w-1/2">
            <h2 className="font-serif text-3xl md:text-4xl text-brand-green mb-4 font-bold">
              Sabiduría invitada, compartida con corazón
            </h2>
            <p className="font-sans text-lg md:text-xl text-brand-body mb-6 leading-relaxed">
              Soy Fanny Samaniego—<b>asesora financiera, coach holística y agente hipotecaria
              licenciada</b> en Toronto. Con un equipo coordinado, acompañamos a familias
              profesionales, ejecutivos y dueños de negocio que buscan resultados prácticos sin
              perder la paz ni sus valores.
            </p>
            <ul className="list-disc pl-6 text-brand-body text-base md:text-lg space-y-2 mb-8">
              <li>Planes que encajan con tu vida—anclados en cómo decides y das seguimiento.</li>
              <li>Human Design opcional para personalizar comunicación y ritmo—sin sustituir bases financieras ni legales.</li>
              <li>Próximos pasos claros después de cada llamada—sin abrumarte.</li>
            </ul>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/es/sobre-mi"
                aria-label="Conocer la historia de Fanny Samaniego"
                className="px-8 py-3 bg-transparent text-brand-blue rounded-full font-semibold border-2 border-brand-blue hover:bg-brand-green hover:text-white transition-all inline-block"
              >
                Conoce mi historia
              </Link>
              <Link
                href="/es/contacto?intent=question"
                aria-label="Iniciar una conversación"
                className="self-center text-brand-blue underline decoration-2 underline-offset-4 hover:text-brand-green"
              >
                Conversemos tus opciones
              </Link>
            </div>
          </motion.div>
        </motion.div>
      </MotionPanel>

      {/* ==================== FILOSOFÍA DE INVITACIÓN ==================== */}
      <MotionPanel className="mt-8" aria-label="Por qué trabajamos por invitación">
        <SectionTitle title="Por qué trabajamos por invitación" />
        <motion.p
          variants={fade}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
          className="font-sans text-lg text-brand-body mb-4 text-center max-w-3xl mx-auto leading-relaxed"
        >
          Los mejores resultados financieros nacen de relaciones con confianza y buen encaje.
          Toda colaboración comienza con una conversación.
        </motion.p>
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
          className="text-left max-w-2xl mx-auto"
        >
          <motion.ul variants={fadeUp} className="list-disc pl-6 text-brand-body text-base space-y-2">
            <li>Confirmamos tus metas y tiempos antes de empezar.</li>
            <li>Te conecta­mos con la persona adecuada del equipo en cada paso.</li>
            <li>Diseñamos un plan alrededor de tus fortalezas y estilo de decisión (Human Design a solicitud), siempre sobre bases financieras, fiscales y legales.</li>
          </motion.ul>
        </motion.div>
        <motion.div
          variants={fade}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
          className="mt-6 text-center"
        >
          <Link
            href="/es/contacto?intent=hola"
            className="text-brand-blue underline decoration-2 underline-offset-4 hover:text-brand-green"
          >
            Cuando estés listo/a, escríbenos →
          </Link>
        </motion.div>
      </MotionPanel>

      {/* ============================ INSIGNIAS ============================ */}
      <MotionPanel className="mt-8" aria-label="Certificaciones y aliados">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center"
        >
          {[
            { icon: <FaIdBadge aria-hidden className="text-xl" />, text: "Agente hipotecaria licenciada (Nivel 2)" },
            { icon: <FaUsers aria-hidden className="text-xl" />, text: "Equipo coordinado de especialistas" },
            { icon: <FaLeaf aria-hidden className="text-xl" />, text: "Personalización opcional con Human Design" },
          ].map((b) => (
            <motion.div
              key={b.text}
              variants={fadeUp}
              className="rounded-2xl border border-brand-gold p-6 shadow-sm transition-transform duration-200 will-change-transform hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="text-2xl text-brand-green flex items-center justify-center">{b.icon}</div>
              <p className="font-semibold text-brand-blue mt-2">{b.text}</p>
            </motion.div>
          ))}
        </motion.div>
      </MotionPanel>

      {/* ======================= AVANCE DE SERVICIOS ======================= */}
      <MotionPanel className="mt-8" aria-label="Servicios principales">
        <SectionTitle title="Formas en que podemos guiarte" />
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid md:grid-cols-3 gap-8"
        >
          {[
            {
              icon: "💡",
              title: "Guía financiera",
              body: "Acompañamiento claro y humano para tus metas—anclado en tus fortalezas naturales.",
              bullets: [
                "Presupuesto y flujo que sí usas",
                "Estrategia de deudas, crédito y ahorro",
                "Human Design opcional para afinar ritmo y seguimiento",
              ],
              href: "/es/servicios#fundamentos",
              label: "Explorar Guía financiera",
              secondary: { label: "¿Dudas?", href: "/es/contacto?intent=question" },
            },
            {
              icon: "🌱",
              title: "Planeación fiscal holística",
              body: "Estrategias prácticas y alineadas a valores para conservar más de lo que ganas.",
              bullets: [
                "Persona y pequeña empresa",
                "Cumplimiento primero y cuidado del flujo",
                "Recordatorios estacionales y checklists",
              ],
              href: "/es/servicios#legado",
              label: "Explorar Planeación fiscal",
              secondary: { label: "¿Dudas?", href: "/es/contacto?intent=question" },
            },
            {
              icon: "🏡",
              title: "Hipotecas",
              body: "Asesoría licenciada para primer hogar, mejoras, refinanciación e inversiones multiunidad.",
              bullets: [
                "Preaprobación y preparación",
                "Propiedades de 4 a 10 unidades e inversión",
                "Optimización de tasa, plazo y estructura",
              ],
              href: "/es/servicios#hipoteca",
              label: "Explorar Hipotecas",
              secondary: { label: "Conversemos", href: "/es/contacto?intent=preapproval" },
            },
          ].map((c) => (
            <motion.div
              key={c.title}
              variants={fadeUp}
              className="group bg-white rounded-2xl p-8 shadow-lg border border-brand-gold flex flex-col transition-transform duration-200 will-change-transform hover:-translate-y-1 hover:shadow-xl"
            >
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
                    <Link
                      href={c.secondary.href}
                      className="text-sm text-brand-blue/80 underline decoration-2 underline-offset-4 hover:text-brand-green"
                    >
                      {c.secondary.label}
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </MotionPanel>

      {/* ================ CONVERSACIONES EN LA MESA — cohorte 4 semanas ================ */}
      <MotionPanel className="mt-8" aria-label="Conversaciones en la Mesa — cohorte de 4 semanas">
        <SectionTitle title="Conversaciones en la Mesa" kicker="Cohorte pequeña de 4 semanas" />
        <motion.p
          variants={fade}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="text-center text-brand-body mt-2 max-w-3xl mx-auto"
        >
          Círculos íntimos en grupos pequeños, guiados por Fanny y su equipo—como en la mesa de tu cocina.
          Pregunta, aclara y sal con pasos simples que sí vas a realizar.
        </motion.p>
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid md:grid-cols-3 gap-6 mt-8"
        >
          {[
            {
              title: "Para quién",
              items: ["Primer hogar y recién llegados", "Familias que alinean valores y presupuesto", "Inversionistas 4–10 unidades"],
            },
            {
              title: "Qué vemos",
              items: ["Pasos de hipoteca, tasas y preparación", "Flujo, deudas y crédito", "Planeación alineada a valores, sin estrés"],
            },
            {
              title: "Cómo funciona",
              items: ["Grupos pequeños (cálidos y enfocados)", "4 sesiones semanales • 45–60 min", "Siguientes pasos simples tras cada sesión"],
            },
          ].map((col) => (
            <motion.div
              key={col.title}
              variants={fadeUp}
              className="rounded-2xl border border-brand-green/30 p-6 transition-transform duration-200 hover:-translate-y-0.5"
            >
              <h4 className="font-serif text-xl text-brand-blue font-bold mb-2">{col.title}</h4>
              <ul className="list-disc pl-5 text-brand-body space-y-1">
                {col.items.map((it) => (
                  <li key={it}>{it}</li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          variants={fade}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="text-center mt-8 flex flex-col sm:flex-row gap-3 justify-center"
        >
          <Link
            href="/es/servicios#familia"
            className="px-8 py-3 bg-transparent text-brand-green rounded-full font-semibold border-2 border-brand-green hover:bg-brand-green hover:text-white transition inline-block"
          >
            Ver detalles del programa
          </Link>
          <Link
            href={`/es/contacto?intent=package&package=${encodeURIComponent(
              "Conversaciones Holísticas en Familia — Cohorte 4 semanas",
            )}`}
            className="px-8 py-3 bg-transparent text-brand-blue rounded-full font-semibold border-2 border-brand-blue hover:bg-brand-blue hover:text-white transition inline-block"
          >
            Hablemos
          </Link>
        </motion.div>
      </MotionPanel>

      {/* ======================= HERRAMIENTAS Y ARTÍCULOS ======================= */}
      <MotionPanel className="mt-8" aria-label="Herramientas y artículos útiles">
        <SectionTitle title="Herramientas y artículos útiles" />
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          <motion.div
            variants={fadeUp}
            className="group bg-white rounded-2xl p-8 shadow-lg border border-brand-gold flex flex-col transition-transform duration-200 hover:-translate-y-1 hover:shadow-xl"
          >
            <h3 className="font-serif text-2xl text-brand-blue font-bold mb-2">Herramientas</h3>
            <p className="text-brand-body mb-6">
              Calculadoras, checklists y apoyos de decisión para avanzar—diseñados para tu forma real de dar seguimiento.
            </p>
            <ul className="list-disc pl-6 text-brand-body text-sm space-y-1 mb-6">
              <li>Plantilla de presupuesto y flujo</li>
              <li>Checklist de preparación hipotecaria</li>
              <li>Lista de preparación para temporada fiscal</li>
            </ul>
            <Link
              href="/es/herramientas"
              aria-label="Ver herramientas"
              className="px-8 py-3 bg-transparent text-brand-green rounded-full font-semibold border-2 border-brand-green hover:bg-brand-green hover:text-white transition inline-block"
            >
              Ver herramientas
            </Link>
          </motion.div>

          <motion.div
            variants={fadeUp}
            className="group bg-white rounded-2xl p-8 shadow-lg border border-brand-gold flex flex-col transition-transform duration-200 hover:-translate-y-1 hover:shadow-xl"
          >
            <h3 className="font-serif text-2xl text-brand-blue font-bold mb-2">Artículos</h3>
            <p className="text-brand-body mb-6">
              Lecturas cortas y prácticas sobre hipotecas, conducta del dinero y básicos fiscales—sin jerga, con pasos claros.
            </p>
            <ul className="list-disc pl-6 text-brand-body text-sm space-y-1 mb-6">
              <li>Ruta al primer hogar (edición Toronto)</li>
              <li>Estrategia de deudas sin culpa</li>
              <li>Impuestos para PyME: qué registrar</li>
            </ul>
            <Link
              href="/es/recursos"
              aria-label="Leer artículos"
              className="px-8 py-3 bg-transparent text-brand-green rounded-full font-semibold border-2 border-brand-green hover:bg-brand-green hover:text-white transition inline-block"
            >
              Leer artículos
            </Link>
          </motion.div>
        </motion.div>
      </MotionPanel>

      {/* ============================ SUSCRIPCIÓN ============================ */}
      <MotionPanel className="mt-8" aria-label="Suscríbete a consejos y recursos">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
          className="text-center max-w-3xl mx-auto"
        >
          <h3 className="font-serif text-2xl text-brand-green font-bold mb-2">Mantente al día</h3>
          <p className="text-brand-body mb-6">
            Recibe tips mensuales, checklists y recordatorios amables—bilingüe y sin spam.
          </p>
          <Link
            href="/es/suscribirme"
            aria-label="Ir a la página de suscripción"
            className="px-10 py-3 bg-brand-green text-white rounded-full font-semibold shadow hover:bg-brand-gold hover:text-brand-green border-2 border-brand-blue transition inline-block"
          >
            Suscribirme
          </Link>
        </motion.div>
      </MotionPanel>

      {/* =========================== BANDA FINAL =========================== */}
      <motion.section
        variants={fade}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        className="py-16 text-center"
      >
        <h3 className="font-serif text-2xl md:text-3xl text-brand-green font-bold mb-3">
          La claridad nace de una buena conversación.
        </h3>
        <p className="text-brand-body mb-5 max-w-xl mx-auto">
          Sin presión ni prisa—solo guía atenta cuando sea el momento para ti.
        </p>
        <Link
          href="/es/contacto?intent=hola"
          aria-label="Iniciar una conversación"
          className="px-8 py-3 bg-transparent text-brand-blue rounded-full font-semibold border-2 border-brand-blue hover:bg-brand-blue hover:text-white transition inline-block"
        >
          Iniciar una conversación
        </Link>
        <p className="text-xs text-brand-blue/70 mt-3 max-w-xl mx-auto">
          Human Design es opcional—solo para personalizar comunicación y ritmo. Nunca reemplaza
          fundamentos financieros, fiscales ni legales.
        </p>
      </motion.section>
    </main>
  );
}
