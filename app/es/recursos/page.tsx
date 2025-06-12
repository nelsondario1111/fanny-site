import RecursosClient from "./RecursosClient";
import { getAllArticles, Article } from "@/lib/getArticles";

export default async function Page() {
  const articles: Article[] = await getAllArticles("es");
  const validArticles = (articles ?? []).filter(Boolean);

  // TypeScript fix: category might be undefined, so cast after filter
  const categories: string[] = Array.from(
    new Set(validArticles.map((a) => a.category).filter(Boolean) as string[])
  );

  return <RecursosClient articles={validArticles} categories={categories} />;
}
