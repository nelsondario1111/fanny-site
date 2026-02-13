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
  Info,
} from "lucide-react";

/**
 * Tax Season Prep — Budget & Tax Service
 * - Year selector with key dates (RRSP deadline, April 30, June 15)
 * - Sections, progress, due dates, notes, and custom tasks
 * - Mobile: stacked cards; Desktop: clean tables
 * - Autosave (localStorage) + "Saved" indicator
 * - CSV export, Print, Reset
 *
 * Note: This is educational, not legal/tax advice. Provincial/federal rules change.
 */

// ---------- Types ----------
type SectionKey =
  | "year_setup"
  | "personal_cra"
  | "income_slips"
  | "deductions_credits"
  | "self_employed"
  | "investments_property"
  | "students_families"
  | "finalize_file"
  | "after_filing"
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

const LEGACY_LINK_MAP: Record<string, string> = {
  "/en/clients/portal": "/en/client-library",
  "/en/services/taxes": "/en/services#business",
  "/en/services/financial-planning": "/en/services#strategic-maps",
};

function normalizeTaskLinks(list: Task[]): Task[] {
  return list.map((task) => {
    if (!task.linkHref) return task;
    const mapped = LEGACY_LINK_MAP[task.linkHref];
    if (!mapped) return task;
    return { ...task, linkHref: mapped };
  });
}

// ---------- Storage ----------
const LS_KEY = (year: number) => `tools.tax_prep_${year}.v1`;

// ---------- Helpers ----------
const uid = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

