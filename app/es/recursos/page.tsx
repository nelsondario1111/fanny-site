import RecursosClient from "./RecursosClient";
import { getAllArticles } from "@/lib/getArticles"; // Adjust path as needed

export default async function Page() {
  const articles = await getAllArticles("es");
  const validArticles = (articles ?? []).filter(Boolean);

  // Extract unique categories from articles
  const categories: string[] = Array.from(
    new Set(validArticles.map((a: any) => a.category).filter(Boolean))
  );

  return <RecursosClient articles={validArticles} categories={categories} />;
}
