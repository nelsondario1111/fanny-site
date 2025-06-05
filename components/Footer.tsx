"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Mail, Phone, Instagram, Linkedin, Facebook } from "lucide-react";

type FooterProps = {
  lang?: string;
};

export default function Footer({ lang = "en" }: FooterProps) {
  const isSpanish = lang === "es";
  const langPrefix = isSpanish ? "/es" : "/en";
  const altLangPrefix = isSpanish ? "/en" : "/es";

  const [subscribed, setSubscribed] = useState(false);

  const socials = [
    {
      icon: <Instagram size={22} />,
      href: "https://www.instagram.com/",
      label: "Instagram",
    },
    {
      icon: <Linkedin size={22} />,
      href: "https://www.linkedin.com/",
      label: "LinkedIn",
    },
    {
      icon: <Facebook size={22} />,
      href: "https://www.facebook.com/",
      label: "Facebook",
    },
    {
      icon: <Mail size={22} />,
      href: "mailto:fanny.samaniego@zolo.ca",
      label: isSpanish ? "Correo" : "Email",
    },
    {
      icon: <Phone size={22} />,
      href: "tel:4167268420",
      label: isSpanish ? "Teléfono" : "Phone",
    },
  ];

  return (
    <footer className="bg-brand-green text-brand-beige pt-16 pb-10 px-4 mt-12 font-sans">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 border-b border-brand-gold/30 pb-12">
        {/* Branding */}
        <div className="flex flex-col items-center md:items-start">
          <div className="flex items-center mb-3">
            <Image
              src="/fanny-logo-footer.png"
              alt="Fanny Samaniego Logo"
              className="rounded-full mr-3 border-2 border-brand-gold bg-white object-contain"
              width={48}
              height={48}
            />
            <span className="font-serif text-2xl font-bold text-brand-gold tracking-tight">
              Fanny Samaniego
            </span>
          </div>
          <div className="text-brand-beige/90 mb-2">
            {isSpanish
              ? "Coaching financiero holístico & agente hipotecaria en Toronto"
              : "Holistic Financial Coach & Mortgage Agent in Toronto"}
          </div>
          <div className="text-brand-gold text-xs">
            © 2025 Fanny Samaniego Coaching
          </div>
        </div>

        {/* Navigation */}
        <div className="flex flex-col items-center md:items-start gap-2 border-t border-b md:border-t-0 md:border-b-0 md:border-l md:border-r border-brand-gold/20 md:px-8 py-6 md:py-0">
          <div className="font-serif text-lg font-semibold text-brand-gold mb-1">
            {isSpanish ? "Navegación" : "Navigation"}
          </div>
          <Link href={`${langPrefix}${isSpanish ? "/sobre-mi" : "/about"}`} className="hover:text-brand-gold transition">{isSpanish ? "Sobre Mí" : "About"}</Link>
          <Link href={`${langPrefix}${isSpanish ? "/servicios" : "/services"}`} className="hover:text-brand-gold transition">{isSpanish ? "Servicios" : "Services"}</Link>
          <Link href={`${langPrefix}${isSpanish ? "/herramientas" : "/tools"}`} className="hover:text-brand-gold transition">{isSpanish ? "Herramientas" : "Tools"}</Link>
          <Link href={`${langPrefix}${isSpanish ? "/recursos" : "/resources"}`} className="hover:text-brand-gold transition">{isSpanish ? "Recursos" : "Resources"}</Link>
          <Link href={`${langPrefix}${isSpanish ? "/testimonios" : "/testimonials"}`} className="hover:text-brand-gold transition">{isSpanish ? "Testimonios" : "Testimonials"}</Link>
          <Link href={`${langPrefix}${isSpanish ? "/contacto" : "/contact"}`} className="hover:text-brand-gold transition">{isSpanish ? "Contacto" : "Contact"}</Link>
        </div>

        {/* Socials & Compliance */}
        <div className="flex flex-col gap-3 items-center md:items-end">
          <div className="flex gap-4 mb-3">
            {socials.map(({ icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="hover:text-brand-gold transition"
              >
                {icon}
              </a>
            ))}
          </div>
          <div className="text-xs text-brand-beige/80 text-right">
            {isSpanish
              ? "Licencia Hipotecaria #M22000490 · Zolo Realty"
              : "Mortgage License #M22000490 · Zolo Realty"}
          </div>
          <Link
            href={`${langPrefix}${isSpanish ? "/cumplimiento" : "/compliance"}`}
            className="text-xs text-brand-beige/80 text-right hover:text-brand-gold underline transition"
          >
            {isSpanish
              ? "Aviso de Cumplimiento Hipotecario"
              : "Mortgage Compliance Notice"}
          </Link>
        </div>
      </div>

      {/* Newsletter */}
      <div className="max-w-6xl mx-auto mt-12 flex flex-col items-center">
        <div className="font-serif text-xl text-brand-gold mb-4">
          {isSpanish ? "Boletín de Novedades" : "Newsletter"}
        </div>
        <form
          className={`w-full max-w-lg flex flex-col sm:flex-row items-center gap-4 bg-brand-beige/90 rounded-2xl px-6 py-4 shadow-lg border border-brand-gold/30 ${
            subscribed ? "opacity-50 pointer-events-none" : "opacity-100"
          }`}
          onSubmit={(e) => {
            e.preventDefault();
            setSubscribed(true);
            setTimeout(() => setSubscribed(false), 5000);
          }}
          aria-label={isSpanish ? "Formulario de suscripción al boletín" : "Newsletter signup form"}
        >
          <input
            type="email"
            required
            className="flex-1 p-3 rounded-xl border border-brand-green/30 bg-white text-brand-green placeholder:text-brand-green/70 focus:border-brand-gold focus:ring-2 focus:ring-brand-gold transition"
            placeholder={isSpanish ? "Ingresa tu correo..." : "Enter your email..."}
            disabled={subscribed}
          />
          <button
            type="submit"
            className="px-7 py-3 bg-brand-gold text-brand-green font-serif font-bold rounded-full shadow hover:bg-brand-blue hover:text-white transition text-lg"
            disabled={subscribed}
          >
            {isSpanish ? "Suscribirme" : "Subscribe"}
          </button>
        </form>
        <div className="text-xs text-brand-beige mt-2">
          {isSpanish
            ? "Recibe recursos y consejos de bienestar financiero. Sin spam."
            : "Get holistic financial tips & resources. No spam ever."}
        </div>

        {subscribed && (
          <div className="mt-4 animate-fade-in">
            <div className="px-6 py-3 bg-brand-gold text-brand-green font-serif font-bold rounded-full shadow-lg text-center text-lg border border-brand-green/20 transition-all duration-500">
              {isSpanish
                ? "¡Gracias por suscribirte! 🎉"
                : "Thank you for subscribing! 🎉"}
            </div>
          </div>
        )}
      </div>

      {/* Language Switcher */}
      <div className="mt-10 text-center">
        <Link
          href={altLangPrefix}
          className="inline-block px-5 py-2 border border-brand-gold text-brand-gold rounded-full hover:bg-brand-gold hover:text-white transition"
        >
          {isSpanish ? "Ver en Inglés" : "View in Spanish"}
        </Link>
      </div>
    </footer>
  );
}
