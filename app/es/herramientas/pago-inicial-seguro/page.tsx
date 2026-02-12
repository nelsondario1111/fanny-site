"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import ToolShell from "@/components/ToolShell";

/**
 * Pago inicial y Seguro CMHC (ES-CA)
 * -------------------------------------------------------
 * - Calcula el pago inicial mínimo requerido.
 * - Verifica si se requiere seguro.
 * - Aplica tasas de prima CMHC según LTV.
 * - Agrega el 8% de impuesto provincial (Ontario) sobre la prima.
 * - Solo educativo; confirma con tu prestamista/aseguradora.
 */

const CAD0 = new Intl.NumberFormat("es-CA", {
  style: "currency",
  currency: "CAD",
  maximumFractionDigits: 0,
});
const num = (s: string) => {
  const x = Number(String(s).replace(/[^\d.-]/g, ""));
  return Number.isFinite(x) ? x : 0;
};

// Tasas de prima CMHC (% de la hipoteca) por LTV
function cmhcPremiumRate(ltvPct: number) {
  if (ltvPct > 95) return null; // no permitido
  if (ltvPct > 90) return 0.045;
  if (ltvPct > 85) return 0.04;
  if (ltvPct > 80) return 0.031;
  if (ltvPct > 65) return 0.028;
  return 0; // convencional (20%+)
}

// Pago inicial mínimo (regla Canadá)
function minDownPayment(price: number): number {
  if (price >= 1_000_000) return price * 0.20;
  const first = Math.min(price, 500_000);
  const second = Math.max(0, price - 500_000);
  return first * 0.05 + second * 0.10;
}

const DEFAULTS = {
  price: "750000",
  down: "50000",
};

const LS_KEY = "herramientas.pago_inicial_seguro.v1";

