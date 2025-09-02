"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaCalculator, FaHome, FaBook } from "react-icons/fa";

export default function Tools() {
  const pathname = usePathname();
  const langPrefix = pathname.startsWith("/es") ? "/es" : "/en";

  return (
    <main className="bg-brand-beige min-h-screen py-12 px-2">
      {/* Main Card */}
      <section className="max-w-5xl mx-auto bg-white/90 rounded-3xl shadow-xl p-10 border border-brand-gold mb-16">
        {/* Headline and Gold Divider */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4 text-brand-green tracking-tight flex items-center gap-3 justify-center">
            Tools for Your Financial Wellbeing
          </h1>
          <div className="flex justify-center mb-8">
            <div className="w-20 border-t-4 border-brand-gold rounded-full"></div>
          </div>
          <p className="text-lg text-brand-blue mb-3">
            Make confident, value-aligned decisions with practical tools from Fanny Samaniego and her team of qualified professionals.
          </p>
          <p className="text-brand-body mb-2">
            Enjoy calculators and holistic resources designed to support your journey—private, easy to use, and always free. Each tool reflects our belief: when you know yourself, you succeed on your own terms.
          </p>
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 mb-12">
          {/* Budget Calculator */}
          <div className="rounded-2xl border border-brand-gold/30 bg-white/95 shadow-xl p-8 flex flex-col items-center text-center hover:-translate-y-1 hover:shadow-2xl transition">
            <div className="mb-4 w-14 h-14 flex items-center justify-center rounded-full bg-brand-green/10 shadow-lg border">
              <FaCalculator className="text-brand-gold text-3xl" />
            </div>
            <h2 className="text-2xl font-serif font-bold text-brand-blue mb-2">
              Holistic Budget Calculator
            </h2>
            <p className="text-brand-green mb-4">
              Build a budget that truly reflects your life, values, and unique strengths—simple, intuitive, and private.
            </p>
            <Link href={`${langPrefix}/budget-calculator`}>
              <button
                type="button"
                className="px-7 py-3 bg-brand-gold text-brand-green font-serif font-bold rounded-full shadow hover:bg-brand-blue hover:text-white transition-all text-lg focus:outline-none focus:ring-2 focus:ring-brand-gold"
                aria-label="Use Budget Calculator"
              >
                Use Calculator
              </button>
            </Link>
          </div>

          {/* Mortgage Calculator */}
          <div className="rounded-2xl border border-brand-gold/30 bg-white/95 shadow-xl p-8 flex flex-col items-center text-center hover:-translate-y-1 hover:shadow-2xl transition">
            <div className="mb-4 w-14 h-14 flex items-center justify-center rounded-full bg-brand-blue/10 shadow-lg border">
              <FaHome className="text-brand-blue text-3xl" />
            </div>
            <h2 className="text-2xl font-serif font-bold text-brand-blue mb-2">
              Mortgage Calculator
            </h2>
            <p className="text-brand-green mb-4">
              Instantly estimate your mortgage payments—even for multi-unit or investment properties. Crafted with a holistic approach by Fanny and her team.
            </p>
            <Link href={`${langPrefix}/mortgage-calculator`}>
              <button
                type="button"
                className="px-7 py-3 bg-brand-gold text-brand-green font-serif font-bold rounded-full shadow hover:bg-brand-blue hover:text-white transition-all text-lg focus:outline-none focus:ring-2 focus:ring-brand-gold"
                aria-label="Use Mortgage Calculator"
              >
                Use Calculator
              </button>
            </Link>
          </div>
        </div>

        {/* More Resources */}
        <div className="rounded-2xl border-l-4 border-brand-gold bg-brand-beige p-8 shadow text-center">
          <FaBook className="inline-block text-brand-green text-2xl mb-2" />
          <h3 className="text-xl font-serif font-bold text-brand-green mb-2 flex items-center gap-2 justify-center">
            <span aria-hidden="true">📚</span>
            Looking for more resources?
          </h3>
          <p className="text-brand-body mb-4">
            Explore our guides, worksheets, and articles—including insights on Human Design and mindful money strategies—in the resources section.
          </p>
          <Link href={`${langPrefix}/resources`}>
            <button
              type="button"
              className="px-8 py-3 bg-brand-green text-white font-serif font-bold rounded-full shadow hover:bg-brand-blue hover:text-brand-gold transition-all text-lg focus:outline-none focus:ring-2 focus:ring-brand-green"
              aria-label="Go to Resources"
            >
              Go to Resources
            </button>
          </Link>
        </div>
      </section>
    </main>
  );
}
