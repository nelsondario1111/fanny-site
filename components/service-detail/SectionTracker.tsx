"use client";

import * as React from "react";

type TrackerItem = {
  id: string;
  label: string;
};

type SectionTrackerProps = {
  title: string;
  items: TrackerItem[];
};

export default function SectionTracker({ title, items }: SectionTrackerProps) {
  const [activeId, setActiveId] = React.useState(items[0]?.id ?? "");

  React.useEffect(() => {
    if (!items.length) return;

    const elements = items
      .map((item) => document.getElementById(item.id))
      .filter(Boolean) as HTMLElement[];

    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => Math.abs(a.boundingClientRect.top) - Math.abs(b.boundingClientRect.top));

        if (visible[0]) {
          setActiveId(visible[0].target.id);
        }
      },
      {
        rootMargin: "-30% 0px -55% 0px",
        threshold: [0.1, 0.25, 0.5, 0.75],
      }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [items]);

  return (
    <nav
      aria-label={title}
      className="rounded-3xl border border-brand-gold/30 bg-white/95 shadow-[0_12px_30px_rgba(47,74,53,0.1)] p-5"
    >
      <h2 className="font-brand text-xl text-brand-green">{title}</h2>
      <ul className="mt-3 space-y-1.5">
        {items.map((item, index) => {
          const isActive = activeId === item.id;
          return (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                className={[
                  "inline-flex w-full items-center gap-2 rounded-full border px-3 py-1.5 text-sm transition",
                  isActive
                    ? "border-brand-green bg-brand-green text-white"
                    : "border-brand-gold/35 text-brand-blue hover:bg-brand-green/10 hover:text-brand-green",
                ].join(" ")}
              >
                <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-white/90 text-[11px] font-semibold text-brand-green">
                  {index + 1}
                </span>
                <span>{item.label}</span>
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
