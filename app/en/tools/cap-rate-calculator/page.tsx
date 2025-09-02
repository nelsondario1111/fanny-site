"use client";

import { useMemo, useState } from "react";
import ToolShell from "@/components/ToolShell";
import { FaPrint, FaFileCsv } from "react-icons/fa";

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
function pct(n: number) {
  return `${(n * 100).toFixed(2)}%`;
}
/** Monthly payment for a fully-amortizing loan */
function monthlyPayment(P: number, annualRatePct: number, years: number) {
  const n = Math.max(1, Math.round(years * 12));
  const i = Math.max(0, annualRatePct) / 100 / 12;
  if (i === 0) return P / n;
  return P * (i * Math.pow(1 + i, n)) / (Math.pow(1 + i, n) - 1);
}
// Robust CSV (quotes + CRLF + BOM)
function toCSV(rows: Array<Array<string | number>>) {
  const esc = (v: string | number) => {
    const s = String(v ?? "");
    const needs = /[",\n]/.test(s);
    const q = s.replace(/"/g, '""');
    return needs ? `"${q}"` : q;
  };
  return rows.map(r => r.map(esc).join(",")).join("\r\n");
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

/* =========================================================
   Page
   ========================================================= */
export default function Page() {
  // Purchase & project costs
  const [purchasePrice, setPurchasePrice] = useState<number>(850_000);
  const [closingCosts, setClosingCosts] = useState<number>(15_000);
  const [renoBudget, setRenoBudget] = useState<number>(5_000);

  // NOI input (direct), with an optional helper to build NOI
  const [noiAnnual, setNoiAnnual] = useState<number>(45_000);

  // NOI helper inputs (collapsed section)
  const [grossRentMonthly, setGrossRentMonthly] = useState<number>(4_500);
  const [vacancyPct, setVacancyPct] = useState<number>(4);
  const [otherIncomeMonthly, setOtherIncomeMonthly] = useState<number>(150);
  const [fixedExpensesMonthly, setFixedExpensesMonthly] = useState<number>(950); // taxes+ins+utils+hoa...
  const [variableExpensePctGPR, setVariableExpensePctGPR] = useState<number>(15); // mgmt+maint+capex as % of GPR

  // Financing (optional; used for levered metrics)
  const [downPct, setDownPct] = useState<number>(25);
  const [ratePct, setRatePct] = useState<number>(5.50);
  const [amortYears, setAmortYears] = useState<number>(25);

  const printDate = new Date().toLocaleDateString("en-CA", { year: "numeric", month: "long", day: "numeric" });

  /* -----------------------------
     Derived: helper NOI
     ----------------------------- */
  const helperNOI = useMemo(() => {
    const gprAnnual = (grossRentMonthly || 0) * 12;
    const vacancyLoss = gprAnnual * Math.max(0, vacancyPct) / 100;
    const otherInc = (otherIncomeMonthly || 0) * 12;
    const fixedAnnual = (fixedExpensesMonthly || 0) * 12;
    const variableAnnual = gprAnnual * Math.max(0, variableExpensePctGPR) / 100;
    const noi = gprAnnual - vacancyLoss + otherInc - fixedAnnual - variableAnnual;
    return Math.max(0, noi);
  }, [grossRentMonthly, vacancyPct, otherIncomeMonthly, fixedExpensesMonthly, variableExpensePctGPR]);

  /* -----------------------------
     Derived: project + financing + returns
     ----------------------------- */
  const {
    totalProjectCost,
    loanAmount,
    cashInvested,
    capRate,
    yieldOnCost,
    adsAnnual,
    dscr,
    leveredCF,
    cashOnCash,
    debtYield,
  } = useMemo(() => {
    const totalProjectCost = (purchasePrice || 0) + (closingCosts || 0) + (renoBudget || 0);

    const dpDec = Math.min(Math.max(downPct / 100, 0), 1);
    const loanAmount = Math.max(0, (purchasePrice || 0) * (1 - dpDec));
    const cashInvested = (purchasePrice || 0) * dpDec + (closingCosts || 0) + (renoBudget || 0);

    const capRate = purchasePrice > 0 ? (noiAnnual || 0) / purchasePrice : 0;
    const yieldOnCost = totalProjectCost > 0 ? (noiAnnual || 0) / totalProjectCost : 0;

    const mPmt = monthlyPayment(loanAmount, Math.max(0, ratePct), Math.max(1, amortYears));
    const adsAnnual = loanAmount > 0 ? mPmt * 12 : 0;
    const dscr = adsAnnual > 0 ? (noiAnnual || 0) / adsAnnual : NaN;

    const leveredCF = (noiAnnual || 0) - adsAnnual;
    const cashOnCash = cashInvested > 0 ? leveredCF / cashInvested : 0;

    const debtYield = loanAmount > 0 ? (noiAnnual || 0) / loanAmount : NaN;

    return {
      totalProjectCost,
      loanAmount,
      cashInvested,
      capRate,
      yieldOnCost,
      adsAnnual,
      dscr,
      leveredCF,
      cashOnCash,
      debtYield,
    };
  }, [purchasePrice, closingCosts, renoBudget, noiAnnual, downPct, ratePct, amortYears]);

  /* -----------------------------
     Actions
     ----------------------------- */
  function handlePrint() {
    window.print(); // users pick “Save as PDF”
  }
  function exportCSV() {
    const rows: Array<Array<string | number>> = [
      ["Key", "Value"],
      ["Prepared", printDate],
      ["Purchase Price", purchasePrice.toFixed(2)],
      ["Closing Costs", closingCosts.toFixed(2)],
      ["Initial Renovations (CapEx)", renoBudget.toFixed(2)],
      ["Total Project Cost", totalProjectCost.toFixed(2)],
      ["—", "—"],
      ["NOI (annual)", noiAnnual.toFixed(2)],
      ["Cap Rate (NOI / Price)", (capRate * 100).toFixed(2) + "%"],
      ["Yield on Cost (NOI / Project Cost)", (yieldOnCost * 100).toFixed(2) + "%"],
      ["—", "—"],
      ["Down Payment (%)", downPct.toFixed(2)],
      ["Loan Amount", loanAmount.toFixed(2)],
      ["Rate (%)", ratePct.toFixed(2)],
      ["Amortization (years)", amortYears],
      ["Annual Debt Service (ADS)", adsAnnual.toFixed(2)],
      ["DSCR (NOI ÷ ADS)", Number.isFinite(dscr) ? dscr.toFixed(2) : "—"],
      ["Levered Cash Flow (NOI − ADS)", leveredCF.toFixed(2)],
      ["Cash Invested", cashInvested.toFixed(2)],
      ["Cash-on-Cash", (cashOnCash * 100).toFixed(2) + "%"],
      ["Debt Yield (NOI ÷ Loan)", Number.isFinite(debtYield) ? (debtYield * 100).toFixed(2) + "%" : "—"],
      ["—", "—"],
      ["NOI Helper (if used)", helperNOI.toFixed(2)],
      ["Helper Inputs", "GPR monthly, vacancy %, other income monthly, fixed monthly, variable % of GPR"],
      ["GPR (monthly)", grossRentMonthly.toFixed(2)],
      ["Vacancy (%)", vacancyPct.toFixed(2)],
      ["Other Income (monthly)", otherIncomeMonthly.toFixed(2)],
      ["Fixed Expenses (monthly)", fixedExpensesMonthly.toFixed(2)],
      ["Variable (% of GPR)", variableExpensePctGPR.toFixed(2)],
    ];
    downloadCSV("cap_rate_cash_on_cash_summary", rows);
  }
  function useHelperNOI() {
    setNoiAnnual(Math.round(helperNOI));
  }
  function resetExample() {
    setPurchasePrice(850_000);
    setClosingCosts(15_000);
    setRenoBudget(5_000);
    setNoiAnnual(45_000);
    setGrossRentMonthly(4_500);
    setVacancyPct(4);
    setOtherIncomeMonthly(150);
    setFixedExpensesMonthly(950);
    setVariableExpensePctGPR(15);
    setDownPct(25);
    setRatePct(5.50);
    setAmortYears(25);
  }

  /* -----------------------------
     Render
     ----------------------------- */
  return (
    <ToolShell
      title="Cap Rate & Cash-on-Cash Return"
      subtitle="Evaluate opportunities using cap rate (unlevered), yield on cost, and levered returns with simple financing."
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
        {/* Purchase & Costs */}
        <section className="rounded-2xl border border-brand-gold bg-white p-5 grid gap-3">
          <h3 className="font-serif text-lg text-brand-green font-bold">Purchase & Project Costs</h3>
          <label className="block text-sm font-medium text-brand-blue mb-1">Purchase Price (CAD)</label>
          <input
            type="number"
            min={0}
            inputMode="decimal"
            className="w-full rounded-xl border border-brand-gold/60 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-gold"
            value={purchasePrice}
            onChange={(e) => setPurchasePrice(Number(e.target.value || 0))}
          />
          <label className="block text-sm font-medium text-brand-blue mt-2 mb-1">Closing Costs (CAD)</label>
          <input
            type="number"
            min={0}
            inputMode="decimal"
            className="w-full rounded-xl border border-brand-gold/60 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-gold"
            value={closingCosts}
            onChange={(e) => setClosingCosts(Number(e.target.value || 0))}
          />
          <label className="block text-sm font-medium text-brand-blue mt-2 mb-1">Initial Renovations / CapEx (CAD)</label>
          <input
            type="number"
            min={0}
            inputMode="decimal"
            className="w-full rounded-xl border border-brand-gold/60 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-gold"
            value={renoBudget}
            onChange={(e) => setRenoBudget(Number(e.target.value || 0))}
          />
          <div className="text-sm text-brand-blue/80 mt-2">
            <div className="flex justify-between"><span>Total Project Cost</span><span className="font-medium">{money((purchasePrice || 0) + (closingCosts || 0) + (renoBudget || 0))}</span></div>
          </div>
        </section>

        {/* NOI input + helper */}
        <section className="rounded-2xl border border-brand-gold bg-white p-5">
          <h3 className="font-serif text-lg text-brand-green font-bold mb-2">Net Operating Income (NOI)</h3>
          <label className="block text-sm font-medium text-brand-blue mb-1">NOI (annual, CAD)</label>
          <input
            type="number"
            min={0}
            inputMode="decimal"
            className="w-full rounded-xl border border-brand-gold/60 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-gold"
            value={noiAnnual}
            onChange={(e) => setNoiAnnual(Number(e.target.value || 0))}
          />
          <details className="mt-3 rounded-xl border border-brand-gold/40 bg-brand-beige/40 p-4">
            <summary className="cursor-pointer font-semibold text-brand-green">Need help estimating NOI?</summary>
            <div className="grid md:grid-cols-2 gap-3 mt-3 text-sm">
              <div>
                <label className="block text-sm font-medium text-brand-blue mb-1">Gross Rent (monthly)</label>
                <input
                  type="number"
                  min={0}
                  inputMode="decimal"
                  className="w-full rounded-xl border border-brand-gold/60 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-gold"
                  value={grossRentMonthly}
                  onChange={(e) => setGrossRentMonthly(Number(e.target.value || 0))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-brand-blue mb-1">Vacancy & Credit Loss (%)</label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  step={0.1}
                  inputMode="decimal"
                  className="w-full rounded-xl border border-brand-gold/60 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-gold"
                  value={vacancyPct}
                  onChange={(e) => setVacancyPct(Number(e.target.value || 0))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-brand-blue mb-1">Other Income (monthly)</label>
                <input
                  type="number"
                  min={0}
                  inputMode="decimal"
                  className="w-full rounded-xl border border-brand-gold/60 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-gold"
                  value={otherIncomeMonthly}
                  onChange={(e) => setOtherIncomeMonthly(Number(e.target.value || 0))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-brand-blue mb-1">Fixed Expenses (monthly)</label>
                <input
                  type="number"
                  min={0}
                  inputMode="decimal"
                  className="w-full rounded-xl border border-brand-gold/60 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-gold"
                  value={fixedExpensesMonthly}
                  onChange={(e) => setFixedExpensesMonthly(Number(e.target.value || 0))}
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-brand-blue mb-1">Variable Expenses (% of GPR)</label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  step={0.1}
                  inputMode="decimal"
                  className="w-full rounded-xl border border-brand-gold/60 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-gold"
                  value={variableExpensePctGPR}
                  onChange={(e) => setVariableExpensePctGPR(Number(e.target.value || 0))}
                />
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between text-sm">
              <div>
                <div>Helper NOI (annual): <b>{money(helperNOI)}</b></div>
                <div className="text-brand-blue/70">
                  NOI = GPR − vacancy + other income − fixed − variable (% of GPR)
                </div>
              </div>
              <button
                type="button"
                onClick={useHelperNOI}
                className="px-4 py-2 rounded-full border-2 border-brand-green text-brand-green hover:bg-brand-green hover:text-white transition"
              >
                Use this NOI
              </button>
            </div>
          </details>
        </section>

        {/* Financing (optional) */}
        <section className="rounded-2xl border border-brand-gold bg-white p-5">
          <h3 className="font-serif text-lg text-brand-green font-bold mb-2">Simple Financing (for levered returns)</h3>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-brand-blue mb-1">Down Payment (% of price)</label>
              <input
                type="number"
                min={0}
                max={100}
                step={0.1}
                inputMode="decimal"
                className="w-full rounded-xl border border-brand-gold/60 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-gold"
                value={downPct}
                onChange={(e) => setDownPct(Number(e.target.value || 0))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-brand-blue mb-1">Interest Rate (annual %)</label>
              <input
                type="number"
                min={0}
                max={25}
                step={0.01}
                inputMode="decimal"
                className="w-full rounded-xl border border-brand-gold/60 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-gold"
                value={ratePct}
                onChange={(e) => setRatePct(Number(e.target.value || 0))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-brand-blue mb-1">Amortization (years)</label>
              <select
                className="w-full rounded-xl border border-brand-gold/60 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-gold"
                value={amortYears}
                onChange={(e) => setAmortYears(Number(e.target.value))}
              >
                <option value={20}>20</option>
                <option value={25}>25</option>
                <option value={30}>30</option>
              </select>
            </div>
          </div>

          <div className="text-sm text-brand-blue/80 mt-3">
            <div className="flex justify-between"><span>Loan amount</span><span className="font-medium">{money(loanAmount)}</span></div>
            <div className="flex justify-between"><span>Cash invested</span><span className="font-medium">{money(cashInvested)}</span></div>
          </div>
        </section>
      </form>

      {/* Print header (only when printing) */}
      <div className="hidden print:block mt-6 mb-3 text-center">
        <div className="font-serif font-bold text-brand-green text-2xl">Cap Rate & Cash-on-Cash — Summary</div>
        <div className="text-xs text-brand-blue">Prepared {printDate}</div>
        <div className="w-16 h-[2px] bg-brand-gold rounded-full mx-auto mt-2" />
      </div>

      {/* Results */}
      <div className="mt-8 grid xl:grid-cols-3 gap-6">
        {/* Unlevered */}
        <section className="rounded-2xl border border-brand-gold bg-white p-5 avoid-break">
          <h3 className="font-serif text-xl text-brand-green font-bold mb-2">Unlevered Metrics</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span>NOI (annual)</span><span className="font-medium">{money(noiAnnual)}</span></div>
            <div className="flex justify-between"><span>Cap Rate (NOI ÷ Price)</span><span className="font-semibold">{pct(capRate)}</span></div>
            <div className="flex justify-between border-t pt-2 mt-2"><span>Yield on Cost (NOI ÷ Project Cost)</span><span className="font-semibold">{pct(yieldOnCost)}</span></div>
          </div>
          <p className="text-xs text-brand-blue/70 mt-2">Yield on Cost accounts for closing costs and initial renovations.</p>
        </section>

        {/* Debt & Coverage */}
        <section className="rounded-2xl border border-brand-gold bg-white p-5 avoid-break">
          <h3 className="font-serif text-xl text-brand-green font-bold mb-2">Debt Service & Coverage</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span>Annual Debt Service (ADS)</span><span className="font-medium">−{money(adsAnnual)}</span></div>
            <div className="flex justify-between border-t pt-2 mt-2"><span>DSCR (NOI ÷ ADS)</span><span className="font-semibold">{Number.isFinite(dscr) ? dscr.toFixed(2) : "—"}</span></div>
            <div className="flex justify-between"><span>Debt Yield (NOI ÷ Loan)</span><span className="font-medium">{Number.isFinite(debtYield) ? pct(debtYield) : "—"}</span></div>
          </div>
          <p className="text-xs text-brand-blue/70 mt-2">Many lenders look for DSCR ≥ 1.20 and Debt Yield ≥ 8–10% (program-dependent).</p>
        </section>

        {/* Levered returns */}
        <section className="rounded-2xl border border-brand-gold bg-white p-5 avoid-break">
          <h3 className="font-serif text-xl text-brand-green font-bold mb-2">Levered Returns</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span>Levered Cash Flow (NOI − ADS)</span><span className="font-medium">{money(leveredCF)}</span></div>
            <div className="flex justify-between border-t pt-2 mt-2"><span>Cash Invested</span><span className="font-medium">{money(cashInvested)}</span></div>
            <div className="flex justify-between"><span>Cash-on-Cash Return</span><span className="font-semibold">{pct(cashOnCash)}</span></div>
          </div>

          <details className="mt-4 rounded-xl border border-brand-gold/40 bg-brand-beige/40 p-4">
            <summary className="cursor-pointer font-semibold text-brand-green">Assumptions & Notes</summary>
            <ul className="list-disc ml-5 mt-2 text-sm text-brand-blue/80 space-y-1">
              <li>NOI excludes debt service and income taxes; includes typical operating expenses.</li>
              <li>Cap Rate uses purchase price only. Yield on Cost uses price + closing + initial CapEx.</li>
              <li>Cash-on-Cash = (NOI − ADS) ÷ (Down + Closing + Initial CapEx).</li>
              <li>Estimates only; actual results vary with rents, expenses, and financing terms.</li>
            </ul>
          </details>
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
