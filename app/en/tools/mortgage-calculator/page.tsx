"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import ToolShell from "@/components/ToolShell";
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer
} from "recharts";

/**
 * Mortgage Payment Calculator (Advanced)
 * --------------------------------------------------------------
 * - Payment frequency: Monthly / Bi-weekly / Accelerated Bi-weekly
 * - Term length vs full amortization totals
 * - Optional extra payment per period
 * - Interactive chart + schedule preview
 * - Persists inputs to localStorage
 * - Educational only; payment math uses standard blended P&I with
 *   per-period compounding (monthly or bi-weekly for simplicity).
 */

// ---------- Helpers ----------
const CAD0 = new Intl.NumberFormat("en-CA", { style: "currency", currency: "CAD", maximumFractionDigits: 0 });
const CAD2 = new Intl.NumberFormat("en-CA", { style: "currency", currency: "CAD", minimumFractionDigits: 2 });

const num = (s: string) => {
  const x = Number(String(s).replace(/[^\d.-]/g, ""));
  return Number.isFinite(x) ? x : 0;
};

type FreqKey = "monthly" | "biweekly" | "accelerated_biweekly";
const FREQ_META: Record<FreqKey, { label: string; periodsPerYear: number; }> = {
  monthly: { label: "Monthly", periodsPerYear: 12 },
  biweekly: { label: "Bi-weekly", periodsPerYear: 26 },
  accelerated_biweekly: { label: "Accelerated Bi-weekly", periodsPerYear: 26 },
};

function pmt(principal: number, annualRatePct: number, years: number, periodsPerYear: number) {
  if (principal <= 0 || annualRatePct <= 0 || years <= 0 || periodsPerYear <= 0) return 0;
  const r = (annualRatePct / 100) / periodsPerYear;
  const nper = years * periodsPerYear;
  const pow = Math.pow(1 + r, nper);
  return (principal * r * pow) / (pow - 1);
}

type Row = { period: number; interest: number; principal: number; balance: number };

function buildSchedule(opts: {
  principal: number;
  annualRatePct: number;
  amortYears: number;
  periodsPerYear: number;
  // If paymentOverride provided, use that as the per-period payment (e.g., accelerated biweekly)
  paymentOverride?: number;
  extraPerPeriod?: number; // extra principal each period
  maxPeriods?: number;     // optional cutoff (for "term" run)
}): { rows: Row[]; totalInterest: number; totalPrincipal: number; paymentUsed: number } {
  const { principal, annualRatePct, amortYears, periodsPerYear, paymentOverride, extraPerPeriod = 0, maxPeriods } = opts;

  if (principal <= 0 || annualRatePct <= 0 || amortYears <= 0) {
    return { rows: [], totalInterest: 0, totalPrincipal: 0, paymentUsed: 0 };
  }

  const r = (annualRatePct / 100) / periodsPerYear;
  const nper = amortYears * periodsPerYear;

  // Base payment for this comp frequency
  const base = pmt(principal, annualRatePct, amortYears, periodsPerYear);
  const pay = paymentOverride && paymentOverride > 0 ? paymentOverride : base;

  const rows: Row[] = [];
  let bal = principal;
  let ti = 0; let tp = 0;
  const stopAt = maxPeriods && maxPeriods > 0 ? Math.min(maxPeriods, nper) : nper;

  for (let k = 1; k <= stopAt && bal > 0.01; k++) {
    const interest = bal * r;
    let principalPart = pay - interest + (extraPerPeriod || 0);
    if (principalPart > bal) principalPart = bal;
    bal = bal - principalPart;

    ti += interest;
    tp += principalPart;
    rows.push({ period: k, interest, principal: principalPart, balance: Math.max(0, bal) });

    // if we've finished earlier than stopAt due to extra payments
    if (bal <= 0.01) break;
  }

  return { rows, totalInterest: ti, totalPrincipal: tp, paymentUsed: pay };
}

// ---------- Defaults & storage ----------
const LS_KEY = "tools.mortgage_calculator.advanced.v1";
const DEFAULTS = {
  principal: "600000",
  rate: "5.25",
  amortYears: "25",
  termYears: "5",
  freq: "monthly" as FreqKey,
  extraPerPeriod: "0",
};

