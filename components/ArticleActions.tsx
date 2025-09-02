// components/ArticleActions.tsx
"use client";

import { useCallback, useState } from "react";
import Link from "next/link";

type Props = { title: string; lang: "en" | "es" };

export default function ArticleActions({ title, lang }: Props) {
  const [copied, setCopied] = useState(false);
  const backHref = lang === "en" ? "/en/resources" : "/es/recursos";

  // Opens system dialog; users pick “Save as PDF”
  const onSavePdf = useCallback(() => window.print(), []);

  const onShare = useCallback(async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    if (navigator.share) {
      try { await navigator.share({ title, url }); } catch {}
    } else {
      try {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch {}
    }
  }, [title]);

  const onCopy = useCallback(async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  }, []);

  return (
    <div className="print:hidden flex flex-wrap items-center gap-2 text-sm">
      <Link
        href={backHref}
        className="rounded-xl border px-3 py-1.5 hover:bg-neutral-50 dark:hover:bg-neutral-900"
      >
        {lang === "en" ? "← All resources" : "← Todos los recursos"}
      </Link>

      <button
        onClick={onSavePdf}
        className="rounded-xl border px-3 py-1.5 hover:bg-neutral-50 dark:hover:bg-neutral-900"
        aria-label={lang === "en" ? "Save as PDF" : "Guardar como PDF"}
        title={lang === "en" ? "Save as PDF" : "Guardar como PDF"}
      >
        {lang === "en" ? "Save as PDF" : "Guardar como PDF"}
      </button>

      <button
        onClick={onShare}
        className="rounded-xl border px-3 py-1.5 hover:bg-neutral-50 dark:hover:bg-neutral-900"
        aria-label={lang === "en" ? "Share" : "Compartir"}
      >
        {lang === "en" ? "Share" : "Compartir"}
      </button>

      <button
        onClick={onCopy}
        className="rounded-xl border px-3 py-1.5 hover:bg-neutral-50 dark:hover:bg-neutral-900"
        aria-label={lang === "en" ? "Copy link" : "Copiar enlace"}
      >
        {copied ? (lang === "en" ? "Copied!" : "¡Copiado!") : (lang === "en" ? "Copy link" : "Copiar enlace")}
      </button>
    </div>
  );
}
