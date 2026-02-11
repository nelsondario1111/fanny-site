// app/es/servicios/metadata.ts
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Servicios — Coaching, Hipotecas y Estrategia Financiera",
  description:
    "Comienza con una llamada de descubrimiento gratis y elige sesiones de Claridad y Dirección, Mapas Financieros Estratégicos y apoyo especializado en hipoteca, negocios e impuestos.",
  openGraph: {
    title: "Servicios — Fanny Samaniego",
    description:
      "Estrategia financiera enfocada en decisiones, con un camino claro de descubrimiento a mapas estratégicos y apoyo especializado.",
    url: "https://fannysamaniego.com/es/servicios",
    type: "website",
    locale: "es_CA",
    siteName: "Fanny Samaniego — Hipotecas • Dinero • Impuestos",
  },
  alternates: {
    canonical: "https://fannysamaniego.com/es/servicios",
    languages: {
      "en-CA": "https://fannysamaniego.com/en/services",
      "es-CA": "https://fannysamaniego.com/es/servicios",
    },
  },
  twitter: {
    card: "summary_large_image",
    creator: "@fannysamaniego",
  },
};
export default metadata;
