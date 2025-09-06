// app/en/about/page.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import * as React from "react";
import type { ReactNode, ElementType, ComponentPropsWithoutRef } from "react";
import { motion, useReducedMotion, type Variants, type Transition } from "framer-motion";
import {
  Building2,
  Calculator,
  PiggyBank,
  Scale,
  Shield,
  FileText,
  Users,
} from "lucide-react";

/* ---------------------- Motion helpers ---------------------- */
const easingBezier = [0.22, 1, 0.36, 1] as const;
const makeTrans = (reduced: boolean): Transition =>
  (reduced ? { duration: 0 } : { duration: 0.6, ease: easingBezier as unknown as Transition["ease"] }) as Transition;

function useAnims() {
  const prefersReduced = useReducedMotion();

  const fade: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: makeTrans(!!prefersReduced) },
  };

  const fadeUp: Variants = {
    hidden: { opacity: 0, y: 14 },
    visible: { opacity: 1, y: 0, transition: makeTrans(!!prefersReduced) },
  };

  const stagger: Variants = {
    hidden: {},
    visible: {
      transition: prefersReduced ? {} : { staggerChildren: 0.12, delayChildren: 0.06 },
    },
  };

  return { fade, fadeUp, stagger };
}

/* --- Shared “panel” look --- */
type PanelProps<T extends ElementType = "section"> = {
  children: ReactNode;
  className?: string;
  as?: T;
} & Omit<ComponentPropsWithoutRef<T>, "as" | "children" | "className">;

function Panel<T extends ElementType = "section">({
  children,
  className = "",
  as,
  ...rest
}: PanelProps<T>) {
  const Tag = (as ?? "section") as ElementType;
  return (
    <Tag
      className={[
        "max-w-content mx-auto px-5 sm:px-8 py-8 sm:py-12",
        "bg-white/95 rounded-[28px] border border-brand-gold/40 shadow-lg",
        "backdrop-blur-[1px]",
        className,
      ].join(" ")}
      {...rest}
    >
      {children}
    </Tag>
  );
}

/** Same Panel, but reveals softly when scrolled into view */
function MotionPanel({
  children,
  className = "",
  viewportAmount = 0.2,
}: {
  children: ReactNode;
  className?: string;
  viewportAmount?: number;
}) {
  const { fadeUp } = useAnims();
  return (
    <motion.section
      variants={fadeUp}
      initial={false} // avoid hidden SSR
      whileInView="visible"
      viewport={{ once: true, amount: viewportAmount }}
      className={className}
    >
      <Panel>{children}</Panel>
    </motion.section>
  );
}

function SectionTitle({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: ReactNode;
}) {
  const { fade, fadeUp } = useAnims();
  return (
    <motion.div
      variants={fade}
      initial={false}
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      className="text-center mb-6"
    >
      <motion.h1
        variants={fadeUp}
        className="font-serif font-extrabold text-4xl md:text-5xl text-brand-green tracking-tight"
      >
        {title}
      </motion.h1>
      <motion.div variants={fade} className="flex justify-center my-4" aria-hidden="true">
        <div className="w-16 h-[3px] rounded-full bg-brand-gold" />
      </motion.div>
      {subtitle && (
        <motion.p variants={fadeUp} className="text-brand-blue/90 text-lg md:text-xl max-w-3xl mx-auto">
          {subtitle}
        </motion.p>
      )}
    </motion.div>
  );
}

