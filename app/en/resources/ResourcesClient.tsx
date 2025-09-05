"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";

/* =============================== Types =============================== */
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

/* ============================== Shared UI ============================== */
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
          {level === "h1" ? (
            <h1 className="font-serif font-extrabold text-3xl md:text-4xl text-brand-green tracking-tight">
              {title}
            </h1>
          ) : (
            <h2 className="font-serif font-extrabold text-3xl md:text-4xl text-brand-green tracking-tight">
              {title}
            </h2>
          )}
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

/* ============================== Utilities ============================== */
const parseDate = (d?: string | Date | null) => {
  if (!d) return 0;
  const t = d instanceof Date ? d.getTime() : Date.parse(String(d));
  return Number.isFinite(t) ? t : 0;
};

const stripYaml = (s: string) => s.replace(/^---[\s\S]*?---\s*/m, "");
const stripMd = (s: string) =>
  s
    .replace(/!\[[^\]]*\]\([^)]+\)/g, "")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
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
  if (typeof v === "number" && Number.isFinite(v)) return `${v} min read`;
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

/* ====================== Smart search: minimal synonyms ====================== */
function deburr(s: string) {
  try {
    return s.normalize("NFD").replace(/\p{Diacritic}+/gu, "");
  } catch {
    return s;
  }
}
function tokens(s: string) {
  return deburr(s.toLowerCase()).match(/[a-z0-9]+/g) ?? [];
}
const SYNONYMS_EN: Record<string, string[]> = {
  grief: ["bereavement", "mourning", "loss", "passing", "passing-away", "death", "widow", "widower", "funeral"],
  bereavement: ["grief", "mourning", "loss", "death"],
  mortgage: ["mortgages", "home-loan", "pre-approval", "preapproval", "first-time-buyer", "downpayment", "down-payment"],
  "first-time buyer": ["first-home", "first purchase", "pre-approval", "downpayment"],
  "credit score": ["score", "equifax", "transunion", "credit report", "fico"],
  "debt snowball": ["debt avalanche", "debt payoff", "pay down debt"],
  budget: ["budgeting", "spending plan", "cash flow", "cashflow"],
  taxes: ["tax planning", "tax return", "refund", "deductions", "credits", "rrsp", "tfsa", "hst", "cra"],
  newcomer: ["new to canada", "immigrant", "settlement", "credit history"],
  "self-employed": ["contractor", "small business", "entrepreneur"],
};
function expandQuery(q: string): Set<string> {
  const out = new Set<string>();
  const base = tokens(q);
  for (const t of base) out.add(t);
  const qlc = deburr(q.toLowerCase());
  for (const [k, arr] of Object.entries(SYNONYMS_EN)) {
    const key = deburr(k.toLowerCase());
    if (qlc.includes(key) || base.includes(key)) arr.flatMap(tokens).forEach((t) => out.add(t));
  }
  for (const t of [...out]) (SYNONYMS_EN[t] ?? []).flatMap(tokens).forEach((x) => out.add(x));
  return out;
}

/* ===================== Curated quick filters (minimal surface) ===================== */
type QuickFilter = { key: string; label: string; tags: string[] };

const GOALS: QuickFilter[] = [
  { key: "buy", label: "Buy a home", tags: ["mortgage", "first-time-buyer", "pre-approval", "preapproval", "downpayment", "down-payment", "rent-vs-buy"] },
  { key: "refi", label: "Refinance / Renew", tags: ["refinancing", "renewal", "mortgage-refinancing", "home-equity", "heloc", "rate-hold"] },
  { key: "credit", label: "Build credit", tags: ["credit", "credit-score", "equifax", "transunion", "credit-building", "fico", "credit-report"] },
  { key: "cashflow", label: "Fix cash flow & debt", tags: ["budget", "budgeting", "cash-flow", "cashflow", "spending-plan", "emergency-fund", "debt-snowball", "debt-avalanche", "debt-management", "payoff"] },
  { key: "tax", label: "Optimize taxes", tags: ["tax", "taxes", "tax-planning", "tax-return", "refund", "rrsp", "tfsa", "hst", "cra", "stress-free-taxes"] },
  { key: "invest", label: "Invest in real estate", tags: ["real-estate-investing", "investing", "landlord", "rental-property", "multiplex", "cap-rate", "ontario-real-estate"] },
];

const LIFE_EVENTS: QuickFilter[] = [
  { key: "newcomer", label: "New to Canada", tags: ["newcomers", "new-to-canada", "immigrant", "settlement", "credit-history", "canadian-banking"] },
  { key: "self", label: "Self-employed", tags: ["self-employed", "contractor", "small-business", "entrepreneurs", "income-verification"] },
  { key: "baby", label: "New baby", tags: ["new-baby", "parental-leave", "family-finances", "education-planning", "resp"] },
  { key: "separation", label: "Separation / Divorce", tags: ["divorce", "separation", "spousal", "couples-and-money"] },
  { key: "grief", label: "Grief & loss", tags: ["grief", "bereavement", "mourning", "passing", "death", "funeral", "legacy", "estate-planning"] },
  { key: "moving", label: "Moving / Relocation", tags: ["moving", "relocation", "rent-vs-buy", "toronto-real-estate", "home-renovations"] },
];

