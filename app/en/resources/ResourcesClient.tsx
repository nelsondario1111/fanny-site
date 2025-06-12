"use client";
import Link from "next/link";
import { useState, useMemo } from "react";

type Article = {
  title: string;
  summary: string;
  category: string;
  slug: string;
};

export default function ResourcesClient({
  articles,
  categories,
}: {
  articles: Article[];
  categories: string[];
}) {
  const [selected, setSelected] = useState("All");
  const [search, setSearch] = useState("");

  const filteredArticles = useMemo(() => {
    return articles.filter((a) =>
      (selected === "All" || a.category === selected) &&
      ((a.title?.toLowerCase() ?? "").includes(search.toLowerCase()) ||
        (a.summary?.toLowerCase() ?? "").includes(search.toLowerCase()))
    );
  }, [articles, selected, search]);

  return (
    <main className="bg-brand-beige min-h-screen py-20">
      <section className="max-w-6xl mx-auto bg-white/90 rounded-3xl shadow-xl p-10 border border-brand-gold">
        {/* Header */}
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-brand-green mb-6 text-center tracking-tight">
          Empower Yourself with Holistic Financial Wisdom
        </h1>
        <div className="flex justify-center mb-8">
          <div className="w-20 border-t-4 border-brand-gold rounded-full"></div>
        </div>

        {/* Download CTA */}
        <section className="mb-12">
          <div className="bg-brand-beige/80 p-8 rounded-2xl flex flex-col md:flex-row items-center md:justify-between shadow-lg border border-brand-gold/30">
            <div>
              <h2 className="text-2xl font-serif font-semibold mb-2 text-brand-blue">
                Download Your Free Holistic Budget Planner
              </h2>
              <p className="mb-4 text-brand-green">
                A practical PDF guide to help you align your money with your values.
              </p>
              <a
                href="/budget-planner.pdf"
                download
                className="inline-block px-7 py-3 bg-brand-gold text-brand-green font-serif font-bold rounded-full shadow hover:bg-brand-blue hover:text-white transition-all text-lg"
              >
                Download Now
              </a>
            </div>
          </div>
        </section>

        {/* Search + Categories */}
        <section className="mb-8 flex flex-col md:flex-row items-center md:justify-between gap-6">
          {/* Categories */}
          <div className="flex flex-wrap gap-3">
            <button
              className={`px-4 py-2 rounded-full font-semibold border shadow-sm transition
                ${selected === "All"
                  ? "bg-brand-green text-white border-brand-green"
                  : "bg-brand-green/10 text-brand-green border-brand-green/30 hover:bg-brand-gold/30 hover:text-brand-blue"
                }`}
              onClick={() => setSelected("All")}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                className={`px-4 py-2 rounded-full font-semibold border shadow-sm transition
                  ${selected === cat
                    ? "bg-brand-green text-white border-brand-green"
                    : "bg-brand-green/10 text-brand-green border-brand-green/30 hover:bg-brand-gold/30 hover:text-brand-blue"
                  }`}
                onClick={() => setSelected(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
          {/* Search Box */}
          <input
            className="mt-2 md:mt-0 px-4 py-2 rounded-xl border-2 border-brand-green focus:border-brand-blue w-full md:w-72 font-sans text-base"
            type="text"
            placeholder="Search articles…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </section>

        {/* Article Grid */}
        <section className="mb-10">
          <div className="grid md:grid-cols-3 gap-6">
            {filteredArticles.length === 0 && (
              <div className="md:col-span-3 text-center text-brand-blue font-semibold">
                No articles found.
              </div>
            )}
            {filteredArticles.map((a, idx) => (
              <div
                key={a.slug ?? idx}
                className="p-6 border border-brand-green/20 rounded-2xl bg-white shadow-md hover:shadow-xl transition flex flex-col"
              >
                <h3 className="font-bold font-serif mb-2 text-lg text-brand-green">
                  {a.title}
                </h3>
                <p className="mb-3 text-brand-green/90 text-sm flex-1">{a.summary}</p>
                <div className="mt-auto flex items-center justify-between">
                  <span className="text-xs text-brand-blue bg-brand-gold/20 rounded-full px-3 py-1">{a.category}</span>
                  <Link href={`/en/resources/${a.slug}`}>
                    <span className="text-brand-blue font-semibold hover:underline cursor-pointer">
                      Read More
                    </span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Explore All */}
        <div className="text-center mt-12">
          <Link href="#">
            <button className="px-10 py-4 bg-brand-green text-white font-bold rounded-full shadow-lg hover:bg-brand-blue hover:text-brand-gold transition tracking-wide text-lg">
              Explore All Resources
            </button>
          </Link>
        </div>
      </section>
    </main>
  );
}
