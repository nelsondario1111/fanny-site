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
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
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
  // usa las etiquetas canónicas que generas en page.tsx (mortgages, financial-planning, etc.)
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
  categories,
  ctaHref = "/es/contacto?intent=pregunta",
  newsletterHref = "/es/suscribirse",
  personas,
  featuredSlugs = [],
  views = [
    { key: "grid", label: "Cuadrícula" },
    { key: "list", label: "Lista" },
  ],
  tagsData,
}: {
  articles: ClientArticle[];
  categories?: string[];
  ctaHref?: string;
  newsletterHref?: string;
  personas?: PersonaIndex[];
  featuredSlugs?: string[];
  views?: Array<{ key: "grid" | "list" | string; label: string }>;
  tagsData?: TagsIndex | null;
}) {
  /* ---------------------------- Estado UI ---------------------------- */
  const [query, setQuery] = React.useState<string>("");
  const [view, setView] = React.useState<string>(views[0]?.key ?? "grid");
  const [sort, setSort] = React.useState<"new" | "old" | "az">("new");
  const [selectedCategory, setSelectedCategory] = React.useState<string | null>(null);
  // Only read the selectedPersona value (no unused setter)
  const [selectedPersona] = React.useState<PersonaKey | "">("");

  const personaSlugSet = React.useMemo(() => {
    if (!selectedPersona || !personas) return null;
    const p = personas.find((x) => x.key === selectedPersona);
    return p ? new Set(p.slugs) : null;
  }, [selectedPersona, personas]);

  const categorySlugSet = React.useMemo(() => {
    if (!selectedCategory || !tagsData) return null;
    const cat = tagsData.categories[selectedCategory];
    return cat ? new Set(cat.slugs) : null;
  }, [selectedCategory, tagsData]);

  /* ------------------------ Derivar lista final ------------------------ */
  const featuredSet = new Set(featuredSlugs);

  const filtered = React.useMemo(() => {
    let list = [...articles];

    // search
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter((a) =>
        [a.title, a.summary, a.excerpt, (a.tags || []).join(" ")].join(" ").toLowerCase().includes(q)
      );
    }

    // category filter via tagsData
    if (categorySlugSet) {
      list = list.filter((a) => categorySlugSet.has(a.slug));
    }

    // persona filter via slugs
    if (personaSlugSet) {
      list = list.filter((a) => personaSlugSet.has(a.slug));
    }

    // sort
    list.sort((a, b) => {
      if (sort === "az") return a.title.localeCompare(b.title);
      const da = parseDate(a.date);
      const db = parseDate(b.date);
      return sort === "new" ? db - da : da - db;
    });

    return list;
  }, [articles, query, sort, categorySlugSet, personaSlugSet]);

  const featured = filtered.filter((a) => featuredSet.has(a.slug));
  const nonFeatured = filtered.filter((a) => !featuredSet.has(a.slug));

  /* ------------------------------ Render ------------------------------ */
  return (
    <main id="main" className="bg-white min-h-screen">
      {/* Encabezado */}
      <Panel>
        <SectionTitle
          id="overview"
          title="Recursos y Guías"
          subtitle="Explora artículos prácticos sobre hipotecas, flujo de caja, impuestos y construcción de patrimonio—en español."
          level="h1"
        />

        {/* Controles */}
        <div className="flex flex-wrap gap-3 items-center justify-between">
          {/* Búsqueda */}
          <div className="flex items-center gap-2">
            <label htmlFor="q" className="sr-only">
              Buscar
            </label>
            <input
              id="q"
              value={query}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
              placeholder="Buscar temas o palabras…"
              className="px-4 py-3 rounded-xl border-2 border-brand-green/30 bg-white text-brand-body placeholder:text-brand-body/60 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/30 outline-none min-w-[240px]"
            />

            {/* Categorías (pastillas bonitas si existen) */}
            {categories && categories.length > 0 && (
              <div className="hidden md:flex flex-wrap gap-2 ml-2">
                {categories.map((c) => {
                  const count = tagsData?.categories?.[c]?.count ?? undefined;
                  const active = selectedCategory === c;
                  return (
                    <button
                      key={c}
                      onClick={() => setSelectedCategory(active ? null : c)}
                      className={[
                        "px-3 py-1.5 rounded-full text-sm border transition",
                        active
                          ? "bg-brand-green text-white border-brand-green"
                          : "border-brand-gold/40 text-brand-green hover:bg-brand-green/10",
                      ].join(" ")}
                      aria-pressed={active}
                      title={count ? `${c} (${count})` : c}
                    >
                      {c} {typeof count === "number" && <span className="opacity-70">({count})</span>}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Orden + Vista */}
          <div className="flex items-center gap-2">
            <label className="text-sm text-brand-blue/80" htmlFor="sort">
              Ordenar:
            </label>
            <select
              id="sort"
              value={sort}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                setSort(e.target.value as "new" | "old" | "az")
              }
              className="px-4 py-3 rounded-xl border-2 border-brand-green/30 bg-white text-brand-body focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/30 outline-none"
            >
              <option value="new">Más nuevos primero</option>
              <option value="old">Más antiguos primero</option>
              <option value="az">A–Z</option>
            </select>

            <div className="ml-2 flex gap-1">
              {views.map((v) => {
                const active = view === v.key;
                return (
                  <button
                    key={v.key}
                    onClick={() => setView(v.key)}
                    className={[
                      "px-3 py-1.5 rounded-full text-sm border transition",
                      active
                        ? "bg-brand-green text-white border-brand-green"
                        : "border-brand-gold/40 text-brand-green hover:bg-brand-green/10",
                    ].join(" ")}
                    aria-pressed={active}
                  >
                    {v.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Filtros rápidos */}
        <div className="mt-4 grid md:grid-cols-2 gap-3">
          <div className="rounded-2xl border border-brand-gold/60 p-3">
            <div className="text-sm text-brand-blue/80 mb-2">Objetivos rápidos</div>
            <div className="flex flex-wrap gap-2">
              {OBJETIVOS.map((f) => (
                <TagBadge key={f.key}>{f.label}</TagBadge>
              ))}
            </div>
          </div>
          <div className="rounded-2xl border border-brand-gold/60 p-3">
            <div className="text-sm text-brand-blue/80 mb-2">Momentos de vida</div>
            <div className="flex flex-wrap gap-2">
              {EVENTOS.map((f) => (
                <TagBadge key={f.key}>{f.label}</TagBadge>
              ))}
            </div>
          </div>
        </div>
      </Panel>

      {/* Destacados */}
      {featured.length > 0 && (
        <Panel className="pt-0">
          <SectionTitle id="featured" title="Destacados" />
          <ArticleGrid articles={featured} />
        </Panel>
      )}

      {/* Lista completa */}
      <Panel className="pt-0">
        <SectionTitle id="all" title="Todos los artículos" />
        {filtered.length === 0 ? (
          <p className="text-brand-blue/70">No hay artículos que coincidan con tu búsqueda/filtros.</p>
        ) : view === "list" ? (
          <ArticleList articles={nonFeatured} />
        ) : (
          <ArticleGrid articles={nonFeatured} />
        )}
      </Panel>

      {/* CTA / Newsletter */}
      <Panel className="pt-0">
        <div className={CARD}>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="font-serif text-xl text-brand-green font-bold m-0">¿Te acompaño en privado?</h3>
              <p className="m-0 text-brand-blue/90">
                Reserva una consulta y recibe próximos pasos claros para tu caso.
              </p>
            </div>
            <div className="flex gap-3">
              <Link
                href={ctaHref}
                className="px-5 py-2.5 bg-brand-green text-white rounded-full font-semibold hover:bg-brand-gold hover:text-brand-green border border-brand-green/20 transition"
              >
                Reservar consulta
              </Link>
              <Link
                href={newsletterHref}
                className="px-5 py-2.5 rounded-full border border-brand-blue/40 text-brand-blue hover:bg-brand-blue hover:text-white transition"
              >
                Unirme al boletín
              </Link>
            </div>
          </div>
        </div>
      </Panel>
    </main>
  );
}

/* ============================ Cards/List ============================ */
function ArticleGrid({ articles }: { articles: ClientArticle[] }) {
  const { fade } = useAnims();
  return (
    <motion.div
      variants={fade}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      {articles.map((a) => (
        <article key={a.slug} className={CARD}>
          <Link href={`/es/recursos/${a.slug}`} className="block group">
            {/* Imagen / avatar */}
            {getImg(a) ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={getImg(a) as string}
                alt={a.title}
                className="w-full h-40 object-cover rounded-2xl border border-brand-gold/40"
                loading="lazy"
              />
            ) : (
              <div className="w-full h-40 rounded-2xl border border-brand-gold/40 bg-brand-beige/60 grid place-items-center text-3xl font-serif text-brand-green">
                {initials(a.title)}
              </div>
            )}

            <h3 className="mt-3 font-serif text-xl text-brand-green font-bold group-hover:underline">
              {a.title}
            </h3>
            {a.summary || a.excerpt ? (
              <p className="mt-1 text-brand-blue/90">{getBlurb(a)}</p>
            ) : null}

            <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-brand-blue/70">
              {a.tags?.slice(0, 3).map((t) => (
                <TagBadge key={t}>{titleCase(normTag(t))}</TagBadge>
              ))}
              {rt(a.readingTime) && <span className="ml-auto">{rt(a.readingTime)}</span>}
            </div>
          </Link>
        </article>
      ))}
    </motion.div>
  );
}

function ArticleList({ articles }: { articles: ClientArticle[] }) {
  return (
    <ul className="divide-y divide-brand-gold/30">
      {articles.map((a) => (
        <li key={a.slug} className="py-4">
          <Link href={`/es/recursos/${a.slug}`} className="group grid grid-cols-12 gap-3 items-start">
            <div className="col-span-2 md:col-span-1">
              {getImg(a) ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={getImg(a) as string}
                  alt={a.title}
                  className="w-16 h-16 object-cover rounded-xl border border-brand-gold/40"
                  loading="lazy"
                />
              ) : (
                <div className="w-16 h-16 rounded-xl border border-brand-gold/40 bg-brand-beige/60 grid place-items-center text-lg font-serif text-brand-green">
                  {initials(a.title)}
                </div>
              )}
            </div>
            <div className="col-span-10 md:col-span-11">
              <h3 className="font-serif text-lg text-brand-green font-bold m-0 group-hover:underline">
                {a.title}
              </h3>
              {a.summary || a.excerpt ? (
                <p className="m-0 mt-0.5 text-brand-blue/90">{getBlurb(a)}</p>
              ) : null}
              <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-brand-blue/70">
                {a.tags?.slice(0, 3).map((t) => (
                  <TagBadge key={t}>{titleCase(normTag(t))}</TagBadge>
                ))}
                {rt(a.readingTime) && <span className="ml-auto">{rt(a.readingTime)}</span>}
              </div>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
