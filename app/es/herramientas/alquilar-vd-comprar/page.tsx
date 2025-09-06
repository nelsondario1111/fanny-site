"use client";

import { useMemo, useState } from "react";
import ToolShell from "@/components/ToolShell";
import { FaPrint, FaFileCsv } from "react-icons/fa";

/* =========================================================
   Helpers
   ========================================================= */
function money(n: number, digits = 0) {
  return (Number.isFinite(n) ? n : 0).toLocaleString("es-CA", {
    style: "currency",
    currency: "CAD",
    maximumFractionDigits: digits,
  });
}
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
  const csv = toCSV(rows);
  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${baseName}_${iso}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}
/** Pago mensual totalmente amortizado */
function monthlyPayment(P: number, annualRatePct: number, years: number) {
  const n = Math.max(1, Math.round(years * 12));
  const i = Math.max(0, annualRatePct) / 100 / 12;
  if (i === 0) return P / n;
  return (P * i * Math.pow(1 + i, n)) / (Math.pow(1 + i, n) - 1);
}
/** Saldo remanente tras m meses (pago nivelado) */
function remainingBalance(P: number, annualRatePct: number, years: number, monthsElapsed: number) {
  const n = Math.max(1, Math.round(years * 12));
  const m = Math.min(Math.max(0, Math.floor(monthsElapsed)), n);
  const i = Math.max(0, annualRatePct) / 100 / 12;
  if (i === 0) return Math.max(0, P - (P / n) * m);
  const M = monthlyPayment(P, annualRatePct, years);
  const pow = Math.pow(1 + i, m);
  return P * pow - (M * (pow - 1)) / i;
}

/* =========================================================
   Página
   ========================================================= */
