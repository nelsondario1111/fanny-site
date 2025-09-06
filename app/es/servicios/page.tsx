// ./app/es/servicios/page.tsx
"use client";

import Link from "next/link";
import type { ReactNode, ElementType } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

/* ============================ Precios (CAD) ============================ */
/** Pon cualquier precio en null para mostrar “Contactar para precio”. Puede aplicar HST. */
const PRICING = {
  // Entrada / Hipoteca
  mortgagePreapproval: 0,            // Concierge de Hipoteca (típ. sin honorarios para prestatarios calificados; O.A.C.)
  refiRenewal: 295,                  // Estrategia de Refi & Renovación (60–90 min)
  firstHomePlan: 395,                // Plano de Riqueza Familiar (90 min, incluye FHSA)

  // Profesionales y Dueños de Negocio
  proTuneUp90: 1200,                 // Puesta a Punto Financiera para Profesionales (90 días)
  bizOwnerExecPlan: 2500,            // Alineación Ejecutiva de Riqueza (desde)
  corpPayrollClinic: 395,            // Clínica: Incorporación / Cómo Pagarte (60–75 min)

  // Recién llegados
  newcomerFastTrack: 395,            // Integración Patrimonial para Recién Llegados (30 días)

  // Hipoteca & inversión
  invest4to10: 695,                  // Inicio de Inversión: 4–10 Unidades (DSCR)
  annualReviewNonClient: 149,        // Revisión Anual de Hipoteca (cortesía para clientes)

  // 1:1 (solo asesoría)
  discovery: 0,                      // Llamada de Descubrimiento (20–30 min)
  blueprint90: 395,                  // Sesión Plano de 90 Minutos
  align3: 1200,                      // Paquete de 3 Sesiones
  transform6: 2750,                  // Paquete de 6 Sesiones
  elevatePremium: 4995,              // Paquete Premium (6 meses)
  alumniRetainerMonthly: 149,        // Retenedor Mensual (alumni)

  // Impuestos & Legado
  taxSession: 395,                   // Sesión de Estrategia Fiscal Personal/Familiar (75–90 min)
  taxAnnual: 1295,                   // Ritmo de Legado & Impuestos (2 sesiones + cadencia)
  taxSmallBiz90d: 1995,              // Montaje 90 días para Independientes/Pequeña Empresa

  // Conversaciones Holísticas (grupos)
  ktCohort4w: 795,                   // Conversaciones de Mesa — cohorte de 4 semanas
  ktMonthly: 49,                     // Conversaciones de Mesa — círculo mensual

  // Talleres
  workshopPublicSeat: 149,           // Cohorte pública (por persona, 2.5–3h)
  workshopTeamVirtual: 2400,         // Taller privado para equipos (virtual, hasta 20 pers.)
  workshopTeamInPerson: 2800,        // Taller privado presencial (hasta 20 pers.) + viaje
} as const;

function priceES(p: number | null) {
  if (p === null) return "Contactar para precio";
  if (p === 0) return "Gratis";
  return `$${p} CAD`;
}

/* ========================= Ayudas de animación ========================= */
const easing: number[] = [0.22, 1, 0.36, 1];
function useAnims() {
  const prefersReduced = useReducedMotion();
  const fade = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: prefersReduced ? { duration: 0 } : { duration: 0.4, ease: easing },
    },
  };
  const fadeUp = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: prefersReduced ? { duration: 0 } : { duration: 0.45, ease: easing },
    },
  };
  const stagger = {
    hidden: {},
    visible: {
      transition: prefersReduced ? {} : { staggerChildren: 0.08, delayChildren: 0.04 },
    },
  };
  return { fade, fadeUp, stagger };
}

/* ============ Panel / títulos / insignias reutilizables ============ */
function Panel({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <section
      className={[
        "max-w-content mx-auto px-5 sm:px-8 py-8 sm:py-12",
        "bg-white rounded-[28px] border border-brand-gold/60 shadow-sm",
        className,
      ].join(" ")}
    >
      {children}
    </section>
  );
}

