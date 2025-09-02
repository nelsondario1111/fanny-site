"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import ToolShell from "@/components/ToolShell";
import {
  Trash2,
  PlusCircle,
  CheckCircle2,
  CalendarDays,
  ExternalLink,
  Download,
  RotateCcw,
  Printer,
  Building2,
  Calculator,
  FileText,
  ClipboardCheck,
  DollarSign,
  Info,
  Search,
} from "lucide-react";

/**
 * Multiplex Readiness Checklist
 * - Sections with tasks, due dates, notes, custom items
 * - Autosave (localStorage) + "Saved" indicator
 * - CSV export, Print, Reset
 * - Mobile: stacked cards; Desktop: clean tables
 * - Built-in Deal Analyzer (NOI, Cap Rate, DSCR, Cash-on-Cash) with autosave
 *
 * Educational only. Lender/insurer/municipal rules vary; verify specifics.
 */

// ---------- Types ----------
type SectionKey =
  | "strategy"
  | "financing"
  | "financials"
  | "due_diligence"
  | "legal_compliance"
  | "renovations_capex"
  | "operations_pm"
  | "insurance_risk"
  | "closing_transition"
  | "after_close"
  | "custom";

type Task = {
  id: string;
  section: SectionKey;
  title: string;
  note?: string;
  done: boolean;
  due?: string; // YYYY-MM-DD
  linkHref?: string; // prefer internal routes
  linkLabel?: string;
  isCustom?: boolean;
  priority?: "high" | "normal";
};

// Analyzer
type Analyzer = {
  // Purchase & finance
  price: string;           // $
  downPct: string;         // %
  ratePct: string;         // % annual
  amortYears: string;      // years
  closingPct: string;      // % of price for closing
  // Income
  units: string;           // count
  avgRent: string;         // $/mo
  otherIncomeMo: string;   // $/mo (parking, laundry, storage)
  vacancyPct: string;      // %
  // Expenses
  opExAnnual: string;      // $/yr (taxes, insurance, utilities, repairs, etc.)
  mgmtPct: string;         // % of EGI
  capexPct: string;        // % of EGI (reserve)
};

type AnalyzerMetrics = {
  gpiAnnual: number;
  egiAnnual: number;
  opExAnnualTotal: number;
  noi: number;
  annualDebtService: number;
  capRate: number; // %
  dscr: number;
  coc: number; // %
  cfBeforeTax: number;
  breakEvenVacancyPct: number; // %
};

// ---------- Storage ----------
const LS_TASKS = "tools.multiplex_readiness.v1";
const LS_ANALYZER = "tools.multiplex_readiness.analyzer.v1";

// ---------- Helpers ----------
const uid = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

function classNames(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

const money0 = (n: number) =>
  new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
    maximumFractionDigits: 0,
  }).format(Math.round(n));

const pct1 = (x: number) => `${(Number.isFinite(x) ? x : 0).toFixed(1)}%`;

const toNum = (s: string | undefined) => {
  if (!s) return 0;
  const cleaned = String(s).replace(/[^\d.-]/g, "");
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : 0;
};

function pmt(monthlyRate: number, nMonths: number, principal: number) {
  if (nMonths <= 0) return 0;
  if (monthlyRate <= 0) return principal / nMonths;
  const r = monthlyRate;
  const pow = Math.pow(1 + r, -nMonths);
  return (r * principal) / (1 - pow);
}

// ---------- Section metadata ----------
const SECTION_META: Record<
  SectionKey,
  { title: string; blurb?: string; tone: "emerald" | "amber" | "sky" | "blue" | "gold" }
> = {
  strategy: {
    title: "Acquisition strategy",
    blurb: "Define target (2–4 units+), location, condition, and hold/BRRRR plan.",
    tone: "gold",
  },
  financing: {
    title: "Financing & lender requirements",
    blurb: "Pre-approval, DSCR expectations, and documentation.",
    tone: "emerald",
  },
  financials: {
    title: "Property financials",
    blurb: "Underwrite with actuals & pro forma: NOI, Cap Rate, DSCR, CoC.",
    tone: "sky",
  },
  due_diligence: {
    title: "Due diligence",
    blurb: "Inspections, environmental, zoning, parking, fire & life safety.",
    tone: "blue",
  },
  legal_compliance: {
    title: "Legal & compliance",
    blurb: "Leases, LTB/RTB rules, rent control, suite legality & permits.",
    tone: "amber",
  },
  renovations_capex: {
    title: "Renovations & CAPEX plan",
    blurb: "Scope, budget, timelines, vacancy planning, contractor vetting.",
    tone: "blue",
  },
  operations_pm: {
    title: "Operations & property management",
    blurb: "Systems for leasing, screening, maintenance, bookkeeping.",
    tone: "emerald",
  },
  insurance_risk: {
    title: "Insurance & risk",
    blurb: "Coverage, liability, flood/fire, deductibles, and risk mitigation.",
    tone: "sky",
  },
  closing_transition: {
    title: "Closing & transition",
    blurb: "Estoppel, key handover, utility transfers, rent roll verification.",
    tone: "gold",
  },
  after_close: {
    title: "After closing",
    blurb: "Stabilization, rent reviews, refinances, and reporting cadence.",
    tone: "amber",
  },
  custom: {
    title: "Your custom tasks",
    blurb: "Add anything unique to your deal.",
    tone: "emerald",
  },
};

