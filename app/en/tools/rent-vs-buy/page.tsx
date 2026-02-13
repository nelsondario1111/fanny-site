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
/** Fully-amortizing monthly payment */
function monthlyPayment(P: number, annualRatePct: number, years: number) {
  const n = Math.max(1, Math.round(years * 12));
  const i = Math.max(0, annualRatePct) / 100 / 12;
  if (i === 0) return P / n;
  return (P * i * Math.pow(1 + i, n)) / (Math.pow(1 + i, n) - 1);
}
/** Remaining balance after m months (level-payment mortgage) */
function remainingBalance(P: number, annualRatePct: number, years: number, monthsElapsed: number) {
  const n = Math.max(1, Math.round(years * 12));
  const m = Math.min(Math.max(0, Math.floor(monthsElapsed)), n);
  const i = Math.max(0, annualRatePct) / 100 / 12;
  if (i === 0) return Math.max(0, P - (P / n) * m);
  const M = monthlyPayment(P, annualRatePct, years);
  const pow = Math.pow(1 + i, m);
  return P * pow - (M * (pow - 1)) / i;
}
/** Convert annual percentage rate to effective monthly rate */
function monthlyRateFromAnnualPct(annualPct: number) {
  const r = (annualPct || 0) / 100;
  return Math.pow(1 + r, 1 / 12) - 1;
}

/* =========================================================
   Page
   ========================================================= */
