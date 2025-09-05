"use client";

import Image from "next/image";
import Link from "next/link";
import { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { FaIdBadge, FaUsers, FaLeaf, FaShieldAlt, FaGlobeAmericas } from "react-icons/fa";

/* ---------------------- Motion helpers ---------------------- */
const easing: number[] = [0.22, 1, 0.36, 1];

function useAnims() {
  const prefersReduced = useReducedMotion();

  const fade = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: prefersReduced ? { duration: 0 } : { duration: 0.6, ease: easing },
    },
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: prefersReduced ? { duration: 0 } : { duration: 0.6, ease: easing },
    },
  };

  const stagger = {
    hidden: {},
    visible: {
      transition: prefersReduced ? {} : { staggerChildren: 0.12, delayChildren: 0.05 },
    },
  };

  return { fade, fadeUp, stagger };
}

/* ---------------- Panel primitives (aligned with Services/Tools) ---------------- */
function Panel({
  children,
  className = "",
  as,
}: {
  children: ReactNode;
  className?: string;
  as?: React.ElementType;
}) {
  const Tag: React.ElementType = as ?? "section";
  return (
    <Tag
      className={[
        "max-w-content mx-auto px-5 sm:px-8 py-8 sm:py-12",
        "bg-white/95 rounded-[28px] border border-brand-gold/40 shadow-lg",
        "backdrop-blur-[1px]",
        className,
      ].join(" ")}
    >
      {children}
    </Tag>
  );
}

function MotionPanel({
  children,
  className = "",
  viewportAmount = 0.18,
}: {
  children: ReactNode;
  className?: string;
  viewportAmount?: number;
}) {
  const { fadeUp } = useAnims();
  return (
    <motion.section
      variants={fadeUp}
      initial={false}                         // <<< prevents hidden state on first paint
      whileInView="visible"
      viewport={{ once: true, amount: viewportAmount }}
      className={className}
    >
      <Panel>{children}</Panel>
    </motion.section>
  );
}

/* Section title with brand divider */
function SectionTitle({ title, kicker }: { title: string; kicker?: string }) {
  const { fade, fadeUp } = useAnims();
  return (
    <motion.div
      variants={fade}
      initial={false}                         // <<< never render invisible on first paint
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      className="text-center mb-8"
    >
      {kicker && (
        <motion.div variants={fade} className="text-brand-blue/80 text-base md:text-lg mb-2">
          {kicker}
        </motion.div>
      )}
      <motion.h2
        variants={fadeUp}
        className="font-serif text-3xl md:text-4xl text-brand-green font-bold tracking-tight"
      >
        {title}
      </motion.h2>
      <motion.div variants={fade} className="flex justify-center mt-3" aria-hidden="true">
        <div className="w-16 h-[3px] rounded-full bg-brand-gold" />
      </motion.div>
    </motion.div>
  );
}

