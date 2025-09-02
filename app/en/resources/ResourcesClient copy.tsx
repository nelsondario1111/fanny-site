"use client";

import * as React from "react";
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
  slugs: string[];
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
  const Tag = level as any;
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

/* ============================== Utilities ============================== */
const normalize = (v: unknown) => String(v ?? "").toLowerCase();
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
    .map((w) => {
      const u = w.toUpperCase();
      return u === "RRSP" || u === "TFSA" ? u : w.charAt(0).toUpperCase() + w.slice(1);
    })
    .join(" ");

/* ====================== Query expansion: smart synonyms ====================== */
/** Accent fold (broad browser support) */
function deburr(s: string) {
  return s.normalize("NFD").replace(/[\u0300-\u036f]+/g, "");
}

/** Tokenize into words */
function tokens(s: string) {
  return deburr(s.toLowerCase()).match(/[a-z0-9]+/g) ?? [];
}

/** Synonyms map (EN). Keep keys lowercased. */
const SYNONYMS_EN: Record<string, string[]> = {
  // Life events
  grief: ["bereavement", "mourning", "loss", "passing", "passing-away", "death", "widow", "widower", "funeral"],
  bereavement: ["grief", "mourning", "loss", "death"],
  mourning: ["grief", "bereavement"],
  "passing away": ["grief", "passing", "death", "bereavement"],

  // Mortgages & buying
  mortgage: ["mortgages", "home-loan", "pre-approval", "preapproval", "first-time-buyer", "downpayment", "down-payment"],
  "first-time buyer": ["first-home", "first purchase", "pre-approval", "downpayment"],

  // Credit & debt
  "credit score": ["score", "equifax", "transunion", "credit report", "fico"],
  "debt snowball": ["debt avalanche", "debt payoff", "pay down debt"],

  // Budgeting / cash flow
  budget: ["budgeting", "spending plan", "cash flow", "cashflow"],

  // Taxes
  taxes: ["tax planning", "tax return", "refund", "deductions", "credits", "rrsp", "tfsa"],

  // Newcomers
  newcomer: ["new to canada", "immigrant", "settlement", "credit history"],

  // Entrepreneurs
  "self-employed": ["contractor", "small business", "entrepreneur"],
};

/** Expand a free-text query into a set of tokens + synonyms */
function expandQuery(q: string): Set<string> {
  const out = new Set<string>();
  const base = tokens(q);
  base.forEach((t) => out.add(t));

  // phrase lookups
  const qlc = deburr(q.toLowerCase());
  for (const [k, arr] of Object.entries(SYNONYMS_EN)) {
    const key = deburr(k.toLowerCase());
    if (qlc.includes(key) || base.includes(key)) {
      for (const alt of arr) tokens(alt).forEach((t) => out.add(t));
    }
  }
  // single-token expansion
  for (const t of [...out]) {
    const matches = SYNONYMS_EN[t] ?? [];
    matches.forEach((m) => tokens(m).forEach((x) => out.add(x)));
  }
  return out;
}

