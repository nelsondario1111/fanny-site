// app/es/servicios/page.tsx
"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Reveal,
  StaggerGroup,
  useMotionPresets,
} from "@/components/motion-safe";

/* ============================ Precios (CAD) ============================ */
const PRICING = {
  mortgagePreapproval: 0,
  refiRenewal: 295,
  firstHomePlan: 395,
  proTuneUp90: 1200,
  bizOwnerExecPlan: 2500,
  corpPayrollClinic: 395,
  newcomerFastTrack: 395,
  invest4to10: 695,
  annualReviewNonClient: 149,
  discovery: 0,
  blueprint90: 395,
  align3: 1200,
  transform6: 2750,
  elevatePremium: 4995,
  alumniRetainerMonthly: 149,
  taxSession: 395,
  taxAnnual: 1295,
  taxSmallBiz90d: 1995,
  ktCohort4w: 795,
  ktMonthly: 49,
  workshopPublicSeat: 149,
  workshopTeamVirtual: 2400,
  workshopTeamInPerson: 2800,
} as const;

function price(p: number | null) {
  if (p === null) return "Consultar";
  if (p === 0) return "Gratis";
  return `$${p}`;
}

/* ================== Componentes compartidos ================== */
function Panel({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={[
        "max-w-content mx-auto px-5 sm:px-8 py-10 sm:py-14 rounded-[28px] border border-brand-gold/40 shadow-lg backdrop-blur-[1px]",
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
  tint,
}: {
  title: string;
  subtitle?: React.ReactNode;
  id: string;
  tint: "green" | "gold";
}) {
  const { fade, fadeUp } = useMotionPresets();
  const accent = tint === "green" ? "bg-brand-green/60" : "bg-brand-gold/60";
  return (
    <div
      id={id}
      className="scroll-mt-[160px] sm:scroll-mt-[170px] md:scroll-mt-[180px] lg:scroll-mt-[190px]"
    >
      <div className="text-center mb-6">
        <Reveal variants={fadeUp}>
          <h2 className="font-serif font-extrabold text-3xl md:text-4xl text-brand-green tracking-tight">
            {title}
          </h2>
        </Reveal>
        <Reveal variants={fade}>
          <div className="flex justify-center my-4" aria-hidden="true">
            <div className={`w-16 h-[3px] rounded-full ${accent}`} />
          </div>
        </Reveal>
        {subtitle && (
          <Reveal variants={fadeUp}>
            <p className="text-brand-blue/90 text-lg md:text-xl max-w-3xl mx-auto">
              {subtitle}
            </p>
          </Reveal>
        )}
      </div>
    </div>
  );
}

function PriceBadge({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-sm px-3 py-1 rounded-full bg-brand-gold/15 text-brand-green border border-brand-gold/50">
      {children}
    </span>
  );
}

function TagBadge({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-xs px-2.5 py-1 rounded-full bg-white text-brand-green border border-brand-gold/40">
      {children}
    </span>
  );
}

const CARD =
  "rounded-3xl border border-brand-gold/40 bg-white/95 shadow-lg p-6 transition hover:-translate-y-[1px] hover:shadow-xl focus-within:ring-2 focus-within:ring-brand-gold backdrop-blur-[1px]";

type Intent = "consult" | "preapproval" | "package";

type Card = {
  id: string;
  section: string;
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
      <article className={`${CARD} group`} aria-labelledby={`${c.id}-title`}>
        <div className="flex items-center justify-between gap-3">
          <h3
            id={`${c.id}-title`}
            className="font-serif text-2xl text-brand-green font-bold m-0"
          >
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
          >
            Reservar consulta privada
          </Link>
        </div>
      </article>
    </Reveal>
  );
}

/* ====================== Navegación Sticky ====================== */
const SECTIONS = [
  { id: "signature", label: "Paquetes Principales" },
  { id: "coaching", label: "Coaching Privado" },
  { id: "mortgage", label: "Hipotecas y Propiedades" },
  { id: "business", label: "Negocios y Tributación" },
  { id: "workshops", label: "Talleres y Equipos" },
  { id: "holistic", label: "Conversaciones y Nuevos Residentes" },
  { id: "how", label: "Cómo Trabajamos" },
] as const;

function SectionNav() {
  const [active, setActive] = useState<string>("signature");
  const refs = useRef<Record<string, HTMLElement | null>>({});

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-25% 0px -65% 0px", threshold: [0.2, 0.5, 0.8] }
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
      <nav
        className="max-w-content mx-auto px-4 py-2 flex gap-2 overflow-x-auto text-sm"
        aria-label="Navegación de secciones"
      >
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
          >
            {s.label}
          </a>
        ))}
      </nav>
    </div>
  );
}

