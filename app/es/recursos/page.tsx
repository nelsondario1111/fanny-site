import RecursosClient, { type ClientArticle } from "./RecursosClient";
import { getAllArticles } from "@/lib/getArticles";

/* ===================== Etiquetas canónicas, alias y helpers ===================== */
const CANON_TAGS = [
  "mortgages",
  "real-estate-investing",
  "financial-planning",
  "tax-planning",
  "wealth-building",
  "newcomers",
  "entrepreneurs",
  "holistic-approach",
  "human-design",
] as const;
type CanonTag = (typeof CANON_TAGS)[number];

const DISPLAY_LABELS: Record<CanonTag, string> = {
  mortgages: "Hipotecas",
  "real-estate-investing": "Inversión Inmobiliaria",
  "financial-planning": "Planificación Financiera",
  "tax-planning": "Planificación Fiscal",
  "wealth-building": "Construcción de Patrimonio",
  newcomers: "Recién Llegados",
  entrepreneurs: "Emprendedores",
  "holistic-approach": "Enfoque Holístico",
  "human-design": "Diseño Humano",
};

// Mapeo tolerante para etiquetas cercanas en front-matter
const TAG_ALIASES: Record<string, CanonTag> = {
  // Hipotecas
  "primer-comprador": "mortgages",
  "primera-vivienda": "mortgages",
  "pre-aprobacion": "mortgages",
  preaprobacion: "mortgages",
  "pre-approval": "mortgages",
  preapproval: "mortgages",

  // Inversión inmobiliaria
  "bienes-raices": "real-estate-investing",
  inmobiliario: "real-estate-investing",
  alquiler: "real-estate-investing",
  rentas: "real-estate-investing",
  "propiedad-de-alquiler": "real-estate-investing",
  arrendador: "real-estate-investing",

  // Planificación financiera
  "flujo-de-caja": "financial-planning",
  "flujo-de-efectivo": "financial-planning",
  "cash-flow": "financial-planning",
  presupuesto: "financial-planning",
  rrsp: "financial-planning",
  tfsa: "financial-planning",

  // Planificación fiscal
  impuestos: "tax-planning",
  "impuestos-autonomos": "tax-planning",
  "self-employed-taxes": "tax-planning",

  // Patrimonio
  inversiones: "wealth-building",
  inversion: "wealth-building",
  "patrimonio-neto": "wealth-building",
  "net-worth": "wealth-building",
  networth: "wealth-building",

  // Recién llegados
  "recién-llegados": "newcomers",
  "recien-llegados": "newcomers",
  "nuevo-en-canada": "newcomers",
  inmigrantes: "newcomers",

  // Emprendedores
  autonomos: "entrepreneurs",
  autónomos: "entrepreneurs",
  "trabajador-por-cuenta-propia": "entrepreneurs",
  "small-business": "entrepreneurs",
  "pequena-empresa": "entrepreneurs",
  "pequeña-empresa": "entrepreneurs",

  // Holístico / Diseño Humano
  holistico: "holistic-approach",
  holístico: "holistic-approach",
  "human design": "human-design",
  "diseno-humano": "human-design",
  "diseño-humano": "human-design",
} as const;

const CATEGORY_TO_TAG: Record<string, CanonTag> = {
  // ES + fallback EN
  hipotecas: "mortgages",
  "inversión inmobiliaria": "real-estate-investing",
  "inversion inmobiliaria": "real-estate-investing",
  "planificación financiera": "financial-planning",
  "planificacion financiera": "financial-planning",
  "planificación fiscal": "tax-planning",
  "planificacion fiscal": "tax-planning",
  "construcción de patrimonio": "wealth-building",
  "construccion de patrimonio": "wealth-building",
  "recién llegados": "newcomers",
  "recien llegados": "newcomers",
  emprendedores: "entrepreneurs",
  "enfoque holístico": "holistic-approach",
  "enfoque holistico": "holistic-approach",
  "diseño humano": "human-design",
  "diseno humano": "human-design",

  // EN fallbacks
  mortgages: "mortgages",
  "real estate investing": "real-estate-investing",
  "financial planning": "financial-planning",
  "tax planning": "tax-planning",
  "wealth building": "wealth-building",
  newcomers: "newcomers",
  entrepreneurs: "entrepreneurs",
  "holistic approach": "holistic-approach",
  "human design": "human-design",
};

