// app/en/services/page.tsx
"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { useEffect, useMemo, useRef, useState } from "react";

import {
  Reveal,
  RevealPanel,
  StaggerGroup,
  useMotionPresets,
} from "@/components/motion-safe";

/* ============================ Pricing (CAD) ============================ */
/** Set any price to null to show “Contact for pricing”. HST may apply. */
const PRICING = {
  // Entry / Mortgage
  mortgagePreapproval: 0,
  refiRenewal: 295,
  firstHomePlan: 395,

  // Professionals & Business Owners
  proTuneUp90: 1200,
  bizOwnerExecPlan: 2500,
  corpPayrollClinic: 395,

  // Newcomers
  newcomerFastTrack: 395,

  // Mortgage & investment
  invest4to10: 695,
  annualReviewNonClient: 149,

  // 1:1 (advice-only)
  discovery: 0,
  blueprint90: 395,
  align3: 1200,
  transform6: 2750,
  elevatePremium: 4995,
  alumniRetainerMonthly: 149,

  // Tax & Legacy
  taxSession: 395,
  taxAnnual: 1295,
  taxSmallBiz90d: 1995,

  // Holistic Conversations (groups)
  ktCohort4w: 795,
  ktMonthly: 49,

  // Workshops
  workshopPublicSeat: 149,
  workshopTeamVirtual: 2400,
  workshopTeamInPerson: 2800,
} as const;

function price(p: number | null) {
  if (p === null) return "Contact for pricing";
  if (p === 0) return "Free";
  return `$${p} CAD`;
}

/* ================== Shared panel / titles / badges ================== */
function Panel({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <section
      className={[
        "max-w-content mx-auto px-5 sm:px-8 py-8 sm:py-12",
        "bg-white/95 rounded-[28px] border border-brand-gold/40 shadow-lg",
        "backdrop-blur-[1px]",
        className,
      ].join(" ")}
    >
      {children}
    </section>
  );
}

function SectionTitle({
  title,
  subtitle,
  id,
  level = "h2",
}: {
  title: string;
  subtitle?: ReactNode;
  id: string;
  level?: "h1" | "h2";
}) {
  const { fade, fadeUp } = useMotionPresets();
  return (
    <div id={id} className="scroll-mt-24">
      <div className="text-center mb-6">
        <Reveal variants={fadeUp}>
          {level === "h1" ? (
            <h1 className="font-serif font-extrabold text-3xl md:text-4xl text-brand-green tracking-tight">
              {title}
            </h1>
          ) : (
            <h2 className="font-serif font-extrabold text-3xl md:text-4xl text-brand-green tracking-tight">
              {title}
            </h2>
          )}
        </Reveal>

        <Reveal variants={fade}>
          <div className="flex justify-center my-4" aria-hidden="true">
            <div className="w-16 h-[3px] rounded-full bg-brand-gold" />
          </div>
        </Reveal>

        {subtitle && (
          <Reveal variants={fadeUp}>
            <p className="text-brand-blue/90 text-lg md:text-xl max-w-3xl mx-auto">{subtitle}</p>
          </Reveal>
        )}
      </div>
    </div>
  );
}

function PriceBadge({ children }: { children: ReactNode }) {
  return (
    <span className="text-sm px-3 py-1 rounded-full bg-brand-gold/15 text-brand-green border border-brand-gold/50">
      {children}
    </span>
  );
}
function TagBadge({ children }: { children: ReactNode }) {
  return (
    <span className="text-xs px-2.5 py-1 rounded-full bg-white text-brand-green border border-brand-gold/40">
      {children}
    </span>
  );
}

/* Card style aligned with panels */
const CARD =
  "rounded-3xl border border-brand-gold/40 bg-white/95 shadow-lg p-6 transition hover:-translate-y-[1px] hover:shadow-xl focus-within:ring-2 focus-within:ring-brand-gold backdrop-blur-[1px]";

/* ======================= Reusable package card ======================= */
type Intent = "consult" | "preapproval" | "package";

type SectionId =
  | "overview"
  | "signature"
  | "foundations"
  | "mortgage"
  | "business"
  | "workshops"
  | "legacy"
  | "family"
  | "newcomers"
  | "advice"
  | "how";

type Card = {
  id: string;
  section: SectionId;
  title: string;
  desc: string;
  bullets: string[];
  timeline?: string;
  scope?: string;
  tags: string[];
  price: string;
  intent?: Intent;
};