/* ============================== Component ============================== */
export default function ResourcesClient({
  articles,
  categories,
  ctaHref = "/en/contact?intent=question",
  newsletterHref = "/en/subscribe",
  personas,
  featuredSlugs,
  views,
  // Optional URL (legacy) or in-memory data (preferred)
  tagsUrl = "/data/resources-tags-en.json",
  tagsData,
}: {
  articles: ClientArticle[];
  categories: string[];
  ctaHref?: string;
  newsletterHref?: string;
  personas?: PersonaIndex[];
  featuredSlugs?: string[];
  views?: Array<{ key: "grid" | "list" | string; label: string }>;
  tagsUrl?: string;
  tagsData?: TagsIndex | null;
}) {
  /* ----------------------------- Local UI state ----------------------------- */
  const [query, setQuery] = React.useState("");
  const [selectedFilter, setSelectedFilter] = React.useState<string>("All"); // tag or special ("All", "Saved")
  const [sort, setSort] = React.useState<"new" | "old" | "az">("new");
  const [view, setView] = React.useState<"grid" | "list">(
    (views?.[0]?.key as "grid" | "list") || "grid"
  );
  const [selectedPersona, setSelectedPersona] = React.useState<PersonaKey | "all">("all");

  // Saved (client assists)
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

  /* ---------------------- Tags index (prefer in-memory) ---------------------- */
  const [tagIndex, setTagIndex] = React.useState<TagsIndex | null>(tagsData ?? null);

  React.useEffect(() => {
    if (tagsData) {
      setTagIndex(tagsData);
      return;
    }
    let alive = true;
    fetch(tagsUrl, { cache: "force-cache" })
      .then((r) => (r.ok ? r.json() : null))
      .then((j) => {
        if (alive && j) setTagIndex(j as TagsIndex);
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, [tagsUrl, tagsData]);

  const tagKeys = React.useMemo(
    () => (tagIndex?.tags ? Object.keys(tagIndex.tags) : []),
    [tagIndex]
  );
  const useTagMode = tagKeys.length > 0;

  /* ------------------------- Personas (index-aware) ------------------------- */
  const personaIndex: PersonaIndex[] = React.useMemo(() => {
    if (personas?.length) return personas;

    if (tagIndex?.personas) {
      const entries = Object.entries(tagIndex.personas) as Array<
        [PersonaKey, { label: string; slugs: string[]; count: number }]
      >;
      return entries.map(([key, p]) => ({
        key,
        label: p.label,
        count: p.count,
        slugs: p.slugs,
      }));
    }

    // Fallback (rare): infer roughly from article tags
    const by = (pred: (a: ClientArticle) => boolean): string[] =>
      articles.filter(pred).map((a) => a.slug);
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

    const mk = (key: PersonaKey, label: string, slugs: string[]) => ({
      key,
      label,
      count: slugs.length,
      slugs,
    });

    return [
      mk("families", "Families & Couples", families),
      mk("professionals", "Professionals", professionals),
      mk("newcomers", "Newcomers", newcomers),
      mk("entrepreneurs", "Entrepreneurs & Self-Employed", entrepreneurs),
      mk("investors", "Real Estate Investors", investors),
      mk("holistic", "Holistic & Human Design", holistic),
    ];
  }, [articles, personas, tagIndex]);

  /* ----------------------------- Suggested chips ---------------------------- */
  const chips = React.useMemo(
    () => ["Grief & loss", "First-time buyer", "Credit score", "RRSP refund", "Budgeting", "Debt snowball", "Newcomers"],
    []
  );

  /* ------------------------- Filter options & counts ------------------------ */
  const filterCounts = React.useMemo(() => {
    if (useTagMode && tagIndex?.tags) {
      const counts = new Map<string, number>([["All", articles.length]]);
      for (const [tag, obj] of Object.entries(tagIndex.tags)) {
        counts.set(tag, obj.count);
      }
      counts.set(
        "Saved",
        [...savedSlugs].filter((s) => articles.some((a) => a.slug === s)).length
      );
      return { counts, keys: ["All", "Saved", ...Object.keys(tagIndex.tags)] };
    }

    // Fallback to categories if no tags index
    const counts = new Map<string, number>();
    counts.set("All", articles.length);
    for (const a of articles) {
      const c = (a.category ?? "").trim();
      if (!c) continue;
      counts.set(c, (counts.get(c) ?? 0) + 1);
    }
    counts.set(
      "Saved",
      [...savedSlugs].filter((s) => articles.some((a) => a.slug === s)).length
    );
    const keys = ["All", "Saved", ...Array.from(new Set(categories))];
    return { counts, keys };
  }, [articles, categories, savedSlugs, tagIndex, useTagMode]);

  /* ------------------------------ Smart search ------------------------------ */
  function scoreArticle(a: ClientArticle, qset: Set<string>, phrase: string) {
    if (qset.size === 0) return 0;

    const hayTitle = deburr(`${a.title}`.toLowerCase());
    const hayTags = deburr(((a.tags ?? []).join(" ")).toLowerCase());
    const hayMeta = deburr(
      `${a.excerpt ?? ""} ${a.summary ?? ""} ${a.category ?? ""}`.toLowerCase()
    );
    const hayAll = `${hayTitle} ${hayTags} ${hayMeta}`;

    let score = 0;
    // field boosts
    for (const t of qset) {
      if (hayTitle.includes(t)) score += 6;
      if (hayTags.includes(t)) score += 3;
      if (hayMeta.includes(t)) score += 2;
    }
    // phrase bonus
    if (phrase && hayAll.includes(phrase)) score += 2;

    return score;
  }

  /* --------------------------------- Filter --------------------------------- */
  const filtered = React.useMemo(() => {
    // 1) persona filter
    let rows = [...articles];
    if (selectedPersona !== "all") {
      const persona = personaIndex.find((p) => p.key === selectedPersona);
      const set = new Set((persona?.slugs ?? []).filter(Boolean));
      rows = rows.filter((a) => set.has(a.slug));
    }

    // 2) tag/cat filter
    if (selectedFilter === "Saved") {
      rows = rows.filter((a) => savedSlugs.has(a.slug));
    } else if (selectedFilter !== "All") {
      if (useTagMode) {
        const tagKey = normTag(selectedFilter);
        rows = rows.filter((a) => (a.tags ?? []).map(normTag).includes(tagKey));
      } else {
        rows = rows.filter((a) => normalize(a.category) === normalize(selectedFilter));
      }
    }

    // 3) query expansion + scoring
    const q = query.trim();
    const qset = expandQuery(q);
    const phrase = deburr(q.toLowerCase());

    if (q) {
      const withScores = rows
        .map((a) => ({ a, s: scoreArticle(a, qset, phrase) }))
        .filter(({ s }) => s > 0);
      rows = withScores
        .sort((x, y) => {
          if (y.s !== x.s) return y.s - x.s; // score desc
          // tie-breaker by date (newest first by default)
          const ad = parseDate(x.a.date);
          const bd = parseDate(y.a.date);
          return bd - ad;
        })
        .map(({ a }) => a);
    }

    // 4) explicit sort: preserve relevance when q is present and sort is "new"
    const cmp = (a: ClientArticle, b: ClientArticle) => {
      if (sort === "az") return a.title.localeCompare(b.title);
      const ad = parseDate(a.date);
      const bd = parseDate(b.date);
      return sort === "new" ? bd - ad : ad - bd;
    };
    if (!q || sort !== "new") {
      rows = [...rows].sort(cmp);
    }

    return rows;
  }, [articles, query, selectedFilter, sort, savedSlugs, selectedPersona, personaIndex, useTagMode]);

  const hasActiveFilters =
    query.trim() !== "" || selectedFilter !== "All" || sort !== "new" || selectedPersona !== "all";

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

  /* ----------------------------- Featured rail ----------------------------- */
  const featured: ClientArticle[] = React.useMemo(() => {
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
    return chosen.map((s) => map.get(s)!).filter(Boolean);
  }, [articles, featuredSlugs]);

  /* --------------------------------- Render --------------------------------- */
  return (
    <main className="bg-brand-beige min-h-screen pb-16">
      {/* Sticky section nav: mirrors Tools */}
      <SectionNav />

      {/* HERO / OVERVIEW */}
      <section id="overview" className="pt-10 px-4 scroll-mt-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <Panel>
            <SectionTitle
              title="Helpful Articles & Guides"
              subtitle={
                <>
                  Short, practical reads on mortgages, money behaviour, and tax basics—written for
                  busy professionals and families. Save what you need, share links, and reach out
                  whenever you want a personal plan.
                </>
              }
              id="overview"
              level="h1"
            />

            {/* Primary & secondary CTAs */}
            <div className="mt-2 flex flex-wrap items-center gap-3 justify-center">
              <Link
                href={ctaHref}
                className="px-5 py-2.5 bg-brand-green text-white rounded-full font-semibold hover:bg-brand-gold hover:text-brand-green border border-brand-green/20 transition"
              >
                Talk to Fanny
              </Link>
              <Link
                href={newsletterHref}
                className="inline-flex items-center rounded-full px-4 py-2 text-sm border-2 border-brand-green text-brand-green hover:bg-brand-green hover:text-white transition"
              >
                Get the Newsletter
              </Link>
            </div>

            {/* Suggested search chips */}
            <div className="mt-6 flex flex-wrap gap-2 justify-center">
              {chips.map((c) => (
                <button
                  key={c}
                  onClick={() => setQuery(c)}
                  className="px-3 py-1.5 rounded-full border text-sm transition border-brand-gold/40 text-brand-green hover:bg-brand-green/10"
                >
                  {c}
                </button>
              ))}
            </div>

            {/* Controls */}
            <div className="mt-8 grid gap-4 md:grid-cols-[1fr,auto,auto]">
              <div>
                <label className="sr-only" htmlFor="search">
                  Search
                </label>
                <input
                  id="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search topics, e.g., grief, mortgage, RRSP, cash flow…"
                  className="w-full px-4 py-3 rounded-xl border-2 border-brand-green/30 bg-white text-brand-body placeholder:text-brand-body/60 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/30 outline-none"
                />
              </div>

              <div className="flex gap-2">
                <label className="sr-only" htmlFor="sort">
                  Sort
                </label>
                <select
                  id="sort"
                  value={sort}
                  onChange={(e) => setSort(e.target.value as any)}
                  className="px-4 py-3 rounded-xl border-2 border-brand-green/30 bg-white text-brand-body focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/30 outline-none"
                >
                  <option value="new">Newest first</option>
                  <option value="old">Oldest first</option>
                  <option value="az">A–Z</option>
                </select>

                {/* View toggle */}
                <div className="isolate inline-flex rounded-xl overflow-hidden border-2 border-brand-green/30">
                  <button
                    type="button"
                    onClick={() => setView("grid")}
                    className={[
                      "px-3 py-3 text-sm",
                      view === "grid" ? "bg-brand-green text-white" : "bg-white text-brand-green",
                    ].join(" ")}
                    aria-pressed={view === "grid"}
                  >
                    Grid
                  </button>
                  <button
                    type="button"
                    onClick={() => setView("list")}
                    className={[
                      "px-3 py-3 text-sm border-l-2 border-brand-green/30",
                      view === "list" ? "bg-brand-green text-white" : "bg-white text-brand-green",
                    ].join(" ")}
                    aria-pressed={view === "list"}
                  >
                    List
                  </button>

                  {hasActiveFilters && (
                    <button
                      type="button"
                      onClick={() => {
                        setQuery("");
                        setSelectedFilter("All");
                        setSort("new");
                        setSelectedPersona("all");
                      }}
                      className="ml-2 px-4 py-3 rounded-xl border-2 border-brand-gold text-brand-green hover:bg-brand-gold hover:text-white transition"
                      aria-label="Clear filters"
                    >
                      Reset
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Filter pills (Tags preferred) */}
            <div className="mt-6 flex flex-wrap gap-2">
              {filterCounts.keys.map((key) => {
                const count = filterCounts.counts.get(key) ?? 0;
                const active = selectedFilter === key;
                const label =
                  key === "All" || key === "Saved" || !useTagMode
                    ? key
                    : titleCase(key);
                return (
                  <button
                    key={key}
                    onClick={() => setSelectedFilter(key)}
                    className={[
                      "px-3 py-1.5 rounded-full border text-sm transition",
                      active
                        ? "bg-brand-green text-white border-brand-green"
                        : "border-brand-gold/40 text-brand-green hover:bg-brand-green/10",
                    ].join(" ")}
                    aria-pressed={active}
                  >
                    {label} {count > 0 && <span className="opacity-70">({count})</span>}
                  </button>
                );
              })}
            </div>
          </Panel>
        </motion.div>
      </section>

      {/* FEATURED */}
      {featured.length > 0 && (
        <section id="featured" className="px-4 mt-8 scroll-mt-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.12 }}
          >
            <Panel className="bg-white">
              <div className="flex items-baseline justify-between mb-4">
                <h2 className="font-serif text-2xl text-brand-green font-bold">Start here</h2>
                <span className="text-sm text-brand-body/70">Curated primers for common journeys</span>
              </div>
              <div className="grid gap-6 md:grid-cols-2">
                {featured.map((a) => (
                  <ArticleCard
                    key={`feat-${a.slug}`}
                    article={a}
                    saved={savedSlugs.has(a.slug)}
                    onToggleSave={() => toggleSave(a.slug)}
                  />
                ))}
              </div>
            </Panel>
          </motion.div>
        </section>
      )}

      {/* RESULTS */}
      <section id="browse" className="px-4 mt-8 scroll-mt-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.15 }}
        >
          <Panel>
            <div className="flex items-baseline justify-between mb-6">
              <h2 className="font-serif text-2xl text-brand-green font-bold">
                {selectedFilter === "All" ? "All Resources" : (useTagMode && selectedFilter !== "Saved" ? titleCase(selectedFilter) : selectedFilter)}
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
                  setSelectedFilter("All");
                  setSort("new");
                  setSelectedPersona("all");
                }}
                ctaHref={ctaHref}
              />
            ) : view === "grid" ? (
              <div className="grid gap-6 md:grid-cols-2">
                {filtered.map((a) => (
                  <ArticleCard
                    key={a.slug}
                    article={a}
                    saved={savedSlugs.has(a.slug)}
                    onToggleSave={() => toggleSave(a.slug)}
                  />
                ))}
              </div>
            ) : (
              <div className="divide-y divide-brand-gold/40 bg-white/70 rounded-2xl border border-brand-gold">
                {filtered.map((a) => (
                  <ListRow
                    key={`row-${a.slug}`}
                    article={a}
                    saved={savedSlugs.has(a.slug)}
                    onToggleSave={() => toggleSave(a.slug)}
                  />
                ))}
              </div>
            )}

            {/* Help block */}
            <div className="mt-12 rounded-2xl border border-brand-gold bg-neutral-50 p-6">
              <h3 className="text-base font-serif font-bold text-brand-green">
                Not finding the exact resource?
              </h3>
              <p className="mt-1 text-sm text-brand-blue/90">
                Tell us what you’re working on and we’ll point you to the right tool—or make one for you.
              </p>
              <div className="mt-4">
                <Link
                  href={ctaHref}
                  className="inline-flex items-center rounded-full px-4 py-2 text-sm border-2 border-brand-green text-brand-green hover:bg-brand-green hover:text-white transition"
                >
                  Request a Resource
                </Link>
              </div>
            </div>
          </Panel>
        </motion.div>
      </section>

      {/* FAQ / HOW */}
      <section id="faq" className="px-4 mt-8 scroll-mt-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.18 }}
        >
          <Panel>
            <SectionTitle
              title="How to Use & FAQ"
              subtitle="Quick tips on search, saving articles, printing, and sharing."
              id="faq"
            />
            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-2xl border border-brand-gold/50 p-5">
                <h3 className="font-serif font-bold text-brand-green text-lg mb-2">Search & Filter</h3>
                <p className="text-brand-blue/90 text-sm">
                  Use the search bar, choose a persona, and apply tag filters. Click <em>Reset</em> to clear quickly.
                </p>
              </div>
              <div className="rounded-2xl border border-brand-gold/50 p-5">
                <h3 className="font-serif font-bold text-brand-green text-lg mb-2">Save for Later</h3>
                <p className="text-brand-blue/90 text-sm">
                  Tap <strong>Save</strong> on any article to keep it handy in your browser on this device.
                </p>
              </div>
              <div className="rounded-2xl border border-brand-gold/50 p-5">
                <h3 className="font-serif font-bold text-brand-green text-lg mb-2">Share</h3>
                <p className="text-brand-blue/90 text-sm">
                  Send a link with the <strong>Share</strong> button—works with your device’s native share.
                </p>
              </div>
              <div className="rounded-2xl border border-brand-gold/50 p-5">
                <h3 className="font-serif font-bold text-brand-green text-lg mb-2">Talk to Fanny</h3>
                <p className="text-brand-blue/90 text-sm">
                  Ready for a personal plan? Use the green button above to book a private consultation.
                </p>
              </div>
            </div>
          </Panel>
        </motion.div>
      </section>
    </main>
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
    ? new Date(parseDate(article.date)).toLocaleDateString("en-CA", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  const minutes = rt(article.readingTime);
  const blurb = getBlurb(article);

  const maxTags = 3;
  const tags = Array.isArray(article.tags) ? article.tags.slice(0, maxTags) : [];
  const extraCount =
    Array.isArray(article.tags) && article.tags.length > maxTags
      ? article.tags.length - maxTags
      : 0;

  const img = getImg(article);
  const hasImg = Boolean(img);

  const share = async () => {
    const url =
      typeof window !== "undefined"
        ? new URL(href, window.location.origin).toString()
        : href;
    try {
      if (navigator.share) {
        await navigator.share({ title: article.title, url });
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(url);
        alert("Link copied to clipboard");
      }
    } catch {}
  };

  return (
    <article className={CARD + " overflow-hidden min-h-[420px] flex flex-col"}>
      {/* Media */}
      <div className="relative aspect-[16/9] bg-gradient-to-br from-brand-blue/10 via-brand-gold/15 to-brand-green/10">
        {hasImg ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={img as string}
            alt={article.title}
            className="absolute inset-0 h-full w-full object-cover"
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

      {/* Body */}
      <div className="p-6 flex flex-col flex-1">
        <div className="flex items-center gap-2 text-sm mb-2">
          {article.category && <TagBadge>{article.category}</TagBadge>}
          {minutes && <TagBadge>{minutes}</TagBadge>}
          {dateStr && <time className="text-brand-body/70 ml-auto">{dateStr}</time>}
        </div>

        <h3 className="font-serif text-xl md:text-2xl text-brand-blue font-bold mb-2 leading-snug">
          <Link href={href} className="hover:underline">
            {article.title}
          </Link>
        </h3>

        {blurb && <p className="text-brand-body mb-3 line-clamp-3">{blurb}</p>}

        {(tags.length > 0 || extraCount > 0) && (
          <div className="mt-auto pt-2 flex flex-wrap gap-2">
            {tags.map((t) => (
              <span
                key={t}
                className="text-xs px-2.5 py-1 rounded-full bg-brand-blue/10 text-brand-blue border border-brand-blue/30"
              >
                #{t}
              </span>
            ))}
            {extraCount > 0 && (
              <span className="text-xs px-2.5 py-1 rounded-full bg-white text-brand-green border border-brand-green/40">
                +{extraCount} more
              </span>
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

          <button
            type="button"
            onClick={share}
            className="px-4 py-2 rounded-full border-2 border-brand-green text-brand-green hover:bg-brand-green hover:text-white transition text-sm"
          >
            Share
          </button>

          <button
            type="button"
            onClick={onToggleSave}
            aria-label={saved ? "Remove from saved" : "Save for later"}
            className={[
              "px-4 py-2 rounded-full border-2 transition text-sm",
              saved
                ? "border-brand-blue bg-brand-blue text-white"
                : "border-brand-blue text-brand-blue hover:bg-brand-blue hover:text-white",
            ].join(" ")}
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
    ? new Date(parseDate(article.date)).toLocaleDateString("en-CA", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : null;

  const tags = (article.tags ?? []).slice(0, 4);

  return (
    <div className="flex items-center gap-4 p-4">
      {/* Thumbnail */}
      <div className="w-24 h-14 rounded-lg overflow-hidden border border-brand-gold bg-brand-blue/10 shrink-0">
        {getImg(article) ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={getImg(article) as string}
            alt={article.title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-brand-green font-serif">{initials(article.category)}</span>
          </div>
        )}
      </div>

      {/* Text */}
      <div className="flex-1 min-w-0">
        <Link href={href} className="block">
          <h3 className="font-serif font-bold text-brand-blue text-lg leading-snug hover:underline truncate">
            {article.title}
          </h3>
        </Link>
        <div className="mt-1 flex flex-wrap items-center gap-2 text-xs">
          {article.category && <TagBadge>{article.category}</TagBadge>}
          {minutes && <span className="text-brand-body/80">{minutes}</span>}
          {dateStr && <time className="text-brand-body/60">{dateStr}</time>}
          {tags.map((t) => (
            <span
              key={t}
              className="text-xs px-2 py-0.5 rounded-full bg-brand-blue/10 text-brand-blue border border-brand-blue/30"
            >
              #{t}
            </span>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 shrink-0">
        <Link
          href={href}
          className="px-3 py-1.5 rounded-full border border-brand-green text-brand-green hover:bg-brand-green hover:text-white text-sm"
        >
          Read
        </Link>
        <button
          type="button"
          onClick={onToggleSave}
          className={[
            "px-3 py-1.5 rounded-full border text-sm",
            saved
              ? "border-brand-blue bg-brand-blue text-white"
              : "border-brand-blue text-brand-blue hover:bg-brand-blue hover:text-white",
          ].join(" ")}
        >
          {saved ? "Saved" : "Save"}
        </button>
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
        Try: <em>passing away</em>, <em>pre-approval</em>, <em>credit score</em>, <em>RRSP refund</em>, <em>budget</em>.
      </p>
      <div className="mt-4 flex items-center justify-center gap-2">
        <button
          type="button"
          onClick={onClear}
          className="inline-flex items-center rounded-full px-4 py-2 text-sm border-2 border-brand-green text-brand-green hover:bg-brand-green hover:text-white transition"
        >
          Clear filters
        </button>
        <Link
          href={ctaHref}
          className="inline-flex items-center rounded-full px-4 py-2 text-sm border-2 border-brand-blue text-brand-blue hover:bg-brand-blue hover:text-white transition"
        >
          Ask for a recommendation
        </Link>
      </div>
    </div>
  );
}
