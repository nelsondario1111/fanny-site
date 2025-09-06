import type { ReactNode, ElementType } from "react";
import clsx from "clsx";

type PanelProps = {
  children: ReactNode;
  className?: string;
  as?: ElementType; // ✅ no JSX namespace needed
};

/** A “table-like” rounded panel used across pages */
export default function Panel({ children, className, as: Tag = "section" }: PanelProps) {
  return (
    <Tag
      className={clsx(
        "max-w-6xl mx-auto px-5 sm:px-8 py-8 sm:py-10",
        "bg-white/95 rounded-[28px] border border-brand-gold shadow-xl",
        "backdrop-blur-[1px]",
        className
      )}
    >
      {children}
    </Tag>
  );
}
