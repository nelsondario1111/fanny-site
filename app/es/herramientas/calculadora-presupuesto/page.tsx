// app/es/calculadora-presupuesto/page.tsx
"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import { FaCalculator, FaPrint, FaPlus, FaTrash, FaQuestionCircle } from "react-icons/fa";

/* ---------- Helpers de estilo compartidos ---------- */
function Panel({
  children,
  className = "",
  as: Tag = "section" as const,
}: {
  children: React.ReactNode;
  className?: string;
  as?: any;
}) {
  return (
    <Tag
      className={[
        "max-w-6xl mx-auto px-5 sm:px-8 py-8 sm:py-12",
        "bg-white/95 rounded-[28px] border border-brand-gold shadow-xl",
        "backdrop-blur-[1px]",
        className,
      ].join(" ")}
    >
      {children}
    </Tag>
  );
}

function SectionTitle({
  title,
  subtitle,
  center = true,
}: {
  title: string;
  subtitle?: React.ReactNode;
  center?: boolean;
}) {
  return (
    <div className={center ? "text-center mb-6" : "mb-6"}>
      <h1 className="font-serif font-extrabold text-4xl md:text-5xl text-brand-green tracking-tight">
        {title}
      </h1>
      <div className="flex justify-center my-4">
        <div className="w-16 h-[3px] rounded-full bg-brand-gold" />
      </div>
      {subtitle && (
        <p className="text-brand-blue/90 text-lg md:text-xl max-w-3xl mx-auto">{subtitle}</p>
      )}
    </div>
  );
}
/* --------------------------------------------------- */

type ExpenseRow = { id: string; name: string; value: string };

const DEFAULT_ROWS: ExpenseRow[] = [
  { id: crypto.randomUUID(), name: "Vivienda", value: "" },
  { id: crypto.randomUUID(), name: "Servicios", value: "" },
  { id: crypto.randomUUID(), name: "Supermercado", value: "" },
  { id: crypto.randomUUID(), name: "Transporte", value: "" },
  { id: crypto.randomUUID(), name: "Seguros", value: "" },
  { id: crypto.randomUUID(), name: "Salud", value: "" },
  { id: crypto.randomUUID(), name: "Ahorros", value: "" },
  { id: crypto.randomUUID(), name: "Donaciones", value: "" },
  { id: crypto.randomUUID(), name: "Otros", value: "" },
];

const fmt = (n: number) =>
  n.toLocaleString("es-CA", {
    style: "currency",
    currency: "CAD",
    maximumFractionDigits: 0,
  });

