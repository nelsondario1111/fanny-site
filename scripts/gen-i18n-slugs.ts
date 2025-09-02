// scripts/gen-i18n-slugs.ts
/* 
  Build-time generator for content/i18n-slugs.json

  It scans:
    - app/en/resources/* and app/es/recursos/*
    - app/en/tools/*     and app/es/herramientas/*

  It pairs EN/ES items by a canonical "id" taken from frontmatter (MD/MDX) or, 
  if no frontmatter id is found, by matching directory/file names (best-effort).
  Output shape:
    {
      resources: { [canonicalId]: { en: "slug-en", es: "slug-es" } },
      tools:     { [canonicalId]: { en: "slug-en", es: "slug-es" } },
      static:    { ... (left to lib/i18nRoutes) }
    }
*/

import fs from "node:fs";
import path from "node:path";

type PairDict = Record<string, { en: string; es: string }>;
type OutShape = { resources: PairDict; tools: PairDict };

// ——— CONFIG ———
const ROOT = process.cwd();
const MAP_OUT = path.join(ROOT, "content", "i18n-slugs.json");

// Folders (adjust if yours differ)
const RES_EN = path.join(ROOT, "app", "en", "resources");
const RES_ES = path.join(ROOT, "app", "es", "recursos");
const TOOLS_EN = path.join(ROOT, "app", "en", "tools");
const TOOLS_ES = path.join(ROOT, "app", "es", "herramientas");

// File types considered articles/tools. Add more if needed.
const PAGE_FILES = new Set(["page.mdx", "page.md", "page.tsx", "page.jsx", "page.ts", "page.js", "index.mdx", "index.md"]);

// Tiny frontmatter extractor (YAML-style --- ... ---). No external deps.
function readFrontmatterId(filePath: string): string | null {
  try {
    const raw = fs.readFileSync(filePath, "utf8");
    const m = raw.match(/^---\s*\n([\s\S]*?)\n---/);
    if (!m) return null;
    const body = m[1];
    const idLine = body.split(/\r?\n/).find((l) => /^\s*id\s*:\s*/.test(l));
    if (!idLine) return null;
    return idLine.split(":")[1].trim().replace(/^['"]|['"]$/g, "");
  } catch {
    return null;
  }
}

function listLeafDirs(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  const out: string[] = [];
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) out.push(full);
  }
  return out;
}

function findPageFile(dir: string): string | null {
  for (const f of PAGE_FILES) {
    const full = path.join(dir, f);
    if (fs.existsSync(full) && fs.statSync(full).isFile()) return full;
  }
  // Allow direct *.mdx files like dir/slug.mdx
  const mdx = fs.readdirSync(dir).find((f) => f.endsWith(".mdx") || f.endsWith(".md"));
  return mdx ? path.join(dir, mdx) : null;
}

function slugFromDir(dir: string): string {
  return path.basename(dir);
}

function collect(dirEn: string, dirEs: string): PairDict {
  const map: PairDict = {};
  const enDirs = listLeafDirs(dirEn);
  const esDirs = listLeafDirs(dirEs);

  // Index ES by id or by folder name for quick lookup
  const esIndexById = new Map<string, string>();   // id -> slug
  const esIndexBySlug = new Map<string, string>(); // slug -> slug

  for (const d of esDirs) {
    const slug = slugFromDir(d);
    esIndexBySlug.set(slug, slug);
    const pf = findPageFile(d);
    const id = pf ? readFrontmatterId(pf) : null;
    if (id) esIndexById.set(id, slug);
  }

  for (const d of enDirs) {
    const slugEN = slugFromDir(d);
    const pf = findPageFile(d);
    const id = pf ? readFrontmatterId(pf) : null;

    let slugES: string | undefined;

    if (id && esIndexById.has(id)) {
      slugES = esIndexById.get(id)!;
    } else if (esIndexBySlug.has(slugEN)) {
      // identical slug across languages
      slugES = slugEN;
    } else {
      // Try a loose match: replace hyphens with spaces & compare normalized
      const norm = (s: string) => s.toLowerCase().normalize("NFKD").replace(/[^\w]+/g, "-");
      const enNorm = norm(slugEN);
      let best: string | undefined;
      for (const cand of esIndexBySlug.keys()) {
        if (norm(cand) === enNorm) { best = cand; break; }
      }
      slugES = best;
    }

    // Derive canonical key:
    const key = id || slugEN;

    if (slugES) {
      map[key] = { en: slugEN, es: slugES };
    } else {
      // No ES match found — still record EN side so the toggle can fall back to section index.
      map[key] = { en: slugEN, es: "" };
    }
  }

  return map;
}

function ensureDir(p: string) {
  const dir = path.dirname(p);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function main() {
  const out: OutShape = {
    resources: collect(RES_EN, RES_ES),
    tools: collect(TOOLS_EN, TOOLS_ES),
  };

  ensureDir(MAP_OUT);
  fs.writeFileSync(MAP_OUT, JSON.stringify(out, null, 2), "utf8");
  // eslint-disable-next-line no-console
  console.log(`✓ Wrote ${MAP_OUT}`);
}

main();
