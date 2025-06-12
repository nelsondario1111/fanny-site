import ResourcesClient from "./ResourcesClient";
import { getAllArticles, Article } from "@/lib/getArticles";

export default async function Page() {
  const articles: Article[] = await getAllArticles("en");
  const validArticles = (articles ?? []).filter(Boolean);

  // Category extraction with explicit cast for TypeScript
  const categories: string[] = Array.from(
    new Set(validArticles.map((a) => a.category).filter(Boolean) as string[])
  );

  return <ResourcesClient articles={validArticles} categories={categories} />;
}
