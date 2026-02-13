"use client";

import { useMemo, useState } from "react";
import ToolShell from "@/components/ToolShell";
import { FaPrint, FaFileCsv } from "react-icons/fa";

/* =========================================================
   Tipos y constantes
   ========================================================= */
type LoanMode = "loanAmount" | "purchaseLTV";

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
/** Factor de pago mensual para un préstamo totalmente amortizado */
function monthlyPaymentFactor(annualRatePct: number, amortYears: number) {
  const i = Math.max(0, annualRatePct) / 100 / 12;
  const n = Math.max(1, Math.round(amortYears * 12));
  if (i === 0) return 1 / n;
  return (i * Math.pow(1 + i, n)) / (Math.pow(1 + i, n) - 1);
}
// CSV robusto (comillas + CRLF + BOM para Excel)
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
  // Ingresos (NOI anual)
  const [noiAnnual, setNoiAnnual] = useState<number>(42_000);

  // Términos del préstamo
  const [ratePct, setRatePct] = useState<number>(5.75);
  const [amortYears, setAmortYears] = useState<number>(25);
  const [dscrTarget, setDscrTarget] = useState<number>(1.20);

  // Financiamiento propuesto (elige modo)
  const [mode, setMode] = useState<LoanMode>("loanAmount");
  const [loanAmount, setLoanAmount] = useState<number>(600_000);

  const [purchasePrice, setPurchasePrice] = useState<number>(850_000);
  const [ltvPct, setLtvPct] = useState<number>(75);

  // Asistente opcional para NOI (colapsable)
  const [grossRentMonthly, setGrossRentMonthly] = useState<number>(4_300);
  const [vacancyPct, setVacancyPct] = useState<number>(4);
  const [otherIncomeMonthly, setOtherIncomeMonthly] = useState<number>(0);
  const [fixedExpensesMonthly, setFixedExpensesMonthly] = useState<number>(900); // impuestos+seguros+servicios+cuotas…
  const [variableExpensePctGPR, setVariableExpensePctGPR] = useState<number>(18); // administración+mantenimiento+capex como % del IGP/GPR

  const printDate = new Date().toLocaleDateString("es-CA", { year: "numeric", month: "long", day: "numeric" });

  const {
    proposedLoan,
    pmtMonthly,
    adsAnnual,
    dscr,
    maxLoanByDSCR,
    requiredNOIatTargetForProposed,
    maxPriceByDSCRatLTV,
    proposedLTV,
    maxLoanByLTV,
    bindingConstraint,
  } = useMemo(() => {
    const monthlyFactor = monthlyPaymentFactor(ratePct, amortYears);

    // Préstamo propuesto según modo
    const proposedLoan = mode === "loanAmount"
      ? Math.max(0, loanAmount)
      : Math.max(0, purchasePrice * (Math.max(0, Math.min(100, ltvPct)) / 100));

    const pmtMonthly = proposedLoan * monthlyFactor;
    const adsAnnual = pmtMonthly * 12;

    const dscr = adsAnnual > 0 ? (noiAnnual / adsAnnual) : NaN;

    // Préstamo máximo por DSCR (dado NOI, tasa, amortización y objetivo)
    const allowedMonthlyDebt = dscrTarget > 0 ? (noiAnnual / 12) / dscrTarget : 0;
    const maxLoanByDSCR = monthlyFactor > 0 ? allowedMonthlyDebt / monthlyFactor : 0;

    // NOI requerido para lograr el objetivo de DSCR con el préstamo propuesto
    const requiredNOIatTargetForProposed = dscrTarget * adsAnnual;

    // Contexto LTV (solo si tenemos precio/LTV)
    const proposedLTV = purchasePrice > 0 ? (proposedLoan / purchasePrice) : NaN;
    const maxLoanByLTV = purchasePrice * (Math.max(0, Math.min(100, ltvPct)) / 100);

    const maxPriceByDSCRatLTV = (ltvPct > 0) ? (maxLoanByDSCR / (ltvPct / 100)) : NaN;

    // Restricción determinante si el modo es purchaseLTV (¿qué límite “aprieta” más?)
    let bindingConstraint: "DSCR" | "LTV" | "—" = "—";
    if (mode === "purchaseLTV") {
      bindingConstraint = maxLoanByDSCR < maxLoanByLTV ? "DSCR" : "LTV";
    }

    return {
      proposedLoan,
      pmtMonthly,
      adsAnnual,
      dscr,
      maxLoanByDSCR,
      requiredNOIatTargetForProposed,
      maxPriceByDSCRatLTV,
      proposedLTV,
      maxLoanByLTV,
      bindingConstraint,
    };
  }, [mode, loanAmount, purchasePrice, ltvPct, ratePct, amortYears, noiAnnual, dscrTarget]);

  // NOI derivado (asistente)
  const { helperNOI } = useMemo(() => {
    const gprAnnual = (grossRentMonthly || 0) * 12;              // Ingreso Bruto Potencial (IGP/GPR)
    const vacancyLoss = gprAnnual * Math.max(0, vacancyPct) / 100;
    const otherInc = (otherIncomeMonthly || 0) * 12;
    const fixedAnnual = (fixedExpensesMonthly || 0) * 12;
    const variableAnnual = gprAnnual * Math.max(0, variableExpensePctGPR) / 100;
    const noi = gprAnnual - vacancyLoss + otherInc - fixedAnnual - variableAnnual;
    return { helperNOI: noi };
  }, [grossRentMonthly, vacancyPct, otherIncomeMonthly, fixedExpensesMonthly, variableExpensePctGPR]);

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
      ["NOI (anual)", noiAnnual.toFixed(2)],
      ["Tasa (%)", ratePct.toFixed(2)],
      ["Amortización (años)", amortYears],
      ["DSCR objetivo", dscrTarget.toFixed(2)],
      ["—", "—"],
      ["Modo", mode === "loanAmount" ? "Por monto de préstamo" : "Por precio de compra + LTV"],
      ["Préstamo propuesto", proposedLoan.toFixed(2)],
      ...(mode === "purchaseLTV"
        ? [
            ["Precio de compra", purchasePrice.toFixed(2)],
            ["LTV (%)", ltvPct.toFixed(2)],
            ["LTV propuesto (%)", Number.isFinite(proposedLTV) ? (proposedLTV * 100).toFixed(2) : "—"],
          ]
        : []),
      ["Servicio de deuda mensual", pmtMonthly.toFixed(2)],
      ["Servicio de deuda anual (ADS)", adsAnnual.toFixed(2)],
      ["DSCR (NOI ÷ ADS)", Number.isFinite(dscr) ? dscr.toFixed(2) : "—"],
      ["—", "—"],
      ["Préstamo máx. por DSCR objetivo", maxLoanByDSCR.toFixed(2)],
      ["NOI requerido @ objetivo (para el propuesto)", requiredNOIatTargetForProposed.toFixed(2)],
      ...(mode === "purchaseLTV"
        ? [
            ["Préstamo máx. por LTV", maxLoanByLTV.toFixed(2)],
            ["Precio máx. por DSCR @ LTV", Number.isFinite(maxPriceByDSCRatLTV) ? maxPriceByDSCRatLTV.toFixed(2) : "—"],
            ["Restricción determinante", bindingConstraint],
          ]
        : []),
    ];
    downloadCSV("calculadora_dscr_resumen", rows);
  }
  function useHelperNOI() {
    setNoiAnnual(Math.max(0, Math.round(helperNOI)));
  }
  function resetExample() {
    setNoiAnnual(42_000);
    setRatePct(5.75);
    setAmortYears(25);
    setDscrTarget(1.2);
    setMode("loanAmount");
    setLoanAmount(600_000);
    setPurchasePrice(850_000);
    setLtvPct(75);
    setGrossRentMonthly(4_300);
    setVacancyPct(4);
    setOtherIncomeMonthly(0);
    setFixedExpensesMonthly(900);
    setVariableExpensePctGPR(18);
  }

  /* -----------------------------
     Render
     ----------------------------- */
  return (
    <ToolShell
      title="DSCR (Vista del Prestamista)"
      subtitle="Calcula el DSCR, el préstamo máximo según un DSCR objetivo y el NOI requerido. También puedes evaluar precio de compra y LTV."
      lang="es"
    >
      {/* Barra de acciones */}
      <div className="tool-actions">
        <button
          type="button"
          onClick={handlePrint}
          className="tool-btn-primary"
          title="Abrir el diálogo de impresión (elige 'Guardar como PDF')"
        >
          <FaPrint aria-hidden /> Imprimir o guardar PDF
        </button>
        <button
          type="button"
          onClick={exportCSV}
          className="tool-btn-blue"
          title="Exportar un resumen de tus entradas y resultados"
        >
          <FaFileCsv aria-hidden /> Exportar (CSV)
        </button>
        <button
          type="button"
          onClick={resetExample}
          className="tool-btn-gold"
          title="Restablecer valores"
        >
          Restablecer valores
        </button>
      </div>

      {/* Entradas */}
      <form className="grid xl:grid-cols-3 gap-6">
        {/* NOI */}
        <section className="tool-card">
          <h3 className="font-sans text-lg text-brand-green font-semibold mb-2">Ingresos</h3>
          <label className="block text-sm font-medium text-brand-blue mb-1">NOI (anual, CAD)</label>
          <input
            type="number"
            min={0}
            inputMode="decimal"
            className="tool-field-lg"
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
                  className="tool-field"
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
                  className="tool-field"
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
                  className="tool-field"
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
                  className="tool-field"
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
                  className="tool-field"
                  value={variableExpensePctGPR}
                  onChange={(e) => setVariableExpensePctGPR(Number(e.target.value || 0))}
                />
              </div>
            </div>
            <div className="mt-3 flex flex-col gap-3 text-sm sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div>NOI estimado por asistente (anual): <b>{money(helperNOI)}</b></div>
                <div className="text-brand-blue/70">
                  NOI = IGP/GPR − vacancia + otros ingresos − fijos − variables (% del IGP/GPR)
                </div>
              </div>
              <button
                type="button"
                onClick={useHelperNOI}
                className="tool-btn-green"
              >
                Usar este NOI
              </button>
            </div>
          </details>
        </section>

        {/* Términos */}
        <section className="tool-card grid gap-3">
          <h3 className="font-sans text-lg text-brand-green font-semibold">Términos del préstamo</h3>
          <div>
            <label className="block text-sm font-medium text-brand-blue mb-1">Tasa de interés (anual %)</label>
            <input
              type="number"
              step={0.01}
              min={0}
              max={25}
              inputMode="decimal"
              className="tool-field-lg"
              value={ratePct}
              onChange={(e) => setRatePct(Number(e.target.value || 0))}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-brand-blue mb-1">Amortización (años)</label>
            <select
              className="tool-field-lg"
              value={amortYears}
              onChange={(e) => setAmortYears(Number(e.target.value))}
            >
              <option value={20}>20</option>
              <option value={25}>25</option>
              <option value={30}>30</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-brand-blue mb-1">DSCR objetivo (para préstamo máx.)</label>
            <input
              type="number"
              step={0.05}
              min={0.80}
              max={2.00}
              inputMode="decimal"
              className="tool-field-lg"
              value={dscrTarget}
              onChange={(e) => setDscrTarget(Number(e.target.value || 0))}
            />
            <p className="text-xs text-brand-blue/70 mt-1">Objetivos comunes: 1.10–1.25</p>
          </div>
        </section>

        {/* Modo de financiamiento */}
        <section className="tool-card">
          <h3 className="font-sans text-lg text-brand-green font-semibold mb-2">Financiamiento propuesto</h3>

          <div className="mb-3 flex flex-wrap items-center gap-4">
            <label className="inline-flex items-center gap-2">
              <input
                type="radio"
                name="mode"
                checked={mode === "loanAmount"}
                onChange={() => setMode("loanAmount")}
              />
              <span>Por monto de préstamo</span>
            </label>
            <label className="inline-flex items-center gap-2">
              <input
                type="radio"
                name="mode"
                checked={mode === "purchaseLTV"}
                onChange={() => setMode("purchaseLTV")}
              />
              <span>Por precio de compra + LTV</span>
            </label>
          </div>

          {mode === "loanAmount" ? (
            <div className="grid gap-3">
              <label className="block text-sm font-medium text-brand-blue mb-1">Monto de préstamo (CAD)</label>
              <input
                type="number"
                min={0}
                inputMode="decimal"
                className="tool-field-lg"
                value={loanAmount}
                onChange={(e) => setLoanAmount(Number(e.target.value || 0))}
              />
            </div>
          ) : (
            <div className="grid gap-3">
              <div>
                <label className="block text-sm font-medium text-brand-blue mb-1">Precio de compra (CAD)</label>
                <input
                  type="number"
                  min={0}
                  inputMode="decimal"
                  className="tool-field-lg"
                  value={purchasePrice}
                  onChange={(e) => setPurchasePrice(Number(e.target.value || 0))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-brand-blue mb-1">LTV (%)</label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  step={0.1}
                  inputMode="decimal"
                  className="tool-field-lg"
                  value={ltvPct}
                  onChange={(e) => setLtvPct(Number(e.target.value || 0))}
                />
              </div>
              <p className="text-xs text-brand-blue/70">
                Préstamo propuesto = Precio × LTV. Compararemos las restricciones de DSCR vs LTV.
              </p>
            </div>
          )}
        </section>
      </form>

      {/* Encabezado de impresión (solo al imprimir) */}
      <div className="hidden print:block mt-6 mb-3 text-center">
        <div className="font-sans font-bold text-brand-green text-2xl">DSCR (Vista del Prestamista) — Resumen</div>
        <div className="text-xs text-brand-blue">Preparado {printDate}</div>
        <div className="w-16 h-[2px] bg-brand-gold rounded-full mx-auto mt-2" />
      </div>

      {/* Resultados */}
      <div className="mt-8 grid xl:grid-cols-3 gap-6">
        <section className="tool-card avoid-break">
          <h3 className="font-sans text-xl text-brand-green font-semibold mb-2">DSCR y servicio de deuda</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span>Préstamo propuesto</span><span className="font-medium">{money(proposedLoan)}</span></div>
            <div className="flex justify-between"><span>Servicio de deuda mensual (P&I)</span><span className="font-medium">{money(pmtMonthly, 2)}</span></div>
            <div className="flex justify-between"><span>Servicio de deuda anual (ADS)</span><span className="font-medium">{money(adsAnnual)}</span></div>
            <div className="flex justify-between border-t pt-2 mt-2">
              <span>DSCR (NOI ÷ ADS)</span>
              <span className="font-semibold">{Number.isFinite(dscr) ? dscr.toFixed(2) : "—"}</span>
            </div>
          </div>
          <p className="text-xs text-brand-blue/70 mt-2">
            Varios prestamistas requieren DSCR ≥ {dscrTarget.toFixed(2)}. Los criterios varían por programa y tipo de propiedad.
          </p>
        </section>

        <section className="tool-card avoid-break">
          <h3 className="font-sans text-xl text-brand-green font-semibold mb-2">Préstamo máx. por DSCR objetivo</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span>DSCR objetivo</span><span className="font-medium">{dscrTarget.toFixed(2)}</span></div>
            <div className="flex justify-between"><span>Pago mensual máx. permitido</span><span className="font-medium">{dscrTarget > 0 ? money((noiAnnual / 12) / dscrTarget, 2) : "—"}</span></div>
            <div className="flex justify-between border-t pt-2 mt-2">
              <span>Préstamo máx. por DSCR</span>
              <span className="font-semibold">{money(maxLoanByDSCR)}</span>
            </div>
            <div className="flex justify-between">
              <span>NOI requerido @ objetivo (para el propuesto)</span>
              <span className="font-medium">{money(requiredNOIatTargetForProposed)}</span>
            </div>
          </div>
          <p className="text-xs text-brand-blue/70 mt-2">
            Aumenta el NOI o reduce el préstamo/términos para mejorar el DSCR.
          </p>
        </section>

        <section className="tool-card avoid-break">
          <h3 className="font-sans text-xl text-brand-green font-semibold mb-2">Contexto LTV</h3>
          {mode === "purchaseLTV" ? (
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span>Precio de compra</span><span className="font-medium">{money(purchasePrice)}</span></div>
              <div className="flex justify-between"><span>LTV propuesto</span><span className="font-medium">{Number.isFinite(proposedLTV) ? (proposedLTV * 100).toFixed(2) + "%" : "—"}</span></div>
              <div className="flex justify-between"><span>Préstamo máx. por LTV</span><span className="font-medium">{money(maxLoanByLTV)}</span></div>
              <div className="flex justify-between border-t pt-2 mt-2">
                <span>Precio máx. por DSCR @ LTV</span>
                <span className="font-semibold">{Number.isFinite(maxPriceByDSCRatLTV) ? money(maxPriceByDSCRatLTV) : "—"}</span>
              </div>
              <div className="flex justify-between">
                <span>Restricción determinante</span>
                <span className="font-medium">{bindingConstraint}</span>
              </div>
            </div>
          ) : (
            <p className="text-sm text-brand-blue/80">Cambia a “Precio de compra + LTV” para comparar límites de DSCR vs LTV.</p>
          )}

          <details className="mt-4 rounded-xl border border-brand-gold/40 bg-brand-beige/40 p-4">
            <summary className="cursor-pointer font-semibold text-brand-green">Supuestos y notas</summary>
            <ul className="list-disc ml-5 mt-2 text-sm text-brand-blue/80 space-y-1">
              <li>DSCR = <b>NOI ÷ Servicio de Deuda Anual</b>. El NOI excluye servicio de deuda, reservas de CapEx e impuestos sobre la renta.</li>
              <li>El pago usa un esquema totalmente amortizado sobre la amortización seleccionada.</li>
              <li>Los programas varían; algunos usan tasas “estresadas” o pisos de DSCR distintos por propiedad.</li>
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
