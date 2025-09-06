// scripts/gen-i18n-slugs.ts
// Minimal Node script to (optionally) generate content/i18n-slugs.json.
// No JSX here — safe for type-checking during Next build.

import fs from "node:fs";
import path from "node:path";

type PairDict = Record<string, { en: string; es: string }>;
type I18nMap = { resources?: PairDict; tools?: PairDict };

const ROOT = process.cwd();
const OUT_PATH = path.join(ROOT, "content", "i18n-slugs.json");

// Adjust these if your content paths differ
const EN_RES_DIR = path.join(ROOT, "content", "en", "resources");
const ES_RES_DIR = path.join(ROOT, "content", "es", "recursos");

function listSlugs(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((d) => d.isFile())
    .map((d) => d.name)
    .filter((n) => n.endsWith(".md") || n.endsWith(".mdx"))
    .map((n) => n.replace(/\.(md|mdx)$/i, ""));
}

export async function generateI18nMap(): Promise<I18nMap> {
  const en = new Set(listSlugs(EN_RES_DIR));
  const es = new Set(listSlugs(ES_RES_DIR));

  // Very simple heuristic: same slug in EN and ES => pair them.
  const resources: PairDict = {};
  for (const slug of es) {
    if (en.has(slug)) resources[slug] = { en: slug, es: slug };
  }

  return { resources, tools: {} };
}

async function main() {
  const map = await generateI18nMap();
  // Ensure output directory exists
  fs.mkdirSync(path.dirname(OUT_PATH), { recursive: true });
  fs.writeFileSync(OUT_PATH, JSON.stringify(map, null, 2), "utf8");
  // eslint-disable-next-line no-console
  console.log(`Wrote ${OUT_PATH}`);
}

if (require.main === module) {
  // Run only if invoked directly (e.g. `node scripts/gen-i18n-slugs.ts` via tsx/ts-node)
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
