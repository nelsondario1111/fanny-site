"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import ToolShell from "@/components/ToolShell";
import { downloadCsv, downloadXlsx } from "@/lib/spreadsheet";
import {
  Trash2,
  PlusCircle,
  CheckCircle2,
  CalendarDays,
  ExternalLink,
  Download,
  RotateCcw,
  Printer,
  Calculator,
  FileText,
  Building2,
  DollarSign,
  Info,
} from "lucide-react";

/**
 * Self-Employed Mortgage Toolkit
 * - Sections with tasks, due dates, notes, custom items
 * - Autosave (localStorage) + "Saved" indicator
 * - CSV/XLSX export, Print, Reset
 * - Built-in Adjusted Income Estimator (2-year avg vs. last-year; rough GDS/TDS)
 *
 * Educational only. Lender rules vary; confirm with your broker/lender.
 */

// ---------- Types ----------
type SectionKey =
  | "strategy"
  | "biz_tax_profile"
  | "income_evidence_sp"
  | "income_evidence_corp"
  | "addbacks_adjustments"
  | "assets_downpayment"
  | "liabilities_credit"
  | "property_mortgage"
  | "finalize_submit"
  | "after_approval"
  | "custom";

type Task = {
  id: string;
  section: SectionKey;
  title: string;
  note?: string;
  done: boolean;
  due?: string; // YYYY-MM-DD
  linkHref?: string;
  linkLabel?: string;
  isCustom?: boolean;
  priority?: "high" | "normal";
};

// ---------- Storage ----------
const LS_KEY = "tools.self_employed_mortgage_toolkit.v1";
const LS_KEY_EST = "tools.self_employed_income_estimator.v1";

// ---------- Helpers ----------
const uid = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

