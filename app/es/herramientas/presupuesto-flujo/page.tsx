"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import ToolShell from "@/components/ToolShell";
import { Trash2, PlusCircle, CheckCircle2 } from "lucide-react";

type Tipo = "Ingreso" | "Gasto";

type Row = {
  id: string;
  type: Tipo;
  category: string;
  amount: string;
  notes?: string;
};

const STORAGE_KEY = "presupuesto-flujo-v1";

const DEFAULTS: Row[] = [
  { id: "i1", type: "Ingreso", category: "Sueldo (después de impuestos)", amount: "" },
  { id: "i2", type: "Ingreso", category: "Otros ingresos", amount: "" },
  { id: "e1", type: "Gasto", category: "Renta / Hipoteca", amount: "" },
  { id: "e2", type: "Gasto", category: "Servicios", amount: "" },
  { id: "e3", type: "Gasto", category: "Supermercado", amount: "" },
  { id: "e4", type: "Gasto", category: "Transporte", amount: "" },
  { id: "e5", type: "Gasto", category: "Pagos de deudas", amount: "" },
  { id: "e6", type: "Gasto", category: "Ahorro / Inversión", amount: "" },
  { id: "e7", type: "Gasto", category: "Otros", amount: "" },
];

const currency = new Intl.NumberFormat("es-CA", {
  style: "currency",
  currency: "CAD",
});

const toNumber = (s: string | undefined) => {
  if (!s) return 0;
  const cleaned = String(s).replace(/[^\d.-]/g, "");
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : 0;
};

const uid = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

