"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { FaBars, FaTimes } from "react-icons/fa";

// All main navigation links
const navGroups = [
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
  
  const altLangPrefix = isSpanish ? "/en" : "/es";
  const otherLangLabel = isSpanish ? "English" : "Español";

  // Home link logic
  const homeHref = isSpanish ? "/es" : "/en";
  const getHref = (item: typeof navGroups[0]) => {
    if (isSpanish && item.hrefEs)
      return `/es${item.hrefEs.startsWith("/") ? item.hrefEs : `/${item.hrefEs}`}`;
    if (!isSpanish)
      return item.href === ""
        ? "/en"
        : `/en${item.href.startsWith("/") ? item.href : `/${item.href}`}`;
    return isSpanish ? `/es${item.href}` : `/en${item.href}`;
  };

  return (
    <nav className="bg-white/90 border-b border-brand-blue/20 shadow-xl fixed top-0 left-0 w-full z-50 backdrop-blur-lg">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-3">
        {/* Logo/Brand */}
        <Link href={homeHref}>
          <span className="flex items-center cursor-pointer select-none">
            <span
              className="inline-flex items-center justify-center rounded-full border-2 border-brand-gold shadow-lg bg-white mr-3 transition-all duration-300 hover:scale-105"
              style={{ width: 40, height: 40, overflow: "hidden" }}
            >
              <Image
                src="/logo.png"
                alt="Logo"
                width={34}
                height={34}
                style={{
                  borderRadius: "50%",
                  minWidth: 34,
                  minHeight: 34,
                  objectFit: "cover",
                  display: "block",
                }}
                priority
              />
            </span>
            <span className="font-serif text-xl font-extrabold tracking-tight text-brand-blue drop-shadow-sm hover:text-brand-gold transition-colors duration-200">
              Fanny Samaniego
            </span>
          </span>
        </Link>

        {/* Desktop Nav: ALL links, text-base */}
        <ul className="hidden md:flex space-x-4 font-semibold text-base items-center ml-6">
          {navGroups.map((item) => {
            const linkHref = getHref(item);
            const isActive =
              pathname === linkHref ||
              (item.href && pathname?.startsWith(linkHref));
            return (
              <li key={item.labelEn} className="flex items-center">
                <Link
                  href={linkHref}
                  className={`px-3 py-2 rounded-xl min-w-[90px] text-center transition-all duration-200 ${
                    isActive
                      ? "bg-brand-green/90 text-white shadow font-bold"
                      : "text-brand-blue hover:bg-brand-gold/20 hover:text-brand-gold"
                  }`}
                  aria-current={isActive ? "page" : undefined}
                >
                  {isSpanish ? item.labelEs : item.labelEn}
                </Link>
              </li>
            );
          })}
          <li>
            <Link
              href={altLangPrefix}
              className="ml-2 px-3 py-2 border border-brand-blue text-brand-blue rounded-xl font-bold hover:bg-brand-blue hover:text-brand-gold transition-all"
            >
              {otherLangLabel}
            </Link>
          </li>
        </ul>

        {/* Mobile menu toggle */}
        <button
          className="md:hidden text-3xl text-brand-blue focus:outline-none hover:text-brand-gold transition"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Mobile Menu: all links */}
      {menuOpen && (
        <div className="fixed inset-0 bg-black/40 z-40" onClick={() => setMenuOpen(false)}>
          <ul
            className="absolute top-16 left-0 w-full bg-white shadow-2xl rounded-b-3xl flex flex-col items-center py-10 space-y-6 font-semibold text-xl z-50 transition-all"
            onClick={(e) => e.stopPropagation()}
          >
            {navGroups.map((item) => (
              <li key={item.labelEn} className="w-full">
                <Link
                  href={getHref(item)}
                  className="block px-7 py-3 rounded-xl text-brand-blue hover:text-brand-gold hover:bg-brand-gold/10 transition text-center min-w-[120px]"
                  onClick={() => setMenuOpen(false)}
                >
                  {isSpanish ? item.labelEs : item.labelEn}
                </Link>
              </li>
            ))}
            {/* Language toggle */}
            <li className="w-full pt-3">
              <Link
                href={altLangPrefix}
                className="block text-center px-7 py-3 rounded-xl border border-brand-blue text-brand-blue font-bold hover:bg-brand-blue hover:text-brand-gold transition"
                onClick={() => setMenuOpen(false)}
              >
                {otherLangLabel}
              </Link>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
}
