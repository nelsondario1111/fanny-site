import { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import Section from "@/components/ui/Section";
import ToContactButtons from "@/components/ToContactButtons";

export const metadata: Metadata = {
  title: "Free 10-Year Tax Review — Missed Benefits & Refunds | Fanny Samaniego",
  description:
    "Recover missed CRA tax refunds and benefits with a 10-year holistic review. Free 15-min call to check eligibility. Bilingual EN/ES support.",
  alternates: {
    canonical: "https://www.fannysamaniego.com/en/tax-review",
    languages: {
      "en-CA": "https://www.fannysamaniego.com/en/tax-review",
      "es-CA": "https://www.fannysamaniego.com/es/revision-impuestos",
    },
  },
  openGraph: {
    title: "Free 10-Year Tax Review — Fanny Samaniego",
    description:
      "You may be owed hundreds in tax refunds from the CRA. Book a free 15-min call to find out.",
    url: "https://www.fannysamaniego.com/en/tax-review",
    type: "website",
    locale: "en_CA",
    siteName: "Fanny Samaniego — Mortgages • Money • Taxes",
    images: [
      {
        url: "https://www.fannysamaniego.com/og/og-tax-review-en.png", // ✅ static Canva OG banner
        width: 1200,
        height: 630,
        alt: "Recover missed CRA tax benefits — 10-Year Review | Fanny Samaniego",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    creator: "@fannysamaniego",
    title: "Free 10-Year Tax Review — Fanny Samaniego",
    description:
      "You may be owed hundreds in tax refunds from the CRA. Book a free 15-min call to find out.",
    images: ["https://www.fannysamaniego.com/og/og-tax-review-en.png"],
  },
};

export default function TaxReviewPage() {
  return (
    <main className="flex flex-col">
      {/* ================= HERO ================= */}
      <PageHero
        title="10-Year Holistic Tax Review"
        subtitle="You may be missing out on tax refunds and benefits you never knew existed."
        image="/images/resources/tax-review-leaves.jpg" // ✅ still fine for visual hero
      />

      {/* ================= TOP REFUND OPPORTUNITIES ================= */}
      <Section className="animate-fade-up py-16 md:py-20">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl text-brand-green font-semibold mb-8">
            🌟 Top 5 Missed Refund Opportunities
          </h2>
          <ul className="text-lg md:text-xl space-y-5 list-disc list-inside text-gray-800 text-left md:text-center leading-relaxed">
            <li>
              💸 <strong>Uncashed CRA Cheques</strong> — Payments issued but never deposited.
            </li>
            <li>
              🧑‍🦽 <strong>Disability Tax Credit (DTC)</strong> — For eligible medical conditions.
            </li>
            <li>
              🎓 <strong>Education Credits</strong> — Unused or transferable from a dependent.
            </li>
            <li>
              👶 <strong>Canada Child Benefit / GST-HST</strong> — Missed due to filing errors.
            </li>
            <li>
              💼 <strong>Medical & Work Expenses</strong> — Travel, therapy, or home-office costs.
            </li>
          </ul>
        </div>
      </Section>

      {/* ================= HOW IT WORKS ================= */}
      <Section className="bg-brand-beige animate-fade-up py-16 md:py-20">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl text-brand-green font-semibold mb-8">
            How It Works
          </h2>
          <ol
            aria-label="Process steps for the 10-year tax review"
            className="space-y-6 list-decimal list-inside text-lg md:text-xl text-gray-800 text-left md:text-center leading-relaxed"
          >
            <li>Submit your email or book a 15-minute discovery call.</li>
            <li>
              Add Fanny as a CRA representative (Rep ID:{" "}
              <span className="font-semibold text-brand-body">FD26QH9</span>).
            </li>
            <li>Fanny reviews your last 10 years of tax records with a holistic approach.</li>
            <li>Receive any eligible refunds or benefits directly from the CRA.</li>
            <li>
              🆓 <strong>No upfront cost:</strong> you only pay if money is recovered.
            </li>
          </ol>
        </div>
      </Section>

      {/* ================= CTA ================= */}
      <Section className="animate-fade-up py-16 md:py-20 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-brand-green">
            Reclaim What’s Rightfully Yours
          </h2>
          <p className="text-lg md:text-xl mb-10 text-gray-700 leading-relaxed">
            Many Canadians miss out on thousands in unclaimed benefits each year.  
            Let’s make sure your money finds its way home — safely and compassionately.
          </p>

          <ToContactButtons lang="en" align="center" />
        </div>
      </Section>
    </main>
  );
}
