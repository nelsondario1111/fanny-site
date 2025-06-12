import { getAllArticles } from "@/lib/getArticles";
import Link from "next/link";

interface Article {
  slug: string;
  title: string;
  summary?: string;
}

export default async function Page() {
  const articles: Article[] = await getAllArticles("es");
  return (
    <main className="max-w-2xl mx-auto py-16">
      <h1 className="text-3xl font-bold mb-6">Recursos</h1>
      <ul className="space-y-4">
        {(articles ?? []).map((a) => (
          <li key={a.slug} className="p-4 border rounded-lg bg-white shadow">
            <Link href={`/es/recursos/${a.slug}`}>
              <span className="text-xl font-semibold text-brand-green hover:underline">{a.title}</span>
            </Link>
            <div className="text-sm text-gray-600">{a.summary}</div>
          </li>
        ))}
      </ul>
    </main>
  );
}
