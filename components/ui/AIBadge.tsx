"use client";

import * as React from "react";

type Locale = "en" | "es";

export default function AIBadge({
  locale = "en",
  className = "",
}: {
  locale?: Locale;
  className?: string;
}) {
  const [open, setOpen] = React.useState(false);
  const titleId = React.useId();
  const bodyId = React.useId();

  const copy = {
    en: {
      label: "Human-Reviewed AI Assist",
      title: "How we use AI (with human review)",
      body: [
        "We use privacy-respecting AI tools to speed up prep—summaries, checklists, EN/ES translation, and draft budgets.",
        "Every recommendation and any numbers are reviewed by Fanny or a qualified professional.",
        "We do not automate credit decisions; lenders always make final approvals.",
        "You can opt out any time—just let us know.",
      ],
      close: "Close",
    },
    es: {
      label: "IA con revisión humana",
      title: "Cómo usamos IA (con revisión humana)",
      body: [
        "Usamos IA que respeta la privacidad para agilizar: resúmenes, listas, traducción ES/EN y presupuestos preliminares.",
        "Toda recomendación y cifra es revisada por Fanny o un profesional calificado.",
        "No automatizamos decisiones de crédito; los prestamistas tienen la aprobación final.",
        "Puedes optar por no participar cuando quieras—solo avísanos.",
      ],
      close: "Cerrar",
    },
  }[locale];

  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={[
          "inline-flex items-center gap-1 rounded-full border border-brand-green/30 px-3 py-1 text-xs",
          "text-brand-green hover:bg-brand-green hover:text-white transition",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold",
          className,
        ].join(" ")}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={titleId}
      >
        <span aria-hidden>✨</span> {copy.label}
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[100] grid place-items-center p-4 bg-black/40"
          onClick={() => setOpen(false)}
          aria-hidden
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            aria-describedby={bodyId}
            className="w-full max-w-lg rounded-2xl border border-brand-gold bg-white p-5 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div id={titleId} className="font-sans text-xl font-bold text-brand-green">
              {copy.title}
            </div>
            <div id={bodyId} className="mt-3 space-y-2 text-sm text-brand-blue/90">
              {copy.body.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
            <div className="mt-4 flex justify-end">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-full px-4 py-2 text-sm border border-brand-green/30 hover:bg-brand-green hover:text-white transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold"
              >
                {copy.close}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
