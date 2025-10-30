

import { Metadata } from "next";
import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import Section from "@/components/ui/Section";
import ToContactButtons from "@/components/ToContactButtons";

/* ============================================================================
   10-Year Holistic Tax Review — English Landing Page
   Optimized for SEO, clarity, and lead generation
============================================================================ */

export const metadata: Metadata = {
  title: "10-Year Holistic Tax Review | Fanny Samaniego",
  description:
    "Find out if you have unclaimed CRA refunds or missed benefits from the past 10 years. Book a free 15-minute consultation with Fanny Samaniego, Holistic Financial Coach in Toronto.",
  alternates: {
    canonical: "https://fannysamaniego.com/en/tax-review",
    languages: {
      "en-CA": "https://fannysamaniego.com/en/tax-review",
      "es-CA": "https://fannysamaniego.com/es/revision-impuestos",
    },
  },
  openGraph: {
    title: "10-Year Holistic Tax Review | Fanny Samaniego",
    description:
      "Discover if you have unclaimed CRA refunds or missed benefits from the past 10 years. Personalized, holistic review by a licensed financial coach.",
    url: "https://fannysamaniego.com/en/tax-review",
    siteName: "Fanny Samaniego — Mortgages • Money • Taxes",
    locale: "en_CA",
    type: "website",
    images: [
      {
        url: "/images/resources/tax-review-leaves.jpg",
        width: 1200,
        height: 630,
        alt: "Holistic Tax Review — Fanny Samaniego",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "10-Year Holistic Tax Review | Fanny Samaniego",
    description:
      "Find out if you have unclaimed CRA refunds or missed benefits — holistic review with Fanny Samaniego.",
    images: ["/images/resources/tax-review-leaves.jpg"],
    creator: "@fannysamaniego",
  },
};

/* ============================================================================
   Page Component
============================================================================ */

export default function TaxReviewPage() {
  return (
    <main className="flex flex-col">
      {/* ================= HERO ================= */}
      <PageHero
        title="10-Year Holistic Tax Review"
        subtitle="Clear numbers. Calm decisions."
        image="/images/resources/tax-review-leaves.jpg"
      />

      {/* ================= TOP REFUND OPPORTUNITIES ================= */}
      <Section className="py-16 md:py-20">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="max-w-3xl mx-auto text-center"
        >
          <h2
            id="refunds"
            className="text-3xl md:text-4xl text-brand-green font-semibold mb-8"
          >
            Top 5 Missed Refund Opportunities
          </h2>

          <ul
            aria-labelledby="refunds"
            className="text-lg md:text-xl space-y-5 text-gray-800 text-left md:text-center leading-relaxed"
          >
            {[
              {
                title: "Uncashed CRA Cheques",
                desc: "Payments issued but never deposited.",
              },
              {
                title: "Disability Tax Credit (DTC)",
                desc: "For eligible medical conditions.",
              },
              {
                title: "Education Credits",
                desc: "Unused or transferable from a dependent.",
              },
              {
                title: "Canada Child Benefit / GST-HST",
                desc: "Missed due to filing errors or missed eligibility.",
              },
              {
                title: "Medical & Work Expenses",
                desc: "Including travel, therapy, or home office costs.",
              },
            ].map((item, i) => (
              <li
                key={i}
                className="flex items-start justify-center gap-2 md:justify-center"
              >
                <CheckCircle
                  className="text-brand-green flex-shrink-0 mt-1"
                  aria-hidden="true"
                />
                <span>
                  <strong>{item.title}</strong> — {item.desc}
                </span>
              </li>
            ))}
          </ul>
        </motion.div>
      </Section>

      {/* ================= HOW IT WORKS ================= */}
      <Section className="bg-brand-beige py-16 md:py-20">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="max-w-3xl mx-auto text-center"
        >
          <h2
            id="how-it-works"
            className="text-3xl md:text-4xl text-brand-green font-semibold mb-8"
          >
            How It Works
          </h2>

          <ol
            aria-labelledby="how-it-works"
            className="space-y-6 list-decimal list-inside text-lg md:text-xl text-gray-800 text-left md:text-center leading-relaxed"
          >
            <li>Submit your email or book a 15-minute discovery call.</li>
            <li>
              Add Fanny as a CRA representative (Rep ID:{" "}
              <span className="font-semibold text-brand-body">FD26QH9</span>).
            </li>
            <li>
              Fanny personally and compassionately reviews your past 10 years of
              tax records to uncover every missed opportunity.
            </li>
            <li>
              Receive eligible refunds, benefits, or credits directly from the
              CRA.
            </li>
            <li>
              🆓 <strong>No upfront cost:</strong> You only pay if money is
              recovered.
            </li>
          </ol>
        </motion.div>
      </Section>

      {/* ================= CTA SECTION ================= */}
      <Section className="py-16 md:py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="max-w-2xl mx-auto"
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-brand-green">
            Reclaim What’s Rightfully Yours
          </h2>
          <p className="text-lg md:text-xl mb-10 text-gray-700 leading-relaxed">
            Many Canadians miss out on thousands in unclaimed benefits each
            year. Let’s make sure your money finds its way home — safely and
            compassionately.
            <br />
            <br />
            <strong>
              This holistic tax review is free — you only pay if a refund is
              recovered.
            </strong>
          </p>

          {/* --- Email Lead Form --- */}
          <form
            action="/api/subscribe"
            method="post"
            className="flex flex-col sm:flex-row gap-3 justify-center mb-10"
          >
            <input
              type="email"
              name="email"
              placeholder="Enter your email for your free review"
              required
              className="px-4 py-2 rounded-md border border-gray-300 focus:border-brand-green focus:ring-brand-green focus:outline-none w-full sm:w-auto"
            />
            <button
              type="submit"
              className="bg-brand-green text-white font-semibold px-6 py-2 rounded-md hover:bg-brand-gold transition"
            >
              Get My Review
            </button>
          </form>

          <ToContactButtons lang="en" align="center" />
        </motion.div>
      </Section>
    </main>
  );
}
