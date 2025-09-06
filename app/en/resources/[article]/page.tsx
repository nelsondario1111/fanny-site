// app/en/resources/[article]/page.tsx
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getArticle, getAllArticles } from "@/lib/getArticles";
import ArticleActions from "@/components/ArticleActions";
import ArticleTOC from "@/components/ArticleTOC";
import RelatedArticles from "@/components/RelatedArticles";

/** i18n map types */
type PairDict = Record<string, { en: string; es: string }>;
type I18nMap = { resources?: PairDict; tools?: PairDict };

/** Load JSON map safely at runtime (no require, no build break if missing) */
async function loadI18nMap(): Promise<I18nMap> {
  try {
    const mod = await import("@/content/i18n-slugs.json");
    return (mod.default || mod) as I18nMap;
  } catch {
    return {};
  }
}

/** Find counterpart slug for resources from a given map. */
function altResourceSlug(map: I18nMap, currentSlug: string, target: "en" | "es"): string | null {
  const dict = map?.resources || {};
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

// ---------- Helpers ----------
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

const toReadingTime = (raw: { html?: string; summary?: string; readingTimeMin?: number }) => {
  if (typeof raw.readingTimeMin === "number" && Number.isFinite(raw.readingTimeMin)) {
    return `${raw.readingTimeMin} min read`;
  }
  const text = `${raw.summary ?? ""} ${raw.html ?? ""}`.replace(/<[^>]*>/g, " ");
  const words = text.split(/\s+/).filter(Boolean).length;
  return `${Math.max(1, Math.round(words / 225))} min read`;
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

/* -----------------------------------------------------------
   Static params & metadata
------------------------------------------------------------ */
export async function generateStaticParams() {
  const items = await getAllArticles("en");
  return items.map((a) => ({ article: a.slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ article: string }> }
): Promise<Metadata> {
  const { article } = await params;

  const [a, map] = await Promise.all([
    getArticle("en", article),
    loadI18nMap(),
  ]);
  if (!a) return {};

  // Prefer the generated mapping; if missing, try same-slug existence.
  const mappedEs = altResourceSlug(map, article, "es");
  const hasSameSlugEs = await getArticle("es", article).then(Boolean).catch(() => false);

  const languages: Record<string, string> = { en: `/en/resources/${article}` };
  if (mappedEs) {
    languages.es = `/es/recursos/${mappedEs}`;
  } else if (hasSameSlugEs) {
    languages.es = `/es/recursos/${article}`;
  }

  const description =
    (a.summary && String(a.summary)) ||
    (a.excerpt && String(a.excerpt)) ||
    "Helpful guide on mortgages, money behaviour, and tax basics.";

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

/* -----------------------------------------------------------
   Page
------------------------------------------------------------ */
export default async function ArticlePage(
  { params }: { params: Promise<{ article: string }> }
) {
  const { article } = await params;

  const [a, map] = await Promise.all([
    getArticle("en", article),
    loadI18nMap(),
  ]);
  if (!a) notFound();

  // Resolve the Spanish counterpart slug safely.
  const mappedEs = altResourceSlug(map, article, "es");
  const aEs = mappedEs
    ? await getArticle("es", mappedEs).catch(() => null)
    : await getArticle("es", article).catch(() => null);
  const esHref = aEs ? `/es/recursos/${mappedEs || article}` : null;

  const all = (await getAllArticles("en")) as SimpleArticle[];
  const { prev, next } = getPrevNext(all, a.slug, a.category);

  const cleanedHtml = stripFrontMatterFromHtml(String(a.html ?? ""));
  const readingTime = toReadingTime({
    html: cleanedHtml,
    summary: a.summary ?? undefined, // coerce null to undefined to satisfy type
    readingTimeMin: a.readingTimeMin,
  });

  const updatedStr =
    a.updated &&
    new Date(a.updated).toLocaleDateString("en-CA", { year: "numeric", month: "long", day: "numeric" });

  const publishedStr =
    a.date &&
    new Date(a.date).toLocaleDateString("en-CA", { year: "numeric", month: "long", day: "numeric" });

  return (
    <div className="min-h-screen bg-white">
      {/* Brand band header */}
      <section className="bg-brand-green/5 border-b border-brand-gold/30">
        <div className="max-w-screen-xl mx-auto px-4 py-8 lg:py-10">
          {/* Breadcrumbs + language switch */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <nav className="print:hidden mb-3 text-sm text-brand-blue/80">
              <Link href="/en" className="hover:underline">Home</Link>
              <span className="mx-2">/</span>
              <Link href="/en/resources" className="hover:underline">Resources</Link>
              <span className="mx-2">/</span>
              <span className="text-brand-green">{a.title}</span>
            </nav>

            {esHref && (
              <div className="print:hidden">
                <Link
                  href={esHref}
                  className="inline-flex items-center rounded-full px-3 py-1.5 text-xs border border-brand-green text-brand-green hover:bg-brand-green hover:text-white transition"
                >
                  Ver en Español
                </Link>
              </div>
            )}
          </div>

          {/* Title + meta chips */}
          <h1 id="top" className="font-serif text-3xl md:text-4xl font-semibold tracking-tight text-brand-green">
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
                Updated {updatedStr}
              </span>
            )}
          </div>

          {/* Summary */}
          {a.summary && (
            <p className="mt-4 text-base md:text-lg text-brand-blue/90 max-w-3xl">{String(a.summary)}</p>
          )}

          {/* Actions */}
          <div className="mt-4">
            <ArticleActions title={a.title} lang="en" />
          </div>
        </div>
      </section>

      {/* Content area: article panel + TOC */}
      <section className="py-8 lg:py-12">
        <div className="max-w-screen-xl mx-auto px-4 grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_18rem] gap-8">
          {/* Article panel */}
          <article
            id="article-content"
            className="rounded-3xl border border-brand-gold/40 bg-white shadow-sm p-6 md:p-8 prose prose-neutral dark:prose-invert max-w-none"
          >
            {/* Optional hero */}
            {a.hero && (
              <div className="relative w-full mb-6 rounded-2xl overflow-hidden">
                <div className="relative w-full aspect-[16/9]">
                  <Image
                    src={a.hero}
                    alt={a.heroAlt ?? a.title ?? "Article hero"}
                    fill
                    className="object-cover"
                    sizes="100vw"
                    priority={false}
                  />
                </div>
              </div>
            )}

            <div dangerouslySetInnerHTML={{ __html: cleanedHtml }} />
          </article>

          {/* TOC panel */}
          <aside className="print:hidden">
            <div className="rounded-3xl border border-brand-gold/40 bg-white shadow-sm p-4">
              <ArticleTOC containerId="article-content" />
            </div>
          </aside>
        </div>

        {/* Bottom actions + related */}
        <div className="max-w-screen-xl mx-auto px-4 mt-10 print:hidden">
          <ArticleActions title={a.title} lang="en" />
          <RelatedArticles lang="en" currentSlug={a.slug} category={a.category} tags={a.tags} />
        </div>

        {/* Prev / Next */}
        {(prev || next) && (
          <div className="max-w-screen-xl mx-auto px-4 mt-8 print:hidden">
            <div className="grid gap-3 sm:grid-cols-2">
              {prev ? (
                <Link
                  href={`/en/resources/${prev.slug}`}
                  className="block rounded-2xl border border-brand-gold/40 bg-white p-4 hover:bg-brand-blue/5 transition"
                >
                  <div className="text-xs text-brand-body/70">Previous</div>
                  <div className="font-serif font-semibold text-brand-blue mt-1 line-clamp-2">
                    {prev.title ?? "Previous article"}
                  </div>
                </Link>
              ) : (
                <div className="hidden sm:block" />
              )}
              {next && (
                <Link
                  href={`/en/resources/${next.slug}`}
                  className="block rounded-2xl border border-brand-gold/40 bg-white p-4 hover:bg-brand-blue/5 transition text-right"
                >
                  <div className="text-xs text-brand-body/70">Next</div>
                  <div className="font-serif font-semibold text-brand-blue mt-1 line-clamp-2">
                    {next.title ?? "Next article"}
                  </div>
                </Link>
              )}
            </div>
          </div>
        )}

        {/* Tags */}
        {Array.isArray(a.tags) && a.tags.length > 0 && (
          <div className="max-w-screen-xl mx-auto px-4 mt-6 flex flex-wrap gap-2">
            {a.tags.map((t: string) => (
              <span
                key={t}
                className="text-xs px-2.5 py-1 rounded-full bg-brand-blue/10 text-brand-blue border border-brand-blue/30"
              >
                #{t}
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
            inLanguage: "en",
            author: { "@type": "Person", name: "Fanny Samaniego" },
            publisher: {
              "@type": "Organization",
              name: "Fanny Samaniego",
              logo: { "@type": "ImageObject", url: "/logo.png" },
            },
            image: a.hero ? [a.hero] : a.ogImage ? [a.ogImage] : a.image ? [a.image] : undefined,
            description:
              (a.summary && String(a.summary)) ||
              (a.excerpt && String(a.excerpt)) ||
              undefined,
            articleSection: a.category || undefined,
            keywords: Array.isArray(a.tags) ? a.tags.join(", ") : undefined,
            mainEntityOfPage: {
              "@type": "WebPage",
              "@id": `/en/resources/${a.slug}`,
            },
          }),
        }}
      />
    </div>
  );
}
