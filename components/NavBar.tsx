"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Calendar, Phone, MessageCircle } from "lucide-react";

import { buildAlternateHref, detectLang, type Locale } from "@/lib/i18nRoutes";

/* ======================= Language Toggle ======================= */
function LangToggle({
  invert = false,
  lang: propLang,
}: {
  invert?: boolean;
  lang?: Locale;
}) {
  const pathname = usePathname() || "/en";
  const search = useSearchParams();

  const cur: Locale = propLang ?? (detectLang(pathname) || "en");
  const qs = search?.toString() ? `?${search!.toString()}` : "";

  const [hash, setHash] = React.useState("");
  React.useEffect(() => {
    if (typeof window !== "undefined" && window.location?.hash) {
      setHash(window.location.hash);
    }
  }, []);

  // Normalize before mapping to the alternate locale route.
  const normalized = pathname.split("?")[0].split("#")[0].replace(/\/+$/, "");
  const altEn = buildAlternateHref(normalized, "en") + qs + hash;
  const altEs = buildAlternateHref(normalized, "es") + qs + hash;

  const linkClsBase = invert
    ? "text-white/85 hover:text-white"
    : "text-brand-blue hover:text-brand-green";
  const activeCls = invert
    ? "text-white font-semibold pointer-events-none"
    : "text-brand-green font-semibold pointer-events-none";
  const sepCls = invert ? "text-white/40" : "text-gray-400";

  return (
    <nav aria-label="Language" className="inline-flex items-center gap-2 text-xs">
      <Link
        href={altEn}
        className={[linkClsBase, cur === "en" ? activeCls : ""].join(" ")}
        aria-current={cur === "en" ? "true" : undefined}
        aria-label="Switch language to English"
      >
        EN
      </Link>
      <span className={sepCls}>/</span>
      <Link
        href={altEs}
        className={[linkClsBase, cur === "es" ? activeCls : ""].join(" ")}
        aria-current={cur === "es" ? "true" : undefined}
        aria-label="Switch language to Spanish"
      >
        ES
      </Link>
    </nav>
  );
}

/* ======================= Nav Data ======================= */
type Item = { href: string; label: string };

function navFor(lang: Locale): Item[] {
  return lang === "en"
    ? [
        { href: "/en/about", label: "About" },
        { href: "/en/services", label: "Services" },
        { href: "/en/resources", label: "Resources" },
        { href: "/en/tools", label: "Tools" },
        { href: "/en/testimonials", label: "Testimonials" },
        { href: "/en/contact", label: "Contact" },
      ]
    : [
        { href: "/es/sobre-mi", label: "Sobre mí" },
        { href: "/es/servicios", label: "Servicios" },
        { href: "/es/recursos", label: "Recursos" },
        { href: "/es/herramientas", label: "Herramientas" },
        { href: "/es/testimonios", label: "Testimonios" },
        { href: "/es/contacto", label: "Contacto" },
      ];
}

