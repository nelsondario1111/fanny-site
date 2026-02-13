"use client";

import { useMemo, useState } from "react";
import ToolShell from "@/components/ToolShell";
import { FaPrint, FaFileCsv, FaPlus, FaTrash } from "react-icons/fa";

/* =========================================================
   Types
   ========================================================= */
type UnitRow = { id: number; label: string; rent: number };

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
/** Payment for a fully-amortizing loan (monthly) */
function monthlyPayment(P: number, annualRatePct: number, years: number) {
  const n = Math.max(1, Math.round(years * 12));
  const i = (annualRatePct / 100) / 12;
  if (i === 0) return P / n;
  return P * (i * Math.pow(1 + i, n)) / (Math.pow(1 + i, n) - 1);
}
/** CSV helpers (quotes + CRLF + BOM for Excel) */
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
  /* -----------------------------
     Purchase & Financing
     ----------------------------- */
  const [purchasePrice, setPurchasePrice] = useState<number>(850_000);
  const [downPct, setDownPct] = useState<number>(20);
  const [closingCosts, setClosingCosts] = useState<number>(15_000);
  const [initialRepairs, setInitialRepairs] = useState<number>(5_000);

  const [ratePct, setRatePct] = useState<number>(5.25);
  const [amortYears, setAmortYears] = useState<number>(25);

  /* -----------------------------
     Rental Income
     ----------------------------- */
  const [units, setUnits] = useState<UnitRow[]>([
    { id: 1, label: "Unit A", rent: 2200 },
    { id: 2, label: "Unit B", rent: 2100 },
  ]);
  const [vacancyPct, setVacancyPct] = useState<number>(4); // % of rent
  const [otherIncomeMonthly, setOtherIncomeMonthly] = useState<number>(100); // parking/laundry, monthly

  /* -----------------------------
     Operating Expenses (monthly fixed + % factors)
     ----------------------------- */
  const [taxesMonthly, setTaxesMonthly] = useState<number>(350);
  const [insuranceMonthly, setInsuranceMonthly] = useState<number>(100);
  const [utilitiesMonthly, setUtilitiesMonthly] = useState<number>(200);
  const [condoHOAMonthly, setCondoHOAMonthly] = useState<number>(0);
  const [lawnSnowMonthly, setLawnSnowMonthly] = useState<number>(0);
  const [otherFixedMonthly, setOtherFixedMonthly] = useState<number>(0);

  const [mgmtPctEGI, setMgmtPctEGI] = useState<number>(8); // % of Effective Gross Income
  const [maintenancePctGPR, setMaintenancePctGPR] = useState<number>(5); // % of GPR
  const [capexPctGPR, setCapexPctGPR] = useState<number>(5); // % of GPR

  const printDate = new Date().toLocaleDateString("en-CA", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  /* -----------------------------
     Derived metrics
     ----------------------------- */
  const {
    loanAmount,
    cashInvested,
    gprRentMonthly,
    gprRentAnnual,
    vacancyLossAnnual,
    otherIncomeAnnual,
    egiAnnual,
    fixedOpexAnnual,
    mgmtAnnual,
    maintenanceAnnual,
    capexAnnual,
    totalOpexAnnual,
    noiAnnual,
    adsAnnual,
    cashFlowBeforeTax,
    dscr,
    capRate,
    cashOnCash,
  } = useMemo(() => {
    const dpDec = Math.min(Math.max(downPct / 100, 0), 1);
    const loanAmount = Math.max(0, purchasePrice * (1 - dpDec));
    const cashInvested = purchasePrice * dpDec + (closingCosts || 0) + (initialRepairs || 0);

    const gprRentMonthly = units.reduce((sum, u) => sum + (u.rent || 0), 0);
    const gprRentAnnual = gprRentMonthly * 12;
    const vacancyLossAnnual = gprRentAnnual * Math.max(0, vacancyPct) / 100;
    const otherIncomeAnnual = (otherIncomeMonthly || 0) * 12;

    const egiAnnual = gprRentAnnual - vacancyLossAnnual + otherIncomeAnnual;

    const fixedMonthly =
      (taxesMonthly || 0) +
      (insuranceMonthly || 0) +
      (utilitiesMonthly || 0) +
      (condoHOAMonthly || 0) +
      (lawnSnowMonthly || 0) +
      (otherFixedMonthly || 0);
    const fixedOpexAnnual = fixedMonthly * 12;

    const mgmtAnnual = egiAnnual * Math.max(0, mgmtPctEGI) / 100;
    const maintenanceAnnual = gprRentAnnual * Math.max(0, maintenancePctGPR) / 100;
    const capexAnnual = gprRentAnnual * Math.max(0, capexPctGPR) / 100;

    const totalOpexAnnual = fixedOpexAnnual + mgmtAnnual + maintenanceAnnual + capexAnnual;

    const noiAnnual = egiAnnual - totalOpexAnnual;

    const monthlyPmt = monthlyPayment(loanAmount, Math.max(0, ratePct), Math.max(1, amortYears));
    // Include principal payments even when rate is 0% (interest-free financing scenario).
    const adsAnnual = loanAmount > 0 ? monthlyPmt * 12 : 0;

    const cashFlowBeforeTax = noiAnnual - adsAnnual;

    const dscr = adsAnnual > 0 ? noiAnnual / adsAnnual : NaN;
    const capRate = purchasePrice > 0 ? noiAnnual / purchasePrice : 0;
    const cashOnCash = cashInvested > 0 ? cashFlowBeforeTax / cashInvested : 0;

    return {
      loanAmount,
      cashInvested,
      gprRentMonthly,
      gprRentAnnual,
      vacancyLossAnnual,
      otherIncomeAnnual,
      egiAnnual,
      fixedOpexAnnual,
      mgmtAnnual,
      maintenanceAnnual,
      capexAnnual,
      totalOpexAnnual,
      noiAnnual,
      adsAnnual,
      cashFlowBeforeTax,
      dscr,
      capRate,
      cashOnCash,
    };
  }, [
    purchasePrice,
    downPct,
    closingCosts,
    initialRepairs,
    ratePct,
    amortYears,
    units,
    vacancyPct,
    otherIncomeMonthly,
    taxesMonthly,
    insuranceMonthly,
    utilitiesMonthly,
    condoHOAMonthly,
    lawnSnowMonthly,
    otherFixedMonthly,
    mgmtPctEGI,
    maintenancePctGPR,
    capexPctGPR,
  ]);

  /* -----------------------------
     Actions
     ----------------------------- */
  function addUnit() {
    setUnits((prev) => [...prev, { id: (prev.at(-1)?.id ?? 0) + 1, label: `Unit ${String.fromCharCode(65 + prev.length)}`, rent: 0 }]);
  }
  function removeUnit(id: number) {
    setUnits((prev) => prev.filter((u) => u.id !== id));
  }
  function updateUnit(id: number, patch: Partial<UnitRow>) {
    setUnits((prev) => prev.map((u) => (u.id === id ? { ...u, ...patch } : u)));
  }

  function handlePrint() {
    window.print(); // users can choose “Save as PDF”
  }

  function exportCSV() {
    const rows: Array<Array<string | number>> = [];
    rows.push(["Prepared", printDate]);
    rows.push(["Purchase Price", purchasePrice.toFixed(2)]);
    rows.push(["Down Payment (%)", downPct.toFixed(2)]);
    rows.push(["Loan Amount", loanAmount.toFixed(2)]);
    rows.push(["Closing Costs", (closingCosts || 0).toFixed(2)]);
    rows.push(["Initial Repairs", (initialRepairs || 0).toFixed(2)]);
    rows.push(["Interest Rate (%)", ratePct.toFixed(2)]);
    rows.push(["Amortization (years)", amortYears]);
    rows.push(["—", "—"]);

    rows.push(["Units"]);
    rows.push(["Label", "Monthly Rent"]);
    for (const u of units) rows.push([u.label, u.rent.toFixed(2)]);

    rows.push(["—", "—"]);
    rows.push(["Vacancy (%)", vacancyPct.toFixed(2)]);
    rows.push(["Other Income (monthly)", (otherIncomeMonthly || 0).toFixed(2)]);
    rows.push(["—", "—"]);

    rows.push(["Operating Expenses (monthly)"]);
    rows.push(["Property Taxes", (taxesMonthly || 0).toFixed(2)]);
    rows.push(["Insurance", (insuranceMonthly || 0).toFixed(2)]);
    rows.push(["Utilities", (utilitiesMonthly || 0).toFixed(2)]);
    rows.push(["Condo/HOA", (condoHOAMonthly || 0).toFixed(2)]);
    rows.push(["Lawn/Snow", (lawnSnowMonthly || 0).toFixed(2)]);
    rows.push(["Other Fixed", (otherFixedMonthly || 0).toFixed(2)]);
    rows.push(["—", "—"]);
    rows.push([`Mgmt (% of EGI)`, `${mgmtPctEGI.toFixed(2)}%`]);
    rows.push([`Maintenance (% of GPR)`, `${maintenancePctGPR.toFixed(2)}%`]);
    rows.push([`CapEx (% of GPR)`, `${capexPctGPR.toFixed(2)}%`]);

    rows.push(["—", "—"]);
    rows.push(["Derived (ANNUAL)"]);
    rows.push(["Gross Potential Rent (GPR)", gprRentAnnual.toFixed(2)]);
    rows.push(["Vacancy & Credit Loss", (-vacancyLossAnnual).toFixed(2)]);
    rows.push(["Other Income", otherIncomeAnnual.toFixed(2)]);
    rows.push(["Effective Gross Income (EGI)", egiAnnual.toFixed(2)]);
    rows.push(["Fixed Operating Expenses", (-fixedOpexAnnual).toFixed(2)]);
    rows.push(["Management", (-mgmtAnnual).toFixed(2)]);
    rows.push(["Maintenance", (-maintenanceAnnual).toFixed(2)]);
    rows.push(["CapEx", (-capexAnnual).toFixed(2)]);
    rows.push(["Total Operating Expenses", (-totalOpexAnnual).toFixed(2)]);
    rows.push(["NOI", noiAnnual.toFixed(2)]);
    rows.push(["Annual Debt Service (ADS)", (-adsAnnual).toFixed(2)]);
    rows.push(["Cash Flow (Before Tax)", cashFlowBeforeTax.toFixed(2)]);
    rows.push(["—", "—"]);
    rows.push(["DSCR", Number.isFinite(dscr) ? dscr.toFixed(2) : "—"]);
    rows.push(["Cap Rate", (capRate * 100).toFixed(2) + "%"]);
    rows.push(["Cash Invested", cashInvested.toFixed(2)]);
    rows.push(["Cash-on-Cash Return", (cashOnCash * 100).toFixed(2) + "%"]);

    downloadCSV("rental_cashflow_analysis", rows);
  }

  function resetExample() {
    setPurchasePrice(850_000);
    setDownPct(20);
    setClosingCosts(15_000);
    setInitialRepairs(5_000);
    setRatePct(5.25);
    setAmortYears(25);
    setUnits([
      { id: 1, label: "Unit A", rent: 2200 },
      { id: 2, label: "Unit B", rent: 2100 },
    ]);
    setVacancyPct(4);
    setOtherIncomeMonthly(100);
    setTaxesMonthly(350);
    setInsuranceMonthly(100);
    setUtilitiesMonthly(200);
    setCondoHOAMonthly(0);
    setLawnSnowMonthly(0);
    setOtherFixedMonthly(0);
    setMgmtPctEGI(8);
    setMaintenancePctGPR(5);
    setCapexPctGPR(5);
  }

  /* -----------------------------
     Render
     ----------------------------- */
  return (
    <ToolShell
      title="Rental Cash-Flow"
      subtitle="Project income, expenses, and financing to see NOI, DSCR, cap rate, and cash-on-cash."
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
          title="Export a line-item summary"
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
      <form className="grid xl:grid-cols-3 gap-6">
        {/* Purchase & Financing */}
        <section className="tool-card grid gap-3">
          <h3 className="font-sans text-lg text-brand-green font-semibold">Purchase & Financing</h3>
          <label className="block text-sm font-medium text-brand-blue mb-1">Purchase Price (CAD)</label>
          <input
            type="number"
            min={0}
            inputMode="decimal"
            className="tool-field-lg"
            value={purchasePrice}
            onChange={(e) => setPurchasePrice(Number(e.target.value || 0))}
          />
          <label className="block text-sm font-medium text-brand-blue mt-2 mb-1">Down Payment (% of price)</label>
          <input
            type="number"
            min={0}
            max={100}
            step={0.1}
            inputMode="decimal"
            className="tool-field-lg"
            value={downPct}
            onChange={(e) => setDownPct(Number(e.target.value || 0))}
          />
          <label className="block text-sm font-medium text-brand-blue mt-2 mb-1">Closing Costs (one-time, CAD)</label>
          <input
            type="number"
            min={0}
            inputMode="decimal"
            className="tool-field-lg"
            value={closingCosts}
            onChange={(e) => setClosingCosts(Number(e.target.value || 0))}
          />
          <label className="block text-sm font-medium text-brand-blue mt-2 mb-1">Initial Repairs / Turnover (CAD)</label>
          <input
            type="number"
            min={0}
            inputMode="decimal"
            className="tool-field-lg"
            value={initialRepairs}
            onChange={(e) => setInitialRepairs(Number(e.target.value || 0))}
          />
          <div className="grid grid-cols-2 gap-3 mt-2">
            <div>
              <label className="block text-sm font-medium text-brand-blue mb-1">Interest Rate (Annual %)</label>
              <input
                type="number"
                step={0.01}
                min={0}
                max={25}
                inputMode="decimal"
                className="tool-field-lg"
                value={ratePct}
                onChange={(e) => setRatePct(Number(e.target.value || 0))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-brand-blue mb-1">Amortization (years)</label>
              <select
                className="tool-field-lg"
                value={amortYears}
                onChange={(e) => setAmortYears(Number(e.target.value))}
              >
                <option value={20}>20</option>
                <option value={25}>25</option>
                <option value={30}>30</option>
              </select>
            </div>
          </div>
          <p className="text-xs text-brand-blue/70 mt-1">
            Loan amount is derived from price & down payment. Use 100% down payment for an all-cash scenario.
          </p>
        </section>

        {/* Rental Income */}
        <section className="tool-card">
          <h3 className="font-sans text-lg text-brand-green font-semibold mb-2">Rental Income</h3>
          <div className="flex flex-col gap-2">
            <div className="grid grid-cols-12 font-semibold text-sm text-brand-blue">
              <div className="col-span-6">Unit</div>
              <div className="col-span-5">Monthly Rent (CAD)</div>
              <div className="col-span-1 text-right"> </div>
            </div>
            {units.map((u) => (
              <div key={u.id} className="grid grid-cols-1 sm:grid-cols-12 items-center gap-2">
                <input
                  type="text"
                  className="sm:col-span-6 tool-field"
                  value={u.label}
                  onChange={(e) => updateUnit(u.id, { label: e.target.value })}
                />
                <input
                  type="number"
                  min={0}
                  inputMode="decimal"
                  className="sm:col-span-5 tool-field text-right"
                  value={u.rent}
                  onChange={(e) => updateUnit(u.id, { rent: Number(e.target.value || 0) })}
                />
                <button
                  type="button"
                  onClick={() => removeUnit(u.id)}
                  className="sm:col-span-1 justify-self-end text-brand-blue/70 hover:text-brand-blue"
                  title="Remove unit"
                  aria-label={`Remove ${u.label}`}
                >
                  <FaTrash aria-hidden />
                </button>
              </div>
            ))}
            <div className="mt-2">
              <button
                type="button"
                onClick={addUnit}
                className="tool-btn-green"
              >
                <FaPlus aria-hidden /> Add Unit
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-4">
            <div>
              <label className="block text-sm font-medium text-brand-blue mb-1">Vacancy & Credit Loss (%)</label>
              <input
                type="number"
                min={0}
                max={100}
                step={0.1}
                inputMode="decimal"
                className="tool-field"
                value={vacancyPct}
                onChange={(e) => setVacancyPct(Number(e.target.value || 0))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-brand-blue mb-1">Other Income (monthly, CAD)</label>
              <input
                type="number"
                min={0}
                inputMode="decimal"
                className="tool-field"
                value={otherIncomeMonthly}
                onChange={(e) => setOtherIncomeMonthly(Number(e.target.value || 0))}
              />
              <p className="text-xs text-brand-blue/70 mt-1">Parking, laundry, storage, etc.</p>
            </div>
          </div>

          <div className="mt-3 text-sm text-brand-blue/80">
            <div className="flex justify-between"><span>Gross Potential Rent (monthly)</span><span className="font-medium">{money(gprRentMonthly, 0)}</span></div>
            <div className="flex justify-between"><span>Gross Potential Rent (annual)</span><span className="font-medium">{money(gprRentAnnual, 0)}</span></div>
          </div>
        </section>

        {/* Operating Expenses */}
        <section className="tool-card">
          <h3 className="font-sans text-lg text-brand-green font-semibold mb-2">Operating Expenses</h3>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-brand-blue mb-1">Property Taxes (monthly)</label>
              <input
                type="number"
                min={0}
                inputMode="decimal"
                className="tool-field"
                value={taxesMonthly}
                onChange={(e) => setTaxesMonthly(Number(e.target.value || 0))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-brand-blue mb-1">Insurance (monthly)</label>
              <input
                type="number"
                min={0}
                inputMode="decimal"
                className="tool-field"
                value={insuranceMonthly}
                onChange={(e) => setInsuranceMonthly(Number(e.target.value || 0))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-brand-blue mb-1">Utilities (monthly)</label>
              <input
                type="number"
                min={0}
                inputMode="decimal"
                className="tool-field"
                value={utilitiesMonthly}
                onChange={(e) => setUtilitiesMonthly(Number(e.target.value || 0))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-brand-blue mb-1">Condo / HOA (monthly)</label>
              <input
                type="number"
                min={0}
                inputMode="decimal"
                className="tool-field"
                value={condoHOAMonthly}
                onChange={(e) => setCondoHOAMonthly(Number(e.target.value || 0))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-brand-blue mb-1">Lawn / Snow (monthly)</label>
              <input
                type="number"
                min={0}
                inputMode="decimal"
                className="tool-field"
                value={lawnSnowMonthly}
                onChange={(e) => setLawnSnowMonthly(Number(e.target.value || 0))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-brand-blue mb-1">Other Fixed (monthly)</label>
              <input
                type="number"
                min={0}
                inputMode="decimal"
                className="tool-field"
                value={otherFixedMonthly}
                onChange={(e) => setOtherFixedMonthly(Number(e.target.value || 0))}
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 mt-4">
            <div>
              <label className="block text-sm font-medium text-brand-blue mb-1">Management (% of EGI)</label>
              <input
                type="number"
                min={0}
                max={100}
                step={0.1}
                inputMode="decimal"
                className="tool-field"
                value={mgmtPctEGI}
                onChange={(e) => setMgmtPctEGI(Number(e.target.value || 0))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-brand-blue mb-1">Maintenance (% of GPR)</label>
              <input
                type="number"
                min={0}
                max={100}
                step={0.1}
                inputMode="decimal"
                className="tool-field"
                value={maintenancePctGPR}
                onChange={(e) => setMaintenancePctGPR(Number(e.target.value || 0))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-brand-blue mb-1">CapEx (% of GPR)</label>
              <input
                type="number"
                min={0}
                max={100}
                step={0.1}
                inputMode="decimal"
                className="tool-field"
                value={capexPctGPR}
                onChange={(e) => setCapexPctGPR(Number(e.target.value || 0))}
              />
            </div>
          </div>

          <p className="text-xs text-brand-blue/70 mt-2">
            Fixed expenses are annualized from the monthly inputs. Management is a % of <b>EGI</b>; maintenance and CapEx are % of <b>GPR</b>.
          </p>
        </section>
      </form>

      {/* Print header (only visible when printing) */}
      <div className="hidden print:block mt-6 mb-3 text-center">
        <div className="font-sans font-bold text-brand-green text-2xl">Rental Cash-Flow — Summary</div>
        <div className="text-xs text-brand-blue">Prepared {printDate}</div>
        <div className="w-16 h-[2px] bg-brand-gold rounded-full mx-auto mt-2" />
      </div>

      {/* Results */}
      <div className="mt-8 grid xl:grid-cols-3 gap-6">
        {/* Income Summary */}
        <section className="tool-card avoid-break">
          <h3 className="font-sans text-xl text-brand-green font-semibold mb-2">Income Summary (Annual)</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span>Gross Potential Rent (GPR)</span><span className="font-medium">{money(gprRentAnnual)}</span></div>
            <div className="flex justify-between"><span>Vacancy & Credit Loss</span><span className="font-medium">−{money(vacancyLossAnnual)}</span></div>
            <div className="flex justify-between"><span>Other Income</span><span className="font-medium">{money(otherIncomeAnnual)}</span></div>
            <div className="flex justify-between border-t pt-2 mt-2"><span>Effective Gross Income (EGI)</span><span className="font-semibold">{money(egiAnnual)}</span></div>
          </div>
        </section>

        {/* Operating Expenses */}
        <section className="tool-card avoid-break">
          <h3 className="font-sans text-xl text-brand-green font-semibold mb-2">Operating Expenses (Annual)</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span>Fixed expenses</span><span className="font-medium">−{money(fixedOpexAnnual)}</span></div>
            <div className="flex justify-between"><span>Management</span><span className="font-medium">−{money(mgmtAnnual)}</span></div>
            <div className="flex justify-between"><span>Maintenance</span><span className="font-medium">−{money(maintenanceAnnual)}</span></div>
            <div className="flex justify-between"><span>CapEx</span><span className="font-medium">−{money(capexAnnual)}</span></div>
            <div className="flex justify-between border-t pt-2 mt-2"><span>Total Operating Expenses</span><span className="font-semibold">−{money(totalOpexAnnual)}</span></div>
            <div className="flex justify-between"><span>NOI</span><span className="font-semibold">{money(noiAnnual)}</span></div>
          </div>
        </section>

        {/* Returns & Financing */}
        <section className="tool-card avoid-break">
          <h3 className="font-sans text-xl text-brand-green font-semibold mb-2">Returns & Financing</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span>Annual Debt Service (ADS)</span><span className="font-medium">−{money(adsAnnual)}</span></div>
            <div className="flex justify-between"><span>Cash Flow (before tax)</span><span className="font-semibold">{money(cashFlowBeforeTax)}</span></div>
            <div className="flex justify-between border-t pt-2 mt-2"><span>DSCR</span><span className="font-medium">{Number.isFinite(dscr) ? dscr.toFixed(2) : "—"}</span></div>
            <div className="flex justify-between"><span>Cap Rate</span><span className="font-medium">{pct(capRate)}</span></div>
            <div className="flex justify-between"><span>Cash Invested</span><span className="font-medium">{money(cashInvested)}</span></div>
            <div className="flex justify-between"><span>Cash-on-Cash Return</span><span className="font-medium">{pct(cashOnCash)}</span></div>
          </div>

          <details className="mt-4 rounded-xl border border-brand-gold/40 bg-brand-beige/40 p-4">
            <summary className="cursor-pointer font-semibold text-brand-green">Assumptions & Notes</summary>
            <ul className="list-disc ml-5 mt-2 text-sm text-brand-blue/80 space-y-1">
              <li>NOI excludes mortgage principal & interest (that’s shown as ADS).</li>
              <li>Management is a % of <b>EGI</b>; Maintenance & CapEx are % of <b>GPR</b>.</li>
              <li>Cash-on-Cash = (NOI − ADS) ÷ (Down + Closing + Initial Repairs).</li>
              <li>Estimates only; actuals vary by leases, utilities, and maintenance cycles.</li>
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
