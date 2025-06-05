import { getAllArticles } from "@/lib/getArticles";
import RecursosClient from "./RecursosClient";

export default async function RecursosPage() {
  const articles = await getAllArticles("es"); // Fetch Spanish articles from Markdown
  return <RecursosClient articles={articles} />;
}
