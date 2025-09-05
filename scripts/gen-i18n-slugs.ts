// app/en/testimonials/page.tsx
"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";

/* --------------------------- Local UI primitives --------------------------- */
function Panel({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={[
        "max-w-4xl mx-auto px-5 sm:px-8 py-10 sm:py-14",
        "bg-white/95 rounded-[28px] border border-brand-gold shadow-xl",
        "backdrop-blur-[1px]",
        className,
      ].join(" ")}
    >
      {children}
    </div>
  );
}

function SectionTitle({
  title,
  subtitle,
  center = true,
}: {
  title: string;
  subtitle?: React.ReactNode;
  center?: boolean;
}) {
  return (
    <header className={center ? "text-center mb-6" : "mb-6"}>
      <h1 className="font-serif font-extrabold text-4xl md:text-5xl text-brand-green tracking-tight">
        {title}
      </h1>
      <div className="flex justify-center my-4" aria-hidden="true">
        <div className="w-16 h-[3px] rounded-full bg-brand-gold" />
      </div>
      {subtitle && (
        <p className="text-brand-blue/90 text-lg md:text-xl max-w-2xl mx-auto">{subtitle}</p>
      )}
    </header>
  );
}
/* ------------------------------------------------------------------------- */

type Testimonial = {
  quote: string;
  name: string;
  context?: string;
  year?: string;
};

const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "Working with Fanny and her team changed how we make decisions with money. We finally understand our own patterns and have a plan we actually follow. The Human Design–informed approach made next steps feel simple and aligned.",
    name: "Luisa & Javier",
    context: "Toronto — First-time investment planning",
    year: "2024",
  },
  {
    quote:
      "Fanny’s thoughtful, holistic guidance helped us turn financial anxiety into calm and clarity. The combination of expertise and compassion made us feel seen and supported at every step.",
    name: "Maria & Carlos",
    context: "Toronto — Family cash-flow & debt strategy",
    year: "2023",
  },
  {
    quote:
      "After years of trying tools that didn’t stick, this was the first time a plan felt natural. The mix of deep listening, clear structure, and behavior-aware coaching helped us get unstuck as a family.",
    name: "Sofía & Andrés",
    context: "Mississauga — Values-aligned budgeting",
    year: "2023",
  },
];

/* ------------------------------- Animations ------------------------------- */
const fadeUp = { opacity: 0, y: 20 };
const fadeUpVisible = { opacity: 1, y: 0 };
const listVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08, when: "beforeChildren" },
  },
} as const;
const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
} as const;
/* ------------------------------------------------------------------------- */

export default function TestimonialsPage() {
  // JSON-LD for SEO (Review schema without ratings)
  const jsonLd = React.useMemo(() => {
    const reviews = TESTIMONIALS.map((t) => ({
      "@type": "Review",
      reviewBody: t.quote,
      author: { "@type": "Person", name: t.name },
      datePublished: t.year ? `${t.year}-01-01` : undefined,
      about: t.context,
      itemReviewed: {
        "@type": "Service",
        name: "Holistic Financial Coaching",
        provider: { "@type": "Organization", name: "Fanny Samaniego" },
      },
    }));
    return {
      "@context": "https://schema.org",
      "@type": "ItemList",
      itemListElement: reviews.map((r, idx) => ({
        "@type": "ListItem",
        position: idx + 1,
        item: r,
      })),
    };
  }, []);

  return (
    <main className="bg-brand-beige min-h-screen pb-16">
      {/* Hero */}
      <section className="pt-10 px-4">
        <motion.div initial={fadeUp} animate={fadeUpVisible} transition={{ duration: 0.6, ease: "easeOut" }}>
          <Panel>
            <SectionTitle
              title="Stories of Financial Transformation"
              subtitle="Real client stories shared with permission. Each journey is unique—these reflections highlight the blend of clarity, structure, and compassion at the core of our work."
            />
            <p className="text-sm text-brand-body/80 text-center">
              Quotes may be lightly edited for clarity. Results vary by individual circumstances.
            </p>
          </Panel>
        </motion.div>
      </section>

      {/* Testimonials list */}
      <section className="px-4 mt-8">
        <motion.div initial={fadeUp} animate={fadeUpVisible} transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}>
          <Panel>
            <motion.div variants={listVariants} initial="hidden" animate="show" className="space-y-6">
              {TESTIMONIALS.map(({ quote, name, context, year }, i) => (
                <motion.figure
                  key={`${name}-${i}`}
                  variants={itemVariants}
                  className="border-l-4 border-brand-green pl-6 py-5 bg-brand-beige/80 rounded-2xl shadow-lg"
                >
                  <blockquote className="italic mb-3 text-lg md:text-xl text-brand-green">“{quote}”</blockquote>
                  <figcaption className="font-semibold text-brand-green">
                    — {name}
                    {context ? <span className="text-brand-body/80 font-normal">, {context}</span> : null}
                    {year ? <span className="text-brand-body/60 font-normal"> · {year}</span> : null}
                  </figcaption>
                </motion.figure>
              ))}
            </motion.div>

            {/* CTA */}
            <div className="text-center mt-10">
              <Link
                href="/en/book"
                className="inline-block px-8 py-3 bg-brand-gold text-brand-green font-serif font-bold rounded-full shadow-lg hover:bg-brand-blue hover:text-white transition text-base md:text-lg tracking-wide"
                aria-label="Book a free consultation"
              >
                Book a Free Consultation
              </Link>
            </div>
          </Panel>
        </motion.div>
      </section>

      {/* JSON-LD */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </main>
  );
}
