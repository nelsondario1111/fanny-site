"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import ToolShell from "@/components/ToolShell";
import {
  Calculator,
  CheckCircle2,
  Download,
  Info,
  Printer,
  RotateCcw,
  Search,
  Shield,
  FileText,
  ListChecks,
  PlusCircle,
  Trash2,
} from "lucide-react";

/**
 * Confirm DSCR Rules
 * - Educational explainer + interactive calculators
 * - Autosave (localStorage), CSV export, Print, Reset
 * - Mobile cards + Desktop tables
 *
 * Notes:
 * - DSCR expectations vary by lender, product, insurer, and property size.
 * - For 1–4 unit residential, many lenders still use GDS/TDS with rental offset/add-back.
 * - For multiplex/small commercial (often 5+), DSCR-based underwriting is common.
 * - Use this page as a conversation starter and confirm specifics with your broker/lender.
 */

// ---------- Types ----------
type ChecklistItem = {
  id: string;
  text: string;
  done: boolean;
  note?: string;
  isCustom?: boolean;
};

type QuickCheck = {
  noiAnnual: string;         // $
  annualDebtService: string; // $
  showThreshold: string;     // "1.10" | "1.20" | "1.25" | custom text
};

type MaxLoanInput = {
  noiAnnual: string;     // $
  minDSCR: string;       // %
  ratePct: string;       // % annual
  amortYears: string;    // years
  ioOnly: boolean;       // interest-only toggle
  stressRatePct: string; // optional stress rate to test
};

type ProgramRow = {
  id: string;
  segment: string;   // e.g., "Conventional rental 1–4", "Small commercial 5+"
  typicalMin: string; // e.g., "≈1.10–1.20"
  notes: string;
  editable?: boolean;
};

// ---------- Storage Keys ----------
const LS_KEY_CHECK = "guides.dscr.quickcheck.v1";
const LS_KEY_MAX   = "guides.dscr.maxloan.v1";
const LS_KEY_LIST  = "guides.dscr.checklist.v1";
const LS_KEY_MATRIX= "guides.dscr.matrix.v1";

// ---------- Helpers ----------
const uid = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

