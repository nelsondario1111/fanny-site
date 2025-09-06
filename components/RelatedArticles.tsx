// components/RelatedArticles.tsx
import Link from "next/link";
import { getAllArticles, type ArticleMeta } from "@/lib/getArticles";

// Define Lang locally (since it's not exported by getArticles)
type Lang = "en" | "es";

export default async function RelatedArticles({
  lang,
  currentSlug,
  category,
  tags,
  max = 3,
}: {
  lang: Lang;
  currentSlug: string;
  category?: string | null;
  tags?: string[] | null;
  max?: number;
}) {
  const all = await getAllArticles(lang);
  const pool = all.filter((a) => a.slug !== currentSlug);

  let related: ArticleMeta[] = [];

  // 1) Same category
  if (typeof category === "string" && category.trim()) {
    related = pool.filter((a) => (a.category ?? "").trim() === category.trim());
  }

  // 2) Tag overlap
  if (related.length < max && Array.isArray(tags) && tags.length > 0) {
    const need = max - related.length;
    const tagMatches = pool.filter(
      (a) => Array.isArray(a.tags) && a.tags.some((t) => tags.includes(t))
    );
    for (const item of tagMatches) {
      if (!related.find((r) => r.slug === item.slug)) related.push(item);
      if (related.length >= need) break;
    }
  }

  // 3) Fill with recents/others
  if (related.length < max) {
    for (const item of pool) {
      if (!related.find((r) => r.slug === item.slug)) related.push(item);
      if (related.length >= max) break;
    }
  }

  related = related.slice(0, max);
  if (related.length === 0) return null;

  const heading = lang === "en" ? "Related articles" : "Artículos relacionados";

  return (
    <section aria-labelledby="related-heading" className="mt-12">
      <h2 id="related-heading" className="text-xl font-semibold mb-4">
        {heading}
      </h2>
      <ul className="grid gap-4 sm:grid-cols-2">
        {related.map((a) => (
          <li
            key={a.slug}
            className="rounded-2xl border border-brand-gold/30 bg-white p-4 shadow-sm hover:bg-neutral-50 dark:hover:bg-neutral-900"
          >
            <h3 className="font-medium">
              <Link
                href={lang === "en" ? `/en/resources/${a.slug}` : `/es/recursos/${a.slug}`}
                className="hover:underline"
              >
                {a.title}
              </Link>
            </h3>
            {typeof a.excerpt === "string" && a.excerpt.trim() ? (
              <p className="mt-1 text-sm text-neutral-600 line-clamp-3">{a.excerpt}</p>
            ) : null}
          </li>
        ))}
      </ul>
    </section>
  );
}
