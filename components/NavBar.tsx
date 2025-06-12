"use client";

import Link from "next/link";
import Image from "next/image";
import { MouseEvent, useState } from "react";
import { usePathname } from "next/navigation";
import { FaBars, FaTimes, FaChevronDown, FaChevronUp } from "react-icons/fa";

// Define specific types for navigation links to avoid 'any'
type SubNavLink = {
  href: string;
  labelEn: string;
  labelEs: string;
  hrefEs?: string; // Optional property
};

type NavLink = {
  href: string;
  labelEn: string;
  labelEs: string;
  hrefEs?: string; // Optional property
  subLinks?: SubNavLink[]; // Optional array of SubNavLinks
};

// Apply the new type to the navGroups array
const navGroups: NavLink[] = [
  // Home
  { href: "", labelEn: "Home", labelEs: "Inicio" },
  // About
  { href: "/about", labelEn: "About", labelEs: "Sobre Mí", hrefEs: "/sobre-mi" },
  // Services
  {
    href: "/services",
    labelEn: "Services",
    labelEs: "Servicios",
    hrefEs: "/servicios",
    subLinks: [
      { href: "/services", labelEn: "All Services", labelEs: "Todos los servicios", hrefEs: "/servicios" },
    ],
  },
  // Tools / Herramientas
  {
    href: "/tools",
    labelEn: "Tools",
    labelEs: "Herramientas",
    hrefEs: "/herramientas",
    subLinks: [
      { href: "/budget-calculator", labelEn: "Budget Calculator", labelEs: "Calculadora Presupuesto", hrefEs: "/calculadora-presupuesto" },
      { href: "/mortgage-calculator", labelEn: "Mortgage Calculator", labelEs: "Calculadora Hipotecaria", hrefEs: "/calculadora-hipotecaria" },
    ],
  },
  // Resources / Recursos
  {
    href: "/resources",
    labelEn: "Resources",
    labelEs: "Recursos",
    hrefEs: "/recursos",
    subLinks: [
      { href: "/resources", labelEn: "All Resources", labelEs: "Todos los recursos", hrefEs: "/recursos" },
    ],
  },
  // Testimonials / Testimonios
  { href: "/testimonials", labelEn: "Testimonials", labelEs: "Testimonios", hrefEs: "/testimonios" },
  // Contact / Contacto
  { href: "/contact", labelEn: "Contact", labelEs: "Contacto", hrefEs: "/contacto" },
];

type NavBarProps = {
  lang?: string;
};