/* ============================= Tarjetas (Servicios) ============================= */
const CARDS: Card[] = [
  // ------------------ Paquetes Principales ------------------
  {
    id: "elevate",
    section: "signature",
    title: "Eleva (Paquete Premium de Transformación)",
    desc: "Liderazgo integral de tus finanzas: estrategia hipotecaria, ritmo tributario, alineación empresarial y calma con el dinero, todo bajo un mismo plan.",
    bullets: [
      "Plano financiero: flujo, hipoteca y tributos",
      "Más de 6 sesiones privadas con planes escritos",
      "Coordinación con contador y abogado",
      "Opcional: enfoque de Diseño Humano para decisiones",
    ],
    timeline: "~6 meses de acompañamiento",
    tags: ["Ejecutivos", "Familias", "Empresarios", "Premium"],
    price: price(PRICING.elevatePremium),
  },
  {
    id: "transform",
    section: "signature",
    title: "Transforma (Paquete de 6 Sesiones)",
    desc: "Profundidad sin saturación: implementamos un sistema funcional de flujo de efectivo, crédito y ahorros tributarios.",
    bullets: [
      "Plan financiero integral",
      "Documentos listos para el prestamista",
      "Acciones claras después de cada sesión",
      "Estrategia paso a paso",
    ],
    timeline: "~12 semanas",
    tags: ["Ejecutivos", "Empresarios", "Familias"],
    price: price(PRICING.transform6),
  },
  {
    id: "exec-teaming",
    section: "signature",
    title: "Gestión Ejecutiva de Riqueza (Profesionales / Fundadores)",
    desc: "Alinea pago personal, cuentas y registros respetados por prestamistas—en colaboración con tu contador y abogado.",
    bullets: [
      "Matriz de compensación (salario/dividendos)",
      "Cadencia de HST, reservas y buffers",
      "Coordinación CPA/abogado",
      "Ritmo y liderazgo consciente",
    ],
    timeline: "4–6 semanas (promedio)",
    scope:
      "Planificación y documentación; ejecución tributaria/legal con tus profesionales.",
    tags: ["Ejecutivos", "Empresarios", "Premium"],
    price: price(PRICING.bizOwnerExecPlan),
  },
  {
    id: "team-workshop",
    section: "signature",
    title: "Taller de Bienestar Financiero (Equipos Privados)",
    desc: "Sesión intensiva de 3 horas: flujo de efectivo, registros confiables y lenguaje común sobre dinero en el trabajo.",
    bullets: [
      "Encuesta previa + agenda personalizada",
      "Taller en vivo de 3 horas con preguntas",
      "Material en inglés y español",
      "Resumen posterior",
    ],
    timeline: "3 horas (virtual o presencial)",
    scope: "Hasta 20 participantes. HST aplica.",
    tags: ["Ejecutivos", "Empresarios", "Profesionales"],
    price: price(PRICING.workshopTeamVirtual),
  },

  // ------------------ Fundamentos y Coaching ------------------
  {
    id: "family-wealth-blueprint",
    section: "foundations",
    title: "Plano Familiar de Riqueza (con opciones FHSA)",
    desc: "Plan personalizado para familias profesionales: ahorro, coordinación FHSA y ruta de preaprobación hipotecaria.",
    bullets: [
      "Optimización FHSA individual o en pareja",
      "Mapa de ahorro y pago inicial",
      "Análisis de asequibilidad (stress-test)",
      "Opcional: guía desde Diseño Humano",
    ],
    timeline: "90 min + seguimiento curado",
    tags: ["Familias", "Premium"],
    price: price(PRICING.firstHomePlan),
  },
  {
    id: "pro-tune-up",
    section: "foundations",
    title: "Sintonización Financiera Profesional (90 Días)",
    desc: "Ritmo humano para estabilizar flujo, separar impuestos y limpiar crédito—diseñado para profesionales ocupados.",
    bullets: [
      "Ritmo semanal de dinero",
      "Ahorros trimestrales para impuestos",
      "Lista de automatización",
      "Opcional: personalización por Diseño Humano",
    ],
    timeline: "~90 días (3 sesiones + seguimientos)",
    scope: "Sólo asesoría (sin ventas de productos).",
    tags: ["Profesionales", "Ejecutivos", "Premium"],
    price: price(PRICING.proTuneUp90),
  },

  // ------------------ Hipotecas y Propiedades ------------------
  {
    id: "mortgage-concierge",
    section: "mortgage",
    title: "Conserjería Hipotecaria — Preparación y Pre-Aprobación",
    desc: "Prepara, compara y organiza tu expediente para que los prestamistas digan sí con confianza y calma.",
    bullets: [
      "Checklist preciso y carga segura",
      "Pruebas de escenario y selección de prestamistas",
      "Acompañamiento de tasación al cierre",
      "Opcional: mini-análisis de Diseño Humano",
    ],
    timeline: "1–2 semanas tras entrega de documentos",
    scope:
      "Residencial; O.A.C.; sin honorarios en casos prime—cualquier excepción se informa por adelantado.",
    tags: ["Profesionales", "Familias", "Nuevos residentes", "Premium"],
    price: price(PRICING.mortgagePreapproval),
  },
  {
    id: "refi-renewal",
    section: "mortgage",
    title: "Estrategia de Refinanciamiento o Renovación",
    desc: "Números claros y decisiones con sentido. Incluye resumen escrito.",
    bullets: [
      "Comparativa refi vs renovación",
      "Análisis de penalidad y tasa de equilibrio",
      "Guardas de prepago",
      "Entrega de resumen en 24 h",
    ],
    timeline: "60–90 min",
    tags: ["Profesionales", "Familias", "Ejecutivos"],
    price: price(PRICING.refiRenewal),
  },
  {
    id: "invest-4-10",
    section: "mortgage",
    title: "Inicio en Inversión: Propiedades de 4–10 Unidades (DSCR)",
    desc: "Números honestos y condiciones seguras para tu primer edificio pequeño, sin drama ni confusión.",
    bullets: [
      "Modelos GMR / OPEX / NOI / DSCR",
      "Guía de oferta y condiciones",
      "Plan de los primeros 90 días",
      "Preparación para conversación con prestamistas",
    ],
    timeline: "~2 horas + notas",
    scope: "Análisis educativo; no constituye asesoría de inversión.",
    tags: ["Inversionistas", "Empresarios", "Ejecutivos"],
    price: price(PRICING.invest4to10),
  },

  // ------------------ Negocios y Tributación ------------------
  {
    id: "pay-yourself-clinic",
    section: "business",
    title: "Clínica de Pago al Propietario / Incorporación",
    desc: "Una conversación clara para definir pago, nómina/dividendos y próximos pasos con tu contador.",
    bullets: [
      "Matriz de pago al propietario",
      "Fundamentos de nómina e impuestos",
      "Calendario de dividendos",
      "Resumen de decisiones en una página",
    ],
    timeline: "60–75 min",
    tags: ["Empresarios", "Profesionales"],
    price: price(PRICING.corpPayrollClinic),
  },
  {
    id: "tax-strategy",
    section: "legacy",
    title: "Estrategia Tributaria Personal / Familiar",
    desc: "Define un ritmo trimestral y reservas adecuadas: predecible, cumplido y amable con tu sistema nervioso.",
    bullets: [
      "Calendario trimestral",
      "Reservas adecuadas para impuestos",
      "Lista de recibos y registros",
      "Plantillas de calendario",
    ],
    timeline: "75–90 min",
    tags: ["Familias", "Profesionales"],
    price: price(PRICING.taxSession),
  },
  {
    id: "legacy-annual",
    section: "legacy",
    title: "Ritmo Tributario y de Legado (Anual)",
    desc: "Dos sesiones clave + seguimiento para evitar sorpresas de fin de año.",
    bullets: [
      "Ajuste a mitad de año",
      "Planificación previa al cierre fiscal",
      "Recordatorios opcionales de cadencia",
      "Coordinación con tu CPA",
    ],
    timeline: "Anual (2 sesiones + revisiones)",
    tags: ["Familias", "Ejecutivos", "Profesionales"],
    price: price(PRICING.taxAnnual),
  },
  {
    id: "smallbiz-setup",
    section: "legacy",
    title: "Configuración Financiera para Pymes (90 Días)",
    desc: "Organiza flujo, HST y pagos de propietario en un sistema escalable y reconocido por prestamistas.",
    bullets: [
      "Cadencia de HST",
      "Plan de pago al propietario",
      "Reservas y fondos de emergencia",
      "Higiene documental",
    ],
    timeline: "~90 días",
    tags: ["Empresarios", "Profesionales"],
    price: price(PRICING.taxSmallBiz90d),
  },

  // ------------------ Talleres y Equipos ------------------
  {
    id: "public-money-clarity",
    section: "workshops",
    title: "Taller Público: Claridad Financiera",
    desc: "Aprendizaje práctico y con propósito para estabilizar tu flujo, planificar ahorros y entender las pruebas hipotecarias de Canadá.",
    bullets: [
      "Sesión en vivo de 2.5–3 horas",
      "Plantillas de presupuesto y ahorro",
      "Guía sobre prueba de estrés hipotecaria (2025)",
      "Opcional: orientación desde Diseño Humano",
    ],
    timeline: "Sesión única (entre semana o sábado)",
    scope: "Abierto a profesionales y familias; cupos limitados.",
    tags: ["Profesionales", "Familias"],
    price: price(PRICING.workshopPublicSeat),
  },

  // ------------------ Conversaciones y Nuevos Residentes ------------------
  {
    id: "kt-4w",
    section: "family",
    title: "Conversaciones de Mesa — Programa de 4 Semanas",
    desc: "Grupo pequeño y cálido. Reúnete semanalmente, comparte números reales y practica rutinas de dinero amables.",
    bullets: [
      "Sesiones semanales en vivo",
      "Guías opcionales de Diseño Humano",
      "Plantillas y listas para conservar",
      "Acompañamiento y preguntas en grupo",
    ],
    timeline: "4 semanas",
    tags: ["Familias", "Premium"],
    price: price(PRICING.ktCohort4w),
  },
  {
    id: "kt-monthly",
    section: "family",
    title: "Conversaciones de Mesa — Círculo Mensual",
    desc: "Ritmo ligero para mantener el impulso: sesiones en vivo, nuevos recursos y espacio para preguntas.",
    bullets: [
      "Reunión mensual en vivo",
      "Entrega de recursos actualizados",
      "Espacio de miembros para dudas",
    ],
    timeline: "Mes a mes",
    tags: ["Familias"],
    price: price(PRICING.ktMonthly),
  },
  {
    id: "newcomer-30d",
    section: "newcomers",
    title: "Integración Financiera para Nuevos Residentes (30 Días)",
    desc: "Configuración amable de cuentas, crédito y reporte de renta—para que tu perfil sea claro ante los prestamistas.",
    bullets: [
      "Mapa de cuentas y plan telefónico",
      "Estrategia de tarjeta asegurada y límites",
      "Opciones de reporte de renta",
      "Rutina de higiene crediticia",
    ],
    timeline: "~30 días",
    tags: ["Nuevos residentes"],
    price: price(PRICING.newcomerFastTrack),
  },
  {
    id: "discovery",
    section: "advice",
    title: "Llamada de Descubrimiento Privada",
    desc: "Una conversación breve y humana. Comparte tu objetivo y recibe 2–3 próximos pasos claros.",
    bullets: ["2–3 pasos siguientes", "Sin documentos previos", "Bilingüe EN/ES"],
    timeline: "20–30 min",
    tags: ["Profesionales", "Familias", "Ejecutivos", "Nuevos residentes"],
    price: price(PRICING.discovery),
  },
  {
    id: "blueprint",
    section: "advice",
    title: "Sesión Blueprint de 90 Minutos",
    desc: "Atiende una prioridad con cuidado: asequibilidad, ritmo tributario, limpieza de crédito o estrategia de renovación.",
    bullets: [
      "Enfoque específico",
      "Números personalizados",
      "Acciones escritas en 24 h",
      "Mini perfil de Diseño Humano (opcional)",
    ],
    timeline: "90 min",
    tags: ["Profesionales", "Empresarios", "Familias"],
    price: price(PRICING.blueprint90),
  },
  {
    id: "align-3",
    section: "advice",
    title: "Alinea (Paquete de 3 Sesiones)",
    desc: "Instala rutinas suaves y constancia—sin saturarte.",
    bullets: [
      "Ritmo financiero y automatización",
      "Ahorros tributarios sostenibles",
      "Acompañamiento ligero",
    ],
    timeline: "6–8 semanas",
    tags: ["Profesionales", "Nuevos residentes"],
    price: price(PRICING.align3),
  },
];

