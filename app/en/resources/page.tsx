import { getAllArticles } from "@/lib/getArticles";
import ResourcesClient from "./ResourcesClient";

export default async function ResourcesPage() {
  const articles = await getAllArticles("en"); // Fetch English articles from Markdown
  return <ResourcesClient articles={articles} />;
}
