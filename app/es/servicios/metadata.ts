// app/es/servicios/metadata.ts
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Servicios — Coaching, Hipotecas y Estrategia Financiera",
  description:
    "Explora servicios financieros y de hipoteca para profesionales, familias y empresarios en Toronto. Acompañamiento bilingüe, claro y humano.",
  openGraph: {
    title: "Servicios — Fanny Samaniego",
    description:
      "Coaching y soluciones hipotecarias integrales para profesionales y familias en Toronto.",
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
