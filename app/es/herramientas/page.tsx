// app/es/herramientas/page.tsx
"use client";

import Link from "next/link";
import { useMemo, useState, type ReactNode } from "react";

// ✅ Primitivas de animación seguras para hidratar
import { Reveal, useMotionPresets } from "@/components/motion-safe";
import {
  CardGrid,
  ComparisonTable,
  ctaButtonClass,
  HubPanel as Panel,
  HubSectionTitle as SectionTitle,
  HubTagBadge as TagBadge,
  InfoCard,
  PageHero,
  StickySectionNav,
  HUB_CARD_CLASS,
} from "@/components/sections/hub";
import StartHereDecisionWidget from "@/components/StartHereDecisionWidget";
import StickyNextStepBar from "@/components/StickyNextStepBar";
import TrustChips from "@/components/TrustChips";

import {
  FaCalculator, FaHome, FaShieldAlt, FaGlobeAmericas, FaCheckCircle, FaClipboardList,
  FaFileExcel, FaFileCsv, FaPercent, FaBuilding, FaChartLine, FaBalanceScale,
  FaMoneyBillWave, FaPiggyBank, FaRobot, FaSignInAlt, FaPrint, FaListUl, FaThLarge
} from "react-icons/fa";

/* ============================== UI compartida ============================== */
const CARD = HUB_CARD_CLASS;

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
  ctaButtonClass("primary");
const ButtonGhost =
  ctaButtonClass("secondary");
const ButtonGhostGold =
  ctaButtonClass("ghost");

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
  { id: "start-here", label: "Empieza aquí" },
  { id: "compare", label: "Guía de herramientas" },
  { id: "resumen", label: "Resumen" },
  { id: "hipoteca", label: "Hipoteca" },
  { id: "planificacion", label: "Planificación" },
  { id: "inversionistas", label: "Inversionistas" },
  { id: "plantillas", label: "Plantillas" },
  { id: "utilidades", label: "Utilidades" },
  { id: "faq", label: "Cómo usar & Preguntas" },
] as const;

