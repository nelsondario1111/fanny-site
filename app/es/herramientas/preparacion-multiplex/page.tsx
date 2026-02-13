"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import ToolShell from "@/components/ToolShell";
import {
  Trash2,
  PlusCircle,
  CheckCircle2,
  CalendarDays,
  ExternalLink,
  Download,
  RotateCcw,
  Printer,
  Building2,
  Calculator,
  FileText,
  ClipboardCheck,
  DollarSign,
  Info,
  Search,
} from "lucide-react";

/**
 * Lista de Preparación para Multiplex (ES-CA)
 * - Secciones con tareas, fechas límite, notas y elementos personalizados
 * - Auto-guardado (localStorage) + indicador “Guardado”
 * - Exportación CSV, Imprimir, Restablecer
 * - Móvil: tarjetas apiladas; Escritorio: tablas limpias
 * - Incluye Analizador de Operación (NOI, Cap Rate, DSCR, Cash-on-Cash) con autosave
 *
 * Solo educativo. Reglas de prestamistas/aseguradoras/municipios varían; confirma detalles.
 */

// ---------- Tipos ----------
type SectionKey =
  | "strategy"
  | "financing"
  | "financials"
  | "due_diligence"
  | "legal_compliance"
  | "renovations_capex"
  | "operations_pm"
  | "insurance_risk"
  | "closing_transition"
  | "after_close"
  | "custom";

type Task = {
  id: string;
  section: SectionKey;
  title: string;
  note?: string;
  done: boolean;
  due?: string; // AAAA-MM-DD
  linkHref?: string; // preferir rutas internas
  linkLabel?: string;
  isCustom?: boolean;
  priority?: "high" | "normal";
};

// Analizador
type Analyzer = {
  // Compra & financiamiento
  price: string;         // $
  downPct: string;       // % pago inicial
  ratePct: string;       // % anual
  amortYears: string;    // años
  closingPct: string;    // % del precio para costos de cierre
  // Ingresos
  units: string;         // unidades
  avgRent: string;       // $/mes
  otherIncomeMo: string; // $/mes (estacionamiento, laundry, storage)
  vacancyPct: string;    // %
  // Gastos
  opExAnnual: string;    // $/año (impuestos, seguros, servicios, mantenimiento, etc.)
  mgmtPct: string;       // % del EGI
  capexPct: string;      // % del EGI (reserva)
};

// ---------- Storage ----------
const LS_TASKS = "herramientas.preparacion_multiplex.v1";
const LS_ANALYZER = "herramientas.preparacion_multiplex.analizador.v1";

// ---------- Helpers ----------
const uid = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