const norm = (s: unknown) => String(s ?? "").trim().toLowerCase();
const kebab = (s: unknown) => norm(s).replace(/\s+/g, "-");

function canonicalizeTags(maybe: unknown): CanonTag[] {
  const arr = Array.isArray(maybe) ? maybe : [];
  const out: CanonTag[] = [];
  for (const raw of arr) {
    const k = kebab(raw);
    const mapped = TAG_ALIASES[k] ?? (k as CanonTag);
    if ((CANON_TAGS as readonly string[]).includes(mapped)) out.push(mapped);
  }
  return Array.from(new Set(out));
}

function deriveFromCategory(category?: string | null): CanonTag[] {
  if (!category) return [];
  const key = CATEGORY_TO_TAG[norm(category)] || (TAG_ALIASES[kebab(category)] as CanonTag);
  return key && (CANON_TAGS as readonly string[]).includes(key) ? [key] : [];
}

/* =============================== Personas =============================== */
type PersonaKey =
  | "families"
  | "professionals"
  | "newcomers"
  | "entrepreneurs"
  | "investors"
  | "holistic";

type Persona = {
  key: PersonaKey;
  label: string;
  tags: CanonTag[];
  includeSlugs?: string[];
};

type PersonaIndex = {
  key: PersonaKey;
  label: string;
  slugs: string[];
  count: number;
};

/* ============================ TagsIndex (para eliminar any) ============================ */
type TagsIndex = {
  articles: { slug: string; title: string; category: string; tags: string[] }[];
  tags: Record<string, { count: number; slugs: string[] }>;
  categories: Record<string, { count: number; slugs: string[] }>;
  personas: Record<PersonaKey, { label: string; slugs: string[]; count: number }>;
};

