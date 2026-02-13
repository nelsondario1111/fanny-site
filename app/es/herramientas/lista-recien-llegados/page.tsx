"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import ToolShell from "@/components/ToolShell";
import {
  CheckCircle2,
  PlusCircle,
  Trash2,
  CalendarDays,
  ExternalLink,
  Search,
  Download,
  RotateCcw,
  Printer,
} from "lucide-react";

/**
 * Checklist para Recién Llegados (ES-CA)
 * - Hoja de ruta práctica, con foco financiero, para tus primeros meses en Canadá
 * - Secciones, progreso, fechas límite, notas y tareas personalizadas
 * - Móvil: tarjetas apiladas; Escritorio: tablas limpias
 * - Auto-guardado (localStorage) + indicador “Guardado”
 * - Exportar CSV, Imprimir, Restablecer
 */

// ---------- Tipos ----------
type SectionKey =
  | "before_arrival"
  | "first_72h"
  | "first_2w"
  | "first_month"
  | "months_3_6"
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
const LS_KEY = "herramientas.lista_recien_llegados.v1";

// ---------- Helpers ----------
const uid = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

function classNames(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

// ---------- Predeterminados (enfocados en lo financiero) ----------
const DEFAULT_TASKS: Task[] = [
  // ANTES DE LLEGAR
  {
    id: uid(),
    section: "before_arrival",
    title:
      "Digitaliza documentos clave (pasaportes, títulos, cartas de referencia, vacunas) y súbelos a una carpeta segura en la nube",
    done: false,
  },
  {
    id: uid(),
    section: "before_arrival",
    title: "Estima gastos del primer mes y un colchón de emergencia",
    linkHref: "/es/herramientas/presupuesto-flujo",
    linkLabel: "Calculadora de Presupuesto",
    done: false,
    priority: "high",
  },
  {
    id: uid(),
    section: "before_arrival",
    title:
      "Reserva alojamiento temporal por 2–4 semanas (si puedes, con cancelación flexible)",
    done: false,
  },
  {
    id: uid(),
    section: "before_arrival",
    title:
      'Solicita historial de conducción/“driving abstract” de tu país (ayuda con seguro y canje de licencia)',
    done: false,
  },

  // PRIMERAS 72 HORAS
  {
    id: uid(),
    section: "first_72h",
    title:
      "Consigue una SIM/plan de celular canadiense y comparte tu número local",
    done: false,
  },
  {
    id: uid(),
    section: "first_72h",
    title: "Solicita tu Número de Seguro Social (SIN) en Service Canada",
    done: false,
    priority: "high",
  },
  {
    id: uid(),
    section: "first_72h",
    title:
      "Traza rutas desde tu alojamiento a Service Canada, banco y barrios de interés",
    done: false,
  },

  // PRIMERAS 2 SEMANAS
  {
    id: uid(),
    section: "first_2w",
    title:
      "Abre una cuenta corriente (chequing) y activa Interac e-Transfer",
    done: false,
    priority: "high",
  },
  {
    id: uid(),
    section: "first_2w",
    title:
      "Inicia tu historial de crédito en Canadá (tarjeta asegurada o límite bajo; configura pago automático)",
    done: false,
    linkHref: "/es/servicios",
    linkLabel: "Asesoría para construir crédito",
  },
  {
    id: uid(),
    section: "first_2w",
    title:
      "Solicita cobertura de salud provincial (tarjeta sanitaria) y elige médico/clinica",
    done: false,
  },
  {
    id: uid(),
    section: "first_2w",
    title:
      "Crea tu cuenta en CRA “Mi Cuenta” (impuestos y beneficios)",
    done: false,
  },

  // PRIMER MES
  {
    id: uid(),
    section: "first_month",
    title:
      "Asegura vivienda a largo plazo y contrata seguro de inquilino + servicios públicos",
    done: false,
  },
  {
    id: uid(),
    section: "first_month",
    title:
      "Crea un plan mensual realista (Necesidades / Deseos / Ahorros y Deuda) y automatiza pagos",
    linkHref: "/es/herramientas/presupuesto-flujo",
    linkLabel: "Calculadora de Presupuesto",
    done: false,
  },
  {
    id: uid(),
    section: "first_month",
    title:
      "Cambia o solicita tu licencia de conducir (lleva tu driving abstract si lo tienes)",
    done: false,
  },
  {
    id: uid(),
    section: "first_month",
    title:
      "Inscribe a tus hijas/os en escuela/guardería y actualiza vacunas (si aplica)",
    done: false,
  },

  // 3–6 MESES
  {
    id: uid(),
    section: "months_3_6",
    title:
      "Construye un fondo de emergencia (meta 1–3 meses de gastos esenciales)",
    done: false,
    linkHref: "/es/herramientas/seguimiento-patrimonio-neto",
    linkLabel: "Seguimiento de Patrimonio Neto",
  },
  {
    id: uid(),
    section: "months_3_6",
    title:
      "Evalúa TFSA/RRSP (elegibilidad y aportes) y configura contribuciones",
    done: false,
    linkHref: "/es/servicios",
    linkLabel: "Sesión de planificación financiera",
  },
  {
    id: uid(),
    section: "months_3_6",
    title:
      "Prepara tu primera declaración de impuestos en Canadá (guarda recibos de pago; confirma créditos/beneficios)",
    done: false,
    linkHref: "/es/herramientas/preparacion-impuestos",
    linkLabel: "Kit de Impuestos",
  },
  {
    id: uid(),
    section: "months_3_6",
    title:
      "Amplía referencias y red canadiense (voluntariado, grupos profesionales)",
    done: false,
  },
];

// ---------- Metadatos de sección ----------
const SECTION_META: Record<
  SectionKey,
  { title: string; blurb?: string; tone: "emerald" | "amber" | "sky" | "blue" | "gold" }
> = {
  before_arrival: {
    title: "Antes de llegar",
    blurb: "Deja todo listo para que tus primeras semanas sean enfocadas y tranquilas.",
    tone: "amber",
  },
  first_72h: {
    title: "Primeras 72 horas",
    blurb: "Consigue identificaciones esenciales y conectividad rápido.",
    tone: "emerald",
  },
  first_2w: {
    title: "Primeras 2 semanas",
    blurb: "Banca, cobertura de salud y un perfil de crédito inicial.",
    tone: "sky",
  },
  first_month: {
    title: "Primer mes",
    blurb: "Estabiliza vivienda, cuentas y tu plan mensual.",
    tone: "blue",
  },
  months_3_6: {
    title: "3–6 meses",
    blurb: "Construye colchones, optimiza impuestos y echa raíces.",
    tone: "gold",
  },
  custom: {
    title: "Tus tareas personalizadas",
    blurb: "Agrega lo que sea único a tu situación o metas.",
    tone: "emerald",
  },
};

// ---------- Pequeños componentes ----------
function SavedIndicator({ savedAt }: { savedAt: number | null }) {
  if (!savedAt) return null;
  const sec = Math.max(0, Math.round((Date.now() - savedAt) / 1000));
  const text = sec < 3 ? "Guardado ahora" : sec < 60 ? `Guardado hace ${sec}s` : "Guardado";
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
        <div
          className="h-2 bg-brand-green"
          style={{ width: `${pct}%`, transition: "width .3s ease" }}
        />
      </div>
      <span className="text-xs text-brand-blue/70">{pct}%</span>
    </div>
  );
}

