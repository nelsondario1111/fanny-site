// components/ui/Section.tsx
import { ReactNode } from "react";

interface SectionProps {
  children: ReactNode;
  className?: string;
}

export default function Section({ children, className = "" }: SectionProps) {
  return (
    <section className={`py-16 px-4 md:px-6 lg:px-8 ${className}`}>
      <div className="max-w-content mx-auto">{children}</div>
    </section>
  );
}
