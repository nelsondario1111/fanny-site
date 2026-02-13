"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import ToolShell from "@/components/ToolShell";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

/**
 * Calculadora de Pagos Hipotecarios (Avanzada)
 * --------------------------------------------------------------
 * - Frecuencia de pago: Mensual / Quincenal / Quincenal acelerado
 * - Totales por plazo vs. amortización completa
 * - Extra opcional por periodo
 * - Gráfico + vista previa del cronograma
 * - Persistencia en localStorage
 * - Herramienta educativa
 */

const CAD0 = new Intl.NumberFormat("es-CA", {
  style: "currency",
  currency: "CAD",
  maximumFractionDigits: 0,
});
const CAD2 = new Intl.NumberFormat("es-CA", {
  style: "currency",
  currency: "CAD",
  minimumFractionDigits: 2,
});

const num = (s: string) => {
  const x = Number(String(s).replace(/[^\d.-]/g, ""));
  return Number.isFinite(x) ? x : 0;
};

type FreqKey = "monthly" | "biweekly" | "accelerated_biweekly";
const FREQ_META: Record<FreqKey, { label: string; periodsPerYear: number }> = {
  monthly: { label: "Mensual", periodsPerYear: 12 },
  biweekly: { label: "Quincenal", periodsPerYear: 26 },
  accelerated_biweekly: { label: "Quincenal acelerado", periodsPerYear: 26 },
};

function pmt(principal: number, annualRatePct: number, years: number, periodsPerYear: number) {
  if (principal <= 0 || years <= 0 || periodsPerYear <= 0) return 0;
  const r = (annualRatePct / 100) / periodsPerYear;
  const nper = years * periodsPerYear;
  if (r === 0) return principal / nper;
  const pow = Math.pow(1 + r, nper);
  return (principal * r * pow) / (pow - 1);
}

type Row = { period: number; interest: number; principal: number; balance: number };

function buildSchedule(opts: {
  principal: number;
  annualRatePct: number;
  amortYears: number;
  periodsPerYear: number;
  paymentOverride?: number;
  extraPerPeriod?: number;
  maxPeriods?: number;
}): { rows: Row[]; totalInterest: number; totalPrincipal: number; paymentUsed: number } {
  const {
    principal,
    annualRatePct,
    amortYears,
    periodsPerYear,
    paymentOverride,
    extraPerPeriod = 0,
    maxPeriods,
  } = opts;

  if (principal <= 0 || amortYears <= 0 || periodsPerYear <= 0) {
    return { rows: [], totalInterest: 0, totalPrincipal: 0, paymentUsed: 0 };
  }

  const r = (annualRatePct / 100) / periodsPerYear;
  const nper = amortYears * periodsPerYear;
  const base = pmt(principal, annualRatePct, amortYears, periodsPerYear);
  const pay = paymentOverride && paymentOverride > 0 ? paymentOverride : base;

  const rows: Row[] = [];
  let bal = principal;
  let ti = 0;
  let tp = 0;
  const stopAt = maxPeriods && maxPeriods > 0 ? Math.min(maxPeriods, nper) : nper;

  for (let k = 1; k <= stopAt && bal > 0.01; k++) {
    const interest = bal * r;
    let principalPart = pay - interest + (extraPerPeriod || 0);
    if (principalPart > bal) principalPart = bal;
    bal = bal - principalPart;

    ti += interest;
    tp += principalPart;
    rows.push({ period: k, interest, principal: principalPart, balance: Math.max(0, bal) });

    if (bal <= 0.01) break;
  }

  return { rows, totalInterest: ti, totalPrincipal: tp, paymentUsed: pay };
}

const LS_KEY = "herramientas.calculadora_hipoteca.avanzada.v1";
const DEFAULTS = {
  principal: "600000",
  rate: "5.25",
  amortYears: "25",
  termYears: "5",
  freq: "monthly" as FreqKey,
  extraPerPeriod: "0",
};

