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
            <section className="max-w-content mx-auto px-5 sm:px-8 pt-6 sm:pt-8 pb-10 sm:pb-14 bg-white/90 rounded-2xl border border-brand-gold/20 shadow-md backdrop-blur-[2px] text-center relative">
              <Reveal variants={fadeUp}>
                <h1 className="font-brand font-bold text-5xl md:text-6xl text-brand-green/90 mb-4 tracking-tight">
                  Clear numbers, calm decisions.
                </h1>
              </Reveal>

              <Reveal variants={fade}>
                <p className="font-sans text-lg md:text-xl text-brand-blue/90 mb-6 leading-relaxed max-w-xl mx-auto">
                  <span className="block">Holistic Financial Consultant</span>
                  <span className="block">Taxes • Mortgages • Money Strategy</span>
                  <span className="block mt-2">
                    When you&apos;re ready, I&apos;m here to walk alongside
                    you with clear numbers and calm, practical decisions.
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
                      href="/en/tax-review"
                      aria-label="Explore 10-Year Holistic Tax Review"
                      className={primaryCtaClass}
                    >
                      Explore 10-Year Tax Review
                    </Link>
                    <Link
                      href="/en/services"
                      aria-label="Explore services"
                      className={secondaryCtaClass}
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
                <TrustChips lang="en" />
              </Reveal>
            </section>
          </StaggerGroup>
        </header>
      </div>

      <RevealPanel className="mt-10" aria-label="Start Here pathways">
        <StartHereDecisionWidget lang="en" />
      </RevealPanel>

      {/* =================== FEATURED: TAX REVIEW =================== */}
      <RevealPanel
        className="mt-16 lg:mt-20"
        aria-label="Featured Service: 10-Year Holistic Tax Review"
      >
        <div className="max-w-5xl mx-auto bg-white/90 rounded-3xl border border-brand-gold/20 shadow-sm px-6 sm:px-10 py-10 sm:py-12">
          <SectionTitle
            title="10-Year Holistic Tax Review"
            kicker="Featured Service"
          />
          <StaggerGroup className="flex flex-col md:flex-row gap-8 items-center">
            <Reveal variants={fadeUp} className="md:w-1/2">
              <p className="font-sans text-lg text-brand-body/90 leading-relaxed mb-4">
                If you&apos;ve lived and worked in Canada for several years,
                there&apos;s a real chance the CRA may owe you money you were
                never told about—especially if your life has included moves, job
                changes, kids, or income shifts.
              </p>
              <p className="font-sans text-base text-brand-body/90 leading-relaxed mb-4">
                The 10-Year Holistic Tax Review is a calm, step-by-step process
                where we look back over the last decade to uncover missed
                benefits, credits, and opportunities—without blame, shame, or
                overwhelm.
              </p>
              <ul className="list-disc pl-6 text-brand-body/90 text-sm space-y-1 mb-6">
                <li>Review up to 10 years of filings and life events.</li>
                <li>Identify missed credits and benefits you may still claim.</li>
                <li>Keep you informed and in control at every step.</li>
              </ul>
              <div className="flex flex-wrap gap-3 items-center">
                <Link
                  href="/en/tax-review"
                  aria-label="Learn more about the 10-Year Holistic Tax Review"
                  className={primaryCtaClass}
                >
                  Learn More
                </Link>
                <Link
                  href="/en/contact?intent=tax-review"
                  aria-label="Book a 15-minute call about the Tax Review"
                  className={secondaryCtaClass}
                >
                  Book a 15-min Call
                </Link>
              </div>
              <p className="mt-2 text-xs text-brand-blue/70">
                No pressure and no upfront commitment—just a short conversation
                to see if this review is right for you.
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
