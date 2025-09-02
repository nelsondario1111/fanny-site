"use client";

import { useMemo, useState } from "react";
import ToolShell from "@/components/ToolShell";
import { FaPrint, FaFileCsv, FaInfoCircle } from "react-icons/fa";

/* =========================================================
   Types & constants
   ========================================================= */
type MortType = "fixed" | "variable";
type PenaltyMode = "none" | "manual" | "est3mo" | "estIRD";

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
/** Fully-amortizing monthly payment */
function pmt(principal: number, annualRatePct: number, years: number) {
  const i = Math.max(0, annualRatePct) / 100 / 12;
  const n = Math.max(1, Math.round(years * 12));
  if (i === 0) return principal / n;
  return (principal * i * Math.pow(1 + i, n)) / (Math.pow(1 + i, n) - 1);
}
/** Remaining balance after m months (level-payment mortgage) */
function balAfterMonths(principal: number, annualRatePct: number, years: number, monthsElapsed: number) {
  const i = Math.max(0, annualRatePct) / 100 / 12;
  const n = Math.max(1, Math.round(years * 12));
  const m = Math.min(Math.max(0, Math.floor(monthsElapsed)), n);
  if (i === 0) return Math.max(0, principal - (principal / n) * m);
  const M = pmt(principal, annualRatePct, years);
  const pow = Math.pow(1 + i, m);
  return principal * pow - (M * (pow - 1)) / i;
}
/** Total interest paid over k months, returning also end balance */
function interestOverMonths(principal: number, annualRatePct: number, years: number, months: number) {
  const i = Math.max(0, annualRatePct) / 100 / 12;
  const n = Math.max(1, Math.round(years * 12));
  const k = Math.min(Math.max(0, Math.floor(months)), n);
  const M = pmt(principal, annualRatePct, years);
  let bal = principal;
  let interest = 0;
  for (let m = 1; m <= k; m++) {
    const int = bal * i;
    const princ = Math.min(bal, Math.max(0, M - int));
    interest += int;
    bal = Math.max(0, bal - princ);
    if (bal <= 0) break;
  }
  return { interest, endBalance: bal, payment: M };
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

/* Quick penalty estimators (educational) */
function est3MonthInterest(balance: number, contractRatePct: number) {
  const i = Math.max(0, contractRatePct) / 100;
  return balance * i * (3 / 12);
}
function estIRD(balance: number, contractRatePct: number, comparisonRatePct: number, remainingTermMonths: number) {
  const diff = Math.max(0, (contractRatePct - comparisonRatePct)) / 100;
  return balance * diff * Math.max(0, remainingTermMonths) / 12;
}

/* =========================================================
   Page
   ========================================================= */
export default function Page() {
  /* ------------ Current mortgage ------------ */
  const [mortType, setMortType] = useState<MortType>("fixed");
  const [curBalance, setCurBalance] = useState<number>(520_000);
  const [curRatePct, setCurRatePct] = useState<number>(4.89);
  const [remAmortYears, setRemAmortYears] = useState<number>(22);
  const [remTermYears, setRemTermYears] = useState<number>(2);

  /* Penalty */
  const [penaltyMode, setPenaltyMode] = useState<PenaltyMode>("est3mo");
  const [manualPenalty, setManualPenalty] = useState<number>(0);
  const [comparisonRatePct, setComparisonRatePct] = useState<number>(3.39);
  const [adminFee, setAdminFee] = useState<number>(300);

  /* ------------ Refinance option (New Mortgage) ------------ */
  const [newRatePct, setNewRatePct] = useState<number>(4.29);
  const [newAmortYears, setNewAmortYears] = useState<number>(25);
  const [newTermYears, setNewTermYears] = useState<number>(5);
  const [refiOtherCosts, setRefiOtherCosts] = useState<number>(1500); // legal/appraisal/title/etc.
  const [capitaliseCosts, setCapitaliseCosts] = useState<boolean>(true);

  /* ------------ Blend & Extend option (Optional) ------------ */
  const [useBlend, setUseBlend] = useState<boolean>(true);
  const [offerRatePct, setOfferRatePct] = useState<number>(3.99);  // lender’s offered rate for the extension portion
  const [blendNewTermYears, setBlendNewTermYears] = useState<number>(5); // extend to a new term length
  const [blendPenaltyWaived, setBlendPenaltyWaived] = useState<boolean>(true);
  const [blendResetAmort, setBlendResetAmort] = useState<boolean>(false);
  const [blendAmortYears, setBlendAmortYears] = useState<number>(remAmortYears);
  const [blendCosts, setBlendCosts] = useState<number>(0);
  const [blendCapitaliseCosts, setBlendCapitaliseCosts] = useState<boolean>(true);

  /* ------------ Analysis horizon ------------ */
  const [analysisYears, setAnalysisYears] = useState<number>(Math.min(remTermYears, newTermYears));

  const printDate = new Date().toLocaleDateString("en-CA", { year: "numeric", month: "long", day: "numeric" });

  /* ------------ Derived calculations ------------ */
  const results = useMemo(() => {
    const curP = Math.max(0, curBalance || 0);
    const remAmort = Math.max(1, remAmortYears || 1);
    const remTermM = Math.max(1, Math.round((remTermYears || 0) * 12));
    const analysisM = Math.max(1, Math.round((analysisYears || 0) * 12));

    // Penalty estimate
    let penalty =
      penaltyMode === "none" ? 0 :
      penaltyMode === "manual" ? Math.max(0, manualPenalty || 0) :
      penaltyMode === "est3mo" ? est3MonthInterest(curP, curRatePct || 0) :
      estIRD(curP, curRatePct || 0, comparisonRatePct || 0, remTermM);

    // Admin/Discharge fee
    const discharge = Math.max(0, adminFee || 0);

    /* --- Scenario A: Stay (no change) --- */
    const A = interestOverMonths(curP, curRatePct || 0, remAmort, Math.min(analysisM, remTermM));
    const stayMonthly = A.payment;
    const stayInterest = A.interest;
    const horizonUsedA = Math.min(analysisM, remTermM);

    /* --- Scenario B: Refinance to new mortgage --- */
    const refiTermM = Math.max(1, Math.round((newTermYears || 0) * 12));
    const refiAmort = Math.max(1, newAmortYears || 1);
    const refiCosts = Math.max(0, refiOtherCosts || 0) + penalty + discharge;

    const refiPrincipal = capitaliseCosts ? curP + refiCosts : curP;
    const B = interestOverMonths(refiPrincipal, newRatePct || 0, refiAmort, Math.min(analysisM, refiTermM));
    const refiMonthly = B.payment;
    const refiInterest = B.interest;
    const refiUpfrontCash = capitaliseCosts ? 0 : refiCosts; // cash out of pocket if not capitalized
    const horizonUsedB = Math.min(analysisM, refiTermM);

    // Interest saved vs stay (over same horizon)
    const horizonCommonAB = Math.min(horizonUsedA, horizonUsedB);
    const A_common = interestOverMonths(curP, curRatePct || 0, remAmort, horizonCommonAB).interest;
    const B_common = interestOverMonths(refiPrincipal, newRatePct || 0, refiAmort, horizonCommonAB).interest;
    const refiInterestSaved = Math.max(0, A_common - B_common);
    // Approx break-even months (accumulating interest savings until ≥ upfront cash)
    let breakEvenRefi: number | null = null;
    if (refiUpfrontCash > 0) {
      // simple monthly step approximation
      let cum = 0;
      for (let m = 1; m <= horizonCommonAB; m++) {
        const ia = interestOverMonths(curP, curRatePct || 0, remAmort, m).interest;
        const ib = interestOverMonths(refiPrincipal, newRatePct || 0, refiAmort, m).interest;
        const diff = Math.max(0, ia - ib) - (m === 1 ? refiUpfrontCash : 0); // subtract cash only once at start
        cum += Math.max(0, diff);
        if (cum >= refiUpfrontCash) { breakEvenRefi = m; break; }
      }
    } else {
      breakEvenRefi = 0; // no upfront cash; savings are immediate
    }

    /* --- Scenario C: Blend & Extend (optional) --- */
    let blend = null as null | {
      blendedRatePct: number,
      monthly: number,
      interest: number,
      upfrontCash: number,
      horizonUsed: number,
      interestSavedVsStay: number,
      breakEvenMonths: number | null,
      principalUsed: number,
      amortUsed: number,
    };
    if (useBlend) {
      const blendTermM = Math.max(1, Math.round((blendNewTermYears || 0) * 12));
      // Simple blended rate by *term-weighted* average of current remaining term and the extension portion.
      const w1 = Math.max(1, remTermM);
      const w2 = Math.max(1, blendTermM);
      const blendedRatePct = (curRatePct * w1 + (offerRatePct || 0) * w2) / (w1 + w2);

      const amort = blendResetAmort ? Math.max(1, blendAmortYears || 1) : remAmort;
      const costs = Math.max(0, blendCosts || 0) + (blendPenaltyWaived ? 0 : penalty) + (blendPenaltyWaived ? 0 : discharge);
      const principalUsed = blendCapitaliseCosts ? curP + costs : curP;
      const upfrontCash = blendCapitaliseCosts ? 0 : costs;

      const C = interestOverMonths(principalUsed, blendedRatePct, amort, Math.min(analysisM, blendTermM));
      const horizonUsedC = Math.min(analysisM, blendTermM);

      // Compare against stay on a common horizon
      const horizonCommonAC = Math.min(horizonUsedA, horizonUsedC);
      const A2 = interestOverMonths(curP, curRatePct || 0, remAmort, horizonCommonAC).interest;
      const C2 = interestOverMonths(principalUsed, blendedRatePct, amort, horizonCommonAC).interest;
      const saved = Math.max(0, A2 - C2);

      // Break-even months for blend
      let be: number | null = null;
      if (upfrontCash > 0) {
        let cum = 0;
        for (let m = 1; m <= horizonCommonAC; m++) {
          const ia = interestOverMonths(curP, curRatePct || 0, remAmort, m).interest;
          const ic = interestOverMonths(principalUsed, blendedRatePct, amort, m).interest;
          const diff = Math.max(0, ia - ic) - (m === 1 ? upfrontCash : 0);
          cum += Math.max(0, diff);
          if (cum >= upfrontCash) { be = m; break; }
        }
      } else {
        be = 0;
      }

      blend = {
        blendedRatePct,
        monthly: C.payment,
        interest: C.interest,
        upfrontCash,
        horizonUsed: horizonUsedC,
        interestSavedVsStay: saved,
        breakEvenMonths: be,
        principalUsed,
        amortUsed: amort,
      };
    }

    return {
      penalty, discharge,

      stay: {
        monthly: stayMonthly,
        interest: stayInterest,
        horizonUsed: horizonUsedA,
      },

      refi: {
        monthly: refiMonthly,
        interest: refiInterest,
        principalUsed: refiPrincipal,
        amortUsed: refiAmort,
        horizonUsed: horizonUsedB,
        upfrontCash: refiUpfrontCash,
        interestSavedVsStay: refiInterestSaved,
        breakEvenMonths: breakEvenRefi,
      },

      blend,
      horizonCommonAB,
    };
  }, [
    mortType, curBalance, curRatePct, remAmortYears, remTermYears,
    penaltyMode, manualPenalty, comparisonRatePct, adminFee,
    newRatePct, newAmortYears, newTermYears, refiOtherCosts, capitaliseCosts,
    useBlend, offerRatePct, blendNewTermYears, blendPenaltyWaived, blendResetAmort, blendAmortYears, blendCosts, blendCapitaliseCosts,
    analysisYears
  ]);

  /* ------------ Actions ------------ */
  function handlePrint() { window.print(); }
  function exportCSV() {
    const r = results;

    const rows: Array<Array<string | number>> = [
      ["Prepared", printDate],
      ["—", "—"],

      ["Current Mortgage"],
      ["Type", mortType === "fixed" ? "Fixed" : "Variable"],
      ["Balance", curBalance.toFixed(2)],
      ["Rate (%)", curRatePct.toFixed(2)],
      ["Remaining Amortization (years)", remAmortYears],
      ["Remaining Term (years)", remTermYears],

      ["Penalty Mode", penaltyMode],
      ["Manual Penalty (if applicable)", manualPenalty.toFixed(2)],
      ["Comparison Rate for IRD (%)", comparisonRatePct.toFixed(2)],
      ["Admin/Discharge Fee", adminFee.toFixed(2)],

      ["—", "—"],

      ["Refinance (New Mortgage)"],
      ["New Rate (%)", newRatePct.toFixed(2)],
      ["New Amortization (years)", newAmortYears],
      ["New Term (years)", newTermYears],
      ["Other Refi Costs", refiOtherCosts.toFixed(2)],
      ["Capitalise Costs", capitaliseCosts ? "Yes" : "No"],

      ["Blend & Extend (Optional)"],
      ["Use Blend", results.blend ? "Yes" : "No"],
      ["Offer Rate for Extension (%)", offerRatePct.toFixed(2)],
      ["New Term Length (years)", blendNewTermYears],
      ["Penalty Waived", blendPenaltyWaived ? "Yes" : "No"],
      ["Reset Amortization", blendResetAmort ? "Yes" : "No"],
      ["Blend Amortization (if reset)", blendAmortYears],
      ["Blend Costs", blendCosts.toFixed(2)],
      ["Blend Capitalise Costs", blendCapitaliseCosts ? "Yes" : "No"],

      ["—", "—"],
      ["Analysis Horizon (years)", analysisYears],
      ["Penalty Used (CAD)", r.penalty.toFixed(2)],
      ["Admin/Discharge Used (CAD)", r.discharge.toFixed(2)],

      ["—", "—"],
      ["Results — Stay"],
      ["Monthly Payment", r.stay.monthly.toFixed(2)],
      ["Interest over Horizon (months)", r.stay.horizonUsed],
      ["Interest over Horizon (CAD)", r.stay.interest.toFixed(2)],

      ["—", "—"],
      ["Results — Refinance"],
      ["Monthly Payment", r.refi.monthly.toFixed(2)],
      ["Principal Used (incl. capitalised costs)", r.refi.principalUsed.toFixed(2)],
      ["Amortization Used (years)", r.refi.amortUsed],
      ["Interest over Horizon (months)", r.refi.horizonUsed],
      ["Interest over Horizon (CAD)", r.refi.interest.toFixed(2)],
      ["Upfront Cash (if not capitalised)", r.refi.upfrontCash.toFixed(2)],
      ["Interest Saved vs Stay (common horizon)", r.refi.interestSavedVsStay.toFixed(2)],
      ["Break-even Months (approx.)", r.refi.breakEvenMonths ?? "—"],

      ...(r.blend ? [
        ["—", "—"],
        ["Results — Blend & Extend"],
        ["Blended Rate (%)", r.blend.blendedRatePct.toFixed(4)],
        ["Monthly Payment", r.blend.monthly.toFixed(2)],
        ["Principal Used (incl. capitalised costs)", r.blend.principalUsed.toFixed(2)],
        ["Amortization Used (years)", r.blend.amortUsed],
        ["Interest over Horizon (months)", r.blend.horizonUsed],
        ["Interest over Horizon (CAD)", r.blend.interest.toFixed(2)],
        ["Upfront Cash (if not capitalised)", r.blend.upfrontCash.toFixed(2)],
        ["Interest Saved vs Stay (common horizon)", r.blend.interestSavedVsStay.toFixed(2)],
        ["Break-even Months (approx.)", r.blend.breakEvenMonths ?? "—"],
      ] : []),
    ];

    downloadCSV("refinance_blend_estimator", rows);
  }
  function resetExample() {
    setMortType("fixed");
    setCurBalance(520_000);
    setCurRatePct(4.89);
    setRemAmortYears(22);
    setRemTermYears(2);

    setPenaltyMode("est3mo");
    setManualPenalty(0);
    setComparisonRatePct(3.39);
    setAdminFee(300);

    setNewRatePct(4.29);
    setNewAmortYears(25);
    setNewTermYears(5);
    setRefiOtherCosts(1500);
    setCapitaliseCosts(true);

    setUseBlend(true);
    setOfferRatePct(3.99);
    setBlendNewTermYears(5);
    setBlendPenaltyWaived(true);
    setBlendResetAmort(false);
    setBlendAmortYears(22);
    setBlendCosts(0);
    setBlendCapitaliseCosts(true);

    setAnalysisYears(2);
  }

  /* ------------ UI ------------ */
  return (
    <ToolShell
      title="Refinance & Blend-and-Extend Estimator"
      subtitle="Compare staying vs. refinancing vs. blend-and-extend. See payments, interest over a shared horizon, and an approximate break-even."
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
          title="Export results"
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
        {/* Current Mortgage */}
        <section className="rounded-2xl border border-brand-gold bg-white p-5 grid gap-3">
          <h3 className="font-serif text-lg text-brand-green font-bold">Current Mortgage</h3>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-brand-blue mb-1">Type</label>
              <div className="flex gap-4">
                <label className="inline-flex items-center gap-2">
                  <input type="radio" name="mtype" checked={mortType==="fixed"} onChange={()=>setMortType("fixed")} />
                  <span>Fixed</span>
                </label>
                <label className="inline-flex items-center gap-2">
                  <input type="radio" name="mtype" checked={mortType==="variable"} onChange={()=>setMortType("variable")} />
                  <span>Variable</span>
                </label>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-brand-blue mb-1">Balance (CAD)</label>
              <input type="number" min={0} inputMode="decimal"
                className="w-full rounded-xl border border-brand-gold/60 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-gold"
                value={curBalance} onChange={(e)=>setCurBalance(Number(e.target.value || 0))}/>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-sm font-medium text-brand-blue mb-1">Rate (annual %)</label>
              <input type="number" min={0} max={25} step={0.01} inputMode="decimal"
                className="w-full rounded-xl border border-brand-gold/60 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-gold"
                value={curRatePct} onChange={(e)=>setCurRatePct(Number(e.target.value || 0))}/>
            </div>
            <div>
              <label className="block text-sm font-medium text-brand-blue mb-1">Remaining Amort. (years)</label>
              <input type="number" min={1} max={35} step={1} inputMode="decimal"
                className="w-full rounded-xl border border-brand-gold/60 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-gold"
                value={remAmortYears} onChange={(e)=>setRemAmortYears(Number(e.target.value || 0))}/>
            </div>
            <div>
              <label className="block text-sm font-medium text-brand-blue mb-1">Remaining Term (years)</label>
              <input type="number" min={0.25} max={10} step={0.25} inputMode="decimal"
                className="w-full rounded-xl border border-brand-gold/60 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-gold"
                value={remTermYears} onChange={(e)=>setRemTermYears(Number(e.target.value || 0))}/>
            </div>
          </div>

          <div className="rounded-xl border border-brand-gold/40 bg-brand-beige/40 p-3">
            <div className="flex flex-wrap items-center gap-4">
              <div className="text-sm font-medium text-brand-green">Prepayment Penalty</div>
              <label className="inline-flex items-center gap-2 text-sm">
                <input type="radio" name="pen" checked={penaltyMode==="none"} onChange={()=>setPenaltyMode("none")} />
                <span>None</span>
              </label>
              <label className="inline-flex items-center gap-2 text-sm">
                <input type="radio" name="pen" checked={penaltyMode==="manual"} onChange={()=>setPenaltyMode("manual")} />
                <span>Enter amount</span>
              </label>
              <label className="inline-flex items-center gap-2 text-sm">
                <input type="radio" name="pen" checked={penaltyMode==="est3mo"} onChange={()=>setPenaltyMode("est3mo")} />
                <span>Estimate: 3-month interest</span>
              </label>
              <label className="inline-flex items-center gap-2 text-sm">
                <input type="radio" name="pen" checked={penaltyMode==="estIRD"} onChange={()=>setPenaltyMode("estIRD")} />
                <span>Estimate: IRD</span>
              </label>
            </div>

            {penaltyMode === "manual" && (
              <div className="mt-2 grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-brand-blue mb-1">Penalty amount (CAD)</label>
                  <input type="number" min={0} inputMode="decimal"
                    className="w-full rounded-xl border border-brand-gold/60 px-2 py-2 focus:outline-none focus:ring-2 focus:ring-brand-gold"
                    value={manualPenalty} onChange={(e)=>setManualPenalty(Number(e.target.value || 0))}/>
                </div>
              </div>
            )}

            {penaltyMode === "estIRD" && (
              <div className="mt-2 grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs text-brand-blue mb-1">Comparison Rate (% per year)</label>
                  <input type="number" min={0} max={25} step={0.01} inputMode="decimal"
                    className="w-full rounded-xl border border-brand-gold/60 px-2 py-2 focus:outline-none focus:ring-2 focus:ring-brand-gold"
                    value={comparisonRatePct} onChange={(e)=>setComparisonRatePct(Number(e.target.value || 0))}/>
                </div>
                <div className="col-span-2 text-xs text-brand-blue/70 flex items-center gap-2">
                  <FaInfoCircle /> Simple IRD estimate: Balance × (Contract − Comparison) × (Remaining term ÷ 12).
                </div>
              </div>
            )}

            <div className="mt-2 grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-brand-blue mb-1">Admin / Discharge Fee (CAD)</label>
                <input type="number" min={0} inputMode="decimal"
                  className="w-full rounded-xl border border-brand-gold/60 px-2 py-2 focus:outline-none focus:ring-2 focus:ring-brand-gold"
                  value={adminFee} onChange={(e)=>setAdminFee(Number(e.target.value || 0))}/>
              </div>
            </div>

            <p className="text-xs text-brand-blue/70 mt-2">
              Rule of thumb: fixed-rate penalties are often the greater of IRD vs. 3-month interest; variable-rate typically 3-month interest.
            </p>
          </div>
        </section>

        {/* Refinance (new mortgage) */}
        <section className="rounded-2xl border border-brand-gold bg-white p-5 grid gap-3">
          <h3 className="font-serif text-lg text-brand-green font-bold">Refinance — New Mortgage</h3>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-sm font-medium text-brand-blue mb-1">New Rate (annual %)</label>
              <input type="number" min={0} max={25} step={0.01} inputMode="decimal"
                className="w-full rounded-xl border border-brand-gold/60 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-gold"
                value={newRatePct} onChange={(e)=>setNewRatePct(Number(e.target.value || 0))}/>
            </div>
            <div>
              <label className="block text-sm font-medium text-brand-blue mb-1">New Amortization (years)</label>
              <select className="w-full rounded-xl border border-brand-gold/60 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-gold"
                value={newAmortYears} onChange={(e)=>setNewAmortYears(Number(e.target.value))}>
                <option value={20}>20</option>
                <option value={25}>25</option>
                <option value={30}>30</option>
                <option value={35}>35</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-brand-blue mb-1">New Term (years)</label>
              <select className="w-full rounded-xl border border-brand-gold/60 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-gold"
                value={newTermYears} onChange={(e)=>setNewTermYears(Number(e.target.value))}>
                <option value={1}>1</option>
                <option value={2}>2</option>
                <option value={3}>3</option>
                <option value={4}>4</option>
                <option value={5}>5</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-brand-blue mb-1">Other Refi Costs (CAD)</label>
              <input type="number" min={0} inputMode="decimal"
                className="w-full rounded-xl border border-brand-gold/60 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-gold"
                value={refiOtherCosts} onChange={(e)=>setRefiOtherCosts(Number(e.target.value || 0))}/>
            </div>
            <div className="flex items-end">
              <label className="inline-flex items-center gap-2">
                <input type="checkbox" checked={capitaliseCosts} onChange={(e)=>setCapitaliseCosts(e.target.checked)}/>
                <span>Capitalise penalty & costs into new mortgage</span>
              </label>
            </div>
          </div>
        </section>

        {/* Blend & Extend */}
        <section className="rounded-2xl border border-brand-gold bg-white p-5">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-serif text-lg text-brand-green font-bold">Blend & Extend (Optional)</h3>
            <label className="inline-flex items-center gap-2">
              <input type="checkbox" checked={useBlend} onChange={(e)=>setUseBlend(e.target.checked)} />
              <span>Include in comparison</span>
            </label>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-sm font-medium text-brand-blue mb-1">Offer Rate for Extension (annual %)</label>
              <input type="number" min={0} max={25} step={0.01} inputMode="decimal"
                className="w-full rounded-xl border border-brand-gold/60 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-gold"
                value={offerRatePct} onChange={(e)=>setOfferRatePct(Number(e.target.value || 0))}/>
            </div>
            <div>
              <label className="block text-sm font-medium text-brand-blue mb-1">Extend to New Term (years)</label>
              <select className="w-full rounded-xl border border-brand-gold/60 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-gold"
                value={blendNewTermYears} onChange={(e)=>setBlendNewTermYears(Number(e.target.value))}>
                <option value={1}>1</option><option value={2}>2</option><option value={3}>3</option><option value={4}>4</option><option value={5}>5</option>
              </select>
            </div>
            <div className="flex items-end">
              <label className="inline-flex items-center gap-2">
                <input type="checkbox" checked={blendPenaltyWaived} onChange={(e)=>setBlendPenaltyWaived(e.target.checked)} />
                <span>Assume penalty waived</span>
              </label>
            </div>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-brand-gold/40 bg-brand-beige/40 p-3">
              <label className="inline-flex items-center gap-2">
                <input type="checkbox" checked={blendResetAmort} onChange={(e)=>setBlendResetAmort(e.target.checked)} />
                <span className="font-medium text-brand-green">Reset amortization</span>
              </label>
              <div className="mt-2">
                <label className="block text-xs text-brand-blue mb-1">Amortization (years, if reset)</label>
                <input type="number" min={1} max={35} step={1} inputMode="decimal"
                  className="w-full rounded-xl border border-brand-gold/60 px-2 py-2 focus:outline-none focus:ring-2 focus:ring-brand-gold"
                  value={blendAmortYears} onChange={(e)=>setBlendAmortYears(Number(e.target.value || 0))}/>
              </div>
            </div>

            <div className="rounded-xl border border-brand-gold/40 bg-brand-beige/40 p-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-brand-blue mb-1">Blend Costs (CAD)</label>
                  <input type="number" min={0} inputMode="decimal"
                    className="w-full rounded-xl border border-brand-gold/60 px-2 py-2 focus:outline-none focus:ring-2 focus:ring-brand-gold"
                    value={blendCosts} onChange={(e)=>setBlendCosts(Number(e.target.value || 0))}/>
                </div>
                <div className="flex items-end">
                  <label className="inline-flex items-center gap-2">
                    <input type="checkbox" checked={blendCapitaliseCosts} onChange={(e)=>setBlendCapitaliseCosts(e.target.checked)} />
                    <span>Capitalise blend costs</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <p className="text-xs text-brand-blue/70 mt-2 flex items-start gap-2">
            <FaInfoCircle className="mt-0.5" />
            <span>
              Blended rate here uses a simple time-weighted average of your current rate over the remaining term and the offered rate over the new term.
              Actual lender formulas vary. Amortization is kept the same unless you choose to reset it.
            </span>
          </p>
        </section>

        {/* Analysis Horizon */}
        <section className="rounded-2xl border border-brand-gold bg-white p-5">
          <h3 className="font-serif text-lg text-brand-green font-bold mb-2">Analysis Horizon</h3>
          <label className="block text-sm font-medium text-brand-blue mb-1">Horizon (years)</label>
          <input type="number" min={1} max={10} step={1} inputMode="decimal"
            className="w-full rounded-xl border border-brand-gold/60 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-gold"
            value={analysisYears} onChange={(e)=>setAnalysisYears(Number(e.target.value || 0))}/>
          <p className="text-xs text-brand-blue/70 mt-2">
            For fairness, each scenario uses the shortest of its term and this horizon.
          </p>
        </section>
      </form>

      {/* Results */}
      <div className="mt-8 grid xl:grid-cols-3 gap-6">
        {/* Stay */}
        <section className="rounded-2xl border border-brand-gold bg-white p-5 avoid-break">
          <h3 className="font-serif text-xl text-brand-green font-bold mb-2">Stay (No Change)</h3>
          <div className="text-sm space-y-2">
            <div className="flex justify-between"><span>Monthly payment</span><span className="font-medium">{money(results.stay.monthly, 2)}</span></div>
            <div className="flex justify-between"><span>Interest over horizon</span><span className="font-medium">{money(results.stay.interest, 0)}</span></div>
            <div className="flex justify-between"><span>Horizon used</span><span className="font-medium">{results.stay.horizonUsed} months</span></div>
          </div>
        </section>

        {/* Refinance */}
        <section className="rounded-2xl border border-brand-gold bg-white p-5 avoid-break">
          <h3 className="font-serif text-xl text-brand-green font-bold mb-2">Refinance — New Mortgage</h3>
          <div className="text-sm space-y-2">
            <div className="flex justify-between"><span>Monthly payment</span><span className="font-medium">{money(results.refi.monthly, 2)}</span></div>
            <div className="flex justify-between">
              <span>Interest over horizon</span><span className="font-medium">{money(results.refi.interest, 0)}</span>
            </div>
            <div className="flex justify-between"><span>Horizon used</span><span className="font-medium">{results.refi.horizonUsed} months</span></div>
            <div className="flex justify-between border-t pt-2 mt-2">
              <span>Upfront cash (if not capitalised)</span>
              <span className="font-medium">{results.refi.upfrontCash ? money(results.refi.upfrontCash, 0) : "—"}</span>
            </div>
            <div className="flex justify-between">
              <span>Interest saved vs Stay (common horizon)</span>
              <span className="font-semibold">{money(results.refi.interestSavedVsStay, 0)}</span>
            </div>
            <div className="flex justify-between">
              <span>Break-even (approx.)</span>
              <span className="font-medium">{results.refi.breakEvenMonths === null ? "—" : `${results.refi.breakEvenMonths} mo`}</span>
            </div>
          </div>
        </section>

        {/* Blend */}
        <section className="rounded-2xl border border-brand-gold bg-white p-5 avoid-break">
          <h3 className="font-serif text-xl text-brand-green font-bold mb-2">Blend & Extend</h3>
          {results.blend ? (
            <div className="text-sm space-y-2">
              <div className="flex justify-between"><span>Blended rate</span><span className="font-medium">{results.blend.blendedRatePct.toFixed(3)}%</span></div>
              <div className="flex justify-between"><span>Monthly payment</span><span className="font-medium">{money(results.blend.monthly, 2)}</span></div>
              <div className="flex justify-between"><span>Interest over horizon</span><span className="font-medium">{money(results.blend.interest, 0)}</span></div>
              <div className="flex justify-between"><span>Horizon used</span><span className="font-medium">{results.blend.horizonUsed} months</span></div>
              <div className="flex justify-between border-t pt-2 mt-2">
                <span>Upfront cash (if not capitalised)</span>
                <span className="font-medium">{results.blend.upfrontCash ? money(results.blend.upfrontCash, 0) : "—"}</span>
              </div>
              <div className="flex justify-between">
                <span>Interest saved vs Stay (common horizon)</span>
                <span className="font-semibold">{money(results.blend.interestSavedVsStay, 0)}</span>
              </div>
              <div className="flex justify-between">
                <span>Break-even (approx.)</span>
                <span className="font-medium">{results.blend.breakEvenMonths === null ? "—" : `${results.blend.breakEvenMonths} mo`}</span>
              </div>
            </div>
          ) : (
            <p className="text-sm text-brand-blue/80">Blend comparison disabled.</p>
          )}
        </section>
      </div>

      {/* Assumptions & Notes */}
      <details className="mt-6 rounded-2xl border border-brand-gold/40 bg-brand-beige/40 p-4">
        <summary className="cursor-pointer font-semibold text-brand-green">Assumptions & Notes</summary>
        <ul className="list-disc ml-5 mt-2 text-sm text-brand-blue/80 space-y-1">
          <li>Payments are fully-amortizing and computed monthly using your inputs.</li>
          <li>“Stay” uses the remaining amortization and term; refinance and blend use their own amortization/term.</li>
          <li>Penalty estimates are simplified (3-month interest or simple IRD). Lender methods vary; your agreement governs.</li>
          <li>Blended rate uses a simple time-weighted average of current vs offered rate. Actual lender formulas can differ.</li>
          <li>Break-even is approximate, based on cumulative interest saved vs. any upfront cash paid.</li>
          <li>Educational tool only; not financial advice.</li>
        </ul>
      </details>

      {/* Print header (appears only when printing) */}
      <div className="hidden print:block mt-6 mb-3 text-center">
        <div className="font-serif font-bold text-brand-green text-2xl">Refinance & Blend — Summary</div>
        <div className="text-xs text-brand-blue">Prepared {printDate}</div>
        <div className="w-16 h-[2px] bg-brand-gold rounded-full mx-auto mt-2" />
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
