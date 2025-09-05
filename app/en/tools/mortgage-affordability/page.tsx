"use client";

import { useMemo, useState } from "react";
import ToolShell from "@/components/ToolShell";
import { FaPrint, FaFileCsv } from "react-icons/fa";

/* =========================================================
   Types & constants
   ========================================================= */
type DownMode = "amount" | "percent";

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
/** Monthly payment factor for fully-amortizing loan */
function monthlyPaymentFactor(annualRatePct: number, years: number) {
  const i = Math.max(0, annualRatePct) / 100 / 12;
  const n = Math.max(1, Math.round(years * 12));
  if (i === 0) return 1 / n;
  return (i * Math.pow(1 + i, n)) / (Math.pow(1 + i, n) - 1);
}
/** Robust CSV (quotes + CRLF + BOM) */
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

/* ---------- Default insured premium table (editable through logic) ----------
   Typical high-ratio (down < 20%) premiums (subject to change):
   - 5%–9.99% down: 4.00%
   - 10%–14.99% down: 3.10%
   - 15%–19.99% down: 2.80%
   For ≥20% down we assume 0% (uninsured).
--------------------------------------------------------------------------- */
function defaultPremiumRateForDownPct(downPct: number) {
  if (!Number.isFinite(downPct) || downPct <= 0) return NaN;
  if (downPct < 0.05) return NaN; // not eligible
  if (downPct < 0.10) return 0.04;
  if (downPct < 0.15) return 0.031;
  if (downPct < 0.20) return 0.028;
  return 0;
}

/** Solve max purchase price given:
 *  - Maximum *insured* loan you can support (cap by payment), M_cap
 *  - Cash down payment D
 *  - Whether to include default insurance premium in the loan (true/false)
 *  Iterates because premium depends on down% which depends on price.
 */
function solveMaxPrice({
  maxSupportableLoan,
  downPayment,
  includeDefaultPremium,
}: {
  maxSupportableLoan: number;
  downPayment: number;
  includeDefaultPremium: boolean;
}) {
  const D = Math.max(0, downPayment || 0);

  if (!includeDefaultPremium) {
    const price = D + Math.max(0, maxSupportableLoan);
    return {
      price: Math.max(0, price),
      baseLoan: Math.max(0, maxSupportableLoan),
      premiumRate: 0,
      premiumAmt: 0,
      insuredLoan: Math.max(0, maxSupportableLoan),
      downPct: price > 0 ? D / price : NaN,
    };
  }

  // Iterate to converge on premium and price
  let priceGuess = D + Math.max(0, maxSupportableLoan); // starting guess (ignoring premium)
  let premiumRate = 0;
  let baseLoan = 0;
  let insuredLoan = Math.max(0, maxSupportableLoan);
  let iterations = 0;

  while (iterations < 25) {
    iterations++;
    const downPct = priceGuess > 0 ? D / priceGuess : 0;
    premiumRate = defaultPremiumRateForDownPct(downPct);
    if (!Number.isFinite(premiumRate)) {
      // Not eligible for insurance (<5% down). Cap price by min 5% down rule:
      const capByMinDown = D / 0.05; // highest price you can buy with D and 5% minimum down
      priceGuess = Math.min(priceGuess, capByMinDown || 0);
      // Recompute with 5% down exactly, as best-effort:
      const dp = priceGuess * 0.05;
      baseLoan = priceGuess - dp;
      const prem = baseLoan * 0.04; // assume highest band at 5% down
      insuredLoan = baseLoan + prem;
      break;
    }
    baseLoan = insuredLoan / (1 + premiumRate);
    const newPrice = D + baseLoan;
    if (Math.abs(newPrice - priceGuess) < 1) {
      priceGuess = newPrice;
      break;
    }
    priceGuess = newPrice;
  }

  const premiumAmt = baseLoan * premiumRate;
  const downPctFinal = priceGuess > 0 ? D / priceGuess : NaN;

  // If <5% down after convergence, enforce the 5% rule cap again
  if (Number.isFinite(downPctFinal) && downPctFinal < 0.05) {
    const capByMinDown = D / 0.05;
    if (priceGuess > capByMinDown) {
      priceGuess = capByMinDown;
      const dp = priceGuess * 0.05;
      baseLoan = priceGuess - dp;
      premiumRate = 0.04;
      insuredLoan = baseLoan + baseLoan * premiumRate;
    }
  }

  return {
    price: Math.max(0, priceGuess),
    baseLoan: Math.max(0, baseLoan),
    premiumRate: Math.max(0, premiumRate),
    premiumAmt: Math.max(0, premiumAmt),
    insuredLoan: Math.max(0, insuredLoan),
    downPct: priceGuess > 0 ? D / priceGuess : NaN,
  };
}