/* ======================= NavBar Component ======================= */
export default function NavBar({ lang: propLang }: { lang?: Locale }) {
  const pathname = usePathname() || "/";
  const lang: Locale = propLang ?? (pathname.startsWith("/es") ? "es" : "en");
  const NAV = navFor(lang);

  const [open, setOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 6);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const base = `/${lang}`;
  const t = (en: string, es: string) => (lang === "en" ? en : es);
  const convoHref = `${base}/${t("contact", "contacto")}?intent=${t("hello", "hola")}`;
  const brandSubtitle = t("Holistic Financial Consultant", "Consultora financiera holística");
  const UTILITY_LINK =
    "inline-flex items-center gap-1 rounded-full border border-white/25 bg-white/10 px-2.5 py-1 text-xs hover:bg-white/20 transition";

  const LINK_BASE =
    "inline-flex items-center h-10 px-0 text-[14px] font-medium leading-none transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold";
  const LINK_ACTIVE = "text-brand-green font-semibold";
  const LINK_IDLE = "text-brand-blue hover:text-brand-green";
  const UNDERLINE =
    "relative after:block after:h-[2px] after:bg-brand-gold after:rounded-full after:mt-0.5 after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:origin-left";

  return (
    <>
      {/* Top utility bar */}
      <AnimatePresence initial={false}>
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="bg-gradient-to-r from-brand-green via-brand-green to-brand-green/90 text-white border-b border-brand-gold/25"
        >
          <div className="max-w-content mx-auto px-4 py-1.5 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-1.5">
              <a className={UTILITY_LINK} href="tel:14167268420">
                <Phone size={12} /> (416) 726-8420
              </a>
              <a
                className={UTILITY_LINK}
                href="https://wa.me/14167268420"
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle size={12} /> WhatsApp
              </a>
            </div>
            <LangToggle invert lang={lang} />
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Main Header */}
      <header
        className={[
          "sticky top-0 z-[200] backdrop-blur-md transition-all border-b",
          scrolled
            ? "bg-white/95 border-brand-gold/30 shadow-[0_10px_30px_rgba(47,74,53,0.10)]"
            : "bg-white/88 border-brand-gold/20 shadow-none",
        ].join(" ")}
      >
        <div className="max-w-content mx-auto px-4 h-[68px] flex items-center justify-between gap-4">
          {/* Logo */}
          <Link href={base} className="flex items-center gap-2.5">
            <Image
              src="/logo.png"
              alt="Fanny Samaniego"
              width={32}
              height={32}
              className="rounded-full border border-brand-gold shadow-sm"
            />
            <span className="flex flex-col leading-tight">
              <span className="font-brand text-[1.1rem] font-semibold text-brand-green tracking-[-0.015em]">
                Fanny Samaniego
              </span>
              <span className="hidden sm:block font-sans text-[10px] font-medium uppercase text-brand-blue/80 tracking-[0.14em]">
                {brandSubtitle}
              </span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-8 font-sans">
            {NAV.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                className={[LINK_BASE, pathname.startsWith(n.href) ? LINK_ACTIVE : LINK_IDLE, "group"].join(" ")}
              >
                <span className={UNDERLINE}>{n.label}</span>
              </Link>
            ))}
            <Link
              href={convoHref}
              className="ml-2 inline-flex items-center gap-1 rounded-full bg-brand-green text-white px-3.5 py-2 text-xs font-semibold shadow-[0_8px_20px_rgba(47,74,53,0.2)] hover:-translate-y-[1px] hover:bg-brand-green/90 transition"
            >
              <Calendar size={12} /> {t("Start a conversation", "Iniciar conversación")}
            </Link>
          </nav>

          {/* Mobile Toggle */}
          <button
            type="button"
            className="lg:hidden inline-flex items-center justify-center rounded-xl border border-brand-green/30 bg-white/80 p-2 text-brand-green shadow-sm"
            aria-label={t("Toggle menu", "Abrir menú")}
            aria-expanded={open}
            onClick={() => setOpen((s) => !s)}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="lg:hidden border-t border-brand-gold/35 bg-white/95 backdrop-blur-md shadow-[0_10px_30px_rgba(47,74,53,0.1)]"
            >
              <div className="max-w-content mx-auto px-4 py-4 flex flex-col gap-2">
                {NAV.map((n) => (
                  <Link
                    key={n.href}
                    href={n.href}
                    className={[
                      "rounded-lg px-3 py-2 text-base border",
                      pathname.startsWith(n.href)
                        ? "bg-brand-green border-brand-green text-white shadow-sm"
                        : "border-brand-gold/30 text-brand-blue hover:bg-brand-green/10",
                    ].join(" ")}
                    onClick={() => setOpen(false)}
                  >
                    {n.label}
                  </Link>
                ))}
                <div className="flex items-center justify-between pt-2">
                  <LangToggle lang={lang} />
                  <Link
                    href={convoHref}
                    className="inline-flex items-center gap-1 rounded-full bg-brand-green text-white px-3 py-1.5 text-xs font-semibold shadow-sm hover:bg-brand-green/90 transition"
                    onClick={() => setOpen(false)}
                  >
                    <Calendar size={12} /> {t("Start a conversation", "Iniciar conversación")}
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}