export default function Page() {
  const [principalStr, setPrincipalStr] = useState(DEFAULTS.principal);
  const [rateStr, setRateStr] = useState(DEFAULTS.rate);
  const [amortYearsStr, setAmortYearsStr] = useState(DEFAULTS.amortYears);
  const [termYearsStr, setTermYearsStr] = useState(DEFAULTS.termYears);
  const [freq, setFreq] = useState<FreqKey>(DEFAULTS.freq);
  const [extraPerPeriodStr, setExtraPerPeriodStr] = useState(DEFAULTS.extraPerPeriod);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) {
        const v = JSON.parse(raw);
        if (v && typeof v === "object") {
          setPrincipalStr(v.principal ?? DEFAULTS.principal);
          setRateStr(v.rate ?? DEFAULTS.rate);
          setAmortYearsStr(v.amortYears ?? DEFAULTS.amortYears);
          setTermYearsStr(v.termYears ?? DEFAULTS.termYears);
          setFreq(v.freq ?? DEFAULTS.freq);
          setExtraPerPeriodStr(v.extraPerPeriod ?? DEFAULTS.extraPerPeriod);
        }
      }
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(
        LS_KEY,
        JSON.stringify({
          principal: principalStr,
          rate: rateStr,
          amortYears: amortYearsStr,
          termYears: termYearsStr,
          freq,
          extraPerPeriod: extraPerPeriodStr,
        })
      );
    } catch {}
  }, [principalStr, rateStr, amortYearsStr, termYearsStr, freq, extraPerPeriodStr]);

  const m = useMemo(() => {
    const pr = Math.max(0, num(principalStr));
    const rate = Math.max(0, num(rateStr));
    const amortYears = Math.max(1, num(amortYearsStr));
    const termYears = Math.max(1, num(termYearsStr));
    const extra = Math.max(0, num(extraPerPeriodStr));

    const meta = FREQ_META[freq];
    const periodsPerYear = meta.periodsPerYear;

    const standardPayment = pmt(pr, rate, amortYears, periodsPerYear);
    const monthlyStandard = pmt(pr, rate, amortYears, 12);
    const acceleratedPayment = monthlyStandard / 2;

    const paymentUsed = freq === "accelerated_biweekly" ? acceleratedPayment : standardPayment;

    const termPeriods = termYears * periodsPerYear;
    const termSchedule = buildSchedule({
      principal: pr,
      annualRatePct: rate,
      amortYears,
      periodsPerYear,
      paymentOverride: freq === "accelerated_biweekly" ? acceleratedPayment : undefined,
      extraPerPeriod: extra,
      maxPeriods: termPeriods,
    });

    const balAfterTerm = termSchedule.rows.length
      ? termSchedule.rows[termSchedule.rows.length - 1].balance
      : pr;

    const fullSchedule = buildSchedule({
      principal: pr,
      annualRatePct: rate,
      amortYears,
      periodsPerYear,
      paymentOverride: freq === "accelerated_biweekly" ? acceleratedPayment : undefined,
      extraPerPeriod: extra,
    });

    const totalPaidTerm = termSchedule.totalInterest + termSchedule.totalPrincipal;
    const totalPaidFull = fullSchedule.totalInterest + fullSchedule.totalPrincipal;
    const periodsToPayoff = fullSchedule.rows.length;

    const chartData = [
      { name: "Interés (plazo)", value: Math.max(0, termSchedule.totalInterest) },
      { name: "Capital (plazo)", value: Math.max(0, termSchedule.totalPrincipal) },
    ];

    return {
      pr,
      rate,
      amortYears,
      termYears,
      extra,
      freq,
      periodsPerYear,
      paymentUsed,
      termSchedule,
      fullSchedule,
      balAfterTerm,
      totalPaidTerm,
      totalPaidFull,
      periodsToPayoff,
      chartData,
    };
  }, [principalStr, rateStr, amortYearsStr, termYearsStr, freq, extraPerPeriodStr]);

  const onPrint = () => window.print();
  const onReset = () => {
    setPrincipalStr(DEFAULTS.principal);
    setRateStr(DEFAULTS.rate);
    setAmortYearsStr(DEFAULTS.amortYears);
    setTermYearsStr(DEFAULTS.termYears);
    setFreq(DEFAULTS.freq);
    setExtraPerPeriodStr(DEFAULTS.extraPerPeriod);
  };

  const palette = ["#0f766e", "#9a6b2f"];
  const pieHasValues = m.chartData.some((d) => d.value > 0);

  return (
    <ToolShell
      title="Calculadora de Pagos Hipotecarios"
      subtitle="Estima pagos por frecuencia, revisa interés/capital durante tu plazo y previsualiza la amortización."
      lang="es"
    >
      <div className="tool-actions">
        <button type="button" onClick={onPrint} className="tool-btn-blue">
          Imprimir o guardar PDF
        </button>
        <button type="button" onClick={onReset} className="tool-btn-gold">
          Restablecer valores
        </button>
      </div>

      <form className="grid xl:grid-cols-2 gap-6">
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
              <span className="block text-sm text-brand-blue/80">Plazo (años)</span>
              <input
                value={termYearsStr}
                onChange={(e) => setTermYearsStr(e.target.value)}
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
          </div>

          <label className="block">
            <span className="block text-sm text-brand-blue/80">Extra por periodo (opcional)</span>
            <input
              value={extraPerPeriodStr}
              onChange={(e) => setExtraPerPeriodStr(e.target.value)}
              inputMode="decimal"
              className="mt-1 tool-field"
            />
          </label>

          <p className="text-xs text-brand-blue/70">
            Nota: &quot;Quincenal acelerado&quot; usa la mitad del pago mensual estándar, pagado 26 veces por año.
            Esto acelera la reducción de capital y disminuye el interés total.
          </p>
        </section>

        <section className="tool-card">
          <h3 className="font-sans text-lg text-brand-green font-semibold">Resultados</h3>

          <div className="grid sm:grid-cols-2 gap-4 mt-2">
            <div>
              <div className="text-sm text-brand-blue/80">Pago por periodo</div>
              <div className="text-2xl font-bold text-brand-green">
                {m.paymentUsed ? CAD2.format(m.paymentUsed) : "—"}
              </div>
              <div className="text-xs text-brand-blue/70">
                {FREQ_META[m.freq].label} ({m.periodsPerYear}x/año){m.extra > 0 ? " + extra" : ""}
              </div>
            </div>
            <div>
              <div className="text-sm text-brand-blue/80">Periodos para pagar (estimado)</div>
              <div className="text-2xl font-bold text-brand-green">{m.periodsToPayoff || "—"}</div>
              <div className="text-xs text-brand-blue/70">Incluye extras si aplican</div>
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-4 mt-4">
            <div>
              <div className="text-sm text-brand-blue/80">Interés durante el plazo</div>
              <div className="text-xl font-semibold">{CAD0.format(Math.round(m.termSchedule.totalInterest))}</div>
            </div>
            <div>
              <div className="text-sm text-brand-blue/80">Capital durante el plazo</div>
              <div className="text-xl font-semibold">{CAD0.format(Math.round(m.termSchedule.totalPrincipal))}</div>
            </div>
            <div>
              <div className="text-sm text-brand-blue/80">Saldo al final del plazo</div>
              <div className="text-xl font-semibold">{CAD0.format(Math.round(m.balAfterTerm))}</div>
            </div>
          </div>

          <div className="mt-6 h-64 rounded-xl border border-brand-gold/40 bg-brand-beige/40 p-2">
            {pieHasValues ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Tooltip formatter={(val: number | string) => CAD0.format(Math.round(Number(val)))} />
                  <Pie
                    data={m.chartData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={90}
                    paddingAngle={2}
                  >
                    {m.chartData.map((_, i) => (
                      <Cell key={i} fill={palette[i % palette.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-sm text-brand-blue/70">
                Ingresa valores para ver el gráfico.
              </div>
            )}
          </div>

          <div className="mt-6">
            <h4 className="font-semibold text-brand-green mb-2">
              Vista previa (primeros 24 periodos {FREQ_META[m.freq].label.toLowerCase()})
            </h4>
            <div className="overflow-auto rounded-xl border border-brand-gold/40">
              <table className="w-full text-sm">
                <thead className="bg-brand-beige/40 text-brand-blue">
                  <tr>
                    <th className="text-left px-3 py-2">#</th>
                    <th className="text-right px-3 py-2">Interés</th>
                    <th className="text-right px-3 py-2">Capital</th>
                    <th className="text-right px-3 py-2">Saldo</th>
                  </tr>
                </thead>
                <tbody>
                  {m.termSchedule.rows.slice(0, 24).map((r) => (
                    <tr key={r.period} className="border-t">
                      <td className="px-3 py-2">{r.period}</td>
                      <td className="px-3 py-2 text-right">{CAD2.format(r.interest)}</td>
                      <td className="px-3 py-2 text-right">{CAD2.format(r.principal)}</td>
                      <td className="px-3 py-2 text-right">{CAD2.format(r.balance)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="mt-3 text-sm">
              ¿Quieres el detalle completo periodo a periodo?{" "}
              <Link href="/es/herramientas/tabla-amortizacion" className="underline">
                Abre la Tabla de Amortización
              </Link>
              .
            </p>
          </div>

          <div className="mt-6 rounded-xl border border-brand-gold/40 bg-brand-beige/40 p-4">
            <h4 className="font-semibold text-brand-green mb-2">Herramientas similares</h4>
            <ul className="list-disc ml-5 text-sm space-y-1">
              <li>
                <Link href="/es/herramientas/prueba-esfuerzo" className="underline">
                  Asequibilidad y Prueba de Esfuerzo
                </Link>
              </li>
              <li>
                <Link href="/es/herramientas/pago-inicial-seguro" className="underline">
                  Pago Inicial y Seguro CMHC
                </Link>
              </li>
              <li>
                <Link href="/es/herramientas/tabla-amortizacion" className="underline">
                  Tabla de Amortización y Prepagos
                </Link>
              </li>
              <li>
                <Link href="/es/herramientas/costos-cierre" className="underline">
                  Estimador de Costos de Cierre
                </Link>
              </li>
            </ul>
          </div>
        </section>
      </form>

      <style jsx global>{`
        @media print {
          .print\\:hidden {
            display: none !important;
          }
          main {
            background: white !important;
          }
          header,
          section {
            break-inside: avoid;
            page-break-inside: avoid;
          }
        }
      `}</style>

      <p className="mt-6 text-xs text-brand-blue/70">
        Estimación educativa. Los cálculos usan capitalización por periodo y pueden diferir de métodos de prestamistas.
        Confirma pagos exactos con tu prestamista.
      </p>
    </ToolShell>
  );
}
