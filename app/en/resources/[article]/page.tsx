import { getAllArticles, getArticleBySlug } from "@/lib/getArticles";
import { remark } from "remark";
import html from "remark-html";
import Link from "next/link";

// ...interface and generateStaticParams unchanged...

export default async function Page({ params }: { params: Promise<{ article: string }> }) {
  const { article: articleSlug } = await params;
  const article = await getArticleBySlug(articleSlug, "en") as Article | null;

  if (!article) {
    // ...not found block unchanged...
  }

  // Check if the Markdown already embeds the image at the top
  const bannerAlreadyInMarkdown = article.image
    ? article.content.trim().startsWith(`![`)
      && article.content.includes(`](${article.image})`)
    : false;

  const processedContent = await remark().use(html).process(article.content);
  const contentHtml = processedContent.toString();

  return (
    <main className="bg-brand-beige min-h-screen py-20">
      <section className="max-w-3xl mx-auto bg-white/95 rounded-3xl shadow-xl p-10 border border-brand-gold">
        {/* Only render banner if not already in markdown */}
        {article.image && !bannerAlreadyInMarkdown && (
          <div className="mb-8 w-full rounded-2xl overflow-hidden shadow">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={article.image}
              alt={`Cover for: ${article.title}`}
              className="w-full h-64 object-cover rounded-2xl"
            />
          </div>
        )}

        {/* ...rest of your content... */}
        <h1 className="text-4xl font-serif font-bold text-brand-green mb-2">{article.title}</h1>
        <div className="mb-4 flex flex-wrap gap-x-4 gap-y-2 items-center text-sm text-gray-500">
          {article.date && <span>{article.date}</span>}
          {article.category && (
            <span className="px-3 py-1 bg-brand-gold/30 text-brand-green rounded-full text-xs font-semibold">
              {article.category}
            </span>
          )}
          {article.author && <span>By {article.author}</span>}
        </div>
        <article
          className="prose prose-lg max-w-none text-brand-body"
          dangerouslySetInnerHTML={{ __html: contentHtml }}
        />
        <div className="mt-12 text-center">
          <Link href="/en/resources">
            <button
              type="button"
              className="px-8 py-3 bg-brand-gold text-brand-green font-serif font-bold rounded-full shadow hover:bg-brand-blue hover:text-white transition-all text-lg focus:outline-none focus:ring-2 focus:ring-brand-gold"
              aria-label="Back to Resources"
            >
              Back to Resources
            </button>
          </Link>
        </div>
      </section>
    </main>
  );
}
