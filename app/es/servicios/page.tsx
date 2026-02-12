import Link from "next/link";
import {
  CardGrid,
  ComparisonTable,
  HubPanel as Panel,
  HubSectionTitle as SectionTitle,
  OfferCard,
  PageHero,
  StickySectionNav,
} from "@/components/sections/hub";
import StartHereDecisionWidget from "@/components/StartHereDecisionWidget";
import StickyNextStepBar from "@/components/StickyNextStepBar";
import HowItWorksTimeline from "@/components/HowItWorksTimeline";
import type { ServiceId } from "@/lib/services/details";

const PRICING = {
  discovery: 0,
  clarity60: 150,
  clarity90: 225,
  mapTier1: 2500,
  mapTier2: 3500,
  mapTier3: 5000,
  coachingFoundations: null,
  workshops: null,
  foundationsGroup: null,
  mortgagePreapproval: 0,
  businessCashflow: 395,
  taxCoordination: 395,
} as const;

function price(value: number | null) {
  if (value === null) return "Consultar precio";
  if (value === 0) return "Gratis";
  return `$${value.toLocaleString()} CAD`;
}

type ServiceSection =
  | "start-here"
  | "strategic-maps"
  | "support"
  | "mortgage"
  | "business";

type Card = {
  id: ServiceId;
  section: ServiceSection;
  title: string;
  desc: string;
  bullets: string[];
  tags: string[];
  price: string;
  ctaLabel:
    | "Reservar llamada de descubrimiento"
    | "Reservar sesión de claridad y dirección"
    | "Explorar mapas financieros estratégicos";
  ctaHref: string;
  scopeNote?: string;
};

function packageHref(title: string) {
  const qs = new URLSearchParams();
  qs.set("intent", "package");
  qs.set("package", title);
  return `/es/contacto?${qs.toString()}`;
}

