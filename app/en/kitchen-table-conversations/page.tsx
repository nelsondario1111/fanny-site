import type { Metadata } from "next";
import Link from "next/link";
import { buildMetadata } from "@/app/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Kitchen Table Conversations",
  description:
    "Kitchen Table Conversations is a 4-week small-group experience for families, newcomers, and first-time buyers who want clear numbers and calm decisions.",
  path: "/en/kitchen-table-conversations",
  locale: "en",
});

export default function KitchenTableConversationsPage() {
  const packageName = "Kitchen Table Conversations — 4-Week Cohort";
  const packageHref = `/en/contact?intent=package&package=${encodeURIComponent(packageName)}`;

  return (
    <main className="min-h-screen bg-white">
      <section className="bg-brand-green/5 border-b border-brand-gold/30">
        <div className="max-w-screen-xl mx-auto px-4 py-10 lg:py-12">
          <nav className="text-sm text-brand-blue/80">
            <Link href="/en" className="hover:underline">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-brand-green">Kitchen Table Conversations</span>
          </nav>

          <h1 className="mt-4 font-serif text-4xl md:text-5xl font-extrabold text-brand-green tracking-tight">
            Kitchen Table Conversations
          </h1>
          <p className="mt-4 max-w-3xl text-lg text-brand-blue/90 leading-relaxed">
            A warm, practical 4-week small-group program where you bring real-life questions,
            get clear answers, and leave each session with next steps you can actually follow.
          </p>
          <p className="mt-3 max-w-3xl text-brand-blue/80">
            Holistic Financial Consultant | Taxes • Mortgages • Money Strategy | Clear numbers, calm decisions.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href={packageHref}
              className="inline-flex items-center justify-center px-5 py-2.5 bg-brand-green text-white rounded-full font-semibold hover:bg-brand-gold hover:text-brand-green border border-brand-green/20 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold"
            >
              Join the 4-Week Cohort
            </Link>
            <Link
              href="/en/contact?intent=consult&package=Free%20Discovery%20Call%20(15%20min)"
              className="inline-flex items-center justify-center px-5 py-2.5 rounded-full border border-brand-blue/40 text-brand-blue hover:bg-brand-blue hover:text-white transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue/40"
            >
              Book a Discovery Call
            </Link>
            <Link
              href="/en/services#kitchen-table"
              className="inline-flex items-center justify-center px-5 py-2.5 rounded-full border border-brand-gold/40 text-brand-green hover:bg-brand-gold hover:text-white transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold"
            >
              Back to Services
            </Link>
          </div>
        </div>
      </section>

      <section className="py-10 lg:py-12">
        <div className="max-w-screen-xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-6">
          <article className="rounded-3xl border border-brand-gold/40 bg-white shadow-sm p-6">
            <h2 className="font-serif text-2xl text-brand-green">Who It Is For</h2>
            <ul className="mt-4 list-disc pl-5 space-y-2 text-brand-blue/90">
              <li>First-time buyers and newcomers</li>
              <li>Families aligning values with budget decisions</li>
              <li>People who learn best through live discussion</li>
            </ul>
          </article>

          <article className="rounded-3xl border border-brand-gold/40 bg-white shadow-sm p-6">
            <h2 className="font-serif text-2xl text-brand-green">What We Cover</h2>
            <ul className="mt-4 list-disc pl-5 space-y-2 text-brand-blue/90">
              <li>Mortgage steps, rates, and readiness</li>
              <li>Cash-flow, debt, and credit strategy</li>
              <li>Tax-season clarity and practical planning habits</li>
            </ul>
          </article>

          <article className="rounded-3xl border border-brand-gold/40 bg-white shadow-sm p-6">
            <h2 className="font-serif text-2xl text-brand-green">How It Works</h2>
            <ul className="mt-4 list-disc pl-5 space-y-2 text-brand-blue/90">
              <li>Small group format (friendly and focused)</li>
              <li>4 weekly sessions of 45-60 minutes</li>
              <li>Simple action steps after every session</li>
            </ul>
          </article>
        </div>
      </section>

      <section className="pb-14">
        <div className="max-w-screen-xl mx-auto px-4">
          <div className="rounded-3xl border border-brand-gold/40 bg-brand-green/5 p-6 md:p-8">
            <h2 className="font-serif text-2xl md:text-3xl text-brand-green">Expected Outcome</h2>
            <p className="mt-4 text-brand-blue/90 max-w-3xl leading-relaxed">
              You finish the program with calmer decision-making, better household money conversations,
              and a practical sequence for your next mortgage, tax, or cash-flow steps.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