function classNames(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

// ---------- Section metadata ----------
const SECTION_META: Record<
  SectionKey,
  { title: string; blurb?: string; tone: "emerald" | "amber" | "sky" | "blue" | "gold" }
> = {
  strategy: {
    title: "Getting started & strategy",
    blurb: "Clarify path, timing, and documents your lender will ask for.",
    tone: "gold",
  },
  biz_tax_profile: {
    title: "Business & tax profile",
    blurb: "Confirm structure, taxes, and compliance (helps underwriting).",
    tone: "emerald",
  },
  income_evidence_sp: {
    title: "Income evidence — Sole proprietor",
    blurb: "Pull T1, NOAs, T2125, and bank statements.",
    tone: "sky",
  },
  income_evidence_corp: {
    title: "Income evidence — Incorporated",
    blurb: "Pull T2 package, financials, and shareholder docs.",
    tone: "sky",
  },
  addbacks_adjustments: {
    title: "Add-backs & adjustments",
    blurb: "Identify reasonable add-backs to estimate ‘mortgage income’.",
    tone: "amber",
  },
  assets_downpayment: {
    title: "Assets & down payment",
    blurb: "Source of funds, 90–120 days history, gifts.",
    tone: "blue",
  },
  liabilities_credit: {
    title: "Liabilities & credit",
    blurb: "Debts, credit score, and utilization clean-up.",
    tone: "emerald",
  },
  property_mortgage: {
    title: "Property & mortgage details",
    blurb: "Pre-approval, product choice, and stress testing.",
    tone: "blue",
  },
  finalize_submit: {
    title: "Finalize & submit",
    blurb: "Package, sign, and send to lender/broker.",
    tone: "amber",
  },
  after_approval: {
    title: "After approval",
    blurb: "Lawyer, insurance, and post-close organization.",
    tone: "emerald",
  },
  custom: {
    title: "Your custom tasks",
    blurb: "Add anything unique to your situation.",
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
      title: "Book a discovery call to map your mortgage path & timing",
      linkHref: "/en/services#mortgage",
      linkLabel: "Book a planning session",
      done: false,
      priority: "high",
    },
    {
      id: uid(),
      section: "strategy",
      title: "Estimate budget range and monthly comfort level",
      linkHref: "/en/tools/affordability-stress-test",
      linkLabel: "Affordability & Stress Test",
      done: false,
    },
    {
      id: uid(),
      section: "strategy",
      title: "List any unusual or one-time items in last 2 years (explain briefly)",
      done: false,
    },

    // BIZ & TAX PROFILE
    { id: uid(), section: "biz_tax_profile", title: "Confirm business structure (sole prop / corporation / partnership)", done: false },
    { id: uid(), section: "biz_tax_profile", title: "Last 2 years tax filed? Any balances / payment plans?", done: false, priority: "high" },
    { id: uid(), section: "biz_tax_profile", title: "GST/HST registration & filings up to date (if applicable)", done: false },
    { id: uid(), section: "biz_tax_profile", title: "Business licence / registrations (as applicable)", done: false },

    // SOLE PROP
    { id: uid(), section: "income_evidence_sp", title: "T1 General (last 2 years)", done: false, priority: "high" },
    { id: uid(), section: "income_evidence_sp", title: "Notices of Assessment (NOA) (last 2 years)", done: false, priority: "high" },
    { id: uid(), section: "income_evidence_sp", title: "T2125 Statement of Business/Professional Activities", done: false },
    { id: uid(), section: "income_evidence_sp", title: "12–24 months business bank statements (for reasonability)", done: false },
    { id: uid(), section: "income_evidence_sp", title: "Any contracts/invoices supporting income consistency", done: false },

    // INCORPORATED
    { id: uid(), section: "income_evidence_corp", title: "Corporate financials (last 2 years) — income statement & balance sheet", done: false, priority: "high" },
    { id: uid(), section: "income_evidence_corp", title: "T2 Corporate returns + Notices of Assessment", done: false },
    { id: uid(), section: "income_evidence_corp", title: "Shareholder info (T5s/dividends, T4s/salaries, % ownership)", done: false },
    { id: uid(), section: "income_evidence_corp", title: "Articles of incorporation & minute book (basic pages)", done: false },
    { id: uid(), section: "income_evidence_corp", title: "Corporate bank statements (recent 6–12 months)", done: false },

    // ADDBACKS
    { id: uid(), section: "addbacks_adjustments", title: "Identify depreciation/CCA and other non-cash items to add back (if lender allows)", done: false },
    { id: uid(), section: "addbacks_adjustments", title: "Flag one-time or extraordinary expenses for explanation", done: false },
    { id: uid(), section: "addbacks_adjustments", title: "Estimate adjusted income (2-year avg vs. last year)", done: false, linkHref: "#income-estimator", linkLabel: "Use the estimator" },

    // ASSETS & DOWN PAYMENT
    { id: uid(), section: "assets_downpayment", title: "Document down payment source (savings, investments, gift letter)", done: false, priority: "high" },
    { id: uid(), section: "assets_downpayment", title: "Provide 90–120 days history for down payment funds", done: false },
    { id: uid(), section: "assets_downpayment", title: "RRSP/Home Buyers’ Plan (if applicable)", done: false },

    // LIABILITIES & CREDIT
    { id: uid(), section: "liabilities_credit", title: "List all monthly debt payments (cards/LOC/loans/leases)", done: false, priority: "high" },
    { id: uid(), section: "liabilities_credit", title: "Check credit score & utilization; reduce balances if needed", done: false, linkHref: "/en/services#mortgage", linkLabel: "Credit-building guidance" },
    { id: uid(), section: "liabilities_credit", title: "Student loans / support / alimony documentation (if any)", done: false },

    // PROPERTY & MORTGAGE
    { id: uid(), section: "property_mortgage", title: "Get a pre-approval with your broker/lender", done: false, priority: "high" },
    { id: uid(), section: "property_mortgage", title: "Estimate monthly payment, property tax, heat, condo fees", done: false, linkHref: "/en/tools/mortgage-calculator", linkLabel: "Mortgage Payment Calculator" },
    { id: uid(), section: "property_mortgage", title: "Run a stress test scenario", done: false, linkHref: "/en/tools/affordability-stress-test", linkLabel: "Affordability & Stress Test" },

    // FINALIZE & SUBMIT
    { id: uid(), section: "finalize_submit", title: "Upload full package to secure client portal", done: false, linkHref: "/en/client-library", linkLabel: "Client library", priority: "high" },
    { id: uid(), section: "finalize_submit", title: "Review/sign lender forms & disclosures", done: false },
    { id: uid(), section: "finalize_submit", title: "Confirm down payment, closing costs, and lawyer details", done: false },

    // AFTER APPROVAL
    { id: uid(), section: "after_approval", title: "Home insurance binder; coordinate with lawyer & lender", done: false },
    { id: uid(), section: "after_approval", title: "Set up automatic payments and an emergency buffer", done: false },
    { id: uid(), section: "after_approval", title: "Organize copies of all documents in a secure folder", done: false, linkHref: "/en/client-library", linkLabel: "Client library" },
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
    <div className="flex items-center gap-2 flex-wrap">
      <div className="h-2 w-28 bg-brand-beige rounded-full overflow-hidden">
        <div className="h-2 bg-brand-green" style={{ width: `${pct}%`, transition: "width .3s ease" }} />
      </div>
      <span className="text-xs text-brand-blue/70">{pct}%</span>
    </div>
  );
}

