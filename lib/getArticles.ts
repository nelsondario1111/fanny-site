import fs from "fs";
import path from "path";
import matter from "gray-matter";

// Helper: Get all articles in a given language directory
function getArticlesFromDir(dir: string, lang: "en" | "es") {
  const articlesDir = path.join(process.cwd(), "content", dir);
  if (!fs.existsSync(articlesDir)) return [];
  const files = fs.readdirSync(articlesDir);
  return files
    .map((filename) => {
      const filePath = path.join(articlesDir, filename);
      try {
        const fileContent = fs.readFileSync(filePath, "utf8");
        const { data, content } = matter(fileContent);
        // Optionally skip files missing required front matter
        if (!data.title || !data.summary) return null;
        return {
          ...data,
          content,
          slug: filename.replace(/\.md$/, ""),
          lang,
        };
      } catch (err) {
        console.error("Error reading file:", filePath, err);
        return null;
      }
    })
    .filter(Boolean); // Removes nulls
}

// Exported functions to get articles per language
export function getAllArticles(lang: "en" | "es") {
  if (lang === "en") return getArticlesFromDir("articles", "en");
  if (lang === "es") return getArticlesFromDir("articulos", "es");
  return [];
}

export function getArticleBySlug(slug: string, lang: "en" | "es") {
  const dir = lang === "en" ? "articles" : "articulos";
  const filePath = path.join(process.cwd(), "content", dir, slug + ".md");
  try {
    if (!fs.existsSync(filePath)) return null;
    const fileContent = fs.readFileSync(filePath, "utf8");
    const { data, content } = matter(fileContent);
    return { ...data, content, slug, lang };
  } catch (err) {
    console.error("Error loading article:", filePath, err);
    return null;
  }
}
