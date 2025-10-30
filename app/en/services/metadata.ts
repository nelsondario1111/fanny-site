// app/en/services/metadata.ts
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Services — Coaching, Mortgages & Financial Strategy",
  description:
    "Explore holistic financial and mortgage services for professionals, families, and business owners in Toronto. Calm, bilingual support for every stage of your financial life.",
  openGraph: {
    title: "Services — Fanny Samaniego",
    description:
      "Holistic coaching and mortgage solutions for professionals and families in Toronto.",
    url: "https://fannysamaniego.com/en/services",
    type: "website",
    locale: "en_CA",
    siteName: "Fanny Samaniego — Mortgages • Money • Taxes",
  },
  alternates: {
    canonical: "https://fannysamaniego.com/en/services",
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
