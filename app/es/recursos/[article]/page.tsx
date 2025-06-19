import { getAllArticles, getArticleBySlug } from "@/lib/getArticles";
import { remark } from "remark";
import html from "remark-html";
import Link from "next/link";
import Image from "next/image";

// Article interface for type safety
interface Article {
  content: string;
  slug: string;
  lang: "en" | "es";
  title: string;
  category?: string;
  date?: string;
  author?: string;
  image?: string;
}

// Static params for dynamic routes (for SSG)
export async function generateStaticParams() {
  const articles = await getAllArticles("es");
  return (articles ?? []).map(a => ({ article: a.slug }));
}

// Use correct params type for Next.js
export default async function Page({ params }: { params: { article: string } }) {
  const { article: articleSlug } = params;
  const article = await getArticleBySlug(articleSlug, "es") as Article | null;

  if (!article) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-brand-beige">
        <div className="text-center bg-white/90 p-8 rounded-2xl shadow border border-brand-gold max-w-md mx-auto">
          <h1 className="text-3xl font-bold text-brand-blue mb-4">Artículo no encontrado</h1>
          <Link href="/es/recursos" className="text-brand-green hover:underline">
            Volver a Recursos
          </Link>
        </div>
      </main>
    );
  }

  // Solo mostrar imagen de portada si no está ya como ![] en el Markdown
  const bannerAlreadyInMarkdown = article.image
    ? article.content.trim().startsWith(`![`)
      && article.content.includes(`](${article.image})`)
    : false;

  const processedContent = await remark().use(html).process(article.content);
  const contentHtml = processedContent.toString();

  return (
    <main className="bg-brand-beige min-h-screen py-20">
      <section className="max-w-3xl mx-auto bg-white/95 rounded-3xl shadow-xl p-10 border border-brand-gold">
        {/* Imagen de portada opcional */}
        {article.image && !bannerAlreadyInMarkdown && (
          <div className="mb-8 w-full rounded-2xl overflow-hidden shadow">
            <Image
              src={article.image}
              alt={`Imagen de portada: ${article.title}`}
              width={800}
              height={256}
              className="w-full h-64 object-cover rounded-2xl"
              style={{ maxHeight: 256 }}
              priority
            />
          </div>
        )}

        <h1 className="text-4xl font-serif font-bold text-brand-green mb-2">{article.title}</h1>
        <div className="mb-4 flex flex-wrap gap-x-4 gap-y-2 items-center text-sm text-gray-500">
          {article.date && <span>{article.date}</span>}
          {article.category && (
            <span className="px-3 py-1 bg-brand-gold/30 text-brand-green rounded-full text-xs font-semibold">
              {article.category}
            </span>
          )}
          {article.author && <span>Por {article.author}</span>}
        </div>
        <article
          className="prose prose-lg max-w-none text-brand-body"
          dangerouslySetInnerHTML={{ __html: contentHtml }}
        />
        <div className="mt-12 text-center">
          <Link href="/es/recursos">
            <button
              type="button"
              className="px-8 py-3 bg-brand-gold text-brand-green font-serif font-bold rounded-full shadow hover:bg-brand-blue hover:text-white transition-all text-lg focus:outline-none focus:ring-2 focus:ring-brand-gold"
              aria-label="Volver a Recursos"
            >
              Volver a Recursos
            </button>
          </Link>
        </div>
      </section>
    </main>
  );
}
