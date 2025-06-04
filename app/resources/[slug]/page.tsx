import { getAllArticles, getArticleBySlug } from "@/lib/getArticles";
import { remark } from "remark";
import html from "remark-html";
import Link from "next/link";

// This function enables Next.js to statically generate all article paths at build time
export async function generateStaticParams() {
  const articles = getAllArticles("en");
  return articles.map((a) => ({ slug: a.slug }));
}

export default async function ArticlePage({ params }) {
  const article = getArticleBySlug(params.slug, "en");
  if (!article) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-brand-blue mb-4">Article not found</h1>
          <Link href="/resources" className="text-brand-green hover:underline">Back to Resources</Link>
        </div>
      </main>
    );
  }

  // Convert markdown content to HTML
  const processedContent = await remark().use(html).process(article.content);
  const contentHtml = processedContent.toString();

  return (
    <main className="bg-brand-beige min-h-screen py-20">
      <section className="max-w-3xl mx-auto bg-white/95 rounded-3xl shadow-xl p-10 border border-brand-gold">
        {/* Title and meta */}
        <h1 className="text-4xl font-serif font-bold text-brand-green mb-4">{article.title}</h1>
        <div className="flex flex-wrap items-center gap-4 mb-8 text-sm">
          <span className="bg-brand-gold/20 text-brand-blue px-4 py-1 rounded-full font-semibold">
            {article.category}
          </span>
          {article.date && (
            <span className="text-brand-green/80">
              {new Date(article.date).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
            </span>
          )}
          {article.author && (
            <span className="text-brand-blue/70 font-medium">
              by {article.author}
            </span>
          )}
        </div>

        {/* Article content */}
        <article
          className="prose prose-lg max-w-none text-brand-body"
          dangerouslySetInnerHTML={{ __html: contentHtml }}
        />

        {/* Back to Resources link */}
        <div className="mt-12 text-center">
          <Link href="/resources">
            <button className="px-8 py-3 bg-brand-gold text-brand-green font-serif font-bold rounded-full shadow hover:bg-brand-blue hover:text-white transition-all text-lg">
              Back to Resources
            </button>
          </Link>
        </div>
      </section>
    </main>
  );
}
