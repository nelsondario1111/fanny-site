"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaCalculator, FaHome, FaBook } from "react-icons/fa";

export default function Tools() {
  const pathname = usePathname();
  const langPrefix = pathname.startsWith("/es") ? "/es" : "/en";

  return (
    <main className="bg-brand-beige min-h-screen py-16 px-2">
      {/* Banner */}
      <section className="max-w-3xl mx-auto text-center mb-10">
        <h1 className="font-serif text-4xl md:text-5xl text-brand-green font-bold mb-3">
          Tools for Your Financial Wellbeing
        </h1>
        <p className="text-lg text-brand-blue mb-3">
          Make smart, value-aligned decisions using these simple, practical tools.
        </p>
        <p className="text-brand-body mb-2">
          Calculators and resources designed to support you at every stage of your financial journey.
        </p>
      </section>

      {/* Tools Grid */}
      <section className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-10 mb-16">
        {/* Budget Calculator */}
        <div className="rounded-2xl border-2 bg-white border-brand-gold/30 shadow-xl p-8 flex flex-col items-center text-center hover:-translate-y-1 hover:shadow-2xl transition">
          <div className="mb-4 w-14 h-14 flex items-center justify-center rounded-full bg-brand-green/10 shadow-lg border">
            <FaCalculator className="text-brand-gold text-3xl" />
          </div>
          <h2 className="text-2xl font-serif font-bold text-brand-blue mb-2">
            Budget Calculator
          </h2>
          <p className="text-brand-green mb-4">
            Create a budget that truly reflects your lifestyle and goals. Simple, intuitive, and fully private.
          </p>
          <Link href={`${langPrefix}/budget-calculator`}>
            <button className="px-7 py-3 bg-brand-gold text-brand-green font-serif font-bold rounded-full shadow hover:bg-brand-blue hover:text-white transition-all text-lg">
              Use Calculator
            </button>
          </Link>
        </div>

        {/* Mortgage Calculator */}
        <div className="rounded-2xl border-2 bg-white border-brand-gold/30 shadow-xl p-8 flex flex-col items-center text-center hover:-translate-y-1 hover:shadow-2xl transition">
          <div className="mb-4 w-14 h-14 flex items-center justify-center rounded-full bg-brand-blue/10 shadow-lg border">
            <FaHome className="text-brand-blue text-3xl" />
          </div>
          <h2 className="text-2xl font-serif font-bold text-brand-blue mb-2">
            Mortgage Calculator
          </h2>
          <p className="text-brand-green mb-4">
            Instantly estimate your mortgage payments—even for multi-unit properties.
          </p>
          <Link href={`${langPrefix}/mortgage-calculator`}>
            <button className="px-7 py-3 bg-brand-gold text-brand-green font-serif font-bold rounded-full shadow hover:bg-brand-blue hover:text-white transition-all text-lg">
              Use Calculator
            </button>
          </Link>
        </div>
      </section>

      {/* More Resources */}
      <section className="max-w-3xl mx-auto mb-12">
        <div className="rounded-2xl border-l-4 border-brand-gold bg-brand-beige p-8 shadow text-center">
          <FaBook className="inline-block text-brand-green text-2xl mb-2" />
          <h3 className="text-xl font-serif font-bold text-brand-green mb-2">
            Looking for more resources?
          </h3>
          <p className="text-brand-body mb-4">
            Explore guides, worksheets, and practical articles in the resources section.
          </p>
          <Link href={`${langPrefix}/resources`}>
            <button className="px-8 py-3 bg-brand-green text-white font-serif font-bold rounded-full shadow hover:bg-brand-blue hover:text-brand-gold transition-all text-lg">
              Go to Resources
            </button>
          </Link>
        </div>
      </section>
    </main>
  );
}
