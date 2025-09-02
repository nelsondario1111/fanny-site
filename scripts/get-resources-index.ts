// scripts/gen-resources-index.ts
// Build-time generator for /public/search/resources.json
// Scans resources in both locales and emits searchable docs with title, tags, excerpt, etc.

import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

type Doc = {
  id: string;        // e.g. "en:buying-your-first-home"
  lang: "en" | "es";
  slug: string;      // folder name
  href: string;      // "/en/resources/<slug>" or "/es/recursos/<slug>"
  title: string;
  tags: string[];
  keywords: string[]; // frontmatter or derived
  excerpt: string;    // first ~300 chars of plain text
  body: string;       // trimmed plain text (~2-4k chars)
};

const ROOT = process.cwd();
const RES_EN = path.join(ROOT, "app", "en", "resources");
const RES_ES = path.join(ROOT, "app", "es", "recursos");
const OUT = path.join(ROOT, "public", "search", "resources.json");

// Accept these as page files inside each article folder
const PAGE_FILES = [
  "page.mdx", "page.md", "index.mdx", "index.md",
  "page.tsx", "page.jsx", "page.ts", "page.js",
];

function listDirs(dir: string) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter((name) => {
    const full = path.join(dir, name);
    return fs.statSync(full).isDirectory();
  });
}

function findPageFile(dir: string): string | null {
  for (const f of PAGE_FILES) {
    const full = path.join(dir, f);
    if (fs.existsSync(full) && fs.statSync(full).isFile()) return full;
  }
  // Also allow single *.mdx|md in the folder
  const alt = fs.readdirSync(dir).find((f) => f.endsWith(".mdx") || f.endsWith(".md"));
  return alt ? path.join(dir, alt) : null;
}

function stripMd(x: string) {
  // super-light markdown -> text
  return x
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`[^`]*`/g, " ")
    .replace(/!\[[^\]]*\]\([^)]+\)/g, " ")
    .replace(/\[[^\]]*\]\([^)]+\)/g, " ")
    .replace(/[#>*_~\-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function readDoc(base: string, lang: "en" | "es", section: "resources") {
  const docs: Doc[] = [];
  for (const slug of listDirs(base)) {
    const dir = path.join(base, slug);
    const page = findPageFile(dir);
    if (!page) continue;
    const raw = fs.readFileSync(page, "utf8");
    const fm = matter(raw);
    const title = (fm.data.title || slug.replace(/-/g, " ")).toString();
    const tags = Array.isArray(fm.data.tags) ? fm.data.tags.map(String) : [];
    const keywords = Array.isArray(fm.data.keywords) ? fm.data.keywords.map(String) : [];
    const bodyTxt = stripMd(fm.content);
    const excerpt = bodyTxt.slice(0, 300);

    docs.push({
      id: `${lang}:${slug}`,
      lang,
      slug,
      href: `/${lang}/${lang === "en" ? "resources" : "recursos"}/${slug}`,
      title,
      tags,
      keywords,
      excerpt,
      body: bodyTxt.slice(0, 4000),
    });
  }
  return docs;
}

function ensureDir(f: string) {
  const d = path.dirname(f);
  if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
}

function main() {
  const en = readDoc(RES_EN, "en", "resources");
  const es = readDoc(RES_ES, "es", "resources");
  ensureDir(OUT);
  fs.writeFileSync(OUT, JSON.stringify({ docs: [...en, ...es] }, null, 2), "utf8");
  console.log(`✓ Wrote ${OUT} (${en.length} EN, ${es.length} ES)`);
}

main();