export default function Page() {
  const [tasks, setTasks] = useState<Task[]>(DEFAULT_TASKS);
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const [filter, setFilter] = useState("");
  const [collapse, setCollapse] = useState<Record<SectionKey, boolean>>({
    before_arrival: false,
    first_72h: false,
    first_2w: false,
    first_month: false,
    months_3_6: false,
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

  // Guardar
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

    // Próximos 7 días
    const today = new Date();
    const upcoming = filtered
      .filter((t) => !!t.due && !t.done)
      .filter((t) => {
        const d = new Date(t.due! + "T00:00:00");
        const diff = Math.ceil((d.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        return diff >= 0 && diff <= 7;
      })
      .sort((a, b) => String(a.due).localeCompare(String(b.due)))
      .slice(0, 6);

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
      {
        id: uid(),
        section,
        title: "",
        note: "",
        done: false,
        isCustom: true,
      },
    ]);
  const removeTask = (id: string) => setTasks((prev) => prev.filter((t) => t.id !== id));

  const resetAll = () => {
    const ok = confirm("¿Restablecer el checklist al modelo predeterminado? Esto borrará tu progreso guardado.");
    if (ok) {
      setTasks(DEFAULT_TASKS);
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
    a.href = url;
    a.download = "Checklist_Recien_Llegados.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const toggleAll = (val: boolean) =>
    setCollapse({
      before_arrival: val,
      first_72h: val,
      first_2w: val,
      first_month: val,
      months_3_6: val,
      custom: val,
    });

  // Tokens de color
  const toneToText: Record<string, string> = {
    emerald: "text-emerald-700",
    amber: "text-amber-700",
    sky: "text-sky-700",
    blue: "text-blue-700",
    gold: "text-amber-700",
  };

  return (
    <ToolShell
      title="Checklist para Recién Llegados"
      subtitle="Una hoja de ruta práctica y con foco financiero para tus primeros meses en Canadá — con fechas, notas y auto-guardado."
      lang="es"
    >
      {/* Acciones superiores */}
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
          <button
            type="button"
            onClick={() => toggleAll(true)}
            className="text-sm underline text-brand-blue"
          >
            Contraer todo
          </button>
          <span className="text-brand-blue/40">|</span>
          <button
            type="button"
            onClick={() => toggleAll(false)}
            className="text-sm underline text-brand-blue"
          >
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

      {/* Resumen / Próximos vencimientos */}
      <section className="tool-card-compact mb-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="text-sm text-brand-blue/80">Progreso general</span>
            <ProgressBar value={overall.done} total={overall.total} />
            <span className="text-sm text-brand-blue/70">
              {overall.done}/{overall.total} completadas
            </span>
          </div>
          <SavedIndicator savedAt={savedAt} />
        </div>
        {overall.upcoming.length > 0 && (
          <div className="mt-4">
            <div className="text-sm font-semibold text-brand-green mb-1 flex items-center gap-2">
              <CalendarDays className="h-4 w-4" />
              Vence en los próximos 7 días
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
            <section
              key={key}
              className="tool-card-compact"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3
                    className={classNames(
                      "font-sans text-base md:text-lg font-bold",
                      toneToText[meta.tone]
                    )}
                  >
                    {meta.title}
                  </h3>
                  {meta.blurb && (
                    <p className="text-sm text-brand-blue/80 mt-1">{meta.blurb}</p>
                  )}
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
                {/* Escritorio */}
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
                              onChange={(e) => update(t.id, { note: e.target.value })}
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

                {/* Móvil */}
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
                        <div>
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
                                onChange={(e) => update(t.id, { note: e.target.value })}
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
            Plan mensual:{" "}
            <Link href="/es/herramientas/presupuesto-flujo" className="underline">
              Flujo de Caja y Presupuesto
            </Link>
          </li>
          <li>
            Seguimiento de finanzas:{" "}
            <Link href="/es/herramientas/seguimiento-patrimonio-neto" className="underline">
              Seguimiento de Patrimonio Neto
            </Link>{" "}
            •{" "}
            <Link href="/es/herramientas/presupuesto-flujo" className="underline">
              Flujo de Caja
            </Link>
          </li>
          <li>
            Optimiza beneficios e impuestos:{" "}
            <Link href="/es/herramientas/preparacion-impuestos" className="underline">
              Kit de Impuestos
            </Link>{" "}
            •{" "}
            <Link href="/es/servicios" className="underline">
              Sesión de planificación
            </Link>
          </li>
          <li>
            Portal de clientes:{" "}
            <Link href="/es/cuenta" className="underline">
              Inicia sesión para compartir documentos y seguir tu progreso
            </Link>
          </li>
        </ul>
        <p className="text-xs text-brand-blue/70 mt-3">
          Nota: Las reglas de programas (tarjetas de salud, licencias, beneficios) varían por provincia y pueden cambiar. Este checklist es una guía; verifica detalles con fuentes oficiales.
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
