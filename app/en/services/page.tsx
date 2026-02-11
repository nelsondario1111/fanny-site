// app/en/services/page.tsx
"use client";

import Link from "next/link";
import { useMemo } from "react";
import {
  CardGrid,
  ComparisonTable,
  HubPanel as Panel,
  HubSectionTitle as SectionTitle,
  InfoCard,
  OfferCard,
  PageHero,
  StickySectionNav,
} from "@/components/sections/hub";

/* ============================ Pricing (CAD) ============================ */
const PRICING = {
  mortgagePreapproval: 0,
  refiRenewal: 295,
  firstHomePlan: 395,
  proTuneUp90: 1200,
  bizOwnerExecPlan: 2500,
  corpPayrollClinic: 395,
  newcomerFastTrack: 395,
  invest4to10: 695,
  annualReviewNonClient: 149,
  discovery: 0,
  blueprint90: 395,
  align3: 1200,
  transform6: 2750,
  elevatePremium: 4995,
  alumniRetainerMonthly: 149,
  taxSession: 395,
  taxAnnual: 1295,
  taxSmallBiz90d: 1995,
  ktCohort4w: 795,
  ktMonthly: 49,
  workshopPublicSeat: 149,
  workshopTeamVirtual: 2400,
  workshopTeamInPerson: 2800,
} as const;

function price(p: number | null) {
  if (p === null) return "Contact for pricing";
  if (p === 0) return "Free";
  return `$${p} CAD`;
}

type Intent = "consult" | "preapproval" | "package";

type Card = {
  id: string;
  section: string;
  title: string;
  desc: string;
  bullets: string[];
  timeline?: string;
  scope?: string;
  tags: string[];
  price: string;
  intent?: Intent;
  moreHref?: string;
  moreLabel?: string;
};

function PackageCard({ c }: { c: Card }) {
  const qs = new URLSearchParams();
  qs.set("intent", c.intent ?? "package");
  qs.set("package", c.title);
  const bookingCta =
    c.id === "discovery" ? "Book a Discovery Call" : "Book a Strategy Session";

  const meta = [
    ...(c.timeline ? [{ label: "Timeline", value: c.timeline }] : []),
    ...(c.scope ? [{ label: "Scope", value: c.scope }] : []),
  ];

  return (
    <OfferCard
      id={c.id}
      title={c.title}
      description={c.desc}
      bullets={c.bullets.slice(0, 4)}
      price={c.price}
      tags={c.tags}
      meta={meta}
      more={c.moreHref && c.moreLabel ? { href: c.moreHref, label: c.moreLabel } : undefined}
      cta={{
        label: bookingCta,
        href: `/en/contact?${qs.toString()}`,
      }}
    />
  );
}
const SECTIONS = [
  { id: "start-here", label: "Start Here" },
  { id: "strategic-maps", label: "Strategic Financial Maps" },
  { id: "support", label: "Supplementary Support" },
  { id: "mortgage", label: "Mortgage Strategy" },
  { id: "business", label: "Business & Tax Strategy" },
  { id: "how", label: "How We Work" },
] as const;