function PackageCard({ c }: { c: Card }) {
  const { fadeUp } = useMotionPresets();
  const qs = new URLSearchParams();
  qs.set("intent", c.intent ?? "package");
  qs.set("package", c.title);
  return (
    <Reveal variants={fadeUp}>
      <article className={CARD} aria-labelledby={`${c.id}-title`}>
        <div className="flex items-center justify-between gap-3">
          <h3 id={`${c.id}-title`} className="font-serif text-2xl text-brand-green font-bold m-0">
            {c.title}
          </h3>
          <PriceBadge>{c.price}</PriceBadge>
        </div>

        {c.tags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {c.tags.map((t) => (
              <TagBadge key={t}>{t}</TagBadge>
            ))}
          </div>
        )}

        <p className="mt-3 text-brand-blue/90">{c.desc}</p>

        <ul className="mt-3 list-disc pl-5 space-y-1 text-brand-blue/90">
          {c.bullets.slice(0, 4).map((p) => (
            <li key={p}>{p}</li>
          ))}
        </ul>

        {(c.timeline || c.scope) && (
          <div className="mt-3 text-sm text-brand-blue/80 space-y-1">
            {c.timeline && (
              <p className="m-0">
                <strong>Timeline:</strong> {c.timeline}
              </p>
            )}
            {c.scope && (
              <p className="m-0">
                <strong>Scope:</strong> {c.scope}
              </p>
            )}
          </div>
        )}

        <div className="mt-5 flex flex-wrap gap-3">
          <Link
            href={`/en/contact?${qs.toString()}`}
            className="px-5 py-2.5 bg-brand-green text-white rounded-full font-semibold hover:bg-brand-gold hover:text-brand-green border border-brand-green/20 transition"
            aria-label={`Contact about ${c.title}`}
          >
            Book a Private Consultation
          </Link>
          <Link
            href="/en/resources#overview"
            className="px-5 py-2.5 rounded-full border border-brand-blue/40 text-brand-blue hover:bg-brand-blue hover:text-white transition"
          >
            Explore related resources
          </Link>
        </div>
      </article>
    </Reveal>
  );
}

/* ====================== On-page sticky section nav ====================== */
const SECTIONS = [
  { id: "overview", label: "Overview" },
  { id: "signature", label: "Signature Packages" },
  { id: "foundations", label: "Wealth Foundations" },
  { id: "mortgage", label: "Mortgage & Property" },
  { id: "business", label: "Business & Professionals" },
  { id: "workshops", label: "Workshops" },
  { id: "legacy", label: "Legacy & Tax" },
  { id: "family", label: "Holistic Conversations" },
  { id: "newcomers", label: "Newcomers" },
  { id: "advice", label: "1:1 Advisory" },
  { id: "how", label: "How We Work" },
] as const;

function SectionNav() {
  const [active, setActive] = useState<string>("overview");
  const refs = useRef<Record<string, HTMLElement | null>>({});

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-25% 0px -65% 0px", threshold: [0, 0.2, 0.5, 0.8, 1] }
    );

    SECTIONS.forEach((s) => {
      const el = document.getElementById(s.id);
      refs.current[s.id] = el;
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <div className="sticky top-[64px] z-30 bg-white/90 backdrop-blur border-b border-brand-gold/30">
      <nav className="max-w-content mx-auto px-4 py-2 flex gap-2 overflow-x-auto text-sm" aria-label="On this page">
        {SECTIONS.map((s) => (
          <a
            key={s.id}
            href={`#${s.id}`}
            className={[
              "px-3 py-1.5 rounded-full border transition whitespace-nowrap",
              active === s.id
                ? "bg-brand-green text-white border-brand-green"
                : "border-brand-gold/40 text-brand-green hover:bg-brand-green/10",
            ].join(" ")}
            aria-current={active === s.id ? "true" : undefined}
          >
            {s.label}
          </a>
        ))}
      </nav>
    </div>
  );
}

/* ========================= Audience filter chips ======================== */
const FILTER_TAGS = [
  "Professionals",
  "Business Owners",
  "Executives",
  "Families",
  "Investors",
  "Newcomers",
  "Premium",
] as const;