function classNames(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

const money0 = (n: number) =>
  new Intl.NumberFormat("es-CA", {
    style: "currency",
    currency: "CAD",
    maximumFractionDigits: 0,
  }).format(Math.round(Number.isFinite(n) ? n : 0));

const pct1 = (x: number) => `${(Number.isFinite(x) ? x : 0).toFixed(1)}%`;

const toNum = (s: string | undefined) => {
  if (!s) return 0;
  const cleaned = String(s).replace(/[^\d.-]/g, "");
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : 0;
};

function pmt(monthlyRate: number, nMonths: number, principal: number) {
  if (nMonths <= 0) return 0;
  if (monthlyRate <= 0) return principal / nMonths;
  const r = monthlyRate;
  const pow = Math.pow(1 + r, -nMonths);
  return (r * principal) / (1 - pow);
}

// ---------- Metadatos de secciones ----------
const SECTION_META: Record<
  SectionKey,
  { title: string; blurb?: string; tone: "emerald" | "amber" | "sky" | "blue" | "gold" }
> = {
  strategy: {
    title: "Estrategia de adquisición",
    blurb: "Define objetivo (2–4+ unidades), ubicación, condición y plan de mantener/BRRRR.",
    tone: "gold",
  },
  financing: {
    title: "Financiamiento & requisitos del prestamista",
    blurb: "Preaprobación, expectativas de DSCR y documentación.",
    tone: "emerald",
  },
  financials: {
    title: "Finanzas de la propiedad",
    blurb: "Bajo escritura con reales & proforma: NOI, Cap Rate, DSCR, CoC.",
    tone: "sky",
  },
  due_diligence: {
    title: "Due diligence",
    blurb: "Inspecciones, ambiental, zonificación, estacionamiento, seguridad.",
    tone: "blue",
  },
  legal_compliance: {
    title: "Legal & cumplimiento",
    blurb: "Arrendamientos, reglas LTB/RTB, control de renta, legalidad de suites.",
    tone: "amber",
  },
  renovations_capex: {
    title: "Renovaciones & plan CAPEX",
    blurb: "Alcance, presupuesto, tiempos, vacancia y selección de contratistas.",
    tone: "blue",
  },
  operations_pm: {
    title: "Operación & administración",
    blurb: "Sistemas para arriendo, selección, mantenimiento y contabilidad.",
    tone: "emerald",
  },
  insurance_risk: {
    title: "Seguros & riesgo",
    blurb: "Cobertura, responsabilidad, incendio/inundación, deducibles.",
    tone: "sky",
  },
  closing_transition: {
    title: "Cierre & transición",
    blurb: "Estoppel, entrega de llaves, transferencias de servicios, rent roll.",
    tone: "gold",
  },
  after_close: {
    title: "Después del cierre",
    blurb: "Estabilización, revisiones de renta, refinanciaciones y reportes.",
    tone: "amber",
  },
  custom: {
    title: "Tareas personalizadas",
    blurb: "Agrega lo que sea único a tu operación.",
    tone: "emerald",
  },
};

const toneToText: Record<string, string> = {
  emerald: "text-emerald-700",
  amber: "text-amber-700",
  sky: "text-sky-700",
  blue: "text-blue-700",
  gold: "text-amber-700",
};

// ---------- Predeterminados ----------
function defaultTasks(): Task[] {
  return [
    // ESTRATEGIA
    {
      id: uid(),
      section: "strategy",
      title: "Aclarar criterios: # de unidades, ubicación, presupuesto, condición, objetivo de rendimiento",
      done: false,
      priority: "high",
    },
    {
      id: uid(),
      section: "strategy",
      title: "Definir modelo operativo (autogestión vs. administración externa)",
      done: false,
    },
    {
      id: uid(),
      section: "strategy",
      title: "Correr escenarios en el Analizador (reales vs. proforma)",
      done: false,
      linkHref: "#analizador",
      linkLabel: "Abrir analizador",
    },

    // FINANCIAMIENTO
    {
      id: uid(),
      section: "financing",
      title: "Obtener preaprobación (retención de tasa) y confirmar documentación de DSCR/NOI",
      done: false,
      linkHref: "/es/servicios",
      linkLabel: "Sesión de planificación",
      priority: "high",
    },
    {
      id: uid(),
      section: "financing",
      title: "Confirmar reglas DSCR y tasa de estrés usada por el prestamista",
      done: false,
      linkHref: "/en/guides/dscr-rules",
      linkLabel: "Confirmar reglas DSCR",
    },
    {
      id: uid(),
      section: "financing",
      title: "Si eres autónomo/a, prepara 2 años T1/NOA o paquete corporativo",
      done: false,
      linkHref: "/es/herramientas/preparacion-impuestos",
      linkLabel: "Kit para Autónomos",
    },

    // FINANZAS
    {
      id: uid(),
      section: "financials",
      title: "Reunir rent roll, contratos y cualquier mora/historial",
      done: false,
      priority: "high",
    },
    {
      id: uid(),
      section: "financials",
      title: "Obtener 12–24 meses de servicios/impuestos/seguros/mantenimiento",
      done: false,
    },
    {
      id: uid(),
      section: "financials",
      title: "Armar presupuesto año 1 (vacancia, gestión, reserva capex) y calcular NOI/DSCR",
      done: false,
      linkHref: "#analizador",
      linkLabel: "Usar analizador",
    },

    // DUE DILIGENCE
    {
      id: uid(),
      section: "due_diligence",
      title: "Inspección + cotizaciones especialistas (techo, cimientos, plomería, eléctrica)",
      done: false,
      priority: "high",
    },
    {
      id: uid(),
      section: "due_diligence",
      title: "Código de incendios: alarmas, separaciones, salidas; verificar # legal de unidades",
      done: false,
    },
    {
      id: uid(),
      section: "due_diligence",
      title: "Zonificación/by-law, estacionamiento y permisos/órdenes abiertos",
      done: false,
    },

    // LEGAL & CUMPLIMIENTO
    {
      id: uid(),
      section: "legal_compliance",
      title: "Revisar contratos y anexos; depósitos, aumentos de renta y estado LTB/RTB",
      done: false,
      priority: "high",
    },
    {
      id: uid(),
      section: "legal_compliance",
      title: "Verificar reglas de control de renta y restricciones de turnover",
      done: false,
    },
    {
      id: uid(),
      section: "legal_compliance",
      title: "Confirmar legalidad de suites / certificados de ocupación (si corresponde)",
      done: false,
    },

    // RENOS & CAPEX
    {
      id: uid(),
      section: "renovations_capex",
      title: "Crear plan CAPEX (techo, ventanas, HVAC) con prioridades y rangos de costo",
      done: false,
    },
    {
      id: uid(),
      section: "renovations_capex",
      title: "Obtener 2–3 cotizaciones y evaluar impacto en vacancia",
      done: false,
    },

    // OPERACIÓN
    {
      id: uid(),
      section: "operations_pm",
      title: "Configurar sistemas de PM: cobro, mantenimiento, selección de inquilinos",
      done: false,
    },
    {
      id: uid(),
      section: "operations_pm",
      title: "Contabilidad: banco/tarjeta separados y plan de cuentas",
      done: false,
    },

    // SEGUROS & RIESGO
    {
      id: uid(),
      section: "insurance_risk",
      title: "Cotizaciones de póliza landlord (edificio, RC, pérdida de renta)",
      done: false,
      priority: "high",
    },
    {
      id: uid(),
      section: "insurance_risk",
      title: "Requisitos de inspección del asegurador (barandas, detectores, etc.)",
      done: false,
    },

    // CIERRE & TRANSICIÓN
    {
      id: uid(),
      section: "closing_transition",
      title: "Abogada/o contratado; búsqueda de título, estoppel/ack de inquilinos, llaves",
      done: false,
      priority: "high",
    },
    {
      id: uid(),
      section: "closing_transition",
      title: "Transferir servicios y prorrateo de rentas/impuestos",
      done: false,
    },

    // DESPUÉS DEL CIERRE
    {
      id: uid(),
      section: "after_close",
      title: "Estabilizar operación; actualizar rentas; definir frecuencia de inspección",
      done: false,
    },
    {
      id: uid(),
      section: "after_close",
      title: "Seguimiento mensual; considerar refinanciación cuando aplique",
      done: false,
    },
  ];
}

// ---------- Pequeños componentes ----------
function SavedIndicator({ savedAt }: { savedAt: number | null }) {
  if (!savedAt) return null;
  const sec = Math.max(0, Math.round((Date.now() - savedAt) / 1000));
  const text = sec < 3 ? "Guardado ahora" : sec < 60 ? `Guardado hace ${sec} s` : "Guardado";
  return (
    <span className="inline-flex items-center gap-1 text-emerald-700 text-xs md:text-sm" role="status" aria-live="polite">
      <CheckCircle2 className="h-4 w-4" />
      {text}
    </span>
  );
}

function ProgressBar({ value, total }: { value: number; total: number }) {
  const pct = total > 0 ? Math.round((value / total) * 100) : 0;
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <div className="h-2 w-28 bg-brand-beige rounded-full overflow-hidden">
        <div className="h-2 bg-brand-green" style={{ width: `${pct}%`, transition: "width .3s ease" }} />
      </div>
      <span className="text-xs text-brand-blue/70">{pct}%</span>
    </div>
  );
}