const toneToText: Record<string, string> = {
  emerald: "text-emerald-700",
  amber: "text-amber-700",
  sky: "text-sky-700",
  blue: "text-blue-700",
  gold: "text-amber-700",
};

// ---------- Defaults ----------
function defaultTasks(): Task[] {
  return [
    // STRATEGY
    {
      id: uid(),
      section: "strategy",
      title: "Clarify criteria: unit count, location, budget, condition, yield target",
      done: false,
      priority: "high",
    },
    {
      id: uid(),
      section: "strategy",
      title: "Define operating model (self-manage vs. property manager)",
      done: false,
    },
    {
      id: uid(),
      section: "strategy",
      title: "Run scenarios in Deal Analyzer (actuals vs. pro forma)",
      done: false,
      linkHref: "#deal-analyzer",
      linkLabel: "Open analyzer",
    },

    // FINANCING
    {
      id: uid(),
      section: "financing",
      title: "Get pre-approval (rate hold) and confirm DSCR/NOI documentation",
      done: false,
      linkHref: "/en/services/financial-planning",
      linkLabel: "Planning session",
      priority: "high",
    },
    {
      id: uid(),
      section: "financing",
      title: "Confirm DSCR rules and stress-rate used by lender",
      done: false,
      linkHref: "/en/guides/dscr-rules",
      linkLabel: "Confirm DSCR Rules",
    },
    {
      id: uid(),
      section: "financing",
      title: "If self-employed, prepare 2 yrs T1/NOA or corporate package",
      done: false,
      linkHref: "/en/tools/self-employed-checklist",
      linkLabel: "Self-Employed Toolkit",
    },

    // FINANCIALS
    {
      id: uid(),
      section: "financials",
      title: "Collect rent roll, leases, and any arrears/history",
      done: false,
      priority: "high",
    },
    {
      id: uid(),
      section: "financials",
      title: "Get last 12–24 months utility/tax/insurance/maintenance statements",
      done: false,
    },
    {
      id: uid(),
      section: "financials",
      title: "Build year-1 budget (vacancy, mgmt, capex reserve) and compute NOI/DSCR",
      done: false,
      linkHref: "#deal-analyzer",
      linkLabel: "Use analyzer",
    },

    // DUE DILIGENCE
    {
      id: uid(),
      section: "due_diligence",
      title: "Home inspection + specialist quotes (roof, foundation, plumbing, electrical)",
      done: false,
      priority: "high",
    },
    {
      id: uid(),
      section: "due_diligence",
      title: "Fire code: alarms, separations, exits; verify legal unit count",
      done: false,
    },
    {
      id: uid(),
      section: "due_diligence",
      title: "Zoning/by-law search, parking, and any open permits/orders",
      done: false,
    },

    // LEGAL & COMPLIANCE
    {
      id: uid(),
      section: "legal_compliance",
      title: "Review leases & addendums; confirm deposits, rent increases and LTB/RTB status",
      done: false,
      priority: "high",
    },
    {
      id: uid(),
      section: "legal_compliance",
      title: "Check rent control rules and turnover restrictions for the property",
      done: false,
    },
    {
      id: uid(),
      section: "legal_compliance",
      title: "Confirm suite legality / occupancy certificates (if required)",
      done: false,
    },

    // RENOS & CAPEX
    {
      id: uid(),
      section: "renovations_capex",
      title: "Create CAPEX plan (roof, windows, HVAC) with priority & cost ranges",
      done: false,
    },
    {
      id: uid(),
      section: "renovations_capex",
      title: "Get 2–3 contractor quotes and timeline impacts on vacancy",
      done: false,
    },

    // OPERATIONS
    {
      id: uid(),
      section: "operations_pm",
      title: "Set PM systems: rent collection, maintenance, screening",
      done: false,
    },
    {
      id: uid(),
      section: "operations_pm",
      title: "Bookkeeping stack: separate bank/credit card, chart of accounts",
      done: false,
    },

    // INSURANCE & RISK
    {
      id: uid(),
      section: "insurance_risk",
      title: "Get landlord policy quotes (building, liability, loss of rent)",
      done: false,
      priority: "high",
    },
    {
      id: uid(),
      section: "insurance_risk",
      title: "Request insurer’s inspection requirements (handrails, detectors, etc.)",
      done: false,
    },

    // CLOSING & TRANSITION
    {
      id: uid(),
      section: "closing_transition",
      title: "Lawyer engaged; confirm title search, estoppel/tenant ack, key list",
      done: false,
      priority: "high",
    },
    {
      id: uid(),
      section: "closing_transition",
      title: "Set utility transfers and pro-ration of rents/taxes",
      done: false,
    },

    // AFTER CLOSE
    {
      id: uid(),
      section: "after_close",
      title: "Stabilize operations; update rents in system; set inspection cadence",
      done: false,
    },
    {
      id: uid(),
      section: "after_close",
      title: "Track performance monthly; consider refinance when appropriate",
      done: false,
    },
  ];
}

