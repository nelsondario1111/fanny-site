"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import ToolShell from "@/components/ToolShell";

/**
 * Land Transfer Tax (Ontario + Toronto)
 * ---------------------------------------------------------------
 * - Provincial LTT (ON) for residential (1–2 single-family residences):
 *   0.5% to $55k; 1.0% $55k–$250k; 1.5% $250k–$400k; 2.0% $400k–$2M;
 *   2.5% over $2M (for 1–2 SFR). If not 1–2 SFR, cap at 2.0% (simple rule).
 * - Toronto MLTT (residential): mirrors lower tiers + luxury tiers for $3M+.
 * - First-time buyer rebates:
 *   ON up to $4,000; Toronto up to $4,475 (municipal portion).
 * - Educational only — verify with your lawyer/realtor before closing.
 */

// ---------- Formatting / utils ----------
const CAD0 = new Intl.NumberFormat("en-CA", {
  style: "currency",
  currency: "CAD",
  maximumFractionDigits: 0,
});
const CAD2 = new Intl.NumberFormat("en-CA", {
  style: "currency",
  currency: "CAD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});
const num = (s: string) => {
  const x = Number(String(s).replace(/[^\d.-]/g, ""));
  return Number.isFinite(x) ? x : 0;
};

type Bracket = { upTo?: number; rate: number };
type Line = { bandFrom: number; bandTo: number; rate: number; amount: number };

// Ontario residential (1–2 single-family residences) brackets
const ON_BRACKETS_1_2_SFR: Bracket[] = [
  { upTo: 55_000, rate: 0.005 },       // 0.5%
  { upTo: 250_000, rate: 0.01 },       // 1.0%
  { upTo: 400_000, rate: 0.015 },      // 1.5%
  { upTo: 2_000_000, rate: 0.02 },     // 2.0%
  { rate: 0.025 },                     // 2.5% over $2M (1–2 SFR)
];
// Ontario (non 1–2 SFR) — simple rule: cap at 2.0% (omit 2.5% tier)
const ON_BRACKETS_OTHER: Bracket[] = [
  { upTo: 55_000, rate: 0.005 },
  { upTo: 250_000, rate: 0.01 },
  { upTo: 400_000, rate: 0.015 },
  { rate: 0.02 }, // 2.0% over $400k
];

// Toronto municipal MLTT (residential; lower tiers + luxury tiers)
const TO_BRACKETS: Bracket[] = [
  { upTo: 55_000, rate: 0.005 },
  { upTo: 250_000, rate: 0.01 },
  { upTo: 400_000, rate: 0.015 },
  { upTo: 2_000_000, rate: 0.02 },
  { upTo: 3_000_000, rate: 0.025 },  // 2.5%
  { upTo: 4_000_000, rate: 0.035 },  // 3.5%
  { upTo: 5_000_000, rate: 0.045 },  // 4.5%
  { upTo: 10_000_000, rate: 0.055 }, // 5.5%
  { upTo: 20_000_000, rate: 0.065 }, // 6.5%
  { rate: 0.075 },                   // 7.5% 20M+
];

// Rebates
const ON_FTB_MAX = 4_000;  // provincial rebate max
const TO_FTB_MAX = 4_475;  // Toronto municipal rebate max

function marginalTax(price: number, brackets: Bracket[]) {
  let remaining = price;
  let lastCap = 0;
  let tax = 0;
  const lines: Line[] = [];

  for (const b of brackets) {
    const cap = b.upTo ?? Infinity;
    const slice = Math.max(0, Math.min(remaining, cap - lastCap));
    if (slice > 0) {
      const amount = slice * b.rate;
      tax += amount;
      const bandFrom = lastCap;
      const bandTo = lastCap + slice; // actual priced portion in this band
      lines.push({ bandFrom, bandTo, rate: b.rate, amount });
      remaining -= slice;
      lastCap = cap;
    }
    if (remaining <= 0) break;
  }

  return { tax, lines };
}

const DEFAULTS = {
  price: "850000",
  inToronto: "true",
  isOneOrTwoSFR: "true", // controls ON 2.5% over $2M
  isFTB_ON: "false",
  isFTB_TO: "false",
};

const LS_KEY = "tools.ltt.on_toronto.v1";

export default function Page() {
  const [priceStr, setPriceStr] = useState(DEFAULTS.price);
  const [inToronto, setInToronto] = useState(DEFAULTS.inToronto);
  const [isOneOrTwoSFR, setIsOneOrTwoSFR] = useState(DEFAULTS.isOneOrTwoSFR);
  const [isFTB_ON, setIsFTB_ON] = useState(DEFAULTS.isFTB_ON);
  const [isFTB_TO, setIsFTB_TO] = useState(DEFAULTS.isFTB_TO);

  // Restore from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) {
        const v = JSON.parse(raw);
        if (v && typeof v === "object") {
          setPriceStr(v.price ?? DEFAULTS.price);
          setInToronto(v.inToronto ?? DEFAULTS.inToronto);
          setIsOneOrTwoSFR(v.isOneOrTwoSFR ?? DEFAULTS.isOneOrTwoSFR);
          setIsFTB_ON(v.isFTB_ON ?? DEFAULTS.isFTB_ON);
          setIsFTB_TO(v.isFTB_TO ?? DEFAULTS.isFTB_TO);
        }
      }
    } catch {}
  }, []);

  // Persist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(
        LS_KEY,
        JSON.stringify({ price: priceStr, inToronto, isOneOrTwoSFR, isFTB_ON, isFTB_TO })
      );
    } catch {}
  }, [priceStr, inToronto, isOneOrTwoSFR, isFTB_ON, isFTB_TO]);

  const m = useMemo(() => {
    const price = Math.max(0, num(priceStr));

    // Provincial LTT (Ontario)
    const bracketsON = isOneOrTwoSFR === "true" ? ON_BRACKETS_1_2_SFR : ON_BRACKETS_OTHER;
    const onCalc = marginalTax(price, bracketsON);
    const onTax = onCalc.tax;

    // Toronto MLTT (if applicable)
    const toCalc = inToronto === "true" ? marginalTax(price, TO_BRACKETS) : { tax: 0, lines: [] as Line[] };
    const toTax = toCalc.tax;

    const totalBeforeRebates = onTax + toTax;

    // Rebates
    const onRebate = isFTB_ON === "true" ? Math.min(ON_FTB_MAX, onTax) : 0;
    const toRebate = inToronto === "true" && isFTB_TO === "true" ? Math.min(TO_FTB_MAX, toTax) : 0;
    const totalRebates = onRebate + toRebate;

    const totalAfterRebates = Math.max(0, totalBeforeRebates - totalRebates);

    return {
      price,
      onCalc,
      toCalc,
      onTax,
      toTax,
      totalBeforeRebates,
      onRebate,
      toRebate,
      totalRebates,
      totalAfterRebates,
    };
  }, [priceStr, inToronto, isOneOrTwoSFR, isFTB_ON, isFTB_TO]);

  const onPrint = () => window.print();
  const onReset = () => {
    setPriceStr(DEFAULTS.price);
    setInToronto(DEFAULTS.inToronto);
    setIsOneOrTwoSFR(DEFAULTS.isOneOrTwoSFR);
    setIsFTB_ON(DEFAULTS.isFTB_ON);
    setIsFTB_TO(DEFAULTS.isFTB_TO);
  };

  return (
    <ToolShell
      title="Land Transfer Tax (ON + Toronto)"
      subtitle="Estimate Ontario LTT and Toronto MLTT with first-time buyer rebates. These figures are estimates—confirm exact amounts on closing."
      lang="en"
    >
      {/* Actions */}
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

      <form className="grid xl:grid-cols-2 gap-6">
        {/* Inputs */}
        <section className="tool-card grid gap-4">
          <h3 className="font-sans text-lg text-brand-green font-semibold">Inputs</h3>

          <label className="block">
            <span className="block text-sm text-brand-blue/80">Purchase price</span>
            <input
              value={priceStr}
              onChange={(e) => setPriceStr(e.target.value)}
              inputMode="decimal"
              className="mt-1 tool-field"
              aria-label="Purchase price"
            />
          </label>

          <div className="grid sm:grid-cols-2 gap-3">
            <label className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                checked={inToronto === "true"}
                onChange={(e) => setInToronto(e.target.checked ? "true" : "false")}
              />
              <span>Property is in the City of Toronto (MLTT applies)</span>
            </label>

            <label className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                checked={isOneOrTwoSFR === "true"}
                onChange={(e) => setIsOneOrTwoSFR(e.target.checked ? "true" : "false")}
              />
              <span>1–2 single-family residences (ON 2.5% over $2M)</span>
            </label>
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            <label className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                checked={isFTB_ON === "true"}
                onChange={(e) => setIsFTB_ON(e.target.checked ? "true" : "false")}
              />
              <span>First-time buyer (Ontario rebate up to $4,000)</span>
            </label>

            <label className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                checked={isFTB_TO === "true"}
                onChange={(e) => setIsFTB_TO(e.target.checked ? "true" : "false")}
                disabled={inToronto !== "true"}
              />
              <span className={inToronto === "true" ? "" : "opacity-50"}>
                First-time buyer (Toronto rebate up to $4,475)
              </span>
            </label>
          </div>

          <p className="text-xs text-brand-blue/70">
            Note: Toronto luxury MLTT tiers (3.5%–7.5%) apply to residential purchases of $3M+ (max two single-family residences).
            Provincial and municipal taxes are calculated separately and added together.
          </p>
        </section>

        {/* Results */}
        <section className="tool-card">
          <h3 className="font-sans text-lg text-brand-green font-semibold">Results</h3>

          <div className="grid sm:grid-cols-2 gap-4 mt-2">
            <div>
              <div className="text-sm text-brand-blue/80">Ontario LTT (before rebate)</div>
              <div className="text-2xl font-bold text-brand-green">{CAD0.format(Math.round(m.onTax))}</div>
            </div>
            <div>
              <div className="text-sm text-brand-blue/80">Toronto MLTT (before rebate)</div>
              <div className="text-2xl font-bold text-brand-green">
                {m.toTax ? CAD0.format(Math.round(m.toTax)) : "—"}
              </div>
            </div>
          </div>

          <div className="mt-4 grid sm:grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-brand-blue/80">Total before rebates</div>
              <div className="text-xl font-semibold">{CAD0.format(Math.round(m.totalBeforeRebates))}</div>
            </div>
            <div>
              <div className="text-sm text-brand-blue/80">Total rebates</div>
              <div className="text-xl font-semibold">
                {m.totalRebates ? `− ${CAD0.format(Math.round(m.totalRebates))}` : CAD0.format(0)}
              </div>
              <div className="text-xs text-brand-blue/70">
                ON rebate: {m.onRebate ? CAD0.format(Math.round(m.onRebate)) : CAD0.format(0)};{" "}
                Toronto rebate: {m.toRebate ? CAD0.format(Math.round(m.toRebate)) : CAD0.format(0)}
              </div>
            </div>
          </div>

          <div className="mt-4">
            <div className="text-sm text-brand-blue/80">Total LTT payable (estimated)</div>
            <div className="text-2xl font-extrabold text-brand-green">
              {CAD0.format(Math.round(m.totalAfterRebates))}
            </div>
          </div>

          {/* Band breakdowns */}
          <details className="mt-6">
            <summary className="cursor-pointer text-brand-blue underline">Show provincial band breakdown</summary>
            <div className="mt-3 overflow-auto rounded-xl border border-brand-gold/40">
              <table className="w-full text-sm">
                <thead className="bg-brand-beige/40 text-brand-blue">
                  <tr>
                    <th className="text-left px-3 py-2">Band</th>
                    <th className="text-right px-3 py-2">Rate</th>
                    <th className="text-right px-3 py-2">Tax</th>
                  </tr>
                </thead>
                <tbody>
                  {m.onCalc.lines.map((r, i) => (
                    <tr key={i} className="border-t">
                      <td className="px-3 py-2">
                        {CAD0.format(r.bandFrom)} – {isFinite(r.bandTo) ? CAD0.format(r.bandTo) : "∞"}
                      </td>
                      <td className="px-3 py-2 text-right">{(r.rate * 100).toFixed(2)}%</td>
                      <td className="px-3 py-2 text-right">{CAD2.format(r.amount)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </details>

          {m.toCalc.lines.length > 0 && (
            <details className="mt-4">
              <summary className="cursor-pointer text-brand-blue underline">Show Toronto band breakdown</summary>
              <div className="mt-3 overflow-auto rounded-xl border border-brand-gold/40">
                <table className="w-full text-sm">
                  <thead className="bg-brand-beige/40 text-brand-blue">
                    <tr>
                      <th className="text-left px-3 py-2">Band</th>
                      <th className="text-right px-3 py-2">Rate</th>
                      <th className="text-right px-3 py-2">Tax</th>
                    </tr>
                  </thead>
                  <tbody>
                    {m.toCalc.lines.map((r, i) => (
                      <tr key={i} className="border-t">
                        <td className="px-3 py-2">
                          {CAD0.format(r.bandFrom)} – {isFinite(r.bandTo) ? CAD0.format(r.bandTo) : "∞"}
                        </td>
                        <td className="px-3 py-2 text-right">{(r.rate * 100).toFixed(2)}%</td>
                        <td className="px-3 py-2 text-right">{CAD2.format(r.amount)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </details>
          )}

          {/* Similar tools */}
          <div className="mt-6 rounded-xl border border-brand-gold/40 bg-brand-beige/40 p-4">
            <h4 className="font-semibold text-brand-green mb-2">Similar tools</h4>
            <ul className="list-disc ml-5 text-sm space-y-1">
              <li><Link href="/en/tools/closing-costs" className="underline">Closing Costs Estimator</Link></li>
              <li><Link href="/en/tools/down-payment-insurance" className="underline">Down Payment &amp; CMHC Insurance</Link></li>
              <li><Link href="/en/tools/affordability-stress-test" className="underline">Affordability &amp; Stress Test</Link></li>
              <li><Link href="/en/tools/mortgage-calculator" className="underline">Mortgage Payment Calculator</Link></li>
            </ul>
          </div>
        </section>
      </form>

      {/* Notes / disclaimers */}
      <div className="mt-8 tool-card">
        <h4 className="font-sans text-lg text-brand-green font-semibold mb-2">Notes</h4>
        <ul className="list-disc pl-6 space-y-2 text-brand-body">
          <li>Ontario LTT tiers: 0.5% to $55k; 1.0% $55k–$250k; 1.5% $250k–$400k; 2.0% $400k–$2M; 2.5% over $2M (1–2 single-family residences).</li>
          <li>Toronto MLTT adds higher luxury tiers for purchases of $3M+ (up to 7.5% over $20M).</li>
          <li>First-time buyer rebates: Ontario up to $4,000; Toronto up to $4,475 (municipal portion).</li>
          <li>This tool provides estimates and doesn’t account for every edge case or exemption.</li>
        </ul>
      </div>

      {/* Print styles */}
      <style jsx global>{`
        @media print {
          .print\\:hidden { display: none !important; }
          main { background: white !important; }
          header, section { break-inside: avoid; page-break-inside: avoid; }
        }
      `}</style>

      <p className="mt-6 text-xs text-brand-blue/70">
        Educational purposes only. Not legal, tax, or lending advice.
      </p>
    </ToolShell>
  );
}
