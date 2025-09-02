import Link from "next/link";

type Intent = "preapproval" | "question" | "package" | "consult";

export function buildContactHref(
  lang: "en" | "es",
  intent: Intent,
  pkgTitle?: string
) {
  const base = lang === "es" ? "/es/contacto" : "/en/contact";
  const qs = new URLSearchParams({ intent });
  if (pkgTitle) qs.set("package", pkgTitle); // already readable; ContactForm will decode
  return `${base}?${qs.toString()}`;
}

export default function ToContactButtons({
  lang = "en",
  pkgTitle,
  showPreapproval = true,
  showQuestions = true,
  className = "",
  align = "start", // "start" | "center" | "end"
}: {
  lang?: "en" | "es";
  pkgTitle?: string;
  showPreapproval?: boolean;
  showQuestions?: boolean;
  className?: string;
  align?: "start" | "center" | "end";
}) {
  const justify =
    align === "center" ? "justify-center" : align === "end" ? "justify-end" : "justify-start";

  return (
    <div className={`flex flex-wrap gap-3 ${justify} ${className}`}>
      {showPreapproval && (
        <Link
          href={buildContactHref(lang, "preapproval", pkgTitle)}
          className="inline-flex items-center rounded-full px-5 py-2.5 text-sm font-serif font-bold shadow bg-brand-green text-white hover:opacity-90 transition"
        >
          {lang === "es" ? "Iniciar preaprobación" : "Start Pre-Approval"}
        </Link>
      )}

      {showQuestions && (
        <Link
          href={buildContactHref(lang, "question", pkgTitle)}
          className="inline-flex items-center rounded-full px-5 py-2.5 text-sm border-2 border-brand-green text-brand-green hover:bg-brand-green hover:text-white transition"
        >
          {lang === "es" ? "Hacer preguntas" : "Ask Questions"}
        </Link>
      )}
    </div>
  );
}
