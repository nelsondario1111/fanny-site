// app/es/servicios/page.tsx
"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { useEffect, useMemo, useRef, useState } from "react";

import {
  Reveal,
  RevealPanel,
  StaggerGroup,
  useMotionPresets,
} from "@/components/motion-safe";

/* ============================ Precios (CAD) ============================ */
/** Pon cualquier precio en null para mostrar “Consultar precio”. Puede aplicar HST. */
const PRICING = {
  // Entrada / Hipoteca
  mortgagePreapproval: 0,
  refiRenewal: 295,
  firstHomePlan: 395,

  // Profesionales y dueños de negocio
  proTuneUp90: 1200,
  bizOwnerExecPlan: 2500,
  corpPayrollClinic: 395,

  // Recién llegados
  newcomerFastTrack: 395,

  // Hipoteca e inversión
  invest4to10: 695,
  annualReviewNonClient: 149,

  // 1:1 (solo asesoría)
  discovery: 0,
  blueprint90: 395,
  align3: 1200,
  transform6: 2750,
  elevatePremium: 4995,
  alumniRetainerMonthly: 149,

  // Impuestos y legado
  taxSession: 395,
  taxAnnual: 1295,
  taxSmallBiz90d: 1995,

  // Conversaciones holísticas (grupales)
  ktCohort4w: 795,
  ktMonthly: 49,

  // Talleres
  workshopPublicSeat: 149,
  workshopTeamVirtual: 2400,
  workshopTeamInPerson: 2800,
} as const;

function price(p: number | null) {
  if (p === null) return "Consultar precio";
  if (p === 0) return "Gratis";
  return `$${p} CAD`;
}

