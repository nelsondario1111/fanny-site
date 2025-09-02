// app/metadata.ts
import type { Metadata } from "next";

/* ============================================================================
   Global SEO for Fanny — Mortgages • Money • Taxes (EN/ES, GTA audience)
   - Centralized defaults for the whole site
   - Canonicals + accurate hreflang pairs using an explicit route map
   - Helpers for generic pages and articles
   Update ALT_PAIRS if you add/rename routes.
============================================================================ */

/** ---------- Brand & environment ---------- */
const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, "") || "http://localhost:3000";

const BRAND = {
  siteName: process.env.NEXT_PUBLIC_SITE_NAME || "Fanny — Mortgages & Money",
  org: "Fanny",
  twitter: process.env.NEXT_PUBLIC_TWITTER || "@yourhandle",
  themeColor: "#1b6b5f", // brand green
  city: "Toronto",
  region: "Ontario",
  country: "Canada",
} as const;

/** Disable indexing globally (e.g., staging) */
const GLOBAL_NOINDEX = process.env.NEXT_PUBLIC_NO_INDEX === "1";

/** ---------- Locales ---------- */
export const LOCALES = { en: "en", es: "es" } as const;
export type Lang = keyof typeof LOCALES;

const DEFAULT_DESC: Record<Lang, string> = {
  en: "Mortgage strategy, practical money behaviour, and tax basics for busy professionals and families in the GTA.",
  es: "Estrategia hipotecaria, hábitos prácticos con el dinero e impuestos básicos para profesionales y familias en el GTA.",
};

/* ============================================================================
   Explicit EN<->ES route pairs.
   - Use exact paths for static pages
   - Use single-star wildcards for path families (e.g., /en/resources/*)
   - Only these pairs produce hreflang alternates; others won’t (avoids 404s)
============================================================================ */
type Pair = { en: `/${string}`; es: `/${string}` };

const ALT_PAIRS: Pair[] = [
  // Homes
  { en: "/en", es: "/es" },

  // Top-level static pages
  { en: "/en/about", es: "/es/sobre-mi" },
  { en: "/en/account", es: "/es/cuenta" },
  { en: "/en/apply", es: "/es/aplicar" },
  { en: "/en/book", es: "/es/reservar" },
  { en: "/en/cancel", es: "/es/cancel" },
  { en: "/en/contact", es: "/es/contacto" },
  { en: "/en/contact/thanks", es: "/es/contacto/gracias" },
  { en: "/en/for-professionals", es: "/es/para-profesionales" },
  { en: "/en/login", es: "/es/iniciar-sesion" },
  { en: "/en/privacy", es: "/es/privacidad" },
  { en: "/en/services", es: "/es/servicios" },
  { en: "/en/subscribe", es: "/es/suscribir" },
  { en: "/en/success", es: "/es/success" },
  { en: "/en/terms", es: "/es/terminos" },
  { en: "/en/testimonials", es: "/es/testimonios" },
  { en: "/en/thank-you", es: "/es/gracias" },

  // Resources (dynamic articles)
  { en: "/en/resources", es: "/es/recursos" },
  { en: "/en/resources/*", es: "/es/recursos/*" },

  // Tools (all calculators/checklists)
  { en: "/en/tools", es: "/es/herramientas" },
  { en: "/en/tools/affordability-stress-test", es: "/es/herramientas/prueba-esfuerzo" },
  { en: "/en/tools/amortization-schedule", es: "/es/herramientas/tabla-amortizacion" },
  { en: "/en/tools/budget-calculator", es: "/es/herramientas/calculadora-presupuesto" },
  { en: "/en/tools/budget-cashflow", es: "/es/herramientas/presupuesto-flujo" },
  { en: "/en/tools/cap-rate-calculator", es: "/es/herramientas/tasa-cap" },
  { en: "/en/tools/closing-costs", es: "/es/herramientas/costos-cierre" },
  { en: "/en/tools/debt-snowball", es: "/es/herramientas/deuda-bola-nieve" },
  { en: "/en/tools/down-payment-insurance", es: "/es/herramientas/pago-inicial-seguro" },
  { en: "/en/tools/dscr-calculator", es: "/es/herramientas/calculadora-dscr" },
  { en: "/en/tools/land-transfer-tax", es: "/es/herramientas/impuesto-transferencia" },
  { en: "/en/tools/mortgage-affordability", es: "/es/herramientas/asequibilidad-hipotecaria" },
  { en: "/en/tools/mortgage-calculator", es: "/es/herramientas/calculadora-hipotecaria" },
  { en: "/en/tools/mortgage-penalty", es: "/es/herramientas/penalidad-hipotecaria" },
  { en: "/en/tools/mortgage-readiness", es: "/es/herramientas/preparacion-hipoteca" },
  { en: "/en/tools/multiplex-readiness", es: "/es/herramientas/preparacion-multiplex" },
  { en: "/en/tools/net-worth", es: "/es/herramientas/patrimonio-neto" },
  { en: "/en/tools/net-worth-tracker", es: "/es/herramientas/seguimiento-patrimonio-neto" },
  { en: "/en/tools/newcomer-checklist", es: "/es/herramientas/lista-recien-llegados" },
  { en: "/en/tools/refinance-blend", es: "/es/herramientas/refinanciar-blend" },
  { en: "/en/tools/rent-vs-buy", es: "/es/herramientas/alquilar-vd-comprar" },
  { en: "/en/tools/rental-cashflow", es: "/es/herramientas/flujo-de-caja-de-alquileres" },
  { en: "/en/tools/tax-prep", es: "/es/herramientas/preparacion-impuestos" },

  // Wildcard to cover any future /en/tools/* <-> /es/herramientas/* siblings
  { en: "/en/tools/*", es: "/es/herramientas/*" },

  // NOTE: /en/guides/dscr-rules has NO Spanish counterpart in your list.
  // Intentionally omitted so hreflang doesn't point to a 404.
];

