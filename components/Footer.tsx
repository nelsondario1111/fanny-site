"use client";

import Link from "next/link";
import { Phone, MessageCircle, Calendar, ArrowRight } from "lucide-react";
import LangSwitcher from "@/components/layout/LangSwitcher";

type FooterProps = { lang?: "en" | "es" };

const SECT = {
  startHere: "start-here",
  strategicMaps: "strategic-maps",
  support: "support",
  kitchenTable: "kitchen-table",
  mortgage: "mortgage",
  business: "business",
} as const;

export default function Footer({ lang = "es" }: FooterProps) {
  const isEn = lang === "en";
  const base = isEn ? "/en" : "/es";
  const brandSubtitle = isEn ? "Holistic Financial Consultant" : "Consultora financiera holística";

  const ctaHref = `${base}/${isEn ? "contact" : "contacto"}?intent=consult`;

  const linksPrimary = isEn
    ? [
        { href: `${base}/services`, label: "Services" },
        { href: `${base}/resources`, label: "Resources" },
        { href: `${base}/tools`, label: "Tools" },
        { href: `${base}/about`, label: "About" },
        { href: `${base}/testimonials`, label: "Testimonials" },
        { href: `${base}/contact`, label: "Contact" },
        { href: `${base}/tax-review`, label: "Tax Review" },
        { href: `${base}/client-library`, label: "Client Library" },
      ]
    : [
        { href: `${base}/servicios`, label: "Servicios" },
        { href: `${base}/recursos`, label: "Recursos" },
        { href: `${base}/herramientas`, label: "Herramientas" },
        { href: `${base}/sobre-mi`, label: "Sobre mí" },
        { href: `${base}/testimonios`, label: "Testimonios" },
        { href: `${base}/contacto`, label: "Contacto" },
        { href: `${base}/revision-impuestos`, label: "Revisión de Impuestos" },
        { href: `${base}/biblioteca-clientes`, label: "Biblioteca de Clientes" },
      ];

  // Use section IDs that exist in both EN/ES services pages
  const serviceLinks = isEn
    ? [
        { href: `${base}/services#${SECT.startHere}`, label: "Start Here" },
        { href: `${base}/services#${SECT.strategicMaps}`, label: "Strategic Financial Maps" },
        { href: `${base}/services#${SECT.support}`, label: "Supplementary Support" },
        { href: `${base}/services#${SECT.kitchenTable}`, label: "Kitchen Table Conversations" },
        { href: `${base}/services#${SECT.mortgage}`, label: "Mortgage Strategy" },
        { href: `${base}/services#${SECT.business}`, label: "Business & Tax" },
      ]
    : [
        { href: `${base}/servicios#${SECT.startHere}`, label: "Empieza aquí" },
        { href: `${base}/servicios#${SECT.strategicMaps}`, label: "Mapas financieros estratégicos" },
        { href: `${base}/servicios#${SECT.support}`, label: "Apoyo complementario" },
        { href: `${base}/servicios#${SECT.kitchenTable}`, label: "Conversaciones en la Mesa" },
        { href: `${base}/servicios#${SECT.mortgage}`, label: "Estrategia hipotecaria" },
        { href: `${base}/servicios#${SECT.business}`, label: "Negocios e impuestos" },
      ];

  const linksLegal = [{ href: `${base}/${isEn ? "privacy" : "privacidad"}`, label: isEn ? "Privacy" : "Privacidad" }];
  const topPillClass =
    "inline-flex items-center gap-1 rounded-full border border-white/25 bg-white/10 px-3 py-1.5 text-xs hover:bg-white/20 transition";
  const linkClass = "text-brand-blue/90 hover:text-brand-green transition";

  return (
    <footer className="border-t border-brand-gold/25 bg-gradient-to-b from-white to-brand-beige/40">
      {/* Top CTA band */}
      <div className="bg-gradient-to-r from-brand-green via-brand-green to-brand-green/90 text-white border-b border-brand-gold/25">
        <div className="max-w-content mx-auto px-5 sm:px-8 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <p className="text-sm text-white/95">
            {isEn
              ? "Ready to review your plan? Book a discovery call."
              : "¿Lista/o para revisar tu plan? Reserva una llamada de descubrimiento."}
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <a
              className={topPillClass}
              href="tel:14167268420"
              aria-label={isEn ? "Call (416) 726-8420" : "Llamar al (416) 726-8420"}
            >
              <Phone size={14} /> (416) 726-8420
            </a>
            <a
              className={topPillClass}
              href="https://wa.me/14167268420"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
            >
              <MessageCircle size={14} /> WhatsApp
            </a>
            <Link
              href={ctaHref}
              className="inline-flex items-center gap-1 rounded-full bg-brand-gold text-brand-green px-3.5 py-1.5 text-xs font-semibold shadow-[0_8px_20px_rgba(47,74,53,0.2)] hover:-translate-y-[1px] hover:opacity-95 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold"
            >
              <Calendar size={14} /> {isEn ? "Book" : "Reservar"}
            </Link>
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="max-w-content mx-auto px-5 sm:px-8 py-12 grid gap-8 lg:grid-cols-4">
        {/* Brand / mission */}
        <div className="rounded-2xl border border-brand-gold/25 bg-white/85 p-5 shadow-sm">
          <p className="font-brand text-[1.35rem] font-semibold text-brand-green tracking-[-0.015em]">
            Fanny Samaniego
          </p>
          <p className="mt-1 font-sans text-[10px] font-medium uppercase text-brand-blue/80 tracking-[0.14em]">
            {brandSubtitle}
          </p>
          <div className="mt-3 space-y-1 text-sm leading-snug">
            <p className="text-brand-body">
              {isEn ? "Taxes • Mortgages • Money Strategy" : "Impuestos • Hipotecas • Estrategia financiera"}
            </p>
            <p className="font-medium text-brand-gold">
              {isEn ? "Clear numbers, calm decisions." : "Números claros, decisiones con calma."}
            </p>
          </div>
          <div className="mt-4">
            <LangSwitcher />
          </div>
        </div>

        {/* Explore */}
        <nav className="grid grid-cols-1 gap-6 text-sm sm:grid-cols-2 lg:col-span-2">
          <ul className="rounded-2xl border border-brand-gold/25 bg-white/85 p-5 space-y-2.5 shadow-sm">
            <li className="text-[11px] uppercase tracking-[0.12em] text-brand-green/80">
              {isEn ? "Explore" : "Explora"}
            </li>
            {linksPrimary.map((l) => (
              <li key={l.href}>
                <Link className={linkClass} href={l.href}>
                  {l.label}
                </Link>
              </li>
            ))}
            <li className="pt-3">
              {linksLegal.map((l) => (
                <Link key={l.href} className="mr-4 text-xs text-brand-blue/80 hover:text-brand-green transition" href={l.href}>
                  {l.label}
                </Link>
              ))}
            </li>
          </ul>

          <ul className="rounded-2xl border border-brand-gold/25 bg-white/85 p-5 space-y-2.5 shadow-sm">
            <li className="text-[11px] uppercase tracking-[0.12em] text-brand-green/80">
              {isEn ? "Key services" : "Servicios clave"}
            </li>
            {serviceLinks.map((l) => (
              <li key={l.href} className="flex items-start gap-1.5">
                <ArrowRight size={14} className="mt-0.5 text-brand-gold" />
                <Link className={linkClass} href={l.href}>
                  {l.label}
                </Link>
              </li>
            ))}
            <li className="pt-2">
              <Link
                href={`${base}/${isEn ? "services" : "servicios"}`}
                className="text-xs text-brand-blue hover:text-brand-green transition"
              >
                {isEn ? "See all services →" : "Ver todos los servicios →"}
              </Link>
            </li>
          </ul>
        </nav>

        {/* Newsletter */}
        <div className="rounded-2xl border border-brand-gold/25 bg-white/85 p-5 shadow-sm">
          <p className="text-[11px] uppercase tracking-[0.12em] text-brand-green/80">
            {isEn ? "Newsletter" : "Boletín"}
          </p>
          <p className="text-sm text-brand-body mt-2">
            {isEn ? "Practical, simple ideas—no spam." : "Ideas prácticas y simples—sin spam."}
          </p>
          <form
            action="/api/subscribe"
            method="post"
            className="mt-3 flex flex-col gap-2 sm:flex-row"
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
              className="h-10 rounded-xl border border-brand-gold/45 bg-white px-3 text-sm flex-1 focus:outline-none focus:ring-2 focus:ring-brand-gold/45"
            />
            <button
              className="h-10 rounded-xl px-4 bg-brand-green text-white text-sm font-semibold shadow-sm hover:bg-brand-green/90 transition"
              type="submit"
            >
              {isEn ? "Join" : "Unirme"}
            </button>
          </form>
        </div>
      </div>

      {/* Legal line */}
      <div className="border-t border-brand-gold/20 text-[11px] leading-relaxed text-brand-blue/75 px-5 sm:px-8 max-w-content mx-auto py-4">
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
      <div className="border-t border-brand-gold/20">
        <div className="max-w-content mx-auto px-5 sm:px-8 py-4 text-xs text-brand-blue/65 text-center">
          © {new Date().getFullYear()} Fanny Samaniego •{" "}
          {isEn ? "All rights reserved." : "Todos los derechos reservados."}
        </div>
      </div>
    </footer>
  );
}