const CARDS: Card[] = [
  {
    id: "discovery",
    section: "start-here",
    title: "Llamada de Descubrimiento Gratis (15 min)",
    desc: "Una conversación breve para entender tus objetivos y definir tu mejor siguiente paso.",
    bullets: [
      "Aclara prioridades y tiempos",
      "Define el primer servicio adecuado",
      "Sal con una ruta de acción clara",
    ],
    tags: ["Nivel 0", "Empieza aquí", "Bilingüe EN/ES"],
    price: price(PRICING.discovery),
    ctaLabel: "Reservar llamada de descubrimiento",
    ctaHref: "/es/contacto?intent=consult&package=Llamada%20de%20Descubrimiento%20Gratis%20(15%20min)",
  },
  {
    id: "clarity-60",
    section: "start-here",
    title: "Sesión de Claridad y Dirección (60 min)",
    desc: "Asesoría enfocada para una decisión que necesita estructura y avance.",
    bullets: [
      "Recibe un PDF de plan de acción de 1 página",
      "Prioriza tus próximos 2-3 pasos",
      "Recibe recomendación del siguiente servicio (si aplica)",
    ],
    tags: ["Nivel 1", "Decisión enfocada", "Asesoría"],
    price: price(PRICING.clarity60),
    ctaLabel: "Reservar sesión de claridad y dirección",
    ctaHref: packageHref("Sesión de Claridad y Dirección (60 min)"),
  },
  {
    id: "clarity-90",
    section: "start-here",
    title: "Sesión de Claridad y Dirección - Extendida (90 min)",
    desc: "Acompañamiento extendido para decisiones financieras múltiples e interconectadas.",
    bullets: [
      "Recibe un PDF de plan de acción de 1 página adaptado a tus prioridades",
      "Prioriza tus próximos 2-3 pasos",
      "Recibe recomendación del siguiente servicio (si aplica)",
    ],
    tags: ["Nivel 1", "Decisión enfocada", "Extendida"],
    price: price(PRICING.clarity90),
    ctaLabel: "Reservar sesión de claridad y dirección",
    ctaHref: packageHref("Sesión de Claridad y Dirección - Extendida (90 min)"),
  },
  {
    id: "map-tier-1",
    section: "strategic-maps",
    title: "Nivel 1: Mapa Estratégico Específico por Meta",
    desc: "Ideal para una meta prioritaria que requiere estrategia clara y ejecución ordenada.",
    bullets: [
      "Define el objetivo principal",
      "Traza hitos y secuencia",
      "Establece acciones inmediatas",
    ],
    tags: ["Nivel 1", "Planificación estratégica", "Alcance focalizado"],
    price: price(PRICING.mapTier1),
    ctaLabel: "Explorar mapas financieros estratégicos",
    ctaHref: packageHref("Nivel 1: Mapa Estratégico Específico por Meta"),
  },
  {
    id: "map-tier-2",
    section: "strategic-maps",
    title: "Nivel 2: Mapa Estratégico Integrado",
    desc: "Diseñado para quienes gestionan varias prioridades que deben funcionar juntas.",
    bullets: [
      "Integra decisiones entre prioridades",
      "Alinea flujo de caja, tiempos y capacidad",
      "Reduce fricción en la implementación",
    ],
    tags: ["Nivel 2", "Integrado", "Planificación estratégica"],
    price: price(PRICING.mapTier2),
    ctaLabel: "Explorar mapas financieros estratégicos",
    ctaHref: packageHref("Nivel 2: Mapa Estratégico Integrado"),
  },
  {
    id: "map-tier-3",
    section: "strategic-maps",
    title: "Nivel 3: Mapa Estratégico Holístico de Vida y Finanzas",
    desc: "Planificación completa para transiciones importantes de vida, negocio y patrimonio.",
    bullets: [
      "Unifica prioridades personales y financieras",
      "Coordina a tu equipo profesional",
      "Instala una hoja de ruta de largo plazo",
    ],
    tags: ["Nivel 3", "Holístico", "Asesoría premium"],
    price: price(PRICING.mapTier3),
    ctaLabel: "Explorar mapas financieros estratégicos",
    ctaHref: packageHref("Nivel 3: Mapa Estratégico Holístico de Vida y Finanzas"),
  },
  {
    id: "support-coaching",
    section: "support",
    title: "Coaching y Fundamentos",
    desc: "Apoyo complementario para sostener ejecución, consistencia y rendición de cuentas.",
    bullets: [
      "Seguimiento privado de implementación",
      "Monitoreo y ajustes de progreso",
      "Soporte de decisiones entre hitos",
    ],
    tags: ["Complementario", "Coaching", "Fundamentos"],
    price: price(PRICING.coachingFoundations),
    ctaLabel: "Reservar llamada de descubrimiento",
    ctaHref: packageHref("Coaching y Fundamentos"),
    scopeNote: "Solo asesoría / educativo",
  },
  {
    id: "support-workshops",
    section: "support",
    title: "Talleres",
    desc: "Aprendizaje grupal estructurado para familias, profesionales y recién llegados.",
    bullets: [
      "Formato educativo práctico",
      "Plantillas y herramientas aplicables",
      "Próximos pasos claros por sesión",
    ],
    tags: ["Complementario", "Grupal", "Educación"],
    price: price(PRICING.workshops),
    ctaLabel: "Reservar llamada de descubrimiento",
    ctaHref: packageHref("Talleres"),
  },
  {
    id: "support-foundations-group",
    section: "support",
    title: "Programas Base y Grupos Pequeños",
    desc: "Programas guiados para reforzar tu estrategia con implementación constante.",
    bullets: [
      "Acompañamiento en grupo reducido",
      "Rutinas prácticas de avance",
      "Entorno de aprendizaje colaborativo",
    ],
    tags: ["Complementario", "Grupo pequeño", "Implementación"],
    price: price(PRICING.foundationsGroup),
    ctaLabel: "Reservar llamada de descubrimiento",
    ctaHref: packageHref("Programas Base y Grupos Pequeños"),
  },
  {
    id: "mortgage-preapproval",
    section: "mortgage",
    title: "Planificación de Preaprobación",
    desc: "Construye una ruta sólida antes de presentar tu solicitud hipotecaria.",
    bullets: [
      "Evalúa asequibilidad y documentación",
      "Aclara escenarios con prestamistas",
      "Ordena tiempos con mayor seguridad",
    ],
    tags: ["Hipoteca", "Empieza aquí", "Preparación"],
    price: price(PRICING.mortgagePreapproval),
    ctaLabel: "Reservar llamada de descubrimiento",
    ctaHref: packageHref("Planificación de Preaprobación"),
    scopeNote: "Servicio hipotecario con licencia",
  },
  {
    id: "business-cashflow",
    section: "business",
    title: "Sesión de Estrategia de Negocio y Flujo de Caja",
    desc: "Soporte estratégico para dueños que equilibran crecimiento, estabilidad y metas personales.",
    bullets: [
      "Revisa puntos de presión en flujo de caja",
      "Prioriza decisiones estratégicas",
      "Define hitos prácticos inmediatos",
    ],
    tags: ["Negocios", "Estrategia", "Flujo de caja"],
    price: price(PRICING.businessCashflow),
    ctaLabel: "Reservar llamada de descubrimiento",
    ctaHref: packageHref("Sesión de Estrategia de Negocio y Flujo de Caja"),
  },
  {
    id: "business-tax",
    section: "business",
    title: "Sesión de Coordinación para Planificación Fiscal",
    desc: "Prepara prioridades y preguntas estratégicas antes de cerrar decisiones tributarias.",
    bullets: [
      "Alinea prioridades con tu equipo asesor",
      "Ordena pasos de cumplimiento y planificación",
      "Reduce estrés de decisiones de último minuto",
    ],
    tags: ["Impuestos", "Coordinación", "Planificación"],
    price: price(PRICING.taxCoordination),
    ctaLabel: "Reservar llamada de descubrimiento",
    ctaHref: packageHref("Sesión de Coordinación para Planificación Fiscal"),
    scopeNote: "Coordinación + preguntas de planificación (no declaración)",
  },
];

