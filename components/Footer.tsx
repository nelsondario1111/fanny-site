"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Phone, MessageCircle, Calendar, ArrowRight } from "lucide-react";
import LangSwitcher from "@/components/layout/LangSwitcher";

/** Versión en español del footer */
export default function FooterEs() {
  const pathname = usePathname() || "/es";
  const base = "/es";

  // CTA principal → Contacto
  const ctaHref = `${base}/contacto?intent=consult`;

  // Enlaces superiores
  const linksPrimary = [
    { href: `${base}/servicios`, label: "Servicios" },
    { href: `${base}/recursos`, label: "Recursos" },
    { href: `${base}/herramientas`, label: "Herramientas" },
    { href: `${base}/sobre-mi`, label: "Sobre mí" },
    { href: `${base}/testimonios`, label: "Testimonios" },
    { href: `${base}/contacto`, label: "Contacto" },
  ];

  // Enlaces rápidos de servicios
  const serviceLinks = [
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

  const linksLegal = [{ href: `${base}/privacidad`, label: "Privacidad" }];

  return (
    <footer className="border-t bg-white">
      {/* Franja superior: CTA + contacto rápido */}
      <div className="bg-brand-green text-white">
        <div className="max-w-content mx-auto px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-sm">
            ¿Lista/o para revisar tu plan? Reserva una llamada de descubrimiento.
          </p>
          <div className="flex items-center gap-3">
            <a
              className="inline-flex items-center gap-1 hover:underline"
              href="tel:14167268420"
              aria-label="Llamar al (416) 726-8420"
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
              <Calendar size={14} /> Reservar
            </Link>
          </div>
        </div>
      </div>

      {/* Footer principal */}
      <div className="max-w-content mx-auto px-4 py-12 grid gap-10 lg:grid-cols-4">
        {/* Marca / misión */}
        <div>
          <p className="font-serif text-lg font-bold text-brand-green">Fanny Samaniego</p>
          <p className="text-sm text-brand-body mt-2">
            Coaching financiero con enfoque humano e hipotecas en Toronto. Números claros, decisiones en calma.
          </p>
          <div className="mt-4">
            <LangSwitcher />
          </div>
        </div>

        {/* Explora */}
        <nav className="grid grid-cols-2 gap-6 text-sm lg:col-span-2">
          <ul className="space-y-2">
            <li className="font-medium text-brand-green">Explora</li>
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
            <li className="font-medium text-brand-green">Servicios clave</li>
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
                href={`${base}/servicios`}
                className="text-xs text-brand-blue hover:text-brand-green underline"
              >
                Ver todos los servicios →
              </Link>
            </li>
          </ul>
        </nav>

        {/* Boletín */}
        <div>
          <p className="font-medium text-brand-green">Boletín</p>
          <p className="text-sm text-brand-body mt-1">Ideas prácticas y simples—sin spam.</p>
          <form
            action="/api/subscribe"
            method="post"
            className="mt-3 flex gap-2"
            aria-label="Formulario de suscripción"
          >
            {/* Honeypot */}
            <input type="text" name="hp" className="hidden" tabIndex={-1} autoComplete="off" />
            <label className="sr-only" htmlFor="newsletter-email">
              Tu correo
            </label>
            <input
              id="newsletter-email"
              name="email"
              type="email"
              required
              placeholder="Tu correo"
              className="border rounded-xl px-3 py-2 flex-1"
            />
            <button className="rounded-xl px-4 py-2 border shadow bg-white hover:bg-gray-50" type="submit">
              Unirme
            </button>
          </form>
        </div>
      </div>

      {/* Línea legal */}
      <div className="text-[11px] leading-relaxed text-gray-600 px-4 max-w-content mx-auto pb-3">
        <p>
          Agente Hipotecaria con licencia (Nivel 2). El coaching y la asesoría independiente no sustituyen la asesoría
          legal, fiscal o contable. Human Design es opcional y solo se usa para personalizar comunicación y ritmo.
        </p>
      </div>

      {/* Pie final */}
      <div className="text-xs text-gray-500 text-center py-4 border-t">
        © {new Date().getFullYear()} Fanny Samaniego • Todos los derechos reservados.
      </div>
    </footer>
  );
}
