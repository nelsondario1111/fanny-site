"use client";

import { useMemo, useState } from "react";
import ToolShell from "@/components/ToolShell";
import { FaPrint, FaFileCsv } from "react-icons/fa";

/* =========================================================
   Tipos & constantes
   ========================================================= */
type DownMode = "amount" | "percent";

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
function monthlyPaymentFactor(annualRatePct: number, years: number) {
  const i = Math.max(0, annualRatePct) / 100 / 12;
  const n = Math.max(1, Math.round(years * 12));
  if (i === 0) return 1 / n;
  return (i * Math.pow(1 + i, n)) / (Math.pow(1 + i, n) - 1);
}
/** CSV robusto (comillas + CRLF + BOM) */
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

/* ---------- Tabla por defecto de prima de seguro hipotecario ----------
   Típica para “high-ratio” (pago inicial < 20%) — puede variar por programa:
   - 5%–9.99% de pago inicial: 4.00%
   - 10%–14.99%: 3.10%
   - 15%–19.99%: 2.80%
   Para ≥20% asumimos 0% (convencional, sin seguro).
--------------------------------------------------------------------------- */
function defaultPremiumRateForDownPct(downPct: number) {
  if (!Number.isFinite(downPct) || downPct <= 0) return NaN;
  if (downPct < 0.05) return NaN; // no elegible
  if (downPct < 0.10) return 0.04;
  if (downPct < 0.15) return 0.031;
  if (downPct < 0.20) return 0.028;
  return 0;
}

/** Resolver precio máximo dado:
 *  - Hipoteca *asegurada* máxima que soportas por pago, M_cap
 *  - Pago inicial en efectivo D
 *  - Si se incluye la prima del seguro en la hipoteca (true/false)
 *  Itera porque la prima depende del % de pago inicial que depende del precio.
 */
function solveMaxPrice({
  maxSupportableLoan,
  downPayment,
  includeDefaultPremium,
}: {
  maxSupportableLoan: number;
  downPayment: number;
  includeDefaultPremium: boolean;
}) {
  const D = Math.max(0, downPayment || 0);

  if (!includeDefaultPremium) {
    const price = D + Math.max(0, maxSupportableLoan);
    return {
      price: Math.max(0, price),
      baseLoan: Math.max(0, maxSupportableLoan),
      premiumRate: 0,
      premiumAmt: 0,
      insuredLoan: Math.max(0, maxSupportableLoan),
      downPct: price > 0 ? D / price : NaN,
    };
  }

  // Iterar hasta converger prima y precio
  let priceGuess = D + Math.max(0, maxSupportableLoan); // arranque ignorando prima
  let premiumRate = 0;
  let baseLoan = 0;
  let insuredLoan = Math.max(0, maxSupportableLoan);
  let iterations = 0;

  while (iterations < 25) {
    iterations++;
    const downPct = priceGuess > 0 ? D / priceGuess : 0;
    premiumRate = defaultPremiumRateForDownPct(downPct);
    if (!Number.isFinite(premiumRate)) {
      // No elegible (<5% de pago inicial). Limitar precio por regla del 5%:
      const capByMinDown = D / 0.05;
      priceGuess = Math.min(priceGuess, capByMinDown || 0);
      // Recalcular con 5% exacto como mejor esfuerzo:
      const dp = priceGuess * 0.05;
      baseLoan = priceGuess - dp;
      const prem = baseLoan * 0.04; // tramo más alto al 5%
      insuredLoan = baseLoan + prem;
      break;
    }
    baseLoan = insuredLoan / (1 + premiumRate);
    const newPrice = D + baseLoan;
    if (Math.abs(newPrice - priceGuess) < 1) {
      priceGuess = newPrice;
      break;
    }
    priceGuess = newPrice;
  }

  const premiumAmt = baseLoan * premiumRate;
  const downPctFinal = priceGuess > 0 ? D / priceGuess : NaN;

  // Si tras converger queda <5% de pago inicial, forzar el tope del 5%
  if (Number.isFinite(downPctFinal) && downPctFinal < 0.05) {
    const capByMinDown = D / 0.05;
    if (priceGuess > capByMinDown) {
      priceGuess = capByMinDown;
      const dp = priceGuess * 0.05;
      baseLoan = priceGuess - dp;
      premiumRate = 0.04;
      insuredLoan = baseLoan + baseLoan * premiumRate;
    }
  }

  return {
    price: Math.max(0, priceGuess),
    baseLoan: Math.max(0, baseLoan),
    premiumRate: Math.max(0, premiumRate),
    premiumAmt: Math.max(0, premiumAmt),
    insuredLoan: Math.max(0, insuredLoan),
    downPct: priceGuess > 0 ? D / priceGuess : NaN,
  };
}

