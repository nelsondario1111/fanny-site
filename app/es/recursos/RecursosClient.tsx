"use client";

import * as React from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";

/* =============================== Tipos =============================== */
export type ClientArticle = {
  slug: string;
  title: string;
  excerpt?: string | null;
  summary?: string | null;
  category?: string | null;
  tags?: string[] | null;
  date?: string | Date | null;
  readingTime?: string | number | null;
  image?: string | null;
  hero?: string | null;
  ogImage?: string | null;
};

type TagsIndex = {
  articles: { slug: string; title: string; category: string; tags: string[] }[];
  tags: Record<string, { count: number; slugs: string[] }>;
  categories: Record<string, { count: number; slugs: string[] }>;
  personas: Record<string, { label: string; slugs: string[]; count: number }>;
};

type PersonaKey =
  | "families"
  | "professionals"
  | "newcomers"
  | "entrepreneurs"
  | "investors"
  | "holistic";

type PersonaIndex = {
  key: PersonaKey;
  label: string;
  count: number;
  slugs: (string | undefined)[];
};

/* ============================ Motion helpers ============================ */
const easing: number[] = [0.22, 1, 0.36, 1];
function useAnims() {
  const prefersReduced = useReducedMotion();
  const fade = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: prefersReduced ? { duration: 0 } : { duration: 0.4, ease: easing },
    },
  };
  const fadeUp = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: prefersReduced ? { duration: 0 } : { duration: 0.45, ease: easing },
    },
  };
  return { fade, fadeUp };
}

/* ============================== UI Compartida ============================== */
function Panel({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <section
      className={[
        "max-w-content mx-auto px-5 sm:px-8 py-8 sm:py-12",
        "bg-white rounded-[28px] border border-brand-gold/60 shadow-sm",
        className,
      ].join(" ")}
    >
      {children}
    </section>
  );
}

function SectionTitle({
  title,
  subtitle,
  id,
  level = "h2",
}: {
  title: string;
  subtitle?: React.ReactNode;
  id: string;
  level?: "h1" | "h2";
}) {
  const { fade, fadeUp } = useAnims();
  const Tag: React.ElementType = level;
  return (
    <div id={id} className="scroll-mt-24">
      <motion.div
        variants={fade}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        className="text-center mb-6"
      >
        <motion.div variants={fadeUp}>
          <Tag className="font-serif font-extrabold text-3xl md:text-4xl text-brand-green tracking-tight">
            {title}
          </Tag>
        </motion.div>
        <motion.div variants={fade} className="flex justify-center my-4" aria-hidden="true">
          <div className="w-16 h-[3px] rounded-full bg-brand-gold" />
        </motion.div>
        {subtitle && (
          <motion.p variants={fadeUp} className="text-brand-blue/90 text-lg md:text-xl max-w-3xl mx-auto">
            {subtitle}
          </motion.p>
        )}
      </motion.div>
    </div>
  );
}

function TagBadge({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-xs px-2.5 py-1 rounded-full bg-white text-brand-green border border-brand-gold/40">
      {children}
    </span>
  );
}

const CARD =
  "rounded-3xl border border-brand-gold/60 bg-white shadow-sm hover:shadow-md hover:-translate-y-[1px] transition p-6 focus-within:ring-2 focus-within:ring-brand-gold";

/* ============================== Utilidades ============================== */
const parseDate = (d?: string | Date | null) => {
  if (!d) return 0;
  const t = d instanceof Date ? d.getTime() : Date.parse(String(d));
  return Number.isFinite(t) ? t : 0;
};

