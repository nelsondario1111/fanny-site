// components/tools/ChecklistEs.tsx
"use client";

import { useEffect, useMemo, useState } from "react";

export type ChecklistSection = { title: string; items: string[] };

function toCSV(rows: Array<Array<string | number>>) {
  const esc = (v: string | number) => {
    const s = String(v ?? "");
    const needsQuotes = /[",\n]/.test(s);
    const escaped = s.replace(/"/g, '""');
    return needsQuotes ? `"${escaped}"` : escaped;
  };
  return rows.map((r) => r.map(esc).join(",")).join("\r\n");
}

function downloadCSV(baseName: string, rows: Array<Array<string | number>>) {
  const date = new Date().toISOString().slice(0, 10);
  const csv = toCSV(rows);
  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${baseName}_${date}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function ChecklistEs({
  title,
  subtitle,
  sections,
  storageKey,
}: {
  title: string;
  subtitle?: string;
  sections: ChecklistSection[];
  storageKey: string; // p.ej. "mortgage-readiness-es-v1"
}) {
  type MapState = Record<string, boolean>;
  const [state, setState] = useState<MapState>({});

  const keys = useMemo(() => {
    const out: string[] = [];
    sections.forEach((sec, si) =>
      sec.items.forEach((_, ii) => out.push(`${si}:${ii}`))
    );
    return out;
  }, [sections]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) setState(JSON.parse(raw));
    } catch {}
  }, [storageKey]);

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(state));
    } catch {}
  }, [state, storageKey]);

  const total = keys.length;
  const hechos = keys.filter((k) => state[k]).length;

  function toggle(si: number, ii: number) {
    const k = `${si}:${ii}`;
    setState((s) => ({ ...s, [k]: !s[k] }));
  }

  function reset() {
    setState({});
  }

  function exportCSV() {
    const filas: Array<Array<string | number>> = [["Sección", "Elemento", "Estado"]];
    sections.forEach((sec, si) => {
      sec.items.forEach((it, ii) => {
        const k = `${si}:${ii}`;
        filas.push([sec.title, it, state[k] ? "Hecho" : "Pendiente"]);
      });
    });
    downloadCSV(title.replace(/\s+/g, "_"), filas);
  }

  return (
    <section className="max-w-4xl mx-auto">
      <header className="text-center mb-6">
        <h1 className="font-brand font-bold text-3xl md:text-4xl text-brand-green tracking-tight">
          {title}
        </h1>
        {subtitle && (
          <p className="text-brand-blue/90 mt-2 max-w-2xl mx-auto">{subtitle}</p>
        )}
        <div className="flex justify-center my-4" aria-hidden="true">
          <div className="w-16 h-[3px] rounded-full bg-brand-gold" />
        </div>
        <div className="text-sm text-brand-body">
          Progreso: <b>{hechos}</b> / {total}
        </div>
      </header>

      <div className="bg-white/95 rounded-2xl border border-brand-gold shadow p-5 sm:p-7">
        <div className="tool-actions justify-between mb-5">
          <div className="text-brand-body/80">
            Consejo: Tu progreso se guarda en este navegador.
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={exportCSV}
              className="tool-btn-green"
            >
              Exportar (CSV)
            </button>
            <button
              type="button"
              onClick={() => window.print()}
              className="tool-btn-blue"
            >
              Imprimir o guardar PDF
            </button>
            <button
              type="button"
              onClick={reset}
              className="tool-btn-gold"
            >
              Restablecer valores
            </button>
          </div>
        </div>

        <div className="space-y-6 print:space-y-4">
          {sections.map((sec, si) => (
            <div key={sec.title} className="border border-brand-green/20 rounded-xl p-4">
              <h2 className="font-brand text-xl text-brand-green mb-3">{sec.title}</h2>
              <ul className="space-y-2">
                {sec.items.map((it, ii) => {
                  const k = `${si}:${ii}`;
                  const checked = !!state[k];
                  return (
                    <li
                      key={k}
                      className="flex items-start gap-3 p-2 rounded-lg hover:bg-brand-gold/10"
                    >
                      <input
                        id={`ck-${k}`}
                        type="checkbox"
                        className="mt-1 accent-brand-green"
                        checked={checked}
                        onChange={() => toggle(si, ii)}
                      />
                      <label
                        htmlFor={`ck-${k}`}
                        className={`flex-1 cursor-pointer ${
                          checked ? "line-through text-brand-body/60" : ""
                        }`}
                      >
                        {it}
                      </label>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>

        <p className="mt-6 text-xs text-brand-blue/70">
          Herramienta de planificación solo educativa. Esta lista es una guía general y no constituye asesoría legal, fiscal, hipotecaria ni de inversión.
        </p>
      </div>
    </section>
  );
}