// ---------- Tarjeta: Analizador de Operación ----------
const DEFAULT_ANALYZER: Analyzer = {
  price: "",
  downPct: "20",
  ratePct: "5.5",
  amortYears: "30",
  closingPct: "3",

  units: "3",
  avgRent: "",
  otherIncomeMo: "0",
  vacancyPct: "4",

  opExAnnual: "",
  mgmtPct: "6",
  capexPct: "5",
};

function DealAnalyzerCard({
  model,
  setModel,
}: {
  model: Analyzer;
  setModel: (next: Analyzer) => void;
}) {
  const price = toNum(model.price);
  const downPct = toNum(model.downPct) / 100;
  const ratePct = toNum(model.ratePct) / 100;
  const amortYears = Math.max(0, toNum(model.amortYears));
  const closingPct = toNum(model.closingPct) / 100;

  const units = Math.max(0, toNum(model.units));
  const avgRent = toNum(model.avgRent);
  const otherIncomeMo = toNum(model.otherIncomeMo);
  const vacancyPct = toNum(model.vacancyPct) / 100;

  const opExAnnualBase = toNum(model.opExAnnual);
  const mgmtPct = toNum(model.mgmtPct) / 100;
  const capexPct = toNum(model.capexPct) / 100;

  // Ingresos
  const gpiMonthly = units * avgRent + otherIncomeMo;
  const gpiAnnual = gpiMonthly * 12;
  const egiAnnual = gpiAnnual * (1 - vacancyPct);

  // Gastos
  const varExpenses = (mgmtPct + capexPct) * egiAnnual;
  const opExAnnualTotal = opExAnnualBase + varExpenses;

  // NOI
  const noi = Math.max(0, egiAnnual - opExAnnualTotal);

  // Financiamiento
  const loanAmount = Math.max(0, price * (1 - downPct));
  const nMonths = Math.round(amortYears * 12);
  const mRate = ratePct / 12;
  const monthlyDebt = pmt(mRate, nMonths, loanAmount);
  const annualDebtService = monthlyDebt * 12;

  // Métricas
  const capRate = price > 0 ? (noi / price) * 100 : 0;
  const dscr = annualDebtService > 0 ? noi / annualDebtService : 0;

  const cashInvested = price * downPct + price * closingPct;
  const cfBeforeTax = noi - annualDebtService;
  const coc = cashInvested > 0 ? (cfBeforeTax / cashInvested) * 100 : 0;

  const breakEvenVacancyPct =
    gpiAnnual > 0 ? Math.max(0, 100 * (1 - (opExAnnualTotal + annualDebtService) / gpiAnnual)) : 0;

  const StatusPill = ({ ok, label }: { ok: boolean; label: string }) => (
    <span
      className={classNames(
        "px-2 py-0.5 text-xs rounded-full border",
        ok ? "border-emerald-600 text-emerald-700" : "border-red-600 text-red-700"
      )}
    >
      {label}
    </span>
  );

  const Input = (p: {
    label: string;
    value: string;
    onChange: (v: string) => void;
    id?: string;
    right?: boolean;
    placeholder?: string;
    suffix?: string;
  }) => (
    <div className={classNames("flex flex-col", p.right && "items-end")}>
      <label className="text-[11px] text-brand-blue/70 mb-1" htmlFor={p.id}>
        {p.label}
      </label>
      <div className="relative w-full">
        <input
          id={p.id}
          value={p.value}
          onChange={(e) => p.onChange(e.target.value.replace(/[^\d.,-]/g, ""))}
          inputMode="decimal"
          className="border rounded-lg p-2 w-full bg-white text-right"
          placeholder={p.placeholder || "0"}
        />
        {p.suffix && (
          <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-brand-blue/70">
            {p.suffix}
          </span>
        )}
      </div>
    </div>
  );

  const dscrOk = dscr >= 1.2;
  const cocOk = coc >= 6;
  const capOk = capRate >= 5;

  return (
    <section id="analizador" className="tool-card-compact">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h3 className="font-sans text-base md:text-lg text-brand-green font-semibold flex items-center gap-2">
          <Calculator className="h-5 w-5" />
          Analizador de Operación (NOI • Cap • DSCR • CoC)
        </h3>
        <div className="text-xs text-brand-blue/70 flex items-center gap-2">
          <Info className="h-4 w-4" />
          Solo guía. Usa números de tu prestamista/broker para decisiones.
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-4 mt-4">
        {/* Izquierda: Entradas */}
        <div className="rounded-xl border border-brand-gold/50 p-3">
          <div className="font-semibold text-brand-blue mb-2 flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            Compra e ingresos
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input label="Precio de compra" value={model.price} onChange={(v) => setModel({ ...model, price: v })} id="price" />
            <Input label="Pago inicial" value={model.downPct} onChange={(v) => setModel({ ...model, downPct: v })} id="down" suffix="%" />
            <Input label="Tasa de interés" value={model.ratePct} onChange={(v) => setModel({ ...model, ratePct: v })} id="rate" suffix="%" />
            <Input label="Amortización" value={model.amortYears} onChange={(v) => setModel({ ...model, amortYears: v })} id="amort" suffix="años" />
            <Input label="Costos de cierre" value={model.closingPct} onChange={(v) => setModel({ ...model, closingPct: v })} id="closing" suffix="%" />

            <Input label="# de unidades" value={model.units} onChange={(v) => setModel({ ...model, units: v })} id="units" />
            <Input label="Renta prom./unidad (mes)" value={model.avgRent} onChange={(v) => setModel({ ...model, avgRent: v })} id="arent" />
            <Input label="Otros ingresos (mes)" value={model.otherIncomeMo} onChange={(v) => setModel({ ...model, otherIncomeMo: v })} id="oinc" />
            <Input label="Vacancia" value={model.vacancyPct} onChange={(v) => setModel({ ...model, vacancyPct: v })} id="vac" suffix="%" />
          </div>

          <div className="font-semibold text-brand-blue mt-4 mb-2 flex items-center gap-2">
            <ClipboardCheck className="h-4 w-4" />
            Gastos operativos
          </div>
          <div className="grid grid-cols-3 gap-3">
            <Input label="OpEx anual (fijos)" value={model.opExAnnual} onChange={(v) => setModel({ ...model, opExAnnual: v })} id="opex" />
            <Input label="Gestión" value={model.mgmtPct} onChange={(v) => setModel({ ...model, mgmtPct: v })} id="mgmt" suffix="%" />
            <Input label="Reserva capex" value={model.capexPct} onChange={(v) => setModel({ ...model, capexPct: v })} id="capex" suffix="%" />
          </div>
        </div>

        {/* Derecha: Resultados */}
        <div className="rounded-xl border border-brand-gold/50 p-3">
          <div className="font-semibold text-brand-blue mb-2 flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            Resultados (estimados)
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>GPI (anual): <strong>{money0(gpiAnnual || 0)}</strong></div>
            <div>EGI (tras vacancia): <strong>{money0(egiAnnual || 0)}</strong></div>
            <div>OpEx (anual, total): <strong>{money0(opExAnnualTotal || 0)}</strong></div>
            <div>NOI: <strong>{money0(noi || 0)}</strong></div>
            <div>Servicio de deuda (anual): <strong>{money0(annualDebtService || 0)}</strong></div>
            <div>Flujo de caja (pre-impuestos): <strong>{money0(cfBeforeTax || 0)}</strong></div>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-3">
            <div className="text-sm">Cap rate: <strong>{pct1(capRate)}</strong></div>
            <StatusPill ok={capOk} label={capOk ? "≥ ~5% OK" : "< ~5% Bajo"} />
            <div className="text-sm">DSCR: <strong>{Number.isFinite(dscr) ? dscr.toFixed(2) : "0.00"}</strong></div>
            <StatusPill ok={dscrOk} label={dscrOk ? "≥ ~1.20 OK" : "< ~1.20 Bajo"} />
            <div className="text-sm">Cash-on-cash: <strong>{pct1(coc)}</strong></div>
            <StatusPill ok={cocOk} label={cocOk ? "≥ ~6% OK" : "< ~6% Bajo"} />
          </div>

          <div className="text-[12px] text-brand-blue/70 mt-3">
            Ocupación de equilibrio: <strong>{pct1(100 - breakEvenVacancyPct)}</strong> • Vacancia de equilibrio: <strong>{pct1(breakEvenVacancyPct)}</strong>
          </div>

          <div className="text-[12px] text-brand-blue/70 mt-2">
            Solo indicativo; límites y cálculos reales varían por prestamista, producto, aseguradora y municipio.
          </div>

          <div className="text-sm mt-3">
            Aprende sobre DSCR:{" "}
            <Link href="/en/guides/dscr-rules" className="underline">Confirmar reglas DSCR</Link>
          </div>
        </div>
      </div>
    </section>
  );
}

