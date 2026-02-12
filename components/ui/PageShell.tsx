import type { ReactNode } from "react";
import clsx from "clsx";

type PageShellProps = {
  title: string;
  subtitle?: ReactNode;
  children?: ReactNode;
  center?: boolean;
  maxWidthClass?: string;
  mainClassName?: string;
  panelClassName?: string;
};

export default function PageShell({
  title,
  subtitle,
  children,
  center = true,
  maxWidthClass = "max-w-3xl",
  mainClassName,
  panelClassName,
}: PageShellProps) {
  return (
    <main
      className={clsx("bg-brand-beige min-h-screen px-4 py-12", mainClassName)}
    >
      <section
        className={clsx(
          "mx-auto rounded-[28px] border border-brand-gold/50 bg-white/95 shadow-xl backdrop-blur-[1px]",
          "px-6 py-8 sm:px-10 sm:py-10",
          maxWidthClass,
          panelClassName
        )}
      >
        <header className={center ? "text-center" : undefined}>
          <h1 className="font-brand text-3xl font-bold tracking-tight text-brand-green md:text-5xl">
            {title}
          </h1>
          <div
            className={clsx(
              "my-4 flex",
              center ? "justify-center" : "justify-start"
            )}
            aria-hidden="true"
          >
            <div className="h-[3px] w-16 rounded-full bg-brand-gold" />
          </div>
          {subtitle ? (
            <p
              className={clsx(
                "text-base text-brand-blue/90 md:text-lg",
                center ? "mx-auto max-w-2xl" : "max-w-3xl"
              )}
            >
              {subtitle}
            </p>
          ) : null}
        </header>
        {children ? <div className="mt-6">{children}</div> : null}
      </section>
    </main>
  );
}
