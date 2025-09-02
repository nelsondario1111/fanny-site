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
  FileText,
  Info,
  Search,
} from "lucide-react";

/**
 * Mortgage Readiness Checklist
 * - Sections with tasks, due dates, notes, custom items
 * - Autosave (localStorage) + "Saved" indicator
 * - CSV export, Print, Reset
 * - Mobile: stacked cards; Desktop: clean tables
 *
 * Educational only. Lender rules vary; confirm details with your broker/lender.
 */

// ---------- Types ----------
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
  due?: string; // YYYY-MM-DD
  linkHref?: string; // prefer internal routes
  linkLabel?: string;
  isCustom?: boolean;
  priority?: "high" | "normal";
};

// ---------- Storage ----------
const LS_KEY = "tools.mortgage_readiness.v1";

// ---------- Helpers ----------
const uid = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

function classNames(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

// ---------- Section metadata ----------
const SECTION_META: Record<
  SectionKey,
  { title: string; blurb?: string; tone: "emerald" | "amber" | "sky" | "blue" | "gold" }
> = {
  credit_score: {
    title: "Credit & score",
    blurb: "Aim for clean 12-month history, low utilization, and verified score.",
    tone: "emerald",
  },
  income_employment: {
    title: "Income & employment",
    blurb: "Gather proof of stable income and employment or business activity.",
    tone: "sky",
  },
  down_payment_closing: {
    title: "Down payment & closing costs",
    blurb: "Document source of funds and maintain 90–120 days history.",
    tone: "gold",
  },
  documents: {
    title: "Core documents",
    blurb: "ID, banking, housing history, and other basics lenders request.",
    tone: "blue",
  },
  timeline_steps: {
    title: "Timeline & next steps",
    blurb: "Pre-approval, rate hold, and your professional team.",
    tone: "amber",
  },
  custom: {
    title: "Your custom tasks",
    blurb: "Add anything unique to your situation.",
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

// ---------- Defaults ----------
function defaultTasks(): Task[] {
  return [
    // CREDIT & SCORE
    { id: uid(), section: "credit_score", title: "Check current credit score (soft pull within 60 days)", done: false, priority: "high" },
    { id: uid(), section: "credit_score", title: "No late payments in past 12 months", done: false },
    { id: uid(), section: "credit_score", title: "Credit utilization under ~30% (pay down high balances)", done: false, linkHref: "/en/services/credit-building", linkLabel: "Credit-building guidance" },
    { id: uid(), section: "credit_score", title: "Dispute/resolve any errors on your report", done: false },

    // INCOME & EMPLOYMENT
    { id: uid(), section: "income_employment", title: "Two recent pay stubs (employee)", done: false, priority: "high" },
    { id: uid(), section: "income_employment", title: "T4s for last 2 years (employee)", done: false },
    { id: uid(), section: "income_employment", title: "Letter of employment (role, start date, salary/hourly)", done: false, priority: "high" },
    { id: uid(), section: "income_employment", title: "Self-employed: last 2 years T1s & NOAs; T2125 (if applicable)", done: false, linkHref: "/en/tools/self-employed-checklist", linkLabel: "Self-Employed Toolkit" },

    // DOWN PAYMENT & CLOSING
    { id: uid(), section: "down_payment_closing", title: "Down payment saved (documented source)", done: false, priority: "high" },
    { id: uid(), section: "down_payment_closing", title: "90–120 days account history for down payment funds", done: false },
    { id: uid(), section: "down_payment_closing", title: "Gift letter prepared (if applicable)", done: false },
    { id: uid(), section: "down_payment_closing", title: "Closing cost buffer set aside (~1.5–4% of purchase price)", done: false },
    { id: uid(), section: "down_payment_closing", title: "Consider RRSP Home Buyers’ Plan (if eligible)", done: false },

    // DOCUMENTS
    { id: uid(), section: "documents", title: "Valid photo ID (passport/driver’s licence)", done: false },
    { id: uid(), section: "documents", title: "Proof of address (recent utility bill, etc.)", done: false },
    { id: uid(), section: "documents", title: "Void cheque or PAD form (for mortgage payments)", done: false },
    { id: uid(), section: "documents", title: "Rent history or current mortgage statement", done: false },
    { id: uid(), section: "documents", title: "Separation agreement / support docs (if applicable)", done: false },

    // TIMELINE & STEPS
    { id: uid(), section: "timeline_steps", title: "Complete mortgage pre-approval", done: false, priority: "high" },
    { id: uid(), section: "timeline_steps", title: "Rate hold timeline understood (typically 90–120 days)", done: false },
    { id: uid(), section: "timeline_steps", title: "Realtor and real-estate lawyer lined up", done: false },
    { id: uid(), section: "timeline_steps", title: "Budget monthly comfort level & run a stress-test scenario", done: false, linkHref: "/en/tools/affordability-stress-test", linkLabel: "Affordability & Stress Test" },
  ];
}

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
        <div className="h-2 bg-brand-green" style={{ width: `${pct}%`, transition: "width .3s ease" }} />
      </div>
      <span className="text-xs text-brand-blue/70">{pct}%</span>
    </div>
  );
}

// ---------- Page ----------
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

    // Upcoming within 14 days
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

  // Actions
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
    const ok = confirm("Reset the checklist to the default template? This clears your saved progress.");
    if (ok) {
      setTasks(defaultTasks());
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
    a.href = url; a.download = "Mortgage_Readiness_Checklist.csv"; a.click();
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
      title="Mortgage Readiness Checklist"
      subtitle="A practical, lender-ready checklist to prepare your credit, documents, and down payment — with autosave and export."
      lang="en"
    >
      {/* Header actions */}
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
          <button type="button" onClick={() => toggleAll(true)} className="text-sm underline text-brand-blue">
            Collapse all
          </button>
          <span className="text-brand-blue/40">|</span>
          <button type="button" onClick={() => toggleAll(false)} className="text-sm underline text-brand-blue">
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

      {/* Status / Snapshot */}
      <section className="rounded-2xl border border-brand-gold bg-white p-4 md:p-5 mb-6">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          <SummaryCard icon={<ShieldCheck className="h-5 w-5" />} label="Overall progress" value={`${overall.pct}%`} />
          <SummaryCard icon={<CreditCard className="h-5 w-5" />} label="Credit focus" value="Clean 12 months • <30% util." />
          <SummaryCard icon={<Building2 className="h-5 w-5" />} label="Pre-approval" value="Start early" href="/en/services/financial-planning" />
          <div className="rounded-xl border border-brand-gold/50 bg-brand-beige/40 p-3 md:p-4 flex items-center justify-between">
            <div>
              <div className="text-xs md:text-sm text-brand-blue/80">Checklist</div>
              <div className="mt-2"><ProgressBar value={overall.done} total={overall.total} /></div>
              <div className="text-xs text-brand-blue/70 mt-1">{overall.done}/{overall.total} completed</div>
            </div>
            <SavedIndicator savedAt={savedAt} />
          </div>
        </div>

        {overall.upcoming.length > 0 && (
          <div className="mt-4">
            <div className="text-sm font-semibold text-brand-green mb-1 flex items-center gap-2">
              <CalendarDays className="h-4 w-4" />
              Due in the next 14 days
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
                {/* Desktop table */}
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
                              onChange={(e) => updateRowNote(t.id, e.target.value)}
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

                {/* Mobile stacked cards */}
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
                        <div className="flex-1">
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
                                onChange={(e) => updateRowNote(t.id, e.target.value)}
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
            Check affordability & payments:{" "}
            <Link href="/en/tools/affordability-stress-test" className="underline">
              Affordability & Stress Test
            </Link>{" "}
            •{" "}
            <Link href="/en/tools/mortgage-calculator" className="underline">
              Mortgage Payment Calculator
            </Link>
          </li>
          <li>
            Build credit & improve utilization:{" "}
            <Link href="/en/services/credit-building" className="underline">
              Credit-building guidance
            </Link>
          </li>
          <li>
            Track cash flow & savings:{" "}
            <Link href="/en/tools/budget-calculator" className="underline">
              Holistic Budget Calculator
            </Link>{" "}
            •{" "}
            <Link href="/en/tools/net-worth" className="underline">
              Net Worth Tracker
            </Link>
          </li>
          <li>
            Upload securely & work with us:{" "}
            <Link href="/en/clients/portal" className="underline">
              Client portal
            </Link>{" "}
            •{" "}
            <Link href="/en/services/financial-planning" className="underline">
              Planning session
            </Link>
          </li>
        </ul>
        <p className="text-xs text-brand-blue/70 mt-3">
          This checklist is educational and general. Underwriting policies vary by lender and can change. Confirm specifics with your broker/lender.
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

  // tiny inline to keep event handlers tidy
  function updateRowNote(id: string, note: string) {
    update(id, { note });
  }
}

// ---------- Small child ----------
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
