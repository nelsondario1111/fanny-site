export type ServiceId =
  | "discovery"
  | "clarity-60"
  | "clarity-90"
  | "map-tier-1"
  | "map-tier-2"
  | "map-tier-3"
  | "support-coaching"
  | "support-workshops"
  | "support-foundations-group"
  | "mortgage-preapproval"
  | "business-cashflow"
  | "business-tax";

export type ServiceDetail = {
  id: ServiceId;
  title: string;
  subtitle: string;
  price: string;
  duration: string;
  packageTitle: string;
  primaryCtaLabel: string;
  idealFor: string[];
  includes: string[];
  process: string[];
  outcome: string;
  scopeNote?: string;
};

const EN: Record<ServiceId, ServiceDetail> = {
  discovery: {
    id: "discovery",
    title: "Free Discovery Call (15 min)",
    subtitle:
      "A brief, focused conversation to clarify your immediate priority and choose the right service path.",
    price: "Free",
    duration: "15 minutes",
    packageTitle: "Free Discovery Call (15 min)",
    primaryCtaLabel: "Book a Discovery Call",
    idealFor: [
      "New clients unsure where to start",
      "Families or professionals with one urgent question",
      "People comparing strategy options before committing",
    ],
    includes: [
      "Goal and context review",
      "Quick fit assessment and service recommendation",
      "Clear next-step pathway (session or map)",
    ],
    process: [
      "You share your top priority and timeline.",
      "We identify the highest-value next move for your situation.",
      "You leave with one specific next step and booking path.",
    ],
    outcome: "You gain clarity on where to begin and avoid starting in the wrong service.",
  },
  "clarity-60": {
    id: "clarity-60",
    title: "Clarity & Direction Session (60 min)",
    subtitle:
      "Decision-focused strategy session for one priority where you need structure, options, and momentum.",
    price: "$150 CAD",
    duration: "60 minutes",
    packageTitle: "Clarity & Direction Session (60 min)",
    primaryCtaLabel: "Book a Clarity & Direction Session",
    idealFor: [
      "One high-impact decision that feels stuck",
      "Clients who need fast strategic direction",
      "People preparing for deeper planning work",
    ],
    includes: [
      "Decision framing and priority alignment",
      "Scenario trade-off review",
      "Action sequence with practical first steps",
    ],
    process: [
      "We define the exact decision and success criteria.",
      "We compare realistic options and constraints.",
      "You receive a concise action roadmap.",
    ],
    outcome: "You finish with a clear decision path and practical execution order.",
  },
  "clarity-90": {
    id: "clarity-90",
    title: "Clarity & Direction Session - Extended (90 min)",
    subtitle:
      "Extended strategic session for multiple connected decisions that require integrated thinking.",
    price: "$225 CAD",
    duration: "90 minutes",
    packageTitle: "Clarity & Direction Session - Extended (90 min)",
    primaryCtaLabel: "Book a Clarity & Direction Session",
    idealFor: [
      "Clients balancing two or more related priorities",
      "People managing transition periods (work, family, housing)",
      "Cases that require deeper sequencing and risk review",
    ],
    includes: [
      "Cross-priority decision mapping",
      "Integrated timeline and dependency review",
      "Written next-step implementation framework",
    ],
    process: [
      "We map all connected priorities and constraints.",
      "We build a practical sequence with decision checkpoints.",
      "You receive a structured implementation plan.",
    ],
    outcome: "You gain integrated direction across multiple decisions, not just one isolated answer.",
  },
  "map-tier-1": {
    id: "map-tier-1",
    title: "Tier 1: Goal-Specific Strategic Map",
    subtitle:
      "Focused planning engagement for one high-priority goal with an actionable roadmap.",
    price: "$2,500 CAD",
    duration: "Typical timeline: 2-6 weeks",
    packageTitle: "Tier 1: Goal-Specific Strategic Map",
    primaryCtaLabel: "Explore Strategic Financial Maps",
    idealFor: [
      "A single core objective that needs full planning depth",
      "Clients ready for structured implementation",
      "People who need clarity plus execution guidance",
    ],
    includes: [
      "Goal definition and target metrics",
      "Milestone roadmap with sequence",
      "Risk flags and decision checkpoints",
    ],
    process: [
      "Discovery and objective definition",
      "Strategy build and scenario validation",
      "Final map review with implementation priorities",
    ],
    outcome: "You receive a complete map for one priority goal and the sequence to execute with confidence.",
  },
  "map-tier-2": {
    id: "map-tier-2",
    title: "Tier 2: Integrated Strategic Map",
    subtitle:
      "Cross-priority planning for clients coordinating multiple financial and life decisions.",
    price: "$3,500 CAD",
    duration: "Typical timeline: 8-12 weeks",
    packageTitle: "Tier 2: Integrated Strategic Map",
    primaryCtaLabel: "Explore Strategic Financial Maps",
    idealFor: [
      "Clients balancing mortgage, tax, and cash-flow choices",
      "Families/professionals with overlapping priorities",
      "People who need decisions aligned across domains",
    ],
    includes: [
      "Integrated strategy across key priorities",
      "Timeline coordination and dependency planning",
      "Implementation guardrails and decision criteria",
    ],
    process: [
      "Current-state mapping and objective alignment",
      "Integrated strategy design with trade-off analysis",
      "Execution plan with staged milestones",
    ],
    outcome: "You get one integrated plan that reduces friction between competing priorities.",
  },
  "map-tier-3": {
    id: "map-tier-3",
    title: "Tier 3: Holistic Life & Financial Strategic Map",
    subtitle:
      "Comprehensive premium planning for major transitions requiring long-range coordination.",
    price: "$5,000 CAD",
    duration: "Typical timeline: 3-6 months",
    packageTitle: "Tier 3: Holistic Life & Financial Strategic Map",
    primaryCtaLabel: "Explore Strategic Financial Maps",
    idealFor: [
      "Major life and financial transitions",
      "Complex client situations with high coordination needs",
      "Clients who need long-range strategic leadership",
    ],
    includes: [
      "Holistic multi-domain strategy design",
      "Coordination guidance with your advisor team",
      "Long-range implementation roadmap and review points",
    ],
    process: [
      "Deep intake and strategic framing",
      "Comprehensive map development and alignment",
      "Staged implementation planning and refinement",
    ],
    outcome: "You receive a full-spectrum strategic blueprint with clear long-term direction.",
  },
  "support-coaching": {
    id: "support-coaching",
    title: "Coaching & Foundations",
    subtitle:
      "Ongoing support to sustain implementation, accountability, and decision momentum.",
    price: "Contact for pricing",
    duration: "Format based on scope",
    packageTitle: "Coaching & Foundations",
    primaryCtaLabel: "Book a Discovery Call",
    idealFor: [
      "Clients who already have a plan and need steady execution support",
      "People who benefit from accountability cadence",
      "Those implementing new financial routines",
    ],
    includes: [
      "Progress check-ins and course correction",
      "Routine reinforcement and implementation support",
      "Decision support between major milestones",
    ],
    process: [
      "Define coaching objective and cadence",
      "Track progress against agreed priorities",
      "Adjust implementation based on real-world conditions",
    ],
    outcome: "You stay consistent and reduce drift between planning and real execution.",
  },
  "support-workshops": {
    id: "support-workshops",
    title: "Workshops",
    subtitle:
      "Group learning sessions that translate strategy into practical action with tools and templates.",
    price: "Contact for pricing",
    duration: "Session-based",
    packageTitle: "Workshops",
    primaryCtaLabel: "Book a Discovery Call",
    idealFor: [
      "Families/professionals who prefer guided group learning",
      "Clients seeking structure before 1:1 work",
      "Teams and communities building core financial habits",
    ],
    includes: [
      "Live practical training format",
      "Templates and implementation resources",
      "Action-oriented follow-through guidance",
    ],
    process: [
      "Select workshop based on your goal",
      "Attend session and apply tools in real time",
      "Leave with practical next steps and templates",
    ],
    outcome: "You gain practical skills quickly with immediate application support.",
  },
  "support-foundations-group": {
    id: "support-foundations-group",
    title: "Foundations & Small Group Programs",
    subtitle:
      "Guided small-group support for clients building stable financial routines over time.",
    price: "Contact for pricing",
    duration: "Program-based",
    packageTitle: "Foundations & Small Group Programs",
    primaryCtaLabel: "Book a Discovery Call",
    idealFor: [
      "Clients who benefit from shared accountability",
      "People creating sustainable habits from the ground up",
      "Those seeking support without full private engagement",
    ],
    includes: [
      "Small-group implementation accountability",
      "Core routine-building framework",
      "Shared learning and practical reinforcement",
    ],
    process: [
      "Join the matching cohort/program track",
      "Follow weekly or staged implementation tasks",
      "Review progress and reinforce routines",
    ],
    outcome: "You build durable routines with structure, guidance, and peer accountability.",
  },
  "mortgage-preapproval": {
    id: "mortgage-preapproval",
    title: "Pre-Approval Planning",
    subtitle:
      "Strategic mortgage readiness planning before application to strengthen positioning and confidence.",
    price: "Free",
    duration: "Based on file readiness",
    packageTitle: "Pre-Approval Planning",
    primaryCtaLabel: "Book a Discovery Call",
    idealFor: [
      "Buyers preparing for a near-term purchase",
      "Clients unsure about affordability and documentation readiness",
      "People who want clarity before engaging lenders",
    ],
    includes: [
      "Affordability and file-readiness review",
      "Documentation and timing guidance",
      "Lender-fit scenario orientation",
    ],
    process: [
      "Review baseline profile and purchase timeline",
      "Identify documentation and affordability gaps",
      "Set readiness actions before formal application",
    ],
    outcome: "You enter pre-approval with stronger preparation and fewer surprises.",
    scopeNote:
      "Mortgage qualification remains subject to lender underwriting and approved credit (O.A.C.).",
  },
  "business-cashflow": {
    id: "business-cashflow",
    title: "Business Strategy & Cash Flow Session",
    subtitle:
      "Focused advisory session for owners aligning cash flow decisions with growth and stability goals.",
    price: "$395 CAD",
    duration: "Session-based",
    packageTitle: "Business Strategy & Cash Flow Session",
    primaryCtaLabel: "Book a Discovery Call",
    idealFor: [
      "Business owners facing cash flow pressure points",
      "Founders making short-term trade-off decisions",
      "Professionals balancing business and personal priorities",
    ],
    includes: [
      "Current cash-flow pressure map",
      "Priority sequencing for key decisions",
      "Practical next-step milestone plan",
    ],
    process: [
      "Diagnose current cash-flow constraints",
      "Prioritize strategic decision sequence",
      "Set near-term action milestones",
    ],
    outcome: "You gain a clearer decision framework and more stable short-term execution.",
  },
  "business-tax": {
    id: "business-tax",
    title: "Tax Planning Coordination Session",
    subtitle:
      "Strategy session to prepare tax-related priorities and advisor coordination before deadlines.",
    price: "$395 CAD",
    duration: "Session-based",
    packageTitle: "Tax Planning Coordination Session",
    primaryCtaLabel: "Book a Discovery Call",
    idealFor: [
      "Clients preparing for tax-season decisions",
      "Owners needing clearer advisor coordination",
      "Families/professionals wanting proactive tax rhythm",
    ],
    includes: [
      "Priority alignment for planning season",
      "Question framework for your accountant/advisor",
      "Sequenced timeline for decisions and documentation",
    ],
    process: [
      "Review current tax-planning context",
      "Define priority questions and decision checkpoints",
      "Build practical coordination timeline",
    ],
    outcome: "You approach tax planning with clearer priorities and less deadline-driven stress.",
    scopeNote:
      "This complements your accountant/tax advisor; final filing outcomes are determined by CRA and your tax professional.",
  },
};