/* =========================================================
   Page
   ========================================================= */
export default function Page() {
  /* Incomes (annual) */
  const [income1, setIncome1] = useState<number>(95_000);
  const [income2, setIncome2] = useState<number>(55_000);
  const [otherMonthlyIncome, setOtherMonthlyIncome] = useState<number>(0); // conservative: often excluded by lenders

  /* Housing carrying costs (qualifying) */
  const [propertyTaxAnnual, setPropertyTaxAnnual] = useState<number>(4_200);
  const [heatingMonthly, setHeatingMonthly] = useState<number>(120);
  const [condoFeesMonthly, setCondoFeesMonthly] = useState<number>(0); // 50% counted for GDS/TDS
  const [homeInsMonthly, setHomeInsMonthly] = useState<number>(85);

  /* Debts (monthly minimums for TDS) */
  const [otherDebtsMonthly, setOtherDebtsMonthly] = useState<number>(450);

  /* Ratios */
  const [gdsTarget, setGdsTarget] = useState<number>(0.39); // 39%
  const [tdsTarget, setTdsTarget] = useState<number>(0.44); // 44%

  /* Rate & amortization */
  const [contractRatePct, setContractRatePct] = useState<number>(5.49);
  const [amortYears, setAmortYears] = useState<number>(25);

  /* Stress-test (qualifying rate) */
  const [useStressTest, setUseStressTest] = useState<boolean>(true);
  const [stressBufferPct, setStressBufferPct] = useState<number>(2.0); // +2%
  const [qualifyingFloorPct, setQualifyingFloorPct] = useState<number>(5.25); // editable floor
  const qualifyingRatePct = useMemo(() => {
    if (!useStressTest) return contractRatePct;
    return Math.max(contractRatePct + stressBufferPct, qualifyingFloorPct);
  }, [useStressTest, contractRatePct, stressBufferPct, qualifyingFloorPct]);

  /* Down payment */
  const [downMode, setDownMode] = useState<DownMode>("amount");
  const [downAmount, setDownAmount] = useState<number>(180_000);
  const [downPercent, setDownPercent] = useState<number>(20);

  /* Insurance handling */
  const [includeDefaultPremium, setIncludeDefaultPremium] = useState<boolean>(true);

  const printDate = new Date().toLocaleDateString("en-CA", { year: "numeric", month: "long", day: "numeric" });

  /* -----------------------------
     Derived computations
     ----------------------------- */
  const {
    grossMonthlyIncome,
    fixedHousingMonthly,
    maxPmtGDS,
    maxPmtTDS,
    bindingConstraint,
    maxPmtAllowed,
    maxSupportableLoan,
    downPaymentCAD,
    maxPriceResult,
    previewMonthlyAtContract,
  } = useMemo(() => {
    const grossMonthlyIncome =
      (Math.max(0, income1 || 0) + Math.max(0, income2 || 0)) / 12 +
      Math.max(0, otherMonthlyIncome || 0);

    const taxM = Math.max(0, propertyTaxAnnual || 0) / 12;
    const heatM = Math.max(0, heatingMonthly || 0);
    const condoHalfM = Math.max(0, condoFeesMonthly || 0) * 0.5;
    const insM = Math.max(0, homeInsMonthly || 0);

    const fixedHousingMonthly = taxM + heatM + condoHalfM + insM;

    // Allowable P&I payment by GDS (GDS% * income - fixed housing costs)
    const maxPmtGDS = Math.max(0, Math.max(0, gdsTarget) * grossMonthlyIncome - fixedHousingMonthly);

    // Allowable P&I payment by TDS (TDS% * income - fixed housing - other monthly debts)
    const maxPmtTDS = Math.max(
      0,
      Math.max(0, tdsTarget) * grossMonthlyIncome - fixedHousingMonthly - Math.max(0, otherDebtsMonthly || 0)
    );

    const bindingConstraint = maxPmtGDS < maxPmtTDS ? "GDS" : "TDS";
    const maxPmtAllowed = Math.min(maxPmtGDS, maxPmtTDS);

    // Convert max payment to max supportable principal using *qualifying* rate
    const pmtFactorQual = monthlyPaymentFactor(qualifyingRatePct, amortYears);
    const maxSupportableLoan = pmtFactorQual > 0 ? maxPmtAllowed / pmtFactorQual : 0;

    // Down payment in CAD
    let downPaymentCAD = Math.max(0, downAmount || 0);
    if (downMode === "percent") {
      // Percent of the *price* – but we don't know price yet. We'll use the final solver
      // by passing just the percent to infer a nominal amount later. As a helpful heuristic,
      // convert percent to an initial down-amount guess using price ≈ D% of (D + loan):
      const dpDec = Math.min(Math.max((downPercent || 0) / 100, 0), 1);
      if (dpDec > 0) {
        const guessPrice = maxSupportableLoan / (1 - dpDec);
        downPaymentCAD = dpDec * guessPrice;
      }
    }

    // Solve price given loan capacity + down payment (+ optional premium)
    const maxPriceResult = solveMaxPrice({
      maxSupportableLoan,
      downPayment: downPaymentCAD,
      includeDefaultPremium,
    });

    // Payment preview at *contract* rate for the resulting maxSupportableLoan
    const pmtFactorContract = monthlyPaymentFactor(contractRatePct, amortYears);
    const previewMonthlyAtContract = maxSupportableLoan * pmtFactorContract;

    return {
      grossMonthlyIncome,
      fixedHousingMonthly,
      maxPmtGDS,
      maxPmtTDS,
      bindingConstraint,
      maxPmtAllowed,
      maxSupportableLoan,
      downPaymentCAD,
      maxPriceResult,
      previewMonthlyAtContract,
    };
  }, [
    income1, income2, otherMonthlyIncome,
    propertyTaxAnnual, heatingMonthly, condoFeesMonthly, homeInsMonthly,
    otherDebtsMonthly, gdsTarget, tdsTarget,
    qualifyingRatePct, amortYears,
    downMode, downAmount, downPercent,
    includeDefaultPremium, contractRatePct
  ]);

  /* -----------------------------
     Actions
     ----------------------------- */
  function handlePrint() { window.print(); }
  function exportCSV() {
    const rows: Array<Array<string | number>> = [
      ["Prepared", printDate],
      ["Income 1 (annual)", income1.toFixed(2)],
      ["Income 2 (annual)", income2.toFixed(2)],
      ["Other Monthly Income", otherMonthlyIncome.toFixed(2)],
      ["Property Tax (annual)", propertyTaxAnnual.toFixed(2)],
      ["Heating (monthly)", heatingMonthly.toFixed(2)],
      ["Condo Fees (monthly)", condoFeesMonthly.toFixed(2)],
      ["Home Insurance (monthly)", homeInsMonthly.toFixed(2)],
      ["Other Debts (monthly)", otherDebtsMonthly.toFixed(2)],
      ["GDS Target (%)", (gdsTarget * 100).toFixed(2)],
      ["TDS Target (%)", (tdsTarget * 100).toFixed(2)],
      ["Contract Rate (%)", contractRatePct.toFixed(2)],
      ["Amortization (years)", amortYears],
      ["Stress Test Enabled", useStressTest ? "Yes" : "No"],
      ["Stress Buffer (+%)", stressBufferPct.toFixed(2)],
      ["Qualifying Floor (%)", qualifyingFloorPct.toFixed(2)],
      ["Qualifying Rate Used (%)", qualifyingRatePct.toFixed(2)],
      ["Down Payment Mode", downMode === "amount" ? "Amount" : "Percent"],
      ["Down Payment (CAD est.)", downPaymentCAD.toFixed(2)],
      ["Include Default Insurance Premium", includeDefaultPremium ? "Yes" : "No"],
      ["—", "—"],
      ["Gross Monthly Income", grossMonthlyIncome.toFixed(2)],
      ["Fixed Housing Costs (qualifying monthly)", fixedHousingMonthly.toFixed(2)],
      ["Max P&I by GDS", maxPmtGDS.toFixed(2)],
      ["Max P&I by TDS", maxPmtTDS.toFixed(2)],
      ["Binding Constraint", bindingConstraint],
      ["Max P&I Allowed", maxPmtAllowed.toFixed(2)],
      ["Max Supportable Loan (qualifying rate)", maxSupportableLoan.toFixed(2)],
      ["Preview Monthly P&I @ Contract Rate", previewMonthlyAtContract.toFixed(2)],
      ["—", "—"],
      ["Solved Max Purchase Price", maxPriceResult.price.toFixed(2)],
      ["Down Payment % at Max Price", Number.isFinite(maxPriceResult.downPct) ? (maxPriceResult.downPct * 100).toFixed(2) + "%" : "—"],
      ["Base Loan (before premium)", maxPriceResult.baseLoan.toFixed(2)],
      ["Insurance Premium Rate", (maxPriceResult.premiumRate * 100).toFixed(2) + "%"],
      ["Insurance Premium Amount", maxPriceResult.premiumAmt.toFixed(2)],
      ["Insured Loan (added premium)", maxPriceResult.insuredLoan.toFixed(2)],
    ];
    downloadCSV("mortgage_affordability_summary", rows);
  }
  function resetExample() {
    setIncome1(95_000); setIncome2(55_000); setOtherMonthlyIncome(0);
    setPropertyTaxAnnual(4_200); setHeatingMonthly(120); setCondoFeesMonthly(0); setHomeInsMonthly(85);
    setOtherDebtsMonthly(450);
    setGdsTarget(0.39); setTdsTarget(0.44);
    setContractRatePct(5.49); setAmortYears(25);
    setUseStressTest(true); setStressBufferPct(2.0); setQualifyingFloorPct(5.25);
    setDownMode("amount"); setDownAmount(180_000); setDownPercent(20);
    setIncludeDefaultPremium(true);
  }

  /* -----------------------------
     Render
     ----------------------------- */
  return (
    <ToolShell
      title="Mortgage Affordability"
      subtitle="Estimate your maximum mortgage and purchase price using GDS/TDS limits and Canada’s stress-test style qualifying rate."
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
      <form className="grid 2xl:grid-cols-4 xl:grid-cols-3 gap-6">
        {/* Incomes */}
        <section className="rounded-2xl border border-brand-gold bg-white p-5 grid gap-3">
          <h3 className="font-serif text-lg text-brand-green font-bold">Incomes</h3>
          <div>
            <label className="block text-sm font-medium text-brand-blue mb-1">Borrower Income (annual, CAD)</label>
            <input type="number" min={0} inputMode="decimal"
              className="w-full rounded-xl border border-brand-gold/60 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-gold"
              value={income1} onChange={(e)=>setIncome1(Number(e.target.value || 0))}/>
          </div>
          <div>
            <label className="block text-sm font-medium text-brand-blue mb-1">Co-Borrower Income (annual, CAD)</label>
            <input type="number" min={0} inputMode="decimal"
              className="w-full rounded-xl border border-brand-gold/60 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-gold"
              value={income2} onChange={(e)=>setIncome2(Number(e.target.value || 0))}/>
          </div>
          <div>
            <label className="block text-sm font-medium text-brand-blue mb-1">Other Monthly Income (optional)</label>
            <input type="number" min={0} inputMode="decimal"
              className="w-full rounded-xl border border-brand-gold/60 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-gold"
              value={otherMonthlyIncome} onChange={(e)=>setOtherMonthlyIncome(Number(e.target.value || 0))}/>
            <p className="text-xs text-brand-blue/70 mt-1">Conservatively treated as part of gross income; some lenders may exclude.</p>
          </div>
        </section>

        {/* Housing costs */}
        <section className="rounded-2xl border border-brand-gold bg-white p-5 grid gap-3">
          <h3 className="font-serif text-lg text-brand-green font-bold">Qualifying Housing Costs</h3>
          <div>
            <label className="block text-sm font-medium text-brand-blue mb-1">Property Taxes (annual)</label>
            <input type="number" min={0} inputMode="decimal"
              className="w-full rounded-xl border border-brand-gold/60 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-gold"
              value={propertyTaxAnnual} onChange={(e)=>setPropertyTaxAnnual(Number(e.target.value || 0))}/>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-brand-blue mb-1">Heating (monthly)</label>
              <input type="number" min={0} inputMode="decimal"
                className="w-full rounded-xl border border-brand-gold/60 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-gold"
                value={heatingMonthly} onChange={(e)=>setHeatingMonthly(Number(e.target.value || 0))}/>
            </div>
            <div>
              <label className="block text-sm font-medium text-brand-blue mb-1">Condo Fees (monthly)</label>
              <input type="number" min={0} inputMode="decimal"
                className="w-full rounded-xl border border-brand-gold/60 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-gold"
                value={condoFeesMonthly} onChange={(e)=>setCondoFeesMonthly(Number(e.target.value || 0))}/>
              <p className="text-xs text-brand-blue/70 mt-1">We count 50% of condo fees for GDS/TDS.</p>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-brand-blue mb-1">Home Insurance (monthly)</label>
            <input type="number" min={0} inputMode="decimal"
              className="w-full rounded-xl border border-brand-gold/60 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-gold"
              value={homeInsMonthly} onChange={(e)=>setHomeInsMonthly(Number(e.target.value || 0))}/>
          </div>
        </section>

        {/* Other debts & ratios */}
        <section className="rounded-2xl border border-brand-gold bg-white p-5 grid gap-3">
          <h3 className="font-serif text-lg text-brand-green font-bold">Debts & Ratios</h3>
          <div>
            <label className="block text-sm font-medium text-brand-blue mb-1">Other Monthly Debts (minimums)</label>
            <input type="number" min={0} inputMode="decimal"
              className="w-full rounded-xl border border-brand-gold/60 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-gold"
              value={otherDebtsMonthly} onChange={(e)=>setOtherDebtsMonthly(Number(e.target.value || 0))}/>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-brand-blue mb-1">GDS Target (%)</label>
              <input type="number" min={20} max={60} step={0.01} inputMode="decimal"
                className="w-full rounded-xl border border-brand-gold/60 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-gold"
                value={gdsTarget*100} onChange={(e)=>setGdsTarget(Number(e.target.value || 0)/100)}/>
            </div>
            <div>
              <label className="block text-sm font-medium text-brand-blue mb-1">TDS Target (%)</label>
              <input type="number" min={20} max={60} step={0.01} inputMode="decimal"
                className="w-full rounded-xl border border-brand-gold/60 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-gold"
                value={tdsTarget*100} onChange={(e)=>setTdsTarget(Number(e.target.value || 0)/100)}/>
            </div>
          </div>
          <p className="text-xs text-brand-blue/70">Common targets: GDS ~39%, TDS ~44% (program-dependent).</p>
        </section>

        {/* Rate, amortization, down payment */}
        <section className="rounded-2xl border border-brand-gold bg-white p-5">
          <h3 className="font-serif text-lg text-brand-green font-bold mb-2">Financing</h3>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-brand-blue mb-1">Contract Rate (annual %)</label>
              <input type="number" min={0} max={25} step={0.01} inputMode="decimal"
                className="w-full rounded-xl border border-brand-gold/60 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-gold"
                value={contractRatePct} onChange={(e)=>setContractRatePct(Number(e.target.value || 0))}/>
            </div>
            <div>
              <label className="block text-sm font-medium text-brand-blue mb-1">Amortization (years)</label>
              <select
                className="w-full rounded-xl border border-brand-gold/60 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-gold"
                value={amortYears} onChange={(e)=>setAmortYears(Number(e.target.value))}
              >
                <option value={20}>20</option>
                <option value={25}>25</option>
                <option value={30}>30</option>
              </select>
            </div>
          </div>

          <div className="mt-3 rounded-xl border border-brand-gold/40 bg-brand-beige/40 p-3">
            <label className="inline-flex items-center gap-2">
              <input type="checkbox" checked={useStressTest} onChange={(e)=>setUseStressTest(e.target.checked)} />
              <span className="font-medium text-brand-green">Use stress-test qualifying rate</span>
            </label>
            <div className="grid grid-cols-3 gap-3 mt-2">
              <div>
                <label className="block text-xs text-brand-blue mb-1">Buffer (+%)</label>
                <input type="number" min={0} max={5} step={0.01} inputMode="decimal"
                  className="w-full rounded-xl border border-brand-gold/60 px-2 py-2 focus:outline-none focus:ring-2 focus:ring-brand-gold"
                  value={stressBufferPct} onChange={(e)=>setStressBufferPct(Number(e.target.value || 0))}/>
              </div>
              <div>
                <label className="block text-xs text-brand-blue mb-1">Floor (%)</label>
                <input type="number" min={0} max={10} step={0.01} inputMode="decimal"
                  className="w-full rounded-xl border border-brand-gold/60 px-2 py-2 focus:outline-none focus:ring-2 focus:ring-brand-gold"
                  value={qualifyingFloorPct} onChange={(e)=>setQualifyingFloorPct(Number(e.target.value || 0))}/>
              </div>
              <div className="flex items-end">
                <div className="text-sm bg-white border border-brand-gold/60 rounded-xl px-3 py-2 w-full">
                  Qualifying Rate: <b>{qualifyingRatePct.toFixed(2)}%</b>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-3">
            <label className="block text-sm font-medium text-brand-blue mb-1">Down Payment</label>
            <div className="flex gap-4 mb-2">
              <label className="inline-flex items-center gap-2">
                <input type="radio" name="downmode" checked={downMode==="amount"} onChange={()=>setDownMode("amount")}/>
                <span>Amount</span>
              </label>
              <label className="inline-flex items-center gap-2">
                <input type="radio" name="downmode" checked={downMode==="percent"} onChange={()=>setDownMode("percent")}/>
                <span>Percent</span>
              </label>
            </div>
            {downMode === "amount" ? (
              <input type="number" min={0} inputMode="decimal"
                className="w-full rounded-xl border border-brand-gold/60 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-gold"
                value={downAmount} onChange={(e)=>setDownAmount(Number(e.target.value || 0))}/>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <input type="number" min={0} max={100} step={0.1} inputMode="decimal"
                  className="w-full rounded-xl border border-brand-gold/60 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-gold"
                  value={downPercent} onChange={(e)=>setDownPercent(Number(e.target.value || 0))}/>
                <div className="text-sm text-brand-blue/70 flex items-center">
                  Enter the % you plan to put down.
                </div>
              </div>
            )}
            <label className="inline-flex items-center gap-2 mt-3">
              <input
                type="checkbox"
                checked={includeDefaultPremium}
                onChange={(e)=>setIncludeDefaultPremium(e.target.checked)}
              />
              <span>Include default insured-mortgage premium estimate (if &lt; 20% down)</span>
            </label>
          </div>
        </section>
      </form>

      {/* Results */}
      <div className="mt-8 grid xl:grid-cols-3 gap-6">
        <section className="rounded-2xl border border-brand-gold bg-white p-5 avoid-break">
          <h3 className="font-serif text-xl text-brand-green font-bold mb-2">Coverage & Constraints</h3>
          <div className="text-sm space-y-2">
            <div className="flex justify-between"><span>Gross Monthly Income</span><span className="font-medium">{money(grossMonthlyIncome, 2)}</span></div>
            <div className="flex justify-between"><span>Fixed Housing Costs (qual.)</span><span className="font-medium">{money(fixedHousingMonthly, 2)}</span></div>
            <div className="flex justify-between"><span>Max P&I by GDS</span><span className="font-medium">{money(maxPmtGDS, 2)}</span></div>
            <div className="flex justify-between"><span>Max P&I by TDS</span><span className="font-medium">{money(maxPmtTDS, 2)}</span></div>
            <div className="flex justify-between border-t pt-2 mt-2">
              <span>Binding Constraint</span><span className="font-semibold">{bindingConstraint}</span>
            </div>
            <div className="flex justify-between">
              <span>Max P&I Allowed</span><span className="font-semibold">{money(maxPmtAllowed, 2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Qualifying Rate</span><span className="font-medium">{qualifyingRatePct.toFixed(2)}%</span>
            </div>
          </div>
          <p className="text-xs text-brand-blue/70 mt-2">
            GDS includes P&I + taxes + heat + 50% condo fees + insurance. TDS adds other monthly debt payments.
          </p>
        </section>

        <section className="rounded-2xl border border-brand-gold bg-white p-5 avoid-break">
          <h3 className="font-serif text-xl text-brand-green font-bold mb-2">Max Mortgage (by payment)</h3>
          <div className="text-sm space-y-2">
            <div className="flex justify-between"><span>Amortization</span><span className="font-medium">{amortYears} years</span></div>
            <div className="flex justify-between"><span>Supportable Principal @ Qual. Rate</span><span className="font-semibold">{money(maxSupportableLoan)}</span></div>
            <div className="flex justify-between">
              <span>Preview Monthly P&I @ Contract Rate</span>
              <span className="font-medium">{money(previewMonthlyAtContract, 2)}</span>
            </div>
          </div>
          <details className="mt-4 rounded-xl border border-brand-gold/40 bg-brand-beige/40 p-4">
            <summary className="cursor-pointer font-semibold text-brand-green">Notes</summary>
            <ul className="list-disc ml-5 mt-2 text-sm text-brand-blue/80 space-y-1">
              <li>We convert your max allowable monthly P&I into a principal using the qualifying rate and amortization.</li>
              <li>Preview payment uses your contract rate (for budgeting) — the qualifying rate may be higher.</li>
              <li>If your down payment is &lt; 20%, many insured programs cap amortization at 25 years.</li>
            </ul>
          </details>
        </section>

        <section className="rounded-2xl border border-brand-gold bg-white p-5 avoid-break">
          <h3 className="font-serif text-xl text-brand-green font-bold mb-2">Max Purchase Price</h3>
          <div className="text-sm space-y-2">
            <div className="flex justify-between"><span>Down Payment (est.)</span><span className="font-medium">{money(downPaymentCAD)}</span></div>
            <div className="flex justify-between"><span>Include Premium Estimate</span><span className="font-medium">{includeDefaultPremium ? "Yes" : "No"}</span></div>
            <div className="flex justify-between border-t pt-2 mt-2"><span>Max Purchase Price</span><span className="font-semibold">{money(maxPriceResult.price)}</span></div>
            <div className="flex justify-between"><span>Down Payment % at Max Price</span><span className="font-medium">{Number.isFinite(maxPriceResult.downPct) ? (maxPriceResult.downPct*100).toFixed(2) + "%" : "—"}</span></div>
            <div className="flex justify-between"><span>Base Loan (before premium)</span><span className="font-medium">{money(maxPriceResult.baseLoan)}</span></div>
            <div className="flex justify-between"><span>Insurance Premium</span><span className="font-medium">{money(maxPriceResult.premiumAmt)}</span></div>
            <div className="flex justify-between"><span>Insured Loan (added premium)</span><span className="font-medium">{money(maxPriceResult.insuredLoan)}</span></div>
          </div>
          <p className="text-xs text-brand-blue/70 mt-2">
            Premium estimate uses common bands (4.00%, 3.10%, 2.80%) based on your effective down payment %; edit your inputs to reflect lender specifics.
          </p>
        </section>
      </div>

      {/* Print headers */}
      <div className="hidden print:block mt-6 mb-3 text-center">
        <div className="font-serif font-bold text-brand-green text-2xl">Mortgage Affordability — Summary</div>
        <div className="text-xs text-brand-blue">Prepared {printDate}</div>
        <div className="w-16 h-[2px] bg-brand-gold rounded-full mx-auto mt-2" />
      </div>

      {/* Assumptions */}
      <details className="mt-6 rounded-2xl border border-brand-gold/40 bg-brand-beige/40 p-4">
        <summary className="cursor-pointer font-semibold text-brand-green">Assumptions & Notes</summary>
        <ul className="list-disc ml-5 mt-2 text-sm text-brand-blue/80 space-y-1">
          <li>This is an educational estimate. Lender programs vary (rate stress, exceptions, amortization caps, condo fee treatment, etc.).</li>
          <li>GDS includes: mortgage principal & interest (at the qualifying rate), property taxes, heating, 50% of condo fees, and home insurance.</li>
          <li>TDS adds other monthly obligations (credit lines, loans, cards, support payments, etc.).</li>
          <li>Insurance premiums (if down &lt; 20%) are added to the mortgage (not paid from down payment) and depend on exact program rules.</li>
          <li>Always confirm with your lender and review your mortgage commitment for final qualifying details.</li>
        </ul>
      </details>

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