/* ============================= Página ============================= */
export default function ServiciosPage() {
  const { fade } = useMotionPresets();

  const sectionsWithCards = useMemo(() => {
    const by = (section: string) => CARDS.filter((c) => c.section === section);
    return {
      signature: by("signature"),
      coaching: [...by("foundations"), ...by("advice")],
      mortgage: by("mortgage"),
      business: [...by("business"), ...by("legacy")],
      workshops: by("workshops"),
      holistic: [...by("family"), ...by("newcomers")],
    };
  }, []);

  return (
    <main id="main" className="bg-white min-h-screen">
      {/* ======= Encabezado ======= */}
      <section className="bg-brand-green/5 border-b border-brand-gold/30">
        <div className="max-w-content mx-auto px-4 py-10">
          <nav className="mb-3 text-sm text-brand-blue/80" aria-label="Ruta">
            <Link href="/es" className="hover:underline">
              Inicio
            </Link>
            <span className="mx-2" aria-hidden="true">
              /
            </span>
            <span className="text-brand-green" aria-current="page">
              Servicios
            </span>
          </nav>

          <Reveal variants={fade}>
            <h1 className="font-serif text-3xl md:text-4xl font-semibold tracking-tight text-brand-green">
              Servicios profesionales, ofrecidos con cuidado
            </h1>
          </Reveal>

          <Reveal variants={fade}>
            <p className="mt-2 max-w-3xl text-brand-blue/90">
              Apoyo bilingüe para profesionales, familias y empresarios del GTA.
              Combinamos precisión con un ritmo humano, para que cada decisión
              sea clara y amable.
            </p>
          </Reveal>

          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              href="/es/contacto?intent=consult&package=Llamada%20de%20Descubrimiento"
              className="inline-flex px-5 py-2.5 bg-brand-green text-white rounded-full font-semibold hover:bg-brand-gold hover:text-brand-green border border-brand-green/20 transition"
            >
              Reservar consulta privada
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

      <SectionNav />

      {/* ======= Secciones (idénticas al inglés, alternando fondos) ======= */}
      <div className="bg-brand-green/5 border-t border-brand-gold/20">
        <Panel>
          <SectionTitle
            id="signature"
            title="Paquetes Principales"
            subtitle="Acompañamiento integral para transiciones financieras y empresariales"
            tint="green"
          />
          <Grid cards={sectionsWithCards.signature} />
        </Panel>
      </div>

      <div className="bg-brand-gold/5 border-t border-brand-gold/20">
        <Panel>
          <SectionTitle
            id="coaching"
            title="Coaching Privado y Fundamentos"
            subtitle="Claridad y enfoque mediante sesiones personalizadas 1:1"
            tint="gold"
          />
          <Grid cards={sectionsWithCards.coaching} />
        </Panel>
      </div>

      <div className="bg-brand-green/5 border-t border-brand-gold/20">
        <Panel>
          <SectionTitle
            id="mortgage"
            title="Hipotecas y Propiedades"
            subtitle="Confianza desde la preaprobación hasta el cierre"
            tint="green"
          />
          <Grid cards={sectionsWithCards.mortgage} />
        </Panel>
      </div>

      <div className="bg-brand-gold/5 border-t border-brand-gold/20">
        <Panel>
          <SectionTitle
            id="business"
            title="Negocios y Tributación"
            subtitle="Claridad ejecutiva y ritmos tributarios predecibles para dueños y profesionales"
            tint="gold"
          />
          <Grid cards={sectionsWithCards.business} />
        </Panel>
      </div>

      <div className="bg-brand-green/5 border-t border-brand-gold/20">
        <Panel>
          <SectionTitle
            id="workshops"
            title="Talleres y Equipos"
            subtitle="Aprendizaje práctico y alineado con valores, para individuos y organizaciones"
            tint="green"
          />
          <Grid cards={sectionsWithCards.workshops} />
        </Panel>
      </div>

      <div className="bg-brand-gold/5 border-t border-brand-gold/20">
        <Panel>
          <SectionTitle
            id="holistic"
            title="Conversaciones Holísticas y Nuevos Residentes"
            subtitle="Programas suaves y paso a paso para familias y recién llegados a Canadá"
            tint="gold"
          />
          <Grid cards={sectionsWithCards.holistic} />
        </Panel>
      </div>

      {/* ======= Cómo Trabajamos ======= */}
      <div className="bg-brand-green/5 border-t border-brand-gold/20">
        <Panel>
          <SectionTitle
            id="how"
            title="Cómo Trabajamos"
            subtitle="Proceso constante, transparente y humano"
            tint="green"
          />
          <div className="grid md:grid-cols-3 gap-6">
            <div className={CARD}>
              <h3 className="font-serif text-xl text-brand-green font-bold">
                1) Descubrimiento
              </h3>
              <p className="mt-2 text-brand-blue/90">
                Conversación inicial amable. Si encajamos, recibirás un mini
                plan y checklist preciso, sin carga innecesaria.
              </p>
            </div>
            <div className={CARD}>
              <h3 className="font-serif text-xl text-brand-green font-bold">
                2) Plan y Ejecución
              </h3>
              <p className="mt-2 text-brand-blue/90">
                Modelamos escenarios, preparamos documentos y coordinamos cada
                paso a un ritmo manejable. Siempre sabrás qué sigue y por qué.
              </p>
            </div>
            <div className={CARD}>
              <h3 className="font-serif text-xl text-brand-green font-bold">
                3) Revisión y Ajuste
              </h3>
              <p className="mt-2 text-brand-blue/90">
                Confirmamos resultados, registramos cambios y programamos tu
                próxima revisión. Calma y consistencia.
              </p>
            </div>
          </div>

          <div className="mt-6 text-sm text-brand-blue/80 space-y-2">
            <p>
              <strong>Notas:</strong> Todos los precios están en dólares CAD y
              pueden estar sujetos a HST. Los servicios hipotecarios son
              gratuitos para prestatarios calificados; la compensación proviene
              del prestamista al cierre. Cualquier excepción se informará
              previamente.
            </p>
            <p>
              Los servicios de coaching son independientes de cualquier
              compensación hipotecaria y no reemplazan asesoría legal, fiscal o
              contable. Coordinamos con tus profesionales según sea necesario.
              Soporte bilingüe (EN/ES).
            </p>
            <p>
              Los talleres virtuales están disponibles en todo Canadá. Los
              presenciales pueden incluir gastos de viaje. Los talleres públicos
              tienen cupos limitados para garantizar calidad en preguntas.
            </p>
            <p className="mb-0">
              ¿Prefieres inglés?{" "}
              <Link href="/en/services" className="underline">
                Ver servicios en inglés
              </Link>
              .
            </p>
          </div>
        </Panel>
      </div>
    </main>
  );
}

/* ============================ Grid ============================ */
function Grid({ cards }: { cards: Card[] }) {
  if (!cards.length)
    return <p className="text-brand-blue/70">No hay servicios disponibles.</p>;
  return (
    <StaggerGroup className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {cards.map((c) => (
        <PackageCard key={c.id} c={c} />
      ))}
    </StaggerGroup>
  );
}