/* ============================= Cards Data ============================= */
const CARDS: Card[] = [
  // Signature
  {
    id: "elevate",
    section: "signature",
    title: "Elevate (Premium Transformation Package)",
    desc: "End-to-end leadership for your finances: mortgage strategy, tax rhythm, business alignment, and money calm—under one coordinated umbrella.",
    bullets: [
      "Financial blueprint across cash-flow, mortgage, and tax",
      "6+ private sessions with written plans",
      "Coordination with accountant & lawyer",
      "Optional Human Design lens for cadence & decisions",
    ],
    timeline: "~6 months of guided support",
    tags: [
      "Level 3 · Full Transformation",
      "Executives",
      "Families",
      "Business Owners",
      "Premium",
    ],
    price: price(PRICING.elevatePremium),
  },
  {
    id: "transform",
    section: "signature",
    title: "Transform (6-Session Package)",
    desc: "Depth without overwhelm: we install a working system across cash-flow, credit hygiene, and tax set-asides.",
    bullets: [
      "End-to-end plan",
      "Clear guardrails",
      "Lender-ready documentation",
      "Written actions after each session",
    ],
    timeline: "~12 weeks",
    tags: [
      "Level 2 · Deep Integration",
      "Executives",
      "Business Owners",
      "Families",
    ],
    price: price(PRICING.transform6),
  },
  {
    id: "exec-teaming",
    section: "signature",
    title: "Executive Wealth Teaming (Founder/Professional)",
    desc: "Align owner pay, banking, and records lenders respect—collaborating with your accountant and lawyer.",
    bullets: [
      "Compensation matrix (salary/dividends)",
      "HST cadence; reserves & buffers",
      "CPA/lawyer coordination",
      "Leadership & decision cadence (optional)",
    ],
    timeline: "4–6 weeks (typical)",
    scope:
      "Planning & documentation; tax/legal execution with your professionals.",
    tags: [
      "Level 3 · Executive",
      "Executives",
      "Business Owners",
      "Premium",
    ],
    price: `From ${price(PRICING.bizOwnerExecPlan)}`,
  },
  {
    id: "team-workshop",
    section: "signature",
    title: "Financial Wellness Workshop (Private Team)",
    desc: "A focused 3-hour session: cash-flow cadence, lender-credible records, and a shared language for money at work.",
    bullets: [
      "Pre-survey + tailored agenda",
      "3-hour live workshop with Q&A",
      "Slide deck + resource bundle (EN/ES)",
      "Follow-up summary",
    ],
    timeline: "3 hours (virtual or on-site)",
    scope: "Up to 20 participants. HST applies.",
    tags: [
      "Level 2 · Team Implementation",
      "Executives",
      "Business Owners",
      "Professionals",
    ],
    price: `From ${price(
      PRICING.workshopTeamVirtual
    )} (virtual) • ${price(PRICING.workshopTeamInPerson)} (in person)`,
  },

  // Foundations (Money & Family)
  {
    id: "family-wealth-blueprint",
    section: "foundations",
    title: "Family Wealth Blueprint (with FHSA Options)",
    desc: "Right-sized plan for professional families: savings cadence, FHSA coordination, and a lender-credible pre-approval path.",
    bullets: [
      "FHSA single/couple optimization",
      "Savings rhythm & down-payment map",
      "Stress-test-aware affordability",
      "Optional Human Design prompts",
    ],
    timeline: "90 minutes + curated follow-up",
    tags: ["Level 1 · Start Here", "Families", "Premium"],
    price: price(PRICING.firstHomePlan),
    intent: "consult",
  },
  {
    id: "pro-tune-up",
    section: "foundations",
    title: "Professional Financial Tune-Up (90 Days)",
    desc: "A focused, human pace to steady cash-flow, real set-asides, and clean credit hygiene—built for busy professionals.",
    bullets: [
      "Weekly money cadence",
      "Quarterly tax set-asides",
      "Automation checklist",
      "Optional Human Design personalization",
    ],
    timeline: "~90 days (3 sessions + email check-ins)",
    scope: "Advice-only (no product sales).",
    tags: [
      "Level 2 · Routine Installed",
      "Professionals",
      "Executives",
      "Premium",
    ],
    price: price(PRICING.proTuneUp90),
  },

  // Mortgage
  {
    id: "mortgage-concierge",
    section: "mortgage",
    title: "Mortgage Concierge — Readiness & Pre-Approval",
    desc: "Prepare, match, and package your file so lenders say yes with confidence—calmly.",
    bullets: [
      "Precise checklist; secure intake",
      "Scenario stress-tests & lender matching",
      "Support from appraisal to close",
      "Optional Human Design brief",
    ],
    timeline: "Usually 1–2 weeks after documents are complete",
    scope:
      "Residential; O.A.C.; no borrower fee in typical prime cases—any exception disclosed in advance.",
    tags: [
      "Level 1 · Start Here",
      "Professionals",
      "Families",
      "Newcomers",
      "Premium",
    ],
    price: price(PRICING.mortgagePreapproval),
    intent: "preapproval",
  },
  {
    id: "refi-renewal",
    section: "mortgage",
    title: "Refinance & Renewal Strategy",
    desc: "Clean math, clear trade-offs, and a short written plan.",
    bullets: [
      "Refi vs. renew modeling",
      "Penalty & rate break-even analysis",
      "Prepayment guardrails",
      "Written summary within 24h",
    ],
    timeline: "60–90 minutes",
    tags: [
      "Level 1 · Single Decision",
      "Professionals",
      "Families",
      "Executives",
    ],
    price: price(PRICING.refiRenewal),
  },
  {
    id: "invest-4-10",
    section: "mortgage",
    title: "Investment Starter: 4–10 Units (DSCR)",
    desc: "Honest numbers and safer conditions for your first small building—clarity without drama.",
    bullets: [
      "GMR/OPEX/NOI/DSCR modeling",
      "Offer & condition playbook",
      "First-90-days plan",
      "Lender conversation prep",
    ],
    timeline: "~2 hours + notes",
    scope: "Educational analysis; not investment advice.",
    tags: ["Level 2 · Investment", "Investors", "Business Owners", "Executives"],
    price: price(PRICING.invest4to10),
  },

  // Business
  {
    id: "pay-yourself-clinic",
    section: "business",
    title: "Incorporation / Pay-Yourself Clinic",
    desc: "One clear conversation to map owner pay, payroll/dividends, and next steps with your accountant.",
    bullets: [
      "Owner pay matrix",
      "Payroll & remittance basics",
      "Dividend timing considerations",
      "1-page decision summary",
    ],
    timeline: "60–75 minutes",
    tags: ["Level 1 · Setup", "Business Owners", "Professionals"],
    price: price(PRICING.corpPayrollClinic),
  },
  {
    id: "tax-review-10y",
    section: "business",
    title: "10-Year Holistic Tax Review",
    desc: "A calm, step-by-step look back over the last decade to uncover missed credits, benefits, and refunds you may still be entitled to.",
    bullets: [
      "Review up to 10 years of returns and life events",
      "Identify gaps in benefits, credits, and key programs",
      "Simple, CRA-friendly action plan",
      "Private, judgment-free process",
    ],
    timeline: "Typically 6–12 weeks, depending on CRA processing times",
    scope:
      "We highlight opportunities and next steps; CRA decisions and timelines remain theirs.",
    tags: [
      "Level 2 · Deep Review",
      "Families",
      "Professionals",
      "Newcomers",
    ],
    price: price(null),
    moreHref: "/en/tax-review",
    moreLabel: "Learn more about the 10-Year Holistic Tax Review →",
  },

  // Legacy & Tax
  {
    id: "tax-strategy",
    section: "legacy",
    title: "Personal / Family Tax Strategy Session",
    desc: "Set a quarterly rhythm and right-sized set-asides—predictable, compliant, and kind to your nervous system.",
    bullets: [
      "Quarterly schedule",
      "Right-sized set-asides",
      "Receipts & records checklist",
      "Calendar templates",
    ],
    timeline: "75–90 minutes",
    tags: ["Level 1 · Start Here", "Families", "Professionals"],
    price: price(PRICING.taxSession),
  },
  {
    id: "legacy-annual",
    section: "legacy",
    title: "Legacy & Tax Rhythm (Annual)",
    desc: "Two key sessions + gentle check-ins so deadlines don’t sneak up.",
    bullets: [
      "Mid-year tune-up",
      "Pre-year-end planning",
      "Optional cadence prompts",
      "CPA coordination",
    ],
    timeline: "Annual (2 sessions + touchpoints)",
    tags: ["Level 2 · Ongoing", "Families", "Executives", "Professionals"],
    price: price(PRICING.taxAnnual),
  },
  {
    id: "smallbiz-setup",
    section: "legacy",
    title: "Small-Biz / Independent 90-Day Setup",
    desc: "Bring cash-flow, HST cycle, and owner pay into a system that scales—and that lenders recognize.",
    bullets: [
      "HST cadence",
      "Pay-yourself plan",
      "Owner reserves & buffers",
      "Documentation hygiene",
    ],
    timeline: "~90 days",
    tags: ["Level 2 · Routine Installed", "Business Owners", "Professionals"],
    price: price(PRICING.taxSmallBiz90d),
  },

  // Workshops
  {
    id: "public-money-clarity",
    section: "workshops",
    title: "Money Clarity Workshop (Public Cohort)",
    desc: "Practical, values-aligned learning to steady cash-flow, plan set-asides, and understand mortgage stress-tests.",
    bullets: [
      "2.5–3 hour live session",
      "Budget & set-aside templates you keep",
      "Mortgage stress-test primer (Canada 2025 rules)",
      "Optional Human Design prompts",
    ],
    timeline: "Single session (weeknight or Saturday morning)",
    scope: "Open to professionals and families; limited seats.",
    tags: ["Level 1 · Group", "Professionals", "Families"],
    price: `${price(PRICING.workshopPublicSeat)}/person`,
  },

  // Family / Group
  {
    id: "kt-4w",
    section: "family",
    title: "Kitchen Table Conversations — 4-Week Cohort",
    desc: "Small group, warm pace. Meet weekly, share real numbers, and practice gentle money routines together.",
    bullets: [
      "Weekly live sessions (small group)",
      "Optional Human Design prompts",
      "Templates & checklists to keep",
      "Kind accountability & Q&A",
    ],
    timeline: "4 weeks",
    tags: ["Level 1 · Group", "Families", "Premium"],
    price: price(PRICING.ktCohort4w),
  },
  {
    id: "kt-monthly",
    section: "family",
    title: "Kitchen Table Conversations — Monthly Circle",
    desc: "A lighter touch to stay in motion: live Q&A, fresh resources, and a friendly place to ask for help.",
    bullets: ["Monthly live Q&A", "Resource drops", "Member space for questions"],
    timeline: "Month-to-month",
    tags: ["Level 2 · Ongoing", "Families"],
    price: `${price(PRICING.ktMonthly)}/month`,
  },

  // Newcomers
  {
    id: "newcomer-30d",
    section: "newcomers",
    title: "Newcomer Wealth Integration (30 Days)",
    desc: "Gentle setup for banking, credit, and rent reporting—so your profile reads clearly to lenders.",
    bullets: [
      "Account & phone-plan map",
      "Secured card strategy & limits",
      "Rent-reporting options",
      "Credit hygiene routine",
    ],
    timeline: "~30 days",
    tags: ["Level 1 · Start Here", "Newcomers"],
    price: price(PRICING.newcomerFastTrack),
  },

  // Advice / Orientation
  {
    id: "discovery",
    section: "advice",
    title: "Private Discovery Call",
    desc: "A short, human conversation. Share your goal and timing; leave with 2–3 clear next steps.",
    bullets: ["2–3 next steps", "No documents yet", "Bilingual EN/ES"],
    timeline: "20–30 minutes",
    tags: [
      "Level 0 · Start Here",
      "Professionals",
      "Families",
      "Executives",
      "Newcomers",
    ],
    price: price(PRICING.discovery),
    intent: "consult",
  },
  {
    id: "blueprint",
    section: "advice",
    title: "90-Minute Blueprint Session",
    desc: "One priority handled with care: affordability, tax rhythm, credit cleanup, or renewal strategy.",
    bullets: [
      "Focused scope",
      "Personalized numbers",
      "Written actions within 24h",
      "Optional Human Design snapshot",
    ],
    timeline: "90 minutes",
    tags: [
      "Level 1 · Focused",
      "Professionals",
      "Business Owners",
      "Families",
    ],
    price: price(PRICING.blueprint90),
  },
  {
    id: "align-3",
    section: "advice",
    title: "Align (3-Session Package)",
    desc: "Install gentle routines and momentum—without overwhelm.",
    bullets: [
      "Money rhythm & automation",
      "Tax set-asides that stick",
      "Light accountability",
    ],
    timeline: "6–8 weeks",
    tags: ["Level 2 · Routine Installed", "Professionals", "Newcomers"],
    price: price(PRICING.align3),
  },
];