/* ------------------------------- Page ------------------------------- */
export default function Home() {
  const { fade, fadeUp, stagger } = useAnims();

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
    makesOffer: [
      { "@type": "Offer", category: "Financial Coaching", itemOffered: { "@type": "Service", name: "Premium Financial Coaching & Planning" } },
      { "@type": "Offer", category: "Mortgage Services", itemOffered: { "@type": "Service", name: "Mortgage Readiness & Pre-Approval" } },
      { "@type": "Offer", category: "Tax Planning", itemOffered: { "@type": "Service", name: "Holistic Tax Rhythm & Strategy" } },
    ],
  };

  return (
    <main className="bg-brand-beige min-h-dvh">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* ======================= HERO ======================= */}
      <header
        className="relative min-h-[60dvh] flex items-center justify-center overflow-hidden mt-6"
        aria-label="Hero"
      >
        <div className="absolute inset-0 -z-10">
          <Image
            src="/nature.jpg"
            alt=""
            aria-hidden
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/0 to-black/10" />
        </div>

        {/* Consistent table/card: use Panel via MotionPanel */}
        <motion.section
          variants={stagger}
          initial={false}                      // <<< no hidden state on SSR
          animate="visible"
          className="w-full px-4"
        >
          <Panel className="text-center relative">
            {/* subtle gold accent */}
            <div
              aria-hidden
              className="absolute -top-1 left-8 right-8 h-[3px] rounded-full bg-brand-gold/80 shadow-[0_1px_0_rgba(0,0,0,0.06)]"
            />
            <motion.h1
              variants={fadeUp}
              className="font-serif font-extrabold text-5xl md:text-6xl text-brand-green mb-4 tracking-tight"
            >
              Guidance by Invitation. Clarity by Design.
            </motion.h1>

            <motion.p variants={fade} className="font-sans text-xl md:text-2xl text-brand-blue mb-7 leading-relaxed">
              When you’re ready for holistic, heart-centered financial guidance, I’m here to walk
              alongside you—offering support that honors your unique journey.
            </motion.p>

            {/* Clear CTA hierarchy */}
            <motion.nav variants={fade} aria-label="Primary actions" className="flex flex-col items-center gap-2">
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href="/en/services"
                  aria-label="Explore services"
                  className="px-8 py-3 bg-brand-green text-white rounded-full font-semibold border-2 border-brand-green hover:bg-brand-gold hover:text-brand-green transition inline-block"
                >
                  Explore Services
                </Link>
                <Link
                  href="/en/tools"
                  aria-label="Browse tools"
                  className="px-8 py-3 bg-transparent text-brand-blue rounded-full font-semibold border-2 border-brand-blue hover:bg-brand-blue hover:text-white transition inline-block"
                >
                  Browse Tools
                </Link>
              </div>
              <Link
                href="/en/contact?intent=hello"
                className="px-4 py-2 mt-1 rounded-full border border-brand-blue text-[15px] text-brand-blue hover:bg-brand-blue hover:text-white transition"
              >
                Start a conversation
              </Link>
            </motion.nav>

            {/* Trust chips */}
            <motion.div
              variants={fade}
              className="mt-6 flex flex-wrap items-center justify-center gap-2"
              aria-label="Trust badges"
            >
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-brand-gold/60 text-brand-green text-sm">
                <FaShieldAlt aria-hidden /> Private &amp; Confidential
              </span>
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-brand-gold/60 text-brand-green text-sm">
                <FaGlobeAmericas aria-hidden /> Bilingual (EN/ES)
              </span>
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-brand-gold/60 text-brand-green text-sm">
                <FaIdBadge aria-hidden /> Licensed Mortgage Agent (L2)
              </span>
            </motion.div>
          </Panel>
        </motion.section>
      </header>

      {/* ============================ ABOUT ============================ */}
      <MotionPanel className="mt-10" aria-label="About Fanny Samaniego">
        <motion.div
          variants={stagger}
          initial={false}
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="flex flex-col md:flex-row items-center gap-8"
        >
          <motion.div variants={fadeUp} className="md:w-1/2 flex justify-center">
            <Image
              src="/fanny.jpg"
              alt="Fanny Samaniego — Financial Advisor & Mortgage Agent in Toronto"
              width={360}
              height={360}
              className="rounded-full shadow-xl object-cover border-4 border-brand-green"
              priority
            />
          </motion.div>
          <motion.div variants={fadeUp} className="md:w-1/2">
            <h2 className="font-serif text-3xl md:text-4xl text-brand-green mb-4 font-bold">
              Invited Wisdom, Shared with Heart
            </h2>
            <p className="font-sans text-lg md:text-xl text-brand-body mb-6 leading-relaxed">
              I’m Fanny Samaniego—a bilingual <b>Financial Advisor, holistic coach, and licensed
              Mortgage Agent</b> in Toronto. With a coordinated team, we guide professional
              families, executives, and business owners who want practical results without losing
              sight of peace of mind and values.
            </p>
            <ul className="list-disc pl-6 text-brand-body text-base md:text-lg space-y-2 mb-8">
              <li>Plans that fit your life—rooted in how you naturally decide and follow through.</li>
              <li>
                Optional Human Design lens to personalize communication and cadence—never replacing
                financial or legal fundamentals.
              </li>
              <li>Clear next steps after every call—no overwhelm.</li>
            </ul>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/en/about"
                aria-label="Discover Fanny Samaniego's Journey"
                className="px-8 py-3 bg-transparent text-brand-blue rounded-full font-semibold border-2 border-brand-blue hover:bg-brand-green hover:text-white transition-all inline-block"
              >
                Discover My Journey
              </Link>
              <Link
                href="/en/contact?intent=question"
                aria-label="Start a conversation"
                className="self-center text-brand-blue underline decoration-2 underline-offset-4 hover:text-brand-green"
              >
                Let’s explore your options
              </Link>
            </div>
          </motion.div>
        </motion.div>
      </MotionPanel>

      {/* ==================== INVITATION PHILOSOPHY ==================== */}
      <MotionPanel className="mt-8" aria-label="Why We Work by Invitation">
        <SectionTitle title="Why We Work by Invitation" />
        <motion.p
          variants={fade}
          initial={false}
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
          className="font-sans text-lg text-brand-body mb-4 text-center max-w-3xl mx-auto leading-relaxed"
        >
          Strong financial outcomes come from relationships built on trust and the right fit. Every
          client journey begins with a conversation.
        </motion.p>
        <motion.div
          variants={stagger}
          initial={false}
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
          className="text-left max-w-2xl mx-auto"
        >
          <motion.ul variants={fadeUp} className="list-disc pl-6 text-brand-body text-base space-y-2">
            <li>We confirm your goals and timing before we start.</li>
            <li>You meet the right specialist on our team for each step.</li>
            <li>
              We craft a plan around your strengths and decision style (Human Design available on
              request), while staying grounded in financial, tax, and legal basics.
            </li>
          </motion.ul>
        </motion.div>
        <motion.div
          variants={fade}
          initial={false}
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
          className="mt-6 text-center"
        >
          <Link
            href="/en/contact?intent=hello"
            className="text-brand-blue underline decoration-2 underline-offset-4 hover:text-brand-green"
          >
            When you’re ready, send a note →
          </Link>
        </motion.div>
      </MotionPanel>

      {/* ============================ BADGES ============================ */}
      <MotionPanel className="mt-8" aria-label="Professional Certifications and Partners">
        <motion.div
          variants={stagger}
          initial={false}
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center"
        >
          {[
            { icon: <FaIdBadge aria-hidden className="text-xl" />, text: "Licensed Mortgage Agent (Level 2)" },
            { icon: <FaUsers aria-hidden className="text-xl" />, text: "Coordinated Team of Specialists" },
            { icon: <FaLeaf aria-hidden className="text-xl" />, text: "Optional Human Design Personalization" },
          ].map((b) => (
            <motion.div
              key={b.text}
              variants={fadeUp}
              className="rounded-2xl border border-brand-gold p-6 shadow-sm transition-transform duration-200 will-change-transform hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="text-2xl text-brand-green flex items-center justify-center">{b.icon}</div>
              <p className="font-semibold text-brand-blue mt-2">{b.text}</p>
            </motion.div>
          ))}
        </motion.div>
      </MotionPanel>

      {/* ======================= SERVICES PREVIEW ======================= */}
      <MotionPanel className="mt-8" aria-label="Core Services">
        <SectionTitle title="Ways We Can Guide You" />
        <motion.div
          variants={stagger}
          initial={false}
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid md:grid-cols-3 gap-8"
        >
          {[
            {
              icon: "💡",
              title: "Financial Guidance",
              body:
                "Clear, heart-centered support for your financial goals—anchored in your natural strengths.",
              bullets: [
                "Budget & cash-flow plans you’ll actually use",
                "Debt strategy, credit repair & savings systems",
                "Optional Human Design to fine-tune cadence & accountability",
              ],
              href: "/en/services#foundations",
              label: "Explore Financial Guidance",
              secondary: { label: "Have questions?", href: "/en/contact?intent=question" },
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
              secondary: { label: "Have questions?", href: "/en/contact?intent=question" },
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
              secondary: { label: "Start a conversation", href: "/en/contact?intent=mortgage-question" },
            },
          ].map((c) => (
            <motion.div
              key={c.title}
              variants={fadeUp}
              className="group bg-white rounded-2xl p-8 shadow-lg border border-brand-gold flex flex-col transition-transform duration-200 will-change-transform hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="w-14 h-14 mb-4 rounded-full bg-brand-green flex items-center justify-center text-white text-2xl">
                <span aria-hidden>{c.icon}</span>
              </div>
              <h3 className="font-serif text-2xl text-brand-blue mb-2 font-bold">{c.title}</h3>
              <p className="font-sans text-brand-body mb-4">{c.body}</p>
              <ul className="list-disc pl-6 text-brand-body text-sm space-y-1 mb-6">
                {c.bullets.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
              <div className="mt-auto space-y-2">
                <Link
                  href={c.href}
                  aria-label={c.label}
                  className="px-8 py-3 bg-transparent text-brand-green rounded-full font-semibold border-2 border-brand-green hover:bg-brand-green hover:text-white transition-all inline-block"
                >
                  {c.label}
                </Link>
                {c.secondary && (
                  <div>
                    <Link
                      href={c.secondary.href}
                      className="text-sm text-brand-blue/80 underline decoration-2 underline-offset-4 hover:text-brand-green"
                    >
                      {c.secondary.label}
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </MotionPanel>

      {/* ================ KITCHEN TABLE — 4-week program ================ */}
      <MotionPanel className="mt-8" aria-label="Kitchen Table Conversations — 4-week small-group program">
        <SectionTitle title="Kitchen Table Conversations" kicker="4-week small-group program" />
        <motion.p
          variants={fade}
          initial={false}
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="text-center text-brand-body mt-2 max-w-3xl mx-auto"
        >
          Intimate, small-group circles led by Fanny and her team—like sitting around a kitchen
          table—where you can ask questions, get clear answers, and leave with next steps you’ll
          actually follow.
        </motion.p>
        <motion.div
          variants={stagger}
          initial={false}
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid md:grid-cols-3 gap-6 mt-8"
        >
          {[
            {
              title: "Who it’s for",
              items: ["First-time buyers & newcomers", "Families aligning values & budgets", "Investors exploring multi-unit (4–10)"],
            },
            {
              title: "What we cover",
              items: ["Mortgage steps, rates & readiness", "Cash-flow, debt & credit strategy", "Values-aligned, stress-free planning"],
            },
            {
              title: "How it works",
              items: ["Small groups (friendly & focused)", "4 weekly sessions • 45–60 min", "Simple next-steps after each call"],
            },
          ].map((col) => (
            <motion.div
              key={col.title}
              variants={fadeUp}
              className="rounded-2xl border border-brand-green/30 p-6 transition-transform duration-200 hover:-translate-y-0.5"
            >
              <h4 className="font-serif text-xl text-brand-blue font-bold mb-2">{col.title}</h4>
              <ul className="list-disc pl-5 text-brand-body space-y-1">
                {col.items.map((it) => (
                  <li key={it}>{it}</li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          variants={fade}
          initial={false}
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="text-center mt-8 flex flex-col sm:flex-row gap-3 justify-center"
        >
          <Link
            href="/en/services#family"
            className="px-8 py-3 bg-transparent text-brand-green rounded-full font-semibold border-2 border-brand-green hover:bg-brand-green hover:text-white transition inline-block"
          >
            View program details
          </Link>
          <Link
            href={`/en/contact?intent=package&package=${encodeURIComponent(
              "Holistic Family Conversations — 4-Week Cohort",
            )}`}
            className="px-8 py-3 bg-transparent text-brand-blue rounded-full font-semibold border-2 border-brand-blue hover:bg-brand-blue hover:text-white transition inline-block"
          >
            Talk to us
          </Link>
        </motion.div>
      </MotionPanel>

      {/* ======================= TOOLS & ARTICLES ======================= */}
      <MotionPanel className="mt-8" aria-label="Helpful tools and articles">
        <SectionTitle title="Helpful Tools & Articles" />
        <motion.div
          variants={stagger}
          initial={false}
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          <motion.div
            variants={fadeUp}
            className="group bg-white rounded-2xl p-8 shadow-lg border border-brand-gold flex flex-col transition-transform duration-200 hover:-translate-y-1 hover:shadow-xl"
          >
            <h3 className="font-serif text-2xl text-brand-blue font-bold mb-2">Tools</h3>
            <p className="text-brand-body mb-6">
              Simple calculators, checklists, and decision helpers to keep things moving—made to
              match how you actually follow through.
            </p>
            <ul className="list-disc pl-6 text-brand-body text-sm space-y-1 mb-6">
              <li>Budget & cash-flow worksheet</li>
              <li>Mortgage readiness checklist</li>
              <li>Tax season prep list</li>
            </ul>
            <Link
              href="/en/tools"
              aria-label="Browse tools"
              className="px-8 py-3 bg-transparent text-brand-green rounded-full font-semibold border-2 border-brand-green hover:bg-brand-green hover:text-white transition inline-block"
            >
              Browse Tools
            </Link>
          </motion.div>

          <motion.div
            variants={fadeUp}
            className="group bg-white rounded-2xl p-8 shadow-lg border border-brand-gold flex flex-col transition-transform duration-200 hover:-translate-y-1 hover:shadow-xl"
          >
            <h3 className="font-serif text-2xl text-brand-blue font-bold mb-2">Articles</h3>
            <p className="text-brand-body mb-6">
              Short, practical reads on mortgages, money behavior, and tax basics—no jargon, just
              next steps.
            </p>
            <ul className="list-disc pl-6 text-brand-body text-sm space-y-1 mb-6">
              <li>First-home roadmap (Toronto edition)</li>
              <li>Debt strategy without the shame spiral</li>
              <li>Small-business taxes: what to track</li>
            </ul>
            <Link
              href="/en/resources"
              aria-label="Read articles"
              className="px-8 py-3 bg-transparent text-brand-green rounded-full font-semibold border-2 border-brand-green hover:bg-brand-green hover:text-white transition inline-block"
            >
              Read Articles
            </Link>
          </motion.div>
        </motion.div>
      </MotionPanel>

      {/* ============================ SUBSCRIBE ============================ */}
      <MotionPanel className="mt-8" aria-label="Subscribe to financial tips and resources">
        <motion.div
          variants={fadeUp}
          initial={false}
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
          className="text-center max-w-3xl mx-auto"
        >
          <h3 className="font-serif text-2xl text-brand-green font-bold mb-2">Stay in the Loop</h3>
          <p className="text-brand-body mb-6">
            Get monthly tips, checklists, and gentle reminders—bilingual and spam-free.
          </p>
          <Link
            href="/en/subscribe"
            aria-label="Go to subscription page"
            className="px-10 py-3 bg-brand-green text-white rounded-full font-semibold shadow hover:bg-brand-gold hover:text-brand-green border-2 border-brand-blue transition inline-block"
          >
            Subscribe
          </Link>
        </motion.div>
      </MotionPanel>

      {/* =========================== FINAL BAND =========================== */}
      <motion.section
        variants={fade}
        initial={false}
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        className="py-16 text-center"
      >
        <h3 className="font-serif text-2xl md:text-3xl text-brand-green font-bold mb-3">
          Clarity grows from conversation.
        </h3>
        <p className="text-brand-body mb-5 max-w-xl mx-auto">
          No pressure, no rush—just thoughtful guidance when it’s right for you.
        </p>
        <Link
          href="/en/contact?intent=hello"
          aria-label="Start a conversation"
          className="px-8 py-3 bg-transparent text-brand-blue rounded-full font-semibold border-2 border-brand-blue hover:bg-brand-blue hover:text-white transition inline-block"
        >
          Start a conversation
        </Link>
        <p className="text-xs text-brand-blue/70 mt-3 max-w-xl mx-auto">
          Human Design is optional—used only to personalize communication and pacing. It never
          replaces financial, tax, or legal fundamentals.
        </p>
      </motion.section>
    </main>
  );
}
