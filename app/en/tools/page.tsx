// app/es/herramientas/page.tsx
"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import type { JSX as JSXNS } from "react";

// ✅ Primitivas de animación seguras para hidratar
import {
  Reveal,
  StaggerGroup,
  useMotionPresets,
} from "@/components/motion-safe";

import {
  FaCalculator, FaHome, FaShieldAlt, FaGlobeAmericas, FaCheckCircle, FaClipboardList,
  FaFileExcel, FaFileCsv, FaPercent, FaBuilding, FaChartLine, FaBalanceScale,
  FaMoneyBillWave, FaPiggyBank, FaRobot, FaSignInAlt, FaPrint, FaListUl, FaThLarge
} from "react-icons/fa";

/* ============================== UI compartida ============================== */
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
  const Tag: keyof JSXNS.IntrinsicElements = level;
  return (
    <div id={id} className="scroll-mt-24">
      <div className="text-center mb-6">
        <Reveal>
          <Tag className="font-serif font-extrabold text-3xl md:text-4xl text-brand-green tracking-tight">
            {title}
          </Tag>
        </Reveal>
        <Reveal>
          <div className="flex justify-center my-4" aria-hidden="true">
            <div className="w-16 h-[3px] rounded-full bg-brand-gold" />
          </div>
        </Reveal>
        {subtitle && (
          <Reveal>
            <p className="text-brand-blue/90 text-lg md:text-xl max-w-3xl mx-auto">{subtitle}</p>
          </Reveal>
        )}
      </div>
    </div>
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

/* ============================== Modelo de datos ============================== */
type Categoria =
  | "Hipoteca"
  | "Inversionistas"
  | "Plantillas"
  | "Utilidades"
  | "Planificación";

type Tipo = "calculator" | "worksheet" | "utility";
type CTA = { label: string; href: string; variant?: "primary" | "ghost" | "ghostGold" };

type ToolItem = {
  id: string;
  title: string;
  desc: string;
  href: string;         // destino bajo /es/herramientas/*
  category: Categoria;  // agrupación para navegación/secciones
  type: Tipo;           // tipo funcional (filtro)
  icon: ReactNode;
  ctas?: CTA[];
  extra?: ReactNode;
  tags?: string[];
};

/* ================================ Botones ================================ */
const ButtonPrimary =
  "px-5 py-2.5 bg-brand-green text-white rounded-full font-semibold hover:bg-brand-gold hover:text-brand-green border border-brand-green/20 transition";
const ButtonGhost =
  "inline-flex items-center gap-2 px-4 py-2 rounded-full border-2 border-brand-green text-brand-green hover:bg-brand-green hover:text-white transition";
const ButtonGhostGold =
  "inline-flex items-center gap-2 px-4 py-2 rounded-full border-2 border-brand-gold text-brand-gold hover:bg-brand-gold hover:text-brand-green transition";

/* ================================ Herramientas ================================ */
const TOOLS: ToolItem[] = [
  // ---- Hipoteca / Cierre ----
  {
    id: "impuesto-transferencia",
    title: "Impuesto de Transferencia (ON + Toronto)",
    desc: "Calcula el LTT de Ontario y el MLTT de Toronto, con reembolsos para primera compra.",
    href: "/es/herramientas/impuesto-transferencia",
    category: "Hipoteca",
    type: "calculator",
    icon: <FaPercent className="text-brand-green text-2xl" aria-hidden />,
    ctas: [{ label: "Abrir calculadora", href: "/es/herramientas/impuesto-transferencia", variant: "primary" }],
    tags: ["costos de cierre", "ontario", "toronto", "primer hogar"],
  },
  {
    id: "costos-cierre",
    title: "Costos de Cierre",
    desc: "Legales, título, inspecciones, ajustes y opciones LTT/NRST donde apliquen.",
    href: "/es/herramientas/costos-cierre",
    category: "Hipoteca",
    type: "calculator",
    icon: <FaPiggyBank className="text-brand-blue text-2xl" aria-hidden />,
    ctas: [{ label: "Abrir calculadora", href: "/es/herramientas/costos-cierre", variant: "primary" }],
    tags: ["cierre", "legal", "título", "nrst"],
  },
  {
    id: "pago-inicial-seguro",
    title: "Pago Inicial y Seguro (CMHC)",
    desc: "Pago inicial mínimo, prima estimada de CMHC y elegibilidad asegurada.",
    href: "/es/herramientas/pago-inicial-seguro",
    category: "Hipoteca",
    type: "calculator",
    icon: <FaMoneyBillWave className="text-brand-blue text-2xl" aria-hidden />,
    ctas: [{ label: "Abrir calculadora", href: "/es/herramientas/pago-inicial-seguro", variant: "primary" }],
    tags: ["pago inicial", "seguro", "cmhc"],
  },

  // ---- Calificación / Asequibilidad ----
  {
    id: "prueba-esfuerzo",
    title: "Asequibilidad y Prueba de Esfuerzo",
    desc: "Verifica calificación con la tasa de *stress test* exigida por el gobierno.",
    href: "/es/herramientas/prueba-esfuerzo",
    category: "Hipoteca",
    type: "calculator",
    icon: <FaBalanceScale className="text-brand-green text-2xl" aria-hidden />,
    ctas: [{ label: "Abrir calculadora", href: "/es/herramientas/prueba-esfuerzo", variant: "primary" }],
    tags: ["calificación", "mqr", "gds", "tds"],
  },
  {
    id: "asequibilidad-hipotecaria",
    title: "Asequibilidad Hipotecaria (Rápida)",
    desc: "Estimación rápida con tus ingresos, deudas y supuestos de tasa.",
    href: "/es/herramientas/asequibilidad-hipotecaria",
    category: "Hipoteca",
    type: "calculator",
    icon: <FaHome className="text-brand-blue text-2xl" aria-hidden />,
    ctas: [{ label: "Abrir calculadora", href: "/es/herramientas/asequibilidad-hipotecaria", variant: "primary" }],
    tags: ["asequibilidad", "precalificación"],
  },

  // ---- Pagos / Planificación ----
  {
    id: "calculadora-hipotecaria",
    title: "Calculadora Hipotecaria",
    desc: "Estima pagos mensuales, quincenales y semanales.",
    href: "/es/herramientas/calculadora-hipotecaria",
    category: "Planificación",
    type: "calculator",
    icon: <FaHome className="text-brand-blue text-2xl" aria-hidden />,
    ctas: [{ label: "Abrir calculadora", href: "/es/herramientas/calculadora-hipotecaria", variant: "primary" }],
    tags: ["hipoteca", "pago", "amortización"],
  },
  {
    id: "tabla-amortizacion",
    title: "Tabla de Amortización y Prepagos",
    desc: "Detalle mes a mes e impacto de prepagos; exporta resumen/tabla.",
    href: "/es/herramientas/tabla-amortizacion",
    category: "Planificación",
    type: "calculator",
    icon: <FaChartLine className="text-brand-green text-2xl" aria-hidden />,
    ctas: [{ label: "Abrir calculadora", href: "/es/herramientas/tabla-amortizacion", variant: "primary" }],
    tags: ["amortización", "prepagos", "csv"],
  },
  {
    id: "penalidad-hipotecaria",
    title: "Penalidad Hipotecaria",
    desc: "Estimación simple de IRD o 3 meses de interés antes de refinanciar o romper plazo.",
    href: "/es/herramientas/penalidad-hipotecaria",
    category: "Planificación",
    type: "calculator",
    icon: <FaMoneyBillWave className="text-brand-blue text-2xl" aria-hidden />,
    ctas: [{ label: "Abrir calculadora", href: "/es/herramientas/penalidad-hipotecaria", variant: "primary" }],
    tags: ["penalidad", "refinanciación"],
  },

  // ---- Refinanciación / Alquilar vs Comprar ----
  {
    id: "refinanciar-blend",
    title: "Refinanciación y Blend & Extend",
    desc: "Compara blend-and-extend vs. romper y refinanciar.",
    href: "/es/herramientas/refinanciar-blend",
    category: "Planificación",
    type: "calculator",
    icon: <FaBalanceScale className="text-brand-green text-2xl" aria-hidden />,
    ctas: [{ label: "Abrir calculadora", href: "/es/herramientas/refinanciar-blend", variant: "primary" }],
    tags: ["refinance", "blend"],
  },
  {
    id: "alquilar-vd-comprar",
    title: "Alquilar vs Comprar",
    desc: "Comparación lado a lado con pago inicial, tasa y supuestos de crecimiento.",
    href: "/es/herramientas/alquilar-vd-comprar",
    category: "Planificación",
    type: "calculator",
    icon: <FaCalculator className="text-brand-gold text-2xl" aria-hidden />,
    ctas: [{ label: "Abrir calculadora", href: "/es/herramientas/alquilar-vd-comprar", variant: "primary" }],
    tags: ["alquilar", "comprar", "comparar"],
  },

  // ---- Presupuesto / Patrimonio ----
  {
    id: "calculadora-presupuesto",
    title: "Calculadora de Presupuesto",
    desc: "Crea un presupuesto claro, alineado con tus valores.",
    href: "/es/herramientas/calculadora-presupuesto",
    category: "Planificación",
    type: "calculator",
    icon: <FaCalculator className="text-brand-gold text-2xl" aria-hidden />,
    ctas: [{ label: "Abrir calculadora", href: "/es/herramientas/calculadora-presupuesto", variant: "primary" }],
    tags: ["presupuesto", "flujo de caja", "planificación"],
  },
  {
    id: "seguimiento-patrimonio-neto",
    title: "Patrimonio Neto y Deudas",
    desc: "Registra patrimonio y planifica pagos (Bola de Nieve o Avalancha).",
    href: "/es/herramientas/seguimiento-patrimonio-neto",
    category: "Planificación",
    type: "calculator",
    icon: <FaChartLine className="text-brand-green text-2xl" aria-hidden />,
    ctas: [
      { label: "Abrir Patrimonio", href: "/es/herramientas/seguimiento-patrimonio-neto", variant: "primary" },
      { label: "Abrir Pago de Deudas", href: "/es/herramientas/deuda-bola-nieve", variant: "ghost" },
    ],
    tags: ["patrimonio", "deuda", "plan"],
  },
  {
    id: "deuda-bola-nieve",
    title: "Pago de Deudas (Bola de Nieve / Avalancha)",
    desc: "Prioriza deudas y proyecta fechas de término y momentum.",
    href: "/es/herramientas/deuda-bola-nieve",
    category: "Planificación",
    type: "calculator",
    icon: <FaChartLine className="text-brand-blue text-2xl" aria-hidden />,
    ctas: [{ label: "Abrir calculadora", href: "/es/herramientas/deuda-bola-nieve", variant: "primary" }],
    tags: ["deuda", "bola de nieve", "avalancha"],
  },

  // ---- Inversionistas ----
  {
    id: "flujo-de-caja-de-alquileres",
    title: "Flujo de Caja de Alquileres",
    desc: "Proyecta ingresos/gastos (vacancia, capex, gestión) para decisiones de *hold*.",
    href: "/es/herramientas/flujo-de-caja-de-alquileres",
    category: "Inversionistas",
    type: "calculator",
    icon: <FaBuilding className="text-brand-blue text-2xl" aria-hidden />,
    ctas: [{ label: "Abrir calculadora", href: "/es/herramientas/flujo-de-caja-de-alquileres", variant: "primary" }],
    tags: ["renta", "noi", "inversionista"],
  },
  {
    id: "calculadora-dscr",
    title: "DSCR (Vista Prestamista)",
    desc: "Cobertura de servicio de deuda para 2–10 unidades y *small rental*.",
    href: "/es/herramientas/calculadora-dscr",
    category: "Inversionistas",
    type: "calculator",
    icon: <FaBalanceScale className="text-brand-green text-2xl" aria-hidden />,
    ctas: [{ label: "Abrir calculadora", href: "/es/herramientas/calculadora-dscr", variant: "primary" }],
    tags: ["dscr", "underwriting", "inversionista"],
  },
  {
    id: "tasa-cap",
    title: "Tasa de Capitalización (Cap Rate)",
    desc: "Evalúa oportunidades con cap rate y *cash-on-cash*.",
    href: "/es/herramientas/tasa-cap",
    category: "Inversionistas",
    type: "calculator",
    icon: <FaChartLine className="text-brand-blue text-2xl" aria-hidden />,
    ctas: [{ label: "Abrir calculadora", href: "/es/herramientas/tasa-cap", variant: "primary" }],
    tags: ["cap rate", "valoración"],
  },

  // ---- Plantillas / Hojas ----
  {
    id: "presupuesto-flujo",
    title: "Presupuesto y Flujo de Caja",
    desc: "Registra ingresos y gastos; ve tu ahorro y tasa de ahorro. Exporta o imprime.",
    href: "/es/herramientas/presupuesto-flujo",
    category: "Plantillas",
    type: "worksheet",
    icon: <FaClipboardList className="text-brand-green text-2xl" aria-hidden />,
    ctas: [{ label: "Abrir hoja", href: "/es/herramientas/presupuesto-flujo", variant: "primary" }],
    extra: (
      <div className="flex flex-wrap gap-2 mt-3">
        <a href="/tools/Budget_Cashflow_Pro.xlsx" download className={ButtonGhost} aria-label="Descargar Flujo de Caja XLSX">
          <FaFileExcel aria-hidden /> XLSX
        </a>
        <a href="/tools/Budget_Cashflow_Pro.csv" download className={ButtonGhostGold} aria-label="Descargar Flujo de Caja CSV">
          <FaFileCsv aria-hidden /> CSV
        </a>
      </div>
    ),
    tags: ["hoja", "csv", "xlsx"],
  },
  {
    id: "preparacion-hipoteca",
    title: "Preparación Hipoteca",
    desc: "Checklist de preaprobación: crédito, documentos y pago inicial.",
    href: "/es/herramientas/preparacion-hipoteca",
    category: "Plantillas",
    type: "worksheet",
    icon: <FaClipboardList className="text-brand-green text-2xl" aria-hidden />,
    ctas: [{ label: "Abrir checklist", href: "/es/herramientas/preparacion-hipoteca", variant: "primary" }],
    extra: (
      <div className="flex flex-wrap gap-2 mt-3">
        <a href="/tools/Mortgage_Readiness_Pro.xlsx" download className={ButtonGhost} aria-label="Descargar Preparación Hipoteca XLSX">
          <FaFileExcel aria-hidden /> XLSX
        </a>
        <a href="/tools/Mortgage_Readiness_Pro.csv" download className={ButtonGhostGold} aria-label="Descargar Preparación Hipoteca CSV">
          <FaFileCsv aria-hidden /> CSV
        </a>
      </div>
    ),
    tags: ["checklist", "preaprobación"],
  },
  {
    id: "preparacion-impuestos",
    title: "Temporada de Impuestos",
    desc: "Lista completa y tranquila para que declarar sea simple—no caótico.",
    href: "/es/herramientas/preparacion-impuestos",
    category: "Plantillas",
    type: "worksheet",
    icon: <FaClipboardList className="text-brand-green text-2xl" aria-hidden />,
    ctas: [{ label: "Abrir checklist", href: "/es/herramientas/preparacion-impuestos", variant: "primary" }],
    extra: (
      <div className="flex flex-wrap gap-2 mt-3">
        <a href="/tools/Tax_Prep_Pro.xlsx" download className={ButtonGhost} aria-label="Descargar Kit Impuestos XLSX">
          <FaFileExcel aria-hidden /> XLSX
        </a>
        <a href="/tools/Tax_Prep_Pro.csv" download className={ButtonGhostGold} aria-label="Descargar Kit Impuestos CSV">
          <FaFileCsv aria-hidden /> CSV
        </a>
      </div>
    ),
    tags: ["checklist", "impuestos"],
  },
  // Nuevos checklists
  {
    id: "lista-recien-llegados",
    title: "Kit para Recién Llegados",
    desc: "Banca, crédito, CRA, cobertura de salud y primeros pasos de hipoteca para recién llegados.",
    href: "/es/herramientas/lista-recien-llegados",
    category: "Plantillas",
    type: "worksheet",
    icon: <FaClipboardList className="text-brand-green text-2xl" aria-hidden />,
    ctas: [{ label: "Abrir checklist", href: "/es/herramientas/lista-recien-llegados", variant: "primary" }],
    tags: ["recién llegado", "checklist"],
  },
  {
    id: "lista-autonomos",
    title: "Toolkit Hipoteca para Autónomos",
    desc: "Documentos y *add-backs* que esperan los prestamistas: NOAs, estados, finanzas del negocio y más.",
    href: "/es/herramientas/lista-autonomos",
    category: "Plantillas",
    type: "worksheet",
    icon: <FaClipboardList className="text-brand-green text-2xl" aria-hidden />,
    ctas: [{ label: "Abrir checklist", href: "/es/herramientas/lista-autonomos", variant: "primary" }],
    tags: ["autónomos", "checklist"],
  },
  {
    id: "preparacion-multiplex",
    title: "Preparación Multiplex (4–10 Unidades)",
    desc: "Rent roll, estado operativo, impuestos/servicios, seguro y *underwriting* básico.",
    href: "/es/herramientas/preparacion-multiplex",
    category: "Plantillas",
    type: "worksheet",
    icon: <FaClipboardList className="text-brand-green text-2xl" aria-hidden />,
    ctas: [{ label: "Abrir checklist", href: "/es/herramientas/preparacion-multiplex", variant: "primary" }],
    tags: ["multiplex", "checklist"],
  },

  // ---- Utilidades ----
  {
    id: "asistente",
    title: "Asistente IA (Beta)",
    desc: "Haz preguntas sobre servicios, herramientas o documentos; obtén pasos guiados.",
    href: "/es/herramientas/asistente",
    category: "Utilidades",
    type: "utility",
    icon: <FaRobot className="text-brand-blue text-2xl" aria-hidden />,
    ctas: [{ label: "Abrir herramienta", href: "/es/herramientas/asistente", variant: "primary" }],
    tags: ["ia", "asistente", "chat"],
  },
];

/* =============================== Filtros =============================== */
const TYPES: { key: "all" | Tipo; label: string }[] = [
  { key: "all", label: "Todos los tipos" },
  { key: "calculator", label: "Calculadoras" },
  { key: "worksheet", label: "Hojas / Checklists" },
  { key: "utility", label: "Utilidades" },
];

const CATS: Categoria[] = ["Hipoteca", "Inversionistas", "Plantillas", "Utilidades", "Planificación"];

function matchesQuery(t: ToolItem, q: string) {
  if (!q) return true;
  const hay = (t.title + " " + t.desc + " " + (t.tags || []).join(" ")).toLowerCase();
  return hay.includes(q.toLowerCase());
}

/* ======================== Subnavegación pegajosa ======================== */
const SECTIONS = [
  { id: "resumen", label: "Resumen" },
  { id: "hipoteca", label: "Hipoteca" },
  { id: "planificacion", label: "Planificación" },
  { id: "inversionistas", label: "Inversionistas" },
  { id: "plantillas", label: "Plantillas" },
  { id: "utilidades", label: "Utilidades" },
  { id: "faq", label: "Cómo usar & Preguntas" },
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

/* ============================== Tarjetas / Grilla ============================== */
function ToolCard({ t }: { t: ToolItem }) {
  return (
    <Reveal>
      <article className={CARD} aria-labelledby={`${t.id}-title`}>
        <div className="mb-3 flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-brand-green/10 border flex items-center justify-center">
            {t.icon}
          </div>
          <h3 id={`${t.id}-title`} className="font-serif text-2xl text-brand-green font-bold m-0">
            {t.title}
          </h3>
        </div>
        <p className="text-brand-blue/90">{t.desc}</p>

        {t.tags && t.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {t.tags.map((tag) => (
              <TagBadge key={tag}>{tag}</TagBadge>
            ))}
          </div>
        )}

        <div className="mt-5 flex flex-wrap gap-2">
          {(t.ctas || []).map((c, i) => {
            const cls =
              c.variant === "ghost"
                ? ButtonGhost
                : c.variant === "ghostGold"
                ? ButtonGhostGold
                : ButtonPrimary;
            return (
              <Link key={i} href={c.href} className={cls} aria-label={c.label}>
                {c.label}
              </Link>
            );
          })}
        </div>

        {t.extra}
      </article>
    </Reveal>
  );
}

function ToolsGrid({ items }: { items: ToolItem[] }) {
  if (!items.length) {
    return <p className="text-brand-blue/70">No hay herramientas que coincidan con los filtros.</p>;
  }
  return (
    <StaggerGroup className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((t) => (
        <ToolCard key={t.id} t={t} />
      ))}
    </StaggerGroup>
  );
}

