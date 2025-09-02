import Link from "next/link";
import { ReactNode } from "react";

export function PillRow({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-wrap gap-3 justify-center">{children}</div>
  );
}

export function PillLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className="px-5 py-2 rounded-full border text-brand-green border-brand-green hover:bg-brand-green hover:text-white transition"
    >
      {children}
    </Link>
  );
}

export function PillBadge({ children }: { children: ReactNode }) {
  return (
    <span className="px-4 py-2 rounded-full bg-white border border-brand-gold/40 text-brand-green inline-flex items-center gap-2">
      {children}
    </span>
  );
}
