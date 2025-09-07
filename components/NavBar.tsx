"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  Calendar,
  Phone,
  MessageCircle,
  ChevronDown,
  Sparkles,
  Landmark,
  Briefcase,
  HandCoins,
  Users as UsersIcon,
  Globe,
  Presentation,
} from "lucide-react";

import { buildAlternateHref, detectLang, type Locale } from "@/lib/i18nRoutes";

/* ======================= Language Toggle (uses slug mapping) ======================= */
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

  // Append hash only on the client (SSR-safe)
  const [hash, setHash] = React.useState("");
  React.useEffect(() => {
    if (typeof window !== "undefined" && window.location?.hash) {
      setHash(window.location.hash);
    }
  }, []);

  const altEn = buildAlternateHref(pathname, "en") + qs + hash;
  const altEs = buildAlternateHref(pathname, "es") + qs + hash;

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
      >
        EN
      </Link>
      <span className={sepCls}>/</span>
      <Link
        href={altEs}
        className={[linkClsBase, cur === "es" ? activeCls : ""].join(" ")}
        aria-current={cur === "es" ? "true" : undefined}
      >
        ES
      </Link>
    </nav>
  );
}

/* ======================= Nav items + data ======================= */
type Item = { href: string; label: string };

function navFor(lang: Locale): Item[] {
  return lang === "en"
    ? [
        { href: "/en/about", label: "About" },
        { href: "/en/services", label: "Services" }, // dropdown handled separately
        { href: "/en/resources", label: "Resources" },
        { href: "/en/tools", label: "Tools" },
        { href: "/en/testimonials", label: "Testimonials" },
        { href: "/en/contact", label: "Contact" },
      ]
    : [
        { href: "/es/sobre-mi", label: "Sobre mí" },
        { href: "/es/servicios", label: "Servicios" }, // dropdown handled separately
        { href: "/es/recursos", label: "Recursos" },
        { href: "/es/herramientas", label: "Herramientas" },
        { href: "/es/testimonios", label: "Testimonios" },
        { href: "/es/contacto", label: "Contacto" },
      ];
}

type ServiceItem = {
  href: string;
  label: string;
  icon: React.ReactNode;
  desc: string;
};

const SERVICES_EN: ServiceItem[] = [
  { href: "/en/services#signature", label: "Signature Packages", icon: <Sparkles size={14} />, desc: "Premium, coordinated support" },
  { href: "/en/services#foundations", label: "Wealth Foundations", icon: <HandCoins size={14} />, desc: "Savings rhythm, credit & readiness" },
  { href: "/en/services#mortgage", label: "Mortgage & Property Strategy", icon: <Landmark size={14} />, desc: "Pre-approval to closing" },
  { href: "/en/services#business", label: "Business & Professionals", icon: <Briefcase size={14} />, desc: "Owner pay, records, lender-credible" },
  { href: "/en/services#legacy", label: "Legacy & Tax Strategy", icon: <Sparkles size={14} />, desc: "Predictable cadence & set-asides" },
  { href: "/en/services#family", label: "Holistic Conversations (Family & Groups)", icon: <UsersIcon size={14} />, desc: "Small groups, kind pace" },
  { href: "/en/services#workshops", label: "Workshops", icon: <Presentation size={14} />, desc: "Public & private sessions" },
  { href: "/en/services#advice", label: "1:1 Advisory", icon: <Calendar size={14} />, desc: "Private sessions, written next steps" },
  { href: "/en/services#newcomers", label: "Newcomers", icon: <Globe size={14} />, desc: "Bilingual setup for banking & credit" },
];

