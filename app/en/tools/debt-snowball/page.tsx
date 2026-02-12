"use client";

import { useMemo, useState } from "react";
import ToolShell from "@/components/ToolShell";
import { FaPrint, FaFileCsv, FaPlus, FaTrash } from "react-icons/fa";

/* =========================================================
   Types
   ========================================================= */
type Method = "snowball" | "avalanche";

type Debt = {
  id: number;
  name: string;
  balance: number;   // current principal
  apr: number;       // % annual interest
  min: number;       // required minimum monthly payment
};

type SimRow = {
  month: number;
  dateLabel: string | null;
  totalPayment: number;
  totalInterest: number;
  totalPrincipal: number;
  remainingBalance: number;
  focus: string | null;           // primary target this month
  debtsRemaining: number;
};

type PayoffInfo = {
  id: number;
  name: string;
  payoffMonth: number | null;     // month index when paid
  payoffDate: string | null;      // label if start date provided
  interestPaid: number;
  totalPaid: number;
};

/* =========================================================
   Helpers
   ========================================================= */
const DATE_FMT: Intl.DateTimeFormatOptions = { year: "numeric", month: "short" };

function money(n: number, digits = 0) {
  return (Number.isFinite(n) ? n : 0).toLocaleString("en-CA", {
    style: "currency",
    currency: "CAD",
    maximumFractionDigits: digits,
  });
}
function round2(n: number) { return Math.round(n * 100) / 100; }

