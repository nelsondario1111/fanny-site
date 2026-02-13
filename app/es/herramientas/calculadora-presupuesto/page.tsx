"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import ToolShell from "@/components/ToolShell";
import { Trash2 } from "lucide-react";
import { downloadCsv, downloadXlsx } from "@/lib/spreadsheet";

/**
 * Holistic Budget Calculator
 * - Single column by default; side-by-side only on ultra-wide (≥1536px, Tailwind 2xl)
 * - Mobile: stacked cards; Desktop: tables
 * - 50/30/20 guidance, leftover/shortfall, CSV export, localStorage
 */

/* ---------- Formatting / utils ---------- */
const CAD0 = new Intl.NumberFormat("es-CA", { style: "currency", currency: "CAD", maximumFractionDigits: 0 });
const CAD2 = new Intl.NumberFormat("es-CA", { style: "currency", currency: "CAD", minimumFractionDigits: 2 });

const toNum = (v: string) => {
  const n = Number(String(v).replace(/[^\d.-]/g, ""));
  return Number.isFinite(n) ? n : 0;
};

type FreqKey = "monthly" | "semi_monthly" | "biweekly" | "weekly" | "annual";
const FREQUENCIES: { key: FreqKey; label: string; perYear: number }[] = [
  { key: "monthly", label: "Mensual (12/yr)", perYear: 12 },
  { key: "semi_monthly", label: "Semi-Mensual (24/yr)", perYear: 24 },
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
  // Necesidades
  { id: uid(), label: "Rent / Mortgage", amount: "2500", freq: "monthly", kind: "need" },
  { id: uid(), label: "Utilities (hydro, water, gas)", amount: "250", freq: "monthly", kind: "need" },
  { id: uid(), label: "Groceries", amount: "800", freq: "monthly", kind: "need" },
  { id: uid(), label: "Transportation (fuel/transit)", amount: "300", freq: "monthly", kind: "need" },
  { id: uid(), label: "Insurance (auto/home/health)", amount: "200", freq: "monthly", kind: "need" },
  { id: uid(), label: "Phone / Internet", amount: "120", freq: "monthly", kind: "need" },
  { id: uid(), label: "Childcare", amount: "0", freq: "monthly", kind: "need" },
  // Deseos
  { id: uid(), label: "Dining out", amount: "200", freq: "monthly", kind: "want" },
  { id: uid(), label: "Entertainment", amount: "100", freq: "monthly", kind: "want" },
  { id: uid(), label: "Subscriptions (Netflix, etc.)", amount: "40", freq: "monthly", kind: "want" },
  { id: uid(), label: "Shopping / Personal", amount: "150", freq: "monthly", kind: "want" },
  { id: uid(), label: "Travel & Vacations", amount: "150", freq: "monthly", kind: "want" },
  // Ahorro y deuda
  { id: uid(), label: "Emergency fund", amount: "300", freq: "monthly", kind: "savings_debt" },
  { id: uid(), label: "Investments (TFSA/RRSP)", amount: "300", freq: "monthly", kind: "savings_debt" },
  { id: uid(), label: "Debt payments (cards/loans)", amount: "200", freq: "monthly", kind: "savings_debt" },
];

const LS_KEY = "tools.calculadora_presupuesto_holistica.v1";

/* ---------- UI helpers ---------- */
const Tag = ({ children, tone = "emerald" }: { children: React.ReactNode; tone?: "emerald" | "amber" | "sky" }) => {
  const color = { emerald: "border-emerald-600 text-emerald-700", amber: "border-amber-600 text-amber-700", sky: "border-sky-600 text-sky-700" }[tone];
  return <span className={`px-2 py-0.5 rounded-full text-[10px] md:text-xs border ${color}`}>{children}</span>;
};

