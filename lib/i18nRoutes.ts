// lib/i18nRoutes.ts
"use client";

export type Locale = "en" | "es";

/** ======================= Section names per locale ======================= */
export const I18N_SECTIONS = {
  en: {
    home: "",
    about: "about",
    services: "services",
    resources: "resources",
    tools: "tools",
    testimonials: "testimonials",
    contact: "contact",
    privacy: "privacy",
  },
  es: {
    home: "",
    about: "sobre-mi",
    services: "servicios",
    resources: "recursos",
    tools: "herramientas",
    testimonials: "testimonios",
    contact: "contacto",
    privacy: "privacidad",
  },
} as const;

type SectionKey = keyof typeof I18N_SECTIONS["en"];

import slugMap from "@/content/i18n-slugs.json";

/** ======================= Static slug map loading ======================= */
type PairDict = Record<string, { en: string; es: string }>;
type GenShape = { resources: PairDict; tools: PairDict };
const gen: GenShape = {
  resources: slugMap.resources ?? {},
  tools: slugMap.tools ?? {},
};

/** ======================= Static slug dictionary ======================= */
export const I18N_SLUGS: {
  resources: PairDict;
  tools: PairDict;
  static: Record<SectionKey, { en: string; es: string }>;
} = {
  resources: gen.resources,
  tools: gen.tools,
  static: {
    home: { en: "", es: "" },
    about: { en: "about", es: "sobre-mi" },
    services: { en: "services", es: "servicios" },
    resources: { en: "resources", es: "recursos" },
    tools: { en: "tools", es: "herramientas" },
    testimonials: { en: "testimonials", es: "testimonios" },
    contact: { en: "contact", es: "contacto" },
    privacy: { en: "privacy", es: "privacidad" },
  },
} as const;

/* --------------------------- Helpers --------------------------- */

export function detectLang(pathname: string): Locale | null {
  if (pathname.startsWith("/en")) return "en";
  if (pathname.startsWith("/es")) return "es";
  return null;
}

export function splitPath(pathname: string): {
  lang: Locale | null;
  section: string | null;
  slugs: string[];
} {
  const parts = pathname.split("?")[0].split("#")[0].split("/").filter(Boolean);
  if (parts.length === 0) return { lang: null, section: null, slugs: [] };
  const lang = parts[0] === "en" || parts[0] === "es" ? (parts[0] as Locale) : null;
  const section = parts[1] || null;
  const slugs = parts.slice(2);
  return { lang, section, slugs };
}

export function mapSection(section: string, target: Locale): string {
  const entriesEn = Object.entries(I18N_SECTIONS.en) as [SectionKey, string][];
  for (const [key, val] of entriesEn) {
    if (val === section) return I18N_SECTIONS[target][key];
  }
  const entriesEs = Object.entries(I18N_SECTIONS.es) as [SectionKey, string][];
  for (const [key, val] of entriesEs) {
    if (val === section) return I18N_SECTIONS[target][key];
  }
  return section;
}

function normalizeSectionKey(mappedSection: string): "resources" | "tools" | "static" {
  const en = I18N_SECTIONS.en;
  const es = I18N_SECTIONS.es;
  if (mappedSection === en.resources || mappedSection === es.resources) return "resources";
  if (mappedSection === en.tools || mappedSection === es.tools) return "tools";
  return "static";
}

export function mapSlug(
  sectionKey: "resources" | "tools" | "static",
  currentSlug: string,
  target: Locale
): string | null {
  const dict: PairDict | Record<string, { en: string; es: string }> =
    sectionKey === "static" ? I18N_SLUGS.static : I18N_SLUGS[sectionKey];
  const entries = Object.entries(dict) as [string, { en: string; es: string }][];
  for (const [canonical, variants] of entries) {
    if (variants.en === currentSlug || variants.es === currentSlug || canonical === currentSlug) {
      return variants[target] ?? null;
    }
  }
  return null;
}

/** ======================= Build the alternate URL ======================= */
export function buildAlternateHref(pathname: string, target: Locale): string {
  // Normalize: remove query, hash, and trailing slashes
  const cleanPath = pathname.split("?")[0].split("#")[0].replace(/\/+$/, "");
  const { section, slugs } = splitPath(cleanPath);
  if (!section) return `/${target}`;

  const mappedSection = mapSection(section, target);

  /** ✅ Custom cross-language pages (non-section pages) */
  const CUSTOM_MAP: Record<string, Record<Locale, string>> = {
    "/en/tax-review": { en: "/en/tax-review", es: "/es/revision-impuestos" },
    "/es/revision-impuestos": { en: "/en/tax-review", es: "/es/revision-impuestos" },
    "/en/book": { en: "/en/book", es: "/es/reservar" },
    "/es/reservar": { en: "/en/book", es: "/es/reservar" },
    "/en/kitchen-table-conversations": {
      en: "/en/kitchen-table-conversations",
      es: "/es/conversaciones-en-la-mesa",
    },
    "/es/conversaciones-en-la-mesa": {
      en: "/en/kitchen-table-conversations",
      es: "/es/conversaciones-en-la-mesa",
    },
    "/en/client-library": {
      en: "/en/client-library",
      es: "/es/biblioteca-clientes",
    },
    "/es/biblioteca-clientes": {
      en: "/en/client-library",
      es: "/es/biblioteca-clientes",
    },
  };

  // Direct match first
  const match = CUSTOM_MAP[cleanPath];
  if (match && match[target]) return match[target];

  // Regular section mapping
  const sectionKey = normalizeSectionKey(mappedSection);
  const candidate = slugs[slugs.length - 1];
  const mapped = mapSlug(sectionKey, candidate, target);

  if (mapped) {
    const prefix = `/${target}/${mappedSection}`;
    if (slugs.length > 1) {
      const middle = slugs.slice(0, -1).join("/");
      return `${prefix}/${middle ? middle + "/" : ""}${mapped}`;
    }
    return `${prefix}/${mapped}`;
  }

  if (slugs.length === 1) return `/${target}/${mappedSection}/${slugs[0]}`;
  return `/${target}/${mappedSection}`;
}