const ES: Record<ServiceId, ServiceDetail> = {
  discovery: {
    id: "discovery",
    title: "Llamada de Descubrimiento Gratis (15 min)",
    subtitle:
      "Conversación breve para aclarar tu prioridad inmediata y elegir el mejor camino de servicio.",
    price: "Gratis",
    duration: "15 minutos",
    packageTitle: "Llamada de Descubrimiento Gratis (15 min)",
    primaryCtaLabel: "Reservar llamada de descubrimiento",
    idealFor: [
      "Personas nuevas que no saben por dónde empezar",
      "Familias o profesionales con una duda urgente",
      "Quienes quieren comparar opciones antes de comprometerse",
    ],
    includes: [
      "Revisión de objetivo y contexto",
      "Evaluación rápida de encaje y recomendación",
      "Siguiente paso claro (sesión o mapa)",
    ],
    process: [
      "Compartes tu prioridad principal y tu plazo.",
      "Definimos el siguiente movimiento de mayor valor para tu caso.",
      "Sales con un paso concreto y ruta de reserva.",
    ],
    outcome: "Obtienes claridad para empezar con el servicio correcto desde el inicio.",
  },
  "clarity-60": {
    id: "clarity-60",
    title: "Sesión de Claridad y Dirección (60 min)",
    subtitle:
      "Sesión estratégica enfocada en una decisión prioritaria que necesita estructura y avance.",
    price: "$150 CAD",
    duration: "60 minutos",
    packageTitle: "Sesión de Claridad y Dirección (60 min)",
    primaryCtaLabel: "Reservar sesión de claridad y dirección",
    idealFor: [
      "Una decisión importante que está estancada",
      "Clientes que necesitan dirección estratégica rápida",
      "Personas que evalúan avanzar a un mapa estratégico",
    ],
    includes: [
      "Definición de decisión y prioridades",
      "Análisis de opciones y trade-offs",
      "Secuencia de acciones inmediatas",
    ],
    process: [
      "Definimos decisión y criterio de éxito.",
      "Comparamos opciones realistas y restricciones.",
      "Te llevas una ruta concreta de ejecución.",
    ],
    outcome: "Terminas con dirección clara y orden de ejecución práctico.",
  },
  "clarity-90": {
    id: "clarity-90",
    title: "Sesión de Claridad y Dirección - Extendida (90 min)",
    subtitle:
      "Sesión extendida para decisiones múltiples conectadas que requieren integración.",
    price: "$225 CAD",
    duration: "90 minutos",
    packageTitle: "Sesión de Claridad y Dirección - Extendida (90 min)",
    primaryCtaLabel: "Reservar sesión de claridad y dirección",
    idealFor: [
      "Clientes con varias prioridades interdependientes",
      "Transiciones de vida, trabajo o vivienda",
      "Casos que requieren más secuencia y profundidad",
    ],
    includes: [
      "Mapa de prioridades conectadas",
      "Revisión integrada de tiempos y dependencias",
      "Plan escrito de implementación",
    ],
    process: [
      "Mapeamos prioridades y restricciones conectadas.",
      "Diseñamos una secuencia realista con hitos.",
      "Recibes un plan estructurado para ejecutar.",
    ],
    outcome: "Ganas dirección integrada para múltiples decisiones, no una respuesta aislada.",
  },
  "map-tier-1": {
    id: "map-tier-1",
    title: "Nivel 1: Mapa Estratégico Específico por Meta",
    subtitle:
      "Planificación enfocada en una meta prioritaria con hoja de ruta accionable.",
    price: "$2,500 CAD",
    duration: "Tiempo típico: 2-6 semanas",
    packageTitle: "Nivel 1: Mapa Estratégico Específico por Meta",
    primaryCtaLabel: "Explorar mapas financieros estratégicos",
    idealFor: [
      "Una meta principal que necesita profundidad de planificación",
      "Clientes listos para ejecutar con estructura",
      "Personas que necesitan claridad y plan operativo",
    ],
    includes: [
      "Definición de meta y métricas objetivo",
      "Ruta de hitos y secuencia",
      "Puntos de control y riesgos clave",
    ],
    process: [
      "Descubrimiento y definición de objetivo.",
      "Diseño de estrategia y validación de escenarios.",
      "Entrega del mapa con prioridades de ejecución.",
    ],
    outcome: "Recibes un mapa completo para una meta crítica y cómo ejecutarla con confianza.",
  },
  "map-tier-2": {
    id: "map-tier-2",
    title: "Nivel 2: Mapa Estratégico Integrado",
    subtitle:
      "Planificación transversal para coordinar varias decisiones financieras y de vida.",
    price: "$3,500 CAD",
    duration: "Tiempo típico: 8-12 semanas",
    packageTitle: "Nivel 2: Mapa Estratégico Integrado",
    primaryCtaLabel: "Explorar mapas financieros estratégicos",
    idealFor: [
      "Clientes que combinan hipoteca, impuestos y flujo de caja",
      "Familias/profesionales con prioridades superpuestas",
      "Casos que requieren alineación entre áreas",
    ],
    includes: [
      "Estrategia integrada entre prioridades",
      "Coordinación de tiempos y dependencias",
      "Guardrails de implementación y decisión",
    ],
    process: [
      "Mapeo de situación actual y objetivos.",
      "Diseño de estrategia integrada con trade-offs.",
      "Plan de ejecución por etapas.",
    ],
    outcome: "Obtienes un plan integrado que reduce choques entre prioridades.",
  },
  "map-tier-3": {
    id: "map-tier-3",
    title: "Nivel 3: Mapa Estratégico Holístico de Vida y Finanzas",
    subtitle:
      "Planificación premium integral para transiciones complejas con coordinación de largo plazo.",
    price: "$5,000 CAD",
    duration: "Tiempo típico: 3-6 meses",
    packageTitle: "Nivel 3: Mapa Estratégico Holístico de Vida y Finanzas",
    primaryCtaLabel: "Explorar mapas financieros estratégicos",
    idealFor: [
      "Transiciones importantes de vida y patrimonio",
      "Situaciones complejas con alta coordinación",
      "Clientes que requieren liderazgo estratégico continuo",
    ],
    includes: [
      "Estrategia holística multidominio",
      "Guía de coordinación con tu equipo asesor",
      "Hoja de ruta de implementación de largo plazo",
    ],
    process: [
      "Intake profundo y marco estratégico.",
      "Desarrollo y alineación del mapa integral.",
      "Plan de ejecución por fases y ajuste continuo.",
    ],
    outcome: "Recibes un blueprint estratégico integral con dirección clara a largo plazo.",
  },
  "support-coaching": {
    id: "support-coaching",
    title: "Coaching y Fundamentos",
    subtitle:
      "Acompañamiento continuo para sostener implementación, consistencia y ritmo de decisión.",
    price: "Consultar precio",
    duration: "Formato según alcance",
    packageTitle: "Coaching y Fundamentos",
    primaryCtaLabel: "Reservar llamada de descubrimiento",
    idealFor: [
      "Clientes con plan definido que necesitan constancia",
      "Personas que se benefician de rendición de cuentas",
      "Quienes están instalando rutinas nuevas",
    ],
    includes: [
      "Seguimiento de progreso y ajustes",
      "Refuerzo de rutinas de implementación",
      "Soporte de decisiones entre hitos clave",
    ],
    process: [
      "Definimos objetivo y cadencia de coaching.",
      "Medimos progreso frente a prioridades acordadas.",
      "Ajustamos implementación según la realidad.",
    ],
    outcome: "Mantienes avance estable y reduces la brecha entre plan y ejecución.",
  },
  "support-workshops": {
    id: "support-workshops",
    title: "Talleres",
    subtitle:
      "Sesiones grupales prácticas para convertir estrategia en acciones concretas.",
    price: "Consultar precio",
    duration: "Por sesión",
    packageTitle: "Talleres",
    primaryCtaLabel: "Reservar llamada de descubrimiento",
    idealFor: [
      "Familias/profesionales que prefieren formato grupal",
      "Clientes que buscan estructura antes de 1:1",
      "Equipos/comunidades fortaleciendo hábitos financieros",
    ],
    includes: [
      "Entrenamiento práctico en vivo",
      "Plantillas y recursos de implementación",
      "Siguientes pasos accionables",
    ],
    process: [
      "Seleccionas taller según objetivo.",
      "Aplicas herramientas durante la sesión.",
      "Sales con acciones concretas y recursos.",
    ],
    outcome: "Adquieres habilidades aplicables de inmediato con estructura clara.",
  },
  "support-foundations-group": {
    id: "support-foundations-group",
    title: "Programas Base y Grupos Pequeños",
    subtitle:
      "Acompañamiento guiado en grupo para construir rutinas financieras sostenibles.",
    price: "Consultar precio",
    duration: "Formato por programa",
    packageTitle: "Programas Base y Grupos Pequeños",
    primaryCtaLabel: "Reservar llamada de descubrimiento",
    idealFor: [
      "Personas que avanzan mejor con accountability grupal",
      "Clientes construyendo base y disciplina financiera",
      "Quienes buscan apoyo sin un engagement privado completo",
    ],
    includes: [
      "Implementación con grupo reducido",
      "Marco de construcción de hábitos base",
      "Refuerzo práctico con aprendizaje compartido",
    ],
    process: [
      "Ingresas al programa/cohorte adecuado.",
      "Sigues tareas semanales o por etapas.",
      "Revisas progreso y consolidación de rutinas.",
    ],
    outcome: "Consolidas hábitos duraderos con estructura y acompañamiento continuo.",
  },
  "mortgage-preapproval": {
    id: "mortgage-preapproval",
    title: "Planificación de Preaprobación",
    subtitle:
      "Preparación estratégica previa a la solicitud hipotecaria para fortalecer tu posicionamiento.",
    price: "Gratis",
    duration: "Depende del estado del expediente",
    packageTitle: "Planificación de Preaprobación",
    primaryCtaLabel: "Reservar llamada de descubrimiento",
    idealFor: [
      "Compradores en proceso de compra cercano",
      "Clientes con dudas de asequibilidad y documentos",
      "Personas que quieren claridad antes de aplicar",
    ],
    includes: [
      "Revisión de asequibilidad y preparación del expediente",
      "Guía de documentos y secuencia de tiempos",
      "Orientación de escenarios con prestamistas",
    ],
    process: [
      "Revisión de perfil base y horizonte de compra.",
      "Detección de brechas documentales y de capacidad.",
      "Plan de preparación antes de aplicar formalmente.",
    ],
    outcome: "Llegas a preaprobación con mejor preparación y menos sorpresas.",
    scopeNote:
      "La aprobación final depende de underwriting del prestamista y crédito aprobado (O.A.C.).",
  },
  "business-cashflow": {
    id: "business-cashflow",
    title: "Sesión de Estrategia de Negocio y Flujo de Caja",
    subtitle:
      "Sesión enfocada para dueños que necesitan alinear flujo, estabilidad y crecimiento.",
    price: "$395 CAD",
    duration: "Por sesión",
    packageTitle: "Sesión de Estrategia de Negocio y Flujo de Caja",
    primaryCtaLabel: "Reservar llamada de descubrimiento",
    idealFor: [
      "Dueños con presión de flujo de caja",
      "Fundadores evaluando decisiones de corto plazo",
      "Profesionales equilibrando metas personales y negocio",
    ],
    includes: [
      "Mapa de presión actual de flujo de caja",
      "Priorización de decisiones estratégicas",
      "Plan de hitos prácticos inmediatos",
    ],
    process: [
      "Diagnosticamos restricciones actuales.",
      "Priorizamos secuencia de decisiones clave.",
      "Definimos hitos de ejecución de corto plazo.",
    ],
    outcome: "Obtienes mayor claridad de decisión y mejor ejecución táctica.",
  },
  "business-tax": {
    id: "business-tax",
    title: "Sesión de Coordinación para Planificación Fiscal",
    subtitle:
      "Sesión estratégica para preparar prioridades fiscales y coordinación con tu equipo asesor.",
    price: "$395 CAD",
    duration: "Por sesión",
    packageTitle: "Sesión de Coordinación para Planificación Fiscal",
    primaryCtaLabel: "Reservar llamada de descubrimiento",
    idealFor: [
      "Clientes acercándose a decisiones de temporada fiscal",
      "Dueños que necesitan mejor coordinación con su contador",
      "Familias/profesionales que buscan ritmo tributario predecible",
    ],
    includes: [
      "Alineación de prioridades de planificación",
      "Marco de preguntas para tu contador/asesor",
      "Timeline de decisiones y documentación",
    ],
    process: [
      "Revisamos el contexto actual de planificación fiscal.",
      "Definimos preguntas clave y puntos de decisión.",
      "Organizamos una secuencia práctica de coordinación.",
    ],
    outcome: "Entras a planificación fiscal con prioridades claras y menos estrés por plazos.",
    scopeNote:
      "Complementa tu contador/asesor fiscal; resultados finales dependen de CRA y tu profesional tributario.",
  },
};

export function getServiceIds(lang: "en" | "es"): ServiceId[] {
  const data = lang === "en" ? EN : ES;
  return Object.keys(data) as ServiceId[];
}

export function getServiceDetail(
  lang: "en" | "es",
  id: string
): ServiceDetail | null {
  const data = lang === "en" ? EN : ES;
  return data[id as ServiceId] ?? null;
}
