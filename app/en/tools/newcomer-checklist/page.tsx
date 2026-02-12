"use client";

import { useEffect, useMemo, useRef, useState } from "react";
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
  Upload,
  Filter,
  X,
  AlertTriangle,
  Flag,
} from "lucide-react";

/**
 * Newcomer Checklist (enhanced)
 * - Sections, progress, due dates, notes, custom tasks
 * - Autosave (localStorage) + collapse-state + "Saved" indicator
 * - CSV/JSON export + JSON import
 * - Overdue / due-soon highlights, priority filter, inline quick-add
 * - Mobile cards + desktop table
 */

// ---------- Types ----------
type SectionKey =
  | "before_arrival"
  | "first_72h"
  | "first_2w"
  | "first_month"
  | "months_3_6"
  | "custom";

type Priority = "high" | "normal";

type Task = {
  id: string;
  section: SectionKey;
  title: string;
  note?: string;
  done: boolean;
  due?: string; // YYYY-MM-DD
  linkHref?: string; // internal routes preferred
  linkLabel?: string;
  isCustom?: boolean;
  priority?: Priority;
};

// ---------- Storage ----------
const LS_KEY = "tools.newcomer_checklist.v1";
const LS_COLLAPSE = "tools.newcomer_checklist.collapse.v1";
const LS_FILTERS = "tools.newcomer_checklist.filters.v1";

// ---------- Helpers ----------
const uid = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

