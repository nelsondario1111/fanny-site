// app/es/sobre-mi/page.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  Building2,
  Calculator,
  PiggyBank,
  Scale,
  Shield,
  FileText,
  Users,
} from "lucide-react";

/* ---------------------- Helpers de animación ---------------------- */
const easing: number[] = [0.22, 1, 0.36, 1];

function useAnims() {
  const prefersReduced = useReducedMotion();

  const fade = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: prefersReduced ? { duration: 0 } : { duration: 0.6, ease: easing },
    },
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 14 },
    visible: {
      opacity: 1,
      y: 0,
      transition: prefersReduced ? { duration: 0 } : { duration: 0.6, ease: easing },
    },
  };

  const stagger = {
    hidden: {},
    visible: {
      transition: prefersReduced ? {} : { staggerChildren: 0.12, delayChildren: 0.06 },
    },
  };

  return { fade, fadeUp, stagger };
}

/* --- “Panel” compartido --- */
function Panel({
  children,
  className = "",
  as: Tag = "section" as const,
}: {
  children: ReactNode;
  className?: string;
  as?: any;
}) {
  return (
    <Tag
      className={[
        "max-w-6xl mx-auto px-5 sm:px-8 py-8 sm:py-12",
        "bg-white/95 rounded-[28px] border border-brand-gold shadow-xl",
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
  viewportAmount = 0.2,
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

function SectionTitle({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: ReactNode;
}) {
  const { fade, fadeUp } = useAnims();
  return (
    <motion.div
      variants={fade}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      className="text-center mb-6"
    >
      <motion.h1
        variants={fadeUp}
        className="font-serif font-extrabold text-4xl md:text-5xl text-brand-green tracking-tight"
      >
        {title}
      </motion.h1>
      <motion.div
        variants={fade}
        className="flex justify-center my-4"
        aria-hidden="true"
      >
        <div className="w-16 h-[3px] rounded-full bg-brand-gold" />
      </motion.div>
      {subtitle && (
        <motion.p
          variants={fadeUp}
          className="text-brand-blue/90 text-lg md:text-xl max-w-3xl mx-auto"
        >
          {subtitle}
        </motion.p>
      )}
    </motion.div>
  );
}
/* ------------------------------------------------------ */

export default function SobreMi() {
  const { fade, fadeUp, stagger } = useAnims();

  return (
    <main className="bg-brand-beige min-h-screen pb-16">
      {/* HERO / BIO */}
      <section className="pt-6 sm:pt-8 px-4" aria-label="Hero y biografía">
        <MotionPanel>
          <SectionTitle
            title="Sobre Fanny — Acompañamiento profesional con corazón humano"
            subtitle={
              <>
                Soy Agente Hipotecaria (Nivel 2) y consultora financiera holística en Toronto.
                Integro experiencia con prestamistas, ritmo fiscal y disciplina contable para que tomes
                decisiones claras, alineadas a tus valores—y te sientas en paz con el dinero. Servimos a
                un grupo selecto de familias profesionales, ejecutivos y dueños de negocio.
              </>
            }
          />
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.25 }}
            className="mt-10 flex flex-col md:flex-row items-center gap-10"
          >
            <motion.div variants={fadeUp} className="flex-shrink-0 flex justify-center">
              <Image
                src="/fanny-portrait.jpg"
                alt="Fanny Samaniego, Agente Hipotecaria (Nivel 2) y Consultora Financiera en Toronto"
                width={300}
                height={380}
                className="rounded-3xl shadow-lg object-cover border-4 border-brand-gold"
                priority
              />
            </motion.div>
            <motion.div variants={fadeUp} className="flex-1 md:pl-4">
              <p className="mb-4 text-lg md:text-xl text-brand-body leading-relaxed">
                Me especializo en alinear estrategia hipotecaria, sistemas de flujo de efectivo y preparación
                para la temporada fiscal—para que los pasos de hoy apoyen tus metas de largo plazo. En el día a día,
                evalúo tu situación, clarifico opciones de hipoteca y coordino con prestamistas para que el trámite
                avance sin drama.
              </p>
              <p className="mb-4 text-lg md:text-xl text-brand-body leading-relaxed">
                En planeación, diseñamos rutinas prácticas y, cuando hace falta, te acompaño ante la CRA con
                documentación ordenada, comunicación clara y cumplimiento total.
              </p>
              <p className="mb-0 text-lg md:text-xl text-brand-body leading-relaxed">
                Trabajamos por invitación para proteger la presencia y la calidad. Si resuena contigo, será un gusto conversar.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href="/es/contacto?intent=consult&package=Consulta%20Privada%20de%20Descubrimiento"
                  aria-label="Reservar una Consulta Privada de Descubrimiento"
                  className="px-8 py-3 bg-brand-green text-white rounded-full font-semibold border border-brand-green/20 hover:bg-brand-gold hover:text-brand-green transition"
                >
                  Reservar Consulta Privada
                </Link>
                <Link
                  href="/es/servicios"
                  className="px-8 py-3 bg-transparent text-brand-blue rounded-full font-semibold border-2 border-brand-blue hover:bg-brand-green hover:text-white transition"
                >
                  Ver Servicios
                </Link>
              </div>
            </motion.div>
          </motion.div>
        </MotionPanel>
      </section>

      {/* CREDENCIALES */}
      <section className="px-4 mt-8" aria-label="Credenciales y datos">
        <MotionPanel>
          <motion.h2
            variants={fadeUp}
            className="text-2xl md:text-3xl font-serif font-semibold text-brand-blue mb-5 text-center"
          >
            Credenciales & Datos Rápidos
          </motion.h2>

          <motion.ul
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.25 }}
            className="grid gap-3 text-lg md:text-xl text-brand-green max-w-3xl mx-auto list-disc ml-6 md:ml-10"
          >
            {[
              "Agente Hipotecaria (Nivel 2), Ontario",
              "10+ años en planeación financiera, impuestos y servicios hipotecarios",
              "Experiencia en contabilidad y reporte financiero",
              "Colaboración con prestamistas para aprobaciones fluidas",
              "Preparación y apoyo ante auditorías de la CRA",
              "Bilingüe: Español / English",
            ].map((item, i) => (
              <motion.li key={i} variants={fadeUp}>
                {item}
              </motion.li>
            ))}
          </motion.ul>
        </MotionPanel>
      </section>

      {/* EQUIPO MULTIDISCIPLINARIO */}
      <section className="px-4 mt-8" aria-label="Equipo multidisciplinario">
        <MotionPanel>
          <motion.h2
            variants={fadeUp}
            className="text-2xl md:text-3xl font-serif font-semibold text-brand-blue mb-5 text-center"
          >
            Un equipo multidisciplinario—bajo un mismo paraguas
          </motion.h2>

          <motion.p
            variants={fade}
            className="max-w-3xl mx-auto text-brand-blue/90 text-base md:text-lg text-center"
          >
            Junto a Fanny, tendrás acceso coordinado a profesionales calificados. Cada especialista opera
            de forma independiente; lo integramos cuando su participación aporta valor y timing a tu plan,
            para que hipoteca, flujo y ritmo fiscal funcionen juntos.
          </motion.p>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="mt-6 grid gap-4 md:grid-cols-3"
          >
            {[
              {
                icon: <Building2 className="text-brand-green" size={22} />,
                title: "Prestamistas & Underwriters",
                body:
                  "Claridad de políticas y ajuste de producto—expedientes que inspiran confianza.",
              },
              {
                icon: <Calculator className="text-brand-green" size={22} />,
                title: "Asesores Fiscales / CPAs",
                body:
                  "Estrategias proactivas, registros listos para auditoría y temporadas fiscales tranquilas.",
              },
              {
                icon: <PiggyBank className="text-brand-green" size={22} />,
                title: "Flujo de efectivo & libros",
                body:
                  "Sistemas amigables con la conducta, basados en buenas prácticas contables.",
              },
              {
                icon: <Scale className="text-brand-green" size={22} />,
                title: "Abogados inmobiliarios",
                body:
                  "Cierres claros y documentación limpia—sin drama el día de la posesión.",
              },
              {
                icon: <Shield className="text-brand-green" size={22} />,
                title: "Corredores de seguros",
                body:
                  "Cobertura alineada a tu perfil de riesgo y requisitos del prestamista.",
              },
              {
                icon: <FileText className="text-brand-green" size={22} />,
                title: "Apoyo en auditorías de la CRA",
                body:
                  "Preparación, representación y comunicación serena cuando la CRA requiere revisión.",
              },
            ].map((card, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                className="rounded-2xl border border-brand-gold/60 bg-white p-5 shadow-sm"
              >
                <div className="flex items-center gap-2 font-serif text-lg text-brand-green font-semibold">
                  {card.icon}
                  {card.title}
                </div>
                <p className="mt-2 text-sm text-brand-blue/90">{card.body}</p>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            variants={fade}
            className="mt-6 flex items-center justify-center gap-2 text-sm text-brand-blue/70"
          >
            <Users size={16} />{" "}
            <span>Presentamos especialistas solo cuando aportan valor claro a tu plan.</span>
          </motion.div>
        </MotionPanel>
      </section>

      {/* CÓMO USAMOS IA */}
      <section className="px-4 mt-8" aria-label="Cómo usamos IA">
        <MotionPanel>
          <div className="text-center">
            <h3 className="font-serif text-xl md:text-2xl font-bold text-brand-green">
              Cómo usamos IA (con revisión humana)
            </h3>
            <p className="mt-2 text-brand-blue/90 max-w-3xl mx-auto">
              Usamos IA que respeta la privacidad para agilizar la preparación: resumir documentos,
              organizar checklists, traducción ES/EN y borradores de presupuestos. Toda recomendación
              y cifra es revisada por Fanny o un profesional calificado. <strong>No</strong> automatizamos
              decisiones de crédito; los prestamistas tienen la aprobación final. Puedes optar por no usarla
              cuando quieras—solo avísanos.
            </p>
          </div>
        </MotionPanel>
      </section>

      {/* FILOSOFÍA */}
      <section className="px-4 mt-8" aria-label="Nuestra filosofía">
        <MotionPanel className="text-center">
          <motion.h3
            variants={fadeUp}
            className="font-serif text-xl md:text-2xl text-brand-green font-bold mb-2"
          >
            ¿Por qué “Acompañamiento por invitación”?
          </motion.h3>
          <motion.p
            variants={fade}
            className="font-sans text-lg text-brand-body max-w-3xl mx-auto"
          >
            El trabajo más significativo sucede cuando cliente y guía sienten un buen encaje. Empezamos
            con una conversación—sin presión—para confirmar metas, tiempos y alcance.
          </motion.p>
          <motion.p
            variants={fade}
            className="text-brand-body text-base mt-3 opacity-75 max-w-3xl mx-auto"
          >
            <em>
              Si lo deseas, podemos aplicar una lente ligera y <strong>opcional</strong> de Human Design
              para personalizar comunicación y cadencia. Nunca reemplaza lo financiero, fiscal o legal;
              solo lo potencia para que el plan se adapte a tu vida.
            </em>
          </motion.p>
          <div className="mt-6">
            <Link href="/es/servicios" className="text-brand-blue underline hover:text-brand-green">
              Conoce cómo trabajamos y qué ofrecemos →
            </Link>
          </div>
        </MotionPanel>
      </section>

      {/* A QUIÉN SERVIMOS */}
      <section className="px-4 mt-8" aria-label="A quién servimos">
        <MotionPanel>
          <motion.h2
            variants={fadeUp}
            className="text-2xl md:text-3xl font-serif font-semibold text-brand-blue mb-5 text-center"
          >
            A quién servimos mejor
          </motion.h2>
          <motion.ul
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="grid gap-3 text-brand-blue/90 max-w-3xl mx-auto list-disc ml-6 md:ml-10"
          >
            {[
              "Recién llegados y primerizos construyendo preparación",
              "Familias que equilibran flujo de efectivo y metas de largo plazo",
              "Profesionales autónomos que necesitan documentación amigable para prestamistas",
              "Pequeños inversionistas optimizando financiamiento y ritmo fiscal",
            ].map((item, i) => (
              <motion.li key={i} variants={fadeUp}>
                {item}
              </motion.li>
            ))}
          </motion.ul>
        </MotionPanel>
      </section>

      {/* CUMPLIMIENTO & NOTAS */}
      <section className="px-4 mt-8" aria-label="Cumplimiento y notas importantes">
        <MotionPanel>
          <h3 className="font-serif text-xl md:text-2xl font-bold text-brand-green text-center">
            Notas de cumplimiento & alcance
          </h3>
          <div className="mt-3 text-sm md:text-base text-brand-blue/90 max-w-4xl mx-auto space-y-2">
            <p>
              Los precios (cuando se muestran) están en CAD y pueden estar sujetos a HST. Los servicios hipotecarios
              suelen ser gratuitos para prestatarios residenciales calificados porque la compensación la paga el
              prestamista al cierre. En escenarios no‑prime/privados/comerciales pueden aplicar honorarios; siempre
              se informarán por adelantado. Todas las hipotecas son O.A.C. (aprobación crediticia).
            </p>
            <p>
              El coaching y los servicios de solo asesoría son independientes de la compensación hipotecaria y no
              sustituyen asesoría legal, fiscal o contable. Coordinamos con tus profesionales cuando es necesario.
              La documentación se recopila mediante enlaces seguros. Soporte bilingüe (ES/EN).
            </p>
            <p className="m-0">
              Human Design es una herramienta <strong>opcional</strong> para personalizar comunicación y ritmo;
              no constituye asesoría financiera, fiscal, contable, legal ni de inversión.
            </p>
          </div>
        </MotionPanel>
      </section>

      {/* CTA FINAL */}
      <section className="px-4 mt-8" aria-label="Llamado a la acción">
        <MotionPanel className="text-center">
          <motion.h2
            variants={fadeUp}
            className="text-2xl md:text-3xl font-serif font-bold text-brand-green mb-3"
          >
            ¿Listas/os para conversar?
          </motion.h2>
          <motion.p variants={fade} className="text-brand-body mb-6">
            En 20–30 minutos tendrás 2–3 próximos pasos claros—sin presión.
          </motion.p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link
              href="/es/contacto?intent=consult&package=Consulta%20Privada%20de%20Descubrimiento"
              aria-label="Reservar Consulta Privada de Descubrimiento"
              className="inline-block"
            >
              <motion.button
                type="button"
                variants={fadeUp}
                whileHover={{ y: -2, scale: 1.01, transition: { duration: 0.15, ease: easing } }}
                whileFocus={{ scale: 1.005 }}
                className="px-10 py-3 bg-brand-gold text-brand-green font-serif font-bold rounded-full shadow hover:bg-brand-blue hover:text-white transition focus:outline-none focus:ring-2 focus:ring-brand-gold"
              >
                Reservar Consulta Privada
              </motion.button>
            </Link>
            <Link
              href="/es/recursos"
              className="px-8 py-3 bg-transparent text-brand-blue rounded-full font-semibold border-2 border-brand-blue hover:bg-brand-green hover:text-white transition"
            >
              Ver Artículos & Herramientas
            </Link>
          </div>
        </MotionPanel>
      </section>
    </main>
  );
}