function classNames(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

function ymd(d: Date) {
  // format: YYYY-MM-DD
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

const EN_CA_DATE_FORMAT = new Intl.DateTimeFormat("en-CA", {
  year: "numeric",
  month: "long",
  day: "numeric",
  timeZone: "America/Toronto",
});

// Robust CSV (quotes + CRLF + BOM for Excel)
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

// Key date helpers
function rrspDeadlineForTaxYear(taxYear: number) {
  // RRSP deadline is the 60th day of the following calendar year
  const d = new Date(taxYear + 1, 0, 60); // Jan=0; handles leap years
  return d;
}
function filingDueDate(taxYear: number) {
  // Most individuals: April 30 of following year
  return new Date(taxYear + 1, 3, 30); // Apr=3
}
function selfEmployedDueDate(taxYear: number) {
  // Self-employed filing due: June 15 of following year (balance still due Apr 30)
  return new Date(taxYear + 1, 5, 15); // Jun=5
}

// ---------- Section metadata ----------
const SECTION_META: Record<
  SectionKey,
  { title: string; blurb?: string; tone: "emerald" | "amber" | "sky" | "blue" | "gold" }
> = {
  year_setup: {
    title: "Year setup & key dates",
    blurb: "Pick your tax year and note the important deadlines.",
    tone: "gold",
  },
  personal_cra: {
    title: "Personal info & CRA access",
    blurb: "Ensure CRA access and personal details are accurate before filing.",
    tone: "emerald",
  },
  income_slips: {
    title: "Income slips (T-slips)",
    blurb: "Collect all slips — employment, benefits, investments, pensions, and more.",
    tone: "sky",
  },
  deductions_credits: {
    title: "Deductions & credits",
    blurb: "Gather receipts and summaries you can claim.",
    tone: "amber",
  },
  self_employed: {
    title: "Self-employed & gig",
    blurb: "Income, expenses, home/vehicle logs, GST/HST (if applicable).",
    tone: "blue",
  },
  investments_property: {
    title: "Investments, rental & foreign",
    blurb: "Capital gains, ACB, rental statements, and foreign reporting.",
    tone: "emerald",
  },
  students_families: {
    title: "Students & families",
    blurb: "Tuition, transfers, childcare, and benefits.",
    tone: "sky",
  },
  finalize_file: {
    title: "Finalize & file",
    blurb: "Review, sign, upload, and file.",
    tone: "amber",
  },
  after_filing: {
    title: "After filing",
    blurb: "Notice of Assessment, installments, and tidy records.",
    tone: "blue",
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

// ---------- Default tasks (now include dated “deadline” items) ----------
function defaultTasks(taxYear: number): Task[] {
  const rrsp = rrspDeadlineForTaxYear(taxYear);
  const apr30 = filingDueDate(taxYear);
  const jun15 = selfEmployedDueDate(taxYear);

  const base: Array<Omit<Task, "id">> = [
    // YEAR SETUP — dated reminders
    {
      section: "year_setup",
      title: `RRSP contribution deadline for ${taxYear}`,
      note: "First 60 days of the following year count toward this tax year.",
      done: false,
      due: ymd(rrsp),
      priority: "high",
    },
    {
      section: "year_setup",
      title: `File tax return (most individuals) — ${taxYear}`,
      note: "Balance owing still due by April 30.",
      done: false,
      due: ymd(apr30),
      priority: "high",
    },
    {
      section: "year_setup",
      title: `Self-employed filing deadline — ${taxYear}`,
      note: "If self-employed, filing due by June 15; any balance still due April 30.",
      done: false,
      due: ymd(jun15),
    },

    // YEAR SETUP — general
    {
      section: "year_setup",
      title: `Confirm tax year is ${taxYear}; note RRSP deadline & filing dates`,
      note: "",
      done: false,
      priority: "high",
    },
    {
      section: "year_setup",
      title: "Review prior Notice of Assessment & carry-forward amounts (RRSP/TFSA/tuition)",
      linkHref: "/en/client-library",
      linkLabel: "Client library",
      done: false,
    },

    // PERSONAL & CRA
    {
      section: "personal_cra",
      title: "CRA My Account access verified (email/phone up to date, 2FA on)",
      done: false,
      linkHref: "/en/services#business",
      linkLabel: "Tax support",
      priority: "high",
    },
    {
      section: "personal_cra",
      title: "Direct deposit info current; address & marital status changes updated",
      done: false,
    },

    // INCOME SLIPS
    { section: "income_slips", title: "T4 (employment income)", done: false, priority: "high" },
    { section: "income_slips", title: "T4A (other income, scholarships, commissions)", done: false },
    { section: "income_slips", title: "T5 (interest/dividends), T3 (trust), T5008 (securities)", done: false },
    { section: "income_slips", title: "T4E (EI), T4AP (CPP), T4A(OAS) (OAS), T4RSP/T4RIF (RRSP/RRIF)", done: false },
    { section: "income_slips", title: "Foreign income statements (employment/investments)", done: false },

    // DEDUCTIONS & CREDITS
    { section: "deductions_credits", title: "RRSP contribution receipts (first 60 days & rest of year)", done: false, priority: "high" },
    { section: "deductions_credits", title: "Childcare receipts & caregiver support", done: false },
    { section: "deductions_credits", title: "Tuition: T2202 (student) & transfer forms (if applicable)", done: false },
    { section: "deductions_credits", title: "Medical expenses summary (by family), insurance reimbursements", done: false },
    { section: "deductions_credits", title: "Charitable donation receipts", done: false },
    { section: "deductions_credits", title: "Union dues / professional fees / employment expenses (T2200S)", done: false },

    // SELF-EMPLOYED
    { section: "self_employed", title: "Income summary (invoices, platform reports) for the year", done: false, priority: "high" },
    { section: "self_employed", title: "Expense log & receipts (office, supplies, software, insurance)", done: false },
    { section: "self_employed", title: "Vehicle log (km), fuel/maintenance/insurance; business-use-of-home worksheet", done: false },
    { section: "self_employed", title: "GST/HST registration & filings (if applicable)", done: false },

    // INVESTMENTS & PROPERTY
    { section: "investments_property", title: "Capital gains summary & ACB tracking (incl. crypto)", done: false, priority: "high" },
    { section: "investments_property", title: "Rental income & expenses (T776 worksheet): leases, statements, repairs", done: false },
    { section: "investments_property", title: "Foreign assets reporting (T1135) — if over threshold", done: false },

    // STUDENTS & FAMILIES
    { section: "students_families", title: "Update CCB/benefits information (dependents, marital status)", done: false },
    { section: "students_families", title: "Tuition transfers (parent/spouse) with signatures", done: false },
    { section: "students_families", title: "RESP withdrawals (educational assistance payments) statements", done: false },

    // FINALIZE & FILE
    { section: "finalize_file", title: "Upload all documents to client portal and verify completeness", done: false, linkHref: "/en/client-library", linkLabel: "Upload docs", priority: "high" },
    { section: "finalize_file", title: "Review summary, sign engagement forms (e.g., T183) if applicable", done: false },
    { section: "finalize_file", title: "Set payment method and confirm balance/refund details", done: false },

    // AFTER FILING
    { section: "after_filing", title: "Save Notice of Assessment & return copy to secure folder", done: false },
    { section: "after_filing", title: "Set installment reminders or adjust withholdings (TD1) if needed", done: false },
    { section: "after_filing", title: "Plan next year: update RRSP/TFSA strategy, contributions, and goals", done: false, linkHref: "/en/services#strategic-maps", linkLabel: "Planning session" },
  ];

  // Keep IDs deterministic so SSR and client hydration produce identical markup.
  return base.map((task, idx) => ({
    ...task,
    id: `${taxYear}-${task.section}-${idx}`,
  }));
}

function normalizeStoredTasks(list: Task[], taxYear: number): Task[] {
  const defaultIdBySignature = new Map(
    defaultTasks(taxYear).map((task) => [
      `${task.section}::${task.title}::${task.due ?? ""}`,
      task.id,
    ])
  );

  const seen = new Set<string>();
  return normalizeTaskLinks(list).map((task, idx) => {
    const signature = `${task.section}::${task.title}::${task.due ?? ""}`;
    const preferredId = task.isCustom ? task.id : defaultIdBySignature.get(signature) ?? task.id;

    let nextId = preferredId;
    if (seen.has(nextId)) nextId = `${preferredId}-dup-${idx}`;
    seen.add(nextId);

    return nextId === task.id ? task : { ...task, id: nextId };
  });
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
  // Year defaults to last calendar year (typical filing)
  const currentYear = new Date().getUTCFullYear();
  const defaultTaxYear = currentYear - 1;
  const [taxYear, setTaxYear] = useState<number>(defaultTaxYear);

  const [tasks, setTasks] = useState<Task[]>(defaultTasks(defaultTaxYear));
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const [filter, setFilter] = useState("");
  const [collapse, setCollapse] = useState<Record<SectionKey, boolean>>({
    year_setup: false,
    personal_cra: false,
    income_slips: false,
    deductions_credits: false,
    self_employed: false,
    investments_property: false,
    students_families: false,
    finalize_file: false,
    after_filing: false,
    custom: false,
  });

  // Restore per-year
  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY(taxYear));
      if (raw) {
        const v = JSON.parse(raw);
        if (Array.isArray(v)) setTasks(normalizeStoredTasks(v as Task[], taxYear));
        else setTasks(defaultTasks(taxYear));
      } else {
        setTasks(defaultTasks(taxYear));
      }
    } catch {
      setTasks(defaultTasks(taxYear));
    }
  }, [taxYear]);

  // Persist
  useEffect(() => {
    try {
      localStorage.setItem(LS_KEY(taxYear), JSON.stringify(tasks));
      setSavedAt(Date.now());
    } catch {}
  }, [tasks, taxYear]);

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

  const keyDates = useMemo(() => {
    const rrsp = rrspDeadlineForTaxYear(taxYear);
    const apr30 = filingDueDate(taxYear);
    const jun15 = selfEmployedDueDate(taxYear);
    return { rrsp, apr30, jun15 };
  }, [taxYear]);

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
    const ok = confirm(
      `Reset the ${taxYear} checklist to the default template? This clears your saved progress for ${taxYear}.`
    );
    if (ok) {
      setTasks(defaultTasks(taxYear));
      try {
        localStorage.removeItem(LS_KEY(taxYear));
      } catch {}
    }
  };

  const exportCSV = () => {
    const rows: Array<Array<string | number>> = [
      ["Tax Year", taxYear],
      ["RRSP Deadline", ymd(keyDates.rrsp)],
      ["Filing Deadline (most)", ymd(keyDates.apr30)],
      ["Self-employed Filing", ymd(keyDates.jun15)],
      ["—", "—"],
      ["Section", "Task", "Done", "Due", "Note", "Link"],
      ...tasks.map((t) => [
        SECTION_META[t.section].title,
        t.title,
        t.done ? "Yes" : "No",
        t.due || "",
        t.note || "",
        t.linkLabel ? `${t.linkLabel} (${t.linkHref || ""})` : "",
      ]),
    ];
    downloadCSV(`Tax_Prep_${taxYear}`, rows);
  };

  const toggleAll = (val: boolean) =>
    setCollapse({
      year_setup: val,
      personal_cra: val,
      income_slips: val,
      deductions_credits: val,
      self_employed: val,
      investments_property: val,
      students_families: val,
      finalize_file: val,
      after_filing: val,
      custom: val,
    });

  // ---------- Render ----------
  return (
    <ToolShell
      title="Tax Season Prep"
      subtitle="A practical, Canada-focused checklist to gather documents, track deductions, and hit key deadlines — with autosave and export."
      lang="en"
    >
      {/* Header controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center flex-wrap gap-2">
          <label className="text-sm text-brand-blue/80" htmlFor="tax-year">Tax year</label>
          <select
            id="tax-year"
            value={taxYear}
            onChange={(e) => setTaxYear(parseInt(e.target.value))}
            className="tool-field-sm w-auto"
          >
            {/* Offer a few recent years plus current (filing is for prior year) */}
            {[currentYear, currentYear - 1, currentYear - 2, currentYear - 3].map((y) => (
              <option key={y} value={y - 1}>{y - 1}</option>
            ))}
          </select>

          <div className="hidden sm:flex items-center gap-2 text-xs sm:text-sm text-brand-blue/80 ml-2">
            <Info className="h-4 w-4" />
            <span>Most individuals file for the prior calendar year.</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={exportCSV}
            className="tool-btn-green"
            title="Export as CSV"
          >
            <Download className="h-4 w-4" />
            Export (CSV)
          </button>
          <button
            type="button"
            onClick={() => window.print()}
            className="tool-btn-blue"
            title="Print or Save PDF"
          >
            <Printer className="h-4 w-4" />
            Print or Save PDF
          </button>
          <button
            type="button"
            onClick={resetAll}
            className="tool-btn-gold"
            title="Reset values"
          >
            <RotateCcw className="h-4 w-4" />
            Reset values
          </button>
        </div>
      </div>

      {/* Key dates & status */}
      <section className="tool-card-compact mb-6">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          <DateCard label="RRSP deadline" date={keyDates.rrsp} helper={`60th day of ${taxYear + 1}`} />
          <DateCard label="Filing deadline (most)" date={keyDates.apr30} helper={`April 30, ${taxYear + 1}`} />
          <DateCard label="Self-employed filing" date={keyDates.jun15} helper={`June 15, ${taxYear + 1} (balance due April 30)`} />
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

      {/* Controls row below header */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
        <div className="flex items-center gap-2 flex-wrap">
          <input
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Filter tasks…"
            className="tool-field-sm min-w-[220px]"
            aria-label="Filter tasks"
          />
          <button type="button" onClick={() => toggleAll(true)} className="text-sm underline text-brand-blue">
            Collapse all
          </button>
          <span className="text-brand-blue/40">|</span>
          <button type="button" onClick={() => toggleAll(false)} className="text-sm underline text-brand-blue">
            Expand all
          </button>
        </div>

        <div className="text-xs text-brand-blue/70">
          Need help?{" "}
          <Link href="/en/services#business" className="underline">
            Work with our tax team
          </Link>
          .
        </div>
      </div>

      {/* Sections */}
      <form className="grid grid-cols-1 gap-6">
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
      <section className="tool-card-compact mt-6">
        <h4 className="font-sans text-base md:text-lg text-brand-green font-semibold mb-2">
          Helpful tools & services
        </h4>
        <ul className="list-disc ml-5 text-sm space-y-1">
          <li>
            Need hands-on help?{" "}
            <Link href="/en/services#business" className="underline">
              Work with our tax team
            </Link>{" "}
            (secure portal, guided document list, review & file).
          </li>
          <li>
            Plan contributions & cash flow:{" "}
            <Link href="/en/tools/budget-calculator" className="underline">
              Holistic Budget Calculator
            </Link>{" "}
            •{" "}
            <Link href="/en/tools/net-worth" className="underline">
              Net Worth Tracker
            </Link>
          </li>
          <li>
            Upload securely:{" "}
            <Link href="/en/client-library" className="underline">
              Client library
            </Link>
          </li>
          <li>
            Optimize year-round:{" "}
            <Link href="/en/services#strategic-maps" className="underline">
              Financial planning session
            </Link>
          </li>
        </ul>
        <p className="text-xs text-brand-blue/70 mt-3">
          This checklist is educational and general. Credits/deductions vary and can change.
          Confirm eligibility with official sources and your professional advisor.
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

// ---------- Small child component ----------
function DateCard({ label, date, helper }: { label: string; date: Date; helper?: string }) {
  return (
    <div className="rounded-xl border border-brand-gold/50 bg-white p-3 md:p-4">
      <div className="text-xs md:text-sm text-brand-blue/80">{label}</div>
      <div className="text-xl md:text-2xl font-bold text-brand-green mt-1">
        {EN_CA_DATE_FORMAT.format(date)}
      </div>
      {helper && <div className="text-[11px] md:text-xs text-brand-blue/70 mt-1">{helper}</div>}
    </div>
  );
}
