import { ReactNode } from "react";

type Props = {
  title: string;
  kicker?: string;          // small line above the title, optional
  subtitle?: ReactNode;     // can be string or <span>..</span>
  children?: ReactNode;     // trust badges, CTA row, etc.
  align?: "center" | "left";
};
export default function PageHero({
  title,
  kicker,
  subtitle,
  children,
  align = "center",
}: Props) {
  const alignCls = align === "center" ? "text-center items-center" : "text-left items-start";
  return (
    <header className="bg-brand-beige">
      <div className={`max-w-content mx-auto px-4 py-16 flex flex-col ${alignCls}`}>
        {kicker && (
          <div className="font-sans text-sm uppercase tracking-wide text-brand-blue/80 mb-2">
            {kicker}
          </div>
        )}
        <h1 className="font-serif font-extrabold text-4xl md:text-5xl text-brand-green tracking-tight mb-4">
          {title}
        </h1>
        {subtitle && (
          <p className="text-brand-body text-lg md:text-xl max-w-3xl mb-6">
            {subtitle}
          </p>
        )}
        {children}
      </div>
    </header>
  );
}