/* ============================== Component ============================== */
export default function ResourcesClient({
  articles,
  ctaHref = "/en/contact?intent=question",
  newsletterHref = "/en/subscribe",
  personas,
  featuredSlugs,
  views,
  tagsUrl = "/data/resources-tags-en.json",
  tagsData,
}: {
  articles: ClientArticle[];
  ctaHref?: string;
  newsletterHref?: string;
  personas?: PersonaIndex[];
  featuredSlugs?: string[];
  views?: Array<{ key: "grid" | "list" | string; label: string }>;
  tagsUrl?: string;
  tagsData?: TagsIndex | null;
}) {
  /* ----------------------------- Local UI state ----------------------------- */
  const [query, setQuery] = React.useState<string>("");
  const [selectedMode, setSelectedMode] = React.useState<"All" | "Saved">("All");
  const [sort, setSort] = React.useState<"new" | "old" | "az">("new");
  const [view, setView] = React.useState<"grid" | "list">(
    ((views?.[0]?.key === "grid" || views?.[0]?.key === "list") ? (views?.[0]?.key as "grid" | "list") : "grid")
  );
  const [selectedPersona, setSelectedPersona] = React.useState<PersonaKey | "all">("all");

  // Saved
  const [saved, setSaved] = React.useState<Record<string, true>>({});
  React.useEffect(() => {
    try {
      const raw = localStorage.getItem("resource:saved");
      if (raw) setSaved(JSON.parse(raw));
    } catch {}
  }, []);
  const toggleSave = React.useCallback((slug: string) => {
    setSaved((prev) => {
      const next = { ...prev };
      if (next[slug]) delete next[slug];
      else next[slug] = true;
      try {
        localStorage.setItem("resource:saved", JSON.stringify(next));
      } catch {}
      return next;
    });
  }, []);
  const savedSlugs = React.useMemo(() => new Set(Object.keys(saved)), [saved]);
  const savedCount = React.useMemo(
    () => [...savedSlugs].filter((s) => articles.some((a) => a.slug === s)).length,
    [savedSlugs, articles]
  );

  /* ---------------------- Tags index (prefer in-memory) ---------------------- */
  const [tagIndex, setTagIndex] = React.useState<TagsIndex | null>(tagsData ?? null);
  React.useEffect(() => {
    if (tagsData) { setTagIndex(tagsData); return; }
    let alive = true;
    fetch(tagsUrl, { cache: "force-cache" })
      .then((r) => (r.ok ? r.json() : null))
      .then((j) => { if (alive && j) setTagIndex(j as TagsIndex); })
      .catch(() => {});
    return () => { alive = false; };
  }, [tagsUrl, tagsData]);

  /* ------------------------- Personas (index-aware) ------------------------- */
  const personaIndex: PersonaIndex[] = React.useMemo(() => {
    if (personas?.length) return personas;
    if (tagIndex?.personas) {
      const entries = Object.entries(tagIndex.personas) as Array<
        [PersonaKey, { label: string; slugs: string[]; count: number }]
      >;
      return entries.map(([key, p]) => ({ key, label: p.label, count: p.count, slugs: p.slugs }));
    }
    // Fallback inference
    const by = (pred: (a: ClientArticle) => boolean): string[] => articles.filter(pred).map((a) => a.slug);
    const hasAny = (a: ClientArticle, keys: string[]) => {
      const tagset = (a.tags ?? []).map(normTag);
      return keys.some((k) => tagset.includes(k));
    };
    const families = by((a) => hasAny(a, ["financial-planning", "wealth-building", "mortgages"]));
    const professionals = by((a) => hasAny(a, ["financial-planning", "wealth-building", "tax-planning"]));
    const newcomers = by((a) => hasAny(a, ["newcomers", "mortgages", "financial-planning"]));
    const entrepreneurs = by((a) => hasAny(a, ["entrepreneurs", "tax-planning", "financial-planning"]));
    const investors = by((a) => hasAny(a, ["real-estate-investing", "mortgages", "wealth-building"]));
    const holistic = by((a) => hasAny(a, ["holistic-approach", "human-design", "financial-planning"]));
    const mk = (key: PersonaKey, label: string, slugs: string[]) => ({ key, label, count: slugs.length, slugs });
    return [
      mk("families", "Families & Couples", families),
      mk("professionals", "Professionals", professionals),
      mk("newcomers", "Newcomers", newcomers),
      mk("entrepreneurs", "Entrepreneurs & Self-Employed", entrepreneurs),
      mk("investors", "Real Estate Investors", investors),
      mk("holistic", "Holistic & Human Design", holistic),
    ];
  }, [articles, personas, tagIndex]);

  /* ------------------------- Quick filters (curated) ------------------------- */
  const [quickKeys, setQuickKeys] = React.useState<Set<string>>(new Set()); // keys from GOALS/LIFE_EVENTS
  const toggleQuick = React.useCallback((k: string) => {
    setQuickKeys((prev) => {
      const next = new Set(prev);
      if (next.has(k)) next.delete(k); else next.add(k);
      return next;
    });
  }, []);
  const clearQuick = React.useCallback(() => setQuickKeys(new Set()), []);

  // derive tag set from selected quick filters
  const quickTagSet = React.useMemo(() => {
    const all = [...GOALS, ...LIFE_EVENTS];
    const picked = all.filter((q) => quickKeys.has(q.key));
    const tags = picked.flatMap((q) => q.tags);
    return new Set(tags.map(normTag));
  }, [quickKeys]);

  /* ---------------------------- Drawer for tags ---------------------------- */
  const [drawerOpen, setDrawerOpen] = React.useState<boolean>(false);
  const [drawerSelectedTags, setDrawerSelectedTags] = React.useState<Set<string>>(new Set());
  const toggleTag = React.useCallback((k: string) => {
    setDrawerSelectedTags((prev) => {
      const next = new Set(prev);
      if (next.has(k)) next.delete(k);
      else next.add(k);
      return next;
    });
  }, []);
  const clearTags = React.useCallback(() => setDrawerSelectedTags(new Set()), []);
  const allSelectedTagKeys = React.useMemo(() => {
    // union of quick tags + drawer tags
    return new Set<string>([...quickTagSet, ...drawerSelectedTags]);
  }, [quickTagSet, drawerSelectedTags]);

  /* ------------------------------ Search + sort ------------------------------ */
  function scoreArticle(a: ClientArticle, qset: Set<string>, phrase: string) {
    if (qset.size === 0) return 0;
    const hayTitle = deburr(`${a.title}`.toLowerCase());
    const hayTags = deburr(((a.tags ?? []).join(" ")).toLowerCase());
    const hayMeta = deburr(`${a.excerpt ?? ""} ${a.summary ?? ""} ${a.category ?? ""}`.toLowerCase());
    const hayAll = `${hayTitle} ${hayTags} ${hayMeta}`;
    let score = 0;
    for (const t of qset) {
      if (hayTitle.includes(t)) score += 6;
      if (hayTags.includes(t)) score += 3;
      if (hayMeta.includes(t)) score += 2;
    }
    if (phrase && hayAll.includes(phrase)) score += 2;
    return score;
  }

  const filtered = React.useMemo(() => {
    let rows = [...articles];

    // Persona
    if (selectedPersona !== "all") {
      const persona = personaIndex.find((p) => p.key === selectedPersona);
      const set = new Set(persona?.slugs ?? []);
      rows = rows.filter((a) => set.has(a.slug));
    }

    // Saved
    if (selectedMode === "Saved") rows = rows.filter((a) => savedSlugs.has(a.slug));

    // Tag filters: quick + drawer (OR semantics)
    if (allSelectedTagKeys.size > 0) {
      rows = rows.filter((a) => {
        const tset = (a.tags ?? []).map(normTag);
        for (const k of allSelectedTagKeys) if (tset.includes(k)) return true;
        return false;
      });
    }

    // Search with expansion
    const q = query.trim();
    const qset = expandQuery(q);
    const phrase = deburr(q.toLowerCase());
    if (q) {
      const withScores = rows
        .map((a) => ({ a, s: scoreArticle(a, qset, phrase) }))
        .filter(({ s }) => s > 0);
      rows = withScores
        .sort((x, y) => (y.s !== x.s ? y.s - x.s : parseDate(y.a.date) - parseDate(x.a.date)))
        .map(({ a }) => a);
    }

    // Sort
    rows.sort((a, b) => {
      if (sort === "az") return a.title.localeCompare(b.title);
      const ad = parseDate(a.date);
      const bd = parseDate(b.date);
      return sort === "new" ? bd - ad : ad - bd;
    });

    return rows;
  }, [
    articles,
    query,
    sort,
    selectedMode,
    savedSlugs,
    selectedPersona,
    personaIndex,
    allSelectedTagKeys,
  ]);

  const hasActiveFilters =
    query.trim() !== "" ||
    selectedMode !== "All" ||
    sort !== "new" ||
    selectedPersona !== "all" ||
    quickKeys.size > 0 ||
    drawerSelectedTags.size > 0;

  /* ------------------------------ Section Nav ------------------------------ */
  const SECTIONS = [
    { id: "overview", label: "Overview" },
    { id: "featured", label: "Featured" },
    { id: "browse", label: "Browse All" },
    { id: "faq", label: "How to Use & FAQ" },
  ] as const;

  function SectionNav() {
    const [active, setActive] = React.useState<string>("overview");
    React.useEffect(() => {
      const observer = new IntersectionObserver(
        (entries) => {
          const visible = entries
            .filter((e) => e.isIntersecting)
            .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
          if (visible[0]) setActive(visible[0].target.id);
        },
        { rootMargin: "-20% 0px -70% 0px", threshold: [0, 0.25, 0.5, 1] }
      );
      SECTIONS.forEach((s) => {
        const el = document.getElementById(s.id);
        if (el) observer.observe(el);
      });
      return () => observer.disconnect();
    }, []);
    return (
      <div className="sticky top-[64px] z-30 bg-white/90 backdrop-blur border-b border-brand-gold/30">
        <nav className="max-w-content mx-auto px-4 py-2 flex gap-2 overflow-x-auto text-sm" aria-label="On this page">
          {SECTIONS.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              className={[
                "px-3 py-1.5 rounded-full border transition whitespace-nowrap",
                active === s.id
                  ? "bg-brand-green text-white border-brand-green"
                  : "border-brand-gold/40 text-brand-green hover:bg-brand-green/10",
              ].join(" ")}
            >
              {s.label}
            </a>
          ))}
        </nav>
      </div>
    );
  }

  /* --------------------------------- Render --------------------------------- */
  return (
    <main className="bg-brand-beige min-h-screen pb-16">
      <SectionNav />

      {/* HERO / OVERVIEW */}
      <section id="overview" className="pt-10 px-4 scroll-mt-24">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: "easeOut" }}>
          <Panel>
            <SectionTitle
              title="Helpful Articles & Guides"
              subtitle={<>Short, practical reads on mortgages, money behaviour, and tax basics—written for busy professionals and families. Save what you need, share links, and reach out whenever you want a personal plan.</>}
              id="overview"
              level="h1"
            />

            {/* CTAs */}
            <div className="mt-2 flex flex-wrap items-center gap-3 justify-center">
              <Link href={ctaHref} className="px-5 py-2.5 bg-brand-green text-white rounded-full font-semibold hover:bg-brand-gold hover:text-brand-green border border-brand-green/20 transition">Talk to Fanny</Link>
              <Link href={newsletterHref} className="inline-flex items-center rounded-full px-4 py-2 text-sm border-2 border-brand-green text-brand-green hover:bg-brand-green hover:text-white transition">Get the Newsletter</Link>
            </div>

            {/* Personas (simple & compact) */}
            <div className="mt-6 flex flex-wrap gap-2 justify-center">
              <button onClick={() => setSelectedPersona("all")} className={["px-3 py-1.5 rounded-full border text-sm transition", selectedPersona === "all" ? "bg-brand-green text-white border-brand-green" : "border-brand-gold/40 text-brand-green hover:bg-brand-green/10"].join(" ")}>All personas</button>
              {personaIndex.map((p) => (
                <button key={p.key} onClick={() => setSelectedPersona(p.key)} className={["px-3 py-1.5 rounded-full border text-sm transition", selectedPersona === p.key ? "bg-brand-green text-white border-brand-green" : "border-brand-gold/40 text-brand-green hover:bg-brand-green/10"].join(" ")}>{p.label} {p.count > 0 && <span className="opacity-70">({p.count})</span>}</button>
              ))}
            </div>

            {/* Controls */}
            <div className="mt-8 grid gap-4 md:grid-cols-[1fr,auto,auto]">
              {/* Search */}
              <div>
                <label className="sr-only" htmlFor="search">Search</label>
                <input
                  id="search"
                  value={query}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
                  placeholder="Search topics, e.g., grief, mortgage, RRSP, cash flow…"
                  className="w-full px-4 py-3 rounded-xl border-2 border-brand-green/30 bg-white text-brand-body placeholder:text-brand-body/60 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/30 outline-none"
                />
              </div>

              {/* Sort / View / Reset */}
              <div className="flex gap-2">
                <label className="sr-only" htmlFor="sort">Sort</label>
                <select
                  id="sort"
                  value={sort}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                    const v = e.target.value as "new" | "old" | "az";
                    setSort(v);
                  }}
                  className="px-4 py-3 rounded-xl border-2 border-brand-green/30 bg-white text-brand-body focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/30 outline-none"
                >
                  <option value="new">Newest first</option>
                  <option value="old">Oldest first</option>
                  <option value="az">A–Z</option>
                </select>

                <div className="isolate inline-flex rounded-xl overflow-hidden border-2 border-brand-green/30">
                  <button type="button" onClick={() => setView("grid")} className={["px-3 py-3 text-sm", view === "grid" ? "bg-brand-green text-white" : "bg-white text-brand-green"].join(" ")} aria-pressed={view === "grid"}>Grid</button>
                  <button type="button" onClick={() => setView("list")} className={["px-3 py-3 text-sm border-l-2 border-brand-green/30", view === "list" ? "bg-brand-green text-white" : "bg-white text-brand-green"].join(" ")} aria-pressed={view === "list"}>List</button>

                  {hasActiveFilters && (
                    <button
                      type="button"
                      onClick={() => {
                        setQuery("");
                        setSelectedMode("All");
                        setSort("new");
                        setSelectedPersona("all");
                        clearQuick();
                        clearTags();
                      }}
                      className="ml-2 px-4 py-3 rounded-xl border-2 border-brand-gold text-brand-green hover:bg-brand-gold hover:text-white transition"
                      aria-label="Clear filters"
                    >
                      Reset
                    </button>
                  )}
                </div>
              </div>

              {/* Saved / Drawer */}
              <div className="flex gap-2">
                <div className="isolate inline-flex rounded-xl overflow-hidden border-2 border-brand-green/30">
                  <button type="button" onClick={() => setSelectedMode("All")} className={["px-3 py-3 text-sm", selectedMode === "All" ? "bg-brand-green text-white" : "bg-white text-brand-green"].join(" ")}>All</button>
                  <button type="button" onClick={() => setSelectedMode("Saved")} className={["px-3 py-3 text-sm border-l-2 border-brand-green/30", selectedMode === "Saved" ? "bg-brand-green text-white" : "bg-white text-brand-green"].join(" ")}>Saved {savedCount > 0 && <span className="opacity-80">({savedCount})</span>}</button>
                </div>
                <button type="button" onClick={() => setDrawerOpen(true)} className="px-4 py-3 rounded-xl border-2 border-brand-blue text-brand-blue hover:bg-brand-blue hover:text-white transition text-sm">
                  More filters {(drawerSelectedTags.size > 0 || quickKeys.size > 0) && <span className="opacity-80">({drawerSelectedTags.size + quickKeys.size})</span>}
                </button>
              </div>
            </div>

            {/* Quick Filters: Goals */}
            <div className="mt-6">
              <div className="mb-2 text-sm font-semibold text-brand-green">Goals</div>
              <div className="flex flex-wrap gap-2">
                {GOALS.map((g) => {
                  const active = quickKeys.has(g.key);
                  return (
                    <button
                      key={g.key}
                      onClick={() => toggleQuick(g.key)}
                      className={[
                        "px-3 py-1.5 rounded-full border text-sm transition",
                        active ? "bg-brand-green text-white border-brand-green" : "border-brand-gold/40 text-brand-green hover:bg-brand-green/10",
                      ].join(" ")}
                      aria-pressed={active}
                    >
                      {g.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quick Filters: Life events */}
            <div className="mt-4">
              <div className="mb-2 text-sm font-semibold text-brand-green">Life events</div>
              <div className="flex flex-wrap gap-2">
                {LIFE_EVENTS.map((g) => {
                  const active = quickKeys.has(g.key);
                  return (
                    <button
                      key={g.key}
                      onClick={() => toggleQuick(g.key)}
                      className={[
                        "px-3 py-1.5 rounded-full border text-sm transition",
                        active ? "bg-brand-green text-white border-brand-green" : "border-brand-gold/40 text-brand-green hover:bg-brand-green/10",
                      ].join(" ")}
                      aria-pressed={active}
                    >
                      {g.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </Panel>
        </motion.div>
      </section>

      {/* FEATURED */}
      {(() => {
        const defaults = [
          "5-steps-to-financial-freedom",
          "smart-money-newcomers-canada-2025",
          "wealth-with-confidence-women-toronto-2025",
          "buying-your-first-multi-unit-property",
          "rent-vs-buy-toronto-2025",
        ];
        const chosen = (featuredSlugs?.length ? featuredSlugs : defaults).filter((slug) =>
          articles.some((a) => a.slug === slug)
        );
        const map = new Map(articles.map((a) => [a.slug, a]));
        const featured = chosen.map((s) => map.get(s)!).filter(Boolean);

        return featured.length > 0 ? (
          <section id="featured" className="px-4 mt-8 scroll-mt-24">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: "easeOut", delay: 0.12 }}>
              <Panel className="bg-white">
                <div className="flex items-baseline justify-between mb-4">
                  <h2 className="font-serif text-2xl text-brand-green font-bold">Start here</h2>
                  <span className="text-sm text-brand-body/70">Curated primers for common journeys</span>
                </div>
                <div className="grid gap-6 md:grid-cols-2">
                  {featured.map((a) => (
                    <ArticleCard key={`feat-${a.slug}`} article={a} saved={savedSlugs.has(a.slug)} onToggleSave={() => toggleSave(a.slug)} />
                  ))}
                </div>
              </Panel>
            </motion.div>
          </section>
        ) : null;
      })()}

      {/* RESULTS */}
      <section id="browse" className="px-4 mt-8 scroll-mt-24">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: "easeOut", delay: 0.15 }}>
          <Panel>
            <div className="flex items-baseline justify-between mb-6">
              <h2 className="font-serif text-2xl text-brand-green font-bold">
                {selectedMode === "All" ? "All Resources" : "Saved"}
                {(quickKeys.size > 0 || drawerSelectedTags.size > 0) && (
                  <span className="ml-2 text-base text-brand-body/70">
                    • {quickKeys.size + drawerSelectedTags.size} filter{quickKeys.size + drawerSelectedTags.size === 1 ? "" : "s"}
                  </span>
                )}
              </h2>
              <div className="text-brand-body/80 text-sm">
                {filtered.length} {filtered.length === 1 ? "article" : "articles"}
              </div>
            </div>

            {filtered.length === 0 ? (
              <EmptyState
                query={query}
                onClear={() => {
                  setQuery("");
                  setSelectedMode("All");
                  setSort("new");
                  setSelectedPersona("all");
                  clearQuick();
                  clearTags();
                }}
                ctaHref={ctaHref}
              />
            ) : view === "grid" ? (
              <div className="grid gap-6 md:grid-cols-2">
                {filtered.map((a) => (
                  <ArticleCard key={a.slug} article={a} saved={savedSlugs.has(a.slug)} onToggleSave={() => toggleSave(a.slug)} />
                ))}
              </div>
            ) : (
              <div className="divide-y divide-brand-gold/40 bg-white/70 rounded-2xl border border-brand-gold">
                {filtered.map((a) => (
                  <ListRow key={`row-${a.slug}`} article={a} saved={savedSlugs.has(a.slug)} onToggleSave={() => toggleSave(a.slug)} />
                ))}
              </div>
            )}

            {/* Help block */}
            <div className="mt-12 rounded-2xl border border-brand-gold bg-neutral-50 p-6">
              <h3 className="text-base font-serif font-bold text-brand-green">Not finding the exact resource?</h3>
              <p className="mt-1 text-sm text-brand-blue/90">Tell us what you’re working on and we’ll point you to the right tool—or make one for you.</p>
              <div className="mt-4">
                <Link href={ctaHref} className="inline-flex items-center rounded-full px-4 py-2 text-sm border-2 border-brand-green text-brand-green hover:bg-brand-green hover:text-white transition">
                  Request a Resource
                </Link>
              </div>
            </div>
          </Panel>
        </motion.div>
      </section>

      {/* FAQ */}
      <section id="faq" className="px-4 mt-8 scroll-mt-24">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: "easeOut", delay: 0.18 }}>
          <Panel>
            <SectionTitle title="How to Use & FAQ" subtitle="Quick tips on search, saving articles, printing, and sharing." id="faq" />
            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-2xl border border-brand-gold/50 p-5">
                <h3 className="font-serif font-bold text-brand-green text-lg mb-2">Search & Filter</h3>
                <p className="text-brand-blue/90 text-sm">Use the search box, choose a persona, and apply a couple of quick filters. Tap <em>More filters</em> for the full list.</p>
              </div>
              <div className="rounded-2xl border border-brand-gold/50 p-5">
                <h3 className="font-serif font-bold text-brand-green text-lg mb-2">Save for Later</h3>
                <p className="text-brand-blue/90 text-sm">Tap <strong>Save</strong> on any article to keep it handy on this device.</p>
              </div>
              <div className="rounded-2xl border border-brand-gold/50 p-5">
                <h3 className="font-serif font-bold text-brand-green text-lg mb-2">Share</h3>
                <p className="text-brand-blue/90 text-sm">Send a link with the <strong>Share</strong> button—uses your device’s native share.</p>
              </div>
              <div className="rounded-2xl border border-brand-gold/50 p-5">
                <h3 className="font-serif font-bold text-brand-green text-lg mb-2">Talk to Fanny</h3>
                <p className="text-brand-blue/90 text-sm">Ready for a personal plan? Use the green button above to book a private consultation.</p>
              </div>
            </div>
          </Panel>
        </motion.div>
      </section>

      {/* Filter Drawer (full tag list, searchable) */}
      <FilterDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        tags={tagIndex?.tags ?? {}}
        selected={drawerSelectedTags}
        toggleTag={toggleTag}
        clearTags={clearTags}
      />
    </main>
  );
}

/* ============================== Filter Drawer ============================== */
function FilterDrawer({
  open,
  onClose,
  tags,
  selected,
  toggleTag,
  clearTags,
}: {
  open: boolean;
  onClose: () => void;
  tags: Record<string, { count: number; slugs: string[] }>;
  selected: Set<string>;
  toggleTag: (key: string) => void;
  clearTags: () => void;
}) {
  const [q, setQ] = React.useState<string>("");
  React.useEffect(() => { if (!open) setQ(""); }, [open]);

  const list = React.useMemo(() => {
    const entries = Object.entries(tags);
    if (!q.trim()) return entries.sort((a, b) => (b[1]?.count ?? 0) - (a[1]?.count ?? 0));
    const needle = q.trim().toLowerCase();
    return entries
      .filter(([k]) => k.includes(needle))
      .sort((a, b) => (b[1]?.count ?? 0) - (a[1]?.count ?? 0));
  }, [q, tags]);

  if (!open) return null;

  return (
    <div role="dialog" aria-modal="true" aria-labelledby="filter-heading" className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="absolute right-0 top-0 h-full w-full sm:w-[520px] bg-white shadow-xl border-l border-brand-gold overflow-hidden">
        <div className="p-5 border-b border-brand-gold/50 flex items-center justify-between">
          <h2 id="filter-heading" className="font-serif text-xl text-brand-green font-bold">Filters</h2>
          <button onClick={onClose} className="px-3 py-1.5 rounded-full border border-brand-green text-brand-green hover:bg-brand-green hover:text-white text-sm">Done</button>
        </div>

        <div className="p-5 space-y-5 h-[calc(100%-60px)] overflow-auto">
          <div>
            <label htmlFor="tag-search" className="sr-only">Search tags</label>
            <input
              id="tag-search"
              value={q}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQ(e.target.value)}
              placeholder="Search tags…"
              className="w-full px-4 py-3 rounded-xl border-2 border-brand-green/30 bg-white text-brand-body placeholder:text-brand-body/60 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/30 outline-none"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm text-brand-body/80">{selected.size} selected</div>
            <div className="flex gap-2">
              <button type="button" onClick={clearTags} className="px-3 py-1.5 rounded-full border-2 border-brand-gold text-brand-green hover:bg-brand-gold hover:text-white transition text-sm">Clear</button>
              <button type="button" onClick={onClose} className="px-3 py-1.5 rounded-full border-2 border-brand-blue text-brand-blue hover:bg-brand-blue hover:text-white transition text-sm">Apply</button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {list.map(([key, obj]) => {
              const id = `tag-${key}`;
              const checked = selected.has(key);
              return (
                <label key={key} htmlFor={id} className={["flex items-center gap-2 px-3 py-2 rounded-xl border", checked ? "bg-brand-green/10 border-brand-green" : "border-brand-gold/40"].join(" ")}>
                  <input id={id} type="checkbox" checked={checked} onChange={() => toggleTag(key)} className="h-4 w-4 accent-brand-green" />
                  <span className="text-sm text-brand-green flex-1">{titleCase(key)}</span>
                  <span className="text-xs text-brand-body/70">{obj.count ?? 0}</span>
                </label>
              );
            })}
            {list.length === 0 && <div className="text-sm text-brand-body/70 italic col-span-full">No tags match “{q}”.</div>}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================== UI Bits ============================== */

function ArticleCard({
  article,
  saved,
  onToggleSave,
}: {
  article: ClientArticle;
  saved: boolean;
  onToggleSave: () => void;
}) {
  const href = `/en/resources/${article.slug}`;
  const dateStr = article.date
    ? new Date(parseDate(article.date)).toLocaleDateString("en-CA", { year: "numeric", month: "long", day: "numeric" })
    : null;

  const minutes = rt(article.readingTime);
  const blurb = getBlurb(article);
  const maxTags = 3;
  const tags = Array.isArray(article.tags) ? article.tags.slice(0, maxTags) : [];
  const extraCount = Array.isArray(article.tags) && article.tags.length > maxTags ? article.tags.length - maxTags : 0;
  const img = getImg(article);
  const hasImg = Boolean(img);

  const share = async () => {
    const url = typeof window !== "undefined" ? new URL(href, window.location.origin).toString() : href;
    try {
      if (navigator.share) await navigator.share({ title: article.title, url });
      else if (navigator.clipboard) { await navigator.clipboard.writeText(url); alert("Link copied to clipboard"); }
    } catch {}
  };

  return (
    <article className={CARD + " overflow-hidden min-h-[420px] flex flex-col"}>
      <div className="relative aspect-[16/9] bg-gradient-to-br from-brand-blue/10 via-brand-gold/15 to-brand-green/10">
        {hasImg ? (
          <Image
            src={img as string}
            alt={article.title}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
            loading="lazy"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/80 border border-brand-gold text-brand-green font-serif text-lg">
              {initials(article.category)}
            </div>
          </div>
        )}
      </div>

      <div className="p-6 flex flex-col flex-1">
        <div className="flex items-center gap-2 text-sm mb-2">
          {article.category && <TagBadge>{article.category}</TagBadge>}
          {minutes && <TagBadge>{minutes}</TagBadge>}
          {dateStr && <time className="text-brand-body/70 ml-auto">{dateStr}</time>}
        </div>

        <h3 className="font-serif text-xl md:text-2xl text-brand-blue font-bold mb-2 leading-snug">
          <Link href={href} className="hover:underline">{article.title}</Link>
        </h3>

        {blurb && <p className="text-brand-body mb-3 line-clamp-3">{blurb}</p>}

        {(tags.length > 0 || extraCount > 0) && (
          <div className="mt-auto pt-2 flex flex-wrap gap-2">
            {tags.map((t) => (
              <span key={t} className="text-xs px-2.5 py-1 rounded-full bg-brand-blue/10 text-brand-blue border border-brand-blue/30">#{t}</span>
            ))}
            {extraCount > 0 && (
              <span className="text-xs px-2.5 py-1 rounded-full bg-white text-brand-green border border-brand-green/40">+{extraCount} more</span>
            )}
          </div>
        )}

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <Link href={href} className="inline-block">
            <button
              className="px-6 py-2 bg-brand-gold text-brand-green rounded-full font-serif font-bold shadow hover:bg-brand-blue hover:text-white transition"
              onClick={() => {
                try {
                  const key = "resource:recent";
                  const raw = localStorage.getItem(key);
                  const list: string[] = raw ? JSON.parse(raw) : [];
                  const next = [article.slug, ...list.filter((s) => s !== article.slug)].slice(0, 20);
                  localStorage.setItem(key, JSON.stringify(next));
                } catch {}
              }}
            >
              Read Article
            </button>
          </Link>

          <button type="button" onClick={share} className="px-4 py-2 rounded-full border-2 border-brand-green text-brand-green hover:bg-brand-green hover:text-white transition text-sm">Share</button>

          <button
            type="button"
            onClick={onToggleSave}
            aria-label={saved ? "Remove from saved" : "Save for later"}
            className={["px-4 py-2 rounded-full border-2 transition text-sm", saved ? "border-brand-blue bg-brand-blue text-white" : "border-brand-blue text-brand-blue hover:bg-brand-blue hover:text-white"].join(" ")}
          >
            {saved ? "Saved ★" : "Save ☆"}
          </button>
        </div>
      </div>
    </article>
  );
}

function ListRow({
  article,
  saved,
  onToggleSave,
}: {
  article: ClientArticle;
  saved: boolean;
  onToggleSave: () => void;
}) {
  const href = `/en/resources/${article.slug}`;
  const minutes = rt(article.readingTime);
  const dateStr = article.date
    ? new Date(parseDate(article.date)).toLocaleDateString("en-CA", { year: "numeric", month: "short", day: "numeric" })
    : null;
  const tags = (article.tags ?? []).slice(0, 4);
  const thumb = getImg(article);

  return (
    <div className="flex items-center gap-4 p-4">
      <div className="w-24 h-14 rounded-lg overflow-hidden border border-brand-gold bg-brand-blue/10 shrink-0 relative">
        {thumb ? (
          <Image
            src={thumb}
            alt={article.title}
            fill
            sizes="96px"
            className="object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-brand-green font-serif">{initials(article.category)}</span>
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <Link href={href} className="block">
          <h3 className="font-serif font-bold text-brand-blue text-lg leading-snug hover:underline truncate">{article.title}</h3>
        </Link>
        <div className="mt-1 flex flex-wrap items-center gap-2 text-xs">
          {article.category && <TagBadge>{article.category}</TagBadge>}
          {minutes && <span className="text-brand-body/80">{minutes}</span>}
          {dateStr && <time className="text-brand-body/60">{dateStr}</time>}
          {tags.map((t) => (
            <span key={t} className="text-xs px-2 py-0.5 rounded-full bg-brand-blue/10 text-brand-blue border border-brand-blue/30">#{t}</span>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <Link href={href} className="px-3 py-1.5 rounded-full border border-brand-green text-brand-green hover:bg-brand-green hover:text-white text-sm">Read</Link>
        <button type="button" onClick={onToggleSave} className={["px-3 py-1.5 rounded-full border text-sm", saved ? "border-brand-blue bg-brand-blue text-white" : "border-brand-blue text-brand-blue hover:bg-brand-blue hover:text-white"].join(" ")}>{saved ? "Saved" : "Save"}</button>
      </div>
    </div>
  );
}

function EmptyState({
  query,
  onClear,
  ctaHref,
}: {
  query: string;
  onClear: () => void;
  ctaHref: string;
}) {
  return (
    <div className="rounded-2xl border border-dashed border-brand-green/30 p-8 text-center">
      <p className="text-brand-body">
        No results for <span className="font-semibold">“{query}”</span>.
      </p>
      <p className="mt-2 text-sm text-brand-body/80">
        Try a goal like <em>Buy a home</em> or <em>Invest in real estate</em>, or open <em>More filters</em>.
      </p>
      <div className="mt-4 flex items-center justify-center gap-2">
        <button type="button" onClick={onClear} className="inline-flex items-center rounded-full px-4 py-2 text-sm border-2 border-brand-green text-brand-green hover:bg-brand-green hover:text-white transition">Clear filters</button>
        <Link href={ctaHref} className="inline-flex items-center rounded-full px-4 py-2 text-sm border-2 border-brand-blue text-brand-blue hover:bg-brand-blue hover:text-white transition">Ask for a recommendation</Link>
      </div>
    </div>
  );
}
