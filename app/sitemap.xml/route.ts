import { getAllArticles } from "../../lib/getArticles"; // ✅ Adjust path if needed
import { NextResponse } from "next/server";

const BASE_URL = "https://fannysamaniego.com";

export async function GET() {
  const [articlesEn, articlesEs] = await Promise.all([
    getAllArticles("en"), // ✅ Use the correct function name
    getAllArticles("es"),
  ]);

  const staticRoutes = [
    { en: "/en", es: "/es" },
    { en: "/en/about", es: "/es/sobre-mi" },
    { en: "/en/contact", es: "/es/contacto" },
    { en: "/en/budget-calculator", es: "/es/calculadora-presupuesto" },
    { en: "/en/investment", es: "/es/inversion" },
    { en: "/en/mortgage-calculator", es: "/es/calculadora-hipotecaria" },
    { en: "/en/services", es: "/es/servicios" },
    { en: "/en/resources", es: "/es/recursos" },
    { en: "/en/tools", es: "/es/herramientas" },
    { en: "/en/testimonials", es: "/es/testimonios" },
  ];

  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n`;

  for (const { en, es } of staticRoutes) {
    xml += `
      <url>
        <loc>${BASE_URL}${en}</loc>
        <xhtml:link rel="alternate" hreflang="en" href="${BASE_URL}${en}" />
        <xhtml:link rel="alternate" hreflang="es" href="${BASE_URL}${es}" />
      </url>
    `;
  }

  for (const article of articlesEn) {
    xml += `
      <url>
        <loc>${BASE_URL}/en/resources/${article.slug}</loc>
        <xhtml:link rel="alternate" hreflang="es" href="${BASE_URL}/es/recursos/${article.slug}" />
      </url>
    `;
  }

  for (const article of articlesEs) {
    xml += `
      <url>
        <loc>${BASE_URL}/es/recursos/${article.slug}</loc>
        <xhtml:link rel="alternate" hreflang="en" href="${BASE_URL}/en/resources/${article.slug}" />
      </url>
    `;
  }

  xml += `</urlset>`;

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}
