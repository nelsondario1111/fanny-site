"use client";

import { useMemo, useState } from "react";
import ToolShell from "@/components/ToolShell";
import { FaPrint, FaFileCsv } from "react-icons/fa";

/* =========================================================
   Types & constants
   ========================================================= */
type LoanMode = "loanAmount" | "purchaseLTV";

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
/** Monthly payment factor for a fully amortizing loan */
function monthlyPaymentFactor(annualRatePct: number, amortYears: number) {
  const i = Math.max(0, annualRatePct) / 100 / 12;
  const n = Math.max(1, Math.round(amortYears * 12));
  if (i === 0) return 1 / n;
  return (i * Math.pow(1 + i, n)) / (Math.pow(1 + i, n) - 1);
}
// CSV helpers (quotes + CRLF + BOM for Excel)
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
  // Income (annual NOI)
  const [noiAnnual, setNoiAnnual] = useState<number>(42_000);

  // Loan terms
  const [ratePct, setRatePct] = useState<number>(5.75);
  const [amortYears, setAmortYears] = useState<number>(25);
  const [dscrTarget, setDscrTarget] = useState<number>(1.20);

  // Proposed financing (choose mode)
  const [mode, setMode] = useState<LoanMode>("loanAmount");
  const [loanAmount, setLoanAmount] = useState<number>(600_000);

  const [purchasePrice, setPurchasePrice] = useState<number>(850_000);
  const [ltvPct, setLtvPct] = useState<number>(75);

  // Optional quick NOI helper (collapsed UI)
  const [grossRentMonthly, setGrossRentMonthly] = useState<number>(4_300);
  const [vacancyPct, setVacancyPct] = useState<number>(4);
  const [otherIncomeMonthly, setOtherIncomeMonthly] = useState<number>(0);
  const [fixedExpensesMonthly, setFixedExpensesMonthly] = useState<number>(900); // taxes+ins+utils+hoa...
  const [variableExpensePctGPR, setVariableExpensePctGPR] = useState<number>(18); // mgmt+maint+capex as % of GPR

  const printDate = new Date().toLocaleDateString("en-CA", { year: "numeric", month: "long", day: "numeric" });

  const {
    proposedLoan,
    monthlyFactor,
    pmtMonthly,
    adsAnnual,
    dscr,
    maxLoanByDSCR,
    requiredNOIatTargetForProposed,
    maxPriceByDSCRatLTV,
    proposedLTV,
    maxLoanByLTV,
    bindingConstraint,
  } = useMemo(() => {
    const monthlyFactor = monthlyPaymentFactor(ratePct, amortYears);

    // Proposed loan from selected mode
    const proposedLoan = mode === "loanAmount"
      ? Math.max(0, loanAmount)
      : Math.max(0, purchasePrice * (Math.max(0, Math.min(100, ltvPct)) / 100));

    const pmtMonthly = proposedLoan * monthlyFactor;
    const adsAnnual = pmtMonthly * 12;

    const dscr = adsAnnual > 0 ? (noiAnnual / adsAnnual) : NaN;

    // Max loan by DSCR (given NOI, rate, amort, dscrTarget)
    const allowedMonthlyDebt = dscrTarget > 0 ? (noiAnnual / 12) / dscrTarget : 0;
    const maxLoanByDSCR = monthlyFactor > 0 ? allowedMonthlyDebt / monthlyFactor : 0;

    // Required NOI to achieve dscrTarget at proposed loan
    const requiredNOIatTargetForProposed = dscrTarget * adsAnnual;

    // LTV-context figures (only meaningful if we have purchase price/LTV)
    const proposedLTV = purchasePrice > 0 ? (proposedLoan / purchasePrice) : NaN;
    const maxLoanByLTV = purchasePrice * (Math.max(0, Math.min(100, ltvPct)) / 100);

    const maxPriceByDSCRatLTV = (ltvPct > 0) ? (maxLoanByDSCR / (ltvPct / 100)) : NaN;

    // Binding constraint if mode is purchaseLTV (which limit is tighter?)
    let bindingConstraint: "DSCR" | "LTV" | "—" = "—";
    if (mode === "purchaseLTV") {
      bindingConstraint = maxLoanByDSCR < maxLoanByLTV ? "DSCR" : "LTV";
    }

    return {
      proposedLoan,
      monthlyFactor,
      pmtMonthly,
      adsAnnual,
      dscr,
      maxLoanByDSCR,
      requiredNOIatTargetForProposed,
      maxPriceByDSCRatLTV,
      proposedLTV,
      maxLoanByLTV,
      bindingConstraint,
    };
  }, [mode, loanAmount, purchasePrice, ltvPct, ratePct, amortYears, noiAnnual, dscrTarget]);

  // Derived NOI helper (for the collapsible)
  const { helperNOI } = useMemo(() => {
    const gprAnnual = (grossRentMonthly || 0) * 12;
    const vacancyLoss = gprAnnual * Math.max(0, vacancyPct) / 100;
    const otherInc = (otherIncomeMonthly || 0) * 12;
    const fixedAnnual = (fixedExpensesMonthly || 0) * 12;
    const variableAnnual = gprAnnual * Math.max(0, variableExpensePctGPR) / 100;
    const noi = gprAnnual - vacancyLoss + otherInc - fixedAnnual - variableAnnual;
    return { helperNOI: noi };
  }, [grossRentMonthly, vacancyPct, otherIncomeMonthly, fixedExpensesMonthly, variableExpensePctGPR]);

  /* -----------------------------
     Actions
     ----------------------------- */
  function handlePrint() {
    window.print(); // users choose “Save as PDF”
  }
  function exportCSV() {
    const rows: Array<Array<string | number>> = [
      ["Key", "Value"],
      ["Prepared", printDate],
      ["NOI (annual)", noiAnnual.toFixed(2)],
      ["Rate (%)", ratePct.toFixed(2)],
      ["Amortization (years)", amortYears],
      ["Target DSCR", dscrTarget.toFixed(2)],
      ["—", "—"],
      ["Mode", mode === "loanAmount" ? "By Loan Amount" : "By Purchase + LTV"],
      ["Proposed Loan", proposedLoan.toFixed(2)],
      ...(mode === "purchaseLTV"
        ? [
            ["Purchase Price", purchasePrice.toFixed(2)],
            ["LTV (%)", ltvPct.toFixed(2)],
            ["Proposed LTV (%)", (proposedLTV * 100).toFixed(2)],
          ]
        : []),
      ["Monthly Debt Service", pmtMonthly.toFixed(2)],
      ["Annual Debt Service (ADS)", adsAnnual.toFixed(2)],
      ["DSCR (NOI ÷ ADS)", Number.isFinite(dscr) ? dscr.toFixed(2) : "—"],
      ["—", "—"],
      ["Max Loan by DSCR Target", maxLoanByDSCR.toFixed(2)],
      ["Required NOI @ Target (for proposed)", requiredNOIatTargetForProposed.toFixed(2)],
      ...(mode === "purchaseLTV"
        ? [
            ["Max Loan by LTV", maxLoanByLTV.toFixed(2)],
            ["Max Purchase by DSCR @ LTV", Number.isFinite(maxPriceByDSCRatLTV) ? maxPriceByDSCRatLTV.toFixed(2) : "—"],
            ["Binding Constraint", bindingConstraint],
          ]
        : []),
    ];
    downloadCSV("dscr_calculator_summary", rows);
  }
  function useHelperNOI() {
    setNoiAnnual(Math.max(0, Math.round(helperNOI)));
  }

  /* -----------------------------
     Render
     ----------------------------- */
  return (
    <ToolShell
      title="DSCR (Lender View)"
      subtitle="Calculate DSCR, maximum loan by DSCR target, and required NOI. Optionally evaluate purchase price & LTV."
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
      </div>

      {/* Inputs */}
      <form className="grid xl:grid-cols-3 gap-6">
        {/* NOI */}
        <section className="rounded-2xl border border-brand-gold bg-white p-5">
          <h3 className="font-serif text-lg text-brand-green font-bold mb-2">Income</h3>
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

        {/* Terms */}
        <section className="rounded-2xl border border-brand-gold bg-white p-5 grid gap-3">
          <h3 className="font-serif text-lg text-brand-green font-bold">Loan Terms</h3>
          <div>
            <label className="block text-sm font-medium text-brand-blue mb-1">Interest Rate (annual %)</label>
            <input
              type="number"
              step={0.01}
              min={0}
              max={25}
              inputMode="decimal"
              className="w-full rounded-xl border border-brand-gold/60 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-gold"
              value={ratePct}
              onChange={(e) => setRatePct(Number(e.target.value || 0))}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-brand-blue mb-1">Amortization (years)</label>
            <select
              className="w-full rounded-xl border border-brand-gold/60 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-gold"
              value={amortYears}
              onChange={(e) => setAmortYears(Number(e.target.value))}
            >
              <option value={20}>20</option>
              <option value={25}>25</option>
              <option value={30}>30</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-brand-blue mb-1">Target DSCR (for max loan)</label>
            <input
              type="number"
              step={0.05}
              min={0.80}
              max={2.00}
              inputMode="decimal"
              className="w-full rounded-xl border border-brand-gold/60 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-gold"
              value={dscrTarget}
              onChange={(e) => setDscrTarget(Number(e.target.value || 0))}
            />
            <p className="text-xs text-brand-blue/70 mt-1">Common targets: 1.10–1.25</p>
          </div>
        </section>

        {/* Financing Mode */}
        <section className="rounded-2xl border border-brand-gold bg-white p-5">
          <h3 className="font-serif text-lg text-brand-green font-bold mb-2">Proposed Financing</h3>

          <div className="flex gap-4 items-center mb-3">
            <label className="inline-flex items-center gap-2">
              <input
                type="radio"
                name="mode"
                checked={mode === "loanAmount"}
                onChange={() => setMode("loanAmount")}
              />
              <span>By Loan Amount</span>
            </label>
            <label className="inline-flex items-center gap-2">
              <input
                type="radio"
                name="mode"
                checked={mode === "purchaseLTV"}
                onChange={() => setMode("purchaseLTV")}
              />
              <span>By Purchase Price + LTV</span>
            </label>
          </div>

          {mode === "loanAmount" ? (
            <div className="grid gap-3">
              <label className="block text-sm font-medium text-brand-blue mb-1">Loan Amount (CAD)</label>
              <input
                type="number"
                min={0}
                inputMode="decimal"
                className="w-full rounded-xl border border-brand-gold/60 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-gold"
                value={loanAmount}
                onChange={(e) => setLoanAmount(Number(e.target.value || 0))}
              />
            </div>
          ) : (
            <div className="grid gap-3">
              <div>
                <label className="block text-sm font-medium text-brand-blue mb-1">Purchase Price (CAD)</label>
                <input
                  type="number"
                  min={0}
                  inputMode="decimal"
                  className="w-full rounded-xl border border-brand-gold/60 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-gold"
                  value={purchasePrice}
                  onChange={(e) => setPurchasePrice(Number(e.target.value || 0))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-brand-blue mb-1">LTV (%)</label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  step={0.1}
                  inputMode="decimal"
                  className="w-full rounded-xl border border-brand-gold/60 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-gold"
                  value={ltvPct}
                  onChange={(e) => setLtvPct(Number(e.target.value || 0))}
                />
              </div>
              <p className="text-xs text-brand-blue/70">
                Proposed loan = Purchase × LTV. We’ll compare DSCR vs LTV constraints.
              </p>
            </div>
          )}
        </section>
      </form>

      {/* Print header (only on print) */}
      <div className="hidden print:block mt-6 mb-3 text-center">
        <div className="font-serif font-bold text-brand-green text-2xl">DSCR (Lender View) — Summary</div>
        <div className="text-xs text-brand-blue">Prepared {printDate}</div>
        <div className="w-16 h-[2px] bg-brand-gold rounded-full mx-auto mt-2" />
      </div>

      {/* Results */}
      <div className="mt-8 grid xl:grid-cols-3 gap-6">
        <section className="rounded-2xl border border-brand-gold bg-white p-5 avoid-break">
          <h3 className="font-serif text-xl text-brand-green font-bold mb-2">DSCR & Debt Service</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span>Proposed loan</span><span className="font-medium">{money(proposedLoan)}</span></div>
            <div className="flex justify-between"><span>Monthly debt service (P&I)</span><span className="font-medium">{money(pmtMonthly, 2)}</span></div>
            <div className="flex justify-between"><span>Annual debt service (ADS)</span><span className="font-medium">{money(adsAnnual)}</span></div>
            <div className="flex justify-between border-t pt-2 mt-2">
              <span>DSCR (NOI ÷ ADS)</span>
              <span className="font-semibold">{Number.isFinite(dscr) ? dscr.toFixed(2) : "—"}</span>
            </div>
          </div>
          <p className="text-xs text-brand-blue/70 mt-2">
            Some lenders require DSCR ≥ {dscrTarget.toFixed(2)}. Terms vary by program and property type.
          </p>
        </section>

        <section className="rounded-2xl border border-brand-gold bg-white p-5 avoid-break">
          <h3 className="font-serif text-xl text-brand-green font-bold mb-2">Max Loan by DSCR Target</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span>Target DSCR</span><span className="font-medium">{dscrTarget.toFixed(2)}</span></div>
            <div className="flex justify-between"><span>Max monthly payment allowed</span><span className="font-medium">{money((noiAnnual / 12) / dscrTarget, 2)}</span></div>
            <div className="flex justify-between border-t pt-2 mt-2">
              <span>Max loan by DSCR</span>
              <span className="font-semibold">{money(maxLoanByDSCR)}</span>
            </div>
            <div className="flex justify-between">
              <span>Required NOI @ target (for proposed)</span>
              <span className="font-medium">{money(requiredNOIatTargetForProposed)}</span>
            </div>
          </div>
          <p className="text-xs text-brand-blue/70 mt-2">
            Increase NOI or reduce loan/terms to improve DSCR.
          </p>
        </section>

        <section className="rounded-2xl border border-brand-gold bg-white p-5 avoid-break">
          <h3 className="font-serif text-xl text-brand-green font-bold mb-2">LTV Context</h3>
          {mode === "purchaseLTV" ? (
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span>Purchase price</span><span className="font-medium">{money(purchasePrice)}</span></div>
              <div className="flex justify-between"><span>Proposed LTV</span><span className="font-medium">{Number.isFinite(proposedLTV) ? (proposedLTV * 100).toFixed(2) + "%" : "—"}</span></div>
              <div className="flex justify-between"><span>Max loan by LTV</span><span className="font-medium">{money(maxLoanByLTV)}</span></div>
              <div className="flex justify-between border-t pt-2 mt-2">
                <span>Max purchase by DSCR @ LTV</span>
                <span className="font-semibold">{Number.isFinite(maxPriceByDSCRatLTV) ? money(maxPriceByDSCRatLTV) : "—"}</span>
              </div>
              <div className="flex justify-between">
                <span>Binding constraint</span>
                <span className="font-medium">{bindingConstraint}</span>
              </div>
            </div>
          ) : (
            <p className="text-sm text-brand-blue/80">Switch to “Purchase Price + LTV” to compare DSCR vs LTV limits.</p>
          )}

          <details className="mt-4 rounded-xl border border-brand-gold/40 bg-brand-beige/40 p-4">
            <summary className="cursor-pointer font-semibold text-brand-green">Assumptions & Notes</summary>
            <ul className="list-disc ml-5 mt-2 text-sm text-brand-blue/80 space-y-1">
              <li>DSCR = <b>NOI ÷ Annual Debt Service</b>. NOI excludes debt service, CapEx reserves, and income taxes.</li>
              <li>Payment uses a fully-amortizing schedule over the selected term (amortization years).</li>
              <li>Programs vary; some include stressed rates or different DSCR floors by property.</li>
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
