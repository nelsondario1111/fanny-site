// components/PrimaryCtaButton.tsx
import Link from "next/link";

type Props = {
  lang?: "en" | "es";
  /** Where should the CTA go? Default: "book" */
  intent?: "book" | "contact";
  /** If you want to pass a service to the contact page: e.g., "clarity-session" */
  serviceSlug?: string;
  /** Optional class override to tweak styles per page */
  className?: string;
  /** Optional custom label; otherwise we localize for you */
  children?: React.ReactNode;
};

export default function PrimaryCtaButton({
  lang = "en",
  intent = "book",
  serviceSlug,
  className = "",
  children,
}: Props) {
  // Locale-aware targets
  const hrefBase =
    intent === "book"
      ? lang === "es"
        ? "/es/reservar"
        : "/en/book"
      : lang === "es"
      ? "/es/contacto"
      : "/en/contact";

  const href =
    serviceSlug && intent === "contact"
      ? `${hrefBase}?service=${encodeURIComponent(serviceSlug)}`
      : hrefBase;

  // Localized default labels
  const defaultLabel =
    intent === "book"
      ? lang === "es"
        ? "Reserva una Consulta Gratis"
        : "Book a Free Consultation"
      : lang === "es"
      ? "Contáctanos"
      : "Contact Us";

  return (
    <Link
      href={href}
      className={[
        "inline-block px-10 py-3 rounded-full font-sans font-bold shadow",
        "bg-brand-green text-white border-2 border-brand-gold",
        "hover:bg-brand-gold hover:text-brand-green transition",
        className,
      ].join(" ")}
      aria-label={typeof children === "string" ? children : defaultLabel}
    >
      {children ?? defaultLabel}
    </Link>
  );
}
