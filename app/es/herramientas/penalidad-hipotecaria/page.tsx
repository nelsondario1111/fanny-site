"use client";

import { useMemo, useState } from "react";
import ToolShell from "@/components/ToolShell";
import { FaPrint, FaFileCsv } from "react-icons/fa";

/* =========================================================
   Tipos y constantes
   ========================================================= */
type MortgageType = "fixed" | "variable";

const TERM_MONTH_OPTIONS = [3, 6, 9, 12, 18, 24, 30, 36, 48, 60, 72];

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
/** CSV robusto (comillas + CRLF + BOM para Excel) */
function toCSV(rows: Array<Array<string | number>>) {
  const esc = (v: string | number) => {
    const s = String(v ?? "");
    const needs = /[",\n]/.test(s);
    const q = s.replace(/"/g, '""');
    return needs ? `"${q}"` : q;
  };
  return rows.map(r => r.map(esc).join(",")).join("\r\n");
}
function downloadCSV(baseName: string, rows: Array<Array<string | number>>) {
  const iso = new Date().toISOString().slice(0, 10);
  const csv = toCSV(rows);
  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${baseName}_${iso}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

/* Fórmulas base de penalidad (simplificadas; cada prestamista puede variar) */
function threeMonthInterest(balance: number, annualRatePct: number) {
  const i = Math.max(0, annualRatePct) / 100;
  return balance * i * (3 / 12);
}
/** IRD (diferencial de tasa simple): saldo × (tasa contrato − tasa comparativa) × (meses restantes ÷ 12) */
function irdSimple(balance: number, contractRatePct: number, comparisonRatePct: number, remainingMonths: number) {
  const diff = Math.max(0, (contractRatePct - comparisonRatePct)) / 100;
  return balance * diff * Math.max(0, remainingMonths) / 12;
}

/* =========================================================
   Página
   ========================================================= */
export default function Page() {
  // Entradas
  const [mortgageType, setMortgageType] = useState<MortgageType>("fixed");
  const [outstandingBalance, setOutstandingBalance] = useState<number>(520_000);
  const [contractRatePct, setContractRatePct] = useState<number>(4.89); // tasa contractual original (anual)
  const [remainingMonths, setRemainingMonths] = useState<number>(24);
  const [comparisonRatePct, setComparisonRatePct] = useState<number>(3.39); // tasa comparable actual del prestamista para el plazo restante
  const [adminFee, setAdminFee] = useState<number>(300); // tarifa de gestión/liberación (opcional)

  const printDate = new Date().toLocaleDateString("es-CA", { year: "numeric", month: "long", day: "numeric" });

  // Derivados
  const {
    penalty3mo,
    penaltyIRD,
    basePenalty,
    recommendedPenalty,
    ruleText,
    totalWithFees,
  } = useMemo(() => {
    const p3 = threeMonthInterest(outstandingBalance || 0, contractRatePct || 0);
    const ird = irdSimple(outstandingBalance || 0, contractRatePct || 0, comparisonRatePct || 0, remainingMonths || 0);

    // Regla típica del prestamista
    const rule =
      mortgageType === "fixed"
        ? "Para hipotecas a tasa fija, normalmente se cobra la mayor entre IRD o el interés de 3 meses."
        : "Para hipotecas a tasa variable, normalmente se cobra el interés de 3 meses.";

    const base = mortgageType === "fixed" ? Math.max(ird, p3) : p3;

    const recommended = base;
    const total = Math.max(0, recommended) + Math.max(0, adminFee || 0);

    return {
      penalty3mo: p3,
      penaltyIRD: ird,
      basePenalty: base,
      recommendedPenalty: recommended,
      ruleText: rule,
      totalWithFees: total,
    };
  }, [mortgageType, outstandingBalance, contractRatePct, comparisonRatePct, remainingMonths, adminFee]);

  /* -----------------------------
     Acciones
     ----------------------------- */
  function handlePrint() {
    window.print(); // el usuario puede elegir “Guardar como PDF”
  }

  function exportCSV() {
    const rows: Array<Array<string | number>> = [
      ["Preparado", printDate],
      ["Tipo de hipoteca", mortgageType === "fixed" ? "Fija" : "Variable"],
      ["Saldo pendiente", outstandingBalance.toFixed(2)],
      ["Tasa contractual (%)", contractRatePct.toFixed(2)],
      ["Plazo restante (meses)", remainingMonths],
      ["Tasa de comparación para IRD (%)", comparisonRatePct.toFixed(2)],
      ["—", "—"],
      ["Penalidad por interés de 3 meses", penalty3mo.toFixed(2)],
      ["Penalidad IRD (simple)", penaltyIRD.toFixed(2)],
      ["Penalidad base (según regla)", basePenalty.toFixed(2)],
      ["Tarifa administrativa / liberación", (adminFee || 0).toFixed(2)],
      ["Total estimado", totalWithFees.toFixed(2)],
      ["—", "—"],
      ["Notas", "Resultados estimados; los métodos del prestamista varían (tasas publicadas, método de descuento, cómputo de días)."],
    ];
    downloadCSV("penalidad_hipotecaria_estimacion", rows);
  }

  function resetExample() {
    setMortgageType("fixed");
    setOutstandingBalance(520_000);
    setContractRatePct(4.89);
    setRemainingMonths(24);
    setComparisonRatePct(3.39);
    setAdminFee(300);
  }

  /* -----------------------------
     Render
     ----------------------------- */
  return (
    <ToolShell
      title="Penalidad Hipotecaria (pago anticipado)"
      subtitle="Estima penalidades por pago anticipado usando interés de 3 meses y un modelo IRD simple. Exporta PDF o CSV."
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
          onClick={exportCSV}
          className="px-4 py-2 bg-white border-2 border-brand-blue text-brand-blue rounded-full inline-flex items-center gap-2 hover:bg-brand-blue hover:text-white transition"
          title="Exportar un resumen de tus entradas y resultados"
        >
          <FaFileCsv aria-hidden /> Exportar CSV
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
      <form className="grid xl:grid-cols-3 gap-6">
        {/* Básicos de la hipoteca */}
        <section className="rounded-2xl border border-brand-gold bg-white p-5 grid gap-3">
          <h3 className="font-serif text-lg text-brand-green font-bold">Básicos de la hipoteca</h3>

          <div>
            <label className="block text-sm font-medium text-brand-blue mb-1">Tipo de hipoteca</label>
            <div className="flex gap-4">
              <label className="inline-flex items-center gap-2">
                <input
                  type="radio"
                  name="mortType"
                  checked={mortgageType === "fixed"}
                  onChange={() => setMortgageType("fixed")}
                />
                <span>Fija</span>
              </label>
              <label className="inline-flex items-center gap-2">
                <input
                  type="radio"
                  name="mortType"
                  checked={mortgageType === "variable"}
                  onChange={() => setMortgageType("variable")}
                />
                <span>Variable</span>
              </label>
            </div>
            <p className="text-xs text-brand-blue/70 mt-1">{ruleText}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-brand-blue mb-1">Saldo pendiente (CAD)</label>
            <input
              type="number"
              min={0}
              inputMode="decimal"
              className="w-full rounded-xl border border-brand-gold/60 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-gold"
              value={outstandingBalance}
              onChange={(e) => setOutstandingBalance(Number(e.target.value || 0))}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-brand-blue mb-1">Tasa contractual (anual %)</label>
              <input
                type="number"
                min={0}
                max={25}
                step={0.01}
                inputMode="decimal"
                className="w-full rounded-xl border border-brand-gold/60 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-gold"
                value={contractRatePct}
                onChange={(e) => setContractRatePct(Number(e.target.value || 0))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-brand-blue mb-1">Plazo restante (meses)</label>
              <select
                className="w-full rounded-xl border border-brand-gold/60 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-gold"
                value={remainingMonths}
                onChange={(e) => setRemainingMonths(Number(e.target.value))}
              >
                {TERM_MONTH_OPTIONS.map(m => <option key={m} value={m}>{m}</option>)}
                <option value={remainingMonths}>Personalizado: {remainingMonths}</option>
              </select>
              <input
                type="number"
                min={1}
                step={1}
                className="mt-2 w-full rounded-xl border border-brand-gold/60 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-gold"
                value={remainingMonths}
                onChange={(e) => setRemainingMonths(Number(e.target.value || 0))}
                aria-label="Plazo restante personalizado en meses"
              />
            </div>
          </div>
        </section>

        {/* Entradas para IRD */}
        <section className="rounded-2xl border border-brand-gold bg-white p-5">
          <h3 className="font-serif text-lg text-brand-green font-bold mb-2">Entradas IRD (simple)</h3>
          <p className="text-sm text-brand-blue/80 mb-3">
            El IRD puede variar según el prestamista. Aquí usamos un enfoque simple:{" "}
            <b>Saldo × (Tasa contractual − Tasa comparativa) × (Meses restantes ÷ 12)</b>.
            Para un cálculo más cercano, ingresa la tasa comparable actual de tu prestamista para el plazo restante.
          </p>

          <div className="grid md:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-brand-blue mb-1">Tasa de comparación (% anual)</label>
              <input
                type="number"
                min={0}
                max={25}
                step={0.01}
                inputMode="decimal"
                className="w-full rounded-xl border border-brand-gold/60 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-gold"
                value={comparisonRatePct}
                onChange={(e) => setComparisonRatePct(Number(e.target.value || 0))}
              />
              <p className="text-xs text-brand-blue/70 mt-1">
                Usualmente la tasa publicada/con descuento del prestamista para un plazo que coincide con tus meses restantes.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-brand-blue mb-1">Tarifa administrativa / liberación (opcional, CAD)</label>
              <input
                type="number"
                min={0}
                inputMode="decimal"
                className="w-full rounded-xl border border-brand-gold/60 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-gold"
                value={adminFee}
                onChange={(e) => setAdminFee(Number(e.target.value || 0))}
              />
              <p className="text-xs text-brand-blue/70 mt-1">Algunos prestamistas agregan un cargo fijo de tramitación o liberación.</p>
            </div>
          </div>
        </section>

        {/* Resultados rápidos */}
        <section className="rounded-2xl border border-brand-gold bg-white p-5 avoid-break">
          <h3 className="font-serif text-lg text-brand-green font-bold mb-2">Resultados rápidos</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Interés de 3 meses</span>
              <span className="font-medium">{money(penalty3mo, 0)}</span>
            </div>
            <div className="flex justify-between">
              <span>IRD (simple)</span>
              <span className="font-medium">{money(penaltyIRD, 0)}</span>
            </div>
            <div className="flex justify-between border-t pt-2 mt-2">
              <span>Penalidad base (según regla)</span>
              <span className="font-semibold">{money(basePenalty, 0)}</span>
            </div>
            <div className="flex justify-between">
              <span>Tarifa administrativa / liberación</span>
              <span className="font-medium">{money(adminFee || 0, 0)}</span>
            </div>
            <div className="flex justify-between">
              <span>Total estimado</span>
              <span className="font-semibold">{money(totalWithFees, 0)}</span>
            </div>
          </div>

          <details className="mt-4 rounded-xl border border-brand-gold/40 bg-brand-beige/40 p-4">
            <summary className="cursor-pointer font-semibold text-brand-green">Supuestos y notas</summary>
            <ul className="list-disc ml-5 mt-2 text-sm text-brand-blue/80 space-y-1">
              <li><b>Interés 3 meses</b> = Saldo × Tasa contractual × (3/12).</li>
              <li><b>IRD (simple)</b> = Saldo × (Contrato − Comparativa) × (Meses restantes ÷ 12).</li>
              <li>El método exacto puede usar tasas publicadas vs. con descuento, cómputos de días u otras reglas. Tu contrato manda.</li>
              <li>Algunos productos (open, blend-and-extend, portabilidad) pueden cambiar o reducir penalidades.</li>
              <li>Herramienta educativa — no constituye asesoría financiera.</li>
            </ul>
          </details>
        </section>
      </form>

      {/* Encabezado de impresión (solo al imprimir) */}
      <div className="hidden print:block mt-6 mb-3 text-center">
        <div className="font-serif font-bold text-brand-green text-2xl">Penalidad Hipotecaria — Estimación</div>
        <div className="text-xs text-brand-blue">Preparado {printDate}</div>
        <div className="w-16 h-[2px] bg-brand-gold rounded-full mx-auto mt-2" />
      </div>

      {/* Paneles comparativos */}
      <div className="mt-8 grid lg:grid-cols-2 gap-6">
        <section className="rounded-2xl border border-brand-gold bg-white p-5 avoid-break">
          <h3 className="font-serif text-xl text-brand-green font-bold mb-2">Detalle — Interés 3 meses</h3>
          <p className="text-sm text-brand-blue/80 mb-2">
            Normalmente aplicado a hipotecas variables o cuando resulta mayor para penalidades de tasa fija.
          </p>
          <div className="text-sm space-y-1">
            <div className="flex justify-between"><span>Saldo pendiente</span><span className="font-medium">{money(outstandingBalance)}</span></div>
            <div className="flex justify-between"><span>Tasa contractual</span><span className="font-medium">{contractRatePct.toFixed(2)}%</span></div>
            <div className="flex justify-between"><span>Penalidad (3 meses)</span><span className="font-semibold">{money(penalty3mo)}</span></div>
          </div>
        </section>

        <section className="rounded-2xl border border-brand-gold bg-white p-5 avoid-break">
          <h3 className="font-serif text-xl text-brand-green font-bold mb-2">Detalle — IRD (simple)</h3>
          <p className="text-sm text-brand-blue/80 mb-2">
            Esta estimación compara tu tasa contractual con una tasa comparable actual.
          </p>
          <div className="text-sm space-y-1">
            <div className="flex justify-between"><span>Saldo pendiente</span><span className="font-medium">{money(outstandingBalance)}</span></div>
            <div className="flex justify-between"><span>Tasa contractual</span><span className="font-medium">{contractRatePct.toFixed(2)}%</span></div>
            <div className="flex justify-between"><span>Tasa de comparación</span><span className="font-medium">{comparisonRatePct.toFixed(2)}%</span></div>
            <div className="flex justify-between"><span>Plazo restante</span><span className="font-medium">{remainingMonths} meses</span></div>
            <div className="flex justify-between"><span>Penalidad (IRD)</span><span className="font-semibold">{money(penaltyIRD)}</span></div>
          </div>
        </section>
      </div>

      {/* Estilos de impresión */}
      <style jsx global>{`
        @media print {
          .print\\:hidden { display: none !important; }
          main { background: white !important; }
          .avoid-break { break-inside: avoid; page-break-inside: avoid; }
        }
      `}</style>
    </ToolShell>
  );
}
