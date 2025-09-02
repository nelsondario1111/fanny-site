"use client";

import { ReactNode } from "react";
import { FaArrowLeft } from "react-icons/fa";
import Link from "next/link";

type ToolShellProps = {
  title: string;
  subtitle?: string;
  lang?: "en" | "es";
  children?: ReactNode;
};

export default function ToolShell({ title, subtitle, lang = "en", children }: ToolShellProps) {
  const backHref = lang === "es" ? "/es/herramientas" : "/en/tools";
  return (
    <main className="bg-brand-beige min-h-screen">
      <header className="pt-10 px-4">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-8 sm:py-12 bg-white/95 rounded-[28px] border border-brand-gold shadow-xl">
          <div className="flex items-center justify-between gap-4 mb-4">
            <Link href={backHref} className="inline-flex items-center gap-2 text-brand-green hover:opacity-80">
              <FaArrowLeft aria-hidden /> {lang === "es" ? "Volver a Herramientas" : "Back to Tools"}
            </Link>
          </div>
          <h1 className="font-serif font-extrabold text-3xl md:text-4xl text-brand-green tracking-tight">
            {title}
          </h1>
          {subtitle && <p className="text-brand-blue/90 text-lg mt-3">{subtitle}</p>}
        </div>
      </header>

      <section className="px-4 mt-8 pb-16">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-8 sm:py-12 bg-white/95 rounded-[28px] border border-brand-gold shadow-xl">
          {/* NOTE: replace this notice as you implement each tool */}
          {!children ? (
            <div className="text-brand-blue/90">
              <p className="mb-3">
                {lang === "es"
                  ? "Esta es una página base. Aquí agregaremos el formulario, calculadora o checklist."
                  : "This is a starter page. Add your calculator, form, or checklist here."}
              </p>
              <ul className="list-disc ml-6 space-y-1 text-sm">
                <li>
                  {lang === "es"
                    ? "Mantén el mismo encabezado, tipografía y colores para una experiencia unificada."
                    : "Keep header, type and colors consistent for a unified experience."}
                </li>
                <li>
                  {lang === "es"
                    ? "Si necesitas exportar, agrega botones para CSV/XLSX o impresión."
                    : "If you need exports, add buttons for CSV/XLSX or print."}
                </li>
                <li>
                  {lang === "es"
                    ? "Si el cálculo es sensible, explica supuestos y límites."
                    : "If the math is sensitive, explain assumptions and limits."}
                </li>
              </ul>
            </div>
          ) : (
            children
          )}
        </div>
      </section>
    </main>
  );
}