/* ============================= Page ============================= */
export default function ServicesPage() {
  const sectionsWithCards = useMemo(() => {
    const byId = (id: string) => CARDS.find((c) => c.id === id);
    const by = (section: string) => CARDS.filter((c) => c.section === section);
    const byIds = (ids: string[]) =>
      ids.map(byId).filter((c): c is Card => Boolean(c));
    return {
      startHere: byIds(["discovery", "blueprint"]),
      strategicMaps: by("signature"),
      supplementarySupport: [
        ...by("foundations"),
        ...by("advice").filter((c) => !["discovery", "blueprint"].includes(c.id)),
        ...by("workshops"),
        ...by("family"),
        ...by("newcomers"),
      ],
      mortgage: by("mortgage"),
      business: [...by("business"), ...by("legacy")],
    };
  }, []);

  return (
    <main id="main" className="bg-white min-h-screen">
      <PageHero
        homeHref="/en"
        homeLabel="Home"
        currentLabel="Services"
        title="Start with clarity, then build your financial strategy"
        subtitle="Begin with a Discovery Call, choose a focused Strategy Session, and move into tiered Strategic Financial Maps when you are ready for deeper implementation."
        primaryCta={{
          label: "Book a Discovery Call",
          href: "/en/contact?intent=consult&package=Private%20Discovery%20Call",
        }}
        secondaryCta={{
          label: "Explore Strategic Financial Maps",
          href: "#strategic-maps",
          variant: "secondary",
        }}
      />

      <StickySectionNav
        sections={SECTIONS}
        ariaLabel="On this page"
        defaultActive="start-here"
      />

      {/* ======= 1. Start Here ======= */}
      <div className="bg-brand-gold/5 border-t border-brand-gold/20">
        <Panel>
          <SectionTitle
            id="start-here"
            title="Start Here: Discovery Call + Strategy Sessions"
            subtitle="Use these two sessions to set direction quickly, then decide whether to continue with deeper support."
            tint="gold"
          />
          <Grid cards={sectionsWithCards.startHere} />
        </Panel>
      </div>

      {/* ======= 2. Strategic Financial Maps ======= */}
      <div className="bg-brand-green/5 border-t border-brand-gold/20">
        <Panel>
          <SectionTitle
            id="strategic-maps"
            title="Strategic Financial Maps"
            subtitle="Comprehensive, coordinated support for major life and business transitions"
            tint="green"
          />
          <div className="mb-6 grid md:grid-cols-3 gap-4">
            <InfoCard
              kicker="Tier 1"
              title="Focused Direction"
              description="Clarify one high-stakes priority with a practical implementation path."
            />
            <InfoCard
              kicker="Tier 2"
              title="Deep Integration"
              description="Install routines and decision systems across cash-flow, mortgage, and tax."
            />
            <InfoCard
              kicker="Tier 3"
              title="Premium Transformation"
              description="Full-spectrum planning and ongoing coordination with your professional team."
            />
          </div>
          <ComparisonTable
            className="mb-6"
            columns={["Best for", "Typical depth", "Ideal timeline"]}
            rows={[
              {
                label: "Tier 1",
                values: ["One priority at a time", "Focused strategy + actions", "2-6 weeks"],
              },
              {
                label: "Tier 2",
                values: ["System installation", "Cross-functional planning", "8-12 weeks"],
              },
              {
                label: "Tier 3",
                values: ["Full transformation", "Executive-level coordination", "3-6 months"],
              },
            ]}
            footnote="Timelines vary by scope and documentation readiness."
          />
          <Grid cards={sectionsWithCards.strategicMaps} />
        </Panel>
      </div>

      {/* ======= 3. Supplementary Support ======= */}
      <div className="bg-brand-gold/5 border-t border-brand-gold/20">
        <Panel>
          <SectionTitle
            id="support"
            title="Supplementary Support"
            subtitle="Private coaching, workshops, and cohorts that reinforce your plan with gentle accountability."
            tint="gold"
          />
          <Grid cards={sectionsWithCards.supplementarySupport} />
        </Panel>
      </div>

      {/* ======= 4. Mortgage Strategy ======= */}
      <div className="bg-gradient-to-b from-brand-green/10 to-white border-y border-brand-gold/20">
        <Panel className="bg-white/90">
          <SectionTitle
            id="mortgage"
            title="Mortgage Strategy"
            subtitle="Confidence from pre-approval to closing—and early steps for 4–10 unit investments"
            tint="green"
          />
          <Grid cards={sectionsWithCards.mortgage} />
        </Panel>
      </div>

      {/* ======= 5. Business & Tax Strategy ======= */}
      <div className="bg-brand-gold/5 border-t border-brand-gold/20">
        <Panel>
          <SectionTitle
            id="business"
            title="Business & Tax Strategy"
            subtitle="Executive clarity and predictable tax rhythms for professionals and business owners"
            tint="gold"
          />
          <Grid cards={sectionsWithCards.business} />
        </Panel>
      </div>

      {/* ======= 6. How We Work ======= */}
      <div className="bg-brand-green/5 border-t border-brand-gold/20">
        <Panel>
          <SectionTitle
            id="how"
            title="How We Work"
            subtitle="Steady, transparent, and human"
            tint="green"
          />
          <div className="grid md:grid-cols-3 gap-6">
            <InfoCard
              title="1) Discovery"
              description="A brief, kind conversation. If we’re a fit, you’ll get a short plan and a precise checklist—only what’s needed."
            />
            <InfoCard
              title="2) Plan & Execution"
              description="We model scenarios, prepare documents, and coordinate steps at a manageable pace. You always know what’s next and why."
            />
            <InfoCard
              title="3) Review & Adjust"
              description="We confirm outcomes against the plan, note any changes, and set your next check-in. Calm and repeatable."
            />
          </div>
          <div className="mt-6 text-sm text-brand-blue/80 space-y-2">
            <p>
              <strong>Notes:</strong> Prices are in CAD and may be subject to
              HST. Mortgage services are typically free for qualified borrowers
              because compensation is paid by the lender on closing. Fees may
              apply in non-prime/private/commercial cases and will be disclosed
              in advance. All mortgages are O.A.C. (on approved credit).
            </p>
            <p>
              Coaching services are independent of mortgage compensation and do
              not replace legal, tax, or accounting advice. We coordinate with
              your chosen professionals as needed. Bilingual support (EN/ES).
            </p>
            <p>
              For workshops: virtual sessions are available Canada-wide;
              in-person sessions may include travel. Seat-based public cohorts
              are limited to preserve Q&A quality.
            </p>
            <p className="mb-0">
              Prefer Spanish?{" "}
              <Link href="/es/servicios" className="underline">
                Ver servicios en español
              </Link>
              .
            </p>
          </div>
        </Panel>
      </div>
    </main>
  );
}

/* ============================ Grid Renderer ============================ */
function Grid({ cards }: { cards: Card[] }) {
  if (!cards.length)
    return <p className="text-brand-blue/70">No services available.</p>;

  return (
    <CardGrid>
      {cards.map((c) => (
        <PackageCard key={c.id} c={c} />
      ))}
    </CardGrid>
  );
}
