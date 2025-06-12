import ResourcesClient from "./ResourcesClient";
import { getAllArticles } from "@/lib/getArticles"; // Adjust path as needed

export default async function Page() {
  const articles = await getAllArticles("en");
  const validArticles = (articles ?? []).filter(Boolean);

  // Get unique categories from your real English articles
  const categories: string[] = Array.from(
    new Set(validArticles.map((a: any) => a.category).filter(Boolean))
  );

  return <ResourcesClient articles={validArticles} categories={categories} />;
}
