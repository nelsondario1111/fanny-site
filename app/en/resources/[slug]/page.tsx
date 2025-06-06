import { getAllArticles, getArticleBySlug } from "@/lib/getArticles";
import { remark } from "remark";
import html from "remark-html";
import Link from "next/link";

// --- Fix the filter (see last message)
export async function generateStaticParams() {
  const articles = await getAllArticles("en");
  return (articles ?? [])
    .filter(a => !!a && typeof a.slug === "string")
    .map(a => ({ slug: a.slug }));
}

// --- DO NOT use type alias for props!
export default async function Page({ params }: { params: { slug: string } }) {
  const article = await getArticleBySlug(params.slug, "en");

  if (!article) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-brand-blue mb-4">Article not found</h1>
          <Link href="/en/resources" className="text-brand-green hover:underline">
            Back to Resources
          </Link>
        </div>
      </main>
    );
  }

  const processedContent = await remark().use(html).process(article.content);
  const contentHtml = processedContent.toString();

  return (
    <main className="bg-brand-beige min-h-screen py-20">
      <section className="max-w-3xl mx-auto bg-white/95 rounded-3xl shadow-xl p-10 border border-brand-gold">
        <h1 className="text-4xl font-serif font-bold text-brand-green mb-4">{article.title}</h1>
        <div className="flex flex-wrap items-center gap-4 mb-8 text-sm">
          <span className="bg-brand-gold/20 text-brand-blue px-4 py-1 rounded-full font-semibold">
            {article.category}
          </span>
          {article.date && (
            <span className="text-brand-green/80">
              {new Date(article.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </span>
          )}
          {article.author && (
            <span className="text-brand-blue/70 font-medium">by {article.author}</span>
          )}
        </div>
        <article
          className="prose prose-lg max-w-none text-brand-body"
          dangerouslySetInnerHTML={{ __html: contentHtml }}
        />
        <div className="mt-12 text-center">
          <Link href="/en/resources">
            <button className="px-8 py-3 bg-brand-gold text-brand-green font-serif font-bold rounded-full shadow hover:bg-brand-blue hover:text-white transition-all text-lg">
              Back to Resources
            </button>
          </Link>
        </div>
      </section>
    </main>
  );
}