// Desktop table shell (md+)
const Table = ({ children }: { children: React.ReactNode }) => (
  <div className="budget-print-table hidden md:block rounded-xl border border-brand-gold/40 overflow-x-auto">
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
          title="Eliminar"
          aria-label="Eliminar fila"
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
    const rows: Array<Array<string | number>> = [];
    rows.push(["Sección", "Etiqueta", "Monto", "Frecuencia", "Equivalente mensual"]);
    income.forEach((r) =>
      rows.push([
        "Income",
        r.label,
        toNum(r.amount).toFixed(2),
        r.freq,
        toMonthly(toNum(r.amount), r.freq).toFixed(2),
      ])
    );
    expenses.forEach((r) =>
      rows.push([
        r.kind === "need" ? "Necesidad" : r.kind === "want" ? "Deseo" : "Ahorro/deuda",
        r.label,
        toNum(r.amount).toFixed(2),
        r.freq,
        toMonthly(toNum(r.amount), r.freq).toFixed(2),
      ])
    );
    rows.push([]);
    rows.push(["Totales", "Ingreso", metrics.incomeMonthly.toFixed(2)]);
    rows.push(["Totales", "Necesidades", metrics.needs.toFixed(2)]);
    rows.push(["Totales", "Deseos", metrics.wants.toFixed(2)]);
    rows.push(["Totales", "Ahorro y deuda", metrics.savings.toFixed(2)]);
    rows.push(["Totales", "Gastos", metrics.totalExp.toFixed(2)]);
    rows.push(["Totales", "Sobrante", metrics.leftover.toFixed(2)]);
    rows.push([]);
    rows.push(["Objetivos", "Necesidades (50%)", metrics.targetNeeds.toFixed(2)]);
    rows.push(["Objetivos", "Deseos (30%)", metrics.targetWants.toFixed(2)]);
    rows.push(["Objetivos", "Ahorro (20%)", metrics.targetSavings.toFixed(2)]);
    downloadCsv("presupuesto_holistico", rows);
  };

  const exportXLSX = () => {
    const rows: Array<Array<string | number>> = [];
    rows.push(["Sección", "Etiqueta", "Monto", "Frecuencia", "Equivalente mensual"]);
    income.forEach((r) =>
      rows.push([
        "Income",
        r.label,
        toNum(r.amount).toFixed(2),
        r.freq,
        toMonthly(toNum(r.amount), r.freq).toFixed(2),
      ])
    );
    expenses.forEach((r) =>
      rows.push([
        r.kind === "need" ? "Necesidad" : r.kind === "want" ? "Deseo" : "Ahorro/deuda",
        r.label,
        toNum(r.amount).toFixed(2),
        r.freq,
        toMonthly(toNum(r.amount), r.freq).toFixed(2),
      ])
    );
    rows.push([]);
    rows.push(["Totales", "Ingreso", metrics.incomeMonthly.toFixed(2)]);
    rows.push(["Totales", "Necesidades", metrics.needs.toFixed(2)]);
    rows.push(["Totales", "Deseos", metrics.wants.toFixed(2)]);
    rows.push(["Totales", "Ahorro y deuda", metrics.savings.toFixed(2)]);
    rows.push(["Totales", "Gastos", metrics.totalExp.toFixed(2)]);
    rows.push(["Totales", "Sobrante", metrics.leftover.toFixed(2)]);
    rows.push([]);
    rows.push(["Objetivos", "Necesidades (50%)", metrics.targetNeeds.toFixed(2)]);
    rows.push(["Objetivos", "Deseos (30%)", metrics.targetWants.toFixed(2)]);
    rows.push(["Objetivos", "Ahorro (20%)", metrics.targetSavings.toFixed(2)]);
    downloadXlsx("presupuesto_holistico", rows, {
      sheetName: "Presupuesto",
      columnWidths: [20, 36, 14, 16, 20],
    });
  };

  // Row helpers
  const uIncome = (id: UUID, patch: Partial<IncomeRow>) => setIncome(prev => prev.map(r => (r.id === id ? { ...r, ...patch } : r)));
  const addIncome = () => setIncome(prev => [...prev, { id: uid(), label: "Nuevo ingreso", amount: "0", freq: "monthly" }]);
  const rmIncome = (id: UUID) => setIncome(prev => prev.filter(r => r.id !== id));

  const uExpense = (id: UUID, patch: Partial<ExpenseRow>) => setExpenses(prev => prev.map(r => (r.id === id ? { ...r, ...patch } : r)));
  const addExpense = (kind: ExpenseKind) => setExpenses(prev => [...prev, { id: uid(), label: "Nuevo ítem", amount: "0", freq: "monthly", kind }]);
  const rmExpense = (id: UUID) => setExpenses(prev => prev.filter(r => r.id !== id));

  // Common inputs
  const MontoInput = ({ value, onChange, aria }: { value: string; onChange: (v: string) => void; aria: string }) => (
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
      title="Calculadora de Presupuesto Holística"
      subtitle="Crea un plan mensual realista categorizando tus gastos en Necesidades, Deseos y Ahorro & Deuda. Agrega filas personalizadas, elige frecuencias de pago y compárate con la guía 50/30/20."
      lang="es"
    >
      {/* Top actions */}
      <div className="tool-actions">
        <button type="button" onClick={printPage} className="tool-btn-blue">Imprimir o guardar PDF</button>
        <button type="button" onClick={exportCSV} className="tool-btn-green">Exportar (CSV)</button>
        <button type="button" onClick={exportXLSX} className="tool-btn-primary">Exportar (XLSX)</button>
        <button type="button" onClick={resetAll} className="tool-btn-gold">Restablecer valores</button>
      </div>

      {/* Single column normally; 2xl -> 5-column grid with span (Income 2, Gastos 3) */}
      <form className="grid grid-cols-1 2xl:grid-cols-5 gap-6">
        {/* Income & guidance */}
        <section className="tool-card-compact grid gap-4 2xl:col-span-2">
          <h3 className="font-sans text-base md:text-lg text-brand-green font-semibold">Ingresos (netos)</h3>

          {/* Mobile stacked */}
          <Stack>
            {income.map(row => {
              const monthly = toMonthly(toNum(row.amount), row.freq);
              return (
                <StackedRow
                  key={row.id}
                  fields={[
                    { label: "Fuente", node: <input value={row.label} onChange={(e) => uIncome(row.id, { label: e.target.value })} className="w-full bg-transparent outline-none border-b border-transparent focus:border-brand-gold" /> },
                    { label: "Monto", node: <MontoInput value={row.amount} onChange={(v) => uIncome(row.id, { amount: v })} aria="Monto de ingreso" /> },
                    { label: "Frecuencia", node: <FreqSelect value={row.freq} onChange={(v) => uIncome(row.id, { freq: v })} aria="Frecuencia de ingreso" /> },
                    { label: "Mensual", node: <span className="font-semibold">{CAD2.format(monthly)}</span>, right: true },
                  ]}
                  onRemove={() => rmIncome(row.id)}
                />
              );
            })}
            <button type="button" onClick={addIncome} className="underline text-sm text-left">+ Agregar ingreso</button>
            <div className="flex justify-end text-sm font-semibold">Total: {CAD2.format(metrics.incomeMonthly)}</div>
          </Stack>

          {/* Desktop table */}
          <Table>
            <thead className="bg-brand-beige/40 text-brand-blue">
              <tr>
                <th className="text-left px-3 py-2">Fuente</th>
                <th className="text-right px-3 py-2">Monto</th>
                <th className="text-left px-3 py-2">Frecuencia</th>
                <th className="text-right px-3 py-2">Mensual</th>
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
                        className="w-full bg-transparent outline-none" aria-label="Etiqueta de ingreso" />
                    </td>
                    <td className="px-3 py-2 text-right">
                      <MontoInput value={r.amount} onChange={(v) => uIncome(r.id, { amount: v })} aria="Monto de ingreso" />
                    </td>
                    <td className="px-3 py-2">
                      <FreqSelect value={r.freq} onChange={(v) => uIncome(r.id, { freq: v })} aria="Frecuencia de ingreso" />
                    </td>
                    <td className="px-3 py-2 text-right">{CAD2.format(monthly)}</td>
                    <td className="px-3 py-2 text-right">
                      <button type="button" onClick={() => rmIncome(r.id)} title="Eliminar" aria-label="Eliminar fila de ingreso" className="inline-flex items-center justify-center p-1.5 rounded-md text-red-600 hover:bg-red-50">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
              <tr className="border-t bg-brand-beige/20">
                <td className="px-3 py-2" colSpan={3}>
                  <button type="button" onClick={addIncome} className="underline">+ Agregar ingreso</button>
                </td>
                <td className="px-3 py-2 text-right font-semibold">{CAD2.format(metrics.incomeMonthly)}</td>
                <td className="px-3 py-2"></td>
              </tr>
            </tbody>
          </Table>

          {/* Summary */}
          <div className="grid sm:grid-cols-2 gap-3 md:gap-4">
            <div className="rounded-xl border border-brand-gold/50 p-3 md:p-4">
              <div className="text-xs md:text-sm text-brand-blue/80">Ingresos mensuales totales</div>
              <div className="text-xl md:text-2xl font-bold text-brand-green">{CAD0.format(Math.round(metrics.incomeMonthly))}</div>
            </div>
            <div className="rounded-xl border border-brand-gold/50 p-3 md:p-4">
              <div className="text-xs md:text-sm text-brand-blue/80">Sobrante / Déficit</div>
              <div className={`text-xl md:text-2xl font-bold ${metrics.leftover >= 0 ? "text-green-700" : "text-red-700"}`}>
                {CAD0.format(Math.round(metrics.leftover))}
              </div>
            </div>
          </div>

          {/* 50/30/20 */}
          <div className="rounded-xl border border-brand-gold/40 bg-brand-beige/40 p-3 md:p-4">
            <h4 className="font-semibold text-brand-green mb-2 text-sm md:text-base">Referencia 50 / 30 / 20</h4>
            <div className="grid sm:grid-cols-3 gap-3 md:gap-4">
              <div>
                <div className="flex items-center gap-2"><Tag tone="emerald">Necesidades</Tag><span className="text-[11px] md:text-sm text-brand-blue/70">≤ 50%</span></div>
                <div className="mt-1 text-base md:text-lg font-semibold">{CAD0.format(Math.round(metrics.targetNeeds))}</div>
                <div className={`text-xs md:text-sm ${metrics.pctNeeds <= 50 ? "text-emerald-700" : "text-red-700"}`}>{metrics.pctNeeds.toFixed(1)}%</div>
              </div>
              <div>
                <div className="flex items-center gap-2"><Tag tone="amber">Deseos</Tag><span className="text-[11px] md:text-sm text-brand-blue/70">≤ 30%</span></div>
                <div className="mt-1 text-base md:text-lg font-semibold">{CAD0.format(Math.round(metrics.targetWants))}</div>
                <div className={`text-xs md:text-sm ${metrics.pctWants <= 30 ? "text-emerald-700" : "text-red-700"}`}>{metrics.pctWants.toFixed(1)}%</div>
              </div>
              <div>
                <div className="flex items-center gap-2"><Tag tone="sky">Ahorro y deuda</Tag><span className="text-[11px] md:text-sm text-brand-blue/70">≥ 20%</span></div>
                <div className="mt-1 text-base md:text-lg font-semibold">{CAD0.format(Math.round(metrics.targetSavings))}</div>
                <div className={`text-xs md:text-sm ${metrics.pctSavings >= 20 ? "text-emerald-700" : "text-red-700"}`}>{metrics.pctSavings.toFixed(1)}%</div>
              </div>
            </div>
          </div>
        </section>

        {/* Gastos (single column except ultra-wide) */}
        <section className="tool-card-compact grid gap-6 2xl:col-span-3">
          <h3 className="font-sans text-base md:text-lg text-brand-green font-semibold">Gastos</h3>

          {/* ----- NEEDS ----- */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Tag tone="emerald">Necesidades</Tag>
                <span className="text-[11px] md:text-sm text-brand-blue/70">(housing, groceries, transport, insurance, childcare…)</span>
              </div>
              <button type="button" onClick={() => addExpense("need")} className="underline text-xs md:text-sm">+ Agregar necesidad</button>
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
                      { label: "Monto", node: <MontoInput value={r.amount} onChange={(v) => uExpense(r.id, { amount: v })} aria="Monto de necesidad" /> },
                      { label: "Frecuencia", node: <FreqSelect value={r.freq} onChange={(v) => uExpense(r.id, { freq: v })} aria="Frecuencia de necesidad" /> },
                      { label: "Mensual", node: <span className="font-semibold">{CAD2.format(monthly)}</span>, right: true },
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
                  <th className="text-right px-3 py-2">Monto</th>
                  <th className="text-left px-3 py-2">Frecuencia</th>
                  <th className="text-right px-3 py-2">Mensual</th>
                  <th className="px-3 py-2"></th>
                </tr>
              </thead>
              <tbody>
                {expenses.filter(e => e.kind === "need").map(r => {
                  const monthly = toMonthly(toNum(r.amount), r.freq);
                  return (
                    <tr key={r.id} className="border-t">
                      <td className="px-3 py-2"><input value={r.label} onChange={(e) => uExpense(r.id, { label: e.target.value })} className="w-full bg-transparent outline-none" /></td>
                      <td className="px-3 py-2 text-right"><MontoInput value={r.amount} onChange={(v) => uExpense(r.id, { amount: v })} aria="Monto de necesidad" /></td>
                      <td className="px-3 py-2"><FreqSelect value={r.freq} onChange={(v) => uExpense(r.id, { freq: v })} aria="Frecuencia de necesidad" /></td>
                      <td className="px-3 py-2 text-right">{CAD2.format(monthly)}</td>
                      <td className="px-3 py-2 text-right">
                        <button type="button" onClick={() => rmExpense(r.id)} title="Eliminar" aria-label="Eliminar fila de necesidad" className="inline-flex items-center justify-center p-1.5 rounded-md text-red-600 hover:bg-red-50">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
                <tr className="border-t bg-brand-beige/20">
                  <td className="px-3 py-2" colSpan={3}>Total Necesidades</td>
                  <td className="px-3 py-2 text-right font-semibold">{CAD2.format(metrics.needs)}</td>
                  <td className="px-3 py-2"></td>
                </tr>
              </tbody>
            </Table>
          </div>

          {/* ----- WANTS ----- */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Tag tone="amber">Deseos</Tag>
                <span className="text-[11px] md:text-sm text-brand-blue/70">(dining out, entertainment, shopping, travel…)</span>
              </div>
              <button type="button" onClick={() => addExpense("want")} className="underline text-xs md:text-sm">+ Agregar deseo</button>
            </div>

            <Stack>
              {expenses.filter(e => e.kind === "want").map(r => {
                const monthly = toMonthly(toNum(r.amount), r.freq);
                return (
                  <StackedRow
                    key={r.id}
                    fields={[
                      { label: "Item", node: <input value={r.label} onChange={(e) => uExpense(r.id, { label: e.target.value })} className="w-full bg-transparent outline-none border-b border-transparent focus:border-brand-gold" /> },
                      { label: "Monto", node: <MontoInput value={r.amount} onChange={(v) => uExpense(r.id, { amount: v })} aria="Monto de deseo" /> },
                      { label: "Frecuencia", node: <FreqSelect value={r.freq} onChange={(v) => uExpense(r.id, { freq: v })} aria="Frecuencia de deseo" /> },
                      { label: "Mensual", node: <span className="font-semibold">{CAD2.format(monthly)}</span>, right: true },
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
                  <th className="text-right px-3 py-2">Monto</th>
                  <th className="text-left px-3 py-2">Frecuencia</th>
                  <th className="text-right px-3 py-2">Mensual</th>
                  <th className="px-3 py-2"></th>
                </tr>
              </thead>
              <tbody>
                {expenses.filter(e => e.kind === "want").map(r => {
                  const monthly = toMonthly(toNum(r.amount), r.freq);
                  return (
                    <tr key={r.id} className="border-t">
                      <td className="px-3 py-2"><input value={r.label} onChange={(e) => uExpense(r.id, { label: e.target.value })} className="w-full bg-transparent outline-none" /></td>
                      <td className="px-3 py-2 text-right"><MontoInput value={r.amount} onChange={(v) => uExpense(r.id, { amount: v })} aria="Monto de deseo" /></td>
                      <td className="px-3 py-2"><FreqSelect value={r.freq} onChange={(v) => uExpense(r.id, { freq: v })} aria="Frecuencia de deseo" /></td>
                      <td className="px-3 py-2 text-right">{CAD2.format(monthly)}</td>
                      <td className="px-3 py-2 text-right">
                        <button type="button" onClick={() => rmExpense(r.id)} title="Eliminar" aria-label="Eliminar fila de deseo" className="inline-flex items-center justify-center p-1.5 rounded-md text-red-600 hover:bg-red-50">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
                <tr className="border-t bg-brand-beige/20">
                  <td className="px-3 py-2" colSpan={3}>Total Deseos</td>
                  <td className="px-3 py-2 text-right font-semibold">{CAD2.format(metrics.wants)}</td>
                  <td className="px-3 py-2"></td>
                </tr>
              </tbody>
            </Table>
          </div>

          {/* ----- SAVINGS & DEBT ----- */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Tag tone="sky">Ahorro y deuda</Tag>
                <span className="text-[11px] md:text-sm text-brand-blue/70">(emergency, TFSA/RRSP, debt repayments…)</span>
              </div>
              <button type="button" onClick={() => addExpense("savings_debt")} className="underline text-xs md:text-sm">+ Agregar ítem</button>
            </div>

            <Stack>
              {expenses.filter(e => e.kind === "savings_debt").map(r => {
                const monthly = toMonthly(toNum(r.amount), r.freq);
                return (
                  <StackedRow
                    key={r.id}
                    fields={[
                      { label: "Item", node: <input value={r.label} onChange={(e) => uExpense(r.id, { label: e.target.value })} className="w-full bg-transparent outline-none border-b border-transparent focus:border-brand-gold" /> },
                      { label: "Monto", node: <MontoInput value={r.amount} onChange={(v) => uExpense(r.id, { amount: v })} aria="Monto de ahorro/deuda" /> },
                      { label: "Frecuencia", node: <FreqSelect value={r.freq} onChange={(v) => uExpense(r.id, { freq: v })} aria="Frecuencia de ahorro/deuda" /> },
                      { label: "Mensual", node: <span className="font-semibold">{CAD2.format(monthly)}</span>, right: true },
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
                  <th className="text-right px-3 py-2">Monto</th>
                  <th className="text-left px-3 py-2">Frecuencia</th>
                  <th className="text-right px-3 py-2">Mensual</th>
                  <th className="px-3 py-2"></th>
                </tr>
              </thead>
              <tbody>
                {expenses.filter(e => e.kind === "savings_debt").map(r => {
                  const monthly = toMonthly(toNum(r.amount), r.freq);
                  return (
                    <tr key={r.id} className="border-t">
                      <td className="px-3 py-2"><input value={r.label} onChange={(e) => uExpense(r.id, { label: e.target.value })} className="w-full bg-transparent outline-none" /></td>
                      <td className="px-3 py-2 text-right"><MontoInput value={r.amount} onChange={(v) => uExpense(r.id, { amount: v })} aria="Monto de ahorro/deuda" /></td>
                      <td className="px-3 py-2"><FreqSelect value={r.freq} onChange={(v) => uExpense(r.id, { freq: v })} aria="Frecuencia de ahorro/deuda" /></td>
                      <td className="px-3 py-2 text-right">{CAD2.format(monthly)}</td>
                      <td className="px-3 py-2 text-right">
                        <button type="button" onClick={() => rmExpense(r.id)} title="Eliminar" aria-label="Eliminar fila de ahorro/deuda" className="inline-flex items-center justify-center p-1.5 rounded-md text-red-600 hover:bg-red-50">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
                <tr className="border-t bg-brand-beige/20">
                  <td className="px-3 py-2" colSpan={3}>Total Ahorro y deuda</td>
                  <td className="px-3 py-2 text-right font-semibold">{CAD2.format(metrics.savings)}</td>
                  <td className="px-3 py-2"></td>
                </tr>
              </tbody>
            </Table>
          </div>

          {/* Totals */}
          <div className="grid sm:grid-cols-3 gap-3 md:gap-4">
            <div className="rounded-xl border border-brand-gold/50 p-3 md:p-4">
              <div className="text-xs md:text-sm text-brand-blue/80">Gastos mensuales totales</div>
              <div className="text-xl md:text-2xl font-bold text-brand-green">{CAD0.format(Math.round(metrics.totalExp))}</div>
            </div>
            <div className="rounded-xl border border-brand-gold/50 p-3 md:p-4">
              <div className="text-xs md:text-sm text-brand-blue/80">Sobrante / Déficit</div>
              <div className={`text-xl md:text-2xl font-bold ${metrics.leftover >= 0 ? "text-green-700" : "text-red-700"}`}>
                {CAD0.format(Math.round(metrics.leftover))}
              </div>
            </div>
            <div className="rounded-xl border border-brand-gold/50 p-3 md:p-4">
              <div className="text-xs md:text-sm text-brand-blue/80">% Necesidades / Deseos / Sav.&Debt</div>
              <div className="text-xl md:text-2xl font-bold text-brand-green">
                {metrics.pctNeeds.toFixed(0)}% / {metrics.pctWants.toFixed(0)}% / {metrics.pctSavings.toFixed(0)}%
              </div>
            </div>
          </div>
        </section>
      </form>

      {/* Herramientas similares */}
      <div className="mt-6 tool-card-compact">
        <h4 className="font-sans text-base md:text-lg text-brand-green font-semibold mb-2">Herramientas similares</h4>
        <ul className="list-disc ml-5 text-sm space-y-1">
          <li><Link href="/es/herramientas/seguimiento-patrimonio-neto" className="underline">Seguimiento de Patrimonio Neto</Link></li>
          <li><Link href="/es/herramientas/deuda-bola-nieve" className="underline">Pago de Deudas (Bola de Nieve)</Link></li>
          <li><Link href="/es/herramientas/calculadora-hipotecaria" className="underline">Calculadora Hipotecaria</Link></li>
          <li><Link href="/es/herramientas/prueba-esfuerzo" className="underline">Asequibilidad y Prueba de Esfuerzo</Link></li>
        </ul>
      </div>

      {/* Print helpers */}
      <style jsx global>{`
        @media print {
          /* Print only the tool content on this route (hide global nav/footer chrome). */
          body > :not(main#main) { display: none !important; }
          main#main > :not([data-tool-shell]) { display: none !important; }

          main#main,
          [data-tool-shell] {
            background: white !important;
          }

          [data-tool-shell] {
            min-height: auto !important;
          }

          [data-tool-shell] > header {
            padding-top: 0 !important;
          }

          [data-tool-shell] > header .max-w-6xl {
            padding-top: 12px !important;
            padding-bottom: 12px !important;
            box-shadow: none !important;
          }

          [data-tool-shell] > header a,
          [data-tool-shell] > header .mt-4 {
            display: none !important;
          }

          [data-tool-shell] > section {
            margin-top: 8px !important;
            padding-top: 0 !important;
            padding-bottom: 0 !important;
            break-inside: auto !important;
            page-break-inside: auto !important;
          }

          [data-tool-shell] > section > .max-w-6xl {
            box-shadow: none !important;
            padding-top: 12px !important;
            padding-bottom: 12px !important;
          }

          [data-tool-shell] .print\\:hidden,
          [data-tool-shell] .tool-actions {
            display: none !important;
          }

          [data-tool-shell] table {
            page-break-inside: auto;
          }

          [data-tool-shell] .budget-print-table {
            overflow: visible !important;
            break-inside: auto !important;
            page-break-inside: auto !important;
          }

          [data-tool-shell] .budget-print-table table {
            width: 100% !important;
            border-collapse: collapse !important;
          }

          [data-tool-shell] .budget-print-table thead {
            display: table-header-group;
          }

          [data-tool-shell] tr {
            page-break-inside: avoid;
            page-break-after: auto;
          }
        }
      `}</style>

      {/* Disclaimer */}
      <p className="mt-6 text-xs text-brand-blue/70">
        Herramienta educativa. Los ingresos se consideran netos. La regla 50/30/20 es una guía: adáptala a tus metas y al costo de vida local.
      </p>
    </ToolShell>
  );
}