export default function NavBar({ lang = "en" }: NavBarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [openAccordions, setOpenAccordions] = useState<number[]>([]);
  const pathname = usePathname();
  const isSpanish = lang === "es";
  const langPrefix = isSpanish ? "/es" : "/en";
  const altLangPrefix = isSpanish ? "/en" : "/es";

  const handleAccordionToggle = (idx: number) => {
    setOpenAccordions((open) =>
      open.includes(idx) ? open.filter((i) => i !== idx) : [...open, idx]
    );
  };

  // Helper for bilingual routing with the specific NavLink type
  const getHref = (item: NavLink) => {
    if (isSpanish && item.hrefEs) return `/es${item.hrefEs.startsWith("/") ? item.hrefEs : `/${item.hrefEs}`}`;
    if (!isSpanish) return item.href === "" ? "/en" : `/en${item.href.startsWith("/") ? item.href : `/${item.href}`}`;
    // fallback
    return isSpanish ? `/es${item.href}` : `/en${item.href}`;
  };

  // For sublinks in Tools/Resources with the specific SubNavLink type
  const getSubHref = (sub: SubNavLink) => {
    if (isSpanish && sub.hrefEs) return `/es${sub.hrefEs.startsWith("/") ? sub.hrefEs : `/${sub.hrefEs}`}`;
    if (!isSpanish) return `/en${sub.href.startsWith("/") ? sub.href : sub.href}`;
    return isSpanish ? `/es${sub.href}` : `/en${sub.href}`;
  };
  
  // Type the event parameter to avoid implicit 'any'
  const handleMobileNavClick = (e: MouseEvent<HTMLUListElement>) => {
    e.stopPropagation();
  };

  return (
    <nav className="bg-white border-b shadow-lg fixed top-0 left-0 w-full z-50">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-3">
        {/* Logo/Brand */}
        <Link href={langPrefix}>
          <span className="flex items-center cursor-pointer select-none">
            <Image
              src="/logo.png"
              alt="Logo"
              className="mr-2"
              width={36}
              height={36}
              style={{ minWidth: 36 }}
            />
            <span className="font-serif text-2xl font-bold text-brand-blue">
              Fanny Samaniego
            </span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <ul className="hidden md:flex space-x-6 font-semibold text-lg items-center">
          {navGroups.map((item) => (
            <li key={item.labelEn}>
              <Link
                href={getHref(item)}
                className={`transition-colors hover:text-brand-gold text-brand-blue px-1.5 py-1 rounded-lg ${
                  pathname === getHref(item)
                    ? "text-brand-gold"
                    : ""
                }`}
              >
                {isSpanish ? item.labelEs : item.labelEn}
              </Link>
            </li>
          ))}
          <li>
            <Link
              href={altLangPrefix}
              className="ml-4 px-3 py-1.5 border border-brand-blue text-brand-blue rounded-lg hover:bg-brand-blue hover:text-white transition"
            >
              {isSpanish ? "English" : "Español"}
            </Link>
          </li>
        </ul>

        {/* Mobile menu toggle */}
        <button
          className="md:hidden text-2xl text-brand-blue focus:outline-none"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Mobile Accordion Menu */}
      {menuOpen && (
        <div className="fixed inset-0 bg-black/30 z-40" onClick={() => setMenuOpen(false)}>
          <ul
            className="absolute top-16 left-0 w-full bg-white shadow-xl flex flex-col items-center py-8 space-y-5 font-semibold text-xl z-50"
            onClick={handleMobileNavClick}
          >
            {navGroups.map((item, idx) => {
              if (item.subLinks) {
                const open = openAccordions.includes(idx);
                return (
                  <li key={item.labelEn} className="w-full">
                    <button
                      onClick={() => handleAccordionToggle(idx)}
                      className="w-full flex justify-between items-center px-5 py-2 rounded-lg text-brand-blue font-bold hover:bg-brand-blue/10 focus:outline-none"
                    >
                      <span>{isSpanish ? item.labelEs : item.labelEn}</span>
                      {open ? <FaChevronUp /> : <FaChevronDown />}
                    </button>
                    {open && (
                      <ul className="pl-6 pt-1 flex flex-col space-y-2">
                        {item.subLinks.map((sub) => (
                          <li key={sub.labelEn}>
                            <Link
                              href={getSubHref(sub)}
                              className="block px-2 py-1 text-brand-blue hover:text-brand-gold transition rounded"
                              onClick={() => setMenuOpen(false)}
                            >
                              {isSpanish ? sub.labelEs : sub.labelEn}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                );
              }
              return (
                <li key={item.labelEn} className="w-full">
                  <Link
                    href={getHref(item)}
                    className="block px-5 py-2 rounded-lg text-brand-blue hover:text-brand-gold transition"
                    onClick={() => setMenuOpen(false)}
                  >
                    {isSpanish ? item.labelEs : item.labelEn}
                  </Link>
                </li>
              );
            })}
            {/* Language toggle */}
            <li className="w-full">
              <Link
                href={altLangPrefix}
                className="block text-center px-5 py-2 mt-4 rounded-lg border border-brand-blue text-brand-blue hover:bg-brand-blue hover:text-white transition"
                onClick={() => setMenuOpen(false)}
              >
                {isSpanish ? "English" : "Español"}
              </Link>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
}