function SectionTitle({
  title,
  subtitle,
  id,
  level = "h2",
}: {
  title: string;
  subtitle?: ReactNode;
  id: string;
  level?: "h1" | "h2";
}) {
  const { fade, fadeUp } = useAnims();
  const Tag: ElementType = level; // ✅ tipado sin `any`
  return (
    <div id={id} className="scroll-mt-24">
      <motion.div
        variants={fade}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        className="text-center mb-6"
      >
        <motion.div variants={fadeUp}>
          <Tag className="font-serif font-extrabold text-3xl md:text-4xl text-brand-green tracking-tight">
            {title}
          </Tag>
        </motion.div>
        <motion.div variants={fade} className="flex justify-center my-4" aria-hidden="true">
          <div className="w-16 h-[3px] rounded-full bg-brand-gold" />
        </motion.div>
        {subtitle && (
          <motion.p variants={fadeUp} className="text-brand-blue/90 text-lg md:text-xl max-w-3xl mx-auto">
            {subtitle}
          </motion.p>
        )}
      </motion.div>
    </div>
  );
}

function PriceBadge({ children }: { children: ReactNode }) {
  return (
    <span className="text-sm px-3 py-1 rounded-full bg-brand-gold/15 text-brand-green border border-brand-gold/50">
      {children}
    </span>
  );
}
function TagBadge({ children }: { children: ReactNode }) {
  return (
    <span className="text-xs px-2.5 py-1 rounded-full bg-white text-brand-green border border-brand-gold/40">
      {children}
    </span>
  );
}

const CARD =
  "rounded-3xl border border-brand-gold/60 bg-white shadow-sm hover:shadow-md hover:-translate-y-[1px] transition p-6 focus-within:ring-2 focus-within:ring-brand-gold";

/* ======================= Tarjeta reutilizable ======================= */
type Intent = "consult" | "preapproval" | "package";

type SectionId =
  | "overview"
  | "signature"
  | "foundations"
  | "mortgage"
  | "business"
  | "workshops"
  | "legacy"
  | "family"
  | "newcomers"
  | "advice"
  | "how";

type Card = {
  id: string;
  section: SectionId;
  title: string;
  desc: string;
  bullets: string[];
  timeline?: string;
  scope?: string;
  tags: string[];
  price: string;
  intent?: Intent;
};

function PackageCard({ c }: { c: Card }) {
  const { fadeUp } = useAnims();
  const qs = new URLSearchParams();
  qs.set("intent", c.intent ?? "package");
  qs.set("package", c.title);
  return (
    <motion.article variants={fadeUp} className={CARD} aria-labelledby={`${c.id}-title`}>
      <div className="flex items-center justify-between gap-3">
        <h3 id={`${c.id}-title`} className="font-serif text-2xl text-brand-green font-bold m-0">
          {c.title}
        </h3>
        <PriceBadge>{c.price}</PriceBadge>
      </div>
      {c.tags.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {c.tags.map((t) => (
            <TagBadge key={t}>{t}</TagBadge>
          ))}
        </div>
      )}
      <p className="mt-3 text-brand-blue/90">{c.desc}</p>
      <ul className="mt-3 list-disc pl-5 space-y-1 text-brand-blue/90">
        {c.bullets.slice(0, 4).map((p) => (
          <li key={p}>{p}</li>
        ))}
      </ul>
      {(c.timeline || c.scope) && (
        <div className="mt-3 text-sm text-brand-blue/80 space-y-1">
          {c.timeline && (
            <p className="m-0">
              <strong>Duración:</strong> {c.timeline}
            </p>
          )}
          {c.scope && (
            <p className="m-0">
              <strong>Alcance:</strong> {c.scope}
            </p>
          )}
        </div>
      )}
      <div className="mt-5 flex flex-wrap gap-3">
        <Link
          href={`/es/contacto?${qs.toString()}`}
          className="px-5 py-2.5 bg-brand-green text-white rounded-full font-semibold hover:bg-brand-gold hover:text-brand-green border border-brand-green/20 transition"
          aria-label={`Contactar sobre ${c.title}`}
        >
          Reservar una consulta privada
        </Link>
        <Link
          href="/es/recursos#overview"
          className="px-5 py-2.5 rounded-full border border-brand-blue/40 text-brand-blue hover:bg-brand-blue hover:text-white transition"
        >
          Ver recursos relacionados
        </Link>
      </div>
    </motion.article>
  );
}

