"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";

const links = [
  { en: { label: "Home", href: "/" }, es: { label: "Inicio", href: "/inicio" } },
  { en: { label: "About", href: "/about" }, es: { label: "Sobre mí", href: "/sobre-mi" } },
  { en: { label: "Services", href: "/services" }, es: { label: "Servicios", href: "/servicios" } },
  { en: { label: "Tools", href: "/tools" }, es: { label: "Herramientas", href: "/herramientas" } },
  { en: { label: "Resources", href: "/resources" }, es: { label: "Recursos", href: "/recursos" } },
  { en: { label: "Testimonials", href: "/testimonials" }, es: { label: "Testimonios", href: "/testimonios" } },
  { en: { label: "Contact", href: "/contact" }, es: { label: "Contacto", href: "/contacto" } },
];

function isSpanishPath(pathname) {
  return [
    "/inicio",
    "/sobre-mi",
    "/servicios",
    "/herramientas",
    "/recursos",
    "/testimonios",
    "/contacto",
    "/calculadora-presupuesto",
    "/calculadora-hipotecaria"
  ].some(prefix => pathname.startsWith(prefix));
}

export default function NavBar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const isSpanish = isSpanishPath(pathname);

  // Get language switcher link
  const languageSwitch = isSpanish
    ? { label: "English", href: pathname.replace(
        /^\/(inicio|sobre-mi|servicios|herramientas|recursos|testimonios|contacto|calculadora-presupuesto|calculadora-hipotecaria)/,
        (match) => {
          // Map Spanish route to English route
          switch (match) {
            case "/inicio": return "/";
            case "/sobre-mi": return "/about";
            case "/servicios": return "/services";
            case "/herramientas": return "/tools";
            case "/recursos": return "/resources";
            case "/testimonios": return "/testimonials";
            case "/contacto": return "/contact";
            case "/calculadora-presupuesto": return "/budget-calculator";
            case "/calculadora-hipotecaria": return "/mortgage-calculator";
            default: return "/";
          }
        }
      ) }
    : { label: "Español", href: (() => {
        switch (pathname) {
          case "/": return "/inicio";
          case "/about": return "/sobre-mi";
          case "/services": return "/servicios";
          case "/tools": return "/herramientas";
          case "/resources": return "/recursos";
          case "/testimonials": return "/testimonios";
          case "/contact": return "/contacto";
          case "/budget-calculator": return "/calculadora-presupuesto";
          case "/mortgage-calculator": return "/calculadora-hipotecaria";
          default: return "/inicio";
        }
      })()
    };

  return (
    <header className="bg-white shadow sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
        {/* Logo */}
        <Link href={isSpanish ? "/inicio" : "/"}>
          <span className="font-serif text-brand-green text-2xl font-bold cursor-pointer">
            Fanny Samaniego
          </span>
        </Link>
        {/* Desktop Links */}
        <div className="hidden md:flex gap-8 items-center">
          {links.map((link, i) => (
            <Link
              key={i}
              href={isSpanish ? link.es.href : link.en.href}
              className={`text-lg font-semibold hover:text-brand-blue transition ${
                pathname === (isSpanish ? link.es.href : link.en.href)
                  ? "text-brand-green underline"
                  : "text-brand-body"
              }`}
            >
              {isSpanish ? link.es.label : link.en.label}
            </Link>
          ))}
          {/* Language Switcher */}
          <Link
            href={languageSwitch.href}
            className="ml-3 px-4 py-2 rounded-full bg-brand-gold text-brand-green font-bold shadow hover:bg-brand-blue hover:text-white transition-all"
          >
            {languageSwitch.label}
          </Link>
        </div>
        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 rounded text-brand-green hover:bg-brand-gold/20 focus:outline-none"
          aria-label="Open menu"
          onClick={() => setMenuOpen(true)}
        >
          <FaBars size={24} />
        </button>
      </nav>
      {/* Mobile Menu */}
      {menuOpen && (
        <div className="fixed inset-0 bg-black/30 z-50 flex">
          <nav className="bg-white w-72 p-8 shadow-2xl h-full flex flex-col gap-6">
            <div className="flex justify-between items-center mb-8">
              <span className="font-serif text-brand-green text-2xl font-bold">
                Fanny Samaniego
              </span>
              <button
                className="p-2 rounded hover:bg-brand-gold/20"
                aria-label="Close menu"
                onClick={() => setMenuOpen(false)}
              >
                <FaTimes size={24} />
              </button>
            </div>
            {links.map((link, i) => (
              <Link
                key={i}
                href={isSpanish ? link.es.href : link.en.href}
                className={`text-lg font-semibold hover:text-brand-blue transition ${
                  pathname === (isSpanish ? link.es.href : link.en.href)
                    ? "text-brand-green underline"
                    : "text-brand-body"
                }`}
                onClick={() => setMenuOpen(false)}
              >
                {isSpanish ? link.es.label : link.en.label}
              </Link>
            ))}
            {/* Language Switcher */}
            <Link
              href={languageSwitch.href}
              className="mt-4 px-4 py-2 rounded-full bg-brand-gold text-brand-green font-bold shadow hover:bg-brand-blue hover:text-white transition-all"
              onClick={() => setMenuOpen(false)}
            >
              {languageSwitch.label}
            </Link>
          </nav>
          {/* Click outside to close */}
          <div className="flex-1" onClick={() => setMenuOpen(false)} />
        </div>
      )}
    </header>
  );
}
