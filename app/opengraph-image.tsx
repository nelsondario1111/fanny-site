// app/opengraph-image.tsx
import { NextRequest } from "next/server";
import { renderOG, OG_SIZE, OG_CONTENT_TYPE } from "./_og/render";

export const runtime = "edge";
export const contentType = OG_CONTENT_TYPE;
export const size = OG_SIZE;

// Optional: basic path->title mapping for static pages
const TITLES: Record<string, { en: string; es: string }> = {
  "/en": { en: "Mortgage Strategy for the GTA", es: "Estrategia Hipotecaria para el GTA" },
  "/en/services": { en: "Services", es: "Servicios" },
  "/en/resources": { en: "Helpful Articles & Guides", es: "Artículos y Guías Útiles" },
  "/en/tools": { en: "Calculators & Checklists", es: "Calculadoras y Listas" },
  "/en/about": { en: "About Fanny", es: "Sobre mí" },
  "/en/contact": { en: "Contact", es: "Contacto" },

  "/es": { en: "Mortgage Strategy (ES)", es: "Estrategia Hipotecaria" },
  "/es/servicios": { en: "Services (ES)", es: "Servicios" },
  "/es/recursos": { en: "Resources (ES)", es: "Artículos y Guías Útiles" },
  "/es/herramientas": { en: "Tools (ES)", es: "Calculadoras y Listas" },
  "/es/sobre-mi": { en: "About (ES)", es: "Sobre mí" },
  "/es/contacto": { en: "Contact (ES)", es: "Contacto" },
};

export default async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const pathname = url.pathname || "/";
  const locale = pathname.startsWith("/es") ? "es" : "en";

  // Optional query overrides: ?t=Custom%20Title&st=Subtitle
  const t = url.searchParams.get("t") || undefined;
  const st = url.searchParams.get("st") || undefined;

  const mapped = TITLES[pathname];
  const title = t ?? (mapped ? mapped[locale] : undefined);

  return renderOG({
    title,
    subtitle: st,
    locale: locale as "en" | "es",
    path: pathname,
  });
}
