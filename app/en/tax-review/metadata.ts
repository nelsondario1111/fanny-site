import type { Metadata } from "next";

const metadata: Metadata = {
  metadataBase: new URL("https://fannysamaniego.com"),
  title: "Free 10-Year Tax Review — Missed Benefits & Refunds | Fanny Samaniego",
  description:
    "Recover missed CRA tax refunds and benefits with a 10-year holistic review. Free 15-min call to check if you're eligible. Bilingual EN/ES support.",
  openGraph: {
    title: "Free 10-Year Tax Review — Fanny Samaniego",
    description:
      "You may be owed hundreds in tax refunds from the CRA. Book a free 15-min call to find out.",
    url: "https://fannysamaniego.com/en/tax-review",
    type: "website",
    locale: "en_CA",
    siteName: "Fanny Samaniego — Mortgages • Money • Taxes",
    images: [
      {
        url: "/og/og-tax-review-en.png",
        width: 1200,
        height: 630,
        alt: "Recover missed tax benefits. Free 10-year review.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    creator: "@fannysamaniego",
    title: "Free 10-Year Tax Review — Fanny Samaniego",
    description:
      "You may be owed hundreds in tax refunds from the CRA. Book a free 15-min call to find out.",
    images: ["/og/og-tax-review-en.png"],
  },
  alternates: {
    canonical: "https://fannysamaniego.com/en/tax-review",
    languages: {
      "en-CA": "https://fannysamaniego.com/en/tax-review",
      "es-CA": "https://fannysamaniego.com/es/revision-impuestos",
    },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  category: "Tax Review",
};

export default metadata;
