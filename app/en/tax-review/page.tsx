import { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import Section from "@/components/ui/Section";
import ToContactButtons from "@/components/ToContactButtons";

export const metadata: Metadata = {
  title:
    "10-Year Holistic Tax Review — Recover Missed CRA Benefits & Refunds | Fanny Samaniego",
  description:
    "You may be owed tax refunds or benefits from the last 10 years. Get a calm, holistic CRA review with no upfront cost. Free 15-min call to check eligibility. Bilingual EN/ES support.",
  alternates: {
    canonical: "https://www.fannysamaniego.com/en/tax-review",
    languages: {
      "en-CA": "https://www.fannysamaniego.com/en/tax-review",
      "es-CA": "https://www.fannysamaniego.com/es/revision-impuestos",
    },
  },
  openGraph: {
    title:
      "10-Year Holistic Tax Review — Recover Missed CRA Refunds | Fanny Samaniego",
    description:
      "You may be owed hundreds or thousands in missed refunds and benefits from the CRA. Book a free 15-min call to find out if you qualify.",
    url: "https://www.fannysamaniego.com/en/tax-review",
    type: "website",
    locale: "en_CA",
    siteName: "Fanny Samaniego — Mortgages • Money • Taxes",
    images: [
      {
        url: "https://www.fannysamaniego.com/og/og-tax-review-en.png", // ✅ static Canva OG banner
        width: 1200,
        height: 630,
        alt: "Recover missed CRA tax benefits — 10-Year Holistic Review | Fanny Samaniego",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    creator: "@fannysamaniego",
    title:
      "10-Year Holistic Tax Review — Recover Missed CRA Refunds | Fanny Samaniego",
    description:
      "You may be owed hundreds or thousands in missed refunds and benefits from the CRA. Book a free 15-min call to find out if you qualify.",
    images: ["https://www.fannysamaniego.com/og/og-tax-review-en.png"],
  },
};

export default function TaxReviewPage() {
  return (
    <main className="flex flex-col">
      {/* ================= HERO ================= */}
      <PageHero
        title="10-Year Holistic Tax Review"
        subtitle="A calm, step-by-step review of up to 10 years of your CRA history to uncover refunds and benefits you may have missed."
        image="/images/resources/tax-review-leaves.jpg"
      />

      {/* ================= TOP REFUND OPPORTUNITIES ================= */}
      <Section className="animate-fade-up py-16 md:py-20">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl text-brand-green font-semibold mb-4">
            🌟 Top 5 Missed Refund Opportunities
          </h2>
          <p className="text-lg md:text-xl text-gray-700 mb-8 leading-relaxed">
            Many Canadians quietly miss out on money they’re already entitled to
            — often for years. A holistic 10-year review can surface:
          </p>
          <ul className="text-lg md:text-xl space-y-5 list-disc list-inside text-gray-800 text-left md:text-center leading-relaxed">
            <li>
              💸 <strong>Uncashed CRA cheques</strong> — Payments issued but
              never deposited.
            </li>
            <li>
              🧑‍🦽 <strong>Disability Tax Credit (DTC)</strong> — For eligible
              medical or long-term conditions.
            </li>
            <li>
              🎓 <strong>Education credits</strong> — Unused or transferable
              from a spouse or dependent.
            </li>
            <li>
              👶 <strong>Canada Child Benefit / GST-HST</strong> — Missed due to
              filing gaps or status changes.
            </li>
            <li>
              💼 <strong>Medical & work expenses</strong> — Travel, therapy, or
              home-office costs that were never fully claimed.
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
            <li>Submit your email or book a free 15-minute discovery call.</li>
            <li>
              Add Fanny as a CRA representative (Rep ID:{" "}
              <span className="font-semibold text-brand-body">FD26QH9</span>).
            </li>
            <li>
              Fanny reviews up to 10 years of your CRA tax records with a
              holistic, life-events lens.
            </li>
            <li>
              If opportunities are found, Fanny helps map the steps to request
              adjustments. Any refunds or benefits are paid{" "}
              <strong>directly by the CRA</strong>.
            </li>
            <li>
              🆓 <strong>No upfront cost:</strong> you only pay a fee if money
              is successfully recovered.
            </li>
          </ol>

          <p className="mt-8 text-sm text-gray-600 leading-relaxed">
            This review is designed to complement — not replace — your existing
            accountant or tax professional. CRA ultimately decides eligibility
            and processing timelines; our role is to help you ask the right
            questions in a clear, organized way.
          </p>
        </div>
      </Section>

      {/* ================= CTA ================= */}
      <Section className="animate-fade-up py-16 md:py-20 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-brand-green">
            Reclaim What’s Rightfully Yours
          </h2>
          <p className="text-lg md:text-xl mb-10 text-gray-700 leading-relaxed">
            Many households quietly miss out on thousands of dollars in
            unclaimed benefits and refunds over a decade.{" "}
            <span className="font-semibold">
              Let’s make sure your money finds its way home — safely,
              compassionately, and in alignment with your life today.
            </span>
          </p>

          <ToContactButtons lang="en" align="center" />

          <p className="mt-6 text-sm text-gray-600">
            Prefer Spanish? The 10-year review is also available en Español —
            just let us know during your call.
          </p>
        </div>
      </Section>
    </main>
  );
}
