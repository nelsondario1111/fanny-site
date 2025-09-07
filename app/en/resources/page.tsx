// app/en/resources/page.tsx
import ResourcesClient, { type ClientArticle } from "./ResourcesClient";
import { getAllArticles } from "@/lib/getArticles";
import type { Metadata } from "next";

/************************* SEO *************************/
export const metadata: Metadata = {
  title: "Helpful Tools & Articles | Resources (EN)",
  description:
    "Short, practical reads and calculators on mortgages, real-estate investing, tax planning, and money habits—bilingual EN/ES.",
  alternates: { canonical: "/en/resources" },
  openGraph: {
    title: "Helpful Tools & Articles | Fanny Samaniego",
    description:
      "Short, practical reads and calculators on mortgages, real-estate investing, tax planning, and money habits—bilingual EN/ES.",
    url: "/en/resources",
    type: "website",
  },
};

// Helpful for ISR builds so the list refreshes without a full redeploy.
export const revalidate = 300; // seconds

/* ===================== Canonical tags, aliases & helpers ===================== */
const CANON_TAGS = [
  "mortgages",
  "real-estate-investing",
  "financial-planning",
  "tax-planning",
  "wealth-building",
  "newcomers",
  "entrepreneurs",
  "holistic-approach",
  "human-design",
] as const;
type CanonTag = (typeof CANON_TAGS)[number];

const DISPLAY_LABELS: Record<CanonTag, string> = {
  mortgages: "Mortgages",
  "real-estate-investing": "Real Estate Investing",
  "financial-planning": "Financial Planning",
  "tax-planning": "Tax Planning",
  "wealth-building": "Wealth Building",
  newcomers: "Newcomers",
  entrepreneurs: "Entrepreneurs",
  "holistic-approach": "Holistic Approach",
  "human-design": "Human Design",
};

// Tolerant mapping so near-miss tags in front-matter still count
const TAG_ALIASES: Record<string, CanonTag> = {
  // Mortgages
  "first-time-buyer": "mortgages",
  "first-home": "mortgages",
  "pre-approval": "mortgages",
  preapproval: "mortgages",

  // Real Estate Investing
  "real-estate": "real-estate-investing",
  rental: "real-estate-investing",
  rentals: "real-estate-investing",
  landlord: "real-estate-investing",
  landlording: "real-estate-investing",
  "rental-property": "real-estate-investing",

  // Financial Planning
  "cash-flow": "financial-planning",
  cashflow: "financial-planning",
  budgeting: "financial-planning",
  rrsp: "financial-planning",
  tfsa: "financial-planning",

  // Tax Planning
  taxes: "tax-planning",
  "self-employed-taxes": "tax-planning",

  // Wealth Building
  investing: "wealth-building",
  "net-worth": "wealth-building",
  networth: "wealth-building",

  // Newcomers
  newcomer: "newcomers",
  "new-comers": "newcomers",
  immigrant: "newcomers",
  immigrants: "newcomers",
  "new-to-canada": "newcomers",

  // Entrepreneurs
  "self-employed": "entrepreneurs",
  selfemployed: "entrepreneurs",
  contractor: "entrepreneurs",
  "small-business": "entrepreneurs",

  // Holistic / Human Design
  holistic: "holistic-approach",
  "human design": "human-design",
} as const;

const CATEGORY_TO_TAG: Record<string, CanonTag> = {
  mortgages: "mortgages",
  "real estate investing": "real-estate-investing",
  "financial planning": "financial-planning",
  "tax planning": "tax-planning",
  "wealth building": "wealth-building",
  newcomers: "newcomers",
  entrepreneurs: "entrepreneurs",
  "holistic approach": "holistic-approach",
  "human design": "human-design",
};

const norm = (s: unknown) => String(s ?? "").trim().toLowerCase();
const kebab = (s: unknown) => norm(s).replace(/\s+/g, "-");

function canonicalizeTags(maybe: unknown): CanonTag[] {
  const arr = Array.isArray(maybe) ? maybe : [];
  const out: CanonTag[] = [];
  for (const raw of arr) {
    const k = kebab(raw);
    const mapped = TAG_ALIASES[k] ?? (k as CanonTag);
    if ((CANON_TAGS as readonly string[]).includes(mapped)) out.push(mapped);
  }
  return Array.from(new Set(out));
}

function deriveFromCategory(category?: string | null): CanonTag[] {
  if (!category) return [];
  const key = CATEGORY_TO_TAG[norm(category)] || (TAG_ALIASES[kebab(category)] as CanonTag);
  return key && (CANON_TAGS as readonly string[]).includes(key) ? [key] : [];
}

/* =============================== Personas =============================== */
type PersonaKey =
  | "families"
  | "professionals"
  | "newcomers"
  | "entrepreneurs"
  | "investors"
  | "holistic";

type Persona = {
  key: PersonaKey;
  label: string;
  tags: CanonTag[];        // canonical tags feeding this persona
  includeSlugs?: string[]; // explicit seeds
};

type ViewOption = { key: "grid" | "list"; label: string };

/* ========= Payload type that matches ResourcesClient's expectation =========
   (different name to avoid shadowing) */
type TagsIndexPayload = {
  articles: Array<{ slug: string; title: string; category: string; tags: string[] }>;
  tags: Record<string, { count: number; slugs: string[] }>;
  categories: Record<string, { count: number; slugs: string[] }>;
  personas: Record<PersonaKey, { label: string; slugs: string[]; count: number }>;
};

