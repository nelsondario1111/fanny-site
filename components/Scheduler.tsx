"use client";

import { useMemo } from "react";

type Props = {
  lang?: "en" | "es";
  tidycalPath: string; // e.g., "fanny-samaniego/intro-call-30"
  title: string;
  subtitle?: string;
  className?: string;
};

export default function Scheduler({
  lang = "en",
  tidycalPath,
  title,
  subtitle,
  className = "",
}: Props) {
  // Build a stable URL for the iframe (no random params)
  const tidyUrl = useMemo(() => {
    const base = "https://tidycal.com";
    // Embeddable view keeps it clean; remove hash params to avoid hydration diffs
    return `${base}/${tidycalPath}?embed=true`;
  }, [tidycalPath]);

  return (
    <div className={["space-y-4", className].join(" ")}>
      <header className="text-center">
        <h1 className="font-serif text-3xl md:text-4xl font-extrabold text-brand-green tracking-tight">
          {title}
        </h1>
        {subtitle && (
          <p className="text-brand-blue/90 text-lg md:text-xl mt-2">{subtitle}</p>
        )}
      </header>

      {/* SSR-safe iframe embed */}
      <div className="rounded-2xl border border-brand-gold overflow-hidden shadow">
        <iframe
          title={lang === "es" ? "Agenda de citas" : "Booking calendar"}
          src={tidyUrl}
          className="w-full"
          style={{ minHeight: 840, border: 0 }}
          loading="lazy"
        />
      </div>

      {/* Fallback links (in case the embed is blocked by extensions) */}
      <div className="text-center text-sm text-brand-body/80">
        {lang === "es" ? (
          <>
            ¿No ves el calendario?{" "}
            <a
              href={`https://tidycal.com/${tidycalPath}`}
              target="_blank"
              rel="noopener noreferrer"
              className="underline text-brand-blue hover:text-brand-green"
            >
              Ábrelo en una pestaña nueva
            </a>
            .
          </>
        ) : (
          <>
            Can’t see the calendar?{" "}
            <a
              href={`https://tidycal.com/${tidycalPath}`}
              target="_blank"
              rel="noopener noreferrer"
              className="underline text-brand-blue hover:text-brand-green"
            >
              Open it in a new tab
            </a>
            .
          </>
        )}
      </div>
    </div>
  );
}
