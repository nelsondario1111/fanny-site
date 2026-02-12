import { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import HowItWorksTimeline from "@/components/HowItWorksTimeline";
import TrustChips from "@/components/TrustChips";
import Section from "@/components/ui/Section";

export const metadata: Metadata = {
  title:
    "10-Year Holistic Tax Review — Recover Missed CRA Benefits & Refunds | Fanny Samaniego",
  description:
    "You may be owed tax refunds or benefits from the last 10 years. Get a calm, holistic CRA review for Toronto and Ontario clients with no upfront cost. Free 15-min call to check eligibility. Bilingual EN/ES support.",
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
      "You may be owed hundreds or thousands in missed refunds and benefits from the CRA. Book a free 15-min call for Toronto and Ontario support.",
    url: "https://www.fannysamaniego.com/en/tax-review",
    type: "website",
    locale: "en_CA",
    siteName:
      "Fanny Samaniego — Holistic Financial Consultant | Taxes • Mortgages • Money Strategy",
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
      "You may be owed hundreds or thousands in missed refunds and benefits from the CRA. Book a free 15-min call for Toronto and Ontario support.",
    images: ["https://www.fannysamaniego.com/og/og-tax-review-en.png"],
  },
};

export default function TaxReviewPage() {
  const pkg = "10-Year Holistic Tax Review";
  const queryPkg = encodeURIComponent(pkg);
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Who is the 10-Year Holistic Tax Review for?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "It is designed for people with multiple life or income changes across recent years who want to identify missed CRA benefits and refund opportunities.",
        },
      },
      {
        "@type": "Question",
        name: "Do I pay upfront for the review?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "No upfront fee is required. A success fee only applies if recoverable amounts are found and processed.",
        },
      },
      {
        "@type": "Question",
        name: "Do CRA refunds come through your firm?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "No. Any eligible refunds or benefits are paid directly by the CRA.",
        },
      },
    ],
  } as const;

  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "10-Year Holistic Tax Review",
    serviceType: "Tax review and coordination",
    areaServed: {
      "@type": "AdministrativeArea",
      name: "Toronto, Ontario, Canada",
    },
    provider: {
      "@type": "Organization",
      name: "Fanny Samaniego",
    },
    offers: {
      "@type": "Offer",
      priceCurrency: "CAD",
      price: "0",
      description: "No upfront fee; success-based fee when recovery is achieved.",
    },
    url: "https://www.fannysamaniego.com/en/tax-review",
  } as const;

  return (
    <main className="flex flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
      />
      {/* ================= HERO ================= */}
      <PageHero
        title="10-Year Holistic Tax Review"
        subtitle="A calm, step-by-step review of up to 10 years of your CRA history to uncover refunds and benefits you may have missed."
        image="/images/resources/tax-review-leaves.jpg"
        imageAlt="Calm leaves background representing the 10-Year Holistic Tax Review process"
      />

      <Section className="py-8 md:py-10">
        <TrustChips lang="en" />
      </Section>

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
        <div className="max-w-5xl mx-auto">
          <HowItWorksTimeline
            title="How It Works"
            subtitle="Simple, transparent process from first call to coordinated next steps."
            steps={[
              {
                title: "Discovery call",
                detail: "Start with a free 15-minute call to confirm fit and review your case timeline.",
              },
              {
                title: "Clarity intake",
                detail: "Complete intake and CRA authorization so records can be reviewed accurately.",
              },
              {
                title: "Review, implementation, coordination",
                detail: "Receive findings, recommended adjustment steps, and coordinated guidance through the process.",
              },
            ]}
          />
          <p className="mt-6 text-sm text-gray-600 leading-relaxed text-center">
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
          <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-brand-green">
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

          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href={`/en/contact?intent=question&package=${queryPkg}`}
              className="inline-flex items-center rounded-full px-5 py-2.5 text-sm font-sans font-bold shadow transition bg-brand-green text-white hover:opacity-90"
            >
              Check if you qualify
            </Link>
            <Link
              href={`/en/book?package=${queryPkg}`}
              className="inline-flex items-center rounded-full px-5 py-2.5 text-sm font-sans font-bold shadow transition border-2 border-brand-blue text-brand-blue hover:bg-brand-blue hover:text-white"
            >
              Book 15-min Tax Review Call
            </Link>
            <Link
              href={`/en/contact?intent=package&package=${queryPkg}`}
              className="inline-flex items-center rounded-full px-5 py-2.5 text-sm font-sans font-bold shadow transition border-2 border-brand-green text-brand-green hover:bg-brand-green hover:text-white"
            >
              Start Tax Review Intake
            </Link>
          </div>

          <p className="mt-6 text-sm text-gray-600">
            Prefer Spanish? The 10-year review is also available en Español —
            just let us know during your call.
          </p>
        </div>
      </Section>
    </main>
  );
}
