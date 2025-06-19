import ResourcesClient from "./ResourcesClient";
import { getAllArticles, Article } from "@/lib/getArticles";

export default async function Page() {
  // Fetch all English articles
  const articles: Article[] = await getAllArticles("en");
  const validArticles = (articles ?? []).filter(Boolean);

  // Extract unique categories
  const categories: string[] = Array.from(
    new Set(validArticles.map((a) => a.category).filter(Boolean) as string[])
  );

  // Pass to client component for UI rendering
  return <ResourcesClient articles={validArticles} categories={categories} />;
}
