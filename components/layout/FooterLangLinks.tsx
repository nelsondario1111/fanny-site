"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";

function isEn(path: string) { return path.startsWith("/en"); }
function isEs(path: string) { return path.startsWith("/es"); }
function isArticlePath(path: string) {
  return /^\/en\/resources\/[^/]+$/.test(path) || /^\/es\/recursos\/[^/]+$/.test(path);
}

async function pathExists(url: string) {
  try {
    const res = await fetch(url, { method: "HEAD", cache: "no-store" });
    return res.ok;
  } catch {
    return false;
  }
}

/** Stable base map (module scope to avoid re-creation per render) */
const BASE_MAP: Record<string, string> = {
  // EN -> ES
  "/en": "/es",
  "/en/about": "/es/sobre-mi",
  "/en/services": "/es/servicios",
  "/en/resources": "/es/recursos",
  "/en/tools": "/es/herramientas",
  "/en/testimonials": "/es/testimonios",
  "/en/contact": "/es/contacto",
  "/en/privacy": "/es/privacidad",
  "/en/terms": "/es/terminos",
  // ES -> EN
  "/es": "/en",
  "/es/sobre-mi": "/en/about",
  "/es/servicios": "/en/services",
  "/es/recursos": "/en/resources",
  "/es/herramientas": "/en/tools",
  "/es/testimonios": "/en/testimonials",
  "/es/contacto": "/en/contact",
  "/es/privacidad": "/en/privacy",
  "/es/terminos": "/en/terms",
};

export default function FooterLangLinks({ className }: { className?: string }) {
  const pathname = usePathname() || "/";
  const [toEn, setToEn] = useState("/en");
  const [toEs, setToEs] = useState("/es");

  const initialTargets = useMemo(() => {
    const toEnDefault =
      BASE_MAP[pathname] && isEs(pathname)
        ? BASE_MAP[pathname]
        : isEs(pathname)
        ? "/en" + pathname.slice(3)
        : "/en";

    const toEsDefault =
      BASE_MAP[pathname] && isEn(pathname)
        ? BASE_MAP[pathname]
        : isEn(pathname)
        ? "/es" + pathname.slice(3)
        : "/es";

    // On article pages, start with the resources index in the other language
    return {
      safeToEn: isArticlePath(pathname) ? "/en/resources" : toEnDefault,
      safeToEs: isArticlePath(pathname) ? "/es/recursos" : toEsDefault,
    };
  }, [pathname]);

  useEffect(() => {
    let cancelled = false;

    async function resolve() {
      if (isArticlePath(pathname)) {
        const slug = pathname.split("/").pop()!;
        if (isEs(pathname)) {
          const candidate = `/en/resources/${slug}`;
          const ok = await pathExists(candidate);
          if (!cancelled) setToEn(ok ? candidate : initialTargets.safeToEn);
          if (!cancelled) setToEs("/es/recursos");
        } else if (isEn(pathname)) {
          const candidate = `/es/recursos/${slug}`;
          const ok = await pathExists(candidate);
          if (!cancelled) setToEs(ok ? candidate : initialTargets.safeToEs);
          if (!cancelled) setToEn("/en/resources");
        }
      } else {
        if (!cancelled) {
          setToEn(initialTargets.safeToEn);
          setToEs(initialTargets.safeToEs);
        }
      }
    }

    resolve();
    return () => { cancelled = true; };
  }, [pathname, initialTargets]);

  return (
    <div className={className}>
      <div className="flex items-center gap-3">
        <Link href={toEn} className="underline hover:opacity-80">EN</Link>
        <span className="text-neutral-500">/</span>
        <Link href={toEs} className="underline hover:opacity-80">ES</Link>
      </div>
    </div>
  );
}
