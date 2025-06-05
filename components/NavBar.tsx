"use client";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { FaBars, FaTimes, FaChevronDown, FaChevronUp } from "react-icons/fa";

const navGroups = [
  { href: "", labelEn: "Home", labelEs: "Inicio" },
  { href: "/about", labelEn: "About", labelEs: "Sobre Mí" },
  {
    labelEn: "Services", labelEs: "Servicios", href: "/services",
    subLinks: [
      { href: "/services", labelEn: "All Services", labelEs: "Todos los servicios" },
      { href: "/tools", labelEn: "Tools", labelEs: "Herramientas" },
      { href: "/investment", labelEn: "Investment", labelEs: "Inversión" },
    ]
  },
  {
    labelEn: "Resources", labelEs: "Recursos", href: "/resources",
    subLinks: [
      { href: "/resources", labelEn: "All Resources", labelEs: "Todos los recursos" },
      { href: "/budget-calculator", labelEn: "Budget Calculator", labelEs: "Calculadora Presupuesto" },
      { href: "/mortgage-calculator", labelEn: "Mortgage Calculator", labelEs: "Calculadora Hipotecaria" },
    ]
  },
  { href: "/testimonials", labelEn: "Testimonials", labelEs: "Testimonios" },
  { href: "/contact", labelEn: "Contact", labelEs: "Contacto" },
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

  // Mobile accordion toggle
  const handleAccordionToggle = (idx: number) => {
    setOpenAccordions((open) =>
      open.includes(idx) ? open.filter((i) => i !== idx) : [...open, idx]
    );
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

        {/* Hamburger for mobile */}
        <button
          className="md:hidden text-2xl text-brand-blue focus:outline-none"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>

        {/* Desktop Nav: Flat Links Only */}
        <ul className="hidden md:flex space-x-6 font-semibold text-lg items-center">
          {navGroups.map((item) => (
            <li key={item.labelEn}>
              <Link
                href={item.href === "" ? langPrefix : `${langPrefix}${item.href}`}
                className={`transition-colors hover:text-brand-gold text-brand-blue px-1.5 py-1 rounded-lg ${
                  pathname === (item.href === "" ? langPrefix : `${langPrefix}${item.href}`) ? "text-brand-gold" : ""
                }`}
              >
                {isSpanish ? item.labelEs : item.labelEn}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Mobile Accordion Menu */}
      {menuOpen && (
        <div className="fixed inset-0 bg-black/30 z-40" onClick={() => setMenuOpen(false)}>
          <ul
            className="absolute top-16 left-0 w-full bg-white shadow-xl flex flex-col items-center py-8 space-y-5 font-semibold text-xl z-50"
            onClick={e => e.stopPropagation()}
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
                              href={`${langPrefix}${sub.href}`}
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
              // Flat link for normal items
              return (
                <li key={item.labelEn} className="w-full">
                  <Link
                    href={item.href === "" ? langPrefix : `${langPrefix}${item.href}`}
                    className="block px-5 py-2 rounded-lg text-brand-blue hover:text-brand-gold transition"
                    onClick={() => setMenuOpen(false)}
                  >
                    {isSpanish ? item.labelEs : item.labelEn}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </nav>
  );
}