/* ====================== Navegación fija en la página ====================== */
const SECTIONS = [
  { id: "overview", label: "Resumen" },
  { id: "signature", label: "Paquetes Insignia" },
  { id: "foundations", label: "Fundamentos de Riqueza" },
  { id: "mortgage", label: "Hipoteca y Propiedad" },
  { id: "business", label: "Negocios y Profesionales" },
  { id: "workshops", label: "Talleres" },
  { id: "legacy", label: "Legado e Impuestos" },
  { id: "family", label: "Conversaciones Holísticas" },
  { id: "newcomers", label: "Recién Llegados" },
  { id: "advice", label: "Asesoría 1:1" },
  { id: "how", label: "Cómo Trabajamos" },
] as const;

function SectionNav() {
  const [active, setActive] = useState<string>("overview");
  const refs = useRef<Record<string, HTMLElement | null>>({});

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-20% 0px -70% 0px", threshold: [0, 0.25, 0.5, 1] }
    );

    SECTIONS.forEach((s) => {
      const el = document.getElementById(s.id);
      refs.current[s.id] = el;
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <div className="sticky top-[64px] z-30 bg-white/90 backdrop-blur border-b border-brand-gold/30">
      <nav className="max-w-content mx-auto px-4 py-2 flex gap-2 overflow-x-auto text-sm" aria-label="Secciones">
        {SECTIONS.map((s) => (
          <a
            key={s.id}
            href={`#${s.id}`}
            className={[
              "px-3 py-1.5 rounded-full border transition whitespace-nowrap",
              active === s.id
                ? "bg-brand-green text-white border-brand-green"
                : "border-brand-gold/40 text-brand-green hover:bg-brand-green/10",
            ].join(" ")}
            aria-current={active === s.id ? "true" : undefined}
          >
            {s.label}
          </a>
        ))}
      </nav>
    </div>
  );
}

/* ========================= Chips de público objetivo ========================= */
const FILTER_TAGS = [
  "Profesionales",
  "Dueños de negocio",
  "Ejecutivos",
  "Familias",
  "Inversionistas",
  "Recién llegados",
  "Premium",
] as const;

function FilterBar({ value, onChange }: { value: string[]; onChange: (next: string[]) => void }) {
  function toggle(tag: string) {
    onChange(value.includes(tag) ? value.filter((t) => t !== tag) : [...value, tag]);
  }
  return (
    <div className="max-w-content mx-auto px-4 py-3 flex flex-wrap gap-2" aria-label="Filtros de audiencia">
      {FILTER_TAGS.map((t) => (
        <button
          key={t}
          onClick={() => toggle(t)}
          className={[
            "px-3 py-1.5 rounded-full text-sm border transition",
            value.includes(t)
              ? "bg-brand-green text-white border-brand-green"
              : "border-brand-gold/40 text-brand-green hover:bg-brand-green/10",
          ].join(" ")}
          aria-pressed={value.includes(t)}
        >
          {t}
        </button>
      ))}
      {value.length > 0 && (
        <button
          onClick={() => onChange([])}
          className="ml-2 px-3 py-1.5 rounded-full text-sm border border-brand-blue/30 text-brand-blue hover:bg-brand-blue hover:text-white transition"
        >
          Limpiar filtros
        </button>
      )}
    </div>
  );
}

/* ============================== Datos ============================== */
type CardArray = Card[];