/* ============================== Tarjetas / Grilla ============================== */
function ToolCard({ t }: { t: ToolItem }) {
  const { fadeUp } = useMotionPresets();
  return (
    <Reveal variants={fadeUp}>
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
    <CardGrid>
      {items.map((t) => (
        <ToolCard key={t.id} t={t} />
      ))}
    </CardGrid>
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

  const startHereTools = useMemo(() => {
    const ids = [
      "asequibilidad-hipotecaria",
      "costos-cierre",
      "calculadora-presupuesto",
      "seguimiento-patrimonio-neto",
      "preparacion-impuestos",
      "preparacion-hipoteca",
    ];
    return ids
      .map((id) => TOOLS.find((tool) => tool.id === id))
      .filter((tool): tool is ToolItem => Boolean(tool));
  }, []);

  return (
    <main id="main" className="bg-brand-beige min-h-screen pb-24">
      <PageHero
        homeHref="/es"
        homeLabel="Inicio"
        currentLabel="Herramientas"
        title="Herramientas para tu bienestar financiero"
        subtitle="Calculadoras y plantillas prácticas y bilingües para decidir con claridad y avanzar con confianza."
        primaryCta={{
          label: "Reservar llamada de descubrimiento gratis",
          href: "/es/contacto?intent=consult&package=Llamada%20de%20Descubrimiento%20Gratis%20(15%20min)",
        }}
        secondaryCta={{
          label: "Explorar servicios",
          href: "/es/servicios",
          variant: "secondary",
        }}
      >
        <TrustChips lang="es" />
        <div className="mt-5 flex flex-wrap gap-2">
          <button
            onClick={() => setListMode((m) => (m === "grid" ? "list" : "grid"))}
            className="px-4 py-2 border-2 border-brand-green text-brand-green rounded-full hover:bg-brand-green hover:text-white transition inline-flex items-center gap-2"
            title={listMode === "grid" ? "Cambiar a vista de lista" : "Cambiar a vista de cuadrícula"}
            type="button"
          >
            {listMode === "grid" ? <FaListUl aria-hidden /> : <FaThLarge aria-hidden />}{" "}
            {listMode === "grid" ? "Lista" : "Cuadrícula"}
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

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-brand-gold/40 text-brand-green">
            <FaShieldAlt className="text-brand-gold" aria-hidden /> Privadas
          </span>
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-brand-gold/40 text-brand-green">
            <FaCheckCircle className="text-brand-gold" aria-hidden /> Gratuitas
          </span>
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-brand-gold/40 text-brand-green">
            <FaGlobeAmericas className="text-brand-gold" aria-hidden /> Bilingues
          </span>
        </div>
      </PageHero>

      <StickySectionNav sections={SECTIONS} ariaLabel="En esta pagina" defaultActive="start-here" />

      <div className="bg-brand-beige border-t border-brand-gold/20">
        <Panel>
          <StartHereDecisionWidget lang="es" />
        </Panel>
      </div>

      <div className="bg-brand-gold/5 border-t border-brand-gold/20">
        <Panel>
          <SectionTitle
            id="start-here"
            title="Empieza aqui: Herramientas clave"
            subtitle="El camino mas rapido para claridad en hipoteca, flujo, preparacion e impuestos."
            tint="gold"
          />
          <ToolsGrid items={startHereTools} />
        </Panel>
      </div>

      <div className="bg-brand-green/5 border-t border-brand-gold/20">
        <Panel>
          <SectionTitle
            id="compare"
            title="Guia por tipo de herramienta"
            subtitle="Usa esta tabla para elegir rapido el formato que mejor te sirve."
            tint="green"
          />
          <ComparisonTable
            columns={["Ideal para", "Resultado", "Tiempo estimado"]}
            rows={[
              {
                label: "Calculadoras",
                values: ["Escenarios y decisiones", "Numeros y supuestos en vivo", "2-8 minutos"],
              },
              {
                label: "Plantillas",
                values: ["Organizar documentos y rutinas", "Archivos descargables y checklist", "10-25 minutos"],
              },
              {
                label: "Utilidades",
                values: ["Acompanamiento guiado", "Recomendaciones y siguientes pasos", "3-10 minutos"],
              },
            ]}
            footnote="Todas las herramientas son educativas y pueden complementarse con una sesion estrategica."
          />
        </Panel>
      </div>

      <div className="bg-brand-gold/5 border-t border-brand-gold/20">
        <Panel>
        <SectionTitle
          id="resumen"
          title="Encuentra la herramienta adecuada"
          subtitle="Busca por palabra clave, filtra por tipo o acota por categoría."
          tint="gold"
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
                      ? "border-brand-gold bg-brand-gold text-brand-green"
                      : "border-brand-gold text-brand-green hover:bg-brand-gold hover:text-brand-green",
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
                className="px-3 py-2 rounded-full border-2 border-brand-gold text-brand-green hover:bg-brand-gold hover:text-brand-green transition text-sm"
              >
                Limpiar categorías
              </button>
            )}
          </div>
        </div>
        </Panel>
      </div>

      {/* Hipoteca */}
      <div className="bg-brand-green/5 border-t border-brand-gold/20">
        <Panel>
        <SectionTitle id="hipoteca" title="Hipoteca" subtitle="Costos de cierre, pago inicial, seguro y calificación" tint="green" />
        {listMode === "grid" ? (
          <ToolsGrid items={grouped.hipoteca} />
        ) : (
          <ListBlock items={grouped.hipoteca} />
        )}
        </Panel>
      </div>

      {/* Planificación */}
      <div className="bg-brand-gold/5 border-t border-brand-gold/20">
        <Panel>
        <SectionTitle id="planificacion" title="Planificación" subtitle="Pagos, amortización, penalidades, *refi* y alquilar vs comprar" tint="gold" />
        {listMode === "grid" ? (
          <ToolsGrid items={grouped.planificacion} />
        ) : (
          <ListBlock items={grouped.planificacion} />
        )}
        </Panel>
      </div>

      {/* Inversionistas */}
      <div className="bg-brand-green/5 border-t border-brand-gold/20">
        <Panel>
        <SectionTitle id="inversionistas" title="Inversionistas" subtitle="Flujo de caja, DSCR y valoración" tint="green" />
        {listMode === "grid" ? (
          <ToolsGrid items={grouped.inversionistas} />
        ) : (
          <ListBlock items={grouped.inversionistas} />
        )}
        </Panel>
      </div>

      {/* Plantillas */}
      <div className="bg-brand-gold/5 border-t border-brand-gold/20">
        <Panel>
        <SectionTitle id="plantillas" title="Plantillas" subtitle="Presupuestos, preparación de hipoteca e impuestos y multiplex" tint="gold" />
        {listMode === "grid" ? (
          <ToolsGrid items={grouped.plantillas} />
        ) : (
          <ListBlock items={grouped.plantillas} />
        )}
        </Panel>
      </div>

      {/* Utilidades */}
      <div className="bg-brand-green/5 border-t border-brand-gold/20">
        <Panel>
        <SectionTitle id="utilidades" title="Utilidades" subtitle="Asistente y herramientas de apoyo" tint="green" />
        {listMode === "grid" ? (
          <ToolsGrid items={grouped.utilidades} />
        ) : (
          <ListBlock items={grouped.utilidades} />
        )}
        </Panel>
      </div>

      {/* Cómo usar & Preguntas */}
      <div className="bg-brand-gold/5 border-t border-brand-gold/20">
        <Panel>
        <SectionTitle id="faq" title="Cómo usamos estas herramientas" subtitle="Privadas, educativas y bilingües" tint="gold" />
        <div className="grid md:grid-cols-2 gap-6">
          <InfoCard
            title="Que esperar"
            description="Estas herramientas corren en tu navegador, no requieren cuenta. Los archivos exportados se guardan localmente por ti."
          >
            <p className="mt-2 text-brand-blue/90">
              Podemos adaptar una herramienta a tu situación o guiarte a la adecuada durante una llamada de descubrimiento.
            </p>
          </InfoCard>
          <InfoCard
            title="Avisos"
            description={
              <>
                Herramientas educativas-<em>no</em> constituyen asesoria de inversion, legal ni fiscal. Reglas hipotecarias alineadas con Canada 2025 (stress test, CMHC y LTT ON/Toronto).
              </>
            }
          >
            <p className="mt-2 text-brand-blue/90">
              Soporte bilingue (ES/EN). Podemos coordinar con tu CPA y tu abogada/o.
            </p>
          </InfoCard>
        </div>

        <div className="mt-6 text-center">
          <Link href="/es/contacto?intent=consult" className={ctaButtonClass("primary")} aria-label="Agendar llamada de descubrimiento">
            Agendar llamada de descubrimiento
          </Link>
          <div className="mt-4 flex items-center justify-center gap-3">
            <Link href="/es/biblioteca-clientes" className="inline-flex" aria-label="Abrir biblioteca de clientes">
              <span className={ButtonGhost}>
                <FaSignInAlt aria-hidden /> Biblioteca de clientes
              </span>
            </Link>
            <Link href="/es/contacto?intent=pregunta" className="text-sm text-brand-blue underline hover:text-brand-green">
              O haz una pregunta rápida →
            </Link>
          </div>
        </div>
        </Panel>
      </div>

      <StickyNextStepBar
        lang="es"
        checklistHref="/es/herramientas/lista-recien-llegados"
        checklistLabel="Abrir checklist de recien llegados"
      />

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