export default function Page() {
  /* -----------------------------
     COMPRAR — Entradas
     ----------------------------- */
  const [purchasePrice, setPurchasePrice] = useState<number>(850_000);
  const [downPct, setDownPct] = useState<number>(20); // % del precio
  const [ratePct, setRatePct] = useState<number>(5.49);
  const [amortYears, setAmortYears] = useState<number>(25);
  const [closingCosts, setClosingCosts] = useState<number>(15_000); // legales, impuesto de transferencia, ajustes, etc.

  const [propertyTaxAnnual, setPropertyTaxAnnual] = useState<number>(4_250);
  const [maintenancePctAnnual, setMaintenancePctAnnual] = useState<number>(1.0); // % del valor por año
  const [hoaMonthly, setHoaMonthly] = useState<number>(0); // condo/strata/HOA
  const [homeInsMonthly, setHomeInsMonthly] = useState<number>(85);
  const [sellingCostPct, setSellingCostPct] = useState<number>(4); // % del precio de venta (agente+legal+varios)

  /* -----------------------------
     ALQUILAR — Entradas
     ----------------------------- */
  const [rentMonthly, setRentMonthly] = useState<number>(2_900);
  const [rentGrowthPctAnnual, setRentGrowthPctAnnual] = useState<number>(3.0);
  const [renterInsMonthly, setRenterInsMonthly] = useState<number>(25);

  /* -----------------------------
     Horizonte y supuestos
     ----------------------------- */
  const [horizonYears, setHorizonYears] = useState<number>(7);
  const [homeAppreciationPctAnnual, setHomeAppreciationPctAnnual] = useState<number>(3.0);
  const [investmentReturnPctAnnual, setInvestmentReturnPctAnnual] = useState<number>(5.0);

  const printDate = new Date().toLocaleDateString("es-CA", { year: "numeric", month: "long", day: "numeric" });

  /* -----------------------------
     Simulación derivada
     ----------------------------- */
  const results = useMemo(() => {
    const price = Math.max(0, purchasePrice || 0);
    const dpDec = Math.min(Math.max((downPct || 0) / 100, 0), 1);
    const downPayment = price * dpDec;
    const principal = Math.max(0, price - downPayment);

    const nMonths = Math.max(1, Math.round((horizonYears || 0) * 12));
    // const i_mort = Math.max(0, ratePct) / 100 / 12; // ← (eliminado por no usarse)
    const i_rent = Math.max(0, rentGrowthPctAnnual) / 100 / 12;
    const g_home = Math.max(0, homeAppreciationPctAnnual) / 100 / 12;
    const i_inv = Math.max(0, investmentReturnPctAnnual) / 100 / 12;

    const M = monthlyPayment(principal, ratePct || 0, amortYears || 25);

    let houseValue = price;
    let rent = Math.max(0, rentMonthly || 0);
    const taxPctOfValue = price > 0 ? (propertyTaxAnnual || 0) / price : 0;

    let totalOwnerCashOut = 0;
    let totalRenterCashOut = 0;

    // Inversión del inquilino (inicia con pago inicial + costos de cierre evitados; aporta ahorros mensuales si los hay)
    let renterFV = (downPayment + Math.max(0, closingCosts || 0));
    renterFV *= 1 + i_inv; // crecer desde el mes 1

    // Flujo mensual — mes 1 (para mostrar)
    let ownerCashMonth1 = 0;
    let renterCashMonth1 = 0;

    for (let m = 1; m <= nMonths; m++) {
      // Costos recurrentes del propietario
      const propertyTaxM = (taxPctOfValue * houseValue) / 12;
      const maintenanceM = (Math.max(0, maintenancePctAnnual || 0) / 100) * houseValue / 12;
      const ownerMonthlyCash =
        M + propertyTaxM + maintenanceM + Math.max(0, hoaMonthly || 0) + Math.max(0, homeInsMonthly || 0);

      // Costos recurrentes del inquilino
      const renterMonthlyCash = rent + Math.max(0, renterInsMonthly || 0);

      // Captura de mes 1
      if (m === 1) {
        ownerCashMonth1 = ownerMonthlyCash;
        renterCashMonth1 = renterMonthlyCash;
      }

      totalOwnerCashOut += ownerMonthlyCash;
      totalRenterCashOut += renterMonthlyCash;

      // Si alquilar es más barato este mes, invertir la diferencia
      const diff = ownerMonthlyCash - renterMonthlyCash;
      if (diff > 0) {
        renterFV = (renterFV + diff) * (1 + i_inv);
      } else {
        renterFV = renterFV * (1 + i_inv);
      }

      // Actualizar renta y valor de casa para el próximo mes
      rent = rent * (1 + i_rent);
      houseValue = houseValue * (1 + g_home);
    }

    // Saldo de hipoteca y patrimonio del propietario al horizonte
    const remBal = remainingBalance(principal, ratePct || 0, amortYears || 25, nMonths);
    const salePrice = price * Math.pow(1 + g_home, nMonths);
    const saleCosts = salePrice * Math.max(0, sellingCostPct || 0) / 100;
    const ownerNetWorth = Math.max(0, salePrice - saleCosts - Math.max(0, remBal));

    const renterNetWorth = Math.max(0, renterFV);

    // Ventaja neta = patrimonio propietario − patrimonio inquilino
    const netAdvantage = ownerNetWorth - renterNetWorth;

    // Escaneo simple de año de equilibrio
    let breakEvenYear: number | null = null;
    let cumulativeMonths = 0;
    for (let y = 1; y <= Math.ceil(nMonths / 12); y++) {
      cumulativeMonths = Math.min(nMonths, y * 12);
      const rb = remainingBalance(principal, ratePct || 0, amortYears || 25, cumulativeMonths);
      const sp = price * Math.pow(1 + g_home, cumulativeMonths);
      const sc = sp * Math.max(0, sellingCostPct || 0) / 100;

      // Recalcular inversión del inquilino hasta ese año
      let rentY = Math.max(0, rentMonthly || 0);
      let hvY = price;
      let renterFVY = (downPayment + Math.max(0, closingCosts || 0)) * (1 + i_inv);
      for (let m = 1; m <= cumulativeMonths; m++) {
        const taxM = (taxPctOfValue * hvY) / 12;
        const maintM = (Math.max(0, maintenancePctAnnual || 0) / 100) * hvY / 12;
        const ownerCash = M + taxM + maintM + Math.max(0, hoaMonthly || 0) + Math.max(0, homeInsMonthly || 0);
        const renterCash = rentY + Math.max(0, renterInsMonthly || 0);
        const dif = ownerCash - renterCash;
        if (dif > 0) renterFVY = (renterFVY + dif) * (1 + i_inv);
        else renterFVY = renterFVY * (1 + i_inv);
        rentY *= 1 + i_rent;
        hvY *= 1 + g_home;
      }
      const ownerNWy = Math.max(0, sp - sc - Math.max(0, rb));
      const renterNWy = Math.max(0, renterFVY);
      if (ownerNWy >= renterNWy) { breakEvenYear = y; break; }
    }

    return {
      M,
      ownerCashMonth1,
      renterCashMonth1,
      totalOwnerCashOut,
      totalRenterCashOut,
      ownerNetWorth,
      renterNetWorth,
      netAdvantage,
      remainingBalance: remBal,
      salePrice,
      saleCosts,
      downPayment,
      principal,
      breakEvenYear,
    };
  }, [
    purchasePrice, downPct, ratePct, amortYears, closingCosts,
    propertyTaxAnnual, maintenancePctAnnual, hoaMonthly, homeInsMonthly,
    sellingCostPct, rentMonthly, rentGrowthPctAnnual, renterInsMonthly,
    horizonYears, homeAppreciationPctAnnual, investmentReturnPctAnnual
  ]);

  /* -----------------------------
     Acciones
     ----------------------------- */
  function handlePrint() { window.print(); }
  function exportCSV() {
    const r = results;
    const rows: Array<Array<string | number>> = [
      ["Preparado", printDate],
      ["—", "—"],
      ["COMPRAR — Entradas"],
      ["Precio de compra", purchasePrice.toFixed(2)],
      ["Pago inicial (%)", downPct.toFixed(2)],
      ["Tasa (%)", ratePct.toFixed(2)],
      ["Amortización (años)", amortYears],
      ["Costos de cierre (est.)", closingCosts.toFixed(2)],
      ["Impuesto a la propiedad (anual)", propertyTaxAnnual.toFixed(2)],
      ["Mantenimiento (% del valor, anual)", maintenancePctAnnual.toFixed(2)],
      ["Condo/Strata/HOA (mensual)", hoaMonthly.toFixed(2)],
      ["Seguro de vivienda (mensual)", homeInsMonthly.toFixed(2)],
      ["Costo de venta (% del precio)", sellingCostPct.toFixed(2)],
      ["—", "—"],
      ["ALQUILAR — Entradas"],
      ["Alquiler inicial (mensual)", rentMonthly.toFixed(2)],
      ["Crecimiento del alquiler (% anual)", rentGrowthPctAnnual.toFixed(2)],
      ["Seguro de inquilino (mensual)", renterInsMonthly.toFixed(2)],
      ["—", "—"],
      ["Horizonte y supuestos"],
      ["Horizonte (años)", horizonYears],
      ["Apreciación de la vivienda (% anual)", homeAppreciationPctAnnual.toFixed(2)],
      ["Rendimiento de inversión (% anual)", investmentReturnPctAnnual.toFixed(2)],
      ["—", "—"],
      ["Resultados clave"],
      ["Pago mensual P+I", r.M.toFixed(2)],
      ["Mes 1 — Egreso propietario", r.ownerCashMonth1.toFixed(2)],
      ["Mes 1 — Egreso inquilino", r.renterCashMonth1.toFixed(2)],
      ["Egreso total propietario (horizonte)", r.totalOwnerCashOut.toFixed(2)],
      ["Egreso total inquilino (horizonte)", r.totalRenterCashOut.toFixed(2)],
      ["Patrimonio propietario @ horizonte", r.ownerNetWorth.toFixed(2)],
      ["Activos invertidos del inquilino @ horizonte", r.renterNetWorth.toFixed(2)],
      ["Ventaja neta (Comprar − Alquilar)", r.netAdvantage.toFixed(2)],
      ["Punto de equilibrio (año)", r.breakEvenYear ?? "No alcanzado"],
      ["Saldo hipotecario @ horizonte", r.remainingBalance.toFixed(2)],
      ["Precio de venta @ horizonte", r.salePrice.toFixed(2)],
      ["Costos de venta @ horizonte", r.saleCosts.toFixed(2)],
      ["Pago inicial (CAD)", r.downPayment.toFixed(2)],
      ["Principal inicial (préstamo)", r.principal.toFixed(2)],
    ];
    downloadCSV("alquilar_vs_comprar_resumen", rows);
  }
  function resetExample() {
    setPurchasePrice(850_000);
    setDownPct(20);
    setRatePct(5.49);
    setAmortYears(25);
    setClosingCosts(15_000);
    setPropertyTaxAnnual(4_250);
    setMaintenancePctAnnual(1.0);
    setHoaMonthly(0);
    setHomeInsMonthly(85);
    setSellingCostPct(4);
    setRentMonthly(2_900);
    setRentGrowthPctAnnual(3.0);
    setRenterInsMonthly(25);
    setHorizonYears(7);
    setHomeAppreciationPctAnnual(3.0);
    setInvestmentReturnPctAnnual(5.0);
  }

  /* -----------------------------
     UI
     ----------------------------- */
  return (
    <ToolShell
      title="Alquilar vs Comprar"
      subtitle="Compara flujo mensual, egreso total y patrimonio al horizonte — usando supuestos de apreciación, crecimiento del alquiler y rendimiento de inversiones."
      lang="es"
    >
      {/* Barra de herramientas */}
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
          onClick={exportCSV}
          className="px-4 py-2 bg-white border-2 border-brand-blue text-brand-blue rounded-full inline-flex items-center gap-2 hover:bg-brand-blue hover:text-white transition"
          title="Exportar tu comparación"
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
      <form className="grid 2xl:grid-cols-4 xl:grid-cols-3 gap-6">
        {/* Comprar */}
        <section className="rounded-2xl border border-brand-gold bg-white p-5 grid gap-3">
          <h3 className="font-serif text-lg text-brand-green font-bold">Comprar — Precio y financiamiento</h3>
          <div>
            <label className="block text-sm font-medium text-brand-blue mb-1">Precio de compra (CAD)</label>
            <input
              type="number" min={0} inputMode="decimal"
              className="w-full rounded-xl border border-brand-gold/60 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-gold"
              value={purchasePrice} onChange={(e)=>setPurchasePrice(Number(e.target.value || 0))}
            />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-sm font-medium text-brand-blue mb-1">Pago inicial (%)</label>
              <input
                type="number" min={0} max={100} step={0.1} inputMode="decimal"
                className="w-full rounded-xl border border-brand-gold/60 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-gold"
                value={downPct} onChange={(e)=>setDownPct(Number(e.target.value || 0))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-brand-blue mb-1">Tasa (anual %)</label>
              <input
                type="number" min={0} max={25} step={0.01} inputMode="decimal"
                className="w-full rounded-xl border border-brand-gold/60 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-gold"
                value={ratePct} onChange={(e)=>setRatePct(Number(e.target.value || 0))}
              />
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

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-brand-blue mb-1">Costos de cierre (est.)</label>
              <input
                type="number" min={0} inputMode="decimal"
                className="w-full rounded-xl border border-brand-gold/60 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-gold"
                value={closingCosts} onChange={(e)=>setClosingCosts(Number(e.target.value || 0))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-brand-blue mb-1">Costo de venta (% del precio)</label>
              <input
                type="number" min={0} max={10} step={0.1} inputMode="decimal"
                className="w-full rounded-xl border border-brand-gold/60 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-gold"
                value={sellingCostPct} onChange={(e)=>setSellingCostPct(Number(e.target.value || 0))}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-brand-blue mb-1">Impuesto a la propiedad (anual)</label>
              <input
                type="number" min={0} inputMode="decimal"
                className="w-full rounded-xl border border-brand-gold/60 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-gold"
                value={propertyTaxAnnual} onChange={(e)=>setPropertyTaxAnnual(Number(e.target.value || 0))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-brand-blue mb-1">Mantenimiento (% del valor / año)</label>
              <input
                type="number" min={0} max={10} step={0.1} inputMode="decimal"
                className="w-full rounded-xl border border-brand-gold/60 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-gold"
                value={maintenancePctAnnual} onChange={(e)=>setMaintenancePctAnnual(Number(e.target.value || 0))}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-brand-blue mb-1">Condo/Strata/HOA (mensual)</label>
              <input
                type="number" min={0} inputMode="decimal"
                className="w-full rounded-xl border border-brand-gold/60 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-gold"
                value={hoaMonthly} onChange={(e)=>setHoaMonthly(Number(e.target.value || 0))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-brand-blue mb-1">Seguro de vivienda (mensual)</label>
              <input
                type="number" min={0} inputMode="decimal"
                className="w-full rounded-xl border border-brand-gold/60 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-gold"
                value={homeInsMonthly} onChange={(e)=>setHomeInsMonthly(Number(e.target.value || 0))}
              />
            </div>
          </div>
        </section>

        {/* Alquilar */}
        <section className="rounded-2xl border border-brand-gold bg-white p-5 grid gap-3">
          <h3 className="font-serif text-lg text-brand-green font-bold">Alquilar — Precio y crecimiento</h3>
          <div>
            <label className="block text-sm font-medium text-brand-blue mb-1">Alquiler inicial (mensual)</label>
            <input
              type="number" min={0} inputMode="decimal"
              className="w-full rounded-xl border border-brand-gold/60 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-gold"
              value={rentMonthly} onChange={(e)=>setRentMonthly(Number(e.target.value || 0))}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-brand-blue mb-1">Crecimiento del alquiler (% anual)</label>
              <input
                type="number" min={0} max={15} step={0.1} inputMode="decimal"
                className="w-full rounded-xl border border-brand-gold/60 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-gold"
                value={rentGrowthPctAnnual} onChange={(e)=>setRentGrowthPctAnnual(Number(e.target.value || 0))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-brand-blue mb-1">Seguro de inquilino (mensual)</label>
              <input
                type="number" min={0} inputMode="decimal"
                className="w-full rounded-xl border border-brand-gold/60 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-gold"
                value={renterInsMonthly} onChange={(e)=>setRenterInsMonthly(Number(e.target.value || 0))}
              />
            </div>
          </div>
        </section>

        {/* Horizonte y supuestos */}
        <section className="rounded-2xl border border-brand-gold bg-white p-5">
          <h3 className="font-serif text-lg text-brand-green font-bold mb-2">Horizonte y supuestos</h3>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-brand-blue mb-1">Horizonte (años)</label>
              <input
                type="number" min={1} max={40} step={1} inputMode="decimal"
                className="w-full rounded-xl border border-brand-gold/60 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-gold"
                value={horizonYears} onChange={(e)=>setHorizonYears(Number(e.target.value || 0))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-brand-blue mb-1">Rendimiento de inversión (% anual)</label>
              <input
                type="number" min={0} max={15} step={0.1} inputMode="decimal"
                className="w-full rounded-xl border border-brand-gold/60 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-gold"
                value={investmentReturnPctAnnual} onChange={(e)=>setInvestmentReturnPctAnnual(Number(e.target.value || 0))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-brand-blue mb-1">Apreciación de la vivienda (% anual)</label>
              <input
                type="number" min={-10} max={20} step={0.1} inputMode="decimal"
                className="w-full rounded-xl border border-brand-gold/60 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-gold"
                value={homeAppreciationPctAnnual} onChange={(e)=>setHomeAppreciationPctAnnual(Number(e.target.value || 0))}
              />
            </div>
          </div>
          <p className="text-xs text-brand-blue/70 mt-2">
            La inversión del inquilino inicia con el pago inicial + costos de cierre (efectivo evitado al no comprar) y también invierte cualquier ahorro mensual si alquilar resulta más barato que comprar.
          </p>
        </section>
      </form>

      {/* Resultados */}
      <div className="mt-8 grid xl:grid-cols-3 gap-6">
        <section className="rounded-2xl border border-brand-gold bg-white p-5 avoid-break">
          <h3 className="font-serif text-xl text-brand-green font-bold mb-2">Flujo mensual (Mes 1)</h3>
          <div className="text-sm space-y-2">
            <div className="flex justify-between"><span>Egreso propietario</span><span className="font-medium">{money(results.ownerCashMonth1, 2)}</span></div>
            <div className="flex justify-between"><span>Egreso inquilino</span><span className="font-medium">{money(results.renterCashMonth1, 2)}</span></div>
            <div className="flex justify-between border-t pt-2 mt-2">
              <span>Diferencia (Propietario − Inquilino)</span>
              <span className="font-semibold">{money(results.ownerCashMonth1 - results.renterCashMonth1, 2)}</span>
            </div>
          </div>
          <p className="text-xs text-brand-blue/70 mt-2">
            El egreso del propietario incluye capital e intereses (P+I), impuesto a la propiedad, mantenimiento, condo/strata/HOA y seguro de vivienda.
          </p>
        </section>

        <section className="rounded-2xl border border-brand-gold bg-white p-5 avoid-break">
          <h3 className="font-serif text-xl text-brand-green font-bold mb-2">Egreso total (Horizonte)</h3>
          <div className="text-sm space-y-2">
            <div className="flex justify-between"><span>Egreso total propietario</span><span className="font-medium">{money(results.totalOwnerCashOut, 0)}</span></div>
            <div className="flex justify-between"><span>Egreso total inquilino</span><span className="font-medium">{money(results.totalRenterCashOut, 0)}</span></div>
          </div>
          <details className="mt-4 rounded-2xl border border-brand-gold/40 bg-brand-beige/40 p-4">
            <summary className="cursor-pointer font-semibold text-brand-green">¿Qué se incluye?</summary>
            <ul className="list-disc ml-5 mt-2 text-sm text-brand-blue/80 space-y-1">
              <li>Propietario: pago mensual P&amp;I + impuesto a la propiedad + mantenimiento (% del valor) + condo/strata/HOA + seguro de vivienda.</li>
              <li>Inquilino: alquiler con crecimiento + seguro de inquilino.</li>
              <li>El pago inicial y los costos de cierre se consideran en patrimonio (no se duplican aquí).</li>
            </ul>
          </details>
        </section>

        <section className="rounded-2xl border border-brand-gold bg-white p-5 avoid-break">
          <h3 className="font-serif text-xl text-brand-green font-bold mb-2">Patrimonio al horizonte</h3>
          <div className="text-sm space-y-2">
            <div className="flex justify-between"><span>Patrimonio del propietario (tras costos de venta y saldo)</span><span className="font-medium">{money(results.ownerNetWorth, 0)}</span></div>
            <div className="flex justify-between"><span>Activos invertidos del inquilino</span><span className="font-medium">{money(results.renterNetWorth, 0)}</span></div>
            <div className="flex justify-between border-t pt-2 mt-2">
              <span className="font-semibold">Ventaja neta (Comprar − Alquilar)</span>
              <span className="font-semibold">{money(results.netAdvantage, 0)}</span>
            </div>
            <div className="flex justify-between">
              <span>Punto de equilibrio (primer año en que Comprar ≥ Alquilar)</span>
              <span className="font-medium">{results.breakEvenYear ?? "No alcanzado"}</span>
            </div>
          </div>
          <p className="text-xs text-brand-blue/70 mt-2">
            El patrimonio del propietario es el precio de venta menos costos de venta y saldo hipotecario. El inquilino invierte el efectivo evitado (pago inicial + cierre) y cualquier ahorro mensual cuando alquilar es más barato.
          </p>
        </section>
      </div>

      {/* Encabezado al imprimir */}
      <div className="hidden print:block mt-6 mb-3 text-center">
        <div className="font-serif font-bold text-brand-green text-2xl">Alquilar vs Comprar — Resumen</div>
        <div className="text-xs text-brand-blue">Preparado el {printDate}</div>
        <div className="w-16 h-[2px] bg-brand-gold rounded-full mx-auto mt-2" />
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
