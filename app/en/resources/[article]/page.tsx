import { getArticleBySlug } from "@/lib/getArticles";
import { remark } from "remark";
import html from "remark-html";
import Link from "next/link";

interface ArticleParams {
  params: { article: string };
}

export async function generateStaticParams() {
  // Leave this function as is or add if needed for SSG
  return [];
}

export default async function ArticlePage({ params }: ArticleParams) {
  const { article } = params;
  const data = await getArticleBySlug(article, "en");
  if (!data) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Article Not Found</h1>
          <p>
            Sorry, this article doesn’t exist.{" "}
            <Link href="/en/resources">
              <span className="underline text-brand-blue">Return to Resources</span>
            </Link>
          </p>
        </div>
      </main>
    );
  }

  // Convert markdown to HTML
  const processedContent = await remark().use(html).process(data.content);
  const contentHtml = processedContent.toString();

  return (
    <main className="bg-brand-beige min-h-screen py-16 px-2">
      <article className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl border p-10 mb-8">
        <header>
          <h1 className="text-4xl font-serif font-bold text-brand-green mb-2">{data.title}</h1>
          {data.date && (
            <div className="mb-3 text-brand-blue/80 font-medium">
              {new Date(data.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </div>
          )}
          {data.author && (
            <div className="mb-4 text-brand-body font-semibold">By {data.author}</div>
          )}
        </header>
        {data.image && (
          <img
            src={data.image}
            alt={data.title}
            className="w-full rounded-xl shadow mb-8"
            style={{ maxHeight: 380, objectFit: "cover" }}
          />
        )}
        <section
          className="prose lg:prose-xl max-w-none text-brand-body"
          dangerouslySetInnerHTML={{ __html: contentHtml }}
        />
      </article>
      <div className="max-w-3xl mx-auto flex justify-between items-center mb-12">
        <Link href="/en/resources" className="text-brand-blue underline hover:text-brand-gold font-semibold">
          ← Back to Resources
        </Link>
        <Link href="/en/contact" className="text-brand-green underline hover:text-brand-blue font-semibold">
          Have questions? Contact Fanny
        </Link>
      </div>
    </main>
  );
}
