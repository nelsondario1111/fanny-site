// app/metadata.ts
import type { Metadata } from "next";

/* ============================================================================
   Global SEO for Fanny — Mortgages • Money • Taxes (EN/ES, GTA audience)
   - Centralized defaults for the whole site
   - Canonicals + hreflang alternates through explicit route pairs
   - Handles both global and page-specific OpenGraph images
============================================================================ */

/** ---------- Brand & environment ---------- */
const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, "") ||
  "https://fannysamaniego.com";

const BRAND = {
  siteName: process.env.NEXT_PUBLIC_SITE_NAME || "Fanny Samaniego — Mortgages • Money • Taxes",
  org: "Fanny Samaniego",
  twitter: process.env.NEXT_PUBLIC_TWITTER || "@fannysamaniego",
  themeColor: "#1b6b5f",
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
  en: "Mortgage strategy, money behaviour, and tax planning for busy professionals and families in the GTA.",
  es: "Estrategia hipotecaria, hábitos financieros y planificación de impuestos para profesionales y familias en el GTA.",
};

/* ============================================================================
   Explicit EN<->ES route pairs for hreflang
============================================================================ */
type Pair = { en: `/${string}`; es: `/${string}` };

const ALT_PAIRS: Pair[] = [
  { en: "/en", es: "/es" },
  { en: "/en/about", es: "/es/sobre-mi" },
  { en: "/en/services", es: "/es/servicios" },
  { en: "/en/tax-review", es: "/es/revision-impuestos" },
  { en: "/en/resources", es: "/es/recursos" },
  { en: "/en/tools", es: "/es/herramientas" },
  { en: "/en/contact", es: "/es/contacto" },
  { en: "/en/book", es: "/es/reservar" },
  { en: "/en/privacy", es: "/es/privacidad" },
  { en: "/en/terms", es: "/es/terminos" },
  { en: "/en/thank-you", es: "/es/gracias" },
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

function clean(path: string): string {
  if (!path) return "/";
  const p = path.trim().replace(/\/+$/g, "");
  return p.startsWith("/") ? p : `/${p}`;
}

function starBase(s: string) {
  return s.endsWith("/*") ? s.slice(0, -1) : s;
}

function matchMapped(pathname: string, to: Lang): string | null {
  const p = clean(pathname);
  for (const pair of ALT_PAIRS) {
    const from = to === "es" ? pair.en : pair.es;
    const toPath = to === "es" ? pair.es : pair.en;
    if (clean(from) === p) return toPath;
  }
  return null;
}

function languageAlternatesFor(pathname: string, locale: Lang) {
  const self = new URL(abs(pathname));
  const enPath = locale === "en" ? self.pathname : matchMapped(self.pathname, "en");
  const esPath = locale === "es" ? self.pathname : matchMapped(self.pathname, "es");

  const langs: Record<string, string> = {};
  if (enPath) langs["en-CA"] = abs(enPath);
  if (esPath) langs["es-CA"] = abs(esPath);
  langs["x-default"] = langs["en-CA"] || langs["es-CA"] || abs(pathname);

  return {
    canonical: abs(pathname),
    languages: langs,
  } as NonNullable<Metadata["alternates"]>;
}

function ogImages(images?: string | string[]) {
  const arr = Array.isArray(images)
    ? images
    : images
    ? [images]
    : ["/og/og-default.png"];
  return arr.map((i) => ({
    url: abs(i),
    width: 1200,
    height: 630,
    alt: "Fanny Samaniego — Mortgages, Money, and Taxes",
  }));
}
/* ============================================================================
   Builders
============================================================================ */

export type BuildOpts = {
  title?: string;
  description?: string;
  path?: string;        // e.g. "/en/tax-review"
  locale?: Lang;        // "en" | "es"
  images?: string | string[];
  noIndex?: boolean;
  canonical?: string;
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
  const fullTitle = title
    ? `${title} | ${BRAND.siteName}`
    : BRAND.siteName;

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
      images: (Array.isArray(images) ? images : images ? [images] : ["/og/og-default.png"]).map(abs),
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
      "mortgage broker", "mortgage strategy", "pre-approval", "refinance",
      "cash flow", "budgeting", "credit score", "RRSP", "TFSA",
      "tax planning", "real estate investing", "Toronto", "GTA",
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

/* ============================================================================
   Article metadata builder
============================================================================ */
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
   Optional JSON-LD helpers
============================================================================ */
export function siteJsonLd(locale: Lang = "en") {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: BRAND.org,
    url: SITE_URL,
    logo: abs("/icon-512.png"),
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
    image: (Array.isArray(images) ? images : images ? [images] : ["/og/og-default.png"]).map(abs),
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
  path: "/en",
  locale: "en",
});
