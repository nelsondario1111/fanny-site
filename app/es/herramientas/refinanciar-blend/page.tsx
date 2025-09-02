"use client";

import { useMemo, useState } from "react";
import ToolShell from "@/components/ToolShell";
import { FaPrint, FaFileCsv, FaInfoCircle } from "react-icons/fa";

/* =========================================================
   Tipos y constantes
   ========================================================= */
type MortType = "fixed" | "variable";
type PenaltyMode = "none" | "manual" | "est3mo" | "estIRD";

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
/** Pago mensual de hipoteca totalmente amortizada */
function pmt(principal: number, annualRatePct: number, years: number) {
  const i = Math.max(0, annualRatePct) / 100 / 12;
  const n = Math.max(1, Math.round(years * 12));
  if (i === 0) return principal / n;
  return (principal * i * Math.pow(1 + i, n)) / (Math.pow(1 + i, n) - 1);
}
/** Saldo remanente tras m meses (hipoteca de pago nivelado) */
function balAfterMonths(principal: number, annualRatePct: number, years: number, monthsElapsed: number) {
  const i = Math.max(0, annualRatePct) / 100 / 12;
  const n = Math.max(1, Math.round(years * 12));
  const m = Math.min(Math.max(0, Math.floor(monthsElapsed)), n);
  if (i === 0) return Math.max(0, principal - (principal / n) * m);
  const M = pmt(principal, annualRatePct, years);
  const pow = Math.pow(1 + i, m);
  return principal * pow - (M * (pow - 1)) / i;
}
/** Interés total pagado en k meses; devuelve también balance final */
function interestOverMonths(principal: number, annualRatePct: number, years: number, months: number) {
  const i = Math.max(0, annualRatePct) / 100 / 12;
  const n = Math.max(1, Math.round(years * 12));
  const k = Math.min(Math.max(0, Math.floor(months)), n);
  const M = pmt(principal, annualRatePct, years);
  let bal = principal;
  let interest = 0;
  for (let m = 1; m <= k; m++) {
    const int = bal * i;
    const princ = Math.min(bal, Math.max(0, M - int));
    interest += int;
    bal = Math.max(0, bal - princ);
    if (bal <= 0) break;
  }
  return { interest, endBalance: bal, payment: M };
}
/** CSV robusto (comillas + CRLF + BOM para Excel) */
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

/* Estimadores rápidos de penalidad (educativos) */
function est3MonthInterest(balance: number, contractRatePct: number) {
  const i = Math.max(0, contractRatePct) / 100;
  return balance * i * (3 / 12);
}
function estIRD(balance: number, contractRatePct: number, comparisonRatePct: number, remainingTermMonths: number) {
  const diff = Math.max(0, contractRatePct - comparisonRatePct) / 100;
  return (balance * diff * Math.max(0, remainingTermMonths)) / 12;
}

/* =========================================================
   Página
   ========================================================= */
