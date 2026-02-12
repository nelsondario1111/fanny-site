// app/es/recursos/[article]/page.tsx
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { getArticle, getAllArticles } from "@/lib/getArticles";
import ArticleActions from "@/components/ArticleActions";
import ArticleTOC from "@/components/ArticleTOC";
import RelatedArticles from "@/components/RelatedArticles";

/** URL absoluta del sitio para SEO (ajusta si usas config/env). */
const SITE_URL = "https://www.fannysamaniego.com";

/** Leer el mapa de slugs i18n generado (si existe). */
type PairDict = Record<string, { en: string; es: string }>;
type I18nMap = { resources?: PairDict; tools?: PairDict };

async function loadI18nMap(): Promise<I18nMap> {
  try {
    const mod = await import("@/content/i18n-slugs.json");
    return (mod as { default: I18nMap }).default ?? (mod as unknown as I18nMap);
  } catch {
    return {};
  }
}

function altResourceSlug(i18n: I18nMap, currentSlug: string, target: "en" | "es"): string | null {
  const dict = i18n?.resources || {};
  for (const [, v] of Object.entries(dict)) {
    if (v.en === currentSlug || v.es === currentSlug) {
      return v[target] || null;
    }
  }
  return null;
}

type SimpleArticle = {
  slug: string;
  title?: string | null;
  category?: string | null;
  date?: string | Date | null;
  updated?: string | Date | null;
};

// Helpers
const stripFrontMatterFromHtml = (html: string) => {
  let out = html;
  out = out.replace(
    /<p>\s*(title|summary|category|date|updated|author|slug|tags):[\s\S]*?<\/p>\s*/i,
    ""
  );
  out = out.replace(/^(?:\s*<ul>[\s\S]*?<\/ul>\s*)/i, "");
  out = out.replace(/<pre><code>---[\s\S]*?---<\/code><\/pre>\s*/i, "");
  return out.trim();
};

/** Tiempo de lectura: usa 200 wpm para ES, con fallback a `readingTimeMin` si existe. */
const toReadingTime = (raw: { html?: string; summary?: string | null; readingTimeMin?: number }) => {
  if (typeof raw.readingTimeMin === "number" && Number.isFinite(raw.readingTimeMin)) {
    return `${raw.readingTimeMin} min de lectura`;
  }
  const text = `${raw.summary ?? ""} ${raw.html ?? ""}`.replace(/<[^>]*>/g, " ");
  const words = text.split(/\s+/).filter(Boolean).length;
  return `${Math.max(1, Math.round(words / 200))} min de lectura`;
};

const parseTime = (v?: string | Date | null) => {
  if (!v) return 0;
  const t = v instanceof Date ? v.getTime() : Date.parse(String(v));
  return Number.isFinite(t) ? t : 0;
};

function getPrevNext(all: SimpleArticle[], currentSlug: string, currentCat?: string | null) {
  const byDateDesc = [...all].sort((a, b) => parseTime(b.date) - parseTime(a.date));
  const pool =
    currentCat
      ? byDateDesc.filter((a) => (a.category ?? "").trim() === (currentCat ?? "").trim())
      : byDateDesc;

  const idx = pool.findIndex((a) => a.slug === currentSlug);
  if (idx === -1) {
    const i2 = byDateDesc.findIndex((a) => a.slug === currentSlug);
    return {
      prev: i2 > 0 ? byDateDesc[i2 - 1] : null,
      next: i2 >= 0 && i2 < byDateDesc.length - 1 ? byDateDesc[i2 + 1] : null,
    };
  }
  return {
    prev: idx > 0 ? pool[idx - 1] : null,
    next: idx < pool.length - 1 ? pool[idx + 1] : null,
  };
}

/** Type guard para `heroAlt` sin usar `any`. */
function hasHeroAlt(x: unknown): x is { heroAlt?: string | null } {
  return typeof x === "object" && x !== null && "heroAlt" in x;
}

