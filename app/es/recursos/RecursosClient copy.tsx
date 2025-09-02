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

/* ============================== Utilidades ============================== */
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

/* ============================== Componente ============================== */
export default function RecursosClient({
  articles,
  categories,
  ctaHref = "/es/contacto?intent=pregunta",
  newsletterHref = "/es/suscribirse",
  personas,
  featuredSlugs,
  views,
  // URL opcional (legacy) o datos en memoria (preferido)
  tagsUrl = "/data/resources-tags-es.json",
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
  /* ----------------------------- Estado local ----------------------------- */
  const [query, setQuery] = React.useState("");
  const [selectedFilter, setSelectedFilter] = React.useState<string>("Todo"); // etiqueta o especial ("Todo", "Guardados")
  const [sort, setSort] = React.useState<"new" | "old" | "az">("new");
  const [view, setView] = React.useState<"grid" | "list">(
    (views?.[0]?.key as "grid" | "list") || "grid"
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

  /* ---------------------- Índice de etiquetas (prefer memoria) ---------------------- */
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

  /* ------------------------- Personas (según índice) ------------------------- */
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

    // Fallback: inferencia aproximada por tags
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
      mk("families", "Familias y Parejas", families),
      mk("professionals", "Profesionales", professionals),
      mk("newcomers", "Recién Llegados", newcomers),
      mk("entrepreneurs", "Emprendedores y Autónomos", entrepreneurs),
      mk("investors", "Inversionistas Inmobiliarios", investors),
      mk("holistic", "Holístico y Diseño Humano", holistic),
    ];
  }, [articles, personas, tagIndex]);

  /* ----------------------------- Destacados ----------------------------- */
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

  /* ------------------------- Opciones y conteos de filtro ------------------------ */
  const filterCounts = React.useMemo(() => {
    if (useTagMode && tagIndex?.tags) {
      const counts = new Map<string, number>([["Todo", articles.length]]);
      for (const [tag, obj] of Object.entries(tagIndex.tags)) counts.set(tag, obj.count);
      counts.set(
        "Guardados",
        [...savedSlugs].filter((s) => articles.some((a) => a.slug === s)).length
      );
      return { counts, keys: ["Todo", "Guardados", ...Object.keys(tagIndex.tags)] };
    }

    // Fallback a categorías si no hay índice de tags
    const counts = new Map<string, number>();
    counts.set("Todo", articles.length);
    for (const a of articles) {
      const c = (a.category ?? "").trim();
      if (!c) continue;
      counts.set(c, (counts.get(c) ?? 0) + 1);
    }
    counts.set(
      "Guardados",
      [...savedSlugs].filter((s) => articles.some((a) => a.slug === s)).length
    );
    const keys = ["Todo", "Guardados", ...Array.from(new Set(categories))];
    return { counts, keys };
  }, [articles, categories, savedSlugs, tagIndex, useTagMode]);

  /* --------------------------------- Filtrado --------------------------------- */
  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    let rows = [...articles];

    // Filtro por persona
    if (selectedPersona !== "all") {
      const persona = personaIndex.find((p) => p.key === selectedPersona);
      const set = new Set((persona?.slugs ?? []).filter(Boolean));
      rows = rows.filter((a) => set.has(a.slug));
    }

    // Filtro por etiqueta/categoría
    if (selectedFilter === "Guardados") {
      rows = rows.filter((a) => savedSlugs.has(a.slug));
    } else if (selectedFilter !== "Todo") {
      if (useTagMode) {
        const tagKey = normTag(selectedFilter);
        rows = rows.filter((a) => (a.tags ?? []).map(normTag).includes(tagKey));
      } else {
        rows = rows.filter((a) => normalize(a.category) === normalize(selectedFilter));
      }
    }

    // Búsqueda
    if (q) {
      rows = rows.filter((a) => {
        const hay = `${a.title} ${a.excerpt ?? ""} ${a.summary ?? ""} ${(a.tags ?? []).join(" ")} ${(a.category ?? "")}`.toLowerCase();
        return hay.includes(q);
      });
    }

    // Orden
    rows.sort((a, b) => {
      if (sort === "az") return a.title.localeCompare(b.title, "es");
      const ad = parseDate(a.date);
      const bd = parseDate(b.date);
      return sort === "new" ? bd - ad : ad - bd;
    });

    return rows;
  }, [articles, query, selectedFilter, sort, savedSlugs, selectedPersona, personaIndex, useTagMode]);

  const hasActiveFilters =
    query.trim() !== "" || selectedFilter !== "Todo" || sort !== "new" || selectedPersona !== "all";

  /* ------------------------------ Nav de secciones ------------------------------ */
  const SECTIONS = [
    { id: "overview", label: "Resumen" },
    { id: "featured", label: "Destacados" },
    { id: "browse", label: "Explorar Todo" },
    { id: "faq", label: "Cómo Usar y Preguntas" },
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
        <nav className="max-w-content mx-auto px-4 py-2 flex gap-2 overflow-x-auto text-sm" aria-label="En esta página">
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
      {/* Sticky section nav */}
      <SectionNav />

      {/* HERO / RESUMEN */}
      <section id="overview" className="pt-10 px-4 scroll-mt-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <Panel>
            <SectionTitle
              title="Artículos y Guías Útiles"
              subtitle={
                <>
                  Lecturas cortas y prácticas sobre hipotecas, comportamiento del dinero e impuestos,
                  pensadas para familias y profesionales con poco tiempo. Guarda lo que necesites,
                  comparte enlaces y contáctanos cuando quieras un plan personal.
                </>
              }
              id="overview"
              level="h1"
            />

            {/* CTAs */}
            <div className="mt-2 flex flex-wrap items-center gap-3 justify-center">
              <Link
                href={ctaHref}
                className="px-5 py-2.5 bg-brand-green text-white rounded-full font-semibold hover:bg-brand-gold hover:text-brand-green border border-brand-green/20 transition"
              >
                Habla con Fanny
              </Link>
              <Link
                href={newsletterHref}
                className="inline-flex items-center rounded-full px-4 py-2 text-sm border-2 border-brand-green text-brand-green hover:bg-brand-green hover:text-white transition"
              >
                Recibir el Boletín
              </Link>
            </div>

            {/* Pastillas de Personas */}
            <div className="mt-6 flex flex-wrap gap-2 justify-center">
              <button
                onClick={() => setSelectedPersona("all")}
                className={[
                  "px-3 py-1.5 rounded-full border text-sm transition",
                  selectedPersona === "all"
                    ? "bg-brand-green text-white border-brand-green"
                    : "border-brand-gold/40 text-brand-green hover:bg-brand-green/10",
                ].join(" ")}
              >
                Todas las personas
              </button>
              {personaIndex.map((p) => (
                <button
                  key={p.key}
                  onClick={() => setSelectedPersona(p.key)}
                  className={[
                    "px-3 py-1.5 rounded-full border text-sm transition",
                    selectedPersona === p.key
                      ? "bg-brand-green text-white border-brand-green"
                      : "border-brand-gold/40 text-brand-green hover:bg-brand-green/10",
                  ].join(" ")}
                >
                  {p.label} {p.count > 0 && <span className="opacity-70">({p.count})</span>}
                </button>
              ))}
            </div>

            {/* Controles */}
            <div className="mt-8 grid gap-4 md:grid-cols-[1fr,auto,auto]">
              <div>
                <label className="sr-only" htmlFor="search">
                  Buscar
                </label>
                <input
                  id="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Busca temas: hipoteca, RRSP, flujo de caja…"
                  className="w-full px-4 py-3 rounded-xl border-2 border-brand-green/30 bg-white text-brand-body placeholder:text-brand-body/60 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/30 outline-none"
                />
              </div>

              <div className="flex gap-2">
                <label className="sr-only" htmlFor="sort">
                  Ordenar
                </label>
                <select
                  id="sort"
                  value={sort}
                  onChange={(e) => setSort(e.target.value as any)}
                  className="px-4 py-3 rounded-xl border-2 border-brand-green/30 bg-white text-brand-body focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/30 outline-none"
                >
                  <option value="new">Más nuevos primero</option>
                  <option value="old">Más antiguos primero</option>
                  <option value="az">A–Z</option>
                </select>

                {/* Vista */}
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
                    Cuadrícula
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
                    Lista
                  </button>

                  {hasActiveFilters && (
                    <button
                      type="button"
                      onClick={() => {
                        setQuery("");
                        setSelectedFilter("Todo");
                        setSort("new");
                        setSelectedPersona("all");
                      }}
                      className="ml-2 px-4 py-3 rounded-xl border-2 border-brand-gold text-brand-green hover:bg-brand-gold hover:text-white transition"
                      aria-label="Limpiar filtros"
                    >
                      Reset
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Filtros (preferir etiquetas canónicas) */}
            <div className="mt-6 flex flex-wrap gap-2">
              {filterCounts.keys.map((key) => {
                const count = filterCounts.counts.get(key) ?? 0;
                const active = selectedFilter === key;
                const label =
                  key === "Todo" || key === "Guardados" || !useTagMode
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

      {/* DESTACADOS */}
      {featured.length > 0 && (
        <section id="featured" className="px-4 mt-8 scroll-mt-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.12 }}
          >
            <Panel className="bg-white">
              <div className="flex items-baseline justify-between mb-4">
                <h2 className="font-serif text-2xl text-brand-green font-bold">Empieza aquí</h2>
                <span className="text-sm text-brand-body/70">Selección para recorridos habituales</span>
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

      {/* RESULTADOS */}
      <section id="browse" className="px-4 mt-8 scroll-mt-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.15 }}
        >
          <Panel>
            <div className="flex items-baseline justify-between mb-6">
              <h2 className="font-serif text-2xl text-brand-green font-bold">
                {selectedFilter === "Todo"
                  ? "Todos los Recursos"
                  : (useTagMode && selectedFilter !== "Guardados" ? titleCase(selectedFilter) : selectedFilter)}
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
                  setSelectedFilter("Todo");
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

            {/* Bloque de ayuda */}
            <div className="mt-12 rounded-2xl border border-brand-gold bg-neutral-50 p-6">
              <h3 className="text-base font-serif font-bold text-brand-green">
                ¿No encuentras justo lo que necesitas?
              </h3>
              <p className="mt-1 text-sm text-brand-blue/90">
                Cuéntanos en qué estás trabajando y te recomendaremos la herramienta adecuada—o la creamos para ti.
              </p>
              <div className="mt-4">
                <Link
                  href={ctaHref}
                  className="inline-flex items-center rounded-full px-4 py-2 text-sm border-2 border-brand-green text-brand-green hover:bg-brand-green hover:text-white transition"
                >
                  Solicitar un Recurso
                </Link>
              </div>
            </div>
          </Panel>
        </motion.div>
      </section>

      {/* FAQ / CÓMO USAR */}
      <section id="faq" className="px-4 mt-8 scroll-mt-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.18 }}
        >
          <Panel>
            <SectionTitle
              title="Cómo Usar y Preguntas"
              subtitle="Consejos rápidos para buscar, guardar, imprimir y compartir."
              id="faq"
            />
            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-2xl border border-brand-gold/50 p-5">
                <h3 className="font-serif font-bold text-brand-green text-lg mb-2">Buscar y Filtrar</h3>
                <p className="text-brand-blue/90 text-sm">
                  Usa la barra de búsqueda, elige una persona y aplica filtros por etiqueta. Pulsa <em>Reset</em> para limpiar rápido.
                </p>
              </div>
              <div className="rounded-2xl border border-brand-gold/50 p-5">
                <h3 className="font-serif font-bold text-brand-green text-lg mb-2">Guardar para Después</h3>
                <p className="text-brand-blue/90 text-sm">
                  Pulsa <strong>Guardar</strong> en cualquier artículo para tenerlo a mano en este dispositivo.
                </p>
              </div>
              <div className="rounded-2xl border border-brand-gold/50 p-5">
                <h3 className="font-serif font-bold text-brand-green text-lg mb-2">Compartir</h3>
                <p className="text-brand-blue/90 text-sm">
                  Envía un enlace con el botón <strong>Compartir</strong>—usa el sistema nativo de tu dispositivo.
                </p>
              </div>
              <div className="rounded-2xl border border-brand-gold/50 p-5">
                <h3 className="font-serif font-bold text-brand-green text-lg mb-2">Habla con Fanny</h3>
                <p className="text-brand-blue/90 text-sm">
                  ¿Lista/o para un plan personal? Usa el botón verde para reservar una consulta privada.
                </p>
              </div>
            </div>
          </Panel>
        </motion.div>
      </section>
    </main>
  );
}

/* ============================== Tarjetas ============================== */

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
    ? new Date(parseDate(article.date)).toLocaleDateString("es-CA", {
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
        alert("Enlace copiado al portapapeles");
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
                +{extraCount} más
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
              Leer Artículo
            </button>
          </Link>

          <button
            type="button"
            onClick={share}
            className="px-4 py-2 rounded-full border-2 border-brand-green text-brand-green hover:bg-brand-green hover:text-white transition text-sm"
          >
            Compartir
          </button>

          <button
            type="button"
            onClick={onToggleSave}
            aria-label={saved ? "Quitar de guardados" : "Guardar para después"}
            className={[
              "px-4 py-2 rounded-full border-2 transition text-sm",
              saved
                ? "border-brand-blue bg-brand-blue text-white"
                : "border-brand-blue text-brand-blue hover:bg-brand-blue hover:text-white",
            ].join(" ")}
          >
            {saved ? "Guardado ★" : "Guardar ☆"}
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
  const href = `/es/recursos/${article.slug}`;
  const minutes = rt(article.readingTime);
  const dateStr = article.date
    ? new Date(parseDate(article.date)).toLocaleDateString("es-CA", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : null;

  const tags = (article.tags ?? []).slice(0, 4);

  return (
    <div className="flex items-center gap-4 p-4">
      {/* Miniatura */}
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

      {/* Texto */}
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

      {/* Acciones */}
      <div className="flex items-center gap-2 shrink-0">
        <Link
          href={href}
          className="px-3 py-1.5 rounded-full border border-brand-green text-brand-green hover:bg-brand-green hover:text-white text-sm"
        >
          Leer
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
        Sin resultados para <span className="font-semibold">“{query}”</span>.
      </p>
      <div className="mt-4 flex items-center justify-center gap-2">
        <button
          type="button"
          onClick={onClear}
          className="inline-flex items-center rounded-full px-4 py-2 text-sm border-2 border-brand-green text-brand-green hover:bg-brand-green hover:text-white transition"
        >
          Limpiar filtros
        </button>
        <Link
          href={ctaHref}
          className="inline-flex items-center rounded-full px-4 py-2 text-sm border-2 border-brand-blue text-brand-blue hover:bg-brand-blue hover:text-white transition"
        >
          Pedir una recomendación
        </Link>
      </div>
    </div>
  );
}
