"use client";

import Image from "next/image";
import Link from "next/link";
import type React from "react";

import {
  Reveal,
  RevealPanel,
  StaggerGroup,
  useMotionPresets,
} from "@/components/motion-safe";
import { ctaButtonClass } from "@/components/sections/hub";
import StartHereDecisionWidget from "@/components/StartHereDecisionWidget";
import TrustChips from "@/components/TrustChips";
import HeroScrollAccents from "@/components/ui/HeroScrollAccents";

/* ============================= Section Title ============================= */
function SectionTitle({ title, kicker }: { title: string; kicker?: string }) {
  const { fade, fadeUp } = useMotionPresets();
  return (
    <div className="text-center mb-10">
      {kicker && (
        <Reveal variants={fade}>
          <div className="text-brand-blue/70 text-base md:text-lg mb-2">
            {kicker}
          </div>
        </Reveal>
      )}
      <Reveal variants={fadeUp}>
        <h2 className="font-brand text-3xl md:text-4xl text-brand-green/90 font-semibold tracking-tight">
          {title}
        </h2>
      </Reveal>
      <Reveal variants={fade}>
        <div className="flex justify-center mt-3" aria-hidden="true">
          <div className="w-14 h-[2px] rounded-full bg-brand-gold/40" />
        </div>
      </Reveal>
    </div>
  );
}