/* =========================================================
   Página
   ========================================================= */
export default function Page() {
  /* Ingresos (anuales) */
  const [income1, setIncome1] = useState<number>(95_000);
  const [income2, setIncome2] = useState<number>(55_000);
  const [otherMonthlyIncome, setOtherMonthlyIncome] = useState<number>(0); // conservador: algunos prestamistas lo excluyen

  /* Costos de vivienda (calificables) */
  const [propertyTaxAnnual, setPropertyTaxAnnual] = useState<number>(4_200);
  const [heatingMonthly, setHeatingMonthly] = useState<number>(120);
  const [condoFeesMonthly, setCondoFeesMonthly] = useState<number>(0); // se cuenta el 50% para GDS/TDS
  const [homeInsMonthly, setHomeInsMonthly] = useState<number>(85);

  /* Deudas (pagos mínimos mensuales para TDS) */
  const [otherDebtsMonthly, setOtherDebtsMonthly] = useState<number>(450);

  /* Ratios objetivo */
  const [gdsTarget, setGdsTarget] = useState<number>(0.39); // 39%
  const [tdsTarget, setTdsTarget] = useState<number>(0.44); // 44%

  /* Tasa & amortización */
  const [contractRatePct, setContractRatePct] = useState<number>(5.49);
  const [amortYears, setAmortYears] = useState<number>(25);

  /* Prueba de esfuerzo (tasa de calificación) */
  const [useStressTest, setUseStressTest] = useState<boolean>(true);
  const [stressBufferPct, setStressBufferPct] = useState<number>(2.0); // +2%
  const [qualifyingFloorPct, setQualifyingFloorPct] = useState<number>(5.25); // piso editable
  const qualifyingRatePct = useMemo(() => {
    if (!useStressTest) return contractRatePct;
    return Math.max(contractRatePct + stressBufferPct, qualifyingFloorPct);
  }, [useStressTest, contractRatePct, stressBufferPct, qualifyingFloorPct]);

  /* Pago inicial */
  const [downMode, setDownMode] = useState<DownMode>("amount");
  const [downAmount, setDownAmount] = useState<number>(180_000);
  const [downPercent, setDownPercent] = useState<number>(20);

  /* Manejo del seguro */
  const [includeDefaultPremium, setIncludeDefaultPremium] = useState<boolean>(true);

  const printDate = new Date().toLocaleDateString("es-CA", { year: "numeric", month: "long", day: "numeric" });

  /* -----------------------------
     Cálculos derivados
     ----------------------------- */
  const {
    grossMonthlyIncome,
    fixedHousingMonthly,
    maxPmtGDS,
    maxPmtTDS,
    bindingConstraint,
    maxPmtAllowed,
    maxSupportableLoan,
    downPaymentCAD,
    maxPriceResult,
    previewMonthlyAtContract,
  } = useMemo(() => {
    const grossMonthlyIncome =
      (Math.max(0, income1 || 0) + Math.max(0, income2 || 0)) / 12 +
      Math.max(0, otherMonthlyIncome || 0);

    const taxM = Math.max(0, propertyTaxAnnual || 0) / 12;
    const heatM = Math.max(0, heatingMonthly || 0);
    const condoHalfM = Math.max(0, condoFeesMonthly || 0) * 0.5;
    const insM = Math.max(0, homeInsMonthly || 0);

    const fixedHousingMonthly = taxM + heatM + condoHalfM + insM;

    // P&I máximo según GDS (GDS% * ingreso − costos fijos)
    const maxPmtGDS = Math.max(0, Math.max(0, gdsTarget) * grossMonthlyIncome - fixedHousingMonthly);

    // P&I máximo según TDS (TDS% * ingreso − costos fijos − otras deudas)
    const maxPmtTDS = Math.max(
      0,
      Math.max(0, tdsTarget) * grossMonthlyIncome - fixedHousingMonthly - Math.max(0, otherDebtsMonthly || 0)
    );

    const bindingConstraint = maxPmtGDS < maxPmtTDS ? "GDS" : "TDS";
    const maxPmtAllowed = Math.min(maxPmtGDS, maxPmtTDS);

    // Convertir pago máximo en principal usando la tasa de calificación
    const pmtFactorQual = monthlyPaymentFactor(qualifyingRatePct, amortYears);
    const maxSupportableLoan = pmtFactorQual > 0 ? maxPmtAllowed / pmtFactorQual : 0;

    // Pago inicial en CAD
    let downPaymentCAD = Math.max(0, downAmount || 0);
    if (downMode === "percent") {
      // % del precio (aún desconocido) — estimamos con la solución final; aquí solo un “guess”
      const dpDec = Math.min(Math.max((downPercent || 0) / 100, 0), 1);
      if (dpDec > 0) {
        const guessPrice = maxSupportableLoan / (1 - dpDec);
        downPaymentCAD = dpDec * guessPrice;
      }
    }

    // Resolver precio con capacidad de préstamo + pago inicial (+ prima opcional)
    const maxPriceResult = solveMaxPrice({
      maxSupportableLoan,
      downPayment: downPaymentCAD,
      includeDefaultPremium,
    });

    // Vista previa de pago a la tasa contractual para el préstamo soportable
    const pmtFactorContract = monthlyPaymentFactor(contractRatePct, amortYears);
    const previewMonthlyAtContract = maxSupportableLoan * pmtFactorContract;

    return {
      grossMonthlyIncome,
      fixedHousingMonthly,
      maxPmtGDS,
      maxPmtTDS,
      bindingConstraint,
      maxPmtAllowed,
      maxSupportableLoan,
      downPaymentCAD,
      maxPriceResult,
      previewMonthlyAtContract,
    };
  }, [
    income1, income2, otherMonthlyIncome,
    propertyTaxAnnual, heatingMonthly, condoFeesMonthly, homeInsMonthly,
    otherDebtsMonthly, gdsTarget, tdsTarget,
    qualifyingRatePct, amortYears,
    downMode, downAmount, downPercent,
    includeDefaultPremium, contractRatePct
  ]);

  /* -----------------------------
     Acciones
     ----------------------------- */
  function handlePrint() { window.print(); }
  function exportCSV() {
    const rows: Array<Array<string | number>> = [
      ["Preparado", printDate],
      ["Ingreso 1 (anual)", income1.toFixed(2)],
      ["Ingreso 2 (anual)", income2.toFixed(2)],
      ["Otros ingresos mensuales", otherMonthlyIncome.toFixed(2)],
      ["Impuesto predial (anual)", propertyTaxAnnual.toFixed(2)],
      ["Calefacción (mensual)", heatingMonthly.toFixed(2)],
      ["Cuotas de condominio (mensual)", condoFeesMonthly.toFixed(2)],
      ["Seguro de hogar (mensual)", homeInsMonthly.toFixed(2)],
      ["Otras deudas (mensual)", otherDebtsMonthly.toFixed(2)],
      ["GDS objetivo (%)", (gdsTarget * 100).toFixed(2)],
      ["TDS objetivo (%)", (tdsTarget * 100).toFixed(2)],
      ["Tasa contractual (%)", contractRatePct.toFixed(2)],
      ["Amortización (años)", amortYears],
      ["Stress test activado", useStressTest ? "Sí" : "No"],
      ["Margen (+%)", stressBufferPct.toFixed(2)],
      ["Piso de calificación (%)", qualifyingFloorPct.toFixed(2)],
      ["Tasa de calificación usada (%)", qualifyingRatePct.toFixed(2)],
      ["Modo de pago inicial", downMode === "amount" ? "Monto" : "Porcentaje"],
      ["Pago inicial (CAD est.)", downPaymentCAD.toFixed(2)],
      ["Incluir estimación de prima de seguro", includeDefaultPremium ? "Sí" : "No"],
      ["—", "—"],
      ["Ingreso mensual bruto", grossMonthlyIncome.toFixed(2)],
      ["Costos de vivienda (calificables, mensual)", fixedHousingMonthly.toFixed(2)],
      ["P&I máx. según GDS", maxPmtGDS.toFixed(2)],
      ["P&I máx. según TDS", maxPmtTDS.toFixed(2)],
      ["Restricción determinante", bindingConstraint],
      ["P&I máximo permitido", maxPmtAllowed.toFixed(2)],
      ["Hipoteca soportable (tasa de calif.)", maxSupportableLoan.toFixed(2)],
      ["Pago mensual estimado @ tasa contractual", previewMonthlyAtContract.toFixed(2)],
      ["—", "—"],
      ["Precio máximo de compra (resuelto)", maxPriceResult.price.toFixed(2)],
      ["% de pago inicial a precio máx.", Number.isFinite(maxPriceResult.downPct) ? (maxPriceResult.downPct * 100).toFixed(2) + "%" : "—"],
      ["Préstamo base (antes de prima)", maxPriceResult.baseLoan.toFixed(2)],
      ["Tasa de prima de seguro", (maxPriceResult.premiumRate * 100).toFixed(2) + "%"],
      ["Prima del seguro", maxPriceResult.premiumAmt.toFixed(2)],
      ["Hipoteca asegurada (con prima)", maxPriceResult.insuredLoan.toFixed(2)],
    ];
    downloadCSV("asequibilidad_hipotecaria_resumen", rows);
  }
  function resetExample() {
    setIncome1(95_000); setIncome2(55_000); setOtherMonthlyIncome(0);
    setPropertyTaxAnnual(4_200); setHeatingMonthly(120); setCondoFeesMonthly(0); setHomeInsMonthly(85);
    setOtherDebtsMonthly(450);
    setGdsTarget(0.39); setTdsTarget(0.44);
    setContractRatePct(5.49); setAmortYears(25);
    setUseStressTest(true); setStressBufferPct(2.0); setQualifyingFloorPct(5.25);
    setDownMode("amount"); setDownAmount(180_000); setDownPercent(20);
    setIncludeDefaultPremium(true);
  }

  /* -----------------------------
     Render
     ----------------------------- */
  return (
    <ToolShell
      title="Asequibilidad Hipotecaria"
      subtitle="Estima tu hipoteca y precio de compra máximos usando límites GDS/TDS y la tasa de calificación del stress test de Canadá."
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
      <form className="grid 2xl:grid-cols-4 xl:grid-cols-3 gap-6">
        {/* Ingresos */}
        <section className="rounded-2xl border border-brand-gold bg-white p-5 grid gap-3">
          <h3 className="font-sans text-lg text-brand-green font-semibold">Ingresos</h3>
          <div>
            <label className="block text-sm font-medium text-brand-blue mb-1">Ingreso de solicitante (anual, CAD)</label>
            <input type="number" min={0} inputMode="decimal"
              className="w-full rounded-xl border border-brand-gold/60 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-gold"
              value={income1} onChange={(e)=>setIncome1(Number(e.target.value || 0))}/>
          </div>
          <div>
            <label className="block text-sm font-medium text-brand-blue mb-1">Ingreso de co-solicitante (anual, CAD)</label>
            <input type="number" min={0} inputMode="decimal"
              className="w-full rounded-xl border border-brand-gold/60 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-gold"
              value={income2} onChange={(e)=>setIncome2(Number(e.target.value || 0))}/>
          </div>
          <div>
            <label className="block text-sm font-medium text-brand-blue mb-1">Otros ingresos mensuales (opcional)</label>
            <input type="number" min={0} inputMode="decimal"
              className="w-full rounded-xl border border-brand-gold/60 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-gold"
              value={otherMonthlyIncome} onChange={(e)=>setOtherMonthlyIncome(Number(e.target.value || 0))}/>
            <p className="text-xs text-brand-blue/70 mt-1">Se consideran como parte del ingreso bruto; algunos prestamistas pueden excluirlos.</p>
          </div>
        </section>

        {/* Costos de vivienda calificables */}
        <section className="rounded-2xl border border-brand-gold bg-white p-5 grid gap-3">
          <h3 className="font-sans text-lg text-brand-green font-semibold">Costos de vivienda (calificables)</h3>
          <div>
            <label className="block text-sm font-medium text-brand-blue mb-1">Impuestos a la propiedad (anual)</label>
            <input type="number" min={0} inputMode="decimal"
              className="w-full rounded-xl border border-brand-gold/60 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-gold"
              value={propertyTaxAnnual} onChange={(e)=>setPropertyTaxAnnual(Number(e.target.value || 0))}/>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-brand-blue mb-1">Calefacción (mensual)</label>
              <input type="number" min={0} inputMode="decimal"
                className="w-full rounded-xl border border-brand-gold/60 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-gold"
                value={heatingMonthly} onChange={(e)=>setHeatingMonthly(Number(e.target.value || 0))}/>
            </div>
            <div>
              <label className="block text-sm font-medium text-brand-blue mb-1">Cuotas de condominio (mensual)</label>
              <input type="number" min={0} inputMode="decimal"
                className="w-full rounded-xl border border-brand-gold/60 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-gold"
                value={condoFeesMonthly} onChange={(e)=>setCondoFeesMonthly(Number(e.target.value || 0))}/>
              <p className="text-xs text-brand-blue/70 mt-1">Para GDS/TDS se cuenta el 50% de las cuotas.</p>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-brand-blue mb-1">Seguro de hogar (mensual)</label>
            <input type="number" min={0} inputMode="decimal"
              className="w-full rounded-xl border border-brand-gold/60 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-gold"
              value={homeInsMonthly} onChange={(e)=>setHomeInsMonthly(Number(e.target.value || 0))}/>
          </div>
        </section>

        {/* Otras deudas & ratios */}
        <section className="rounded-2xl border border-brand-gold bg-white p-5 grid gap-3">
          <h3 className="font-sans text-lg text-brand-green font-semibold">Deudas y ratios</h3>
          <div>
            <label className="block text-sm font-medium text-brand-blue mb-1">Otras deudas mensuales (pagos mínimos)</label>
            <input type="number" min={0} inputMode="decimal"
              className="w-full rounded-xl border border-brand-gold/60 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-gold"
              value={otherDebtsMonthly} onChange={(e)=>setOtherDebtsMonthly(Number(e.target.value || 0))}/>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-brand-blue mb-1">GDS objetivo (%)</label>
              <input type="number" min={20} max={60} step={0.01} inputMode="decimal"
                className="w-full rounded-xl border border-brand-gold/60 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-gold"
                value={gdsTarget*100} onChange={(e)=>setGdsTarget(Number(e.target.value || 0)/100)}/>
            </div>
            <div>
              <label className="block text-sm font-medium text-brand-blue mb-1">TDS objetivo (%)</label>
              <input type="number" min={20} max={60} step={0.01} inputMode="decimal"
                className="w-full rounded-xl border border-brand-gold/60 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-gold"
                value={tdsTarget*100} onChange={(e)=>setTdsTarget(Number(e.target.value || 0)/100)}/>
            </div>
          </div>
          <p className="text-xs text-brand-blue/70">Referencias comunes: GDS ~39%, TDS ~44% (según programa).</p>
        </section>

        {/* Financiamiento: tasa, amortización y pago inicial */}
        <section className="rounded-2xl border border-brand-gold bg-white p-5">
          <h3 className="font-sans text-lg text-brand-green font-semibold mb-2">Financiamiento</h3>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-brand-blue mb-1">Tasa contractual (anual %)</label>
              <input type="number" min={0} max={25} step={0.01} inputMode="decimal"
                className="w-full rounded-xl border border-brand-gold/60 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-gold"
                value={contractRatePct} onChange={(e)=>setContractRatePct(Number(e.target.value || 0))}/>
            </div>
            <div>
              <label className="block text-sm font-medium text-brand-blue mb-1">Amortización (años)</label>
              <select
                className="w-full rounded-xl border border-brand-gold/60 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-gold"
                value={amortYears} onChange={(e)=>setAmortYears(Number(e.target.value))}
              >
                <option value={20}>20</option>
                <option value={25}>25</option>
                <option value={30}>30</option>
              </select>
            </div>
          </div>

          <div className="mt-3 rounded-xl border border-brand-gold/40 bg-brand-beige/40 p-3">
            <label className="inline-flex items-center gap-2">
              <input type="checkbox" checked={useStressTest} onChange={(e)=>setUseStressTest(e.target.checked)} />
              <span className="font-medium text-brand-green">Usar tasa de calificación del stress test</span>
            </label>
            <div className="grid grid-cols-3 gap-3 mt-2">
              <div>
                <label className="block text-xs text-brand-blue mb-1">Margen (+%)</label>
                <input type="number" min={0} max={5} step={0.01} inputMode="decimal"
                  className="w-full rounded-xl border border-brand-gold/60 px-2 py-2 focus:outline-none focus:ring-2 focus:ring-brand-gold"
                  value={stressBufferPct} onChange={(e)=>setStressBufferPct(Number(e.target.value || 0))}/>
              </div>
              <div>
                <label className="block text-xs text-brand-blue mb-1">Piso (%)</label>
                <input type="number" min={0} max={10} step={0.01} inputMode="decimal"
                  className="w-full rounded-xl border border-brand-gold/60 px-2 py-2 focus:outline-none focus:ring-2 focus:ring-brand-gold"
                  value={qualifyingFloorPct} onChange={(e)=>setQualifyingFloorPct(Number(e.target.value || 0))}/>
              </div>
              <div className="flex items-end">
                <div className="text-sm bg-white border border-brand-gold/60 rounded-xl px-3 py-2 w-full">
                  Tasa de calificación: <b>{qualifyingRatePct.toFixed(2)}%</b>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-3">
            <label className="block text-sm font-medium text-brand-blue mb-1">Pago inicial</label>
            <div className="flex gap-4 mb-2">
              <label className="inline-flex items-center gap-2">
                <input type="radio" name="downmode" checked={downMode==="amount"} onChange={()=>setDownMode("amount")}/>
                <span>Monto</span>
              </label>
              <label className="inline-flex items-center gap-2">
                <input type="radio" name="downmode" checked={downMode==="percent"} onChange={()=>setDownMode("percent")}/>
                <span>Porcentaje</span>
              </label>
            </div>
            {downMode === "amount" ? (
              <input type="number" min={0} inputMode="decimal"
                className="w-full rounded-xl border border-brand-gold/60 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-gold"
                value={downAmount} onChange={(e)=>setDownAmount(Number(e.target.value || 0))}/>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <input type="number" min={0} max={100} step={0.1} inputMode="decimal"
                  className="w-full rounded-xl border border-brand-gold/60 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-gold"
                  value={downPercent} onChange={(e)=>setDownPercent(Number(e.target.value || 0))}/>
                <div className="text-sm text-brand-blue/70 flex items-center">
                  Ingresa el % que planeas aportar.
                </div>
              </div>
            )}
            <label className="inline-flex items-center gap-2 mt-3">
              <input
                type="checkbox"
                checked={includeDefaultPremium}
                onChange={(e)=>setIncludeDefaultPremium(e.target.checked)}
              />
              <span>Incluir estimación de prima de hipoteca asegurada (si &lt; 20% de pago inicial)</span>
            </label>
          </div>
        </section>
      </form>

      {/* Resultados */}
      <div className="mt-8 grid xl:grid-cols-3 gap-6">
        <section className="rounded-2xl border border-brand-gold bg-white p-5 avoid-break">
          <h3 className="font-sans text-xl text-brand-green font-semibold mb-2">Cobertura y restricciones</h3>
          <div className="text-sm space-y-2">
            <div className="flex justify-between"><span>Ingreso mensual bruto</span><span className="font-medium">{money(grossMonthlyIncome, 2)}</span></div>
            <div className="flex justify-between"><span>Costos de vivienda (calificables)</span><span className="font-medium">{money(fixedHousingMonthly, 2)}</span></div>
            <div className="flex justify-between"><span>P&I máx. según GDS</span><span className="font-medium">{money(maxPmtGDS, 2)}</span></div>
            <div className="flex justify-between"><span>P&I máx. según TDS</span><span className="font-medium">{money(maxPmtTDS, 2)}</span></div>
            <div className="flex justify-between border-t pt-2 mt-2">
              <span>Restricción determinante</span><span className="font-semibold">{bindingConstraint}</span>
            </div>
            <div className="flex justify-between">
              <span>P&I máximo permitido</span><span className="font-semibold">{money(maxPmtAllowed, 2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Tasa de calificación</span><span className="font-medium">{qualifyingRatePct.toFixed(2)}%</span>
            </div>
          </div>
          <p className="text-xs text-brand-blue/70 mt-2">
            GDS incluye P&I + impuestos + calefacción + 50% de cuotas de condominio + seguro de hogar. TDS agrega otras deudas mensuales.
          </p>
        </section>

        <section className="rounded-2xl border border-brand-gold bg-white p-5 avoid-break">
          <h3 className="font-sans text-xl text-brand-green font-semibold mb-2">Hipoteca máxima (por pago)</h3>
          <div className="text-sm space-y-2">
            <div className="flex justify-between"><span>Amortización</span><span className="font-medium">{amortYears} años</span></div>
            <div className="flex justify-between"><span>Principal soportable @ tasa de calificación</span><span className="font-semibold">{money(maxSupportableLoan)}</span></div>
            <div className="flex justify-between">
              <span>Pago mensual estimado (P&I) @ tasa contractual</span>
              <span className="font-medium">{money(previewMonthlyAtContract, 2)}</span>
            </div>
          </div>
          <details className="mt-4 rounded-xl border border-brand-gold/40 bg-brand-beige/40 p-4">
            <summary className="cursor-pointer font-semibold text-brand-green">Notas</summary>
            <ul className="list-disc ml-5 mt-2 text-sm text-brand-blue/80 space-y-1">
              <li>Convertimos tu P&I mensual máximo permitido a un principal usando la tasa de calificación y la amortización.</li>
              <li>La vista previa usa tu tasa contractual (para presupuesto) — la tasa de calificación puede ser mayor.</li>
              <li>Si tu pago inicial es &lt; 20%, muchos programas asegurados limitan la amortización a 25 años.</li>
            </ul>
          </details>
        </section>

        <section className="rounded-2xl border border-brand-gold bg-white p-5 avoid-break">
          <h3 className="font-sans text-xl text-brand-green font-semibold mb-2">Precio máximo de compra</h3>
          <div className="text-sm space-y-2">
            <div className="flex justify-between"><span>Pago inicial (estimado)</span><span className="font-medium">{money(downPaymentCAD)}</span></div>
            <div className="flex justify-between"><span>Incluir estimación de prima</span><span className="font-medium">{includeDefaultPremium ? "Sí" : "No"}</span></div>
            <div className="flex justify-between border-t pt-2 mt-2"><span>Precio máximo de compra</span><span className="font-semibold">{money(maxPriceResult.price)}</span></div>
            <div className="flex justify-between"><span>% de pago inicial al precio máx.</span><span className="font-medium">{Number.isFinite(maxPriceResult.downPct) ? (maxPriceResult.downPct*100).toFixed(2) + "%" : "—"}</span></div>
            <div className="flex justify-between"><span>Préstamo base (antes de prima)</span><span className="font-medium">{money(maxPriceResult.baseLoan)}</span></div>
            <div className="flex justify-between"><span>Prima del seguro</span><span className="font-medium">{money(maxPriceResult.premiumAmt)}</span></div>
            <div className="flex justify-between"><span>Hipoteca asegurada (con prima)</span><span className="font-medium">{money(maxPriceResult.insuredLoan)}</span></div>
          </div>
          <p className="text-xs text-brand-blue/70 mt-2">
            La estimación de la prima usa tramos comunes (4.00%, 3.10%, 2.80%) según tu % efectivo de pago inicial; confirma con tu prestamista/aseguradora.
          </p>
        </section>
      </div>

      {/* Encabezado para impresión */}
      <div className="hidden print:block mt-6 mb-3 text-center">
        <div className="font-sans font-bold text-brand-green text-2xl">Asequibilidad Hipotecaria — Resumen</div>
        <div className="text-xs text-brand-blue">Preparado {printDate}</div>
        <div className="w-16 h-[2px] bg-brand-gold rounded-full mx-auto mt-2" />
      </div>

      {/* Supuestos */}
      <details className="mt-6 rounded-2xl border border-brand-gold/40 bg-brand-beige/40 p-4">
        <summary className="cursor-pointer font-semibold text-brand-green">Supuestos y notas</summary>
        <ul className="list-disc ml-5 mt-2 text-sm text-brand-blue/80 space-y-1">
          <li>Estimación educativa. Los programas de prestamistas varían (tasa de estrés, excepciones, topes de amortización, tratamiento de cuotas de condominio, etc.).</li>
          <li>GDS incluye: capital e interés de la hipoteca (a la tasa de calificación), impuestos a la propiedad, calefacción, 50% de cuotas de condominio y seguro de hogar.</li>
          <li>TDS agrega otras obligaciones mensuales (líneas de crédito, préstamos, tarjetas, pensiones alimenticias, etc.).</li>
          <li>Si el pago inicial es &lt; 20%, la prima del seguro se agrega a la hipoteca (no sale del pago inicial) y depende del programa exacto.</li>
          <li>Confirma siempre con tu prestamista y revisa tu compromiso hipotecario para los detalles finales de calificación.</li>
        </ul>
      </details>

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
