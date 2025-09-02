// scripts/build-resources-index-es.mjs
import fg from "fast-glob";
import fs from "fs/promises";
import path from "path";
import matter from "gray-matter";

// persona rules (coinciden con la lógica del cliente)
const personaRules = {
  families:    ["financial-planning", "wealth-building", "mortgages", "family-finances", "education-planning"],
  professionals:["financial-planning", "wealth-building", "tax-planning", "cash-flow"],
  newcomers:   ["newcomers", "new-to-canada", "immigrant", "credit-history", "canadian-banking", "mortgages"],
  entrepreneurs:["self-employed", "contractor", "small-business", "entrepreneurs", "income-verification", "tax-planning"],
  investors:   ["real-estate-investing", "investing", "rental-property", "landlord", "multiplex", "cap-rate", "mortgages"],
  holistic:    ["holistic-approach", "human-design", "financial-planning"],
};

const PERSONA_LABELS_ES = {
  families: "Familias y Parejas",
  professionals: "Profesionales",
  newcomers: "Recién Llegados",
  entrepreneurs: "Emprendedores y Autónomos",
  investors: "Inversionistas Inmobiliarios",
  holistic: "Holístico y Diseño Humano",
};

const ROOT = process.cwd();
const CONTENT_DIR = path.join(ROOT, "content/es/resources");
const OUT_FILE = path.join(ROOT, "public/data/resources-tags-es.json");

function normTag(t) { return String(t || "").trim().toLowerCase().replace(/\s+/g, "-"); }

function collectPersonaSlugs(tagsBySlug) {
  const res = {};
  for (const [p, keys] of Object.entries(personaRules)) {
    const slugs = [];
    for (const [slug, taglist] of Object.entries(tagsBySlug)) {
      const set = new Set(taglist.map(normTag));
      if (keys.some((k) => set.has(k))) slugs.push(slug);
    }
    res[p] = { label: PERSONA_LABELS_ES[p], slugs, count: slugs.length };
  }
  return res;
}

async function main() {
  const files = await fg("**/*.md", { cwd: CONTENT_DIR, absolute: true });
  const articles = [];
  const tagCounts = new Map();
  const tagSlugs = {};
  const catCounts = new Map();
  const tagsBySlug = {};

  for (const abs of files) {
    const raw = await fs.readFile(abs, "utf8");
    const { data } = matter(raw);

    const slug = path.basename(abs).replace(/\.mdx?$/i, "").toLowerCase();
    const title = String(data.title || slug);
    const category = String(data.category || "").trim();
    const tags = Array.isArray(data.tags) ? data.tags.map(normTag) : [];

    // articles list
    articles.push({ slug, title, category, tags });

    // tag counts / slugs
    tagsBySlug[slug] = tags;
    for (const t of tags) {
      tagCounts.set(t, (tagCounts.get(t) || 0) + 1);
      if (!tagSlugs[t]) tagSlugs[t] = [];
      tagSlugs[t].push(slug);
    }

    // category counts
    if (category) catCounts.set(category, (catCounts.get(category) || 0) + 1);
  }

  // Build records
  const tagsRecord = {};
  for (const [t, count] of tagCounts.entries()) {
    tagsRecord[t] = { count, slugs: tagSlugs[t] || [] };
  }
  const catsRecord = {};
  for (const [c, count] of catCounts.entries()) {
    catsRecord[c] = { count, slugs: articles.filter(a => a.category === c).map(a => a.slug) };
  }

  const personas = collectPersonaSlugs(tagsBySlug);

  const out = {
    articles,
    tags: tagsRecord,
    categories: catsRecord,
    personas,
  };

  await fs.mkdir(path.dirname(OUT_FILE), { recursive: true });
  await fs.writeFile(OUT_FILE, JSON.stringify(out, null, 2), "utf8");
  console.log(`✅ Wrote ${OUT_FILE} with ${articles.length} articles, ${Object.keys(tagsRecord).length} tags.`);
}

main().catch((e) => { console.error(e); process.exit(1); });
