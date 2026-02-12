import Link from "next/link";
import {
  CardGrid,
  HubPanel as Panel,
  HubSectionTitle as SectionTitle,
  OfferCard,
  PageHero,
  StickySectionNav,
} from "@/components/sections/hub";
import type { ServiceId } from "@/lib/services/details";

const PRICING = {
  discovery: 0,
  clarity60: 150,
  clarity90: 225,
  mapTier1: 2500,
  mapTier2: 3500,
  mapTier3: 5000,
  coachingFoundations: null,
  workshops: null,
  foundationsGroup: null,
  mortgagePreapproval: 0,
  businessCashflow: 395,
  taxCoordination: 395,
} as const;

function price(value: number | null) {
  if (value === null) return "Contact for pricing";
  if (value === 0) return "Free";
  return `$${value.toLocaleString()} CAD`;
}

type ServiceSection =
  | "start-here"
  | "strategic-maps"
  | "support"
  | "mortgage"
  | "business";

type Card = {
  id: ServiceId;
  section: ServiceSection;
  title: string;
  desc: string;
  bullets: string[];
  tags: string[];
  price: string;
  ctaLabel: "Book a Discovery Call" | "Book a Clarity & Direction Session" | "Explore Strategic Financial Maps";
  ctaHref: string;
};

function packageHref(title: string) {
  const qs = new URLSearchParams();
  qs.set("intent", "package");
  qs.set("package", title);
  return `/en/contact?${qs.toString()}`;
}