/* ================================ Page ================================= */
export default async function Page() {
  // 1) Load articles (English) — tolerate loader errors gracefully
  let articlesRaw: any[] = [];
  try {
    articlesRaw = (await getAllArticles("en")) ?? [];
  } catch (e) {
    // Non-fatal: render client with empty state; ResourcesClient shows friendly empty UI
    articlesRaw = [];
  }

  // 2) Normalize + attach canonical tags, falling back to category if needed
  const processed: ClientArticle[] = articlesRaw.map((a) => {
    const readingTime =
      typeof a.readingTimeMin === "number" && a.readingTimeMin > 0
        ? `${a.readingTimeMin} min read`
        : (a.readingTime as string | number | null) ?? null;

    const canonTags = canonicalizeTags(a.tags);
    const withFallback = canonTags.length ? canonTags : deriveFromCategory(a.category);

    return {
      slug: String(a.slug),
      title: String(a.title ?? ""), // ensure string
      excerpt: (a.excerpt as string | null) ?? null,
      summary: (a.summary as string | null) ?? null,
      category: (a.category as string | null) ?? null, // chip only; filtering uses canonical tags
      tags: withFallback, // CanonTag[] (string[])
      date: (a.date as string | Date | null) ?? null,
      readingTime,
      image: (a.image as string | null) ?? null,
      hero: (a.hero as string | null) ?? null,
      ogImage: (a.ogImage as string | null) ?? null,
    } satisfies ClientArticle;
  });

  // 3) Build tag index (counts + slugs) for filters/personas
  const tagCounts = Object.fromEntries(
    (CANON_TAGS as readonly CanonTag[]).map((t) => [t, { count: 0, slugs: [] as string[] }])
  ) as Record<CanonTag, { count: number; slugs: string[] }>;

  for (const a of processed) {
    for (const t of (a.tags as CanonTag[] | undefined) ?? []) {
      tagCounts[t].count += 1;
      tagCounts[t].slugs.push(a.slug);
    }
  }

  // 4) Personas — seed only with slugs you actually have
  const personas: Persona[] = [
    {
      key: "families",
      label: "Families & Couples",
      tags: ["financial-planning", "wealth-building", "mortgages"],
      includeSlugs: [
        "5-steps-to-financial-freedom",
        "mindful-spending-aligning-your-budget-with-your-values",
      ],
    },
    {
      key: "professionals",
      label: "Professionals",
      tags: ["financial-planning", "wealth-building", "tax-planning"],
      includeSlugs: ["mindful-spending-aligning-your-budget-with-your-values"],
    },
    {
      key: "newcomers",
      label: "Newcomers",
      tags: ["newcomers", "mortgages", "financial-planning"],
    },
    {
      key: "entrepreneurs",
      label: "Entrepreneurs & Self-Employed",
      tags: ["entrepreneurs", "tax-planning", "financial-planning"],
      includeSlugs: ["holistic-tax-planning-for-the-self-employed"],
    },
    {
      key: "investors",
      label: "Real Estate Investors",
      tags: ["real-estate-investing", "mortgages", "wealth-building"],
      includeSlugs: [
        "buying-your-first-multi-unit-property",
        "rental-property-and-taxes-what-first-time-landlords-need-to-know",
      ],
    },
    {
      key: "holistic",
      label: "Holistic & Human Design",
      tags: ["holistic-approach", "human-design", "financial-planning"],
    },
  ];

  const personaIndex = personas.map((p) => {
    const set = new Set<string>();
    for (const t of p.tags) tagCounts[t].slugs.forEach((s) => set.add(s));
    (p.includeSlugs ?? []).forEach((s) => set.add(s));
    const slugs = [...set].filter((s) => processed.some((a) => a.slug === s));
    return { key: p.key, label: p.label, slugs, count: slugs.length };
  });

  // 5) TagsIndex payload consumed by the client (matches ResourcesClient type)
  const tagsIndex: TagsIndexPayload = {
    articles: processed.map((a) => ({
      slug: a.slug,
      title: a.title, // guaranteed string
      category: a.category ?? "",
      tags: (a.tags as string[]) ?? [],
    })),
    tags: tagCounts,
    categories: Object.fromEntries(
      (CANON_TAGS as readonly CanonTag[]).map((t) => [
        DISPLAY_LABELS[t],
        { count: tagCounts[t].count, slugs: tagCounts[t].slugs },
      ])
    ),
    personas: Object.fromEntries(
      personaIndex.map((p) => [p.key, { label: p.label, slugs: p.slugs, count: p.count }])
    ) as Record<PersonaKey, { label: string; slugs: string[]; count: number }>,
  };

  // 6) Featured — include only existing slugs
  const preferredFeatured = [
    "5-steps-to-financial-freedom",
    "buying-your-first-multi-unit-property",
    "rental-property-and-taxes-what-first-time-landlords-need-to-know",
    "tax-planning-for-peace-of-mind",
    "mindful-spending-aligning-your-budget-with-your-values",
  ];
  const existing = new Set(processed.map((a) => a.slug));
  const featuredSlugs = preferredFeatured.filter((s) => existing.has(s));

  // 7) View options
  const views: ViewOption[] = [
    { key: "grid", label: "Grid" },
    { key: "list", label: "List" },
  ];

  // 8) JSON-LD breadcrumbs (minimal)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://www.fannysamaniego.com/en" },
      { "@type": "ListItem", position: 2, name: "Resources", item: "https://www.fannysamaniego.com/en/resources" },
    ],
  } as const;

  return (
    <>
      {/* Tiny inline JSON-LD for breadcrumbs */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <ResourcesClient
        articles={processed}
        personas={personaIndex}
        featuredSlugs={featuredSlugs}
        views={views}
        ctaHref="/en/contact?intent=question"
        newsletterHref="/en/subscribe"
        tagsData={tagsIndex}
      />
    </>
  );
}
