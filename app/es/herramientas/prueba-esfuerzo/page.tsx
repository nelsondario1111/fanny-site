"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import ToolShell from "@/components/ToolShell";

/**
 * Asequibilidad y Prueba de Esfuerzo (ES-CA)
 * Toronto-friendly wording; lenders use acronyms GDS/TDS.
 * - Tasa de calificación = max(tasa contrato + 2%, tasa de referencia/benchmark).
 * - GDS = (pmt hipoteca + impuestos + calefacción + 50% expensas) / ingreso mensual.
 * - TDS = GDS + otras deudas mensuales.
 * - "Hipoteca máxima": principal permitido según pmt permitido.
 * - "Probar escenario": evalúa compra + pago inicial específicos.
 * - Persiste en localStorage.
 */

// ---- Helpers ----
const CAD0 = new Intl.NumberFormat("es-CA", { style: "currency", currency: "CAD", maximumFractionDigits: 0 });
const CAD2 = new Intl.NumberFormat("es-CA", { style: "currency", currency: "CAD", minimumFractionDigits: 2, maximumFractionDigits: 2 });

const NUM = (s: string) => {
  const x = Number(String(s ?? "").replace(/[^\d.-]/g, ""));
  return Number.isFinite(x) ? x : 0;
};
const clamp = (n: number, lo: number, hi: number) => Math.min(Math.max(n, lo), hi);

// pago mensual de hipoteca (cuota fija)
function pmt(principal: number, annualRatePct: number, years: number) {
  if (principal <= 0 || annualRatePct <= 0 || years <= 0) return 0;
  const r = (annualRatePct / 100) / 12;
  const n = years * 12;
  const pow = Math.pow(1 + r, n);
  return (principal * r * pow) / (pow - 1);
}

// principal a partir de un pago mensual permitido
function principalFromPayment(paymentMonthly: number, annualRatePct: number, years: number) {
  if (paymentMonthly <= 0 || annualRatePct <= 0 || years <= 0) return 0;
  const r = (annualRatePct / 100) / 12;
  const n = years * 12;
  const pow = Math.pow(1 + r, n);
  return (paymentMonthly * (pow - 1)) / (r * pow);
}

// ---- Defaults & storage ----
const LS_KEY = "herramientas.prueba_esfuerzo.v1";
type Mode = "max" | "scenario";

const DEFAULTS = {
  mode: "max" as Mode,
  annualIncome: "140000",
  monthlyDebts: "350",

  propertyTaxAnnual: "4200",
  heatMonthly: "120",
  condoFeesMonthly: "0",

  contractRatePct: "4.84",
  benchmarkRatePct: "5.25",
  amortYears: "25",

  gdsPct: "39",
  tdsPct: "44",

  purchasePrice: "800000",
  downPayment: "80000",
};

