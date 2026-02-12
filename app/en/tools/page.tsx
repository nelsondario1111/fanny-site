// app/en/tools/page.tsx
"use client";

import Link from "next/link";
import { useMemo, useState, type ReactNode } from "react";

// ✅ Hydration-safe motion primitives
import { Reveal, useMotionPresets } from "@/components/motion-safe";
import {
  CardGrid,
  ComparisonTable,
  ctaButtonClass,
  HubPanel as Panel,
  HubSectionTitle as SectionTitle,
  HubTagBadge as TagBadge,
  InfoCard,
  PageHero,
  StickySectionNav,
  HUB_CARD_CLASS,
} from "@/components/sections/hub";
import StartHereDecisionWidget from "@/components/StartHereDecisionWidget";
import StickyNextStepBar from "@/components/StickyNextStepBar";

import {
  FaCalculator, FaHome, FaClipboardList,
  FaFileExcel, FaFileCsv, FaPercent, FaBuilding, FaChartLine, FaBalanceScale,
  FaMoneyBillWave, FaPiggyBank, FaRobot, FaSignInAlt, FaListUl, FaThLarge
} from "react-icons/fa";

/* ============================== Shared UI ============================== */
const CARD = HUB_CARD_CLASS;

/* ============================== Data model ============================== */
type Category =
  | "Homeownership"
  | "Investors"
  | "Worksheets"
  | "Utilities"
  | "Planning";

type TypeKey = "calculator" | "worksheet" | "utility";
type CTA = { label: string; href: string; variant?: "primary" | "ghost" | "ghostGold" };

type ToolItem = {
  id: string;
  title: string;
  desc: string;
  href: string;         // destination page (under /en/tools/*)
  category: Category;   // domain grouping for browsing/sections
  type: TypeKey;        // functional type (filter)
  icon: ReactNode;
  ctas?: CTA[];
  extra?: ReactNode;
  tags?: string[];
};

/* ================================ Tools ================================ */
const ButtonPrimary =
  ctaButtonClass("primary");
const ButtonGhost =
  ctaButtonClass("secondary");
const ButtonGhostGold =
  ctaButtonClass("ghost");

