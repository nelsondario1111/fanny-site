// /app/en/investment/metadata.ts

const siteUrl = "https://fannysamaniego.com";
const pageUrl = `${siteUrl}/en/investment`;
const image = `${siteUrl}/investment-og.png`; // Replace with your OG image path

const metadata = {
  title: "Investment & Packages | Fanny Samaniego Coaching – Transparent Holistic Pricing",
  description:
    "Explore transparent, heart-centered pricing for holistic financial coaching. Compare packages, book a discovery call, or find group and corporate options. All services in English or Spanish.",
  keywords: [
    "financial coaching",
    "holistic finance",
    "pricing",
    "packages",
    "Toronto",
    "English",
    "Spanish",
    "budget",
    "investments",
    "Fanny Samaniego",
    "workshops",
    "money coaching",
    "group coaching",
  ],
  openGraph: {
    title: "Investment & Packages | Fanny Samaniego Coaching",
    description:
      "Compare holistic financial coaching packages, private sessions, group programs, and workshops with transparent pricing. All services in English or Spanish.",
    url: pageUrl,
    siteName: "Fanny Samaniego Coaching",
    type: "website",
    images: [
      {
        url: image,
        width: 1200,
        height: 630,
        alt: "Investment & Packages – Fanny Samaniego Coaching",
      },
    ],
    locale: "en_CA",
  },
  twitter: {
    card: "summary_large_image",
    title: "Investment & Packages | Fanny Samaniego Coaching",
    description:
      "Transparent, heart-centered pricing for all holistic financial coaching services. Compare all options.",
    images: [image],
    site: "@fannysamaniego", // Add your Twitter handle if you have one
  },
  alternates: {
    canonical: pageUrl,
    languages: {
      "es": `${siteUrl}/es/inversion`,
    },
  },
};

export default metadata;
