import { getAllArticles } from "@/lib/getArticles";
import RecursosClient from "./RecursosClient";

export default function RecursosPage() {
  const articles = getAllArticles("es"); // Fetch Spanish articles from Markdown
  return <RecursosClient articles={articles} />;
}
