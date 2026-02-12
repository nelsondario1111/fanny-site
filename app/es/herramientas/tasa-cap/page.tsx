"use client";

import { useMemo, useState } from "react";
import ToolShell from "@/components/ToolShell";
import { FaPrint, FaFileCsv } from "react-icons/fa";

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
function pct(n: number) {
  return `${(n * 100).toFixed(2)}%`;
}
/** Pago mensual para un préstamo totalmente amortizado */
function monthlyPayment(P: number, annualRatePct: number, years: number) {
  const n = Math.max(1, Math.round(years * 12));
  const i = Math.max(0, annualRatePct) / 100 / 12;
  if (i === 0) return P / n;
  return (P * (i * Math.pow(1 + i, n))) / (Math.pow(1 + i, n) - 1);
}
// CSV robusto (comillas + CRLF + BOM)
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

/* =========================================================
   Página
   ========================================================= */
export default function Page() {
  // Compra y costos del proyecto
  const [purchasePrice, setPurchasePrice] = useState<number>(850_000);
  const [closingCosts, setClosingCosts] = useState<number>(15_000);
  const [renoBudget, setRenoBudget] = useState<number>(5_000);

  // NOI directo (con asistente opcional para estimarlo)
  const [noiAnnual, setNoiAnnual] = useState<number>(45_000);

  // Entradas del asistente de NOI (sección colapsable)
  const [grossRentMonthly, setGrossRentMonthly] = useState<number>(4_500);
  const [vacancyPct, setVacancyPct] = useState<number>(4);
  const [otherIncomeMonthly, setOtherIncomeMonthly] = useState<number>(150);
  const [fixedExpensesMonthly, setFixedExpensesMonthly] = useState<number>(950); // impuestos+seguro+servicios+cuotas...
  const [variableExpensePctGPR, setVariableExpensePctGPR] = useState<number>(15); // admin+mantenimiento+capex como % del IGP/GPR

  // Financiamiento (opcional; para métricas apalancadas)
  const [downPct, setDownPct] = useState<number>(25);
  const [ratePct, setRatePct] = useState<number>(5.50);
  const [amortYears, setAmortYears] = useState<number>(25);

  const printDate = new Date().toLocaleDateString("es-CA", { year: "numeric", month: "long", day: "numeric" });

  /* -----------------------------
     Derivados: asistente NOI
     ----------------------------- */
  const helperNOI = useMemo(() => {
    const gprAnnual = (grossRentMonthly || 0) * 12;               // Ingreso Bruto Potencial (IGP/GPR)
    const vacancyLoss = gprAnnual * Math.max(0, vacancyPct) / 100;
    const otherInc = (otherIncomeMonthly || 0) * 12;
    const fixedAnnual = (fixedExpensesMonthly || 0) * 12;
    const variableAnnual = gprAnnual * Math.max(0, variableExpensePctGPR) / 100;
    const noi = gprAnnual - vacancyLoss + otherInc - fixedAnnual - variableAnnual;
    return Math.max(0, noi);
  }, [grossRentMonthly, vacancyPct, otherIncomeMonthly, fixedExpensesMonthly, variableExpensePctGPR]);

  /* -----------------------------
     Derivados: proyecto + financiamiento + retornos
     ----------------------------- */
  const {
    totalProjectCost,
    loanAmount,
    cashInvested,
    capRate,
    yieldOnCost,
    adsAnnual,
    dscr,
    leveredCF,
    cashOnCash,
    debtYield,
  } = useMemo(() => {
    const totalProjectCost = (purchasePrice || 0) + (closingCosts || 0) + (renoBudget || 0);

    const dpDec = Math.min(Math.max(downPct / 100, 0), 1);
    const loanAmount = Math.max(0, (purchasePrice || 0) * (1 - dpDec));
    const cashInvested = (purchasePrice || 0) * dpDec + (closingCosts || 0) + (renoBudget || 0);

    const capRate = purchasePrice > 0 ? (noiAnnual || 0) / purchasePrice : 0;
    const yieldOnCost = totalProjectCost > 0 ? (noiAnnual || 0) / totalProjectCost : 0;

    const mPmt = monthlyPayment(loanAmount, Math.max(0, ratePct), Math.max(1, amortYears));
    const adsAnnual = loanAmount > 0 ? mPmt * 12 : 0;
    const dscr = adsAnnual > 0 ? (noiAnnual || 0) / adsAnnual : NaN;

    const leveredCF = (noiAnnual || 0) - adsAnnual;
    const cashOnCash = cashInvested > 0 ? leveredCF / cashInvested : 0;

    const debtYield = loanAmount > 0 ? (noiAnnual || 0) / loanAmount : NaN;

    return {
      totalProjectCost,
      loanAmount,
      cashInvested,
      capRate,
      yieldOnCost,
      adsAnnual,
      dscr,
      leveredCF,
      cashOnCash,
      debtYield,
    };
  }, [purchasePrice, closingCosts, renoBudget, noiAnnual, downPct, ratePct, amortYears]);

  /* -----------------------------
     Acciones
     ----------------------------- */
  function handlePrint() {
    window.print(); // el usuario elige “Guardar como PDF”
  }
  function exportCSV() {
    const rows: Array<Array<string | number>> = [
      ["Clave", "Valor"],
      ["Preparado", printDate],
      ["Precio de compra", purchasePrice.toFixed(2)],
      ["Costos de cierre", closingCosts.toFixed(2)],
      ["Renovaciones iniciales (CapEx)", renoBudget.toFixed(2)],
      ["Costo total del proyecto", totalProjectCost.toFixed(2)],
      ["—", "—"],
      ["NOI (anual)", noiAnnual.toFixed(2)],
      ["Tasa Cap (NOI ÷ Precio)", (capRate * 100).toFixed(2) + "%"],
      ["Rendimiento sobre costo (NOI ÷ Costo del proyecto)", (yieldOnCost * 100).toFixed(2) + "%"],
      ["—", "—"],
      ["Pago inicial (%)", downPct.toFixed(2)],
      ["Monto del préstamo", loanAmount.toFixed(2)],
      ["Tasa (%)", ratePct.toFixed(2)],
      ["Amortización (años)", amortYears],
      ["Servicio de deuda anual (ADS)", adsAnnual.toFixed(2)],
      ["DSCR (NOI ÷ ADS)", Number.isFinite(dscr) ? dscr.toFixed(2) : "—"],
      ["Flujo de caja apalancado (NOI − ADS)", leveredCF.toFixed(2)],
      ["Efectivo invertido", cashInvested.toFixed(2)],
      ["Retorno cash-on-cash", (cashOnCash * 100).toFixed(2) + "%"],
      ["Rendimiento de la deuda (NOI ÷ Préstamo)", Number.isFinite(debtYield) ? (debtYield * 100).toFixed(2) + "%" : "—"],
      ["—", "—"],
      ["NOI del asistente (si se usa)", helperNOI.toFixed(2)],
      ["Entradas del asistente", "IGP/GPR mensual, vacancia %, otros ingresos mensuales, gastos fijos mensuales, variables % del IGP/GPR"],
      ["IGP/GPR (mensual)", grossRentMonthly.toFixed(2)],
      ["Vacancia (%)", vacancyPct.toFixed(2)],
      ["Otros ingresos (mensual)", otherIncomeMonthly.toFixed(2)],
      ["Gastos fijos (mensual)", fixedExpensesMonthly.toFixed(2)],
      ["Variables (% del IGP/GPR)", variableExpensePctGPR.toFixed(2)],
    ];
    downloadCSV("resumen_tasa_cap_cash_on_cash", rows);
  }
  function useHelperNOI() {
    setNoiAnnual(Math.round(helperNOI));
  }
  function resetExample() {
    setPurchasePrice(850_000);
    setClosingCosts(15_000);
    setRenoBudget(5_000);
    setNoiAnnual(45_000);
    setGrossRentMonthly(4_500);
    setVacancyPct(4);
    setOtherIncomeMonthly(150);
    setFixedExpensesMonthly(950);
    setVariableExpensePctGPR(15);
    setDownPct(25);
    setRatePct(5.50);
    setAmortYears(25);
  }

  /* -----------------------------
     Render
     ----------------------------- */
  return (
    <ToolShell
      title="Tasa Cap y Retorno Cash-on-Cash"
      subtitle="Evalúa oportunidades con tasa cap (sin deuda), rendimiento sobre costo y retornos apalancados con financiamiento simple."
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
          className="px-4 py-2 bg-white border-2 border-brand-gold text-brand-green rounded-full inline-flex items-center gap-2 hover:bg-brand-gold hover:text-brand-green transition"
          title="Restablecer a valores de ejemplo"
        >
          Restablecer ejemplo
        </button>
      </div>

      {/* Entradas */}
      <form className="grid xl:grid-cols-3 gap-6">
        {/* Compra y costos */}
        <section className="rounded-2xl border border-brand-gold bg-white p-5 grid gap-3">
          <h3 className="font-serif text-lg text-brand-green font-bold">Compra y costos del proyecto</h3>
          <label className="block text-sm font-medium text-brand-blue mb-1">Precio de compra (CAD)</label>
          <input
            type="number"
            min={0}
            inputMode="decimal"
            className="w-full rounded-xl border border-brand-gold/60 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-gold"
            value={purchasePrice}
            onChange={(e) => setPurchasePrice(Number(e.target.value || 0))}
          />
          <label className="block text-sm font-medium text-brand-blue mt-2 mb-1">Costos de cierre (CAD)</label>
          <input
            type="number"
            min={0}
            inputMode="decimal"
            className="w-full rounded-xl border border-brand-gold/60 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-gold"
            value={closingCosts}
            onChange={(e) => setClosingCosts(Number(e.target.value || 0))}
          />
          <label className="block text-sm font-medium text-brand-blue mt-2 mb-1">Renovaciones iniciales / CapEx (CAD)</label>
          <input
            type="number"
            min={0}
            inputMode="decimal"
            className="w-full rounded-xl border border-brand-gold/60 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-gold"
            value={renoBudget}
            onChange={(e) => setRenoBudget(Number(e.target.value || 0))}
          />
          <div className="text-sm text-brand-blue/80 mt-2">
            <div className="flex justify-between"><span>Costo total del proyecto</span><span className="font-medium">{money((purchasePrice || 0) + (closingCosts || 0) + (renoBudget || 0))}</span></div>
          </div>
        </section>

        {/* NOI + asistente */}
        <section className="rounded-2xl border border-brand-gold bg-white p-5">
          <h3 className="font-serif text-lg text-brand-green font-bold mb-2">Ingreso Operativo Neto (NOI)</h3>
          <label className="block text-sm font-medium text-brand-blue mb-1">NOI (anual, CAD)</label>
          <input
            type="number"
            min={0}
            inputMode="decimal"
            className="w-full rounded-xl border border-brand-gold/60 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-gold"
            value={noiAnnual}
            onChange={(e) => setNoiAnnual(Number(e.target.value || 0))}
          />
          <details className="mt-3 rounded-xl border border-brand-gold/40 bg-brand-beige/40 p-4">
            <summary className="cursor-pointer font-semibold text-brand-green">¿Necesitas ayuda para estimar el NOI?</summary>
            <div className="grid md:grid-cols-2 gap-3 mt-3 text-sm">
              <div>
                <label className="block text-sm font-medium text-brand-blue mb-1">Renta bruta (mensual)</label>
                <input
                  type="number"
                  min={0}
                  inputMode="decimal"
                  className="w-full rounded-xl border border-brand-gold/60 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-gold"
                  value={grossRentMonthly}
                  onChange={(e) => setGrossRentMonthly(Number(e.target.value || 0))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-brand-blue mb-1">Vacancia e incobrables (%)</label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  step={0.1}
                  inputMode="decimal"
                  className="w-full rounded-xl border border-brand-gold/60 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-gold"
                  value={vacancyPct}
                  onChange={(e) => setVacancyPct(Number(e.target.value || 0))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-brand-blue mb-1">Otros ingresos (mensual)</label>
                <input
                  type="number"
                  min={0}
                  inputMode="decimal"
                  className="w-full rounded-xl border border-brand-gold/60 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-gold"
                  value={otherIncomeMonthly}
                  onChange={(e) => setOtherIncomeMonthly(Number(e.target.value || 0))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-brand-blue mb-1">Gastos fijos (mensual)</label>
                <input
                  type="number"
                  min={0}
                  inputMode="decimal"
                  className="w-full rounded-xl border border-brand-gold/60 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-gold"
                  value={fixedExpensesMonthly}
                  onChange={(e) => setFixedExpensesMonthly(Number(e.target.value || 0))}
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-brand-blue mb-1">Gastos variables (% del IGP/GPR)</label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  step={0.1}
                  inputMode="decimal"
                  className="w-full rounded-xl border border-brand-gold/60 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-gold"
                  value={variableExpensePctGPR}
                  onChange={(e) => setVariableExpensePctGPR(Number(e.target.value || 0))}
                />
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between text-sm">
              <div>
                <div>NOI estimado por asistente (anual): <b>{money(helperNOI)}</b></div>
                <div className="text-brand-blue/70">
                  NOI = IGP/GPR − vacancia + otros ingresos − fijos − variables (% del IGP/GPR)
                </div>
              </div>
              <button
                type="button"
                onClick={useHelperNOI}
                className="px-4 py-2 rounded-full border-2 border-brand-green text-brand-green hover:bg-brand-green hover:text-white transition"
              >
                Usar este NOI
              </button>
            </div>
          </details>
        </section>

        {/* Financiamiento (opcional) */}
        <section className="rounded-2xl border border-brand-gold bg-white p-5">
          <h3 className="font-serif text-lg text-brand-green font-bold mb-2">Financiamiento simple (retornos apalancados)</h3>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-brand-blue mb-1">Pago inicial (% del precio)</label>
              <input
                type="number"
                min={0}
                max={100}
                step={0.1}
                inputMode="decimal"
                className="w-full rounded-xl border border-brand-gold/60 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-gold"
                value={downPct}
                onChange={(e) => setDownPct(Number(e.target.value || 0))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-brand-blue mb-1">Tasa de interés (anual %)</label>
              <input
                type="number"
                min={0}
                max={25}
                step={0.01}
                inputMode="decimal"
                className="w-full rounded-xl border border-brand-gold/60 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-gold"
                value={ratePct}
                onChange={(e) => setRatePct(Number(e.target.value || 0))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-brand-blue mb-1">Amortización (años)</label>
              <select
                className="w-full rounded-xl border border-brand-gold/60 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-gold"
                value={amortYears}
                onChange={(e) => setAmortYears(Number(e.target.value))}
              >
                <option value={20}>20</option>
                <option value={25}>25</option>
                <option value={30}>30</option>
              </select>
            </div>
          </div>

          <div className="text-sm text-brand-blue/80 mt-3">
            <div className="flex justify-between"><span>Monto del préstamo</span><span className="font-medium">{money(loanAmount)}</span></div>
            <div className="flex justify-between"><span>Efectivo invertido</span><span className="font-medium">{money(cashInvested)}</span></div>
          </div>
        </section>
      </form>

      {/* Encabezado de impresión (solo al imprimir) */}
      <div className="hidden print:block mt-6 mb-3 text-center">
        <div className="font-serif font-bold text-brand-green text-2xl">Tasa Cap & Cash-on-Cash — Resumen</div>
        <div className="text-xs text-brand-blue">Preparado {printDate}</div>
        <div className="w-16 h-[2px] bg-brand-gold rounded-full mx-auto mt-2" />
      </div>

      {/* Resultados */}
      <div className="mt-8 grid xl:grid-cols-3 gap-6">
        {/* Sin deuda */}
        <section className="rounded-2xl border border-brand-gold bg-white p-5 avoid-break">
          <h3 className="font-serif text-xl text-brand-green font-bold mb-2">Métricas sin deuda</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span>NOI (anual)</span><span className="font-medium">{money(noiAnnual)}</span></div>
            <div className="flex justify-between"><span>Tasa Cap (NOI ÷ Precio)</span><span className="font-semibold">{pct(capRate)}</span></div>
            <div className="flex justify-between border-t pt-2 mt-2"><span>Rendimiento sobre costo (NOI ÷ Costo del proyecto)</span><span className="font-semibold">{pct(yieldOnCost)}</span></div>
          </div>
          <p className="text-xs text-brand-blue/70 mt-2">El rendimiento sobre costo incluye cierre y CapEx inicial.</p>
        </section>

        {/* Servicio de deuda y cobertura */}
        <section className="rounded-2xl border border-brand-gold bg-white p-5 avoid-break">
          <h3 className="font-serif text-xl text-brand-green font-bold mb-2">Servicio de deuda y cobertura</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span>Servicio de deuda anual (ADS)</span><span className="font-medium">−{money(adsAnnual)}</span></div>
            <div className="flex justify-between border-t pt-2 mt-2"><span>DSCR (NOI ÷ ADS)</span><span className="font-semibold">{Number.isFinite(dscr) ? dscr.toFixed(2) : "—"}</span></div>
            <div className="flex justify-between"><span>Rendimiento de la deuda (NOI ÷ Préstamo)</span><span className="font-medium">{Number.isFinite(debtYield) ? pct(debtYield) : "—"}</span></div>
          </div>
          <p className="text-xs text-brand-blue/70 mt-2">Muchos prestamistas buscan DSCR ≥ 1.20 y Debt Yield ≥ 8–10% (según programa).</p>
        </section>

        {/* Retornos apalancados */}
        <section className="rounded-2xl border border-brand-gold bg-white p-5 avoid-break">
          <h3 className="font-serif text-xl text-brand-green font-bold mb-2">Retornos apalancados</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span>Flujo de caja apalancado (NOI − ADS)</span><span className="font-medium">{money(leveredCF)}</span></div>
            <div className="flex justify-between border-t pt-2 mt-2"><span>Efectivo invertido</span><span className="font-medium">{money(cashInvested)}</span></div>
            <div className="flex justify-between"><span>Retorno cash-on-cash</span><span className="font-semibold">{pct(cashOnCash)}</span></div>
          </div>

          <details className="mt-4 rounded-xl border border-brand-gold/40 bg-brand-beige/40 p-4">
            <summary className="cursor-pointer font-semibold text-brand-green">Supuestos y notas</summary>
            <ul className="list-disc ml-5 mt-2 text-sm text-brand-blue/80 space-y-1">
              <li>NOI excluye servicio de deuda e impuestos sobre la renta; incluye gastos operativos típicos.</li>
              <li>Tasa Cap usa solo el precio de compra. El rendimiento sobre costo usa precio + cierre + CapEx inicial.</li>
              <li>Cash-on-Cash = (NOI − ADS) ÷ (Pago inicial + Cierre + CapEx inicial).</li>
              <li>Estimaciones — los resultados reales varían con rentas, gastos y términos de financiamiento.</li>
            </ul>
          </details>
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
