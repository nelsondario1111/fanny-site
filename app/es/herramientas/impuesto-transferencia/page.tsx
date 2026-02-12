"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import ToolShell from "@/components/ToolShell";

/**
 * Impuesto de Transferencia de la Propiedad (Ontario + Toronto)
 * ---------------------------------------------------------------
 * - Provincial (Ontario) para residenciales (1–2 viviendas unifamiliares):
 *   0.5% hasta $55k; 1.0% $55k–$250k; 1.5% $250k–$400k; 2.0% $400k–$2M;
 *   2.5% sobre $2M (solo para 1–2 viviendas unifamiliares).
 *   Si NO es 1–2 SFR, tope simple del 2.0% sobre $400k.
 * - Municipal (Toronto): replica los tramos inferiores + tramos “luxury” desde $3M (hasta 7.5% sobre $20M).
 * - Reembolsos para primer comprador/a:
 *   Ontario hasta $4,000; Toronto hasta $4,475 (porción municipal).
 * - Uso educativo — confirma importes exactos con tu abogada/o o agente antes del cierre.
 */

// ---------- Formato / utilidades ----------
const CAD0 = new Intl.NumberFormat("es-CA", {
  style: "currency",
  currency: "CAD",
  maximumFractionDigits: 0,
});
const CAD2 = new Intl.NumberFormat("es-CA", {
  style: "currency",
  currency: "CAD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});
const num = (s: string) => {
  const x = Number(String(s).replace(/[^\d.-]/g, ""));
  return Number.isFinite(x) ? x : 0;
};

type Bracket = { upTo?: number; rate: number };
type Line = { bandFrom: number; bandTo: number; rate: number; amount: number };

// Ontario residencial (1–2 viviendas unifamiliares)
const ON_BRACKETS_1_2_SFR: Bracket[] = [
  { upTo: 55_000, rate: 0.005 },       // 0.5%
  { upTo: 250_000, rate: 0.01 },       // 1.0%
  { upTo: 400_000, rate: 0.015 },      // 1.5%
  { upTo: 2_000_000, rate: 0.02 },     // 2.0%
  { rate: 0.025 },                     // 2.5% sobre $2M (1–2 SFR)
];
// Ontario (no 1–2 SFR) — regla simple: tope 2.0% (sin 2.5%)
const ON_BRACKETS_OTHER: Bracket[] = [
  { upTo: 55_000, rate: 0.005 },
  { upTo: 250_000, rate: 0.01 },
  { upTo: 400_000, rate: 0.015 },
  { rate: 0.02 }, // 2.0% sobre $400k
];

// Toronto (MLTT municipal; residencial + tramos lujo)
const TO_BRACKETS: Bracket[] = [
  { upTo: 55_000, rate: 0.005 },
  { upTo: 250_000, rate: 0.01 },
  { upTo: 400_000, rate: 0.015 },
  { upTo: 2_000_000, rate: 0.02 },
  { upTo: 3_000_000, rate: 0.025 },  // 2.5%
  { upTo: 4_000_000, rate: 0.035 },  // 3.5%
  { upTo: 5_000_000, rate: 0.045 },  // 4.5%
  { upTo: 10_000_000, rate: 0.055 }, // 5.5%
  { upTo: 20_000_000, rate: 0.065 }, // 6.5%
  { rate: 0.075 },                   // 7.5% 20M+
];

// Reembolsos
const ON_FTB_MAX = 4_000;  // máximo provincial
const TO_FTB_MAX = 4_475;  // máximo municipal Toronto

function marginalTax(price: number, brackets: Bracket[]) {
  let remaining = price;
  let lastCap = 0;
  let tax = 0;
  const lines: Line[] = [];

  for (const b of brackets) {
    const cap = b.upTo ?? Infinity;
    const slice = Math.max(0, Math.min(remaining, cap - lastCap));
    if (slice > 0) {
      const amount = slice * b.rate;
      tax += amount;
      const bandFrom = lastCap;
      const bandTo = lastCap + slice; // porción efectiva en este tramo
      lines.push({ bandFrom, bandTo, rate: b.rate, amount });
      remaining -= slice;
      lastCap = cap;
    }
    if (remaining <= 0) break;
  }

  return { tax, lines };
}

const DEFAULTS = {
  price: "850000",
  inToronto: "true",
  isOneOrTwoSFR: "true", // controla 2.5% ON sobre $2M
  isFTB_ON: "false",
  isFTB_TO: "false",
};

const LS_KEY = "herramientas.impuesto_transferencia.v1";

export default function Page() {
  const [priceStr, setPriceStr] = useState(DEFAULTS.price);
  const [inToronto, setInToronto] = useState(DEFAULTS.inToronto);
  const [isOneOrTwoSFR, setIsOneOrTwoSFR] = useState(DEFAULTS.isOneOrTwoSFR);
  const [isFTB_ON, setIsFTB_ON] = useState(DEFAULTS.isFTB_ON);
  const [isFTB_TO, setIsFTB_TO] = useState(DEFAULTS.isFTB_TO);

  // Restaurar desde localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) {
        const v = JSON.parse(raw);
        if (v && typeof v === "object") {
          setPriceStr(v.price ?? DEFAULTS.price);
          setInToronto(v.inToronto ?? DEFAULTS.inToronto);
          setIsOneOrTwoSFR(v.isOneOrTwoSFR ?? DEFAULTS.isOneOrTwoSFR);
          setIsFTB_ON(v.isFTB_ON ?? DEFAULTS.isFTB_ON);
          setIsFTB_TO(v.isFTB_TO ?? DEFAULTS.isFTB_TO);
        }
      }
    } catch {}
  }, []);

  // Persistir en localStorage
  useEffect(() => {
    try {
      localStorage.setItem(
        LS_KEY,
        JSON.stringify({ price: priceStr, inToronto, isOneOrTwoSFR, isFTB_ON, isFTB_TO })
      );
    } catch {}
  }, [priceStr, inToronto, isOneOrTwoSFR, isFTB_ON, isFTB_TO]);

  const m = useMemo(() => {
    const price = Math.max(0, num(priceStr));

    // Impuesto provincial (Ontario)
    const bracketsON = isOneOrTwoSFR === "true" ? ON_BRACKETS_1_2_SFR : ON_BRACKETS_OTHER;
    const onCalc = marginalTax(price, bracketsON);
    const onTax = onCalc.tax;

    // Impuesto municipal Toronto (si aplica)
    const toCalc = inToronto === "true" ? marginalTax(price, TO_BRACKETS) : { tax: 0, lines: [] as Line[] };
    const toTax = toCalc.tax;

    const totalBeforeRebates = onTax + toTax;

    // Reembolsos primer comprador/a
    const onRebate = isFTB_ON === "true" ? Math.min(ON_FTB_MAX, onTax) : 0;
    const toRebate = inToronto === "true" && isFTB_TO === "true" ? Math.min(TO_FTB_MAX, toTax) : 0;
    const totalRebates = onRebate + toRebate;

    const totalAfterRebates = Math.max(0, totalBeforeRebates - totalRebates);

    return {
      price,
      onCalc,
      toCalc,
      onTax,
      toTax,
      totalBeforeRebates,
      onRebate,
      toRebate,
      totalRebates,
      totalAfterRebates,
    };
  }, [priceStr, inToronto, isOneOrTwoSFR, isFTB_ON, isFTB_TO]);

  const onPrint = () => window.print();
  const onReset = () => {
    setPriceStr(DEFAULTS.price);
    setInToronto(DEFAULTS.inToronto);
    setIsOneOrTwoSFR(DEFAULTS.isOneOrTwoSFR);
    setIsFTB_ON(DEFAULTS.isFTB_ON);
    setIsFTB_TO(DEFAULTS.isFTB_TO);
  };

  return (
    <ToolShell
      title="Impuesto de Transferencia (Ontario + Toronto)"
      subtitle="Calcula el impuesto provincial y el municipal de Toronto con reembolsos para primer comprador/a. Estas cifras son estimadas: confirma los importes exactos al cierre."
      lang="es"
    >
      {/* Acciones */}
      <div className="flex flex-wrap gap-2 mb-4 print:hidden">
        <button
          type="button"
          onClick={onPrint}
          className="px-4 py-2 rounded-full border-2 border-brand-blue text-brand-blue hover:bg-brand-blue hover:text-white transition"
        >
          Imprimir / Guardar PDF
        </button>
        <button
          type="button"
          onClick={onReset}
          className="px-4 py-2 rounded-full border-2 border-brand-gold text-brand-green hover:bg-brand-gold hover:text-brand-green transition"
        >
          Restablecer valores
        </button>
      </div>

      <form className="grid xl:grid-cols-2 gap-6">
        {/* Entradas */}
        <section className="rounded-2xl border border-brand-gold bg-white p-5 grid gap-4">
          <h3 className="font-sans text-lg text-brand-green font-semibold">Entradas</h3>

          <label className="block">
            <span className="block text-sm text-brand-blue/80">Precio de compra</span>
            <input
              value={priceStr}
              onChange={(e) => setPriceStr(e.target.value)}
              inputMode="decimal"
              className="mt-1 w-full rounded-xl border border-brand-gold/60 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-gold"
              aria-label="Precio de compra"
            />
          </label>

          <div className="grid sm:grid-cols-2 gap-3">
            <label className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                checked={inToronto === "true"}
                onChange={(e) => setInToronto(e.target.checked ? "true" : "false")}
              />
              <span>La propiedad está en la Ciudad de Toronto (aplica MLTT)</span>
            </label>

            <label className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                checked={isOneOrTwoSFR === "true"}
                onChange={(e) => setIsOneOrTwoSFR(e.target.checked ? "true" : "false")}
              />
              <span>1–2 viviendas unifamiliares (ON 2.5% sobre $2M)</span>
            </label>
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            <label className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                checked={isFTB_ON === "true"}
                onChange={(e) => setIsFTB_ON(e.target.checked ? "true" : "false")}
              />
              <span>Primer comprador/a (reembolso Ontario hasta $4,000)</span>
            </label>

            <label className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                checked={isFTB_TO === "true"}
                onChange={(e) => setIsFTB_TO(e.target.checked ? "true" : "false")}
                disabled={inToronto !== "true"}
              />
              <span className={inToronto === "true" ? "" : "opacity-50"}>
                Primer comprador/a (reembolso Toronto hasta $4,475)
              </span>
            </label>
          </div>

          <p className="text-xs text-brand-blue/70">
            Nota: los tramos “luxury” de Toronto (3.5%–7.5%) aplican a compras residenciales de $3M+ (hasta 7.5% sobre $20M).
            Los impuestos provincial y municipal se calculan por separado y luego se suman.
          </p>
        </section>

        {/* Resultados */}
        <section className="rounded-2xl border border-brand-gold bg-white p-5">
          <h3 className="font-sans text-lg text-brand-green font-semibold">Resultados</h3>

          <div className="grid sm:grid-cols-2 gap-4 mt-2">
            <div>
              <div className="text-sm text-brand-blue/80">Ontario (antes de reembolso)</div>
              <div className="text-2xl font-bold text-brand-green">{CAD0.format(Math.round(m.onTax))}</div>
            </div>
            <div>
              <div className="text-sm text-brand-blue/80">Toronto (antes de reembolso)</div>
              <div className="text-2xl font-bold text-brand-green">
                {m.toTax ? CAD0.format(Math.round(m.toTax)) : "—"}
              </div>
            </div>
          </div>

          <div className="mt-4 grid sm:grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-brand-blue/80">Total antes de reembolsos</div>
              <div className="text-xl font-semibold">{CAD0.format(Math.round(m.totalBeforeRebates))}</div>
            </div>
            <div>
              <div className="text-sm text-brand-blue/80">Reembolsos totales</div>
              <div className="text-xl font-semibold">
                {m.totalRebates ? `− ${CAD0.format(Math.round(m.totalRebates))}` : CAD0.format(0)}
              </div>
              <div className="text-xs text-brand-blue/70">
                ON: {m.onRebate ? CAD0.format(Math.round(m.onRebate)) : CAD0.format(0)};{" "}
                Toronto: {m.toRebate ? CAD0.format(Math.round(m.toRebate)) : CAD0.format(0)}
              </div>
            </div>
          </div>

          <div className="mt-4">
            <div className="text-sm text-brand-blue/80">Total estimado a pagar</div>
            <div className="text-2xl font-extrabold text-brand-green">
              {CAD0.format(Math.round(m.totalAfterRebates))}
            </div>
          </div>

          {/* Desglose por tramos */}
          <details className="mt-6">
            <summary className="cursor-pointer text-brand-blue underline">Mostrar desglose provincial (Ontario)</summary>
            <div className="mt-3 overflow-auto rounded-xl border border-brand-gold/40">
              <table className="w-full text-sm">
                <thead className="bg-brand-beige/40 text-brand-blue">
                  <tr>
                    <th className="text-left px-3 py-2">Tramo</th>
                    <th className="text-right px-3 py-2">Tasa</th>
                    <th className="text-right px-3 py-2">Impuesto</th>
                  </tr>
                </thead>
                <tbody>
                  {m.onCalc.lines.map((r, i) => (
                    <tr key={i} className="border-t">
                      <td className="px-3 py-2">
                        {CAD0.format(r.bandFrom)} – {isFinite(r.bandTo) ? CAD0.format(r.bandTo) : "∞"}
                      </td>
                      <td className="px-3 py-2 text-right">{(r.rate * 100).toFixed(2)}%</td>
                      <td className="px-3 py-2 text-right">{CAD2.format(r.amount)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </details>

          {m.toCalc.lines.length > 0 && (
            <details className="mt-4">
              <summary className="cursor-pointer text-brand-blue underline">Mostrar desglose municipal (Toronto)</summary>
              <div className="mt-3 overflow-auto rounded-xl border border-brand-gold/40">
                <table className="w-full text-sm">
                  <thead className="bg-brand-beige/40 text-brand-blue">
                    <tr>
                      <th className="text-left px-3 py-2">Tramo</th>
                      <th className="text-right px-3 py-2">Tasa</th>
                      <th className="text-right px-3 py-2">Impuesto</th>
                    </tr>
                  </thead>
                  <tbody>
                    {m.toCalc.lines.map((r, i) => (
                      <tr key={i} className="border-t">
                        <td className="px-3 py-2">
                          {CAD0.format(r.bandFrom)} – {isFinite(r.bandTo) ? CAD0.format(r.bandTo) : "∞"}
                        </td>
                        <td className="px-3 py-2 text-right">{(r.rate * 100).toFixed(2)}%</td>
                        <td className="px-3 py-2 text-right">{CAD2.format(r.amount)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </details>
          )}

          {/* Herramientas similares */}
          <div className="mt-6 rounded-xl border border-brand-gold/40 bg-brand-beige/40 p-4">
            <h4 className="font-semibold text-brand-green mb-2">Herramientas similares</h4>
            <ul className="list-disc ml-5 text-sm space-y-1">
              <li><Link href="/es/herramientas/costos-cierre" className="underline">Estimador de Costos de Cierre</Link></li>
              <li><Link href="/es/herramientas/pago-inicial-seguro" className="underline">Pago Inicial y Seguro CMHC</Link></li>
              <li><Link href="/es/herramientas/prueba-esfuerzo" className="underline">Asequibilidad y Prueba de Esfuerzo</Link></li>
              <li><Link href="/es/herramientas/calculadora-hipotecaria" className="underline">Calculadora de Pagos Hipotecarios</Link></li>
            </ul>
          </div>
        </section>
      </form>

      {/* Notas / aviso */}
      <div className="mt-8 rounded-2xl border border-brand-gold bg-white p-5">
        <h4 className="font-sans text-lg text-brand-green font-semibold mb-2">Notas</h4>
        <ul className="list-disc pl-6 space-y-2 text-brand-body">
          <li>Tramos Ontario: 0.5% hasta $55k; 1.0% $55k–$250k; 1.5% $250k–$400k; 2.0% $400k–$2M; 2.5% sobre $2M (1–2 viviendas unifamiliares).</li>
          <li>Toronto añade tramos “luxury” para compras de $3M+ (hasta 7.5% sobre $20M).</li>
          <li>Reembolsos para primer comprador/a: Ontario hasta $4,000; Toronto hasta $4,475 (porción municipal).</li>
          <li>Herramienta educativa: puede no contemplar todos los casos o exenciones.</li>
        </ul>
      </div>

      {/* Estilos de impresión */}
      <style jsx global>{`
        @media print {
          .print\\:hidden { display: none !important; }
          main { background: white !important; }
          header, section { break-inside: avoid; page-break-inside: avoid; }
        }
      `}</style>

      <p className="mt-6 text-xs text-brand-blue/70">
        Uso educativo. No constituye asesoría legal, fiscal o de crédito.
      </p>
    </ToolShell>
  );
}
