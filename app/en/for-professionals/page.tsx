// app/en/for-professionals/page.tsx
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "For Professionals — Calm, clear planning for busy people",
  description:
    "Concierge pre-approval, cash-flow tune-up, and tax-smart steps for professional families and individuals in the GTA—bilingual, practical, and calm.",
  alternates: {
    languages: {
      en: "/en/for-professionals",
      es: "/es/para-profesionales",
    },
  },
  openGraph: {
    title: "For Professionals — Calm, clear planning for busy people",
    description:
      "Concierge pre-approval, cash-flow tune-up, and tax-smart steps for professional families and individuals in the GTA.",
    images: ["/og-fanny-coaching.png"],
  },
};

export default function Page() {
  return (
    <main id="main" className="min-h-screen bg-brand-beige">
      {/* Brand band header */}
      <section className="bg-brand-green/5 border-b border-brand-gold/30">
        <div className="max-w-screen-xl mx-auto px-4 py-10">
          <nav className="mb-3 text-sm text-brand-blue/80">
            <a href="/en" className="hover:underline">Home</a>
            <span className="mx-2">/</span>
            <span className="text-brand-green">For Professionals</span>
          </nav>
          <h1 className="font-serif text-3xl md:text-4xl font-semibold tracking-tight text-brand-green">
            High-trust planning for busy professionals
          </h1>
          <p className="mt-3 max-w-3xl text-brand-blue/90">
            Concierge pre-approval, cash-flow tune-up, and tax-smart decisions—handled with care so your
            next move is obvious. Bilingual support (EN/ES).
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              href="/en/contact"
              className="inline-flex items-center gap-2 rounded-full bg-brand-gold text-brand-green px-4 py-2 font-semibold hover:opacity-90"
            >
              Book a Free Discovery Call
            </Link>
            <Link
              href="/en/resources"
              className="inline-flex items-center gap-2 rounded-full border border-brand-gold/40 px-4 py-2 text-brand-green hover:bg-neutral-50"
            >
              Explore resources
            </Link>
          </div>
        </div>
      </section>

      {/* Value props in cards */}
      <section className="py-10">
        <div className="max-w-screen-xl mx-auto px-4 grid gap-6 md:grid-cols-2">
          {[
            {
              title: "Start here (45 seconds)",
              body:
                "Tell me your goal and timeline. I’ll outline the shortest path and what we’ll handle for you—before we collect a single document.",
              bullets: ["Goal & timing", "Budget feel vs. math", "Next 2–3 steps"],
            },
            {
              title: "Pre-approval without chaos",
              body:
                "I translate lender requirements into a calm, step-by-step flow: what we collect, what you see, and when you need to sign.",
              bullets: ["Stress-test scenarios", "Lender matching", "Appraisal through to close"],
            },
            {
              title: "Family first-home plan (with FHSA)",
              body:
                "Tax-smart saving and right-sized affordability. We’ll map the down payment, FHSA for couples, and safe offer conditions.",
              bullets: ["FHSA & savings rhythm", "Affordability & buffer", "Offer conditions that protect you"],
            },
            {
              title: "Self-employed made simple",
              body:
                "90-day rhythm, clean documentation, and a calm tax plan—so lenders and CRA see a tidy, credible story.",
              bullets: ["Cash-flow tune-up", "Set-asides that stick", "Audit-friendly records"],
            },
          ].map((c) => (
            <div key={c.title} className="rounded-3xl border border-brand-gold/40 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-brand-green">{c.title}</h2>
              <p className="mt-2 text-brand-blue/90">{c.body}</p>
              <ul className="mt-3 list-disc pl-5 text-sm text-brand-blue/90 space-y-1">
                {c.bullets.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Three-step concierge flow */}
      <section className="py-4">
        <div className="max-w-screen-xl mx-auto px-4 rounded-3xl border border-brand-gold/40 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-brand-green">The concierge flow</h2>
          <div className="mt-4 grid gap-6 md:grid-cols-3">
            {[
              {
                step: "1",
                title: "Clarity call (20–30 min)",
                body:
                  "We align on your goal, timeline, and constraints. I send a precise checklist—only what’s needed.",
              },
              {
                step: "2",
                title: "Pre-approval & plan (1–2 weeks)",
                body:
                  "I model scenarios (rates, terms, buffers), match lenders, and keep documents tidy and light.",
              },
              {
                step: "3",
                title: "Offer & close (2–4 weeks+)",
                body:
                  "You get scripts and conditions that protect you, with me beside you through appraisal and close.",
              },
            ].map((s) => (
              <div key={s.step} className="rounded-2xl border border-brand-gold/30 p-4">
                <div className="text-xs font-semibold text-brand-blue/70">Step {s.step}</div>
                <h3 className="mt-1 text-lg font-semibold text-brand-green">{s.title}</h3>
                <p className="mt-1 text-sm text-brand-blue/90">{s.body}</p>
              </div>
            ))}
          </div>
          <div className="mt-5">
            <Link
              href="/en/contact"
              className="inline-flex items-center gap-2 rounded-full bg-brand-gold text-brand-green px-4 py-2 font-semibold hover:opacity-90"
            >
              Book a Free Discovery Call
            </Link>
          </div>
        </div>
      </section>

      {/* FAQs (visible + JSON-LD) */}
      <section className="py-10">
        <div className="max-w-screen-xl mx-auto px-4 grid gap-6 md:grid-cols-2">
          {[
            {
              q: "Can we do this entirely in English or Spanish?",
              a: "Yes—everything can be in EN or ES. You’ll always get a clear summary of what happens next.",
            },
            {
              q: "Do you work with work-permit holders and PRs?",
              a: "Yes. I’ll clarify documents early so pre-approval feels smooth and predictable.",
            },
            {
              q: "What if I’m self-employed?",
              a: "We’ll stabilize cash-flow, tidy records, and present a credible story for lenders.",
            },
            {
              q: "What happens after the discovery call?",
              a: "You’ll receive a short plan with steps, a realistic timeline, and the exact documents we’ll need.",
            },
          ].map((f) => (
            <div key={f.q} className="rounded-3xl border border-brand-gold/40 bg-white p-6 shadow-sm">
              <h3 className="font-semibold text-brand-green">{f.q}</h3>
              <p className="mt-2 text-brand-blue/90">{f.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "Can we do this entirely in English or Spanish?",
                "acceptedAnswer": { "@type": "Answer", "text": "Yes—everything can be in EN or ES. You’ll always get a clear summary of what happens next." }
              },
              {
                "@type": "Question",
                "name": "Do you work with work-permit holders and PRs?",
                "acceptedAnswer": { "@type": "Answer", "text": "Yes. I’ll clarify documents early so pre-approval feels smooth and predictable." }
              },
              {
                "@type": "Question",
                "name": "What if I’m self-employed?",
                "acceptedAnswer": { "@type": "Answer", "text": "We’ll stabilize cash-flow, tidy records, and present a credible story for lenders." }
              },
              {
                "@type": "Question",
                "name": "What happens after the discovery call?",
                "acceptedAnswer": { "@type": "Answer", "text": "You’ll receive a short plan with steps, a realistic timeline, and the exact documents we’ll need." }
              }
            ],
          }),
        }}
      />
    </main>
  );
}