export default function Page() {
  const [priceStr, setPriceStr] = useState(DEFAULTS.price);
  const [downStr, setDownStr] = useState(DEFAULTS.down);

  // Restaurar
  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) {
        const v = JSON.parse(raw);
        if (v && typeof v === "object") {
          setPriceStr(v.price ?? DEFAULTS.price);
          setDownStr(v.down ?? DEFAULTS.down);
        }
      }
    } catch {}
  }, []);

  // Persistir
  useEffect(() => {
    try {
      localStorage.setItem(LS_KEY, JSON.stringify({ price: priceStr, down: downStr }));
    } catch {}
  }, [priceStr, downStr]);

  const m = useMemo(() => {
    const price = num(priceStr);
    const down = Math.min(num(downStr), price);
    const loan = Math.max(0, price - down);

    const downPct = price > 0 ? (down / price) * 100 : 0;
    const ltv = price > 0 ? (loan / price) * 100 : 0;

    const minDp = minDownPayment(price);
    const meetsMinimum = down >= minDp;

    let premiumRate = cmhcPremiumRate(ltv);
    if (!meetsMinimum) premiumRate = null; // inválido
    if (price >= 1_000_000) premiumRate = 0; // solo convencional

    const premium = premiumRate ? loan * premiumRate : 0;
    const pst = premium * 0.08; // Ontario 8%
    const totalWithPremium = loan + premium + pst;

    return {
      price,
      down,
      loan,
      downPct,
      ltv,
      minDp,
      meetsMinimum,
      premiumRate,
      premium,
      pst,
      totalWithPremium,
    };
  }, [priceStr, downStr]);

  const onPrint = () => window.print();
  const onReset = () => {
    setPriceStr(DEFAULTS.price);
    setDownStr(DEFAULTS.down);
  };

  return (
    <ToolShell
      title="Pago inicial y Seguro CMHC"
      subtitle="Comprueba las reglas de pago inicial mínimo, si necesitas seguro hipotecario y el impuesto a la prima."
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
        <section className="rounded-2xl border border-brand-gold bg-white p-5 grid gap-3">
          <h3 className="font-sans text-lg text-brand-green font-semibold">Entradas</h3>
          <label className="block">
            <span className="block text-sm text-brand-blue/80">Precio de compra</span>
            <input
              value={priceStr}
              onChange={(e) => setPriceStr(e.target.value)}
              inputMode="decimal"
              className="mt-1 w-full rounded-xl border border-brand-gold/60 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-gold"
            />
          </label>
          <label className="block">
            <span className="block text-sm text-brand-blue/80">Pago inicial</span>
            <input
              value={downStr}
              onChange={(e) => setDownStr(e.target.value)}
              inputMode="decimal"
              className="mt-1 w-full rounded-xl border border-brand-gold/60 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-gold"
            />
          </label>
        </section>

        {/* Resultados */}
        <section className="rounded-2xl border border-brand-gold bg-white p-5">
          <h3 className="font-sans text-lg text-brand-green font-semibold">Resultados</h3>

          <div className="grid sm:grid-cols-2 gap-4 mt-2">
            <div>
              <div className="text-sm text-brand-blue/80">% de pago inicial</div>
              <div className="text-2xl font-bold text-brand-green">{m.price ? m.downPct.toFixed(1) + "%" : "—"}</div>
            </div>
            <div>
              <div className="text-sm text-brand-blue/80">Relación préstamo-valor (LTV)</div>
              <div className="text-2xl font-bold text-brand-green">{m.price ? m.ltv.toFixed(1) + "%" : "—"}</div>
            </div>
          </div>

          <div className="mt-4">
            <div className="text-sm text-brand-blue/80">Pago inicial mínimo requerido</div>
            <div className="text-xl font-semibold">{m.price ? CAD0.format(m.minDp) : "—"}</div>
            {!m.meetsMinimum && m.price > 0 && (
              <div className="text-sm text-red-600">No cumple con el mínimo requerido</div>
            )}
          </div>

          {m.premiumRate !== null && (
            <div className="mt-4 grid sm:grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-brand-blue/80">Hipoteca (antes de prima)</div>
                <div className="text-xl font-semibold">{CAD0.format(Math.round(m.loan))}</div>
              </div>
              <div>
                <div className="text-sm text-brand-blue/80">Tasa de prima del seguro</div>
                <div className="text-xl font-semibold">
                  {m.premiumRate ? (m.premiumRate * 100).toFixed(2) + "%" : "N/D"}
                </div>
              </div>
              <div>
                <div className="text-sm text-brand-blue/80">Prima del seguro</div>
                <div className="text-xl font-semibold">{m.premium ? CAD0.format(Math.round(m.premium)) : "—"}</div>
              </div>
              <div>
                <div className="text-sm text-brand-blue/80">Impuesto a la prima (ON 8%)</div>
                <div className="text-xl font-semibold">{m.pst ? CAD0.format(Math.round(m.pst)) : "—"}</div>
              </div>
            </div>
          )}

          {m.premiumRate === null && m.price > 0 && (
            <p className="mt-3 text-sm text-red-600">
              Este pago inicial no cumple con las reglas mínimas. Aumenta el pago inicial para calificar.
            </p>
          )}

          {m.premiumRate !== null && (
            <div className="mt-4">
              <div className="text-sm text-brand-blue/80">Hipoteca total incl. prima</div>
              <div className="text-2xl font-bold text-brand-green">
                {CAD0.format(Math.round(m.totalWithPremium))}
              </div>
            </div>
          )}

          {/* Herramientas similares */}
          <div className="mt-6 rounded-xl border border-brand-gold/40 bg-brand-beige/40 p-4">
            <h4 className="font-semibold text-brand-green mb-2">Herramientas similares</h4>
            <ul className="list-disc ml-5 text-sm space-y-1">
              <li><Link href="/es/herramientas/prueba-esfuerzo" className="underline">Asequibilidad y Prueba de Esfuerzo</Link></li>
              <li><Link href="/es/herramientas/calculadora-hipotecaria" className="underline">Calculadora de Pagos Hipotecarios</Link></li>
              <li><Link href="/es/herramientas/costos-cierre" className="underline">Estimador de Costos de Cierre</Link></li>
              <li><Link href="/es/herramientas/impuesto-transferencia" className="underline">Impuesto de Transferencia (ON + Toronto)</Link></li>
            </ul>
          </div>
        </section>
      </form>

      {/* Aviso */}
      <p className="mt-6 text-xs text-brand-blue/70">
        Uso educativo. La calificación real depende de las políticas del prestamista/aseguradora. Propiedades de $1M o más requieren 20% de pago inicial y no son elegibles para hipotecas aseguradas.
      </p>
    </ToolShell>
  );
}
