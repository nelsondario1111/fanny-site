import type { Metadata } from "next";

const metadata: Metadata = {
  metadataBase: new URL("https://www.fannysamaniego.com"),
  title: "Free 10-Year Tax Review — Missed Benefits & Refunds | Fanny Samaniego",
  description:
    "Recover missed CRA tax refunds and benefits with a 10-year holistic review. Free 15-min call to check if you're eligible. Bilingual EN/ES support.",
  openGraph: {
    title: "Free 10-Year Tax Review — Fanny Samaniego",
    description:
      "You may be owed hundreds in tax refunds from the CRA. Book a free 15-min call to find out.",
    url: "https://www.fannysamaniego.com/en/tax-review",
    type: "website",
    locale: "en_CA",
    siteName: "Fanny Samaniego — Mortgages • Money • Taxes",
    images: [
      {
        url: "https://www.fannysamaniego.com/og/og-tax-review-en.png", // 🔥 absolute path
        width: 1200,
        height: 630,
        alt: "Fanny Samaniego | Free 10-Year Tax Review | Recover Missed CRA Refunds",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    creator: "@fannysamaniego",
    title: "Free 10-Year Tax Review — Fanny Samaniego",
    description:
      "You may be owed hundreds in tax refunds from the CRA. Book a free 15-min call to find out.",
    images: ["https://www.fannysamaniego.com/og/og-tax-review-en.png"], // 🔥 absolute path
  },
  alternates: {
    canonical: "https://www.fannysamaniego.com/en/tax-review",
    languages: {
      "en-CA": "https://www.fannysamaniego.com/en/tax-review",
      "es-CA": "https://www.fannysamaniego.com/es/revision-impuestos",
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
