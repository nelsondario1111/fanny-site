"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import ToolShell from "@/components/ToolShell";
import { Trash2 } from "lucide-react";

/**
 * Holistic Budget Calculator
 * - Single column by default; side-by-side only on ultra-wide (≥1536px, Tailwind 2xl)
 * - Mobile: stacked cards; Desktop: tables
 * - 50/30/20 guidance, leftover/shortfall, CSV export, localStorage
 */

/* ---------- Formatting / utils ---------- */
const CAD0 = new Intl.NumberFormat("en-CA", { style: "currency", currency: "CAD", maximumFractionDigits: 0 });
const CAD2 = new Intl.NumberFormat("en-CA", { style: "currency", currency: "CAD", minimumFractionDigits: 2 });

const toNum = (v: string) => {
  const n = Number(String(v).replace(/[^\d.-]/g, ""));
  return Number.isFinite(n) ? n : 0;
};

type FreqKey = "monthly" | "semi_monthly" | "biweekly" | "weekly" | "annual";
const FREQUENCIES: { key: FreqKey; label: string; perYear: number }[] = [
  { key: "monthly", label: "Monthly (12/yr)", perYear: 12 },
  { key: "semi_monthly", label: "Semi-Monthly (24/yr)", perYear: 24 },
  { key: "biweekly", label: "Bi-weekly (26/yr)", perYear: 26 },
  { key: "weekly", label: "Weekly (52/yr)", perYear: 52 },
  { key: "annual", label: "Annual (1/yr)", perYear: 1 },
];
const perYear = (f: FreqKey) => FREQUENCIES.find(x => x.key === f)!.perYear;
const toMonthly = (amount: number, f: FreqKey) => amount * (perYear(f) / 12);

type UUID = string;
const uid = (() => { let i = 0; return () => `${Date.now().toString(36)}_${(i++).toString(36)}`; })();

/* ---------- Types ---------- */
type IncomeRow = { id: UUID; label: string; amount: string; freq: FreqKey };
type ExpenseKind = "need" | "want" | "savings_debt";
type ExpenseRow = { id: UUID; label: string; amount: string; freq: FreqKey; kind: ExpenseKind };

/* ---------- Defaults ---------- */
const DEFAULT_INCOME: IncomeRow[] = [
  { id: uid(), label: "Salary #1 (take-home)", amount: "5000", freq: "monthly" },
  { id: uid(), label: "Salary #2 (take-home)", amount: "0", freq: "monthly" },
  { id: uid(), label: "Other income", amount: "0", freq: "annual" },
];

const DEFAULT_EXPENSES: ExpenseRow[] = [
  // Needs
  { id: uid(), label: "Rent / Mortgage", amount: "2500", freq: "monthly", kind: "need" },
  { id: uid(), label: "Utilities (hydro, water, gas)", amount: "250", freq: "monthly", kind: "need" },
  { id: uid(), label: "Groceries", amount: "800", freq: "monthly", kind: "need" },
  { id: uid(), label: "Transportation (fuel/transit)", amount: "300", freq: "monthly", kind: "need" },
  { id: uid(), label: "Insurance (auto/home/health)", amount: "200", freq: "monthly", kind: "need" },
  { id: uid(), label: "Phone / Internet", amount: "120", freq: "monthly", kind: "need" },
  { id: uid(), label: "Childcare", amount: "0", freq: "monthly", kind: "need" },
  // Wants
  { id: uid(), label: "Dining out", amount: "200", freq: "monthly", kind: "want" },
  { id: uid(), label: "Entertainment", amount: "100", freq: "monthly", kind: "want" },
  { id: uid(), label: "Subscriptions (Netflix, etc.)", amount: "40", freq: "monthly", kind: "want" },
  { id: uid(), label: "Shopping / Personal", amount: "150", freq: "monthly", kind: "want" },
  { id: uid(), label: "Travel & Vacations", amount: "150", freq: "monthly", kind: "want" },
  // Savings & Debt
  { id: uid(), label: "Emergency fund", amount: "300", freq: "monthly", kind: "savings_debt" },
  { id: uid(), label: "Investments (TFSA/RRSP)", amount: "300", freq: "monthly", kind: "savings_debt" },
  { id: uid(), label: "Debt payments (cards/loans)", amount: "200", freq: "monthly", kind: "savings_debt" },
];

