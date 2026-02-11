// app/es/servicios/page.tsx
"use client";

import Link from "next/link";
import { useMemo } from "react";
import {
  CardGrid,
  ComparisonTable,
  HubPanel as Panel,
  HubSectionTitle as SectionTitle,
  InfoCard,
  OfferCard,
  PageHero,
  StickySectionNav,
} from "@/components/sections/hub";

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
  const qs = new URLSearchParams();
  qs.set("intent", c.intent ?? "package");
  qs.set("package", c.title);
  const bookingCta =
    c.id === "discovery"
      ? "Reservar llamada de descubrimiento"
      : "Reservar sesión estratégica";

  const meta = [
    ...(c.timeline ? [{ label: "Duración", value: c.timeline }] : []),
    ...(c.scope ? [{ label: "Alcance", value: c.scope }] : []),
  ];

  return (
    <OfferCard
      id={c.id}
      title={c.title}
      description={c.desc}
      bullets={c.bullets.slice(0, 4)}
      price={c.price}
      tags={c.tags}
      meta={meta}
      cta={{
        label: bookingCta,
        href: `/es/contacto?${qs.toString()}`,
      }}
    />
  );
}

const SECTIONS = [
  { id: "start-here", label: "Empieza aquí" },
  { id: "strategic-maps", label: "Mapas Financieros Estratégicos" },
  { id: "support", label: "Apoyo Complementario" },
  { id: "mortgage", label: "Estrategia Hipotecaria" },
  { id: "business", label: "Estrategia de Negocios e Impuestos" },
  { id: "how", label: "Cómo Trabajamos" },
] as const;

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
  const sectionsWithCards = useMemo(() => {
    const byId = (id: string) => CARDS.find((c) => c.id === id);
    const by = (section: string) => CARDS.filter((c) => c.section === section);
    const byIds = (ids: string[]) =>
      ids.map(byId).filter((c): c is Card => Boolean(c));
    return {
      startHere: byIds(["discovery", "blueprint"]),
      strategicMaps: by("signature"),
      supplementarySupport: [
        ...by("foundations"),
        ...by("advice").filter((c) => !["discovery", "blueprint"].includes(c.id)),
        ...by("workshops"),
        ...by("family"),
        ...by("newcomers"),
      ],
      mortgage: by("mortgage"),
      business: [...by("business"), ...by("legacy")],
    };
  }, []);

  return (
    <main id="main" className="bg-white min-h-screen">
      <PageHero
        homeHref="/es"
        homeLabel="Inicio"
        currentLabel="Servicios"
        title="Empieza con claridad y luego construye tu estrategia financiera"
        subtitle="Comienza con una llamada de descubrimiento, elige una sesión estratégica enfocada y avanza a Mapas Financieros Estratégicos cuando estés listo para una implementación más profunda."
        primaryCta={{
          label: "Reservar llamada de descubrimiento",
          href: "/es/contacto?intent=consult&package=Llamada%20de%20Descubrimiento",
        }}
        secondaryCta={{
          label: "Explorar mapas financieros estratégicos",
          href: "#strategic-maps",
          variant: "secondary",
        }}
      />

      <StickySectionNav
        sections={SECTIONS}
        ariaLabel="Navegación de secciones"
        defaultActive="start-here"
      />

      {/* ======= 1. Empieza Aquí ======= */}
      <div className="bg-brand-gold/5 border-t border-brand-gold/20">
        <Panel>
          <SectionTitle
            id="start-here"
            title="Empieza Aquí: Llamada de descubrimiento + sesiones estratégicas"
            subtitle="Empieza con estas dos sesiones para definir dirección y decidir con confianza el siguiente nivel de apoyo."
            tint="gold"
          />
          <Grid cards={sectionsWithCards.startHere} />
        </Panel>
      </div>

      {/* ======= 2. Mapas Financieros Estratégicos ======= */}
      <div className="bg-brand-green/5 border-t border-brand-gold/20">
        <Panel>
          <SectionTitle
            id="strategic-maps"
            title="Mapas Financieros Estratégicos"
            subtitle="Acompañamiento integral y coordinado para transiciones financieras y empresariales clave"
            tint="green"
          />
          <div className="mb-6 grid md:grid-cols-3 gap-4">
            <InfoCard
              kicker="Nivel 1"
              title="Dirección Enfocada"
              description="Aclara una prioridad de alto impacto con una ruta práctica de implementación."
            />
            <InfoCard
              kicker="Nivel 2"
              title="Integración Profunda"
              description="Instala sistemas de decisión y rutinas en flujo de caja, estrategia hipotecaria e impuestos."
            />
            <InfoCard
              kicker="Nivel 3"
              title="Transformación Premium"
              description="Planificación completa y coordinación continua con tu equipo de profesionales."
            />
          </div>
          <ComparisonTable
            className="mb-6"
            columns={["Ideal para", "Profundidad típica", "Horizonte sugerido"]}
            rows={[
              {
                label: "Nivel 1",
                values: ["Una prioridad puntual", "Estrategia enfocada + acciones", "2-6 semanas"],
              },
              {
                label: "Nivel 2",
                values: ["Instalar sistemas", "Planificación transversal", "8-12 semanas"],
              },
              {
                label: "Nivel 3",
                values: ["Transformación integral", "Coordinación ejecutiva continua", "3-6 meses"],
              },
            ]}
            footnote="Los tiempos pueden variar según alcance y preparación documental."
          />
          <Grid cards={sectionsWithCards.strategicMaps} />
        </Panel>
      </div>

      {/* ======= 3. Apoyo Complementario ======= */}
      <div className="bg-brand-gold/5 border-t border-brand-gold/20">
        <Panel>
          <SectionTitle
            id="support"
            title="Apoyo Complementario"
            subtitle="Coaching privado, talleres y cohortes para reforzar tu estrategia con acompañamiento práctico."
            tint="gold"
          />
          <Grid cards={sectionsWithCards.supplementarySupport} />
        </Panel>
      </div>

      {/* ======= 4. Estrategia Hipotecaria ======= */}
      <div className="bg-gradient-to-b from-brand-green/10 to-white border-y border-brand-gold/20">
        <Panel className="bg-white/90">
          <SectionTitle
            id="mortgage"
            title="Estrategia Hipotecaria"
            subtitle="Confianza desde la preaprobación hasta el cierre, incluyendo primeros pasos en inversión de 4–10 unidades"
            tint="green"
          />
          <Grid cards={sectionsWithCards.mortgage} />
        </Panel>
      </div>

      {/* ======= 5. Estrategia de Negocios e Impuestos ======= */}
      <div className="bg-brand-gold/5 border-t border-brand-gold/20">
        <Panel>
          <SectionTitle
            id="business"
            title="Estrategia de Negocios e Impuestos"
            subtitle="Claridad ejecutiva y ritmos tributarios predecibles para dueños y profesionales"
            tint="gold"
          />
          <Grid cards={sectionsWithCards.business} />
        </Panel>
      </div>

      {/* ======= 6. Cómo Trabajamos ======= */}
      <div className="bg-brand-green/5 border-t border-brand-gold/20">
        <Panel>
          <SectionTitle
            id="how"
            title="Cómo Trabajamos"
            subtitle="Proceso constante, transparente y humano"
            tint="green"
          />
          <div className="grid md:grid-cols-3 gap-6">
            <InfoCard
              title="1) Descubrimiento"
              description="Conversación inicial amable. Si encajamos, recibirás un mini plan y checklist preciso, sin carga innecesaria."
            />
            <InfoCard
              title="2) Plan y Ejecución"
              description="Modelamos escenarios, preparamos documentos y coordinamos cada paso a un ritmo manejable. Siempre sabrás qué sigue y por qué."
            />
            <InfoCard
              title="3) Revisión y Ajuste"
              description="Confirmamos resultados, registramos cambios y programamos tu próxima revisión. Calma y consistencia."
            />
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
    <CardGrid>
      {cards.map((c) => (
        <PackageCard key={c.id} c={c} />
      ))}
    </CardGrid>
  );
}
