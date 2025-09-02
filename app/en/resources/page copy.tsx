import ResourcesClient, { type ClientArticle } from "./ResourcesClient";
import path from "path";
import { promises as fs } from "fs";

export const runtime = "nodejs";      // allows fs
export const revalidate = 3600;       // ISR: 1 hour

async function loadJSON<T>(p: string): Promise<T | null> {
  try {
    const raw = await fs.readFile(p, "utf8");
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

async function loadArticles(): Promise<ClientArticle[]> {
  const p = path.join(process.cwd(), "public", "data", "resources-en.json");
  return (await loadJSON<ClientArticle[]>(p)) ?? [];
}

function computeCategories(articles: ClientArticle[]): string[] {
  return Array.from(
    new Set(
      articles
        .map((a) => (a.category ?? "").trim())
        .filter((c): c is string => c.length > 0)
    )
  );
}

export default async function Page() {
  const articles = await loadArticles();
  const categories = computeCategories(articles);

  return (
    <ResourcesClient
      articles={articles}
      categories={categories}
      // tagsData omitted on purpose: client will fetch /data/resources-tags-en.json
      featuredSlugs={[
        "5-steps-to-financial-freedom",
        "smart-money-newcomers-canada-2025",
        "wealth-with-confidence-women-toronto-2025",
        "buying-your-first-multi-unit-property",
        "rent-vs-buy-toronto-2025",
      ]}
      views={[
        { key: "grid", label: "Grid" },
        { key: "list", label: "List" },
      ]}
    />
  );
}
