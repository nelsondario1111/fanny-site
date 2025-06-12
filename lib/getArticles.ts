import fs from "fs";
import path from "path";
import matter from "gray-matter";

// Make sure this matches your Markdown fields!
export interface Article {
  slug: string;
  lang: "en" | "es";
  title: string;
  summary?: string;
  category?: string;
  date?: string;
  author?: string;
  image?: string;
  content: string;
}

// Utility to get all articles for a language
export function getAllArticles(lang: "en" | "es"): Article[] {
  // Adjust if your content lives elsewhere!
  const dir = lang === "en"
    ? "content/en/resources"
    : "content/es/recursos";
  const files = fs.readdirSync(dir);

  return files
    .filter((f) => f.endsWith(".md"))
    .map((file) => {
      const slug = file.replace(/\.md$/, "");
      const filePath = path.join(dir, file);
      const fileContent = fs.readFileSync(filePath, "utf-8");
      const { data, content } = matter(fileContent);

      return {
        slug,
        lang,
        content,
        title: data.title || "",
        summary: data.summary,
        category: data.category,
        date: data.date,
        author: data.author,
        image: data.image,
      };
    });
}

// Utility to get a single article by slug
export function getArticleBySlug(slug: string, lang: "en" | "es"): Article | null {
  const articles = getAllArticles(lang);
  return articles.find((a) => a.slug === slug) || null;
}
