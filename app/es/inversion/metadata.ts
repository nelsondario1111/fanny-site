// /app/es/inversion/metadata.ts

const siteUrl = "https://fannysamaniego.com";
const pageUrl = `${siteUrl}/es/inversion`;
const image = `${siteUrl}/investment-og.jpg`; // Use the same OG image, or create a Spanish one if you want!

const metadata = {
  title: "Inversión y Paquetes | Fanny Samaniego Coaching – Tarifas Holísticas Transparentes",
  description:
    "Explora precios transparentes y conscientes para la asesoría financiera holística. Compara paquetes, agenda una llamada de descubrimiento o descubre opciones grupales y corporativas. Todos los servicios en español o inglés.",
  keywords: [
    "coaching financiero",
    "finanzas holísticas",
    "precios",
    "paquetes",
    "Toronto",
    "español",
    "inglés",
    "presupuesto",
    "inversiones",
    "Fanny Samaniego",
    "talleres",
    "coaching de dinero",
    "coaching grupal",
  ],
  openGraph: {
    title: "Inversión y Paquetes | Fanny Samaniego Coaching",
    description:
      "Compara paquetes de coaching financiero holístico, sesiones privadas, programas grupales y talleres con precios transparentes. Todos los servicios en español o inglés.",
    url: pageUrl,
    siteName: "Fanny Samaniego Coaching",
    type: "website",
    images: [
      {
        url: image,
        width: 1200,
        height: 630,
        alt: "Inversión y Paquetes – Fanny Samaniego Coaching",
      },
    ],
    locale: "es_CA",
  },
  twitter: {
    card: "summary_large_image",
    title: "Inversión y Paquetes | Fanny Samaniego Coaching",
    description:
      "Precios claros y conscientes para todos los servicios de coaching financiero holístico. Compara todas las opciones.",
    images: [image],
    site: "@fannysamaniego",
  },
  alternates: {
    canonical: pageUrl,
    languages: {
      "en": `${siteUrl}/en/investment`,
    },
  },
};

export default metadata;
