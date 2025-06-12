"use client";

import { useState, useMemo } from "react";
import Link from "next/link";

interface Article {
  slug: string;
  title: string;
  category?: string;
  date?: string;
}

interface Props {
  articles: Article[];
}

export default function ResourcesClient({ articles }: Props) {
  // Grab all unique categories, filter out empty ones, sort them
  const uniqueCategories = useMemo(
    () =>
      Array.from(
        new Set(articles.map((a) => a.category).filter(Boolean))
      ).sort(),
    [articles]
  );

  // The selected category (default: "")
  const [selected, setSelected] = useState<string>("");

  // Filtered articles (by selected category, or all if none)
  const filtered = useMemo(() => {
    if (!selected) return articles;
    return articles.filter((a) => a.category === selected);
  }, [articles, selected]);

  return (
    <div>
      <div className="mb-6 flex flex-wrap gap-2">
        <button
          className={`px-4 py-2 rounded-full font-semibold border shadow-sm transition
            ${selected === ""
              ? "bg-brand-green text-white border-brand-green"
              : "bg-brand-green/10 text-brand-green border-brand-green/30 hover:bg-brand-gold/30 hover:text-brand-blue"
            }`}
          onClick={() => setSelected("")}
        >
          All
        </button>
        {uniqueCategories.map((cat) => (
          <button
            key={cat}
            className={`px-4 py-2 rounded-full font-semibold border shadow-sm transition
              ${selected === cat
                ? "bg-brand-green text-white border-brand-green"
                : "bg-brand-green/10 text-brand-green border-brand-green/30 hover:bg-brand-gold/30 hover:text-brand-blue"
              }`}
            onClick={() => setSelected(cat ?? "")}   {/* <--- FIXED HERE */}
          >
            {cat}
          </button>
        ))}
      </div>
      <ul>
        {filtered.length === 0 ? (
          <li className="py-10 text-gray-500 text-center">
            No articles found in this category.
          </li>
        ) : (
          filtered.map((a) => (
            <li
              key={a.slug}
              className="mb-8 bg-white/80 rounded-xl shadow p-6 border-l-4 border-brand-gold"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="text-xl font-bold text-brand-green mb-1">
                    <Link href={`/en/resources/${a.slug}`}>{a.title}</Link>
                  </h2>
                  {a.category && (
                    <span className="inline-block text-xs bg-brand-gold/20 text-brand-blue font-semibold px-2 py-1 rounded mr-2 mt-1">
                      {a.category}
                    </span>
                  )}
                </div>
                {a.date && (
                  <div className="text-sm text-gray-500 mt-2 md:mt-0">
                    {a.date}
                  </div>
                )}
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