const SECTIONS = [
  { id: "start-here", label: "Empieza aquí" },
  { id: "strategic-maps", label: "Mapas estratégicos" },
  { id: "support", label: "Apoyo complementario" },
  { id: "kitchen-table", label: "Conversaciones en la Mesa" },
  { id: "mortgage", label: "Estrategia hipotecaria" },
  { id: "business", label: "Negocios e impuestos" },
] as const;

const STRATEGIC_MAP_COLUMNS = ["Nivel 1", "Nivel 2", "Nivel 3"];
const STRATEGIC_MAP_ROWS = [
  {
    label: "Ideal para",
    values: [
      "Una meta prioritaria",
      "Varias prioridades conectadas",
      "Transiciones complejas de vida + finanzas",
    ],
  },
  {
    label: "Horizonte de tiempo",
    values: [
      "Corto plazo (3-6 meses)",
      "Mediano plazo (6-18 meses)",
      "Largo plazo (18+ meses)",
    ],
  },
  {
    label: "Entregables",
    values: [
      "Mapa por meta + secuencia de acción",
      "Mapa integrado + secuencia de implementación",
      "Mapa holístico + hoja de ruta de largo plazo",
    ],
  },
  {
    label: "Incluye",
    values: [
      "Hitos, prioridades y puntos de seguimiento",
      "Coordinación entre prioridades con filtros de decisión",
      "Plan integral de coordinación con puntos de apoyo profesional",
    ],
  },
  {
    label: "Precio",
    values: [price(PRICING.mapTier1), price(PRICING.mapTier2), price(PRICING.mapTier3)],
  },
];

const CTA_PRIMARY_CLASS =
  "inline-flex items-center justify-center px-5 py-2.5 bg-brand-green text-white rounded-full font-semibold hover:bg-brand-gold hover:text-brand-green border border-brand-green/20 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold";
const CTA_SECONDARY_CLASS =
  "inline-flex items-center justify-center px-5 py-2.5 rounded-full border-2 border-brand-blue/40 bg-white text-brand-blue font-semibold shadow-sm hover:bg-brand-blue hover:text-white transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue/40";