function classNames(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

function daysUntil(dateISO?: string) {
  if (!dateISO) return null;
  const d = new Date(`${dateISO}T00:00:00`);
  if (Number.isNaN(+d)) return null;
  const today = new Date();
  const diff = Math.ceil(
    (d.getTime() - new Date(today.toDateString()).getTime()) / (1000 * 60 * 60 * 24)
  );
  return diff;
}

function toCSV(rows: Array<Array<string | number>>) {
  const esc = (v: string | number) => {
    const s = String(v ?? "");
    const needs = /[",\n]/.test(s);
    const q = s.replace(/"/g, '""');
    return needs ? `"${q}"` : q;
  };
  return rows.map((r) => r.map(esc).join(",")).join("\r\n");
}
function downloadFile(filename: string, mime: string, data: string | Blob) {
  const blob = data instanceof Blob ? data : new Blob([data], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

// ---------- Defaults (finance-first) ----------
const DEFAULT_TASKS: Task[] = [
  // BEFORE ARRIVAL
  {
    id: uid(),
    section: "before_arrival",
    title:
      "Digitize key documents (passports, degrees, reference letters, vaccinations) & back them up to a secure cloud folder",
    done: false,
  },
  {
    id: uid(),
    section: "before_arrival",
    title: "Estimate first-month expenses & emergency cash buffer",
    linkHref: "/en/tools/budget-calculator",
    linkLabel: "Budget Calculator",
    done: false,
    priority: "high",
  },
  {
    id: uid(),
    section: "before_arrival",
    title: "Book temporary housing for 2–4 weeks (flexible cancellation if possible)",
    done: false,
  },
  {
    id: uid(),
    section: "before_arrival",
    title:
      "Prepare driving history/abstract from home country (may help with insurance and license exchange)",
    done: false,
  },

  // FIRST 72 HOURS
  {
    id: uid(),
    section: "first_72h",
    title: "Get a local SIM / phone plan & share your Canadian number with key contacts",
    done: false,
  },
  {
    id: uid(),
    section: "first_72h",
    title: "Apply for your Social Insurance Number (SIN)",
    done: false,
    priority: "high",
  },
  {
    id: uid(),
    section: "first_72h",
    title:
      "Map transit from temporary stay to Service Canada, bank, and prospective neighborhoods",
    done: false,
  },

  // FIRST 2 WEEKS
  {
    id: uid(),
    section: "first_2w",
    title: "Open a Canadian chequing account & set up e-transfers",
    done: false,
    priority: "high",
  },
  {
    id: uid(),
    section: "first_2w",
    title: "Start your Canadian credit file (secured or low-limit card; set auto-pay)",
    done: false,
    linkHref: "/en/services#mortgage",
    linkLabel: "Credit-building guidance",
  },
  {
    id: uid(),
    section: "first_2w",
    title: "Apply for provincial health coverage (health card) and choose a family doctor/clinic",
    done: false,
  },
  {
    id: uid(),
    section: "first_2w",
    title: "Create CRA My Account (for taxes & benefits)",
    done: false,
  },

  // FIRST MONTH
  {
    id: uid(),
    section: "first_month",
    title: "Secure long-term housing & set up renter’s insurance + utilities",
    done: false,
  },
  {
    id: uid(),
    section: "first_month",
    title:
      "Build a realistic monthly plan (Needs / Wants / Savings & Debt) and automate key bills",
    linkHref: "/en/tools/budget-calculator",
    linkLabel: "Holistic Budget Calculator",
    done: false,
  },
  {
    id: uid(),
    section: "first_month",
    title: "Exchange or apply for a driver’s licence (bring driving abstract if available)",
    done: false,
  },
  {
    id: uid(),
    section: "first_month",
    title:
      "Enroll kids in school / childcare and update immunization records (if applicable)",
    done: false,
  },

  // 3–6 MONTHS
  {
    id: uid(),
    section: "months_3_6",
    title: "Build an emergency fund (target 1–3 months of essential expenses)",
    done: false,
    linkHref: "/en/tools/net-worth",
    linkLabel: "Net Worth Tracker",
  },
  {
    id: uid(),
    section: "months_3_6",
    title: "Consider TFSA/RRSP (eligibility, contribution room) and set contributions",
    done: false,
    linkHref: "/en/services#strategic-maps",
    linkLabel: "Planning session",
  },
  {
    id: uid(),
    section: "months_3_6",
    title:
      "Prepare first Canadian tax filing (save pay stubs/receipts; confirm credits/benefits)",
    done: false,
    linkHref: "/en/services#business",
    linkLabel: "Tax support",
  },
  {
    id: uid(),
    section: "months_3_6",
    title: "Grow Canadian references & network (volunteer, professional groups)",
    done: false,
  },
];

// ---------- Section metadata ----------
const SECTION_META: Record<
  SectionKey,
  { title: string; blurb?: string; tone: "emerald" | "amber" | "sky" | "blue" | "gold" }
> = {
  before_arrival: {
    title: "Before arrival",
    blurb: "Set the foundation so your first weeks are focused and calm.",
    tone: "amber",
  },
  first_72h: {
    title: "First 72 hours",
    blurb: "Get essential IDs and connectivity in place quickly.",
    tone: "emerald",
  },
  first_2w: {
    title: "First 2 weeks",
    blurb: "Banking, health coverage, and a starter credit profile.",
    tone: "sky",
  },
  first_month: {
    title: "First month",
    blurb: "Stabilize housing, bills, and your monthly plan.",
    tone: "blue",
  },
  months_3_6: {
    title: "3–6 months",
    blurb: "Build buffers, optimize taxes, and grow your roots.",
    tone: "gold",
  },
  custom: {
    title: "Your custom tasks",
    blurb: "Add anything unique to your situation or goals.",
    tone: "emerald",
  },
};

// ---------- Small UI helpers ----------
function SavedIndicator({ savedAt }: { savedAt: number | null }) {
  if (!savedAt) return null;
  const sec = Math.max(0, Math.round((Date.now() - savedAt) / 1000));
  const text = sec < 3 ? "Saved just now" : sec < 60 ? `Saved ${sec}s ago` : "Saved";
  return (
    <span
      className="inline-flex items-center gap-1 text-emerald-700 text-xs md:text-sm"
      role="status"
      aria-live="polite"
    >
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
        <div
          className="h-2 bg-brand-green"
          style={{ width: `${pct}%`, transition: "width .3s ease" }}
        />
      </div>
      <span className="text-xs text-brand-blue/70">{pct}%</span>
    </div>
  );
}

function PriorityBadge({ p }: { p?: Priority }) {
  if (p !== "high") return null;
  return (
    <span className="inline-flex items-center gap-1 text-xs text-red-700 bg-red-50 border border-red-200 rounded-full px-2 py-0.5 ml-2">
      <Flag className="h-3 w-3" /> High
    </span>
  );
}

// ---------- Page ----------
export default function Page() {
  const [tasks, setTasks] = useState<Task[]>(DEFAULT_TASKS);
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const [filter, setFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState<"all" | "high" | "normal">("all");
  const [collapse, setCollapse] = useState<Record<SectionKey, boolean>>({
    before_arrival: false,
    first_72h: false,
    first_2w: false,
    first_month: false,
    months_3_6: false,
    custom: false,
  });

  // Per-section Quick Add state (avoids calling hooks inside map)
  const [quickAddTitle, setQuickAddTitle] = useState<Record<SectionKey, string>>({
    before_arrival: "",
    first_72h: "",
    first_2w: "",
    first_month: "",
    months_3_6: "",
    custom: "",
  });
  const [quickAddPriority, setQuickAddPriority] = useState<Record<SectionKey, Priority>>({
    before_arrival: "normal",
    first_72h: "normal",
    first_2w: "normal",
    first_month: "normal",
    months_3_6: "normal",
    custom: "normal",
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Restore
  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) {
        const v = JSON.parse(raw);
        if (Array.isArray(v)) setTasks(v as Task[]);
      }
      const rawC = localStorage.getItem(LS_COLLAPSE);
      if (rawC) {
        const cc = JSON.parse(rawC);
        if (cc && typeof cc === "object") setCollapse(cc);
      }
      const rawF = localStorage.getItem(LS_FILTERS);
      if (rawF) {
        const pf = JSON.parse(rawF);
        if (pf?.priority) setPriorityFilter(pf.priority);
      }
    } catch {}
  }, []);

  // Persist
  useEffect(() => {
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(tasks));
      setSavedAt(Date.now());
    } catch {}
  }, [tasks]);

  useEffect(() => {
    try {
      localStorage.setItem(LS_COLLAPSE, JSON.stringify(collapse));
    } catch {}
  }, [collapse]);

  useEffect(() => {
    try {
      localStorage.setItem(LS_FILTERS, JSON.stringify({ priority: priorityFilter }));
    } catch {}
  }, [priorityFilter]);

  // Derived
  const overall = useMemo(() => {
    let filtered = tasks;

    if (filter.trim()) {
      const q = filter.toLowerCase();
      filtered = filtered.filter((t) =>
        [t.title, t.note, t.linkLabel].filter(Boolean).join(" ").toLowerCase().includes(q)
      );
    }
    if (priorityFilter !== "all") {
      filtered = filtered.filter((t) =>
        priorityFilter === "high" ? t.priority === "high" : (t.priority || "normal") === "normal"
      );
    }

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

    // Upcoming (next 7 days)
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
  }, [tasks, filter, priorityFilter]);

  // Actions
  const toggle = (id: string) =>
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  const update = (id: string, patch: Partial<Task>) =>
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...patch } : t)));
  const addCustom = (section: SectionKey, title = "") =>
    setTasks((prev) => [
      ...prev,
      { id: uid(), section, title, note: "", done: false, isCustom: true },
    ]);
  const removeTask = (id: string) => setTasks((prev) => prev.filter((t) => t.id !== id));
  const clearDue = (id: string) => update(id, { due: undefined });

  const resetAll = () => {
    const ok = confirm(
      "Reset checklist to the default template? This clears your saved progress."
    );
    if (ok) {
      setTasks(DEFAULT_TASKS);
      try {
        localStorage.removeItem(LS_KEY);
      } catch {}
    }
  };

  const exportCSV = () => {
    const rows: Array<Array<string | number>> = [
      ["Section", "Task", "Done", "Due", "Priority", "Note", "LinkLabel", "LinkHref"],
      ...tasks.map((t) => [
        SECTION_META[t.section].title,
        t.title,
        t.done ? "Yes" : "No",
        t.due || "",
        t.priority || "normal",
        t.note || "",
        t.linkLabel || "",
        t.linkHref || "",
      ]),
    ];
    const csv = "\uFEFF" + toCSV(rows);
    downloadFile("Newcomer_Checklist.csv", "text/csv;charset=utf-8", csv);
  };

  const exportJSON = () => {
    const json = JSON.stringify({ version: 1, exportedAt: new Date().toISOString(), tasks }, null, 2);
    downloadFile("Newcomer_Checklist.json", "application/json", json);
  };

  const importJSON = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result));
        const arr: unknown = (parsed as { tasks?: unknown })?.tasks ?? parsed;
        if (!Array.isArray(arr)) throw new Error("Invalid file format");

        const validSections: SectionKey[] = [
          "before_arrival",
          "first_72h",
          "first_2w",
          "first_month",
          "months_3_6",
          "custom",
        ];

        const cleaned: Task[] = (arr as unknown[])

          .map((raw: unknown): Task => {
            const t = (raw ?? {}) as Record<string, unknown>;

            const section: SectionKey =
              typeof t.section === "string" && validSections.includes(t.section as SectionKey)
                ? (t.section as SectionKey)
                : "custom";

            const title = typeof t.title === "string" ? t.title.slice(0, 300) : "";

            const due =
              typeof t.due === "string" && /^\d{4}-\d{2}-\d{2}$/.test(t.due) ? t.due : undefined;

            const priority: Priority =
              (t.priority === "high" ? "high" : "normal") as Priority;

            return {
              id: typeof t.id === "string" ? t.id : uid(),
              section,
              title,
              note: typeof t.note === "string" ? t.note.slice(0, 2000) : "",
              done: Boolean(t.done),
              due,
              linkHref: typeof t.linkHref === "string" ? t.linkHref : undefined,
              linkLabel: typeof t.linkLabel === "string" ? t.linkLabel : undefined,
              isCustom: "isCustom" in t ? Boolean((t as { isCustom?: unknown }).isCustom) : true,
              priority,
            };
          })
          .filter((t: Task) => t.title.trim().length > 0);

        if (!cleaned.length) throw new Error("No tasks found");
        setTasks(cleaned);
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : String(e);
        alert(`Could not import JSON: ${msg}`);
      }
    };
    reader.readAsText(file);
  };

  const openImport = () => fileInputRef.current?.click();

  const toggleAll = (val: boolean) =>
    setCollapse({
      before_arrival: val,
      first_72h: val,
      first_2w: val,
      first_month: val,
      months_3_6: val,
      custom: val,
    });

  // Color tokens (optional if you want section-colored borders)
  const toneToText: Record<string, string> = {
    emerald: "text-emerald-700",
    amber: "text-amber-700",
    sky: "text-sky-700",
    blue: "text-blue-700",
    gold: "text-amber-700",
  };

  const printDate = new Date().toLocaleDateString("en-CA", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <ToolShell
      title="Newcomer Checklist"
      subtitle="A practical, finance-first roadmap for your first months in Canada — with due dates, notes, and autosave."
      lang="en"
    >
      {/* Top actions */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative">
            <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-brand-blue/60" />
            <input
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              placeholder="Filter tasks…"
              className="pl-9 pr-3 py-2 rounded-full border-2 border-brand-gold/60 bg-white min-w-[220px]"
              aria-label="Filter tasks"
            />
          </div>

          <div className="inline-flex items-center gap-2 text-sm px-3 py-2 rounded-full border border-brand-gold/60 bg-white">
            <Filter className="h-4 w-4 text-brand-blue/70" />
            <label className="text-brand-blue/80">Priority:</label>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value as typeof priorityFilter)}
              className="bg-transparent outline-none"
              aria-label="Filter by priority"
            >
              <option value="all">All</option>
              <option value="high">High</option>
              <option value="normal">Normal</option>
            </select>
          </div>

          <button
            type="button"
            onClick={() => toggleAll(true)}
            className="text-sm underline text-brand-blue"
          >
            Collapse all
          </button>
          <span className="text-brand-blue/40">|</span>
          <button
            type="button"
            onClick={() => toggleAll(false)}
            className="text-sm underline text-brand-blue"
          >
            Expand all
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={exportCSV}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border-2 border-brand-green text-brand-green hover:bg-brand-green hover:text-white transition"
            title="Export as CSV"
          >
            <Download className="h-4 w-4" />
            CSV
          </button>
          <button
            type="button"
            onClick={exportJSON}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border-2 border-brand-blue text-brand-blue hover:bg-brand-blue hover:text-white transition"
            title="Export as JSON"
          >
            <Download className="h-4 w-4" />
            JSON
          </button>
          <button
            type="button"
            onClick={openImport}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border-2 border-brand-gold text-brand-gold hover:bg-brand-gold hover:text-brand-green transition"
            title="Import JSON"
          >
            <Upload className="h-4 w-4" />
            Import
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/json"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) importJSON(f);
              e.currentTarget.value = "";
            }}
          />

          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border-2 border-brand-blue text-brand-blue hover:bg-brand-blue hover:text-white transition"
            title="Print"
          >
            <Printer className="h-4 w-4" />
            Print
          </button>
          <button
            type="button"
            onClick={resetAll}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border-2 border-brand-gold text-brand-gold hover:bg-brand-gold hover:text-brand-green transition"
            title="Reset"
          >
            <RotateCcw className="h-4 w-4" />
            Reset
          </button>
        </div>
      </div>

      {/* Summary / Upcoming */}
      <section className="rounded-2xl border border-brand-gold bg-white p-4 md:p-5 mb-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="text-sm text-brand-blue/80">Overall progress</span>
            <ProgressBar value={overall.done} total={overall.total} />
            <span className="text-sm text-brand-blue/70">
              {overall.done}/{overall.total} completed
            </span>
          </div>
          <SavedIndicator savedAt={savedAt} />
        </div>
        {overall.upcoming.length > 0 && (
          <div className="mt-4">
            <div className="text-sm font-semibold text-brand-green mb-1 flex items-center gap-2">
              <CalendarDays className="h-4 w-4" />
              Due in the next 7 days
            </div>
            <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {overall.upcoming.map((t) => (
                <li
                  key={t.id}
                  className="rounded-lg border border-brand-gold/50 bg-brand-beige/40 px-3 py-2 text-sm"
                >
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

      {/* Print header */}
      <div className="hidden print:block mt-2 mb-3 text-center">
        <div className="font-serif font-bold text-brand-green text-2xl">Newcomer Checklist</div>
        <div className="text-xs text-brand-blue">Prepared {printDate}</div>
        <div className="w-16 h-[2px] bg-brand-gold rounded-full mx-auto mt-2" />
      </div>

      {/* Sections */}
      <form className="grid grid-cols-1 gap-6">
        {(Object.keys(SECTION_META) as SectionKey[]).map((key) => {
          const meta = SECTION_META[key];
          const list = overall.sections.find((s) => s.key === key)!;
          const isCollapsed = collapse[key];

          const quickAdd = () => {
            const title = quickAddTitle[key].trim();
            if (!title) return;
            const t: Task = {
              id: uid(),
              section: key,
              title,
              note: "",
              done: false,
              isCustom: true,
              priority: quickAddPriority[key],
            };
            setTasks((prev) => [...prev, t]);
            setQuickAddTitle((prev) => ({ ...prev, [key]: "" }));
            setQuickAddPriority((prev) => ({ ...prev, [key]: "normal" }));
          };

          return (
            <section
              key={key}
              className="rounded-2xl border border-brand-gold bg-white p-4 md:p-5"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3
                    className={classNames(
                      "font-serif text-base md:text-lg font-bold",
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
                      title="Add a custom task to this section"
                    >
                      <PlusCircle className="h-4 w-4" />
                      Add task
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setCollapse((c) => ({ ...c, [key]: !c[key] }))}
                    className="text-sm underline text-brand-blue"
                    aria-expanded={!isCollapsed}
                    aria-controls={`section-${key}`}
                  >
                    {isCollapsed ? "Expand" : "Collapse"}
                  </button>
                </div>
              </div>

              {/* Task list */}
              <div id={`section-${key}`} className={classNames(isCollapsed && "hidden", "mt-4")}>
                {/* Desktop */}
                <div className="hidden md:block">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-brand-beige/40 text-left">
                        <th className="p-2 rounded-l-xl w-[44px]">Done</th>
                        <th className="p-2">Task</th>
                        <th className="p-2 w-[120px]">Priority</th>
                        <th className="p-2 w-[160px]">Due date</th>
                        <th className="p-2 w-[36%]">Notes</th>
                        <th className="p-2 rounded-r-xl w-[44px]"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {list.list.map((t) => {
                        const du = daysUntil(t.due);
                        const overdue = du !== null && du < 0 && !t.done;
                        const dueSoon = du !== null && du >= 0 && du <= 7 && !t.done;

                        return (
                          <tr
                            key={t.id}
                            className={classNames(
                              "border-b border-brand-green/20",
                              overdue && "bg-red-50/50",
                              dueSoon && "bg-amber-50/50"
                            )}
                          >
                            <td className="p-2 align-top">
                              <input
                                id={`chk-${t.id}`}
                                type="checkbox"
                                checked={t.done}
                                onChange={() => toggle(t.id)}
                                className="h-4 w-4 accent-brand-green"
                                aria-label={`Mark "${t.title}" as done`}
                              />
                            </td>
                            <td className="p-2 align-top">
                              <label htmlFor={`chk-${t.id}`} className="font-medium cursor-pointer">
                                {t.title}
                              </label>
                              <PriorityBadge p={t.priority} />
                              {t.linkHref && (
                                <>
                                  {" "}
                                  <Link
                                    href={t.linkHref}
                                    className="inline-flex items-center gap-1 underline text-brand-blue ml-1"
                                    title={t.linkLabel || "Open link"}
                                  >
                                    {t.linkLabel || "Learn more"}
                                    <ExternalLink className="h-3.5 w-3.5" />
                                  </Link>
                                </>
                              )}
                              {overdue && (
                                <div className="mt-1 text-xs text-red-700 flex items-center gap-1">
                                  <AlertTriangle className="h-3.5 w-3.5" /> Overdue
                                </div>
                              )}
                              {dueSoon && !overdue && (
                                <div className="mt-1 text-xs text-amber-700 flex items-center gap-1">
                                  <CalendarDays className="h-3.5 w-3.5" /> Due soon ({du}d)
                                </div>
                              )}
                            </td>
                            <td className="p-2 align-top">
                              <select
                                value={t.priority || "normal"}
                                onChange={(e) => update(t.id, { priority: e.target.value as Priority })}
                                className="border rounded-lg p-2 w-full bg-white"
                                aria-label={`Priority for ${t.title}`}
                              >
                                <option value="normal">Normal</option>
                                <option value="high">High</option>
                              </select>
                            </td>
                            <td className="p-2 align-top">
                              <div className="flex items-center gap-2">
                                <input
                                  type="date"
                                  value={t.due || ""}
                                  onChange={(e) => update(t.id, { due: e.target.value })}
                                  className="border rounded-lg p-2 w-full bg-white"
                                  aria-label={`Set due date for ${t.title}`}
                                />
                                {t.due && (
                                  <button
                                    type="button"
                                    onClick={() => clearDue(t.id)}
                                    className="p-1 rounded-md hover:bg-brand-beige/60"
                                    title="Clear due date"
                                    aria-label="Clear due date"
                                  >
                                    <X className="h-4 w-4" />
                                  </button>
                                )}
                              </div>
                            </td>
                            <td className="p-2 align-top">
                              <input
                                value={t.note || ""}
                                onChange={(e) => update(t.id, { note: e.target.value })}
                                className="w-full border rounded-lg p-2"
                                placeholder="Add a note, contact, or link…"
                                aria-label={`Notes for ${t.title}`}
                              />
                            </td>
                            <td className="p-2 align-top text-right">
                              {(t.isCustom || key === "custom") && (
                                <button
                                  type="button"
                                  onClick={() => removeTask(t.id)}
                                  title="Remove task"
                                  aria-label="Remove task"
                                  className="inline-flex items-center justify-center p-1.5 rounded-md text-red-600 hover:bg-red-50"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              )}
                            </td>
                          </tr>
                        );
                      })}

                      {/* Quick add row */}
                      <tr>
                        <td />
                        <td className="p-2">
                          <input
                            value={quickAddTitle[key]}
                            onChange={(e) =>
                              setQuickAddTitle((prev) => ({ ...prev, [key]: e.target.value }))
                            }
                            placeholder="Add a new task…"
                            className="w-full border rounded-lg p-2"
                            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), quickAdd())}
                          />
                        </td>
                        <td className="p-2">
                          <select
                            value={quickAddPriority[key]}
                            onChange={(e) =>
                              setQuickAddPriority((prev) => ({
                                ...prev,
                                [key]: e.target.value as Priority,
                              }))
                            }
                            className="border rounded-lg p-2 w-full bg-white"
                          >
                            <option value="normal">Normal</option>
                            <option value="high">High</option>
                          </select>
                        </td>
                        <td className="p-2" />
                        <td className="p-2" />
                        <td className="p-2">
                          <button
                            type="button"
                            onClick={quickAdd}
                            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-brand-gold/70 text-brand-blue hover:bg-brand-beige/60"
                          >
                            <PlusCircle className="h-4 w-4" />
                            Add
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Mobile */}
                <div className="md:hidden grid gap-2">
                  {list.list.map((t) => {
                    const du = daysUntil(t.due);
                    const overdue = du !== null && du < 0 && !t.done;
                    const dueSoon = du !== null && du >= 0 && du <= 7 && !t.done;

                    return (
                      <div
                        key={t.id}
                        className={classNames(
                          "relative rounded-xl border border-brand-gold/50 bg-white p-3",
                          overdue && "bg-red-50/50",
                          dueSoon && "bg-amber-50/50"
                        )}
                      >
                        {(t.isCustom || key === "custom") && (
                          <button
                            type="button"
                            onClick={() => removeTask(t.id)}
                            title="Remove task"
                            aria-label="Remove task"
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
                            aria-label={`Mark "${t.title}" as done`}
                          />
                          <div className="flex-1">
                            <label htmlFor={`mchk-${t.id}`} className="font-medium">
                              {t.title}
                            </label>
                            <PriorityBadge p={t.priority} />
                            {t.linkHref && (
                              <div className="mt-1">
                                <Link
                                  href={t.linkHref}
                                  className="inline-flex items-center gap-1 underline text-brand-blue"
                                  title={t.linkLabel || "Open link"}
                                >
                                  {t.linkLabel || "Learn more"}
                                  <ExternalLink className="h-3.5 w-3.5" />
                                </Link>
                              </div>
                            )}

                            {(overdue || dueSoon) && (
                              <div
                                className={classNames(
                                  "mt-1 text-xs flex items-center gap-1",
                                  overdue ? "text-red-700" : "text-amber-700"
                                )}
                              >
                                {overdue ? (
                                  <>
                                    <AlertTriangle className="h-3.5 w-3.5" /> Overdue
                                  </>
                                ) : (
                                  <>
                                    <CalendarDays className="h-3.5 w-3.5" /> Due soon ({du}d)
                                  </>
                                )}
                              </div>
                            )}

                            <div className="grid grid-cols-2 gap-2 mt-2">
                              <div>
                                <div className="text-[11px] text-brand-blue/70">Priority</div>
                                <select
                                  value={t.priority || "normal"}
                                  onChange={(e) => update(t.id, { priority: e.target.value as Priority })}
                                  className="w-full border rounded-lg p-2 bg-white"
                                >
                                  <option value="normal">Normal</option>
                                  <option value="high">High</option>
                                </select>
                              </div>
                              <div>
                                <div className="text-[11px] text-brand-blue/70">Due</div>
                                <div className="flex items-center gap-2">
                                  <input
                                    type="date"
                                    value={t.due || ""}
                                    onChange={(e) => update(t.id, { due: e.target.value })}
                                    className="w-full border rounded-lg p-2 bg-white"
                                  />
                                  {t.due && (
                                    <button
                                      type="button"
                                      onClick={() => clearDue(t.id)}
                                      className="p-1 rounded-md hover:bg-brand-beige/60"
                                      title="Clear due date"
                                      aria-label="Clear due date"
                                    >
                                      <X className="h-4 w-4" />
                                    </button>
                                  )}
                                </div>
                              </div>
                              <div className="col-span-2">
                                <div className="text-[11px] text-brand-blue/70">Notes</div>
                                <input
                                  value={t.note || ""}
                                  onChange={(e) => update(t.id, { note: e.target.value })}
                                  className="w-full border rounded-lg p-2"
                                  placeholder="Add a note, contact, or link…"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {/* Quick add on mobile */}
                  <div className="rounded-xl border border-brand-gold/50 bg-white p-3">
                    <div className="text-[11px] text-brand-blue/70 mb-1">Add task</div>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        value={quickAddTitle[key]}
                        onChange={(e) =>
                          setQuickAddTitle((prev) => ({ ...prev, [key]: e.target.value }))
                        }
                        placeholder="Task title…"
                        className="w-full border rounded-lg p-2 col-span-2"
                      />
                      <select
                        value={quickAddPriority[key]}
                        onChange={(e) =>
                          setQuickAddPriority((prev) => ({
                            ...prev,
                            [key]: e.target.value as Priority,
                          }))
                        }
                        className="w-full border rounded-lg p-2"
                      >
                        <option value="normal">Normal</option>
                        <option value="high">High</option>
                      </select>
                      <button
                        type="button"
                        onClick={quickAdd}
                        className="inline-flex items-center justify-center gap-2 px-3 py-2 rounded-full border border-brand-gold/70 text-brand-blue hover:bg-brand-beige/60"
                      >
                        <PlusCircle className="h-4 w-4" />
                        Add
                      </button>
                    </div>
                  </div>
                </div>

                {/* Add button for Custom section (desktop-only extra) */}
                {key === "custom" && (
                  <div className="mt-3 hidden md:block">
                    <button
                      type="button"
                      onClick={() => addCustom("custom")}
                      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-brand-gold/70 text-brand-blue hover:bg-brand-beige/60"
                    >
                      <PlusCircle className="h-4 w-4" />
                      Add custom task
                    </button>
                  </div>
                )}
              </div>
            </section>
          );
        })}
      </form>

      {/* Helpful tools & services */}
      <section className="rounded-2xl border border-brand-gold bg-white p-4 md:p-5 mt-6">
        <h4 className="font-serif text-base md:text-lg text-brand-green font-bold mb-2">
          Helpful tools & services
        </h4>
        <ul className="list-disc ml-5 text-sm space-y-1">
          <li>
            Monthly planning:{" "}
            <Link href="/en/tools/budget-calculator" className="underline">
              Holistic Budget Calculator
            </Link>
          </li>
          <li>
            Track your finances:{" "}
            <Link href="/en/tools/net-worth" className="underline">
              Net Worth Tracker
            </Link>{" "}
            •{" "}
            <Link href="/en/tools/debt-snowball" className="underline">
              Debt Snowball / Payoff Planner
            </Link>
          </li>
          <li>
            Optimize benefits & taxes:{" "}
            <Link href="/en/services#business" className="underline">
              Tax support
            </Link>{" "}
            •{" "}
            <Link href="/en/services#strategic-maps" className="underline">
              Financial planning session
            </Link>
          </li>
          <li>
            Client library:{" "}
            <Link href="/en/client-library" className="underline">
              Log in to share docs & track progress
            </Link>
          </li>
        </ul>
        <p className="text-xs text-brand-blue/70 mt-3">
          Notes: Program rules (health cards, licensing, benefits) vary by province and can change.
          Treat this checklist as guidance—verify details with official sources.
        </p>
      </section>

      {/* Print helpers */}
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
