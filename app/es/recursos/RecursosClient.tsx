"use client";
import { useState } from "react";
import Link from "next/link";

interface Article {
  slug: string;
  title: string;
  summary?: string;
  category?: string;
}

export default function RecursosClient({ articles }: { articles: Article[] }) {
  const [selected, setSelected] = useState("Todos");
  const [search, setSearch] = useState("");
  const uniqueCategories = [
    "Todos",
    ...Array.from(new Set(articles.map((a) => a.category).filter(Boolean))),
  ];

  // Filter logic (safe against missing title/summary)
  const filteredArticles = articles.filter((a) =>
    (selected === "Todos" || a.category === selected) &&
    (
      (a.title?.toLowerCase() ?? "").includes(search.toLowerCase()) ||
      (a.summary?.toLowerCase() ?? "").includes(search.toLowerCase())
    )
  );

  return (
    <main className="bg-brand-beige min-h-screen py-20">
      <section className="max-w-6xl mx-auto bg-white/90 rounded-3xl shadow-xl p-10 border border-brand-gold">
        {/* Encabezado */}
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-brand-green mb-6 text-center tracking-tight">
          Recursos para tu Bienestar Financiero
        </h1>
        <div className="flex justify-center mb-8">
          <div className="w-20 border-t-4 border-brand-gold rounded-full"></div>
        </div>
        {/* CTA Descarga */}
        <section className="mb-12">
          <div className="bg-brand-beige/80 p-8 rounded-2xl flex flex-col md:flex-row items-center md:justify-between shadow-lg border border-brand-gold/30">
            <div>
              <h2 className="text-2xl font-serif font-semibold mb-2 text-brand-blue">
                Descarga gratis tu Planificador Holístico de Presupuesto
              </h2>
              <p className="mb-4 text-brand-green">
                Una guía práctica en PDF para alinear tu dinero con tus valores.
              </p>
              <a
                href="/planificador-holistico-presupuesto.pdf"
                download
                className="inline-block px-7 py-3 bg-brand-gold text-brand-green font-serif font-bold rounded-full shadow hover:bg-brand-blue hover:text-white transition-all text-lg"
              >
                Descargar ahora
              </a>
            </div>
          </div>
        </section>
        {/* Búsqueda + Categorías */}
        <section className="mb-8 flex flex-col md:flex-row items-center md:justify-between gap-6">
          {/* Categorías */}
          <div className="flex flex-wrap gap-3">
            {uniqueCategories.map((cat) => (
              <button
                key={cat}
                className={`px-4 py-2 rounded-full font-semibold border shadow-sm transition
                  ${selected === cat
                    ? "bg-brand-green text-white border-brand-green"
                    : "bg-brand-green/10 text-brand-green border-brand-green/30 hover:bg-brand-gold/30 hover:text-brand-blue"
                  }`}
                onClick={() => setSelected(cat ?? "Todos")}  {/* <-- FIXED HERE */}
              >
                {cat}
              </button>
            ))}
          </div>
          {/* Buscador */}
          <input
            className="mt-2 md:mt-0 px-4 py-2 rounded-xl border-2 border-brand-green focus:border-brand-blue w-full md:w-72 font-sans text-base"
            type="text"
            placeholder="Buscar artículos…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </section>
        {/* Grid de artículos */}
        <section className="mb-10">
          <div className="grid md:grid-cols-3 gap-6">
            {filteredArticles.length === 0 && (
              <div className="md:col-span-3 text-center text-brand-blue font-semibold">
                No se encontraron artículos.
              </div>
            )}
            {filteredArticles.map((a, idx) => (
              <div
                key={a.slug + idx}
                className="p-6 border border-brand-green/20 rounded-2xl bg-white shadow-md hover:shadow-xl transition flex flex-col"
              >
                <h3 className="font-bold font-serif mb-2 text-lg text-brand-green">
                  {a.title}
                </h3>
                <p className="mb-3 text-brand-green/90 text-sm flex-1">{a.summary}</p>
                <div className="mt-auto flex items-center justify-between">
                  <span className="text-xs text-brand-blue bg-brand-gold/20 rounded-full px-3 py-1">
                    {a.category}
                  </span>
                  <Link href={`/es/recursos/${a.slug}`}>
                    <span className="text-brand-blue font-semibold hover:underline cursor-pointer">
                      Leer más
                    </span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
        {/* Explorar todos */}
        <div className="text-center mt-12">
          <Link href="#">
            <button className="px-10 py-4 bg-brand-green text-white font-bold rounded-full shadow-lg hover:bg-brand-blue hover:text-brand-gold transition tracking-wide text-lg">
              Explorar todos los recursos
            </button>
          </Link>
        </div>
      </section>
    </main>
  );
}