// ---------- Página ----------
export default function Page() {
  const [tasks, setTasks] = useState<Task[]>(defaultTasks());
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const [filter, setFilter] = useState("");
  const [collapse, setCollapse] = useState<Record<SectionKey, boolean>>({
    strategy: false,
    financing: false,
    financials: false,
    due_diligence: false,
    legal_compliance: false,
    renovations_capex: false,
    operations_pm: false,
    insurance_risk: false,
    closing_transition: false,
    after_close: false,
    custom: false,
  });

  // Estado del analizador
  const [analyzer, setAnalyzer] = useState<Analyzer>(DEFAULT_ANALYZER);

  // Restaurar
  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_TASKS);
      if (raw) {
        const v = JSON.parse(raw);
        if (Array.isArray(v)) setTasks(v as Task[]);
      }
    } catch {}
    try {
      const rawA = localStorage.getItem(LS_ANALYZER);
      if (rawA) {
        const v = JSON.parse(rawA);
        if (v && typeof v === "object") setAnalyzer({ ...DEFAULT_ANALYZER, ...v });
      }
    } catch {}
  }, []);

  // Persistir
  useEffect(() => {
    try {
      localStorage.setItem(LS_TASKS, JSON.stringify(tasks));
      setSavedAt(Date.now());
    } catch {}
  }, [tasks]);
  useEffect(() => {
    try {
      localStorage.setItem(LS_ANALYZER, JSON.stringify(analyzer));
    } catch {}
  }, [analyzer]);

  // Derivados
  const overall = useMemo(() => {
    const filtered = filter
      ? tasks.filter((t) =>
          [t.title, t.note, t.linkLabel]
            .filter(Boolean)
            .join(" ")
            .toLowerCase()
            .includes(filter.toLowerCase())
        )
      : tasks;

    const bySection = (key: SectionKey) => filtered.filter((t) => t.section === key);
    const sections = (Object.keys(SECTION_META) as SectionKey[]).map((key) => {
      const list = bySection(key);
      const total = list.length;
      const done = list.filter((t) => t.done).length;
      return { key, list, total, done };
    });

    const total = filtered.length;
    const done = filtered.filter((t) => t.done).length;

    // Próximos 14 días
    const today = new Date();
    const upcoming = filtered
      .filter((t) => !!t.due && !t.done)
      .filter((t) => {
        const d = new Date(String(t.due) + "T00:00:00");
        const diff = Math.ceil((d.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        return diff >= 0 && diff <= 14;
      })
      .sort((a, b) => String(a.due).localeCompare(String(b.due)))
      .slice(0, 8);

    const pct = total ? Math.round((done / total) * 100) : 0;
    return { filtered, sections, total, done, pct, upcoming };
  }, [tasks, filter]);

  // Acciones
  const toggle = (id: string) =>
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  const update = (id: string, patch: Partial<Task>) =>
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...patch } : t)));
  const updateRowNote = (id: string, note: string) => update(id, { note });
  const addCustom = (section: SectionKey) =>
    setTasks((prev) => [
      ...prev,
      { id: uid(), section, title: "", note: "", done: false, isCustom: true },
    ]);
  const removeTask = (id: string) => setTasks((prev) => prev.filter((t) => t.id !== id));

  const resetAll = () => {
    const ok = confirm("¿Restablecer la lista y el analizador a los valores predeterminados? Esto borrará tu progreso guardado.");
    if (ok) {
      setTasks(defaultTasks());
      setAnalyzer(DEFAULT_ANALYZER);
      try {
        localStorage.removeItem(LS_TASKS);
        localStorage.removeItem(LS_ANALYZER);
      } catch {}
    }
  };

  const exportCSV = () => {
    const headers = ["Sección", "Tarea", "Hecho", "Vence", "Notas", "Enlace"];
    const lines = [headers.join(",")];
    tasks.forEach((t) => {
      const cells = [
        SECTION_META[t.section].title,
        t.title.replace(/"/g, '""'),
        t.done ? "Sí" : "No",
        t.due || "",
        (t.note || "").replace(/"/g, '""'),
        t.linkLabel ? `${t.linkLabel} (${t.linkHref || ""})` : "",
      ];
      lines.push(
        cells.map((c) => (c.includes(",") || c.includes('"') ? `"${c}"` : c)).join(",")
      );
    });
    const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "Lista_Preparacion_Multiplex.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const toggleAll = (val: boolean) =>
    setCollapse({
      strategy: val,
      financing: val,
      financials: val,
      due_diligence: val,
      legal_compliance: val,
      renovations_capex: val,
      operations_pm: val,
      insurance_risk: val,
      closing_transition: val,
      after_close: val,
      custom: val,
    });

  return (
    <ToolShell
      title="Lista de Preparación para Multiplex"
      subtitle="Una hoja de ruta práctica para bajo escritura, financiamiento y operación de propiedades de 2–4+ unidades — con auto-guardado, exportación y un analizador integrado."
      lang="es"
    >
      {/* Acciones de encabezado */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative">
            <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-brand-blue/60" />
            <input
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              placeholder="Filtrar tareas…"
              className="tool-field-sm min-w-[220px] pl-9"
              aria-label="Filtrar tareas"
            />
          </div>
          <button type="button" onClick={() => toggleAll(true)} className="text-sm underline text-brand-blue">
            Contraer todo
          </button>
          <span className="text-brand-blue/40">|</span>
          <button type="button" onClick={() => toggleAll(false)} className="text-sm underline text-brand-blue">
            Expandir todo
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={exportCSV}
            className="tool-btn-green"
            title="Exportar como CSV"
          >
            <Download className="h-4 w-4" />
            Exportar (CSV)
          </button>
          <button
            type="button"
            onClick={() => window.print()}
            className="tool-btn-blue"
            title="Imprimir o guardar PDF"
          >
            <Printer className="h-4 w-4" />
            Imprimir o guardar PDF
          </button>
          <button
            type="button"
            onClick={resetAll}
            className="tool-btn-gold"
            title="Restablecer valores"
          >
            <RotateCcw className="h-4 w-4" />
            Restablecer valores
          </button>
        </div>
      </div>

      {/* Estado / Snapshot */}
      <section className="tool-card-compact mb-6">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          <SummaryCard icon={<Calculator className="h-5 w-5" />} label="Analizador" value="Abrir herramienta" href="#analizador" />
          <SummaryCard icon={<FileText className="h-5 w-5" />} label="Docs & rent roll" value="Reúne reales" />
          <SummaryCard icon={<Building2 className="h-5 w-5" />} label="Financiamiento" value="Confirma reglas DSCR" href="/en/guides/dscr-rules" />
          <div className="rounded-xl border border-brand-gold/50 bg-brand-beige/40 p-3 md:p-4 flex items-center justify-between">
            <div>
              <div className="text-xs md:text-sm text-brand-blue/80">Lista</div>
              <div className="mt-2"><ProgressBar value={overall.done} total={overall.total} /></div>
              <div className="text-xs text-brand-blue/70 mt-1">{overall.done}/{overall.total} completadas</div>
            </div>
            <SavedIndicator savedAt={savedAt} />
          </div>
        </div>

        {overall.upcoming.length > 0 && (
          <div className="mt-4">
            <div className="text-sm font-semibold text-brand-green mb-1 flex items-center gap-2">
              <CalendarDays className="h-4 w-4" />
              Vence en los próximos 14 días
            </div>
            <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {overall.upcoming.map((t) => (
                <li key={t.id} className="rounded-lg border border-brand-gold/50 bg-brand-beige/40 px-3 py-2 text-sm">
                  <div className="font-medium">{t.title}</div>
                  <div className="text-brand-blue/70 flex items-center gap-2 text-xs mt-1">
                    <CalendarDays className="h-3 w-3" />
                    {t.due}
                    <span className="mx-1 text-brand-blue/30">•</span>
                    <span>{SECTION_META[t.section].title}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>

      {/* Analizador */}
      <DealAnalyzerCard model={analyzer} setModel={setAnalyzer} />

      {/* Secciones */}
      <form className="grid grid-cols-1 gap-6 mt-6">
        {(Object.keys(SECTION_META) as SectionKey[]).map((key) => {
          const meta = SECTION_META[key];
          const list = overall.sections.find((s) => s.key === key)!;
          const isCollapsed = collapse[key];

          return (
            <section key={key} className="tool-card-compact">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className={classNames("font-sans text-base md:text-lg font-semibold", toneToText[meta.tone])}>
                    {meta.title}
                  </h3>
                  {meta.blurb && <p className="text-sm text-brand-blue/80 mt-1">{meta.blurb}</p>}
                </div>
                <div className="flex items-center gap-3">
                  <ProgressBar value={list.done} total={list.total} />
                  {key !== "custom" && (
                    <button
                      type="button"
                      onClick={() => addCustom(key)}
                      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-brand-gold/70 text-brand-blue hover:bg-brand-beige/60"
                      title="Agregar una tarea personalizada a esta sección"
                    >
                      <PlusCircle className="h-4 w-4" />
                      Agregar tarea
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setCollapse((c) => ({ ...c, [key]: !c[key] }))}
                    className="text-sm underline text-brand-blue"
                    aria-expanded={!isCollapsed}
                    aria-controls={`section-${key}`}
                  >
                    {isCollapsed ? "Expandir" : "Contraer"}
                  </button>
                </div>
              </div>

              {/* Lista de tareas */}
              <div id={`section-${key}`} className={classNames(isCollapsed && "hidden", "mt-4")}>
                {/* Tabla escritorio */}
                <div className="hidden md:block">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-brand-beige/40 text-left">
                        <th className="p-2 rounded-l-xl w-[44px]">Hecho</th>
                        <th className="p-2">Tarea</th>
                        <th className="p-2 w-[130px]">Fecha límite</th>
                        <th className="p-2 w-[36%]">Notas</th>
                        <th className="p-2 rounded-r-xl w-[44px]"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {list.list.map((t) => (
                        <tr key={t.id} className="border-b border-brand-green/20">
                          <td className="p-2 align-top">
                            <input
                              id={`chk-${t.id}`}
                              type="checkbox"
                              checked={t.done}
                              onChange={() => toggle(t.id)}
                              className="h-4 w-4 accent-brand-green"
                              aria-label={`Marcar "${t.title}" como hecho`}
                            />
                          </td>
                          <td className="p-2 align-top">
                            <label htmlFor={`chk-${t.id}`} className="font-medium cursor-pointer">
                              {t.title}
                            </label>
                            {t.linkHref && (
                              <>
                                {" "}
                                <Link
                                  href={t.linkHref}
                                  className="inline-flex items-center gap-1 underline text-brand-blue ml-1"
                                  title={t.linkLabel || "Abrir enlace"}
                                >
                                  {t.linkLabel || "Ver más"}
                                  <ExternalLink className="h-3.5 w-3.5" />
                                </Link>
                              </>
                            )}
                          </td>
                          <td className="p-2 align-top">
                            <input
                              type="date"
                              value={t.due || ""}
                              onChange={(e) => update(t.id, { due: e.target.value })}
                              className="border rounded-lg p-2 w-full bg-white"
                              aria-label={`Establecer fecha límite para ${t.title}`}
                            />
                          </td>
                          <td className="p-2 align-top">
                            <input
                              value={t.note || ""}
                              onChange={(e) => updateRowNote(t.id, e.target.value)}
                              className="w-full border rounded-lg p-2"
                              placeholder="Agrega una nota, contacto o enlace…"
                              aria-label={`Notas para ${t.title}`}
                            />
                          </td>
                          <td className="p-2 align-top text-right">
                            {(t.isCustom || key === "custom") && (
                              <button
                                type="button"
                                onClick={() => removeTask(t.id)}
                                title="Eliminar tarea"
                                aria-label="Eliminar tarea"
                                className="inline-flex items-center justify-center p-1.5 rounded-md text-red-600 hover:bg-red-50"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Tarjetas móviles */}
                <div className="md:hidden grid gap-2">
                  {list.list.map((t) => (
                    <div key={t.id} className="relative rounded-xl border border-brand-gold/50 bg-white p-3">
                      {(t.isCustom || key === "custom") && (
                        <button
                          type="button"
                          onClick={() => removeTask(t.id)}
                          title="Eliminar tarea"
                          aria-label="Eliminar tarea"
                          className="absolute right-2 top-2 p-1 rounded-md text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}

                      <div className="flex items-start gap-3">
                        <input
                          id={`mchk-${t.id}`}
                          type="checkbox"
                          checked={t.done}
                          onChange={() => toggle(t.id)}
                          className="mt-1 h-4 w-4 accent-brand-green"
                          aria-label={`Marcar "${t.title}" como hecho`}
                        />
                        <div className="flex-1">
                          <label htmlFor={`mchk-${t.id}`} className="font-medium">
                            {t.title}
                          </label>
                          {t.linkHref && (
                            <div className="mt-1">
                              <Link
                                href={t.linkHref}
                                className="inline-flex items-center gap-1 underline text-brand-blue"
                                title={t.linkLabel || "Abrir enlace"}
                              >
                                {t.linkLabel || "Ver más"}
                                <ExternalLink className="h-3.5 w-3.5" />
                              </Link>
                            </div>
                          )}
                          <div className="grid grid-cols-2 gap-2 mt-2">
                            <div>
                              <div className="text-[11px] text-brand-blue/70">Vence</div>
                              <input
                                type="date"
                                value={t.due || ""}
                                onChange={(e) => update(t.id, { due: e.target.value })}
                                className="border rounded-lg p-2 w-full bg-white"
                              />
                            </div>
                            <div className="col-span-2">
                              <div className="text-[11px] text-brand-blue/70">Notas</div>
                              <input
                                value={t.note || ""}
                                onChange={(e) => updateRowNote(t.id, e.target.value)}
                                className="w-full border rounded-lg p-2"
                                placeholder="Agrega una nota, contacto o enlace…"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Botón para sección Personalizada */}
                {key === "custom" && (
                  <div className="mt-3">
                    <button
                      type="button"
                      onClick={() => addCustom("custom")}
                      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-brand-gold/70 text-brand-blue hover:bg-brand-beige/60"
                    >
                      <PlusCircle className="h-4 w-4" />
                      Agregar tarea personalizada
                    </button>
                  </div>
                )}
              </div>
            </section>
          );
        })}
      </form>

      {/* Herramientas y servicios útiles */}
      <section className="tool-card-compact mt-6">
        <h4 className="font-sans text-base md:text-lg text-brand-green font-semibold mb-2">
          Herramientas y servicios útiles
        </h4>
        <ul className="list-disc ml-5 text-sm space-y-1">
          <li>
            Corre escenarios:{" "}
            <Link href="#analizador" className="underline">
              Analizador de Operación
            </Link>{" "}
            •{" "}
            <Link href="/en/guides/dscr-rules" className="underline">
              Confirmar reglas DSCR
            </Link>
          </li>
          <li>
            ¿Autónomo/a o ingresos complejos?{" "}
            <Link href="/es/herramientas/preparacion-impuestos" className="underline">
              Kit para Autónomos
            </Link>
          </li>
          <li>
            Trabaja con nosotros:{" "}
            <Link href="/es/cuenta" className="underline">
              Portal de clientes
            </Link>{" "}
            •{" "}
            <Link href="/es/servicios" className="underline">
              Sesión de planificación
            </Link>
          </li>
        </ul>
        <p className="text-xs text-brand-blue/70 mt-3">
          Esta página es educativa y general. Las políticas y reglas varían por prestamista, aseguradora y municipio, y pueden cambiar. Verifica detalles con fuentes oficiales y tus asesores profesionales.
        </p>
      </section>

      {/* Estilos de impresión */}
      <style jsx global>{`
        @media print {
          .print\\:hidden { display: none !important; }
          main { background: white !important; }
          header, section { break-inside: avoid; page-break-inside: avoid; }
          table { page-break-inside: auto; }
          tr { page-break-inside: avoid; page-break-after: auto; }
        }
      `}</style>
    </ToolShell>
  );
}

// ---------- Hijo pequeño ----------
function SummaryCard({ icon, label, value, href }: { icon: ReactNode; label: string; value: string; href?: string }) {
  const content = (
    <div className="rounded-xl border border-brand-gold/50 bg-white p-3 md:p-4 h-full">
      <div className="text-xs md:text-sm text-brand-blue/80 flex items-center gap-2">
        {icon}
        {label}
      </div>
      <div className="text-xl md:text-2xl font-bold text-brand-green mt-1">{value}</div>
    </div>
  );
  return href ? <Link href={href} className="block">{content}</Link> : content;
}
