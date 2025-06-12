import ResourcesClient from "./ResourcesClient";
import { getAllArticles, Article } from "@/lib/getArticles";

export default async function Page() {
  const articles: Article[] = await getAllArticles("en");
  const validArticles = (articles ?? []).filter(Boolean);
  const categories: string[] = Array.from(
    new Set(validArticles.map((a) => a.category).filter(Boolean))
  );
  return <ResourcesClient articles={validArticles} categories={categories} />;
}