// ---------- Small UI helpers ----------
function SavedIndicator({ savedAt }: { savedAt: number | null }) {
  if (!savedAt) return null;
  const sec = Math.max(0, Math.round((Date.now() - savedAt) / 1000));
  const text = sec < 3 ? "Saved just now" : sec < 60 ? `Saved ${sec}s ago` : "Saved";
  return (
    <span className="inline-flex items-center gap-1 text-emerald-700 text-xs md:text-sm" role="status" aria-live="polite">
      <CheckCircle2 className="h-4 w-4" />
      {text}
    </span>
  );
}

function ProgressBar({ value, total }: { value: number; total: number }) {
  const pct = total > 0 ? Math.round((value / total) * 100) : 0;
  return (
    <div className="flex items-center gap-2">
      <div className="h-2 w-28 bg-brand-beige rounded-full overflow-hidden">
        <div className="h-2 bg-brand-green" style={{ width: `${pct}%`, transition: "width .3s ease" }} />
      </div>
      <span className="text-xs text-brand-blue/70">{pct}%</span>
    </div>
  );
}

// ---------- Deal Analyzer Card ----------
const DEFAULT_ANALYZER: Analyzer = {
  price: "",
  downPct: "20",
  ratePct: "5.5",
  amortYears: "30",
  closingPct: "3",

  units: "3",
  avgRent: "",
  otherIncomeMo: "0",
  vacancyPct: "4",

  opExAnnual: "",
  mgmtPct: "6",
  capexPct: "5",
};