/* --------------------------- Page content --------------------------- */
function AboutInner() {
  const { fade, fadeUp, stagger } = useAnims();

  return (
    <main className="bg-brand-beige min-h-screen pb-16">
      {/* HERO / BIO */}
      <section className="pt-6 sm:pt-8 px-4" aria-label="About hero and biography">
        <MotionPanel>
          <SectionTitle
            title="About Fanny — Professional Guidance with a Human Heart"
            subtitle={
              <>
                I’m a bilingual Mortgage Agent (Level 2) and holistic financial consultant based in Toronto.
                My work blends lending experience, tax cadence, and accounting discipline so you can make
                clear, values-aligned decisions—and feel calm about money. We serve a select roster of
                professional families, executives, and business owners.
              </>
            }
          />
          <motion.div
            variants={stagger}
            initial={false}
            whileInView="visible"
            viewport={{ once: true, amount: 0.25 }}
            className="mt-10 flex flex-col md:flex-row items-center gap-10"
          >
            <motion.div variants={fadeUp} className="flex-shrink-0 flex justify-center">
              <Image
                src="/fanny-portrait.jpg"
                alt="Portrait of Fanny Samaniego, Mortgage Agent (Level 2) and Financial Consultant in Toronto"
                width={300}
                height={380}
                className="rounded-3xl shadow-lg object-cover border-4 border-brand-gold"
                priority
              />
            </motion.div>
            <motion.div variants={fadeUp} className="flex-1 md:pl-4">
              <p className="mb-4 text-lg md:text-xl text-brand-body leading-relaxed">
                I specialize in aligning mortgage strategy, cash-flow systems, and tax-season readiness—so
                your near-term steps support long-term goals. Day to day, I assess financial situations,
                clarify mortgage options, and coordinate with lenders so applications move forward without drama.
              </p>
              <p className="mb-4 text-lg md:text-xl text-brand-body leading-relaxed">
                On the planning side, I build holistic, practical routines—and when needed, I support clients
                through CRA reviews with organized documentation, clear communication, and full compliance.
              </p>
              <p className="mb-0 text-lg md:text-xl text-brand-body leading-relaxed">
                We work by invitation to protect presence and quality. If our approach resonates, you’re warmly
                invited to start a conversation.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href="/en/contact?intent=consult&package=Private%20Discovery%20Call"
                  aria-label="Book a Private Discovery Call"
                  className="px-8 py-3 bg-brand-green text-white rounded-full font-semibold border border-brand-green/20 hover:bg-brand-gold hover:text-brand-green transition"
                >
                  Book a Private Discovery Call
                </Link>
                <Link
                  href="/en/services"
                  className="px-8 py-3 bg-transparent text-brand-blue rounded-full font-semibold border-2 border-brand-blue hover:bg-brand-green hover:text-white transition"
                >
                  Explore Services
                </Link>
              </div>
            </motion.div>
          </motion.div>
        </MotionPanel>
      </section>

      {/* CREDENTIALS / QUICK FACTS */}
      <section className="px-4 mt-8" aria-label="Credentials and quick facts">
        <MotionPanel>
          <motion.h2
            variants={fadeUp}
            initial={false}
            whileInView="visible"
            viewport={{ once: true, amount: 0.25 }}
            className="text-2xl md:text-3xl font-serif font-semibold text-brand-blue mb-5 text-center"
          >
            Credentials & Quick Facts
          </motion.h2>

          <motion.ul
            variants={stagger}
            initial={false}
            whileInView="visible"
            viewport={{ once: true, amount: 0.25 }}
            className="grid gap-3 text-lg md:text-xl text-brand-green max-w-3xl mx-auto list-disc ml-6 md:ml-10"
          >
            {[
              "Mortgage Agent (Level 2), Ontario",
              "10+ years across financial planning, taxation, and mortgage services",
              "Accounting and financial reporting background",
              "Lender collaboration for smooth approvals",
              "CRA audit preparation and support",
              "Bilingual: English / Español",
            ].map((item, i) => (
              <motion.li key={i} variants={fadeUp}>
                {item}
              </motion.li>
            ))}
          </motion.ul>
        </MotionPanel>
      </section>

      {/* MULTIDISCIPLINARY TEAM */}
      <section className="px-4 mt-8" aria-label="Multidisciplinary team">
        <MotionPanel>
          <motion.h2
            variants={fadeUp}
            initial={false}
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="text-2xl md:text-3xl font-serif font-semibold text-brand-blue mb-5 text-center"
          >
            A Multidisciplinary Team—Under One Umbrella
          </motion.h2>

          <motion.p
            variants={fade}
            initial={false}
            whileInView="visible"
            viewport={{ once: true, amount: 0.25 }}
            className="max-w-3xl mx-auto text-brand-blue/90 text-base md:text-lg text-center"
          >
            Alongside Fanny, you’ll have coordinated access to qualified professionals. Each specialist operates
            independently—we bring them in when timing serves your plan, so your mortgage, cash-flow, and tax
            cadence actually work together.
          </motion.p>

          <motion.div
            variants={stagger}
            initial={false}
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="mt-6 grid gap-4 md:grid-cols-3"
          >
            {[
              {
                icon: <Building2 className="text-brand-green" size={22} />,
                title: "Mortgage Lenders & Underwriters",
                body: "Policy clarity and product fit—packaging that earns lender confidence.",
              },
              {
                icon: <Calculator className="text-brand-green" size={22} />,
                title: "Tax Advisors / CPAs",
                body: "Proactive strategies, audit-ready records, and calm filing seasons.",
              },
              {
                icon: <PiggyBank className="text-brand-green" size={22} />,
                title: "Cash-Flow & Bookkeeping",
                body: "Behavior-friendly systems rooted in accounting best practice.",
              },
              {
                icon: <Scale className="text-brand-green" size={22} />,
                title: "Real Estate Lawyers",
                body: "Clean closings and clear communication—no drama on possession day.",
              },
              {
                icon: <Shield className="text-brand-green" size={22} />,
                title: "Insurance Brokers",
                body: "Coverage aligned to your risk profile and lender requirements.",
              },
              {
                icon: <FileText className="text-brand-green" size={22} />,
                title: "CRA Audit Support",
                body: "Preparation and representation when the CRA needs a closer look.",
              },
            ].map((card, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                className="rounded-2xl border border-brand-gold/60 bg-white p-5 shadow-sm"
              >
                <div className="flex items-center gap-2 font-serif text-lg text-brand-green font-semibold">
                  {card.icon}
                  {card.title}
                </div>
                <p className="mt-2 text-sm text-brand-blue/90">{card.body}</p>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            variants={fade}
            initial={false}
            whileInView="visible"
            className="mt-6 flex items-center justify-center gap-2 text-sm text-brand-blue/70"
          >
            <Users size={16} />{" "}
            <span>We only introduce specialists when they add clear value to your plan.</span>
          </motion.div>
        </MotionPanel>
      </section>

      {/* HOW WE USE AI */}
      <section className="px-4 mt-8" aria-label="How we use AI">
        <MotionPanel>
          <div className="text-center">
            <h3 className="font-serif text-xl md:text-2xl font-bold text-brand-green">
              How We Use AI (with human review)
            </h3>
            <p className="mt-2 text-brand-blue/90 max-w-3xl mx-auto">
              We use privacy-respecting AI tools to speed up prep: summarizing documents, organizing checklists,
              EN/ES translation, and drafting budgets. Every recommendation and all numbers are reviewed by
              Fanny or a qualified professional. We do <strong>not</strong> automate credit decisions—lenders
              always make final approvals. You can opt out anytime—just tell us.
            </p>
          </div>
        </MotionPanel>
      </section>

      {/* PHILOSOPHY */}
      <section className="px-4 mt-8" aria-label="Our philosophy">
        <MotionPanel className="text-center">
          <motion.h3
            variants={fadeUp}
            initial={false}
            whileInView="visible"
            className="font-serif text-xl md:text-2xl text-brand-green font-bold mb-2"
          >
            Why “Guidance by Invitation”?
          </motion.h3>
          <motion.p variants={fade} initial={false} whileInView="visible" className="font-sans text-lg text-brand-body max-w-3xl mx-auto">
            The most meaningful work happens when both client and guide feel a natural fit. We start
            with a brief conversation—no pressure, just clarity—to confirm goals, timing, and scope.
          </motion.p>
          <motion.p
            variants={fade}
            initial={false}
            whileInView="visible"
            className="text-brand-body text-base mt-3 opacity-75 max-w-3xl mx-auto"
          >
            <em>
              On request, we can use a light Human Design lens to personalize communication and cadence.
              It never replaces financial, tax, or legal fundamentals—it simply helps your plan fit your life.
            </em>
          </motion.p>
          <div className="mt-6">
            <Link href="/en/services" className="text-brand-blue underline hover:text-brand-green">
              See how we work and what we offer →
            </Link>
          </div>
        </MotionPanel>
      </section>

      {/* WHO WE SERVE */}
      <section className="px-4 mt-8" aria-label="Who we serve">
        <MotionPanel>
          <motion.h2
            variants={fadeUp}
            initial={false}
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="text-2xl md:text-3xl font-serif font-semibold text-brand-blue mb-5 text-center"
          >
            Who We Serve Best
          </motion.h2>
          <motion.ul
            variants={stagger}
            initial={false}
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="grid gap-3 text-brand-blue/90 max-w-3xl mx-auto list-disc ml-6 md:ml-10"
          >
            {[
              "Newcomers and first-time buyers building readiness",
              "Families balancing cash-flow with long-term goals",
              "Self-employed professionals needing lender-credible documentation",
              "Small investors optimizing financing and tax rhythm",
            ].map((item, i) => (
              <motion.li key={i} variants={fadeUp}>
                {item}
              </motion.li>
            ))}
          </motion.ul>
        </MotionPanel>
      </section>

      {/* COMPLIANCE & NOTES */}
      <section className="px-4 mt-8" aria-label="Compliance and important notes">
        <MotionPanel>
          <h3 className="font-serif text-xl md:text-2xl font-bold text-brand-green text-center">
            Notes on Compliance & Scope
          </h3>
          <div className="mt-3 text-sm md:text-base text-brand-blue/90 max-w-4xl mx-auto space-y-2">
            <p>
              Prices (where shown) are in CAD and may be subject to HST. Mortgage services are typically
              free for qualified residential borrowers because compensation is paid by the lender on closing.
              Fees may apply in non-prime/private/commercial scenarios and will always be disclosed in advance.
              All mortgages are O.A.C. (on approved credit).
            </p>
            <p>
              Coaching and advice-only services are independent of mortgage compensation and do not replace legal,
              tax, or accounting advice. We coordinate with your chosen professionals as needed. Documents are
              collected via secure links. Bilingual support (EN/ES).
            </p>
            <p className="m-0">
              Human Design is optional and used only to personalize communication and pacing; it is not financial,
              tax, accounting, legal, or investment advice.
            </p>
          </div>
        </MotionPanel>
      </section>

      {/* CTA */}
      <section className="px-4 mt-8" aria-label="Contact call-to-action">
        <MotionPanel className="text-center">
          <motion.h2
            variants={fadeUp}
            initial={false}
            whileInView="visible"
            className="text-2xl md:text-3xl font-serif font-bold text-brand-green mb-3"
          >
            Ready to start the conversation?
          </motion.h2>
          <motion.p variants={fade} initial={false} whileInView="visible" className="text-brand-body mb-6">
            A 20–30 minute discovery call will give you 2–3 clear next steps—no pressure.
          </motion.p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link
              href="/en/contact?intent=consult&package=Private%20Discovery%20Call"
              aria-label="Book a Private Discovery Call"
              className="inline-block"
            >
              <motion.button
                type="button"
                variants={fadeUp}
                whileHover={{ y: -2, scale: 1.01, transition: { duration: 0.15, ease: easingBezier as unknown as Transition["ease"] } }}
                whileFocus={{ scale: 1.005 }}
                className="px-10 py-3 bg-brand-gold text-brand-green font-serif font-bold rounded-full shadow hover:bg-brand-blue hover:text-white transition focus:outline-none focus:ring-2 focus:ring-brand-gold"
              >
                Book a Private Discovery Call
              </motion.button>
            </Link>
            <Link
              href="/en/resources"
              className="px-8 py-3 bg-transparent text-brand-blue rounded-full font-semibold border-2 border-brand-blue hover:bg-brand-green hover:text-white transition"
            >
              Browse Articles & Tools
            </Link>
          </div>
        </MotionPanel>
      </section>
    </main>
  );
}

/* --------------------------- Suspense wrapper --------------------------- */
export default function About() {
  return (
    <React.Suspense fallback={<main className="min-h-screen bg-white" />}>
      <AboutInner />
    </React.Suspense>
  );
}
