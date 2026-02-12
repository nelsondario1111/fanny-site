"use client";

import { BadgeCheck, Languages, Shield, Landmark } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { cubicBezier, m, useReducedMotion } from "framer-motion";

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
  const reduce = useReducedMotion();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const shouldAnimate = mounted && !reduce;
  const easeOut = cubicBezier(0.22, 1, 0.36, 1);
  const listVariants = {
    hidden: {},
    visible: shouldAnimate ? { transition: { staggerChildren: 0.07, delayChildren: 0.05 } } : {},
  };
  const itemVariants = {
    hidden: { opacity: shouldAnimate ? 0 : 1, y: shouldAnimate ? 8 : 0 },
    visible: {
      opacity: 1,
      y: 0,
      transition: shouldAnimate ? { duration: 0.45, ease: easeOut } : { duration: 0 },
    },
  };

  return (
    <m.div
      className={`mt-5 flex flex-wrap items-center justify-center gap-2 ${className}`.trim()}
      aria-label={lang === "en" ? "Trust signals" : "Sellos de confianza"}
      initial={shouldAnimate ? "hidden" : false}
      animate="visible"
      variants={listVariants}
    >
      {CHIP_COPY[lang].map((item) => (
        <m.span
          key={item.text}
          className="inline-flex items-center gap-1.5 rounded-full border border-brand-gold/40 bg-white px-3 py-1.5 text-xs text-brand-green"
          variants={itemVariants}
        >
          {item.icon}
          {item.text}
        </m.span>
      ))}
    </m.div>
  );
}
