import clsx from "clsx";
import * as React from "react";

type Variant = "primary" | "secondary" | "tertiary";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

export function Button({
  variant = "primary",
  className = "",
  ...props
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-sans font-bold transition min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold";
  const styles: Record<Variant, string> = {
    primary: "bg-brand-green text-white hover:opacity-90",
    secondary:
      "bg-brand-gold text-brand-green hover:bg-brand-blue hover:text-white",
    tertiary: "bg-transparent text-brand-blue hover:underline px-0 py-0",
  };

  return <button className={clsx(base, styles[variant], className)} {...props} />;
}
