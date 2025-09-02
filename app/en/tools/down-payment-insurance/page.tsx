"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import ToolShell from "@/components/ToolShell";

/**
 * Down Payment & CMHC Insurance
 * -------------------------------------------------------
 * - Calculates required minimum down payment.
 * - Checks if insurance is required.
 * - Applies CMHC premium rates by LTV.
 * - Adds Ontario 8% PST on premium.
 * - Educational only; confirm with lender/insurer.
 */

const CAD0 = new Intl.NumberFormat("en-CA", {
  style: "currency",
  currency: "CAD",
  maximumFractionDigits: 0,
});
const CAD2 = new Intl.NumberFormat("en-CA", {
  style: "currency",
  currency: "CAD",
  minimumFractionDigits: 2,
});
const num = (s: string) => {
  const x = Number(String(s).replace(/[^\d.-]/g, ""));
  return Number.isFinite(x) ? x : 0;
};

// Default CMHC premiums (% of mortgage)
function cmhcPremiumRate(ltvPct: number) {
  if (ltvPct > 95) return null; // not allowed
  if (ltvPct > 90) return 0.045;
  if (ltvPct > 85) return 0.04;
  if (ltvPct > 80) return 0.031;
  if (ltvPct > 65) return 0.028;
  return 0; // conventional (20%+)
}

// Minimum down payment rule
function minDownPayment(price: number): number {
  if (price >= 1_000_000) return price * 0.20;
  const first = Math.min(price, 500_000);
  const second = Math.max(0, price - 500_000);
  return first * 0.05 + second * 0.10;
}

const DEFAULTS = {
  price: "750000",
  down: "50000",
};

const LS_KEY = "tools.down_payment_insurance.v1";