// ---------- Adjusted Income Estimator ----------
type Est = {
  y1Net: string; // last year net income after expenses (annual)
  y2Net: string; // prior year
  y1Addbacks: string; // depreciation/CCA, non-cash, one-time
  y2Addbacks: string;
  useTwoYearAvg: boolean; // show both; lenders may use avg or last year
  monthlyHousingPI: string; // estimated principal+interest
  monthlyPropertyTax: string;
  monthlyHeating: string;
  monthlyCondoFees: string;
  monthlyOtherDebts: string; // cards/LOC/loans/leases min payments
};

const DEFAULT_EST: Est = {
  y1Net: "",
  y2Net: "",
  y1Addbacks: "",
  y2Addbacks: "",
  useTwoYearAvg: true,
  monthlyHousingPI: "",
  monthlyPropertyTax: "",
  monthlyHeating: "100",
  monthlyCondoFees: "",
  monthlyOtherDebts: "",
};

const money = (n: number) =>
  new Intl.NumberFormat("en-CA", { style: "currency", currency: "CAD", maximumFractionDigits: 0 }).format(Math.round(n));

const toNum = (s: string | undefined) => {
  if (!s) return 0;
  const cleaned = String(s).replace(/[^\d.-]/g, "");
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : 0;
};

function IncomeEstimatorCard({
  est,
  setEst,
}: {
  est: Est;
  setEst: (next: Est) => void;
}) {
  const y1Adj = toNum(est.y1Net) + toNum(est.y1Addbacks);
  const y2Adj = toNum(est.y2Net) + toNum(est.y2Addbacks);
  const twoYrAvg = (y1Adj && y2Adj) ? (y1Adj + y2Adj) / 2 : (y1Adj || y2Adj);
  const lastYearOnly = y1Adj;
  const chosenAnnual = est.useTwoYearAvg ? twoYrAvg : lastYearOnly;
  const monthlyIncome = (chosenAnnual || 0) / 12;

  const housingCosts =
    toNum(est.monthlyHousingPI) +
    toNum(est.monthlyPropertyTax) +
    toNum(est.monthlyHeating) +
    toNum(est.monthlyCondoFees);

  const otherDebts = toNum(est.monthlyOtherDebts);

  const GDS = monthlyIncome > 0 ? (housingCosts / monthlyIncome) * 100 : 0;
  const TDS = monthlyIncome > 0 ? ((housingCosts + otherDebts) / monthlyIncome) * 100 : 0;

  const okGDS = GDS <= 39; // common guidance; lenders vary
  const okTDS = TDS <= 44; // common guidance; lenders vary

  const StatusPill = ({ ok, label }: { ok: boolean; label: string }) => (
    <span className={classNames("px-2 py-0.5 text-xs rounded-full border", ok ? "border-emerald-600 text-emerald-700" : "border-red-600 text-red-700")}>
      {label}
    </span>
  );

  const Input = (p: { label: string; value: string; onChange: (v: string) => void; right?: boolean; id?: string; placeholder?: string }) => (
    <div className={classNames("flex flex-col", p.right && "items-end")}>
      <label className="text-[11px] text-brand-blue/70 mb-1" htmlFor={p.id}>{p.label}</label>
      <input
        id={p.id}
        value={p.value}
        onChange={(e) => p.onChange(e.target.value.replace(/[^\d.,-]/g, ""))}
        inputMode="decimal"
        className="border rounded-lg p-2 bg-white min-w-[120px] text-right"
        placeholder={p.placeholder || "0"}
      />
    </div>
  );

  return (
    <section id="income-estimator" className="tool-card-compact">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h3 className="font-sans text-base md:text-lg text-brand-green font-semibold flex items-center gap-2">
          <Calculator className="h-5 w-5" />
          Adjusted Income Estimator (rough)
        </h3>
        <div className="text-xs text-brand-blue/70 flex items-center gap-2">
          <Info className="h-4 w-4" />
          Lenders differ. Use this as a conversation starter with your broker.
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4 mt-4">
        <div className="rounded-xl border border-brand-gold/50 p-3">
          <div className="font-semibold text-brand-blue mb-2 flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Income (Annual) & Add-backs
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input label="Last year net income" value={est.y1Net} onChange={(v) => setEst({ ...est, y1Net: v })} id="y1" />
            <Input label="Last year add-backs" value={est.y1Addbacks} onChange={(v) => setEst({ ...est, y1Addbacks: v })} id="y1a" />
            <Input label="Prior year net income" value={est.y2Net} onChange={(v) => setEst({ ...est, y2Net: v })} id="y2" />
            <Input label="Prior year add-backs" value={est.y2Addbacks} onChange={(v) => setEst({ ...est, y2Addbacks: v })} id="y2a" />
          </div>

          <div className="mt-3 text-sm space-y-1">
            <div>Adjusted last year: <strong>{money(y1Adj || 0)}</strong></div>
            <div>Adjusted prior year: <strong>{money(y2Adj || 0)}</strong></div>
            <div>Two-year average: <strong>{money(twoYrAvg || 0)}</strong></div>
            <div className="text-[12px] text-brand-blue/70">Lenders may consider the lower of last year vs. 2-year average.</div>
          </div>

          <div className="mt-3 flex items-center gap-2">
            <label className="text-sm">
              <input
                type="checkbox"
                checked={est.useTwoYearAvg}
                onChange={(e) => setEst({ ...est, useTwoYearAvg: e.target.checked })}
                className="mr-2 accent-brand-green"
              />
              Use 2-year average (otherwise last year only)
            </label>
          </div>
        </div>

        <div className="rounded-xl border border-brand-gold/50 p-3">
          <div className="font-semibold text-brand-blue mb-2 flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            Monthly Housing & Debts
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input label="Mortgage P&I (monthly)" value={est.monthlyHousingPI} onChange={(v) => setEst({ ...est, monthlyHousingPI: v })} id="mpi" placeholder="Estimate" />
            <Input label="Property tax (monthly)" value={est.monthlyPropertyTax} onChange={(v) => setEst({ ...est, monthlyPropertyTax: v })} id="ptx" />
            <Input label="Heating (monthly)" value={est.monthlyHeating} onChange={(v) => setEst({ ...est, monthlyHeating: v })} id="heat" />
            <Input label="Condo fees (monthly)" value={est.monthlyCondoFees} onChange={(v) => setEst({ ...est, monthlyCondoFees: v })} id="condo" />
            <Input label="Other monthly debts" value={est.monthlyOtherDebts} onChange={(v) => setEst({ ...est, monthlyOtherDebts: v })} id="debts" />
          </div>

          <div className="mt-3 text-sm grid grid-cols-2 gap-2">
            <div>Chosen annual income: <strong>{money((est.useTwoYearAvg ? twoYrAvg : lastYearOnly) || 0)}</strong></div>
            <div>Monthly income: <strong>{money(monthlyIncome || 0)}</strong></div>
            <div>Housing costs: <strong>{money(housingCosts || 0)}</strong></div>
            <div>Other debts: <strong>{money(otherDebts || 0)}</strong></div>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-3">
            <div className="text-sm">GDS: <strong>{GDS.toFixed(1)}%</strong></div>
            <StatusPill ok={okGDS} label={okGDS ? "≤ ~39% OK" : "> ~39% High"} />
            <div className="text-sm">TDS: <strong>{TDS.toFixed(1)}%</strong></div>
            <StatusPill ok={okTDS} label={okTDS ? "≤ ~44% OK" : "> ~44% High"} />
          </div>

          <div className="text-[12px] text-brand-blue/70 mt-2">
            Guidance only; actual limits and calculations vary by lender, product, and insurer.
          </div>

          <div className="mt-3 text-sm">
            Need exact numbers?
            {" "}
            <Link href="/en/tools/mortgage-calculator" className="underline">Mortgage Payment Calculator</Link>
            {" • "}
            <Link href="/en/tools/affordability-stress-test" className="underline">Affordability &amp; Stress Test</Link>
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
    biz_tax_profile: false,
    income_evidence_sp: false,
    income_evidence_corp: false,
    addbacks_adjustments: false,
    assets_downpayment: false,
    liabilities_credit: false,
    property_mortgage: false,
    finalize_submit: false,
    after_approval: false,
    custom: false,
  });

  // Estimator state
  const [est, setEst] = useState<Est>(DEFAULT_EST);

  // Restore
  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) {
        const v = JSON.parse(raw);
        if (Array.isArray(v)) setTasks(v as Task[]);
      }
    } catch {}
    try {
      const raw2 = localStorage.getItem(LS_KEY_EST);
      if (raw2) {
        const v2 = JSON.parse(raw2);
        if (v2 && typeof v2 === "object") setEst({ ...DEFAULT_EST, ...v2 });
      }
    } catch {}
  }, []);

  // Persist
  useEffect(() => {
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(tasks));
      setSavedAt(Date.now());
    } catch {}
  }, [tasks]);
  useEffect(() => {
    try {
      localStorage.setItem(LS_KEY_EST, JSON.stringify(est));
    } catch {}
  }, [est]);

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
    const pct = total ? Math.round((done / total) * 100) : 0;

    // Upcoming within 14 days
    const today = new Date();
    const upcoming = filtered
      .filter((t) => !!t.due && !t.done)
      .filter((t) => {
        const d = new Date((t.due as string) + "T00:00:00");
        const diff = Math.ceil((d.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        return diff >= 0 && diff <= 14;
      })
      .sort((a, b) => String(a.due).localeCompare(String(b.due)))
      .slice(0, 8);

    return { filtered, sections, total, done, pct, upcoming };
  }, [tasks, filter]);

  // Actions
  const toggle = (id: string) =>
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  const update = (id: string, patch: Partial<Task>) =>
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...patch } : t)));
  const addCustom = (section: SectionKey) =>
    setTasks((prev) => [
      ...prev,
      { id: uid(), section, title: "", note: "", done: false, isCustom: true },
    ]);
  const removeTask = (id: string) => setTasks((prev) => prev.filter((t) => t.id !== id));

  const resetAll = () => {
    const ok = confirm("Reset toolkit to the default template? This clears your saved progress.");
    if (ok) {
      setTasks(defaultTasks());
      setEst(DEFAULT_EST);
      try {
        localStorage.removeItem(LS_KEY);
        localStorage.removeItem(LS_KEY_EST);
      } catch {}
    }
  };

  const exportRows: Array<Array<string | number>> = [
    ["Section", "Task", "Done", "Due", "Note", "Link"],
    ...tasks.map((t) => [
      SECTION_META[t.section].title,
      t.title,
      t.done ? "Yes" : "No",
      t.due || "",
      t.note || "",
      t.linkLabel ? `${t.linkLabel} (${t.linkHref || ""})` : "",
    ]),
  ];

  const exportCSV = () => {
    downloadCsv("Self_Employed_Mortgage_Toolkit", exportRows, { includeDateSuffix: false });
  };

  const exportXLSX = () => {
    downloadXlsx("Self_Employed_Mortgage_Toolkit", exportRows, {
      includeDateSuffix: false,
      sheetName: "Checklist",
      columnWidths: [30, 74, 10, 14, 48, 46],
    });
  };

  const toggleAll = (val: boolean) =>
    setCollapse({
      strategy: val,
      biz_tax_profile: val,
      income_evidence_sp: val,
      income_evidence_corp: val,
      addbacks_adjustments: val,
      assets_downpayment: val,
      liabilities_credit: val,
      property_mortgage: val,
      finalize_submit: val,
      after_approval: val,
      custom: val,
    });

  // ---------- Render ----------
  return (
    <ToolShell
      title="Self-Employed Mortgage Toolkit"
      subtitle="A practical roadmap to gather lender-ready documents, estimate mortgage income, and package your application — with autosave and export."
      lang="en"
    >
      {/* Header actions */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative">
            <DollarSign className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-brand-blue/60" />
            <input
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              placeholder="Filter tasks…"
              className="tool-field-sm min-w-[220px] pl-9"
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
            className="tool-btn-green"
            title="Export as CSV"
          >
            <Download className="h-4 w-4" />
            Export (CSV)
          </button>
          <button
            type="button"
            onClick={exportXLSX}
            className="tool-btn-primary"
            title="Export as Excel"
          >
            <Download className="h-4 w-4" />
            Export (XLSX)
          </button>
          <button
            type="button"
            onClick={() => window.print()}
            className="tool-btn-blue"
            title="Print or Save PDF"
          >
            <Printer className="h-4 w-4" />
            Print or Save PDF
          </button>
          <button
            type="button"
            onClick={resetAll}
            className="tool-btn-gold"
            title="Reset values"
          >
            <RotateCcw className="h-4 w-4" />
            Reset values
          </button>
        </div>
      </div>

      {/* Status / Upcoming */}
      <section className="tool-card-compact mb-6">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          <SummaryCard icon={<Calculator className="h-5 w-5" />} label="Use the estimator" value="Estimate adjusted income" href="#income-estimator" />
          <SummaryCard icon={<FileText className="h-5 w-5" />} label="Document hub" value="Upload securely" href="/en/client-library" />
          <SummaryCard icon={<Building2 className="h-5 w-5" />} label="Pre-approval" value="Start with your broker" href="/en/services#mortgage" />
          <div className="rounded-xl border border-brand-gold/50 bg-brand-beige/40 p-3 md:p-4 flex items-center justify-between">
            <div>
              <div className="text-xs md:text-sm text-brand-blue/80">Overall progress</div>
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

      {/* Adjusted Income Estimator */}
      <IncomeEstimatorCard est={est} setEst={setEst} />

      {/* Sections */}
      <form className="grid grid-cols-1 gap-6 mt-6">
        {(Object.keys(SECTION_META) as SectionKey[]).map((key) => {
          const meta = SECTION_META[key];
          const list = overall.sections.find((s) => s.key === key)!;
          const isCollapsed = collapse[key];

          return (
            <section key={key} className="tool-card-compact">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className={classNames("font-sans text-base md:text-lg font-semibold", toneToText[meta.tone])}>
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
                              onChange={(e) => update(t.id, { note: e.target.value })}
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

                {/* Mobile cards */}
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
                                onChange={(e) => update(t.id, { note: e.target.value })}
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
      <section className="tool-card-compact mt-6">
        <h4 className="font-sans text-base md:text-lg text-brand-green font-semibold mb-2">
          Helpful tools & services
        </h4>
        <ul className="list-disc ml-5 text-sm space-y-1">
          <li>
            Estimate payments & scenarios:{" "}
            <Link href="/en/tools/mortgage-calculator" className="underline">
              Mortgage Payment Calculator
            </Link>{" "}
            •{" "}
            <Link href="/en/tools/affordability-stress-test" className="underline">
              Affordability &amp; Stress Test
            </Link>
          </li>
          <li>
            Track finances:{" "}
            <Link href="/en/tools/budget-calculator" className="underline">
              Holistic Budget Calculator
            </Link>{" "}
            •{" "}
            <Link href="/en/tools/net-worth" className="underline">
              Net Worth Tracker
            </Link>
          </li>
          <li>
            Work with us:{" "}
            <Link href="/en/client-library" className="underline">
              Client library
            </Link>{" "}
            •{" "}
            <Link href="/en/services#mortgage" className="underline">
              Planning session
            </Link>
          </li>
        </ul>
        <p className="text-xs text-brand-blue/70 mt-3">
          This toolkit is educational and general. Underwriting policies vary by lender and can change. Confirm specifics with your broker/lender.
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
function SummaryCard({ icon, label, value, href }: { icon: React.ReactNode; label: string; value: string; href?: string }) {
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