const TOOLS: ToolItem[] = [
  // ---- Homeownership / Closing ----
  {
    id: "land-transfer-tax",
    title: "Land Transfer Tax (ON + Toronto)",
    desc: "Calculate Ontario LTT and Toronto MLTT, with first-time buyer rebates.",
    href: "/en/tools/land-transfer-tax",
    category: "Homeownership",
    type: "calculator",
    icon: <FaPercent className="text-brand-green text-2xl" aria-hidden />,
    ctas: [{ label: "Open Calculator", href: "/en/tools/land-transfer-tax", variant: "primary" }],
    tags: ["closing costs", "ontario", "toronto", "fthb"],
  },
  {
    id: "closing-costs",
    title: "Closing Costs Estimator",
    desc: "Legal, title, inspections, adjustments—and LTT/NRST options where applicable.",
    href: "/en/tools/closing-costs",
    category: "Homeownership",
    type: "calculator",
    icon: <FaPiggyBank className="text-brand-blue text-2xl" aria-hidden />,
    ctas: [{ label: "Open Calculator", href: "/en/tools/closing-costs", variant: "primary" }],
    tags: ["closing costs", "legal", "title", "nrst"],
  },
  {
    id: "down-payment-insurance",
    title: "Down Payment & CMHC Insurance",
    desc: "Minimum down payment, CMHC premium estimate, and insured eligibility.",
    href: "/en/tools/down-payment-insurance",
    category: "Homeownership",
    type: "calculator",
    icon: <FaMoneyBillWave className="text-brand-blue text-2xl" aria-hidden />,
    ctas: [{ label: "Open Calculator", href: "/en/tools/down-payment-insurance", variant: "primary" }],
    tags: ["down payment", "insurance", "cmhc"],
  },

  // ---- Qualification / Affordability ----
  {
    id: "affordability-stress-test",
    title: "Affordability & Stress Test",
    desc: "Check qualification using the federally-mandated stress-test rate.",
    href: "/en/tools/affordability-stress-test",
    category: "Homeownership",
    type: "calculator",
    icon: <FaBalanceScale className="text-brand-green text-2xl" aria-hidden />,
    ctas: [{ label: "Open Calculator", href: "/en/tools/affordability-stress-test", variant: "primary" }],
    tags: ["qualification", "mqr", "gds", "tds"],
  },
  {
    id: "mortgage-affordability",
    title: "Mortgage Affordability (Quick)",
    desc: "Fast affordability snapshot using your income, debts, and rate assumptions.",
    href: "/en/tools/mortgage-affordability",
    category: "Homeownership",
    type: "calculator",
    icon: <FaHome className="text-brand-blue text-2xl" aria-hidden />,
    ctas: [{ label: "Open Calculator", href: "/en/tools/mortgage-affordability", variant: "primary" }],
    tags: ["affordability", "pre-qual"],
  },

  // ---- Payments / Planning ----
  {
    id: "mortgage-calculator",
    title: "Mortgage Payment Calculator",
    desc: "Estimate payments across monthly, bi-weekly, and weekly schedules.",
    href: "/en/tools/mortgage-calculator",
    category: "Planning",
    type: "calculator",
    icon: <FaHome className="text-brand-blue text-2xl" aria-hidden />,
    ctas: [{ label: "Open Calculator", href: "/en/tools/mortgage-calculator", variant: "primary" }],
    tags: ["mortgage", "payment", "amortization"],
  },
  {
    id: "amortization-schedule",
    title: "Amortization Schedule & Extra Payments",
    desc: "Month-by-month breakdown and prepayment impact; export summary/schedule.",
    href: "/en/tools/amortization-schedule",
    category: "Planning",
    type: "calculator",
    icon: <FaChartLine className="text-brand-green text-2xl" aria-hidden />,
    ctas: [{ label: "Open Calculator", href: "/en/tools/amortization-schedule", variant: "primary" }],
    tags: ["amortization", "prepayment", "schedule", "csv"],
  },
  {
    id: "mortgage-penalty",
    title: "Mortgage Penalty Estimator",
    desc: "Rough IRD / 3-month interest estimate before you refinance or break a term.",
    href: "/en/tools/mortgage-penalty",
    category: "Planning",
    type: "calculator",
    icon: <FaMoneyBillWave className="text-brand-blue text-2xl" aria-hidden />,
    ctas: [{ label: "Open Calculator", href: "/en/tools/mortgage-penalty", variant: "primary" }],
    tags: ["penalty", "refinance"],
  },

  // ---- Refinance / Buy vs Rent ----
  {
    id: "refinance-blend",
    title: "Refinance & Blend Helper",
    desc: "Compare blend-and-extend vs. break-and-refinance scenarios.",
    href: "/en/tools/refinance-blend",
    category: "Planning",
    type: "calculator",
    icon: <FaBalanceScale className="text-brand-green text-2xl" aria-hidden />,
    ctas: [{ label: "Open Calculator", href: "/en/tools/refinance-blend", variant: "primary" }],
    tags: ["refinance", "blend"],
  },
  {
    id: "rent-vs-buy",
    title: "Rent vs Buy",
    desc: "Side-by-side total cost comparison with down payment, rate, and growth assumptions.",
    href: "/en/tools/rent-vs-buy",
    category: "Planning",
    type: "calculator",
    icon: <FaCalculator className="text-brand-gold text-2xl" aria-hidden />,
    ctas: [{ label: "Open Calculator", href: "/en/tools/rent-vs-buy", variant: "primary" }],
    tags: ["rent", "buy", "compare"],
  },

  // ---- Budget / Net Worth ----
  {
    id: "budget-calculator",
    title: "Holistic Budget Calculator",
    desc: "Build a budget that reflects your life, values, and strengths—simple and intuitive.",
    href: "/en/tools/budget-calculator",
    category: "Planning",
    type: "calculator",
    icon: <FaCalculator className="text-brand-gold text-2xl" aria-hidden />,
    ctas: [{ label: "Open Calculator", href: "/en/tools/budget-calculator", variant: "primary" }],
    tags: ["budget", "cash flow", "planning"],
  },
  {
    id: "net-worth-tracker",
    title: "Net Worth & Debt Paydown",
    desc: "Track net worth and plan payoff (Snowball or Avalanche) with clear timelines.",
    href: "/en/tools/net-worth-tracker",
    category: "Planning",
    type: "calculator",
    icon: <FaChartLine className="text-brand-green text-2xl" aria-hidden />,
    ctas: [
      { label: "Open Net Worth", href: "/en/tools/net-worth-tracker", variant: "primary" },
      { label: "Open Debt Paydown", href: "/en/tools/debt-snowball", variant: "ghost" },
    ],
    tags: ["net worth", "debt", "payoff"],
  },
  {
    id: "debt-snowball",
    title: "Debt Snowball / Avalanche",
    desc: "Prioritize debts your way—project payoff dates and momentum.",
    href: "/en/tools/debt-snowball",
    category: "Planning",
    type: "calculator",
    icon: <FaChartLine className="text-brand-blue text-2xl" aria-hidden />,
    ctas: [{ label: "Open Calculator", href: "/en/tools/debt-snowball", variant: "primary" }],
    tags: ["debt", "snowball", "avalanche"],
  },

  // ---- Investors ----
  {
    id: "rental-cashflow",
    title: "Rental Cash-Flow",
    desc: "Project income/expenses (vacancy, cap-ex, management) for hold decisions.",
    href: "/en/tools/rental-cashflow",
    category: "Investors",
    type: "calculator",
    icon: <FaBuilding className="text-brand-blue text-2xl" aria-hidden />,
    ctas: [{ label: "Open Calculator", href: "/en/tools/rental-cashflow", variant: "primary" }],
    tags: ["rental", "noi", "investor"],
  },
  {
    id: "dscr-calculator",
    title: "DSCR (Lender View)",
    desc: "Debt-service coverage ratio for 2–10 unit and small rental underwriting.",
    href: "/en/tools/dscr-calculator",
    category: "Investors",
    type: "calculator",
    icon: <FaBalanceScale className="text-brand-green text-2xl" aria-hidden />,
    ctas: [{ label: "Open Calculator", href: "/en/tools/dscr-calculator", variant: "primary" }],
    tags: ["dscr", "underwriting", "investor"],
  },
  {
    id: "cap-rate-calculator",
    title: "Cap Rate & CoC Return",
    desc: "Evaluate opportunities using cap rate and cash-on-cash benchmarks.",
    href: "/en/tools/cap-rate-calculator",
    category: "Investors",
    type: "calculator",
    icon: <FaChartLine className="text-brand-blue text-2xl" aria-hidden />,
    ctas: [{ label: "Open Calculator", href: "/en/tools/cap-rate-calculator", variant: "primary" }],
    tags: ["cap rate", "cash on cash"],
  },

  // ---- Worksheets ----
  {
    id: "worksheet-budget",
    title: "Budget & Cash-Flow",
    desc: "Track income and expenses, see net and savings rate. Export or print.",
    href: "/en/tools/budget-cashflow",
    category: "Worksheets",
    type: "worksheet",
    icon: <FaClipboardList className="text-brand-green text-2xl" aria-hidden />,
    ctas: [{ label: "Open Worksheet", href: "/en/tools/budget-cashflow", variant: "primary" }],
    extra: (
      <div className="flex flex-wrap gap-2 mt-3">
        <a href="/tools/Budget_Cashflow_Pro.xlsx" download className={ButtonGhost} aria-label="Download Budget & Cash-Flow XLSX">
          <FaFileExcel aria-hidden /> XLSX
        </a>
        <a href="/tools/Budget_Cashflow_Pro.csv" download className={ButtonGhostGold} aria-label="Download Budget & Cash-Flow CSV">
          <FaFileCsv aria-hidden /> CSV
        </a>
      </div>
    ),
    tags: ["worksheet", "csv", "xlsx"],
  },
  {
    id: "mortgage-readiness",
    title: "Mortgage Readiness",
    desc: "Step-by-step checklist for pre-approval: credit, documents, down payment.",
    href: "/en/tools/mortgage-readiness",
    category: "Worksheets",
    type: "worksheet",
    icon: <FaClipboardList className="text-brand-green text-2xl" aria-hidden />,
    ctas: [{ label: "Open Worksheet", href: "/en/tools/mortgage-readiness", variant: "primary" }],
    extra: (
      <div className="flex flex-wrap gap-2 mt-3">
        <a href="/tools/Mortgage_Readiness_Pro.xlsx" download className={ButtonGhost} aria-label="Download Mortgage Readiness XLSX">
          <FaFileExcel aria-hidden /> XLSX
        </a>
        <a href="/tools/Mortgage_Readiness_Pro.csv" download className={ButtonGhostGold} aria-label="Download Mortgage Readiness CSV">
          <FaFileCsv aria-hidden /> CSV
        </a>
      </div>
    ),
    tags: ["checklist", "pre-approval"],
  },
  {
    id: "tax-prep",
    title: "Tax Season Prep",
    desc: "A calm, complete list so filing is simple—not chaotic.",
    href: "/en/tools/tax-prep",
    category: "Worksheets",
    type: "worksheet",
    icon: <FaClipboardList className="text-brand-green text-2xl" aria-hidden />,
    ctas: [{ label: "Open Worksheet", href: "/en/tools/tax-prep", variant: "primary" }],
    extra: (
      <div className="flex flex-wrap gap-2 mt-3">
        <a href="/tools/Tax_Prep_Pro.xlsx" download className={ButtonGhost} aria-label="Download Tax Season Prep XLSX">
          <FaFileExcel aria-hidden /> XLSX
        </a>
        <a href="/tools/Tax_Prep_Pro.csv" download className={ButtonGhostGold} aria-label="Download Tax Season Prep CSV">
          <FaFileCsv aria-hidden /> CSV
        </a>
      </div>
    ),
    tags: ["checklist", "tax"],
  },
  // NEW checklists
  {
    id: "newcomer-checklist",
    title: "Newcomer Financial Toolkit",
    desc: "Banking, credit, CRA setup, health coverage, and first-mortgage steps for newcomers.",
    href: "/en/tools/newcomer-checklist",
    category: "Worksheets",
    type: "worksheet",
    icon: <FaClipboardList className="text-brand-green text-2xl" aria-hidden />,
    ctas: [{ label: "Open Checklist", href: "/en/tools/newcomer-checklist", variant: "primary" }],
    tags: ["newcomer", "checklist"],
  },
  {
    id: "self-employed-checklist",
    title: "Self-Employed Mortgage Toolkit",
    desc: "Docs and add-backs lenders expect: NOAs, statements, business financials, and more.",
    href: "/en/tools/self-employed-checklist",
    category: "Worksheets",
    type: "worksheet",
    icon: <FaClipboardList className="text-brand-green text-2xl" aria-hidden />,
    ctas: [{ label: "Open Checklist", href: "/en/tools/self-employed-checklist", variant: "primary" }],
    tags: ["self-employed", "checklist"],
  },
  {
    id: "multiplex-readiness",
    title: "Multiplex Readiness (4–10 Units)",
    desc: "Rent roll, operating statement, taxes/utilities, insurance, and underwriting basics.",
    href: "/en/tools/multiplex-readiness",
    category: "Worksheets",
    type: "worksheet",
    icon: <FaClipboardList className="text-brand-green text-2xl" aria-hidden />,
    ctas: [{ label: "Open Checklist", href: "/en/tools/multiplex-readiness", variant: "primary" }],
    tags: ["multiplex", "4-10 units", "checklist"],
  },

  // ---- Utilities ----
  {
    id: "assistant",
    title: "AI Assistant (Beta)",
    desc: "Ask questions about services, tools, or documents; get guided next steps.",
    href: "/en/tools/assistant",
    category: "Utilities",
    type: "utility",
    icon: <FaRobot className="text-brand-blue text-2xl" aria-hidden />,
    ctas: [{ label: "Open Tool", href: "/en/tools/assistant", variant: "primary" }],
    tags: ["ai", "assistant", "chat"],
  },
];