/* ================================= Página ================================= */
export default function ToolsPage() {
  const [query, setQuery] = useState("");
  const [activeCats, setActiveCats] = useState<Categoria[]>([]);
  const [typeKey, setTypeKey] = useState<"all" | Tipo>("all");
  const [listMode, setListMode] = useState<"grid" | "list">("grid");

  const filtered = useMemo(() => {
    return TOOLS
      .filter((t) => matchesQuery(t, query))
      .filter((t) => (typeKey === "all" ? true : t.type === typeKey))
      .filter((t) => (activeCats.length ? activeCats.includes(t.category) : true));
  }, [query, activeCats, typeKey]);

  const grouped = useMemo(() => {
    const by = (cat: Categoria) => filtered.filter((t) => t.category === cat);
    return {
      hipoteca: by("Hipoteca"),
      planificacion: by("Planificación"),
      inversionistas: by("Inversionistas"),
      plantillas: by("Plantillas"),
      utilidades: by("Utilidades"),
    };
  }, [filtered]);

  const toggleCat = (c: Categoria) =>
    setActiveCats((prev) => (prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]));

  const handlePrint = () => window.print();

  const { fade } = useMotionPresets();

  return (
    <main id="main" className="bg-white min-h-screen">
      {/* Encabezado de marca */}
      <section className="bg-brand-green/5 border-b border-brand-gold/30">
        <div className="max-w-content mx-auto px-4 py-10">
          <nav className="mb-3 text-sm text-brand-blue/80" aria-label="Miga de pan">
            <a href="/es" className="hover:underline">Inicio</a>
            <span className="mx-2">/</span>
            <span className="text-brand-green">Herramientas</span>
          </nav>

          <Reveal variants={fade}>
            <h1 className="font-serif text-3xl md:text-4xl font-semibold tracking-tight text-brand-green">
              Herramientas para tu bienestar financiero
            </h1>
          </Reveal>
          <Reveal variants={fade}>
            <p className="mt-2 max-w-3xl text-brand-blue/90">
              Calculadoras y plantillas prácticas y bilingües—privadas, fáciles de usar y diseñadas para ayudarte a decidir alineado con tus valores (sin registro).
            </p>
          </Reveal>

          <div className="mt-5 flex flex-wrap gap-2">
            <Link
              href="/es/contacto?intent=consult"
              className={ButtonPrimary}
              aria-label="Reservar una consulta privada"
            >
              Reservar consulta privada
            </Link>
            <button
              onClick={() => setListMode((m) => (m === "grid" ? "list" : "grid"))}
              className="px-4 py-2 border-2 border-brand-green text-brand-green rounded-full hover:bg-brand-green hover:text-white transition inline-flex items-center gap-2"
              title={listMode === "grid" ? "Cambiar a vista de lista" : "Cambiar a vista de cuadrícula"}
              type="button"
            >
              {listMode === "grid" ? <FaListUl aria-hidden /> : <FaThLarge aria-hidden />} {listMode === "grid" ? "Lista" : "Cuadrícula"}
            </button>
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-brand-blue text-white rounded-full inline-flex items-center gap-2 hover:bg-brand-gold hover:text-brand-green transition"
              title="Abrir diálogo de impresión (elige 'Guardar como PDF')"
              type="button"
            >
              <FaPrint aria-hidden /> Imprimir / Guardar PDF
            </button>
          </div>

          {/* Chips de confianza */}
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-brand-gold/40 text-brand-green">
              <FaShieldAlt className="text-brand-gold" aria-hidden /> Privadas
            </span>
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-brand-gold/40 text-brand-green">
              <FaCheckCircle className="text-brand-gold" aria-hidden /> Gratuitas
            </span>
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-brand-gold/40 text-brand-green">
              <FaGlobeAmericas className="text-brand-gold" aria-hidden /> Bilingües
            </span>
          </div>
        </div>
      </section>

      {/* Subnavegación pegajosa */}
      <SectionNav />

      {/* Resumen: Búsqueda + Filtros */}
      <Panel>
        <SectionTitle
          id="resumen"
          title="Encuentra la herramienta adecuada"
          subtitle="Busca por palabra clave, filtra por tipo o acota por categoría."
        />
        <div className="grid gap-4">
          {/* Búsqueda */}
          <div className="flex flex-col sm:flex-row items-stretch gap-3">
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder='Buscar herramientas (p. ej., “hipoteca”, “DSCR”, “impuestos”)'
              className="w-full rounded-full border border-brand-gold/60 bg-white px-5 py-3 focus:outline-none focus:ring-2 focus:ring-brand-gold"
              aria-label="Buscar herramientas"
            />
            <div className="text-sm text-brand-blue/70 self-center">
              Mostrando <b>{filtered.length}</b> de {TOOLS.length}
            </div>
          </div>

          {/* Filtro por tipo */}
          <div className="mt-2 flex flex-wrap gap-2">
            {TYPES.map((t) => (
              <button
                key={t.key}
                type="button"
                onClick={() => setTypeKey(t.key)}
                className={[
                  "px-4 py-2 rounded-full border-2 transition",
                  typeKey === t.key
                    ? "border-brand-blue bg-brand-blue text-white"
                    : "border-brand-green text-brand-green hover:bg-brand-green hover:text-white",
                ].join(" ")}
                aria-pressed={typeKey === t.key}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Chips por categoría */}
          <div className="mt-1 flex flex-wrap gap-2">
            {CATS.map((c) => {
              const active = (activeCats || []).includes(c);
              return (
                <button
                  key={c}
                  type="button"
                  onClick={() => toggleCat(c)}
                  className={[
                    "px-3 py-2 rounded-full border-2 text-sm transition",
                    active
                      ? "border-brand-gold bg-brand-gold text-white"
                      : "border-brand-gold text-brand-green hover:bg-brand-gold hover:text-white",
                  ].join(" ")}
                  aria-pressed={active}
                  title={`Filtrar por ${c}`}
                >
                  {c}
                </button>
              );
            })}
            {activeCats.length > 0 && (
              <button
                type="button"
                onClick={() => setActiveCats([])}
                className="px-3 py-2 rounded-full border-2 border-brand-gold text-brand-green hover:bg-brand-gold hover:text-white transition text-sm"
              >
                Limpiar categorías
              </button>
            )}
          </div>
        </div>
      </Panel>

      {/* Hipoteca */}
      <Panel className="mt-8">
        <SectionTitle id="hipoteca" title="Hipoteca" subtitle="Costos de cierre, pago inicial, seguro y calificación" />
        {listMode === "grid" ? (
          <ToolsGrid items={grouped.hipoteca} />
        ) : (
          <ListBlock items={grouped.hipoteca} />
        )}
      </Panel>

      {/* Planificación */}
      <Panel className="mt-8">
        <SectionTitle id="planificacion" title="Planificación" subtitle="Pagos, amortización, penalidades, *refi* y alquilar vs comprar" />
        {listMode === "grid" ? (
          <ToolsGrid items={grouped.planificacion} />
        ) : (
          <ListBlock items={grouped.planificacion} />
        )}
      </Panel>

      {/* Inversionistas */}
      <Panel className="mt-8">
        <SectionTitle id="inversionistas" title="Inversionistas" subtitle="Flujo de caja, DSCR y valoración" />
        {listMode === "grid" ? (
          <ToolsGrid items={grouped.inversionistas} />
        ) : (
          <ListBlock items={grouped.inversionistas} />
        )}
      </Panel>

      {/* Plantillas */}
      <Panel className="mt-8">
        <SectionTitle id="plantillas" title="Plantillas" subtitle="Presupuestos, preparación de hipoteca e impuestos y multiplex" />
        {listMode === "grid" ? (
          <ToolsGrid items={grouped.plantillas} />
        ) : (
          <ListBlock items={grouped.plantillas} />
        )}
      </Panel>

      {/* Utilidades */}
      <Panel className="mt-8">
        <SectionTitle id="utilidades" title="Utilidades" subtitle="Asistente y herramientas de apoyo" />
        {listMode === "grid" ? (
          <ToolsGrid items={grouped.utilidades} />
        ) : (
          <ListBlock items={grouped.utilidades} />
        )}
      </Panel>

      {/* Cómo usar & Preguntas */}
      <Panel className="mt-8">
        <SectionTitle id="faq" title="Cómo usamos estas herramientas" subtitle="Privadas, educativas y bilingües" />
        <div className="grid md:grid-cols-2 gap-6">
          <div className={CARD}>
            <h3 className="font-serif text-xl text-brand-green font-bold">Qué esperar</h3>
            <p className="mt-2 text-brand-blue/90">
              Estas herramientas corren en tu navegador, no requieren cuenta. Los archivos exportados se guardan localmente por ti.
            </p>
            <p className="mt-2 text-brand-blue/90">
              Podemos adaptar una herramienta a tu situación o guiarte a la adecuada durante una llamada de descubrimiento.
            </p>
          </div>
          <div className={CARD}>
            <h3 className="font-serif text-xl text-brand-green font-bold">Avisos</h3>
            <p className="mt-2 text-brand-blue/90">
              Herramientas educativas—<em>no</em> constituyen asesoría de inversión, legal ni fiscal. Reglas hipotecarias alineadas con Canadá 2025 (stress test, CMHC y LTT ON/Toronto).
            </p>
            <p className="mt-2 text-brand-blue/90">Soporte bilingüe (ES/EN). Podemos coordinar con tu CPA y tu abogada/o.</p>
          </div>
        </div>

        <div className="mt-6 text-center">
          <Link href="/es/contacto?intent=consult" className="inline-flex" aria-label="Agendar llamada de descubrimiento">
            <span className="px-8 py-3 border-2 border-brand-gold text-brand-green font-serif font-bold rounded-full hover:bg-brand-gold hover:text-white transition focus:outline-none focus:ring-2 focus:ring-brand-gold">
              Agendar llamada de descubrimiento
            </span>
          </Link>
          <div className="mt-4 flex items-center justify-center gap-3">
            <Link href="/es/cuenta" className="inline-flex" aria-label="Abrir portal de clientes">
              <span className={ButtonGhost}>
                <FaSignInAlt aria-hidden /> Portal de clientes
              </span>
            </Link>
            <Link href="/es/contacto?intent=pregunta" className="text-sm text-brand-blue underline hover:text-brand-green">
              O haz una pregunta rápida →
            </Link>
          </div>
        </div>
      </Panel>

      {/* Estilos de impresión */}
      <style jsx global>{`
        @media print {
          .print\\:hidden { display: none !important; }
          main { background: white !important; }
          section { break-inside: avoid; page-break-inside: avoid; }
          .${CARD.split(" ").join(".")} { box-shadow: none !important; }
        }
      `}</style>
    </main>
  );
}

/* ============================ Renderizador en lista ============================ */
function ListBlock({ items }: { items: ToolItem[] }) {
  if (!items.length) return <p className="text-brand-blue/70">No hay herramientas que coincidan con los filtros.</p>;
  return (
    <div className="rounded-[28px] border border-brand-gold bg-white shadow-sm p-4 sm:p-6">
      <ul className="divide-y">
        {items.map((t) => (
          <li key={t.id} className="py-4 flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-brand-green/10 border flex items-center justify-center shrink-0">
              {t.icon}
            </div>
            <div className="grow">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h4 className="font-serif text-lg text-brand-green font-bold m-0">{t.title}</h4>
                <span className="px-3 py-1 rounded-full text-xs border border-brand-gold text-brand-green">
                  {t.category} • {t.type}
                </span>
              </div>
              <p className="text-brand-blue/90 mt-1">{t.desc}</p>
              <div className="flex flex-wrap gap-2 mt-3">
                {(t.ctas || []).map((c, i) => {
                  const cls =
                    c.variant === "ghost"
                      ? ButtonGhost
                      : c.variant === "ghostGold"
                      ? ButtonGhostGold
                      : ButtonPrimary;
                  return (
                    <Link key={i} href={c.href} className={cls} aria-label={c.label}>
                      {c.label}
                    </Link>
                  );
                })}
                {t.extra}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
