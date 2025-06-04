import { getAllArticles } from "@/lib/getArticles";
import ResourcesClient from "./ResourcesClient";

export default function ResourcesPage() {
  const articles = getAllArticles("en"); // Fetch English articles from Markdown
  return <ResourcesClient articles={articles} />;
}