const CTA_GHOST_CLASS =
  "inline-flex items-center justify-center px-5 py-2.5 rounded-full border border-brand-gold/40 bg-white text-brand-green font-semibold hover:bg-brand-gold hover:text-brand-green transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold";

const SERVICES_FAQ_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Para quien son los Mapas Financieros Estrategicos?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Los Mapas Financieros Estrategicos estan diseñados para clientes que necesitan una ruta clara para una meta principal o varias prioridades conectadas.",
      },
    },
    {
      "@type": "Question",
      name: "Como funciona la estrategia hipotecaria?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "El proceso inicia con preparacion y preaprobacion, luego alinea tiempos, escenarios con prestamistas y documentacion antes de aplicar.",
      },
    },
    {
      "@type": "Question",
      name: "Puedo iniciar con llamada de descubrimiento antes de elegir nivel?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Si. La mayoria de clientes inicia con una llamada de descubrimiento gratis para confirmar ajuste y siguiente paso.",
      },
    },
  ],
} as const;

const SERVICES_SCHEMA_JSON_LD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Service",
      name: "Llamada de Descubrimiento Gratis (15 min)",
      serviceType: "Consulta financiera",
      areaServed: {
        "@type": "AdministrativeArea",
        name: "Toronto, Ontario, Canada",
      },
      provider: {
        "@type": "Organization",
        name: "Fanny Samaniego",
      },
      offers: {
        "@type": "Offer",
        priceCurrency: "CAD",
        price: "0",
      },
      url: "https://www.fannysamaniego.com/es/servicios#start-here",
    },
    {
      "@type": "Service",
      name: "Mapas Financieros Estrategicos",
      serviceType: "Estrategia y planificacion financiera",
      areaServed: {
        "@type": "AdministrativeArea",
        name: "Toronto, Ontario, Canada",
      },
      provider: {
        "@type": "Organization",
        name: "Fanny Samaniego",
      },
      offers: [
        {
          "@type": "Offer",
          priceCurrency: "CAD",
          price: "2500",
          name: "Nivel 1: Mapa Estrategico Especifico por Meta",
        },
        {
          "@type": "Offer",
          priceCurrency: "CAD",
          price: "3500",
          name: "Nivel 2: Mapa Estrategico Integrado",
        },
        {
          "@type": "Offer",
          priceCurrency: "CAD",
          price: "5000",
          name: "Nivel 3: Mapa Estrategico Holistico de Vida y Finanzas",
        },
      ],
      url: "https://www.fannysamaniego.com/es/servicios#strategic-maps",
    },
    {
      "@type": "Service",
      name: "Estrategia Hipotecaria - Planificacion de Preaprobacion",
      serviceType: "Servicio hipotecario con licencia",
      areaServed: {
        "@type": "AdministrativeArea",
        name: "Toronto, Ontario, Canada",
      },
      provider: {
        "@type": "Organization",
        name: "Fanny Samaniego",
      },
      offers: {
        "@type": "Offer",
        priceCurrency: "CAD",
        price: "0",
      },
      url: "https://www.fannysamaniego.com/es/servicios#mortgage",
    },
  ],
} as const;

function PackageCard({ c }: { c: Card }) {
  return (
    <OfferCard
      id={c.id}
      title={c.title}
      description={c.desc}
      bullets={c.bullets.slice(0, 3)}
      price={c.price}
      tags={c.tags}
      cta={{
        label: c.ctaLabel,
        href: c.ctaHref,
      }}
      more={{
        label: "Ver detalles del servicio",
        href: `/es/servicios/${c.id}`,
      }}
      extra={c.scopeNote ? (
        <p className="mt-4 border-t border-brand-gold/30 pt-3 text-xs text-brand-blue/75">
          <strong>Alcance:</strong> {c.scopeNote}
        </p>
      ) : undefined}
    />
  );
}