export default function Page() {
  /* -----------------------------
     BUY inputs
     ----------------------------- */
  const [purchasePrice, setPurchasePrice] = useState<number>(850_000);
  const [downPct, setDownPct] = useState<number>(20); // % of price
  const [ratePct, setRatePct] = useState<number>(5.49);
  const [amortYears, setAmortYears] = useState<number>(25);
  const [closingCosts, setClosingCosts] = useState<number>(15_000); // legal, land transfer, adjustments, etc.

  const [propertyTaxAnnual, setPropertyTaxAnnual] = useState<number>(4_250);
  const [maintenancePctAnnual, setMaintenancePctAnnual] = useState<number>(1.0); // % of property value per year
  const [hoaMonthly, setHoaMonthly] = useState<number>(0); // condo/strata/HOA
  const [homeInsMonthly, setHomeInsMonthly] = useState<number>(85);
  const [sellingCostPct, setSellingCostPct] = useState<number>(4); // % of sale price (agent+legal+misc)

  /* -----------------------------
     RENT inputs
     ----------------------------- */
  const [rentMonthly, setRentMonthly] = useState<number>(2_900);
  const [rentGrowthPctAnnual, setRentGrowthPctAnnual] = useState<number>(3.0);
  const [renterInsMonthly, setRenterInsMonthly] = useState<number>(25);

  /* -----------------------------
     Horizon & assumptions
     ----------------------------- */
  const [horizonYears, setHorizonYears] = useState<number>(7);
  const [homeAppreciationPctAnnual, setHomeAppreciationPctAnnual] = useState<number>(3.0);
  const [investmentReturnPctAnnual, setInvestmentReturnPctAnnual] = useState<number>(5.0);

  const printDate = new Date().toLocaleDateString("en-CA", { year: "numeric", month: "long", day: "numeric" });

  /* -----------------------------
     Derived simulation
     ----------------------------- */
  const results = useMemo(() => {
    const price = Math.max(0, purchasePrice || 0);
    const dpDec = Math.min(Math.max((downPct || 0) / 100, 0), 1);
    const downPayment = price * dpDec;
    const principal = Math.max(0, price - downPayment);

    const nMonths = Math.max(1, Math.round((horizonYears || 0) * 12));
    const i_rent = monthlyRateFromAnnualPct(rentGrowthPctAnnual || 0);
    const g_home = monthlyRateFromAnnualPct(homeAppreciationPctAnnual || 0); // can be negative
    const i_inv = monthlyRateFromAnnualPct(investmentReturnPctAnnual || 0);

    const M = monthlyPayment(principal, ratePct || 0, amortYears || 25);
    const mortgageMonths = Math.max(1, Math.round((amortYears || 25) * 12));

    let houseValue = price;
    let rent = Math.max(0, rentMonthly || 0);
    const taxPctOfValue = price > 0 ? (propertyTaxAnnual || 0) / price : 0;

    let totalOwnerCashOut = 0;
    let totalRenterCashOut = 0;

    // Renter investment account starts with avoided up-front cash.
    let renterFV = (downPayment + Math.max(0, closingCosts || 0));

    // Monthly cashflow (month 1) snapshot
    let ownerCashMonth1 = 0;
    let renterCashMonth1 = 0;

    for (let m = 1; m <= nMonths; m++) {
      const propertyTaxM = (taxPctOfValue * houseValue) / 12;
      const maintenanceM = (Math.max(0, maintenancePctAnnual || 0) / 100) * houseValue / 12;

      // Stop mortgage payments once loan is fully amortized
      const pmtThisMonth = m <= mortgageMonths ? M : 0;

      const ownerMonthlyCash =
        pmtThisMonth +
        propertyTaxM +
        maintenanceM +
        Math.max(0, hoaMonthly || 0) +
        Math.max(0, homeInsMonthly || 0);

      const renterMonthlyCash = rent + Math.max(0, renterInsMonthly || 0);

      if (m === 1) {
        ownerCashMonth1 = ownerMonthlyCash;
        renterCashMonth1 = renterMonthlyCash;
      }

      totalOwnerCashOut += ownerMonthlyCash;
      totalRenterCashOut += renterMonthlyCash;

      // Contributions at month end, then compounding
      const diff = ownerMonthlyCash - renterMonthlyCash; // positive = renting is cheaper
      renterFV = (renterFV + (diff > 0 ? diff : 0)) * (1 + i_inv);

      // Grow rent & house value for next month
      rent = rent * (1 + i_rent);
      houseValue = houseValue * (1 + g_home);
    }

    // Remaining mortgage & owner equity at horizon
    const remBal = remainingBalance(principal, ratePct || 0, amortYears || 25, nMonths);
    const salePrice = price * Math.pow(1 + g_home, nMonths);
    const saleCosts = salePrice * Math.max(0, sellingCostPct || 0) / 100;
    const ownerNetWorth = Math.max(0, salePrice - saleCosts - Math.max(0, remBal));

    const renterNetWorth = Math.max(0, renterFV);

    // Net advantage = owner equity - renter investments
    const netAdvantage = ownerNetWorth - renterNetWorth;

    // Interest/principal paid over the horizon
    const monthsPaid = Math.min(nMonths, mortgageMonths);
    const principalPaid = Math.max(0, principal - remainingBalance(principal, ratePct || 0, amortYears || 25, monthsPaid));
    const totalPaid = M * monthsPaid;
    const interestPaid = Math.max(0, totalPaid - principalPaid);

    // Simple break-even year scan (consistent with above model)
    let breakEvenYear: number | null = null;
    for (let y = 1; y <= Math.ceil(nMonths / 12); y++) {
      const months = Math.min(nMonths, y * 12);
      let rentY = Math.max(0, rentMonthly || 0);
      let hvY = price;
      let renterFVY = (downPayment + Math.max(0, closingCosts || 0));

      for (let m = 1; m <= months; m++) {
        const taxM = (taxPctOfValue * hvY) / 12;
        const maintM = (Math.max(0, maintenancePctAnnual || 0) / 100) * hvY / 12;
        const pmtY = m <= mortgageMonths ? M : 0;
        const ownerCash = pmtY + taxM + maintM + Math.max(0, hoaMonthly || 0) + Math.max(0, homeInsMonthly || 0);
        const renterCash = rentY + Math.max(0, renterInsMonthly || 0);
        const dif = ownerCash - renterCash;
        renterFVY = (renterFVY + (dif > 0 ? dif : 0)) * (1 + i_inv);
        rentY *= 1 + i_rent;
        hvY *= 1 + g_home;
      }
      const rb = remainingBalance(principal, ratePct || 0, amortYears || 25, months);
      const sp = price * Math.pow(1 + g_home, months);
      const sc = sp * Math.max(0, sellingCostPct || 0) / 100;
      const ownerNWy = Math.max(0, sp - sc - Math.max(0, rb));
      const renterNWy = Math.max(0, renterFVY);
      if (ownerNWy >= renterNWy) { breakEvenYear = y; break; }
    }

    return {
      M,
      ownerCashMonth1,
      renterCashMonth1,
      totalOwnerCashOut,
      totalRenterCashOut,
      ownerNetWorth,
      renterNetWorth,
      netAdvantage,
      remainingBalance: remBal,
      salePrice,
      saleCosts,
      downPayment,
      principal,
      breakEvenYear,
      principalPaid,
      interestPaid,
    };
  }, [
    purchasePrice, downPct, ratePct, amortYears, closingCosts,
    propertyTaxAnnual, maintenancePctAnnual, hoaMonthly, homeInsMonthly,
    sellingCostPct, rentMonthly, rentGrowthPctAnnual, renterInsMonthly,
    horizonYears, homeAppreciationPctAnnual, investmentReturnPctAnnual
  ]);

  const decisionHeadline =
    results.netAdvantage > 1_000
      ? "Buying leads at this horizon"
      : results.netAdvantage < -1_000
      ? "Renting leads at this horizon"
      : "Close outcome at this horizon";
  const decisionDetail =
    results.netAdvantage > 1_000
      ? `Buy is ahead by about ${money(results.netAdvantage, 0)} after ${horizonYears} years.`
      : results.netAdvantage < -1_000
      ? `Rent is ahead by about ${money(Math.abs(results.netAdvantage), 0)} after ${horizonYears} years.`
      : `Difference is about ${money(Math.abs(results.netAdvantage), 0)} after ${horizonYears} years.`;

  /* -----------------------------
     Actions
     ----------------------------- */
  function handlePrint() { window.print(); }
  function exportCSV() {
    const r = results;
    const rows: Array<Array<string | number>> = [
      ["Prepared", printDate],
      ["—", "—"],
      ["BUY — Inputs"],
      ["Purchase Price", purchasePrice.toFixed(2)],
      ["Down Payment (%)", downPct.toFixed(2)],
      ["Rate (%)", ratePct.toFixed(2)],
      ["Amortization (years)", amortYears],
      ["Closing Costs (est.)", closingCosts.toFixed(2)],
      ["Property Tax (annual)", propertyTaxAnnual.toFixed(2)],
      ["Maintenance (% of value, annual)", maintenancePctAnnual.toFixed(2)],
      ["HOA/Condo (monthly)", hoaMonthly.toFixed(2)],
      ["Home Insurance (monthly)", homeInsMonthly.toFixed(2)],
      ["Selling Cost (%)", sellingCostPct.toFixed(2)],
      ["—", "—"],
      ["RENT — Inputs"],
      ["Starting Rent (monthly)", rentMonthly.toFixed(2)],
      ["Rent Growth (% annual)", rentGrowthPctAnnual.toFixed(2)],
      ["Renter Insurance (monthly)", renterInsMonthly.toFixed(2)],
      ["—", "—"],
      ["Horizon & Assumptions"],
      ["Horizon (years)", horizonYears],
      ["Home Appreciation (% annual)", homeAppreciationPctAnnual.toFixed(2)],
      ["Investment Return (% annual)", investmentReturnPctAnnual.toFixed(2)],
      ["—", "—"],
      ["Key Results"],
      ["Monthly P&I", r.M.toFixed(2)],
      ["Month-1 Owner Cash Out", r.ownerCashMonth1.toFixed(2)],
      ["Month-1 Renter Cash Out", r.renterCashMonth1.toFixed(2)],
      ["Total Owner Cash Out (horizon)", r.totalOwnerCashOut.toFixed(2)],
      ["Total Renter Cash Out (horizon)", r.totalRenterCashOut.toFixed(2)],
      ["Owner Net Worth @ horizon", r.ownerNetWorth.toFixed(2)],
      ["Renter Net Worth @ horizon", r.renterNetWorth.toFixed(2)],
      ["Net Advantage (Buy − Rent)", r.netAdvantage.toFixed(2)],
      ["Break-Even Year", r.breakEvenYear ?? "Not reached"],
      ["Remaining Mortgage @ horizon", r.remainingBalance.toFixed(2)],
      ["Sale Price @ horizon", r.salePrice.toFixed(2)],
      ["Selling Costs @ horizon", r.saleCosts.toFixed(2)],
      ["Down Payment (CAD)", r.downPayment.toFixed(2)],
      ["Starting Principal (loan)", r.principal.toFixed(2)],
      ["Principal Paid (horizon)", r.principalPaid.toFixed(2)],
      ["Interest Paid (horizon)", r.interestPaid.toFixed(2)],
    ];
    downloadCSV("rent_vs_buy_summary", rows);
  }
  function resetExample() {
    setPurchasePrice(850_000);
    setDownPct(20);
    setRatePct(5.49);
    setAmortYears(25);
    setClosingCosts(15_000);
    setPropertyTaxAnnual(4_250);
    setMaintenancePctAnnual(1.0);
    setHoaMonthly(0);
    setHomeInsMonthly(85);
    setSellingCostPct(4);
    setRentMonthly(2_900);
    setRentGrowthPctAnnual(3.0);
    setRenterInsMonthly(25);
    setHorizonYears(7);
    setHomeAppreciationPctAnnual(3.0);
    setInvestmentReturnPctAnnual(5.0);
  }

  /* -----------------------------
     UI
     ----------------------------- */
  return (
    <ToolShell
      title="Rent vs. Buy"
      subtitle="Compare monthly cashflow, total cash out, and net worth at your horizon—using appreciation, rent growth, and investment return assumptions."
      lang="en"
    >
      {/* Toolbar */}
      <div className="tool-actions">
        <button
          type="button"
          onClick={handlePrint}
          className="tool-btn-primary"
          title="Open print dialog (choose 'Save as PDF')"
        >
          <FaPrint aria-hidden /> Print or Save PDF
        </button>
        <button
          type="button"
          onClick={exportCSV}
          className="tool-btn-blue"
          title="Export your comparison"
        >
          <FaFileCsv aria-hidden /> Export (CSV)
        </button>
        <button
          type="button"
          onClick={resetExample}
          className="tool-btn-gold"
          title="Reset values"
        >
          Reset values
        </button>
      </div>

      {/* Inputs */}
      <form className="grid 2xl:grid-cols-4 xl:grid-cols-3 gap-6">
        {/* Buy */}
        <section className="tool-card grid gap-3">
          <h3 className="font-sans text-lg text-brand-green font-semibold">Buy — Price & Financing</h3>
          <div>
            <label className="block text-sm font-medium text-brand-blue mb-1">Purchase Price (CAD)</label>
            <input type="number" min={0} inputMode="decimal"
              className="tool-field-lg"
              value={purchasePrice} onChange={(e)=>setPurchasePrice(Number(e.target.value || 0))}/>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-sm font-medium text-brand-blue mb-1">Down Payment (%)</label>
              <input type="number" min={0} max={100} step={0.1} inputMode="decimal"
                className="tool-field"
                value={downPct} onChange={(e)=>setDownPct(Number(e.target.value || 0))}/>
            </div>
            <div>
              <label className="block text-sm font-medium text-brand-blue mb-1">Rate (annual %)</label>
              <input type="number" min={0} max={25} step={0.01} inputMode="decimal"
                className="tool-field"
                value={ratePct} onChange={(e)=>setRatePct(Number(e.target.value || 0))}/>
            </div>
            <div>
              <label className="block text-sm font-medium text-brand-blue mb-1">Amortization (years)</label>
              <select
                className="tool-field"
                value={amortYears} onChange={(e)=>setAmortYears(Number(e.target.value))}
              >
                <option value={20}>20</option>
                <option value={25}>25</option>
                <option value={30}>30</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-brand-blue mb-1">Closing Costs (est.)</label>
              <input type="number" min={0} inputMode="decimal"
                className="tool-field"
                value={closingCosts} onChange={(e)=>setClosingCosts(Number(e.target.value || 0))}/>
            </div>
            <div>
              <label className="block text-sm font-medium text-brand-blue mb-1">Selling Cost (% of price)</label>
              <input type="number" min={0} max={10} step={0.1} inputMode="decimal"
                className="tool-field"
                value={sellingCostPct} onChange={(e)=>setSellingCostPct(Number(e.target.value || 0))}/>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-brand-blue mb-1">Property Taxes (annual)</label>
              <input type="number" min={0} inputMode="decimal"
                className="tool-field"
                value={propertyTaxAnnual} onChange={(e)=>setPropertyTaxAnnual(Number(e.target.value || 0))}/>
            </div>
            <div>
              <label className="block text-sm font-medium text-brand-blue mb-1">Maintenance (% of home value / year)</label>
              <input type="number" min={0} max={10} step={0.1} inputMode="decimal"
                className="tool-field"
                value={maintenancePctAnnual} onChange={(e)=>setMaintenancePctAnnual(Number(e.target.value || 0))}/>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-brand-blue mb-1">HOA / Condo (monthly)</label>
              <input type="number" min={0} inputMode="decimal"
                className="tool-field"
                value={hoaMonthly} onChange={(e)=>setHoaMonthly(Number(e.target.value || 0))}/>
            </div>
            <div>
              <label className="block text-sm font-medium text-brand-blue mb-1">Home Insurance (monthly)</label>
              <input type="number" min={0} inputMode="decimal"
                className="tool-field"
                value={homeInsMonthly} onChange={(e)=>setHomeInsMonthly(Number(e.target.value || 0))}/>
            </div>
          </div>
        </section>

        {/* Rent */}
        <section className="tool-card grid gap-3">
          <h3 className="font-sans text-lg text-brand-green font-semibold">Rent — Price & Growth</h3>
          <div>
            <label className="block text-sm font-medium text-brand-blue mb-1">Starting Rent (monthly)</label>
            <input type="number" min={0} inputMode="decimal"
              className="tool-field-lg"
              value={rentMonthly} onChange={(e)=>setRentMonthly(Number(e.target.value || 0))}/>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-brand-blue mb-1">Rent Growth (% annual)</label>
              <input type="number" min={0} max={15} step={0.1} inputMode="decimal"
                className="tool-field"
                value={rentGrowthPctAnnual} onChange={(e)=>setRentGrowthPctAnnual(Number(e.target.value || 0))}/>
            </div>
            <div>
              <label className="block text-sm font-medium text-brand-blue mb-1">Renter Insurance (monthly)</label>
              <input type="number" min={0} inputMode="decimal"
                className="tool-field"
                value={renterInsMonthly} onChange={(e)=>setRenterInsMonthly(Number(e.target.value || 0))}/>
            </div>
          </div>
        </section>

        {/* Horizon & assumptions */}
        <section className="tool-card">
          <h3 className="font-sans text-lg text-brand-green font-semibold mb-2">Horizon & Assumptions</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-brand-blue mb-1">Horizon (years)</label>
              <input type="number" min={1} max={40} step={1} inputMode="decimal"
                className="tool-field"
                value={horizonYears} onChange={(e)=>setHorizonYears(Number(e.target.value || 0))}/>
            </div>
            <div>
              <label className="block text-sm font-medium text-brand-blue mb-1">Investment Return (% annual)</label>
              <input type="number" min={0} max={15} step={0.1} inputMode="decimal"
                className="tool-field"
                value={investmentReturnPctAnnual} onChange={(e)=>setInvestmentReturnPctAnnual(Number(e.target.value || 0))}/>
            </div>
            <div>
              <label className="block text-sm font-medium text-brand-blue mb-1">Home Appreciation (% annual)</label>
              <input type="number" min={-10} max={20} step={0.1} inputMode="decimal"
                className="tool-field"
                value={homeAppreciationPctAnnual} onChange={(e)=>setHomeAppreciationPctAnnual(Number(e.target.value || 0))}/>
            </div>
          </div>
          <p className="text-xs text-brand-blue/70 mt-2">
            Renter’s investment starts with the down payment + closing costs (avoided up-front cash) and also invests any monthly savings when rent is cheaper than owning.
          </p>
        </section>
      </form>

      <section className="tool-card-compact mt-6 avoid-break">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <h3 className="font-sans text-lg text-brand-green font-semibold">{decisionHeadline}</h3>
          <span className="inline-flex w-fit items-center rounded-full border border-brand-gold/60 bg-brand-beige/60 px-3 py-1 text-xs font-medium text-brand-blue">
            Horizon: {horizonYears} years
          </span>
        </div>
        <p className="mt-2 text-sm text-brand-blue/90">{decisionDetail}</p>
      </section>

      {/* Results */}
      <div className="mt-8 grid xl:grid-cols-3 gap-6">
        <section className="tool-card avoid-break">
          <h3 className="font-sans text-xl text-brand-green font-semibold mb-2">Monthly Cashflow (Month 1)</h3>
          <div className="text-sm space-y-2">
            <div className="flex justify-between"><span>Owner cash out</span><span className="font-medium">{money(results.ownerCashMonth1, 2)}</span></div>
            <div className="flex justify-between"><span>Renter cash out</span><span className="font-medium">{money(results.renterCashMonth1, 2)}</span></div>
            <div className="flex justify-between border-t pt-2 mt-2">
              <span>Difference (Owner − Renter)</span>
              <span className="font-semibold">{money(results.ownerCashMonth1 - results.renterCashMonth1, 2)}</span>
            </div>
          </div>
          <p className="text-xs text-brand-blue/70 mt-2">Owner cash includes P&I, taxes, maintenance, HOA/condo, and home insurance.</p>
        </section>

        <section className="tool-card avoid-break">
          <h3 className="font-sans text-xl text-brand-green font-semibold mb-2">Total Cash Out (Horizon)</h3>
          <div className="text-sm space-y-2">
            <div className="flex justify-between"><span>Owner total cash out</span><span className="font-medium">{money(results.totalOwnerCashOut, 0)}</span></div>
            <div className="flex justify-between"><span>Renter total cash out</span><span className="font-medium">{money(results.totalRenterCashOut, 0)}</span></div>
          </div>
          <details className="mt-4 rounded-xl border border-brand-gold/40 bg-brand-beige/40 p-4">
            <summary className="cursor-pointer font-semibold text-brand-green">What’s included?</summary>
            <ul className="list-disc ml-5 mt-2 text-sm text-brand-blue/80 space-y-1">
              <li>Owner: monthly P&amp;I (stops once fully paid) + property taxes + maintenance (% of value) + HOA/condo + home insurance.</li>
              <li>Renter: monthly rent with growth + renter’s insurance.</li>
              <li>Up-front down payment and closing costs are accounted for in net-worth (not double-counted here).</li>
            </ul>
          </details>
        </section>

        <section className="tool-card avoid-break">
          <h3 className="font-sans text-xl text-brand-green font-semibold mb-2">Net Worth at Horizon</h3>
          <div className="text-sm space-y-2">
            <div className="flex justify-between"><span>Owner equity (after sale costs & mortgage)</span><span className="font-medium">{money(results.ownerNetWorth, 0)}</span></div>
            <div className="flex justify-between"><span>Renter’s invested assets</span><span className="font-medium">{money(results.renterNetWorth, 0)}</span></div>
            <div className="flex justify-between border-t pt-2 mt-2">
              <span className="font-semibold">Net advantage (Buy − Rent)</span>
              <span className="font-semibold">{money(results.netAdvantage, 0)}</span>
            </div>
            <div className="flex justify-between">
              <span>Break-even (first year Buy ≥ Rent)</span>
              <span className="font-medium">{results.breakEvenYear ?? "Not reached"}</span>
            </div>
            <div className="flex justify-between border-t pt-2 mt-2">
              <span>Principal paid (horizon)</span>
              <span className="font-medium">{money(results.principalPaid, 0)}</span>
            </div>
            <div className="flex justify-between">
              <span>Interest paid (horizon)</span>
              <span className="font-medium">{money(results.interestPaid, 0)}</span>
            </div>
          </div>
          <p className="text-xs text-brand-blue/70 mt-2">
            Owner equity is sale price minus selling costs and remaining mortgage balance. Renter invests the avoided down/closing and any monthly savings when rent is cheaper.
          </p>
        </section>
      </div>

      {/* Print header (only when printing) */}
      <div className="hidden print:block mt-6 mb-3 text-center">
        <div className="font-sans font-bold text-brand-green text-2xl">Rent vs. Buy — Summary</div>
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