export default function Page() {
  const [priceStr, setPriceStr] = useState(DEFAULTS.price);
  const [downStr, setDownStr] = useState(DEFAULTS.down);

  // Restore
  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) {
        const v = JSON.parse(raw);
        if (v && typeof v === "object") {
          setPriceStr(v.price ?? DEFAULTS.price);
          setDownStr(v.down ?? DEFAULTS.down);
        }
      }
    } catch {}
  }, []);

  // Persist
  useEffect(() => {
    try {
      localStorage.setItem(LS_KEY, JSON.stringify({ price: priceStr, down: downStr }));
    } catch {}
  }, [priceStr, downStr]);

  const m = useMemo(() => {
    const price = num(priceStr);
    const down = Math.min(num(downStr), price);
    const loan = Math.max(0, price - down);

    const downPct = price > 0 ? (down / price) * 100 : 0;
    const ltv = price > 0 ? (loan / price) * 100 : 0;

    const minDp = minDownPayment(price);
    const meetsMinimum = down >= minDp;

    let premiumRate = cmhcPremiumRate(ltv);
    if (!meetsMinimum) premiumRate = null; // invalid
    if (price >= 1_000_000) premiumRate = 0; // conventional only

    const premium = premiumRate ? loan * premiumRate : 0;
    const pst = premium * 0.08; // Ontario 8%
    const totalWithPremium = loan + premium + pst;

    return {
      price,
      down,
      loan,
      downPct,
      ltv,
      minDp,
      meetsMinimum,
      premiumRate,
      premium,
      pst,
      totalWithPremium,
    };
  }, [priceStr, downStr]);

  const onPrint = () => window.print();
  const onReset = () => {
    setPriceStr(DEFAULTS.price);
    setDownStr(DEFAULTS.down);
  };

  return (
    <ToolShell
      title="Down Payment & CMHC Insurance"
      subtitle="Check minimum down payment rules, mortgage default insurance, and premium tax."
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
          className="px-4 py-2 rounded-full border-2 border-brand-gold text-brand-gold hover:bg-brand-gold hover:text-brand-green transition"
        >
          Reset to defaults
        </button>
      </div>

      <form className="grid xl:grid-cols-2 gap-6">
        {/* Inputs */}
        <section className="rounded-2xl border border-brand-gold bg-white p-5 grid gap-3">
          <h3 className="font-serif text-lg text-brand-green font-bold">Inputs</h3>
          <label className="block">
            <span className="block text-sm text-brand-blue/80">Purchase price</span>
            <input
              value={priceStr}
              onChange={(e) => setPriceStr(e.target.value)}
              inputMode="decimal"
              className="mt-1 w-full rounded-xl border border-brand-gold/60 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-gold"
            />
          </label>
          <label className="block">
            <span className="block text-sm text-brand-blue/80">Down payment</span>
            <input
              value={downStr}
              onChange={(e) => setDownStr(e.target.value)}
              inputMode="decimal"
              className="mt-1 w-full rounded-xl border border-brand-gold/60 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-gold"
            />
          </label>
        </section>

        {/* Results */}
        <section className="rounded-2xl border border-brand-gold bg-white p-5">
          <h3 className="font-serif text-lg text-brand-green font-bold">Results</h3>

          <div className="grid sm:grid-cols-2 gap-4 mt-2">
            <div>
              <div className="text-sm text-brand-blue/80">Down payment %</div>
              <div className="text-2xl font-bold text-brand-green">{m.price ? m.downPct.toFixed(1) + "%" : "—"}</div>
            </div>
            <div>
              <div className="text-sm text-brand-blue/80">Loan-to-Value (LTV)</div>
              <div className="text-2xl font-bold text-brand-green">{m.price ? m.ltv.toFixed(1) + "%" : "—"}</div>
            </div>
          </div>

          <div className="mt-4">
            <div className="text-sm text-brand-blue/80">Minimum required down payment</div>
            <div className="text-xl font-semibold">{m.price ? CAD0.format(m.minDp) : "—"}</div>
            {!m.meetsMinimum && m.price > 0 && (
              <div className="text-sm text-red-600">Does not meet minimum requirement</div>
            )}
          </div>

          {m.premiumRate !== null && (
            <div className="mt-4 grid sm:grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-brand-blue/80">Mortgage (before premium)</div>
                <div className="text-xl font-semibold">{CAD0.format(Math.round(m.loan))}</div>
              </div>
              <div>
                <div className="text-sm text-brand-blue/80">Insurance premium rate</div>
                <div className="text-xl font-semibold">{m.premiumRate ? (m.premiumRate * 100).toFixed(2) + "%" : "N/A"}</div>
              </div>
              <div>
                <div className="text-sm text-brand-blue/80">Insurance premium</div>
                <div className="text-xl font-semibold">{m.premium ? CAD0.format(Math.round(m.premium)) : "—"}</div>
              </div>
              <div>
                <div className="text-sm text-brand-blue/80">Premium tax (ON 8%)</div>
                <div className="text-xl font-semibold">{m.pst ? CAD0.format(Math.round(m.pst)) : "—"}</div>
              </div>
            </div>
          )}

          {m.premiumRate === null && m.price > 0 && (
            <p className="mt-3 text-sm text-red-600">
              This down payment does not meet minimum rules. Increase down payment to qualify.
            </p>
          )}

          {m.premiumRate !== null && (
            <div className="mt-4">
              <div className="text-sm text-brand-blue/80">Total mortgage incl. premium</div>
              <div className="text-2xl font-bold text-brand-green">
                {CAD0.format(Math.round(m.totalWithPremium))}
              </div>
            </div>
          )}

          {/* Similar tools */}
          <div className="mt-6 rounded-xl border border-brand-gold/40 bg-brand-beige/40 p-4">
            <h4 className="font-semibold text-brand-green mb-2">Similar tools</h4>
            <ul className="list-disc ml-5 text-sm space-y-1">
              <li><Link href="/en/tools/affordability-stress-test" className="underline">Affordability &amp; Stress Test</Link></li>
              <li><Link href="/en/tools/mortgage-calculator" className="underline">Mortgage Payment Calculator</Link></li>
              <li><Link href="/en/tools/closing-costs" className="underline">Closing Costs Estimator</Link></li>
              <li><Link href="/en/tools/land-transfer-tax" className="underline">Land Transfer Tax (ON + Toronto)</Link></li>
            </ul>
          </div>
        </section>
      </form>

      {/* Disclaimer */}
      <p className="mt-6 text-xs text-brand-blue/70">
        Educational purposes only. Actual qualification depends on lender/insurer policies. Properties ≥ $1M require 20% down and are not eligible for insured mortgages.
      </p>
    </ToolShell>
  );
}
