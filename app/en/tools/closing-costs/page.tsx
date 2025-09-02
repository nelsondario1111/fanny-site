"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import ToolShell from "@/components/ToolShell";

/**
 * Closing Costs Estimator
 * -------------------------------------------------------
 * - Defaults typical for Ontario buyers (editable).
 * - Optional "Condo purchase" toggle to include Status Certificate.
 * - Advanced costs collapse to keep form tidy.
 * - Persists to localStorage (per-tool key).
 * - Educational only.
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
  maximumFractionDigits: 2,
});
const num = (s: string) => {
  const x = Number(String(s).replace(/[^\d.-]/g, ""));
  return Number.isFinite(x) ? x : 0;
};

const DEFAULTS = {
  purchasePrice: "800000",
  isCondo: "false",
  legal: "1500",
  title: "500",
  inspection: "500",
  appraisal: "400",
  statusCert: "100",  // used when isCondo = true
  adjustments: "500",
  moving: "1200",
  contingencyPct: "1.5", // % of price
};

const LS_KEY = "tools.closing_costs.v2";

export default function Page() {
  const [purchasePrice, setPurchasePrice] = useState(DEFAULTS.purchasePrice);
  const [isCondo, setIsCondo] = useState(DEFAULTS.isCondo);

  // core items
  const [legal, setLegal] = useState(DEFAULTS.legal);
  const [title, setTitle] = useState(DEFAULTS.title);
  const [inspection, setInspection] = useState(DEFAULTS.inspection);
  const [appraisal, setAppraisal] = useState(DEFAULTS.appraisal);

  // advanced
  const [statusCert, setStatusCert] = useState(DEFAULTS.statusCert);
  const [adjustments, setAdjustments] = useState(DEFAULTS.adjustments);
  const [moving, setMoving] = useState(DEFAULTS.moving);
  const [contingencyPct, setContingencyPct] = useState(DEFAULTS.contingencyPct);

  const [showAdvanced, setShowAdvanced] = useState(false);

  // Restore
  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) {
        const v = JSON.parse(raw);
        if (v && typeof v === "object") {
          setPurchasePrice(v.purchasePrice ?? DEFAULTS.purchasePrice);
          setIsCondo(v.isCondo ?? DEFAULTS.isCondo);
          setLegal(v.legal ?? DEFAULTS.legal);
          setTitle(v.title ?? DEFAULTS.title);
          setInspection(v.inspection ?? DEFAULTS.inspection);
          setAppraisal(v.appraisal ?? DEFAULTS.appraisal);
          setStatusCert(v.statusCert ?? DEFAULTS.statusCert);
          setAdjustments(v.adjustments ?? DEFAULTS.adjustments);
          setMoving(v.moving ?? DEFAULTS.moving);
          setContingencyPct(v.contingencyPct ?? DEFAULTS.contingencyPct);
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
          purchasePrice,
          isCondo,
          legal,
          title,
          inspection,
          appraisal,
          statusCert,
          adjustments,
          moving,
          contingencyPct,
        })
      );
    } catch {}
  }, [purchasePrice, isCondo, legal, title, inspection, appraisal, statusCert, adjustments, moving, contingencyPct]);

  const m = useMemo(() => {
    const price = num(purchasePrice);

    const legalCost = num(legal);
    const titleCost = num(title);
    const inspectionCost = num(inspection);
    const appraisalCost = num(appraisal);

    const statusCost = isCondo === "true" ? num(statusCert) : 0; // include only when condo
    const adjustmentsCost = num(adjustments);
    const movingCost = num(moving);
    const contingency = price * (Number(contingencyPct) / 100);

    const total =
      legalCost +
      titleCost +
      inspectionCost +
      appraisalCost +
      statusCost +
      adjustmentsCost +
      movingCost +
      contingency;

    const pctOfPrice = price > 0 ? (total / price) * 100 : 0;

    return {
      price,
      legalCost,
      titleCost,
      inspectionCost,
      appraisalCost,
      statusCost,
      adjustmentsCost,
      movingCost,
      contingency,
      total,
      pctOfPrice,
    };
  }, [purchasePrice, isCondo, legal, title, inspection, appraisal, statusCert, adjustments, moving, contingencyPct]);

  const onPrint = () => window.print();
  const onReset = () => {
    setPurchasePrice(DEFAULTS.purchasePrice);
    setIsCondo(DEFAULTS.isCondo);
    setLegal(DEFAULTS.legal);
    setTitle(DEFAULTS.title);
    setInspection(DEFAULTS.inspection);
    setAppraisal(DEFAULTS.appraisal);
    setStatusCert(DEFAULTS.statusCert);
    setAdjustments(DEFAULTS.adjustments);
    setMoving(DEFAULTS.moving);
    setContingencyPct(DEFAULTS.contingencyPct);
    setShowAdvanced(false);
  };

  return (
    <ToolShell
      title="Closing Costs Estimator"
      subtitle="Estimate the typical closing costs on a home purchase. Values are editable and will vary case by case. Land Transfer Tax is calculated separately."
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
              value={purchasePrice}
              onChange={(e) => setPurchasePrice(e.target.value)}
              inputMode="decimal"
              className="mt-1 w-full rounded-xl border border-brand-gold/60 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-gold"
            />
          </label>

          <label className="inline-flex items-center gap-2">
            <input
              type="checkbox"
              checked={isCondo === "true"}
              onChange={(e) => setIsCondo(e.target.checked ? "true" : "false")}
            />
            <span>Condo purchase (include Status Certificate)</span>
          </label>

          <div className="grid sm:grid-cols-2 gap-3">
            <label className="block">
              <span className="block text-sm text-brand-blue/80">Legal fees</span>
              <input
                value={legal}
                onChange={(e) => setLegal(e.target.value)}
                inputMode="decimal"
                className="mt-1 w-full rounded-xl border border-brand-gold/60 px-3 py-2"
              />
            </label>
            <label className="block">
              <span className="block text-sm text-brand-blue/80">Title insurance / registration</span>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                inputMode="decimal"
                className="mt-1 w-full rounded-xl border border-brand-gold/60 px-3 py-2"
              />
            </label>
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            <label className="block">
              <span className="block text-sm text-brand-blue/80">Home inspection</span>
              <input
                value={inspection}
                onChange={(e) => setInspection(e.target.value)}
                inputMode="decimal"
                className="mt-1 w-full rounded-xl border border-brand-gold/60 px-3 py-2"
              />
            </label>
            <label className="block">
              <span className="block text-sm text-brand-blue/80">Appraisal fee</span>
              <input
                value={appraisal}
                onChange={(e) => setAppraisal(e.target.value)}
                inputMode="decimal"
                className="mt-1 w-full rounded-xl border border-brand-gold/60 px-3 py-2"
              />
            </label>
          </div>

          {/* Advanced costs */}
          <details className="rounded-xl border border-brand-gold/40 bg-brand-beige/30 p-3" open={showAdvanced} onToggle={(e) => setShowAdvanced((e.target as HTMLDetailsElement).open)}>
            <summary className="cursor-pointer text-brand-blue font-medium">Advanced costs</summary>
            <div className="mt-3 grid sm:grid-cols-2 gap-3">
              <label className="block">
                <span className="block text-sm text-brand-blue/80">Status certificate (condo)</span>
                <input
                  value={statusCert}
                  onChange={(e) => setStatusCert(e.target.value)}
                  inputMode="decimal"
                  disabled={isCondo !== "true"}
                  className={`mt-1 w-full rounded-xl border border-brand-gold/60 px-3 py-2 ${isCondo !== "true" ? "opacity-60" : ""}`}
                />
              </label>
              <label className="block">
                <span className="block text-sm text-brand-blue/80">Adjustments (utilities, taxes)</span>
                <input
                  value={adjustments}
                  onChange={(e) => setAdjustments(e.target.value)}
                  inputMode="decimal"
                  className="mt-1 w-full rounded-xl border border-brand-gold/60 px-3 py-2"
                />
              </label>
            </div>

            <div className="mt-3 grid sm:grid-cols-2 gap-3">
              <label className="block">
                <span className="block text-sm text-brand-blue/80">Moving costs</span>
                <input
                  value={moving}
                  onChange={(e) => setMoving(e.target.value)}
                  inputMode="decimal"
                  className="mt-1 w-full rounded-xl border border-brand-gold/60 px-3 py-2"
                />
              </label>
              <label className="block">
                <span className="block text-sm text-brand-blue/80">Contingency (% of price)</span>
                <input
                  value={contingencyPct}
                  onChange={(e) => setContingencyPct(e.target.value)}
                  inputMode="decimal"
                  className="mt-1 w-full rounded-xl border border-brand-gold/60 px-3 py-2"
                />
              </label>
            </div>
          </details>
        </section>

        {/* Results */}
        <section className="rounded-2xl border border-brand-gold bg-white p-5">
          <h3 className="font-serif text-lg text-brand-green font-bold">Results</h3>

          <div className="grid sm:grid-cols-2 gap-4 mt-2">
            <div>
              <div className="text-sm text-brand-blue/80">Total closing costs</div>
              <div className="text-2xl font-bold text-brand-green">
                {CAD0.format(Math.round(m.total))}
              </div>
            </div>
            <div>
              <div className="text-sm text-brand-blue/80">% of purchase price</div>
              <div className="text-2xl font-bold text-brand-green">
                {m.pctOfPrice.toFixed(2)}%
              </div>
            </div>
          </div>

          <div className="mt-4 rounded-xl border border-brand-gold/40 bg-brand-beige/40 p-4">
            <h4 className="font-semibold text-brand-green mb-2">Breakdown</h4>
            <ul className="list-disc ml-5 text-sm space-y-1">
              <li>Legal fees: {CAD2.format(m.legalCost)}</li>
              <li>Title insurance / registration: {CAD2.format(m.titleCost)}</li>
              <li>Home inspection: {CAD2.format(m.inspectionCost)}</li>
              <li>Appraisal: {CAD2.format(m.appraisalCost)}</li>
              <li>Condo status certificate: {isCondo === "true" ? CAD2.format(m.statusCost) : "—"}</li>
              <li>Adjustments: {CAD2.format(m.adjustmentsCost)}</li>
              <li>Moving: {CAD2.format(m.movingCost)}</li>
              <li>Contingency (@ {Number(contingencyPct || 0).toFixed(2)}%): {CAD2.format(m.contingency)}</li>
            </ul>
          </div>

          {/* Similar tools */}
          <div className="mt-6 rounded-xl border border-brand-gold/40 bg-brand-beige/40 p-4">
            <h4 className="font-semibold text-brand-green mb-2">Similar tools</h4>
            <ul className="list-disc ml-5 text-sm space-y-1">
              <li><Link href="/en/tools/land-transfer-tax" className="underline">Land Transfer Tax (ON + Toronto)</Link></li>
              <li><Link href="/en/tools/down-payment-insurance" className="underline">Down Payment &amp; CMHC Insurance</Link></li>
              <li><Link href="/en/tools/affordability-stress-test" className="underline">Affordability &amp; Stress Test</Link></li>
              <li><Link href="/en/tools/mortgage-calculator" className="underline">Mortgage Payment Calculator</Link></li>
            </ul>
          </div>
        </section>
      </form>

      {/* Disclaimer */}
      <p className="mt-6 text-xs text-brand-blue/70">
        Educational purposes only. Actual closing costs depend on lender, property type, and municipality. Please confirm exact figures with your lawyer and lender before closing.
      </p>
    </ToolShell>
  );
}