const SERVICES_ES: ServiceItem[] = [
  { href: "/es/servicios#signature", label: "Paquetes Firma", icon: <Sparkles size={14} />, desc: "Acompañamiento premium" },
  { href: "/es/servicios#fundamentos", label: "Fundamentos de Riqueza", icon: <HandCoins size={14} />, desc: "Ahorro, crédito y preparación" },
  { href: "/es/servicios#hipoteca", label: "Hipoteca & Propiedades", icon: <Landmark size={14} />, desc: "De la preaprobación al cierre" },
  { href: "/es/servicios#negocios", label: "Negocios & Profesionales", icon: <Briefcase size={14} />, desc: "Pago del dueño, registros y banca" },
  { href: "/es/servicios#legado", label: "Legado & Impuestos", icon: <Sparkles size={14} />, desc: "Cadencia predecible y reservas" },
  { href: "/es/servicios#familia", label: "Conversaciones Holísticas", icon: <UsersIcon size={14} />, desc: "Grupos pequeños, ritmo amable" },
  { href: "/es/servicios#talleres", label: "Talleres", icon: <Presentation size={14} />, desc: "Sesiones públicas y privadas" },
  { href: "/es/servicios#asesoria", label: "Asesoría 1:1", icon: <Calendar size={14} />, desc: "Sesiones privadas con pasos por escrito" },
  { href: "/es/servicios#recien", label: "Recién Llegados", icon: <Globe size={14} />, desc: "Alta bilingüe de banca y crédito" },
];

