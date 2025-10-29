import { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import Section from "@/components/ui/Section";
import ToContactButtons from "@/components/ToContactButtons";

export const metadata: Metadata = {
  title: "10-Year Holistic Tax Review | Fanny Samaniego",
  description:
    "Find out if you have unclaimed CRA refunds or missed benefits from the past 10 years. Book a free 15-minute consultation with Fanny Samaniego, Holistic Financial Coach in Toronto.",
  openGraph: {
    title: "10-Year Holistic Tax Review | Fanny Samaniego",
    description:
      "Discover if you have unclaimed tax refunds from the past 10 years. Personalized, holistic review by a licensed financial coach.",
    url: "https://fannysamaniego.com/en/tax-review",
    type: "website",
    images: [
      {
        url: "/images/resources/tax-review-leaves.jpg",
        width: 1200,
        height: 630,
        alt: "10-Year Tax Review – Fanny Samaniego",
      },
    ],
  },
};

export default function TaxReviewPage() {
  return (
    <main className="flex flex-col">
      {/* ================= HERO ================= */}
      <PageHero
        title="10-Year Holistic Tax Review"
        subtitle="You may be missing out on tax refunds and benefits you never knew existed."
        image="/images/resources/tax-review-leaves.jpg"
      />

      {/* ================= TOP 5 OPPORTUNITIES ================= */}
      <Section className="animate-fade-up py-16 md:py-20">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl text-brand-green font-semibold mb-6">
            🌟 Top 5 Missed Refund Opportunities
          </h2>
          <ul className="text-lg md:text-xl space-y-4 list-disc list-inside text-gray-800 text-left md:text-center">
            <li>
              💸 <strong>Uncashed CRA Cheques</strong> — Payments issued but never deposited
            </li>
            <li>
              🧑‍🦽 <strong>Disability Tax Credit (DTC)</strong> — For eligible medical conditions
            </li>
            <li>
              🎓 <strong>Education Credits</strong> — Unused or transferable from a dependent
            </li>
            <li>
              👶 <strong>Canada Child Benefit / GST-HST</strong> — Missed due to filing errors
            </li>
            <li>
              💼 <strong>Medical & Work Expenses</strong> — Travel, therapy, or home office costs
            </li>
          </ul>
        </div>
      </Section>

      {/* ================= HOW IT WORKS ================= */}
      <Section className="bg-brand-beige animate-fade-up py-16 md:py-20">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl text-brand-green font-semibold mb-6">
            How It Works
          </h2>
          <ol className="space-y-5 list-decimal list-inside text-lg md:text-xl text-gray-800 text-left md:text-center">
            <li>Submit your email or book a 15-min discovery call</li>
            <li>
              Add Fanny as a CRA representative (Rep ID:{" "}
              <span className="font-semibold text-brand-body">FD26QH9</span>)
            </li>
            <li>Fanny gently reviews your last 10 years of tax records</li>
            <li>Receive any eligible refunds, benefits, or credits</li>
          </ol>
        </div>
      </Section>

      {/* ================= CTA ================= */}
      <Section className="animate-fade-up py-16 md:py-20 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-brand-green">
            Reclaim What’s Rightfully Yours
          </h2>
          <p className="text-lg md:text-xl mb-8 text-gray-700">
            Many Canadians miss out on thousands in benefits.
            Let’s make sure your money finds its way home.
          </p>

          <ToContactButtons lang="en" align="center" />
        </div>
      </Section>
    </main>
  );
}