/* ============================================================================
   Utilities
============================================================================ */
function abs(pathOrUrl?: string): string {
  if (!pathOrUrl) return SITE_URL;
  return /^https?:\/\//i.test(pathOrUrl)
    ? pathOrUrl
    : `${SITE_URL}${pathOrUrl.startsWith("/") ? pathOrUrl : `/${pathOrUrl}`}`;
}

function clean(pathname: string): string {
  if (!pathname) return "/";
  let p = pathname.trim();
  if (!p.startsWith("/")) p = `/${p}`;
  // remove trailing slash except root
  return p !== "/" ? p.replace(/\/+$/g, "") : "/";
}

function starBase(s: string) {
  // "/en/resources/*" -> "/en/resources/"
  return s.endsWith("/*") ? s.slice(0, -1) : s;
}

function matchMapped(pathname: string, to: Lang): string | null {
  const p = clean(pathname);

  // 1) Exact matches first
  for (const pair of ALT_PAIRS) {
    const from = to === "es" ? pair.en : pair.es;
    const toPath = to === "es" ? pair.es : pair.en;
    if (!from.endsWith("/*") && clean(from) === p) return toPath;
  }

  // 2) Wildcard families
  for (const pair of ALT_PAIRS) {
    const from = to === "es" ? pair.en : pair.es;
    const toPath = to === "es" ? pair.es : pair.en;
    if (from.endsWith("/*")) {
      const baseFrom = starBase(from); // includes ending slash
      if (p.startsWith(clean(baseFrom.replace(/\/$/, "")))) {
        const tail = p.slice(baseFrom.length - 1); // keep leading slash on tail
        return clean(starBase(toPath)) + tail;
      }
    }
  }

  return null; // no known counterpart; skip hreflang for that locale
}

function languageAlternatesFor(pathname: string, locale: Lang) {
  const self = new URL(abs(pathname));
  const enPath = locale === "en" ? self.pathname : matchMapped(self.pathname, "en");
  const esPath = locale === "es" ? self.pathname : matchMapped(self.pathname, "es");

  const langs: Record<string, string> = {};
  if (enPath) langs["en-CA"] = new URL(enPath, SITE_URL).toString();
  if (esPath) langs["es-CA"] = new URL(esPath, SITE_URL).toString();

  // x-default -> prefer EN if available, else ES, else self
  const xDefault =
    langs["en-CA"] || langs["es-CA"] || self.toString();
  langs["x-default"] = xDefault;

  return {
    canonical: self.toString(),
    languages: langs,
  } as NonNullable<Metadata["alternates"]>;
}

function ogImages(images?: string | string[]) {
  const arr = Array.isArray(images) ? images : images ? [images] : ["/og.png"];
  return arr.map((i) => ({
    url: abs(i),
    width: 1200,
    height: 630,
    alt: BRAND.siteName,
  }));
}

/* ============================================================================
   Public builders
============================================================================ */
export type BuildOpts = {
  title?: string;
  description?: string;
  path?: string;        // actual route, e.g., "/en/resources"
  locale?: Lang;        // "en" | "es"
  images?: string | string[];
  noIndex?: boolean;
  canonical?: string;   // absolute override if needed
};

