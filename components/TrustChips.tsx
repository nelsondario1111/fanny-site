"use client";

import { BadgeCheck, Languages, Shield, Landmark } from "lucide-react";
import type { ReactNode } from "react";

type Lang = "en" | "es";

type TrustChipsProps = {
  lang: Lang;
  className?: string;
};

const CHIP_COPY: Record<Lang, Array<{ icon: ReactNode; text: string }>> = {
  en: [
    { icon: <Landmark size={14} aria-hidden />, text: "Former CRA Income Tax Auditor" },
    { icon: <BadgeCheck size={14} aria-hidden />, text: "Licensed Mortgage Agent (L2)" },
    { icon: <Languages size={14} aria-hidden />, text: "Bilingual EN/ES" },
    { icon: <Shield size={14} aria-hidden />, text: "Private & confidential" },
  ],
  es: [
    { icon: <Landmark size={14} aria-hidden />, text: "Exauditora de Impuesto sobre la Renta (CRA)" },
    { icon: <BadgeCheck size={14} aria-hidden />, text: "Agente hipotecaria licenciada (L2)" },
    { icon: <Languages size={14} aria-hidden />, text: "Bilingue ES/EN" },
    { icon: <Shield size={14} aria-hidden />, text: "Privado y confidencial" },
  ],
};

export default function TrustChips({ lang, className = "" }: TrustChipsProps) {
  return (
    <div
      className={`mt-5 flex flex-wrap items-center justify-center gap-2 ${className}`.trim()}
      aria-label={lang === "en" ? "Trust signals" : "Sellos de confianza"}
    >
      {CHIP_COPY[lang].map((item) => (
        <span
          key={item.text}
          className="inline-flex items-center gap-1.5 rounded-full border border-brand-gold/40 bg-white px-3 py-1.5 text-xs text-brand-green"
        >
          {item.icon}
          {item.text}
        </span>
      ))}
    </div>
  );
}
