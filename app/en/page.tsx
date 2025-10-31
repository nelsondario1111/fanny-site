"use client";

import Image from "next/image";
import Link from "next/link";
import type React from "react";
import {
  FaIdBadge,
  FaUsers,
  FaLeaf,
  FaShieldAlt,
  FaGlobeAmericas,
} from "react-icons/fa";

import {
  Reveal,
  RevealPanel,
  StaggerGroup,
  useMotionPresets,
} from "@/components/motion-safe";

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
        <h2 className="font-serif text-3xl md:text-4xl text-brand-green/90 font-bold tracking-tight">
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

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Fanny Samaniego",
    url: "https://www.fannysamaniego.com/",
    logo: "https://www.fannysamaniego.com/apple-touch-icon.png",
    founder: {
      "@type": "Person",
      name: "Fanny Samaniego",
      jobTitle: "Financial Advisor & Mortgage Agent",
      worksFor: { "@type": "Organization", name: "Fanny Samaniego" },
    },
  } as const;

  return (
    <main className="bg-[#FAF8F5] min-h-dvh text-brand-body">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* =============================== HERO =============================== */}
{/* =============================== HERO =============================== */}
<div
  className="relative bg-fixed bg-center bg-cover"
  style={{ backgroundImage: "url('/nature.jpg')" }}
>
  <div className="absolute inset-0 bg-gradient-to-b from-black/5 via-black/0 to-black/5" />

  <header
    className="relative min-h-[60dvh] flex items-center justify-center overflow-hidden"
    aria-label="Hero"
  >
    <StaggerGroup className="w-full px-4">
      <section className="max-w-content mx-auto px-5 sm:px-8 pt-6 sm:pt-8 pb-10 sm:pb-14 bg-white/90 rounded-2xl border border-brand-gold/20 shadow-md backdrop-blur-[2px] text-center relative">
        {/* subtle internal top padding instead of margin gap */}

        <Reveal variants={fadeUp}>
          <h1 className="font-serif font-extrabold text-5xl md:text-6xl text-brand-green/90 mb-4 tracking-tight">
            Clear numbers, calm decisions.
          </h1>
        </Reveal>

        <Reveal variants={fade}>
          <p className="font-sans text-lg md:text-xl text-brand-blue/90 mb-6 leading-relaxed max-w-2xl mx-auto">
            When you’re ready for holistic, human-centered financial coaching,
            I’m here to walk alongside you—offering support that honors your
            unique journey.
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
                className="px-8 py-3 bg-brand-green text-white rounded-full font-semibold border-2 border-brand-green hover:bg-brand-gold hover:text-brand-green transition"
              >
                Explore Services
              </Link>
              <Link
                href="/en/tools"
                aria-label="Browse tools"
                className="px-8 py-3 bg-transparent text-brand-blue/90 rounded-full font-semibold border-2 border-brand-blue/60 hover:bg-brand-blue/80 hover:text-white transition"
              >
                Browse Tools
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
          <div
            className="mt-6 flex flex-wrap items-center justify-center gap-2"
            aria-label="Trust badges"
          >
            {[
              { icon: <FaShieldAlt aria-hidden />, text: "Private & Confidential" },
              { icon: <FaGlobeAmericas aria-hidden />, text: "Bilingual (EN/ES)" },
              { icon: <FaIdBadge aria-hidden />, text: "Licensed Mortgage Agent (L2)" },
            ].map((item) => (
              <span
                key={item.text}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-brand-green/30 text-brand-green/90 text-xs md:text-sm"
              >
                {item.icon} {item.text}
              </span>
            ))}
          </div>
        </Reveal>
      </section>
    </StaggerGroup>
  </header>