/* ================================ Página ================================= */
export default async function Page() {
  // 1) Cargar artículos (ES)
  const articlesRaw = (await getAllArticles("es")) ?? [];

  // 2) Normalizar + adjuntar etiquetas canónicas; fallback a categoría si hace falta
  const processed: ClientArticle[] = articlesRaw.map((a) => {
    const readingTime =
      typeof a.readingTimeMin === "number" && a.readingTimeMin > 0
        ? `${a.readingTimeMin} min de lectura`
        : a.readingTime ?? null;

    const canonTags = canonicalizeTags(a.tags);
    const withFallback = canonTags.length ? canonTags : deriveFromCategory(a.category);

    return {
      slug: a.slug,
      title: a.title,
      excerpt: a.excerpt ?? null,
      summary: a.summary ?? null,
      category: a.category ?? null,
      tags: withFallback,
      date: a.date ?? null,
      readingTime,
      image: a.image ?? null,
      hero: a.hero ?? null,
      ogImage: a.ogImage ?? null,
    };
  });

  // 3) Índice por etiquetas (conteos + slugs)
  const tagCounts = Object.fromEntries(
    (CANON_TAGS as readonly CanonTag[]).map((t) => [t, { count: 0, slugs: [] as string[] }])
  ) as Record<CanonTag, { count: number; slugs: string[] }>;

  for (const a of processed) {
    for (const t of (a.tags as CanonTag[] | undefined) ?? []) {
      tagCounts[t].count += 1;
      tagCounts[t].slugs.push(a.slug);
    }
  }

  // 4) Personas (semillas solo con slugs que existen hoy)
  const personas: Persona[] = [
    {
      key: "families",
      label: "Familias y Parejas",
      tags: ["financial-planning", "wealth-building", "mortgages"],
      includeSlugs: ["5-steps-to-financial-freedom", "mindful-spending-aligning-your-budget-with-your-values"],
    },
    {
      key: "professionals",
      label: "Profesionales",
      tags: ["financial-planning", "wealth-building", "tax-planning"],
      includeSlugs: ["mindful-spending-aligning-your-budget-with-your-values"],
    },
    {
      key: "newcomers",
      label: "Recién Llegados",
      tags: ["newcomers", "mortgages", "financial-planning"],
      includeSlugs: [],
    },
    {
      key: "entrepreneurs",
      label: "Emprendedores y Autónomos",
      tags: ["entrepreneurs", "tax-planning", "financial-planning"],
      includeSlugs: ["holistic-tax-planning-for-the-self-employed"],
    },
    {
      key: "investors",
      label: "Inversionistas Inmobiliarios",
      tags: ["real-estate-investing", "mortgages", "wealth-building"],
      includeSlugs: [
        "buying-your-first-multi-unit-property",
        "rental-property-and-taxes-what-first-time-landlords-need-to-know",
      ],
    },
    {
      key: "holistic",
      label: "Holístico y Diseño Humano",
      tags: ["holistic-approach", "human-design", "financial-planning"],
      includeSlugs: [],
    },
  ];

  const personaIndex: PersonaIndex[] = personas.map((p) => {
    const set = new Set<string>();
    for (const t of p.tags) tagCounts[t].slugs.forEach((s) => set.add(s));
    (p.includeSlugs ?? []).forEach((s) => set.add(s));
    const slugs = [...set].filter((s) => processed.some((a) => a.slug === s));
    return { key: p.key, label: p.label, slugs, count: slugs.length };
  });

  // 5) Objeto TagsIndex para el cliente (filtros/personas)
  const tagsIndex: TagsIndex = {
    articles: processed.map((a) => ({
      slug: a.slug,
      title: a.title,
      category: a.category ?? "",
      tags: (a.tags ?? []) as string[],
    })),
    tags: tagCounts, // CanonTag keys are assignable to string keys
    categories: Object.fromEntries(
      (CANON_TAGS as readonly CanonTag[]).map((t) => [
        DISPLAY_LABELS[t],
        { count: tagCounts[t].count, slugs: tagCounts[t].slugs },
      ])
    ) as Record<string, { count: number; slugs: string[] }>,
    personas: Object.fromEntries(
      personaIndex.map((p) => [p.key, { label: p.label, slugs: p.slugs, count: p.count }])
    ) as Record<PersonaKey, { label: string; slugs: string[]; count: number }>,
  };

  // 6) Destacados — incluir solo slugs existentes en ES
  const preferredFeatured = [
    "5-steps-to-financial-freedom",
    "buying-your-first-multi-unit-property",
    "rental-property-and-taxes-what-first-time-landlords-need-to-know",
    "tax-planning-for-peace-of-mind",
    "mindful-spending-aligning-your-budget-with-your-values",
  ];
  const existing = new Set(processed.map((a) => a.slug));
  const featuredSlugs = preferredFeatured.filter((s) => existing.has(s));

  // 7) Etiquetas bonitas para las pastillas superiores
  const categories = (CANON_TAGS as readonly CanonTag[]).map((t) => DISPLAY_LABELS[t]);

  // 8) Vistas
  const views: Array<{ key: string; label: string }> = [
    { key: "grid", label: "Cuadrícula" },
    { key: "list", label: "Lista" },
  ];

  return (
    <RecursosClient
      articles={processed}
      categories={categories}
      personas={personaIndex}
      featuredSlugs={featuredSlugs}
      views={views}
      ctaHref="/es/contacto?intent=pregunta"
      newsletterHref="/es/suscribirse"
      tagsData={tagsIndex}
    />
  );
}
