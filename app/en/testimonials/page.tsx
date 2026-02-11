// app/en/testimonials/page.tsx
"use client";

import * as React from "react";
import Link from "next/link";

// ✅ Hydration-safe motion primitives
import { Reveal, StaggerGroup, useMotionPresets } from "@/components/motion-safe";
import {
  HubPanel as Panel,
  HubSectionTitle as SectionTitle,
  PageHero,
  ctaButtonClass,
} from "@/components/sections/hub";

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

/* --------------------------------- Page --------------------------------- */
export default function TestimonialsPage() {
  const { fade } = useMotionPresets();

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
      <PageHero
        homeHref="/en"
        homeLabel="Home"
        currentLabel="Testimonials"
        title="Stories of Financial Transformation"
        subtitle="Real client stories shared with permission. Each journey is unique-these reflections highlight the blend of clarity, structure, and compassion at the core of our work."
        primaryCta={{ label: "Book a Discovery Call", href: "/en/contact?intent=consult" }}
        secondaryCta={{ label: "Explore Services", href: "/en/services", variant: "secondary" }}
      />

      {/* Testimonials list */}
      <section className="px-4 mt-8">
        <Panel>
          <SectionTitle
            id="stories"
            tint="green"
            title="Client Stories"
            subtitle="Quotes may be lightly edited for clarity. Results vary by individual circumstances."
          />

          <StaggerGroup className="space-y-6">
            {TESTIMONIALS.map(({ quote, name, context, year }, i) => (
              <Reveal key={`${name}-${i}`} variants={fade}>
                <figure className="border-l-4 border-brand-green pl-6 py-5 bg-brand-beige/80 rounded-2xl shadow-lg">
                  <blockquote className="italic mb-3 text-lg md:text-xl text-brand-green">“{quote}”</blockquote>
                  <figcaption className="font-semibold text-brand-green">
                    — {name}
                    {context ? <span className="text-brand-body/80 font-normal">, {context}</span> : null}
                    {year ? <span className="text-brand-body/60 font-normal"> · {year}</span> : null}
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </StaggerGroup>

          {/* CTA */}
          <div className="text-center mt-10">
            <Link
              href="/en/book"
              className={ctaButtonClass("primary")}
              aria-label="Book a free consultation"
            >
              Book a Free Consultation
            </Link>
          </div>
        </Panel>
      </section>

      {/* JSON-LD */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </main>
  );
}
