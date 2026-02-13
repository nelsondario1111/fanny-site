// components/tools/Checklist.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { downloadCsv, downloadXlsx } from "@/lib/spreadsheet";

export type ChecklistSection = { title: string; items: string[] };

export default function Checklist({
  title,
  subtitle,
  sections,
  storageKey,
}: {
  title: string;
  subtitle?: string;
  sections: ChecklistSection[];
  storageKey: string; // e.g. "mortgage-readiness-v1"
}) {
  type MapState = Record<string, boolean>;
  const [state, setState] = useState<MapState>({});

  // Build a stable key for each item
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

  const allCount = keys.length;
  const doneCount = keys.filter((k) => state[k]).length;

  function toggle(si: number, ii: number) {
    const k = `${si}:${ii}`;
    setState((s) => ({ ...s, [k]: !s[k] }));
  }

  function reset() {
    setState({});
  }

  function exportCSV() {
    const rows: Array<Array<string | number>> = [["Section", "Item", "Status"]];
    sections.forEach((sec, si) => {
      sec.items.forEach((it, ii) => {
        const k = `${si}:${ii}`;
        rows.push([sec.title, it, state[k] ? "Done" : "To-do"]);
      });
    });
    downloadCsv(title.replace(/\s+/g, "_"), rows);
  }

  function exportXLSX() {
    const rows: Array<Array<string | number>> = [["Section", "Item", "Status"]];
    sections.forEach((sec, si) => {
      sec.items.forEach((it, ii) => {
        const k = `${si}:${ii}`;
        rows.push([sec.title, it, state[k] ? "Done" : "To-do"]);
      });
    });
    downloadXlsx(title.replace(/\s+/g, "_"), rows, {
      sheetName: "Checklist",
      columnWidths: [28, 56, 16],
    });
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
          Progress: <b>{doneCount}</b> / {allCount}
        </div>
      </header>

      <div className="bg-white/95 rounded-2xl border border-brand-gold shadow p-5 sm:p-7">
        <div className="tool-actions justify-between mb-5">
          <div className="text-brand-body/80">
            Tip: Your progress is saved to this browser.
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={exportCSV}
              className="tool-btn-green"
            >
              Export (CSV)
            </button>
            <button
              type="button"
              onClick={exportXLSX}
              className="tool-btn-primary"
            >
              Export (XLSX)
            </button>
            <button
              type="button"
              onClick={() => window.print()}
              className="tool-btn-blue"
            >
              Print or Save PDF
            </button>
            <button
              type="button"
              onClick={reset}
              className="tool-btn-gold"
            >
              Reset values
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
          Educational planning tool. This checklist is general guidance, not legal, tax, lending, or investment advice.
        </p>
      </div>
    </section>
  );
}
