// app/en/terms/page.tsx
"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { Variants, Easing, Transition } from "framer-motion";

/* ---------------------- Animation helpers ---------------------- */
const easing: Easing = [0.22, 1, 0.36, 1];

function useAnims() {
  const prefersReduced = useReducedMotion();

  const base: Transition = prefersReduced ? { duration: 0 } : { duration: 0.5, ease: easing };
  const baseUp: Transition = prefersReduced ? { duration: 0 } : { duration: 0.55, ease: easing };
  const group: Transition = prefersReduced ? {} : { staggerChildren: 0.12, delayChildren: 0.06 };

  const fade: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: base },
  };

  const fadeUp: Variants = {
    hidden: { opacity: 0, y: 14 },
    visible: { opacity: 1, y: 0, transition: baseUp },
  };

  const stagger: Variants = {
    hidden: {},
    visible: { transition: group },
  };

  return { fade, fadeUp, stagger };
}

/* ---------------------- UI primitives ---------------------- */
function Panel({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <section
      className={[
        "max-w-4xl mx-auto px-5 sm:px-8 py-8 sm:py-10",
        "bg-white/95 rounded-[28px] border border-brand-gold shadow-xl",
        "backdrop-blur-[1px]",
        className,
      ].join(" ")}
    >
      {children}
    </section>
  );
}

function MotionPanel({
  children,
  viewportAmount = 0.2,
}: {
  children: ReactNode;
  viewportAmount?: number;
}) {
  const { fadeUp } = useAnims();
  return (
    <motion.section
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: viewportAmount }}
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
    <motion.div variants={fade} initial="hidden" animate="visible" className="text-center mb-6">
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
        <motion.p variants={fadeUp} className="text-brand-blue/90 text-lg max-w-3xl mx-auto">
          {subtitle}
        </motion.p>
      )}
    </motion.div>
  );
}

function TermSection({
  id,
  heading,
  children,
}: {
  id: string;
  heading: string;
  children: ReactNode;
}) {
  const { fadeUp } = useAnims();
  return (
    <motion.div variants={fadeUp} className="space-y-3" id={id}>
      <h2 className="font-serif text-2xl font-semibold text-brand-green">{heading}</h2>
      <div className="prose prose-brand max-w-none">{children}</div>
    </motion.div>
  );
}

