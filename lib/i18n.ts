// lib/i18n.ts
"use client";

import type { Locale } from "./i18nRoutes";
export type { Locale } from "./i18nRoutes";

export const isLocale = (v: unknown): v is Locale => v === "en" || v === "es";

export const useLangFromPath = (pathname: string): Locale =>
  pathname.startsWith("/es") ? "es" : "en";

// tiny runtime translator: t("EN", "ES")
export const t = (lang: Locale, en: string, es: string) => (lang === "en" ? en : es);

// Re-export route helpers so consumers import from one place if preferred
export {
  I18N_SECTIONS,
  I18N_SLUGS,
  detectLang,
  splitPath,
  mapSection,
  mapSlug,
  buildAlternateHref,
} from "./i18nRoutes";
