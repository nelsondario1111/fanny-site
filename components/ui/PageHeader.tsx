import { ReactNode } from "react";
import Panel from "./Panel";

type Props = {
  title: string;
  subtitle?: ReactNode;
  children?: ReactNode; // pills / badges row
};

export default function PageHeader({ title, subtitle, children }: Props) {
  return (
    <header className="bg-brand-beige px-4 pt-10">
      <Panel as="div" className="text-center">
        <h1 className="font-serif font-extrabold text-4xl md:text-5xl text-brand-green tracking-tight">
          {title}
        </h1>
        <div className="flex justify-center my-4">
          <div className="w-16 h-[3px] rounded-full bg-brand-gold" />
        </div>
        {subtitle && (
          <p className="text-brand-body text-lg md:text-xl max-w-3xl mx-auto">{subtitle}</p>
        )}
        {children && <div className="mt-6">{children}</div>}
      </Panel>
    </header>
  );
}
