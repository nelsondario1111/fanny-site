"use client";

import Link from "next/link";
import {
  useEffect,
  useMemo,
  useState,
  type ButtonHTMLAttributes,
  type ReactNode,
} from "react";
import { Reveal, StaggerGroup, useMotionPresets } from "@/components/motion-safe";
import HeroScrollAccents from "@/components/ui/HeroScrollAccents";

export type HubTint = "green" | "gold";

export const HUB_PANEL_CLASS =
  "max-w-content mx-auto px-5 sm:px-8 py-10 sm:py-14 rounded-[26px] border border-brand-gold/30 shadow-[0_14px_34px_rgba(47,74,53,0.10)] backdrop-blur-[1px]";

export const HUB_CARD_CLASS =
  "rounded-3xl border border-brand-gold/30 bg-white/95 shadow-[0_10px_24px_rgba(47,74,53,0.08)] p-6 transition hover:-translate-y-[1px] hover:shadow-[0_16px_30px_rgba(47,74,53,0.14)] focus-within:ring-2 focus-within:ring-brand-gold backdrop-blur-[1px]";

export const HUB_TABLE_CLASS =
  "rounded-3xl border border-brand-gold/30 bg-white/95 shadow-[0_10px_24px_rgba(47,74,53,0.08)] backdrop-blur-[1px]";

export type CTAButtonVariant = "primary" | "secondary" | "ghost";

const CTA_STYLES: Record<CTAButtonVariant, string> = {
  primary:
    "inline-flex items-center justify-center px-5 py-2.5 rounded-full bg-brand-green text-white font-semibold border border-brand-green/20 shadow-[0_8px_20px_rgba(47,74,53,0.2)] hover:-translate-y-[1px] hover:bg-brand-green/90 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold",
  secondary:
    "inline-flex items-center justify-center px-5 py-2.5 rounded-full border border-brand-green/30 bg-white text-brand-green font-semibold shadow-sm hover:bg-brand-green/5 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green/40",
  ghost:
    "inline-flex items-center justify-center px-5 py-2.5 rounded-full border border-brand-gold/40 bg-white text-brand-green font-semibold hover:bg-brand-gold/15 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold",
};

export function ctaButtonClass(variant: CTAButtonVariant = "primary") {
  return CTA_STYLES[variant];
}