export default function Page() {
  // Inputs
  const [principalStr, setPrincipalStr] = useState(DEFAULTS.principal);
  const [rateStr, setRateStr] = useState(DEFAULTS.rate);
  const [amortYearsStr, setAmortYearsStr] = useState(DEFAULTS.amortYears);
  const [termYearsStr, setTermYearsStr] = useState(DEFAULTS.termYears);
  const [freq, setFreq] = useState<FreqKey>(DEFAULTS.freq);
  const [extraPerPeriodStr, setExtraPerPeriodStr] = useState(DEFAULTS.extraPerPeriod);

  // Restore
  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) {
        const v = JSON.parse(raw);
        if (v && typeof v === "object") {
          setPrincipalStr(v.principal ?? DEFAULTS.principal);
          setRateStr(v.rate ?? DEFAULTS.rate);
          setAmortYearsStr(v.amortYears ?? DEFAULTS.amortYears);
          setTermYearsStr(v.termYears ?? DEFAULTS.termYears);
          setFreq(v.freq ?? DEFAULTS.freq);
          setExtraPerPeriodStr(v.extraPerPeriod ?? DEFAULTS.extraPerPeriod);
        }
      }
    } catch {}
  }, []);

  // Persist
  useEffect(() => {
    try {
      localStorage.setItem(
        LS_KEY,
        JSON.stringify({
          principal: principalStr,
          rate: rateStr,
          amortYears: amortYearsStr,
          termYears: termYearsStr,
          freq,
          extraPerPeriod: extraPerPeriodStr,
        })
      );
    } catch {}
  }, [principalStr, rateStr, amortYearsStr, termYearsStr, freq, extraPerPeriodStr]);

  // ---------- Model ----------
  const m = useMemo(() => {
    const pr = Math.max(0, num(principalStr));
    const rate = Math.max(0, num(rateStr));
    const amortYears = Math.max(1, num(amortYearsStr));
    const termYears = Math.max(1, num(termYearsStr));
    const extra = Math.max(0, num(extraPerPeriodStr));

    const meta = FREQ_META[freq];
    const periodsPerYear = meta.periodsPerYear;

    // Base payment by frequency
    const standardPayment = pmt(pr, rate, amortYears, periodsPerYear);

    // Accelerated biweekly: take the monthly standard payment and split in half, pay 26 times/year
    const monthlyStandard = pmt(pr, rate, amortYears, 12);
    const acceleratedPayment = monthlyStandard / 2;

    const paymentUsed =
      freq === "accelerated_biweekly"
        ? acceleratedPayment
        : standardPayment;

    // Build schedule to end of term (for term totals)
    const termPeriods = termYears * periodsPerYear;
    const termSchedule = buildSchedule({
      principal: pr,
      annualRatePct: rate,
      amortYears,
      periodsPerYear,
      paymentOverride: freq === "accelerated_biweekly" ? acceleratedPayment : undefined,
      extraPerPeriod: extra,
      maxPeriods: termPeriods,
    });

    // Remaining balance after the term (for display)
    const balAfterTerm = termSchedule.rows.length
      ? termSchedule.rows[termSchedule.rows.length - 1].balance
      : pr;

    // Build schedule to full amortization (for totals)
    const fullSchedule = buildSchedule({
      principal: pr,
      annualRatePct: rate,
      amortYears,
      periodsPerYear,
      paymentOverride: freq === "accelerated_biweekly" ? acceleratedPayment : undefined,
      extraPerPeriod: extra,
    });

    const totalPaidTerm = termSchedule.totalInterest + termSchedule.totalPrincipal;
    const totalPaidFull = fullSchedule.totalInterest + fullSchedule.totalPrincipal;
    const monthsOrPeriodsToPayoff = fullSchedule.rows.length; // periods until paid off

    // Chart data (Term only: interest vs principal)
    const chartData = [
      { name: "Interest (term)", value: Math.max(0, termSchedule.totalInterest) },
      { name: "Principal (term)", value: Math.max(0, termSchedule.totalPrincipal) },
    ];

    return {
      pr, rate, amortYears, termYears, extra, freq, periodsPerYear,
      paymentUsed,
      termSchedule,
      fullSchedule,
      balAfterTerm,
      totalPaidTerm,
      totalPaidFull,
      monthsOrPeriodsToPayoff,
      chartData,
    };
  }, [principalStr, rateStr, amortYearsStr, termYearsStr, freq, extraPerPeriodStr]);

  // ---------- UI actions ----------
  const onPrint = () => window.print();
  const onReset = () => {
    setPrincipalStr(DEFAULTS.principal);
    setRateStr(DEFAULTS.rate);
    setAmortYearsStr(DEFAULTS.amortYears);
    setTermYearsStr(DEFAULTS.termYears);
    setFreq(DEFAULTS.freq);
    setExtraPerPeriodStr(DEFAULTS.extraPerPeriod);
  };

  // ---------- Colors for chart ----------
  const palette = ["#0f766e", "#9a6b2f"]; // brand-ish: green / gold
  const pieHasValues = m.chartData.some(d => d.value > 0);

  return (
    <ToolShell
      title="Mortgage Payment Calculator"
      subtitle="Estimate payments by frequency, see interest/principal over your term, and preview the amortization."
      lang="en"
    >
      {/* Actions */}
      <div className="flex flex-wrap gap-2 mb-4 print:hidden">
        <button
          type="button"
          onClick={onPrint}
          className="px-4 py-2 rounded-full border-2 border-brand-blue text-brand-blue hover:bg-brand-blue hover:text-white transition"
        >
          Print / Save as PDF
        </button>
        <button
          type="button"
          onClick={onReset}
          className="px-4 py-2 rounded-full border-2 border-brand-gold text-brand-green hover:bg-brand-gold hover:text-brand-green transition"
        >
          Reset to defaults
        </button>
      </div>

      <form className="grid xl:grid-cols-2 gap-6">
        {/* Inputs */}
        <section className="rounded-2xl border border-brand-gold bg-white p-5 grid gap-3">
          <h3 className="font-serif text-lg text-brand-green font-bold">Inputs</h3>

          <div className="grid sm:grid-cols-2 gap-3">
            <label className="block">
              <span className="block text-sm text-brand-blue/80">Mortgage amount (principal)</span>
              <input
                value={principalStr}
                onChange={(e) => setPrincipalStr(e.target.value)}
                inputMode="decimal"
                className="mt-1 w-full rounded-xl border border-brand-gold/60 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-gold"
              />
            </label>
            <label className="block">
              <span className="block text-sm text-brand-blue/80">Interest rate (annual %)</span>
              <input
                value={rateStr}
                onChange={(e) => setRateStr(e.target.value)}
                inputMode="decimal"
                className="mt-1 w-full rounded-xl border border-brand-gold/60 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-gold"
              />
            </label>
          </div>

          <div className="grid sm:grid-cols-3 gap-3">
            <label className="block">
              <span className="block text-sm text-brand-blue/80">Amortization (years)</span>
              <input
                value={amortYearsStr}
                onChange={(e) => setAmortYearsStr(e.target.value)}
                inputMode="numeric"
                className="mt-1 w-full rounded-xl border border-brand-gold/60 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-gold"
              />
            </label>
            <label className="block">
              <span className="block text-sm text-brand-blue/80">Term (years)</span>
              <input
                value={termYearsStr}
                onChange={(e) => setTermYearsStr(e.target.value)}
                inputMode="numeric"
                className="mt-1 w-full rounded-xl border border-brand-gold/60 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-gold"
              />
            </label>
            <label className="block">
              <span className="block text-sm text-brand-blue/80">Payment frequency</span>
              <select
                value={freq}
                onChange={(e) => setFreq(e.target.value as FreqKey)}
                className="mt-1 w-full rounded-xl border border-brand-gold/60 px-3 py-2 bg-white"
              >
                <option value="monthly">Monthly</option>
                <option value="biweekly">Bi-weekly</option>
                <option value="accelerated_biweekly">Accelerated Bi-weekly</option>
              </select>
            </label>
          </div>

          <label className="block">
            <span className="block text-sm text-brand-blue/80">Extra payment per period (optional)</span>
            <input
              value={extraPerPeriodStr}
              onChange={(e) => setExtraPerPeriodStr(e.target.value)}
              inputMode="decimal"
              className="mt-1 w-full rounded-xl border border-brand-gold/60 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-gold"
            />
          </label>

          <p className="text-xs text-brand-blue/70">
            Note: “Accelerated Bi-weekly” uses half of the standard monthly payment, paid 26 times/year—this
            speeds up principal reduction and lowers total interest.
          </p>
        </section>

        {/* Results + Chart */}
        <section className="rounded-2xl border border-brand-gold bg-white p-5">
          <h3 className="font-serif text-lg text-brand-green font-bold">Results</h3>

          <div className="grid sm:grid-cols-2 gap-4 mt-2">
            <div>
              <div className="text-sm text-brand-blue/80">Payment per period</div>
              <div className="text-2xl font-bold text-brand-green">
                {m.paymentUsed ? CAD2.format(m.paymentUsed) : "—"}
              </div>
              <div className="text-xs text-brand-blue/70">
                {FREQ_META[m.freq].label} ({m.periodsPerYear}×/yr){m.extra > 0 ? " + extra" : ""}
              </div>
            </div>

            <div>
              <div className="text-sm text-brand-blue/80">Periods to payoff (est.)</div>
              <div className="text-2xl font-bold text-brand-green">
                {m.monthsOrPeriodsToPayoff || "—"}
              </div>
              <div className="text-xs text-brand-blue/70">Includes extra payments if any</div>
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-4 mt-4">
            <div>
              <div className="text-sm text-brand-blue/80">Interest over term</div>
              <div className="text-xl font-semibold">{CAD0.format(Math.round(m.termSchedule.totalInterest))}</div>
            </div>
            <div>
              <div className="text-sm text-brand-blue/80">Principal over term</div>
              <div className="text-xl font-semibold">{CAD0.format(Math.round(m.termSchedule.totalPrincipal))}</div>
            </div>
            <div>
              <div className="text-sm text-brand-blue/80">Balance after term</div>
              <div className="text-xl font-semibold">{CAD0.format(Math.round(m.balAfterTerm))}</div>
            </div>
          </div>

          {/* Chart */}
          <div className="mt-6 h-64 rounded-xl border border-brand-gold/40 bg-brand-beige/40 p-2">
            {pieHasValues ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  {/* typed formatter to avoid explicit any */}
                  <Tooltip formatter={(val: number | string) => CAD0.format(Math.round(Number(val)))} />
                  <Pie
                    data={m.chartData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={90}
                    paddingAngle={2}
                  >
                    {m.chartData.map((_, i) => (
                      <Cell key={i} fill={palette[i % palette.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-sm text-brand-blue/70">
                Enter values to see your chart.
              </div>
            )}
          </div>

          {/* Schedule preview */}
          <div className="mt-6">
            <h4 className="font-semibold text-brand-green mb-2">
              Schedule preview (first 24 {FREQ_META[m.freq].label.toLowerCase()} periods)
            </h4>
            <div className="overflow-auto rounded-xl border border-brand-gold/40">
              <table className="w-full text-sm">
                <thead className="bg-brand-beige/40 text-brand-blue">
                  <tr>
                    <th className="text-left px-3 py-2">#</th>
                    <th className="text-right px-3 py-2">Interest</th>
                    <th className="text-right px-3 py-2">Principal</th>
                    <th className="text-right px-3 py-2">Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {m.termSchedule.rows.slice(0, 24).map((r) => (
                    <tr key={r.period} className="border-t">
                      <td className="px-3 py-2">{r.period}</td>
                      <td className="px-3 py-2 text-right">{CAD2.format(r.interest)}</td>
                      <td className="px-3 py-2 text-right">{CAD2.format(r.principal)}</td>
                      <td className="px-3 py-2 text-right">{CAD2.format(r.balance)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="mt-3 text-sm">
              Want the full month-by-month breakdown?{" "}
              <Link href="/en/tools/amortization-schedule" className="underline">
                Open the Amortization Schedule tool
              </Link>.
            </p>
          </div>

          {/* Similar tools */}
          <div className="mt-6 rounded-xl border border-brand-gold/40 bg-brand-beige/40 p-4">
            <h4 className="font-semibold text-brand-green mb-2">Similar tools</h4>
            <ul className="list-disc ml-5 text-sm space-y-1">
              <li><Link href="/en/tools/affordability-stress-test" className="underline">Affordability &amp; Stress Test</Link></li>
              <li><Link href="/en/tools/down-payment-insurance" className="underline">Down Payment &amp; CMHC Insurance</Link></li>
              <li><Link href="/en/tools/amortization-schedule" className="underline">Amortization Schedule &amp; Extra Payments</Link></li>
              <li><Link href="/en/tools/closing-costs" className="underline">Closing Costs Estimator</Link></li>
            </ul>
          </div>
        </section>
      </form>

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
        Educational estimate only. Calculations use per-period compounding and may differ from lender methods (e.g., semi-annual compounding). Confirm exact payments with your lender.
      </p>
    </ToolShell>
  );
}