/* ======================= NavBar Component ======================= */
export default function NavBar({ lang: propLang }: { lang?: Locale }) {
  const pathname = usePathname() || "/";
  const lang: Locale = propLang ?? (pathname.startsWith("/es") ? "es" : "en");
  const NAV = navFor(lang);
  const SERVICES = lang === "en" ? SERVICES_EN : SERVICES_ES;

  const [open, setOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);
  const [servicesOpen, setServicesOpen] = React.useState(false);
  const [servicesMobileOpen, setServicesMobileOpen] = React.useState(false);

  const headerRef = React.useRef<HTMLDivElement>(null);
  const [panelTop, setPanelTop] = React.useState<number>(80);

  const LINK_BASE =
    "inline-flex items-center h-10 px-0 text-[15px] leading-none transition " +
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold";
  const LINK_ACTIVE = "text-brand-green font-semibold";
  const LINK_IDLE = "text-brand-blue hover:text-brand-green";
  const UNDERLINE =
    "relative after:block after:h-[2px] after:bg-brand-gold after:rounded-full after:mt-0.5 " +
    "after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:origin-left";

  // Hover-intent timer
  const closeTimer = React.useRef<number | null>(null);
  const cancelClose = () => {
    if (closeTimer.current) {
      window.clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };
  const requestClose = (delay = 140) => {
    cancelClose();
    closeTimer.current = window.setTimeout(() => setServicesOpen(false), delay);
  };

  // Scroll state
  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 6);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Position the fixed submenu directly under the sticky header
  const measure = React.useCallback(() => {
    const el = headerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    setPanelTop(rect.bottom + 6);
  }, []);
  React.useEffect(() => {
    measure();
    window.addEventListener("resize", measure);
    window.addEventListener("scroll", measure, { passive: true });
    return () => {
      window.removeEventListener("resize", measure);
      window.removeEventListener("scroll", measure);
    };
  }, [measure]);

  // Close menus on route change or Esc
  React.useEffect(() => {
    setOpen(false);
    setServicesMobileOpen(false);
    setServicesOpen(false);
  }, [pathname]);
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setServicesOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Lock scroll when mobile menu is open
  React.useEffect(() => {
    const root = document.documentElement;
    if (open) {
      const prev = root.style.overflow;
      root.style.overflow = "hidden";
      return () => {
        root.style.overflow = prev;
      };
    }
  }, [open]);

  const isActive = (href: string) =>
    pathname === href || (href !== `/${lang}` && pathname.startsWith(href));

  const base = `/${lang}`;
  const t = (en: string, es: string) => (lang === "en" ? en : es);

  const convoHref = `${base}/${t("contact", "contacto")}?intent=${t("hello", "hola")}`;

  const servicesButtonId = "services-trigger";
  const servicesPanelId = "services-panel";

  return (
    <>
     
      {/* Utility bar (top green) */}
      <AnimatePresence initial={false}>
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="bg-brand-green text-white"
        >
          <div className="max-w-content mx-auto px-4 py-1 text-sm flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <a
                className="inline-flex items-center gap-1 hover:underline"
                href="tel:14167268420"
                aria-label={t("Call (416) 726-8420", "Llamar al (416) 726-8420")}
              >
                <Phone size={12} /> (416) 726-8420
              </a>
              <a
                className="inline-flex items-center gap-1 hover:underline"
                href="https://wa.me/14167268420"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
              >
                <MessageCircle size={12} /> WhatsApp
              </a>
            </div>
            <div className="flex items-center gap-3">
              <LangToggle invert lang={lang} />
              {/* CTA intentionally omitted */}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Main header */}
      <header
        ref={headerRef}
        className={[
          "sticky top-0 z-[200] backdrop-blur supports-[backdrop-filter]:bg-white/80 transition-shadow",
          scrolled ? "shadow-[0_1px_0_0_rgba(211,182,122,0.45)]" : "shadow-none",
        ].join(" ")}
        aria-label={t("Primary", "Principal")}
      >
        <div className="max-w-content mx-auto px-4 h-16 flex items-center justify-between gap-4">
          <Link href={base} className="flex items-center gap-2">
            <Image
              src="/logo.png"
              alt="Fanny Samaniego"
              width={32}
              height={32}
              className="rounded-full border border-brand-gold"
              onError={(e) => ((e.currentTarget as HTMLImageElement).style.display = "none")}
            />
            <span className="font-serif text-lg font-bold text-brand-green tracking-tight">
              Fanny Samaniego
            </span>
          </Link>

          {/* Desktop nav (≥ lg) */}
          <nav className="hidden lg:flex items-center gap-5 xl:gap-7 font-sans">
            {NAV.map((n) => {
              const isServicesLink =
                lang === "en" ? n.href === "/en/services" : n.href === "/es/servicios";
              if (!isServicesLink) {
                return (
                  <Link
                    key={n.href}
                    href={n.href}
                    onPointerEnter={() => setServicesOpen(false)}
                    className={[LINK_BASE, isActive(n.href) ? LINK_ACTIVE : LINK_IDLE, "group"].join(" ")}
                    aria-current={isActive(n.href) ? "page" : undefined}
                  >
                    <span className={UNDERLINE}>{n.label}</span>
                  </Link>
                );
              }
              return (
                <div
                  key={n.href}
                  className="relative"
                  onPointerEnter={() => {
                    cancelClose();
                    setServicesOpen(true);
                  }}
                  onPointerLeave={() => requestClose(140)}
                >
                  <button
                    id={servicesButtonId}
                    type="button"
                    onClick={() => setServicesOpen((s) => !s)}
                    onFocus={() => setServicesOpen(true)}
                    aria-haspopup="menu"
                    aria-expanded={servicesOpen}
                    aria-controls={servicesPanelId}
                    className={[LINK_BASE, servicesOpen || isActive(n.href) ? LINK_ACTIVE : LINK_IDLE, "group"].join(
                      " ",
                    )}
                  >
                    <span className={UNDERLINE}>{n.label}</span>
                    <ChevronDown
                      size={14}
                      className={[
                        "ml-1.5 shrink-0 transition",
                        servicesOpen ? "rotate-180" : "",
                        "translate-y-[0.5px]",
                      ].join(" ")}
                    />
                  </button>
                </div>
              );
            })}

            {/* Gentle desktop action (kept) */}
            <Link
              href={convoHref}
              className="ml-1 inline-flex items-center gap-1 rounded-full border border-brand-green text-brand-green px-3 py-1.5 text-xs font-semibold hover:bg-brand-green hover:text-white transition"
            >
              <Calendar size={12} /> {t("Start a conversation", "Iniciar conversación")}
            </Link>
          </nav>

          {/* Mobile toggle (< lg) */}
          <button
            type="button"
            className="lg:hidden inline-flex items-center justify-center rounded-xl border border-brand-green/30 p-2 text-brand-green"
            aria-label={t("Toggle menu", "Abrir menú")}
            aria-expanded={open}
            onClick={() => setOpen((s) => !s)}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="lg:hidden border-t border-brand-gold bg-white"
            >
              <div className="max-w-content mx-auto px-4 py-4 flex flex-col gap-2">
                {NAV.map((n) => {
                  const isServicesLink =
                    lang === "en" ? n.href === "/en/services" : n.href === "/es/servicios";
                  if (!isServicesLink) {
                    return (
                      <Link
                        key={n.href}
                        href={n.href}
                        className={[
                          "rounded-lg px-3 py-2 text-base",
                          isActive(n.href) ? "bg-brand-green text-white" : "text-brand-blue hover:bg-brand-green/10",
                        ].join(" ")}
                        onClick={() => setOpen(false)}
                      >
                        {n.label}
                      </Link>
                    );
                  }
                  return (
                    <div key={n.href}>
                      <button
                        type="button"
                        onClick={() => setServicesMobileOpen((s) => !s)}
                        aria-expanded={servicesMobileOpen}
                        className={[
                          "w-full rounded-lg px-3 py-2 text-base flex items-center justify-between",
                          servicesMobileOpen ? "bg-brand-green text-white" : "text-brand-blue hover:bg-brand-green/10",
                        ].join(" ")}
                      >
                        <span>{n.label}</span>
                        <ChevronDown size={18} className={servicesMobileOpen ? "rotate-180 transition" : "transition"} />
                      </button>
                      <AnimatePresence initial={false}>
                        {servicesMobileOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="pl-2"
                          >
                            {(lang === "en" ? SERVICES_EN : SERVICES_ES).map((s) => (
                              <Link
                                key={s.href}
                                href={s.href}
                                className="block rounded-md px-3 py-2 text-sm text-brand-blue hover:bg-brand-green/10"
                                onClick={() => setOpen(false)}
                              >
                                {s.label}
                              </Link>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
                <div className="flex items-center justify-between pt-2">
                  <LangToggle lang={lang} />
                  <Link
                    href={convoHref}
                    className="inline-flex items-center gap-1 rounded-full border border-brand-green text-brand-green px-3 py-1.5 text-xs font-semibold hover:bg-brand-green hover:text-white transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold"
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

      {/* ===== Fixed Services panel (desktop only) ===== */}
      <AnimatePresence>
        {servicesOpen && (
          <motion.div
            key="services-panel"
            id="services-panel"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="fixed left-1/2 z-[1000] -translate-x-1/2 w-[min(92vw,680px)]"
            style={{ top: panelTop }}
            onPointerEnter={() => {
              cancelClose();
              setServicesOpen(true);
            }}
            onPointerLeave={() => requestClose(120)}
            role="menu"
            aria-labelledby="services-trigger"
          >
            <div className="bg-white border border-brand-gold/70 rounded-2xl shadow-xl p-3 max-h-[80vh] overflow-auto overscroll-contain">
              <div className="grid gap-1.5" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
                {SERVICES.map((s) => (
                  <Link
                    key={s.href}
                    href={s.href}
                    className="group rounded-xl p-2.5 hover:bg-brand-green/5 focus:bg-brand-green/5 outline-none"
                    role="menuitem"
                    onClick={() => setServicesOpen(false)}
                  >
                    <div className="flex items-center gap-1.5 text-brand-green font-semibold">
                      {s.icon}
                      <span className="text-[15px] leading-tight">{s.label}</span>
                    </div>
                    <p className="text-[12px] leading-snug text-brand-blue/80 mt-1 whitespace-normal">
                      {s.desc}
                    </p>
                  </Link>
                ))}
              </div>
              <div className="mt-2.5 border-t border-brand-gold/40 pt-2.5 flex justify-between items-center">
                <Link
                  href={lang === "en" ? "/en/services" : "/es/servicios"}
                  className="text-sm text-brand-blue underline hover:text-brand-green"
                  onClick={() => setServicesOpen(false)}
                >
                  {lang === "en" ? "See all services" : "Ver todos los servicios"}
                </Link>
                <Link
                  href={convoHref}
                  className="inline-flex items-center gap-1 rounded-full border border-brand-green text-brand-green px-3 py-1.5 text-xs font-semibold hover:bg-brand-green hover:text-white transition"
                  onClick={() => setServicesOpen(false)}
                >
                  <Calendar size={12} /> {lang === "en" ? "Start a conversation" : "Iniciar conversación"}
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
