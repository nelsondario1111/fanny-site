"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import ToolShell from "@/components/ToolShell";

/**
 * Tabla de Amortización y Prepagos (ES-CA)
 * --------------------------------------------------------------
 * - Frecuencias: Mensual / Quincenal / Quincenal acelerado
 * - Extra por periodo
 * - Aporte anual (una vez por año en el mismo periodo)
 * - Aporte único en un periodo específico
 * - Exportación CSV del cronograma completo
 * - Imprimir / Restablecer / persistencia en localStorage
 * - Solo educativo (el cálculo del prestamista puede variar)
 */

// ---------- Utilidades ----------
const CAD0 = new Intl.NumberFormat("es-CA", { style: "currency", currency: "CAD", maximumFractionDigits: 0 });
const CAD2 = new Intl.NumberFormat("es-CA", { style: "currency", currency: "CAD", minimumFractionDigits: 2 });

const num = (s: string) => {
  const x = Number(String(s).replace(/[^\d.-]/g, ""));
  return Number.isFinite(x) ? x : 0;
};
const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

function toCSV(rows: Array<Array<string | number>>) {
  const esc = (v: string | number) => {
    const s = String(v ?? "");
    const needsQuotes = /[",\n]/.test(s);
    const q = s.replace(/"/g, '""');
    return needsQuotes ? `"${q}"` : q;
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

type FreqKey = "monthly" | "biweekly" | "accelerated_biweekly";
const FREQ_META: Record<FreqKey, { labelPlural: string; periodsPerYear: number }> = {
  monthly: { labelPlural: "mensuales", periodsPerYear: 12 },
  biweekly: { labelPlural: "quincenales", periodsPerYear: 26 },
  accelerated_biweekly: { labelPlural: "quincenales acelerados", periodsPerYear: 26 },
};

function pmt(principal: number, annualRatePct: number, years: number, periodsPerYear: number) {
  if (principal <= 0 || years <= 0 || periodsPerYear <= 0) return 0;
  const r = (annualRatePct / 100) / periodsPerYear;
  const nper = years * periodsPerYear;
  if (r === 0) return principal / nper;
  const pow = Math.pow(1 + r, nper);
  return (principal * r * pow) / (pow - 1);
}

type Row = {
  period: number;
  payment: number;      // pago programado usado (puede ser menor en el último)
  interest: number;
  principal: number;
  extraApplied: number; // incluye extra por periodo + aportes (anual/único) aplicados ahí
  balance: number;
};

function buildSchedule(opts: {
  principal: number;
  annualRatePct: number;
  amortYears: number;
  periodsPerYear: number;
  paymentOverride?: number;  // para quincenal acelerado
  extraPerPeriod?: number;
  annualLump?: number;       // una vez al año en índice de periodo fijo
  annualLumpAtIndex?: number; // 1..periodsPerYear (por defecto el último)
  oneTimeLump?: number;      // una vez en un periodo absoluto específico
  oneTimeLumpAt?: number;    // periodo absoluto (1-based)
}): {
  rows: Row[];
  totalInterest: number;
  totalPrincipal: number;
  totalExtra: number;
  paymentUsed: number;
  payoffPeriods: number;
} {
  const {
    principal, annualRatePct, amortYears, periodsPerYear,
    paymentOverride, extraPerPeriod = 0,
    annualLump = 0, annualLumpAtIndex,
    oneTimeLump = 0, oneTimeLumpAt,
  } = opts;

  if (principal <= 0 || amortYears <= 0 || periodsPerYear <= 0) {
    return { rows: [], totalInterest: 0, totalPrincipal: 0, totalExtra: 0, paymentUsed: 0, payoffPeriods: 0 };
  }

  const r = (annualRatePct / 100) / periodsPerYear;
  const nper = amortYears * periodsPerYear;
  const basePayment = pmt(principal, annualRatePct, amortYears, periodsPerYear);
  const pay = paymentOverride && paymentOverride > 0 ? paymentOverride : basePayment;

  const annualIndex = clamp(annualLumpAtIndex ?? periodsPerYear, 1, periodsPerYear);
  const rows: Row[] = [];

  let bal = principal;
  let ti = 0, tp = 0, te = 0;
  let period = 0;

  while (bal > 0.01 && period < nper) {
    period += 1;

    const interest = bal * r;
    const scheduledPayment = Math.min(pay, bal + interest); // último pago puede ser menor
    const principalPart = scheduledPayment - interest;

    // Extras
    let extra = 0;

    // Extra por periodo
    if (extraPerPeriod > 0) {
      extra += Math.min(extraPerPeriod, Math.max(0, bal - principalPart));
    }

    // Aporte anual
    if (annualLump > 0 && ((period - annualIndex) % periodsPerYear === 0) && period >= annualIndex) {
      const remainingAfterPrincipal = Math.max(0, bal - principalPart - extra);
      extra += Math.min(annualLump, remainingAfterPrincipal);
    }

    // Aporte único
    if (oneTimeLump > 0 && oneTimeLumpAt && period === oneTimeLumpAt) {
      const remainingAfterPrincipal = Math.max(0, bal - principalPart - extra);
      extra += Math.min(oneTimeLump, remainingAfterPrincipal);
    }

    const appliedPrincipal = principalPart + extra;
    bal = Math.max(0, bal - appliedPrincipal);

    ti += interest;
    tp += principalPart;
    te += extra;

    rows.push({
      period,
      payment: scheduledPayment,
      interest,
      principal: principalPart,
      extraApplied: extra,
      balance: bal,
    });
  }

  return {
    rows,
    totalInterest: ti,
    totalPrincipal: tp,
    totalExtra: te,
    paymentUsed: pay,
    payoffPeriods: rows.length,
  };
}

// ---------- Defaults & storage ----------
const LS_KEY = "herramientas.tabla_amortizacion.v1";
const DEFAULTS = {
  principal: "600000",
  rate: "5.25",
  amortYears: "25",
  freq: "monthly" as FreqKey,
  extraPerPeriod: "0",
  annualLump: "0",
  annualLumpAtIndex: "", // vacío = último periodo del año
  oneTimeLump: "0",
  oneTimeLumpAt: "",
};

export default function Page() {
  // Entradas
  const [principalStr, setPrincipalStr] = useState(DEFAULTS.principal);
  const [rateStr, setRateStr] = useState(DEFAULTS.rate);
  const [amortYearsStr, setAmortYearsStr] = useState(DEFAULTS.amortYears);
  const [freq, setFreq] = useState<FreqKey>(DEFAULTS.freq);

  const [extraPerPeriodStr, setExtraPerPeriodStr] = useState(DEFAULTS.extraPerPeriod);
  const [annualLumpStr, setAnnualLumpStr] = useState(DEFAULTS.annualLump);
  const [annualLumpAtIndexStr, setAnnualLumpAtIndexStr] = useState(DEFAULTS.annualLumpAtIndex);
  const [oneTimeLumpStr, setOneTimeLumpStr] = useState(DEFAULTS.oneTimeLump);
  const [oneTimeLumpAtStr, setOneTimeLumpAtStr] = useState(DEFAULTS.oneTimeLumpAt);

  // Restaurar
  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) {
        const v = JSON.parse(raw);
        if (v && typeof v === "object") {
          setPrincipalStr(v.principal ?? DEFAULTS.principal);
          setRateStr(v.rate ?? DEFAULTS.rate);
          setAmortYearsStr(v.amortYears ?? DEFAULTS.amortYears);
          setFreq(v.freq ?? DEFAULTS.freq);
          setExtraPerPeriodStr(v.extraPerPeriod ?? DEFAULTS.extraPerPeriod);
          setAnnualLumpStr(v.annualLump ?? DEFAULTS.annualLump);
          setAnnualLumpAtIndexStr(v.annualLumpAtIndex ?? DEFAULTS.annualLumpAtIndex);
          setOneTimeLumpStr(v.oneTimeLump ?? DEFAULTS.oneTimeLump);
          setOneTimeLumpAtStr(v.oneTimeLumpAt ?? DEFAULTS.oneTimeLumpAt);
        }
      }
    } catch {}
  }, []);

  // Persistir
  useEffect(() => {
    try {
      localStorage.setItem(
        LS_KEY,
        JSON.stringify({
          principal: principalStr,
          rate: rateStr,
          amortYears: amortYearsStr,
          freq,
          extraPerPeriod: extraPerPeriodStr,
          annualLump: annualLumpStr,
          annualLumpAtIndex: annualLumpAtIndexStr,
          oneTimeLump: oneTimeLumpStr,
          oneTimeLumpAt: oneTimeLumpAtStr,
        })
      );
    } catch {}
  }, [
    principalStr, rateStr, amortYearsStr, freq,
    extraPerPeriodStr, annualLumpStr, annualLumpAtIndexStr, oneTimeLumpStr, oneTimeLumpAtStr
  ]);

  // ---------- Modelo ----------
  const m = useMemo(() => {
    const pr = Math.max(0, num(principalStr));
    const rate = Math.max(0, num(rateStr));
    const amortYears = Math.max(1, num(amortYearsStr));

    const meta = FREQ_META[freq];
    const periodsPerYear = meta.periodsPerYear;

    // Pago base por frecuencia
    const standardPayment = pmt(pr, rate, amortYears, periodsPerYear);
    const monthlyStandard = pmt(pr, rate, amortYears, 12);
    const acceleratedPayment = monthlyStandard / 2;

    const paymentUsed = freq === "accelerated_biweekly" ? acceleratedPayment : standardPayment;

    // Extras
    const extraPerPeriod = Math.max(0, num(extraPerPeriodStr));
    const annualLump = Math.max(0, num(annualLumpStr));
    const annualLumpAtIndex = annualLumpAtIndexStr
      ? Math.round(clamp(num(annualLumpAtIndexStr), 1, periodsPerYear))
      : periodsPerYear;

    const oneTimeLump = Math.max(0, num(oneTimeLumpStr));
    const oneTimeLumpAt = oneTimeLumpAtStr ? Math.round(Math.max(1, num(oneTimeLumpAtStr))) : undefined;

    // Construir cronograma
    const schedule = buildSchedule({
      principal: pr,
      annualRatePct: rate,
      amortYears,
      periodsPerYear,
      paymentOverride: freq === "accelerated_biweekly" ? acceleratedPayment : undefined,
      extraPerPeriod,
      annualLump,
      annualLumpAtIndex,
      oneTimeLump,
      oneTimeLumpAt,
    });

    const totalPaid = schedule.totalInterest + schedule.totalPrincipal + schedule.totalExtra;

    return {
      pr, rate, amortYears, freq, periodsPerYear,
      paymentPerPeriod: paymentUsed,
      schedule,
      totalPaid,
      standardPayment,
      acceleratedPayment,
      extraPerPeriod, annualLump, annualLumpAtIndex, oneTimeLump, oneTimeLumpAt,
    };
  }, [
    principalStr, rateStr, amortYearsStr, freq,
    extraPerPeriodStr, annualLumpStr, annualLumpAtIndexStr, oneTimeLumpStr, oneTimeLumpAtStr
  ]);

  // ---------- Acciones ----------
  const onPrint = () => window.print();
  const onReset = () => {
    setPrincipalStr(DEFAULTS.principal);
    setRateStr(DEFAULTS.rate);
    setAmortYearsStr(DEFAULTS.amortYears);
    setFreq(DEFAULTS.freq);
    setExtraPerPeriodStr(DEFAULTS.extraPerPeriod);
    setAnnualLumpStr(DEFAULTS.annualLump);
    setAnnualLumpAtIndexStr(DEFAULTS.annualLumpAtIndex);
    setOneTimeLumpStr(DEFAULTS.oneTimeLump);
    setOneTimeLumpAtStr(DEFAULTS.oneTimeLumpAt);
  };

  const exportCSV = () => {
    const rows: Array<Array<string | number>> = [
      ["Periodo", "Pago", "Interes", "Principal", "ExtraAplicado", "Saldo"],
      ...m.schedule.rows.map((r) => [
        r.period,
        r.payment.toFixed(2),
        r.interest.toFixed(2),
        r.principal.toFixed(2),
        r.extraApplied.toFixed(2),
        r.balance.toFixed(2),
      ]),
    ];
    downloadCSV(`amortizacion_${m.freq}_${m.pr}_${m.rate}_${m.amortYears}`.replace(/\s+/g, ""), rows);
  };

  // ---------- UI ----------
  const previewRows = m.schedule.rows.slice(0, 120); // primeras 120 filas por rendimiento

  return (
    <ToolShell
      title="Tabla de Amortización y Prepagos"
      subtitle="Ve el detalle por periodo y cómo los prepagos cambian el tiempo de pago y el interés total."
      lang="es"
    >
      {/* Acciones */}
      <div className="tool-actions">
        <button
          type="button"
          onClick={onPrint}
          className="tool-btn-blue"
        >
          Imprimir o guardar PDF
        </button>
        <button
          type="button"
          onClick={exportCSV}
          className="tool-btn-green"
        >
          Exportar (CSV)
        </button>
        <button
          type="button"
          onClick={onReset}
          className="tool-btn-gold"
        >
          Restablecer valores
        </button>
      </div>

      <form className="grid xl:grid-cols-2 gap-6">
        {/* Entradas */}
        <section className="tool-card grid gap-3">
          <h3 className="font-sans text-lg text-brand-green font-semibold">Entradas</h3>

          <div className="grid sm:grid-cols-2 gap-3">
            <label className="block">
              <span className="block text-sm text-brand-blue/80">Monto de hipoteca (principal)</span>
              <input
                value={principalStr}
                onChange={(e) => setPrincipalStr(e.target.value)}
                inputMode="decimal"
                className="mt-1 tool-field"
              />
            </label>
            <label className="block">
              <span className="block text-sm text-brand-blue/80">Tasa de interés (anual %)</span>
              <input
                value={rateStr}
                onChange={(e) => setRateStr(e.target.value)}
                inputMode="decimal"
                className="mt-1 tool-field"
              />
            </label>
          </div>

          <div className="grid sm:grid-cols-3 gap-3">
            <label className="block">
              <span className="block text-sm text-brand-blue/80">Amortización (años)</span>
              <input
                value={amortYearsStr}
                onChange={(e) => setAmortYearsStr(e.target.value)}
                inputMode="numeric"
                className="mt-1 tool-field"
              />
            </label>
            <label className="block">
              <span className="block text-sm text-brand-blue/80">Frecuencia de pago</span>
              <select
                value={freq}
                onChange={(e) => setFreq(e.target.value as FreqKey)}
                className="mt-1 tool-field bg-white"
              >
                <option value="monthly">Mensual</option>
                <option value="biweekly">Quincenal</option>
                <option value="accelerated_biweekly">Quincenal acelerado</option>
              </select>
            </label>
            <div className="text-sm text-brand-blue/70 flex items-end">
              <div className="w-full">
                <div className="mb-1">Pago por periodo</div>
                <div className="text-lg font-semibold">
                  {m.paymentPerPeriod ? CAD2.format(m.paymentPerPeriod) : "—"}
                </div>
              </div>
            </div>
          </div>

          {/* Prepagos */}
          <div className="rounded-xl border border-brand-gold/40 bg-brand-beige/30 p-3 grid gap-3">
            <h4 className="font-semibold text-brand-green">Prepagos</h4>
            <div className="grid sm:grid-cols-3 gap-3">
              <label className="block">
                <span className="block text-sm text-brand-blue/80">Extra por periodo</span>
                <input
                  value={extraPerPeriodStr}
                  onChange={(e) => setExtraPerPeriodStr(e.target.value)}
                  inputMode="decimal"
                  className="mt-1 tool-field"
                />
              </label>
              <label className="block">
                <span className="block text-sm text-brand-blue/80">Aporte anual</span>
                <input
                  value={annualLumpStr}
                  onChange={(e) => setAnnualLumpStr(e.target.value)}
                  inputMode="decimal"
                  className="mt-1 tool-field"
                />
              </label>
              <label className="block">
                <span className="block text-sm text-brand-blue/80">Año: aplicar en periodo #</span>
                <input
                  value={annualLumpAtIndexStr}
                  onChange={(e) => setAnnualLumpAtIndexStr(e.target.value)}
                  inputMode="numeric"
                  placeholder={`1–${m.periodsPerYear} (predeterminado ${m.periodsPerYear})`}
                  className="mt-1 tool-field"
                />
              </label>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              <label className="block">
                <span className="block text-sm text-brand-blue/80">Aporte único</span>
                <input
                  value={oneTimeLumpStr}
                  onChange={(e) => setOneTimeLumpStr(e.target.value)}
                  inputMode="decimal"
                  className="mt-1 tool-field"
                />
              </label>
              <label className="block">
                <span className="block text-sm text-brand-blue/80">Periodo absoluto #</span>
                <input
                  value={oneTimeLumpAtStr}
                  onChange={(e) => setOneTimeLumpAtStr(e.target.value)}
                  inputMode="numeric"
                  placeholder="p. ej., 24"
                  className="mt-1 tool-field"
                />
              </label>
            </div>
            <p className="text-xs text-brand-blue/70">
              Sugerencia: en modo mensual, “Año: aplicar en periodo #” = 12 significa cada año en el 12.º pago. En quincenal, 26 = último periodo del año.
            </p>
          </div>
        </section>

        {/* Resultados */}
        <section className="tool-card">
          <h3 className="font-sans text-lg text-brand-green font-semibold">Resultados</h3>

          <div className="grid sm:grid-cols-3 gap-4 mt-2">
            <div>
              <div className="text-sm text-brand-blue/80">Pago por periodo</div>
              <div className="text-2xl font-bold text-brand-green">
                {m.paymentPerPeriod ? CAD2.format(m.paymentPerPeriod) : "—"}
              </div>
            </div>
            <div>
              <div className="text-sm text-brand-blue/80">Interés total (hasta cancelar)</div>
              <div className="text-2xl font-bold text-brand-green">
                {CAD0.format(Math.round(m.schedule.totalInterest))}
              </div>
            </div>
            <div>
              <div className="text-sm text-brand-blue/80">Periodos hasta cancelar</div>
              <div className="text-2xl font-bold text-brand-green">
                {m.schedule.payoffPeriods || "—"}
              </div>
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-4 mt-3">
            <div>
              <div className="text-sm text-brand-blue/80">Principal pagado</div>
              <div className="text-xl font-semibold">{CAD0.format(Math.round(m.schedule.totalPrincipal))}</div>
            </div>
            <div>
              <div className="text-sm text-brand-blue/80">Extra aplicado</div>
              <div className="text-xl font-semibold">{CAD0.format(Math.round(m.schedule.totalExtra))}</div>
            </div>
            <div>
              <div className="text-sm text-brand-blue/80">Total pagado</div>
              <div className="text-xl font-semibold">{CAD0.format(Math.round(m.totalPaid))}</div>
            </div>
          </div>

          {/* Vista previa */}
          <div className="mt-6">
            <h4 className="font-semibold text-brand-green mb-2">
              Vista previa (primeros {previewRows.length} periodos {FREQ_META[m.freq].labelPlural})
            </h4>
            <div className="overflow-auto rounded-xl border border-brand-gold/40">
              <table className="w-full text-sm">
                <thead className="bg-brand-beige/40 text-brand-blue">
                  <tr>
                    <th className="text-left px-3 py-2">#</th>
                    <th className="text-right px-3 py-2">Pago</th>
                    <th className="text-right px-3 py-2">Interés</th>
                    <th className="text-right px-3 py-2">Principal</th>
                    <th className="text-right px-3 py-2">Extra</th>
                    <th className="text-right px-3 py-2">Saldo</th>
                  </tr>
                </thead>
                <tbody>
                  {previewRows.map((r, i) => (
                    <tr key={i} className="border-top">
                      <td className="px-3 py-2">{r.period}</td>
                      <td className="px-3 py-2 text-right">{CAD2.format(r.payment)}</td>
                      <td className="px-3 py-2 text-right">{CAD2.format(r.interest)}</td>
                      <td className="px-3 py-2 text-right">{CAD2.format(r.principal)}</td>
                      <td className="px-3 py-2 text-right">{CAD2.format(r.extraApplied)}</td>
                      <td className="px-3 py-2 text-right">{CAD2.format(r.balance)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="mt-3 text-sm">
              Para el cronograma completo, usa el botón{" "}
              <button type="button" onClick={exportCSV} className="underline">
                Exportar (CSV)
              </button>.
            </p>
          </div>

          {/* Herramientas similares */}
          <div className="mt-6 rounded-xl border border-brand-gold/40 bg-brand-beige/40 p-4">
            <h4 className="font-semibold text-brand-green mb-2">Herramientas similares</h4>
            <ul className="list-disc ml-5 text-sm space-y-1">
              <li><Link href="/es/herramientas/calculadora-hipotecaria" className="underline">Calculadora de Pagos Hipotecarios</Link></li>
              <li><Link href="/es/herramientas/prueba-esfuerzo" className="underline">Asequibilidad y Prueba de Esfuerzo</Link></li>
              <li><Link href="/es/herramientas/pago-inicial-seguro" className="underline">Pago Inicial y Seguro CMHC</Link></li>
              <li><Link href="/es/herramientas/costos-cierre" className="underline">Estimador de Costos de Cierre</Link></li>
            </ul>
          </div>
        </section>
      </form>

      {/* Estilos de impresión */}
      <style jsx global>{`
        @media print {
          .print\\:hidden { display: none !important; }
          main { background: white !important; }
          header, section { break-inside: avoid; page-break-inside: avoid; }
        }
      `}</style>

      {/* Aviso */}
      <p className="mt-6 text-xs text-brand-blue/70">
        Estimación educativa. El cálculo real del prestamista (p. ej., capitalización semestral, redondeo de pagos, reglas de prepago) puede diferir.
      </p>
    </ToolShell>
  );
}