/* =============================== Filters =============================== */
const TYPES: { key: "all" | TypeKey; label: string }[] = [
  { key: "all", label: "All Types" },
  { key: "calculator", label: "Calculators" },
  { key: "worksheet", label: "Worksheets" },
  { key: "utility", label: "Utilities" },
];

const CATS: Category[] = ["Homeownership", "Investors", "Worksheets", "Utilities", "Planning"];

function matchesQuery(t: ToolItem, q: string) {
  if (!q) return true;
  const hay = (t.title + " " + t.desc + " " + (t.tags || []).join(" ")).toLowerCase();
  return hay.includes(q.toLowerCase());
}

/* ======================== On-page sticky section nav ======================== */
const SECTIONS = [
  { id: "start-here", label: "Start Here" },
  { id: "compare", label: "Tool Guide" },
  { id: "overview", label: "Overview" },
  { id: "homeownership", label: "Homeownership" },
  { id: "planning", label: "Planning" },
  { id: "investors", label: "Investors" },
  { id: "worksheets", label: "Worksheets" },
  { id: "utilities", label: "Utilities" },
  { id: "faq", label: "How to Use & FAQ" },
] as const;

/* ============================== Cards / Grid ============================== */
function ToolCard({ t }: { t: ToolItem }) {
  const { fadeUp } = useMotionPresets();
  return (
    <Reveal variants={fadeUp}>
      <article className={CARD} aria-labelledby={`${t.id}-title`}>
        <div className="mb-3 flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-brand-green/10 border flex items-center justify-center">
            {t.icon}
          </div>
          <h3 id={`${t.id}-title`} className="font-sans text-2xl text-brand-green font-semibold m-0">
            {t.title}
          </h3>
        </div>
        <p className="text-brand-blue/90">{t.desc}</p>

        {t.tags && t.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {t.tags.map((tag) => (
              <TagBadge key={tag}>{tag}</TagBadge>
            ))}
          </div>
        )}

        <div className="mt-5 flex flex-wrap gap-2">
          {(t.ctas || []).map((c, i) => {
            const cls =
              c.variant === "ghost"
                ? ButtonGhost
                : c.variant === "ghostGold"
                ? ButtonGhostGold
                : ButtonPrimary;
            return (
              <Link key={i} href={c.href} className={cls} aria-label={c.label}>
                {c.label}
              </Link>
            );
          })}
        </div>

        {t.extra}
      </article>
    </Reveal>
  );
}

