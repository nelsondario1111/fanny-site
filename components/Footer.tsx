"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Phone, MessageCircle, Calendar, ArrowRight } from "lucide-react";
import LangSwitcher from "@/components/layout/LangSwitcher";

type L = "en" | "es";

// Rename helper so it's not mistaken for a React hook
function langFromPath(pathname: string): L {
  return pathname.startsWith("/es") ? "es" : "en";
}

export default function Footer({ lang: forcedLang }: { lang?: L }) {
  const pathname = usePathname() || "/en";
  const derivedLang = langFromPath(pathname);
  const lang = forcedLang ?? derivedLang;
  const t = (en: string, es: string) => (lang === "en" ? en : es);
  const base = `/${lang}`;

  // CTA path -> Contact
  const ctaHref = `${base}/${t("contact", "contacto")}?intent=consult`;

  // Primary top-level links
  const linksPrimary = [
    { href: `${base}/${t("services", "servicios")}`, label: t("Services", "Servicios") },
    { href: `${base}/${t("resources", "recursos")}`, label: t("Resources", "Recursos") },
    { href: `${base}/${t("tools", "herramientas")}`, label: t("Tools", "Herramientas") },
    { href: `${base}/${t("about", "sobre-mi")}`, label: t("About", "Sobre mí") },
    { href: `${base}/${t("testimonials", "testimonios")}`, label: t("Testimonials", "Testimonios") },
    { href: `${base}/${t("contact", "contacto")}`, label: t("Contact", "Contacto") },
  ];

  // Services quick links (now includes Signature & Workshops)
  const serviceLinks =
    lang === "en"
      ? [
          { href: "/en/services#signature", label: "Signature Packages" },
          { href: "/en/services#foundations", label: "Wealth Foundations" },
          { href: "/en/services#mortgage", label: "Mortgage & Property Strategy" },
          { href: "/en/services#business", label: "Business & Professionals" },
          { href: "/en/services#legacy", label: "Legacy & Tax Strategy" },
          { href: "/en/services#family", label: "Holistic Conversations (Family & Groups)" },
          { href: "/en/services#workshops", label: "Workshops" },
          { href: "/en/services#advice", label: "1:1 Advisory" },
          { href: "/en/services#newcomers", label: "Newcomers" },
        ]
      : [
          { href: "/es/servicios#signature", label: "Paquetes Firma" },
          { href: "/es/servicios#fundamentos", label: "Fundamentos de Riqueza" },
          { href: "/es/servicios#hipoteca", label: "Hipoteca & Propiedades" },
          { href: "/es/servicios#negocios", label: "Negocios & Profesionales" },
          { href: "/es/servicios#legado", label: "Legado & Impuestos" },
          { href: "/es/servicios#familia", label: "Conversaciones Holísticas" },
          { href: "/es/servicios#talleres", label: "Talleres" },
          { href: "/es/servicios#asesoria", label: "Asesoría 1:1" },
          { href: "/es/servicios#recien", label: "Recién Llegados" },
        ];

  const linksLegal = [
    { href: `${base}/${t("privacy", "privacidad")}`, label: t("Privacy", "Privacidad") },
    // { href: `${base}/${t("terms", "terminos")}`, label: t("Terms", "Términos") },
  ];

  return (
    <footer className="border-t bg-white">
      {/* Top band: CTA + quick contact */}
      <div className="bg-brand-green text-white">
        <div className="max-w-content mx-auto px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-sm">
            {t(
              "Ready to talk through your plan? Book a free discovery call.",
              "¿Lista/o para revisar tu plan? Reserva una llamada de descubrimiento."
            )}
          </p>
          <div className="flex items-center gap-3">
            <a
              className="inline-flex items-center gap-1 hover:underline"
              href="tel:14167268420"
              aria-label={t("Call (416) 726-8420", "Llamar al (416) 726-8420")}
            >
              <Phone size={14} /> (416) 726-8420
            </a>
            <a
              className="inline-flex items-center gap-1 hover:underline"
              href="https://wa.me/14167268420"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
            >
              <MessageCircle size={14} /> WhatsApp
            </a>
            <Link
              href={ctaHref}
              className="inline-flex items-center gap-1 rounded-full bg-brand-gold text-brand-green px-3 py-1.5 text-xs font-semibold hover:opacity-90 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold"
            >
              <Calendar size={14} /> {t("Book now", "Reservar")}
            </Link>
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="max-w-content mx-auto px-4 py-12 grid gap-10 lg:grid-cols-4">
        {/* Brand / mission */}
        <div>
          <p className="font-serif text-lg font-bold text-brand-green">Fanny Samaniego</p>
          <p className="text-sm text-brand-body mt-2">
            {t(
              "Human-centered financial coaching & mortgage guidance in Toronto. Clear numbers, calm decisions.",
              "Coaching financiero con enfoque humano e hipotecas en Toronto. Números claros, decisiones en calma."
            )}
          </p>
          <div className="mt-4">
            <LangSwitcher />
          </div>
        </div>

        {/* Explore */}
        <nav className="grid grid-cols-2 gap-6 text-sm lg:col-span-2">
          <ul className="space-y-2">
            <li className="font-medium text-brand-green">{t("Explore", "Explora")}</li>
            {linksPrimary.map((l) => (
              <li key={l.href}>
                <Link className="underline underline-offset-4 hover:text-brand-green" href={l.href}>
                  {l.label}
                </Link>
              </li>
            ))}
            <li className="pt-3">
              {linksLegal.map((l) => (
                <Link key={l.href} className="mr-4 text-xs underline underline-offset-4" href={l.href}>
                  {l.label}
                </Link>
              ))}
            </li>
          </ul>

          <ul className="space-y-2">
            <li className="font-medium text-brand-green">{t("Key Services", "Servicios Clave")}</li>
            {serviceLinks.map((l) => (
              <li key={l.href} className="flex items-start gap-1.5">
                <ArrowRight size={14} className="mt-0.5 text-brand-gold" />
                <Link className="underline underline-offset-4 hover:text-brand-green" href={l.href}>
                  {l.label}
                </Link>
              </li>
            ))}
            <li className="pt-2">
              <Link
                href={`${base}/${t("services", "servicios")}`}
                className="text-xs text-brand-blue hover:text-brand-green underline"
              >
                {t("See all services →", "Ver todos los servicios →")}
              </Link>
            </li>
          </ul>
        </nav>

        {/* Newsletter */}
        <div>
          <p className="font-medium text-brand-green">{t("Newsletter", "Boletín")}</p>
          <p className="text-sm text-brand-body mt-1">
            {t("Simple, practical insights—no spam.", "Ideas prácticas y simples—sin spam.")}
          </p>
          <form
            action="/api/subscribe"
            method="post"
            className="mt-3 flex gap-2"
            aria-label={t("Subscribe form", "Formulario de suscripción")}
          >
            {/* Honeypot */}
            <input type="text" name="hp" className="hidden" tabIndex={-1} autoComplete="off" />
            <label className="sr-only" htmlFor="newsletter-email">
              {t("Your email", "Tu correo")}
            </label>
            <input
              id="newsletter-email"
              name="email"
              type="email"
              required
              placeholder={t("Your email", "Tu correo")}
              className="border rounded-xl px-3 py-2 flex-1"
            />
            <button className="rounded-xl px-4 py-2 border shadow bg-white hover:bg-gray-50" type="submit">
              {t("Join", "Unirme")}
            </button>
          </form>
        </div>
      </div>

      {/* Compliance & legal line */}
      <div className="text-[11px] leading-relaxed text-gray-600 px-4 max-w-content mx-auto pb-3">
        <p>
          {t(
            "Licensed Mortgage Agent (Level 2). Coaching and advice-only services are independent from lender compensation and do not replace legal, tax, or accounting advice. Human Design is optional, used only to personalize communication and cadence.",
            "Agente Hipotecaria con licencia (Nivel 2). El coaching y la asesoría independiente no sustituyen la asesoría legal, fiscal o contable. Human Design es opcional y solo se usa para personalizar comunicación y ritmo."
          )}
        </p>
      </div>

      {/* Bottom line */}
      <div className="text-xs text-gray-500 text-center py-4 border-t">
        © {new Date().getFullYear()} Fanny Samaniego • {t("All rights reserved.", "Todos los derechos reservados.")}
      </div>
    </footer>
  );
}
