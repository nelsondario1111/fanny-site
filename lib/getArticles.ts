// lib/getArticles.ts
// Server utilities to fetch, parse, and normalize Markdown articles.
// ✅ Uses gray-matter to strip YAML front-matter cleanly
// ✅ Renders Markdown body to HTML via `marked`
// ✅ Normalizes summary, tags, dates; computes reading time
// ✅ Ensures list views and detail pages receive consistent shapes

import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { marked } from "marked";

/* ----------------------------- Types ----------------------------- */

export type ArticleMeta = {
  slug: string;
  lang: "en" | "es";
  title: string;
  summary?: string | null;
  excerpt?: string | null; // plain-text fallback for cards if summary is empty
  category?: string | null;
  tags?: string[] | null;
  date?: string | null;
  updated?: string | null;
  author?: string | null;
  image?: string | null;
  hero?: string | null;
  heroAlt?: string | null;
  ogImage?: string | null;
  readingTime?: string | null;   // e.g., "5 min read"
  readingTimeMin?: number | null; // numeric minutes
};

export type Article = ArticleMeta & {
  html: string; // rendered HTML (front-matter removed)
  raw: string;  // raw markdown body (no YAML)
};

/* --------------------------- Config ------------------------------ */

// Content expected at: /content/<lang>/resources/*.md
const CONTENT_ROOT = path.join(process.cwd(), "content");
const getDir = (lang: "en" | "es") => path.join(CONTENT_ROOT, lang, "resources");

// Basic reading time estimator (225 wpm default)
const estimateReadingMinutes = (text: string, wpm = 225) =>
  Math.max(1, Math.round(text.split(/\s+/).filter(Boolean).length / wpm));

/* -------------------------- Utilities ---------------------------- */

function toArray(v: unknown): string[] | null {
  if (v == null) return null;
  if (Array.isArray(v)) return v.map((x) => String(x).trim()).filter(Boolean);
  // allow comma or newline separated strings
  return String(v)
    .split(/[\n,]/)
    .map((s) => s.trim())
    .filter(Boolean);
}

// Very light inline Markdown → text stripper (for excerpts)
function stripMdInline(s: string) {
  return s
    .replace(/!\[[^\]]*\]\([^)]+\)/g, "")     // images
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")  // links
    .replace(/[*_~`>#-]/g, "")                // common md characters/bullets
    .replace(/\s+/g, " ")
    .trim();
}

// First paragraph (plain text) as a safe excerpt fallback
function firstParagraph(md: string): string | null {
  const split = md.trim().split(/\n\s*\n/);
  const para = split[0] ?? "";
  return stripMdInline(para) || null;
}

/* ------------------------ Core Parsing --------------------------- */

async function readMarkdown(filePath: string, lang: "en" | "es"): Promise<Article> {
  const rawFile = await fs.readFile(filePath, "utf8");

  // gray-matter splits YAML front-matter and body content
  const fm = matter(rawFile);
  const bodyMd = (fm.content || "").trim();

  // Render Markdown → HTML for detail page
  const html = (marked.parse(bodyMd, { async: false }) as string).trim();

  // Normalize front-matter fields
  const data = fm.data || {};
  const slug =
    (typeof data.slug === "string" && data.slug) ||
    path.basename(filePath).replace(/\.mdx?$/i, "");

  const title = String(data.title ?? slug).trim();

  const summary =
    typeof data.summary === "string" && data.summary.trim().length > 0
      ? String(data.summary).trim()
      : null;

  // Card blurb: prefer summary; fallback to first paragraph of body (plain text)
  const excerpt = summary ?? firstParagraph(bodyMd);

  const tags = toArray(data.tags);

  // Reading time computed from summary + bodyMd (HTML tags removed later on page if needed)
  const rtMin = estimateReadingMinutes(`${summary ?? ""} ${bodyMd}`);

  const meta: ArticleMeta = {
    slug,
    lang,
    title,
    summary,
    excerpt,
    category: data.category ? String(data.category).trim() : null,
    tags,
    date: data.date ? String(data.date) : null,
    updated: data.updated ? String(data.updated) : null,
    author: data.author ? String(data.author) : null,
    image: data.image ? String(data.image) : null,
    hero: data.hero ? String(data.hero) : null,
    heroAlt: data.heroAlt ? String(data.heroAlt) : null,
    ogImage: data.ogImage ? String(data.ogImage) : null,
    readingTime: `${rtMin} min read`,
    readingTimeMin: rtMin,
  };

  return {
    ...meta,
    html,
    raw: bodyMd,
  };
}

/* ------------------------- Public API ---------------------------- */

export async function getAllArticles(lang: "en" | "es"): Promise<ArticleMeta[]> {
  const dir = getDir(lang);
  let entries: string[] = [];
  try {
    entries = await fs.readdir(dir);
  } catch {
    return [];
  }

  const mdFiles = entries.filter((f) => /\.mdx?$/i.test(f));

  const items = await Promise.all(
    mdFiles.map(async (f) => {
      const a = await readMarkdown(path.join(dir, f), lang);
      // Only return meta for grids
      const { html: _h, raw: _r, ...meta } = a;
      return meta;
    })
  );

  // Sort newest → oldest by date; then A–Z
  items.sort((a, b) => {
    const ad = a.date ? Date.parse(a.date) : 0;
    const bd = b.date ? Date.parse(b.date) : 0;
    return bd - ad || a.title.localeCompare(b.title);
  });

  return items;
}

export async function getArticle(lang: "en" | "es", slug: string): Promise<Article | null> {
  const dir = getDir(lang);

  // Try by filename first
  const tryPaths = [path.join(dir, `${slug}.md`), path.join(dir, `${slug}.mdx`)];
  for (const p of tryPaths) {
    try {
      const stat = await fs.stat(p);
      if (stat.isFile()) return readMarkdown(p, lang);
    } catch {}
  }

  // Fallback: scan front-matter slug
  try {
    const entries = await fs.readdir(dir);
    const mdFiles = entries.filter((f) => /\.mdx?$/i.test(f));
    for (const f of mdFiles) {
      const p = path.join(dir, f);
      const raw = await fs.readFile(p, "utf8");
      const fm = matter(raw);
      const fmSlug = typeof fm.data?.slug === "string" ? fm.data.slug : f.replace(/\.mdx?$/i, "");
      if (fmSlug === slug) return readMarkdown(p, lang);
    }
  } catch {}

  return null;
}

// Back-compat alias used elsewhere
export async function getArticleBySlug(lang: "en" | "es", slug: string) {
  return getArticle(lang, slug);
}
