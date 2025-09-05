// components/Reveal.tsx
"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  children: React.ReactNode;
  /** Delay in ms for the reveal (helps stagger cards) */
  delay?: number;
  /** Optional wrapper element */
  as?: keyof JSX.IntrinsicElements;
  /** Threshold for intersection (0..1) */
  threshold?: number;
  /** Extra className to apply */
  className?: string;
};

export default function Reveal({
  children,
  delay = 0,
  as: Tag = "div",
  threshold = 0.15,
  className = "",
}: Props) {
  const ref = useRef<HTMLElement | null>(null);
  const [shown, setShown] = useState(false);

  // Callback ref that works for any intrinsic element without `any`
  const setNodeRef = (node: Element | null) => {
    ref.current = node as HTMLElement | null;
  };

  useEffect(() => {
    // Respect user's reduced motion setting
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setShown(true);
      return;
    }

    const el = ref.current;
    if (!el) return;

    let timeoutId: number | null = null;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            timeoutId = window.setTimeout(() => setShown(true), delay);
            io.unobserve(entry.target);
          }
        });
      },
      { threshold }
    );

    io.observe(el);

    return () => {
      if (timeoutId !== null) window.clearTimeout(timeoutId);
      io.disconnect();
    };
  }, [delay, threshold]);

  return (
    <Tag
      ref={setNodeRef}
      className={[
        "will-change-transform transition-all duration-700 ease-out",
        shown ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
        className,
      ].join(" ")}
      style={{ transform: shown ? undefined : "translateY(16px)" }}
    >
      {children}
    </Tag>
  );
}
