"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import ToolShell from "@/components/ToolShell";

/**
 * Estimador de Costos de Cierre (ES-CA)
 * -------------------------------------------------------
 * - Predeterminados típicos para compradores en Ontario (editables).
 * - Toggle para “Compra de condominio” que incluye Certificado de estado.
 * - Costos avanzados colapsables para mantener el formulario ordenado.
 * - Persiste en localStorage (clave por herramienta).
 * - Solo con fines educativos.
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
  maximumFractionDigits: 2,
});
const num = (s: string) => {
  const x = Number(String(s).replace(/[^\d.-]/g, ""));
  return Number.isFinite(x) ? x : 0;
};

const DEFAULTS = {
  purchasePrice: "800000",
  isCondo: "false",
  legal: "1500",
  title: "500",
  inspection: "500",
  appraisal: "400",
  statusCert: "100", // solo cuando isCondo = true
  adjustments: "500",
  moving: "1200",
  contingencyPct: "1.5", // % del precio
};

const LS_KEY = "herramientas.costos_cierre.v1";

export default function Page() {
  const [purchasePrice, setPurchasePrice] = useState(DEFAULTS.purchasePrice);
  const [isCondo, setIsCondo] = useState(DEFAULTS.isCondo);

  // básicos
  const [legal, setLegal] = useState(DEFAULTS.legal);
  const [title, setTitle] = useState(DEFAULTS.title);
  const [inspection, setInspection] = useState(DEFAULTS.inspection);
  const [appraisal, setAppraisal] = useState(DEFAULTS.appraisal);

  // avanzados
  const [statusCert, setStatusCert] = useState(DEFAULTS.statusCert);
  const [adjustments, setAdjustments] = useState(DEFAULTS.adjustments);
  const [moving, setMoving] = useState(DEFAULTS.moving);
  const [contingencyPct, setContingencyPct] = useState(DEFAULTS.contingencyPct);

  const [showAdvanced, setShowAdvanced] = useState(false);

  // Restaurar
  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) {
        const v = JSON.parse(raw);
        if (v && typeof v === "object") {
          setPurchasePrice(v.purchasePrice ?? DEFAULTS.purchasePrice);
          setIsCondo(v.isCondo ?? DEFAULTS.isCondo);
          setLegal(v.legal ?? DEFAULTS.legal);
          setTitle(v.title ?? DEFAULTS.title);
          setInspection(v.inspection ?? DEFAULTS.inspection);
          setAppraisal(v.appraisal ?? DEFAULTS.appraisal);
          setStatusCert(v.statusCert ?? DEFAULTS.statusCert);
          setAdjustments(v.adjustments ?? DEFAULTS.adjustments);
          setMoving(v.moving ?? DEFAULTS.moving);
          setContingencyPct(v.contingencyPct ?? DEFAULTS.contingencyPct);
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
          purchasePrice,
          isCondo,
          legal,
          title,
          inspection,
          appraisal,
          statusCert,
          adjustments,
          moving,
          contingencyPct,
        })
      );
    } catch {}
  }, [purchasePrice, isCondo, legal, title, inspection, appraisal, statusCert, adjustments, moving, contingencyPct]);

  const m = useMemo(() => {
    const price = num(purchasePrice);

    const legalCost = num(legal);
    const titleCost = num(title);
    const inspectionCost = num(inspection);
    const appraisalCost = num(appraisal);

    const statusCost = isCondo === "true" ? num(statusCert) : 0; // solo si es condominio
    const adjustmentsCost = num(adjustments);
    const movingCost = num(moving);
    const contingency = price * (Number(contingencyPct) / 100);

    const total =
      legalCost +
      titleCost +
      inspectionCost +
      appraisalCost +
      statusCost +
      adjustmentsCost +
      movingCost +
      contingency;

    const pctOfPrice = price > 0 ? (total / price) * 100 : 0;

    return {
      price,
      legalCost,
      titleCost,
      inspectionCost,
      appraisalCost,
      statusCost,
      adjustmentsCost,
      movingCost,
      contingency,
      total,
      pctOfPrice,
    };
  }, [purchasePrice, isCondo, legal, title, inspection, appraisal, statusCert, adjustments, moving, contingencyPct]);

  const onPrint = () => window.print();
  const onReset = () => {
    setPurchasePrice(DEFAULTS.purchasePrice);
    setIsCondo(DEFAULTS.isCondo);
    setLegal(DEFAULTS.legal);
    setTitle(DEFAULTS.title);
    setInspection(DEFAULTS.inspection);
    setAppraisal(DEFAULTS.appraisal);
    setStatusCert(DEFAULTS.statusCert);
    setAdjustments(DEFAULTS.adjustments);
    setMoving(DEFAULTS.moving);
    setContingencyPct(DEFAULTS.contingencyPct);
    setShowAdvanced(false);
  };

  return (
    <ToolShell
      title="Estimador de Costos de Cierre"
      subtitle="Calcula los costos típicos al cerrar la compra de una vivienda. Todos los valores son editables y varían caso a caso. El Impuesto de Transferencia de la Propiedad se calcula en una herramienta separada."
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
              value={purchasePrice}
              onChange={(e) => setPurchasePrice(e.target.value)}
              inputMode="decimal"
              className="mt-1 w-full rounded-xl border border-brand-gold/60 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-gold"
            />
          </label>

          <label className="inline-flex items-center gap-2">
            <input
              type="checkbox"
              checked={isCondo === "true"}
              onChange={(e) => setIsCondo(e.target.checked ? "true" : "false")}
            />
            <span>Compra de condominio (incluir Certificado de estado)</span>
          </label>

          <div className="grid sm:grid-cols-2 gap-3">
            <label className="block">
              <span className="block text-sm text-brand-blue/80">Honorarios legales</span>
              <input
                value={legal}
                onChange={(e) => setLegal(e.target.value)}
                inputMode="decimal"
                className="mt-1 w-full rounded-xl border border-brand-gold/60 px-3 py-2"
              />
            </label>
            <label className="block">
              <span className="block text-sm text-brand-blue/80">Seguro de título / registro</span>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                inputMode="decimal"
                className="mt-1 w-full rounded-xl border border-brand-gold/60 px-3 py-2"
              />
            </label>
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            <label className="block">
              <span className="block text-sm text-brand-blue/80">Inspección de la vivienda</span>
              <input
                value={inspection}
                onChange={(e) => setInspection(e.target.value)}
                inputMode="decimal"
                className="mt-1 w-full rounded-xl border border-brand-gold/60 px-3 py-2"
              />
            </label>
            <label className="block">
              <span className="block text-sm text-brand-blue/80">Avalúo</span>
              <input
                value={appraisal}
                onChange={(e) => setAppraisal(e.target.value)}
                inputMode="decimal"
                className="mt-1 w-full rounded-xl border border-brand-gold/60 px-3 py-2"
              />
            </label>
          </div>

          {/* Costos avanzados */}
          <details
            className="rounded-xl border border-brand-gold/40 bg-brand-beige/30 p-3"
            open={showAdvanced}
            onToggle={(e) => setShowAdvanced((e.target as HTMLDetailsElement).open)}
          >
            <summary className="cursor-pointer text-brand-blue font-medium">Costos avanzados</summary>
            <div className="mt-3 grid sm:grid-cols-2 gap-3">
              <label className="block">
                <span className="block text-sm text-brand-blue/80">Certificado de estado (condominio)</span>
                <input
                  value={statusCert}
                  onChange={(e) => setStatusCert(e.target.value)}
                  inputMode="decimal"
                  disabled={isCondo !== "true"}
                  className={`mt-1 w-full rounded-xl border border-brand-gold/60 px-3 py-2 ${isCondo !== "true" ? "opacity-60" : ""}`}
                />
              </label>
              <label className="block">
                <span className="block text-sm text-brand-blue/80">Ajustes (servicios, impuestos)</span>
                <input
                  value={adjustments}
                  onChange={(e) => setAdjustments(e.target.value)}
                  inputMode="decimal"
                  className="mt-1 w-full rounded-xl border border-brand-gold/60 px-3 py-2"
                />
              </label>
            </div>

            <div className="mt-3 grid sm:grid-cols-2 gap-3">
              <label className="block">
                <span className="block text-sm text-brand-blue/80">Mudanza</span>
                <input
                  value={moving}
                  onChange={(e) => setMoving(e.target.value)}
                  inputMode="decimal"
                  className="mt-1 w-full rounded-xl border border-brand-gold/60 px-3 py-2"
                />
              </label>
              <label className="block">
                <span className="block text-sm text-brand-blue/80">Contingencia (% del precio)</span>
                <input
                  value={contingencyPct}
                  onChange={(e) => setContingencyPct(e.target.value)}
                  inputMode="decimal"
                  className="mt-1 w-full rounded-xl border border-brand-gold/60 px-3 py-2"
                />
              </label>
            </div>
          </details>
        </section>

        {/* Resultados */}
        <section className="rounded-2xl border border-brand-gold bg-white p-5">
          <h3 className="font-sans text-lg text-brand-green font-semibold">Resultados</h3>

          <div className="grid sm:grid-cols-2 gap-4 mt-2">
            <div>
              <div className="text-sm text-brand-blue/80">Costos de cierre totales</div>
              <div className="text-2xl font-bold text-brand-green">
                {CAD0.format(Math.round(m.total))}
              </div>
            </div>
            <div>
              <div className="text-sm text-brand-blue/80">% del precio de compra</div>
              <div className="text-2xl font-bold text-brand-green">
                {m.pctOfPrice.toFixed(2)}%
              </div>
            </div>
          </div>

          <div className="mt-4 rounded-xl border border-brand-gold/40 bg-brand-beige/40 p-4">
            <h4 className="font-semibold text-brand-green mb-2">Desglose</h4>
            <ul className="list-disc ml-5 text-sm space-y-1">
              <li>Honorarios legales: {CAD2.format(m.legalCost)}</li>
              <li>Seguro de título / registro: {CAD2.format(m.titleCost)}</li>
              <li>Inspección: {CAD2.format(m.inspectionCost)}</li>
              <li>Avalúo: {CAD2.format(m.appraisalCost)}</li>
              <li>Certificado de estado (condo): {isCondo === "true" ? CAD2.format(m.statusCost) : "—"}</li>
              <li>Ajustes: {CAD2.format(m.adjustmentsCost)}</li>
              <li>Mudanza: {CAD2.format(m.movingCost)}</li>
              <li>Contingencia (@ {Number(contingencyPct || 0).toFixed(2)}%): {CAD2.format(m.contingency)}</li>
            </ul>
          </div>

          {/* Herramientas similares */}
          <div className="mt-6 rounded-xl border border-brand-gold/40 bg-brand-beige/40 p-4">
            <h4 className="font-semibold text-brand-green mb-2">Herramientas similares</h4>
            <ul className="list-disc ml-5 text-sm space-y-1">
              <li><Link href="/es/herramientas/impuesto-transferencia" className="underline">Impuesto de Transferencia (ON + Toronto)</Link></li>
              <li><Link href="/es/herramientas/pago-inicial-seguro" className="underline">Pago Inicial y Seguro CMHC</Link></li>
              <li><Link href="/es/herramientas/prueba-esfuerzo" className="underline">Asequibilidad y Prueba de Esfuerzo</Link></li>
              <li><Link href="/es/herramientas/calculadora-hipotecaria" className="underline">Calculadora de Pagos Hipotecarios</Link></li>
            </ul>
          </div>
        </section>
      </form>

      {/* Aviso */}
      <p className="mt-6 text-xs text-brand-blue/70">
        Uso educativo. Los costos reales dependen del prestamista, el tipo de propiedad y el municipio. Confirma importes exactos con tu abogada/o y tu prestamista antes del cierre.
      </p>
    </ToolShell>
  );
}
