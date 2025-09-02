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
 * Newcomer Checklist
 * - Finance-first, settlement-ready checklist for newcomers
 * - Sections, progress, due dates, notes, custom tasks
 * - Mobile: stacked cards; Desktop: clean grids
 * - Autosave (localStorage) + "Saved" indicator
 * - CSV export, Print, Reset
 *
 * Matches visual language used across Fanny's tools (brand colors, rounded cards, subtle borders).
 */

// ---------- Types ----------
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
  due?: string; // YYYY-MM-DD
  linkHref?: string; // internal routes preferred
  linkLabel?: string;
  isCustom?: boolean;
  priority?: "high" | "normal";
};

// ---------- Storage ----------
const LS_KEY = "tools.newcomer_checklist.v1";

// ---------- Helpers ----------
const uid = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

function classNames(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

// ---------- Defaults (crafted for finance-first usefulness) ----------
const DEFAULT_TASKS: Task[] = [
  // BEFORE ARRIVAL
  {
    id: uid(),
    section: "before_arrival",
    title: "Digitize key documents (passports, degrees, reference letters, vaccinations) & back them up to a secure cloud folder",
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
    title: "Prepare driving history/abstract from home country (may help with insurance and license exchange)",
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
    title: "Map transit from temporary stay to Service Canada, bank, and prospective neighborhoods",
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
    linkHref: "/en/services/credit-building",
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
    title: "Build a realistic monthly plan (Needs / Wants / Savings & Debt) and automate key bills",
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
    title: "Enroll kids in school / childcare and update immunization records (if applicable)",
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
    linkHref: "/en/services/financial-planning",
    linkLabel: "Planning session",
  },
  {
    id: uid(),
    section: "months_3_6",
    title: "Prepare first Canadian tax filing (save pay stubs/receipts; confirm credits/benefits)",
    done: false,
    linkHref: "/en/services/taxes",
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

  // Restore
  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) {
        const v = JSON.parse(raw);
        if (Array.isArray(v)) setTasks(v as Task[]);
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

  // Derived
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
  }, [tasks, filter]);

  // Actions
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
    const ok = confirm("Reset checklist to the default template? This clears your saved progress.");
    if (ok) {
      setTasks(DEFAULT_TASKS);
      try {
        localStorage.removeItem(LS_KEY);
      } catch {}
    }
  };

  const exportCSV = () => {
    const headers = ["Section", "Task", "Done", "Due", "Note", "Link"];
    const lines = [headers.join(",")];
    tasks.forEach((t) => {
      const cells = [
        SECTION_META[t.section].title,
        t.title.replace(/"/g, '""'),
        t.done ? "Yes" : "No",
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
    a.download = "Newcomer_Checklist.csv";
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

  // Color tokens
  const toneToBorder: Record<string, string> = {
    emerald: "border-emerald-600",
    amber: "border-amber-600",
    sky: "border-sky-600",
    blue: "border-blue-600",
    gold: "border-amber-500",
  };
  const toneToText: Record<string, string> = {
    emerald: "text-emerald-700",
    amber: "text-amber-700",
    sky: "text-sky-700",
    blue: "text-blue-700",
    gold: "text-amber-700",
  };

  return (
    <ToolShell
      title="Newcomer Checklist"
      subtitle="A practical, finance-first roadmap for your first months in Canada — with due dates, notes, and autosave."
      lang="en"
    >
      {/* Top actions */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
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
            Export CSV
          </button>
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
            <span className="text-sm text-brand-blue/80">
              Overall progress
            </span>
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

      {/* Sections */}
      <form className="grid grid-cols-1 gap-6">
        {(Object.keys(SECTION_META) as SectionKey[]).map((key) => {
          const meta = SECTION_META[key];
          const list = overall.sections.find((s) => s.key === key)!;
          const isCollapsed = collapse[key];

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
                        <th className="p-2 w-[130px]">Due date</th>
                        <th className="p-2 w-[36%]">Notes</th>
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
                              aria-label={`Mark "${t.title}" as done`}
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
                                  title={t.linkLabel || "Open link"}
                                >
                                  {t.linkLabel || "Learn more"}
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
                              aria-label={`Set due date for ${t.title}`}
                            />
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
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile */}
                <div className="md:hidden grid gap-2">
                  {list.list.map((t) => (
                    <div key={t.id} className="relative rounded-xl border border-brand-gold/50 bg-white p-3">
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
                        <div>
                          <label htmlFor={`mchk-${t.id}`} className="font-medium">
                            {t.title}
                          </label>
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
                          <div className="grid grid-cols-2 gap-2 mt-2">
                            <div>
                              <div className="text-[11px] text-brand-blue/70">Due</div>
                              <input
                                type="date"
                                value={t.due || ""}
                                onChange={(e) => update(t.id, { due: e.target.value })}
                                className="border rounded-lg p-2 w-full bg-white"
                              />
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
                  ))}
                </div>

                {/* Add button for Custom section */}
                {key === "custom" && (
                  <div className="mt-3">
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
            <Link href="/en/services/taxes" className="underline">
              Tax support
            </Link>{" "}
            •{" "}
            <Link href="/en/services/financial-planning" className="underline">
              Financial planning session
            </Link>
          </li>
          <li>
            Client portal:{" "}
            <Link href="/en/clients/portal" className="underline">
              Log in to share docs & track progress
            </Link>
          </li>
        </ul>
        <p className="text-xs text-brand-blue/70 mt-3">
          Notes: Program rules (health cards, licensing, benefits) vary by province and can change. Treat this checklist as guidance—verify details with official sources.
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
