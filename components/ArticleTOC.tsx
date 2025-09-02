// components/ArticleTOC.tsx
"use client";

import { useEffect, useMemo, useState } from "react";

type Item = { id: string; text: string; level: number };

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export default function ArticleTOC({
  containerId,
  label = "On this page",
}: {
  containerId: string;
  label?: string;
}) {
  const [items, setItems] = useState<Item[]>([]);
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const root = document.getElementById(containerId);
    if (!root) return;

    const nodes = Array.from(root.querySelectorAll<HTMLHeadingElement>("h2, h3"));
    const list: Item[] = [];
    nodes.forEach((h) => {
      const txt = h.textContent || "";
      if (!txt) return;
      if (!h.id) h.id = slugify(txt);
      list.push({ id: h.id, text: txt, level: h.tagName === "H2" ? 2 : 3 });
    });
    setItems(list);

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "0px 0px -70% 0px", threshold: 1.0 }
    );
    nodes.forEach((n) => obs.observe(n));
    return () => obs.disconnect();
  }, [containerId]);

  const hasItems = useMemo(() => items.length > 0, [items]);
  if (!hasItems) return null;

  return (
    <aside className="print:hidden sticky top-24 hidden xl:block w-64 max-h-[calc(100vh-6rem)] overflow-auto">
      <div className="text-xs uppercase tracking-wide text-neutral-500 mb-2">{label}</div>
      <ul className="space-y-1 text-sm">
        {items.map((it) => (
          <li key={it.id} className={it.level === 3 ? "pl-3" : ""}>
            <a
              href={`#${it.id}`}
              className={`block rounded px-2 py-1 hover:bg-neutral-50 dark:hover:bg-neutral-900 ${
                active === it.id ? "toc-active" : ""
              }`}
            >
              {it.text}
            </a>
          </li>
        ))}
      </ul>
      <div className="mt-3 text-xs">
        <a href="#top" className="underline text-neutral-500 hover:text-neutral-700">
          Back to top
        </a>
      </div>
    </aside>
  );
}