export function HubPanel({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <section className={`${HUB_PANEL_CLASS} ${className}`.trim()}>{children}</section>;
}

export function HubSectionTitle({
  title,
  subtitle,
  id,
  tint,
  eyebrow,
}: {
  title: string;
  subtitle?: ReactNode;
  id: string;
  tint: HubTint;
  eyebrow?: string;
}) {
  const { fade, fadeUp } = useMotionPresets();
  const accent = tint === "green" ? "bg-brand-green/60" : "bg-brand-gold/60";
  const eyebrowTint =
    tint === "green" ? "text-brand-green/80 border-brand-green/20" : "text-brand-blue/80 border-brand-gold/40";

  return (
    <div
      id={id}
      className="scroll-mt-[160px] sm:scroll-mt-[170px] md:scroll-mt-[180px] lg:scroll-mt-[190px]"
    >
      <div className="text-center mb-6">
        {eyebrow && (
          <Reveal variants={fade}>
            <p
              className={`mb-3 inline-flex items-center rounded-full border px-3 py-1 text-xs uppercase tracking-[0.16em] ${eyebrowTint}`}
            >
              {eyebrow}
            </p>
          </Reveal>
        )}

        <Reveal variants={fadeUp}>
          <h2 className="font-brand font-semibold text-3xl md:text-4xl text-brand-green tracking-tight">
            {title}
          </h2>
        </Reveal>

        <Reveal variants={fade}>
          <div className="flex justify-center my-4" aria-hidden="true">
            <div className={`w-16 h-[3px] rounded-full ${accent}`} />
          </div>
        </Reveal>

        {subtitle && (
          <Reveal variants={fadeUp}>
            <p className="text-brand-blue/90 text-lg md:text-xl max-w-3xl mx-auto">{subtitle}</p>
          </Reveal>
        )}
      </div>
    </div>
  );
}

export function HubTagBadge({ children }: { children: ReactNode }) {
  return (
    <span className="text-xs px-2.5 py-1 rounded-full bg-white text-brand-green border border-brand-gold/40">
      {children}
    </span>
  );
}

export function HubPriceBadge({ children }: { children: ReactNode }) {
  return (
    <span className="text-sm px-3 py-1 rounded-full bg-brand-gold/15 text-brand-green border border-brand-gold/50">
      {children}
    </span>
  );
}

export function CardGrid({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <StaggerGroup className={`grid md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`.trim()}>
      {children}
    </StaggerGroup>
  );
}

export function InfoCard({
  title,
  description,
  kicker,
  children,
  className = "",
}: {
  title: string;
  description?: ReactNode;
  kicker?: ReactNode;
  children?: ReactNode;
  className?: string;
}) {
  const { fadeUp } = useMotionPresets();
  return (
    <Reveal variants={fadeUp}>
      <article className={`${HUB_CARD_CLASS} ${className}`.trim()}>
        {kicker && <p className="text-xs uppercase tracking-wide text-brand-blue/75 mb-1">{kicker}</p>}
        <h3 className="font-sans text-xl text-brand-green font-semibold m-0">{title}</h3>
        {description && <p className="mt-2 text-brand-blue/90">{description}</p>}
        {children}
      </article>
    </Reveal>
  );
}

export function CTAButton({
  children,
  variant = "primary",
  href,
  className = "",
  ...buttonProps
}: {
  children: ReactNode;
  variant?: CTAButtonVariant;
  href?: string;
  className?: string;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children">) {
  const cls = `${ctaButtonClass(variant)} ${className}`.trim();
  if (href) return <Link href={href} className={cls}>{children}</Link>;
  return (
    <button className={cls} {...buttonProps}>
      {children}
    </button>
  );
}

export function InlineCTA({
  items,
  className = "",
}: {
  items: { label: string; href: string; variant?: CTAButtonVariant }[];
  className?: string;
}) {
  return (
    <div className={`mt-5 flex flex-wrap gap-3 ${className}`.trim()}>
      {items.map((item) => (
        <CTAButton key={`${item.href}-${item.label}`} href={item.href} variant={item.variant ?? "primary"}>
          {item.label}
        </CTAButton>
      ))}
    </div>
  );
}

export function OfferCard({
  id,
  title,
  description,
  bullets,
  price,
  tags = [],
  meta = [],
  cta,
  more,
  icon,
  extra,
}: {
  id: string;
  title: string;
  description: ReactNode;
  bullets: string[];
  price?: ReactNode;
  tags?: string[];
  meta?: { label: string; value: ReactNode }[];
  cta: { label: string; href: string; variant?: CTAButtonVariant };
  more?: { label: string; href: string };
  icon?: ReactNode;
  extra?: ReactNode;
}) {
  const { fadeUp } = useMotionPresets();
  return (
    <Reveal variants={fadeUp}>
      <article className={`${HUB_CARD_CLASS} group`} aria-labelledby={`${id}-title`}>
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-3">
              {icon && (
                <div className="w-11 h-11 rounded-full bg-brand-green/10 border border-brand-gold/30 flex items-center justify-center text-brand-green shrink-0">
                  {icon}
                </div>
              )}
              <h3 id={`${id}-title`} className="font-sans text-2xl text-brand-green font-semibold m-0">
                {title}
              </h3>
            </div>
          </div>
          {price && <HubPriceBadge>{price}</HubPriceBadge>}
        </div>

        {tags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {tags.map((tag) => (
              <HubTagBadge key={`${id}-${tag}`}>{tag}</HubTagBadge>
            ))}
          </div>
        )}

        <p className="mt-3 text-brand-blue/90">{description}</p>

        {bullets.length > 0 && (
          <ul className="mt-3 list-disc pl-5 space-y-1 text-brand-blue/90">
            {bullets.map((point) => (
              <li key={`${id}-${point}`}>{point}</li>
            ))}
          </ul>
        )}

        {meta.length > 0 && (
          <div className="mt-3 text-sm text-brand-blue/80 space-y-1">
            {meta.map((item) => (
              <p key={`${id}-${item.label}`} className="m-0">
                <strong>{item.label}:</strong> {item.value}
              </p>
            ))}
          </div>
        )}

        {more && (
          <p className="mt-3 text-sm">
            <Link
              href={more.href}
              className="text-brand-blue/90 underline underline-offset-4 hover:text-brand-green"
            >
              {more.label}
            </Link>
          </p>
        )}

        <div className="mt-5 flex flex-wrap gap-3">
          <CTAButton href={cta.href} variant={cta.variant ?? "primary"}>
            {cta.label}
          </CTAButton>
        </div>

        {extra}
      </article>
    </Reveal>
  );
}

export function ComparisonTable({
  columns,
  rows,
  footnote,
  className = "",
}: {
  columns: string[];
  rows: { label: string; values: ReactNode[] }[];
  footnote?: ReactNode;
  className?: string;
}) {
  const tableCols = useMemo(() => ["", ...columns], [columns]);
  return (
    <div className={`${HUB_TABLE_CLASS} overflow-hidden ${className}`.trim()}>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-brand-green/5 border-b border-brand-gold/30">
            <tr>
              {tableCols.map((col, idx) => (
                <th
                  key={`${col}-${idx}`}
                  className={`px-4 py-3 text-left font-semibold text-brand-green ${idx === 0 ? "w-48" : ""}`}
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.label} className="border-b border-brand-gold/20 last:border-b-0">
                <th className="px-4 py-3 text-left font-semibold text-brand-green align-top">{row.label}</th>
                {columns.map((_, idx) => (
                  <td key={`${row.label}-${idx}`} className="px-4 py-3 text-brand-blue/90 align-top">
                    {row.values[idx] ?? "—"}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {footnote && <p className="px-4 py-3 text-xs text-brand-blue/75 border-t border-brand-gold/20">{footnote}</p>}
    </div>
  );
}

export function PageHero({
  homeHref,
  homeLabel,
  currentLabel,
  title,
  subtitle,
  primaryCta,
  secondaryCta,
  proofStats,
  validation,
  children,
}: {
  homeHref: string;
  homeLabel: string;
  currentLabel: string;
  title: string;
  subtitle: ReactNode;
  primaryCta?: { label: string; href: string; variant?: CTAButtonVariant };
  secondaryCta?: { label: string; href: string; variant?: CTAButtonVariant };
  proofStats?: { value: string; label: string }[];
  validation?: { text: string; ctaLabel?: string; ctaHref?: string };
  children?: ReactNode;
}) {
  const { fade } = useMotionPresets();
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-brand-green/10 via-brand-green/5 to-brand-beige border-b border-brand-gold/30">
      <HeroScrollAccents />
      <div className="relative z-10 max-w-content mx-auto px-4 py-11 sm:py-12">
        <nav className="mb-4 text-xs sm:text-sm text-brand-blue/80" aria-label="Breadcrumb">
          <Link href={homeHref} className="hover:underline">
            {homeLabel}
          </Link>
          <span className="mx-2" aria-hidden="true">
            /
          </span>
          <span className="text-brand-green" aria-current="page">
            {currentLabel}
          </span>
        </nav>

        <Reveal variants={fade}>
          <h1 className="max-w-4xl font-brand text-3xl md:text-5xl font-semibold tracking-tight text-brand-green">
            {title}
          </h1>
        </Reveal>

        <Reveal variants={fade}>
          <p className="mt-3 max-w-2xl text-base md:text-lg leading-relaxed text-brand-blue/90">{subtitle}</p>
        </Reveal>

        {(primaryCta || secondaryCta) && (
          <InlineCTA
            items={[
              ...(primaryCta ? [primaryCta] : []),
              ...(secondaryCta ? [secondaryCta] : []),
            ]}
          />
        )}

        {proofStats && proofStats.length > 0 && (
          <Reveal variants={fade}>
            <ul className="mt-5 grid gap-2 sm:grid-cols-3 max-w-4xl">
              {proofStats.map((item) => (
                <li
                  key={`${currentLabel}-${item.label}`}
                  className="rounded-2xl border border-brand-gold/35 bg-white/90 px-3.5 py-3 shadow-sm"
                >
                  <p className="font-brand text-xl leading-tight text-brand-green">{item.value}</p>
                  <p className="mt-0.5 text-xs text-brand-blue/85">{item.label}</p>
                </li>
              ))}
            </ul>
          </Reveal>
        )}

        {validation && (
          <Reveal variants={fade}>
            <div className="mt-4 max-w-4xl rounded-2xl border border-brand-gold/35 bg-white/90 px-4 py-3 shadow-sm sm:flex sm:items-center sm:justify-between sm:gap-4">
              <p className="text-sm text-brand-blue/90">{validation.text}</p>
              {validation.ctaLabel && validation.ctaHref ? (
                <Link
                  href={validation.ctaHref}
                  className="mt-2 inline-flex items-center rounded-full border border-brand-green/35 px-3 py-1.5 text-xs font-semibold text-brand-green transition hover:bg-brand-green hover:text-white sm:mt-0"
                >
                  {validation.ctaLabel}
                </Link>
              ) : null}
            </div>
          </Reveal>
        )}

        {children}
      </div>
    </section>
  );
}

export function StickySectionNav({
  sections,
  ariaLabel,
  defaultActive,
}: {
  sections: readonly { id: string; label: string }[];
  ariaLabel: string;
  defaultActive?: string;
}) {
  const [active, setActive] = useState<string>(defaultActive ?? sections[0]?.id ?? "");

  useEffect(() => {
    if (!sections.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-25% 0px -65% 0px", threshold: [0.2, 0.5, 0.8] }
    );

    sections.forEach((section) => {
      const element = document.getElementById(section.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [sections]);

  return (
    <div className="sticky top-[64px] z-30 bg-white/90 backdrop-blur border-b border-brand-gold/30">
      <nav className="max-w-content mx-auto px-4 py-2 flex gap-2 overflow-x-auto text-sm" aria-label={ariaLabel}>
        {sections.map((section) => (
          <a
            key={section.id}
            href={`#${section.id}`}
            className={[
              "px-3 py-1.5 rounded-full border transition whitespace-nowrap",
              active === section.id
                ? "bg-brand-green text-white border-brand-green"
                : "border-brand-gold/40 text-brand-green hover:bg-brand-green/10",
            ].join(" ")}
            aria-current={active === section.id ? "true" : undefined}
          >
            {section.label}
          </a>
        ))}
      </nav>
    </div>
  );
}