export default function CalculadoraPresupuesto() {
  const [ingreso, setIngreso] = useState<string>("");
  const [rows, setRows] = useState<ExpenseRow[]>(DEFAULT_ROWS);
  const [mostrarResultados, setMostrarResultados] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);

  const ingresoNum = parseFloat(ingreso) || 0;

  const totalGastos = useMemo(
    () => rows.reduce((sum, r) => sum + (parseFloat(r.value) || 0), 0),
    [rows]
  );

  const neto = ingresoNum - totalGastos;
  const gastoPct = ingresoNum > 0 ? (totalGastos / ingresoNum) * 100 : 0;
  const filaAhorro = rows.find((r) => r.name.toLowerCase() === "ahorros");
  const montoAhorro = parseFloat(filaAhorro?.value || "0") || 0;
  const ahorroPct = ingresoNum > 0 ? (montoAhorro / ingresoNum) * 100 : 0;

  // Referencia 50/30/20 (Necesidades / Gustos / Ahorro)
  const cincuenta = ingresoNum * 0.5;
  const treinta = ingresoNum * 0.3;
  const veinte = ingresoNum * 0.2;

  function updateRow(id: string, patch: Partial<ExpenseRow>) {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  }

  function addRow() {
    setRows((prev) => [
      ...prev,
      { id: crypto.randomUUID(), name: "Nueva categoría", value: "" },
    ]);
  }

  function deleteRow(id: string) {
    setRows((prev) => prev.filter((r) => r.id !== id));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMostrarResultados(true);
    setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
  }

  function handleReset() {
    setIngreso("");
    setRows(DEFAULT_ROWS.map((r) => ({ ...r, value: "" })));
    setMostrarResultados(false);
  }

  function handlePrint() {
    window.print();
  }

  const hoy = new Date();
  const fechaImpresion = hoy.toLocaleDateString("es-CA", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <main className="bg-brand-beige min-h-screen pb-16 print:bg-white">
      {/* HERO */}
      <header className="pt-10 px-4 print:hidden">
        <Panel as="div">
          <SectionTitle
            title="Calculadora de Presupuesto"
            subtitle={
              <>
                Crea un presupuesto alineado con tu vida, valores y fortalezas. Privada, bilingüe y fácil de imprimir—para que realmente la uses cada mes.
              </>
            }
          />
          {/* enlace a la hoja detallada */}
          <div className="text-center -mt-2 mb-2">
            <Link
              href="/es/herramientas/presupuesto-flujo"
              className="underline text-brand-blue hover:text-brand-green"
            >
              ¿Necesitas un registro mensual detallado con múltiples líneas de ingreso? Usa la hoja Presupuesto y Flujo →
            </Link>
          </div>
        </Panel>
      </header>

      {/* FORMULARIO */}
      <section className="px-4 mt-8 print:mt-0">
        <Panel as="form" onSubmit={handleSubmit} className="print:hidden">
          <div className="flex items-center gap-3 mb-6">
            <FaCalculator className="text-brand-gold text-2xl" aria-hidden />
            <h2 className="font-serif text-2xl md:text-3xl text-brand-green font-bold m-0">
              Ingresa tus montos mensuales
            </h2>
          </div>

          {/* Ingreso */}
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            <label className="md:col-span-1 font-semibold text-brand-blue" htmlFor="ingreso">
              Ingreso mensual (CAD)
            </label>
            <input
              id="ingreso"
              type="number"
              min={0}
              inputMode="decimal"
              value={ingreso}
              onChange={(e) => setIngreso(e.target.value)}
              className="md:col-span-2 w-full px-4 py-3 rounded-xl border-2 border-brand-green/30 bg-white text-brand-body placeholder:text-brand-body/60 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/30 outline-none"
              placeholder="p. ej., 6500"
              required
            />
          </div>

          {/* Tabla de gastos */}
          <div className="rounded-2xl border border-brand-gold/60 overflow-hidden">
            <div className="grid grid-cols-12 bg-brand-beige/60 text-brand-green font-serif font-semibold py-3 px-4">
              <div className="col-span-6">Categoría</div>
              <div className="col-span-4 text-right">Monto (CAD)</div>
              <div className="col-span-2 text-right pr-2">Acciones</div>
            </div>

            <div className="divide-y divide-brand-gold/30">
              {rows.map((r) => (
                <div key={r.id} className="grid grid-cols-12 items-center py-2 px-4">
                  <div className="col-span-6">
                    <input
                      aria-label="Categoría de gasto"
                      value={r.name}
                      onChange={(e) => updateRow(r.id, { name: e.target.value })}
                      className="w-full bg-transparent border-b border-transparent focus:border-brand-blue outline-none text-brand-body py-1"
                    />
                  </div>
                  <div className="col-span-4 text-right">
                    <input
                      aria-label={`Monto para ${r.name}`}
                      value={r.value}
                      inputMode="decimal"
                      type="number"
                      min={0}
                      onChange={(e) => updateRow(r.id, { value: e.target.value })}
                      className="w-full text-right bg-white/60 border border-brand-green/30 rounded-lg px-3 py-2 focus:border-brand-blue outline-none"
                    />
                  </div>
                  <div className="col-span-2 text-right">
                    <button
                      type="button"
                      className="inline-flex items-center gap-2 text-brand-blue hover:text-red-600 transition px-2 py-1"
                      onClick={() => deleteRow(r.id)}
                      aria-label={`Eliminar ${r.name}`}
                      title="Eliminar fila"
                    >
                      <FaTrash aria-hidden />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center bg-white/70 py-3 px-4">
              <button
                type="button"
                onClick={addRow}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full border text-brand-green border-brand-green hover:bg-brand-green hover:text-white transition"
              >
                <FaPlus aria-hidden /> Añadir categoría
              </button>
              <div className="text-brand-blue font-semibold">
                Gastos totales (actual): {fmt(totalGastos)}
              </div>
            </div>
          </div>

          {/* Acciones */}
          <div className="mt-6 grid sm:grid-cols-3 gap-3">
            <button
              type="submit"
              className="px-6 py-3 bg-brand-gold text-brand-green font-serif font-bold rounded-full shadow hover:bg-brand-blue hover:text-white transition"
            >
              Calcular
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="px-6 py-3 border-2 border-brand-gold text-brand-green font-serif font-bold rounded-full hover:bg-brand-gold hover:text-white transition"
            >
              Restablecer
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="px-6 py-3 bg-brand-blue text-white font-serif font-bold rounded-full shadow hover:bg-brand-gold hover:text-brand-green transition"
            >
              Imprimir (PDF)
            </button>
          </div>
        </Panel>
      </section>

      {/* RESULTADOS */}
      {mostrarResultados && (
        <section ref={resultsRef} className="px-4 mt-8">
          <Panel>
            <div className="grid lg:grid-cols-2 gap-10">
              {/* Resumen */}
              <div>
                <h2 className="font-serif text-3xl text-brand-green font-bold mb-4">
                  Tus resultados
                </h2>
                <div className="rounded-2xl border border-brand-gold/60 p-5 bg-white/70">
                  <div className="flex justify-between py-2 text-brand-body text-lg">
                    <span className="font-semibold text-brand-blue">Ingresos totales</span>
                    <span className="font-semibold">{fmt(ingresoNum)}</span>
                  </div>
                  <div className="flex justify-between py-2 text-brand-body text-lg">
                    <span className="font-semibold text-brand-blue">Gastos totales</span>
                    <span className="font-semibold">{fmt(totalGastos)}</span>
                  </div>
                  <div
                    className={`flex justify-between py-3 text-xl font-bold ${
                      neto >= 0 ? "text-brand-green" : "text-red-600"
                    }`}
                  >
                    <span>{neto >= 0 ? "Sobrante (Neto)" : "Déficit (Neto)"}</span>
                    <span>{fmt(Math.abs(neto))}</span>
                  </div>

                  {/* % de gasto */}
                  <div className="mt-4">
                    <div className="flex justify-between text-sm text-brand-body/80">
                      <span>Gasto como % del ingreso</span>
                      <span>{ingresoNum ? `${gastoPct.toFixed(0)}%` : "—"}</span>
                    </div>
                    <div className="h-3 w-full bg-brand-beige rounded-full overflow-hidden border border-brand-gold/40">
                      <div
                        className="h-full bg-brand-green transition-all"
                        style={{ width: `${Math.min(gastoPct, 100)}%` }}
                      />
                    </div>
                  </div>

                  {/* % de ahorro */}
                  <div className="mt-3">
                    <div className="flex justify-between text-sm text-brand-body/80">
                      <span>Ahorro como % del ingreso</span>
                      <span>{ingresoNum ? `${ahorroPct.toFixed(0)}%` : "—"}</span>
                    </div>
                    <div className="h-3 w-full bg-brand-beige rounded-full overflow-hidden border border-brand-gold/40">
                      <div
                        className="h-full bg-brand-blue transition-all"
                        style={{ width: `${Math.min(ahorroPct, 100)}%` }}
                      />
                    </div>
                  </div>

                  {/* Meta de impresión */}
                  <div className="hidden print:block mt-6 text-sm text-brand-body/80">
                    Preparado el {fechaImpresion} · fannysamaniego.com
                  </div>
                </div>

                {/* Detalle de gastos */}
                <div className="mt-8">
                  <h3 className="font-serif text-xl text-brand-blue font-bold mb-2">
                    Desglose de gastos
                  </h3>
                  <table className="w-full text-left border-separate border-spacing-y-1">
                    <thead>
                      <tr className="text-sm text-brand-body/70">
                        <th className="py-1 pr-2">Categoría</th>
                        <th className="py-1 pr-2 text-right">Monto</th>
                        <th className="py-1 pr-2 text-right">% del ingreso</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rows.map((r) => {
                        const val = parseFloat(r.value) || 0;
                        const pct = ingresoNum ? (val / ingresoNum) * 100 : 0;
                        return (
                          <tr key={r.id} className="bg-white/70">
                            <td className="py-2 pl-3 text-brand-green">{r.name}</td>
                            <td className="py-2 pr-3 text-right text-brand-blue">{fmt(val)}</td>
                            <td className="py-2 pr-3 text-right text-brand-body/80">
                              {ingresoNum ? `${pct.toFixed(0)}%` : "—"}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 50/30/20 */}
              <div>
                <h3 className="font-serif text-2xl text-brand-green font-bold mb-3">
                  Instantánea 50/30/20 (Referencia)
                </h3>
                <p className="text-brand-body mb-4">
                  Una verificación rápida según un estándar clásico. Ajusta según tus valores y tu momento de vida.
                </p>

                <div className="space-y-4">
                  <div className="rounded-2xl border border-brand-gold/60 p-4 bg-white/70">
                    <div className="flex justify-between">
                      <div className="font-serif font-semibold text-brand-blue">Necesidades (≈50%)</div>
                      <div className="font-semibold">{fmt(cincuenta)}</div>
                    </div>
                    <div className="text-sm text-brand-body/80 mt-1">
                      Vivienda, servicios, supermercado, seguros, salud, transporte.
                    </div>
                  </div>

                  <div className="rounded-2xl border border-brand-gold/60 p-4 bg-white/70">
                    <div className="flex justify-between">
                      <div className="font-serif font-semibold text-brand-blue">Gustos (≈30%)</div>
                      <div className="font-semibold">{fmt(treinta)}</div>
                    </div>
                    <div className="text-sm text-brand-body/80 mt-1">
                      Salidas, entretenimiento, viajes, compras.
                    </div>
                  </div>

                  <div className="rounded-2xl border border-brand-gold/60 p-4 bg-white/70">
                    <div className="flex justify-between">
                      <div className="font-serif font-semibold text-brand-blue">Ahorro/Deuda (≈20%)</div>
                      <div className="font-semibold">{fmt(veinte)}</div>
                    </div>
                    <div className="text-sm text-brand-body/80 mt-1">
                      Fondo de emergencia, inversiones, pagos de deuda, donaciones.
                    </div>
                  </div>
                </div>

                {/* Botón de impresión (solo en pantalla) */}
                <div className="mt-6 print:hidden">
                  <button
                    onClick={handlePrint}
                    type="button"
                    className="px-6 py-3 bg-brand-gold text-brand-green font-serif font-bold rounded-full shadow hover:bg-brand-blue hover:text-white transition inline-flex items-center gap-2"
                  >
                    <FaPrint aria-hidden /> Imprimir resultados (PDF)
                  </button>
                </div>

                {/* Pie de impresión */}
                <div className="hidden print:block mt-6 text-sm text-brand-body/80">
                  Nota: Ajusta las categorías a tu realidad. Esta hoja es un punto de partida para ganar claridad.
                </div>
              </div>
            </div>
          </Panel>
        </section>
      )}

      {/* FAQ / Guía */}
      <section className="px-4 mt-8 print:hidden">
        <Panel>
          <div className="flex items-center gap-2 mb-4">
            <FaQuestionCircle className="text-brand-blue text-2xl" aria-hidden />
            <h3 className="font-serif text-2xl text-brand-green font-bold m-0">
              Preguntas frecuentes y guía
            </h3>
          </div>
          <div className="grid md:grid-cols-2 gap-6 text-brand-body">
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <b>¿Qué cuenta como ingreso?</b> Tu ingreso neto (después de impuestos) más ingresos
                laterales recurrentes, beneficios o renta.
              </li>
              <li>
                <b>¿Cada cuánto debo presupuestar?</b> Mensualmente o cuando cambie tu situación.
              </li>
              <li>
                <b>¿Se guarda mi información?</b> No. Todo queda en tu navegador; no se sube nada.
              </li>
            </ul>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <b>¿Neto negativo?</b> Empieza por pequeños ajustes en “gustos” y luego revisa “necesidades”.
              </li>
              <li>
                <b>¿Quieres ayuda personalizada?</b> Podemos adaptar esto a tu diseño y a tu temporada de vida.
              </li>
            </ul>
          </div>
          <div className="mt-6 text-center">
            <a
              href="/es/contacto"
              className="inline-flex px-8 py-3 border-2 border-brand-gold text-brand-green font-serif font-bold rounded-full hover:bg-brand-gold hover:text-white transition"
              aria-label="Contactar al equipo"
            >
              Contactar al equipo
            </a>
          </div>
        </Panel>
      </section>
    </main>
  );
}
