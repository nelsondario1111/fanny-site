"use client";

import { useEffect, useMemo, useState } from "react";
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
  ShieldCheck,
  CreditCard,
  Building2,
  Search,
} from "lucide-react";

/**
 * Lista de Preparación Hipotecaria (ES-CA)
 * - Secciones con tareas, fechas límite, notas y elementos personalizados
 * - Auto-guardado (localStorage) + indicador “Guardado”
 * - Exportación CSV, Imprimir, Restablecer
 * - Móvil: tarjetas apiladas; Escritorio: tablas limpias
 *
 * Solo educativo. Las políticas de los prestamistas varían; confirma con tu broker/prestamista.
 */

// ---------- Tipos ----------
type SectionKey =
  | "credit_score"
  | "income_employment"
  | "down_payment_closing"
  | "documents"
  | "timeline_steps"
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

// ---------- Storage ----------
const LS_KEY = "herramientas.preparacion_hipoteca.v1";

// ---------- Helpers ----------
const uid = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

function classNames(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

// ---------- Metadatos de secciones ----------
const SECTION_META: Record<
  SectionKey,
  { title: string; blurb?: string; tone: "emerald" | "amber" | "sky" | "blue" | "gold" }
> = {
  credit_score: {
    title: "Crédito & score",
    blurb: "Apunta a 12 meses limpios, baja utilización y score verificado.",
    tone: "emerald",
  },
  income_employment: {
    title: "Ingresos & empleo",
    blurb: "Reúne comprobantes de ingresos estables y empleo/actividad empresarial.",
    tone: "sky",
  },
  down_payment_closing: {
    title: "Pago inicial & costos de cierre",
    blurb: "Documenta el origen de fondos y mantén historial de 90–120 días.",
    tone: "gold",
  },
  documents: {
    title: "Documentos básicos",
    blurb: "ID, bancarios, historial de vivienda y otros requeridos por prestamistas.",
    tone: "blue",
  },
  timeline_steps: {
    title: "Cronograma & próximos pasos",
    blurb: "Preaprobación, retención de tasa y tu equipo profesional.",
    tone: "amber",
  },
  custom: {
    title: "Tareas personalizadas",
    blurb: "Agrega lo que sea único a tu situación.",
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
    // CRÉDITO & SCORE
    { id: uid(), section: "credit_score", title: "Revisar score de crédito actual (consulta suave dentro de 60 días)", done: false, priority: "high" },
    { id: uid(), section: "credit_score", title: "Sin pagos atrasados en los últimos 12 meses", done: false },
    { id: uid(), section: "credit_score", title: "Utilización de crédito menor a ~30% (pagar saldos altos)", done: false, linkHref: "/es/servicios", linkLabel: "Asesoría para construir crédito" },
    { id: uid(), section: "credit_score", title: "Disputar/resolver errores en tu reporte", done: false },

    // INGRESOS & EMPLEO
    { id: uid(), section: "income_employment", title: "Dos recibos de pago recientes (empleado/a)", done: false, priority: "high" },
    { id: uid(), section: "income_employment", title: "T4 de los últimos 2 años (empleado/a)", done: false },
    { id: uid(), section: "income_employment", title: "Carta laboral (cargo, fecha de inicio, salario/por hora)", done: false, priority: "high" },
    { id: uid(), section: "income_employment", title: "Autónomos: T1 & NOA de 2 años; T2125 (si aplica)", done: false, linkHref: "/es/herramientas/preparacion-impuestos", linkLabel: "Kit para Autónomos" },

    // PAGO INICIAL & CIERRE
    { id: uid(), section: "down_payment_closing", title: "Pago inicial ahorrado (origen documentado)", done: false, priority: "high" },
    { id: uid(), section: "down_payment_closing", title: "Historial de cuentas 90–120 días para fondos de pago inicial", done: false },
    { id: uid(), section: "down_payment_closing", title: "Carta de regalo preparada (si aplica)", done: false },
    { id: uid(), section: "down_payment_closing", title: "Fondo para costos de cierre (~1.5–4% del precio)", done: false },
    { id: uid(), section: "down_payment_closing", title: "Considerar RRSP Home Buyers’ Plan (si elegible)", done: false },

    // DOCUMENTOS
    { id: uid(), section: "documents", title: "ID con foto vigente (pasaporte/licencia de conducir)", done: false },
    { id: uid(), section: "documents", title: "Comprobante de domicilio (boleta de servicios reciente, etc.)", done: false },
    { id: uid(), section: "documents", title: "Cheque anulado o formulario PAD (para pagos hipotecarios)", done: false },
    { id: uid(), section: "documents", title: "Historial de arriendo o estado de cuenta hipotecaria actual", done: false },
    { id: uid(), section: "documents", title: "Convenio de separación / soportes (si aplica)", done: false },

    // CRONOGRAMA & PASOS
    { id: uid(), section: "timeline_steps", title: "Completar preaprobación hipotecaria", done: false, priority: "high" },
    { id: uid(), section: "timeline_steps", title: "Entender la retención de tasa (típ. 90–120 días)", done: false },
    { id: uid(), section: "timeline_steps", title: "Agente inmobiliario y abogada/o de bienes raíces listos", done: false },
    { id: uid(), section: "timeline_steps", title: "Definir pago mensual cómodo y correr un escenario de prueba de esfuerzo", done: false, linkHref: "/es/herramientas/prueba-esfuerzo", linkLabel: "Asequibilidad y Prueba de Esfuerzo" },
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
    <div className="flex items-center gap-2">
      <div className="h-2 w-28 bg-brand-beige rounded-full overflow-hidden">
        <div className="h-2 bg-brand-green" style={{ width: `${pct}%`, transition: "width .3s ease" }} />
      </div>
      <span className="text-xs text-brand-blue/70">{pct}%</span>
    </div>
  );
}

// ---------- Página ----------
export default function Page() {
  const [tasks, setTasks] = useState<Task[]>(defaultTasks());
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const [filter, setFilter] = useState("");
  const [collapse, setCollapse] = useState<Record<SectionKey, boolean>>({
    credit_score: false,
    income_employment: false,
    down_payment_closing: false,
    documents: false,
    timeline_steps: false,
    custom: false,
  });

  // Restaurar
  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) {
        const v = JSON.parse(raw);
        if (Array.isArray(v)) setTasks(v as Task[]);
      }
    } catch {}
  }, []);

  // Persistir
  useEffect(() => {
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(tasks));
      setSavedAt(Date.now());
    } catch {}
  }, [tasks]);

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
    const pct = total ? Math.round((done / total) * 100) : 0;

    // Próximas 2 semanas
    const today = new Date();
    const upcoming = filtered
      .filter((t) => !!t.due && !t.done)
      .filter((t) => {
        const d = new Date(t.due! + "T00:00:00");
        const diff = Math.ceil((d.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        return diff >= 0 && diff <= 14;
      })
      .sort((a, b) => String(a.due).localeCompare(String(b.due)))
      .slice(0, 8);

    return { filtered, sections, total, done, pct, upcoming };
  }, [tasks, filter]);

  // Acciones
  const toggle = (id: string) =>
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  const update = (id: string, patch: Partial<Task>) =>
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...patch } : t)));
  const addCustom = (section: SectionKey) =>
    setTasks((prev) => [
      ...prev,
      { id: uid(), section, title: "", note: "", done: false, isCustom: true },
    ]);
  const removeTask = (id: string) => setTasks((prev) => prev.filter((t) => t.id !== id));

  const resetAll = () => {
    const ok = confirm("¿Restablecer la lista al modelo predeterminado? Esto borrará tu progreso guardado.");
    if (ok) {
      setTasks(defaultTasks());
      try {
        localStorage.removeItem(LS_KEY);
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
    a.href = url; a.download = "Lista_Preparacion_Hipotecaria.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  const toggleAll = (val: boolean) =>
    setCollapse({
      credit_score: val,
      income_employment: val,
      down_payment_closing: val,
      documents: val,
      timeline_steps: val,
      custom: val,
    });

  // ---------- Render ----------
  return (
    <ToolShell
      title="Lista de Preparación Hipotecaria"
      subtitle="Una lista práctica y lista para el prestamista para preparar tu crédito, documentos y pago inicial — con auto-guardado y exportación."
      lang="es"
    >
      {/* Acciones de encabezado */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-brand-blue/60" />
            <input
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              placeholder="Filtrar tareas…"
              className="pl-9 pr-3 py-2 rounded-full border-2 border-brand-gold/60 bg-white min-w-[220px]"
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
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border-2 border-brand-green text-brand-green hover:bg-brand-green hover:text-white transition"
            title="Exportar como CSV"
          >
            <Download className="h-4 w-4" />
            Exportar CSV
          </button>
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border-2 border-brand-blue text-brand-blue hover:bg-brand-blue hover:text-white transition"
            title="Imprimir"
          >
            <Printer className="h-4 w-4" />
            Imprimir
          </button>
          <button
            type="button"
            onClick={resetAll}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border-2 border-brand-gold text-brand-gold hover:bg-brand-gold hover:text-brand-green transition"
            title="Restablecer"
          >
            <RotateCcw className="h-4 w-4" />
            Restablecer
          </button>
        </div>
      </div>

      {/* Estado / Snapshot */}
      <section className="rounded-2xl border border-brand-gold bg-white p-4 md:p-5 mb-6">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          <SummaryCard icon={<ShieldCheck className="h-5 w-5" />} label="Progreso general" value={`${overall.pct}%`} />
          <SummaryCard icon={<CreditCard className="h-5 w-5" />} label="Enfoque de crédito" value="12 meses limpios • &lt;30% util." />
          <SummaryCard icon={<Building2 className="h-5 w-5" />} label="Preaprobación" value="Empieza temprano" href="/es/servicios" />
          <div className="rounded-xl border border-brand-gold/50 bg-brand-beige/40 p-3 md:p-4 flex items-center justify-between">
            <div>
              <div className="text-xs md:text-sm text-brand-blue/80">Lista de verificación</div>
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

      {/* Secciones */}
      <form className="grid grid-cols-1 gap-6">
        {(Object.keys(SECTION_META) as SectionKey[]).map((key) => {
          const meta = SECTION_META[key];
          const list = overall.sections.find((s) => s.key === key)!;
          const isCollapsed = collapse[key];

          return (
            <section key={key} className="rounded-2xl border border-brand-gold bg-white p-4 md:p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className={classNames("font-serif text-base md:text-lg font-bold", toneToText[meta.tone])}>
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
      <section className="rounded-2xl border border-brand-gold bg-white p-4 md:p-5 mt-6">
        <h4 className="font-serif text-base md:text-lg text-brand-green font-bold mb-2">
          Herramientas y servicios útiles
        </h4>
        <ul className="list-disc ml-5 text-sm space-y-1">
          <li>
            Revisa asequibilidad y pagos:{" "}
            <Link href="/es/herramientas/prueba-esfuerzo" className="underline">
              Asequibilidad & Prueba de Esfuerzo
            </Link>{" "}
            •{" "}
            <Link href="/es/herramientas/calculadora-hipotecaria" className="underline">
              Calculadora de Pagos Hipotecarios
            </Link>
          </li>
          <li>
            Construye crédito y mejora la utilización:{" "}
            <Link href="/es/servicios" className="underline">
              Asesoría para construir crédito
            </Link>
          </li>
          <li>
            Flujo de caja y ahorro:{" "}
            <Link href="/es/herramientas/calculadora-presupuesto" className="underline">
              Calculadora de Presupuesto
            </Link>{" "}
            •{" "}
            <Link href="/es/herramientas/presupuesto-flujo" className="underline">
              Flujo de Caja
            </Link>
          </li>
          <li>
            Sube documentos con seguridad y trabaja con nosotros:{" "}
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
          Esta lista es educativa y general. Las políticas de suscripción varían por prestamista y pueden cambiar. Confirma los detalles con tu broker/prestamista.
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

  // Útil para mantener ordenados los handlers
  function updateRowNote(id: string, note: string) {
    update(id, { note });
  }
}

// ---------- Hijo pequeño ----------
function SummaryCard({ icon, label, value, href }: { icon: React.ReactNode; label: string; value: string; href?: string }) {
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
