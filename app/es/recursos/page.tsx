import RecursosClient from "./RecursosClient";
import { getAllArticles, Article } from "@/lib/getArticles";

export default async function Page() {
  // Obtiene todos los artículos en español
  const articles: Article[] = await getAllArticles("es");
  const validArticles = (articles ?? []).filter(Boolean);

  // Extrae las categorías únicas (filtra undefined)
  const categories: string[] = Array.from(
    new Set(validArticles.map((a) => a.category).filter(Boolean) as string[])
  );

  // Renderiza el componente cliente con artículos y categorías
  return <RecursosClient articles={validArticles} categories={categories} />;
}