const LS_KEY = "tools.holistic_budget.ultrawide_two_col_with_trash.v1";

/* ---------- UI helpers ---------- */
const Tag = ({ children, tone = "emerald" }: { children: React.ReactNode; tone?: "emerald" | "amber" | "sky" }) => {
  const color = { emerald: "border-emerald-600 text-emerald-700", amber: "border-amber-600 text-amber-700", sky: "border-sky-600 text-sky-700" }[tone];
  return <span className={`px-2 py-0.5 rounded-full text-[10px] md:text-xs border ${color}`}>{children}</span>;
};

// Desktop table shell (md+)
const Table = ({ children }: { children: React.ReactNode }) => (
  <div className="hidden md:block rounded-xl border border-brand-gold/40 overflow-x-auto">
    <table className="w-full text-sm">{children}</table>
  </div>
);

// Mobile stacked-list shell (<md)
const Stack = ({ children }: { children: React.ReactNode }) => (
  <div className="md:hidden grid gap-2">{children}</div>
);

// One stacked row (mobile)
function StackedRow(props: {
  fields: { label: string; node: React.ReactNode; right?: boolean }[];
  onRemove?: () => void;
}) {
  return (
    <div className="relative rounded-xl border border-brand-gold/40 bg-white p-3">
      {/* Trash icon (mobile) */}
      {props.onRemove && (
        <button
          type="button"
          onClick={props.onRemove}
          title="Remove"
          aria-label="Remove row"
          className="absolute right-2 top-2 p-1 rounded-md text-red-600 hover:bg-red-50"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      )}
      <div className="grid grid-cols-2 gap-2">
        {props.fields.map((f, i) => (
          <div key={i} className={f.right ? "col-span-2 text-right md:text-left" : ""}>
            <div className="text-[11px] text-brand-blue/70">{f.label}</div>
            <div>{f.node}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------- Component ---------- */
export default function Page() {
  const [income, setIncome] = useState<IncomeRow[]>(DEFAULT_INCOME);
  const [expenses, setExpenses] = useState<ExpenseRow[]>(DEFAULT_EXPENSES);

  // Restore / Persist
  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) {
        const v = JSON.parse(raw);
        if (Array.isArray(v?.income)) setIncome(v.income);
        if (Array.isArray(v?.expenses)) setExpenses(v.expenses);
      }
    } catch {}
  }, []);
  useEffect(() => {
    try {
      localStorage.setItem(LS_KEY, JSON.stringify({ income, expenses }));
    } catch {}
  }, [income, expenses]);

  // Derived metrics
  const metrics = useMemo(() => {
    const incomeMonthly = income.reduce((s, r) => s + toMonthly(toNum(r.amount), r.freq), 0);
    const sum = (kind: ExpenseKind) =>
      expenses.filter(e => e.kind === kind).reduce((s, r) => s + toMonthly(toNum(r.amount), r.freq), 0);

    const needs = sum("need");
    const wants = sum("want");
    const savings = sum("savings_debt");
    const totalExp = needs + wants + savings;
    const leftover = incomeMonthly - totalExp;

    const targetNeeds = incomeMonthly * 0.5;
    const targetWants = incomeMonthly * 0.3;
    const targetSavings = incomeMonthly * 0.2;

    const pct = (v: number) => (incomeMonthly ? (v / incomeMonthly) * 100 : 0);

    return { incomeMonthly, needs, wants, savings, totalExp, leftover, targetNeeds, targetWants, targetSavings, pctNeeds: pct(needs), pctWants: pct(wants), pctSavings: pct(savings) };
  }, [income, expenses]);

  // Actions
  const printPage = () => window.print();
  const resetAll = () => { setIncome(DEFAULT_INCOME); setExpenses(DEFAULT_EXPENSES); };
  const exportCSV = () => {
    const esc = (s: string) => `"${String(s).replace(/"/g, '""')}"`;
    const L: string[] = [];
    L.push("Section,Label,Amount,Frequency,MonthlyEquivalent");
    income.forEach(r => L.push(["Income", esc(r.label), toNum(r.amount).toFixed(2), r.freq, toMonthly(toNum(r.amount), r.freq).toFixed(2)].join(",")));
    expenses.forEach(r => L.push([r.kind === "need" ? "Need" : r.kind === "want" ? "Want" : "Savings/Debt", esc(r.label), toNum(r.amount).toFixed(2), r.freq, toMonthly(toNum(r.amount), r.freq).toFixed(2)].join(",")));
    L.push(""); L.push(`Totals,Income,${metrics.incomeMonthly.toFixed(2)}`);
    L.push(`Totals,Needs,${metrics.needs.toFixed(2)}`); L.push(`Totals,Wants,${metrics.wants.toFixed(2)}`);
    L.push(`Totals,Savings&D,${metrics.savings.toFixed(2)}`); L.push(`Totals,Expenses,${metrics.totalExp.toFixed(2)}`);
    L.push(`Totals,Leftover,${metrics.leftover.toFixed(2)}`); L.push("");
    L.push(`Targets,Needs(50%),${metrics.targetNeeds.toFixed(2)}`);
    L.push(`Targets,Wants(30%),${metrics.targetWants.toFixed(2)}`);
    L.push(`Targets,Savings(20%),${metrics.targetSavings.toFixed(2)}`);
    const blob = new Blob([L.join("\n")], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = `budget_${new Date().toISOString().slice(0,10)}.csv`; a.click(); URL.revokeObjectURL(url);
  };

  // Row helpers
  const uIncome = (id: UUID, patch: Partial<IncomeRow>) => setIncome(prev => prev.map(r => (r.id === id ? { ...r, ...patch } : r)));
  const addIncome = () => setIncome(prev => [...prev, { id: uid(), label: "New income", amount: "0", freq: "monthly" }]);
  const rmIncome = (id: UUID) => setIncome(prev => prev.filter(r => r.id !== id));

  const uExpense = (id: UUID, patch: Partial<ExpenseRow>) => setExpenses(prev => prev.map(r => (r.id === id ? { ...r, ...patch } : r)));
  const addExpense = (kind: ExpenseKind) => setExpenses(prev => [...prev, { id: uid(), label: "New item", amount: "0", freq: "monthly", kind }]);
  const rmExpense = (id: UUID) => setExpenses(prev => prev.filter(r => r.id !== id));

  // Common inputs
  const AmountInput = ({ value, onChange, aria }: { value: string; onChange: (v: string) => void; aria: string }) => (
    <input value={value} onChange={(e) => onChange(e.target.value)} inputMode="decimal"
      className="w-24 md:w-28 text-right bg-transparent outline-none border-b border-transparent focus:border-brand-gold"
      aria-label={aria} />
  );
  const FreqSelect = ({ value, onChange, aria }: { value: FreqKey; onChange: (v: FreqKey) => void; aria: string }) => (
    <select value={value} onChange={(e) => onChange(e.target.value as FreqKey)}
      className="bg-white rounded-md border border-brand-gold/60 px-2 py-1"
      aria-label={aria}>
      {FREQUENCIES.map(f => <option key={f.key} value={f.key}>{f.label}</option>)}
    </select>
  );

  return (
    <ToolShell
      title="Holistic Budget Calculator"
      subtitle="Craft a realistic monthly plan by categorizing spending into Needs, Wants, and Savings & Debt. Add custom rows, choose pay frequencies, and see how you stack up to the 50/30/20 guide."
      lang="en"
    >
      {/* Top actions */}
      <div className="flex flex-wrap gap-2 mb-4 print:hidden">
        <button type="button" onClick={printPage} className="px-4 py-2 rounded-full border-2 border-brand-blue text-brand-blue hover:bg-brand-blue hover:text-white transition">Print / Save as PDF</button>
        <button type="button" onClick={exportCSV} className="px-4 py-2 rounded-full border-2 border-brand-green text-brand-green hover:bg-brand-green hover:text-white transition">Export (CSV)</button>
        <button type="button" onClick={resetAll} className="px-4 py-2 rounded-full border-2 border-brand-gold text-brand-gold hover:bg-brand-gold hover:text-brand-green transition">Reset to defaults</button>
      </div>

      {/* Single column normally; 2xl -> 5-column grid with span (Income 2, Expenses 3) */}
      <form className="grid grid-cols-1 2xl:grid-cols-5 gap-6">
        {/* Income & guidance */}
        <section className="rounded-2xl border border-brand-gold bg-white p-4 md:p-5 grid gap-4 2xl:col-span-2">
          <h3 className="font-serif text-base md:text-lg text-brand-green font-bold">Income (take-home)</h3>

          {/* Mobile stacked */}
          <Stack>
            {income.map(row => {
              const monthly = toMonthly(toNum(row.amount), row.freq);
              return (
                <StackedRow
                  key={row.id}
                  fields={[
                    { label: "Source", node: <input value={row.label} onChange={(e) => uIncome(row.id, { label: e.target.value })} className="w-full bg-transparent outline-none border-b border-transparent focus:border-brand-gold" /> },
                    { label: "Amount", node: <AmountInput value={row.amount} onChange={(v) => uIncome(row.id, { amount: v })} aria="Income amount" /> },
                    { label: "Frequency", node: <FreqSelect value={row.freq} onChange={(v) => uIncome(row.id, { freq: v })} aria="Income frequency" /> },
                    { label: "Monthly", node: <span className="font-semibold">{CAD2.format(monthly)}</span>, right: true },
                  ]}
                  onRemove={() => rmIncome(row.id)}
                />
              );
            })}
            <button type="button" onClick={addIncome} className="underline text-sm text-left">+ Add income</button>
            <div className="flex justify-end text-sm font-semibold">Total: {CAD2.format(metrics.incomeMonthly)}</div>
          </Stack>

          {/* Desktop table */}
          <Table>
            <thead className="bg-brand-beige/40 text-brand-blue">
              <tr>
                <th className="text-left px-3 py-2">Source</th>
                <th className="text-right px-3 py-2">Amount</th>
                <th className="text-left px-3 py-2">Frequency</th>
                <th className="text-right px-3 py-2">Monthly</th>
                <th className="px-3 py-2"></th>
              </tr>
            </thead>
            <tbody>
              {income.map(r => {
                const monthly = toMonthly(toNum(r.amount), r.freq);
                return (
                  <tr key={r.id} className="border-t">
                    <td className="px-3 py-2">
                      <input value={r.label} onChange={(e) => uIncome(r.id, { label: e.target.value })}
                        className="w-full bg-transparent outline-none" aria-label="Income label" />
                    </td>
                    <td className="px-3 py-2 text-right">
                      <AmountInput value={r.amount} onChange={(v) => uIncome(r.id, { amount: v })} aria="Income amount" />
                    </td>
                    <td className="px-3 py-2">
                      <FreqSelect value={r.freq} onChange={(v) => uIncome(r.id, { freq: v })} aria="Income frequency" />
                    </td>
                    <td className="px-3 py-2 text-right">{CAD2.format(monthly)}</td>
                    <td className="px-3 py-2 text-right">
                      <button type="button" onClick={() => rmIncome(r.id)} title="Remove" aria-label="Remove income row" className="inline-flex items-center justify-center p-1.5 rounded-md text-red-600 hover:bg-red-50">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className="bg-brand-beige/20">
                <td className="px-3 py-2" colSpan={3}>
                  <button type="button" onClick={addIncome} className="underline">+ Add income</button>
                </td>
                <td className="px-3 py-2 text-right font-semibold">{CAD2.format(metrics.incomeMonthly)}</td>
                <td className="px-3 py-2"></td>
              </tr>
            </tfoot>
          </Table>

          {/* Summary */}
          <div className="grid sm:grid-cols-2 gap-3 md:gap-4">
            <div className="rounded-xl border border-brand-gold/50 p-3 md:p-4">
              <div className="text-xs md:text-sm text-brand-blue/80">Total monthly income</div>
              <div className="text-xl md:text-2xl font-bold text-brand-green">{CAD0.format(Math.round(metrics.incomeMonthly))}</div>
            </div>
            <div className="rounded-xl border border-brand-gold/50 p-3 md:p-4">
              <div className="text-xs md:text-sm text-brand-blue/80">Leftover / Shortfall</div>
              <div className={`text-xl md:text-2xl font-bold ${metrics.leftover >= 0 ? "text-green-700" : "text-red-700"}`}>
                {CAD0.format(Math.round(metrics.leftover))}
              </div>
            </div>
          </div>

          {/* 50/30/20 */}
          <div className="rounded-xl border border-brand-gold/40 bg-brand-beige/40 p-3 md:p-4">
            <h4 className="font-semibold text-brand-green mb-2 text-sm md:text-base">50 / 30 / 20 reference</h4>
            <div className="grid sm:grid-cols-3 gap-3 md:gap-4">
              <div>
                <div className="flex items-center gap-2"><Tag tone="emerald">Needs</Tag><span className="text-[11px] md:text-sm text-brand-blue/70">≤ 50%</span></div>
                <div className="mt-1 text-base md:text-lg font-semibold">{CAD0.format(Math.round(metrics.targetNeeds))}</div>
                <div className={`text-xs md:text-sm ${metrics.pctNeeds <= 50 ? "text-emerald-700" : "text-red-700"}`}>{metrics.pctNeeds.toFixed(1)}%</div>
              </div>
              <div>
                <div className="flex items-center gap-2"><Tag tone="amber">Wants</Tag><span className="text-[11px] md:text-sm text-brand-blue/70">≤ 30%</span></div>
                <div className="mt-1 text-base md:text-lg font-semibold">{CAD0.format(Math.round(metrics.targetWants))}</div>
                <div className={`text-xs md:text-sm ${metrics.pctWants <= 30 ? "text-emerald-700" : "text-red-700"}`}>{metrics.pctWants.toFixed(1)}%</div>
              </div>
              <div>
                <div className="flex items-center gap-2"><Tag tone="sky">Savings & Debt</Tag><span className="text-[11px] md:text-sm text-brand-blue/70">≥ 20%</span></div>
                <div className="mt-1 text-base md:text-lg font-semibold">{CAD0.format(Math.round(metrics.targetSavings))}</div>
                <div className={`text-xs md:text-sm ${metrics.pctSavings >= 20 ? "text-emerald-700" : "text-red-700"}`}>{metrics.pctSavings.toFixed(1)}%</div>
              </div>
            </div>
          </div>
        </section>

        {/* Expenses (single column except ultra-wide) */}
        <section className="rounded-2xl border border-brand-gold bg-white p-4 md:p-5 grid gap-6 2xl:col-span-3">
          <h3 className="font-serif text-base md:text-lg text-brand-green font-bold">Expenses</h3>

          {/* ----- NEEDS ----- */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Tag tone="emerald">Needs</Tag>
                <span className="text-[11px] md:text-sm text-brand-blue/70">(housing, groceries, transport, insurance, childcare…)</span>
              </div>
              <button type="button" onClick={() => addExpense("need")} className="underline text-xs md:text-sm">+ Add need</button>
            </div>

            {/* Mobile stacked */}
            <Stack>
              {expenses.filter(e => e.kind === "need").map(r => {
                const monthly = toMonthly(toNum(r.amount), r.freq);
                return (
                  <StackedRow
                    key={r.id}
                    fields={[
                      { label: "Item", node: <input value={r.label} onChange={(e) => uExpense(r.id, { label: e.target.value })} className="w-full bg-transparent outline-none border-b border-transparent focus:border-brand-gold" /> },
                      { label: "Amount", node: <AmountInput value={r.amount} onChange={(v) => uExpense(r.id, { amount: v })} aria="Need amount" /> },
                      { label: "Frequency", node: <FreqSelect value={r.freq} onChange={(v) => uExpense(r.id, { freq: v })} aria="Need frequency" /> },
                      { label: "Monthly", node: <span className="font-semibold">{CAD2.format(monthly)}</span>, right: true },
                    ]}
                    onRemove={() => rmExpense(r.id)}
                  />
                );
              })}
              <div className="flex justify-end text-sm font-semibold">Total: {CAD2.format(metrics.needs)}</div>
            </Stack>

            {/* Desktop table */}
            <Table>
              <thead className="bg-brand-beige/40 text-brand-blue">
                <tr>
                  <th className="text-left px-3 py-2">Item</th>
                  <th className="text-right px-3 py-2">Amount</th>
                  <th className="text-left px-3 py-2">Frequency</th>
                  <th className="text-right px-3 py-2">Monthly</th>
                  <th className="px-3 py-2"></th>
                </tr>
              </thead>
              <tbody>
                {expenses.filter(e => e.kind === "need").map(r => {
                  const monthly = toMonthly(toNum(r.amount), r.freq);
                  return (
                    <tr key={r.id} className="border-t">
                      <td className="px-3 py-2"><input value={r.label} onChange={(e) => uExpense(r.id, { label: e.target.value })} className="w-full bg-transparent outline-none" /></td>
                      <td className="px-3 py-2 text-right"><AmountInput value={r.amount} onChange={(v) => uExpense(r.id, { amount: v })} aria="Need amount" /></td>
                      <td className="px-3 py-2"><FreqSelect value={r.freq} onChange={(v) => uExpense(r.id, { freq: v })} aria="Need frequency" /></td>
                      <td className="px-3 py-2 text-right">{CAD2.format(monthly)}</td>
                      <td className="px-3 py-2 text-right">
                        <button type="button" onClick={() => rmExpense(r.id)} title="Remove" aria-label="Remove need row" className="inline-flex items-center justify-center p-1.5 rounded-md text-red-600 hover:bg-red-50">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr className="bg-brand-beige/20">
                  <td className="px-3 py-2" colSpan={3}>Total Needs</td>
                  <td className="px-3 py-2 text-right font-semibold">{CAD2.format(metrics.needs)}</td>
                  <td className="px-3 py-2"></td>
                </tr>
              </tfoot>
            </Table>
          </div>

          {/* ----- WANTS ----- */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Tag tone="amber">Wants</Tag>
                <span className="text-[11px] md:text-sm text-brand-blue/70">(dining out, entertainment, shopping, travel…)</span>
              </div>
              <button type="button" onClick={() => addExpense("want")} className="underline text-xs md:text-sm">+ Add want</button>
            </div>

            <Stack>
              {expenses.filter(e => e.kind === "want").map(r => {
                const monthly = toMonthly(toNum(r.amount), r.freq);
                return (
                  <StackedRow
                    key={r.id}
                    fields={[
                      { label: "Item", node: <input value={r.label} onChange={(e) => uExpense(r.id, { label: e.target.value })} className="w-full bg-transparent outline-none border-b border-transparent focus:border-brand-gold" /> },
                      { label: "Amount", node: <AmountInput value={r.amount} onChange={(v) => uExpense(r.id, { amount: v })} aria="Want amount" /> },
                      { label: "Frequency", node: <FreqSelect value={r.freq} onChange={(v) => uExpense(r.id, { freq: v })} aria="Want frequency" /> },
                      { label: "Monthly", node: <span className="font-semibold">{CAD2.format(monthly)}</span>, right: true },
                    ]}
                    onRemove={() => rmExpense(r.id)}
                  />
                );
              })}
              <div className="flex justify-end text-sm font-semibold">Total: {CAD2.format(metrics.wants)}</div>
            </Stack>

            <Table>
              <thead className="bg-brand-beige/40 text-brand-blue">
                <tr>
                  <th className="text-left px-3 py-2">Item</th>
                  <th className="text-right px-3 py-2">Amount</th>
                  <th className="text-left px-3 py-2">Frequency</th>
                  <th className="text-right px-3 py-2">Monthly</th>
                  <th className="px-3 py-2"></th>
                </tr>
              </thead>
              <tbody>
                {expenses.filter(e => e.kind === "want").map(r => {
                  const monthly = toMonthly(toNum(r.amount), r.freq);
                  return (
                    <tr key={r.id} className="border-t">
                      <td className="px-3 py-2"><input value={r.label} onChange={(e) => uExpense(r.id, { label: e.target.value })} className="w-full bg-transparent outline-none" /></td>
                      <td className="px-3 py-2 text-right"><AmountInput value={r.amount} onChange={(v) => uExpense(r.id, { amount: v })} aria="Want amount" /></td>
                      <td className="px-3 py-2"><FreqSelect value={r.freq} onChange={(v) => uExpense(r.id, { freq: v })} aria="Want frequency" /></td>
                      <td className="px-3 py-2 text-right">{CAD2.format(monthly)}</td>
                      <td className="px-3 py-2 text-right">
                        <button type="button" onClick={() => rmExpense(r.id)} title="Remove" aria-label="Remove want row" className="inline-flex items-center justify-center p-1.5 rounded-md text-red-600 hover:bg-red-50">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr className="bg-brand-beige/20">
                  <td className="px-3 py-2" colSpan={3}>Total Wants</td>
                  <td className="px-3 py-2 text-right font-semibold">{CAD2.format(metrics.wants)}</td>
                  <td className="px-3 py-2"></td>
                </tr>
              </tfoot>
            </Table>
          </div>

          {/* ----- SAVINGS & DEBT ----- */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Tag tone="sky">Savings & Debt</Tag>
                <span className="text-[11px] md:text-sm text-brand-blue/70">(emergency, TFSA/RRSP, debt repayments…)</span>
              </div>
              <button type="button" onClick={() => addExpense("savings_debt")} className="underline text-xs md:text-sm">+ Add item</button>
            </div>

            <Stack>
              {expenses.filter(e => e.kind === "savings_debt").map(r => {
                const monthly = toMonthly(toNum(r.amount), r.freq);
                return (
                  <StackedRow
                    key={r.id}
                    fields={[
                      { label: "Item", node: <input value={r.label} onChange={(e) => uExpense(r.id, { label: e.target.value })} className="w-full bg-transparent outline-none border-b border-transparent focus:border-brand-gold" /> },
                      { label: "Amount", node: <AmountInput value={r.amount} onChange={(v) => uExpense(r.id, { amount: v })} aria="Savings/debt amount" /> },
                      { label: "Frequency", node: <FreqSelect value={r.freq} onChange={(v) => uExpense(r.id, { freq: v })} aria="Savings/debt frequency" /> },
                      { label: "Monthly", node: <span className="font-semibold">{CAD2.format(monthly)}</span>, right: true },
                    ]}
                    onRemove={() => rmExpense(r.id)}
                  />
                );
              })}
              <div className="flex justify-end text-sm font-semibold">Total: {CAD2.format(metrics.savings)}</div>
            </Stack>

            <Table>
              <thead className="bg-brand-beige/40 text-brand-blue">
                <tr>
                  <th className="text-left px-3 py-2">Item</th>
                  <th className="text-right px-3 py-2">Amount</th>
                  <th className="text-left px-3 py-2">Frequency</th>
                  <th className="text-right px-3 py-2">Monthly</th>
                  <th className="px-3 py-2"></th>
                </tr>
              </thead>
              <tbody>
                {expenses.filter(e => e.kind === "savings_debt").map(r => {
                  const monthly = toMonthly(toNum(r.amount), r.freq);
                  return (
                    <tr key={r.id} className="border-t">
                      <td className="px-3 py-2"><input value={r.label} onChange={(e) => uExpense(r.id, { label: e.target.value })} className="w-full bg-transparent outline-none" /></td>
                      <td className="px-3 py-2 text-right"><AmountInput value={r.amount} onChange={(v) => uExpense(r.id, { amount: v })} aria="Savings/debt amount" /></td>
                      <td className="px-3 py-2"><FreqSelect value={r.freq} onChange={(v) => uExpense(r.id, { freq: v })} aria="Savings/debt frequency" /></td>
                      <td className="px-3 py-2 text-right">{CAD2.format(monthly)}</td>
                      <td className="px-3 py-2 text-right">
                        <button type="button" onClick={() => rmExpense(r.id)} title="Remove" aria-label="Remove savings/debt row" className="inline-flex items-center justify-center p-1.5 rounded-md text-red-600 hover:bg-red-50">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr className="bg-brand-beige/20">
                  <td className="px-3 py-2" colSpan={3}>Total Savings & Debt</td>
                  <td className="px-3 py-2 text-right font-semibold">{CAD2.format(metrics.savings)}</td>
                  <td className="px-3 py-2"></td>
                </tr>
              </tfoot>
            </Table>
          </div>

          {/* Totals */}
          <div className="grid sm:grid-cols-3 gap-3 md:gap-4">
            <div className="rounded-xl border border-brand-gold/50 p-3 md:p-4">
              <div className="text-xs md:text-sm text-brand-blue/80">Total monthly expenses</div>
              <div className="text-xl md:text-2xl font-bold text-brand-green">{CAD0.format(Math.round(metrics.totalExp))}</div>
            </div>
            <div className="rounded-xl border border-brand-gold/50 p-3 md:p-4">
              <div className="text-xs md:text-sm text-brand-blue/80">Leftover / Shortfall</div>
              <div className={`text-xl md:text-2xl font-bold ${metrics.leftover >= 0 ? "text-green-700" : "text-red-700"}`}>
                {CAD0.format(Math.round(metrics.leftover))}
              </div>
            </div>
            <div className="rounded-xl border border-brand-gold/50 p-3 md:p-4">
              <div className="text-xs md:text-sm text-brand-blue/80">% Needs / Wants / Sav.&Debt</div>
              <div className="text-xl md:text-2xl font-bold text-brand-green">
                {metrics.pctNeeds.toFixed(0)}% / {metrics.pctWants.toFixed(0)}% / {metrics.pctSavings.toFixed(0)}%
              </div>
            </div>
          </div>
        </section>
      </form>

      {/* Similar tools */}
      <div className="mt-6 rounded-2xl border border-brand-gold bg-white p-4 md:p-5">
        <h4 className="font-serif text-base md:text-lg text-brand-green font-bold mb-2">Similar tools</h4>
        <ul className="list-disc ml-5 text-sm space-y-1">
          <li><Link href="/en/tools/net-worth" className="underline">Net Worth Tracker</Link></li>
          <li><Link href="/en/tools/debt-snowball" className="underline">Debt Snowball / Payoff Planner</Link></li>
          <li><Link href="/en/tools/mortgage-calculator" className="underline">Mortgage Payment Calculator</Link></li>
          <li><Link href="/en/tools/affordability-stress-test" className="underline">Affordability &amp; Stress Test</Link></li>
        </ul>
      </div>

      {/* Print helpers */}
      <style jsx global>{`
        @media print {
          .print\\:hidden { display: none !important; }
          main { background: white !important; }
          header, section { break-inside: avoid; page-break-inside: avoid; }
        }
      `}</style>

      {/* Disclaimer */}
      <p className="mt-6 text-xs text-brand-blue/70">
        Educational tool only. Income is treated as take-home. The 50/30/20 rule is a guideline—adapt to your goals and local costs.
      </p>
    </ToolShell>
  );
}