// Static params & metadata
export async function generateStaticParams() {
  const items = (await getAllArticles("es")) ?? [];
  return items.map((a) => ({ article: a.slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ article: string }> }
): Promise<Metadata> {
  const { article } = await params;

  const a = await getArticle("es", article);
  if (!a) return {};

  const i18n = await loadI18nMap();
  const mappedEn = altResourceSlug(i18n, article, "en");
  const hasSameSlugEn = await getArticle("en", article).then(Boolean).catch(() => false);

  const languages: Record<string, string> = { es: `/es/recursos/${article}` };
  if (mappedEn) {
    languages.en = `/en/resources/${mappedEn}`;
  } else if (hasSameSlugEn) {
    languages.en = `/en/resources/${article}`;
  }

  const rawSummary = (a.summary && String(a.summary)) || (a.excerpt && String(a.excerpt)) || "";
  const description = rawSummary.replace(/<[^>]+>/g, "").slice(0, 280) || "Guía útil sobre hipotecas, hábitos financieros y nociones de impuestos.";

  const ogImage = a.ogImage || a.hero || a.image || undefined;

  return {
    title: a.title,
    description,
    keywords: Array.isArray(a.tags) ? a.tags : undefined,
    openGraph: {
      title: a.title,
      description,
      images: ogImage ? [ogImage] : undefined,
      type: "article",
    },
    alternates: { languages },
  };
}

// Page
export default async function ArticlePage(
  { params }: { params: Promise<{ article: string }> }
) {
  const { article } = await params;

  const a = await getArticle("es", article);
  if (!a) notFound();

  const i18n = await loadI18nMap();

  // Resolver el slug en inglés correspondiente.
  const mappedEn = altResourceSlug(i18n, article, "en");
  const aEn = mappedEn
    ? await getArticle("en", mappedEn).catch(() => null)
    : await getArticle("en", article).catch(() => null);
  const enHref = aEn ? `/en/resources/${mappedEn || article}` : null;

  const all = (await getAllArticles("es")) as SimpleArticle[];
  const { prev, next } = getPrevNext(all, a.slug, a.category);

  const cleanedHtml = stripFrontMatterFromHtml(String(a.html ?? ""));
  const readingTime = toReadingTime({
    html: cleanedHtml,
    summary: a.summary ?? null,
    ...(typeof a.readingTimeMin === "number" ? { readingTimeMin: a.readingTimeMin } : {}),
  });

  const updatedStr =
    a.updated &&
    new Date(a.updated).toLocaleDateString("es-CA", { year: "numeric", month: "long", day: "numeric" });

  const publishedStr =
    a.date &&
    new Date(a.date).toLocaleDateString("es-CA", { year: "numeric", month: "long", day: "numeric" });

  /** alt accesible sin usar `any` */
  const altText = (hasHeroAlt(a) && a.heroAlt) || a.title || "Imagen del artículo";

  return (
    <div className="min-h-screen bg-brand-beige">
      {/* Encabezado */}
      <section className="bg-brand-green/5 border-b border-brand-gold/30">
        <div className="max-w-screen-xl mx-auto px-4 py-8 lg:py-10">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <nav className="print:hidden mb-3 text-sm text-brand-blue/80">
              <Link href="/es" className="hover:underline">Inicio</Link>
              <span className="mx-2">/</span>
              <Link href="/es/recursos" className="hover:underline">Recursos</Link>
              <span className="mx-2">/</span>
              <span className="text-brand-green">{a.title}</span>
            </nav>

            {enHref && (
              <div className="print:hidden">
                <Link
                  href={enHref}
                  rel="alternate"
                  hrefLang="en"
                  className="inline-flex items-center rounded-full px-3 py-1.5 text-xs border border-brand-green text-brand-green hover:bg-brand-green hover:text-white transition"
                  aria-label="Ver este artículo en inglés"
                  title="Ver en inglés"
                >
                  Ver en inglés
                </Link>
              </div>
            )}
          </div>

          <h1 id="top" className="font-brand text-3xl md:text-4xl font-semibold tracking-tight text-brand-green">
            {a.title}
          </h1>

          <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
            {a.category && (
              <span className="rounded-full border border-brand-gold/40 bg-white/80 px-2.5 py-1 text-brand-green">
                {a.category}
              </span>
            )}
            <span className="rounded-full border border-brand-gold/40 bg-white/80 px-2.5 py-1 text-brand-blue/80">
              {readingTime}
            </span>
            {publishedStr && (
              <span className="rounded-full border border-brand-gold/40 bg-white/80 px-2.5 py-1 text-brand-blue/80">
                {publishedStr}
              </span>
            )}
            {updatedStr && (
              <span className="rounded-full border border-brand-gold/40 bg-white/80 px-2.5 py-1 text-brand-blue/80">
                Actualizado {updatedStr}
              </span>
            )}
          </div>

          {a.summary && (
            <p className="mt-4 text-base md:text-lg text-brand-blue/90 max-w-3xl">{String(a.summary)}</p>
          )}

          <div className="mt-4">
            <ArticleActions title={a.title} lang="es" />
          </div>
        </div>
      </section>

      {/* Contenido */}
      <section className="py-8 lg:py-12">
        <div className="max-w-screen-xl mx-auto px-4 grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_18rem] gap-8">
          <article
            id="article-content"
            className="rounded-3xl border border-brand-gold/40 bg-white shadow-sm p-6 md:p-8 prose prose-neutral dark:prose-invert max-w-none"
          >
            {a.hero && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={a.hero}
                alt={altText}
                className="w-full rounded-2xl mb-6"
                loading="eager"
                decoding="async"
              />
            )}
            <div dangerouslySetInnerHTML={{ __html: cleanedHtml }} />
          </article>

          <aside className="print:hidden">
            <div className="rounded-3xl border border-brand-gold/40 bg-white shadow-sm p-4">
              <ArticleTOC containerId="article-content" label="En esta página" />
            </div>
          </aside>
        </div>

        <div className="max-w-screen-xl mx-auto px-4 mt-10 print:hidden">
          <ArticleActions title={a.title} lang="es" />
          {/* ✅ Coaccionar null -> undefined para props opcionales */}
          <RelatedArticles
            lang="es"
            currentSlug={a.slug}
            category={a.category ?? undefined}
            tags={Array.isArray(a.tags) ? a.tags : undefined}
          />
        </div>

        {(prev || next) && (
          <div className="max-w-screen-xl mx-auto px-4 mt-8 print:hidden">
            <div className="grid gap-3 sm:grid-cols-2">
              {prev ? (
                <Link
                  href={`/es/recursos/${prev.slug}`}
                  className="block rounded-2xl border border-brand-gold/40 bg-white p-4 hover:bg-brand-blue/5 transition"
                >
                  <div className="text-xs text-brand-body/70">Anterior</div>
                  <div className="font-sans font-semibold text-brand-blue mt-1 line-clamp-2">
                    {prev.title ?? "Artículo anterior"}
                  </div>
                </Link>
              ) : (
                <div className="hidden sm:block" />
              )}
              {next && (
                <Link
                  href={`/es/recursos/${next.slug}`}
                  className="block rounded-2xl border border-brand-gold/40 bg-white p-4 hover:bg-brand-blue/5 transition text-right"
                >
                  <div className="text-xs text-brand-body/70">Siguiente</div>
                  <div className="font-sans font-semibold text-brand-blue mt-1 line-clamp-2">
                    {next.title ?? "Artículo siguiente"}
                  </div>
                </Link>
              )}
            </div>
          </div>
        )}

        {Array.isArray(a.tags) && a.tags.length > 0 && (
          <div className="max-w-screen-xl mx-auto px-4 mt-6 flex flex-wrap gap-2">
            {a.tags.map((t: string) => (
              <span
                key={t}
                className="text-xs px-2.5 py-1 rounded-full bg-brand-blue/10 text-brand-blue border border-brand-blue/30"
              >
                #{t.replace(/-/g, " ").replace(/\b\w/g, (m) => m.toUpperCase())}
              </span>
            ))}
          </div>
        )}
      </section>

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: a.title,
            datePublished: a.date || undefined,
            dateModified: a.updated || a.date || undefined,
            inLanguage: "es",
            author: { "@type": "Person", name: "Fanny Samaniego" },
            publisher: {
              "@type": "Organization",
              name: "Fanny Samaniego",
              logo: { "@type": "ImageObject", url: `${SITE_URL}/logo.png` },
            },
            image: a.hero
              ? [`${SITE_URL}${a.hero}`]
              : a.ogImage
              ? [`${SITE_URL}${a.ogImage}`]
              : a.image
              ? [`${SITE_URL}${a.image}`]
              : undefined,
            description:
              (a.summary && String(a.summary).replace(/<[^>]+>/g, "")) ||
              (a.excerpt && String(a.excerpt).replace(/<[^>]+>/g, "")) ||
              undefined,
            articleSection: a.category || undefined,
            keywords: Array.isArray(a.tags) ? a.tags.join(", ") : undefined,
            mainEntityOfPage: {
              "@type": "WebPage",
              "@id": `${SITE_URL}/es/recursos/${a.slug}`,
            },
          }),
        }}
      />
    </div>
  );
}
