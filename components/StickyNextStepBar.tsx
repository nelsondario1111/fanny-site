"use client";

import Link from "next/link";

type Lang = "en" | "es";

type StickyNextStepBarProps = {
  lang: Lang;
  checklistHref: string;
  checklistLabel?: string;
};

export default function StickyNextStepBar({
  lang,
  checklistHref,
  checklistLabel,
}: StickyNextStepBarProps) {
  const isEn = lang === "en";
  const discoveryHref = isEn
    ? "/en/contact?intent=consult&package=Free%20Discovery%20Call%20(15%20min)"
    : "/es/contacto?intent=consult&package=Llamada%20de%20Descubrimiento%20Gratis%20(15%20min)";
  const fallbackChecklistLabel = isEn ? "Open Checklist" : "Abrir checklist";

  return (
    <aside className="pointer-events-none fixed inset-x-0 bottom-3 z-40 px-3 print:hidden">
      <div className="pointer-events-auto mx-auto max-w-5xl rounded-2xl border border-brand-gold/40 bg-white/95 p-3 shadow-lg backdrop-blur">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <p className="text-xs text-brand-blue/85">
            {isEn ? "Next best step" : "Siguiente mejor paso"}
          </p>
          <div className="flex flex-wrap gap-2">
            <Link
              href={discoveryHref}
              className="inline-flex items-center justify-center rounded-full border border-brand-green/20 bg-brand-green px-4 py-2 text-xs font-semibold text-white transition hover:bg-brand-gold hover:text-brand-green focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold"
              data-track="cta_click"
              data-track-type="book_discovery"
            >
              {isEn ? "Book Discovery Call" : "Reservar llamada"}
            </Link>
            <a
              href="https://wa.me/14167268420"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-full border border-brand-blue/40 bg-white px-4 py-2 text-xs font-semibold text-brand-blue transition hover:bg-brand-blue hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue/40"
              data-track="cta_click"
              data-track-type="whatsapp"
            >
              WhatsApp
            </a>
            <Link
              href={checklistHref}
              className="inline-flex items-center justify-center rounded-full border border-brand-gold/40 bg-white px-4 py-2 text-xs font-semibold text-brand-green transition hover:bg-brand-gold hover:text-brand-green focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold"
              data-track="cta_click"
              data-track-type="checklist"
              data-track-label={checklistLabel ?? fallbackChecklistLabel}
            >
              {checklistLabel ?? fallbackChecklistLabel}
            </Link>
          </div>
        </div>
      </div>
    </aside>
  );
}
