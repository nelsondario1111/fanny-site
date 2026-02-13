"use client";

import { useMemo, useState } from "react";
import ToolShell from "@/components/ToolShell";
import { downloadCsv } from "@/lib/spreadsheet";
import { FaPrint, FaFileCsv, FaPlus, FaTrash } from "react-icons/fa";

/* =========================================================
   Tipos
   ========================================================= */
type UnitRow = { id: number; label: string; rent: number };

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
/** Pago mensual totalmente amortizado */
function monthlyPayment(P: number, annualRatePct: number, years: number) {
  const n = Math.max(1, Math.round(years * 12));
  const i = Math.max(0, annualRatePct) / 100 / 12;
  if (i === 0) return P / n;
  return (P * i * Math.pow(1 + i, n)) / (Math.pow(1 + i, n) - 1);
}
/** CSV robusto (comillas + CRLF + BOM para Excel) */

/* =========================================================
   Página
   ========================================================= */
export default function Page() {
  /* -----------------------------
     Compra y financiamiento
     ----------------------------- */
  const [purchasePrice, setPurchasePrice] = useState<number>(850_000);
  const [downPct, setDownPct] = useState<number>(20);
  const [closingCosts, setClosingCosts] = useState<number>(15_000);
  const [initialRepairs, setInitialRepairs] = useState<number>(5_000);

  const [ratePct, setRatePct] = useState<number>(5.25);
  const [amortYears, setAmortYears] = useState<number>(25);

  /* -----------------------------
     Ingreso por alquiler
     ----------------------------- */
  const [units, setUnits] = useState<UnitRow[]>([
    { id: 1, label: "Unidad A", rent: 2200 },
    { id: 2, label: "Unidad B", rent: 2100 },
  ]);
  const [vacancyPct, setVacancyPct] = useState<number>(4); // % del alquiler
  const [otherIncomeMonthly, setOtherIncomeMonthly] = useState<number>(100); // estacionamiento/lavandería (mensual)

  /* -----------------------------
     Gastos operativos (mensuales fijos + %)
     ----------------------------- */
  const [taxesMonthly, setTaxesMonthly] = useState<number>(350);
  const [insuranceMonthly, setInsuranceMonthly] = useState<number>(100);
  const [utilitiesMonthly, setUtilitiesMonthly] = useState<number>(200);
  const [condoHOAMonthly, setCondoHOAMonthly] = useState<number>(0);
  const [lawnSnowMonthly, setLawnSnowMonthly] = useState<number>(0);
  const [otherFixedMonthly, setOtherFixedMonthly] = useState<number>(0);

  const [mgmtPctEGI, setMgmtPctEGI] = useState<number>(8); // % del Ingreso Bruto Efectivo (EGI)
  const [maintenancePctGPR, setMaintenancePctGPR] = useState<number>(5); // % del Alquiler Bruto Potencial (GPR)
  const [capexPctGPR, setCapexPctGPR] = useState<number>(5); // % del GPR

  const printDate = new Date().toLocaleDateString("es-CA", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  /* -----------------------------
     Métricas derivadas
     ----------------------------- */
  const {
    loanAmount,
    cashInvested,
    gprRentMonthly,
    gprRentAnnual,
    vacancyLossAnnual,
    otherIncomeAnnual,
    egiAnnual,
    fixedOpexAnnual,
    mgmtAnnual,
    maintenanceAnnual,
    capexAnnual,
    totalOpexAnnual,
    noiAnnual,
    adsAnnual,
    cashFlowBeforeTax,
    dscr,
    capRate,
    cashOnCash,
  } = useMemo(() => {
    const dpDec = Math.min(Math.max(downPct / 100, 0), 1);
    const loanAmount = Math.max(0, purchasePrice * (1 - dpDec));
    const cashInvested = purchasePrice * dpDec + (closingCosts || 0) + (initialRepairs || 0);

    const gprRentMonthly = units.reduce((sum, u) => sum + (u.rent || 0), 0);
    const gprRentAnnual = gprRentMonthly * 12;
    const vacancyLossAnnual = (gprRentAnnual * Math.max(0, vacancyPct)) / 100;
    const otherIncomeAnnual = (otherIncomeMonthly || 0) * 12;

    const egiAnnual = gprRentAnnual - vacancyLossAnnual + otherIncomeAnnual;

    const fixedMonthly =
      (taxesMonthly || 0) +
      (insuranceMonthly || 0) +
      (utilitiesMonthly || 0) +
      (condoHOAMonthly || 0) +
      (lawnSnowMonthly || 0) +
      (otherFixedMonthly || 0);
    const fixedOpexAnnual = fixedMonthly * 12;

    const mgmtAnnual = (egiAnnual * Math.max(0, mgmtPctEGI)) / 100;
    const maintenanceAnnual = (gprRentAnnual * Math.max(0, maintenancePctGPR)) / 100;
    const capexAnnual = (gprRentAnnual * Math.max(0, capexPctGPR)) / 100;

    const totalOpexAnnual = fixedOpexAnnual + mgmtAnnual + maintenanceAnnual + capexAnnual;

    const noiAnnual = egiAnnual - totalOpexAnnual;

    const monthlyPmt = monthlyPayment(loanAmount, Math.max(0, ratePct), Math.max(1, amortYears));
    // Incluye pago de principal aunque la tasa sea 0% (financiamiento sin interés).
    const adsAnnual = loanAmount > 0 ? monthlyPmt * 12 : 0;

    const cashFlowBeforeTax = noiAnnual - adsAnnual;

    const dscr = adsAnnual > 0 ? noiAnnual / adsAnnual : NaN;
    const capRate = purchasePrice > 0 ? noiAnnual / purchasePrice : 0;
    const cashOnCash = cashInvested > 0 ? cashFlowBeforeTax / cashInvested : 0;

    return {
      loanAmount,
      cashInvested,
      gprRentMonthly,
      gprRentAnnual,
      vacancyLossAnnual,
      otherIncomeAnnual,
      egiAnnual,
      fixedOpexAnnual,
      mgmtAnnual,
      maintenanceAnnual,
      capexAnnual,
      totalOpexAnnual,
      noiAnnual,
      adsAnnual,
      cashFlowBeforeTax,
      dscr,
      capRate,
      cashOnCash,
    };
  }, [
    purchasePrice,
    downPct,
    closingCosts,
    initialRepairs,
    ratePct,
    amortYears,
    units,
    vacancyPct,
    otherIncomeMonthly,
    taxesMonthly,
    insuranceMonthly,
    utilitiesMonthly,
    condoHOAMonthly,
    lawnSnowMonthly,
    otherFixedMonthly,
    mgmtPctEGI,
    maintenancePctGPR,
    capexPctGPR,
  ]);

  /* -----------------------------
     Acciones
     ----------------------------- */
  function addUnit() {
    setUnits((prev) => [
      ...prev,
      { id: (prev.at(-1)?.id ?? 0) + 1, label: `Unidad ${String.fromCharCode(65 + prev.length)}`, rent: 0 },
    ]);
  }
  function removeUnit(id: number) {
    setUnits((prev) => prev.filter((u) => u.id !== id));
  }
  function updateUnit(id: number, patch: Partial<UnitRow>) {
    setUnits((prev) => prev.map((u) => (u.id === id ? { ...u, ...patch } : u)));
  }

  function handlePrint() {
    window.print(); // Usa “Guardar como PDF” si quieres
  }

  function exportCSV() {
    const rows: Array<Array<string | number>> = [];
    rows.push(["Preparado", printDate]);
    rows.push(["Precio de compra", purchasePrice.toFixed(2)]);
    rows.push(["Pago inicial (%)", downPct.toFixed(2)]);
    rows.push(["Monto del préstamo", loanAmount.toFixed(2)]);
    rows.push(["Costos de cierre", (closingCosts || 0).toFixed(2)]);
    rows.push(["Reparaciones iniciales", (initialRepairs || 0).toFixed(2)]);
    rows.push(["Tasa de interés (%)", ratePct.toFixed(2)]);
    rows.push(["Amortización (años)", amortYears]);
    rows.push(["—", "—"]);

    rows.push(["Unidades"]);
    rows.push(["Etiqueta", "Alquiler mensual"]);
    for (const u of units) rows.push([u.label, u.rent.toFixed(2)]);

    rows.push(["—", "—"]);
    rows.push(["Vacancia y morosidad (%)", vacancyPct.toFixed(2)]);
    rows.push(["Otros ingresos (mensuales)", (otherIncomeMonthly || 0).toFixed(2)]);
    rows.push(["—", "—"]);

    rows.push(["Gastos operativos (mensuales)"]);
    rows.push(["Impuesto a la propiedad", (taxesMonthly || 0).toFixed(2)]);
    rows.push(["Seguro", (insuranceMonthly || 0).toFixed(2)]);
    rows.push(["Servicios (utilities)", (utilitiesMonthly || 0).toFixed(2)]);
    rows.push(["Condo/HOA", (condoHOAMonthly || 0).toFixed(2)]);
    rows.push(["Césped/Nieve", (lawnSnowMonthly || 0).toFixed(2)]);
    rows.push(["Otros fijos", (otherFixedMonthly || 0).toFixed(2)]);
    rows.push(["—", "—"]);
    rows.push([`Administración (% de EGI)`, `${mgmtPctEGI.toFixed(2)}%`]);
    rows.push([`Mantenimiento (% de GPR)`, `${maintenancePctGPR.toFixed(2)}%`]);
    rows.push([`CapEx (% de GPR)`, `${capexPctGPR.toFixed(2)}%`]);

    rows.push(["—", "—"]);
    rows.push(["Derivados (ANUAL)"]);
    rows.push(["Alquiler Bruto Potencial (GPR)", gprRentAnnual.toFixed(2)]);
    rows.push(["Pérdida por vacancia/morosidad", (-vacancyLossAnnual).toFixed(2)]);
    rows.push(["Otros ingresos", otherIncomeAnnual.toFixed(2)]);
    rows.push(["Ingreso Bruto Efectivo (EGI)", egiAnnual.toFixed(2)]);
    rows.push(["Gastos fijos", (-fixedOpexAnnual).toFixed(2)]);
    rows.push(["Administración", (-mgmtAnnual).toFixed(2)]);
    rows.push(["Mantenimiento", (-maintenanceAnnual).toFixed(2)]);
    rows.push(["CapEx", (-capexAnnual).toFixed(2)]);
    rows.push(["Total gastos operativos", (-totalOpexAnnual).toFixed(2)]);
    rows.push(["NOI (Ingreso Operativo Neto)", noiAnnual.toFixed(2)]);
    rows.push(["Servicio anual de la deuda (ADS)", (-adsAnnual).toFixed(2)]);
    rows.push(["Flujo de caja (antes de impuestos)", cashFlowBeforeTax.toFixed(2)]);
    rows.push(["—", "—"]);
    rows.push(["DSCR (Cobertura de deuda)", Number.isFinite(dscr) ? dscr.toFixed(2) : "—"]);
    rows.push(["Cap rate", (capRate * 100).toFixed(2) + "%"]);
    rows.push(["Efectivo invertido", cashInvested.toFixed(2)]);
    rows.push(["Cash-on-Cash", (cashOnCash * 100).toFixed(2) + "%"]);

    downloadCsv("flujo_caja_alquileres_resumen", rows);
  }

  function resetExample() {
    setPurchasePrice(850_000);
    setDownPct(20);
    setClosingCosts(15_000);
    setInitialRepairs(5_000);
    setRatePct(5.25);
    setAmortYears(25);
    setUnits([
      { id: 1, label: "Unidad A", rent: 2200 },
      { id: 2, label: "Unidad B", rent: 2100 },
    ]);
    setVacancyPct(4);
    setOtherIncomeMonthly(100);
    setTaxesMonthly(350);
    setInsuranceMonthly(100);
    setUtilitiesMonthly(200);
    setCondoHOAMonthly(0);
    setLawnSnowMonthly(0);
    setOtherFixedMonthly(0);
    setMgmtPctEGI(8);
    setMaintenancePctGPR(5);
    setCapexPctGPR(5);
  }

  /* -----------------------------
     Render
     ----------------------------- */
  return (
    <ToolShell
      title="Flujo de Caja de Alquileres"
      subtitle="Proyecta ingresos, gastos y financiamiento para ver NOI, DSCR, cap rate y cash-on-cash."
      lang="es"
    >
      {/* Barra de herramientas */}
      <div className="tool-actions">
        <button
          type="button"
          onClick={handlePrint}
          className="tool-btn-primary"
          title="Abrir diálogo de impresión (elige 'Guardar como PDF')"
        >
          <FaPrint aria-hidden /> Imprimir o guardar PDF
        </button>
        <button
          type="button"
          onClick={exportCSV}
          className="tool-btn-blue"
          title="Exportar un resumen detallado"
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
        {/* Compra y financiamiento */}
        <section className="tool-card grid gap-3">
          <h3 className="font-sans text-lg text-brand-green font-semibold">Compra y financiamiento</h3>
          <label className="block text-sm font-medium text-brand-blue mb-1">Precio de compra (CAD)</label>
          <input
            type="number"
            min={0}
            inputMode="decimal"
            className="tool-field-lg"
            value={purchasePrice}
            onChange={(e) => setPurchasePrice(Number(e.target.value || 0))}
          />
          <label className="block text-sm font-medium text-brand-blue mt-2 mb-1">Pago inicial (% del precio)</label>
          <input
            type="number"
            min={0}
            max={100}
            step={0.1}
            inputMode="decimal"
            className="tool-field-lg"
            value={downPct}
            onChange={(e) => setDownPct(Number(e.target.value || 0))}
          />
          <label className="block text-sm font-medium text-brand-blue mt-2 mb-1">Costos de cierre (únicos, CAD)</label>
          <input
            type="number"
            min={0}
            inputMode="decimal"
            className="tool-field-lg"
            value={closingCosts}
            onChange={(e) => setClosingCosts(Number(e.target.value || 0))}
          />
          <label className="block text-sm font-medium text-brand-blue mt-2 mb-1">Reparaciones iniciales / Turnover (CAD)</label>
          <input
            type="number"
            min={0}
            inputMode="decimal"
            className="tool-field-lg"
            value={initialRepairs}
            onChange={(e) => setInitialRepairs(Number(e.target.value || 0))}
          />
          <div className="grid grid-cols-2 gap-3 mt-2">
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
          </div>
          <p className="text-xs text-brand-blue/70 mt-1">
            El monto del préstamo se deriva del precio y el pago inicial. Usa 100% de pago inicial para modelar compra al contado.
          </p>
        </section>

        {/* Ingreso por alquiler */}
        <section className="tool-card">
          <h3 className="font-sans text-lg text-brand-green font-semibold mb-2">Ingreso por alquiler</h3>
          <div className="flex flex-col gap-2">
            <div className="grid grid-cols-12 font-semibold text-sm text-brand-blue">
              <div className="col-span-6">Unidad</div>
              <div className="col-span-5">Renta mensual (CAD)</div>
              <div className="col-span-1 text-right"> </div>
            </div>
            {units.map((u) => (
              <div key={u.id} className="grid grid-cols-1 sm:grid-cols-12 items-center gap-2">
                <input
                  type="text"
                  className="sm:col-span-6 tool-field"
                  value={u.label}
                  onChange={(e) => updateUnit(u.id, { label: e.target.value })}
                />
                <input
                  type="number"
                  min={0}
                  inputMode="decimal"
                  className="sm:col-span-5 tool-field text-right"
                  value={u.rent}
                  onChange={(e) => updateUnit(u.id, { rent: Number(e.target.value || 0) })}
                />
                <button
                  type="button"
                  onClick={() => removeUnit(u.id)}
                  className="sm:col-span-1 justify-self-end text-brand-blue/70 hover:text-brand-blue"
                  title="Eliminar unidad"
                  aria-label={`Eliminar ${u.label}`}
                >
                  <FaTrash aria-hidden />
                </button>
              </div>
            ))}
            <div className="mt-2">
              <button
                type="button"
                onClick={addUnit}
                className="tool-btn-green"
              >
                <FaPlus aria-hidden /> Agregar unidad
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-4">
            <div>
              <label className="block text-sm font-medium text-brand-blue mb-1">Vacancia y morosidad (%)</label>
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
              <label className="block text-sm font-medium text-brand-blue mb-1">Otros ingresos (mensual, CAD)</label>
              <input
                type="number"
                min={0}
                inputMode="decimal"
                className="tool-field"
                value={otherIncomeMonthly}
                onChange={(e) => setOtherIncomeMonthly(Number(e.target.value || 0))}
              />
              <p className="text-xs text-brand-blue/70 mt-1">Estacionamiento, lavandería, storage, etc.</p>
            </div>
          </div>

          <div className="mt-3 text-sm text-brand-blue/80">
            <div className="flex justify-between">
              <span>Alquiler Bruto Potencial (mensual)</span>
              <span className="font-medium">{money(gprRentMonthly, 0)}</span>
            </div>
            <div className="flex justify-between">
              <span>Alquiler Bruto Potencial (anual)</span>
              <span className="font-medium">{money(gprRentAnnual, 0)}</span>
            </div>
          </div>
        </section>

        {/* Gastos operativos */}
        <section className="tool-card">
          <h3 className="font-sans text-lg text-brand-green font-semibold mb-2">Gastos operativos</h3>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-brand-blue mb-1">Impuesto a la propiedad (mensual)</label>
              <input
                type="number"
                min={0}
                inputMode="decimal"
                className="tool-field"
                value={taxesMonthly}
                onChange={(e) => setTaxesMonthly(Number(e.target.value || 0))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-brand-blue mb-1">Seguro (mensual)</label>
              <input
                type="number"
                min={0}
                inputMode="decimal"
                className="tool-field"
                value={insuranceMonthly}
                onChange={(e) => setInsuranceMonthly(Number(e.target.value || 0))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-brand-blue mb-1">Servicios (utilities) (mensual)</label>
              <input
                type="number"
                min={0}
                inputMode="decimal"
                className="tool-field"
                value={utilitiesMonthly}
                onChange={(e) => setUtilitiesMonthly(Number(e.target.value || 0))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-brand-blue mb-1">Condo / HOA (mensual)</label>
              <input
                type="number"
                min={0}
                inputMode="decimal"
                className="tool-field"
                value={condoHOAMonthly}
                onChange={(e) => setCondoHOAMonthly(Number(e.target.value || 0))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-brand-blue mb-1">Césped / Nieve (mensual)</label>
              <input
                type="number"
                min={0}
                inputMode="decimal"
                className="tool-field"
                value={lawnSnowMonthly}
                onChange={(e) => setLawnSnowMonthly(Number(e.target.value || 0))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-brand-blue mb-1">Otros fijos (mensual)</label>
              <input
                type="number"
                min={0}
                inputMode="decimal"
                className="tool-field"
                value={otherFixedMonthly}
                onChange={(e) => setOtherFixedMonthly(Number(e.target.value || 0))}
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 mt-4">
            <div>
              <label className="block text-sm font-medium text-brand-blue mb-1">Administración (% de EGI)</label>
              <input
                type="number"
                min={0}
                max={100}
                step={0.1}
                inputMode="decimal"
                className="tool-field"
                value={mgmtPctEGI}
                onChange={(e) => setMgmtPctEGI(Number(e.target.value || 0))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-brand-blue mb-1">Mantenimiento (% de GPR)</label>
              <input
                type="number"
                min={0}
                max={100}
                step={0.1}
                inputMode="decimal"
                className="tool-field"
                value={maintenancePctGPR}
                onChange={(e) => setMaintenancePctGPR(Number(e.target.value || 0))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-brand-blue mb-1">CapEx (% de GPR)</label>
              <input
                type="number"
                min={0}
                max={100}
                step={0.1}
                inputMode="decimal"
                className="tool-field"
                value={capexPctGPR}
                onChange={(e) => setCapexPctGPR(Number(e.target.value || 0))}
              />
            </div>
          </div>

          <p className="text-xs text-brand-blue/70 mt-2">
            Los gastos fijos se anualizan desde las entradas mensuales. Administración es % del <b>EGI</b>; Mantenimiento y CapEx son % del <b>GPR</b>.
          </p>
        </section>
      </form>

      {/* Encabezado al imprimir (solo visible al imprimir) */}
      <div className="hidden print:block mt-6 mb-3 text-center">
        <div className="font-sans font-bold text-brand-green text-2xl">Flujo de Caja de Alquileres — Resumen</div>
        <div className="text-xs text-brand-blue">Preparado el {printDate}</div>
        <div className="w-16 h-[2px] bg-brand-gold rounded-full mx-auto mt-2" />
      </div>

      {/* Resultados */}
      <div className="mt-8 grid xl:grid-cols-3 gap-6">
        {/* Resumen de ingresos */}
        <section className="tool-card avoid-break">
          <h3 className="font-sans text-xl text-brand-green font-semibold mb-2">Ingresos (anual)</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span>Alquiler Bruto Potencial (GPR)</span><span className="font-medium">{money(gprRentAnnual)}</span></div>
            <div className="flex justify-between"><span>Pérdida por vacancia/morosidad</span><span className="font-medium">−{money(vacancyLossAnnual)}</span></div>
            <div className="flex justify-between"><span>Otros ingresos</span><span className="font-medium">{money(otherIncomeAnnual)}</span></div>
            <div className="flex justify-between border-t pt-2 mt-2"><span>Ingreso Bruto Efectivo (EGI)</span><span className="font-semibold">{money(egiAnnual)}</span></div>
          </div>
        </section>

        {/* Gastos operativos */}
        <section className="tool-card avoid-break">
          <h3 className="font-sans text-xl text-brand-green font-semibold mb-2">Gastos operativos (anual)</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span>Gastos fijos</span><span className="font-medium">−{money(fixedOpexAnnual)}</span></div>
            <div className="flex justify-between"><span>Administración</span><span className="font-medium">−{money(mgmtAnnual)}</span></div>
            <div className="flex justify-between"><span>Mantenimiento</span><span className="font-medium">−{money(maintenanceAnnual)}</span></div>
            <div className="flex justify-between"><span>CapEx</span><span className="font-medium">−{money(capexAnnual)}</span></div>
            <div className="flex justify-between border-t pt-2 mt-2"><span>Total gastos operativos</span><span className="font-semibold">−{money(totalOpexAnnual)}</span></div>
            <div className="flex justify-between"><span>NOI (Ingreso Operativo Neto)</span><span className="font-semibold">{money(noiAnnual)}</span></div>
          </div>
        </section>

        {/* Rendimientos y deuda */}
        <section className="tool-card avoid-break">
          <h3 className="font-sans text-xl text-brand-green font-semibold mb-2">Rendimientos y deuda</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span>Servicio anual de la deuda (ADS)</span><span className="font-medium">−{money(adsAnnual)}</span></div>
            <div className="flex justify-between"><span>Flujo de caja (antes de impuestos)</span><span className="font-semibold">{money(cashFlowBeforeTax)}</span></div>
            <div className="flex justify-between border-t pt-2 mt-2"><span>DSCR</span><span className="font-medium">{Number.isFinite(dscr) ? dscr.toFixed(2) : "—"}</span></div>
            <div className="flex justify-between"><span>Cap rate</span><span className="font-medium">{pct(capRate)}</span></div>
            <div className="flex justify-between"><span>Efectivo invertido</span><span className="font-medium">{money(cashInvested)}</span></div>
            <div className="flex justify-between"><span>Cash-on-Cash</span><span className="font-medium">{pct(cashOnCash)}</span></div>
          </div>

          <details className="mt-4 rounded-2xl border border-brand-gold/40 bg-brand-beige/40 p-4">
            <summary className="cursor-pointer font-semibold text-brand-green">Supuestos y notas</summary>
            <ul className="list-disc ml-5 mt-2 text-sm text-brand-blue/80 space-y-1">
              <li>NOI excluye capital e intereses de hipoteca (eso se muestra como ADS).</li>
              <li>Administración es % del <b>EGI</b>; Mantenimiento y CapEx son % del <b>GPR</b>.</li>
              <li>Cash-on-Cash = (NOI − ADS) ÷ (Pago inicial + Cierre + Reparaciones iniciales).</li>
              <li>Estimaciones educativas; los valores reales variarán según contratos, servicios y ciclos de mantenimiento.</li>
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
