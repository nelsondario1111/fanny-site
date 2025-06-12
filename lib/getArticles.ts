import fs from "fs";
import path from "path";
import matter from "gray-matter";

// Matches your Markdown frontmatter fields
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

// Async utility to get all articles for a language
export async function getAllArticles(lang: "en" | "es"): Promise<Article[]> {
  const dir =
    lang === "en"
      ? path.join(process.cwd(), "content/en/resources")
      : path.join(process.cwd(), "content/es/recursos");
  let files: string[] = [];
  try {
    files = fs.readdirSync(dir);
  } catch {
    // Folder does not exist? Return empty array.
    return [];
  }

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
      } as Article;
    });
}

// Async utility to get a single article by slug
export async function getArticleBySlug(
  slug: string,
  lang: "en" | "es"
): Promise<Article | null> {
  const articles = await getAllArticles(lang);
  return articles.find((a) => a.slug === slug) || null;
}
