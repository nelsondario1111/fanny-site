"use client";

import LanguageSwitchLink from "@/components/LanguageSwitchLink";

export default function LangSwitcher() {
  return (
    <LanguageSwitchLink
      className="inline-flex items-center justify-center rounded-full border border-brand-green/30 px-2.5 py-1 text-xs font-semibold text-brand-green hover:bg-brand-green/10 transition"
      aria-label="Switch language between English and Spanish"
    />
  );
}
