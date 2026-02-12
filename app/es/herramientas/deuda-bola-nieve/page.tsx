"use client";

import { useMemo, useState } from "react";
import ToolShell from "@/components/ToolShell";
import { FaPrint, FaFileCsv, FaPlus, FaTrash } from "react-icons/fa";

/* =========================================================
   Tipos
   ========================================================= */
type Method = "snowball" | "avalanche";

type Debt = {
  id: number;
  name: string;
  balance: number;   // saldo actual (principal)
  apr: number;       // % interés anual (APR)
  min: number;       // pago mínimo mensual requerido
};

type SimRow = {
  month: number;
  dateLabel: string | null;
  totalPayment: number;
  totalInterest: number;
  totalPrincipal: number;
  remainingBalance: number;
  focus: string | null;           // deuda prioritaria del mes
  debtsRemaining: number;
};

type PayoffInfo = {
  id: number;
  name: string;
  payoffMonth: number | null;     // mes en que se cancela
  payoffDate: string | null;      // etiqueta si se ingresó fecha de inicio
  interestPaid: number;
  totalPaid: number;
};

/* =========================================================
   Utilidades
   ========================================================= */
const DATE_FMT: Intl.DateTimeFormatOptions = { year: "numeric", month: "short" };

function money(n: number, digits = 0) {
  return (Number.isFinite(n) ? n : 0).toLocaleString("es-CA", {
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
   Simulación principal
   ========================================================= */
function simulate(
  debtsInput: Debt[],
  extraMonthly: number,
  method: Method,
  startDateStr?: string,
  maxMonths = 1200 // límite de seguridad
) {
  const startDate = parseDateInput(startDateStr);
  const curDate = startDate ? new Date(startDate.getFullYear(), startDate.getMonth(), 1) : null;

  // Copias de trabajo
  const debts = debtsInput.map(d => ({ ...d }));

  // Acumulados por deuda
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

    // 1) Devengar intereses
    let monthInterest = 0;
    for (const d of debts) {
      if (d.balance <= 0.005) continue;
      const i = round2(d.balance * (Math.max(0, d.apr) / 100) / 12);
      d.balance = round2(d.balance + i);
      monthInterest = round2(monthInterest + i);
      interestPaid[d.id] = round2(interestPaid[d.id] + i);
    }

    // 2) Pool de pago = suma de mínimos activos + extra mensual
    let pool = round2(debts.filter(d => d.balance > 0.005).reduce((s, d) => s + Math.max(0, d.min), 0) + Math.max(0, extraMonthly));

    // Si el pool es cero mientras hay saldos, no se puede avanzar
    if (pool <= 0) {
      rows.push({
        month,
        dateLabel: curDate ? curDate.toLocaleDateString("es-CA", DATE_FMT) : null,
        totalPayment: 0,
        totalInterest: monthInterest,
        totalPrincipal: 0,
        remainingBalance: totalBalance(),
        focus: null,
        debtsRemaining: aliveCount(),
      });
      break;
    }

    // 3) Orden de ataque
    const active = debts.filter(d => d.balance > 0.005);
    let order: Debt[];
    if (method === "snowball") {
      // Saldo más pequeño primero (desempate por APR)
      order = active.sort((a, b) => a.balance - b.balance || a.apr - b.apr);
    } else {
      // Mayor APR primero (desempate por saldo)
      order = active.sort((a, b) => b.apr - a.apr || a.balance - b.balance);
    }
    const focusName = order.length ? order[0].name : null;

    // 4) Asignar todo el pool siguiendo el orden
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

    // 5) Registrar fila
    const dateLabel = curDate ? curDate.toLocaleDateString("es-CA", DATE_FMT) : null;
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

  // Información de orden de pago
  const payoffInfo: PayoffInfo[] = debts.map(d => {
    const m = payoffMonth[d.id];
    let label: string | null = null;
    const startDate = parseDateInput(startDateStr);
    if (m && startDate) {
      const dt = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
      dt.setMonth(dt.getMonth() + (m - 1));
      label = dt.toLocaleDateString("es-CA", DATE_FMT);
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
   Página
   ========================================================= */
export default function Page() {
  const [debts, setDebts] = useState<Debt[]>([
    { id: 1, name: "Tarjeta de crédito A", balance: 5500, apr: 19.99, min: 110 },
    { id: 2, name: "Préstamo del auto", balance: 18_200, apr: 6.49, min: 340 },
    { id: 3, name: "Préstamo estudiantil", balance: 12_300, apr: 4.20, min: 150 },
  ]);
  const [extra, setExtra] = useState<number>(300);
  const [method, setMethod] = useState<Method>("snowball");
  const [startDate, setStartDate] = useState<string>(""); // opcional AAAA-MM-DD

  const printDate = new Date().toLocaleDateString("es-CA", { year: "numeric", month: "long", day: "numeric" });

  const sim = useMemo(() => simulate(debts, extra, method, startDate), [debts, extra, method, startDate]);

  function addDebt() {
    setDebts(prev => [...prev, {
      id: (prev.at(-1)?.id ?? 0) + 1,
      name: `Deuda ${prev.length + 1}`,
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
      { id: 1, name: "Tarjeta de crédito A", balance: 5500, apr: 19.99, min: 110 },
      { id: 2, name: "Préstamo del auto", balance: 18_200, apr: 6.49, min: 340 },
      { id: 3, name: "Préstamo estudiantil", balance: 12_300, apr: 4.20, min: 150 },
    ]);
    setExtra(300);
    setMethod("snowball");
    setStartDate("");
  }

  function handlePrint() { window.print(); }

  function exportSummaryCSV() {
    const rows: Array<Array<string | number>> = [
      ["Preparado", printDate],
      ["Método", method === "snowball" ? "Bola de Nieve (saldo más pequeño primero)" : "Avalancha (APR más alto primero)"],
      ["Extra mensual", extra.toFixed(2)],
      ["Fecha de inicio", startDate || "—"],
      ["—", "—"],
      ["Deudas"],
      ...debts.map(d => [d.name, `Saldo ${d.balance.toFixed(2)}`, `APR ${d.apr.toFixed(2)}%`, `Mín ${d.min.toFixed(2)}`]),
      ["—", "—"],
      ["RESULTADOS"],
      ["Meses para quedar libre de deudas", sim.monthsToFreedom],
      ["Años para quedar libre de deudas", sim.yearsToFreedom.toFixed(2)],
      ["Interés total (todas las deudas)", sim.totalInterestAll.toFixed(2)],
      ["Total pagado (principal + interés)", sim.totalPaidAll.toFixed(2)],
      ["—", "—"],
      ["Orden de pago"],
      ...sim.payoffInfo.map(p => [
        p.name,
        p.payoffMonth === null ? "No se cancela" : `Mes ${p.payoffMonth}`,
        p.payoffDate ?? "",
        `Interés ${p.interestPaid.toFixed(2)}`,
        `Total Pagado ${p.totalPaid.toFixed(2)}`
      ]),
    ];
    downloadCSV("plan_pago_deudas_resumen", rows);
  }

  function exportScheduleCSV() {
    const rows: Array<Array<string | number>> = [
      ["Mes #", "Fecha", "Pago total", "Interés", "Principal", "Saldo restante", "Deuda prioritaria", "Deudas restantes"],
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
    downloadCSV("plan_pago_deudas_calendario", rows);
  }

  /* ----------------------------
     UI
     ---------------------------- */
  return (
    <ToolShell
      title="Optimizador de Pago de Deudas (Bola de Nieve y Avalancha)"
      subtitle="Planifica tu camino para salir de deudas: compara Bola de Nieve vs. Avalancha, visualiza tiempos de pago e interés total y exporta tu plan."
      lang="es"
    >
      {/* Barra de acciones */}
      <div className="flex flex-wrap gap-2 items-center justify-end mb-4 print:hidden">
        <button
          type="button"
          onClick={handlePrint}
          className="px-4 py-2 bg-brand-blue text-white rounded-full inline-flex items-center gap-2 hover:bg-brand-gold hover:text-brand-green transition"
          title="Abrir el diálogo de impresión (elige 'Guardar como PDF')"
        >
          <FaPrint aria-hidden /> Imprimir / Guardar PDF
        </button>
        <button
          type="button"
          onClick={exportSummaryCSV}
          className="px-4 py-2 bg-white border-2 border-brand-blue text-brand-blue rounded-full inline-flex items-center gap-2 hover:bg-brand-blue hover:text-white transition"
          title="Exportar resumen"
        >
          <FaFileCsv aria-hidden /> Exportar Resumen CSV
        </button>
        <button
          type="button"
          onClick={exportScheduleCSV}
          className="px-4 py-2 bg-white border-2 border-brand-blue text-brand-blue rounded-full inline-flex items-center gap-2 hover:bg-brand-blue hover:text-white transition"
          title="Exportar calendario mes a mes"
        >
          <FaFileCsv aria-hidden /> Exportar Calendario CSV
        </button>
        <button
          type="button"
          onClick={resetExample}
          className="px-4 py-2 bg-white border-2 border-brand-gold text-brand-green rounded-full inline-flex items-center gap-2 hover:bg-brand-gold hover:text-brand-green transition"
          title="Restablecer a valores de ejemplo"
        >
          Restablecer ejemplo
        </button>
      </div>

      {/* Entradas */}
      <form className="grid 2xl:grid-cols-4 xl:grid-cols-3 gap-6">
        {/* Lista de deudas */}
        <section className="rounded-2xl border border-brand-gold bg-white p-5">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-sans text-lg text-brand-green font-semibold">Tus deudas</h3>
            <button
              type="button"
              onClick={addDebt}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border-2 border-brand-green text-brand-green hover:bg-brand-green hover:text-white transition"
            >
              <FaPlus aria-hidden /> Agregar deuda
            </button>
          </div>

          {debts.length === 0 ? (
            <p className="text-sm text-brand-blue/70">Aún no hay deudas. Agrega tu primera deuda para comenzar.</p>
          ) : (
            <div className="space-y-3">
              {debts.map(d => (
                <div key={d.id} className="grid grid-cols-12 items-end gap-3">
                  <div className="col-span-5">
                    <label className="block text-sm font-medium text-brand-blue mb-1">Nombre</label>
                    <input
                      type="text"
                      className="w-full rounded-xl border border-brand-gold/60 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-gold"
                      value={d.name}
                      onChange={(e)=>updateDebt(d.id, { name: e.target.value })}
                    />
                  </div>
                  <div className="col-span-3">
                    <label className="block text-sm font-medium text-brand-blue mb-1">Saldo</label>
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
                    <label className="block text-sm font-medium text-brand-blue mb-1">Mín. / mes</label>
                    <input
                      type="number" min={0} inputMode="decimal"
                      className="w-full rounded-xl border border-brand-gold/60 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-gold"
                      value={d.min}
                      onChange={(e)=>updateDebt(d.id, { min: Number(e.target.value || 0) })}
                    />
                  </div>
                  <div className="col-span-12 md:col-span-0 flex md:block justify-end">
                    <button
                      type="button"
                      onClick={()=>removeDebt(d.id)}
                      className="text-brand-blue/70 hover:text-brand-blue"
                      aria-label={`Eliminar ${d.name}`}
                    >
                      <FaTrash aria-hidden />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Estrategia y calendario */}
        <section className="rounded-2xl border border-brand-gold bg-white p-5 grid gap-3">
          <h3 className="font-sans text-lg text-brand-green font-semibold">Estrategia</h3>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-brand-blue mb-1">Método</label>
              <div className="flex gap-4">
                <label className="inline-flex items-center gap-2">
                  <input type="radio" name="m" checked={method==="snowball"} onChange={()=>setMethod("snowball")} />
                  <span>Bola de Nieve</span>
                </label>
                <label className="inline-flex items-center gap-2">
                  <input type="radio" name="m" checked={method==="avalanche"} onChange={()=>setMethod("avalanche")} />
                  <span>Avalancha</span>
                </label>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-brand-blue mb-1">Extra mensual</label>
              <input
                type="number" min={0} inputMode="decimal"
                className="w-full rounded-xl border border-brand-gold/60 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-gold"
                value={extra}
                onChange={(e)=>setExtra(Number(e.target.value || 0))}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-brand-blue mb-1">Fecha de inicio (opcional)</label>
            <input
              type="date"
              className="w-full rounded-xl border border-brand-gold/60 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-gold"
              value={startDate}
              onChange={(e)=>setStartDate(e.target.value)}
            />
            <p className="text-xs text-brand-blue/70 mt-1">Se usa para estimar el mes/año de cada pago final y etiquetar el calendario.</p>
          </div>
        </section>

        {/* Resultados */}
        <section className="rounded-2xl border border-brand-gold bg-white p-5 avoid-break">
          <h3 className="font-sans text-xl text-brand-green font-semibold mb-2">Resultados</h3>

          <div className="text-sm space-y-2">
            <div className="flex justify-between">
              <span>Meses para quedar libre de deudas</span>
              <span className="font-medium">{sim.reachedZero ? sim.monthsToFreedom : "—"}</span>
            </div>
            <div className="flex justify-between">
              <span>Años para quedar libre de deudas</span>
              <span className="font-medium">{sim.reachedZero ? sim.yearsToFreedom.toFixed(2) : "—"}</span>
            </div>
            <div className="flex justify-between">
              <span>Interés total (todas las deudas)</span>
              <span className="font-medium">{money(sim.totalInterestAll, 0)}</span>
            </div>
            <div className="flex justify-between border-t pt-2 mt-2">
              <span className="font-semibold">Total pagado (principal + interés)</span>
              <span className="font-semibold">{money(sim.totalPaidAll, 0)}</span>
            </div>
          </div>

          <div className="mt-4 rounded-xl border border-brand-gold/40 bg-brand-beige/40 p-4">
            <h4 className="font-semibold text-brand-green mb-2">Orden de pago</h4>
            {sim.payoffInfo.length === 0 ? (
              <p className="text-sm text-brand-blue/70">Agrega deudas para ver el plan.</p>
            ) : (
              <ol className="list-decimal ml-5 space-y-1 text-sm text-brand-blue/80">
                {sim.payoffInfo.map((p) => (
                  <li key={p.id} className="flex justify-between">
                    <span>{p.name}</span>
                    <span>
                      {p.payoffMonth ? `Mes ${p.payoffMonth}${p.payoffDate ? ` • ${p.payoffDate}` : ""}` : "—"}
                    </span>
                  </li>
                ))}
              </ol>
            )}
          </div>

          {!sim.reachedZero && (
            <p className="text-xs text-red-600 mt-2">
              Tu presupuesto mensual total (mínimos + extra) no alcanza para cancelar estos saldos. Aumenta el monto extra o ajusta las entradas.
            </p>
          )}
        </section>
      </form>

      {/* Calendario */}
      <div className="mt-8 rounded-2xl border border-brand-gold bg-white p-5">
        <h3 className="font-sans text-lg text-brand-green font-semibold mb-2">Calendario (vista previa de los primeros 24 meses)</h3>
        <div className="overflow-auto rounded-xl border border-brand-gold/40">
          <table className="w-full text-sm">
            <thead className="bg-brand-beige/40 text-brand-blue">
              <tr>
                <th className="text-left px-3 py-2">#</th>
                <th className="text-left px-3 py-2">Fecha</th>
                <th className="text-right px-3 py-2">Pago total</th>
                <th className="text-right px-3 py-2">Interés</th>
                <th className="text-right px-3 py-2">Principal</th>
                <th className="text-right px-3 py-2">Saldo restante</th>
                <th className="text-left px-3 py-2">Deuda prioritaria</th>
                <th className="text-right px-3 py-2">Deudas restantes</th>
              </tr>
            </thead>
            <tbody>
              {sim.rows.slice(0, 24).map((r) => (
                <tr key={r.month} className="border-t">
                  <td className="px-3 py-2">{r.month}</td>
                  <td className="px-3 py-2">{r.dateLabel ?? `Mes ${r.month}`}</td>
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
          <summary className="cursor-pointer text-sm text-brand-blue underline">Mostrar calendario completo</summary>
          <div className="mt-3 overflow-auto rounded-xl border border-brand-gold/40">
            <table className="w-full text-sm">
              <thead className="bg-brand-beige/40 text-brand-blue">
                <tr>
                  <th className="text-left px-3 py-2">#</th>
                  <th className="text-left px-3 py-2">Fecha</th>
                  <th className="text-right px-3 py-2">Pago total</th>
                  <th className="text-right px-3 py-2">Interés</th>
                  <th className="text-right px-3 py-2">Principal</th>
                  <th className="text-right px-3 py-2">Saldo restante</th>
                  <th className="text-left px-3 py-2">Deuda prioritaria</th>
                  <th className="text-right px-3 py-2">Deudas restantes</th>
                </tr>
              </thead>
              <tbody>
                {sim.rows.map((r) => (
                  <tr key={r.month} className="border-t">
                    <td className="px-3 py-2">{r.month}</td>
                    <td className="px-3 py-2">{r.dateLabel ?? `Mes ${r.month}`}</td>
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

        {/* Exportaciones */}
        <div className="flex flex-wrap gap-2 items-center justify-end mt-4 print:hidden">
          <button
            type="button"
            onClick={exportSummaryCSV}
            className="px-4 py-2 bg-white border-2 border-brand-blue text-brand-blue rounded-full inline-flex items-center gap-2 hover:bg-brand-blue hover:text-white transition"
            title="Exportar resumen"
          >
            <FaFileCsv aria-hidden /> Exportar Resumen CSV
          </button>
          <button
            type="button"
            onClick={exportScheduleCSV}
            className="px-4 py-2 bg-white border-2 border-brand-blue text-brand-blue rounded-full inline-flex items-center gap-2 hover:bg-brand-blue hover:text-white transition"
            title="Exportar calendario mes a mes"
          >
            <FaFileCsv aria-hidden /> Exportar Calendario CSV
          </button>
        </div>
      </div>

      {/* Encabezado para impresión */}
      <div className="hidden print:block mt-6 mb-3 text-center">
        <div className="font-sans font-bold text-brand-green text-2xl">Pago de Deudas — Resumen del Plan</div>
        <div className="text-xs text-brand-blue">Preparado {printDate}</div>
        <div className="w-16 h-[2px] bg-brand-gold rounded-full mx-auto mt-2" />
      </div>

      {/* Estilos de impresión */}
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