const CARDS: Card[] = [
  {
    id: "discovery",
    section: "start-here",
    title: "Free Discovery Call (15 min)",
    desc: "A short first conversation to understand your goals and identify your best next step.",
    bullets: [
      "Clarify priorities and timing",
      "Choose the right first service",
      "Leave with a clear action path",
    ],
    tags: ["Level 0", "Start Here", "Bilingual EN/ES"],
    price: price(PRICING.discovery),
    ctaLabel: "Book a Discovery Call",
    ctaHref: "/en/contact?intent=consult&package=Free%20Discovery%20Call%20(15%20min)",
  },
  {
    id: "clarity-60",
    section: "start-here",
    title: "Clarity & Direction Session (60 min)",
    desc: "Focused strategy support for one decision that needs structure and momentum.",
    bullets: [
      "Review options and tradeoffs",
      "Prioritize the next 2-3 actions",
      "Leave with practical written guidance",
    ],
    tags: ["Level 1", "Decision-Focused", "Advisory"],
    price: price(PRICING.clarity60),
    ctaLabel: "Book a Clarity & Direction Session",
    ctaHref: packageHref("Clarity & Direction Session (60 min)"),
  },
  {
    id: "clarity-90",
    section: "start-here",
    title: "Clarity & Direction Session - Extended (90 min)",
    desc: "Extended guidance for clients balancing multiple connected financial decisions.",
    bullets: [
      "Work through interdependent priorities",
      "Build a realistic implementation sequence",
      "Get a confidence-building strategy plan",
    ],
    tags: ["Level 1", "Decision-Focused", "Extended"],
    price: price(PRICING.clarity90),
    ctaLabel: "Book a Clarity & Direction Session",
    ctaHref: packageHref("Clarity & Direction Session - Extended (90 min)"),
  },
  {
    id: "map-tier-1",
    section: "strategic-maps",
    title: "Tier 1: Goal-Specific Strategic Map",
    desc: "Best for one high-priority goal that needs a clear strategy and execution path.",
    bullets: [
      "Define the target outcome",
      "Map milestones and sequence",
      "Set near-term implementation actions",
    ],
    tags: ["Tier 1", "Strategic Planning", "Focused Scope"],
    price: price(PRICING.mapTier1),
    ctaLabel: "Explore Strategic Financial Maps",
    ctaHref: packageHref("Tier 1: Goal-Specific Strategic Map"),
  },
  {
    id: "map-tier-2",
    section: "strategic-maps",
    title: "Tier 2: Integrated Strategic Map",
    desc: "Designed for clients managing multiple priorities that must work together.",
    bullets: [
      "Integrate decisions across priorities",
      "Align cash flow, timing, and capacity",
      "Reduce friction in implementation",
    ],
    tags: ["Tier 2", "Integrated", "Strategic Planning"],
    price: price(PRICING.mapTier2),
    ctaLabel: "Explore Strategic Financial Maps",
    ctaHref: packageHref("Tier 2: Integrated Strategic Map"),
  },
  {
    id: "map-tier-3",
    section: "strategic-maps",
    title: "Tier 3: Holistic Life & Financial Strategic Map",
    desc: "Comprehensive planning for major life, business, and long-term financial transitions.",
    bullets: [
      "Unify personal and financial priorities",
      "Coordinate expert collaboration",
      "Install a long-range implementation roadmap",
    ],
    tags: ["Tier 3", "Holistic", "Premium Advisory"],
    price: price(PRICING.mapTier3),
    ctaLabel: "Explore Strategic Financial Maps",
    ctaHref: packageHref("Tier 3: Holistic Life & Financial Strategic Map"),
  },
  {
    id: "support-coaching",
    section: "support",
    title: "Coaching & Foundations",
    desc: "Supplementary coaching to support execution, accountability, and consistency.",
    bullets: [
      "Private implementation check-ins",
      "Progress tracking and adjustment",
      "Decision support between milestones",
    ],
    tags: ["Supplementary", "Coaching", "Foundations"],
    price: price(PRICING.coachingFoundations),
    ctaLabel: "Book a Discovery Call",
    ctaHref: packageHref("Coaching & Foundations"),
  },
  {
    id: "support-workshops",
    section: "support",
    title: "Workshops",
    desc: "Structured group learning for families, professionals, and newcomers.",
    bullets: [
      "Practical education format",
      "Templates and planning tools",
      "Actionable next steps from each session",
    ],
    tags: ["Supplementary", "Group", "Education"],
    price: price(PRICING.workshops),
    ctaLabel: "Book a Discovery Call",
    ctaHref: packageHref("Workshops"),
  },
  {
    id: "support-foundations-group",
    section: "support",
    title: "Foundations & Small Group Programs",
    desc: "Guided small-group support that reinforces strategy with steady implementation.",
    bullets: [
      "Small group accountability",
      "Practical routines for momentum",
      "Supportive peer learning environment",
    ],
    tags: ["Supplementary", "Small Group", "Implementation"],
    price: price(PRICING.foundationsGroup),
    ctaLabel: "Book a Discovery Call",
    ctaHref: packageHref("Foundations & Small Group Programs"),
  },
  {
    id: "mortgage-preapproval",
    section: "mortgage",
    title: "Pre-Approval Planning",
    desc: "Build a strong readiness path before you submit your mortgage application.",
    bullets: [
      "Assess affordability and documentation",
      "Clarify lender-fit scenarios",
      "Map timing with confidence",
    ],
    tags: ["Mortgage", "Start Here", "Readiness"],
    price: price(PRICING.mortgagePreapproval),
    ctaLabel: "Book a Discovery Call",
    ctaHref: packageHref("Pre-Approval Planning"),
  },
  {
    id: "business-cashflow",
    section: "business",
    title: "Business Strategy & Cash Flow Session",
    desc: "Decision support for business owners balancing growth, stability, and personal goals.",
    bullets: [
      "Review cash flow pressure points",
      "Prioritize strategic decisions",
      "Set practical next milestones",
    ],
    tags: ["Business", "Strategy", "Cash Flow"],
    price: price(PRICING.businessCashflow),
    ctaLabel: "Book a Discovery Call",
    ctaHref: packageHref("Business Strategy & Cash Flow Session"),
  },
  {
    id: "business-tax",
    section: "business",
    title: "Tax Planning Coordination Session",
    desc: "Prepare strategy questions and planning priorities before tax decisions are finalized.",
    bullets: [
      "Clarify priorities for your advisor team",
      "Sequence filing and planning steps",
      "Reduce last-minute decision stress",
    ],
    tags: ["Tax", "Coordination", "Planning"],
    price: price(PRICING.taxCoordination),
    ctaLabel: "Book a Discovery Call",
    ctaHref: packageHref("Tax Planning Coordination Session"),
  },
];

