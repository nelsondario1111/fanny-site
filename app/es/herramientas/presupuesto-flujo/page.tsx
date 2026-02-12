// app/es/herramientas/presupuesto-flujo/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";

type Tipo = "Ingreso" | "Gasto";
type Row = {
  id: string;
  type: Tipo;
  category: string;
  amount: string; // se guarda como string para entrada libre; se parsea al calcular
  notes?: string;
};

const DEFAULTS: Row[] = [
  { id: "i1", type: "Ingreso", category: "Sueldo (después de impuestos)", amount: "" },
  { id: "i2", type: "Ingreso", category: "Otros ingresos", amount: "" },
  { id: "e1", type: "Gasto", category: "Renta / Hipoteca", amount: "" },
  { id: "e2", type: "Gasto", category: "Servicios (luz/agua/internet)", amount: "" },
  { id: "e3", type: "Gasto", category: "Supermercado", amount: "" },
  { id: "e4", type: "Gasto", category: "Transporte", amount: "" },
  { id: "e5", type: "Gasto", category: "Pagos de deudas", amount: "" },
  { id: "e6", type: "Gasto", category: "Ahorro / Inversión", amount: "" },
  { id: "e7", type: "Gasto", category: "Otros", amount: "" },
];

const STORAGE_KEY = "presupuesto-flujo-v1";

