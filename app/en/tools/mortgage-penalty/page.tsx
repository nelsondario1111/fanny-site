"use client";

import { useEffect, useMemo, useState } from "react";
import ToolShell from "@/components/ToolShell";
import { FaPrint, FaFileCsv } from "react-icons/fa";

/* =========================================================
   Types & constants
   ========================================================= */
type MortgageType = "fixed" | "variable";

const TERM_MONTH_OPTIONS = [3, 6, 9, 12, 18, 24, 30, 36, 48, 60, 72];
const LS_KEY = "tools.mortgage_penalty_estimator.v1";

/* =========================================================
   Helpers
   ========================================================= */
function money(n: number, digits = 0) {
  return (Number.isFinite(n) ? n : 0).toLocaleString("en-CA", {
    style: "currency",
    currency: "CAD",
    maximumFractionDigits: digits,
  });
}
/** Robust CSV (quotes + CRLF + BOM for Excel) */
function toCSV(rows: Array<Array<string | number>>) {
  const esc = (v: string | number) => {
    const s = String(v ?? "");
    const needs = /[",\n]/.test(s);
    const q = s.replace(/"/g, '""');
    return needs ? `"${q}"` : q;
  };
  return rows.map((r) => r.map(esc).join(",")).join("\r\n");
}
function downloadCSV(baseName: string, rows: Array<Array<string | number>>) {
  const iso = new Date().toISOString().slice(0, 10);
  const csv = toCSV(rows);
  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${baseName}_${iso}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

/** Month helper (whole months, floor; clamp ≥ 0) */
function monthsBetween(fromISO: string, toISO: string) {
  const a = new Date(fromISO);
  const b = new Date(toISO);
  if (Number.isNaN(+a) || Number.isNaN(+b)) return 0;
  let months = (b.getFullYear() - a.getFullYear()) * 12 + (b.getMonth() - a.getMonth());
  if (b.getDate() < a.getDate()) months -= 1;
  return Math.max(0, months);
}

/* Core penalty formulas (simplified, lender methods vary) */
function threeMonthInterest(balance: number, annualRatePct: number) {
  const i = Math.max(0, annualRatePct) / 100;
  return Math.max(0, balance) * i * (3 / 12);
}
/** IRD (simple interest-rate-differential): balance × (contract − comparison) × (remainingMonths ÷ 12) */
function irdSimple(
  balance: number,
  contractRatePct: number,
  comparisonRatePct: number,
  remainingMonths: number
) {
  const diff = Math.max(0, contractRatePct - comparisonRatePct) / 100;
  return (Math.max(0, balance) * diff * Math.max(0, remainingMonths)) / 12;
}

/* =========================================================
   Page
   ========================================================= */
export default function Page() {
  // Inputs
  const [mortgageType, setMortgageType] = useState<MortgageType>("fixed");
  const [outstandingBalance, setOutstandingBalance] = useState<number>(520_000);
  const [prepayAmount, setPrepayAmount] = useState<number>(0); // one-time prepayment before breaking
  const [contractRatePct, setContractRatePct] = useState<number>(4.89); // original/contract annual rate

  const [remainingMonths, setRemainingMonths] = useState<number>(24);
  const [useMaturityDate, setUseMaturityDate] = useState<boolean>(false);
  const [maturityISO, setMaturityISO] = useState<string>(""); // yyyy-mm-dd

  const [comparisonRatePct, setComparisonRatePct] = useState<number>(3.39); // lender’s comparable rate
  const [adminFee, setAdminFee] = useState<number>(300); // discharge/processing fee (optional)

  // Restore saved state
  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (!raw) return;
      const v = JSON.parse(raw);
      if (v && typeof v === "object") {
        setMortgageType(v.mortgageType ?? "fixed");
        setOutstandingBalance(Number(v.outstandingBalance ?? 520_000));
        setPrepayAmount(Number(v.prepayAmount ?? 0));
        setContractRatePct(Number(v.contractRatePct ?? 4.89));
        setRemainingMonths(Number(v.remainingMonths ?? 24));
        setUseMaturityDate(Boolean(v.useMaturityDate ?? false));
        setMaturityISO(String(v.maturityISO ?? ""));
        setComparisonRatePct(Number(v.comparisonRatePct ?? 3.39));
        setAdminFee(Number(v.adminFee ?? 300));
      }
    } catch {
      // ignore
    }
  }, []);

  // Persist state
  useEffect(() => {
    try {
      localStorage.setItem(
        LS_KEY,
        JSON.stringify({
          mortgageType,
          outstandingBalance,
          prepayAmount,
          contractRatePct,
          remainingMonths,
          useMaturityDate,
          maturityISO,
          comparisonRatePct,
          adminFee,
        })
      );
    } catch {
      // ignore
    }
  }, [
    mortgageType,
    outstandingBalance,
    prepayAmount,
    contractRatePct,
    remainingMonths,
    useMaturityDate,
    maturityISO,
    comparisonRatePct,
    adminFee,
  ]);

  // Auto-calc months from maturity date (optional)
  const monthsFromDate = useMemo(() => {
    if (!useMaturityDate || !maturityISO) return null;
    const todayISO = new Date().toISOString().slice(0, 10);
    return monthsBetween(todayISO, maturityISO);
  }, [useMaturityDate, maturityISO]);

  const effRemainingMonths = monthsFromDate ?? remainingMonths;

  const printDate = new Date().toLocaleDateString("en-CA", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Derived
  const {
    effectiveBalance,
    penalty3mo,
    penaltyIRD,
    basePenalty,
    totalWithFees,
  } = useMemo(() => {
    const effectiveBalance = Math.max(0, (outstandingBalance || 0) - Math.max(0, prepayAmount || 0));

    const p3 = threeMonthInterest(effectiveBalance, contractRatePct || 0);
    const ird = irdSimple(
      effectiveBalance,
      contractRatePct || 0,
      comparisonRatePct || 0,
      effRemainingMonths || 0
    );

    // Lender rule of thumb (rendered directly in UI by type)
    const base = mortgageType === "fixed" ? Math.max(ird, p3) : p3;

    const total = Math.max(0, base) + Math.max(0, adminFee || 0);

    return {
      effectiveBalance,
      penalty3mo: p3,
      penaltyIRD: ird,
      basePenalty: base,
      totalWithFees: total,
    };
  }, [
    mortgageType,
    outstandingBalance,
    prepayAmount,
    contractRatePct,
    comparisonRatePct,
    effRemainingMonths,
    adminFee,
  ]);

  /* -----------------------------
     Actions
     ----------------------------- */
  function handlePrint() {
    window.print(); // users can choose “Save as PDF”
  }

  function exportCSV() {
    const rows: Array<Array<string | number>> = [
      ["Prepared", printDate],
      ["Mortgage Type", mortgageType === "fixed" ? "Fixed" : "Variable"],
      ["Outstanding Balance", outstandingBalance.toFixed(2)],
      ["One-time Prepayment Applied", prepayAmount.toFixed(2)],
      ["Effective Balance Used", effectiveBalance.toFixed(2)],
      ["Contract Rate (%)", contractRatePct.toFixed(2)],
      ["Remaining Term (months)", effRemainingMonths],
      ["Used Maturity Date?", useMaturityDate ? "Yes" : "No"],
      ["Maturity Date (ISO)", maturityISO || "—"],
      ["Comparison Rate for IRD (%)", comparisonRatePct.toFixed(2)],
      ["—", "—"],
      ["3-Month Interest Penalty", penalty3mo.toFixed(2)],
      ["IRD (Simple) Penalty", penaltyIRD.toFixed(2)],
      ["Base Penalty (per lender rule)", basePenalty.toFixed(2)],
      ["Admin/Discharge Fee", (adminFee || 0).toFixed(2)],
      ["Estimated Total", totalWithFees.toFixed(2)],
      ["—", "—"],
      ["Notes", "Results are estimates; lender methods vary (posted vs discounted, day-count, privileges)."],
    ];
    downloadCSV("mortgage_penalty_estimate", rows);
  }

  function resetExample() {
    setMortgageType("fixed");
    setOutstandingBalance(520_000);
    setPrepayAmount(0);
    setContractRatePct(4.89);
    setRemainingMonths(24);
    setUseMaturityDate(false);
    setMaturityISO("");
    setComparisonRatePct(3.39);
    setAdminFee(300);
  }

  /* -----------------------------
     Render
     ----------------------------- */
  return (
    <ToolShell
      title="Mortgage Penalty Estimator"
      subtitle="Estimate early-payout penalties using 3-month interest and a simple IRD model. Apply a one-time prepayment, or auto-calc months from a maturity date. Export CSV or a branded printout."
      lang="en"
    >
      {/* Toolbar */}
      <div className="flex flex-wrap gap-2 items-center justify-end mb-4 print:hidden">
        <button
          type="button"
          onClick={handlePrint}
          className="px-4 py-2 bg-brand-blue text-white rounded-full inline-flex items-center gap-2 hover:bg-brand-gold hover:text-brand-green transition"
          title="Open print dialog (choose 'Save as PDF')"
        >
          <FaPrint aria-hidden /> Print / Save as PDF
        </button>
        <button
          type="button"
          onClick={exportCSV}
          className="px-4 py-2 bg-white border-2 border-brand-blue text-brand-blue rounded-full inline-flex items-center gap-2 hover:bg-brand-blue hover:text-white transition"
          title="Export a summary of your inputs and results"
        >
          <FaFileCsv aria-hidden /> Export CSV
        </button>
        <button
          type="button"
          onClick={resetExample}
          className="px-4 py-2 bg-white border-2 border-brand-gold text-brand-gold rounded-full inline-flex items-center gap-2 hover:bg-brand-gold hover:text-brand-green transition"
          title="Reset to sample values"
        >
          Reset Example
        </button>
      </div>

      {/* Inputs */}
      <form className="grid xl:grid-cols-3 gap-6">
        {/* Mortgage Basics */}
        <section className="rounded-2xl border border-brand-gold bg-white p-5 grid gap-3">
          <h3 className="font-serif text-lg text-brand-green font-bold">Mortgage Basics</h3>

          <div>
            <label className="block text-sm font-medium text-brand-blue mb-1">Mortgage Type</label>
            <div className="flex gap-4">
              <label className="inline-flex items-center gap-2">
                <input
                  type="radio"
                  name="mortType"
                  checked={mortgageType === "fixed"}
                  onChange={() => setMortgageType("fixed")}
                />
                <span>Fixed</span>
              </label>
              <label className="inline-flex items-center gap-2">
                <input
                  type="radio"
                  name="mortType"
                  checked={mortgageType === "variable"}
                  onChange={() => setMortgageType("variable")}
                />
                <span>Variable</span>
              </label>
            </div>
            <p className="text-xs text-brand-blue/70 mt-1">
              {mortgageType === "fixed"
                ? "For fixed-rate mortgages, lenders typically charge the greater of IRD or 3 months’ interest."
                : "For variable-rate mortgages, lenders typically charge 3 months’ interest."}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-brand-blue mb-1">Outstanding Balance (CAD)</label>
            <input
              type="number"
              min={0}
              step={1}
              inputMode="decimal"
              className="w-full rounded-xl border border-brand-gold/60 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-gold"
              value={outstandingBalance}
              onChange={(e) => setOutstandingBalance(Number(e.target.value || 0))}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-brand-blue mb-1">Contract Rate (Annual %)</label>
              <input
                type="number"
                min={0}
                max={25}
                step={0.01}
                inputMode="decimal"
                className="w-full rounded-xl border border-brand-gold/60 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-gold"
                value={contractRatePct}
                onChange={(e) => setContractRatePct(Number(e.target.value || 0))}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-brand-blue mb-1">One-time Prepayment Before Break (CAD)</label>
              <input
                type="number"
                min={0}
                step={1}
                inputMode="decimal"
                className="w-full rounded-xl border border-brand-gold/60 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-gold"
                value={prepayAmount}
                onChange={(e) => setPrepayAmount(Number(e.target.value || 0))}
              />
              <p className="text-xs text-brand-blue/70 mt-1">
                If your product allows a prepayment (e.g., 10–20%), entering it here reduces the balance used in the penalty.
              </p>
            </div>
          </div>
        </section>

        {/* Term / Maturity */}
        <section className="rounded-2xl border border-brand-gold bg-white p-5">
          <h3 className="font-serif text-lg text-brand-green font-bold mb-2">Remaining Term</h3>

          <div className="rounded-xl border border-brand-gold/40 bg-brand-beige/40 p-3">
            <label className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                checked={useMaturityDate}
                onChange={(e) => setUseMaturityDate(e.target.checked)}
              />
              <span className="font-medium text-brand-green">Use maturity date to auto-calc months</span>
            </label>

            <div className="grid sm:grid-cols-2 gap-3 mt-2">
              <div>
                <label className="block text-sm font-medium text-brand-blue mb-1">Maturity Date</label>
                <input
                  type="date"
                  className="w-full rounded-xl border border-brand-gold/60 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-gold"
                  value={maturityISO}
                  onChange={(e) => setMaturityISO(e.target.value)}
                  disabled={!useMaturityDate}
                />
                {useMaturityDate && maturityISO && (
                  <p className="text-xs text-brand-blue/70 mt-1">
                    Computed months remaining: <b>{monthsFromDate}</b>
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-brand-blue mb-1">
                  Remaining Term (months) {useMaturityDate && "(override)"}
                </label>
                <select
                  className="w-full rounded-xl border border-brand-gold/60 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-gold"
                  value={remainingMonths}
                  onChange={(e) => setRemainingMonths(Number(e.target.value))}
                  disabled={useMaturityDate}
                >
                  {TERM_MONTH_OPTIONS.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                  {!TERM_MONTH_OPTIONS.includes(remainingMonths) && (
                    <option value={remainingMonths}>Custom: {remainingMonths}</option>
                  )}
                </select>
                <input
                  type="number"
                  min={1}
                  step={1}
                  className="mt-2 w-full rounded-xl border border-brand-gold/60 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-gold"
                  value={remainingMonths}
                  onChange={(e) => setRemainingMonths(Number(e.target.value || 0))}
                  aria-label="Custom remaining term in months"
                  disabled={useMaturityDate}
                />
              </div>
            </div>
          </div>
        </section>

        {/* IRD Inputs */}
        <section className="rounded-2xl border border-brand-gold bg-white p-5">
          <h3 className="font-serif text-lg text-brand-green font-bold mb-2">IRD (Simple) Inputs</h3>
          <p className="text-sm text-brand-blue/80 mb-3">
            IRD estimates can vary by lender. We use:{" "}
            <b>Effective Balance × (Contract − Comparison) × (Remaining Months ÷ 12)</b>.
            For a closer estimate, enter your lender’s current comparable rate for the remaining term.
          </p>

          <div className="grid md:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-brand-blue mb-1">Comparison Rate (% per year)</label>
              <input
                type="number"
                min={0}
                max={25}
                step={0.01}
                inputMode="decimal"
                className="w-full rounded-xl border border-brand-gold/60 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-gold"
                value={comparisonRatePct}
                onChange={(e) => setComparisonRatePct(Number(e.target.value || 0))}
              />
              <p className="text-xs text-brand-blue/70 mt-1">
                Often the lender’s posted/discounted rate for a term matching your remaining months.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-brand-blue mb-1">
                Admin / Discharge Fee (optional, CAD)
              </label>
              <input
                type="number"
                min={0}
                inputMode="decimal"
                className="w-full rounded-xl border border-brand-gold/60 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-gold"
                value={adminFee}
                onChange={(e) => setAdminFee(Number(e.target.value || 0))}
              />
              <p className="text-xs text-brand-blue/70 mt-1">
                Some lenders add a fixed processing or discharge fee.
              </p>
            </div>
          </div>
        </section>
      </form>

      {/* Quick results */}
      <section className="mt-8 rounded-2xl border border-brand-gold bg-white p-5 avoid-break">
        <h3 className="font-serif text-lg text-brand-green font-bold mb-2">Quick Results</h3>
        <div className="grid md:grid-cols-2 gap-3 text-sm">
          <div className="flex justify-between">
            <span>Effective Balance (after prepayment)</span>
            <span className="font-medium">{money(effectiveBalance)}</span>
          </div>
          <div className="flex justify-between">
            <span>Remaining Term Used</span>
            <span className="font-medium">{effRemainingMonths} months</span>
          </div>
          <div className="flex justify-between">
            <span>3-Month Interest</span>
            <span className="font-medium">{money(penalty3mo)}</span>
          </div>
          <div className="flex justify-between">
            <span>IRD (Simple)</span>
            <span className="font-medium">{money(penaltyIRD)}</span>
          </div>
          <div className="flex justify-between border-t pt-2 mt-2">
            <span>Base Penalty (per rule above)</span>
            <span className="font-semibold">{money(basePenalty)}</span>
          </div>
          <div className="flex justify-between">
            <span>Admin / Discharge Fee</span>
            <span className="font-medium">{money(adminFee || 0)}</span>
          </div>
          <div className="flex justify-between">
            <span>Estimated Total</span>
            <span className="font-semibold">{money(totalWithFees)}</span>
          </div>
        </div>

        <details className="mt-4 rounded-2xl border border-brand-gold/40 bg-brand-beige/40 p-4">
          <summary className="cursor-pointer font-semibold text-brand-green">Assumptions & Notes</summary>
          <ul className="list-disc ml-5 mt-2 text-sm text-brand-blue/80 space-y-1">
            <li>
              <b>3-Month Interest</b> = Effective Balance × Contract Rate × (3/12).
            </li>
            <li>
              <b>IRD (simple)</b> = Effective Balance × (Contract − Comparison) × (Remaining Months ÷ 12).
            </li>
            <li>
              Lenders may use posted vs. discounted rate methods, exact day-counts, amortization left, or other rules. Your agreement governs.
            </li>
            <li>
              Prepayment privileges vary (and may reset annually). Some products (open, blend-and-extend, portability) can change or reduce penalties.
            </li>
            <li>This tool is an estimate and not financial advice.</li>
          </ul>
        </details>
      </section>

      {/* Print header (only when printing) */}
      <div className="hidden print:block mt-6 mb-3 text-center">
        <div className="font-serif font-bold text-brand-green text-2xl">Mortgage Penalty — Estimate</div>
        <div className="text-xs text-brand-blue">Prepared {printDate}</div>
        <div className="w-16 h-[2px] bg-brand-gold rounded-full mx-auto mt-2" />
      </div>

      {/* Comparison panels */}
      <div className="mt-8 grid lg:grid-cols-2 gap-6">
        <section className="rounded-2xl border border-brand-gold bg-white p-5 avoid-break">
          <h3 className="font-serif text-xl text-brand-green font-bold mb-2">3-Month Interest Detail</h3>
          <p className="text-sm text-brand-blue/80 mb-2">
            Typically used for variable-rate mortgages or when it’s greater for fixed-rate penalties.
          </p>
          <div className="text-sm space-y-1">
            <div className="flex justify-between">
              <span>Effective Balance</span>
              <span className="font-medium">{money(effectiveBalance)}</span>
            </div>
            <div className="flex justify-between">
              <span>Contract Rate</span>
              <span className="font-medium">{contractRatePct.toFixed(2)}%</span>
            </div>
            <div className="flex justify-between">
              <span>Penalty (3 months)</span>
              <span className="font-semibold">{money(penalty3mo)}</span>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-brand-gold bg-white p-5 avoid-break">
          <h3 className="font-serif text-xl text-brand-green font-bold mb-2">IRD (Simple) Detail</h3>
          <p className="text-sm text-brand-blue/80 mb-2">
            This estimate compares your contract rate to a current comparable term rate.
          </p>
          <div className="text-sm space-y-1">
            <div className="flex justify-between">
              <span>Effective Balance</span>
              <span className="font-medium">{money(effectiveBalance)}</span>
            </div>
            <div className="flex justify-between">
              <span>Contract Rate</span>
              <span className="font-medium">{contractRatePct.toFixed(2)}%</span>
            </div>
            <div className="flex justify-between">
              <span>Comparison Rate</span>
              <span className="font-medium">{comparisonRatePct.toFixed(2)}%</span>
            </div>
            <div className="flex justify-between">
              <span>Remaining Term</span>
              <span className="font-medium">{effRemainingMonths} months</span>
            </div>
            <div className="flex justify-between">
              <span>Penalty (IRD)</span>
              <span className="font-semibold">{money(penaltyIRD)}</span>
            </div>
          </div>
        </section>
      </div>

      {/* Print styles */}
      <style jsx global>{`
        @media print {
          .print\\:hidden { display: none !important; }
          main { background: white !important; }
          .avoid-break { break-inside: avoid; page-break-inside: avoid; }
        }
      `}</style>
    </ToolShell>
  );
}