export function buildMetadata({
  title,
  description,
  path = "/en",
  locale = "en",
  images,
  noIndex = GLOBAL_NOINDEX,
  canonical,
}: BuildOpts = {}): Metadata {
  const url = canonical || abs(path);
  const desc = description || DEFAULT_DESC[locale];
  const fullTitle = title ? `${title} | ${BRAND.siteName}` : BRAND.siteName;

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: BRAND.siteName,
      template: `%s | ${BRAND.siteName}`,
    },
    description: desc,
    alternates: languageAlternatesFor(new URL(url).pathname, locale),
    openGraph: {
      type: "website",
      url,
      title: fullTitle,
      description: desc,
      siteName: BRAND.siteName,
      locale: locale === "es" ? "es_CA" : "en_CA",
      images: ogImages(images),
    },
    twitter: {
      card: "summary_large_image",
      site: BRAND.twitter,
      creator: BRAND.twitter,
      title: fullTitle,
      description: desc,
      images: (Array.isArray(images) ? images : images ? [images] : ["/og.png"]).map(abs),
    },
    robots: {
      index: !noIndex,
      follow: !noIndex,
      googleBot: {
        index: !noIndex,
        follow: !noIndex,
        "max-snippet": -1,
        "max-image-preview": "large",
        "max-video-preview": -1,
      },
    },
    keywords: [
      // EN
      "mortgage broker", "mortgage strategy", "pre-approval", "refinance",
      "cash flow", "budgeting", "credit score", "RRSP", "TFSA",
      "tax planning", "real estate investing", "Toronto", "GTA",
      // ES
      "hipoteca", "preaprobación", "refinanciación", "flujo de caja",
      "puntaje crediticio", "impuestos", "inversión inmobiliaria", "Toronto", "GTA",
    ],
    category: "Financial Services",
    creator: BRAND.org,
    publisher: BRAND.org,
    applicationName: BRAND.siteName,
    manifest: "/site.webmanifest",
    icons: {
      icon: [
        { url: "/favicon.ico" },
        { url: "/icon-192.png", type: "image/png", sizes: "192x192" },
        { url: "/icon-512.png", type: "image/png", sizes: "512x512" },
      ],
      apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
      shortcut: ["/favicon.ico"],
    },
    themeColor: BRAND.themeColor,
    colorScheme: "light",
    formatDetection: { telephone: false, address: false, email: false },
    verification: {
      google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
      me: [process.env.NEXT_PUBLIC_VERIFICATION_ME || ""].filter(Boolean),
    },
    other: {
      "geo.region": "CA-ON",
      "geo.placename": `${BRAND.city}, ${BRAND.region}, ${BRAND.country}`,
    },
  };
}

export type ArticleOpts = BuildOpts & {
  publishedTime?: string | Date;
  modifiedTime?: string | Date;
  authors?: string[];
  tags?: string[];
};

export function buildArticleMetadata(opts: ArticleOpts): Metadata {
  const base = buildMetadata(opts);
  const publishedTime =
    opts.publishedTime ? new Date(opts.publishedTime).toISOString() : undefined;
  const modifiedTime =
    opts.modifiedTime ? new Date(opts.modifiedTime).toISOString() : undefined;

  return {
    ...base,
    openGraph: {
      ...base.openGraph,
      type: "article",
      authors: opts.authors && opts.authors.length ? opts.authors : [BRAND.org],
      tags: opts.tags,
      publishedTime,
      modifiedTime,
    },
  };
}

/* ============================================================================
   Optional JSON-LD helpers (import and inject if desired)
============================================================================ */
export function siteJsonLd(locale: Lang = "en") {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: BRAND.org,
    url: SITE_URL,
    logo: abs("/icon-512.png"),
    sameAs: [],
    areaServed: "CA",
    address: {
      "@type": "PostalAddress",
      addressLocality: BRAND.city,
      addressRegion: "ON",
      addressCountry: "CA",
    },
    description: DEFAULT_DESC[locale],
  };
}

export function articleJsonLd({
  title,
  description,
  path = "/en",
  images,
  publishedTime,
  modifiedTime,
  authors,
  locale = "en",
}: ArticleOpts) {
  const url = abs(path);
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title || BRAND.siteName,
    description: description || DEFAULT_DESC[locale],
    mainEntityOfPage: url,
    image: (Array.isArray(images) ? images : images ? [images] : ["/og.png"]).map(abs),
    datePublished: publishedTime ? new Date(publishedTime).toISOString() : undefined,
    dateModified: modifiedTime ? new Date(modifiedTime).toISOString() : undefined,
    author: (authors && authors.length ? authors : [BRAND.org]).map((name) => ({
      "@type": "Person",
      name,
    })),
    publisher: {
      "@type": "Organization",
      name: BRAND.org,
      logo: { "@type": "ImageObject", url: abs("/icon-512.png") },
    },
  };
}

/** ---------- Default export used by root layout ---------- */
export const siteMetadata: Metadata = buildMetadata({
  path: "/en", // pick canonical default home
  locale: "en",
});