export default function PresupuestoFlujoPage() {
  const [rows, setRows] = useState<Row[]>(DEFAULTS);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setRows(JSON.parse(raw));
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(rows));
    } catch {}
  }, [rows]);

  const totals = useMemo(() => {
    let income = 0;
    let expense = 0;
    for (const r of rows) {
      const val = parseFloat((r.amount || "").toString().replace(/,/g, ""));
      if (!isNaN(val)) {
        if (r.type === "Ingreso") income += val;
        else expense += val;
      }
    }
    const net = income - expense;
    const rate = income > 0 ? net / income : 0;
    return { income, expense, net, rate };
  }, [rows]);

  function addRow(kind: Tipo) {
    setRows((r) => [
      ...r,
      { id: crypto.randomUUID(), type: kind, category: "", amount: "" },
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
    const headers = ["Tipo", "Categoría", "Monto (Mensual)", "Notas"];
    const lines = [headers.join(",")];
    rows.forEach((r) => {
      const cells = [
        r.type,
        r.category.replace(/"/g, '""'),
        (r.amount || "").toString(),
        (r.notes || "").replace(/"/g, '""'),
      ];
      lines.push(
        cells
          .map((c) => (c.includes(",") || c.includes('"') ? `"${c}"` : c))
          .join(",")
      );
    });
    const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "Presupuesto_Flujo.csv";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  return (
    <main className="bg-brand-beige min-h-screen pt-10 pb-16 px-4">
      <section className="max-w-6xl mx-auto">
        <div className="bg-white/95 rounded-[28px] border border-brand-gold shadow-xl p-6 sm:p-10">
          <header className="text-center mb-6">
            <h1 className="font-serif font-extrabold text-3xl md:text-4xl text-brand-green tracking-tight">
              Hoja de Presupuesto y Flujo de Caja
            </h1>
            <p className="text-brand-blue/90 mt-2 max-w-2xl mx-auto">
              Ingresa montos mensuales. Para gastos anuales, divide entre 12. Tus datos se guardan en este navegador.
            </p>
            <div className="flex justify-center my-4" aria-hidden="true">
              <div className="w-16 h-[3px] rounded-full bg-brand-gold" />
            </div>
          </header>

          {/* Controles */}
          <div className="flex flex-wrap gap-2 justify-between items-center mb-4">
            <div className="flex gap-2">
              <button
                onClick={() => addRow("Ingreso")}
                className="px-4 py-2 rounded-full border-2 border-brand-green text-brand-green hover:bg-brand-green hover:text-white transition"
              >
                + Agregar ingreso
              </button>
              <button
                onClick={() => addRow("Gasto")}
                className="px-4 py-2 rounded-full border-2 border-brand-blue text-brand-blue hover:bg-brand-blue hover:text-white transition"
              >
                + Agregar gasto
              </button>
            </div>
            <div className="flex gap-2">
              <button
                onClick={exportCSV}
                className="px-4 py-2 rounded-full border-2 border-brand-green text-brand-green hover:bg-brand-green hover:text-white transition"
              >
                Exportar CSV
              </button>
              <button
                onClick={() => window.print()}
                className="px-4 py-2 rounded-full border-2 border-brand-blue text-brand-blue hover:bg-brand-blue hover:text-white transition"
              >
                Imprimir
              </button>
              <button
                onClick={resetAll}
                className="px-4 py-2 rounded-full border-2 border-brand-gold text-brand-green hover:bg-brand-gold hover:text-brand-green transition"
              >
                Reiniciar
              </button>
            </div>
          </div>

          {/* Tabla */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm md:text-base">
              <thead>
                <tr className="bg-brand-gold/15 text-left">
                  <th className="p-3 rounded-l-xl">Tipo</th>
                  <th className="p-3">Categoría</th>
                  <th className="p-3">Monto (Mensual)</th>
                  <th className="p-3">Notas</th>
                  <th className="p-3 rounded-r-xl"></th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.id} className="border-b border-brand-green/20">
                    <td className="p-2">
                      <select
                        value={r.type}
                        onChange={(e) =>
                          updateRow(r.id, { type: e.target.value as Tipo })
                        }
                        className="border rounded-lg p-2 bg-white"
                      >
                        <option>Ingreso</option>
                        <option>Gasto</option>
                      </select>
                    </td>
                    <td className="p-2">
                      <input
                        value={r.category}
                        onChange={(e) => updateRow(r.id, { category: e.target.value })}
                        className="w-full border rounded-lg p-2"
                        placeholder="Categoría"
                      />
                    </td>
                    <td className="p-2">
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
                    </td>
                    <td className="p-2">
                      <input
                        value={r.notes || ""}
                        onChange={(e) => updateRow(r.id, { notes: e.target.value })}
                        className="w-full border rounded-lg p-2"
                        placeholder="Opcional"
                      />
                    </td>
                    <td className="p-2 text-right">
                      <button
                        onClick={() => removeRow(r.id)}
                        className="px-3 py-1.5 rounded-lg border border-red-300 text-red-600 hover:bg-red-50"
                        aria-label="Eliminar fila"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="font-semibold">
                  <td className="p-3" />
                  <td className="p-3 text-right">Total Ingresos:</td>
                  <td className="p-3 text-right">
                    {totals.income.toLocaleString(undefined, {
                      style: "currency",
                      currency: "CAD",
                    })}
                  </td>
                  <td className="p-3" colSpan={2} />
                </tr>
                <tr className="font-semibold">
                  <td className="p-3" />
                  <td className="p-3 text-right">Total Gastos:</td>
                  <td className="p-3 text-right">
                    {totals.expense.toLocaleString(undefined, {
                      style: "currency",
                      currency: "CAD",
                    })}
                  </td>
                  <td className="p-3" colSpan={2} />
                </tr>
                <tr className={`font-bold ${totals.net >= 0 ? "text-brand-green" : "text-red-600"}`}>
                  <td className="p-3" />
                  <td className="p-3 text-right">Neto Mensual (Ingresos − Gastos):</td>
                  <td className="p-3 text-right">
                    {totals.net.toLocaleString(undefined, {
                      style: "currency",
                      currency: "CAD",
                    })}
                  </td>
                  <td className="p-3" colSpan={2} />
                </tr>
                <tr className="font-semibold">
                  <td className="p-3" />
                  <td className="p-3 text-right">Tasa de Ahorro (Neto / Ingresos):</td>
                  <td className="p-3 text-right">
                    {(totals.rate * 100).toFixed(1)}%
                  </td>
                  <td className="p-3" colSpan={2} />
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </section>
    </main>
  );
}
