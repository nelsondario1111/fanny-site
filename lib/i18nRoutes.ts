// lib/i18nRoutes.ts
"use client";

export type Locale = "en" | "es";

/** Human-friendly section names per locale */
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

/** Load the generated slug map (resources/tools) */
type PairDict = Record<string, { en: string; es: string }>;
type GenShape = { resources: PairDict; tools: PairDict };

// If the JSON doesn’t exist yet (first run in dev), fall back to empty maps.
let gen: GenShape = { resources: {}, tools: {} };
try {
  // Using require so this stays simple in a client file; Next will inline it at build
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  gen = require("@/content/i18n-slugs.json");
} catch {
  // no-op: developer hasn’t generated the file yet
}

/**
 * Slug mappings for dynamic content.
 * `static` stays inline; resources/tools are imported from the generated file.
 */
export const I18N_SLUGS: {
  resources: PairDict;
  tools: PairDict;
  static: Record<string, { en: string; es: string }>;
} = {
  resources: gen.resources || {},
  tools: gen.tools || {},
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
};

/* --------------------------- helpers --------------------------- */

export function detectLang(pathname: string): Locale | null {
  if (pathname.startsWith("/en")) return "en";
  if (pathname.startsWith("/es")) return "es";
  return null;
}

export function splitPath(pathname: string): { lang: Locale | null; section: string | null; slugs: string[] } {
  const parts = pathname.split("?")[0].split("#")[0].split("/").filter(Boolean);
  if (parts.length === 0) return { lang: null, section: null, slugs: [] };
  const lang = (parts[0] === "en" || parts[0] === "es" ? (parts[0] as Locale) : null);
  const section = parts[1] || null;
  const slugs = parts.slice(2);
  return { lang, section, slugs };
}

export function mapSection(section: string, target: Locale): string {
  for (const [key, val] of Object.entries(I18N_SECTIONS.en)) {
    if (val === section) return (I18N_SECTIONS as any)[target][key] ?? section;
  }
  for (const [key, val] of Object.entries(I18N_SECTIONS.es)) {
    if (val === section) return (I18N_SECTIONS as any)[target][key] ?? section;
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

export function mapSlug(sectionKey: "resources" | "tools" | "static", currentSlug: string, target: Locale): string | null {
  const dict = (I18N_SLUGS as any)[sectionKey] || {};
  for (const [canonical, variants] of Object.entries<any>(dict)) {
    if (variants.en === currentSlug || variants.es === currentSlug || canonical === currentSlug) {
      return variants[target] || null;
    }
  }
  return null;
}

/** Build the counterpart URL in the target language. */
export function buildAlternateHref(pathname: string, target: Locale): string {
  const { section, slugs } = splitPath(pathname);
  if (!section) return `/${target}`;

  const mappedSection = mapSection(section, target);
  if (slugs.length === 0) return `/${target}/${mappedSection}`;

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
