import Link from "next/link";
import {
  CardGrid,
  HubPanel as Panel,
  HubSectionTitle as SectionTitle,
  OfferCard,
  PageHero,
  StickySectionNav,
} from "@/components/sections/hub";
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
      "Revisa opciones y trade-offs",
      "Prioriza los próximos 2-3 pasos",
      "Recibe guía práctica por escrito",
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
      "Ordena prioridades conectadas",
      "Construye una secuencia realista",
      "Define un plan de implementación con confianza",
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
  },
];

const SECTIONS = [
  { id: "start-here", label: "Empieza aquí" },
  { id: "strategic-maps", label: "Mapas estratégicos" },
  { id: "support", label: "Apoyo complementario" },
  { id: "mortgage", label: "Estrategia hipotecaria" },
  { id: "business", label: "Negocios e impuestos" },
] as const;

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
    <main id="main" className="bg-white min-h-screen">
      <PageHero
        homeHref="/es"
        homeLabel="Inicio"
        currentLabel="Servicios"
        title="Claridad y Dirección para tu vida financiera - con estrategia centrada en la persona"
        subtitle="Empieza con una llamada de descubrimiento gratis y elige el nivel de asesoría que mejor se adapte a tus metas: desde sesiones de claridad hasta mapas financieros estratégicos integrales."
        primaryCta={{
          label: "Reservar llamada de descubrimiento gratis",
          href: "/es/contacto?intent=consult&package=Llamada%20de%20Descubrimiento%20Gratis%20(15%20min)",
        }}
        secondaryCta={{
          label: "Explorar mapas financieros estratégicos",
          href: "#strategic-maps",
          variant: "secondary",
        }}
      />

      <StickySectionNav
        sections={SECTIONS}
        ariaLabel="En esta página"
        defaultActive="start-here"
      />

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

      <div className="bg-gradient-to-b from-brand-green/10 to-white border-y border-brand-gold/20">
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
              className="inline-flex items-center justify-center px-5 py-2.5 bg-brand-green text-white rounded-full font-semibold hover:bg-brand-gold hover:text-brand-green border border-brand-green/20 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold"
            >
              Reservar llamada de descubrimiento
            </Link>
            <Link
              href={packageHref("Sesión de Claridad y Dirección (60 min)")}
              className="inline-flex items-center justify-center px-5 py-2.5 rounded-full border border-brand-blue/40 text-brand-blue hover:bg-brand-blue hover:text-white transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue/40"
            >
              Reservar sesión de claridad y dirección
            </Link>
            <Link
              href="#strategic-maps"
              className="inline-flex items-center justify-center px-5 py-2.5 rounded-full border border-brand-gold/40 text-brand-green hover:bg-brand-gold hover:text-white transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold"
            >
              Explorar mapas financieros estratégicos
            </Link>
          </div>
        </Panel>
      </div>
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