function classNames(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

const money0 = (n: number) =>
  new Intl.NumberFormat("en-CA", { style: "currency", currency: "CAD", maximumFractionDigits: 0 }).format(Math.round(n));

const pct2 = (x: number) => `${(Number.isFinite(x) ? x : 0).toFixed(2)}%`;

const toNum = (s?: string) => {
  if (!s) return 0;
  const cleaned = String(s).replace(/[^\d.-]/g, "");
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : 0;
};

// ---------- Defaults ----------
const DEFAULT_CHECK: QuickCheck = {
  noiAnnual: "",
  annualDebtService: "",
  showThreshold: "1.20",
};

const DEFAULT_MAX: MaxLoanInput = {
  noiAnnual: "",
  minDSCR: "1.20",
  ratePct: "6.00",
  amortYears: "30",
  ioOnly: false,
  stressRatePct: "",
};

const DEFAULT_LIST: ChecklistItem[] = [
  { id: uid(), text: "Is DSCR applicable for this property type (1–4 vs. 5+ units)?", done: false },
  { id: uid(), text: "What DSCR threshold applies (e.g., 1.10 / 1.20 / 1.25)?", done: false },
  { id: uid(), text: "Rate & amortization used for debt service (stress-tested?)", done: false },
  { id: uid(), text: "Treatment of rents: actual vs. market; vacant-unit policy", done: false },
  { id: uid(), text: "Allowed add-backs/exclusions in NOI (e.g., non-recurring)?", done: false },
  { id: uid(), text: "Capex reserve or management % assumed in underwriting", done: false },
  { id: uid(), text: "Minimum net worth / liquidity (if any) and LTV caps", done: false },
  { id: uid(), text: "Refinance constraints (seasoning, DSCR lookbacks, IO terms)", done: false },
];

const DEFAULT_MATRIX: ProgramRow[] = [
  {
    id: uid(),
    segment: "Conventional rental (1–4 units)",
    typicalMin: "≈1.10–1.20",
    notes: "Often still uses GDS/TDS with rental offset; DSCR checks may apply case-by-case.",
  },
  {
    id: uid(),
    segment: "Small commercial / multiplex (often 5+)",
    typicalMin: "≈1.20–1.30",
    notes: "Underwritten to property NOI and lender DSCR; stress interest rate common.",
  },
  {
    id: uid(),
    segment: "Alternative / B programs",
    typicalMin: "≈1.00–1.10",
    notes: "Lower DSCR possible with higher rates/fees, stronger down payment, risk-based pricing.",
  },
];

// ---------- Small UI ----------
function Saved({ savedAt }: { savedAt: number | null }) {
  if (!savedAt) return null;
  const sec = Math.max(0, Math.round((Date.now() - savedAt) / 1000));
  const label = sec < 3 ? "Saved just now" : sec < 60 ? `Saved ${sec}s ago` : "Saved";
  return (
    <span className="inline-flex items-center gap-1 text-emerald-700 text-xs md:text-sm" role="status" aria-live="polite">
      <CheckCircle2 className="h-4 w-4" />
      {label}
    </span>
  );
}

const Pill = ({ ok, label }: { ok: boolean; label: string }) => (
  <span className={classNames("px-2 py-0.5 text-xs rounded-full border", ok ? "border-emerald-600 text-emerald-700" : "border-red-600 text-red-700")}>
    {label}
  </span>
);

// =====================================================
// Page
// =====================================================
export default function Page() {
  // State
  const [qc, setQc] = useState<QuickCheck>(DEFAULT_CHECK);
  const [mx, setMx] = useState<MaxLoanInput>(DEFAULT_MAX);
  const [list, setList] = useState<ChecklistItem[]>(DEFAULT_LIST);
  const [matrix, setMatrix] = useState<ProgramRow[]>(DEFAULT_MATRIX);
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const [filter, setFilter] = useState("");

  // Restore
  useEffect(() => {
    try { const r = localStorage.getItem(LS_KEY_CHECK); if (r) setQc({ ...DEFAULT_CHECK, ...JSON.parse(r) }); } catch {}
    try { const r = localStorage.getItem(LS_KEY_MAX); if (r) setMx({ ...DEFAULT_MAX, ...JSON.parse(r) }); } catch {}
    try { const r = localStorage.getItem(LS_KEY_LIST); if (r) setList(JSON.parse(r)); } catch {}
    try { const r = localStorage.getItem(LS_KEY_MATRIX); if (r) setMatrix(JSON.parse(r)); } catch {}
  }, []);

  // Persist
  useEffect(() => {
    try { localStorage.setItem(LS_KEY_CHECK, JSON.stringify(qc)); setSavedAt(Date.now()); } catch {}
  }, [qc]);
  useEffect(() => {
    try { localStorage.setItem(LS_KEY_MAX, JSON.stringify(mx)); setSavedAt(Date.now()); } catch {}
  }, [mx]);
  useEffect(() => {
    try { localStorage.setItem(LS_KEY_LIST, JSON.stringify(list)); setSavedAt(Date.now()); } catch {}
  }, [list]);
  useEffect(() => {
    try { localStorage.setItem(LS_KEY_MATRIX, JSON.stringify(matrix)); setSavedAt(Date.now()); } catch {}
  }, [matrix]);

  // Derived – Quick DSCR
  const qcDerived = useMemo(() => {
    const noi = toNum(qc.noiAnnual);
    const ds = toNum(qc.annualDebtService);
    const dscr = ds > 0 ? noi / ds : 0;
    const threshold = Number(qc.showThreshold) || 1.2;
    const ok = dscr >= threshold;
    return { noi, ds, dscr, threshold, ok };
  }, [qc]);

  // Derived – Max Loan
  const mxDerived = useMemo(() => {
    const noi = toNum(mx.noiAnnual);
    const minDSCR = Math.max(0.01, Number(mx.minDSCR) || 1.2);
    const rate = Math.max(0, toNum(mx.ratePct) / 100);
    const stressRate = Math.max(rate, toNum(mx.stressRatePct) / 100);
    const usedRate = stressRate || rate;
    const mRate = usedRate / 12;
    const nMonths = Math.round(Math.max(0, toNum(mx.amortYears)) * 12);

    // Max annual debt service permitted by DSCR rule
    const maxAnnualDebtService = noi / minDSCR;

    let maxLoan = 0;
    if (mx.ioOnly) {
      // Interest-only approximation: DS_annual ≈ Loan * rate
      maxLoan = usedRate > 0 ? maxAnnualDebtService / usedRate : 0;
    } else {
      // Solve for principal from payment: P = DS_monthly * (1 - (1+r)^-n) / r
      const dsMonthly = maxAnnualDebtService / 12;
      if (nMonths > 0) {
        maxLoan = mRate > 0 ? dsMonthly * (1 - Math.pow(1 + mRate, -nMonths)) / mRate : dsMonthly * nMonths;
      }
    }

    return {
      noi,
      minDSCR,
      rateUsedPct: usedRate * 100,
      maxAnnualDebtService,
      maxLoan,
    };
  }, [mx]);

  // Actions
  const resetAll = () => {
    const ok = confirm("Reset DSCR page to defaults? This clears your saved inputs.");
    if (!ok) return;
    setQc(DEFAULT_CHECK);
    setMx(DEFAULT_MAX);
    setList(DEFAULT_LIST);
    setMatrix(DEFAULT_MATRIX);
    try {
      localStorage.removeItem(LS_KEY_CHECK);
      localStorage.removeItem(LS_KEY_MAX);
      localStorage.removeItem(LS_KEY_LIST);
      localStorage.removeItem(LS_KEY_MATRIX);
    } catch {}
  };

  const exportCSV = () => {
    const lines: string[] = [];
    lines.push("Section,Key,Value");
    lines.push(`QuickCheck,NOI Annual,${toNum(qc.noiAnnual)}`);
    lines.push(`QuickCheck,Annual Debt Service,${toNum(qc.annualDebtService)}`);
    lines.push(`QuickCheck,DSCR,${qcDerived.dscr.toFixed(2)}`);
    lines.push(`QuickCheck,Threshold,${qcDerived.threshold.toFixed(2)}`);

    lines.push(`MaxLoan,NOI Annual,${toNum(mx.noiAnnual)}`);
    lines.push(`MaxLoan,Min DSCR,${mxDerived.minDSCR.toFixed(2)}`);
    lines.push(`MaxLoan,Rate Used %,${mxDerived.rateUsedPct.toFixed(2)}`);
    lines.push(`MaxLoan,Max Annual Debt Service,${Math.round(mxDerived.maxAnnualDebtService)}`);
    lines.push(`MaxLoan,Max Loan,${Math.round(mxDerived.maxLoan)}`);

    lines.push("Checklist,Item,Done");
    list.forEach((i) => lines.push(`Checklist,"${i.text.replace(/"/g,'""')}",${i.done ? "Yes" : "No"}`));

    lines.push("Programs,Segment,Typical Min,Notes");
    matrix.forEach((r) => lines.push(`Programs,"${r.segment.replace(/"/g,'""')}","${r.typicalMin.replace(/"/g,'""')}","${r.notes.replace(/"/g,'""')}"`));

    const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "Confirm_DSRC_Rules.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  const addChecklist = () =>
    setList((prev) => [...prev, { id: uid(), text: "", done: false, isCustom: true }]);
  const removeChecklist = (id: string) =>
    setList((prev) => prev.filter((x) => x.id !== id));

  const addProgramRow = () =>
    setMatrix((prev) => [...prev, { id: uid(), segment: "", typicalMin: "", notes: "", editable: true }]);
  const removeProgramRow = (id: string) =>
    setMatrix((prev) => prev.filter((x) => x.id !== id));

  // Filter checklist
  const filteredList = useMemo(
    () =>
      filter
        ? list.filter((i) => (i.text + " " + (i.note || "")).toLowerCase().includes(filter.toLowerCase()))
        : list,
    [filter, list]
  );

  // Render
  return (
    <ToolShell
      title="Confirm DSCR Rules"
      subtitle="Understand lender DSCR expectations and run quick calculations for your property. Educational only — confirm specifics with your broker/lender."
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
              placeholder="Filter checklist…"
              className="pl-9 pr-3 py-2 rounded-full border-2 border-brand-gold/60 bg-white min-w-[220px]"
              aria-label="Filter checklist"
            />
          </div>
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
          <Saved savedAt={savedAt} />
        </div>
      </div>

      {/* Intro / explainer */}
      <section className="rounded-2xl border border-brand-gold bg-white p-4 md:p-5 mb-6">
        <div className="grid md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <h3 className="font-serif text-base md:text-lg text-brand-green font-bold flex items-center gap-2">
              <Info className="h-5 w-5" />
              What is DSCR?
            </h3>
            <p className="text-sm text-brand-blue/80 mt-2">
              <strong>Debt Service Coverage Ratio (DSCR)</strong> compares a property’s <em>Net Operating Income (NOI)</em> to its
              annual debt payments. DSCR = NOI ÷ Annual Debt Service. A DSCR of <strong>1.20</strong> means the property produces
              20% more income than required to cover the debt. Lenders often set a minimum DSCR and may <em>stress test</em> the
              interest rate to ensure resilience.
            </p>
            <ul className="list-disc ml-5 text-sm text-brand-blue/80 mt-2 space-y-1">
              <li>For many <em>1–4 unit</em> rentals, lenders still rely on <strong>GDS/TDS</strong> + rental offset/add-back.</li>
              <li>For <em>multiplex / small commercial</em> (often 5+), <strong>DSCR-based underwriting</strong> is common.</li>
              <li>Policies vary by lender/product/insurer and can change — confirm specifics for your file.</li>
            </ul>
          </div>
          <aside className="rounded-xl border border-brand-gold/50 bg-brand-beige/40 p-3">
            <div className="text-xs md:text-sm text-brand-blue/80 flex items-center gap-2 font-semibold">
              <Shield className="h-4 w-4" /> Good to know
            </div>
            <ul className="text-sm text-brand-blue/80 mt-2 space-y-1">
              <li>NOI excludes mortgage, income taxes, and most non-cash items.</li>
              <li>Underwriting may impute management and capex reserves even if self-managed.</li>
              <li>Vacant units: some lenders use market rents; others exclude until leased.</li>
            </ul>
          </aside>
        </div>
      </section>

      {/* Quick DSCR Check */}
      <section id="quick-check" className="rounded-2xl border border-brand-gold bg-white p-4 md:p-5 mb-6">
        <h3 className="font-serif text-base md:text-lg text-brand-green font-bold flex items-center gap-2">
          <Calculator className="h-5 w-5" />
          Quick DSCR Check
        </h3>

        <div className="grid md:grid-cols-2 gap-4 mt-3">
          <div className="rounded-xl border border-brand-gold/50 p-3">
            <div className="grid grid-cols-2 gap-3">
              <LabeledMoney
                id="qc-noi"
                label="NOI (annual)"
                value={qc.noiAnnual}
                onChange={(v) => setQc({ ...qc, noiAnnual: v })}
              />
              <LabeledMoney
                id="qc-ds"
                label="Annual debt service"
                value={qc.annualDebtService}
                onChange={(v) => setQc({ ...qc, annualDebtService: v })}
              />
              <div className="col-span-2">
                <label className="text-[11px] text-brand-blue/70 mb-1 block">Show against threshold</label>
                <div className="flex gap-2 flex-wrap">
                  {["1.10", "1.20", "1.25"].map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setQc({ ...qc, showThreshold: t })}
                      className={classNames(
                        "px-3 py-1.5 rounded-full border",
                        qc.showThreshold === t
                          ? "border-brand-green bg-brand-beige/60 text-brand-green"
                          : "border-brand-gold text-brand-blue"
                      )}
                    >
                      {t}x
                    </button>
                  ))}
                  <input
                    value={qc.showThreshold}
                    onChange={(e) => setQc({ ...qc, showThreshold: e.target.value })}
                    className="border rounded-full px-3 py-1.5 w-[90px] text-center"
                    inputMode="decimal"
                    aria-label="Custom DSCR threshold"
                    title="Custom DSCR threshold"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-brand-gold/50 p-3">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>DSCR:</div>
              <div><strong>{(qcDerived.dscr || 0).toFixed(2)}x</strong></div>
              <div>Threshold:</div>
              <div><strong>{qcDerived.threshold.toFixed(2)}x</strong></div>
              <div>Status:</div>
              <div>
                <Pill ok={qcDerived.ok} label={qcDerived.ok ? "Meets threshold" : "Below threshold"} />
              </div>
              <div>Headroom:</div>
              <div>
                <strong>
                  {qcDerived.ds > 0 ? pct2(((qcDerived.noi / (qcDerived.threshold * qcDerived.ds)) - 1) * 100) : "0.00%"}
                </strong>{" "}
                vs. selected threshold
              </div>
            </div>
            <div className="text-[12px] text-brand-blue/70 mt-2">
              For decisions, lenders may apply a stress interest rate and different NOI adjustments.
            </div>
          </div>
        </div>
      </section>

      {/* Max Loan by DSCR */}
      <section id="max-loan" className="rounded-2xl border border-brand-gold bg-white p-4 md:p-5 mb-6">
        <h3 className="font-serif text-base md:text-lg text-brand-green font-bold flex items-center gap-2">
          <Calculator className="h-5 w-5" />
          Max Loan by DSCR (estimates)
        </h3>

        <div className="grid md:grid-cols-2 gap-4 mt-3">
          <div className="rounded-xl border border-brand-gold/50 p-3">
            <div className="grid grid-cols-2 gap-3">
              <LabeledMoney
                id="mx-noi"
                label="NOI (annual)"
                value={mx.noiAnnual}
                onChange={(v) => setMx({ ...mx, noiAnnual: v })}
              />
              <LabeledNumber
                id="mx-min"
                label="Minimum DSCR"
                value={mx.minDSCR}
                onChange={(v) => setMx({ ...mx, minDSCR: v })}
              />
              <LabeledPercent
                id="mx-rate"
                label="Rate (annual %)"
                value={mx.ratePct}
                onChange={(v) => setMx({ ...mx, ratePct: v })}
              />
              <LabeledNumber
                id="mx-amort"
                label="Amortization (years)"
                value={mx.amortYears}
                onChange={(v) => setMx({ ...mx, amortYears: v })}
              />
              <div className="col-span-2 flex items-center gap-2">
                <label className="text-sm">
                  <input
                    type="checkbox"
                    checked={mx.ioOnly}
                    onChange={(e) => setMx({ ...mx, ioOnly: e.target.checked })}
                    className="mr-2 accent-brand-green"
                  />
                  Interest-only assumption
                </label>
              </div>
              <LabeledPercent
                id="mx-stress"
                label="Stress rate (optional)"
                value={mx.stressRatePct}
                onChange={(v) => setMx({ ...mx, stressRatePct: v })}
              />
            </div>
          </div>

          <div className="rounded-xl border border-brand-gold/50 p-3">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>Rate used:</div>
              <div><strong>{mxDerived.rateUsedPct.toFixed(2)}%</strong></div>
              <div>Max annual debt service:</div>
              <div><strong>{money0(mxDerived.maxAnnualDebtService || 0)}</strong></div>
              <div>Max loan (approx.):</div>
              <div><strong>{money0(mxDerived.maxLoan || 0)}</strong></div>
            </div>
            <div className="text-[12px] text-brand-blue/70 mt-2">
              Indicative only; actual loan sizing may also cap by LTV, borrower strength, market, and program rules.
            </div>
          </div>
        </div>
      </section>

      {/* Program snapshot (editable) */}
      <section id="programs" className="rounded-2xl border border-brand-gold bg-white p-4 md:p-5 mb-6">
        <h3 className="font-serif text-base md:text-lg text-brand-green font-bold flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Lender / Program Snapshot (edit as needed)
        </h3>

        <div className="hidden md:block mt-3">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-brand-beige/40 text-left">
                <th className="p-2 rounded-l-xl w-[24%]">Segment</th>
                <th className="p-2 w-[18%]">Typical min DSCR</th>
                <th className="p-2">Notes</th>
                <th className="p-2 rounded-r-xl w-[44px]"></th>
              </tr>
            </thead>
            <tbody>
              {matrix.map((r) => (
                <tr key={r.id} className="border-b border-brand-green/20">
                  <td className="p-2 align-top">
                    <input
                      value={r.segment}
                      onChange={(e) => setMatrix((m) => m.map((x) => x.id === r.id ? { ...x, segment: e.target.value } : x))}
                      className="w-full border rounded-lg p-2 bg-white"
                    />
                  </td>
                  <td className="p-2 align-top">
                    <input
                      value={r.typicalMin}
                      onChange={(e) => setMatrix((m) => m.map((x) => x.id === r.id ? { ...x, typicalMin: e.target.value } : x))}
                      className="w-full border rounded-lg p-2 bg-white"
                    />
                  </td>
                  <td className="p-2 align-top">
                    <input
                      value={r.notes}
                      onChange={(e) => setMatrix((m) => m.map((x) => x.id === r.id ? { ...x, notes: e.target.value } : x))}
                      className="w-full border rounded-lg p-2 bg-white"
                    />
                  </td>
                  <td className="p-2 align-top text-right">
                    <button
                      type="button"
                      onClick={() => removeProgramRow(r.id)}
                      title="Remove row"
                      aria-label="Remove row"
                      className="inline-flex items-center justify-center p-1.5 rounded-md text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="mt-3">
            <button
              type="button"
              onClick={addProgramRow}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-brand-gold/70 text-brand-blue hover:bg-brand-beige/60"
            >
              <PlusCircle className="h-4 w-4" />
              Add row
            </button>
          </div>
        </div>

        {/* Mobile cards */}
        <div className="md:hidden grid gap-2 mt-3">
          {matrix.map((r) => (
            <div key={r.id} className="relative rounded-xl border border-brand-gold/50 bg-white p-3">
              <button
                type="button"
                onClick={() => removeProgramRow(r.id)}
                className="absolute right-2 top-2 p-1 rounded-md text-red-600 hover:bg-red-50"
                aria-label="Remove row"
                title="Remove row"
              >
                <Trash2 className="h-4 w-4" />
              </button>
              <div className="grid gap-2">
                <div>
                  <div className="text-[11px] text-brand-blue/70">Segment</div>
                  <input
                    value={r.segment}
                    onChange={(e) => setMatrix((m) => m.map((x) => x.id === r.id ? { ...x, segment: e.target.value } : x))}
                    className="w-full border rounded-lg p-2"
                  />
                </div>
                <div>
                  <div className="text-[11px] text-brand-blue/70">Typical min DSCR</div>
                  <input
                    value={r.typicalMin}
                    onChange={(e) => setMatrix((m) => m.map((x) => x.id === r.id ? { ...x, typicalMin: e.target.value } : x))}
                    className="w-full border rounded-lg p-2"
                  />
                </div>
                <div>
                  <div className="text-[11px] text-brand-blue/70">Notes</div>
                  <input
                    value={r.notes}
                    onChange={(e) => setMatrix((m) => m.map((x) => x.id === r.id ? { ...x, notes: e.target.value } : x))}
                    className="w-full border rounded-lg p-2"
                  />
                </div>
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={addProgramRow}
            className="inline-flex items-center justify-center gap-2 px-3 py-1.5 rounded-full border border-brand-gold/70 text-brand-blue hover:bg-brand-beige/60"
          >
            <PlusCircle className="h-4 w-4" /> Add row
          </button>
        </div>
      </section>

      {/* Checklist */}
      <section id="checklist" className="rounded-2xl border border-brand-gold bg-white p-4 md:p-5">
        <h3 className="font-serif text-base md:text-lg text-brand-green font-bold flex items-center gap-2">
          <ListChecks className="h-5 w-5" />
          What to confirm with your lender
        </h3>

        {/* Desktop table */}
        <div className="hidden md:block mt-3">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-brand-beige/40 text-left">
                <th className="p-2 rounded-l-xl w-[44px]">Done</th>
                <th className="p-2">Item</th>
                <th className="p-2 w-[40%]">Notes</th>
                <th className="p-2 rounded-r-xl w-[44px]"></th>
              </tr>
            </thead>
            <tbody>
              {filteredList.map((i) => (
                <tr key={i.id} className="border-b border-brand-green/20">
                  <td className="p-2 align-top">
                    <input
                      type="checkbox"
                      className="h-4 w-4 accent-brand-green"
                      checked={i.done}
                      onChange={() => setList((prev) => prev.map((x) => x.id === i.id ? { ...x, done: !x.done } : x))}
                    />
                  </td>
                  <td className="p-2 align-top">
                    <input
                      value={i.text}
                      onChange={(e) => setList((prev) => prev.map((x) => x.id === i.id ? { ...x, text: e.target.value } : x))}
                      className="w-full border rounded-lg p-2 bg-white"
                    />
                  </td>
                  <td className="p-2 align-top">
                    <input
                      value={i.note || ""}
                      onChange={(e) => setList((prev) => prev.map((x) => x.id === i.id ? { ...x, note: e.target.value } : x))}
                      className="w-full border rounded-lg p-2 bg-white"
                      placeholder="Add a note, contact, or link…"
                    />
                  </td>
                  <td className="p-2 align-top text-right">
                    {i.isCustom && (
                      <button
                        type="button"
                        onClick={() => removeChecklist(i.id)}
                        className="inline-flex items-center justify-center p-1.5 rounded-md text-red-600 hover:bg-red-50"
                        aria-label="Remove item"
                        title="Remove item"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="mt-3">
            <button
              type="button"
              onClick={addChecklist}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-brand-gold/70 text-brand-blue hover:bg-brand-beige/60"
            >
              <PlusCircle className="h-4 w-4" />
              Add checklist item
            </button>
          </div>
        </div>

        {/* Mobile cards */}
        <div className="md:hidden grid gap-2 mt-3">
          {filteredList.map((i) => (
            <div key={i.id} className="relative rounded-xl border border-brand-gold/50 bg-white p-3">
              {i.isCustom && (
                <button
                  type="button"
                  onClick={() => removeChecklist(i.id)}
                  className="absolute right-2 top-2 p-1 rounded-md text-red-600 hover:bg-red-50"
                  aria-label="Remove item"
                  title="Remove item"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={i.done}
                  onChange={() => setList((prev) => prev.map((x) => x.id === i.id ? { ...x, done: !x.done } : x))}
                  className="mt-1 h-4 w-4 accent-brand-green"
                />
                <div className="flex-1">
                  <input
                    value={i.text}
                    onChange={(e) => setList((prev) => prev.map((x) => x.id === i.id ? { ...x, text: e.target.value } : x))}
                    className="w-full border rounded-lg p-2"
                  />
                  <div className="text-[11px] text-brand-blue/70 mt-2">Notes</div>
                  <input
                    value={i.note || ""}
                    onChange={(e) => setList((prev) => prev.map((x) => x.id === i.id ? { ...x, note: e.target.value } : x))}
                    className="w-full border rounded-lg p-2"
                    placeholder="Add a note, contact, or link…"
                  />
                </div>
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={addChecklist}
            className="inline-flex items-center justify-center gap-2 px-3 py-1.5 rounded-full border border-brand-gold/70 text-brand-blue hover:bg-brand-beige/60"
          >
            <PlusCircle className="h-4 w-4" /> Add checklist item
          </button>
        </div>
      </section>

      {/* Helpful links / CTA */}
      <section className="rounded-2xl border border-brand-gold bg-white p-4 md:p-5 mt-6">
        <h4 className="font-serif text-base md:text-lg text-brand-green font-bold mb-2">
          Next steps & helpful tools
        </h4>
        <ul className="list-disc ml-5 text-sm space-y-1">
          <li>
            Analyze your multiplex:{" "}
            <Link href="/en/tools/multiplex-readiness#deal-analyzer" className="underline">
              Deal Analyzer
            </Link>
          </li>
          <li>
            Check affordability & payments:{" "}
            <Link href="/en/tools/affordability-stress-test" className="underline">
              Affordability & Stress Test
            </Link>{" "}
            •{" "}
            <Link href="/en/tools/mortgage-calculator" className="underline">
              Mortgage Payment Calculator
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
          This page is educational and general. Lender rules and underwriting policies vary and change.
          Confirm specifics with your broker/lender and professional advisors.
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

// ---------- Reusable labeled inputs ----------
function LabeledMoney({
  id, label, value, onChange,
}: { id?: string; label: string; value: string; onChange: (v: string) => void; }) {
  return (
    <div className="flex flex-col">
      <label htmlFor={id} className="text-[11px] text-brand-blue/70 mb-1">{label}</label>
      <div className="relative">
        <span className="absolute left-2 top-1/2 -translate-y-1/2 text-sm text-brand-blue/60">$</span>
        <input
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value.replace(/[^\d.,-]/g, ""))}
          inputMode="decimal"
          className="border rounded-lg p-2 pl-6 w-full bg-white text-right"
          placeholder="0"
        />
      </div>
    </div>
  );
}

function LabeledPercent({
  id, label, value, onChange,
}: { id?: string; label: string; value: string; onChange: (v: string) => void; }) {
  return (
    <div className="flex flex-col">
      <label htmlFor={id} className="text-[11px] text-brand-blue/70 mb-1">{label}</label>
      <div className="relative">
        <input
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value.replace(/[^\d.,-]/g, ""))}
          inputMode="decimal"
          className="border rounded-lg p-2 pr-8 w-full bg-white text-right"
          placeholder="0.00"
        />
        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-brand-blue/60">%</span>
      </div>
    </div>
  );
}

function LabeledNumber({
  id, label, value, onChange,
}: { id?: string; label: string; value: string; onChange: (v: string) => void; }) {
  return (
    <div className="flex flex-col">
      <label htmlFor={id} className="text-[11px] text-brand-blue/70 mb-1">{label}</label>
      <input
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value.replace(/[^\d.,-]/g, ""))}
        inputMode="decimal"
        className="border rounded-lg p-2 w-full bg-white text-right"
        placeholder="0"
      />
    </div>
  );
}
