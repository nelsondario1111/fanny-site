// scripts/gen-resources-index.cjs
// Builds /public/search/resources.json from your EN/ES Resources folders.
// Run automatically by "dev" and "prebuild" (once you update package.json scripts).

const fs = require("node:fs");
const path = require("node:path");
const matter = require("gray-matter");

const ROOT = process.cwd();
const RES_EN = path.join(ROOT, "app", "en", "resources");
const RES_ES = path.join(ROOT, "app", "es", "recursos");
const OUT = path.join(ROOT, "public", "search", "resources.json");

// Consider these as the page file inside each article folder
const PAGE_FILES = [
  "page.mdx", "index.mdx", "page.md", "index.md",
  "page.tsx", "page.jsx", "page.ts", "page.js"
];

function listDirs(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter((n) => {
    const full = path.join(dir, n);
    return fs.statSync(full).isDirectory();
  });
}

function findPageFile(dir) {
  for (const f of PAGE_FILES) {
    const full = path.join(dir, f);
    if (fs.existsSync(full) && fs.statSync(full).isFile()) return full;
  }
  // fallback: a single *.mdx|*.md in the folder
  const alt = fs.readdirSync(dir).find((f) => f.endsWith(".mdx") || f.endsWith(".md"));
  return alt ? path.join(dir, alt) : null;
}

function stripMd(x) {
  // super-light markdown → text
  return (x || "")
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`[^`]*`/g, " ")
    .replace(/!\[[^\]]*\]\([^)]+\)/g, " ")
    .replace(/\[[^\]]*\]\([^)]+\)/g, " ")
    .replace(/[#>*_~\-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function readDocs(base, lang) {
  const docs = [];
  for (const slug of listDirs(base)) {
    const dir = path.join(base, slug);
    const page = findPageFile(dir);
    if (!page) continue;

    const raw = fs.readFileSync(page, "utf8");
    const fm = matter(raw);

    const title = String(fm.data.title || slug.replace(/-/g, " "));
    const tags = Array.isArray(fm.data.tags) ? fm.data.tags.map(String) : [];
    const keywords = Array.isArray(fm.data.keywords) ? fm.data.keywords.map(String) : [];

    const text = stripMd(fm.content);

    const href = `/${lang}/${lang === "en" ? "resources" : "recursos"}/${slug}`;

    docs.push({
      id: `${lang}:${slug}`,
      lang,
      slug,
      href,
      title,
      tags,
      keywords,
      excerpt: text.slice(0, 300),
      body: text.slice(0, 4000)
    });
  }
  return docs;
}

function ensureDir(filePath) {
  const d = path.dirname(filePath);
  if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
}

(function main() {
  const en = readDocs(RES_EN, "en");
  const es = readDocs(RES_ES, "es");

  ensureDir(OUT);
  fs.writeFileSync(OUT, JSON.stringify({ docs: [...en, ...es] }, null, 2), "utf8");

  console.log(`✓ Wrote ${OUT} (${en.length} EN, ${es.length} ES)`);
})();
