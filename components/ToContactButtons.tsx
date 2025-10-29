import Link from "next/link";
import { cn } from "@/lib/utils"; // optional helper: classNames merge

type Intent = "preapproval" | "question" | "package" | "consult";
type Lang = "en" | "es";

export function buildContactHref(lang: Lang, intent: Intent, pkgTitle?: string) {
  const base = lang === "es" ? "/es/contacto" : "/en/contact";
  const qs = new URLSearchParams({ intent });
  if (pkgTitle) qs.set("package", pkgTitle);
  return `${base}?${qs.toString()}`;
}

const ctaVariants = {
  primary: "bg-brand-green text-white hover:opacity-90",
  outlineGreen:
    "border-2 border-brand-green text-brand-green hover:bg-brand-green hover:text-white",
  outlineBlue:
    "border-2 border-brand-blue text-brand-blue hover:bg-brand-blue hover:text-white",
  outlineWhatsApp:
    "border-2 border-green-600 text-green-700 hover:bg-green-100",
};

function ButtonLink({
  href,
  label,
  variant = "primary",
  external = false,
}: {
  href: string;
  label: string;
  variant?: keyof typeof ctaVariants;
  external?: boolean;
}) {
  const classes = cn(
    "inline-flex items-center rounded-full px-5 py-2.5 text-sm font-serif font-bold shadow transition",
    ctaVariants[variant]
  );

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={classes}
      >
        {label}
      </a>
    );
  }

  return (
    <Link href={href} className={classes}>
      {label}
    </Link>
  );
}

export default function ToContactButtons({
  lang = "en",
  pkgTitle,
  showPreapproval = true,
  showQuestions = true,
  className = "",
  align = "start", // "start" | "center" | "end"
}: {
  lang?: Lang;
  pkgTitle?: string;
  showPreapproval?: boolean;
  showQuestions?: boolean;
  className?: string;
  align?: "start" | "center" | "end";
}) {
  const justify =
    align === "center"
      ? "justify-center"
      : align === "end"
      ? "justify-end"
      : "justify-start";

  return (
    <div className={cn("flex flex-wrap gap-3", justify, className)}>
      {showPreapproval && (
        <ButtonLink
          href={buildContactHref(lang, "preapproval", pkgTitle)}
          label={
            lang === "es" ? "Iniciar preaprobación" : "Start Pre-Approval"
          }
          variant="primary"
        />
      )}

      {showQuestions && (
        <ButtonLink
          href={buildContactHref(lang, "question", pkgTitle)}
          label={lang === "es" ? "Hacer preguntas" : "Ask Questions"}
          variant="outlineGreen"
        />
      )}

      <ButtonLink
        href={lang === "es" ? "/es/reservar" : "/en/book"}
        label={lang === "es" ? "Reservar llamada de 15 min" : "Book 15-min Call"}
        variant="outlineBlue"
      />

      <ButtonLink
        href="https://wa.me/14167268420"
        label={lang === "es" ? "Enviar WhatsApp" : "Message on WhatsApp"}
        variant="outlineWhatsApp"
        external
      />
    </div>
  );
}