function DealAnalyzerCard({
  model,
  setModel,
}: {
  model: Analyzer;
  setModel: (next: Analyzer) => void;
}) {
  const price = toNum(model.price);
  const downPct = toNum(model.downPct) / 100;
  const ratePct = toNum(model.ratePct) / 100;
  const amortYears = Math.max(0, toNum(model.amortYears));
  const closingPct = toNum(model.closingPct) / 100;

  const units = Math.max(0, toNum(model.units));
  const avgRent = toNum(model.avgRent);
  const otherIncomeMo = toNum(model.otherIncomeMo);
  const vacancyPct = toNum(model.vacancyPct) / 100;

  const opExAnnualBase = toNum(model.opExAnnual);
  const mgmtPct = toNum(model.mgmtPct) / 100;
  const capexPct = toNum(model.capexPct) / 100;

  // Income
  const gpiMonthly = units * avgRent + otherIncomeMo;
  const gpiAnnual = gpiMonthly * 12;
  const egiAnnual = gpiAnnual * (1 - vacancyPct);

  // Expenses
  const varExpenses = (mgmtPct + capexPct) * egiAnnual;
  const opExAnnualTotal = opExAnnualBase + varExpenses;

  // NOI
  const noi = Math.max(0, egiAnnual - opExAnnualTotal);

  // Financing
  const loanAmount = Math.max(0, price * (1 - downPct));
  const nMonths = Math.round(amortYears * 12);
  const mRate = ratePct / 12;
  const monthlyDebt = pmt(mRate, nMonths, loanAmount);
  const annualDebtService = monthlyDebt * 12;

  // Metrics
  const capRate = price > 0 ? (noi / price) * 100 : 0;
  const dscr = annualDebtService > 0 ? noi / annualDebtService : 0;

  const cashInvested = price * downPct + price * closingPct;
  const cfBeforeTax = noi - annualDebtService;
  const coc = cashInvested > 0 ? (cfBeforeTax / cashInvested) * 100 : 0;

  const breakEvenVacancyPct =
    gpiAnnual > 0 ? Math.max(0, 100 * (1 - (opExAnnualTotal + annualDebtService) / gpiAnnual)) : 0;

  const StatusPill = ({ ok, label }: { ok: boolean; label: string }) => (
    <span
      className={classNames(
        "px-2 py-0.5 text-xs rounded-full border",
        ok ? "border-emerald-600 text-emerald-700" : "border-red-600 text-red-700"
      )}
    >
      {label}
    </span>
  );

  const Input = (p: {
    label: string;
    value: string;
    onChange: (v: string) => void;
    id?: string;
    right?: boolean;
    placeholder?: string;
    suffix?: string;
  }) => (
    <div className={classNames("flex flex-col", p.right && "items-end")}>
      <label className="text-[11px] text-brand-blue/70 mb-1" htmlFor={p.id}>
        {p.label}
      </label>
      <div className="relative w-full">
        <input
          id={p.id}
          value={p.value}
          onChange={(e) => p.onChange(e.target.value.replace(/[^\d.,-]/g, ""))}
          inputMode="decimal"
          className="border rounded-lg p-2 w-full bg-white text-right"
          placeholder={p.placeholder || "0"}
        />
        {p.suffix && (
          <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-brand-blue/70">
            {p.suffix}
          </span>
        )}
      </div>
    </div>
  );

  const dscrOk = dscr >= 1.2;
  const cocOk = coc >= 6;
  const capOk = capRate >= 5;

  return (
    <section id="deal-analyzer" className="rounded-2xl border border-brand-gold bg-white p-4 md:p-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h3 className="font-serif text-base md:text-lg text-brand-green font-bold flex items-center gap-2">
          <Calculator className="h-5 w-5" />
          Deal Analyzer (NOI • Cap • DSCR • CoC)
        </h3>
        <div className="text-xs text-brand-blue/70 flex items-center gap-2">
          <Info className="h-4 w-4" />
          Guidance only. Use lender/broker numbers for decisions.
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-4 mt-4">
        {/* Left: Inputs */}
        <div className="rounded-xl border border-brand-gold/50 p-3">
          <div className="font-semibold text-brand-blue mb-2 flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            Purchase & Income
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input label="Purchase price" value={model.price} onChange={(v) => setModel({ ...model, price: v })} id="price" />
            <Input label="Down payment" value={model.downPct} onChange={(v) => setModel({ ...model, downPct: v })} id="down" suffix="%" />
            <Input label="Interest rate" value={model.ratePct} onChange={(v) => setModel({ ...model, ratePct: v })} id="rate" suffix="%" />
            <Input label="Amortization" value={model.amortYears} onChange={(v) => setModel({ ...model, amortYears: v })} id="amort" suffix="yrs" />
            <Input label="Closing costs" value={model.closingPct} onChange={(v) => setModel({ ...model, closingPct: v })} id="closing" suffix="%" />

            <Input label="# of units" value={model.units} onChange={(v) => setModel({ ...model, units: v })} id="units" />
            <Input label="Avg rent / unit (mo)" value={model.avgRent} onChange={(v) => setModel({ ...model, avgRent: v })} id="arent" />
            <Input label="Other income (mo)" value={model.otherIncomeMo} onChange={(v) => setModel({ ...model, otherIncomeMo: v })} id="oinc" />
            <Input label="Vacancy" value={model.vacancyPct} onChange={(v) => setModel({ ...model, vacancyPct: v })} id="vac" suffix="%" />
          </div>

          <div className="font-semibold text-brand-blue mt-4 mb-2 flex items-center gap-2">
            <ClipboardCheck className="h-4 w-4" />
            Operating Expenses
          </div>
          <div className="grid grid-cols-3 gap-3">
            <Input label="Annual OpEx (fixed)" value={model.opExAnnual} onChange={(v) => setModel({ ...model, opExAnnual: v })} id="opex" />
            <Input label="Mgmt fee" value={model.mgmtPct} onChange={(v) => setModel({ ...model, mgmtPct: v })} id="mgmt" suffix="%" />
            <Input label="Capex reserve" value={model.capexPct} onChange={(v) => setModel({ ...model, capexPct: v })} id="capex" suffix="%" />
          </div>
        </div>

        {/* Right: Outputs */}
        <div className="rounded-xl border border-brand-gold/50 p-3">
          <div className="font-semibold text-brand-blue mb-2 flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            Results (estimates)
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>GPI (annual): <strong>{money0(gpiAnnual || 0)}</strong></div>
            <div>EGI (after vacancy): <strong>{money0(egiAnnual || 0)}</strong></div>
            <div>OpEx (annual, total): <strong>{money0(opExAnnualTotal || 0)}</strong></div>
            <div>NOI: <strong>{money0(noi || 0)}</strong></div>
            <div>Debt service (annual): <strong>{money0(annualDebtService || 0)}</strong></div>
            <div>Cash flow (pre-tax): <strong>{money0(cfBeforeTax || 0)}</strong></div>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-3">
            <div className="text-sm">Cap rate: <strong>{pct1(capRate)}</strong></div>
            <StatusPill ok={capOk} label={capOk ? "≥ ~5% OK" : "< ~5% Low"} />
            <div className="text-sm">DSCR: <strong>{Number.isFinite(dscr) ? dscr.toFixed(2) : "0.00"}</strong></div>
            <StatusPill ok={dscrOk} label={dscrOk ? "≥ ~1.20 OK" : "< ~1.20 Low"} />
            <div className="text-sm">Cash-on-cash: <strong>{pct1(coc)}</strong></div>
            <StatusPill ok={cocOk} label={cocOk ? "≥ ~6% OK" : "< ~6% Low"} />
          </div>

          <div className="text-[12px] text-brand-blue/70 mt-3">
            Break-even occupancy: <strong>{pct1(100 - breakEvenVacancyPct)}</strong> • Break-even vacancy: <strong>{pct1(breakEvenVacancyPct)}</strong>
          </div>

          <div className="text-[12px] text-brand-blue/70 mt-2">
            Indicative only; actual limits and calculations vary by lender, product, insurer and municipality.
          </div>

          <div className="text-sm mt-3">
            Learn more about DSCR:{" "}
            <Link href="/en/guides/dscr-rules" className="underline">Confirm DSCR Rules</Link>
          </div>
        </div>
      </div>
    </section>
  );
}

