// app/en/tools/affordability-stress-test/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import ToolShell from "@/components/ToolShell";

/**
 * Affordability & Stress Test
 * --------------------------------------------------------------
 * - Qualifying (stress-test) rate: max(contract + 2%, benchmark).
 * - GDS: (mortgage pmt + property tax + heat + 50% condo fees) / income.
 * - TDS: GDS + other monthly debts.
 * - "Max Mortgage" mode: solves principal from allowable payment (min of GDS/TDS caps).
 * - "Scenario Check" mode: tests a given purchase & down payment.
 * - Inputs persist to localStorage (per-tool key).
 * - Educational only — confirm with lender/insurer.
 */

// ---------- Helpers ----------
const CAD0 = new Intl.NumberFormat("en-CA", { style: "currency", currency: "CAD", maximumFractionDigits: 0 });
const CAD2 = new Intl.NumberFormat("en-CA", { style: "currency", currency: "CAD", minimumFractionDigits: 2, maximumFractionDigits: 2 });
const NUM = (s: string) => {
  const x = Number(String(s).replace(/[^\d.-]/g, ""));
  return Number.isFinite(x) ? x : 0;
};
const clamp = (n: number, lo: number, hi: number) => Math.min(Math.max(n, lo), hi);
function pmt(principal: number, annualRatePct: number, years: number) {
  if (principal <= 0 || years <= 0) return 0;
  const r = (annualRatePct / 100) / 12;
  const n = years * 12;
  if (r === 0) return principal / n;
  const pow = Math.pow(1 + r, n);
  return (principal * r * pow) / (pow - 1);
}
function principalFromPayment(paymentMonthly: number, annualRatePct: number, years: number) {
  if (paymentMonthly <= 0 || years <= 0) return 0;
  const r = (annualRatePct / 100) / 12;
  const n = years * 12;
  if (r === 0) return paymentMonthly * n;
  const pow = Math.pow(1 + r, n);
  return paymentMonthly * (pow - 1) / (r * pow);
}

// ---------- Defaults & storage ----------
const LS_KEY = "tools.affordability_stress_test.v1";

const DEFAULTS = {
  mode: "max" as "max" | "scenario",
  annualIncome: "140000",
  monthlyDebts: "350",
  propertyTaxAnnual: "4200",
  heatMonthly: "120",
  condoFeesMonthly: "0",
  contractRatePct: "4.84",
  benchmarkRatePct: "5.25",
  amortYears: "25",
  gdsPct: "39",
  tdsPct: "44",
  purchasePrice: "800000",
  downPayment: "80000",
};