/* ================== Panel / títulos / badges compartidos ================== */
function Panel({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <section
      className={[
        "max-w-content mx-auto px-5 sm:px-8 py-8 sm:py-12",
        "bg-white/95 rounded-[28px] border border-brand-gold/40 shadow-lg",
        "backdrop-blur-[1px]",
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
  const { fade, fadeUp } = useMotionPresets();
  return (
    <div id={id} className="scroll-mt-24">
      <div className="text-center mb-6">
        <Reveal variants={fadeUp}>
          {level === "h1" ? (
            <h1 className="font-serif font-extrabold text-3xl md:text-4xl text-brand-green tracking-tight">
              {title}
            </h1>
          ) : (
            <h2 className="font-serif font-extrabold text-3xl md:text-4xl text-brand-green tracking-tight">
              {title}
            </h2>
          )}
        </Reveal>

        <Reveal variants={fade}>
          <div className="flex justify-center my-4" aria-hidden="true">
            <div className="w-16 h-[3px] rounded-full bg-brand-gold" />
          </div>
        </Reveal>

        {subtitle && (
          <Reveal variants={fadeUp}>
            <p className="text-brand-blue/90 text-lg md:text-xl max-w-3xl mx-auto">{subtitle}</p>
          </Reveal>
        )}
      </div>
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

/* Estilo de tarjeta alineado con paneles */
const CARD =
  "rounded-3xl border border-brand-gold/40 bg-white/95 shadow-lg p-6 transition hover:-translate-y-[1px] hover:shadow-xl focus-within:ring-2 focus-within:ring-brand-gold backdrop-blur-[1px]";

/* ======================= Tarjeta reutilizable de paquete ======================= */
type Intent = "consult" | "preapproval" | "package";

type SectionId =
  | "resumen"
  | "paquetes"
  | "fundamentos"
  | "hipoteca"
  | "negocios"
  | "talleres"
  | "legado"
  | "familia"
  | "recien-llegados"
  | "asesoria"
  | "como";

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
  const { fadeUp } = useMotionPresets();
  const qs = new URLSearchParams();
  qs.set("intent", c.intent ?? "package");
  qs.set("package", c.title);
  return (
    <Reveal variants={fadeUp}>
      <article className={CARD} aria-labelledby={`${c.id}-title`}>
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
            aria-label={`Consultar sobre ${c.title}`}
          >
            Reservar consulta privada
          </Link>
          <Link
            href="/es/recursos"
            className="px-5 py-2.5 rounded-full border border-brand-blue/40 text-brand-blue hover:bg-brand-blue hover:text-white transition"
          >
            Explorar recursos relacionados
          </Link>
        </div>
      </article>
    </Reveal>
  );
}

/* ====================== Navegación pegajosa en página ====================== */
const SECTIONS = [
  { id: "resumen", label: "Resumen" },
  { id: "paquetes", label: "Paquetes insignia" },
  { id: "fundamentos", label: "Fundamentos de riqueza" },
  { id: "hipoteca", label: "Hipoteca y propiedad" },
  { id: "negocios", label: "Negocios y profesionales" },
  { id: "talleres", label: "Talleres" },
  { id: "legado", label: "Legado e impuestos" },
  { id: "familia", label: "Conversaciones holísticas" },
  { id: "recien-llegados", label: "Recién llegados" },
  { id: "asesoria", label: "Asesoría 1:1" },
  { id: "como", label: "Cómo trabajamos" },
] as const;

function SectionNav() {
  const [active, setActive] = useState<string>("resumen");
  const refs = useRef<Record<string, HTMLElement | null>>({});

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-25% 0px -65% 0px", threshold: [0, 0.2, 0.5, 0.8, 1] }
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
      <nav className="max-w-content mx-auto px-4 py-2 flex gap-2 overflow-x-auto text-sm" aria-label="En esta página">
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

/* ========================= Chips de filtro por audiencia ======================== */
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
  /* ------------------------------ Paquetes insignia ------------------------------ */
  {
    id: "elevate",
    section: "paquetes",
    title: "Elevate (Paquete Premium de Transformación)",
    desc: "Dirección integral de tus finanzas: estrategia hipotecaria, ritmo fiscal, alineación de negocio y calma con el dinero—bajo un mismo paraguas coordinado.",
    bullets: [
      "Blueprint financiero (flujo, hipoteca, impuestos)",
      "6+ sesiones privadas con planes escritos",
      "Coordinación con contador y abogado",
      "Enfoque opcional de Human Design",
    ],
    timeline: "~6 meses de acompañamiento",
    tags: ["Ejecutivos", "Familias", "Dueños de negocio", "Premium"],
    price: price(PRICING.elevatePremium),
  },
  {
    id: "transform",
    section: "paquetes",
    title: "Transform (Paquete de 6 sesiones)",
    desc: "Profundidad sin saturación: instalamos un sistema funcional de flujo, higiene de crédito y provisiones fiscales.",
    bullets: ["Plan de extremo a extremo", "Barandales claros", "Documentación creíble para prestamistas", "Acciones por escrito tras cada sesión"],
    timeline: "~12 semanas",
    tags: ["Ejecutivos", "Dueños de negocio", "Familias"],
    price: price(PRICING.transform6),
  },
  {
    id: "exec-teaming",
    section: "paquetes",
    title: "Executive Wealth Teaming (Founder/Profesional)",
    desc: "Alinea pago del dueño, banca y registros que respetan los prestamistas—en conjunto con tu contador y abogado.",
    bullets: [
      "Matriz de compensación (salario/dividendos)",
      "Cadencia de HST; reservas y colchones",
      "Coordinación con CPA/abogado",
      "Ritmo de decisión y liderazgo (opcional)",
    ],
    timeline: "4–6 semanas (típico)",
    scope: "Planificación y documentación; la ejecución fiscal/legal con tus profesionales.",
    tags: ["Ejecutivos", "Dueños de negocio", "Premium"],
    price: `Desde ${price(PRICING.bizOwnerExecPlan)}`,
  },
  {
    id: "team-workshop",
    section: "paquetes",
    title: "Taller de Bienestar Financiero (Equipo Privado)",
    desc: "Sesión enfocada de 3 horas: cadencia de flujo, registros creíbles para prestamistas y un lenguaje común del dinero en el trabajo.",
    bullets: ["Encuesta previa + agenda a medida", "Taller en vivo 3h con Q&A", "Deck + paquete de recursos (ES/EN)", "Resumen de seguimiento"],
    timeline: "3 horas (virtual o presencial)",
    scope: "Hasta 20 participantes. Presencial agrega viaje. Aplica HST.",
    tags: ["Ejecutivos", "Dueños de negocio", "Profesionales", "Premium"],
    price: `Desde ${price(PRICING.workshopTeamVirtual)} (virtual) • ${price(PRICING.workshopTeamInPerson)} (presencial)`,
  },

  /* ----------------------------- Fundamentos ----------------------------- */
  {
    id: "family-wealth-blueprint",
    section: "fundamentos",
    title: "Family Wealth Blueprint (con opciones FHSA)",
    desc: "Plan en el tamaño justo para familias profesionales: cadencia de ahorro, coordinación FHSA y ruta creíble hacia la preaprobación.",
    bullets: [
      "Optimización FHSA individual/pareja",
      "Mapa de ahorro y enganche",
      "Asequibilidad con stress-test en mente",
      "Prompts opcionales de Human Design",
    ],
    timeline: "90 minutos + seguimiento curado",
    tags: ["Familias", "Premium"],
    price: price(PRICING.firstHomePlan),
    intent: "consult",
  },
  {
    id: "pro-tune-up",
    section: "fundamentos",
    title: "Sintonía Financiera para Profesionales (90 días)",
    desc: "Ritmo humano para estabilizar flujo, provisiones reales y buena higiene de crédito—pensado para agendas ocupadas.",
    bullets: [
      "Cadencia semanal del dinero",
      "Provisiones fiscales trimestrales",
      "Checklist de automatización",
      "Personalización con Human Design (opcional)",
    ],
    timeline: "~90 días (3 sesiones + emails de control)",
    scope: "Solo asesoría (sin venta de productos).",
    tags: ["Profesionales", "Ejecutivos", "Premium"],
    price: price(PRICING.proTuneUp90),
  },

  /* ------------------------- Hipoteca y propiedad ------------------------- */
  {
    id: "mortgage-concierge",
    section: "hipoteca",
    title: "Concierge Hipotecario — Preparación y Preaprobación",
    desc: "Prepara, ajusta y arma tu expediente para que los prestamistas digan sí con confianza—y en calma.",
    bullets: [
      "Checklist preciso; carga segura",
      "Escenarios con stress-test y matching de prestamista",
      "Soporte de tasación a cierre",
      "Breve de Human Design (opcional)",
    ],
    timeline: "Usualmente 1–2 semanas tras completar documentos",
    scope:
      "Residencial; O.A.C.; sin honorarios al prestatario en casos prime típicos—cualquier excepción se revela por adelantado.",
    tags: ["Profesionales", "Familias", "Recién llegados", "Premium"],
    price: price(PRICING.mortgagePreapproval),
    intent: "preapproval",
  },
  {
    id: "refi-renewal",
    section: "hipoteca",
    title: "Estrategia de Refinanciación y Renovación",
    desc: "Matemática limpia, trade-offs claros y un plan breve por escrito.",
    bullets: ["Modelo refi vs. renovar", "Análisis de penalidad y punto de equilibrio de tasa", "Guardas de prepago", "Resumen escrito en 24h"],
    timeline: "60–90 minutos",
    tags: ["Profesionales", "Familias", "Ejecutivos"],
    price: price(PRICING.refiRenewal),
  },
  {
    id: "invest-4-10",
    section: "hipoteca",
    title: "Inicio en Inversión: 4–10 Unidades (DSCR)",
    desc: "Números honestos y condiciones más seguras para tu primer edificio pequeño—claridad sin drama.",
    bullets: ["Modelos GMR/OPEX/NOI/DSCR", "Playbook de oferta y condiciones", "Plan de los primeros 90 días", "Preparación de conversación con prestamista"],
    timeline: "~2 horas + notas",
    scope: "Análisis educativo; no es asesoría de inversión ni evaluación de idoneidad.",
    tags: ["Inversionistas", "Dueños de negocio", "Ejecutivos"],
    price: price(PRICING.invest4to10),
  },

  /* ---------------------- Negocios y profesionales ---------------------- */
  {
    id: "pay-yourself-clinic",
    section: "negocios",
    title: "Clínica de Incorporación / Págate a Ti Mismo",
    desc: "Una conversación clara para mapear pago del dueño, nómina/dividendos y siguientes pasos con tu contador.",
    bullets: ["Matriz de pago del dueño", "Básicos de nómina y remisiones", "Timing de dividendos", "Resumen 1 página para decidir"],
    timeline: "60–75 minutos",
    tags: ["Dueños de negocio", "Profesionales"],
    price: price(PRICING.corpPayrollClinic),
  },

  /* -------------------------------- Talleres -------------------------------- */
  {
    id: "public-money-clarity",
    section: "talleres",
    title: "Taller Claridad con el Dinero (Cohorte pública)",
    desc: "Aprendizaje práctico y alineado a valores para estabilizar flujo, planear provisiones y entender el stress-test hipotecario.",
    bullets: [
      "Sesión en vivo de 2.5–3 h",
      "Plantillas de presupuesto y provisiones para ti",
      "Introducción al stress-test hipotecario (Canadá 2025)",
      "Prompts opcionales de Human Design",
    ],
    timeline: "Sesión única (entre semana o sábado por la mañana)",
    scope: "Abierto a profesionales y familias; cupo limitado para calidad de Q&A.",
    tags: ["Profesionales", "Familias"],
    price: `${price(PRICING.workshopPublicSeat)}/persona`,
  },

  /* ------------------------- Estrategia de legado e impuestos ------------------------ */
  {
    id: "tax-strategy",
    section: "legado",
    title: "Sesión de Estrategia Fiscal (Personal/Familia)",
    desc: "Define cadencia trimestral y provisiones en el tamaño correcto—predecible, en cumplimiento y amable con tu sistema nervioso.",
    bullets: ["Calendario trimestral", "Provisiones a la medida", "Checklist de recibos y registros", "Plantillas de calendario"],
    timeline: "75–90 minutos",
    tags: ["Familias", "Profesionales"],
    price: price(PRICING.taxSession),
  },
  {
    id: "legacy-annual",
    section: "legado",
    title: "Ritmo de Legado e Impuestos (Anual)",
    desc: "Dos sesiones clave + recordatorios para que los plazos no te sorprendan.",
    bullets: ["Ajuste a mitad de año", "Planeación pre-cierre de año", "Prompts de cadencia (opcionales)", "Coordinación con CPA"],
    timeline: "Anual (2 sesiones + touchpoints)",
    tags: ["Familias", "Ejecutivos", "Profesionales"],
    price: price(PRICING.taxAnnual),
  },
  {
    id: "smallbiz-setup",
    section: "legado",
    title: "Setup 90 días—PyME / Independiente",
    desc: "Integra flujo, ciclo HST y pago del dueño en un sistema escalable—y que reconocen los prestamistas.",
    bullets: ["Cadencia HST", "Plan págate a ti mismo", "Reservas y colchones del dueño", "Higiene documental"],
    timeline: "~90 días",
    tags: ["Dueños de negocio", "Profesionales"],
    price: price(PRICING.taxSmallBiz90d),
  },

  /* ------------------------- Conversaciones holísticas ------------------------- */
  {
    id: "kt-4w",
    section: "familia",
    title: "Conversaciones en la Mesa — Cohorte 4 semanas",
    desc: "Grupo pequeño, ritmo cálido. Reúnete semanalmente, comparte números reales y practica rutinas de dinero amables.",
    bullets: [
      "Sesiones en vivo semanales (grupo pequeño)",
      "Prompts opcionales de Human Design",
      "Plantillas y checklists para conservar",
      "Accountability amable y Q&A",
    ],
    timeline: "4 semanas",
    tags: ["Familias", "Premium"],
    price: price(PRICING.ktCohort4w),
  },
  {
    id: "kt-monthly",
    section: "familia",
    title: "Conversaciones en la Mesa — Círculo mensual",
    desc: "Un toque ligero para mantener movimiento: Q&A en vivo, recursos frescos y un espacio amable para pedir ayuda.",
    bullets: ["Q&A mensual en vivo", "Drops de recursos", "Espacio de miembros para preguntas"],
    timeline: "Mes a mes",
    tags: ["Familias"],
    price: `${price(PRICING.ktMonthly)}/mes`,
  },

  /* --------------------------------  Recién llegados -------------------------------- */
  {
    id: "newcomer-30d",
    section: "recien-llegados",
    title: "Integración Patrimonial para Recién Llegados (30 días)",
    desc: "Setup amable de banca, crédito y reporte de renta—para que tu perfil se lea con claridad ante prestamistas.",
    bullets: ["Mapa de cuentas y plan celular", "Estrategia de tarjeta asegurada y límites", "Opciones de reporte de renta", "Rutina de higiene crediticia"],
    timeline: "~30 días",
    scope: "Planificación y educación; tú ejecutas con las instituciones elegidas.",
    tags: ["Recién llegados"],
    price: price(PRICING.newcomerFastTrack),
  },

  /* -------------------------------- 1:1 -------------------------------- */
  {
    id: "discovery",
    section: "asesoria",
    title: "Llamada de Descubrimiento Privada",
    desc: "Conversación breve y humana. Comparte tu meta y tiempos; llévate 2–3 próximos pasos claros.",
    bullets: ["2–3 próximos pasos", "Sin documentos aún", "Bilingüe ES/EN"],
    timeline: "20–30 minutos",
    tags: ["Profesionales", "Familias", "Ejecutivos", "Recién llegados"],
    price: price(PRICING.discovery),
    intent: "consult",
  },
  {
    id: "blueprint",
    section: "asesoria",
    title: "Sesión Blueprint de 90 minutos",
    desc: "Una prioridad, bien cuidada: asequibilidad, ritmo fiscal, limpieza de crédito o estrategia de renovación.",
    bullets: [
      "Alcance enfocado",
      "Números personalizados",
      "Acciones por escrito en 24h",
      "Snapshot opcional de Human Design",
    ],
    timeline: "90 minutos",
    tags: ["Profesionales", "Dueños de negocio", "Familias"],
    price: price(PRICING.blueprint90),
  },
  {
    id: "align-3",
    section: "asesoria",
    title: "Align (Paquete de 3 sesiones)",
    desc: "Instala rutinas amables y momentum—sin abrumarte.",
    bullets: ["Ritmo del dinero y automatización", "Provisiones fiscales que se cumplen", "Accountability ligero"],
    timeline: "6–8 semanas",
    tags: ["Profesionales", "Recién llegados"],
    price: price(PRICING.align3),
  },
];

/* ============================= Página ============================= */
export default function ServicesPageEs() {
  const [filters, setFilters] = useState<string[]>([]);
  const sectionsWithCards = useMemo(() => {
    const filtered = filters.length ? CARDS.filter((c) => c.tags.some((t) => filters.includes(t))) : CARDS;
    const by = (section: SectionId) => filtered.filter((c) => c.section === section);
    return {
      paquetes: by("paquetes"),
      fundamentos: by("fundamentos"),
      hipoteca: by("hipoteca"),
      negocios: by("negocios"),
      talleres: by("talleres"),
      legado: by("legado"),
      familia: by("familia"),
      recienLlegados: by("recien-llegados"),
      asesoria: by("asesoria"),
    };
  }, [filters]);

  const { fade } = useMotionPresets();

  return (
    <main id="main" className="bg-white min-h-screen">
      {/* Banda de marca */}
      <section className="bg-brand-green/5 border-b border-brand-gold/30">
        <div className="max-w-content mx-auto px-4 py-10">
          <nav className="mb-3 text-sm text-brand-blue/80" aria-label="Breadcrumb">
            <Link href="/es" className="hover:underline">Inicio</Link>
            <span className="mx-2" aria-hidden="true">/</span>
            <span className="text-brand-green" aria-current="page">Servicios</span>
          </nav>

          <Reveal variants={fade}>
            <h1 className="font-serif text-3xl md:text-4xl font-semibold tracking-tight text-brand-green">
              Servicios profesionales, con cuidado humano
            </h1>
          </Reveal>

          <Reveal variants={fade}>
            <p className="mt-2 max-w-3xl text-brand-blue/90">
              Acompañamiento bilingüe y sereno para profesionales, familias y dueños de negocio en el GTA.
              Mezclamos precisión con un ritmo llevadero—para que decidir se sienta claro y amable.
            </p>
          </Reveal>

          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              href="/es/contacto?intent=consult&package=Llamada%20de%20Descubrimiento%20Privada"
              className="inline-flex px-5 py-2.5 bg-brand-green text-white rounded-full font-semibold hover:bg-brand-gold hover:text-brand-green border border-brand-green/20 transition"
            >
              Reservar consulta privada
            </Link>
            <Link
              href="/es/recursos"
              className="inline-flex px-5 py-2.5 rounded-full border border-brand-blue/40 text-brand-blue hover:bg-brand-blue hover:text-white transition"
            >
              Explorar recursos
            </Link>
          </div>
        </div>
      </section>

      {/* Nav pegajosa */}
      <SectionNav />

      {/* Resumen / paraguas de equipo */}
      <Panel>
        <SectionTitle
          id="resumen"
          title="Un enfoque coordinado"
          subtitle={
            <>
              Agentes hipotecarios con licencia, coaches financieros y aliados fiscales &amp; legales—alineados bajo un solo plan.
              Integramos flujo de caja, crédito, ritmo fiscal y estrategia de financiamiento a un ritmo que respeta tu vida.
              Un lente ligero y opcional de Human Design puede personalizar comunicación y apoyo sin sustituir fundamentos
              financieros, fiscales o legales.
            </>
          }
        />
        <Reveal variants={fade}>
          <ul className="grid md:grid-cols-3 gap-6 text-brand-blue/90">
            <li className={CARD}>
              <h3 className="font-serif text-xl text-brand-green font-bold">Precisión</h3>
              <p className="mt-2">Matemática limpia y documentación creíble para prestamistas. Sin suposiciones ni drama.</p>
            </li>
            <li className={CARD}>
              <h3 className="font-serif text-xl text-brand-green font-bold">Coordinación</h3>
              <p className="mt-2">Colaboramos con tu contador y abogado para que el plan se sostenga.</p>
            </li>
            <li className={CARD}>
              <h3 className="font-serif text-xl text-brand-green font-bold">Ritmo humano</h3>
              <p className="mt-2">Avance constante—números + calma del sistema nervioso.</p>
            </li>
          </ul>
        </Reveal>
      </Panel>

      {/* Filtros por audiencia */}
      <FilterBar value={filters} onChange={setFilters} />

      {/* Paquetes insignia */}
      <Panel className="mt-8">
        <SectionTitle id="paquetes" title="Paquetes insignia" subtitle="Empieza aquí si buscas apoyo premium y coordinado" />
        <Grid cards={sectionsWithCards.paquetes} />
      </Panel>

      {/* Fundamentos de riqueza */}
      <Panel className="mt-8">
        <SectionTitle id="fundamentos" title="Fundamentos de riqueza" subtitle="Puntos de inicio de alto impacto para claridad y momentum" />
        <Grid cards={sectionsWithCards.fundamentos} />
      </Panel>

      {/* Hipoteca y propiedad */}
      <Panel className="mt-8">
        <SectionTitle id="hipoteca" title="Estrategia de hipoteca y propiedad" subtitle="Confianza desde la preaprobación al cierre—y más allá" />
        <Grid cards={sectionsWithCards.hipoteca} />
      </Panel>

      {/* Negocios y profesionales */}
      <Panel className="mt-8">
        <SectionTitle id="negocios" title="Negocios y profesionales" subtitle="Claridad de nivel ejecutivo y registros creíbles" />
        <Grid cards={sectionsWithCards.negocios} />
      </Panel>

      {/* Talleres */}
      <Panel className="mt-8">
        <SectionTitle
          id="talleres"
          title="Talleres"
          subtitle="Aprendizaje práctico y alineado a valores—cohortes públicas y sesiones privadas de equipo"
        />
        <Grid cards={sectionsWithCards.talleres} />
      </Panel>

      {/* Legado e impuestos */}
      <Panel className="mt-8">
        <SectionTitle id="legado" title="Legado e impuestos" subtitle="Provisiones predecibles y una cadencia sostenible" />
        <Grid cards={sectionsWithCards.legado} />
      </Panel>

      {/* Conversaciones holísticas */}
      <Panel className="mt-8">
        <SectionTitle
          id="familia"
          title="Conversaciones holísticas (familia y grupos)"
          subtitle="Íntimas, prácticas y humanas—espacios seguros para conversar sobre dinero"
        />
        <Grid cards={sectionsWithCards.familia} />
      </Panel>

      {/* Recién llegados */}
      <Panel className="mt-8">
        <SectionTitle id="recien-llegados" title="Recién llegados" subtitle="Guía bilingüe, paso a paso, desde el día uno" />
        <Grid cards={sectionsWithCards.recienLlegados} />
      </Panel>

      {/* Asesoría 1:1 */}
      <Panel className="mt-8">
        <SectionTitle id="asesoria" title="Asesoría 1:1" subtitle="Sesiones privadas con próximos pasos por escrito—sin abrumarte" />
        <Grid cards={sectionsWithCards.asesoria} />
      </Panel>

      {/* Cómo trabajamos / cumplimiento */}
      <Panel className="mt-8">
        <SectionTitle id="como" title="Cómo trabajamos" subtitle="Constante, humano y transparente" />
        <div className="grid md:grid-cols-3 gap-6">
          <div className={CARD}>
            <h3 className="font-serif text-xl text-brand-green font-bold">1) Descubrimiento</h3>
            <p className="mt-2 text-brand-blue/90">
              Conversación breve y amable. Si hay encaje, recibes un plan corto y un checklist preciso—solo lo necesario.
            </p>
          </div>
          <div className={CARD}>
            <h3 className="font-serif text-xl text-brand-green font-bold">2) Plan y ejecución</h3>
            <p className="mt-2 text-brand-blue/90">
              Modelamos escenarios, preparamos documentos y coordinamos pasos a un ritmo manejable. Siempre sabes qué sigue y por qué.
            </p>
          </div>
          <div className={CARD}>
            <h3 className="font-serif text-xl text-brand-green font-bold">3) Revisión y ajuste</h3>
            <p className="mt-2 text-brand-blue/90">
              Confirmamos resultados vs. plan, anotamos cambios y fijamos tu próximo check-in. Calmo y repetible.
            </p>
          </div>
        </div>
        <div className="mt-6 text-sm text-brand-blue/80 space-y-2">
          <p>
            <strong>Notas:</strong> Los precios están en CAD y pueden estar sujetos a HST. Los servicios hipotecarios suelen ser gratuitos
            para prestatarios residenciales calificados porque la compensación la paga el prestamista al cierre. Pueden aplicar honorarios
            en escenarios no-prime/privados/comerciales y siempre se informarán por adelantado. Todas las hipotecas están sujetas a aprobación
            crediticia (O.A.C.).
          </p>
          <p>
            El coaching y los servicios de asesoría independiente son ajenos a la compensación hipotecaria y no reemplazan asesoría legal,
            fiscal o contable. Coordinamos con los profesionales que elijas. Los documentos se recopilan mediante enlaces seguros. Soporte bilingüe (ES/EN).
          </p>
          <p>
            Para talleres: las sesiones virtuales están disponibles en todo Canadá; las presenciales pueden incluir tiempo/gastos de viaje. Las cohortes públicas
            con cupos por asiento tienen capacidad limitada para preservar la calidad del Q&amp;A.
          </p>
          <p className="mb-0">
            ¿Prefieres inglés? <Link href="/en/services" className="underline">See services in English</Link>.
          </p>
        </div>
      </Panel>
    </main>
  );
}

/* ============================ Renderizador de grid ============================ */
function Grid({ cards }: { cards: Card[] }) {
  const { stagger } = useMotionPresets();
  if (!cards.length) {
    return <p className="text-brand-blue/70">No hay servicios que coincidan con los filtros actuales.</p>;
  }
  return (
    <StaggerGroup className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {cards.map((c) => (
        <PackageCard key={c.id} c={c} />
      ))}
    </StaggerGroup>
  );
}