export default function ServiciosPage() {
  const by = (section: ServiceSection) => CARDS.filter((card) => card.section === section);
  const sectionsWithCards = {
    startHere: by("start-here"),
    strategicMaps: by("strategic-maps"),
    support: by("support"),
    mortgage: by("mortgage"),
    business: by("business"),
  };

  return (
    <main id="main" className="bg-brand-beige min-h-screen pb-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(SERVICES_FAQ_JSON_LD) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(SERVICES_SCHEMA_JSON_LD) }}
      />

      <PageHero
        homeHref="/es"
        homeLabel="Inicio"
        currentLabel="Servicios"
        title="Claridad y dirección para tu vida financiera"
        subtitle="Empieza con una llamada de descubrimiento gratis y elige el nivel de asesoría que mejor se ajusta a tus prioridades, desde sesiones de claridad hasta mapas financieros estratégicos."
        primaryCta={{
          label: "Reservar llamada de descubrimiento gratis",
          href: "/es/contacto?intent=consult&package=Llamada%20de%20Descubrimiento%20Gratis%20(15%20min)",
        }}
      />

      <StickySectionNav
        sections={SECTIONS}
        ariaLabel="En esta página"
        defaultActive="start-here"
      />

      <div className="bg-brand-beige border-t border-brand-gold/20">
        <Panel>
          <HowItWorksTimeline
            title="Como funciona el servicio"
            subtitle="Una ruta simple desde la primera llamada hasta la implementacion."
            steps={[
              {
                title: "Llamada de descubrimiento",
                detail: "Iniciamos con una llamada corta para aclarar prioridades, tiempos y mejor ajuste.",
              },
              {
                title: "Sesion de claridad o intake",
                detail: "Elige una sesion enfocada en decisiones o completa intake para un trabajo estrategico profundo.",
              },
              {
                title: "Mapa, implementacion y coordinacion",
                detail: "Recibe tu hoja de ruta, puntos de seguimiento y apoyo coordinado cuando se requiera.",
              },
            ]}
          />
        </Panel>
      </div>

      <div className="bg-brand-gold/5 border-t border-brand-gold/20">
        <Panel>
          <StartHereDecisionWidget lang="es" />
        </Panel>
      </div>

      <div className="bg-brand-gold/5 border-t border-brand-gold/20">
        <Panel>
          <SectionTitle
            id="start-here"
            title="Trabajo estratégico enfocado en decisiones"
            subtitle="Servicios base para clientes listos para actuar con claridad."
            tint="gold"
          />
          <Grid cards={sectionsWithCards.startHere} />
        </Panel>
      </div>

      <div className="bg-brand-green/5 border-t border-brand-gold/20">
        <Panel>
          <SectionTitle
            id="strategic-maps"
            title="Mapas Financieros Estratégicos - Asesoría orientada a metas"
            subtitle="Avanza de la claridad inicial hacia una planificación más profunda y coordinada."
            tint="green"
          />
          <Grid cards={sectionsWithCards.strategicMaps} />
          <ComparisonTable
            className="mt-6"
            columns={STRATEGIC_MAP_COLUMNS}
            rows={STRATEGIC_MAP_ROWS}
            footnote="Todos los niveles de Mapa Estratégico son de asesoría y pueden coordinarse con tu equipo legal, fiscal o hipotecario."
          />
          <p className="mt-6 rounded-2xl border border-brand-gold/40 bg-white/95 p-4 text-sm text-brand-blue/90">
            Si inicias con una Sesión de Claridad y Dirección y avanzas a un Mapa Financiero
            Estratégico dentro de 30 días, el valor de esa sesión puede acreditarse al programa
            completo.
          </p>
        </Panel>
      </div>

      <div className="bg-brand-gold/5 border-t border-brand-gold/20">
        <Panel>
          <SectionTitle
            id="support"
            title="Apoyo complementario - Coaching y talleres"
            subtitle="Programas de apoyo que fortalecen tu estrategia principal."
            tint="gold"
          />
          <Grid cards={sectionsWithCards.support} />
        </Panel>
      </div>

      <div className="bg-brand-green/5 border-t border-brand-gold/20">
        <Panel>
          <SectionTitle
            id="kitchen-table"
            title="Conversaciones en la Mesa"
            subtitle="Programa grupal de 4 semanas para familias, recién llegados y compradores primerizos."
            tint="green"
          />
          <article className="rounded-3xl border border-brand-gold/40 bg-white/95 p-6 md:p-8 shadow-sm">
            <p className="text-brand-blue/90 leading-relaxed">
              Este programa en cohorte te ayuda a ganar claridad financiera con un formato
              cercano y guiado. Cada semana se enfoca en decisiones reales para que salgas
              con acciones simples y aplicables.
            </p>
            <ul className="mt-4 list-disc pl-5 space-y-1 text-brand-blue/90">
              <li>Grupos pequeños con preguntas en vivo y aprendizaje compartido</li>
              <li>4 sesiones semanales (45-60 min) con pasos concretos</li>
              <li>Apoyo en preguntas de hipoteca, flujo de caja e impuestos</li>
            </ul>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link
                href="/es/conversaciones-en-la-mesa"
                className="inline-flex items-center justify-center px-5 py-2.5 rounded-full border border-brand-blue/40 text-brand-blue hover:bg-brand-blue hover:text-white transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue/40"
              >
                Ver detalles del programa
              </Link>
              <Link
                href={packageHref("Conversaciones en la Mesa — Cohorte 4 semanas")}
                className="inline-flex items-center justify-center px-5 py-2.5 bg-brand-green text-white rounded-full font-semibold hover:bg-brand-gold hover:text-brand-green border border-brand-green/20 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold"
              >
                Unirme a la cohorte de 4 semanas
              </Link>
            </div>
          </article>
        </Panel>
      </div>

      <div className="bg-gradient-to-b from-brand-green/10 to-brand-beige border-y border-brand-gold/20">
        <Panel className="bg-white/90">
          <SectionTitle
            id="mortgage"
            title="Estrategia hipotecaria - Preparación de preaprobación con confianza práctica"
            subtitle="Un bloque hipotecario enfocado en compradores que quieren presentar un expediente sólido."
            tint="green"
          />
          <Grid cards={sectionsWithCards.mortgage} />
        </Panel>
      </div>

      <div className="bg-brand-gold/5 border-t border-brand-gold/20">
        <Panel>
          <SectionTitle
            id="business"
            title="Sesiones de Negocios, Impuestos y Especialidad"
            subtitle="Acompañamiento focalizado para decisiones empresariales y tributarias."
            tint="gold"
          />
          <Grid cards={sectionsWithCards.business} />
        </Panel>
      </div>

      <div className="bg-brand-green/5 border-t border-brand-gold/20">
        <Panel>
          <SectionTitle
            id="next-step"
            title="Lista para tu próximo paso"
            subtitle="Elige la acción inicial según tu prioridad actual."
            tint="green"
          />
          <div className="flex flex-wrap gap-3 justify-center">
            <Link
              href="/es/contacto?intent=consult&package=Llamada%20de%20Descubrimiento%20Gratis%20(15%20min)"
              className={`${CTA_PRIMARY_CLASS} sm:min-w-[255px]`}
            >
              Reservar llamada de descubrimiento
            </Link>
            <Link
              href={packageHref("Sesión de Claridad y Dirección (60 min)")}
              className={`${CTA_SECONDARY_CLASS} sm:min-w-[255px]`}
            >
              Reservar sesión de claridad y dirección
            </Link>
            <Link
              href="#strategic-maps"
              className={`${CTA_GHOST_CLASS} sm:min-w-[255px]`}
            >
              Explorar mapas financieros estratégicos
            </Link>
          </div>
        </Panel>
      </div>
      <StickyNextStepBar
        lang="es"
        checklistHref="/es/herramientas/preparacion-hipoteca"
        checklistLabel="Abrir checklist hipotecario"
      />
    </main>
  );
}

function Grid({ cards }: { cards: Card[] }) {
  if (!cards.length) {
    return <p className="text-brand-blue/70">No hay servicios disponibles.</p>;
  }

  return (
    <CardGrid>
      {cards.map((card) => (
        <PackageCard key={card.id} c={card} />
      ))}
    </CardGrid>
  );
}
