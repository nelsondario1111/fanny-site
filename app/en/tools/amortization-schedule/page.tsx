// app/en/tools/amortization-schedule/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import ToolShell from "@/components/ToolShell";

/**
 * Amortization Schedule & Extra Payments
 * --------------------------------------------------------------
 * - Frequencies: Monthly / Bi-weekly / Accelerated Bi-weekly
 * - Extra payment per period
 * - Annual lump-sum (once each year at the same period index)
 * - One-time lump-sum at a specific period index
 * - CSV export of the full schedule
 * - Print / Reset / localStorage persistence
 * - Educational only (lender math may differ slightly)
 */

// ---------- Helpers ----------
const CAD0 = new Intl.NumberFormat("en-CA", { style: "currency", currency: "CAD", maximumFractionDigits: 0 });
const CAD2 = new Intl.NumberFormat("en-CA", { style: "currency", currency: "CAD", minimumFractionDigits: 2 });

const num = (s: string) => {
  const x = Number(String(s).replace(/[^\d.-]/g, ""));
  return Number.isFinite(x) ? x : 0;
};
const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

type FreqKey = "monthly" | "biweekly" | "accelerated_biweekly";
const FREQ_META: Record<FreqKey, { label: string; periodsPerYear: number }> = {
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

type Row = {
  period: number;
  payment: number;     // scheduled payment used (may be smaller on the last one)
  interest: number;
  principal: number;
  extraApplied: number; // includes per-period extra + any lump(s) in that period
  balance: number;
};

function buildSchedule(opts: {
  principal: number;
  annualRatePct: number;
  amortYears: number;
  periodsPerYear: number;
  paymentOverride?: number; // for accelerated bi-weekly
  extraPerPeriod?: number;
  annualLump?: number;      // applied once per year at a fixed period index
  annualLumpAtIndex?: number; // 1..periodsPerYear (defaults to last)
  oneTimeLump?: number;     // applied once at a specific absolute period (1-based)
  oneTimeLumpAt?: number;   // absolute period index for the one-time lump
}): {
  rows: Row[];
  totalInterest: number;
  totalPrincipal: number;
  totalExtra: number;
  paymentUsed: number;
  payoffPeriods: number;
} {
  const {
    principal, annualRatePct, amortYears, periodsPerYear,
    paymentOverride, extraPerPeriod = 0,
    annualLump = 0, annualLumpAtIndex,
    oneTimeLump = 0, oneTimeLumpAt,
  } = opts;

  if (principal <= 0 || annualRatePct <= 0 || amortYears <= 0) {
    return { rows: [], totalInterest: 0, totalPrincipal: 0, totalExtra: 0, paymentUsed: 0, payoffPeriods: 0 };
  }

  const r = (annualRatePct / 100) / periodsPerYear;
  const nper = amortYears * periodsPerYear;
  const basePayment = pmt(principal, annualRatePct, amortYears, periodsPerYear);
  const pay = paymentOverride && paymentOverride > 0 ? paymentOverride : basePayment;

  const annualIndex = clamp(annualLumpAtIndex ?? periodsPerYear, 1, periodsPerYear);
  const rows: Row[] = [];

  let bal = principal;
  let ti = 0, tp = 0, te = 0;
  let period = 0;

  while (bal > 0.01 && period < nper) {
    period += 1;

    const interest = bal * r;
    const scheduledPayment = Math.min(pay, bal + interest); // last payment may be smaller
    const principalPart = scheduledPayment - interest;

    // Extras
    let extra = 0;

    // Per-period extra
    if (extraPerPeriod > 0) {
      extra += Math.min(extraPerPeriod, Math.max(0, bal - principalPart)); // don't overpay beyond remaining principal
    }

    // Annual lump (once per year on the chosen period index)
    if (annualLump > 0 && ((period - annualIndex) % periodsPerYear === 0) && period >= annualIndex) {
      const remainingAfterPrincipal = Math.max(0, bal - principalPart - extra);
      extra += Math.min(annualLump, remainingAfterPrincipal);
    }

    // One-time lump at specific absolute period
    if (oneTimeLump > 0 && oneTimeLumpAt && period === oneTimeLumpAt) {
      const remainingAfterPrincipal = Math.max(0, bal - principalPart - extra);
      extra += Math.min(oneTimeLump, remainingAfterPrincipal);
    }

    const appliedPrincipal = principalPart + extra;
    bal = Math.max(0, bal - appliedPrincipal);

    ti += interest;
    tp += principalPart;
    te += extra;

    rows.push({
      period,
      payment: scheduledPayment,
      interest,
      principal: principalPart,
      extraApplied: extra,
      balance: bal,
    });
  }

  return {
    rows,
    totalInterest: ti,
    totalPrincipal: tp,
    totalExtra: te,
    paymentUsed: pay,
    payoffPeriods: rows.length,
  };
}

// ---------- Defaults & storage ----------
const LS_KEY = "tools.amortization_schedule.v1";
const DEFAULTS = {
  principal: "600000",
  rate: "5.25",
  amortYears: "25",
  freq: "monthly" as FreqKey,
  extraPerPeriod: "0",
  annualLump: "0",
  annualLumpAtIndex: "", // empty = defaults to last period in the year
  oneTimeLump: "0",
  oneTimeLumpAt: "",
};

export default function Page() {
  // Inputs
  const [principalStr, setPrincipalStr] = useState(DEFAULTS.principal);
  const [rateStr, setRateStr] = useState(DEFAULTS.rate);
  const [amortYearsStr, setAmortYearsStr] = useState(DEFAULTS.amortYears);
  const [freq, setFreq] = useState<FreqKey>(DEFAULTS.freq);

  const [extraPerPeriodStr, setExtraPerPeriodStr] = useState(DEFAULTS.extraPerPeriod);
  const [annualLumpStr, setAnnualLumpStr] = useState(DEFAULTS.annualLump);
  const [annualLumpAtIndexStr, setAnnualLumpAtIndexStr] = useState(DEFAULTS.annualLumpAtIndex);
  const [oneTimeLumpStr, setOneTimeLumpStr] = useState(DEFAULTS.oneTimeLump);
  const [oneTimeLumpAtStr, setOneTimeLumpAtStr] = useState(DEFAULTS.oneTimeLumpAt);

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
          setFreq(v.freq ?? DEFAULTS.freq);
          setExtraPerPeriodStr(v.extraPerPeriod ?? DEFAULTS.extraPerPeriod);
          setAnnualLumpStr(v.annualLump ?? DEFAULTS.annualLump);
          setAnnualLumpAtIndexStr(v.annualLumpAtIndex ?? DEFAULTS.annualLumpAtIndex);
          setOneTimeLumpStr(v.oneTimeLump ?? DEFAULTS.oneTimeLump);
          setOneTimeLumpAtStr(v.oneTimeLumpAt ?? DEFAULTS.oneTimeLumpAt);
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
          freq,
          extraPerPeriod: extraPerPeriodStr,
          annualLump: annualLumpStr,
          annualLumpAtIndex: annualLumpAtIndexStr,
          oneTimeLump: oneTimeLumpStr,
          oneTimeLumpAt: oneTimeLumpAtStr,
        })
      );
    } catch {}
  }, [
    principalStr, rateStr, amortYearsStr, freq,
    extraPerPeriodStr, annualLumpStr, annualLumpAtIndexStr, oneTimeLumpStr, oneTimeLumpAtStr
  ]);

  // ---------- Model ----------
  const m = useMemo(() => {
    const pr = Math.max(0, num(principalStr));
    const rate = Math.max(0, num(rateStr));
    const amortYears = Math.max(1, num(amortYearsStr));

    const meta = FREQ_META[freq];
    const periodsPerYear = meta.periodsPerYear;

    // Base payment by frequency
    const standardPayment = pmt(pr, rate, amortYears, periodsPerYear);
    const monthlyStandard = pmt(pr, rate, amortYears, 12);
    const acceleratedPayment = monthlyStandard / 2;

    const paymentUsed =
      freq === "accelerated_biweekly" ? acceleratedPayment : standardPayment;

    // Extras
    const extraPerPeriod = Math.max(0, num(extraPerPeriodStr));
    const annualLump = Math.max(0, num(annualLumpStr));
    const annualLumpAtIndex = annualLumpAtIndexStr ? clamp(num(annualLumpAtIndexStr), 1, periodsPerYear) : periodsPerYear;

    const oneTimeLump = Math.max(0, num(oneTimeLumpStr));
    const oneTimeLumpAt = oneTimeLumpAtStr ? Math.max(1, num(oneTimeLumpAtStr)) : undefined;

    // Build schedule
    const schedule = buildSchedule({
      principal: pr,
      annualRatePct: rate,
      amortYears,
      periodsPerYear,
      paymentOverride: freq === "accelerated_biweekly" ? acceleratedPayment : undefined,
      extraPerPeriod,
      annualLump,
      annualLumpAtIndex,
      oneTimeLump,
      oneTimeLumpAt,
    });

    const paymentPerPeriod = paymentUsed;
    const totalPaid = schedule.totalInterest + schedule.totalPrincipal + schedule.totalExtra;

    return {
      pr, rate, amortYears, freq, periodsPerYear,
      paymentPerPeriod,
      schedule,
      totalPaid,
      standardPayment,
      acceleratedPayment,
      extraPerPeriod, annualLump, annualLumpAtIndex, oneTimeLump, oneTimeLumpAt,
    };
  }, [
    principalStr, rateStr, amortYearsStr, freq,
    extraPerPeriodStr, annualLumpStr, annualLumpAtIndexStr, oneTimeLumpStr, oneTimeLumpAtStr
  ]);

  // ---------- Actions ----------
  const onPrint = () => window.print();
  const onReset = () => {
    setPrincipalStr(DEFAULTS.principal);
    setRateStr(DEFAULTS.rate);
    setAmortYearsStr(DEFAULTS.amortYears);
    setFreq(DEFAULTS.freq);
    setExtraPerPeriodStr(DEFAULTS.extraPerPeriod);
    setAnnualLumpStr(DEFAULTS.annualLump);
    setAnnualLumpAtIndexStr(DEFAULTS.annualLumpAtIndex);
    setOneTimeLumpStr(DEFAULTS.oneTimeLump);
    setOneTimeLumpAtStr(DEFAULTS.oneTimeLumpAt);
  };

  const exportCSV = () => {
    // Build CSV of full schedule
    const rows = m.schedule.rows;
    const header = [
      "Period",
      "Payment",
      "Interest",
      "Principal",
      "ExtraApplied",
      "Balance",
    ];

    const lines = [header.join(",")];
    for (const r of rows) {
      lines.push([
        r.period,
        r.payment.toFixed(2),
        r.interest.toFixed(2),
        r.principal.toFixed(2),
        r.extraApplied.toFixed(2),
        r.balance.toFixed(2),
      ].join(","));
    }

    const csv = lines.join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    const filename = `amortization_${m.freq}_${m.pr}_${m.rate}_${m.amortYears}.csv`.replace(/\s+/g, "");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  // ---------- UI ----------
  const previewRows = m.schedule.rows.slice(0, 120); // render first 120 periods for performance

  return (
    <ToolShell
      title="Amortization Schedule & Extra Payments"
      subtitle="See your period-by-period breakdown and how prepayments change your payoff time and total interest."
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
          onClick={exportCSV}
          className="px-4 py-2 rounded-full border-2 border-brand-green text-brand-green hover:bg-brand-green hover:text-white transition"
        >
          Export (CSV)
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
          <h3 className="font-sans text-lg text-brand-green font-semibold">Inputs</h3>

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
                className="mt-1 w-full rounded-xl border border-brand-gold/60 px-3 py-2"
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
            <div className="text-sm text-brand-blue/70 flex items-end">
              <div className="w-full">
                <div className="mb-1">Payment per period</div>
                <div className="text-lg font-semibold">
                  {m.paymentPerPeriod ? CAD2.format(m.paymentPerPeriod) : "—"}
                </div>
              </div>
            </div>
          </div>

          {/* Prepayments */}
          <div className="rounded-xl border border-brand-gold/40 bg-brand-beige/30 p-3 grid gap-3">
            <h4 className="font-semibold text-brand-green">Prepayments</h4>
            <div className="grid sm:grid-cols-3 gap-3">
              <label className="block">
                <span className="block text-sm text-brand-blue/80">Extra per period</span>
                <input
                  value={extraPerPeriodStr}
                  onChange={(e) => setExtraPerPeriodStr(e.target.value)}
                  inputMode="decimal"
                  className="mt-1 w-full rounded-xl border border-brand-gold/60 px-3 py-2"
                />
              </label>
              <label className="block">
                <span className="block text-sm text-brand-blue/80">Annual lump-sum</span>
                <input
                  value={annualLumpStr}
                  onChange={(e) => setAnnualLumpStr(e.target.value)}
                  inputMode="decimal"
                  className="mt-1 w-full rounded-xl border border-brand-gold/60 px-3 py-2"
                />
              </label>
              <label className="block">
                <span className="block text-sm text-brand-blue/80">Annual lump at period #</span>
                <input
                  value={annualLumpAtIndexStr}
                  onChange={(e) => setAnnualLumpAtIndexStr(e.target.value)}
                  inputMode="numeric"
                  placeholder={`1–${m.periodsPerYear} (default ${m.periodsPerYear})`}
                  className="mt-1 w-full rounded-xl border border-brand-gold/60 px-3 py-2"
                />
              </label>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              <label className="block">
                <span className="block text-sm text-brand-blue/80">One-time lump-sum</span>
                <input
                  value={oneTimeLumpStr}
                  onChange={(e) => setOneTimeLumpStr(e.target.value)}
                  inputMode="decimal"
                  className="mt-1 w-full rounded-xl border border-brand-gold/60 px-3 py-2"
                />
              </label>
              <label className="block">
                <span className="block text-sm text-brand-blue/80">One-time at absolute period #</span>
                <input
                  value={oneTimeLumpAtStr}
                  onChange={(e) => setOneTimeLumpAtStr(e.target.value)}
                  inputMode="numeric"
                  placeholder="e.g., 24"
                  className="mt-1 w-full rounded-xl border border-brand-gold/60 px-3 py-2"
                />
              </label>
            </div>
            <p className="text-xs text-brand-blue/70">
              Tip: In monthly mode, “Annual lump at period #” = 12 means each year on the 12th payment. In bi-weekly, 26 = the last period of the year.
            </p>
          </div>
        </section>

        {/* Results */}
        <section className="rounded-2xl border border-brand-gold bg-white p-5">
          <h3 className="font-sans text-lg text-brand-green font-semibold">Results</h3>

          <div className="grid sm:grid-cols-3 gap-4 mt-2">
            <div>
              <div className="text-sm text-brand-blue/80">Payment per period</div>
              <div className="text-2xl font-bold text-brand-green">
                {m.paymentPerPeriod ? CAD2.format(m.paymentPerPeriod) : "—"}
              </div>
            </div>
            <div>
              <div className="text-sm text-brand-blue/80">Total interest (to payoff)</div>
              <div className="text-2xl font-bold text-brand-green">
                {CAD0.format(Math.round(m.schedule.totalInterest))}
              </div>
            </div>
            <div>
              <div className="text-sm text-brand-blue/80">Periods to payoff</div>
              <div className="text-2xl font-bold text-brand-green">
                {m.schedule.payoffPeriods || "—"}
              </div>
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-4 mt-3">
            <div>
              <div className="text-sm text-brand-blue/80">Principal repaid</div>
              <div className="text-xl font-semibold">{CAD0.format(Math.round(m.schedule.totalPrincipal))}</div>
            </div>
            <div>
              <div className="text-sm text-brand-blue/80">Extra applied</div>
              <div className="text-xl font-semibold">{CAD0.format(Math.round(m.schedule.totalExtra))}</div>
            </div>
            <div>
              <div className="text-sm text-brand-blue/80">Total paid</div>
              <div className="text-xl font-semibold">{CAD0.format(Math.round(m.totalPaid))}</div>
            </div>
          </div>

          {/* Schedule preview */}
          <div className="mt-6">
            <h4 className="font-semibold text-brand-green mb-2">
              Schedule preview (first {previewRows.length} {FREQ_META[m.freq].label.toLowerCase()} periods)
            </h4>
            <div className="overflow-auto rounded-xl border border-brand-gold/40">
              <table className="w-full text-sm">
                <thead className="bg-brand-beige/40 text-brand-blue">
                  <tr>
                    <th className="text-left px-3 py-2">#</th>
                    <th className="text-right px-3 py-2">Payment</th>
                    <th className="text-right px-3 py-2">Interest</th>
                    <th className="text-right px-3 py-2">Principal</th>
                    <th className="text-right px-3 py-2">Extra</th>
                    <th className="text-right px-3 py-2">Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {previewRows.map((r, i) => (
                    <tr key={i} className="border-t">
                      <td className="px-3 py-2">{r.period}</td>
                      <td className="px-3 py-2 text-right">{CAD2.format(r.payment)}</td>
                      <td className="px-3 py-2 text-right">{CAD2.format(r.interest)}</td>
                      <td className="px-3 py-2 text-right">{CAD2.format(r.principal)}</td>
                      <td className="px-3 py-2 text-right">{CAD2.format(r.extraApplied)}</td>
                      <td className="px-3 py-2 text-right">{CAD2.format(r.balance)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="mt-3 text-sm">
              For the complete schedule, use the <button type="button" onClick={exportCSV} className="underline">Export (CSV)</button> button.
            </p>
          </div>

          {/* Similar tools */}
          <div className="mt-6 rounded-xl border border-brand-gold/40 bg-brand-beige/40 p-4">
            <h4 className="font-semibold text-brand-green mb-2">Similar tools</h4>
            <ul className="list-disc ml-5 text-sm space-y-1">
              <li><Link href="/en/tools/mortgage-calculator" className="underline">Mortgage Payment Calculator</Link></li>
              <li><Link href="/en/tools/affordability-stress-test" className="underline">Affordability &amp; Stress Test</Link></li>
              <li><Link href="/en/tools/down-payment-insurance" className="underline">Down Payment &amp; CMHC Insurance</Link></li>
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
        Educational estimate only. Actual lender calculations (e.g., semi-annual compounding, payment rounding, prepayment rules) may differ.
      </p>
    </ToolShell>
  );
}
