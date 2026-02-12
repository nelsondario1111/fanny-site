"use client";

type TimelineStep = {
  title: string;
  detail: string;
};

type HowItWorksTimelineProps = {
  id?: string;
  title: string;
  subtitle?: string;
  steps: TimelineStep[];
  className?: string;
};

export default function HowItWorksTimeline({
  id,
  title,
  subtitle,
  steps,
  className = "",
}: HowItWorksTimelineProps) {
  return (
    <section
      id={id}
      className={`rounded-3xl border border-brand-gold/35 bg-white/95 p-6 md:p-8 shadow-sm ${className}`.trim()}
      aria-label={title}
    >
      <div className="text-center">
        <h2 className="font-serif text-2xl md:text-3xl font-semibold tracking-tight text-brand-green">
          {title}
        </h2>
        {subtitle && <p className="mt-2 max-w-3xl mx-auto text-brand-blue/90">{subtitle}</p>}
      </div>

      <ol className="mt-6 grid gap-4 md:grid-cols-3" aria-label={title}>
        {steps.map((step, idx) => (
          <li
            key={`${step.title}-${idx + 1}`}
            className="rounded-2xl border border-brand-gold/30 bg-brand-gold/5 p-4"
          >
            <div className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-brand-green text-xs font-semibold text-white">
              {idx + 1}
            </div>
            <h3 className="mt-3 font-serif text-lg font-semibold text-brand-green">{step.title}</h3>
            <p className="mt-2 text-sm text-brand-blue/90">{step.detail}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
