"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  FaCalculator, FaHome, FaShieldAlt, FaGlobeAmericas, FaCheckCircle, FaClipboardList,
  FaFileExcel, FaFileCsv, FaPercent, FaBuilding, FaChartLine, FaBalanceScale,
  FaMoneyBillWave, FaPiggyBank, FaRobot, FaSignInAlt, FaPrint, FaListUl, FaThLarge
} from "react-icons/fa";

/* ============================ Motion helpers ============================ */
const easing: number[] = [0.22, 1, 0.36, 1];
function useAnims() {
  const prefersReduced = useReducedMotion();
  const fade = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: prefersReduced ? { duration: 0 } : { duration: 0.4, ease: easing },
    },
  };
  const fadeUp = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: prefersReduced ? { duration: 0 } : { duration: 0.45, ease: easing },
    },
  };
  const stagger = {
    hidden: {},
    visible: {
      transition: prefersReduced ? {} : { staggerChildren: 0.08, delayChildren: 0.04 },
    },
  };
  return { fade, fadeUp, stagger };
}

/* ============================== Shared UI ============================== */
function Panel({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <section
      className={[
        "max-w-content mx-auto px-5 sm:px-8 py-8 sm:py-12",
        "bg-white rounded-[28px] border border-brand-gold/60 shadow-sm",
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
  const { fade, fadeUp } = useAnims();
  const Tag = level as any;
  return (
    <div id={id} className="scroll-mt-24">
      <motion.div
        variants={fade}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        className="text-center mb-6"
      >
        <motion.div variants={fadeUp}>
          <Tag className="font-serif font-extrabold text-3xl md:text-4xl text-brand-green tracking-tight">
            {title}
          </Tag>
        </motion.div>
        <motion.div variants={fade} className="flex justify-center my-4" aria-hidden="true">
          <div className="w-16 h-[3px] rounded-full bg-brand-gold" />
        </motion.div>
        {subtitle && (
          <motion.p variants={fadeUp} className="text-brand-blue/90 text-lg md:text-xl max-w-3xl mx-auto">
            {subtitle}
          </motion.p>
        )}
      </motion.div>
    </div>
  );
}

function TagBadge({ children }: { children: ReactNode }) {
  return (
    <span className="text-xs px-2.5 py-1 rounded-full bg-white text-brand-green border border-brand-gold/40">
      {children}
    </span>
  );
}

const CARD =
  "rounded-3xl border border-brand-gold/60 bg-white shadow-sm hover:shadow-md hover:-translate-y-[1px] transition p-6 focus-within:ring-2 focus-within:ring-brand-gold";

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
  icon: JSX.Element;
  ctas?: CTA[];
  extra?: JSX.Element;  // e.g., XLSX/CSV buttons for worksheets
  tags?: string[];
};

/* ================================ Tools ================================ */
const ButtonPrimary =
  "px-5 py-2.5 bg-brand-green text-white rounded-full font-semibold hover:bg-brand-gold hover:text-brand-green border border-brand-green/20 transition";
const ButtonGhost =
  "inline-flex items-center gap-2 px-4 py-2 rounded-full border-2 border-brand-green text-brand-green hover:bg-brand-green hover:text-white transition";
const ButtonGhostGold =
  "inline-flex items-center gap-2 px-4 py-2 rounded-full border-2 border-brand-gold text-brand-gold hover:bg-brand-gold hover:text-brand-green transition";

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
  { id: "overview", label: "Overview" },
  { id: "homeownership", label: "Homeownership" },
  { id: "planning", label: "Planning" },
  { id: "investors", label: "Investors" },
  { id: "worksheets", label: "Worksheets" },
  { id: "utilities", label: "Utilities" },
  { id: "faq", label: "How to Use & FAQ" },
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
      { rootMargin: "-20% 0px -70% 0px", threshold: [0, 0.25, 0.5, 1] }
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
          >
            {s.label}
          </a>
        ))}
      </nav>
    </div>
  );
}

