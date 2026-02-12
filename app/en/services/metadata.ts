// app/en/services/metadata.ts
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Services — Coaching, Mortgages & Financial Strategy in Toronto, Ontario",
  description:
    "Start with a free discovery call, then choose Clarity & Direction sessions, Strategic Financial Maps, and specialized mortgage, business, and tax strategy support in Toronto and across Ontario.",
  openGraph: {
    title: "Services — Fanny Samaniego",
    description:
      "Decision-focused financial strategy with a clear path from discovery to strategic maps and specialized support.",
    url: "https://fannysamaniego.com/en/services",
    type: "website",
    locale: "en_CA",
    siteName:
      "Fanny Samaniego — Holistic Financial Consultant | Taxes • Mortgages • Money Strategy",
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