export default function Page() {
  // ---------- State (restored from localStorage) ----------
  const [mode, setMode] = useState<"max" | "scenario">(DEFAULTS.mode);

  const [annualIncome, setAnnualIncome] = useState(DEFAULTS.annualIncome);
  const [monthlyDebts, setMonthlyDebts] = useState(DEFAULTS.monthlyDebts);

  const [propertyTaxAnnual, setPropertyTaxAnnual] = useState(DEFAULTS.propertyTaxAnnual);
  const [heatMonthly, setHeatMonthly] = useState(DEFAULTS.heatMonthly);
  const [condoFeesMonthly, setCondoFeesMonthly] = useState(DEFAULTS.condoFeesMonthly);

  const [contractRatePct, setContractRatePct] = useState(DEFAULTS.contractRatePct);
  const [benchmarkRatePct, setBenchmarkRatePct] = useState(DEFAULTS.benchmarkRatePct);
  const [amortYears, setAmortYears] = useState(DEFAULTS.amortYears);

  const [gdsPct, setGdsPct] = useState(DEFAULTS.gdsPct);
  const [tdsPct, setTdsPct] = useState(DEFAULTS.tdsPct);

  // Scenario
  const [purchasePrice, setPurchasePrice] = useState(DEFAULTS.purchasePrice);
  const [downPayment, setDownPayment] = useState(DEFAULTS.downPayment);

  // Load & persist
  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) {
        const v = JSON.parse(raw);
        if (v && typeof v === "object") {
          setMode(v.mode ?? DEFAULTS.mode);
          setAnnualIncome(v.annualIncome ?? DEFAULTS.annualIncome);
          setMonthlyDebts(v.monthlyDebts ?? DEFAULTS.monthlyDebts);
          setPropertyTaxAnnual(v.propertyTaxAnnual ?? DEFAULTS.propertyTaxAnnual);
          setHeatMonthly(v.heatMonthly ?? DEFAULTS.heatMonthly);
          setCondoFeesMonthly(v.condoFeesMonthly ?? DEFAULTS.condoFeesMonthly);
          setContractRatePct(v.contractRatePct ?? DEFAULTS.contractRatePct);
          setBenchmarkRatePct(v.benchmarkRatePct ?? DEFAULTS.benchmarkRatePct);
          setAmortYears(v.amortYears ?? DEFAULTS.amortYears);
          setGdsPct(v.gdsPct ?? DEFAULTS.gdsPct);
          setTdsPct(v.tdsPct ?? DEFAULTS.tdsPct);
          setPurchasePrice(v.purchasePrice ?? DEFAULTS.purchasePrice);
          setDownPayment(v.downPayment ?? DEFAULTS.downPayment);
        }
      }
    } catch {}
  }, []);

  useEffect(() => {
    const payload = {
      mode,
      annualIncome,
      monthlyDebts,
      propertyTaxAnnual,
      heatMonthly,
      condoFeesMonthly,
      contractRatePct,
      benchmarkRatePct,
      amortYears,
      gdsPct,
      tdsPct,
      purchasePrice,
      downPayment,
    };
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(payload));
    } catch {}
  }, [
    mode, annualIncome, monthlyDebts, propertyTaxAnnual, heatMonthly, condoFeesMonthly,
    contractRatePct, benchmarkRatePct, amortYears, gdsPct, tdsPct, purchasePrice, downPayment
  ]);

  // ---------- Model ----------
  const m = useMemo(() => {
    const incMonthly = NUM(annualIncome) / 12;
    const debtsM = NUM(monthlyDebts);

    const taxM = NUM(propertyTaxAnnual) / 12;
    const heatM = NUM(heatMonthly);
    const condoM = NUM(condoFeesMonthly);
    const condoCounted = condoM * 0.5; // 50% of condo fees commonly counted

    const gds = clamp(NUM(gdsPct), 20, 50);
    const tds = clamp(NUM(tdsPct), 20, 60);
    const amort = clamp(NUM(amortYears), 5, 35);

    const contract = NUM(contractRatePct);
    const benchmark = NUM(benchmarkRatePct);
    const qualifyingRate = Math.max(contract + 2, benchmark);

    // Caps (monthly)
    const gdsCap = incMonthly * (gds / 100);
    const tdsCap = incMonthly * (tds / 100);

    // Counted housing in ratios
    const countedHousing = taxM + heatM + condoCounted;

    // Allowable mortgage payment under each ratio
    const allowGDS = Math.max(0, gdsCap - countedHousing);
    const allowTDS = Math.max(0, tdsCap - (countedHousing + debtsM));
    const pmtAllow = Math.min(allowGDS, allowTDS);

    // Principal capacity at qualifying rate
    const maxMortgage = principalFromPayment(pmtAllow, qualifyingRate, amort);

    // Scenario
    const price = NUM(purchasePrice);
    const down = Math.min(NUM(downPayment), price);
    const scenarioLoan = Math.max(0, price - down);
    const scenarioPmt = pmt(scenarioLoan, qualifyingRate, amort);
    const gdsScenario = incMonthly > 0 ? ((scenarioPmt + countedHousing) / incMonthly) * 100 : 0;
    const tdsScenario = incMonthly > 0 ? ((scenarioPmt + countedHousing + debtsM) / incMonthly) * 100 : 0;
    const scenarioPass =
      incMonthly > 0 &&
      scenarioLoan > 0 &&
      gdsScenario <= gds + 1e-6 &&
      tdsScenario <= tds + 1e-6;

    const bindingCap =
      pmtAllow <= 0 ? "None" : allowGDS <= allowTDS ? "GDS" : "TDS";

    const perThousand = pmt(1000, qualifyingRate, amort);

    return {
      incMonthly, debtsM, taxM, heatM, condoM, condoCounted,
      gds, tds, gdsCap, tdsCap, countedHousing,
      contract, benchmark, qualifyingRate, amort,
      allowGDS, allowTDS, pmtAllow, maxMortgage,
      price, down, scenarioLoan, scenarioPmt, gdsScenario, tdsScenario, scenarioPass,
      perThousand, bindingCap,
    };
  }, [
    annualIncome, monthlyDebts, propertyTaxAnnual, heatMonthly, condoFeesMonthly,
    gdsPct, tdsPct, amortYears, contractRatePct, benchmarkRatePct,
    purchasePrice, downPayment
  ]);

  // ---------- UI actions ----------
  const onPrint = () => window.print();
  const onReset = () => {
    setMode(DEFAULTS.mode);
    setAnnualIncome(DEFAULTS.annualIncome);
    setMonthlyDebts(DEFAULTS.monthlyDebts);
    setPropertyTaxAnnual(DEFAULTS.propertyTaxAnnual);
    setHeatMonthly(DEFAULTS.heatMonthly);
    setCondoFeesMonthly(DEFAULTS.condoFeesMonthly);
    setContractRatePct(DEFAULTS.contractRatePct);
    setBenchmarkRatePct(DEFAULTS.benchmarkRatePct);
    setAmortYears(DEFAULTS.amortYears);
    setGdsPct(DEFAULTS.gdsPct);
    setTdsPct(DEFAULTS.tdsPct);
    setPurchasePrice(DEFAULTS.purchasePrice);
    setDownPayment(DEFAULTS.downPayment);
  };

  return (
    <ToolShell
      title="Affordability & Stress Test"
      subtitle="Check your GDS/TDS at the qualifying rate and estimate your maximum affordable mortgage — or test a specific scenario."
      lang="en"
    >
      {/* Top actions */}
      <div className="tool-actions">
        <button
          type="button"
          onClick={onPrint}
          className="tool-btn-blue"
        >
          Print or Save PDF
        </button>
        <button
          type="button"
          onClick={onReset}
          className="tool-btn-gold"
        >
          Reset values
        </button>
      </div>

      {/* Mode toggle */}
      <div className="mb-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setMode("max")}
          className={`tool-btn border-2 transition ${mode === "max"
            ? "border-brand-blue bg-brand-blue text-white"
            : "border-brand-green text-brand-green hover:bg-brand-green hover:text-white"}`}
          aria-pressed={mode === "max"}
        >
          Max Mortgage
        </button>
        <button
          type="button"
          onClick={() => setMode("scenario")}
          className={`tool-btn border-2 transition ${mode === "scenario"
            ? "border-brand-blue bg-brand-blue text-white"
            : "border-brand-green text-brand-green hover:bg-brand-green hover:text-white"}`}
          aria-pressed={mode === "scenario"}
        >
          Scenario Check
        </button>
      </div>

      {/* Content */}
      <form className="grid xl:grid-cols-2 gap-6">
        {/* Inputs */}
        <section className="tool-card grid gap-3">
          <h3 className="font-sans text-lg text-brand-green font-semibold">Inputs</h3>

          {/* Income & debts */}
          <div className="grid sm:grid-cols-2 gap-3">
            <label className="block">
              <span className="block text-sm text-brand-blue/80">Household gross income (annual)</span>
              <input
                value={annualIncome}
                onChange={(e) => setAnnualIncome(e.target.value)}
                inputMode="decimal"
                className="mt-1 tool-field"
                aria-label="Household annual gross income"
              />
            </label>
            <label className="block">
              <span className="block text-sm text-brand-blue/80">Monthly non-mortgage debts</span>
              <input
                value={monthlyDebts}
                onChange={(e) => setMonthlyDebts(e.target.value)}
                inputMode="decimal"
                className="mt-1 tool-field"
                aria-label="Monthly non-mortgage debts"
              />
            </label>
          </div>

          {/* Housing costs */}
          <div className="grid sm:grid-cols-3 gap-3">
            <label className="block">
              <span className="block text-sm text-brand-blue/80">Property tax (annual)</span>
              <input
                value={propertyTaxAnnual}
                onChange={(e) => setPropertyTaxAnnual(e.target.value)}
                inputMode="decimal"
                className="mt-1 tool-field"
                aria-label="Annual property tax"
              />
            </label>
            <label className="block">
              <span className="block text-sm text-brand-blue/80">Heating (monthly)</span>
              <input
                value={heatMonthly}
                onChange={(e) => setHeatMonthly(e.target.value)}
                inputMode="decimal"
                className="mt-1 tool-field"
                aria-label="Monthly heating cost"
              />
            </label>
            <label className="block">
              <span className="block text-sm text-brand-blue/80">Condo fees (monthly)</span>
              <input
                value={condoFeesMonthly}
                onChange={(e) => setCondoFeesMonthly(e.target.value)}
                inputMode="decimal"
                className="mt-1 tool-field"
                aria-label="Monthly condo fees"
              />
            </label>
          </div>

          {/* Rates / amortization / ratios */}
          <div className="grid sm:grid-cols-3 gap-3">
            <label className="block">
              <span className="block text-sm text-brand-blue/80">Contract rate (annual %)</span>
              <input
                value={contractRatePct}
                onChange={(e) => setContractRatePct(e.target.value)}
                inputMode="decimal"
                className="mt-1 tool-field"
                aria-label="Contract interest rate"
              />
            </label>
            <label className="block">
              <span className="block text-sm text-brand-blue/80">Benchmark rate (annual %)</span>
              <input
                value={benchmarkRatePct}
                onChange={(e) => setBenchmarkRatePct(e.target.value)}
                inputMode="decimal"
                className="mt-1 tool-field"
                aria-label="Benchmark qualifying rate"
              />
            </label>
            <label className="block">
              <span className="block text-sm text-brand-blue/80">Amortization (years)</span>
              <input
                value={amortYears}
                onChange={(e) => setAmortYears(e.target.value)}
                inputMode="numeric"
                className="mt-1 tool-field"
                aria-label="Amortization in years"
              />
            </label>
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            <label className="block">
              <span className="block text-sm text-brand-blue/80">GDS limit (%)</span>
              <input
                value={gdsPct}
                onChange={(e) => setGdsPct(e.target.value)}
                inputMode="decimal"
                className="mt-1 tool-field"
                aria-label="GDS limit percent"
              />
            </label>
            <label className="block">
              <span className="block text-sm text-brand-blue/80">TDS limit (%)</span>
              <input
                value={tdsPct}
                onChange={(e) => setTdsPct(e.target.value)}
                inputMode="decimal"
                className="mt-1 tool-field"
                aria-label="TDS limit percent"
              />
            </label>
          </div>

          {/* Scenario fields */}
          {mode === "scenario" && (
            <div className="grid sm:grid-cols-2 gap-3">
              <label className="block">
                <span className="block text-sm text-brand-blue/80">Purchase price</span>
                <input
                  value={purchasePrice}
                  onChange={(e) => setPurchasePrice(e.target.value)}
                  inputMode="decimal"
                  className="mt-1 tool-field"
                  aria-label="Purchase price"
                />
              </label>
              <label className="block">
                <span className="block text-sm text-brand-blue/80">Down payment</span>
                <input
                  value={downPayment}
                  onChange={(e) => setDownPayment(e.target.value)}
                  inputMode="decimal"
                  className="mt-1 tool-field"
                  aria-label="Down payment"
                />
              </label>
            </div>
          )}
        </section>

        {/* Results */}
        <section className="tool-card">
          <h3 className="font-sans text-lg text-brand-green font-semibold">Results</h3>

          <div className="grid sm:grid-cols-2 gap-4 mt-2">
            <div>
              <div className="text-sm text-brand-blue/80">Qualifying (stress-test) rate</div>
              <div className="text-2xl font-bold text-brand-green">{m.qualifyingRate.toFixed(2)}%</div>
              <div className="text-xs text-brand-blue/70">
                max(Contract {m.contract.toFixed(2)}% + 2%, Benchmark {m.benchmark.toFixed(2)}%)
              </div>
            </div>
            <div>
              <div className="text-sm text-brand-blue/80">Payment per $1,000 at qualifying</div>
              <div className="text-2xl font-bold text-brand-green">{m.perThousand ? CAD2.format(m.perThousand) : "—"}</div>
              <div className="text-xs text-brand-blue/70">{m.amort} years amortization</div>
            </div>
          </div>

          <hr className="my-4 border-brand-gold/30" />

          {mode === "max" ? (
            <>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-brand-blue/80">GDS cap (monthly)</div>
                  <div className="text-xl font-semibold">{CAD0.format(Math.round(m.gdsCap))}</div>
                </div>
                <div>
                  <div className="text-sm text-brand-blue/80">TDS cap (monthly)</div>
                  <div className="text-xl font-semibold">{CAD0.format(Math.round(m.tdsCap))}</div>
                </div>
                <div>
                  <div className="text-sm text-brand-blue/80">Counted housing costs</div>
                  <div className="text-xl font-semibold">{CAD0.format(Math.round(m.countedHousing))}</div>
                  <div className="text-xs text-brand-blue/70">
                    Taxes {CAD0.format(Math.round(m.taxM))} + Heat {CAD0.format(Math.round(m.heatM))} + 50% Condo {CAD0.format(Math.round(m.condoCounted))}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-brand-blue/80">Other debts (monthly)</div>
                  <div className="text-xl font-semibold">{CAD0.format(Math.round(m.debtsM))}</div>
                </div>
              </div>

              <div className="mt-4 grid sm:grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-brand-blue/80">Allowable mortgage payment (GDS)</div>
                  <div className="text-xl font-semibold">{CAD0.format(Math.round(m.allowGDS))}</div>
                </div>
                <div>
                  <div className="text-sm text-brand-blue/80">Allowable mortgage payment (TDS)</div>
                  <div className="text-xl font-semibold">{CAD0.format(Math.round(m.allowTDS))}</div>
                </div>
              </div>

              <div className="mt-4">
                <div className="text-sm text-brand-blue/80">Max affordable mortgage (principal)</div>
                <div className="text-2xl font-bold text-brand-green">
                  {m.maxMortgage ? CAD0.format(Math.round(m.maxMortgage)) : "—"}
                </div>
                <div className="text-xs text-brand-blue/70 mt-1">
                  Binding ratio: {m.bindingCap}
                </div>
              </div>

              {m.incMonthly <= 0 ? (
                <p className="mt-3 text-xs text-red-700">
                  Enter a positive household income to estimate affordability.
                </p>
              ) : (
                <p className="mt-3 text-xs text-brand-blue/70">
                  Uses your inputs and selected ratio limits ({m.gds}% / {m.tds}%). Actual qualification depends on lender/insurer policies.
                </p>
              )}
            </>
          ) : (
            <>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-brand-blue/80">Scenario mortgage (principal)</div>
                  <div className="text-xl font-semibold">{CAD0.format(Math.round(m.scenarioLoan))}</div>
                </div>
                <div>
                  <div className="text-sm text-brand-blue/80">Qualifying payment (monthly)</div>
                  <div className="text-xl font-semibold">{m.scenarioLoan ? CAD2.format(m.scenarioPmt) : "—"}</div>
                </div>
                <div>
                  <div className="text-sm text-brand-blue/80">GDS</div>
                  <div className="text-xl font-semibold">{m.scenarioLoan ? `${m.gdsScenario.toFixed(1)}%` : "—"}</div>
                </div>
                <div>
                  <div className="text-sm text-brand-blue/80">TDS</div>
                  <div className="text-xl font-semibold">{m.scenarioLoan ? `${m.tdsScenario.toFixed(1)}%` : "—"}</div>
                </div>
              </div>

              <div className="mt-3">
                <span
                  className={`inline-block px-4 py-2 rounded-full border-2 text-sm ${
                    m.scenarioLoan
                      ? (m.scenarioPass ? "border-green-600 text-green-700" : "border-red-600 text-red-700")
                      : "border-brand-gold text-brand-green"
                  }`}
                >
                  {m.scenarioLoan
                    ? (m.scenarioPass ? "Scenario appears within selected GDS/TDS limits" : "Scenario appears above selected GDS/TDS limits")
                    : "Enter a price and down payment to check"}
                </span>
                {m.scenarioLoan > 0 && m.incMonthly <= 0 && (
                  <p className="mt-2 text-xs text-red-700">
                    Scenario cannot be assessed without positive household income.
                  </p>
                )}
              </div>

              <p className="mt-3 text-xs text-brand-blue/70">
                Based on qualifying payment at {m.qualifyingRate.toFixed(2)}% with {m.amort}-year amortization.
                Taxes, heat, and 50% condo fees are counted in ratios.
              </p>
            </>
          )}

          {/* Similar tools */}
          <div className="mt-6 rounded-xl border border-brand-gold/40 bg-brand-beige/40 p-4">
            <h4 className="font-semibold text-brand-green mb-2">Similar tools</h4>
            <ul className="list-disc ml-5 text-sm space-y-1">
              <li><Link href="/en/tools/mortgage-affordability" className="underline">Mortgage Affordability (Quick)</Link></li>
              <li><Link href="/en/tools/mortgage-calculator" className="underline">Mortgage Payment Calculator</Link></li>
              <li><Link href="/en/tools/down-payment-insurance" className="underline">Down Payment &amp; CMHC Insurance</Link></li>
              <li><Link href="/en/tools/closing-costs" className="underline">Closing Costs Estimator</Link></li>
            </ul>
          </div>
        </section>
      </form>

      {/* Footer note / CTA */}
      <div className="mt-8 grid lg:grid-cols-2 gap-6">
        <section className="tool-card">
          <h4 className="font-sans text-lg text-brand-green font-semibold mb-2">Notes</h4>
          <ul className="list-disc pl-6 space-y-2 text-brand-body">
            <li>Qualifying rate uses the greater of your contract rate + 2% or the benchmark.</li>
            <li>GDS counts: mortgage payment + property tax + heat + 50% condo fees. TDS adds other monthly debts.</li>
            <li>Ratio limits vary by lender/insurer and product; defaults here are 39% / 44% but you can adjust.</li>
          </ul>
        </section>

        <section className="tool-card">
          <h4 className="font-sans text-lg text-brand-green font-semibold mb-2">Need a human review?</h4>
          <p className="text-brand-body mb-3">We’ll translate this into a lender-ready plan and next steps.</p>
          <Link
            href="/en/contact?intent=pre-approval"
            className="tool-btn-gold inline-flex px-6"
            aria-label="Start a pre-approval"
          >
            Start a Pre-Approval
          </Link>
        </section>
      </div>

      {/* Print styles */}
      <style jsx global>{`
        @media print {
          .print\\:hidden { display: none !important; }
          main { background: white !important; }
          header, section { break-inside: avoid; page-break-inside: avoid; }
        }
      `}</style>

      {/* Disclaimer */}
      <p className="mt-6 text-xs text-brand-blue/70">
        Educational purposes only. Not investment, legal, lending, or tax advice. Subject to qualification and lender/insurer policies.
      </p>
    </ToolShell>
  );
}
