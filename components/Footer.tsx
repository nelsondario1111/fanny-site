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
  

  // Newsletter form state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [subscribing, setSubscribing] = useState(false);
  const [subscribeError, setSubscribeError] = useState<string | null>(null);

  const socials = [
    { icon: <Instagram size={22} />, href: "https://www.instagram.com/", label: "Instagram" },
    { icon: <Linkedin size={22} />, href: "https://www.linkedin.com/", label: "LinkedIn" },
    { icon: <Facebook size={22} />, href: "https://www.facebook.com/", label: "Facebook" },
    { icon: <Mail size={22} />, href: "mailto:info@fannysamaniego.com", label: isSpanish ? "Correo" : "Email" },
    { icon: <Phone size={22} />, href: "tel:4167268420", label: isSpanish ? "Teléfono" : "Phone" },
  ];

  // Footer navigation
  const footerNav = [
    { en: "About", es: "Sobre Mí", href: isSpanish ? "/es/sobre-mi" : "/en/about" },
    { en: "Services", es: "Servicios", href: isSpanish ? "/es/servicios" : "/en/services" },
    { en: "Tools", es: "Herramientas", href: isSpanish ? "/es/herramientas" : "/en/tools" },
    { en: "Resources", es: "Recursos", href: isSpanish ? "/es/recursos" : "/en/resources" },
    { en: "Testimonials", es: "Testimonios", href: isSpanish ? "/es/testimonios" : "/en/testimonials" },
    { en: "Contact", es: "Contacto", href: isSpanish ? "/es/contacto" : "/en/contact" },
  ];

  return (
    <footer className="bg-brand-green text-brand-beige pt-16 sm:pt-20 pb-10 sm:pb-12 px-4 mt-12 font-sans">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 border-b border-brand-gold/30 pb-12">
        {/* Branding */}
        <div className="flex flex-col items-center md:items-start">
          <div className="flex items-center mb-3">
            <Image
              src="/fanny-logo-footer.png"
              alt="Fanny Samaniego Logo"
              className="rounded-full mr-3 border-2 border-brand-gold bg-white object-cover"
              width={48}
              height={48}
            />
            <span className="font-serif text-2xl font-bold text-brand-gold tracking-tight">
              Fanny Samaniego
            </span>
          </div>
          <div className="text-brand-beige/90 mb-2 text-center md:text-left">
            {isSpanish
              ? "Coaching financiero holístico & agente hipotecaria en Toronto"
              : "Holistic Financial Coach & Mortgage Agent in Toronto"}
          </div>
          <div className="text-brand-gold text-xs text-center md:text-left">
            © 2025 Fanny Samaniego Coaching
          </div>
        </div>

        {/* Navigation */}
        <div className="flex flex-col items-center md:items-start gap-2 border-t border-b md:border-t-0 md:border-b-0 md:border-l md:border-r border-brand-gold/20 md:px-8 py-6 md:py-0">
          <div className="font-serif text-lg font-semibold text-brand-gold mb-1">
            {isSpanish ? "Navegación" : "Navigation"}
          </div>
          {footerNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="hover:text-brand-gold transition min-w-[110px] text-center"
            >
              {isSpanish ? item.es : item.en}
            </Link>
          ))}
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
                className="hover:text-brand-gold transition p-1.5 rounded-full"
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
        </div>
      </div>

      {/* Newsletter */}
      <div className="max-w-6xl mx-auto mt-12 flex flex-col items-center">
        <div className="font-serif text-xl text-brand-gold mb-4">
          {isSpanish ? "Boletín de Novedades" : "Newsletter"}
        </div>
        <form
          className={`w-full max-w-lg flex flex-col sm:flex-row flex-wrap items-center gap-4 bg-brand-beige/90 rounded-2xl px-6 py-4 shadow-lg border border-brand-gold/30 ${
            subscribed ? "opacity-50 pointer-events-none" : "opacity-100"
          }`}
          onSubmit={async (e) => {
            e.preventDefault();
            setSubscribing(true);
            setSubscribeError(null);
            // API expects: { firstName, lastName, email }
            const res = await fetch("/api/subscribe", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ firstName, lastName, email }),
            });
            setSubscribing(false);
            if (res.ok) {
              setSubscribed(true);
              setFirstName("");
              setLastName("");
              setEmail("");
              setTimeout(() => setSubscribed(false), 5000);
            } else {
              const data = await res.json();
              setSubscribeError(
                data.error ||
                  (isSpanish
                    ? "Hubo un error al suscribirte. Intenta de nuevo."
                    : "There was an error subscribing. Please try again.")
              );
            }
          }}
          aria-label={isSpanish ? "Formulario de suscripción al boletín" : "Newsletter signup form"}
        >
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="flex-1 min-w-[140px] p-3 rounded-xl border border-brand-green/30 bg-white text-brand-green placeholder:text-brand-green/70 focus:border-brand-gold focus:ring-2 focus:ring-brand-gold transition"
            placeholder={isSpanish ? "Nombre" : "First name"}
            disabled={subscribed || subscribing}
            required
            autoComplete="given-name"
          />
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="flex-1 min-w-[140px] p-3 rounded-xl border border-brand-green/30 bg-white text-brand-green placeholder:text-brand-green/70 focus:border-brand-gold focus:ring-2 focus:ring-brand-gold transition"
            placeholder={isSpanish ? "Apellido" : "Last name"}
            disabled={subscribed || subscribing}
            required
            autoComplete="family-name"
          />
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 min-w-[180px] p-3 rounded-xl border border-brand-green/30 bg-white text-brand-green placeholder:text-brand-green/70 focus:border-brand-gold focus:ring-2 focus:ring-brand-gold transition"
            placeholder={isSpanish ? "Ingresa tu correo..." : "Enter your email..."}
            disabled={subscribed || subscribing}
            autoComplete="email"
          />
          <button
            type="submit"
            className="px-7 py-3 bg-brand-gold text-brand-green font-serif font-bold rounded-full shadow hover:bg-brand-blue hover:text-white transition text-lg min-w-[120px]"
            disabled={subscribed || subscribing}
            aria-busy={subscribing ? "true" : undefined}
          >
            {subscribing
              ? isSpanish
                ? "Enviando..."
                : "Sending..."
              : isSpanish
                ? "Suscribirme"
                : "Subscribe"}
          </button>
        </form>
        <div className="text-xs text-brand-beige mt-2 text-center">
          {isSpanish
            ? "Recibe recursos y consejos de bienestar financiero. Sin spam."
            : "Get holistic financial tips & resources. No spam ever."}
        </div>

        {/* Feedback messages, aria-live for accessibility */}
        <div aria-live="polite">
          {subscribed && (
            <div className="mt-4 animate-fade-in">
              <div className="px-6 py-3 bg-brand-gold text-brand-green font-serif font-bold rounded-full shadow-lg text-center text-lg border border-brand-green/20 transition-all duration-500">
                {isSpanish
                  ? "¡Gracias por suscribirte! 🎉"
                  : "Thank you for subscribing! 🎉"}
              </div>
            </div>
          )}
          {subscribeError && (
            <div className="mt-4">
              <div className="px-6 py-3 bg-red-100 text-red-700 font-serif font-bold rounded-full shadow text-center text-lg border border-red-200">
                {subscribeError}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Language Switcher with Highlight */}
      <div className="mt-10 text-center flex items-center justify-center gap-2">
        <Link
          href="/en"
          className={`inline-block px-5 py-2 rounded-full border font-bold text-lg transition
            ${!isSpanish
              ? "bg-brand-blue text-white border-brand-blue shadow-md pointer-events-none"
              : "border-brand-gold text-brand-gold hover:bg-brand-gold hover:text-white"}
          `}
          aria-current={!isSpanish ? "true" : undefined}
        >
          English
        </Link>
        <Link
          href="/es"
          className={`inline-block px-5 py-2 rounded-full border font-bold text-lg transition
            ${isSpanish
              ? "bg-brand-blue text-white border-brand-blue shadow-md pointer-events-none"
              : "border-brand-gold text-brand-gold hover:bg-brand-gold hover:text-white"}
          `}
          aria-current={isSpanish ? "true" : undefined}
        >
          Español
        </Link>
      </div>
    </footer>
  );
}