export default function Page() {
  // ---- State ----
  const [mode, setMode] = useState<Mode>(DEFAULTS.mode);

  const [annualIncome, setAnnualIncome] = useState(DEFAULTS.annualIncome);
  const [monthlyDebts, setMonthlyDebts] = useState(DEFAULTS.monthlyDebts);

  const [propertyTaxAnnual, setPropertyTaxAnnual] = useState(DEFAULTS.propertyTaxAnnual);
  const [heatMonthly, setHeatMonthly] = useState(DEFAULTS.heatMonthly);
  const [condoFeesMonthly, setCondoFeesMonthly] = useState(DEFAULTS.condoFeesMonthly);

  const [contractRatePct, setContractRatePct] = useState(DEFAULTS.contractRatePct);
  const [benchmarkRatePct, setBenchmarkRatePct] = useState(DEFAULTS.benchmarkRatePct);
  const [amortYears, setAmortYears] = useState(DEFAULTS.amortYears);

  const [gdsPct, setGdsPct] = useState(DEFAULTS.gdsPct);
  const [tdsPct, setTdsPct] = useState(DEFAULTS.tdsPct);

  const [purchasePrice, setPurchasePrice] = useState(DEFAULTS.purchasePrice);
  const [downPayment, setDownPayment] = useState(DEFAULTS.downPayment);

  // ---- localStorage load/save ----
  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (!raw) return;
      const data = JSON.parse(raw);
      if (data.mode) setMode(data.mode);
      if (data.annualIncome) setAnnualIncome(String(data.annualIncome));
      if (data.monthlyDebts) setMonthlyDebts(String(data.monthlyDebts));
      if (data.propertyTaxAnnual) setPropertyTaxAnnual(String(data.propertyTaxAnnual));
      if (data.heatMonthly) setHeatMonthly(String(data.heatMonthly));
      if (data.condoFeesMonthly) setCondoFeesMonthly(String(data.condoFeesMonthly));
      if (data.contractRatePct) setContractRatePct(String(data.contractRatePct));
      if (data.benchmarkRatePct) setBenchmarkRatePct(String(data.benchmarkRatePct));
      if (data.amortYears) setAmortYears(String(data.amortYears));
      if (data.gdsPct) setGdsPct(String(data.gdsPct));
      if (data.tdsPct) setTdsPct(String(data.tdsPct));
      if (data.purchasePrice) setPurchasePrice(String(data.purchasePrice));
      if (data.downPayment) setDownPayment(String(data.downPayment));
    } catch {}
  }, []);

  useEffect(() => {
    const data = {
      mode,
      annualIncome,
      monthlyDebts,
      propertyTaxAnnual,
      heatMonthly,
      condoFeesMonthly,
      contractRatePct,
      benchmarkRatePct,
      amortYears,
      gdsPct,
      tdsPct,
      purchasePrice,
      downPayment,
    };
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(data));
    } catch {}
  }, [
    mode,
    annualIncome,
    monthlyDebts,
    propertyTaxAnnual,
    heatMonthly,
    condoFeesMonthly,
    contractRatePct,
    benchmarkRatePct,
    amortYears,
    gdsPct,
    tdsPct,
    purchasePrice,
    downPayment,
  ]);

  // ---- Modelo ----
  const m = useMemo(() => {
    const incMonthly = NUM(annualIncome) / 12;
    const debtsM = NUM(monthlyDebts);

    const taxM = NUM(propertyTaxAnnual) / 12;
    const heatM = NUM(heatMonthly);
    const condoM = NUM(condoFeesMonthly);
    const condoCounted = condoM * 0.5; // la mayoría de prestamistas toman 50% de expensas

    const gds = clamp(NUM(gdsPct), 20, 50);
    const tds = clamp(NUM(tdsPct), 20, 60);
    const amort = clamp(NUM(amortYears), 5, 35);

    const contract = NUM(contractRatePct);
    const benchmark = NUM(benchmarkRatePct);
    const qualifyingRate = Math.max(contract + 2, benchmark);

    const gdsCap = incMonthly * (gds / 100);
    const tdsCap = incMonthly * (tds / 100);
    const countedHousing = taxM + heatM + condoCounted;

    const allowGDS = Math.max(0, gdsCap - countedHousing);
    const allowTDS = Math.max(0, tdsCap - (countedHousing + debtsM));
    const pmtAllow = Math.min(allowGDS, allowTDS);

    const maxMortgage = principalFromPayment(pmtAllow, qualifyingRate, amort);
    const perThousand = pmt(1000, qualifyingRate, amort);

    // Escenario
    const price = NUM(purchasePrice);
    const down = Math.min(NUM(downPayment), price);
    const scenarioLoan = Math.max(0, price - down);
    const scenarioPmt = pmt(scenarioLoan, qualifyingRate, amort);
    const gdsScenario = incMonthly > 0 ? ((scenarioPmt + countedHousing) / incMonthly) * 100 : 0;
    const tdsScenario = incMonthly > 0 ? ((scenarioPmt + countedHousing + debtsM) / incMonthly) * 100 : 0;
    const scenarioPass = gdsScenario <= gds + 1e-6 && tdsScenario <= tds + 1e-6;

    return {
      incMonthly,
      debtsM,
      taxM,
      heatM,
      condoM,
      condoCounted,
      gds,
      tds,
      amort,
      contract,
      benchmark,
      qualifyingRate,
      gdsCap,
      tdsCap,
      countedHousing,
      allowGDS,
      allowTDS,
      pmtAllow,
      maxMortgage,
      perThousand,
      price,
      down,
      scenarioLoan,
      scenarioPmt,
      gdsScenario,
      tdsScenario,
      scenarioPass,
    };
  }, [
    annualIncome,
    monthlyDebts,
    propertyTaxAnnual,
    heatMonthly,
    condoFeesMonthly,
    gdsPct,
    tdsPct,
    amortYears,
    contractRatePct,
    benchmarkRatePct,
    purchasePrice,
    downPayment,
  ]);

  // ---- UI actions ----
  const onPrint = () => window.print();
  const onReset = () => {
    setMode(DEFAULTS.mode);
    setAnnualIncome(DEFAULTS.annualIncome);
    setMonthlyDebts(DEFAULTS.monthlyDebts);
    setPropertyTaxAnnual(DEFAULTS.propertyTaxAnnual);
    setHeatMonthly(DEFAULTS.heatMonthly);
    setCondoFeesMonthly(DEFAULTS.condoFeesMonthly);
    setContractRatePct(DEFAULTS.contractRatePct);
    setBenchmarkRatePct(DEFAULTS.benchmarkRatePct);
    setAmortYears(DEFAULTS.amortYears);
    setGdsPct(DEFAULTS.gdsPct);
    setTdsPct(DEFAULTS.tdsPct);
    setPurchasePrice(DEFAULTS.purchasePrice);
    setDownPayment(DEFAULTS.downPayment);
  };

  // ---- UI ----
  return (
    <ToolShell
      title="Asequibilidad y Prueba de Esfuerzo"
      subtitle="Verifica tu GDS/TDS con la tasa de calificación y estima tu hipoteca máxima — o prueba un escenario específico."
      lang="es"
    >
      {/* Acciones */}
      <div className="flex flex-wrap gap-2 mb-4 print:hidden">
        <button
          onClick={onPrint}
          className="px-4 py-2 rounded-full border-2 border-brand-blue text-brand-blue hover:bg-brand-blue hover:text-white transition"
        >
          Imprimir / Guardar PDF
        </button>
        <button
          onClick={onReset}
          className="px-4 py-2 rounded-full border-2 border-brand-gold text-brand-green hover:bg-brand-gold hover:text-brand-green transition"
        >
          Restablecer valores
        </button>
      </div>

      {/* Toggle modo */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setMode("max")}
          className={`px-4 py-2 rounded-full border-2 ${
            mode === "max"
              ? "border-brand-blue bg-brand-blue text-white"
              : "border-brand-green text-brand-green hover:bg-brand-green hover:text-white"
          }`}
        >
          Hipoteca máxima
        </button>
        <button
          onClick={() => setMode("scenario")}
          className={`px-4 py-2 rounded-full border-2 ${
            mode === "scenario"
              ? "border-brand-blue bg-brand-blue text-white"
              : "border-brand-green text-brand-green hover:bg-brand-green hover:text-white"
          }`}
        >
          Probar escenario
        </button>
      </div>

      {/* Panel principal */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Entradas */}
        <section className="rounded-2xl border border-brand-gold/50 bg-white p-4 sm:p-6">
          <h2 className="font-serif text-xl text-brand-green font-bold mb-3">Entradas</h2>

          <div className="grid sm:grid-cols-2 gap-4">
            {/* Ingresos y deudas */}
            <div>
              <label className="block text-sm text-brand-blue/80 mb-1">Ingreso bruto familiar (anual)</label>
              <input
                inputMode="decimal"
                value={annualIncome}
                onChange={(e) => setAnnualIncome(e.target.value)}
                className="w-full rounded-lg border border-brand-gold/60 px-3 py-2"
                placeholder="p. ej., 140000"
              />
              <p className="mt-1 text-xs text-brand-blue/60">
                Usamos {CAD2.format(NUM(annualIncome) / 12)} / mes en los cálculos.
              </p>
            </div>
            <div>
              <label className="block text-sm text-brand-blue/80 mb-1">Otras deudas mensuales (mínimos)</label>
              <input
                inputMode="decimal"
                value={monthlyDebts}
                onChange={(e) => setMonthlyDebts(e.target.value)}
                className="w-full rounded-lg border border-brand-gold/60 px-3 py-2"
                placeholder="p. ej., 350"
              />
            </div>

            {/* Vivienda (gastos contados) */}
            <div>
              <label className="block text-sm text-brand-blue/80 mb-1">Impuestos a la propiedad (anual)</label>
              <input
                inputMode="decimal"
                value={propertyTaxAnnual}
                onChange={(e) => setPropertyTaxAnnual(e.target.value)}
                className="w-full rounded-lg border border-brand-gold/60 px-3 py-2"
                placeholder="p. ej., 4200"
              />
              <p className="mt-1 text-xs text-brand-blue/60">
                Contamos {CAD2.format(NUM(propertyTaxAnnual) / 12)} / mes.
              </p>
            </div>
            <div>
              <label className="block text-sm text-brand-blue/80 mb-1">Calefacción (mensual)</label>
              <input
                inputMode="decimal"
                value={heatMonthly}
                onChange={(e) => setHeatMonthly(e.target.value)}
                className="w-full rounded-lg border border-brand-gold/60 px-3 py-2"
                placeholder="p. ej., 120"
              />
            </div>
            <div>
              <label className="block text-sm text-brand-blue/80 mb-1">Cuotas de condominio (mensual)</label>
              <input
                inputMode="decimal"
                value={condoFeesMonthly}
                onChange={(e) => setCondoFeesMonthly(e.target.value)}
                className="w-full rounded-lg border border-brand-gold/60 px-3 py-2"
                placeholder="p. ej., 0"
              />
              <p className="mt-1 text-xs text-brand-blue/60">Se cuenta el 50%: {CAD2.format(NUM(condoFeesMonthly) * 0.5)} / mes.</p>
            </div>

            {/* Tasas / amortización */}
            <div>
              <label className="block text-sm text-brand-blue/80 mb-1">Tasa de contrato (%)</label>
              <input
                inputMode="decimal"
                value={contractRatePct}
                onChange={(e) => setContractRatePct(e.target.value)}
                className="w-full rounded-lg border border-brand-gold/60 px-3 py-2"
                placeholder="p. ej., 4.84"
              />
            </div>
            <div>
              <label className="block text-sm text-brand-blue/80 mb-1">Tasa de referencia / benchmark (%)</label>
              <input
                inputMode="decimal"
                value={benchmarkRatePct}
                onChange={(e) => setBenchmarkRatePct(e.target.value)}
                className="w-full rounded-lg border border-brand-gold/60 px-3 py-2"
                placeholder="p. ej., 5.25"
              />
            </div>
            <div>
              <label className="block text-sm text-brand-blue/80 mb-1">Amortización (años)</label>
              <input
                inputMode="numeric"
                value={amortYears}
                onChange={(e) => setAmortYears(e.target.value)}
                className="w-full rounded-lg border border-brand-gold/60 px-3 py-2"
                placeholder="25"
              />
            </div>

            {/* Límites GDS/TDS */}
            <div>
              <label className="block text-sm text-brand-blue/80 mb-1">Límite GDS (%)</label>
              <input
                inputMode="decimal"
                value={gdsPct}
                onChange={(e) => setGdsPct(e.target.value)}
                className="w-full rounded-lg border border-brand-gold/60 px-3 py-2"
                placeholder="39"
              />
            </div>
            <div>
              <label className="block text-sm text-brand-blue/80 mb-1">Límite TDS (%)</label>
              <input
                inputMode="decimal"
                value={tdsPct}
                onChange={(e) => setTdsPct(e.target.value)}
                className="w-full rounded-lg border border-brand-gold/60 px-3 py-2"
                placeholder="44"
              />
            </div>

            {/* Escenario (solo visible en modo scenario) */}
            {mode === "scenario" && (
              <>
                <div>
                  <label className="block text-sm text-brand-blue/80 mb-1">Precio de compra</label>
                  <input
                    inputMode="decimal"
                    value={purchasePrice}
                    onChange={(e) => setPurchasePrice(e.target.value)}
                    className="w-full rounded-lg border border-brand-gold/60 px-3 py-2"
                    placeholder="p. ej., 800000"
                  />
                </div>
                <div>
                  <label className="block text-sm text-brand-blue/80 mb-1">Pago inicial</label>
                  <input
                    inputMode="decimal"
                    value={downPayment}
                    onChange={(e) => setDownPayment(e.target.value)}
                    className="w-full rounded-lg border border-brand-gold/60 px-3 py-2"
                    placeholder="p. ej., 80000"
                  />
                </div>
              </>
            )}
          </div>
        </section>

        {/* Resultados */}
        <section className="rounded-2xl border border-brand-gold/50 bg-white p-4 sm:p-6">
          <h2 className="font-serif text-xl text-brand-green font-bold mb-3">Resultados</h2>

          <div className="space-y-3">
            <div className="rounded-xl border border-brand-gold/40 p-3">
              <div className="text-sm text-brand-blue/70">Tasa de calificación (prueba de esfuerzo)</div>
              <div className="text-2xl font-semibold text-brand-green">
                {m.qualifyingRate.toFixed(2)}%
                <span className="text-sm text-brand-blue/60 ml-2">
                  (máx de contrato+2% = {(NUM(contractRatePct) + 2).toFixed(2)}% y benchmark = {NUM(benchmarkRatePct).toFixed(2)}%)
                </span>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-3">
              <div className="rounded-xl border border-brand-gold/40 p-3">
                <div className="text-sm text-brand-blue/70">Ingreso mensual</div>
                <div className="text-xl font-semibold text-brand-green">{CAD2.format(m.incMonthly)}</div>
              </div>
              <div className="rounded-xl border border-brand-gold/40 p-3">
                <div className="text-sm text-brand-blue/70">Deudas mensuales</div>
                <div className="text-xl font-semibold text-brand-green">{CAD2.format(m.debtsM)}</div>
              </div>
            </div>

            <div className="grid sm:grid-cols-3 gap-3">
              <div className="rounded-xl border border-brand-gold/40 p-3">
                <div className="text-sm text-brand-blue/70">Gastos vivienda contados</div>
                <div className="text-xl font-semibold text-brand-green">{CAD2.format(m.countedHousing)}</div>
                <div className="text-xs text-brand-blue/60 mt-1">
                  Impuestos {CAD2.format(m.taxM)} + calefacción {CAD2.format(m.heatM)} + 50% expensas {CAD2.format(m.condoCounted)}
                </div>
              </div>
              <div className="rounded-xl border border-brand-gold/40 p-3">
                <div className="text-sm text-brand-blue/70">Tope GDS ({m.gds.toFixed(0)}%)</div>
                <div className="text-xl font-semibold text-brand-green">{CAD2.format(m.gdsCap)}</div>
              </div>
              <div className="rounded-xl border border-brand-gold/40 p-3">
                <div className="text-sm text-brand-blue/70">Tope TDS ({m.tds.toFixed(0)}%)</div>
                <div className="text-xl font-semibold text-brand-green">{CAD2.format(m.tdsCap)}</div>
              </div>
            </div>

            {/* Pago permitido */}
            <div className="rounded-xl border border-brand-gold/40 p-3">
              <div className="text-sm text-brand-blue/70">Pago de hipoteca permitido (según GDS/TDS)</div>
              <div className="text-2xl font-semibold text-brand-green">{CAD2.format(m.pmtAllow)}</div>
              <div className="text-xs text-brand-blue/60 mt-1">
                Menor entre GDS y TDS luego de gastos vivienda/deudas.
              </div>
            </div>

            {/* Hipoteca máxima o escenario */}
            {mode === "max" ? (
              <>
                <div className="rounded-xl border border-brand-gold/40 p-3">
                  <div className="text-sm text-brand-blue/70">Hipoteca máxima aproximada</div>
                  <div className="text-3xl font-semibold text-brand-green">{CAD0.format(m.maxMortgage)}</div>
                  <div className="text-xs text-brand-blue/60 mt-1">
                    A {m.qualifyingRate.toFixed(2)}% • amortización {NUM(amortYears)} años • ~{CAD2.format(m.perThousand)} por cada $1,000.
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="grid sm:grid-cols-2 gap-3">
                  <div className="rounded-xl border border-brand-gold/40 p-3">
                    <div className="text-sm text-brand-blue/70">Monto de hipoteca (precio - pago inicial)</div>
                    <div className="text-2xl font-semibold text-brand-green">{CAD2.format(m.scenarioLoan)}</div>
                  </div>
                  <div className="rounded-xl border border-brand-gold/40 p-3">
                    <div className="text-sm text-brand-blue/70">Pago mensual estimado</div>
                    <div className="text-2xl font-semibold text-brand-green">{CAD2.format(m.scenarioPmt)}</div>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-3">
                  <div className="rounded-xl border border-brand-gold/40 p-3">
                    <div className="text-sm text-brand-blue/70">GDS del escenario</div>
                    <div className={`text-2xl font-semibold ${m.gdsScenario <= m.gds ? "text-brand-green" : "text-red-600"}`}>
                      {m.gdsScenario.toFixed(1)}%
                    </div>
                  </div>
                  <div className="rounded-xl border border-brand-gold/40 p-3">
                    <div className="text-sm text-brand-blue/70">TDS del escenario</div>
                    <div className={`text-2xl font-semibold ${m.tdsScenario <= m.tds ? "text-brand-green" : "text-red-600"}`}>
                      {m.tdsScenario.toFixed(1)}%
                    </div>
                  </div>
                </div>

                <div
                  className={`rounded-xl border p-3 ${
                    m.scenarioPass
                      ? "border-green-300 bg-green-50 text-green-800"
                      : "border-red-300 bg-red-50 text-red-700"
                  }`}
                >
                  {m.scenarioPass ? "El escenario pasaría GDS/TDS." : "El escenario NO pasaría GDS/TDS con estos supuestos."}
                </div>
              </>
            )}
          </div>
        </section>
      </div>

      {/* Herramientas similares */}
      <div className="mt-6 rounded-2xl border border-brand-gold/50 bg-brand-beige/40 p-4">
        <h3 className="font-serif text-lg text-brand-green font-bold mb-2">Herramientas similares</h3>
        <ul className="list-disc ml-5 text-sm space-y-1">
          <li>
            <Link href="/es/herramientas/accesibilidad-hipotecaria" className="underline">
              Asequibilidad Hipotecaria (Rápida)
            </Link>
          </li>
          <li>
            <Link href="/es/herramientas/calculadora-hipotecaria" className="underline">
              Calculadora de Pagos Hipotecarios
            </Link>
          </li>
          <li>
            <Link href="/es/herramientas/pago-inicial-seguro" className="underline">
              Pago Inicial y Seguro CMHC
            </Link>
          </li>
          <li>
            <Link href="/es/herramientas/costos-cierre" className="underline">
              Estimador de Costos de Cierre
            </Link>
          </li>
        </ul>
      </div>

      {/* Notas y disclaimer */}
      <div className="mt-6 grid lg:grid-cols-2 gap-4">
        <div className="rounded-xl border border-brand-gold/40 p-4">
          <h4 className="font-semibold text-brand-green">Notas rápidas</h4>
          <ul className="list-disc ml-5 text-sm text-brand-blue/80 space-y-1 mt-2">
            <li>Muchos prestamistas toman el 50% de las expensas de condominio para GDS/TDS.</li>
            <li>La tasa de calificación puede diferir según producto (variable/fijo) y aseguradora.</li>
            <li>Para multiplex (4–10) o ingresos de renta, usa también DSCR y Multipropiedad.</li>
          </ul>
        </div>
        <div className="rounded-xl border border-brand-gold/40 p-4">
          <h4 className="font-semibold text-brand-green">Aviso</h4>
          <p className="text-sm text-brand-blue/80 mt-2">
            Herramienta educativa. No constituye asesoría de inversión, legal, hipotecaria o fiscal. Las políticas de
            prestamistas/aseguradoras pueden cambiar. Verifica detalles con tu profesional de confianza.
          </p>
        </div>
      </div>

      <div className="mt-6 text-center">
        <Link
          href="/es/contacto?intent=consult"
          className="inline-block px-8 py-3 border-2 border-brand-gold text-brand-green font-serif font-bold rounded-full hover:bg-brand-gold hover:text-brand-green transition"
        >
          Agendar llamada de descubrimiento
        </Link>
      </div>

      {/* Estilos de impresión básicos */}
      <style jsx global>{`
        @media print {
          .print\\:hidden { display: none !important; }
          main { background: white !important; }
          section, .rounded-2xl { break-inside: avoid; page-break-inside: avoid; }
        }
      `}</style>
    </ToolShell>
  );
}
