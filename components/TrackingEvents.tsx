"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { track } from "@vercel/analytics";

const SCROLL_DEPTHS = [25, 50, 75, 90] as const;

function normalize(input: string) {
  return input.toLowerCase().replace(/\s+/g, " ").trim();
}

function getLocale(pathname: string) {
  return pathname.startsWith("/es") ? "es" : "en";
}

function getLinkHref(el: Element) {
  if (el instanceof HTMLAnchorElement) {
    return el.getAttribute("href") || "";
  }
  return "";
}

function getTrackLabel(el: Element) {
  const attr = el.getAttribute("data-track-label");
  if (attr) return attr;
  const aria = el.getAttribute("aria-label");
  if (aria) return aria;
  return (el.textContent || "").slice(0, 80).trim();
}

function isTrackedScrollPath(pathname: string) {
  return [
    "/en/services",
    "/es/servicios",
    "/en/tax-review",
    "/es/revision-impuestos",
  ].some((p) => pathname.startsWith(p));
}

function inferCtaType(label: string, href: string) {
  const text = normalize(label);
  const target = normalize(href);
  if (text.includes("whatsapp") || target.includes("wa.me")) return "whatsapp";
  if (
    text.includes("tax review") ||
    text.includes("revision de impuestos") ||
    target.includes("/tax-review") ||
    target.includes("/revision-impuestos")
  ) {
    return "tax_review";
  }
  if (
    text.includes("book") ||
    text.includes("reservar") ||
    text.includes("discovery") ||
    target.includes("/book") ||
    target.includes("/reservar") ||
    target.includes("intent=consult")
  ) {
    return "book_discovery";
  }
  if (
    text.includes("checklist") ||
    text.includes("lista") ||
    target.includes("checklist") ||
    target.includes("lista-")
  ) {
    return "checklist";
  }
  return null;
}

function isToolDownload(pathname: string, label: string, href: string, el: Element) {
  const inTools = pathname.includes("/tools") || pathname.includes("/herramientas");
  if (!inTools) return false;

  const text = normalize(label);
  const link = normalize(href);
  const hasDownloadAttr =
    el instanceof HTMLAnchorElement && typeof el.download === "string" && el.download !== "";

  return (
    hasDownloadAttr ||
    /\.(csv|xlsx)(\?|$)/i.test(link) ||
    text.includes("csv") ||
    text.includes("xlsx") ||
    text.includes("download") ||
    text.includes("descargar") ||
    text.includes("export")
  );
}

export default function TrackingEvents() {
  const pathname = usePathname() || "/";

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      if (!target) return;
      const actionEl = target.closest("a,button");
      if (!actionEl) return;

      const href = getLinkHref(actionEl);
      const label = getTrackLabel(actionEl);
      const locale = getLocale(pathname);
      const explicitTrack = actionEl.getAttribute("data-track");
      const explicitType = actionEl.getAttribute("data-track-type") || undefined;

      if (explicitTrack === "cta_click") {
        track("cta_click", {
          path: pathname,
          locale,
          cta_type: explicitType || "unknown",
          label,
          href,
        });
        return;
      }

      const inferred = inferCtaType(label, href);
      if (inferred) {
        track("cta_click", {
          path: pathname,
          locale,
          cta_type: inferred,
          label,
          href,
        });
      }

      if (isToolDownload(pathname, label, href, actionEl)) {
        track("tool_download", {
          path: pathname,
          locale,
          label,
          href,
          format: /\.xlsx(\?|$)/i.test(href) || normalize(label).includes("xlsx") ? "xlsx" : "csv",
        });
      }
    };

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [pathname]);

  useEffect(() => {
    const onSubmit = (event: Event) => {
      const form = event.target as HTMLFormElement | null;
      if (!form) return;

      const id = normalize(form.id || "");
      const aria = normalize(form.getAttribute("aria-label") || "");
      const action = normalize(form.getAttribute("action") || "");
      const hasNewsletterSignal =
        id.includes("newsletter") ||
        aria.includes("newsletter") ||
        action.includes("/subscribe") ||
        action.includes("/suscribir");

      if (!hasNewsletterSignal) return;

      track("newsletter_submit", {
        path: pathname,
        locale: getLocale(pathname),
        action: form.getAttribute("action") || "",
      });
    };

    document.addEventListener("submit", onSubmit, true);
    return () => document.removeEventListener("submit", onSubmit, true);
  }, [pathname]);

  useEffect(() => {
    if (!isTrackedScrollPath(pathname)) return;

    const fired = new Set<number>();
    const onScroll = () => {
      const doc = document.documentElement;
      const maxScrollable = doc.scrollHeight - window.innerHeight;
      if (maxScrollable <= 0) return;

      const percent = Math.round((window.scrollY / maxScrollable) * 100);
      SCROLL_DEPTHS.forEach((depth) => {
        if (percent >= depth && !fired.has(depth)) {
          fired.add(depth);
          track("scroll_depth", {
            path: pathname,
            locale: getLocale(pathname),
            depth,
          });
        }
      });
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]);

  return null;
}
