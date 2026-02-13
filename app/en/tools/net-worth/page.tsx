"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import ToolShell from "@/components/ToolShell";
import { downloadCsv, downloadXlsx } from "@/lib/spreadsheet";

/**
 * Net Worth Tracker
 * -------------------------------------------------------------
 * - Track assets & liabilities with free-form rows.
 * - Subtotals + Net Worth.
 * - CSV export, Print, Reset.
 * - LocalStorage persistence.
 * - Educational only.
 */

// ---------- Formatting / utils ----------
const CAD0 = new Intl.NumberFormat("en-CA", { style: "currency", currency: "CAD", maximumFractionDigits: 0 });
const CAD2 = new Intl.NumberFormat("en-CA", { style: "currency", currency: "CAD", minimumFractionDigits: 2 });
const num = (s: string) => {
  const x = Number(String(s).replace(/[^\d.-]/g, ""));
  return Number.isFinite(x) ? x : 0;
};

type UUID = string;
const uid = (() => {
  let n = 0;
  return () => `${Date.now().toString(36)}_${(n++).toString(36)}`;
})();

type Row = { id: UUID; label: string; amount: string };

// ---------- Defaults ----------
const ASSETS_DEFAULT: Record<string, Row[]> = {
  "Cash & Short-Term": [
    { id: uid(), label: "Chequing", amount: "5000" },
    { id: uid(), label: "Savings", amount: "8000" },
  ],
  "Investments": [
    { id: uid(), label: "TFSA", amount: "20000" },
    { id: uid(), label: "RRSP", amount: "35000" },
    { id: uid(), label: "Non-registered", amount: "5000" },
  ],
  "Property": [
    { id: uid(), label: "Primary residence (market value)", amount: "850000" },
    { id: uid(), label: "Rental / Other property", amount: "0" },
  ],
  "Vehicles & Other": [
    { id: uid(), label: "Vehicle(s) resale value", amount: "15000" },
    { id: uid(), label: "Other assets", amount: "0" },
  ],
};

const LIABS_DEFAULT: Record<string, Row[]> = {
  "Mortgages": [
    { id: uid(), label: "Primary mortgage balance", amount: "600000" },
    { id: uid(), label: "Rental property mortgage", amount: "0" },
  ],
  "Loans": [
    { id: uid(), label: "Car loan", amount: "7000" },
    { id: uid(), label: "Student loan", amount: "0" },
  ],
  "Credit & Other": [
    { id: uid(), label: "Credit card(s)", amount: "1500" },
    { id: uid(), label: "Other liabilities", amount: "0" },
  ],
};

const LS_KEY = "tools.net_worth.v1";