const CARDS: CardArray = [
  /* ------------------------------ Insignia ------------------------------ */
  {
    id: "elevate",
    section: "signature",
    title: "Elevate (Paquete Premium de Transformación)",
    desc: "Dirección de punta a punta para tus finanzas: estrategia de hipoteca, ritmo fiscal, alineación de negocio y calma con el dinero—todo bajo un mismo paraguas.",
    bullets: [
      "Plano financiero: flujo, hipoteca e impuestos",
      "6+ sesiones privadas con planes escritos",
      "Coordinación con contador y abogado",
      "Enfoque opcional de Diseño Humano para cadencia y decisiones",
    ],
    timeline: "~6 meses de acompañamiento",
    tags: ["Ejecutivos", "Familias", "Dueños de negocio", "Premium"],
    price: priceES(PRICING.elevatePremium),
  },
  {
    id: "transform",
    section: "signature",
    title: "Transform (Paquete de 6 Sesiones)",
    desc: "Profundidad sin agobio: instalamos un sistema vivo entre flujo de efectivo, higiene de crédito y reservas fiscales.",
    bullets: ["Plan integral", "Barandillas claras", "Documentación lista para prestamistas", "Acciones escritas tras cada sesión"],
    timeline: "~12 semanas",
    tags: ["Ejecutivos", "Dueños de negocio", "Familias"],
    price: priceES(PRICING.transform6),
  },
  {
    id: "exec-teaming",
    section: "signature",
    title: "Alineación Ejecutiva de Riqueza (Fundador/Profesional)",
    desc: "Alinea pago del propietario, banca y registros que los prestamistas respetan—en colaboración con tu contador y abogado.",
    bullets: [
      "Matriz de compensación (salario/dividendos)",
      "Cadencia de HST; reservas y colchones",
      "Coordinación con CPA/abogado",
      "Cadencia de liderazgo y decisiones (opcional)",
    ],
    timeline: "4–6 semanas (típico)",
    scope: "Planeación y documentación; ejecución fiscal/legal con tus profesionales.",
    tags: ["Ejecutivos", "Dueños de negocio", "Premium"],
    price: `Desde ${priceES(PRICING.bizOwnerExecPlan)}`,
  },
  {
    id: "team-workshop",
    section: "signature",
    title: "Taller de Bienestar Financiero (Equipo Privado)",
    desc: "Sesión enfocada de 3 horas: cadencia de efectivo, registros creíbles para prestamistas y un lenguaje compartido sobre dinero en el trabajo.",
    bullets: ["Pre-encuesta + agenda a medida", "Taller en vivo 3h con Q&A", "Diapositivas + paquete de recursos (EN/ES)", "Resumen de seguimiento"],
    timeline: "3 horas (virtual o presencial)",
    scope: "Hasta 20 participantes. Presencial añade viaje. Aplica HST.",
    tags: ["Ejecutivos", "Dueños de negocio", "Profesionales", "Premium"],
    price: `Desde ${priceES(PRICING.workshopTeamVirtual)} (virtual) • ${priceES(PRICING.workshopTeamInPerson)} (presencial)`,
  },

  /* ----------------------------- Fundamentos ----------------------------- */
  {
    id: "family-wealth-blueprint",
    section: "foundations",
    title: "Plano de Riqueza Familiar (con opciones FHSA)",
    desc: "Plan en la medida justa para familias profesionales: cadencia de ahorro, coordinación FHSA y una ruta de pre-aprobación creíble para prestamistas.",
    bullets: [
      "Optimización FHSA individual/pareja",
      "Ritmo de ahorro y mapa de enganche",
      "Capacidad con prueba de estrés",
      "Prompts opcionales de Diseño Humano",
    ],
    timeline: "90 minutos + seguimiento curado",
    tags: ["Familias", "Premium"],
    price: priceES(PRICING.firstHomePlan),
    intent: "consult",
  },
  {
    id: "pro-tune-up",
    section: "foundations",
    title: "Puesta a Punto Financiera para Profesionales (90 días)",
    desc: "Ritmo humano y enfocado para estabilizar flujo, apartados reales y una higiene de crédito limpia—pensado para personas ocupadas.",
    bullets: [
      "Cadencia semanal de dinero",
      "Apartados fiscales trimestrales",
      "Lista de automatización",
      "Personalización opcional con Diseño Humano",
    ],
    timeline: "~90 días (3 sesiones + emails de control)",
    scope: "Solo asesoría (sin venta de productos).",
    tags: ["Profesionales", "Ejecutivos", "Premium"],
    price: priceES(PRICING.proTuneUp90),
  },

  /* ------------------------- Hipoteca y Propiedad ------------------------- */
  {
    id: "mortgage-concierge",
    section: "mortgage",
    title: "Concierge de Hipoteca — Preparación y Pre-aprobación",
    desc: "Preparamos, combinamos y empaquetamos tu expediente para que los prestamistas digan sí con confianza—y calma.",
    bullets: [
      "Checklist preciso; recepción segura",
      "Pruebas de estrés y ‘matching’ de prestamista",
      "Acompañamiento de la tasación al cierre",
      "Breve opcional de Diseño Humano",
    ],
    timeline: "Usualmente 1–2 semanas tras completar documentos",
    scope:
      "Residencial; O.A.C.; sin honorarios al prestatario en casos prime típicos—cualquier excepción se informa por adelantado.",
    tags: ["Profesionales", "Familias", "Recién llegados", "Premium"],
    price: priceES(PRICING.mortgagePreapproval),
    intent: "preapproval",
  },
  {
    id: "refi-renewal",
    section: "mortgage",
    title: "Estrategia de Refi & Renovación",
    desc: "Matemática clara, trade-offs explícitos y un breve plan escrito.",
    bullets: ["Modelo refi vs. renovar", "Análisis de penalidad y punto de equilibrio", "Guardrails de prepago", "Resumen escrito en 24h"],
    timeline: "60–90 minutos",
    tags: ["Profesionales", "Familias", "Ejecutivos"],
    price: priceES(PRICING.refiRenewal),
  },
  {
    id: "invest-4-10",
    section: "mortgage",
    title: "Inicio de Inversión: 4–10 Unidades (DSCR)",
    desc: "Números honestos y condiciones más seguras para tu primer edificio pequeño—claridad sin drama.",
    bullets: ["Modelo GMR/OPEX/NOI/DSCR", "Playbook de oferta y condiciones", "Plan de los primeros 90 días", "Preparación de conversación con prestamista"],
    timeline: "~2 horas + notas",
    scope: "Análisis educativo; no es asesoramiento de inversión ni evaluación de idoneidad.",
    tags: ["Inversionistas", "Dueños de negocio", "Ejecutivos"],
    price: priceES(PRICING.invest4to10),
  },

  /* ---------------------- Negocios y Profesionales ---------------------- */
  {
    id: "pay-yourself-clinic",
    section: "business",
    title: "Clínica: Incorporación / Cómo Pagarte",
    desc: "Una conversación clara para mapear pago del dueño, nómina/dividendos y próximos pasos con tu contador.",
    bullets: ["Matriz de pago del dueño", "Básicos de nómina y remesas", "Timing de dividendos", "Resumen de 1 página"],
    timeline: "60–75 minutos",
    tags: ["Dueños de negocio", "Profesionales"],
    price: priceES(PRICING.corpPayrollClinic),
  },

  /* -------------------------------- Talleres -------------------------------- */
  {
    id: "public-money-clarity",
    section: "workshops",
    title: "Taller Claridad con el Dinero (Cohorte Pública)",
    desc: "Aprendizaje práctico y con valores: estabilizar flujo, planear apartados y entender las pruebas de estrés hipotecarias.",
    bullets: [
      "Sesión en vivo de 2.5–3 horas",
      "Plantillas de presupuesto y apartados (te las quedas)",
      "Introducción a prueba de estrés hipotecaria (Canadá 2025)",
      "Prompts opcionales de Diseño Humano",
    ],
    timeline: "Sesión única (entre semana o sábado por la mañana)",
    scope: "Abierto a profesionales y familias; cupos limitados para calidad de Q&A.",
    tags: ["Profesionales", "Familias"],
    price: `${priceES(PRICING.workshopPublicSeat)}/persona`,
  },

  /* ------------------------- Estrategia de Legado & Impuestos ------------------------ */
  {
    id: "tax-strategy",
    section: "legacy",
    title: "Sesión de Estrategia Fiscal Personal/Familiar",
    desc: "Establece un ritmo trimestral y apartados en la medida justa—predecible, cumplido y amable con tu sistema nervioso.",
    bullets: ["Calendario trimestral", "Apartados correctos", "Checklist de recibos y registros", "Plantillas de calendario"],
    timeline: "75–90 minutos",
    tags: ["Familias", "Profesionales"],
    price: priceES(PRICING.taxSession),
  },
  {
    id: "legacy-annual",
    section: "legacy",
    title: "Ritmo de Legado & Impuestos (Anual)",
    desc: "Dos sesiones clave + recordatorios suaves para que los plazos no te sorprendan.",
    bullets: ["Ajuste a mitad de año", "Planeación antes de fin de año", "Prompts opcionales de cadencia", "Coordinación con CPA"],
    timeline: "Anual (2 sesiones + puntos de contacto)",
    tags: ["Familias", "Ejecutivos", "Profesionales"],
    price: priceES(PRICING.taxAnnual),
  },
  {
    id: "smallbiz-setup",
    section: "legacy",
    title: "Montaje 90 Días para Independientes / Pequeña Empresa",
    desc: "Lleva flujo, ciclo de HST y pago del dueño a un sistema que escala—y que los prestamistas reconocen.",
    bullets: ["Cadencia de HST", "Plan de ‘pagarte a ti mismx’", "Reservas y colchones del dueño", "Higiene documental"],
    timeline: "~90 días",
    tags: ["Dueños de negocio", "Profesionales"],
    price: priceES(PRICING.taxSmallBiz90d),
  },

  /* ------------------------- Conversaciones Holísticas ------------------------- */
  {
    id: "kt-4w",
    section: "family",
    title: "Conversaciones de Mesa — Cohorte de 4 Semanas",
    desc: "Grupo pequeño, ritmo cálido. Reúnete semanalmente, comparte números reales y practica rutinas de dinero con amabilidad.",
    bullets: [
      "Sesiones semanales en vivo (grupo pequeño)",
      "Prompts opcionales de Diseño Humano",
      "Plantillas y checklists para quedarte",
      "Acompañamiento amable y Q&A",
    ],
    timeline: "4 semanas",
    tags: ["Familias", "Premium"],
    price: priceES(PRICING.ktCohort4w),
  },
  {
    id: "kt-monthly",
    section: "family",
    title: "Conversaciones de Mesa — Círculo Mensual",
    desc: "Un toque más ligero para mantener el impulso: Q&A en vivo, recursos frescos y un espacio amable para pedir ayuda.",
    bullets: ["Q&A en vivo mensual", "Nuevos recursos", "Espacio para preguntas de miembros"],
    timeline: "Mes a mes",
    tags: ["Familias"],
    price: `${priceES(PRICING.ktMonthly)}/mes`,
  },

  /* -------------------------------- Recién llegados -------------------------------- */
  {
    id: "newcomer-30d",
    section: "newcomers",
    title: "Integración Patrimonial para Recién Llegados (30 días)",
    desc: "Ajuste amable para banca, crédito y reporte de renta—para que tu perfil sea claro para los prestamistas.",
    bullets: ["Mapa de cuentas y plan de celular", "Estrategia de tarjeta asegurada y límites", "Opciones de reporte de renta", "Rutina de higiene de crédito"],
    timeline: "~30 días",
    scope: "Planeación y educación; tú ejecutas con las instituciones elegidas.",
    tags: ["Recién llegados"],
    price: priceES(PRICING.newcomerFastTrack),
  },

  /* -------------------------------- Asesoría 1:1 -------------------------------- */
  {
    id: "discovery",
    section: "advice",
    title: "Llamada Privada de Descubrimiento",
    desc: "Una conversación breve y humana. Comparte tu objetivo y tiempos; te llevas 2–3 próximos pasos claros.",
    bullets: ["2–3 próximos pasos", "Sin documentos aún", "Bilingüe EN/ES"],
    timeline: "20–30 minutos",
    tags: ["Profesionales", "Familias", "Ejecutivos", "Recién llegados"],
    price: priceES(PRICING.discovery),
    intent: "consult",
  },
  {
    id: "blueprint",
    section: "advice",
    title: "Sesión Plano de 90 Minutos",
    desc: "Una prioridad atendida con cuidado: capacidad, ritmo fiscal, limpieza de crédito o estrategia de renovación.",
    bullets: [
      "Alcance enfocado",
      "Números personalizados",
      "Acciones escritas en 24h",
      "Snapshot opcional de Diseño Humano",
    ],
    timeline: "90 minutos",
    tags: ["Profesionales", "Dueños de negocio", "Familias"],
    price: priceES(PRICING.blueprint90),
  },
  {
    id: "align-3",
    section: "advice",
    title: "Align (Paquete de 3 Sesiones)",
    desc: "Instala rutinas amables y movimiento—sin agobio.",
    bullets: ["Ritmo del dinero y automatización", "Apartados fiscales que se sostienen", "Acompañamiento ligero"],
    timeline: "6–8 semanas",
    tags: ["Profesionales", "Recién llegados"],
    price: priceES(PRICING.align3),
  },
];

