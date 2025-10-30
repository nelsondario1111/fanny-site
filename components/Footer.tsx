"use client";

import Link from "next/link";
import { Phone, MessageCircle, Calendar, ArrowRight } from "lucide-react";
import LangSwitcher from "@/components/layout/LangSwitcher";

type FooterProps = { lang?: "en" | "es" };

const SECT = {
  signature: "signature",
  foundations: "foundations",
  mortgage: "mortgage",
  business: "business",
  workshops: "workshops",
  legacy: "legacy",
  family: "family",
  newcomers: "newcomers",
  advice: "advice",
} as const;

export default function Footer({ lang = "es" }: FooterProps) {
  const isEn = lang === "en";
  const base = isEn ? "/en" : "/es";

  const ctaHref = `${base}/${isEn ? "contact" : "contacto"}?intent=consult`;

  const linksPrimary = isEn
    ? [
        { href: `${base}/services`, label: "Services" },
        { href: `${base}/resources`, label: "Resources" },
        { href: `${base}/tools`, label: "Tools" },
        { href: `${base}/about`, label: "About" },
        { href: `${base}/testimonials`, label: "Testimonials" },
        { href: `${base}/contact`, label: "Contact" },
        { href: `${base}/tax-review`, label: "Tax-review" },
      ]
    : [
        { href: `${base}/servicios`, label: "Servicios" },
        { href: `${base}/recursos`, label: "Recursos" },
        { href: `${base}/herramientas`, label: "Herramientas" },
        { href: `${base}/sobre-mi`, label: "Sobre mí" },
        { href: `${base}/testimonios`, label: "Testimonios" },
        { href: `${base}/contacto`, label: "Contacto" },
        { href: `${base}/revision-impuestos`, label: "Revision-Imputestos" },
      ];

  // Use section IDs that exist in both EN/ES services pages
  const serviceLinks = isEn
    ? [
        { href: `${base}/services#${SECT.signature}`, label: "Signature Packages" },
        { href: `${base}/services#${SECT.foundations}`, label: "Wealth Foundations" },
        { href: `${base}/services#${SECT.mortgage}`, label: "Mortgage & Property" },
        { href: `${base}/services#${SECT.business}`, label: "Business & Professionals" },
        { href: `${base}/services#${SECT.workshops}`, label: "Workshops" },
        { href: `${base}/services#${SECT.legacy}`, label: "Legacy & Tax" },
        { href: `${base}/services#${SECT.family}`, label: "Holistic Conversations" },
        { href: `${base}/services#${SECT.advice}`, label: "1:1 Advice" },
        { href: `${base}/services#${SECT.newcomers}`, label: "Newcomers" },
      ]
    : [
        { href: `${base}/servicios#${SECT.signature}`, label: "Paquetes Insignia" },
        { href: `${base}/servicios#${SECT.foundations}`, label: "Fundamentos de Riqueza" },
        { href: `${base}/servicios#${SECT.mortgage}`, label: "Hipoteca y Propiedad" },
        { href: `${base}/servicios#${SECT.business}`, label: "Negocios y Profesionales" },
        { href: `${base}/servicios#${SECT.workshops}`, label: "Talleres" },
        { href: `${base}/servicios#${SECT.legacy}`, label: "Legado e Impuestos" },
        { href: `${base}/servicios#${SECT.family}`, label: "Conversaciones Holísticas" },
        { href: `${base}/servicios#${SECT.advice}`, label: "Asesoría 1:1" },
        { href: `${base}/servicios#${SECT.newcomers}`, label: "Recién Llegados" },
      ];

  const linksLegal = [{ href: `${base}/${isEn ? "privacy" : "privacidad"}`, label: isEn ? "Privacy" : "Privacidad" }];

  return (
    <footer className="border-t bg-white">
      {/* Top CTA band */}
      <div className="bg-brand-green text-white">
        <div className="max-w-content mx-auto px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-sm">
            {isEn
              ? "Ready to review your plan? Book a discovery call."
              : "¿Lista/o para revisar tu plan? Reserva una llamada de descubrimiento."}
          </p>
          <div className="flex items-center gap-3">
            <a
              className="inline-flex items-center gap-1 hover:underline"
              href="tel:14167268420"
              aria-label={isEn ? "Call (416) 726-8420" : "Llamar al (416) 726-8420"}
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
              <Calendar size={14} /> {isEn ? "Book" : "Reservar"}
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
            {isEn
              ? "Human-centered financial coaching and mortgages in Toronto. Clear numbers, calm decisions."
              : "Coaching financiero con enfoque humano e hipotecas en Toronto. Números claros, decisiones en calma."}
          </p>
          <div className="mt-4">
            <LangSwitcher />
          </div>
        </div>

        {/* Explore */}
        <nav className="grid grid-cols-2 gap-6 text-sm lg:col-span-2">
          <ul className="space-y-2">
            <li className="font-medium text-brand-green">{isEn ? "Explore" : "Explora"}</li>
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
            <li className="font-medium text-brand-green">
              {isEn ? "Key services" : "Servicios clave"}
            </li>
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
                href={`${base}/${isEn ? "services" : "servicios"}`}
                className="text-xs text-brand-blue hover:text-brand-green underline"
              >
                {isEn ? "See all services →" : "Ver todos los servicios →"}
              </Link>
            </li>
          </ul>
        </nav>

        {/* Newsletter */}
        <div>
          <p className="font-medium text-brand-green">{isEn ? "Newsletter" : "Boletín"}</p>
          <p className="text-sm text-brand-body mt-1">
            {isEn ? "Practical, simple ideas—no spam." : "Ideas prácticas y simples—sin spam."}
          </p>
          <form
            action="/api/subscribe"
            method="post"
            className="mt-3 flex gap-2"
            aria-label={isEn ? "Newsletter subscription form" : "Formulario de suscripción"}
          >
            {/* Honeypot */}
            <input type="text" name="hp" className="hidden" tabIndex={-1} autoComplete="off" />
            <label className="sr-only" htmlFor="newsletter-email">
              {isEn ? "Your email" : "Tu correo"}
            </label>
            <input
              id="newsletter-email"
              name="email"
              type="email"
              required
              placeholder={isEn ? "Your email" : "Tu correo"}
              className="border rounded-xl px-3 py-2 flex-1"
            />
            <button className="rounded-xl px-4 py-2 border shadow bg-white hover:bg-gray-50" type="submit">
              {isEn ? "Join" : "Unirme"}
            </button>
          </form>
        </div>
      </div>

      {/* Legal line */}
      <div className="text-[11px] leading-relaxed text-gray-600 px-4 max-w-content mx-auto pb-3">
        <p>
          {isEn ? (
            <>
              Licensed Mortgage Agent (Level 2). Coaching and advice-only services do not replace legal, tax, or
              accounting advice. Human Design is optional and used only to personalize communication and pacing.
            </>
          ) : (
            <>
              Agente Hipotecaria con licencia (Nivel 2). El coaching y la asesoría independiente no sustituyen la
              asesoría legal, fiscal o contable. Human Design es opcional y solo se usa para personalizar comunicación
              y ritmo.
            </>
          )}
        </p>
      </div>

      {/* Bottom */}
      <div className="text-xs text-gray-500 text-center py-4 border-t">
        © {new Date().getFullYear()} Fanny Samaniego •{" "}
        {isEn ? "All rights reserved." : "Todos los derechos reservados."}
      </div>
    </footer>
  );
}
