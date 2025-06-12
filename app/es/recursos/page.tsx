import RecursosClient from "./RecursosClient";
import { getAllArticles, Article } from "@/lib/getArticles"; // Use your exported Article type

export default async function Page() {
  const articles: Article[] = await getAllArticles("es");
  const validArticles = (articles ?? []).filter(Boolean);

  // Extract unique categories from articles, no `any`
  const categories: string[] = Array.from(
    new Set(validArticles.map((a) => a.category).filter(Boolean))
  );

  return <RecursosClient articles={validArticles} categories={categories} />;
}