/* ============================== Cards / Grid ============================== */
function ToolCard({ t }: { t: ToolItem }) {
  const { fadeUp } = useAnims();
  return (
    <motion.article variants={fadeUp} className={CARD} aria-labelledby={`${t.id}-title`}>
      <div className="mb-3 flex items-center gap-4">
        <div className="w-14 h-14 rounded-full bg-brand-green/10 border flex items-center justify-center">
          {t.icon}
        </div>
        <h3 id={`${t.id}-title`} className="font-serif text-2xl text-brand-green font-bold m-0">
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
    </motion.article>
  );
}

function ToolsGrid({ items }: { items: ToolItem[] }) {
  const { stagger } = useAnims();
  if (!items.length) {
    return <p className="text-brand-blue/70">No tools match the current filters.</p>;
  }
  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      {items.map((t) => (
        <ToolCard key={t.id} t={t} />
      ))}
    </motion.div>
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

  const handlePrint = () => window.print();

  return (
    <main id="main" className="bg-white min-h-screen">
      {/* Brand band header */}
      <section className="bg-brand-green/5 border-b border-brand-gold/30">
        <div className="max-w-content mx-auto px-4 py-10">
          <nav className="mb-3 text-sm text-brand-blue/80" aria-label="Breadcrumb">
            <a href="/en" className="hover:underline">Home</a>
            <span className="mx-2">/</span>
            <span className="text-brand-green">Tools</span>
          </nav>
          <h1 className="font-serif text-3xl md:text-4xl font-semibold tracking-tight text-brand-green">
            Tools for your financial wellbeing
          </h1>
          <p className="mt-2 max-w-3xl text-brand-blue/90">
            Practical, bilingual calculators and worksheets—private, easy to use, and designed to help you make values-aligned decisions (no signup required).
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <Link
              href="/en/contact?intent=consult"
              className={ButtonPrimary}
              aria-label="Book a Private Consultation"
            >
              Book a Private Consultation
            </Link>
            <button
              onClick={() => setListMode((m) => (m === "grid" ? "list" : "grid"))}
              className="px-4 py-2 border-2 border-brand-green text-brand-green rounded-full hover:bg-brand-green hover:text-white transition inline-flex items-center gap-2"
              title={listMode === "grid" ? "Switch to list view" : "Switch to grid view"}
              type="button"
            >
              {listMode === "grid" ? <FaListUl aria-hidden /> : <FaThLarge aria-hidden />} {listMode === "grid" ? "List" : "Grid"}
            </button>
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-brand-blue text-white rounded-full inline-flex items-center gap-2 hover:bg-brand-gold hover:text-brand-green transition"
              title="Open print dialog (choose 'Save as PDF')"
              type="button"
            >
              <FaPrint aria-hidden /> Print / Save as PDF
            </button>
          </div>

          {/* Trust chips */}
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-brand-gold/40 text-brand-green">
              <FaShieldAlt className="text-brand-gold" aria-hidden /> Private
            </span>
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-brand-gold/40 text-brand-green">
              <FaCheckCircle className="text-brand-gold" aria-hidden /> Free
            </span>
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-brand-gold/40 text-brand-green">
              <FaGlobeAmericas className="text-brand-gold" aria-hidden /> Bilingual
            </span>
          </div>
        </div>
      </section>

      {/* Sticky on-page nav */}
      <SectionNav />

      {/* Overview: Search + Filters */}
      <Panel>
        <SectionTitle
          id="overview"
          title="Find the right tool fast"
          subtitle="Search by keyword, filter by type, or narrow to a category."
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
            <div className="text-sm text-brand-blue/70 self-center">
              Showing <b>{filtered.length}</b> of {TOOLS.length}
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
                      ? "border-brand-gold bg-brand-gold text-white"
                      : "border-brand-gold text-brand-green hover:bg-brand-gold hover:text-white",
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
                className="px-3 py-2 rounded-full border-2 border-brand-gold text-brand-green hover:bg-brand-gold hover:text-white transition text-sm"
              >
                Clear Categories
              </button>
            )}
          </div>
        </div>
      </Panel>

      {/* Homeownership */}
      <Panel className="mt-8">
        <SectionTitle id="homeownership" title="Homeownership" subtitle="Closing costs, down payment, insurance, and qualification" />
        {listMode === "grid" ? (
          <ToolsGrid items={grouped.homeownership} />
        ) : (
          <ListBlock items={grouped.homeownership} />
        )}
      </Panel>

      {/* Planning */}
      <Panel className="mt-8">
        <SectionTitle id="planning" title="Planning" subtitle="Payments, amortization, penalties, refinance, and rent vs buy" />
        {listMode === "grid" ? (
          <ToolsGrid items={grouped.planning} />
        ) : (
          <ListBlock items={grouped.planning} />
        )}
      </Panel>

      {/* Investors */}
      <Panel className="mt-8">
        <SectionTitle id="investors" title="Investors" subtitle="Cash flow, DSCR, and valuation helpers" />
        {listMode === "grid" ? (
          <ToolsGrid items={grouped.investors} />
        ) : (
          <ListBlock items={grouped.investors} />
        )}
      </Panel>

      {/* Worksheets */}
      <Panel className="mt-8">
        <SectionTitle id="worksheets" title="Worksheets" subtitle="Budgets, readiness checklists, and tax season prep" />
        {listMode === "grid" ? (
          <ToolsGrid items={grouped.worksheets} />
        ) : (
          <ListBlock items={grouped.worksheets} />
        )}
      </Panel>

      {/* Utilities */}
      <Panel className="mt-8">
        <SectionTitle id="utilities" title="Utilities" subtitle="Assistant and support tools" />
        {listMode === "grid" ? (
          <ToolsGrid items={grouped.utilities} />
        ) : (
          <ListBlock items={grouped.utilities} />
        )}
      </Panel>

      {/* How to Use & FAQ */}
      <Panel className="mt-8">
        <SectionTitle id="faq" title="How we use these tools" subtitle="Private, educational, and bilingual" />
        <div className="grid md:grid-cols-2 gap-6">
          <div className={CARD}>
            <h3 className="font-serif text-xl text-brand-green font-bold">What to expect</h3>
            <p className="mt-2 text-brand-blue/90">
              These tools run in your browser, no account required. Export files are saved locally by you.
            </p>
            <p className="mt-2 text-brand-blue/90">
              We can tailor a tool to your situation or guide you to the right one during a discovery call.
            </p>
          </div>
          <div className={CARD}>
            <h3 className="font-serif text-xl text-brand-green font-bold">Disclaimers</h3>
            <p className="mt-2 text-brand-blue/90">
              Educational tools only—<em>not</em> investment, legal, or tax advice. Mortgage rules reflect 2025 Canadian guidelines for stress-test, CMHC, and ON/Toronto LTT.
            </p>
            <p className="mt-2 text-brand-blue/90">Bilingual support (EN/ES). We can coordinate with your CPA and lawyer as needed.</p>
          </div>
        </div>

        <div className="mt-6 text-center">
          <Link href="/en/contact?intent=consult" className="inline-flex" aria-label="Book a discovery call">
            <span className="px-8 py-3 border-2 border-brand-gold text-brand-green font-serif font-bold rounded-full hover:bg-brand-gold hover:text-white transition focus:outline-none focus:ring-2 focus:ring-brand-gold">
              Book a Discovery Call
            </span>
          </Link>
          <div className="mt-4 flex items-center justify-center gap-3">
            <Link href="/en/client-portal" className="inline-flex" aria-label="Open client portal">
              <span className={ButtonGhost}>
                <FaSignInAlt aria-hidden /> Client Portal
              </span>
            </Link>
            <Link href="/en/contact?intent=question" className="text-sm text-brand-blue underline hover:text-brand-green">
              Or ask a quick question →
            </Link>
          </div>
        </div>
      </Panel>

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
                <h4 className="font-serif text-lg text-brand-green font-bold m-0">{t.title}</h4>
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