const stripYaml = (s: string) => s.replace(/^---[\s\S]*?---\s*/m, "");
const stripMd = (s: string) =>
  s
    .replace(/!\[[^\]]*\]\([^\)]+\)/g, "")
    .replace(/\[([^\]]+)\]\([^\)]+\)/g, "$1")
    .replace(/[*_~`>#-]/g, "")
    .replace(/\s+/g, " ")
    .trim();
const clamp = (s: string, n = 220) => {
  if (s.length <= n) return s;
  const slice = s.slice(0, n);
  const cut = slice.lastIndexOf(" ");
  return (cut > 0 ? slice.slice(0, cut) : slice).trim() + "…";
};
const getBlurb = (a: ClientArticle) => {
  const base = a.summary || a.excerpt || "";
  const safe = stripYaml(base);
  return clamp(stripMd(safe));
};
const rt = (v: ClientArticle["readingTime"]) => {
  if (typeof v === "number" && Number.isFinite(v)) return `${v} min de lectura`;
  if (typeof v === "string" && v.trim()) return v.trim();
  return null;
};
const getImg = (a: ClientArticle) => a.image || a.hero || a.ogImage || null;
const initials = (s?: string | null) => {
  if (!s) return "FS";
  const words = s.split(/\s+/).filter(Boolean);
  const chars = (words[0]?.[0] || "") + (words[1]?.[0] || "");
  return chars.toUpperCase() || "FS";
};
const normTag = (t: string) => t.trim().toLowerCase().replace(/\s+/g, "-");
const titleCase = (kebab: string) =>
  kebab
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

/* ===================== Filtros rápidos ===================== */
type QuickFilter = { key: string; label: string; tags: string[] };

const OBJETIVOS: QuickFilter[] = [
  { key: "buy", label: "Comprar vivienda", tags: ["mortgage", "first-time-buyer", "pre-approval", "preapproval", "downpayment", "down-payment", "rent-vs-buy"] },
  { key: "refi", label: "Refinanciar / Renovar", tags: ["refinancing", "renewal", "mortgage-refinancing", "home-equity", "heloc", "rate-hold"] },
  { key: "credit", label: "Construir crédito", tags: ["credit", "credit-score", "equifax", "transunion", "credit-building", "fico", "credit-report"] },
  { key: "cashflow", label: "Flujo de caja y deudas", tags: ["budget", "budgeting", "cash-flow", "cashflow", "spending-plan", "emergency-fund", "debt-snowball", "debt-avalanche", "debt-management", "payoff"] },
  { key: "tax", label: "Optimizar impuestos", tags: ["tax", "taxes", "tax-planning", "tax-return", "refund", "rrsp", "tfsa", "hst", "cra", "stress-free-taxes"] },
  { key: "invest", label: "Invertir en bienes raíces", tags: ["real-estate-investing", "investing", "landlord", "rental-property", "multiplex", "cap-rate", "ontario-real-estate"] },
];

const EVENTOS: QuickFilter[] = [
  { key: "newcomer", label: "Recién llegado a Canadá", tags: ["newcomers", "new-to-canada", "immigrant", "settlement", "credit-history", "canadian-banking"] },
  { key: "self", label: "Autónomo / Emprendedor", tags: ["self-employed", "contractor", "small-business", "entrepreneurs", "income-verification"] },
  { key: "baby", label: "Nuevo bebé", tags: ["new-baby", "parental-leave", "family-finances", "education-planning", "resp"] },
  { key: "separation", label: "Separación / Divorcio", tags: ["divorce", "separation", "spousal", "couples-and-money"] },
  { key: "grief", label: "Duelo y pérdida", tags: ["grief", "bereavement", "mourning", "passing", "death", "funeral", "legacy", "estate-planning"] },
  { key: "moving", label: "Mudanza / Reubicación", tags: ["moving", "relocation", "rent-vs-buy", "toronto-real-estate", "home-renovations"] },
];

/* ============================== Componente ============================== */
export default function RecursosClient({
  articles,
  _categories: _unusedCategories, // renamed to avoid lint error
  ctaHref = "/es/contacto?intent=pregunta",
  newsletterHref = "/es/suscribirse",
  personas,
  featuredSlugs,
  views,
  tagsUrl = "/data/resources-tags-es.json",
  tagsData,
}: {
  articles: ClientArticle[];
  _categories?: string[];
  ctaHref?: string;
  newsletterHref?: string;
  personas?: PersonaIndex[];
  featuredSlugs?: string[];
  views?: Array<{ key: "grid" | "list" | string; label: string }>;
  tagsUrl?: string;
  tagsData?: TagsIndex | null;
}) {
  // explicitly mark as used (no-op)
  void _unusedCategories;

  // ... rest of component unchanged ...
  // (keep all your state, hooks, filters, ArticleCard, ListRow, EmptyState, etc.)
}