function toCSV(rows: Array<Array<string | number>>) {
  const esc = (v: string | number) => {
    const s = String(v ?? "");
    const needsQuotes = /[",\n]/.test(s);
    const escaped = s.replace(/"/g, '""');
    return needsQuotes ? `"${escaped}"` : escaped;
  };
  return rows.map((r) => r.map(esc).join(",")).join("\r\n");
}

function downloadCSV(baseName: string, rows: Array<Array<string | number>>) {
  const date = new Date().toISOString().slice(0, 10);
  const csv = toCSV(rows);
  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${baseName}_${date}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

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
    seconds < 3
      ? "Guardado ahora"
      : seconds < 60
      ? `Guardado hace ${seconds}s`
      : "Guardado";

  return (
    <div className="flex items-center gap-1.5 text-emerald-700 text-xs md:text-sm" role="status" aria-live="polite">
      <CheckCircle2 className="h-4 w-4" />
      {text}
    </div>
  );
}

export default function PresupuestoFlujoPage() {
  const [rows, setRows] = useState<Row[]>(DEFAULTS);
  const [savedAt, setSavedAt] = useState<number | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) setRows(parsed as Row[]);
      }
    } catch {
      // Ignorar errores de parseo de storage.
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(rows));
      setSavedAt(Date.now());
    } catch {
      // Ignorar errores de escritura de storage.
    }
  }, [rows]);

  const totals = useMemo(() => {
    let income = 0;
    let expense = 0;

    for (const r of rows) {
      const val = toNumber(r.amount);
      if (r.type === "Ingreso") income += val;
      else expense += val;
    }

    const net = income - expense;
    const rate = income > 0 ? net / income : 0;
    return { income, expense, net, rate };
  }, [rows]);

  function addRow(kind: Tipo) {
    setRows((r) => [...r, { id: uid(), type: kind, category: "", amount: "", notes: "" }]);
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
    } catch {
      // Ignorar errores al limpiar storage.
    }
  }

  function exportCSV() {
    const data: Array<Array<string | number>> = [
      ["Tipo", "Categoría", "Monto (Mensual)", "Notas"],
      ...rows.map((r) => [r.type, r.category, r.amount || "", r.notes || ""]),
      [],
      ["Total Ingresos", "", totals.income, ""],
      ["Total Gastos", "", totals.expense, ""],
      ["Neto Mensual", "", totals.net, ""],
      ["Tasa de Ahorro", "", `${(totals.rate * 100).toFixed(1)}%`, ""],
    ];

    downloadCSV("presupuesto_flujo", data);
  }

  function onResetConfirm() {
    const ok = window.confirm(
      "¿Restablecer todas las filas a la plantilla predeterminada? Esto borrará los datos guardados de esta página."
    );
    if (ok) resetAll();
  }

  return (
    <ToolShell
      lang="es"
      title="Hoja de Presupuesto y Flujo de Caja"
      subtitle="Registra ingresos y gastos mensuales con notas. Se guarda automáticamente en este navegador."
    >
      <div className="tool-actions">
        <button type="button" onClick={exportCSV} className="tool-btn-green">
          Exportar (CSV)
        </button>
        <button type="button" onClick={() => window.print()} className="tool-btn-blue">
          Imprimir o guardar PDF
        </button>
        <button type="button" onClick={onResetConfirm} className="tool-btn-gold">
          Restablecer valores
        </button>
      </div>

      <section className="tool-card-compact mb-6">
        <div className="text-center">
          <h2 className="text-2xl font-brand font-semibold text-brand-green">Resumen mensual de presupuesto</h2>
          <p className="mt-2 text-brand-blue/90 max-w-3xl mx-auto">
            Mantén esta hoja práctica: captura tu realidad actual y ajústala cada mes.
          </p>
          <div className="mt-3 flex flex-wrap gap-2 justify-center items-center text-sm text-brand-blue/80">
            <span>Privado en tu navegador</span>
            <span className="mx-1 text-brand-body/70 hidden sm:inline">•</span>
            <Link href="/es/herramientas/seguimiento-patrimonio-neto" className="underline text-brand-blue hover:text-brand-green">
              También te puede servir: Patrimonio neto
            </Link>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4 flex-1">
            <SummaryCard label="Ingresos Totales (mensual)" value={currency.format(totals.income)} />
            <SummaryCard label="Gastos Totales (mensual)" value={currency.format(totals.expense)} />
            <SummaryCard
              label="Neto (Ingresos - Gastos)"
              value={currency.format(totals.net)}
              emphasis={totals.net >= 0 ? "good" : "bad"}
            />
            <SummaryCard
              label="Tasa de Ahorro"
              value={`${(totals.rate * 100).toFixed(1)}%`}
              emphasis={totals.rate >= 0.2 ? "good" : totals.rate < 0 ? "bad" : "muted"}
            />
          </div>
          <SavedIndicator savedAt={savedAt} />
        </div>
      </section>

      <section className="tool-card">
        <div className="mb-4 flex flex-wrap gap-2 justify-between items-center print:hidden">
          <div className="flex gap-2 flex-wrap">
            <button type="button" onClick={() => addRow("Ingreso")} className="tool-btn-green">
              <PlusCircle className="h-4 w-4" />
              Agregar Ingreso
            </button>
            <button type="button" onClick={() => addRow("Gasto")} className="tool-btn-blue">
              <PlusCircle className="h-4 w-4" />
              Agregar Gasto
            </button>
          </div>
        </div>

        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-sm md:text-base">
            <thead>
              <tr className="bg-brand-gold/15 text-left">
                <th className="p-3 rounded-l-xl">Tipo</th>
                <th className="p-3">Categoría</th>
                <th className="p-3">Monto (Mensual)</th>
                <th className="p-3">Notas</th>
                <th className="p-3 rounded-r-xl" />
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="border-b border-brand-green/20">
                  <td className="p-2 align-top">
                    <label className="sr-only" htmlFor={`type-${r.id}`}>Tipo</label>
                    <select
                      id={`type-${r.id}`}
                      value={r.type}
                      onChange={(e) => updateRow(r.id, { type: e.target.value as Tipo })}
                      className="tool-field"
                    >
                      <option>Ingreso</option>
                      <option>Gasto</option>
                    </select>
                  </td>
                  <td className="p-2 align-top">
                    <label className="sr-only" htmlFor={`cat-${r.id}`}>Categoría</label>
                    <input
                      id={`cat-${r.id}`}
                      value={r.category}
                      onChange={(e) => updateRow(r.id, { category: e.target.value })}
                      className="tool-field"
                      placeholder="Categoría"
                    />
                  </td>
                  <td className="p-2 align-top">
                    <label className="sr-only" htmlFor={`amt-${r.id}`}>Monto</label>
                    <input
                      id={`amt-${r.id}`}
                      value={r.amount}
                      onChange={(e) => {
                        const v = e.target.value.replace(/[^\d.,-]/g, "");
                        updateRow(r.id, { amount: v });
                      }}
                      className="tool-field text-right"
                      inputMode="decimal"
                      placeholder="0.00"
                    />
                  </td>
                  <td className="p-2 align-top">
                    <label className="sr-only" htmlFor={`notes-${r.id}`}>Notas</label>
                    <input
                      id={`notes-${r.id}`}
                      value={r.notes || ""}
                      onChange={(e) => updateRow(r.id, { notes: e.target.value })}
                      className="tool-field"
                      placeholder="Opcional"
                    />
                  </td>
                  <td className="p-2 align-top text-right">
                    <button
                      type="button"
                      onClick={() => removeRow(r.id)}
                      title="Eliminar fila"
                      aria-label="Eliminar fila"
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
                <td className="p-3 text-right">Total Ingresos:</td>
                <td className="p-3 text-right">{currency.format(totals.income)}</td>
                <td className="p-3" colSpan={2} />
              </tr>
              <tr className="font-semibold">
                <td className="p-3" />
                <td className="p-3 text-right">Total Gastos:</td>
                <td className="p-3 text-right">{currency.format(totals.expense)}</td>
                <td className="p-3" colSpan={2} />
              </tr>
              <tr className={`font-bold ${totals.net >= 0 ? "text-brand-green" : "text-red-600"}`}>
                <td className="p-3" />
                <td className="p-3 text-right">Neto Mensual:</td>
                <td className="p-3 text-right">{currency.format(totals.net)}</td>
                <td className="p-3" colSpan={2} />
              </tr>
              <tr className="font-semibold">
                <td className="p-3" />
                <td className="p-3 text-right">Tasa de Ahorro:</td>
                <td className="p-3 text-right">{(totals.rate * 100).toFixed(1)}%</td>
                <td className="p-3" colSpan={2} />
              </tr>
            </tfoot>
          </table>
        </div>

        <div className="md:hidden grid gap-2">
          {rows.map((r) => (
            <div key={r.id} className="relative rounded-xl border border-brand-gold/40 bg-white p-3">
              <button
                type="button"
                onClick={() => removeRow(r.id)}
                title="Eliminar fila"
                aria-label="Eliminar fila"
                className="absolute right-2 top-2 p-1 rounded-md text-red-600 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-300"
              >
                <Trash2 className="h-4 w-4" />
              </button>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <div className="text-[11px] text-brand-blue/70">Tipo</div>
                  <select
                    value={r.type}
                    onChange={(e) => updateRow(r.id, { type: e.target.value as Tipo })}
                    className="tool-field"
                  >
                    <option>Ingreso</option>
                    <option>Gasto</option>
                  </select>
                </div>
                <div>
                  <div className="text-[11px] text-brand-blue/70">Monto (Mensual)</div>
                  <input
                    value={r.amount}
                    onChange={(e) => {
                      const v = e.target.value.replace(/[^\d.,-]/g, "");
                      updateRow(r.id, { amount: v });
                    }}
                    className="tool-field text-right"
                    inputMode="decimal"
                    placeholder="0.00"
                  />
                </div>
                <div className="col-span-2">
                  <div className="text-[11px] text-brand-blue/70">Categoría</div>
                  <input
                    value={r.category}
                    onChange={(e) => updateRow(r.id, { category: e.target.value })}
                    className="tool-field"
                    placeholder="Categoría"
                  />
                </div>
                <div className="col-span-2">
                  <div className="text-[11px] text-brand-blue/70">Notas</div>
                  <input
                    value={r.notes || ""}
                    onChange={(e) => updateRow(r.id, { notes: e.target.value })}
                    className="tool-field"
                    placeholder="Opcional"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 flex md:hidden gap-2">
          <button type="button" onClick={() => addRow("Ingreso")} className="tool-btn-green flex-1">
            <PlusCircle className="h-4 w-4" />
            Agregar Ingreso
          </button>
          <button type="button" onClick={() => addRow("Gasto")} className="tool-btn-blue flex-1">
            <PlusCircle className="h-4 w-4" />
            Agregar Gasto
          </button>
        </div>
      </section>

      <section className="tool-card-compact mt-6">
        <p className="text-sm text-brand-blue/80">
          Herramienta educativa. Los resultados son estimaciones para planificación y no sustituyen asesoría legal, fiscal o hipotecaria.
        </p>
        <div className="mt-3 flex flex-wrap gap-3 text-sm">
          <Link href="/es/herramientas/calculadora-hipotecaria" className="underline text-brand-blue hover:text-brand-green">
            Calculadora Hipotecaria
          </Link>
          <Link href="/es/herramientas/seguimiento-patrimonio-neto" className="underline text-brand-blue hover:text-brand-green">
            Seguimiento de Patrimonio Neto
          </Link>
          <Link href="/es/herramientas/deuda-bola-nieve" className="underline text-brand-blue hover:text-brand-green">
            Pago de Deudas
          </Link>
        </div>
      </section>

      <style jsx global>{`
        @media print {
          .tool-actions,
          [data-tool-shell] > header,
          .print\\:hidden {
            display: none !important;
          }
          [data-tool-shell] {
            background: white !important;
          }
          section {
            break-inside: avoid;
            page-break-inside: avoid;
          }
          table {
            page-break-inside: auto;
          }
          tr {
            page-break-inside: avoid;
            page-break-after: auto;
          }
        }
      `}</style>
    </ToolShell>
  );
}