const SECTIONS = [
  { id: "start-here", label: "Start Here" },
  { id: "strategic-maps", label: "Strategic Financial Maps" },
  { id: "support", label: "Supplementary Support" },
  { id: "kitchen-table", label: "Kitchen Table Conversations" },
  { id: "mortgage", label: "Mortgage Strategy" },
  { id: "business", label: "Business & Tax" },
] as const;

function PackageCard({ c }: { c: Card }) {
  return (
    <OfferCard
      id={c.id}
      title={c.title}
      description={c.desc}
      bullets={c.bullets.slice(0, 3)}
      price={c.price}
      tags={c.tags}
      cta={{
        label: c.ctaLabel,
        href: c.ctaHref,
      }}
      more={{
        label: "See service details",
        href: `/en/services/${c.id}`,
      }}
    />
  );
}

export default function ServicesPage() {
  const by = (section: ServiceSection) => CARDS.filter((card) => card.section === section);
  const sectionsWithCards = {
    startHere: by("start-here"),
    strategicMaps: by("strategic-maps"),
    support: by("support"),
    mortgage: by("mortgage"),
    business: by("business"),
  };

  return (
    <main id="main" className="bg-white min-h-screen">
      <PageHero
        homeHref="/en"
        homeLabel="Home"
        currentLabel="Services"
        title="Clarity & Direction for Your Financial Life - with Human-Centered Strategy"
        subtitle="Start with a free discovery call and choose the advisory support that fits your goals - from clarity sessions to strategic planning and holistic financial maps."
        primaryCta={{
          label: "Book a Free Discovery Call",
          href: "/en/contact?intent=consult&package=Free%20Discovery%20Call%20(15%20min)",
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

      <div className="bg-brand-gold/5 border-t border-brand-gold/20">
        <Panel>
          <SectionTitle
            id="start-here"
            title="Decision-Focused Strategy Work"
            subtitle="These are your core services for clients who are ready to take action."
            tint="gold"
          />
          <Grid cards={sectionsWithCards.startHere} />
        </Panel>
      </div>

      <div className="bg-brand-green/5 border-t border-brand-gold/20">
        <Panel>
          <SectionTitle
            id="strategic-maps"
            title="Strategic Financial Maps - Goal-Focused Advisory"
            subtitle="Move from clarity to deeper planning with tiered strategic support."
            tint="green"
          />
          <Grid cards={sectionsWithCards.strategicMaps} />
          <p className="mt-6 rounded-2xl border border-brand-gold/40 bg-white/95 p-4 text-sm text-brand-blue/90">
            If you begin with a Clarity & Direction Session and proceed with a Strategic Financial
            Map within 30 days, your session fee may be credited toward the full engagement.
          </p>
        </Panel>
      </div>

      <div className="bg-brand-gold/5 border-t border-brand-gold/20">
        <Panel>
          <SectionTitle
            id="support"
            title="Supplementary Support - Coaching & Workshops"
            subtitle="Supportive programs that reinforce your core strategy work."
            tint="gold"
          />
          <Grid cards={sectionsWithCards.support} />
        </Panel>
      </div>

      <div className="bg-brand-green/5 border-t border-brand-gold/20">
        <Panel>
          <SectionTitle
            id="kitchen-table"
            title="Kitchen Table Conversations"
            subtitle="4-week small-group support for families, newcomers, and first-time buyers."
            tint="green"
          />
          <article className="rounded-3xl border border-brand-gold/40 bg-white/95 p-6 md:p-8 shadow-sm">
            <p className="text-brand-blue/90 leading-relaxed">
              This cohort-style program gives you practical financial clarity in a warm,
              guided group setting. Each week focuses on real-life decisions so you leave
              with simple next steps you can actually follow.
            </p>
            <ul className="mt-4 list-disc pl-5 space-y-1 text-brand-blue/90">
              <li>Small groups with real-time Q&A and shared learning</li>
              <li>4 weekly sessions (45-60 min) with action-focused takeaways</li>
              <li>Support for mortgage, cash-flow, and tax-related planning questions</li>
            </ul>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link
                href="/en/kitchen-table-conversations"
                className="inline-flex items-center justify-center px-5 py-2.5 rounded-full border border-brand-blue/40 text-brand-blue hover:bg-brand-blue hover:text-white transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue/40"
              >
                View Program Details
              </Link>
              <Link
                href={packageHref("Kitchen Table Conversations — 4-Week Cohort")}
                className="inline-flex items-center justify-center px-5 py-2.5 bg-brand-green text-white rounded-full font-semibold hover:bg-brand-gold hover:text-brand-green border border-brand-green/20 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold"
              >
                Join the 4-Week Cohort
              </Link>
            </div>
          </article>
        </Panel>
      </div>

      <div className="bg-gradient-to-b from-brand-green/10 to-white border-y border-brand-gold/20">
        <Panel className="bg-white/90">
          <SectionTitle
            id="mortgage"
            title="Mortgage Strategy - Pre-Approval Readiness with Practical Confidence"
            subtitle="A focused mortgage track for buyers preparing strong, lender-ready files."
            tint="green"
          />
          <Grid cards={sectionsWithCards.mortgage} />
        </Panel>
      </div>

      <div className="bg-brand-gold/5 border-t border-brand-gold/20">
        <Panel>
          <SectionTitle
            id="business"
            title="Business, Tax & Specialty Sessions"
            subtitle="Focused advisory support for business planning and tax-related decisions."
            tint="gold"
          />
          <Grid cards={sectionsWithCards.business} />
        </Panel>
      </div>

      <div className="bg-brand-green/5 border-t border-brand-gold/20">
        <Panel>
          <SectionTitle
            id="next-step"
            title="Ready for Your Next Step?"
            subtitle="Choose the first action that fits your current priorities."
            tint="green"
          />
          <div className="flex flex-wrap gap-3 justify-center">
            <Link
              href="/en/contact?intent=consult&package=Free%20Discovery%20Call%20(15%20min)"
              className="inline-flex items-center justify-center px-5 py-2.5 bg-brand-green text-white rounded-full font-semibold hover:bg-brand-gold hover:text-brand-green border border-brand-green/20 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold"
            >
              Book a Discovery Call
            </Link>
            <Link
              href={packageHref("Clarity & Direction Session (60 min)")}
              className="inline-flex items-center justify-center px-5 py-2.5 rounded-full border border-brand-blue/40 text-brand-blue hover:bg-brand-blue hover:text-white transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue/40"
            >
              Book a Clarity & Direction Session
            </Link>
            <Link
              href="#strategic-maps"
              className="inline-flex items-center justify-center px-5 py-2.5 rounded-full border border-brand-gold/40 text-brand-green hover:bg-brand-gold hover:text-white transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold"
            >
              Explore Strategic Financial Maps
            </Link>
          </div>
        </Panel>
      </div>
    </main>
  );
}

function Grid({ cards }: { cards: Card[] }) {
  if (!cards.length) {
    return <p className="text-brand-blue/70">No services available.</p>;
  }

  return (
    <CardGrid>
      {cards.map((card) => (
        <PackageCard key={card.id} c={card} />
      ))}
    </CardGrid>
  );
}
