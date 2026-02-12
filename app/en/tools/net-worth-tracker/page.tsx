"use client";

import { useMemo, useState } from "react";
import ToolShell from "@/components/ToolShell";
import { FaPrint, FaFileCsv, FaPlus, FaTrash, FaCalendarPlus } from "react-icons/fa";

/* =========================================================
   Types
   ========================================================= */
type LineItem = { id: number; name: string; amount: number };
type Snapshot = { id: number; date: string; assets: number; liabilities: number; netWorth: number };

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

// Robust CSV (quotes + CRLF + BOM for Excel)
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
  const blob = new Blob(["\uFEFF" + toCSV(rows)], { type: "text/csv;charset=utf-8" });
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
  // Seed examples (editable)
  const [assets, setAssets] = useState<LineItem[]>([
    { id: 1, name: "Chequing", amount: 3_200 },
    { id: 2, name: "Savings / Emergency", amount: 12_500 },
    { id: 3, name: "TFSA / Investments", amount: 28_000 },
    { id: 4, name: "RRSP / Retirement", amount: 40_000 },
    { id: 5, name: "Home (market value)", amount: 850_000 },
    { id: 6, name: "Vehicle(s)", amount: 18_000 },
  ]);
  const [liabilities, setLiabilities] = useState<LineItem[]>([
    { id: 1, name: "Mortgage", amount: 520_000 },
    { id: 2, name: "HELOC / LOC", amount: 8_500 },
    { id: 3, name: "Credit Card(s)", amount: 2_400 },
    { id: 4, name: "Auto Loan", amount: 12_300 },
    { id: 5, name: "Student Loan", amount: 9_800 },
  ]);

  // Snapshots (local tracking). Date defaults to today; user can change before saving.
  const todayISO = new Date().toISOString().slice(0, 10);
  const [snapshotDate, setSnapshotDate] = useState<string>(todayISO);
  const [snapshots, setSnapshots] = useState<Snapshot[]>([]);

  const printDate = new Date().toLocaleDateString("en-CA", { year: "numeric", month: "long", day: "numeric" });

  /* Totals */
  const totals = useMemo(() => {
    const assetSum = assets.reduce((s, a) => s + Math.max(0, a.amount || 0), 0);
    const debtSum = liabilities.reduce((s, l) => s + Math.max(0, l.amount || 0), 0);
    const net = assetSum - debtSum;

    // Simple liquidity view (cash-like vs. everything else)
    const liquidKeywords = ["chequing", "checking", "saving", "cash", "money market", "hysa"];
    const isLiquid = (n: string) =>
      liquidKeywords.some((k) => n.toLowerCase().includes(k));
    const liquidAssets = assets.filter((a) => isLiquid(a.name)).reduce((s, a) => s + Math.max(0, a.amount || 0), 0);
    const investedAssets = assetSum - liquidAssets;

    const dta = assetSum > 0 ? (debtSum / assetSum) : 0;
    const ltr = debtSum > 0 ? (liquidAssets / debtSum) : Infinity; // liquidity-to-debt ratio

    return { assetSum, debtSum, net, liquidAssets, investedAssets, dta, ltr };
  }, [assets, liabilities]);

  /* Actions: assets */
  function addAsset() {
    setAssets((prev) => [...prev, { id: (prev.at(-1)?.id ?? 0) + 1, name: `Asset ${prev.length + 1}`, amount: 0 }]);
  }
  function updateAsset(id: number, patch: Partial<LineItem>) {
    setAssets((prev) => prev.map((a) => (a.id === id ? { ...a, ...patch } : a)));
  }
  function removeAsset(id: number) {
    setAssets((prev) => prev.filter((a) => a.id !== id));
  }

  /* Actions: liabilities */
  function addLiability() {
    setLiabilities((prev) => [...prev, { id: (prev.at(-1)?.id ?? 0) + 1, name: `Liability ${prev.length + 1}`, amount: 0 }]);
  }
  function updateLiability(id: number, patch: Partial<LineItem>) {
    setLiabilities((prev) => prev.map((l) => (l.id === id ? { ...l, ...patch } : l)));
  }
  function removeLiability(id: number) {
    setLiabilities((prev) => prev.filter((l) => l.id !== id));
  }

  /* Snapshots */
  function saveSnapshot() {
    const date = snapshotDate || todayISO;
    setSnapshots((prev) => [
      ...prev,
      {
        id: (prev.at(-1)?.id ?? 0) + 1,
        date,
        assets: totals.assetSum,
        liabilities: totals.debtSum,
        netWorth: totals.net,
      },
    ]);
  }
  function removeSnapshot(id: number) {
    setSnapshots((prev) => prev.filter((s) => s.id !== id));
  }

  /* Exports & Print */
  function handlePrint() {
    window.print(); // use browser "Save as PDF"
  }

  function exportSummaryCSV() {
    const rows: Array<Array<string | number>> = [
      ["Prepared", printDate],
      ["—", "—"],
      ["ASSETS"],
      ...assets.map((a) => [a.name, a.amount.toFixed(2)]),
      ["Assets Total", totals.assetSum.toFixed(2)],
      ["—", "—"],
      ["LIABILITIES"],
      ...liabilities.map((l) => [l.name, l.amount.toFixed(2)]),
      ["Liabilities Total", totals.debtSum.toFixed(2)],
      ["—", "—"],
      ["Net Worth", totals.net.toFixed(2)],
      ["Liquid Assets (approx.)", totals.liquidAssets.toFixed(2)],
      ["Invested/Other Assets", totals.investedAssets.toFixed(2)],
      ["Debt-to-Assets Ratio", totals.dta.toFixed(4)],
      ["Liquidity-to-Debt Ratio", Number.isFinite(totals.ltr) ? totals.ltr.toFixed(4) : "∞"],
    ];
    downloadCSV("net_worth_summary", rows);
  }

  function exportTimelineCSV() {
    const rows: Array<Array<string | number>> = [["Date", "Assets", "Liabilities", "Net Worth"]];
    snapshots.forEach((s) => rows.push([s.date, s.assets.toFixed(2), s.liabilities.toFixed(2), s.netWorth.toFixed(2)]));
    downloadCSV("net_worth_timeline", rows);
  }

  function resetExample() {
    setAssets([
      { id: 1, name: "Chequing", amount: 3_200 },
      { id: 2, name: "Savings / Emergency", amount: 12_500 },
      { id: 3, name: "TFSA / Investments", amount: 28_000 },
      { id: 4, name: "RRSP / Retirement", amount: 40_000 },
      { id: 5, name: "Home (market value)", amount: 850_000 },
      { id: 6, name: "Vehicle(s)", amount: 18_000 },
    ]);
    setLiabilities([
      { id: 1, name: "Mortgage", amount: 520_000 },
      { id: 2, name: "HELOC / LOC", amount: 8_500 },
      { id: 3, name: "Credit Card(s)", amount: 2_400 },
      { id: 4, name: "Auto Loan", amount: 12_300 },
      { id: 5, name: "Student Loan", amount: 9_800 },
    ]);
    setSnapshotDate(todayISO);
    setSnapshots([]);
  }

  /* UI */
  return (
    <ToolShell
      title="Net Worth Tracker"
      subtitle="Tally your assets and liabilities to see your net worth. Save dated snapshots over time, and export a summary or timeline."
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
          onClick={exportSummaryCSV}
          className="px-4 py-2 bg-white border-2 border-brand-blue text-brand-blue rounded-full inline-flex items-center gap-2 hover:bg-brand-blue hover:text-white transition"
          title="Export a detailed summary of your items and totals"
        >
          <FaFileCsv aria-hidden /> Export Summary CSV
        </button>
        <button
          type="button"
          onClick={exportTimelineCSV}
          disabled={snapshots.length === 0}
          className={`px-4 py-2 rounded-full inline-flex items-center gap-2 border-2 ${snapshots.length===0 ? "border-gray-300 text-gray-400 cursor-not-allowed" : "border-brand-blue text-brand-blue hover:bg-brand-blue hover:text-white transition"}`}
          title={snapshots.length === 0 ? "Add a snapshot first" : "Export your dated snapshots"}
        >
          <FaFileCsv aria-hidden /> Export Timeline CSV
        </button>
        <button
          type="button"
          onClick={resetExample}
          className="px-4 py-2 bg-white border-2 border-brand-gold text-brand-green rounded-full inline-flex items-center gap-2 hover:bg-brand-gold hover:text-brand-green transition"
          title="Reset to sample values"
        >
          Reset Example
        </button>
      </div>

      {/* Inputs */}
      <form className="grid 2xl:grid-cols-4 xl:grid-cols-3 gap-6">
        {/* Assets */}
        <section className="rounded-2xl border border-brand-gold bg-white p-5">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-sans text-lg text-brand-green font-semibold">Assets</h3>
            <button
              type="button"
              onClick={addAsset}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border-2 border-brand-green text-brand-green hover:bg-brand-green hover:text-white transition"
            >
              <FaPlus aria-hidden /> Add Asset
            </button>
          </div>

          {assets.length === 0 ? (
            <p className="text-sm text-brand-blue/70">No assets yet. Add your first asset to begin.</p>
          ) : (
            <div className="space-y-3">
              {assets.map((a) => (
                <div key={a.id} className="grid grid-cols-12 items-end gap-3">
                  <div className="col-span-7">
                    <label className="block text-sm font-medium text-brand-blue mb-1">Name</label>
                    <input
                      type="text"
                      className="w-full rounded-xl border border-brand-gold/60 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-gold"
                      value={a.name}
                      onChange={(e) => updateAsset(a.id, { name: e.target.value })}
                    />
                  </div>
                  <div className="col-span-4">
                    <label className="block text-sm font-medium text-brand-blue mb-1">Amount</label>
                    <input
                      type="number" min={0} inputMode="decimal"
                      className="w-full rounded-xl border border-brand-gold/60 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-gold"
                      value={a.amount}
                      onChange={(e) => updateAsset(a.id, { amount: Number(e.target.value || 0) })}
                    />
                  </div>
                  <div className="col-span-1 flex justify-end">
                    <button
                      type="button"
                      onClick={() => removeAsset(a.id)}
                      className="text-brand-blue/70 hover:text-brand-blue"
                      aria-label={`Remove ${a.name}`}
                    >
                      <FaTrash aria-hidden />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <p className="text-xs text-brand-blue/70 mt-2">
            Tip: For your home, use a realistic current market value; for investments, use today’s account value.
          </p>
        </section>

        {/* Liabilities */}
        <section className="rounded-2xl border border-brand-gold bg-white p-5">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-sans text-lg text-brand-green font-semibold">Liabilities</h3>
            <button
              type="button"
              onClick={addLiability}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border-2 border-brand-green text-brand-green hover:bg-brand-green hover:text-white transition"
            >
              <FaPlus aria-hidden /> Add Liability
            </button>
          </div>

          {liabilities.length === 0 ? (
            <p className="text-sm text-brand-blue/70">No liabilities yet. Add your first liability to begin.</p>
          ) : (
            <div className="space-y-3">
              {liabilities.map((l) => (
                <div key={l.id} className="grid grid-cols-12 items-end gap-3">
                  <div className="col-span-7">
                    <label className="block text-sm font-medium text-brand-blue mb-1">Name</label>
                    <input
                      type="text"
                      className="w-full rounded-xl border border-brand-gold/60 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-gold"
                      value={l.name}
                      onChange={(e) => updateLiability(l.id, { name: e.target.value })}
                    />
                  </div>
                  <div className="col-span-4">
                    <label className="block text-sm font-medium text-brand-blue mb-1">Amount</label>
                    <input
                      type="number" min={0} inputMode="decimal"
                      className="w-full rounded-xl border border-brand-gold/60 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-gold"
                      value={l.amount}
                      onChange={(e) => updateLiability(l.id, { amount: Number(e.target.value || 0) })}
                    />
                  </div>
                  <div className="col-span-1 flex justify-end">
                    <button
                      type="button"
                      onClick={() => removeLiability(l.id)}
                      className="text-brand-blue/70 hover:text-brand-blue"
                      aria-label={`Remove ${l.name}`}
                    >
                      <FaTrash aria-hidden />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <p className="text-xs text-brand-blue/70 mt-2">
            Include everything you owe: mortgage, HELOC/LOC, credit cards, car/student/personal loans, taxes owing, etc.
          </p>
        </section>

        {/* Snapshot + Ratios */}
        <section className="rounded-2xl border border-brand-gold bg-white p-5">
          <h3 className="font-sans text-lg text-brand-green font-semibold mb-2">Snapshot & Ratios</h3>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="text-sm text-brand-blue/80">Assets Total</div>
              <div className="text-xl font-semibold">{money(totals.assetSum, 0)}</div>
            </div>
            <div>
              <div className="text-sm text-brand-blue/80">Liabilities Total</div>
              <div className="text-xl font-semibold">{money(totals.debtSum, 0)}</div>
            </div>
            <div className="col-span-2 border-t border-brand-gold/40 pt-2">
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-sm text-brand-blue/80">Net Worth</div>
                  <div className="text-2xl font-bold text-brand-green">{money(totals.net, 0)}</div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-brand-blue/70">Liquid Assets</div>
                  <div className="text-sm font-medium">{money(totals.liquidAssets, 0)}</div>
                  <div className="text-xs text-brand-blue/70 mt-1">Debt/Assets</div>
                  <div className="text-sm font-medium">{(totals.dta * 100).toFixed(1)}%</div>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-brand-gold/40 bg-brand-beige/40 p-3 mt-4">
            <label className="block text-sm font-medium text-brand-blue mb-1">Snapshot date</label>
            <div className="flex gap-2">
              <input
                type="date"
                className="rounded-xl border border-brand-gold/60 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-gold"
                value={snapshotDate}
                onChange={(e) => setSnapshotDate(e.target.value)}
              />
              <button
                type="button"
                onClick={saveSnapshot}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full border-2 border-brand-blue text-brand-blue hover:bg-brand-blue hover:text-white transition"
                title="Save a dated snapshot of your totals"
              >
                <FaCalendarPlus aria-hidden /> Add Snapshot
              </button>
            </div>
            <p className="text-xs text-brand-blue/70 mt-1">
              Snapshots are stored locally in this session to help you track progress over time.
            </p>
          </div>
        </section>
      </form>

      {/* Snapshots table */}
      <div className="mt-8 rounded-2xl border border-brand-gold bg-white p-5">
        <h3 className="font-sans text-lg text-brand-green font-semibold mb-2">Saved Snapshots</h3>
        {snapshots.length === 0 ? (
          <p className="text-sm text-brand-blue/70">No snapshots yet. Choose a date and click <b>Add Snapshot</b>.</p>
        ) : (
          <div className="overflow-auto rounded-xl border border-brand-gold/40">
            <table className="w-full text-sm">
              <thead className="bg-brand-beige/40 text-brand-blue">
                <tr>
                  <th className="text-left px-3 py-2">Date</th>
                  <th className="text-right px-3 py-2">Assets</th>
                  <th className="text-right px-3 py-2">Liabilities</th>
                  <th className="text-right px-3 py-2">Net Worth</th>
                  <th className="text-right px-3 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {snapshots.map((s) => (
                  <tr key={s.id} className="border-t">
                    <td className="px-3 py-2">{s.date}</td>
                    <td className="px-3 py-2 text-right">{money(s.assets, 0)}</td>
                    <td className="px-3 py-2 text-right">{money(s.liabilities, 0)}</td>
                    <td className="px-3 py-2 text-right">{money(s.netWorth, 0)}</td>
                    <td className="px-3 py-2 text-right">
                      <button
                        type="button"
                        onClick={() => removeSnapshot(s.id)}
                        className="text-brand-blue/70 hover:text-brand-blue"
                        aria-label={`Delete snapshot ${s.date}`}
                      >
                        <FaTrash aria-hidden />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Assumptions & Notes */}
      <details className="mt-6 rounded-2xl border border-brand-gold/40 bg-brand-beige/40 p-4">
        <summary className="cursor-pointer font-semibold text-brand-green">Notes</summary>
        <ul className="list-disc ml-5 mt-2 text-sm text-brand-blue/80 space-y-1">
          <li>Figures are user-entered estimates; this tool does not connect to bank or investment accounts.</li>
          <li>“Liquid assets” are approximated based on item names (cash/savings); edit names if you want a different classification.</li>
          <li>Educational tool only; not financial advice.</li>
        </ul>
      </details>

      {/* Print header (only when printing) */}
      <div className="hidden print:block mt-6 mb-3 text-center">
        <div className="font-sans font-bold text-brand-green text-2xl">Net Worth — Summary</div>
        <div className="text-xs text-brand-blue">Prepared {printDate}</div>
        <div className="w-16 h-[2px] bg-brand-gold rounded-full mx-auto mt-2" />
      </div>

      {/* Print styles */}
      <style jsx global>{`
        @media print {
          .print\\:hidden { display: none !important; }
          main { background: white !important; }
          .avoid-break { break-inside: avoid; page-break-inside: avoid; }
          table { page-break-inside: auto; }
          tr, td, th { page-break-inside: avoid; page-break-after: auto; }
        }
      `}</style>
    </ToolShell>
  );
}
