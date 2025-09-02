"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

type Props = {
  className?: string;
  children?: React.ReactNode;
  "aria-label"?: string;
};

function isEn(path: string) { return path.startsWith("/en"); }
function isEs(path: string) { return path.startsWith("/es"); }
function isArticlePath(path: string) {
  return /^\/en\/resources\/[^/]+$/.test(path) || /^\/es\/recursos\/[^/]+$/.test(path);
}

// Prefer HEAD to keep it light; switch to GET if your host blocks HEAD.
async function pathExists(url: string) {
  try {
    const res = await fetch(url, { method: "HEAD", cache: "no-store" });
    return res.ok;
  } catch {
    return false;
  }
}

export default function LanguageSwitchLink({ className, children, ...rest }: Props) {
  const pathname = usePathname() || "/";
  const [href, setHref] = useState("/");

  const targetHrefInitial = useMemo(() => {
    const map: Record<string, string> = {
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

    if (isArticlePath(pathname)) {
      // resolved in effect; default to the index in the other language
      return isEn(pathname) ? "/es/recursos" : "/en/resources";
    }
    if (map[pathname]) return map[pathname];
    if (isEn(pathname)) return "/es" + pathname.slice(3);
    if (isEs(pathname)) return "/en" + pathname.slice(3);
    return pathname;
  }, [pathname]);

  useEffect(() => {
    let cancelled = false;
    async function resolve() {
      if (!isArticlePath(pathname)) {
        if (!cancelled) setHref(targetHrefInitial);
        return;
      }
      const slug = pathname.split("/").pop()!;
      const candidate = isEn(pathname)
        ? `/es/recursos/${slug}`
        : `/en/resources/${slug}`;

      const ok = await pathExists(candidate);
      if (!cancelled) setHref(ok ? candidate : targetHrefInitial);
    }
    resolve();
    return () => { cancelled = true; };
  }, [pathname, targetHrefInitial]);

  const label = isEn(pathname) ? "ES" : "EN";

  return (
    <Link
      href={href}
      className={className}
      aria-label={rest["aria-label"] ?? `Switch to ${label}`}
    >
      {children ?? label}
    </Link>
  );
}
