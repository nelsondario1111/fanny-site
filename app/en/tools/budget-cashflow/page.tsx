"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import { Trash2, PlusCircle, CheckCircle2 } from "lucide-react";

/**
 * Budget & Cash-flow Worksheet (Professional)
 * - Desktop: table; Mobile: stacked cards
 * - Summary cards: Income, Expenses, Net, Savings Rate
 * - Autosave to localStorage + saved indicator
 * - CSV export, Print, Reset
 * - Accessible, responsive, and print-friendly
 */

type Row = {
  id: string;
  type: "Income" | "Expense";
  category: string;
  amount: string; // kept as string for flexible input; parsed for math
  notes?: string;
};

const STORAGE_KEY = "budget-cashflow-v1"; // keep same to preserve existing user data

const DEFAULTS: Row[] = [
  { id: "i1", type: "Income", category: "Salary (after tax)", amount: "" },
  { id: "i2", type: "Income", category: "Other income", amount: "" },
  { id: "e1", type: "Expense", category: "Rent / Mortgage", amount: "" },
  { id: "e2", type: "Expense", category: "Utilities", amount: "" },
  { id: "e3", type: "Expense", category: "Groceries", amount: "" },
  { id: "e4", type: "Expense", category: "Transport", amount: "" },
  { id: "e5", type: "Expense", category: "Debt payments", amount: "" },
  { id: "e6", type: "Expense", category: "Savings / Investing", amount: "" },
  { id: "e7", type: "Expense", category: "Other", amount: "" },
];

// ---------- utils ----------
const currency = new Intl.NumberFormat("en-CA", { style: "currency", currency: "CAD" });

const toNumber = (s: string | undefined) => {
  if (!s) return 0;
  // allow commas, spaces; block letters/symbols
  const cleaned = String(s).replace(/[^\d.-]/g, "");
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : 0;
};

const uid = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

// ---------- components ----------
function SummaryCard({
  label,
  value,
  emphasis,
}: {
  label: string;
  value: string;
  emphasis?: "good" | "bad" | "muted";
}) {
  const tone =
    emphasis === "good"
      ? "text-emerald-700"
      : emphasis === "bad"
      ? "text-red-700"
      : "text-brand-green";
  return (
    <div className="rounded-xl border border-brand-gold/50 bg-white p-3 md:p-4">
      <div className="text-xs md:text-sm text-brand-blue/70">{label}</div>
      <div className={`text-xl md:text-2xl font-bold ${tone}`}>{value}</div>
    </div>
  );
}

function SavedIndicator({ savedAt }: { savedAt: number | null }) {
  if (!savedAt) return null;
  const seconds = Math.max(0, Math.round((Date.now() - savedAt) / 1000));
  const text =
    seconds < 3 ? "Saved just now" : seconds < 60 ? `Saved ${seconds}s ago` : "Saved";
  return (
    <div
      className="flex items-center gap-1.5 text-emerald-700 text-xs md:text-sm"
      role="status"
      aria-live="polite"
    >
      <CheckCircle2 className="h-4 w-4" />
      {text}
    </div>
  );
}

