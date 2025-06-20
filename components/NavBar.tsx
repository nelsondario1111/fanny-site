"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { FaBars, FaTimes } from "react-icons/fa";

type NavLink = {
  href: string;
  labelEn: string;
  labelEs: string;
  hrefEs?: string;
};

const navGroups: NavLink[] = [
  { href: "", labelEn: "Home", labelEs: "Inicio" },
  { href: "/about", labelEn: "About", labelEs: "Sobre Mí", hrefEs: "/sobre-mi" },
  { href: "/services", labelEn: "Services", labelEs: "Servicios", hrefEs: "/servicios" },
  { href: "/tools", labelEn: "Tools", labelEs: "Herramientas", hrefEs: "/herramientas" },
  { href: "/resources", labelEn: "Resources", labelEs: "Recursos", hrefEs: "/recursos" },
  { href: "/testimonials", labelEn: "Testimonials", labelEs: "Testimonios", hrefEs: "/testimonios" },
  { href: "/contact", labelEn: "Contact", labelEs: "Contacto", hrefEs: "/contacto" },
];

type NavBarProps = {
  lang?: string;
};

export default function NavBar({ lang = "en" }: NavBarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const isSpanish = lang === "es";
  const langPrefix = isSpanish ? "/es" : "/en";
  const altLangPrefix = isSpanish ? "/en" : "/es";

  // Improved route matching for active highlight (handles deeper nested routes)
  const isActive = (href: string) => {
    if (isSpanish && href === "") return pathname === "/es";
    if (!isSpanish && href === "") return pathname === "/en";
    const fullHref = isSpanish
      ? `/es${href.startsWith("/") ? href : `/${href}`}`
      : `/en${href.startsWith("/") ? href : `/${href}`}`;
    return pathname === fullHref || pathname.startsWith(fullHref + "/");
  };

  const getHref = (item: NavLink) => {
    if (isSpanish && item.hrefEs)
      return `/es${item.hrefEs.startsWith("/") ? item.hrefEs : `/${item.hrefEs}`}`;
    if (!isSpanish)
      return item.href === ""
        ? "/en"
        : `/en${item.href.startsWith("/") ? item.href : `/${item.href}`}`;
    return isSpanish ? `/es${item.href}` : `/en${item.href}`;
  };

  // Language Switcher with Highlight
  const LanguageSwitcher = () => (
    <div className="flex items-center gap-1 ml-3">
      <Link
        href="/en"
        className={`px-4 py-2 rounded-xl border font-bold text-lg transition-all
          ${!isSpanish
            ? "bg-brand-blue text-white border-brand-blue shadow-md pointer-events-none"
            : "border-brand-blue text-brand-blue hover:bg-brand-blue hover:text-brand-gold"}
        `}
        aria-current={!isSpanish ? "true" : undefined}
      >
        English
      </Link>
      <Link
        href="/es"
        className={`px-4 py-2 rounded-xl border font-bold text-lg transition-all
          ${isSpanish
            ? "bg-brand-blue text-white border-brand-blue shadow-md pointer-events-none"
            : "border-brand-blue text-brand-blue hover:bg-brand-blue hover:text-brand-gold"}
        `}
        aria-current={isSpanish ? "true" : undefined}
      >
        Español
      </Link>
    </div>
  );

  return (
    <nav className="bg-white/90 border-b border-brand-blue/20 shadow-xl fixed top-0 left-0 w-full z-50 backdrop-blur-lg">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-3">
        {/* Logo/Brand */}
        <Link href={langPrefix}>
          <span className="flex items-center cursor-pointer select-none">
            <span
              className="inline-flex items-center justify-center rounded-full border-2 border-brand-gold shadow-lg bg-white mr-3 transition-all duration-300 hover:scale-105"
              style={{ width: 46, height: 46, overflow: "hidden" }}
            >
              <Image
                src="/logo.png"
                alt="Fanny Samaniego Financial Coaching Logo"
                width={40}
                height={40}
                style={{
                  borderRadius: "50%",
                  minWidth: 40,
                  minHeight: 40,
                  objectFit: "cover",
                  display: "block",
                }}
                priority
              />
            </span>
            <span className="font-serif text-2xl font-extrabold tracking-tight text-brand-blue drop-shadow-sm hover:text-brand-gold transition-colors duration-200">
              Fanny Samaniego
            </span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <ul className="hidden md:flex space-x-2 font-semibold text-lg items-center ml-6">
          {navGroups.map((item) => {
            const active = isActive(item.href);
            return (
              <li key={item.labelEn} className="flex items-center">
                <Link
                  href={getHref(item)}
                  className={`px-3 py-2 rounded-xl min-w-[110px] text-center transition-all duration-200 ${
                    active
                      ? "bg-brand-green/90 text-white shadow font-bold"
                      : "text-brand-blue hover:bg-brand-gold/20 hover:text-brand-gold"
                  }`}
                  aria-current={active ? "page" : undefined}
                >
                  {isSpanish ? item.labelEs : item.labelEn}
                </Link>
              </li>
            );
          })}
          <li>
            <LanguageSwitcher />
          </li>
        </ul>

        {/* Mobile menu toggle */}
        <button
          className="md:hidden text-3xl text-brand-blue focus:outline-none hover:text-brand-gold transition rounded-full p-2"
          style={{ minWidth: 48, minHeight: 48 }}
          onClick={() => setMenuOpen((v) => !v)}
          aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Mobile Menu: fade/slide in, with language highlight */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40"
          onClick={() => setMenuOpen(false)}
        >
          <ul
            className="absolute top-16 left-0 w-full bg-white shadow-2xl rounded-b-3xl flex flex-col items-center py-10 space-y-6 font-semibold text-xl z-50 transition-all duration-300 ease-in-out animate-fadeInDown"
            onClick={(e) => e.stopPropagation()}
            style={{
              animation: "fadeInDown 0.35s cubic-bezier(0.4,0,0.2,1)"
            }}
          >
            {navGroups.map((item) => (
              <li key={item.labelEn} className="w-full">
                <Link
                  href={getHref(item)}
                  className="block px-7 py-3 rounded-xl text-brand-blue hover:text-brand-gold hover:bg-brand-gold/10 transition text-center min-w-[110px]"
                  onClick={() => setMenuOpen(false)}
                  aria-current={isActive(item.href) ? "page" : undefined}
                >
                  {isSpanish ? item.labelEs : item.labelEn}
                </Link>
              </li>
            ))}
            <li className="w-full pt-3">
              <LanguageSwitcher />
            </li>
          </ul>
        </div>
      )}

      {/* Custom animation for fade-in-down */}
      <style jsx global>{`
        @keyframes fadeInDown {
          0% {
            opacity: 0;
            transform: translateY(-24px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </nav>
  );
}