</div>

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
            <h2 className="font-serif text-3xl md:text-4xl text-brand-green/90 mb-4 font-bold">
              Invited Wisdom, Shared with Heart
            </h2>
            <p className="font-sans text-lg text-brand-body/90 mb-6 leading-relaxed max-w-2xl">
              I’m Fanny Samaniego—a bilingual{" "}
              <b>
                Financial Advisor, holistic coach, and licensed Mortgage Agent
              </b>{" "}
              in Toronto. With a coordinated team, we guide professional
              families, executives, and business owners who want practical
              results without losing sight of values and peace of mind.
            </p>
            <ul className="list-disc pl-6 text-brand-body/90 text-base space-y-2 mb-8">
              <li>
                Plans that fit your life—rooted in how you naturally decide and
                follow through.
              </li>
              <li>
                Optional Human Design lens to personalize communication and
                cadence—never replacing financial or legal fundamentals.
              </li>
              <li>Clear next steps after every call—no overwhelm.</li>
            </ul>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/en/about"
                aria-label="Discover Fanny Samaniego's Journey"
                className="px-8 py-3 bg-transparent text-brand-green rounded-full font-semibold border-2 border-brand-green hover:bg-brand-green hover:text-white transition-all"
              >
                Discover My Journey
              </Link>
              <Link
                href="/en/contact?intent=question"
                aria-label="Start a conversation"
                className="self-center text-brand-blue/80 underline decoration-2 underline-offset-4 hover:text-brand-green"
              >
                Let’s explore your options
              </Link>
            </div>
          </Reveal>
        </StaggerGroup>
      </RevealPanel>

      {/* ==================== INVITATION PHILOSOPHY ==================== */}
      <RevealPanel className="mt-16" aria-label="Why We Work by Invitation">
        <SectionTitle title="Why We Work by Invitation" />
        <Reveal variants={fade}>
          <p className="font-sans text-lg text-brand-body/90 mb-4 text-center max-w-2xl mx-auto leading-relaxed">
            Strong financial outcomes grow from relationships built on trust and
            mutual fit. Every client journey begins with a meaningful
            conversation.
          </p>
        </Reveal>
        <StaggerGroup className="text-left max-w-2xl mx-auto">
          <Reveal variants={fadeUp}>
            <ul className="list-disc pl-6 text-brand-body/90 text-base space-y-2">
              <li>We confirm your goals and timing before we start.</li>
              <li>You meet the right specialist for each step.</li>
              <li>
                We craft a plan around your strengths and decision style—while
                staying grounded in financial, tax, and legal basics.
              </li>
            </ul>
          </Reveal>
        </StaggerGroup>
        <Reveal variants={fade}>
          <div className="mt-6 text-center">
            <Link
              href="/en/contact?intent=hello"
              className="text-brand-blue/80 underline decoration-2 underline-offset-4 hover:text-brand-green"
            >
              When you’re ready, send a note →
            </Link>
          </div>
        </Reveal>
      </RevealPanel>
      {/* ============================ BADGES ============================ */}
      <RevealPanel className="mt-16" aria-label="Professional Certifications and Partners">
        <SectionTitle title="Professional Confidence, Human Approach" />
        <StaggerGroup className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
          {[
            { icon: <FaIdBadge aria-hidden className="text-xl" />, text: "Licensed Mortgage Agent (L2)" },
            { icon: <FaUsers aria-hidden className="text-xl" />, text: "Coordinated Team of Specialists" },
            { icon: <FaLeaf aria-hidden className="text-xl" />, text: "Optional Human Design Personalization" },
          ].map((b) => (
            <Reveal key={b.text} variants={fadeUp}>
              <div className="group bg-white rounded-2xl p-8 shadow-md border border-brand-gold/20 flex flex-col transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-lg">
                <div className="text-2xl text-brand-green/90 flex items-center justify-center">{b.icon}</div>
                <p className="font-semibold text-brand-blue/90 mt-2">{b.text}</p>
              </div>
            </Reveal>
          ))}
        </StaggerGroup>
      </RevealPanel>

      {/* ======================= SERVICES PREVIEW ======================= */}
      <RevealPanel className="mt-16" aria-label="Core Services">
        <SectionTitle title="Ways We Can Guide You" />
        <StaggerGroup className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: "💡",
              title: "Financial Guidance",
              body: "Clear, heart-centered support for your financial goals—anchored in your natural strengths.",
              bullets: [
                "Budget & cash-flow plans you’ll actually use",
                "Debt strategy, credit repair & savings systems",
                "Optional Human Design to fine-tune cadence & accountability",
              ],
              href: "/en/services#foundations",
              label: "Explore Financial Guidance",
            },
            {
              icon: "🌱",
              title: "Holistic Tax Planning",
              body: "Practical, values-aligned strategies to keep more of what you earn.",
              bullets: [
                "Personal & small-business considerations",
                "Cash-flow friendly, compliance-first planning",
                "Seasonal reminders and prep checklists",
              ],
              href: "/en/services#legacy",
              label: "Explore Tax Planning",
            },
            {
              icon: "🏡",
              title: "Mortgage Guidance",
              body: "Licensed advice for first homes, upgrades, refinancing, and multi-unit investments.",
              bullets: [
                "Pre-approval & readiness check",
                "4–10 unit properties & investment strategy",
                "Rate, term & structure optimization",
              ],
              href: "/en/services#mortgage",
              label: "Explore Mortgage Guidance",
            },
          ].map((c) => (
            <Reveal key={c.title} variants={fadeUp}>
              <div className="group bg-white rounded-2xl p-8 shadow-md border border-brand-gold/20 flex flex-col transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-lg">
                <div className="w-14 h-14 mb-4 rounded-full bg-brand-green flex items-center justify-center text-white text-2xl">
                  <span aria-hidden>{c.icon}</span>
                </div>
                <h3 className="font-serif text-2xl text-brand-blue/90 mb-2 font-bold">{c.title}</h3>
                <p className="font-sans text-brand-body/90 mb-4">{c.body}</p>
                <ul className="list-disc pl-6 text-brand-body/90 text-sm space-y-1 mb-6">
                  {c.bullets.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
                <Link
                  href={c.href}
                  aria-label={c.label}
                  className="px-8 py-3 bg-transparent text-brand-green rounded-full font-semibold border-2 border-brand-green hover:bg-brand-green hover:text-white transition-all inline-block"
                >
                  {c.label}
                </Link>
              </div>
            </Reveal>
          ))}
        </StaggerGroup>
      </RevealPanel>

      {/* ================ KITCHEN TABLE PROGRAM ================= */}
      <RevealPanel className="mt-16" aria-label="Kitchen Table Conversations — 4-week small-group program">
        <SectionTitle title="Kitchen Table Conversations" kicker="4-Week Small-Group Program" />
        <Reveal variants={fade}>
          <p className="text-center text-brand-body/90 mt-2 max-w-2xl mx-auto leading-relaxed">
            Intimate small-group circles led by Fanny and her team—like sitting around a kitchen table—where you can ask questions, get clear answers, and leave with next steps you’ll actually follow.
          </p>
        </Reveal>

        <StaggerGroup className="grid md:grid-cols-3 gap-6 mt-8">
          {[
            { title: "Who it’s for", items: ["First-time buyers & newcomers", "Families aligning values & budgets", "Investors exploring multi-unit (4–10)"] },
            { title: "What we cover", items: ["Mortgage steps, rates & readiness", "Cash-flow, debt & credit strategy", "Values-aligned, stress-free planning"] },
            { title: "How it works", items: ["Small groups (friendly & focused)", "4 weekly sessions • 45–60 min", "Simple next-steps after each call"] },
          ].map((col) => (
            <Reveal key={col.title} variants={fadeUp}>
              <div className="rounded-2xl border border-brand-green/30 p-6 hover:-translate-y-0.5 transition-transform duration-200">
                <h4 className="font-serif text-xl text-brand-blue/90 font-bold mb-2">
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
              href="/en/services#family"
              className="px-8 py-3 bg-transparent text-brand-green rounded-full font-semibold border-2 border-brand-green hover:bg-brand-green hover:text-white transition"
            >
              View Program Details
            </Link>
            <Link
              href={`/en/contact?intent=package&package=${encodeURIComponent("Holistic Family Conversations — 4-Week Cohort")}`}
              className="px-8 py-3 bg-transparent text-brand-blue/90 rounded-full font-semibold border-2 border-brand-blue/50 hover:bg-brand-blue/80 hover:text-white transition"
            >
              Talk to Us
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
              <h3 className="font-serif text-2xl text-brand-blue/90 font-bold mb-2">Tools</h3>
              <p className="text-brand-body/90 mb-6">Simple calculators, checklists, and decision helpers to keep things moving—made to match how you actually follow through.</p>
              <ul className="list-disc pl-6 text-brand-body/90 text-sm space-y-1 mb-6">
                <li>Budget & cash-flow worksheet</li>
                <li>Mortgage readiness checklist</li>
                <li>Tax season prep list</li>
              </ul>
              <Link
                href="/en/tools"
                aria-label="Browse tools"
                className="px-8 py-3 bg-transparent text-brand-green rounded-full font-semibold border-2 border-brand-green hover:bg-brand-green hover:text-white transition"
              >
                Browse Tools
              </Link>
            </div>
          </Reveal>

          <Reveal variants={fadeUp}>
            <div className="group bg-white rounded-2xl p-8 shadow-md border border-brand-gold/20 flex flex-col hover:-translate-y-0.5 hover:shadow-lg transition-transform">
              <h3 className="font-serif text-2xl text-brand-blue/90 font-bold mb-2">Articles</h3>
              <p className="text-brand-body/90 mb-6">Short, practical reads on mortgages, money behavior, and tax basics—no jargon, just next steps.</p>
              <ul className="list-disc pl-6 text-brand-body/90 text-sm space-y-1 mb-6">
                <li>First-home roadmap (Toronto edition)</li>
                <li>Debt strategy without the shame spiral</li>
                <li>Small-business taxes: what to track</li>
              </ul>
              <Link
                href="/en/resources"
                aria-label="Read articles"
                className="px-8 py-3 bg-transparent text-brand-green rounded-full font-semibold border-2 border-brand-green hover:bg-brand-green hover:text-white transition"
              >
                Read Articles
              </Link>
            </div>
          </Reveal>
        </StaggerGroup>
      </RevealPanel>

      {/* ============================ SUBSCRIBE ============================ */}
      <RevealPanel className="mt-20" aria-label="Subscribe to financial tips and resources">
        <Reveal variants={fadeUp}>
          <div className="text-center max-w-3xl mx-auto bg-white/80 rounded-2xl p-10 shadow-sm border border-brand-gold/20">
            <h3 className="font-serif text-2xl text-brand-green/90 font-bold mb-2">Stay in the Loop</h3>
            <p className="text-brand-body/90 mb-6">
              Get monthly tips, checklists, and gentle reminders—bilingual and spam-free.
            </p>
            <Link
              href="/en/subscribe"
              aria-label="Go to subscription page"
              className="px-10 py-3 bg-brand-green text-white rounded-full font-semibold border-2 border-brand-green hover:bg-brand-gold hover:text-brand-green transition"
            >
              Subscribe
            </Link>
          </div>
        </Reveal>
      </RevealPanel>

      {/* =========================== FINAL BAND =========================== */}
      <Reveal variants={fade}>
        <section className="py-20 text-center border-t border-brand-gold/10 mt-20">
          <h3 className="font-serif text-2xl md:text-3xl text-brand-green/90 font-bold mb-3">
            Clarity grows from conversation.
          </h3>
          <p className="text-brand-body/90 mb-5 max-w-xl mx-auto">
            No pressure, no rush—just thoughtful guidance when it’s right for you.
          </p>
          <Link
            href="/en/contact?intent=hello"
            aria-label="Start a conversation"
            className="px-8 py-3 bg-transparent text-brand-blue/90 rounded-full font-semibold border-2 border-brand-blue/60 hover:bg-brand-blue/80 hover:text-white transition"
          >
            Start a Conversation
          </Link>
          <p className="text-xs text-brand-blue/60 mt-3 max-w-xl mx-auto">
            Human Design is optional—used only to personalize communication and pacing. It never replaces financial, tax, or legal fundamentals.
          </p>
        </section>
      </Reveal>
    </main>
  );
}