function FilterBar({ value, onChange }: { value: string[]; onChange: (next: string[]) => void }) {
  function toggle(tag: string) {
    onChange(value.includes(tag) ? value.filter((t) => t !== tag) : [...value, tag]);
  }
  return (
    <div className="max-w-content mx-auto px-4 py-3 flex flex-wrap gap-2" aria-label="Audience filters">
      {FILTER_TAGS.map((t) => (
        <button
          key={t}
          onClick={() => toggle(t)}
          className={[
            "px-3 py-1.5 rounded-full text-sm border transition",
            value.includes(t)
              ? "bg-brand-green text-white border-brand-green"
              : "border-brand-gold/40 text-brand-green hover:bg-brand-green/10",
          ].join(" ")}
          aria-pressed={value.includes(t)}
        >
          {t}
        </button>
      ))}
      {value.length > 0 && (
        <button
          onClick={() => onChange([])}
          className="ml-2 px-3 py-1.5 rounded-full text-sm border border-brand-blue/30 text-brand-blue hover:bg-brand-blue hover:text-white transition"
        >
          Clear filters
        </button>
      )}
    </div>
  );
}

/* ============================== Data ============================== */
type CardArray = Card[];

const CARDS: CardArray = [
  /* ------------------------------ Signature ------------------------------ */
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
    tags: ["Executives", "Families", "Business Owners", "Premium"],
    price: price(PRICING.elevatePremium),
  },
  {
    id: "transform",
    section: "signature",
    title: "Transform (6-Session Package)",
    desc: "Depth without overwhelm: we install a working system across cash-flow, credit hygiene, and tax set-asides.",
    bullets: ["End-to-end plan", "Clear guardrails", "Lender-ready documentation", "Written actions after each session"],
    timeline: "~12 weeks",
    tags: ["Executives", "Business Owners", "Families"],
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
    scope: "Planning & documentation; tax/legal execution with your professionals.",
    tags: ["Executives", "Business Owners", "Premium"],
    price: `From ${price(PRICING.bizOwnerExecPlan)}`,
  },
  {
    id: "team-workshop",
    section: "signature",
    title: "Financial Wellness Workshop (Private Team)",
    desc: "A focused 3-hour session: cash-flow cadence, lender-credible records, and a shared language for money at work.",
    bullets: ["Pre-survey + tailored agenda", "3-hour live workshop with Q&A", "Slide deck + resource bundle (EN/ES)", "Follow-up summary"],
    timeline: "3 hours (virtual or on-site)",
    scope: "Up to 20 participants. In-person adds travel. HST applies.",
    tags: ["Executives", "Business Owners", "Professionals", "Premium"],
    price: `From ${price(PRICING.workshopTeamVirtual)} (virtual) • ${price(PRICING.workshopTeamInPerson)} (in person)`,
  },

  /* ----------------------------- Foundations ----------------------------- */
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
    tags: ["Families", "Premium"],
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
    tags: ["Professionals", "Executives", "Premium"],
    price: price(PRICING.proTuneUp90),
  },

  /* ------------------------- Mortgage & Property ------------------------- */
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
    tags: ["Professionals", "Families", "Newcomers", "Premium"],
    price: price(PRICING.mortgagePreapproval),
    intent: "preapproval",
  },
  {
    id: "refi-renewal",
    section: "mortgage",
    title: "Refinance & Renewal Strategy",
    desc: "Clean math, clear trade-offs, and a short written plan.",
    bullets: ["Refi vs. renew modeling", "Penalty & rate break-even analysis", "Prepayment guardrails", "Written summary within 24h"],
    timeline: "60–90 minutes",
    tags: ["Professionals", "Families", "Executives"],
    price: price(PRICING.refiRenewal),
  },
  {
    id: "invest-4-10",
    section: "mortgage",
    title: "Investment Starter: 4–10 Units (DSCR)",
    desc: "Honest numbers and safer conditions for your first small building—clarity without drama.",
    bullets: ["GMR/OPEX/NOI/DSCR modeling", "Offer & condition playbook", "First-90-days plan", "Lender conversation prep"],
    timeline: "~2 hours + notes",
    scope: "Educational analysis; not investment advice or suitability assessment.",
    tags: ["Investors", "Business Owners", "Executives"],
    price: price(PRICING.invest4to10),
  },

  /* ---------------------- Business & Professionals ---------------------- */
  {
    id: "pay-yourself-clinic",
    section: "business",
    title: "Incorporation / Pay-Yourself Clinic",
    desc: "One clear conversation to map owner pay, payroll/dividends, and next steps with your accountant.",
    bullets: ["Owner pay matrix", "Payroll & remittance basics", "Dividend timing considerations", "1-page decision summary"],
    timeline: "60–75 minutes",
    tags: ["Business Owners", "Professionals"],
    price: price(PRICING.corpPayrollClinic),
  },

  /* -------------------------------- Workshops -------------------------------- */
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
    scope: "Open to professionals and families; limited seats for Q&A quality.",
    tags: ["Professionals", "Families"],
    price: `${price(PRICING.workshopPublicSeat)}/person`,
  },

  /* ------------------------- Legacy & Tax Strategy ------------------------ */
  {
    id: "tax-strategy",
    section: "legacy",
    title: "Personal / Family Tax Strategy Session",
    desc: "Set a quarterly rhythm and right-sized set-asides—predictable, compliant, and kind to your nervous system.",
    bullets: ["Quarterly schedule", "Right-sized set-asides", "Receipts & records checklist", "Calendar templates"],
    timeline: "75–90 minutes",
    tags: ["Families", "Professionals"],
    price: price(PRICING.taxSession),
  },
  {
    id: "legacy-annual",
    section: "legacy",
    title: "Legacy & Tax Rhythm (Annual)",
    desc: "Two key sessions + gentle check-ins so deadlines don’t sneak up.",
    bullets: ["Mid-year tune-up", "Pre-year-end planning", "Optional cadence prompts", "CPA coordination"],
    timeline: "Annual (2 sessions + touchpoints)",
    tags: ["Families", "Executives", "Professionals"],
    price: price(PRICING.taxAnnual),
  },
  {
    id: "smallbiz-setup",
    section: "legacy",
    title: "Small-Biz / Independent 90-Day Setup",
    desc: "Bring cash-flow, HST cycle, and owner pay into a system that scales—and that lenders recognize.",
    bullets: ["HST cadence", "Pay-yourself plan", "Owner reserves & buffers", "Documentation hygiene"],
    timeline: "~90 days",
    tags: ["Business Owners", "Professionals"],
    price: price(PRICING.taxSmallBiz90d),
  },

  /* ------------------------- Holistic Conversations ------------------------- */
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
    tags: ["Families", "Premium"],
    price: price(PRICING.ktCohort4w),
  },
  {
    id: "kt-monthly",
    section: "family",
    title: "Kitchen Table Conversations — Monthly Circle",
    desc: "A lighter touch to stay in motion: live Q&A, fresh resources, and a friendly place to ask for help.",
    bullets: ["Monthly live Q&A", "Resource drops", "Member space for questions"],
    timeline: "Month-to-month",
    tags: ["Families"],
    price: `${price(PRICING.ktMonthly)}/month`,
  },

  /* --------------------------------  Newcomers -------------------------------- */
  {
    id: "newcomer-30d",
    section: "newcomers",
    title: "Newcomer Wealth Integration (30 Days)",
    desc: "Gentle setup for banking, credit, and rent reporting—so your profile reads clearly to lenders.",
    bullets: ["Account & phone-plan map", "Secured card strategy & limits", "Rent-reporting options", "Credit hygiene routine"],
    timeline: "~30 days",
    scope: "Planning & education; you execute with chosen institutions.",
    tags: ["Newcomers"],
    price: price(PRICING.newcomerFastTrack),
  },

  /* -------------------------------- 1:1 -------------------------------- */
  {
    id: "discovery",
    section: "advice",
    title: "Private Discovery Call",
    desc: "A short, human conversation. Share your goal and timing; leave with 2–3 clear next steps.",
    bullets: ["2–3 next steps", "No documents yet", "Bilingual EN/ES"],
    timeline: "20–30 minutes",
    tags: ["Professionals", "Families", "Executives", "Newcomers"],
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
    tags: ["Professionals", "Business Owners", "Families"],
    price: price(PRICING.blueprint90),
  },
  {
    id: "align-3",
    section: "advice",
    title: "Align (3-Session Package)",
    desc: "Install gentle routines and momentum—without overwhelm.",
    bullets: ["Money rhythm & automation", "Tax set-asides that stick", "Light accountability"],
    timeline: "6–8 weeks",
    tags: ["Professionals", "Newcomers"],
    price: price(PRICING.align3),
  },
];