function toCSV(rows: Array<Array<string | number>>) {
  const esc = (v: string | number) => {
    const s = String(v ?? "");
    const needs = /[",\n]/.test(s);
    const q = s.replace(/"/g, '""');
    return needs ? `"${q}"` : q;
  };
  return rows.map(r => r.map(esc).join(",")).join("\r\n");
}
function downloadCSV(base: string, rows: Array<Array<string | number>>) {
  const iso = new Date().toISOString().slice(0, 10);
  const blob = new Blob(["\uFEFF" + toCSV(rows)], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${base}_${iso}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

function parseDateInput(s: string | undefined): Date | null {
  if (!s) return null;
  const [y, m, d] = s.split("-").map(Number);
  if (!y || !m || !d) return null;
  return new Date(y, m - 1, d);
}

/* =========================================================
   Core simulation
   ========================================================= */
function simulate(
  debtsInput: Debt[],
  extraMonthly: number,
  method: Method,
  startDateStr?: string,
  maxMonths = 1200 // hard cap for safety
) {
  const startDate = parseDateInput(startDateStr);
  const curDate = startDate ? new Date(startDate.getFullYear(), startDate.getMonth(), 1) : null;

  // Working copies
  const debts = debtsInput.map(d => ({ ...d }));

  // Per-debt tallies
  const interestPaid: Record<number, number> = {};
  const totalPaid: Record<number, number> = {};
  const payoffMonth: Record<number, number | null> = {};
  debts.forEach(d => { interestPaid[d.id] = 0; totalPaid[d.id] = 0; payoffMonth[d.id] = null; });

  const rows: SimRow[] = [];

  let month = 0;
  let guard = 0;

  function aliveCount() { return debts.filter(d => d.balance > 0.005).length; }
  function totalBalance() { return round2(debts.reduce((s, d) => s + Math.max(0, d.balance), 0)); }

  while (aliveCount() > 0 && guard < maxMonths) {
    guard++; month++;

    // 1) Accrue interest
    let monthInterest = 0;
    for (const d of debts) {
      if (d.balance <= 0.005) continue;
      const i = round2(d.balance * (Math.max(0, d.apr) / 100) / 12);
      d.balance = round2(d.balance + i);
      monthInterest = round2(monthInterest + i);
      interestPaid[d.id] = round2(interestPaid[d.id] + i);
    }

    // 2) Build payment pool = sum(min) of active debts + extra
    let pool = round2(debts.filter(d => d.balance > 0.005).reduce((s, d) => s + Math.max(0, d.min), 0) + Math.max(0, extraMonthly));

    // Insufficient pool safety: if pool is zero while balances exist, stop
    if (pool <= 0) {
      // Record a final row and break (can't pay these down)
      rows.push({
        month,
        dateLabel: curDate ? curDate.toLocaleDateString("en-CA", DATE_FMT) : null,
        totalPayment: 0,
        totalInterest: 0, // monthInterest was just accrued; with zero pool, payment is 0
        totalPrincipal: 0,
        remainingBalance: totalBalance(),
        focus: null,
        debtsRemaining: aliveCount(),
      });
      break;
    }

    // 3) Determine targeting order
    const active = debts.filter(d => d.balance > 0.005);
    let order: Debt[];
    if (method === "snowball") {
      order = active.sort((a, b) => a.balance - b.balance || a.apr - b.apr);
    } else {
      order = active.sort((a, b) => b.apr - a.apr || a.balance - b.balance);
    }
    const focusName = order.length ? order[0].name : null;

    // 4) Allocate entire pool across debts in order
    let monthPrincipal = 0;
    for (const d of order) {
      if (pool <= 0) break;
      const pay = Math.min(pool, d.balance);
      if (pay <= 0) continue;
      d.balance = round2(d.balance - pay);
      pool = round2(pool - pay);
      monthPrincipal = round2(monthPrincipal + pay);
      totalPaid[d.id] = round2(totalPaid[d.id] + pay);

      if (d.balance <= 0.005 && payoffMonth[d.id] === null) {
        payoffMonth[d.id] = month;
        d.balance = 0;
      }
    }

    // 5) Record row
    const dateLabel = curDate ? curDate.toLocaleDateString("en-CA", DATE_FMT) : null;
    if (curDate) curDate.setMonth(curDate.getMonth() + 1);

    rows.push({
      month,
      dateLabel,
      totalPayment: round2(monthInterest + monthPrincipal),
      totalInterest: monthInterest,
      totalPrincipal: monthPrincipal,
      remainingBalance: totalBalance(),
      focus: focusName,
      debtsRemaining: aliveCount(),
    });

    if (aliveCount() === 0) break;
  }

  // Build payoff order info
  const payoffInfo: PayoffInfo[] = debts.map(d => {
    const m = payoffMonth[d.id];
    let label: string | null = null;
    if (m && startDate) {
      const dt = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
      dt.setMonth(dt.getMonth() + (m - 1));
      label = dt.toLocaleDateString("en-CA", DATE_FMT);
    }
    return {
      id: d.id,
      name: d.name,
      payoffMonth: m,
      payoffDate: label,
      interestPaid: round2(interestPaid[d.id]),
      totalPaid: round2(totalPaid[d.id] + interestPaid[d.id]),
    };
  }).sort((a, b) => {
    if (a.payoffMonth === null && b.payoffMonth === null) return 0;
    if (a.payoffMonth === null) return 1;
    if (b.payoffMonth === null) return -1;
    return a.payoffMonth - b.payoffMonth;
  });

  const monthsToFreedom = Math.max(0, ...payoffInfo.map(p => p.payoffMonth || 0));
  const totalInterestAll = round2(payoffInfo.reduce((s, p) => s + p.interestPaid, 0));
  const totalPaidAll = round2(payoffInfo.reduce((s, p) => s + p.totalPaid, 0));

  return {
    rows,
    payoffInfo,
    monthsToFreedom,
    yearsToFreedom: monthsToFreedom / 12,
    totalInterestAll,
    totalPaidAll,
    reachedZero: payoffInfo.every(p => (p.payoffMonth ?? 0) > 0),
  };
}

/* =========================================================
   Page
   ========================================================= */
export default function Page() {
  const [debts, setDebts] = useState<Debt[]>([
    { id: 1, name: "Credit Card A", balance: 5500, apr: 19.99, min: 110 },
    { id: 2, name: "Car Loan", balance: 18_200, apr: 6.49, min: 340 },
    { id: 3, name: "Student Loan", balance: 12_300, apr: 4.20, min: 150 },
  ]);
  const [extra, setExtra] = useState<number>(300);
  const [method, setMethod] = useState<Method>("snowball");
  const [startDate, setStartDate] = useState<string>(""); // optional YYYY-MM-DD

  const printDate = new Date().toLocaleDateString("en-CA", { year: "numeric", month: "long", day: "numeric" });

  const sim = useMemo(() => simulate(debts, extra, method, startDate), [debts, extra, method, startDate]);

  function addDebt() {
    setDebts(prev => [...prev, {
      id: (prev.at(-1)?.id ?? 0) + 1,
      name: `Debt ${prev.length + 1}`,
      balance: 0,
      apr: 0,
      min: 0,
    }]);
  }
  function updateDebt(id: number, patch: Partial<Debt>) {
    setDebts(prev => prev.map(d => d.id === id ? { ...d, ...patch } : d));
  }
  function removeDebt(id: number) {
    setDebts(prev => prev.filter(d => d.id !== id));
  }
  function resetExample() {
    setDebts([
      { id: 1, name: "Credit Card A", balance: 5500, apr: 19.99, min: 110 },
      { id: 2, name: "Car Loan", balance: 18_200, apr: 6.49, min: 340 },
      { id: 3, name: "Student Loan", balance: 12_300, apr: 4.20, min: 150 },
    ]);
    setExtra(300);
    setMethod("snowball");
    setStartDate("");
  }

  function handlePrint() { window.print(); }

  function exportSummaryCSV() {
    const rows: Array<Array<string | number>> = [
      ["Prepared", printDate],
      ["Method", method === "snowball" ? "Snowball (smallest balance first)" : "Avalanche (highest APR first)"],
      ["Monthly Extra", extra.toFixed(2)],
      ["Start Date", startDate || "—"],
      ["—", "—"],
      ["Debts"],
      ...debts.map(d => [d.name, `Balance ${d.balance.toFixed(2)}`, `APR ${d.apr.toFixed(2)}%`, `Min ${d.min.toFixed(2)}`]),
      ["—", "—"],
      ["RESULTS"],
      ["Months to Debt-Free", sim.monthsToFreedom],
      ["Years to Debt-Free", sim.yearsToFreedom.toFixed(2)],
      ["Total Interest (all debts)", sim.totalInterestAll.toFixed(2)],
      ["Total Paid (principal + interest)", sim.totalPaidAll.toFixed(2)],
      ["—", "—"],
      ["Payoff Order"],
      ...sim.payoffInfo.map(p => [
        p.name,
        p.payoffMonth === null ? "Not paid" : `Month ${p.payoffMonth}`,
        p.payoffDate ?? "",
        `Interest ${p.interestPaid.toFixed(2)}`,
        `Total Paid ${p.totalPaid.toFixed(2)}`
      ]),
    ];
    downloadCSV("debt_paydown_summary", rows);
  }

  function exportScheduleCSV() {
    const rows: Array<Array<string | number>> = [
      ["Month #", "Date", "Total Payment", "Interest", "Principal", "Remaining Balance", "Focus Debt", "Debts Remaining"],
    ];
    for (const r of sim.rows) {
      rows.push([
        r.month,
        r.dateLabel ?? "",
        r.totalPayment.toFixed(2),
        r.totalInterest.toFixed(2),
        r.totalPrincipal.toFixed(2),
        r.remainingBalance.toFixed(2),
        r.focus ?? "",
        r.debtsRemaining,
      ]);
    }
    downloadCSV("debt_paydown_schedule", rows);
  }

  /* ----------------------------
     UI
     ---------------------------- */
  return (
    <ToolShell
      title="Debt Paydown Optimizer (Snowball & Avalanche)"
      subtitle="Plan your path to debt-free: compare Snowball vs. Avalanche, see payoff timing and total interest, and export your plan."
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
          title="Export summary"
        >
          <FaFileCsv aria-hidden /> Export Summary CSV
        </button>
        <button
          type="button"
          onClick={exportScheduleCSV}
          className="px-4 py-2 bg-white border-2 border-brand-blue text-brand-blue rounded-full inline-flex items-center gap-2 hover:bg-brand-blue hover:text-white transition"
          title="Export month-by-month schedule"
        >
          <FaFileCsv aria-hidden /> Export Schedule CSV
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
        {/* Debts list */}
        <section className="rounded-2xl border border-brand-gold bg-white p-5">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-serif text-lg text-brand-green font-bold">Your Debts</h3>
            <button
              type="button"
              onClick={addDebt}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border-2 border-brand-green text-brand-green hover:bg-brand-green hover:text-white transition"
            >
              <FaPlus aria-hidden /> Add Debt
            </button>
          </div>

          {debts.length === 0 ? (
            <p className="text-sm text-brand-blue/70">No debts yet. Add your first debt to begin.</p>
          ) : (
            <div className="space-y-3">
              {debts.map(d => (
                <div key={d.id} className="grid grid-cols-12 items-end gap-3">
                  <div className="col-span-5">
                    <label className="block text-sm font-medium text-brand-blue mb-1">Name</label>
                    <input
                      type="text"
                      className="w-full rounded-xl border border-brand-gold/60 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-gold"
                      value={d.name}
                      onChange={(e)=>updateDebt(d.id, { name: e.target.value })}
                    />
                  </div>
                  <div className="col-span-3">
                    <label className="block text-sm font-medium text-brand-blue mb-1">Balance</label>
                    <input
                      type="number" min={0} inputMode="decimal"
                      className="w-full rounded-xl border border-brand-gold/60 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-gold"
                      value={d.balance}
                      onChange={(e)=>updateDebt(d.id, { balance: Number(e.target.value || 0) })}
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-brand-blue mb-1">APR %</label>
                    <input
                      type="number" min={0} max={99} step={0.01} inputMode="decimal"
                      className="w-full rounded-xl border border-brand-gold/60 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-gold"
                      value={d.apr}
                      onChange={(e)=>updateDebt(d.id, { apr: Number(e.target.value || 0) })}
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-brand-blue mb-1">Min / mo</label>
                    <input
                      type="number" min={0} inputMode="decimal"
                      className="w-full rounded-xl border border-brand-gold/60 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-gold"
                      value={d.min}
                      onChange={(e)=>updateDebt(d.id, { min: Number(e.target.value || 0) })}
                    />
                  </div>
                  <div className="col-span-0 sm:col-span-0 md:col-span-0 lg:col-span-0 xl:col-span-0 2xl:col-span-0"></div>
                  <div className="col-span-12 md:col-span-0 flex md:block justify-end">
                    <button
                      type="button"
                      onClick={()=>removeDebt(d.id)}
                      className="text-brand-blue/70 hover:text-brand-blue"
                      aria-label={`Remove ${d.name}`}
                    >
                      <FaTrash aria-hidden />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Strategy & timing */}
        <section className="rounded-2xl border border-brand-gold bg-white p-5 grid gap-3">
          <h3 className="font-serif text-lg text-brand-green font-bold">Strategy</h3>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-brand-blue mb-1">Method</label>
              <div className="flex gap-4">
                <label className="inline-flex items-center gap-2">
                  <input type="radio" name="m" checked={method==="snowball"} onChange={()=>setMethod("snowball")} />
                  <span>Snowball</span>
                </label>
                <label className="inline-flex items-center gap-2">
                  <input type="radio" name="m" checked={method==="avalanche"} onChange={()=>setMethod("avalanche")} />
                  <span>Avalanche</span>
                </label>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-brand-blue mb-1">Monthly Extra</label>
              <input
                type="number" min={0} inputMode="decimal"
                className="w-full rounded-xl border border-brand-gold/60 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-gold"
                value={extra}
                onChange={(e)=>setExtra(Number(e.target.value || 0))}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-brand-blue mb-1">Start Date (optional)</label>
            <input
              type="date"
              className="w-full rounded-xl border border-brand-gold/60 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-gold"
              value={startDate}
              onChange={(e)=>setStartDate(e.target.value)}
            />
            <p className="text-xs text-brand-blue/70 mt-1">Used to estimate month/year of each payoff and label the schedule.</p>
          </div>
        </section>

        {/* Results */}
        <section className="rounded-2xl border border-brand-gold bg-white p-5 avoid-break">
          <h3 className="font-serif text-xl text-brand-green font-bold mb-2">Results</h3>

          <div className="text-sm space-y-2">
            <div className="flex justify-between">
              <span>Months to debt-free</span>
              <span className="font-medium">{sim.reachedZero ? sim.monthsToFreedom : "—"}</span>
            </div>
            <div className="flex justify-between">
              <span>Years to debt-free</span>
              <span className="font-medium">{sim.reachedZero ? sim.yearsToFreedom.toFixed(2) : "—"}</span>
            </div>
            <div className="flex justify-between">
              <span>Total interest (all debts)</span>
              <span className="font-medium">{money(sim.totalInterestAll, 0)}</span>
            </div>
            <div className="flex justify-between border-t pt-2 mt-2">
              <span className="font-semibold">Total paid (principal + interest)</span>
              <span className="font-semibold">{money(sim.totalPaidAll, 0)}</span>
            </div>
          </div>

          <div className="mt-4 rounded-xl border border-brand-gold/40 bg-brand-beige/40 p-4">
            <h4 className="font-semibold text-brand-green mb-2">Payoff order</h4>
            {sim.payoffInfo.length === 0 ? (
              <p className="text-sm text-brand-blue/70">Add debts to see the plan.</p>
            ) : (
              <ol className="list-decimal ml-5 space-y-1 text-sm text-brand-blue/80">
                {sim.payoffInfo.map((p) => (
                  <li key={p.id} className="flex justify-between">
                    <span>{p.name}</span>
                    <span>
                      {p.payoffMonth ? `Month ${p.payoffMonth}${p.payoffDate ? ` • ${p.payoffDate}` : ""}` : "—"}
                    </span>
                  </li>
                ))}
              </ol>
            )}
          </div>

          {!sim.reachedZero && (
            <p className="text-xs text-red-600 mt-2">
              Your total monthly budget (minimums + extra) is not enough to eliminate these balances. Increase the extra amount or adjust inputs.
            </p>
          )}
        </section>
      </form>

      {/* Schedule preview */}
      <div className="mt-8 rounded-2xl border border-brand-gold bg-white p-5">
        <h3 className="font-serif text-lg text-brand-green font-bold mb-2">Schedule (first 24 months preview)</h3>
        <div className="overflow-auto rounded-xl border border-brand-gold/40">
          <table className="w-full text-sm">
            <thead className="bg-brand-beige/40 text-brand-blue">
              <tr>
                <th className="text-left px-3 py-2">#</th>
                <th className="text-left px-3 py-2">Date</th>
                <th className="text-right px-3 py-2">Total Payment</th>
                <th className="text-right px-3 py-2">Interest</th>
                <th className="text-right px-3 py-2">Principal</th>
                <th className="text-right px-3 py-2">Remaining Balance</th>
                <th className="text-left px-3 py-2">Focus</th>
                <th className="text-right px-3 py-2">Debts Left</th>
              </tr>
            </thead>
            <tbody>
              {sim.rows.slice(0, 24).map((r) => (
                <tr key={r.month} className="border-t">
                  <td className="px-3 py-2">{r.month}</td>
                  <td className="px-3 py-2">{r.dateLabel ?? `Month ${r.month}`}</td>
                  <td className="px-3 py-2 text-right">{money(r.totalPayment, 2)}</td>
                  <td className="px-3 py-2 text-right">{money(r.totalInterest, 2)}</td>
                  <td className="px-3 py-2 text-right">{money(r.totalPrincipal, 2)}</td>
                  <td className="px-3 py-2 text-right">{money(r.remainingBalance, 2)}</td>
                  <td className="px-3 py-2">{r.focus ?? "—"}</td>
                  <td className="px-3 py-2 text-right">{r.debtsRemaining}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <details className="mt-4">
          <summary className="cursor-pointer text-sm text-brand-blue underline">Show full schedule</summary>
          <div className="mt-3 overflow-auto rounded-xl border border-brand-gold/40">
            <table className="w-full text-sm">
              <thead className="bg-brand-beige/40 text-brand-blue">
                <tr>
                  <th className="text-left px-3 py-2">#</th>
                  <th className="text-left px-3 py-2">Date</th>
                  <th className="text-right px-3 py-2">Total Payment</th>
                  <th className="text-right px-3 py-2">Interest</th>
                  <th className="text-right px-3 py-2">Principal</th>
                  <th className="text-right px-3 py-2">Remaining Balance</th>
                  <th className="text-left px-3 py-2">Focus</th>
                  <th className="text-right px-3 py-2">Debts Left</th>
                </tr>
              </thead>
              <tbody>
                {sim.rows.map((r) => (
                  <tr key={r.month} className="border-t">
                    <td className="px-3 py-2">{r.month}</td>
                    <td className="px-3 py-2">{r.dateLabel ?? `Month ${r.month}`}</td>
                    <td className="px-3 py-2 text-right">{money(r.totalPayment, 2)}</td>
                    <td className="px-3 py-2 text-right">{money(r.totalInterest, 2)}</td>
                    <td className="px-3 py-2 text-right">{money(r.totalPrincipal, 2)}</td>
                    <td className="px-3 py-2 text-right">{money(r.remainingBalance, 2)}</td>
                    <td className="px-3 py-2">{r.focus ?? "—"}</td>
                    <td className="px-3 py-2 text-right">{r.debtsRemaining}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </details>

        {/* Exports */}
        <div className="flex flex-wrap gap-2 items-center justify-end mt-4 print:hidden">
          <button
            type="button"
            onClick={exportSummaryCSV}
            className="px-4 py-2 bg-white border-2 border-brand-blue text-brand-blue rounded-full inline-flex items-center gap-2 hover:bg-brand-blue hover:text-white transition"
            title="Export summary"
          >
            <FaFileCsv aria-hidden /> Export Summary CSV
          </button>
          <button
            type="button"
            onClick={exportScheduleCSV}
            className="px-4 py-2 bg-white border-2 border-brand-blue text-brand-blue rounded-full inline-flex items-center gap-2 hover:bg-brand-blue hover:text-white transition"
            title="Export month-by-month schedule"
          >
            <FaFileCsv aria-hidden /> Export Schedule CSV
          </button>
        </div>
      </div>

      {/* Print header */}
      <div className="hidden print:block mt-6 mb-3 text-center">
        <div className="font-serif font-bold text-brand-green text-2xl">Debt Paydown — Plan Summary</div>
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