export default function BudgetCashflowPage() {
  const [rows, setRows] = useState<Row[]>(DEFAULTS);
  const [savedAt, setSavedAt] = useState<number | null>(null);

  // Restore on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) setRows(parsed as Row[]);
      }
    } catch {}
  }, []);

  // Persist on change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(rows));
      setSavedAt(Date.now());
    } catch {}
  }, [rows]);

  // Derive totals
  const totals = useMemo(() => {
    let income = 0;
    let expense = 0;
    for (const r of rows) {
      const val = toNumber(r.amount);
      if (r.type === "Income") income += val;
      else expense += val;
    }
    const net = income - expense;
    const rate = income > 0 ? net / income : 0;
    return { income, expense, net, rate };
  }, [rows]);

  // Row ops
  function addRow(kind: "Income" | "Expense") {
    setRows((r) => [
      ...r,
      { id: uid(), type: kind, category: "", amount: "", notes: "" },
    ]);
  }
  function removeRow(id: string) {
    setRows((r) => r.filter((x) => x.id !== id));
  }
  function updateRow(id: string, patch: Partial<Row>) {
    setRows((r) => r.map((x) => (x.id === id ? { ...x, ...patch } : x)));
  }
  function resetAll() {
    setRows(DEFAULTS);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
  }
  function exportCSV() {
    const headers = ["Type", "Category", "Amount (Monthly)", "Notes"];
    const lines = [headers.join(",")];
    rows.forEach((r) => {
      const cells = [
        r.type,
        r.category.replace(/"/g, '""'),
        (r.amount || "").toString(),
        (r.notes || "").replace(/"/g, '""'),
      ];
      lines.push(
        cells.map((c) => (c.includes(",") || c.includes('"') ? `"${c}"` : c)).join(",")
      );
    });
    const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "Budget_Cashflow.csv";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  return (
    <main className="bg-brand-beige min-h-screen pt-10 pb-16 px-4">
      <section className="max-w-6xl mx-auto">
        <Reveal>
          <div className="bg-white/95 rounded-[28px] border border-brand-gold shadow-xl p-6 sm:p-10">
            {/* Header */}
            <header className="mb-6">
              <div className="text-center">
                <h1 className="font-brand font-bold text-3xl md:text-4xl text-brand-green tracking-tight">
                  Budget &amp; Cash-flow Worksheet
                </h1>
                <p className="text-brand-blue/90 mt-2 max-w-2xl mx-auto">
                  Track monthly income and expenses with notes. Auto-saves in this browser.
                  Export or print anytime.
                </p>
                <div className="flex justify-center my-4" aria-hidden="true">
                  <div className="w-16 h-[3px] rounded-full bg-brand-gold" />
                </div>
                <div className="mt-3 flex flex-wrap gap-2 justify-center items-center">
                  <a
                    href="/tools/Budget_Cashflow_Pro.xlsx"
                    download
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full border-2 border-brand-green text-brand-green hover:bg-brand-green hover:text-white transition"
                  >
                    Download XLSX
                  </a>
                  <a
                    href="/tools/Budget_Cashflow_Pro.csv"
                    download
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full border-2 border-brand-gold text-brand-green hover:bg-brand-gold hover:text-brand-green transition"
                  >
                    Download CSV
                  </a>
                  <span className="mx-2 text-brand-body/70 hidden sm:inline">•</span>
                  <Link
                    href="/en/tools/budget-calculator"
                    className="underline text-brand-blue hover:text-brand-green"
                  >
                    Prefer the quick calculator?
                  </Link>
                </div>
              </div>

              {/* Summary cards + saved indicator */}
              <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4 flex-1">
                  <SummaryCard label="Total Income (monthly)" value={currency.format(totals.income)} />
                  <SummaryCard label="Total Expenses (monthly)" value={currency.format(totals.expense)} />
                  <SummaryCard
                    label="Net (Income − Expenses)"
                    value={currency.format(totals.net)}
                    emphasis={totals.net >= 0 ? "good" : "bad"}
                  />
                  <SummaryCard
                    label="Savings Rate"
                    value={`${(totals.rate * 100).toFixed(1)}%`}
                    emphasis={totals.rate >= 0.2 ? "good" : totals.rate < 0 ? "bad" : "muted"}
                  />
                </div>
                <SavedIndicator savedAt={savedAt} />
              </div>
            </header>

            {/* Controls */}
            <div className="flex flex-wrap gap-2 justify-between items-center mb-4 print:hidden">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => addRow("Income")}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full border-2 border-brand-green text-brand-green hover:bg-brand-green hover:text-white transition"
                >
                  <PlusCircle className="h-4 w-4" />
                  Add Income
                </button>
                <button
                  type="button"
                  onClick={() => addRow("Expense")}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full border-2 border-brand-blue text-brand-blue hover:bg-brand-blue hover:text-white transition"
                >
                  <PlusCircle className="h-4 w-4" />
                  Add Expense
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={exportCSV}
                  className="px-4 py-2 rounded-full border-2 border-brand-green text-brand-green hover:bg-brand-green hover:text-white transition"
                >
                  Export CSV
                </button>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-4 py-2 rounded-full border-2 border-brand-blue text-brand-blue hover:bg-brand-blue hover:text-white transition"
                >
                  Print
                </button>
                <button
                  type="button"
                  onClick={onResetConfirm}
                  className="px-4 py-2 rounded-full border-2 border-brand-gold text-brand-green hover:bg-brand-gold hover:text-brand-green transition"
                >
                  Reset
                </button>
              </div>
            </div>

            {/* Desktop table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm md:text-base">
                <thead>
                  <tr className="bg-brand-gold/15 text-left">
                    <th className="p-3 rounded-l-xl">Type</th>
                    <th className="p-3">Category</th>
                    <th className="p-3">Amount (Monthly)</th>
                    <th className="p-3">Notes</th>
                    <th className="p-3 rounded-r-xl"></th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r) => (
                    <tr key={r.id} className="border-b border-brand-green/20">
                      <td className="p-2 align-top">
                        <label className="sr-only" htmlFor={`type-${r.id}`}>Type</label>
                        <select
                          id={`type-${r.id}`}
                          value={r.type}
                          onChange={(e) => updateRow(r.id, { type: e.target.value as Row["type"] })}
                          className="border rounded-lg p-2 bg-white"
                        >
                          <option>Income</option>
                          <option>Expense</option>
                        </select>
                      </td>
                      <td className="p-2 align-top">
                        <label className="sr-only" htmlFor={`cat-${r.id}`}>Category</label>
                        <input
                          id={`cat-${r.id}`}
                          value={r.category}
                          onChange={(e) => updateRow(r.id, { category: e.target.value })}
                          className="w-full border rounded-lg p-2"
                          placeholder="Category"
                        />
                      </td>
                      <td className="p-2 align-top">
                        <label className="sr-only" htmlFor={`amt-${r.id}`}>Amount</label>
                        <input
                          id={`amt-${r.id}`}
                          value={r.amount}
                          onChange={(e) => {
                            const v = e.target.value.replace(/[^\d.,-]/g, "");
                            updateRow(r.id, { amount: v });
                          }}
                          className="w-full border rounded-lg p-2 text-right"
                          inputMode="decimal"
                          placeholder="0.00"
                          aria-describedby={`amt-help-${r.id}`}
                        />
                        <div id={`amt-help-${r.id}`} className="text-[11px] text-brand-blue/60 mt-1">
                          Enter monthly amount (numbers only)
                        </div>
                      </td>
                      <td className="p-2 align-top">
                        <label className="sr-only" htmlFor={`notes-${r.id}`}>Notes</label>
                        <input
                          id={`notes-${r.id}`}
                          value={r.notes || ""}
                          onChange={(e) => updateRow(r.id, { notes: e.target.value })}
                          className="w-full border rounded-lg p-2"
                          placeholder="Optional"
                        />
                      </td>
                      <td className="p-2 align-top text-right">
                        <button
                          type="button"
                          onClick={() => removeRow(r.id)}
                          title="Remove row"
                          aria-label="Remove row"
                          className="inline-flex items-center justify-center p-1.5 rounded-md text-red-600 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-300"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="font-semibold">
                    <td className="p-3" />
                    <td className="p-3 text-right">Total Income:</td>
                    <td className="p-3 text-right">{currency.format(totals.income)}</td>
                    <td className="p-3" colSpan={2} />
                  </tr>
                  <tr className="font-semibold">
                    <td className="p-3" />
                    <td className="p-3 text-right">Total Expenses:</td>
                    <td className="p-3 text-right">{currency.format(totals.expense)}</td>
                    <td className="p-3" colSpan={2} />
                  </tr>
                  <tr
                    className={`font-bold ${
                      totals.net >= 0 ? "text-brand-green" : "text-red-600"
                    }`}
                  >
                    <td className="p-3" />
                    <td className="p-3 text-right">Net Monthly (Income − Expenses):</td>
                    <td className="p-3 text-right">{currency.format(totals.net)}</td>
                    <td className="p-3" colSpan={2} />
                  </tr>
                  <tr className="font-semibold">
                    <td className="p-3" />
                    <td className="p-3 text-right">Savings Rate (Net / Income):</td>
                    <td className="p-3 text-right">{(totals.rate * 100).toFixed(1)}%</td>
                    <td className="p-3" colSpan={2} />
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Mobile stacked list */}
            <div className="md:hidden grid gap-2">
              {rows.map((r) => (
                <div key={r.id} className="relative rounded-xl border border-brand-gold/40 bg-white p-3">
                  <button
                    type="button"
                    onClick={() => removeRow(r.id)}
                    title="Remove row"
                    aria-label="Remove row"
                    className="absolute right-2 top-2 p-1 rounded-md text-red-600 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-300"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <div className="text-[11px] text-brand-blue/70">Type</div>
                      <select
                        value={r.type}
                        onChange={(e) => updateRow(r.id, { type: e.target.value as Row["type"] })}
                        className="border rounded-lg p-2 bg-white w-full"
                      >
                        <option>Income</option>
                        <option>Expense</option>
                      </select>
                    </div>
                    <div>
                      <div className="text-[11px] text-brand-blue/70">Amount (Monthly)</div>
                      <input
                        value={r.amount}
                        onChange={(e) => {
                          const v = e.target.value.replace(/[^\d.,-]/g, "");
                          updateRow(r.id, { amount: v });
                        }}
                        className="w-full border rounded-lg p-2 text-right"
                        inputMode="decimal"
                        placeholder="0.00"
                      />
                    </div>
                    <div className="col-span-2">
                      <div className="text-[11px] text-brand-blue/70">Category</div>
                      <input
                        value={r.category}
                        onChange={(e) => updateRow(r.id, { category: e.target.value })}
                        className="w-full border rounded-lg p-2"
                        placeholder="Category"
                      />
                    </div>
                    <div className="col-span-2">
                      <div className="text-[11px] text-brand-blue/70">Notes</div>
                      <input
                        value={r.notes || ""}
                        onChange={(e) => updateRow(r.id, { notes: e.target.value })}
                        className="w-full border rounded-lg p-2"
                        placeholder="Optional"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer actions (mobile helpers) */}
            <div className="mt-4 flex md:hidden gap-2">
              <button
                type="button"
                onClick={() => addRow("Income")}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full border-2 border-brand-green text-brand-green hover:bg-brand-green hover:text-white transition"
              >
                <PlusCircle className="h-4 w-4" />
                Add Income
              </button>
              <button
                type="button"
                onClick={() => addRow("Expense")}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full border-2 border-brand-blue text-brand-blue hover:bg-brand-blue hover:text-white transition"
              >
                <PlusCircle className="h-4 w-4" />
                Add Expense
              </button>
            </div>
          </div>
        </Reveal>
      </section>

      {/* Print helpers */}
      <style jsx global>{`
        @media print {
          .print\\:hidden { display: none !important; }
          header a, header button { display: none !important; }
          main { background: white !important; }
          section { break-inside: avoid; page-break-inside: avoid; }
          table { page-break-inside: auto; }
          tr { page-break-inside: avoid; page-break-after: auto; }
        }
      `}</style>
    </main>
  );

  function onResetConfirm() {
    const ok = confirm(
      "Reset all rows to the default template? This will clear your saved data for this page."
    );
    if (ok) resetAll();
  }
}