function ToolsGrid({ items }: { items: ToolItem[] }) {
  if (!items.length) {
    return <p className="text-brand-blue/70">No tools match the current filters.</p>;
  }
  return (
    <CardGrid>
      {items.map((t) => (
        <ToolCard key={t.id} t={t} />
      ))}
    </CardGrid>
  );
}

/* ================================= Page ================================= */
export default function ToolsPage() {
  const [query, setQuery] = useState("");
  const [activeCats, setActiveCats] = useState<Category[]>([]);
  const [typeKey, setTypeKey] = useState<"all" | TypeKey>("all");
  const [listMode, setListMode] = useState<"grid" | "list">("grid");

  const filtered = useMemo(() => {
    return TOOLS
      .filter((t) => matchesQuery(t, query))
      .filter((t) => (typeKey === "all" ? true : t.type === typeKey))
      .filter((t) => (activeCats.length ? activeCats.includes(t.category) : true));
  }, [query, activeCats, typeKey]);

  const grouped = useMemo(() => {
    const by = (cat: Category) => filtered.filter((t) => t.category === cat);
    return {
      homeownership: by("Homeownership"),
      planning: by("Planning"),
      investors: by("Investors"),
      worksheets: by("Worksheets"),
      utilities: by("Utilities"),
    };
  }, [filtered]);

  const toggleCat = (c: Category) =>
    setActiveCats((prev) => (prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]));

  const startHereTools = useMemo(() => {
    const ids = [
      "mortgage-affordability",
      "closing-costs",
      "budget-calculator",
      "net-worth-tracker",
      "tax-prep",
      "mortgage-readiness",
    ];
    return ids
      .map((id) => TOOLS.find((tool) => tool.id === id))
      .filter((tool): tool is ToolItem => Boolean(tool));
  }, []);

  return (
    <main id="main" className="bg-brand-beige min-h-screen pb-24">
      <PageHero
        homeHref="/en"
        homeLabel="Home"
        currentLabel="Tools"
        title="Tools for Financial Clarity"
        subtitle="Practical bilingual calculators and worksheets to support clear, confident decisions."
        proofStats={[
          { value: "2 languages", label: "English + Spanish tools" },
          { value: "No account", label: "Most tools open instantly" },
          { value: "Action-ready", label: "Built for practical decisions" },
        ]}
        validation={{
          text: "These tools are educational and designed to support real-world decisions before your next advisory conversation.",
          ctaLabel: "Book discovery call",
          ctaHref: "/en/contact?intent=consult",
        }}
      />

      <StickySectionNav sections={SECTIONS} ariaLabel="On this page" defaultActive="start-here" />

      <div className="bg-brand-beige border-t border-brand-gold/20">
        <Panel>
          <StartHereDecisionWidget lang="en" />
        </Panel>
      </div>

      <div className="bg-brand-gold/5 border-t border-brand-gold/20">
        <Panel>
          <SectionTitle
            id="start-here"
            title="Start Here: Best Tools"
            subtitle="The fastest path for affordability, cash-flow, readiness, and tax prep."
            tint="gold"
          />
          <ToolsGrid items={startHereTools} />
        </Panel>
      </div>

      <div className="bg-brand-green/5 border-t border-brand-gold/20">
        <Panel>
          <SectionTitle
            id="compare"
            title="Tool Type Guide"
            subtitle="Use this quick table to choose the right format before you dive in."
            tint="green"
          />
          <ComparisonTable
            columns={["Best for", "Output", "Time to complete"]}
            rows={[
              {
                label: "Calculators",
                values: ["Scenario math and decisions", "Live numbers and assumptions", "2-8 minutes"],
              },
              {
                label: "Worksheets",
                values: ["Organizing documents and habits", "Downloadable files and checklists", "10-25 minutes"],
              },
              {
                label: "Utilities",
                values: ["Guided support and Q&A", "Recommendations and next steps", "3-10 minutes"],
              },
            ]}
            footnote="All tools are educational and can be paired with a private strategy conversation."
          />
        </Panel>
      </div>

      <div className="bg-brand-gold/5 border-t border-brand-gold/20">
        <Panel>
        <SectionTitle
          id="overview"
          title="Find the right tool fast"
          subtitle="Search by keyword, filter by type, or narrow to a category."
          tint="gold"
        />
        <div className="grid gap-4">
          {/* Search */}
          <div className="flex flex-col sm:flex-row items-stretch gap-3">
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder='Search tools (e.g., “mortgage”, “DSCR”, “tax”)'
              className="w-full rounded-full border border-brand-gold/60 bg-white px-5 py-3 focus:outline-none focus:ring-2 focus:ring-brand-gold"
              aria-label="Search tools"
            />
            <div className="flex items-center gap-2 self-center">
              <div className="text-sm text-brand-blue/70">
                Showing <b>{filtered.length}</b> of {TOOLS.length}
              </div>
              <button
                onClick={() => setListMode((m) => (m === "grid" ? "list" : "grid"))}
                className="px-3 py-2 border-2 border-brand-green text-brand-green rounded-full hover:bg-brand-green hover:text-white transition inline-flex items-center gap-2 text-sm"
                title={listMode === "grid" ? "Switch to list view" : "Switch to grid view"}
                type="button"
              >
                {listMode === "grid" ? <FaListUl aria-hidden /> : <FaThLarge aria-hidden />}{" "}
                {listMode === "grid" ? "List" : "Grid"}
              </button>
            </div>
          </div>

          {/* Type filter */}
          <div className="mt-2 flex flex-wrap gap-2">
            {TYPES.map((t) => (
              <button
                key={t.key}
                type="button"
                onClick={() => setTypeKey(t.key)}
                className={[
                  "px-4 py-2 rounded-full border-2 transition",
                  typeKey === t.key
                    ? "border-brand-blue bg-brand-blue text-white"
                    : "border-brand-green text-brand-green hover:bg-brand-green hover:text-white",
                ].join(" ")}
                aria-pressed={typeKey === t.key}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Category chips */}
          <div className="mt-1 flex flex-wrap gap-2">
            {CATS.map((c) => {
              const active = (activeCats || []).includes(c);
              return (
                <button
                  key={c}
                  type="button"
                  onClick={() => toggleCat(c)}
                  className={[
                    "px-3 py-2 rounded-full border-2 text-sm transition",
                    active
                      ? "border-brand-gold bg-brand-gold text-brand-green"
                      : "border-brand-gold text-brand-green hover:bg-brand-gold hover:text-brand-green",
                  ].join(" ")}
                  aria-pressed={active}
                  title={`Filter by ${c}`}
                >
                  {c}
                </button>
              );
            })}
            {activeCats.length > 0 && (
              <button
                type="button"
                onClick={() => setActiveCats([])}
                className="px-3 py-2 rounded-full border-2 border-brand-gold text-brand-green hover:bg-brand-gold hover:text-brand-green transition text-sm"
              >
                Clear Categories
              </button>
            )}
          </div>
        </div>
        </Panel>
      </div>

      {/* Homeownership */}
      <div className="bg-brand-green/5 border-t border-brand-gold/20">
        <Panel>
        <SectionTitle id="homeownership" title="Homeownership" subtitle="Closing costs, down payment, insurance, and qualification" tint="green" />
        {listMode === "grid" ? (
          <ToolsGrid items={grouped.homeownership} />
        ) : (
          <ListBlock items={grouped.homeownership} />
        )}
        </Panel>
      </div>

      {/* Planning */}
      <div className="bg-brand-gold/5 border-t border-brand-gold/20">
        <Panel>
        <SectionTitle id="planning" title="Planning" subtitle="Payments, amortization, penalties, refinance, and rent vs buy" tint="gold" />
        {listMode === "grid" ? (
          <ToolsGrid items={grouped.planning} />
        ) : (
          <ListBlock items={grouped.planning} />
        )}
        </Panel>
      </div>

      {/* Investors */}
      <div className="bg-brand-green/5 border-t border-brand-gold/20">
        <Panel>
        <SectionTitle id="investors" title="Investors" subtitle="Cash flow, DSCR, and valuation helpers" tint="green" />
        {listMode === "grid" ? (
          <ToolsGrid items={grouped.investors} />
        ) : (
          <ListBlock items={grouped.investors} />
        )}
        </Panel>
      </div>

      {/* Worksheets */}
      <div className="bg-brand-gold/5 border-t border-brand-gold/20">
        <Panel>
        <SectionTitle id="worksheets" title="Worksheets" subtitle="Budgets, readiness checklists, and tax season prep" tint="gold" />
        {listMode === "grid" ? (
          <ToolsGrid items={grouped.worksheets} />
        ) : (
          <ListBlock items={grouped.worksheets} />
        )}
        </Panel>
      </div>

      {/* Utilities */}
      <div className="bg-brand-green/5 border-t border-brand-gold/20">
        <Panel>
        <SectionTitle id="utilities" title="Utilities" subtitle="Assistant and support tools" tint="green" />
        {listMode === "grid" ? (
          <ToolsGrid items={grouped.utilities} />
        ) : (
          <ListBlock items={grouped.utilities} />
        )}
        </Panel>
      </div>

      {/* How to Use & FAQ */}
      <div className="bg-brand-gold/5 border-t border-brand-gold/20">
        <Panel>
        <SectionTitle id="faq" title="How we use these tools" subtitle="Private, educational, and bilingual" tint="gold" />
        <div className="grid md:grid-cols-2 gap-6">
          <InfoCard
            title="What to expect"
            description="These tools run in your browser, no account required. Export files are saved locally by you."
          >
            <p className="mt-2 text-brand-blue/90">
              We can tailor a tool to your situation or guide you to the right one during a discovery call.
            </p>
          </InfoCard>
          <InfoCard
            title="Disclaimers"
            description={
              <>
                Educational tools only-<em>not</em> investment, legal, or tax advice. Mortgage rules reflect 2025 Canadian guidelines for stress-test, CMHC, and ON/Toronto LTT.
              </>
            }
          >
            <p className="mt-2 text-brand-blue/90">
              Bilingual support (EN/ES). We can coordinate with your CPA and lawyer as needed.
            </p>
          </InfoCard>
        </div>

        <div className="mt-6 text-center">
          <Link href="/en/contact?intent=consult" className={ctaButtonClass("primary")} aria-label="Book a discovery call">
            Book a Discovery Call
          </Link>
          <div className="mt-4 flex items-center justify-center gap-3">
            <Link href="/en/client-library" className="inline-flex" aria-label="Open client library">
              <span className={ButtonGhost}>
                <FaSignInAlt aria-hidden /> Client Library
              </span>
            </Link>
            <Link href="/en/contact?intent=question" className="text-sm text-brand-blue underline hover:text-brand-green">
              Or ask a quick question →
            </Link>
          </div>
        </div>
        </Panel>
      </div>

      <StickyNextStepBar
        lang="en"
        checklistHref="/en/tools/newcomer-checklist"
        checklistLabel="Open newcomer checklist"
      />

      {/* Print styles */}
      <style jsx global>{`
        @media print {
          .print\\:hidden { display: none !important; }
          main { background: white !important; }
          section { break-inside: avoid; page-break-inside: avoid; }
          .${CARD.split(" ").join(".")} { box-shadow: none !important; }
        }
      `}</style>
    </main>
  );
}

/* ============================ List renderer ============================ */
function ListBlock({ items }: { items: ToolItem[] }) {
  if (!items.length) return <p className="text-brand-blue/70">No tools match the current filters.</p>;
  return (
    <div className="rounded-[28px] border border-brand-gold bg-white shadow-sm p-4 sm:p-6">
      <ul className="divide-y">
        {items.map((t) => (
          <li key={t.id} className="py-4 flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-brand-green/10 border flex items-center justify-center shrink-0">
              {t.icon}
            </div>
            <div className="grow">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h4 className="font-sans text-lg text-brand-green font-semibold m-0">{t.title}</h4>
                <span className="px-3 py-1 rounded-full text-xs border border-brand-gold text-brand-green">
                  {t.category} • {t.type}
                </span>
              </div>
              <p className="text-brand-blue/90 mt-1">{t.desc}</p>
              <div className="flex flex-wrap gap-2 mt-3">
                {(t.ctas || []).map((c, i) => {
                  const cls =
                    c.variant === "ghost"
                      ? ButtonGhost
                      : c.variant === "ghostGold"
                      ? ButtonGhostGold
                      : ButtonPrimary;
                  return (
                    <Link key={i} href={c.href} className={cls} aria-label={c.label}>
                      {c.label}
                    </Link>
                  );
                })}
                {t.extra}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