/* ============================= Página ============================= */
export default function ServiciosPage() {
  const [filters, setFilters] = useState<string[]>([]);
  const sectionsWithCards = useMemo(() => {
    const filtered = filters.length ? CARDS.filter((c) => c.tags.some((t) => filters.includes(t))) : CARDS;
    const by = (section: SectionId) => filtered.filter((c) => c.section === section);
    return {
      signature: by("signature"),
      foundations: by("foundations"),
      mortgage: by("mortgage"),
      business: by("business"),
      workshops: by("workshops"),
      legacy: by("legacy"),
      family: by("family"),
      newcomers: by("newcomers"),
      advice: by("advice"),
    };
  }, [filters]);

  const { fade } = useAnims();

  return (
    <main id="main" className="bg-white min-h-screen">
      {/* Banda de marca / encabezado */}
      <section className="bg-brand-green/5 border-b border-brand-gold/30">
        <div className="max-w-content mx-auto px-4 py-10">
          <nav className="mb-3 text-sm text-brand-blue/80" aria-label="Miga de pan">
            <Link href="/es" className="hover:underline">
              Inicio
            </Link>
            <span className="mx-2" aria-hidden="true">/</span>
            <span className="text-brand-green" aria-current="page">Servicios</span>
          </nav>
          <h1 className="font-serif text-3xl md:text-4xl font-semibold tracking-tight text-brand-green">
            Servicios profesionales, entregados con cuidado
          </h1>
          <p className="mt-2 max-w-3xl text-brand-blue/90">
            Acompañamiento sereno y bilingüe para profesionales, familias y dueños de negocio en el GTA. Mezclamos precisión con un ritmo constante—para que las decisiones se sientan claras y amables.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              href="/es/contacto?intent=consult&package=Llamada%20Privada%20de%20Descubrimiento"
              className="inline-flex px-5 py-2.5 bg-brand-green text-white rounded-full font-semibold hover:bg-brand-gold hover:text-brand-green border border-brand-green/20 transition"
            >
              Reservar una consulta privada
            </Link>
            <Link
              href="/es/recursos#overview"
              className="inline-flex px-5 py-2.5 rounded-full border border-brand-blue/40 text-brand-blue hover:bg-brand-blue hover:text-white transition"
            >
              Explorar recursos
            </Link>
          </div>
        </div>
      </section>

      {/* Navegación fija */}
      <SectionNav />

      {/* Resumen / Equipo coordinado */}
      <Panel>
        <SectionTitle
          id="overview"
          title="Un enfoque coordinado"
          subtitle={
            <>
              Agentes hipotecarios con licencia, coaches financieros y aliados fiscales/legales de confianza—alineados bajo un solo plan. Unimos flujo, crédito, ritmo fiscal y estrategia de préstamo a un paso que respeta tu vida. Un enfoque ligero y opcional de Diseño Humano puede personalizar la comunicación y el apoyo sin reemplazar fundamentos financieros, fiscales o legales.
            </>
          }
        />
        <motion.div variants={fade} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }}>
          <ul className="grid md:grid-cols-3 gap-6 text-brand-blue/90">
            <li className={CARD}>
              <h3 className="font-serif text-xl text-brand-green font-bold">Precisión</h3>
              <p className="mt-2">Matemática limpia y documentación creíble para prestamistas. Sin conjeturas, sin drama.</p>
            </li>
            <li className={CARD}>
              <h3 className="font-serif text-xl text-brand-green font-bold">Coordinación</h3>
              <p className="mt-2">Colaboramos con tu contador y abogadx para que el plan se sostenga.</p>
            </li>
            <li className={CARD}>
              <h3 className="font-serif text-xl text-brand-green font-bold">Ritmo humano</h3>
              <p className="mt-2">Avances constantes—números y calma del sistema nervioso.</p>
            </li>
          </ul>
        </motion.div>
      </Panel>

      {/* Filtros por audiencia */}
      <FilterBar value={filters} onChange={setFilters} />

      {/* Paquetes Insignia */}
      <Panel className="mt-8">
        <SectionTitle
          id="signature"
          title="Paquetes Insignia"
          subtitle="Empieza aquí si buscas acompañamiento coordinado y premium"
        />
        <Grid cards={sectionsWithCards.signature} />
      </Panel>

      {/* Fundamentos de Riqueza */}
      <Panel className="mt-8">
        <SectionTitle id="foundations" title="Fundamentos de Riqueza" subtitle="Puntos de partida de alto impacto para claridad y momentum" />
        <Grid cards={sectionsWithCards.foundations} />
      </Panel>

      {/* Hipoteca y Propiedad */}
      <Panel className="mt-8">
        <SectionTitle id="mortgage" title="Hipoteca y Propiedad" subtitle="Confianza de la pre-aprobación al cierre—y después" />
        <Grid cards={sectionsWithCards.mortgage} />
      </Panel>

      {/* Negocios y Profesionales */}
      <Panel className="mt-8">
        <SectionTitle id="business" title="Negocios y Profesionales" subtitle="Claridad a nivel ejecutivo, registros creíbles para prestamistas" />
        <Grid cards={sectionsWithCards.business} />
      </Panel>

      {/* Talleres */}
      <Panel className="mt-8">
        <SectionTitle
          id="workshops"
          title="Talleres"
          subtitle="Aprendizaje práctico y alineado a valores—cohortes públicas y sesiones privadas de equipo"
        />
        <Grid cards={sectionsWithCards.workshops} />
      </Panel>

      {/* Legado e Impuestos */}
      <Panel className="mt-8">
        <SectionTitle id="legacy" title="Legado e Impuestos" subtitle="Apartados previsibles y una cadencia sostenible" />
        <Grid cards={sectionsWithCards.legacy} />
      </Panel>

      {/* Conversaciones Holísticas (Familia & Grupos) */}
      <Panel className="mt-8">
        <SectionTitle
          id="family"
          title="Conversaciones Holísticas (Familia y Grupos)"
          subtitle="Íntimas, prácticas y humanas—espacios seguros para practicar conversaciones sobre dinero"
        />
        <Grid cards={sectionsWithCards.family} />
      </Panel>

      {/* Recién Llegados */}
      <Panel className="mt-8">
        <SectionTitle id="newcomers" title="Recién Llegados" subtitle="Guía bilingüe, paso a paso, desde el día uno" />
        <Grid cards={sectionsWithCards.newcomers} />
      </Panel>

      {/* Asesoría 1:1 */}
      <Panel className="mt-8">
        <SectionTitle id="advice" title="Asesoría 1:1" subtitle="Sesiones privadas con próximos pasos escritos—sin agobio" />
        <Grid cards={sectionsWithCards.advice} />
      </Panel>

      {/* Cómo trabajamos / cumplimiento */}
      <Panel className="mt-8">
        <SectionTitle id="how" title="Cómo trabajamos" subtitle="Constante, humano y transparente" />
        <div className="grid md:grid-cols-3 gap-6">
          <div className={CARD}>
            <h3 className="font-serif text-xl text-brand-green font-bold">1) Descubrimiento</h3>
            <p className="mt-2 text-brand-blue/90">
              Una charla breve y amable. Si hacemos ‘fit’, recibes un mini-plan y un checklist preciso—solo lo necesario.
            </p>
          </div>
          <div className={CARD}>
            <h3 className="font-serif text-xl text-brand-green font-bold">2) Plan &amp; ejecución</h3>
            <p className="mt-2 text-brand-blue/90">
              Modelamos escenarios, preparamos documentos y coordinamos pasos a un ritmo manejable. Siempre sabes qué sigue y por qué.
            </p>
          </div>
          <div className={CARD}>
            <h3 className="font-serif text-xl text-brand-green font-bold">3) Revisión &amp; ajuste</h3>
            <p className="mt-2 text-brand-blue/90">
              Confirmamos resultados contra el plan, anotamos cambios y fijamos tu próximo check-in. Serio y repetible.
            </p>
          </div>
        </div>
        <div className="mt-6 text-sm text-brand-blue/80 space-y-2">
          <p>
            <strong>Notas:</strong> Los precios están en CAD y pueden estar sujetos a HST. Los servicios hipotecarios suelen ser gratuitos para prestatarios residenciales calificados porque la compensación la paga el prestamista al cierre. En escenarios no-prime/privados/comerciales pueden aplicar honorarios y siempre se informarán por adelantado. Todas las hipotecas son O.A.C. (aprobación de crédito).
          </p>
          <p>
            La asesoría y el coaching (solo asesoría) son independientes de cualquier compensación hipotecaria y no reemplazan asesoría legal, fiscal o contable. Coordinamos con tus profesionales cuando haga falta. Los documentos se recopilan mediante enlaces seguros. Soporte bilingüe (EN/ES).
          </p>
          <p>
            Para talleres: las sesiones virtuales están disponibles en todo Canadá; las presenciales pueden incluir tiempo/gastos de viaje. Las cohortes públicas por asiento tienen cupo limitado para preservar la calidad del Q&amp;A.
          </p>
          <p className="mb-0">
            ¿Prefieres inglés? <Link href="/en/services" className="underline">See services in English</Link>.
          </p>
        </div>
      </Panel>
    </main>
  );
}

/* ============================ Grid renderer ============================ */
function Grid({ cards }: { cards: Card[] }) {
  const { stagger } = useAnims();
  if (!cards.length) {
    return <p className="text-brand-blue/70">No hay servicios que coincidan con los filtros actuales.</p>;
  }
  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      {cards.map((c) => (
        <PackageCard key={c.id} c={c} />
      ))}
    </motion.div>
  );
}