// ---------- Component ----------
export default function Page() {
  const [assets, setAssets] = useState<Record<string, Row[]>>(ASSETS_DEFAULT);
  const [liabs, setLiabs] = useState<Record<string, Row[]>>(LIABS_DEFAULT);

  // Restore
  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) {
        const v = JSON.parse(raw);
        if (v && typeof v === "object") {
          setAssets(v.assets ?? ASSETS_DEFAULT);
          setLiabs(v.liabs ?? LIABS_DEFAULT);
        }
      }
    } catch {}
  }, []);

  // Persist
  useEffect(() => {
    try {
      localStorage.setItem(LS_KEY, JSON.stringify({ assets, liabs }));
    } catch {}
  }, [assets, liabs]);

  // Computations
  const m = useMemo(() => {
    const sumSection = (rows: Row[]) => rows.reduce((s, r) => s + Math.max(0, num(r.amount)), 0);
    const totalAssets = Object.values(assets).reduce((s, rows) => s + sumSection(rows), 0);
    const totalLiabs = Object.values(liabs).reduce((s, rows) => s + rows.reduce((x, r) => x + Math.max(0, num(r.amount)), 0), 0);
    const netWorth = totalAssets - totalLiabs;

    return { totalAssets, totalLiabs, netWorth, sumSection };
  }, [assets, liabs]);

  // Row helpers
  const addAssetRow = (section: string) =>
    setAssets(prev => ({ ...prev, [section]: [...(prev[section] || []), { id: uid(), label: "New asset", amount: "0" }] }));

  const removeAssetRow = (section: string, id: UUID) =>
    setAssets(prev => ({ ...prev, [section]: (prev[section] || []).filter(r => r.id !== id) }));

  const patchAssetRow = (section: string, id: UUID, patch: Partial<Row>) =>
    setAssets(prev => ({
      ...prev,
      [section]: (prev[section] || []).map(r => (r.id === id ? { ...r, ...patch } : r)),
    }));

  const addLiabRow = (section: string) =>
    setLiabs(prev => ({ ...prev, [section]: [...(prev[section] || []), { id: uid(), label: "New liability", amount: "0" }] }));

  const removeLiabRow = (section: string, id: UUID) =>
    setLiabs(prev => ({ ...prev, [section]: (prev[section] || []).filter(r => r.id !== id) }));

  const patchLiabRow = (section: string, id: UUID, patch: Partial<Row>) =>
    setLiabs(prev => ({
      ...prev,
      [section]: (prev[section] || []).map(r => (r.id === id ? { ...r, ...patch } : r)),
    }));

  // Section helpers (add new empty section)
  const addAssetSection = () => {
    const name = prompt("Asset section name (e.g., 'Crypto', 'Business equity')");
    if (!name) return;
    setAssets(prev => ({ ...prev, [name]: [] }));
  };
  const addLiabSection = () => {
    const name = prompt("Liability section name (e.g., 'Tax owing', 'Private loan')");
    if (!name) return;
    setLiabs(prev => ({ ...prev, [name]: [] }));
  };

  // Actions
  const onPrint = () => window.print();
  const onReset = () => {
    setAssets(ASSETS_DEFAULT);
    setLiabs(LIABS_DEFAULT);
  };

  const onExportCSV = () => {
    const rows: Array<Array<string | number>> = [];
    rows.push(["Type", "Section", "Label", "Amount"]);

    for (const [section, assetRows] of Object.entries(assets)) {
      for (const r of assetRows) {
        rows.push(["Asset", section, r.label, num(r.amount).toFixed(2)]);
      }
    }
    for (const [section, liabilityRows] of Object.entries(liabs)) {
      for (const r of liabilityRows) {
        rows.push(["Liability", section, r.label, num(r.amount).toFixed(2)]);
      }
    }

    rows.push([]);
    rows.push(["Totals", "Assets", "", num(m.totalAssets.toString()).toFixed(2)]);
    rows.push(["Totals", "Liabilities", "", num(m.totalLiabs.toString()).toFixed(2)]);
    rows.push(["Totals", "Net Worth", "", num(m.netWorth.toString()).toFixed(2)]);
    downloadCsv("net_worth", rows);
  };

  const onExportXLSX = () => {
    const rows: Array<Array<string | number>> = [];
    rows.push(["Type", "Section", "Label", "Amount"]);

    for (const [section, assetRows] of Object.entries(assets)) {
      for (const r of assetRows) {
        rows.push(["Asset", section, r.label, num(r.amount).toFixed(2)]);
      }
    }
    for (const [section, liabilityRows] of Object.entries(liabs)) {
      for (const r of liabilityRows) {
        rows.push(["Liability", section, r.label, num(r.amount).toFixed(2)]);
      }
    }

    rows.push([]);
    rows.push(["Totals", "Assets", "", num(m.totalAssets.toString()).toFixed(2)]);
    rows.push(["Totals", "Liabilities", "", num(m.totalLiabs.toString()).toFixed(2)]);
    rows.push(["Totals", "Net Worth", "", num(m.netWorth.toString()).toFixed(2)]);
    downloadXlsx("net_worth", rows, {
      sheetName: "Net Worth",
      columnWidths: [12, 26, 38, 14],
    });
  };

  // UI Blocks
  const SectionTable: React.FC<{
    title: string;
    rows: Row[];
    onAddRow: () => void;
    onRemoveRow: (id: UUID) => void;
    onPatchRow: (id: UUID, patch: Partial<Row>) => void;
    total: number;
    type: "asset" | "liab";
  }> = ({ title, rows, onAddRow, onRemoveRow, onPatchRow, total, type }) => {
    return (
      <div className="rounded-xl border border-brand-gold/40">
        <div className="flex items-center justify-between px-4 py-3 bg-brand-beige/40">
          <h4 className="font-semibold text-brand-green">{title}</h4>
          <button type="button" onClick={onAddRow} className="underline">+ Add {type === "asset" ? "asset" : "liability"}</button>
        </div>
        <div className="overflow-auto">
          <table className="w-full text-sm">
            <thead className="bg-white text-brand-blue">
              <tr>
                <th className="text-left px-3 py-2">Label</th>
                <th className="text-right px-3 py-2">Amount</th>
                <th className="px-3 py-2"></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="border-t">
                  <td className="px-3 py-2">
                    <input
                      value={r.label}
                      onChange={(e) => onPatchRow(r.id, { label: e.target.value })}
                      className="w-full bg-transparent outline-none"
                      aria-label={`${type} label`}
                    />
                  </td>
                  <td className="px-3 py-2 text-right">
                    <input
                      value={r.amount}
                      onChange={(e) => onPatchRow(r.id, { amount: e.target.value })}
                      inputMode="decimal"
                      className="w-36 text-right bg-transparent outline-none"
                      aria-label={`${type} amount`}
                    />
                  </td>
                  <td className="px-3 py-2 text-right">
                    <button type="button" onClick={() => onRemoveRow(r.id)} className="text-red-600 underline">Remove</button>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-brand-beige/20">
                <td className="px-3 py-2 font-medium">Subtotal</td>
                <td className="px-3 py-2 text-right font-semibold">{CAD2.format(total)}</td>
                <td className="px-3 py-2"></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    );
  };

  // Render
  return (
    <ToolShell
      title="Net Worth Tracker"
      subtitle="List all your assets and liabilities to get a clear picture of your net worth. Add custom sections and items as needed."
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
          onClick={onExportCSV}
          className="tool-btn-green"
        >
          Export (CSV)
        </button>
        <button
          type="button"
          onClick={onExportXLSX}
          className="tool-btn-primary"
        >
          Export (XLSX)
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
        {/* Left: Assets */}
        <section className="tool-card grid gap-4">
          <div className="flex items-center justify-between">
            <h3 className="font-sans text-lg text-brand-green font-semibold">Assets</h3>
            <button type="button" onClick={addAssetSection} className="underline">+ Add asset section</button>
          </div>

          {Object.entries(assets).map(([section, rows]) => (
            <SectionTable
              key={section}
              title={section}
              rows={rows}
              type="asset"
              onAddRow={() => addAssetRow(section)}
              onRemoveRow={(id) => removeAssetRow(section, id)}
              onPatchRow={(id, patch) => patchAssetRow(section, id, patch)}
              total={rows.reduce((s, r) => s + Math.max(0, num(r.amount)), 0)}
            />
          ))}

          <div className="grid sm:grid-cols-2 gap-4 mt-2">
            <div className="rounded-xl border border-brand-gold/50 p-4">
              <div className="text-sm text-brand-blue/80">Total assets</div>
              <div className="text-2xl font-bold text-brand-green">
                {CAD0.format(Math.round(m.totalAssets))}
              </div>
            </div>
          </div>
        </section>

        {/* Right: Liabilities */}
        <section className="tool-card grid gap-4">
          <div className="flex items-center justify-between">
            <h3 className="font-sans text-lg text-brand-green font-semibold">Liabilities</h3>
            <button type="button" onClick={addLiabSection} className="underline">+ Add liability section</button>
          </div>

          {Object.entries(liabs).map(([section, rows]) => (
            <SectionTable
              key={section}
              title={section}
              rows={rows}
              type="liab"
              onAddRow={() => addLiabRow(section)}
              onRemoveRow={(id) => removeLiabRow(section, id)}
              onPatchRow={(id, patch) => patchLiabRow(section, id, patch)}
              total={rows.reduce((s, r) => s + Math.max(0, num(r.amount)), 0)}
            />
          ))}

          <div className="grid sm:grid-cols-2 gap-4 mt-2">
            <div className="rounded-xl border border-brand-gold/50 p-4">
              <div className="text-sm text-brand-blue/80">Total liabilities</div>
              <div className="text-2xl font-bold text-brand-green">
                {CAD0.format(Math.round(m.totalLiabs))}
              </div>
            </div>
            <div className="rounded-xl border border-brand-gold/50 p-4">
              <div className="text-sm text-brand-blue/80">Net worth</div>
              <div className={`text-2xl font-bold ${m.netWorth >= 0 ? "text-green-700" : "text-red-700"}`}>
                {CAD0.format(Math.round(m.netWorth))}
              </div>
            </div>
          </div>
        </section>
      </form>

      {/* Similar tools */}
      <div className="mt-6 tool-card">
        <h4 className="font-sans text-lg text-brand-green font-semibold mb-2">Similar tools</h4>
        <ul className="list-disc ml-5 text-sm space-y-1">
          <li><Link href="/en/tools/budget-calculator" className="underline">Holistic Budget Calculator</Link></li>
          <li><Link href="/en/tools/debt-snowball" className="underline">Debt Snowball / Payoff Planner</Link></li>
          <li><Link href="/en/tools/mortgage-calculator" className="underline">Mortgage Payment Calculator</Link></li>
          <li><Link href="/en/tools/affordability-stress-test" className="underline">Affordability &amp; Stress Test</Link></li>
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

      {/* Disclaimer */}
      <p className="mt-6 text-xs text-brand-blue/70">
        Educational purposes only. Values are user-entered estimates and may fluctuate. Consider professional valuation for major assets and a recent statement for debts.
      </p>
    </ToolShell>
  );
}
