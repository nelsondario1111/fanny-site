"use client";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

// Define navigation labels for both languages
const NAV_LINKS = [
  { en: "About", es: "Sobre mí", href: "/about" },
  { en: "Services", es: "Servicios", href: "/services" },
  { en: "Tools", es: "Herramientas", href: "/tools" },
  { en: "Resources", es: "Recursos", href: "/resources" },
  { en: "Testimonials", es: "Testimonios", href: "/testimonials" },
  { en: "Contact", es: "Contacto", href: "/contact" },
];

export default function NavBar({ lang = "en" }: { lang?: "en" | "es" }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const isSpanish = lang === "es";
  const currentLangPrefix = isSpanish ? "/es" : "/en";
  const otherLang = isSpanish ? "en" : "es";
  const otherLangLabel = isSpanish ? "English" : "Español";
  const otherLangPrefix = otherLang === "es" ? "/es" : "/en";
  const currentPath = pathname?.replace(/^\/(en|es)/, "") || "";

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="w-full bg-white/95 border-b border-brand-green/20 shadow-sm sticky top-0 z-40 backdrop-blur">
      <nav className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between gap-4 relative">
        {/* LOGO */}
        <Link href={isSpanish ? "/es" : "/en"}>
          <span className="flex items-center cursor-pointer select-none">
            <span className="inline-flex items-center justify-center rounded-full border-2 border-brand-gold shadow-lg bg-white mr-3 transition-all duration-300 hover:scale-105"
              style={{ width: 46, height: 46, overflow: "hidden" }}>
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

        {/* Desktop navigation */}
        <ul className="hidden md:flex gap-2 ml-4">
          {NAV_LINKS.map((link) => (
            <li key={link.en}>
              <Link
                href={currentLangPrefix + link.href}
                className={`px-3 py-2 rounded-full font-semibold text-base md:text-lg transition-colors ${
                  pathname?.startsWith(currentLangPrefix + link.href) ||
                  pathname === currentLangPrefix + link.href
                    ? "bg-brand-green text-white"
                    : "text-brand-green hover:bg-brand-gold/20"
                }`}
                onClick={closeMenu}
              >
                {link[lang]}
              </Link>
            </li>
          ))}
        </ul>

        {/* Language toggle */}
        <Link
          href={`${otherLangPrefix}${currentPath}`}
          className="hidden md:inline-flex ml-6 px-4 py-2 rounded-full bg-brand-gold text-brand-blue font-semibold hover:bg-brand-blue hover:text-brand-gold border border-brand-green/20 transition"
          aria-label={`Switch to ${otherLangLabel}`}
        >
          {otherLangLabel}
        </Link>

        {/* Mobile menu button */}
        <button
          className="md:hidden p-2 rounded-lg border border-brand-green/30 bg-white text-brand-green"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
        >
          {menuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden fixed inset-0 z-50 bg-black/30 flex flex-col">
            <nav className="bg-white shadow-xl rounded-b-2xl p-6 pb-8 flex flex-col gap-4 w-full max-w-xs ml-auto h-full">
              <button
                className="mb-4 self-end p-2 rounded-full bg-brand-gold/30 text-brand-blue"
                onClick={closeMenu}
                aria-label="Cerrar menú"
              >
                <X size={30} />
              </button>
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.en}
                  href={currentLangPrefix + link.href}
                  className={`block w-full px-4 py-3 rounded-xl text-lg font-bold transition-colors ${
                    pathname?.startsWith(currentLangPrefix + link.href) ||
                    pathname === currentLangPrefix + link.href
                      ? "bg-brand-green text-white"
                      : "text-brand-green hover:bg-brand-gold/20"
                  }`}
                  onClick={closeMenu}
                >
                  {link[lang]}
                </Link>
              ))}
              <Link
                href={`${otherLangPrefix}${currentPath}`}
                className="mt-8 block px-6 py-3 rounded-full bg-brand-gold text-brand-blue font-bold hover:bg-brand-blue hover:text-brand-gold border border-brand-green/20 transition text-center"
                onClick={closeMenu}
                aria-label={`Switch to ${otherLangLabel}`}
              >
                {otherLangLabel}
              </Link>
            </nav>
            <div className="flex-1" onClick={closeMenu} />
          </div>
        )}
      </nav>
    </header>
  );
}
