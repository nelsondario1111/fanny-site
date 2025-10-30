"use client";

import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";
import Section from "@/components/ui/Section";
import ToContactButtons from "@/components/ToContactButtons";
import { PageHero } from "@/components/PageHero";

export default function AnimatedSections() {
  return (
    <main className="flex flex-col">
      <PageHero
        title="10-Year Holistic Tax Review"
        subtitle="Clear numbers. Calm decisions."
        image="/images/resources/tax-review-leaves.jpg"
      />

      <Section className="py-16 md:py-20">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="max-w-3xl mx-auto text-center"
        >
          <h2 className="text-3xl md:text-4xl text-brand-green font-semibold mb-8">
            Top 5 Missed Refund Opportunities
          </h2>

          <ul className="text-lg md:text-xl space-y-5 text-gray-800 text-left md:text-center leading-relaxed">
            {[
              { title: "Uncashed CRA Cheques", desc: "Payments issued but never deposited." },
              { title: "Disability Tax Credit (DTC)", desc: "For eligible medical conditions." },
              { title: "Education Credits", desc: "Unused or transferable from a dependent." },
              { title: "Canada Child Benefit / GST-HST", desc: "Missed due to filing errors or missed eligibility." },
              { title: "Medical & Work Expenses", desc: "Including travel, therapy, or home office costs." },
            ].map((item, i) => (
              <li key={i} className="flex items-start justify-center gap-2">
                <CheckCircle className="text-brand-green mt-1" aria-hidden="true" />
                <span>
                  <strong>{item.title}</strong> — {item.desc}
                </span>
              </li>
            ))}
          </ul>
        </motion.div>
      </Section>

      <Section className="bg-brand-beige py-16 md:py-20 text-center">
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
            Many Canadians miss out on thousands in unclaimed benefits each year.
            Let’s make sure your money finds its way home — safely and compassionately.
          </p>

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
