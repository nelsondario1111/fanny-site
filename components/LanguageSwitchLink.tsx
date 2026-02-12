"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { buildAlternateHref, detectLang, type Locale } from "@/lib/i18nRoutes";

type Props = {
  className?: string;
  children?: React.ReactNode;
  "aria-label"?: string;
};

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
  const pathname = usePathname() || "/en";
  const search = useSearchParams();
  const lang: Locale = detectLang(pathname) ?? "en";
  const target: Locale = lang === "en" ? "es" : "en";
  const qs = search?.toString() ? `?${search.toString()}` : "";
  const [hash, setHash] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") setHash(window.location.hash || "");
  }, [pathname]);

  const targetHrefInitial = useMemo(() => {
    if (isArticlePath(pathname)) {
      return lang === "en" ? "/es/recursos" : "/en/resources";
    }
    return buildAlternateHref(pathname, target);
  }, [lang, pathname, target]);

  const [href, setHref] = useState(`${targetHrefInitial}${qs}${hash}`);

  useEffect(() => {
    setHref(`${targetHrefInitial}${qs}${hash}`);
  }, [hash, qs, targetHrefInitial]);

  useEffect(() => {
    let cancelled = false;
    async function resolve() {
      if (!isArticlePath(pathname)) {
        if (!cancelled) setHref(`${targetHrefInitial}${qs}${hash}`);
        return;
      }
      const slug = pathname.split("/").pop()!;
      const candidate = lang === "en"
        ? `/es/recursos/${slug}`
        : `/en/resources/${slug}`;

      const ok = await pathExists(candidate);
      if (!cancelled) setHref(`${ok ? candidate : targetHrefInitial}${qs}${hash}`);
    }
    resolve();
    return () => { cancelled = true; };
  }, [hash, lang, pathname, qs, targetHrefInitial]);

  const label = lang === "en" ? "ES" : "EN";
  const languageName = lang === "en" ? "Spanish" : "English";

  return (
    <Link
      href={href}
      className={className}
      aria-label={rest["aria-label"] ?? `Switch language to ${languageName}`}
    >
      {children ?? label}
    </Link>
  );
}