/* ============================= Page ============================= */
export default function ServicesPage() {
  const [filters, setFilters] = useState<string[]>([]);
  const sectionsWithCards = useMemo(() => {
    const filtered = filters.length ? CARDS.filter((c) => c.tags.some((t) => filters.includes(t))) : CARDS;
    const by = (section: SectionId) => filtered.filter((c) => c.section === section);
    return {
      signature: by("signature"),
      foundations: by("foundations"),
      mortgage: by("mortgage"),
      business: by("business"),
      workshops: by("workshops"),
      legacy: by("legacy"),
      family: by("family"),
      newcomers: by("newcomers"),
      advice: by("advice"),
    };
  }, [filters]);

  const { fade } = useMotionPresets();

  return (
    <main id="main" className="bg-white min-h-screen">
      {/* Brand band header */}
      <section className="bg-brand-green/5 border-b border-brand-gold/30">
        <div className="max-w-content mx-auto px-4 py-10">
          <nav className="mb-3 text-sm text-brand-blue/80" aria-label="Breadcrumb">
            <Link href="/en" className="hover:underline">Home</Link>
            <span className="mx-2" aria-hidden="true">/</span>
            <span className="text-brand-green" aria-current="page">Services</span>
          </nav>

          <Reveal variants={fade}>
            <h1 className="font-serif text-3xl md:text-4xl font-semibold tracking-tight text-brand-green">
              Professional services, delivered with care
            </h1>
          </Reveal>

          <Reveal variants={fade}>
            <p className="mt-2 max-w-3xl text-brand-blue/90">
              Calm, bilingual support for professionals, families, and business owners in the GTA. We blend precision with a steady
              pace—so decisions feel both clear and kind.
            </p>
          </Reveal>

          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              href="/en/contact?intent=consult&package=Private%20Discovery%20Call"
              className="inline-flex px-5 py-2.5 bg-brand-green text-white rounded-full font-semibold hover:bg-brand-gold hover:text-brand-green border border-brand-green/20 transition"
            >
              Book a Private Consultation
            </Link>
            <Link
              href="/en/resources#overview"
              className="inline-flex px-5 py-2.5 rounded-full border border-brand-blue/40 text-brand-blue hover:bg-brand-blue hover:text-white transition"
            >
              Explore Resources
            </Link>
          </div>
        </div>
      </section>

      {/* Sticky on-page nav */}
      <SectionNav />

      {/* Overview / Team umbrella */}
      <Panel>
        <SectionTitle
          id="overview"
          title="One coordinated approach"
          subtitle={
            <>
              Licensed mortgage agents, financial coaches, and trusted tax &amp; legal partners—aligned under a single plan. We bring
              cash-flow, credit, tax rhythm, and lending strategy together at a pace that respects your life. A light, optional Human
              Design lens can personalize communication and support without replacing financial, tax, or legal fundamentals.
            </>
          }
        />
        <Reveal variants={fade}>
          <ul className="grid md:grid-cols-3 gap-6 text-brand-blue/90">
            <li className={CARD}>
              <h3 className="font-serif text-xl text-brand-green font-bold">Precision</h3>
              <p className="mt-2">Clean math and lender-credible documentation. No guesswork, no drama.</p>
            </li>
            <li className={CARD}>
              <h3 className="font-serif text-xl text-brand-green font-bold">Coordination</h3>
              <p className="mt-2">We collaborate with your accountant and lawyer so the plan holds together.</p>
            </li>
            <li className={CARD}>
              <h3 className="font-serif text-xl text-brand-green font-bold">Human Pace</h3>
              <p className="mt-2">Steady progress—numbers plus nervous-system calm.</p>
            </li>
          </ul>
        </Reveal>
      </Panel>

      {/* Audience filters */}
      <FilterBar value={filters} onChange={setFilters} />

      {/* Signature Packages */}
      <Panel className="mt-8">
        <SectionTitle id="signature" title="Signature Packages" subtitle="Start here if you want coordinated, premium support" />
        <Grid cards={sectionsWithCards.signature} />
      </Panel>

      {/* Wealth Foundations */}
      <Panel className="mt-8">
        <SectionTitle id="foundations" title="Wealth Foundations" subtitle="High-impact starting points for clarity and momentum" />
        <Grid cards={sectionsWithCards.foundations} />
      </Panel>

      {/* Mortgage & Property Strategy */}
      <Panel className="mt-8">
        <SectionTitle id="mortgage" title="Mortgage & Property Strategy" subtitle="Confidence from pre-approval to closing—and beyond" />
        <Grid cards={sectionsWithCards.mortgage} />
      </Panel>

      {/* Business & Professionals */}
      <Panel className="mt-8">
        <SectionTitle id="business" title="Business & Professionals" subtitle="Executive-level clarity, lender-credible records" />
        <Grid cards={sectionsWithCards.business} />
      </Panel>

      {/* Workshops */}
      <Panel className="mt-8">
        <SectionTitle
          id="workshops"
          title="Workshops"
          subtitle="Practical, values-aligned learning—public cohorts and private team sessions"
        />
        <Grid cards={sectionsWithCards.workshops} />
      </Panel>

      {/* Legacy & Tax Strategy */}
      <Panel className="mt-8">
        <SectionTitle id="legacy" title="Legacy & Tax Strategy" subtitle="Predictable set-asides and a cadence you can keep" />
        <Grid cards={sectionsWithCards.legacy} />
      </Panel>

      {/* Holistic Conversations (Family & Groups) */}
      <Panel className="mt-8">
        <SectionTitle
          id="family"
          title="Holistic Conversations (Family & Groups)"
          subtitle="Intimate, practical, and human—safe spaces to practice money conversations"
        />
        <Grid cards={sectionsWithCards.family} />
      </Panel>

      {/* Newcomers */}
      <Panel className="mt-8">
        <SectionTitle id="newcomers" title="Newcomers" subtitle="Bilingual, step-by-step guidance from day one" />
        <Grid cards={sectionsWithCards.newcomers} />
      </Panel>

      {/* 1:1 Advisory */}
      <Panel className="mt-8">
        <SectionTitle id="advice" title="1:1 Advisory" subtitle="Private sessions with written next steps—no overwhelm" />
        <Grid cards={sectionsWithCards.advice} />
      </Panel>

      {/* How we work / compliance */}
      <Panel className="mt-8">
        <SectionTitle id="how" title="How we work" subtitle="Steady, human, and transparent" />
        <div className="grid md:grid-cols-3 gap-6">
          <div className={CARD}>
            <h3 className="font-serif text-xl text-brand-green font-bold">1) Discovery</h3>
            <p className="mt-2 text-brand-blue/90">
              A brief, kind conversation. If we’re a fit, you’ll get a short plan and a precise checklist—only what’s needed.
            </p>
          </div>
          <div className={CARD}>
            <h3 className="font-serif text-xl text-brand-green font-bold">2) Plan &amp; execution</h3>
            <p className="mt-2 text-brand-blue/90">
              We model scenarios, prepare documents, and coordinate steps at a manageable pace. You always know what’s next and why.
            </p>
          </div>
          <div className={CARD}>
            <h3 className="font-serif text-xl text-brand-green font-bold">3) Review &amp; adjust</h3>
            <p className="mt-2 text-brand-blue/90">
              We confirm outcomes against the plan, note any changes, and set your next check-in. Calm and repeatable.
            </p>
          </div>
        </div>
        <div className="mt-6 text-sm text-brand-blue/80 space-y-2">
          <p>
            <strong>Notes:</strong> Prices are in CAD and may be subject to HST. Mortgage services are typically free for qualified
            residential borrowers because compensation is paid by the lender on closing. Fees may apply in non-prime/private/commercial
            scenarios and will always be disclosed in advance. All mortgages are O.A.C. (on approved credit).
          </p>
          <p>
            Coaching and advice-only services are independent of mortgage compensation and do not replace legal, tax, or accounting
            advice. We coordinate with your chosen professionals as needed. Documents are collected via secure links. Bilingual support
            (EN/ES).
          </p>
          <p>
            For workshops: virtual sessions are available Canada-wide; in-person sessions may include travel time/expenses. Seat-based public
            cohorts have limited capacity to preserve Q&amp;A quality.
          </p>
          <p className="mb-0">
            Prefer Spanish? <Link href="/es/servicios" className="underline">Ver servicios en español</Link>.
          </p>
        </div>
      </Panel>
    </main>
  );
}

/* ============================ Grid renderer ============================ */
function Grid({ cards }: { cards: Card[] }) {
  const { stagger } = useMotionPresets();
  if (!cards.length) {
    return <p className="text-brand-blue/70">No services match the current filters.</p>;
    }
  return (
    <StaggerGroup className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {cards.map((c) => (
        <PackageCard key={c.id} c={c} />
      ))}
    </StaggerGroup>
  );
}