// ---------- Page ----------
export default function Page() {
  const [tasks, setTasks] = useState<Task[]>(defaultTasks());
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const [filter, setFilter] = useState("");
  const [collapse, setCollapse] = useState<Record<SectionKey, boolean>>({
    strategy: false,
    financing: false,
    financials: false,
    due_diligence: false,
    legal_compliance: false,
    renovations_capex: false,
    operations_pm: false,
    insurance_risk: false,
    closing_transition: false,
    after_close: false,
    custom: false,
  });

  // Analyzer state
  const [analyzer, setAnalyzer] = useState<Analyzer>(DEFAULT_ANALYZER);

  // Restore
  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_TASKS);
      if (raw) {
        const v = JSON.parse(raw);
        if (Array.isArray(v)) setTasks(v as Task[]);
      }
    } catch {}
    try {
      const rawA = localStorage.getItem(LS_ANALYZER);
      if (rawA) {
        const v = JSON.parse(rawA);
        if (v && typeof v === "object") setAnalyzer({ ...DEFAULT_ANALYZER, ...v });
      }
    } catch {}
  }, []);

  // Persist
  useEffect(() => {
    try {
      localStorage.setItem(LS_TASKS, JSON.stringify(tasks));
      setSavedAt(Date.now());
    } catch {}
  }, [tasks]);
  useEffect(() => {
    try {
      localStorage.setItem(LS_ANALYZER, JSON.stringify(analyzer));
    } catch {}
  }, [analyzer]);

  // Derived
  const overall = useMemo(() => {
    const filtered = filter
      ? tasks.filter((t) =>
          [t.title, t.note, t.linkLabel]
            .filter(Boolean)
            .join(" ")
            .toLowerCase()
            .includes(filter.toLowerCase())
        )
      : tasks;

    const bySection = (key: SectionKey) => filtered.filter((t) => t.section === key);
    const sections = (Object.keys(SECTION_META) as SectionKey[]).map((key) => {
      const list = bySection(key);
      const total = list.length;
      const done = list.filter((t) => t.done).length;
      return { key, list, total, done };
    });

    const total = filtered.length;
    const done = filtered.filter((t) => t.done).length;

    // Upcoming within 14 days
    const today = new Date();
    const upcoming = filtered
      .filter((t) => !!t.due && !t.done)
      .filter((t) => {
        const d = new Date(String(t.due) + "T00:00:00");
        const diff = Math.ceil((d.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        return diff >= 0 && diff <= 14;
      })
      .sort((a, b) => String(a.due).localeCompare(String(b.due)))
      .slice(0, 8);

    const pct = total ? Math.round((done / total) * 100) : 0;
    return { filtered, sections, total, done, pct, upcoming };
  }, [tasks, filter]);

  // Actions
  const toggle = (id: string) =>
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  const update = (id: string, patch: Partial<Task>) =>
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...patch } : t)));
  const updateRowNote = (id: string, note: string) => update(id, { note });
  const addCustom = (section: SectionKey) =>
    setTasks((prev) => [
      ...prev,
      { id: uid(), section, title: "", note: "", done: false, isCustom: true },
    ]);
  const removeTask = (id: string) => setTasks((prev) => prev.filter((t) => t.id !== id));

  const resetAll = () => {
    const ok = confirm("Reset checklist & analyzer to defaults? This clears your saved progress.");
    if (ok) {
      setTasks(defaultTasks());
      setAnalyzer(DEFAULT_ANALYZER);
      try {
        localStorage.removeItem(LS_TASKS);
        localStorage.removeItem(LS_ANALYZER);
      } catch {}
    }
  };

  const exportCSV = () => {
    const headers = ["Section", "Task", "Done", "Due", "Note", "Link"];
    const lines = [headers.join(",")];
    tasks.forEach((t) => {
      const cells = [
        SECTION_META[t.section].title,
        t.title.replace(/"/g, '""'),
        t.done ? "Yes" : "No",
        t.due || "",
        (t.note || "").replace(/"/g, '""'),
        t.linkLabel ? `${t.linkLabel} (${t.linkHref || ""})` : "",
      ];
      lines.push(
        cells.map((c) => (c.includes(",") || c.includes('"') ? `"${c}"` : c)).join(",")
      );
    });
    const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "Multiplex_Readiness_Checklist.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const toggleAll = (val: boolean) =>
    setCollapse({
      strategy: val,
      financing: val,
      financials: val,
      due_diligence: val,
      legal_compliance: val,
      renovations_capex: val,
      operations_pm: val,
      insurance_risk: val,
      closing_transition: val,
      after_close: val,
      custom: val,
    });

  return (
    <ToolShell
      title="Multiplex Readiness Checklist"
      subtitle="A practical roadmap to underwrite, finance, and operationalize a 2–4+ unit property — with autosave, export, and a built-in deal analyzer."
      lang="en"
    >
      {/* Header actions */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-brand-blue/60" />
            <input
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              placeholder="Filter tasks…"
              className="pl-9 pr-3 py-2 rounded-full border-2 border-brand-gold/60 bg-white min-w-[220px]"
              aria-label="Filter tasks"
            />
          </div>
          <button type="button" onClick={() => toggleAll(true)} className="text-sm underline text-brand-blue">
            Collapse all
          </button>
          <span className="text-brand-blue/40">|</span>
          <button type="button" onClick={() => toggleAll(false)} className="text-sm underline text-brand-blue">
            Expand all
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={exportCSV}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border-2 border-brand-green text-brand-green hover:bg-brand-green hover:text-white transition"
            title="Export as CSV"
          >
            <Download className="h-4 w-4" />
            Export CSV
          </button>
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border-2 border-brand-blue text-brand-blue hover:bg-brand-blue hover:text-white transition"
            title="Print"
          >
            <Printer className="h-4 w-4" />
            Print
          </button>
          <button
            type="button"
            onClick={resetAll}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border-2 border-brand-gold text-brand-gold hover:bg-brand-gold hover:text-brand-green transition"
            title="Reset"
          >
            <RotateCcw className="h-4 w-4" />
            Reset
          </button>
          <SavedIndicator savedAt={savedAt} />
        </div>
      </div>

      {/* Status / Snapshot */}
      <section className="rounded-2xl border border-brand-gold bg-white p-4 md:p-5 mb-6">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          <SummaryCard icon={<Calculator className="h-5 w-5" />} label="Deal analyzer" value="Open tool" href="#deal-analyzer" />
          <SummaryCard icon={<FileText className="h-5 w-5" />} label="Docs & rent roll" value="Gather actuals" />
          <SummaryCard icon={<Building2 className="h-5 w-5" />} label="Financing" value="Confirm DSCR rules" href="/en/guides/dscr-rules" />
          <div className="rounded-xl border border-brand-gold/50 bg-brand-beige/40 p-3 md:p-4 flex items-center justify-between">
            <div>
              <div className="text-xs md:text-sm text-brand-blue/80">Checklist</div>
              <div className="mt-2"><ProgressBar value={overall.done} total={overall.total} /></div>
              <div className="text-xs text-brand-blue/70 mt-1">{overall.done}/{overall.total} completed</div>
            </div>
            <SavedIndicator savedAt={savedAt} />
          </div>
        </div>

        {overall.upcoming.length > 0 && (
          <div className="mt-4">
            <div className="text-sm font-semibold text-brand-green mb-1 flex items-center gap-2">
              <CalendarDays className="h-4 w-4" />
              Due in the next 14 days
            </div>
            <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {overall.upcoming.map((t) => (
                <li key={t.id} className="rounded-lg border border-brand-gold/50 bg-brand-beige/40 px-3 py-2 text-sm">
                  <div className="font-medium">{t.title}</div>
                  <div className="text-brand-blue/70 flex items-center gap-2 text-xs mt-1">
                    <CalendarDays className="h-3 w-3" />
                    {t.due}
                    <span className="mx-1 text-brand-blue/30">•</span>
                    <span>{SECTION_META[t.section].title}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>

      {/* Deal Analyzer */}
      <DealAnalyzerCard model={analyzer} setModel={setAnalyzer} />

      {/* Sections */}
      <form className="grid grid-cols-1 gap-6 mt-6">
        {(Object.keys(SECTION_META) as SectionKey[]).map((key) => {
          const meta = SECTION_META[key];
          const list = overall.sections.find((s) => s.key === key)!;
          const isCollapsed = collapse[key];

          return (
            <section key={key} className="rounded-2xl border border-brand-gold bg-white p-4 md:p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className={classNames("font-serif text-base md:text-lg font-bold", toneToText[meta.tone])}>
                    {meta.title}
                  </h3>
                  {meta.blurb && <p className="text-sm text-brand-blue/80 mt-1">{meta.blurb}</p>}
                </div>
                <div className="flex items-center gap-3">
                  <ProgressBar value={list.done} total={list.total} />
                  {key !== "custom" && (
                    <button
                      type="button"
                      onClick={() => addCustom(key)}
                      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-brand-gold/70 text-brand-blue hover:bg-brand-beige/60"
                      title="Add a custom task to this section"
                    >
                      <PlusCircle className="h-4 w-4" />
                      Add task
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setCollapse((c) => ({ ...c, [key]: !c[key] }))}
                    className="text-sm underline text-brand-blue"
                    aria-expanded={!isCollapsed}
                    aria-controls={`section-${key}`}
                  >
                    {isCollapsed ? "Expand" : "Collapse"}
                  </button>
                </div>
              </div>

              {/* Task list */}
              <div id={`section-${key}`} className={classNames(isCollapsed && "hidden", "mt-4")}>
                {/* Desktop table */}
                <div className="hidden md:block">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-brand-beige/40 text-left">
                        <th className="p-2 rounded-l-xl w-[44px]">Done</th>
                        <th className="p-2">Task</th>
                        <th className="p-2 w-[130px]">Due date</th>
                        <th className="p-2 w-[36%]">Notes</th>
                        <th className="p-2 rounded-r-xl w-[44px]"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {list.list.map((t) => (
                        <tr key={t.id} className="border-b border-brand-green/20">
                          <td className="p-2 align-top">
                            <input
                              id={`chk-${t.id}`}
                              type="checkbox"
                              checked={t.done}
                              onChange={() => toggle(t.id)}
                              className="h-4 w-4 accent-brand-green"
                              aria-label={`Mark "${t.title}" as done`}
                            />
                          </td>
                          <td className="p-2 align-top">
                            <label htmlFor={`chk-${t.id}`} className="font-medium cursor-pointer">
                              {t.title}
                            </label>
                            {t.linkHref && (
                              <>
                                {" "}
                                <Link
                                  href={t.linkHref}
                                  className="inline-flex items-center gap-1 underline text-brand-blue ml-1"
                                  title={t.linkLabel || "Open link"}
                                >
                                  {t.linkLabel || "Learn more"}
                                  <ExternalLink className="h-3.5 w-3.5" />
                                </Link>
                              </>
                            )}
                          </td>
                          <td className="p-2 align-top">
                            <input
                              type="date"
                              value={t.due || ""}
                              onChange={(e) => update(t.id, { due: e.target.value })}
                              className="border rounded-lg p-2 w-full bg-white"
                              aria-label={`Set due date for ${t.title}`}
                            />
                          </td>
                          <td className="p-2 align-top">
                            <input
                              value={t.note || ""}
                              onChange={(e) => updateRowNote(t.id, e.target.value)}
                              className="w-full border rounded-lg p-2"
                              placeholder="Add a note, contact, or link…"
                              aria-label={`Notes for ${t.title}`}
                            />
                          </td>
                          <td className="p-2 align-top text-right">
                            {(t.isCustom || key === "custom") && (
                              <button
                                type="button"
                                onClick={() => removeTask(t.id)}
                                title="Remove task"
                                aria-label="Remove task"
                                className="inline-flex items-center justify-center p-1.5 rounded-md text-red-600 hover:bg-red-50"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile stacked cards */}
                <div className="md:hidden grid gap-2">
                  {list.list.map((t) => (
                    <div key={t.id} className="relative rounded-xl border border-brand-gold/50 bg-white p-3">
                      {(t.isCustom || key === "custom") && (
                        <button
                          type="button"
                          onClick={() => removeTask(t.id)}
                          title="Remove task"
                          aria-label="Remove task"
                          className="absolute right-2 top-2 p-1 rounded-md text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}

                      <div className="flex items-start gap-3">
                        <input
                          id={`mchk-${t.id}`}
                          type="checkbox"
                          checked={t.done}
                          onChange={() => toggle(t.id)}
                          className="mt-1 h-4 w-4 accent-brand-green"
                          aria-label={`Mark "${t.title}" as done`}
                        />
                        <div className="flex-1">
                          <label htmlFor={`mchk-${t.id}`} className="font-medium">
                            {t.title}
                          </label>
                          {t.linkHref && (
                            <div className="mt-1">
                              <Link
                                href={t.linkHref}
                                className="inline-flex items-center gap-1 underline text-brand-blue"
                                title={t.linkLabel || "Open link"}
                              >
                                {t.linkLabel || "Learn more"}
                                <ExternalLink className="h-3.5 w-3.5" />
                              </Link>
                            </div>
                          )}
                          <div className="grid grid-cols-2 gap-2 mt-2">
                            <div>
                              <div className="text-[11px] text-brand-blue/70">Due</div>
                              <input
                                type="date"
                                value={t.due || ""}
                                onChange={(e) => update(t.id, { due: e.target.value })}
                                className="border rounded-lg p-2 w-full bg-white"
                              />
                            </div>
                            <div className="col-span-2">
                              <div className="text-[11px] text-brand-blue/70">Notes</div>
                              <input
                                value={t.note || ""}
                                onChange={(e) => updateRowNote(t.id, e.target.value)}
                                className="w-full border rounded-lg p-2"
                                placeholder="Add a note, contact, or link…"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add button for Custom section */}
                {key === "custom" && (
                  <div className="mt-3">
                    <button
                      type="button"
                      onClick={() => addCustom("custom")}
                      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-brand-gold/70 text-brand-blue hover:bg-brand-beige/60"
                    >
                      <PlusCircle className="h-4 w-4" />
                      Add custom task
                    </button>
                  </div>
                )}
              </div>
            </section>
          );
        })}
      </form>

      {/* Helpful tools & services */}
      <section className="rounded-2xl border border-brand-gold bg-white p-4 md:p-5 mt-6">
        <h4 className="font-serif text-base md:text-lg text-brand-green font-bold mb-2">
          Helpful tools & services
        </h4>
        <ul className="list-disc ml-5 text-sm space-y-1">
          <li>
            Run scenarios:{" "}
            <Link href="#deal-analyzer" className="underline">
              Deal Analyzer
            </Link>{" "}
            •{" "}
            <Link href="/en/guides/dscr-rules" className="underline">
              Confirm DSCR Rules
            </Link>
          </li>
          <li>
            Self-employed or complex income?{" "}
            <Link href="/en/tools/self-employed-checklist" className="underline">
              Self-Employed Mortgage Toolkit
            </Link>
          </li>
          <li>
            Work with us:{" "}
            <Link href="/en/clients/portal" className="underline">
              Client portal
            </Link>{" "}
            •{" "}
            <Link href="/en/services/financial-planning" className="underline">
              Planning session
            </Link>
          </li>
        </ul>
        <p className="text-xs text-brand-blue/70 mt-3">
          This page is educational and general. Policies and rules vary by lender, insurer, and municipality, and can change.
          Verify details with official sources and your professional advisors.
        </p>
      </section>

      {/* Print helpers */}
      <style jsx global>{`
        @media print {
          .print\\:hidden { display: none !important; }
          main { background: white !important; }
          header, section { break-inside: avoid; page-break-inside: avoid; }
          table { page-break-inside: auto; }
          tr { page-break-inside: avoid; page-break-after: auto; }
        }
      `}</style>
    </ToolShell>
  );
}

// ---------- Small child ----------
function SummaryCard({ icon, label, value, href }: { icon: ReactNode; label: string; value: string; href?: string }) {
  const content = (
    <div className="rounded-xl border border-brand-gold/50 bg-white p-3 md:p-4 h-full">
      <div className="text-xs md:text-sm text-brand-blue/80 flex items-center gap-2">
        {icon}
        {label}
      </div>
      <div className="text-xl md:text-2xl font-bold text-brand-green mt-1">{value}</div>
    </div>
  );
  return href ? <Link href={href} className="block">{content}</Link> : content;
}