export default function Page() {
  /* ------------ Hipoteca actual ------------ */
  const [mortType, setMortType] = useState<MortType>("fixed");
  const [curBalance, setCurBalance] = useState<number>(520_000);
  const [curRatePct, setCurRatePct] = useState<number>(4.89);
  const [remAmortYears, setRemAmortYears] = useState<number>(22);
  const [remTermYears, setRemTermYears] = useState<number>(2);

  /* Penalidad */
  const [penaltyMode, setPenaltyMode] = useState<PenaltyMode>("est3mo");
  const [manualPenalty, setManualPenalty] = useState<number>(0);
  const [comparisonRatePct, setComparisonRatePct] = useState<number>(3.39);
  const [adminFee, setAdminFee] = useState<number>(300);

  /* ------------ Opción de refinanciación (nueva hipoteca) ------------ */
  const [newRatePct, setNewRatePct] = useState<number>(4.29);
  const [newAmortYears, setNewAmortYears] = useState<number>(25);
  const [newTermYears, setNewTermYears] = useState<number>(5);
  const [refiOtherCosts, setRefiOtherCosts] = useState<number>(1500); // legal/tasación/título/etc.
  const [capitaliseCosts, setCapitaliseCosts] = useState<boolean>(true);

  /* ------------ Opción Blend & Extend (opcional) ------------ */
  const [useBlend, setUseBlend] = useState<boolean>(true);
  const [offerRatePct, setOfferRatePct] = useState<number>(3.99); // tasa ofrecida para la porción extendida
  const [blendNewTermYears, setBlendNewTermYears] = useState<number>(5); // nuevo plazo
  const [blendPenaltyWaived, setBlendPenaltyWaived] = useState<boolean>(true);
  const [blendResetAmort, setBlendResetAmort] = useState<boolean>(false);
  const [blendAmortYears, setBlendAmortYears] = useState<number>(remAmortYears);
  const [blendCosts, setBlendCosts] = useState<number>(0);
  const [blendCapitaliseCosts, setBlendCapitaliseCosts] = useState<boolean>(true);

  /* ------------ Horizonte de análisis ------------ */
  const [analysisYears, setAnalysisYears] = useState<number>(Math.min(remTermYears, newTermYears));

  const printDate = new Date().toLocaleDateString("es-CA", { year: "numeric", month: "long", day: "numeric" });

  /* ------------ Cálculos derivados ------------ */
  const results = useMemo(() => {
    const curP = Math.max(0, curBalance || 0);
    const remAmort = Math.max(1, remAmortYears || 1);
    const remTermM = Math.max(1, Math.round((remTermYears || 0) * 12));
    const analysisM = Math.max(1, Math.round((analysisYears || 0) * 12));

    // Estimación de penalidad
    let penalty =
      penaltyMode === "none"
        ? 0
        : penaltyMode === "manual"
        ? Math.max(0, manualPenalty || 0)
        : penaltyMode === "est3mo"
        ? est3MonthInterest(curP, curRatePct || 0)
        : estIRD(curP, curRatePct || 0, comparisonRatePct || 0, remTermM);

    // Fee administrativo / cancelación
    const discharge = Math.max(0, adminFee || 0);

    /* --- Escenario A: Quedarse (sin cambios) --- */
    const A = interestOverMonths(curP, curRatePct || 0, remAmort, Math.min(analysisM, remTermM));
    const stayMonthly = A.payment;
    const stayInterest = A.interest;
    const horizonUsedA = Math.min(analysisM, remTermM);

    /* --- Escenario B: Refinanciar a nueva hipoteca --- */
    const refiTermM = Math.max(1, Math.round((newTermYears || 0) * 12));
    const refiAmort = Math.max(1, newAmortYears || 1);
    const refiCosts = Math.max(0, refiOtherCosts || 0) + penalty + discharge;

    const refiPrincipal = capitaliseCosts ? curP + refiCosts : curP;
    const B = interestOverMonths(refiPrincipal, newRatePct || 0, refiAmort, Math.min(analysisM, refiTermM));
    const refiMonthly = B.payment;
    const refiInterest = B.interest;
    const refiUpfrontCash = capitaliseCosts ? 0 : refiCosts; // efectivo al inicio si NO se capitaliza
    const horizonUsedB = Math.min(analysisM, refiTermM);

    // Interés ahorrado vs quedarse (en el mismo horizonte)
    const horizonCommonAB = Math.min(horizonUsedA, horizonUsedB);
    const A_common = interestOverMonths(curP, curRatePct || 0, remAmort, horizonCommonAB).interest;
    const B_common = interestOverMonths(refiPrincipal, newRatePct || 0, refiAmort, horizonCommonAB).interest;
    const refiInterestSaved = Math.max(0, A_common - B_common);
    // Punto de equilibrio (meses) aprox.
    let breakEvenRefi: number | null = null;
    if (refiUpfrontCash > 0) {
      let cum = 0;
      for (let m = 1; m <= horizonCommonAB; m++) {
        const ia = interestOverMonths(curP, curRatePct || 0, remAmort, m).interest;
        const ib = interestOverMonths(refiPrincipal, newRatePct || 0, refiAmort, m).interest;
        const diff = Math.max(0, ia - ib) - (m === 1 ? refiUpfrontCash : 0); // restar el efectivo una sola vez
        cum += Math.max(0, diff);
        if (cum >= refiUpfrontCash) {
          breakEvenRefi = m;
          break;
        }
      }
    } else {
      breakEvenRefi = 0; // sin efectivo inicial; el ahorro arranca de inmediato
    }

    /* --- Escenario C: Blend & Extend (opcional) --- */
    let blend = null as null | {
      blendedRatePct: number;
      monthly: number;
      interest: number;
      upfrontCash: number;
      horizonUsed: number;
      interestSavedVsStay: number;
      breakEvenMonths: number | null;
      principalUsed: number;
      amortUsed: number;
    };
    if (useBlend) {
      const blendTermM = Math.max(1, Math.round((blendNewTermYears || 0) * 12));
      // Mezcla simple por promedio ponderado por tiempo entre la tasa actual (plazo remanente) y la tasa ofrecida (nuevo plazo).
      const w1 = Math.max(1, remTermM);
      const w2 = Math.max(1, blendTermM);
      const blendedRatePct = (curRatePct * w1 + (offerRatePct || 0) * w2) / (w1 + w2);

      const amort = blendResetAmort ? Math.max(1, blendAmortYears || 1) : remAmort;
      const costs = Math.max(0, blendCosts || 0) + (blendPenaltyWaived ? 0 : penalty) + (blendPenaltyWaived ? 0 : discharge);
      const principalUsed = blendCapitaliseCosts ? curP + costs : curP;
      const upfrontCash = blendCapitaliseCosts ? 0 : costs;

      const C = interestOverMonths(principalUsed, blendedRatePct, amort, Math.min(analysisM, blendTermM));
      const horizonUsedC = Math.min(analysisM, blendTermM);

      // Comparar con “quedarse” en un horizonte común
      const horizonCommonAC = Math.min(horizonUsedA, horizonUsedC);
      const A2 = interestOverMonths(curP, curRatePct || 0, remAmort, horizonCommonAC).interest;
      const C2 = interestOverMonths(principalUsed, blendedRatePct, amort, horizonCommonAC).interest;
      const saved = Math.max(0, A2 - C2);

      // Punto de equilibrio blend
      let be: number | null = null;
      if (upfrontCash > 0) {
        let cum = 0;
        for (let m = 1; m <= horizonCommonAC; m++) {
          const ia = interestOverMonths(curP, curRatePct || 0, remAmort, m).interest;
          const ic = interestOverMonths(principalUsed, blendedRatePct, amort, m).interest;
          const diff = Math.max(0, ia - ic) - (m === 1 ? upfrontCash : 0);
          cum += Math.max(0, diff);
          if (cum >= upfrontCash) {
            be = m;
            break;
          }
        }
      } else {
        be = 0;
      }

      blend = {
        blendedRatePct,
        monthly: C.payment,
        interest: C.interest,
        upfrontCash,
        horizonUsed: horizonUsedC,
        interestSavedVsStay: saved,
        breakEvenMonths: be,
        principalUsed,
        amortUsed: amort,
      };
    }

    return {
      penalty,
      discharge,

      stay: {
        monthly: stayMonthly,
        interest: stayInterest,
        horizonUsed: horizonUsedA,
      },

      refi: {
        monthly: refiMonthly,
        interest: refiInterest,
        principalUsed: refiPrincipal,
        amortUsed: refiAmort,
        horizonUsed: horizonUsedB,
        upfrontCash: refiUpfrontCash,
        interestSavedVsStay: refiInterestSaved,
        breakEvenMonths: breakEvenRefi,
      },

      blend,
      horizonCommonAB,
    };
  }, [
    mortType,
    curBalance,
    curRatePct,
    remAmortYears,
    remTermYears,
    penaltyMode,
    manualPenalty,
    comparisonRatePct,
    adminFee,
    newRatePct,
    newAmortYears,
    newTermYears,
    refiOtherCosts,
    capitaliseCosts,
    useBlend,
    offerRatePct,
    blendNewTermYears,
    blendPenaltyWaived,
    blendResetAmort,
    blendAmortYears,
    blendCosts,
    blendCapitaliseCosts,
    analysisYears,
  ]);

  /* ------------ Acciones ------------ */
  function handlePrint() {
    window.print();
  }
  function exportCSV() {
    const r = results;

    const rows: Array<Array<string | number>> = [
      ["Preparado", printDate],
      ["—", "—"],

      ["Hipoteca actual"],
      ["Tipo", mortType === "fixed" ? "Fija" : "Variable"],
      ["Saldo", curBalance.toFixed(2)],
      ["Tasa (%)", curRatePct.toFixed(2)],
      ["Amortización restante (años)", remAmortYears],
      ["Plazo restante (años)", remTermYears],

      ["Modo de penalidad", penaltyMode],
      ["Penalidad manual (si aplica)", manualPenalty.toFixed(2)],
      ["Tasa de comparación para IRD (%)", comparisonRatePct.toFixed(2)],
      ["Fee administrativo/cancelación", adminFee.toFixed(2)],

      ["—", "—"],

      ["Refinanciación (Nueva hipoteca)"],
      ["Nueva tasa (%)", newRatePct.toFixed(2)],
      ["Nueva amortización (años)", newAmortYears],
      ["Nuevo plazo (años)", newTermYears],
      ["Otros costos de refi", refiOtherCosts.toFixed(2)],
      ["Capitalizar costos", capitaliseCosts ? "Sí" : "No"],

      ["Blend & Extend (opcional)"],
      ["Incluir blend", results.blend ? "Sí" : "No"],
      ["Tasa ofrecida para extensión (%)", offerRatePct.toFixed(2)],
      ["Plazo nuevo (años)", blendNewTermYears],
      ["Penalidad condonada", blendPenaltyWaived ? "Sí" : "No"],
      ["Restablecer amortización", blendResetAmort ? "Sí" : "No"],
      ["Amortización (si se restablece)", blendAmortYears],
      ["Costos del blend", blendCosts.toFixed(2)],
      ["Capitalizar costos del blend", blendCapitaliseCosts ? "Sí" : "No"],

      ["—", "—"],
      ["Horizonte de análisis (años)", analysisYears],
      ["Penalidad usada (CAD)", r.penalty.toFixed(2)],
      ["Fee admin/cancelación usado (CAD)", r.discharge.toFixed(2)],

      ["—", "—"],
      ["Resultados — Quedarse"],
      ["Pago mensual", r.stay.monthly.toFixed(2)],
      ["Meses del horizonte", r.stay.horizonUsed],
      ["Interés en el horizonte (CAD)", r.stay.interest.toFixed(2)],

      ["—", "—"],
      ["Resultados — Refinanciar"],
      ["Pago mensual", r.refi.monthly.toFixed(2)],
      ["Principal usado (incl. costos capitalizados)", r.refi.principalUsed.toFixed(2)],
      ["Amortización usada (años)", r.refi.amortUsed],
      ["Meses del horizonte", r.refi.horizonUsed],
      ["Interés en el horizonte (CAD)", r.refi.interest.toFixed(2)],
      ["Efectivo inicial (si NO capitalizas)", r.refi.upfrontCash.toFixed(2)],
      ["Interés ahorrado vs Quedarse (horizonte común)", r.refi.interestSavedVsStay.toFixed(2)],
      ["Punto de equilibrio (aprox.)", r.refi.breakEvenMonths ?? "—"],

      ...(r.blend
        ? [
            ["—", "—"],
            ["Resultados — Blend & Extend"],
            ["Tasa blended (%)", r.blend.blendedRatePct.toFixed(4)],
            ["Pago mensual", r.blend.monthly.toFixed(2)],
            ["Principal usado (incl. costos capitalizados)", r.blend.principalUsed.toFixed(2)],
            ["Amortización usada (años)", r.blend.amortUsed],
            ["Meses del horizonte", r.blend.horizonUsed],
            ["Interés en el horizonte (CAD)", r.blend.interest.toFixed(2)],
            ["Efectivo inicial (si NO capitalizas)", r.blend.upfrontCash.toFixed(2)],
            ["Interés ahorrado vs Quedarse (horizonte común)", r.blend.interestSavedVsStay.toFixed(2)],
            ["Punto de equilibrio (aprox.)", r.blend.breakEvenMonths ?? "—"],
          ]
        : []),
    ];

    downloadCSV("refinanciacion_blend_estimador", rows);
  }
  function resetExample() {
    setMortType("fixed");
    setCurBalance(520_000);
    setCurRatePct(4.89);
    setRemAmortYears(22);
    setRemTermYears(2);

    setPenaltyMode("est3mo");
    setManualPenalty(0);
    setComparisonRatePct(3.39);
    setAdminFee(300);

    setNewRatePct(4.29);
    setNewAmortYears(25);
    setNewTermYears(5);
    setRefiOtherCosts(1500);
    setCapitaliseCosts(true);

    setUseBlend(true);
    setOfferRatePct(3.99);
    setBlendNewTermYears(5);
    setBlendPenaltyWaived(true);
    setBlendResetAmort(false);
    setBlendAmortYears(22);
    setBlendCosts(0);
    setBlendCapitaliseCosts(true);

    setAnalysisYears(2);
  }

  /* ------------ UI ------------ */
  return (
    <ToolShell
      title="Estimador de Refinanciación y Blend & Extend"
      subtitle="Compara quedarse vs. refinanciar vs. blend-and-extend. Revisa pagos, interés en un horizonte compartido y el punto de equilibrio aproximado."
      lang="es"
    >
      {/* Barra de acciones */}
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
          title="Exportar resultados"
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
        {/* Hipoteca actual */}
        <section className="rounded-2xl border border-brand-gold bg-white p-5 grid gap-3">
          <h3 className="font-serif text-lg text-brand-green font-bold">Hipoteca actual</h3>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-brand-blue mb-1">Tipo</label>
              <div className="flex gap-4">
                <label className="inline-flex items-center gap-2">
                  <input type="radio" name="mtype" checked={mortType === "fixed"} onChange={() => setMortType("fixed")} />
                  <span>Fija</span>
                </label>
                <label className="inline-flex items-center gap-2">
                  <input type="radio" name="mtype" checked={mortType === "variable"} onChange={() => setMortType("variable")} />
                  <span>Variable</span>
                </label>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-brand-blue mb-1">Saldo (CAD)</label>
              <input
                type="number"
                min={0}
                inputMode="decimal"
                className="w-full rounded-xl border border-brand-gold/60 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-gold"
                value={curBalance}
                onChange={(e) => setCurBalance(Number(e.target.value || 0))}
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-sm font-medium text-brand-blue mb-1">Tasa (anual %)</label>
              <input
                type="number"
                min={0}
                max={25}
                step={0.01}
                inputMode="decimal"
                className="w-full rounded-xl border border-brand-gold/60 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-gold"
                value={curRatePct}
                onChange={(e) => setCurRatePct(Number(e.target.value || 0))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-brand-blue mb-1">Amortización restante (años)</label>
              <input
                type="number"
                min={1}
                max={35}
                step={1}
                inputMode="decimal"
                className="w-full rounded-xl border border-brand-gold/60 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-gold"
                value={remAmortYears}
                onChange={(e) => setRemAmortYears(Number(e.target.value || 0))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-brand-blue mb-1">Plazo restante (años)</label>
              <input
                type="number"
                min={0.25}
                max={10}
                step={0.25}
                inputMode="decimal"
                className="w-full rounded-xl border border-brand-gold/60 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-gold"
                value={remTermYears}
                onChange={(e) => setRemTermYears(Number(e.target.value || 0))}
              />
            </div>
          </div>

          <div className="rounded-xl border border-brand-gold/40 bg-brand-beige/40 p-3">
            <div className="flex flex-wrap items-center gap-4">
              <div className="text-sm font-medium text-brand-green">Penalidad por pago anticipado</div>
              <label className="inline-flex items-center gap-2 text-sm">
                <input type="radio" name="pen" checked={penaltyMode === "none"} onChange={() => setPenaltyMode("none")} />
                <span>Ninguna</span>
              </label>
              <label className="inline-flex items-center gap-2 text-sm">
                <input type="radio" name="pen" checked={penaltyMode === "manual"} onChange={() => setPenaltyMode("manual")} />
                <span>Ingresar monto</span>
              </label>
              <label className="inline-flex items-center gap-2 text-sm">
                <input type="radio" name="pen" checked={penaltyMode === "est3mo"} onChange={() => setPenaltyMode("est3mo")} />
                <span>Estimar: 3 meses de interés</span>
              </label>
              <label className="inline-flex items-center gap-2 text-sm">
                <input type="radio" name="pen" checked={penaltyMode === "estIRD"} onChange={() => setPenaltyMode("estIRD")} />
                <span>Estimar: IRD</span>
              </label>
            </div>

            {penaltyMode === "manual" && (
              <div className="mt-2 grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-brand-blue mb-1">Monto de penalidad (CAD)</label>
                  <input
                    type="number"
                    min={0}
                    inputMode="decimal"
                    className="w-full rounded-xl border border-brand-gold/60 px-2 py-2 focus:outline-none focus:ring-2 focus:ring-brand-gold"
                    value={manualPenalty}
                    onChange={(e) => setManualPenalty(Number(e.target.value || 0))}
                  />
                </div>
              </div>
            )}

            {penaltyMode === "estIRD" && (
              <div className="mt-2 grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs text-brand-blue mb-1">Tasa de comparación (% anual)</label>
                  <input
                    type="number"
                    min={0}
                    max={25}
                    step={0.01}
                    inputMode="decimal"
                    className="w-full rounded-xl border border-brand-gold/60 px-2 py-2 focus:outline-none focus:ring-2 focus:ring-brand-gold"
                    value={comparisonRatePct}
                    onChange={(e) => setComparisonRatePct(Number(e.target.value || 0))}
                  />
                </div>
                <div className="col-span-2 text-xs text-brand-blue/70 flex items-center gap-2">
                  <FaInfoCircle /> IRD simple: Saldo × (Tasa contrato − Tasa comparación) × (Plazo restante ÷ 12).
                </div>
              </div>
            )}

            <div className="mt-2 grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-brand-blue mb-1">Fee administrativo / cancelación (CAD)</label>
                <input
                  type="number"
                  min={0}
                  inputMode="decimal"
                  className="w-full rounded-xl border border-brand-gold/60 px-2 py-2 focus:outline-none focus:ring-2 focus:ring-brand-gold"
                  value={adminFee}
                  onChange={(e) => setAdminFee(Number(e.target.value || 0))}
                />
              </div>
            </div>

            <p className="text-xs text-brand-blue/70 mt-2">
              Regla general: en tasas fijas la penalidad suele ser el mayor entre IRD y 3 meses de interés; en tasa
              variable normalmente son 3 meses de interés. Confirma con tu prestamista.
            </p>
          </div>
        </section>

        {/* Refinanciación (nueva hipoteca) */}
        <section className="rounded-2xl border border-brand-gold bg-white p-5 grid gap-3">
          <h3 className="font-serif text-lg text-brand-green font-bold">Refinanciación — Nueva hipoteca</h3>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-sm font-medium text-brand-blue mb-1">Nueva tasa (anual %)</label>
              <input
                type="number"
                min={0}
                max={25}
                step={0.01}
                inputMode="decimal"
                className="w-full rounded-xl border border-brand-gold/60 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-gold"
                value={newRatePct}
                onChange={(e) => setNewRatePct(Number(e.target.value || 0))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-brand-blue mb-1">Nueva amortización (años)</label>
              <select
                className="w-full rounded-xl border border-brand-gold/60 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-gold"
                value={newAmortYears}
                onChange={(e) => setNewAmortYears(Number(e.target.value))}
              >
                <option value={20}>20</option>
                <option value={25}>25</option>
                <option value={30}>30</option>
                <option value={35}>35</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-brand-blue mb-1">Nuevo plazo (años)</label>
              <select
                className="w-full rounded-xl border border-brand-gold/60 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-gold"
                value={newTermYears}
                onChange={(e) => setNewTermYears(Number(e.target.value))}
              >
                <option value={1}>1</option>
                <option value={2}>2</option>
                <option value={3}>3</option>
                <option value={4}>4</option>
                <option value={5}>5</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-brand-blue mb-1">Otros costos de refi (CAD)</label>
              <input
                type="number"
                min={0}
                inputMode="decimal"
                className="w-full rounded-xl border border-brand-gold/60 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-gold"
                value={refiOtherCosts}
                onChange={(e) => setRefiOtherCosts(Number(e.target.value || 0))}
              />
            </div>
            <div className="flex items-end">
              <label className="inline-flex items-center gap-2">
                <input type="checkbox" checked={capitaliseCosts} onChange={(e) => setCapitaliseCosts(e.target.checked)} />
                <span>Capitalizar penalidad y costos en la nueva hipoteca</span>
              </label>
            </div>
          </div>
        </section>

        {/* Blend & Extend */}
        <section className="rounded-2xl border border-brand-gold bg-white p-5">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-serif text-lg text-brand-green font-bold">Blend & Extend (opcional)</h3>
            <label className="inline-flex items-center gap-2">
              <input type="checkbox" checked={useBlend} onChange={(e) => setUseBlend(e.target.checked)} />
              <span>Incluir en la comparación</span>
            </label>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-sm font-medium text-brand-blue mb-1">Tasa ofrecida para extensión (anual %)</label>
              <input
                type="number"
                min={0}
                max={25}
                step={0.01}
                inputMode="decimal"
                className="w-full rounded-xl border border-brand-gold/60 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-gold"
                value={offerRatePct}
                onChange={(e) => setOfferRatePct(Number(e.target.value || 0))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-brand-blue mb-1">Extender a nuevo plazo (años)</label>
              <select
                className="w-full rounded-xl border border-brand-gold/60 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-gold"
                value={blendNewTermYears}
                onChange={(e) => setBlendNewTermYears(Number(e.target.value))}
              >
                <option value={1}>1</option>
                <option value={2}>2</option>
                <option value={3}>3</option>
                <option value={4}>4</option>
                <option value={5}>5</option>
              </select>
            </div>
            <div className="flex items-end">
              <label className="inline-flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={blendPenaltyWaived}
                  onChange={(e) => setBlendPenaltyWaived(e.target.checked)}
                />
                <span>Asumir penalidad condonada</span>
              </label>
            </div>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-brand-gold/40 bg-brand-beige/40 p-3">
              <label className="inline-flex items-center gap-2">
                <input type="checkbox" checked={blendResetAmort} onChange={(e) => setBlendResetAmort(e.target.checked)} />
                <span className="font-medium text-brand-green">Restablecer amortización</span>
              </label>
              <div className="mt-2">
                <label className="block text-xs text-brand-blue mb-1">Amortización (años, si restableces)</label>
                <input
                  type="number"
                  min={1}
                  max={35}
                  step={1}
                  inputMode="decimal"
                  className="w-full rounded-xl border border-brand-gold/60 px-2 py-2 focus:outline-none focus:ring-2 focus:ring-brand-gold"
                  value={blendAmortYears}
                  onChange={(e) => setBlendAmortYears(Number(e.target.value || 0))}
                />
              </div>
            </div>

            <div className="rounded-xl border border-brand-gold/40 bg-brand-beige/40 p-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-brand-blue mb-1">Costos del blend (CAD)</label>
                  <input
                    type="number"
                    min={0}
                    inputMode="decimal"
                    className="w-full rounded-xl border border-brand-gold/60 px-2 py-2 focus:outline-none focus:ring-2 focus:ring-brand-gold"
                    value={blendCosts}
                    onChange={(e) => setBlendCosts(Number(e.target.value || 0))}
                  />
                </div>
                <div className="flex items-end">
                  <label className="inline-flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={blendCapitaliseCosts}
                      onChange={(e) => setBlendCapitaliseCosts(e.target.checked)}
                    />
                    <span>Capitalizar costos del blend</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <p className="text-xs text-brand-blue/70 mt-2 flex items-start gap-2">
            <FaInfoCircle className="mt-0.5" />
            <span>
              La tasa “blended” aquí usa un promedio ponderado por tiempo entre tu tasa actual (plazo restante) y la tasa
              ofrecida (nuevo plazo). Los métodos reales del prestamista pueden variar. La amortización se mantiene salvo
              que elijas restablecerla.
            </span>
          </p>
        </section>

        {/* Horizonte de análisis */}
        <section className="rounded-2xl border border-brand-gold bg-white p-5">
          <h3 className="font-serif text-lg text-brand-green font-bold mb-2">Horizonte de análisis</h3>
          <label className="block text-sm font-medium text-brand-blue mb-1">Horizonte (años)</label>
          <input
            type="number"
            min={1}
            max={10}
            step={1}
            inputMode="decimal"
            className="w-full rounded-xl border border-brand-gold/60 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-gold"
            value={analysisYears}
            onChange={(e) => setAnalysisYears(Number(e.target.value || 0))}
          />
          <p className="text-xs text-brand-blue/70 mt-2">
            Para ser justos, cada escenario usa el menor entre su propio plazo y este horizonte.
          </p>
        </section>
      </form>

      {/* Resultados */}
      <div className="mt-8 grid xl:grid-cols-3 gap-6">
        {/* Quedarse */}
        <section className="rounded-2xl border border-brand-gold bg-white p-5 avoid-break">
          <h3 className="font-serif text-xl text-brand-green font-bold mb-2">Quedarse (sin cambios)</h3>
          <div className="text-sm space-y-2">
            <div className="flex justify-between">
              <span>Pago mensual</span>
              <span className="font-medium">{money(results.stay.monthly, 2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Interés durante el horizonte</span>
              <span className="font-medium">{money(results.stay.interest, 0)}</span>
            </div>
            <div className="flex justify-between">
              <span>Horizonte usado</span>
              <span className="font-medium">{results.stay.horizonUsed} meses</span>
            </div>
          </div>
        </section>

        {/* Refinanciar */}
        <section className="rounded-2xl border border-brand-gold bg-white p-5 avoid-break">
          <h3 className="font-serif text-xl text-brand-green font-bold mb-2">Refinanciación — Nueva hipoteca</h3>
          <div className="text-sm space-y-2">
            <div className="flex justify-between">
              <span>Pago mensual</span>
              <span className="font-medium">{money(results.refi.monthly, 2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Interés durante el horizonte</span>
              <span className="font-medium">{money(results.refi.interest, 0)}</span>
            </div>
            <div className="flex justify-between">
              <span>Horizonte usado</span>
              <span className="font-medium">{results.refi.horizonUsed} meses</span>
            </div>
            <div className="flex justify-between border-t pt-2 mt-2">
              <span>Efectivo inicial (si no capitalizas)</span>
              <span className="font-medium">
                {results.refi.upfrontCash ? money(results.refi.upfrontCash, 0) : "—"}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Interés ahorrado vs Quedarse (horizonte común)</span>
              <span className="font-semibold">{money(results.refi.interestSavedVsStay, 0)}</span>
            </div>
            <div className="flex justify-between">
              <span>Punto de equilibrio (aprox.)</span>
              <span className="font-medium">
                {results.refi.breakEvenMonths === null ? "—" : `${results.refi.breakEvenMonths} meses`}
              </span>
            </div>
          </div>
        </section>

        {/* Blend */}
        <section className="rounded-2xl border border-brand-gold bg-white p-5 avoid-break">
          <h3 className="font-serif text-xl text-brand-green font-bold mb-2">Blend & Extend</h3>
          {results.blend ? (
            <div className="text-sm space-y-2">
              <div className="flex justify-between">
                <span>Tasa blended</span>
                <span className="font-medium">{results.blend.blendedRatePct.toFixed(3)}%</span>
              </div>
              <div className="flex justify-between">
                <span>Pago mensual</span>
                <span className="font-medium">{money(results.blend.monthly, 2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Interés durante el horizonte</span>
                <span className="font-medium">{money(results.blend.interest, 0)}</span>
              </div>
              <div className="flex justify-between">
                <span>Horizonte usado</span>
                <span className="font-medium">{results.blend.horizonUsed} meses</span>
              </div>
              <div className="flex justify-between border-t pt-2 mt-2">
                <span>Efectivo inicial (si no capitalizas)</span>
                <span className="font-medium">
                  {results.blend.upfrontCash ? money(results.blend.upfrontCash, 0) : "—"}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Interés ahorrado vs Quedarse (horizonte común)</span>
                <span className="font-semibold">{money(results.blend.interestSavedVsStay, 0)}</span>
              </div>
              <div className="flex justify-between">
                <span>Punto de equilibrio (aprox.)</span>
                <span className="font-medium">
                  {results.blend.breakEvenMonths === null ? "—" : `${results.blend.breakEvenMonths} meses`}
                </span>
              </div>
            </div>
          ) : (
            <p className="text-sm text-brand-blue/80">Comparación con blend desactivada.</p>
          )}
        </section>
      </div>

      {/* Supuestos y notas */}
      <details className="mt-6 rounded-2xl border border-brand-gold/40 bg-brand-beige/40 p-4">
        <summary className="cursor-pointer font-semibold text-brand-green">Supuestos y notas</summary>
        <ul className="list-disc ml-5 mt-2 text-sm text-brand-blue/80 space-y-1">
          <li>Los pagos se calculan como totalmente amortizados usando tus entradas.</li>
          <li>“Quedarse” usa la amortización y plazo restantes; refinanciación y blend usan sus propios parámetros.</li>
          <li>Las penalidades son estimaciones simplificadas (3 meses de interés o IRD simple). El método del prestamista puede variar; manda tu contrato.</li>
          <li>La tasa blended usa un promedio ponderado por tiempo entre la tasa actual y la ofrecida. Los prestamistas pueden usar fórmulas distintas.</li>
          <li>El punto de equilibrio es aproximado, según interés ahorrado acumulado vs. efectivo inicial pagado.</li>
          <li>Herramienta educativa; no constituye asesoría financiera.</li>
        </ul>
      </details>

      {/* Encabezado de impresión (solo al imprimir) */}
      <div className="hidden print:block mt-6 mb-3 text-center">
        <div className="font-serif font-bold text-brand-green text-2xl">Refinanciación y Blend — Resumen</div>
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