/* ================================ Page ================================= */
export default function Home() {
  const { fade, fadeUp } = useMotionPresets();
  const primaryCtaClass = ctaButtonClass("primary");
  const secondaryCtaClass = ctaButtonClass("secondary");
  const ghostCtaClass = ctaButtonClass("ghost");
  const heroProofStats = [
    { value: "2 languages", label: "English + Spanish support" },
    { value: "15 min", label: "Free discovery call" },
    { value: "L2 licensed", label: "Mortgage agent in Ontario" },
  ] as const;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Fanny Samaniego",
    url: "https://www.fannysamaniego.com/",
    logo: "https://www.fannysamaniego.com/apple-touch-icon.png",
    founder: {
      "@type": "Person",
      name: "Fanny Samaniego",
      jobTitle: "Mortgage Agent (Level 2) & Holistic Financial Consultant",
      description:
        "Former CRA Income Tax Auditor helping clients with mortgage strategy, tax rhythm, and practical money planning in Toronto.",
      worksFor: { "@type": "Organization", name: "Fanny Samaniego" },
      knowsAbout: ["Mortgages", "Tax planning", "Cash flow planning", "Financial coaching"],
    },
  } as const;

  return (
    <main className="bg-brand-beige min-h-dvh text-brand-body">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* =============================== HERO =============================== */}
      <div
        className="relative bg-scroll md:bg-fixed bg-center bg-cover"
        style={{ backgroundImage: "url('/nature.jpg')" }}
      >
        <HeroScrollAccents className="z-[1]" />
        <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/10 via-black/5 to-black/10" />

        <header
          className="relative z-20 min-h-[60dvh] flex items-center justify-center overflow-hidden"
          aria-label="Hero"
        >
          <StaggerGroup className="w-full px-4">
            <section className="max-w-content mx-auto px-5 sm:px-8 pt-5 sm:pt-7 pb-8 sm:pb-12 bg-white/90 rounded-2xl border border-brand-gold/20 shadow-md backdrop-blur-[2px] text-center relative">
              <Reveal variants={fadeUp}>
                <h1 className="font-brand font-bold text-4xl sm:text-5xl md:text-6xl text-brand-green/90 mb-4 tracking-tight">
                  Clear numbers, calm decisions.
                </h1>
              </Reveal>

              <Reveal variants={fade}>
                <p className="font-sans text-base sm:text-lg md:text-xl text-brand-blue/90 mb-5 leading-relaxed max-w-xl mx-auto">
                  <span className="block">Holistic Financial Consultant</span>
                  <span className="block">Taxes • Mortgages • Money Strategy</span>
                  <span className="block mt-2">
                    I help you move forward with clear numbers and calm, practical decisions.
                  </span>
                </p>
              </Reveal>

              <Reveal variants={fade}>
                <nav
                  aria-label="Primary actions"
                  className="flex flex-col items-center gap-2"
                >
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Link
                      href="/en/services"
                      aria-label="Explore services"
                      className={primaryCtaClass}
                    >
                      Explore Services
                    </Link>
                  </div>
                  <Link
                    href="/en/contact?intent=hello"
                    className="text-sm text-brand-blue/80 mt-2 hover:text-brand-green underline underline-offset-4"
                  >
                    Start a conversation
                  </Link>
                </nav>
              </Reveal>

              <Reveal variants={fade}>
                <ul className="mx-auto mt-5 grid w-full max-w-3xl grid-cols-2 gap-1.5 text-left sm:grid-cols-3 sm:gap-2">
                  {heroProofStats.map((item, index) => (
                    <li
                      key={item.label}
                      className={[
                        "rounded-2xl border border-brand-gold/35 bg-white/90 px-3 py-2.5 shadow-sm",
                        index === 2 ? "col-span-2 sm:col-span-1" : "",
                      ].join(" ")}
                    >
                      <p className="font-brand text-lg sm:text-xl leading-tight text-brand-green">{item.value}</p>
                      <p className="mt-0.5 text-[11px] sm:text-xs text-brand-blue/85">{item.label}</p>
                    </li>
                  ))}
                </ul>
              </Reveal>
            </section>
          </StaggerGroup>
        </header>
      </div>

      <RevealPanel className="mt-6" aria-label="Trust and validation">
        <div className="max-w-content mx-auto rounded-3xl border border-brand-gold/30 bg-white/90 px-5 py-4 shadow-[0_10px_24px_rgba(47,74,53,0.08)] sm:px-8">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <p className="text-sm text-brand-blue/90">
              Trusted, private guidance with practical next steps. Results vary by situation, but every plan starts with clarity.
            </p>
            <Link
              href="/en/testimonials"
              className="inline-flex items-center justify-center rounded-full border border-brand-green/35 px-3 py-1.5 text-xs font-semibold text-brand-green transition hover:bg-brand-green hover:text-white"
            >
              Read client stories
            </Link>
          </div>
          <TrustChips lang="en" className="mt-3 justify-start" />
        </div>
      </RevealPanel>

      <RevealPanel className="mt-8" aria-label="Start Here pathways">
        <StartHereDecisionWidget lang="en" />
      </RevealPanel>

      {/* =================== SERVICE SPOTLIGHT: TAX REVIEW =================== */}
      <RevealPanel
        className="mt-16 lg:mt-20"
        aria-label="Service spotlight: 10-Year Holistic Tax Review"
      >
        <div className="max-w-5xl mx-auto bg-white/90 rounded-3xl border border-brand-gold/20 shadow-sm px-6 sm:px-10 py-10 sm:py-12">
          <SectionTitle
            title="10-Year Holistic Tax Review (When It Fits)"
            kicker="Service Spotlight"
          />
          <StaggerGroup className="flex flex-col md:flex-row gap-8 items-center">
            <Reveal variants={fadeUp} className="md:w-1/2">
              <p className="font-sans text-lg text-brand-body/90 leading-relaxed mb-4">
                This review is most useful for clients with complex changes over
                the last few years, such as moves, job transitions, children,
                or shifting income.
              </p>
              <p className="font-sans text-base text-brand-body/90 leading-relaxed mb-4">
                We take a calm, step-by-step look at the previous decade only
                when relevant, then decide together whether this should be a
                priority now or later in your overall plan.
              </p>
              <ul className="list-disc pl-6 text-brand-body/90 text-sm space-y-1 mb-6">
                <li>Review up to 10 years of filings only when your profile suggests value.</li>
                <li>Identify missed credits and benefits you may still be able to claim.</li>
                <li>Agree on clear next steps with no pressure to proceed.</li>
              </ul>
              <div className="flex flex-wrap gap-3 items-center">
                <Link
                  href="/en/tax-review"
                  aria-label="Learn more about the 10-Year Holistic Tax Review"
                  className={secondaryCtaClass}
                >
                  Learn More
                </Link>
                <Link
                  href="/en/contact?intent=tax-review"
                  aria-label="Ask if the Tax Review is relevant for your situation"
                  className="text-sm text-brand-blue/80 hover:text-brand-green underline underline-offset-4"
                >
                  Ask if this is relevant for you
                </Link>
              </div>
              <p className="mt-2 text-xs text-brand-blue/70">
                Not everyone needs this review first. We can help you choose
                the right starting point.
              </p>
            </Reveal>

            <Reveal variants={fadeUp} className="md:w-1/2 md:mt-4">
              <div className="bg-white rounded-2xl border border-brand-gold/30 shadow-md p-6">
                <h3 className="font-sans text-xl text-brand-blue/90 font-semibold mb-3">
                  Who benefits most
                </h3>
                <ul className="list-disc pl-6 text-brand-body/90 text-sm space-y-1 mb-4">
                  <li>Families with kids, support, or changing benefits.</li>
                  <li>
                    Professionals who moved, changed jobs, or had income
                    swings.
                  </li>
                  <li>
                    Newcomers who weren&apos;t fully guided on Canadian tax
                    rules.
                  </li>
                </ul>
                <p className="text-xs text-brand-blue/70 leading-relaxed">
                  All work is private and confidential. The CRA pays any
                  eligible refunds directly; our role is to help you see what&apos;s
                  possible and walk through the process with calm, clear steps.
                </p>
              </div>
            </Reveal>
          </StaggerGroup>
        </div>
      </RevealPanel>

      {/* ============================ ABOUT ============================ */}
      <RevealPanel className="mt-16" aria-label="About Fanny Samaniego">
        <StaggerGroup className="flex flex-col md:flex-row items-center gap-10">
          <Reveal variants={fadeUp} className="md:w-1/2 flex justify-center">
            <Image
              src="/fanny.jpg"
              alt="Fanny Samaniego — Financial Advisor & Mortgage Agent in Toronto"
              width={360}
              height={360}
              className="rounded-full shadow-md object-cover border-4 border-brand-green/80"
              priority
            />
          </Reveal>

          <Reveal variants={fadeUp} className="md:w-1/2">
            <h2 className="font-brand text-3xl md:text-4xl text-brand-green/90 mb-4 font-semibold">
              Professional guidance with a human heart
            </h2>
            <p className="font-sans text-lg text-brand-body/90 mb-4 leading-relaxed max-w-2xl">
              I&apos;m Fanny Samaniego—a bilingual{" "}
              <b>
                Mortgage Agent (Level 2), former CRA Income Tax Auditor, and
                holistic financial consultant
              </b>{" "}
              based in Toronto. I help professional families, executives, and
              business owners make clear, values-aligned decisions across
              mortgages, tax rhythm, and everyday money strategy.
            </p>
            <ul className="list-disc pl-6 text-brand-body/90 text-base space-y-2 mb-8">
              <li>
                Mortgage strategy, cash-flow systems, and tax-season readiness
                aligned in one practical plan.
              </li>
              <li>
                Coordinated support with lenders and qualified specialists when
                your plan needs it.
              </li>
              <li>Clear next steps after every call—without overwhelm.</li>
            </ul>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/en/about"
                aria-label="Read the full About page"
                className={ghostCtaClass}
              >
                Read the full About page
              </Link>
              <Link
                href="/en/contact?intent=question"
                aria-label="Start a conversation"
                className="self-center text-brand-blue/80 underline decoration-2 underline-offset-4 hover:text-brand-green"
              >
                Let&apos;s explore your options
              </Link>
            </div>
          </Reveal>
        </StaggerGroup>
      </RevealPanel>

      {/* ==================== SERVICES ENTRY ==================== */}
      <RevealPanel className="mt-16" aria-label="Explore full service catalog">
        <Reveal variants={fadeUp}>
          <div className="mx-auto max-w-3xl rounded-2xl border border-brand-gold/30 bg-gradient-to-r from-white via-brand-beige/70 to-white p-6 text-center">
            <p className="text-sm text-brand-blue/80 mb-4">
              Ready for the full map?
            </p>
            <Link
              href="/en/services"
              aria-label="Explore full services"
              className={[
                ghostCtaClass,
                "group relative overflow-hidden border-2 border-brand-gold/50 bg-white/90 px-8 py-3 shadow-sm",
                "motion-safe:transition-all motion-safe:duration-300 motion-safe:hover:-translate-y-0.5 motion-safe:hover:shadow-md",
              ].join(" ")}
            >
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-y-0 left-0 w-1/3 -translate-x-full bg-gradient-to-r from-transparent via-brand-gold/35 to-transparent motion-safe:transition-transform motion-safe:duration-700 motion-safe:group-hover:translate-x-[360%]"
              />
              <span className="relative z-10 inline-flex items-center gap-2">
                Explore Full Services
                <span
                  aria-hidden="true"
                  className="motion-safe:transition-transform motion-safe:duration-300 motion-safe:group-hover:translate-x-1"
                >
                  →
                </span>
              </span>
            </Link>
          </div>
        </Reveal>
      </RevealPanel>

      {/* ================ KITCHEN TABLE PROGRAM ================= */}
      <RevealPanel
        className="mt-16"
        aria-label="Kitchen Table Conversations — 4-week small-group program"
      >
        <SectionTitle
          title="Kitchen Table Conversations"
          kicker="4-Week Small-Group Program"
        />
        <Reveal variants={fade}>
          <p className="text-center text-brand-body/90 mt-2 max-w-2xl mx-auto leading-relaxed">
            Intimate small-group circles led by Fanny and her team—like sitting
            around a kitchen table—where you can ask questions, get clear
            answers, and leave with next steps you’ll actually follow.
          </p>
        </Reveal>

        <StaggerGroup className="grid md:grid-cols-3 gap-6 mt-8">
          {[
            {
              title: "Who it’s for",
              items: [
                "First-time buyers & newcomers",
                "Families aligning values & budgets",
                "Investors exploring multi-unit (4–10)",
              ],
            },
            {
              title: "What we cover",
              items: [
                "Mortgage steps, rates & readiness",
                "Cash-flow, debt & credit strategy",
                "Values-aligned, stress-free planning",
              ],
            },
            {
              title: "How it works",
              items: [
                "Small groups (friendly & focused)",
                "4 weekly sessions • 45–60 min",
                "Simple next-steps after each call",
              ],
            },
          ].map((col) => (
            <Reveal key={col.title} variants={fadeUp}>
              <div className="rounded-2xl border border-brand-green/30 p-6 hover:-translate-y-0.5 transition-transform duration-200">
                <h4 className="font-sans text-xl text-brand-blue/90 font-semibold mb-2">
                  {col.title}
                </h4>
                <ul className="list-disc pl-6 text-brand-body/90 space-y-1">
                  {col.items.map((it) => (
                    <li key={it}>{it}</li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </StaggerGroup>

        <Reveal variants={fade}>
          <div className="text-center mt-10 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href={`/en/contact?intent=package&package=${encodeURIComponent(
                "Kitchen Table Conversations — 4-Week Cohort"
              )}`}
              className={secondaryCtaClass}
            >
              Join the Next Cohort
            </Link>
          </div>
        </Reveal>
      </RevealPanel>

      {/* ======================= TOOLS & ARTICLES ======================= */}
      <RevealPanel className="mt-16" aria-label="Helpful Tools and Articles">
        <SectionTitle title="Helpful Tools & Articles" />
        <StaggerGroup className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Reveal variants={fadeUp}>
            <div className="group bg-white rounded-2xl p-8 shadow-md border border-brand-gold/20 flex flex-col hover:-translate-y-0.5 hover:shadow-lg transition-transform">
              <h3 className="font-sans text-2xl text-brand-blue/90 font-semibold mb-2">
                Tools
              </h3>
              <p className="text-brand-body/90 mb-6">
                Simple calculators, checklists, and decision helpers to keep
                things moving—made to match how you actually follow through.
              </p>
              <ul className="list-disc pl-6 text-brand-body/90 text-sm space-y-1 mb-6">
                <li>Budget & cash-flow worksheet</li>
                <li>Mortgage readiness checklist</li>
                <li>Tax season prep list</li>
              </ul>
              <Link
                href="/en/tools"
                aria-label="Browse tools"
                className={ghostCtaClass}
              >
                Browse Tools
              </Link>
            </div>
          </Reveal>

          <Reveal variants={fadeUp}>
            <div className="group bg-white rounded-2xl p-8 shadow-md border border-brand-gold/20 flex flex-col hover:-translate-y-0.5 hover:shadow-lg transition-transform">
              <h3 className="font-sans text-2xl text-brand-blue/90 font-semibold mb-2">
                Articles
              </h3>
              <p className="text-brand-body/90 mb-6">
                Short, practical reads on mortgages, money behavior, and tax
                basics—no jargon, just next steps.
              </p>
              <ul className="list-disc pl-6 text-brand-body/90 text-sm space-y-1 mb-6">
                <li>First-home roadmap (Toronto edition)</li>
                <li>Debt strategy without the shame spiral</li>
                <li>Small-business taxes: what to track</li>
              </ul>
              <Link
                href="/en/resources"
                aria-label="Read articles"
                className={ghostCtaClass}
              >
                Read Articles
              </Link>
            </div>
          </Reveal>
        </StaggerGroup>
      </RevealPanel>

      {/* ============================ SUBSCRIBE ============================ */}
      <RevealPanel
        className="mt-20"
        aria-label="Subscribe to financial tips and resources"
      >
        <Reveal variants={fadeUp}>
          <div className="text-center max-w-3xl mx-auto bg-white/80 rounded-2xl p-10 shadow-sm border border-brand-gold/20">
            <h3 className="font-sans text-2xl text-brand-green/90 font-semibold mb-2">
              Stay in the Loop
            </h3>
            <p className="text-brand-body/90 mb-6">
              Get monthly tips, checklists, and gentle reminders—bilingual and
              spam-free.
            </p>
            <Link
              href="/en/subscribe"
              aria-label="Go to subscription page"
              className={primaryCtaClass}
            >
              Subscribe
            </Link>
          </div>
        </Reveal>
      </RevealPanel>

      {/* =========================== FINAL BAND =========================== */}
      <Reveal variants={fade}>
        <section className="py-20 text-center border-t border-brand-gold/10 mt-20">
          <h3 className="font-sans text-2xl md:text-3xl text-brand-green/90 font-semibold mb-3">
            Clarity grows from conversation.
          </h3>
          <p className="text-brand-body/90 mb-5 max-w-xl mx-auto">
            No pressure, no rush—just thoughtful guidance when it&apos;s right
            for you.
          </p>
          <Link
            href="/en/contact?intent=hello"
            aria-label="Start a conversation"
            className={secondaryCtaClass}
          >
            Start a Conversation
          </Link>
          <p className="text-xs text-brand-blue/60 mt-3 max-w-xl mx-auto">
            Human Design is optional—used only to personalize communication and
            pacing. It never replaces financial, tax, or legal fundamentals.
          </p>
        </section>
      </Reveal>
    </main>
  );
}
