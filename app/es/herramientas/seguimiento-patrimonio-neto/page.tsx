"use client";

import { useMemo, useState } from "react";
import ToolShell from "@/components/ToolShell";
import { FaPrint, FaFileCsv, FaPlus, FaTrash, FaCalendarPlus } from "react-icons/fa";

/* =========================================================
   Tipos
   ========================================================= */
type LineItem = { id: number; name: string; amount: number };
type Snapshot = { id: number; date: string; assets: number; liabilities: number; netWorth: number };

/* =========================================================
   Utilidades
   ========================================================= */
function money(n: number, digits = 0) {
  return (Number.isFinite(n) ? n : 0).toLocaleString("es-CA", {
    style: "currency",
    currency: "CAD",
    maximumFractionDigits: digits,
  });
}

// CSV robusto (comillas + CRLF + BOM para Excel)
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
   Página
   ========================================================= */
export default function Page() {
  // Ejemplos iniciales (editables)
  const [assets, setAssets] = useState<LineItem[]>([
    { id: 1, name: "Cuenta corriente", amount: 3_200 },
    { id: 2, name: "Ahorros / Emergencia", amount: 12_500 },
    { id: 3, name: "TFSA / Inversiones", amount: 28_000 },
    { id: 4, name: "RRSP / Retiro", amount: 40_000 },
    { id: 5, name: "Vivienda (valor de mercado)", amount: 850_000 },
    { id: 6, name: "Vehículo(s)", amount: 18_000 },
  ]);
  const [liabilities, setLiabilities] = useState<LineItem[]>([
    { id: 1, name: "Hipoteca", amount: 520_000 },
    { id: 2, name: "HELOC / LOC", amount: 8_500 },
    { id: 3, name: "Tarjeta(s) de crédito", amount: 2_400 },
    { id: 4, name: "Préstamo de auto", amount: 12_300 },
    { id: 5, name: "Préstamo estudiantil", amount: 9_800 },
  ]);

  // Snapshots (seguimiento local). La fecha por defecto es hoy; se puede cambiar antes de guardar.
  const todayISO = new Date().toISOString().slice(0, 10);
  const [snapshotDate, setSnapshotDate] = useState<string>(todayISO);
  const [snapshots, setSnapshots] = useState<Snapshot[]>([]);

  const printDate = new Date().toLocaleDateString("es-CA", { year: "numeric", month: "long", day: "numeric" });

  /* Totales */
  const totals = useMemo(() => {
    const assetSum = assets.reduce((s, a) => s + Math.max(0, a.amount || 0), 0);
    const debtSum = liabilities.reduce((s, l) => s + Math.max(0, l.amount || 0), 0);
    const net = assetSum - debtSum;

    // Vista simple de liquidez (efectivo/ahorros vs. resto)
    const liquidKeywords = [
      // inglés común en Toronto
      "chequing", "checking", "saving", "savings", "cash", "money market", "hysa",
      // español
      "cuenta corriente", "ahorro", "ahorros", "efectivo", "dinero"
    ];
    const isLiquid = (n: string) =>
      liquidKeywords.some((k) => n.toLowerCase().includes(k));
    const liquidAssets = assets.filter((a) => isLiquid(a.name)).reduce((s, a) => s + Math.max(0, a.amount || 0), 0);
    const investedAssets = assetSum - liquidAssets;

    const dta = assetSum > 0 ? (debtSum / assetSum) : 0; // Deuda/Activos
    const ltr = debtSum > 0 ? (liquidAssets / debtSum) : Infinity; // Liquidez/Deuda

    return { assetSum, debtSum, net, liquidAssets, investedAssets, dta, ltr };
  }, [assets, liabilities]);

  /* Acciones: activos */
  function addAsset() {
    setAssets((prev) => [...prev, { id: (prev.at(-1)?.id ?? 0) + 1, name: `Activo ${prev.length + 1}`, amount: 0 }]);
  }
  function updateAsset(id: number, patch: Partial<LineItem>) {
    setAssets((prev) => prev.map((a) => (a.id === id ? { ...a, ...patch } : a)));
  }
  function removeAsset(id: number) {
    setAssets((prev) => prev.filter((a) => a.id !== id));
  }

  /* Acciones: pasivos */
  function addLiability() {
    setLiabilities((prev) => [...prev, { id: (prev.at(-1)?.id ?? 0) + 1, name: `Pasivo ${prev.length + 1}`, amount: 0 }]);
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

  /* Exportar & Imprimir */
  function handlePrint() {
    window.print(); // navegador: “Guardar como PDF”
  }

  function exportSummaryCSV() {
    const rows: Array<Array<string | number>> = [
      ["Preparado", printDate],
      ["—", "—"],
      ["ACTIVOS"],
      ...assets.map((a) => [a.name, a.amount.toFixed(2)]),
      ["Total de activos", totals.assetSum.toFixed(2)],
      ["—", "—"],
      ["PASIVOS"],
      ...liabilities.map((l) => [l.name, l.amount.toFixed(2)]),
      ["Total de pasivos", totals.debtSum.toFixed(2)],
      ["—", "—"],
      ["Patrimonio neto", totals.net.toFixed(2)],
      ["Activos líquidos (aprox.)", totals.liquidAssets.toFixed(2)],
      ["Otros activos / invertidos", totals.investedAssets.toFixed(2)],
      ["Deuda/Activos (ratio)", totals.dta.toFixed(4)],
      ["Liquidez/Deuda (ratio)", Number.isFinite(totals.ltr) ? totals.ltr.toFixed(4) : "∞"],
    ];
    downloadCSV("patrimonio_resumen", rows);
  }

  function exportTimelineCSV() {
    const rows: Array<Array<string | number>> = [["Fecha", "Activos", "Pasivos", "Patrimonio neto"]];
    snapshots.forEach((s) => rows.push([s.date, s.assets.toFixed(2), s.liabilities.toFixed(2), s.netWorth.toFixed(2)]));
    downloadCSV("patrimonio_timeline", rows);
  }

  function resetExample() {
    setAssets([
      { id: 1, name: "Cuenta corriente", amount: 3_200 },
      { id: 2, name: "Ahorros / Emergencia", amount: 12_500 },
      { id: 3, name: "TFSA / Inversiones", amount: 28_000 },
      { id: 4, name: "RRSP / Retiro", amount: 40_000 },
      { id: 5, name: "Vivienda (valor de mercado)", amount: 850_000 },
      { id: 6, name: "Vehículo(s)", amount: 18_000 },
    ]);
    setLiabilities([
      { id: 1, name: "Hipoteca", amount: 520_000 },
      { id: 2, name: "HELOC / LOC", amount: 8_500 },
      { id: 3, name: "Tarjeta(s) de crédito", amount: 2_400 },
      { id: 4, name: "Préstamo de auto", amount: 12_300 },
      { id: 5, name: "Préstamo estudiantil", amount: 9_800 },
    ]);
    setSnapshotDate(todayISO);
    setSnapshots([]);
  }

  /* UI */
  return (
    <ToolShell
      title="Seguimiento de Patrimonio Neto"
      subtitle="Suma tus activos y pasivos para ver tu patrimonio neto. Guarda registros con fecha y exporta un resumen o la línea de tiempo."
      lang="es"
    >
      {/* Barra de acciones */}
      <div className="flex flex-wrap gap-2 items-center justify-end mb-4 print:hidden">
        <button
          type="button"
          onClick={handlePrint}
          className="px-4 py-2 bg-brand-blue text-white rounded-full inline-flex items-center gap-2 hover:bg-brand-gold hover:text-brand-green transition"
          title="Abrir diálogo de impresión (elige 'Guardar como PDF')"
        >
          <FaPrint aria-hidden /> Imprimir / Guardar PDF
        </button>
        <button
          type="button"
          onClick={exportSummaryCSV}
          className="px-4 py-2 bg-white border-2 border-brand-blue text-brand-blue rounded-full inline-flex items-center gap-2 hover:bg-brand-blue hover:text-white transition"
          title="Exportar un resumen detallado de tus partidas y totales"
        >
          <FaFileCsv aria-hidden /> Exportar CSV (resumen)
        </button>
        <button
          type="button"
          onClick={exportTimelineCSV}
          disabled={snapshots.length === 0}
          className={`px-4 py-2 rounded-full inline-flex items-center gap-2 border-2 ${snapshots.length===0 ? "border-gray-300 text-gray-400 cursor-not-allowed" : "border-brand-blue text-brand-blue hover:bg-brand-blue hover:text-white transition"}`}
          title={snapshots.length === 0 ? "Agrega un registro primero" : "Exporta tus registros con fecha"}
        >
          <FaFileCsv aria-hidden /> Exportar CSV (línea de tiempo)
        </button>
        <button
          type="button"
          onClick={resetExample}
          className="px-4 py-2 bg-white border-2 border-brand-gold text-brand-gold rounded-full inline-flex items-center gap-2 hover:bg-brand-gold hover:text-brand-green transition"
          title="Restablecer a valores de ejemplo"
        >
          Restablecer ejemplo
        </button>
      </div>

      {/* Entradas */}
      <form className="grid 2xl:grid-cols-4 xl:grid-cols-3 gap-6">
        {/* Activos */}
        <section className="rounded-2xl border border-brand-gold bg-white p-5">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-serif text-lg text-brand-green font-bold">Activos</h3>
            <button
              type="button"
              onClick={addAsset}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border-2 border-brand-green text-brand-green hover:bg-brand-green hover:text-white transition"
            >
              <FaPlus aria-hidden /> Agregar activo
            </button>
          </div>

          {assets.length === 0 ? (
            <p className="text-sm text-brand-blue/70">Aún no hay activos. Agrega tu primer activo para comenzar.</p>
          ) : (
            <div className="space-y-3">
              {assets.map((a) => (
                <div key={a.id} className="grid grid-cols-12 items-end gap-3">
                  <div className="col-span-7">
                    <label className="block text-sm font-medium text-brand-blue mb-1">Nombre</label>
                    <input
                      type="text"
                      className="w-full rounded-xl border border-brand-gold/60 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-gold"
                      value={a.name}
                      onChange={(e) => updateAsset(a.id, { name: e.target.value })}
                    />
                  </div>
                  <div className="col-span-4">
                    <label className="block text-sm font-medium text-brand-blue mb-1">Monto</label>
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
                      aria-label={`Eliminar ${a.name}`}
                    >
                      <FaTrash aria-hidden />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <p className="text-xs text-brand-blue/70 mt-2">
            Tip: Para tu vivienda, usa un valor de mercado realista; para inversiones, usa el valor actual de la cuenta.
          </p>
        </section>

        {/* Pasivos */}
        <section className="rounded-2xl border border-brand-gold bg-white p-5">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-serif text-lg text-brand-green font-bold">Pasivos</h3>
            <button
              type="button"
              onClick={addLiability}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border-2 border-brand-green text-brand-green hover:bg-brand-green hover:text-white transition"
            >
              <FaPlus aria-hidden /> Agregar pasivo
            </button>
          </div>

          {liabilities.length === 0 ? (
            <p className="text-sm text-brand-blue/70">Aún no hay pasivos. Agrega tu primer pasivo para comenzar.</p>
          ) : (
            <div className="space-y-3">
              {liabilities.map((l) => (
                <div key={l.id} className="grid grid-cols-12 items-end gap-3">
                  <div className="col-span-7">
                    <label className="block text-sm font-medium text-brand-blue mb-1">Nombre</label>
                    <input
                      type="text"
                      className="w-full rounded-xl border border-brand-gold/60 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-gold"
                      value={l.name}
                      onChange={(e) => updateLiability(l.id, { name: e.target.value })}
                    />
                  </div>
                  <div className="col-span-4">
                    <label className="block text-sm font-medium text-brand-blue mb-1">Monto</label>
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
                      aria-label={`Eliminar ${l.name}`}
                    >
                      <FaTrash aria-hidden />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <p className="text-xs text-brand-blue/70 mt-2">
            Incluye todo lo que debes: hipoteca, HELOC/LOC, tarjetas de crédito, préstamos de auto/estudiantiles/personales, impuestos por pagar, etc.
          </p>
        </section>

        {/* Registro + Ratios */}
        <section className="rounded-2xl border border-brand-gold bg-white p-5">
          <h3 className="font-serif text-lg text-brand-green font-bold mb-2">Registro y ratios</h3>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="text-sm text-brand-blue/80">Total de activos</div>
              <div className="text-xl font-semibold">{money(totals.assetSum, 0)}</div>
            </div>
            <div>
              <div className="text-sm text-brand-blue/80">Total de pasivos</div>
              <div className="text-xl font-semibold">{money(totals.debtSum, 0)}</div>
            </div>
            <div className="col-span-2 border-t border-brand-gold/40 pt-2">
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-sm text-brand-blue/80">Patrimonio neto</div>
                  <div className="text-2xl font-bold text-brand-green">{money(totals.net, 0)}</div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-brand-blue/70">Activos líquidos</div>
                  <div className="text-sm font-medium">{money(totals.liquidAssets, 0)}</div>
                  <div className="text-xs text-brand-blue/70 mt-1">Deuda/Activos</div>
                  <div className="text-sm font-medium">{(totals.dta * 100).toFixed(1)}%</div>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-brand-gold/40 bg-brand-beige/40 p-3 mt-4">
            <label className="block text-sm font-medium text-brand-blue mb-1">Fecha del registro</label>
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
                title="Guardar un registro con fecha de tus totales"
              >
                <FaCalendarPlus aria-hidden /> Agregar registro
              </button>
            </div>
            <p className="text-xs text-brand-blue/70 mt-1">
              Los registros se guardan localmente en esta sesión para ayudarte a seguir tu progreso en el tiempo.
            </p>
          </div>
        </section>
      </form>

      {/* Tabla de registros */}
      <div className="mt-8 rounded-2xl border border-brand-gold bg-white p-5">
        <h3 className="font-serif text-lg text-brand-green font-bold mb-2">Registros guardados</h3>
        {snapshots.length === 0 ? (
          <p className="text-sm text-brand-blue/70">Aún no hay registros. Elige una fecha y haz clic en <b>Agregar registro</b>.</p>
        ) : (
          <div className="overflow-auto rounded-xl border border-brand-gold/40">
            <table className="w-full text-sm">
              <thead className="bg-brand-beige/40 text-brand-blue">
                <tr>
                  <th className="text-left px-3 py-2">Fecha</th>
                  <th className="text-right px-3 py-2">Activos</th>
                  <th className="text-right px-3 py-2">Pasivos</th>
                  <th className="text-right px-3 py-2">Patrimonio neto</th>
                  <th className="text-right px-3 py-2">Acciones</th>
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
                        aria-label={`Eliminar registro ${s.date}`}
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

      {/* Supuestos & notas */}
      <details className="mt-6 rounded-2xl border border-brand-gold/40 bg-brand-beige/40 p-4">
        <summary className="cursor-pointer font-semibold text-brand-green">Notas</summary>
        <ul className="list-disc ml-5 mt-2 text-sm text-brand-blue/80 space-y-1">
          <li>Las cifras son estimaciones ingresadas por la persona usuaria; esta herramienta no se conecta a cuentas bancarias o de inversión.</li>
          <li>Los “activos líquidos” se aproximan según el nombre del ítem (efectivo/ahorros); edita los nombres si deseas otra clasificación.</li>
          <li>Herramienta educativa; no constituye asesoría financiera.</li>
        </ul>
      </details>

      {/* Encabezado de impresión (solo al imprimir) */}
      <div className="hidden print:block mt-6 mb-3 text-center">
        <div className="font-serif font-bold text-brand-green text-2xl">Patrimonio Neto — Resumen</div>
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
