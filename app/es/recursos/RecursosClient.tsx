"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ComparisonTable,
  HubPanel as Panel,
  HubSectionTitle as SectionTitle,
  HubTagBadge as TagBadge,
  InfoCard,
  PageHero,
  StickySectionNav,
  HUB_CARD_CLASS,
} from "@/components/sections/hub";
import StartHereDecisionWidget from "@/components/StartHereDecisionWidget";
import StickyNextStepBar from "@/components/StickyNextStepBar";

/* =============================== Tipos =============================== */
export type ClientArticle = {
  slug: string;
  title: string;
  excerpt?: string | null;
  summary?: string | null;
  category?: string | null;
  tags?: string[] | null; // canónicas (mortgages, real-estate-investing, etc.)
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

const CARD = HUB_CARD_CLASS;

/* ============================== Utilidades ============================== */
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

/** Fallback robusto cuando falta el título */
function safeTitle(a: ClientArticle) {
  const t = (a.title || "").trim();
  if (t) return t;
  const base = a.slug.split("/").pop() || a.slug;
  const noDate = base.replace(/^\d{4}-\d{2}-\d{2}-/, "");
  return titleCase(noDate.replace(/-+/g, " "));
}

/* ====================== Búsqueda inteligente (sinónimos ES) ====================== */
function deburr(s: string) {
  try {
    return s.normalize("NFD").replace(/\p{Diacritic}+/gu, "");
  } catch {
    return s;
  }
}
function tokens(s: string): string[] {
  const m = deburr(s.toLowerCase()).match(/[a-z0-9]+/g);
  return m ? [...m] : [];
}

const SYNONYMS_ES: Record<string, string[]> = {
  duelo: ["luto", "perdida", "pérdida", "fallecimiento", "muerte"],
  hipoteca: ["hipotecas", "preaprobacion", "preaprobación", "primera", "enganche", "cuota-inicial", "downpayment"],
  "primer comprador": ["primera vivienda", "primer hogar", "preaprobacion", "enganche"],
  "puntaje crediticio": ["puntaje", "credit score", "equifax", "transunion", "reporte de credito", "reporte-crediticio", "fico"],
  presupuesto: ["presupuestar", "plan de gastos", "flujo de caja", "flujo de efectivo", "cashflow", "cash-flow"],
  impuestos: ["planificacion fiscal", "declaracion", "devolucion", "deducciones", "creditos", "rrsp", "tfsa", "hst", "cra"],
  "recién llegado": ["nuevo en canada", "inmigrante", "asentamiento", "historial de credito"],
  autonomo: ["autónomo", "contratista", "pequeña empresa", "emprendedor", "negocio"],
};

function expandQuery(q: string): Set<string> {
  const out = new Set<string>();
  const base = tokens(q);
  for (const t of base) out.add(t);
  const qlc = deburr(q.toLowerCase());
  for (const [k, arr] of Object.entries(SYNONYMS_ES)) {
    const key = deburr(k.toLowerCase());
    if (qlc.includes(key) || base.includes(key)) arr.flatMap(tokens).forEach((t) => out.add(t));
  }
  for (const t of [...out]) {
    const syns: string[] = (SYNONYMS_ES as Record<string, string[]>)[t] ?? [];
    syns.flatMap(tokens).forEach((x) => out.add(x));
  }
  return out;
}

/* ===================== Filtros rápidos (curados) ===================== */
type QuickFilter = { key: string; label: string; tags: string[] };

const OBJETIVOS: QuickFilter[] = [
  { key: "buy", label: "Comprar vivienda", tags: ["mortgages"] },
  { key: "refi", label: "Refinanciar / Renovar", tags: ["mortgages"] },
  { key: "credit", label: "Construir crédito", tags: ["financial-planning"] },
  { key: "cashflow", label: "Flujo de caja y deudas", tags: ["financial-planning"] },
  { key: "tax", label: "Optimizar impuestos", tags: ["tax-planning"] },
  { key: "invest", label: "Invertir en bienes raíces", tags: ["real-estate-investing"] },
];

const EVENTOS: QuickFilter[] = [
  { key: "newcomer", label: "Recién llegado a Canadá", tags: ["newcomers"] },
  { key: "self", label: "Autónomo / Emprendedor", tags: ["entrepreneurs"] },
  { key: "family", label: "Familia en crecimiento", tags: ["financial-planning"] },
];

/* ============================== Componente ============================== */
export default function RecursosClient({
  articles,
  ctaHref = "/es/contacto?intent=pregunta",
  personas,
  featuredSlugs,
  views,
  tagsUrl = "/data/resources-tags-es.json",
  tagsData,
}: {
  articles: ClientArticle[];
  ctaHref?: string;
  personas?: PersonaIndex[];
  featuredSlugs?: string[];
  views?: Array<{ key: "grid" | "list" | string; label: string }>;
  tagsUrl?: string;
  tagsData?: TagsIndex | null;
}) {
  /* ----------------------------- Estado local UI ----------------------------- */
  const [query, setQuery] = React.useState<string>("");
  const [selectedMode, setSelectedMode] = React.useState<"All" | "Saved">("All");
  const [sort, setSort] = React.useState<"new" | "old" | "az">("new");
  const [view, setView] = React.useState<"grid" | "list">(
    ((views?.[0]?.key === "grid" || views?.[0]?.key === "list") ? (views?.[0]?.key as "grid" | "list") : "grid")
  );
  const [selectedPersona, setSelectedPersona] = React.useState<PersonaKey | "all">("all");

  // Guardados
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

  /* ---------------------- Índice de tags (prefiere memoria) ---------------------- */
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

  /* ------------------------- Personas (según índice) ------------------------- */
  const personaIndex: PersonaIndex[] = React.useMemo(() => {
    if (personas?.length) return personas;
    if (tagIndex?.personas) {
      const entries = Object.entries(tagIndex.personas) as Array<
        [PersonaKey, { label: string; slugs: string[]; count: number }]
      >;
      return entries.map(([key, p]) => ({ key, label: p.label, count: p.count, slugs: p.slugs }));
    }
    // Inferencia de respaldo
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
      mk("families", "Familias y Parejas", families),
      mk("professionals", "Profesionales", professionals),
      mk("newcomers", "Recién Llegados", newcomers),
      mk("entrepreneurs", "Emprendedores y Autónomos", entrepreneurs),
      mk("investors", "Inversionistas Inmobiliarios", investors),
      mk("holistic", "Holístico y Diseño Humano", holistic),
    ];
  }, [articles, personas, tagIndex]);

  /* ------------------------- Filtros rápidos (curados) ------------------------- */
  const [quickKeys, setQuickKeys] = React.useState<Set<string>>(new Set());
  const toggleQuick = React.useCallback((k: string) => {
    setQuickKeys((prev) => {
      const next = new Set(prev);
      if (next.has(k)) next.delete(k); else next.add(k);
      return next;
    });
  }, []);
  const clearQuick = React.useCallback(() => setQuickKeys(new Set()), []);

  // Derivar conjunto de tags a partir de los rápidos
  const quickTagSet = React.useMemo(() => {
    const all = [...OBJETIVOS, ...EVENTOS];
    const picked = all.filter((q) => quickKeys.has(q.key));
    const tags = picked.flatMap((q) => q.tags);
    return new Set(tags.map(normTag));
  }, [quickKeys]);

  /* ---------------------------- Cajón de etiquetas ---------------------------- */
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
    return new Set<string>([...quickTagSet, ...drawerSelectedTags]);
  }, [quickTagSet, drawerSelectedTags]);

  /* ------------------------------ Búsqueda + orden ------------------------------ */
  function scoreArticle(a: ClientArticle, qset: Set<string>, phrase: string) {
    if (qset.size === 0) return 0;
    const title = safeTitle(a);
    const hayTitle = deburr(`${title}`.toLowerCase());
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

    // Guardados
    if (selectedMode === "Saved") rows = rows.filter((a) => savedSlugs.has(a.slug));

    // Filtros por tag: rápidos + cajón (OR)
    if (allSelectedTagKeys.size > 0) {
      rows = rows.filter((a) => {
        const tset = (a.tags ?? []).map(normTag);
        for (const k of allSelectedTagKeys) if (tset.includes(k)) return true;
        return false;
      });
    }

    // Búsqueda con expansión
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

    // Ordenar
    rows.sort((a, b) => {
      if (sort === "az") return safeTitle(a).localeCompare(safeTitle(b));
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

  const categorySummary = React.useMemo(() => {
    const counts = new Map<string, number>();
    articles.forEach((article) => {
      const key = (article.category || "Guias").trim() || "Guias";
      counts.set(key, (counts.get(key) ?? 0) + 1);
    });
    return [...counts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6);
  }, [articles]);

  const featuredArticles = React.useMemo(() => {
    const defaults = [
      "5-steps-to-financial-freedom",
      "smart-money-newcomers-canada-2025",
      "wealth-with-confidence-women-toronto-2025",
      "buying-your-first-multi-unit-property",
      "rent-vs-buy-toronto-2025",
    ];
    const chosen = (featuredSlugs?.length ? featuredSlugs : defaults).filter((slug) =>
      articles.some((article) => article.slug === slug)
    );
    const bySlug = new Map(articles.map((article) => [article.slug, article]));
    return chosen.map((slug) => bySlug.get(slug)).filter((article): article is ClientArticle => Boolean(article));
  }, [articles, featuredSlugs]);

  /* ------------------------------ Nav de secciones ------------------------------ */
  const SECTIONS = [
    { id: "start-here", label: "Empieza aquí" },
    { id: "categories", label: "Categorias" },
    { id: "browse", label: "Explorar todo" },
    { id: "faq", label: "Cómo usarlo & FAQ" },
  ] as const;

  /* --------------------------------- Render --------------------------------- */
  return (
    <main className="bg-brand-beige min-h-screen pb-24">
      <PageHero
        homeHref="/es"
        homeLabel="Inicio"
        currentLabel="Recursos"
        title="Artículos y guías prácticas"
        subtitle="Lecturas breves sobre hipotecas, hábitos financieros e impuestos para profesionales y familias con poco tiempo."
        proofStats={[
          { value: "2 idiomas", label: "Recursos en español + inglés" },
          { value: "3 temas", label: "Hipoteca, hábitos financieros e impuestos" },
          { value: "Lectura rápida", label: "Contenido creado para agendas ocupadas" },
        ]}
        validation={{
          text: "Cada artículo es educativo y práctico, pensado para ayudarte a decidir tu próximo paso con más claridad.",
          ctaLabel: "Explorar servicios",
          ctaHref: "/es/servicios",
        }}
      />
      <StickySectionNav sections={SECTIONS} ariaLabel="En esta pagina" defaultActive="start-here" />

      <section className="px-4 mt-8 scroll-mt-24">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: "easeOut" }}>
          <Panel className="bg-white">
            <StartHereDecisionWidget lang="es" />
          </Panel>
        </motion.div>
      </section>

      {/* EMPIEZA AQUI */}
      <section id="start-here" className="px-4 mt-8 scroll-mt-24">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: "easeOut", delay: 0.12 }}>
          <Panel className="bg-white">
            <SectionTitle
              id="start-here-title"
              title="Empieza aqui"
              subtitle="Guias seleccionadas para caminos comunes"
              tint="green"
            />
            {featuredArticles.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2">
                {featuredArticles.map((article) => (
                  <ArticleCard
                    key={`feat-${article.slug}`}
                    article={article}
                    saved={savedSlugs.has(article.slug)}
                    onToggleSave={() => toggleSave(article.slug)}
                  />
                ))}
              </div>
            ) : (
              <p className="text-brand-blue/80 text-center">
                Pronto veras recursos destacados aqui. Mientras tanto, usa los filtros para explorar toda la biblioteca.
              </p>
            )}
          </Panel>
        </motion.div>
      </section>

      {/* CATEGORIAS / FILTROS */}
      <section className="px-4 mt-8 scroll-mt-24">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: "easeOut" }}>
          <Panel>
            <SectionTitle
              title="Categorias y filtros"
              subtitle={<>Usa personas, objetivos y etiquetas para acotar tu ruta antes de explorar todo.</>}
              id="categories"
              tint="gold"
            />

            {/* Personas */}
            <div className="mt-6 flex flex-wrap gap-2 justify-center">
              <button onClick={() => setSelectedPersona("all")} className={["px-3 py-1.5 rounded-full border text-sm transition", selectedPersona === "all" ? "bg-brand-green text-white border-brand-green" : "border-brand-gold/40 text-brand-green hover:bg-brand-green/10"].join(" ")}>Todas las personas</button>
              {personaIndex.map((p) => (
                <button key={p.key} onClick={() => setSelectedPersona(p.key)} className={["px-3 py-1.5 rounded-full border text-sm transition", selectedPersona === p.key ? "bg-brand-green text-white border-brand-green" : "border-brand-gold/40 text-brand-green hover:bg-brand-green/10"].join(" ")}>{p.label} {p.count > 0 && <span className="opacity-70">({p.count})</span>}</button>
              ))}
            </div>

            {/* Controles */}
            <div className="mt-8 grid gap-4 md:grid-cols-[1fr,auto,auto]">
              {/* Búsqueda */}
              <div>
                <label className="sr-only" htmlFor="search">Buscar</label>
                <input
                  id="search"
                  value={query}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
                  placeholder="Busca temas, p. ej., duelo, hipoteca, RRSP, flujo de caja…"
                  className="w-full px-4 py-3 rounded-xl border-2 border-brand-green/30 bg-white text-brand-body placeholder:text-brand-body/60 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/30 outline-none"
                />
              </div>

              {/* Orden / Vista / Reset */}
              <div className="flex gap-2">
                <label className="sr-only" htmlFor="sort">Ordenar</label>
                <select
                  id="sort"
                  value={sort}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                    const v = e.target.value as "new" | "old" | "az";
                    setSort(v);
                  }}
                  className="px-4 py-3 rounded-xl border-2 border-brand-green/30 bg-white text-brand-body focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/30 outline-none"
                >
                  <option value="new">Más nuevos primero</option>
                  <option value="old">Más antiguos primero</option>
                  <option value="az">A–Z</option>
                </select>

                <div className="isolate inline-flex rounded-xl overflow-hidden border-2 border-brand-green/30">
                  <button type="button" onClick={() => setView("grid")} className={["px-3 py-3 text-sm", view === "grid" ? "bg-brand-green text-white" : "bg-white text-brand-green"].join(" ")} aria-pressed={view === "grid"}>Cuadrícula</button>
                  <button type="button" onClick={() => setView("list")} className={["px-3 py-3 text-sm border-l-2 border-brand-green/30", view === "list" ? "bg-brand-green text-white" : "bg-white text-brand-green"].join(" ")} aria-pressed={view === "list"}>Lista</button>

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
                      className="ml-2 px-4 py-3 rounded-xl border-2 border-brand-gold text-brand-green hover:bg-brand-gold hover:text-brand-green transition"
                      aria-label="Borrar filtros"
                    >
                      Restablecer
                    </button>
                  )}
                </div>
              </div>

              {/* Guardados / Cajón */}
              <div className="flex gap-2">
                <div className="isolate inline-flex rounded-xl overflow-hidden border-2 border-brand-green/30">
                  <button type="button" onClick={() => setSelectedMode("All")} className={["px-3 py-3 text-sm", selectedMode === "All" ? "bg-brand-green text-white" : "bg-white text-brand-green"].join(" ")}>Todos</button>
                  <button type="button" onClick={() => setSelectedMode("Saved")} className={["px-3 py-3 text-sm border-l-2 border-brand-green/30", selectedMode === "Saved" ? "bg-brand-green text-white" : "bg-white text-brand-green"].join(" ")}>Guardados {savedCount > 0 && <span className="opacity-80">({savedCount})</span>}</button>
                </div>
                <button type="button" onClick={() => setDrawerOpen(true)} className="px-4 py-3 rounded-xl border-2 border-brand-blue text-brand-blue hover:bg-brand-blue hover:text-white transition text-sm">
                  Más filtros {(drawerSelectedTags.size > 0 || quickKeys.size > 0) && <span className="opacity-80">({drawerSelectedTags.size + quickKeys.size})</span>}
                </button>
              </div>
            </div>

            {/* Filtros rápidos: Objetivos */}
            <div className="mt-6">
              <div className="mb-2 text-sm font-semibold text-brand-green">Objetivos</div>
              <div className="flex flex-wrap gap-2">
                {OBJETIVOS.map((g) => {
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

            {/* Filtros rápidos: Momentos de vida */}
            <div className="mt-4">
              <div className="mb-2 text-sm font-semibold text-brand-green">Momentos de vida</div>
              <div className="flex flex-wrap gap-2">
                {EVENTOS.map((g) => {
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

            <div className="mt-8">
              <SectionTitle
                id="category-summary"
                title="Resumen por categoria"
                subtitle="Escanea rapido donde hay mas contenido antes de explorar todo."
                tint="green"
              />
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categorySummary.map(([name, count]) => (
                  <InfoCard
                    key={name}
                    title={name}
                    description={`${count} ${count === 1 ? "recurso" : "recursos"}`}
                  >
                    <div className="mt-4">
                      <Link
                        href="#browse"
                        className="inline-flex items-center rounded-full px-4 py-2 text-sm border border-brand-green text-brand-green hover:bg-brand-green hover:text-white transition"
                      >
                        Abrir en explorar
                      </Link>
                    </div>
                  </InfoCard>
                ))}
              </div>
            </div>

            <div className="mt-8">
              <ComparisonTable
                columns={["Ideal para", "Tiempo tipico", "Profundidad"]}
                rows={[
                  {
                    label: "Guias",
                    values: ["Aprender fundamentos", "5-12 min", "Base"],
                  },
                  {
                    label: "Checklists",
                    values: ["Planificar acciones", "8-15 min", "Pasos practicos"],
                  },
                  {
                    label: "Explicadores",
                    values: ["Aclarar un concepto", "4-8 min", "Enfocado"],
                  },
                  {
                    label: "Analisis",
                    values: ["Decisiones complejas", "10-18 min", "Detalle"],
                  },
                ]}
                footnote="Los formatos varian por tema; usa filtros y personas para acotar."
              />
            </div>
          </Panel>
        </motion.div>
      </section>

      {/* RESULTADOS */}
      <section id="browse" className="px-4 mt-8 scroll-mt-24">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: "easeOut", delay: 0.15 }}>
          <Panel>
            <div className="flex items-baseline justify-between mb-6">
              <h2 className="font-brand text-2xl text-brand-green font-semibold">
                {selectedMode === "All" ? "Todos los recursos" : "Guardados"}
                {(quickKeys.size > 0 || drawerSelectedTags.size > 0) && (
                  <span className="ml-2 text-base text-brand-body/70">
                    • {quickKeys.size + drawerSelectedTags.size} filtro{quickKeys.size + drawerSelectedTags.size === 1 ? "" : "s"}
                  </span>
                )}
              </h2>
              <div className="text-brand-body/80 text-sm">
                {filtered.length} {filtered.length === 1 ? "artículo" : "artículos"}
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

            {/* Bloque de ayuda */}
            <div className="mt-12 rounded-2xl border border-brand-gold bg-neutral-50 p-6">
              <h3 className="text-base font-sans font-semibold text-brand-green">¿No encuentras el recurso exacto?</h3>
              <p className="mt-1 text-sm text-brand-blue/90">Cuéntanos qué estás trabajando y te apuntamos a la herramienta correcta—o la creamos para ti.</p>
              <div className="mt-4">
                <Link href={ctaHref} className="inline-flex items-center rounded-full px-4 py-2 text-sm border-2 border-brand-green text-brand-green hover:bg-brand-green hover:text-white transition">
                  Solicitar un recurso
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
            <SectionTitle
              title="Cómo usarlo & Preguntas frecuentes"
              subtitle="Consejos rápidos sobre búsqueda, guardado, impresión y compartir."
              id="faq"
              tint="green"
            />
            <div className="grid gap-6 md:grid-cols-2">
              <InfoCard
                title="Buscar y filtrar"
                description={
                  <>
                    Usa la barra de búsqueda, elige una persona y aplica un par de filtros rápidos. Toca <em>Más filtros</em> para ver la lista completa.
                  </>
                }
              />
              <InfoCard
                title="Guardar para despues"
                description={
                  <>
                    Presiona <strong>Guardar</strong> en cualquier artículo para tenerlo a mano en este dispositivo.
                  </>
                }
              />
              <InfoCard
                title="Compartir"
                description={
                  <>
                    Envia un enlace con el botón <strong>Compartir</strong>-usa la función nativa de tu dispositivo.
                  </>
                }
              />
              <InfoCard
                title="Habla con Fanny"
                description="Lista/o para un plan personal? Usa el boton verde de arriba para reservar una consulta privada."
              />
            </div>
          </Panel>
        </motion.div>
      </section>

      {/* Cajón de filtros */}
      <FilterDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        tags={tagIndex?.tags ?? {}}
        selected={drawerSelectedTags}
        toggleTag={toggleTag}
        clearTags={clearTags}
      />
      <StickyNextStepBar
        lang="es"
        checklistHref="/es/herramientas/preparacion-impuestos"
        checklistLabel="Abrir checklist de temporada fiscal"
      />
    </main>
  );
}

/* ============================== Cajón de filtros ============================== */
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
          <h2 id="filter-heading" className="font-brand text-xl text-brand-green font-semibold">Filtros</h2>
          <button onClick={onClose} className="px-3 py-1.5 rounded-full border border-brand-green text-brand-green hover:bg-brand-green hover:text-white text-sm">Listo</button>
        </div>

        <div className="p-5 space-y-5 h-[calc(100%-60px)] overflow-auto">
          <div>
            <label htmlFor="tag-search" className="sr-only">Buscar etiquetas</label>
            <input
              id="tag-search"
              value={q}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQ(e.target.value)}
              placeholder="Buscar etiquetas…"
              className="w-full px-4 py-3 rounded-xl border-2 border-brand-green/30 bg-white text-brand-body placeholder:text-brand-body/60 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/30 outline-none"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm text-brand-body/80">{selected.size} seleccionada{selected.size === 1 ? "" : "s"}</div>
            <div className="flex gap-2">
              <button type="button" onClick={clearTags} className="px-3 py-1.5 rounded-full border-2 border-brand-gold text-brand-green hover:bg-brand-gold hover:text-brand-green transition text-sm">Limpiar</button>
              <button type="button" onClick={onClose} className="px-3 py-1.5 rounded-full border-2 border-brand-blue text-brand-blue hover:bg-brand-blue hover:text-white transition text-sm">Aplicar</button>
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
            {list.length === 0 && <div className="text-sm text-brand-body/70 italic col-span-full">No hay etiquetas que coincidan con “{q}”.</div>}
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
  const href = `/es/recursos/${article.slug}`;
  const dateStr = article.date
    ? new Date(parseDate(article.date)).toLocaleDateString("es-CA", { year: "numeric", month: "long", day: "numeric" })
    : null;

  const minutes = rt(article.readingTime);
  const blurb = getBlurb(article);
  const maxTags = 3;
  const tags = Array.isArray(article.tags) ? article.tags.slice(0, maxTags) : [];
  const extraCount = Array.isArray(article.tags) && article.tags.length > maxTags ? article.tags.length - maxTags : 0;
  const img = getImg(article);
  const hasImg = Boolean(img);

  type WebShareNavigator = Navigator & {
    share?: (data: { title?: string; text?: string; url?: string }) => Promise<void>;
    canShare?: (data?: unknown) => boolean;
  };

  const share = async () => {
    const url = typeof window !== "undefined" ? new URL(href, window.location.origin).toString() : href;
    try {
      const nav = (typeof navigator !== "undefined" ? (navigator as WebShareNavigator) : undefined);
      if (nav?.share) {
        await nav.share({ title: safeTitle(article), url });
      } else if (nav?.clipboard?.writeText) {
        await nav.clipboard.writeText(url);
        alert("Enlace copiado al portapapeles");
      }
    } catch {
      // no-op
    }
  };

  return (
    <article className={CARD + " overflow-hidden min-h-[420px] flex flex-col"}>
      <div className="relative aspect-[16/9] bg-gradient-to-br from-brand-blue/10 via-brand-gold/15 to-brand-green/10">
        {hasImg ? (
          <Image
            src={img as string}
            alt={safeTitle(article)}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
            loading="lazy"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/80 border border-brand-gold text-brand-green font-sans text-lg">
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

        <h3 className="font-sans text-xl md:text-2xl text-brand-blue font-semibold mb-2 leading-snug">
          <Link href={href} className="hover:underline">{safeTitle(article)}</Link>
        </h3>

        {blurb && <p className="text-brand-body mb-3 line-clamp-3">{blurb}</p>}

        {(tags.length > 0 || extraCount > 0) && (
          <div className="mt-auto pt-2 flex flex-wrap gap-2">
            {tags.map((t) => (
              <span key={t} className="text-xs px-2.5 py-1 rounded-full bg-brand-blue/10 text-brand-blue border border-brand-blue/30">#{t}</span>
            ))}
            {extraCount > 0 && (
              <span className="text-xs px-2.5 py-1 rounded-full bg-white text-brand-green border border-brand-green/40">+{extraCount} más</span>
            )}
          </div>
        )}

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <Link href={href} className="inline-block">
            <button
              className="px-6 py-2 bg-brand-gold text-brand-green rounded-full font-sans font-bold shadow hover:bg-brand-blue hover:text-white transition"
              onClick={() => {
                try {
                  const key = "resource:recent:es";
                  const raw = localStorage.getItem(key);
                  const list: string[] = raw ? JSON.parse(raw) : [];
                  const next = [article.slug, ...list.filter((s) => s !== article.slug)].slice(0, 20);
                  localStorage.setItem(key, JSON.stringify(next));
                } catch {}
              }}
            >
              Leer artículo
            </button>
          </Link>

          <button type="button" onClick={share} className="px-4 py-2 rounded-full border-2 border-brand-green text-brand-green hover:bg-brand-green hover:text-white transition text-sm">Compartir</button>

          <button
            type="button"
            onClick={onToggleSave}
            aria-label={saved ? "Quitar de guardados" : "Guardar para después"}
            className={["px-4 py-2 rounded-full border-2 transition text-sm", saved ? "border-brand-blue bg-brand-blue text-white" : "border-brand-blue text-brand-blue hover:bg-brand-blue hover:text-white"].join(" ")}
          >
            {saved ? "Guardado ★" : "Guardar ☆"}
          </button>
        </div>
      </div>
    </article>
  );
}

/* ============================== FILA DE LISTA ACTUALIZADA ============================== */
function ListRow({
  article,
  saved,
  onToggleSave,
}: {
  article: ClientArticle;
  saved: boolean;
  onToggleSave: () => void;
}) {
  const href = `/es/recursos/${article.slug}`;
  const minutes = rt(article.readingTime);
  const dateStr = article.date
    ? new Date(parseDate(article.date)).toLocaleDateString("es-CA", { year: "numeric", month: "short", day: "numeric" })
    : null;
  const tags = (article.tags ?? []).slice(0, 4);
  const thumb = getImg(article);

  return (
    <div className="grid grid-cols-[96px,1fr] md:grid-cols-[96px,1fr,auto] auto-rows-auto items-start md:items-center gap-3 md:gap-4 p-4">
      {/* Miniatura */}
      <div className="w-24 h-14 rounded-lg overflow-hidden border border-brand-gold bg-brand-blue/10 shrink-0 relative row-span-3 md:row-span-1">
        {thumb ? (
          <Image
            src={thumb}
            alt={safeTitle(article)}
            fill
            sizes="96px"
            className="object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-brand-green font-sans">{initials(article.category)}</span>
          </div>
        )}
      </div>

      {/* Título */}
      <div className="col-start-2 md:col-start-2 md:col-span-1">
        <Link href={href} className="block">
          <h3 className="font-sans font-semibold text-brand-blue text-lg leading-snug hover:underline line-clamp-3">
            {safeTitle(article)}
          </h3>
        </Link>
      </div>

      {/* Meta: categoría / minutos / fecha / tags */}
      <div className="col-start-2 md:col-start-2 md:col-span-1 mt-1">
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {article.category && <TagBadge>{article.category}</TagBadge>}
          {minutes && <span className="text-brand-body/80">{minutes}</span>}
          {dateStr && <time className="text-brand-body/60">{dateStr}</time>}
          {tags.map((t) => (
            <span key={t} className="text-xs px-2 py-0.5 rounded-full bg-brand-blue/10 text-brand-blue border border-brand-blue/30">#{t}</span>
          ))}
        </div>
      </div>

      {/* Acciones */}
      <div className="col-start-2 md:col-start-3 md:row-start-1 md:self-center mt-2 md:mt-0 flex items-center gap-2">
        <Link href={href} className="px-3 py-1.5 rounded-full border border-brand-green text-brand-green hover:bg-brand-green hover:text-white text-sm">Leer</Link>
        <button
          type="button"
          onClick={onToggleSave}
          className={["px-3 py-1.5 rounded-full border text-sm", saved ? "border-brand-blue bg-brand-blue text-white" : "border-brand-blue text-brand-blue hover:bg-brand-blue hover:text-white"].join(" ")}
        >
          {saved ? "Guardado" : "Guardar"}
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
        No hay resultados para <span className="font-semibold">“{query}”</span>.
      </p>
      <p className="mt-2 text-sm text-brand-body/80">
        Prueba un objetivo como <em>Comprar vivienda</em> o <em>Invertir en bienes raíces</em>, o abre <em>Más filtros</em>.
      </p>
      <div className="mt-4 flex items-center justify-center gap-2">
        <button type="button" onClick={onClear} className="inline-flex items-center rounded-full px-4 py-2 text-sm border-2 border-brand-green text-brand-green hover:bg-brand-green hover:text-white transition">Borrar filtros</button>
        <Link href={ctaHref} className="inline-flex items-center rounded-full px-4 py-2 text-sm border-2 border-brand-blue text-brand-blue hover:bg-brand-blue hover:text-white transition">Pedir una recomendación</Link>
      </div>
    </div>
  );
}