/* ---------------------- Page ---------------------- */
export default function TermsPage() {
  return (
    <main id="main" className="bg-brand-beige min-h-screen px-4 py-10">
      <SectionTitle
        title="Terms of Service"
        subtitle={
          <>
            Please read these Terms carefully. By using this site and our services, you agree to the
            terms below. Last updated: <strong>August 13, 2025</strong>.
          </>
        }
      />

      {/* Intro + ToC */}
      <MotionPanel>
        <div className="text-sm text-brand-blue/80">
          This English version is provided for convenience. If you are viewing the Spanish site, the{" "}
          <Link className="text-brand-green font-semibold hover:underline" href="/es/terminos">
            Spanish Terms
          </Link>{" "}
          apply equally; if there is any inconsistency, the English version governs.
        </div>

        <nav className="mt-6 grid sm:grid-cols-2 gap-2 text-sm" aria-label="Table of contents">
          {[
            ["scope", "1. Scope of Services"],
            ["eligibility", "2. Client Eligibility"],
            ["fees", "3. Fees & Payments"],
            ["cancellations", "4. Scheduling, Cancellations & Refunds"],
            ["communication", "5. Communication & Expectations"],
            ["privacy", "6. Privacy & Data"],
            ["ai", "7. Use of AI Assistance"],
            ["noadvice", "8. No Legal, Tax, or Investment Advice"],
            ["compliance", "9. Licensing & Compliance"],
            ["responsibilities", "10. Client Responsibilities"],
            ["ip", "11. Intellectual Property"],
            ["liability", "12. Disclaimers & Limitation of Liability"],
            ["testimonials", "13. Testimonials & Results"],
            ["changes", "14. Changes to the Terms"],
            ["law", "15. Governing Law"],
            ["contact", "16. Contact"],
          ].map(([id, label]) => (
            <Link
              key={id}
              href={`#${id}`}
              className="rounded-lg px-3 py-2 border border-brand-gold/60 bg-white/70 hover:bg-brand-green/10 hover:text-brand-green transition"
            >
              {label}
            </Link>
          ))}
        </nav>
      </MotionPanel>

      {/* Sections */}
      <div className="mt-8 space-y-6">
        <MotionPanel>
          <div className="space-y-8">
            <TermSection id="scope" heading="1. Scope of Services">
              <p>
                We provide holistic financial coaching, mortgage guidance, and tax planning support
                designed to help you make informed decisions. Coaching focuses on education,
                organization, and accountability. Mortgage guidance includes assessing general
                eligibility and helping you navigate options with licensed lenders. Tax planning
                focuses on education and preparation; tax filing may be handled by an associated
                accountant if you choose that service.
              </p>
            </TermSection>

            <TermSection id="eligibility" heading="2. Client Eligibility">
              <ul>
                <li>You must be 18+ and able to enter a binding agreement.</li>
                <li>Services are primarily intended for residents of Ontario, Canada.</li>
                <li>We may decline engagements that are outside our scope or capacity.</li>
              </ul>
            </TermSection>

            <TermSection id="fees" heading="3. Fees & Payments">
              <ul>
                <li>Current prices are shown on the site or communicated in writing.</li>
                <li>
                  Mortgage brokering is typically lender-paid for standard residential files; if a
                  client fee applies (e.g., private/complex financing), it will be disclosed in
                  writing and authorized before proceeding.
                </li>
                <li>Payments for coaching/tax planning programs are due as indicated at checkout or invoice.</li>
              </ul>
            </TermSection>

            <TermSection id="cancellations" heading="4. Scheduling, Cancellations & Refunds">
              <ul>
                <li>Rescheduling requires at least 24 hours’ notice.</li>
                <li>No-shows or late cancellations may be charged or forfeited from packages.</li>
                <li>Refunds, if any, are at our discretion and will consider work already performed.</li>
              </ul>
            </TermSection>

            <TermSection id="communication" heading="5. Communication & Expectations">
              <ul>
                <li>Typical response time is within 2–3 business days, excluding holidays.</li>
                <li>Email is preferred for record-keeping. WhatsApp or phone may be used as agreed.</li>
                <li>Information you provide must be accurate and complete to receive reliable guidance.</li>
              </ul>
            </TermSection>

            <TermSection id="privacy" heading="6. Privacy & Data">
              <p>
                We respect your privacy and handle information in accordance with our{" "}
                <Link href="/en/privacy" className="text-brand-green font-semibold hover:underline">
                  Privacy Policy
                </Link>
                . You are responsible for safeguarding documents you submit and notifying us of any
                changes that affect your file.
              </p>
            </TermSection>

            <TermSection id="ai" heading="7. Use of AI Assistance">
              <p>
                We may use AI tools (e.g., drafting checklists, summarizing notes) to improve
                efficiency and quality. Outputs are reviewed by a human before use. Do not share
                confidential details you are not comfortable transmitting electronically.
              </p>
            </TermSection>

            <TermSection id="noadvice" heading="8. No Legal, Tax, or Investment Advice">
              <p>
                Coaching and educational materials are for informational purposes and do not
                constitute legal, tax, accounting, or investment advice. You should consult qualified
                professionals before making decisions in those areas. Mortgage rate/approval terms
                are always subject to lender underwriting.
              </p>
            </TermSection>

            <TermSection id="compliance" heading="9. Licensing & Compliance">
              <ul>
                <li>
                  Mortgage services are offered by a licensed Mortgage Agent (Level 2) in Ontario,
                  subject to FSRA and brokerage compliance requirements.
                </li>
                <li>
                  When applicable, tax filing is performed by an associated, independent accountant
                  under their own engagement and terms.
                </li>
              </ul>
            </TermSection>

            <TermSection id="responsibilities" heading="10. Client Responsibilities">
              <ul>
                <li>Provide accurate, timely information and documents.</li>
                <li>Make your own decisions; actions remain your responsibility.</li>
                <li>Follow lender and regulator requirements when pursuing mortgage financing.</li>
              </ul>
            </TermSection>

            <TermSection id="ip" heading="11. Intellectual Property">
              <p>
                All content, templates, and materials we provide are for your personal use and may
                not be reproduced or distributed without written permission.
              </p>
            </TermSection>

            <TermSection id="liability" heading="12. Disclaimers & Limitation of Liability">
              <ul>
                <li>We do not guarantee specific results (e.g., approvals, rates, tax outcomes).</li>
                <li>
                  To the fullest extent permitted by law, our total liability for any claim related to
                  the services is limited to the fees you paid for the affected service.
                </li>
              </ul>
            </TermSection>

            <TermSection id="testimonials" heading="13. Testimonials & Results">
              <p>
                Client stories reflect individual experiences and are not a promise of outcomes. Your
                results depend on your circumstances and actions.
              </p>
            </TermSection>

            <TermSection id="changes" heading="14. Changes to the Terms">
              <p>
                We may update these Terms periodically. Changes take effect when posted on this
                page, with the “Last updated” date adjusted above.
              </p>
            </TermSection>

            <TermSection id="law" heading="15. Governing Law">
              <p>
                These Terms are governed by the laws of the Province of Ontario and the federal laws
                of Canada applicable therein.
              </p>
            </TermSection>

            <TermSection id="contact" heading="16. Contact">
              <p>
                Questions? Contact us at{" "}
                <a className="text-brand-green font-semibold hover:underline" href="mailto:info@fannysamaniego.com">
                  info@fannysamaniego.com
                </a>{" "}
                or use the{" "}
                <Link className="text-brand-green font-semibold hover:underline" href="/en/contact">
                  contact form
                </Link>
                .
              </p>
            </TermSection>
          </div>
        </MotionPanel>
      </div>
    </main>
  );
}
