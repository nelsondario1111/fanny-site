"use client";

import Image from "next/image";
import Link from "next/link";
import type React from "react";
import { FaIdBadge, FaUsers, FaLeaf, FaShieldAlt, FaGlobeAmericas } from "react-icons/fa";

import { Reveal, RevealPanel, StaggerGroup, useMotionPresets } from "@/components/motion-safe";

function SectionTitle({ title, kicker }: { title: string; kicker?: string }) {
  const { fade, fadeUp } = useMotionPresets();
  return (
    <div className="text-center mb-8">
      {kicker && (
        <Reveal variants={fade}>
          <div className="text-brand-blue/80 text-base md:text-lg mb-2">{kicker}</div>
        </Reveal>
      )}
      <Reveal variants={fadeUp}>
        <h2 className="font-serif text-3xl md:text-4xl text-brand-green font-bold tracking-tight">
          {title}
        </h2>
      </Reveal>
      <Reveal variants={fade}>
        <div className="flex justify-center mt-3" aria-hidden="true">
          <div className="w-16 h-[3px] rounded-full bg-brand-gold" />
        </div>
      </Reveal>
    </div>
  );
}

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
    makesOffer: [
      { "@type": "Offer", category: "Financial Coaching", itemOffered: { "@type": "Service", name: "Premium Financial Coaching & Planning" } },
      { "@type": "Offer", category: "Mortgage Services", itemOffered: { "@type": "Service", name: "Mortgage Readiness & Pre-Approval" } },
      { "@type": "Offer", category: "Tax Planning", itemOffered: { "@type": "Service", name: "Holistic Tax Rhythm & Strategy" } },
    ],
  } as const;

  return (
    <main className="bg-brand-beige min-h-dvh">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <header className="relative min-h-[60dvh] flex items-center justify-center overflow-hidden mt-6" aria-label="Hero">
        <div className="absolute inset-0 -z-10">
          <Image src="/nature.jpg" alt="" aria-hidden fill priority sizes="100vw" className="object-cover object-center" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/0 to-black/10" />
        </div>

        {/* ✨ Optional confetti accent for birthday */}
        <div className="absolute inset-0 pointer-events-none z-0">
          <div className="animate-pulse bg-[radial-gradient(circle,rgba(255,223,147,0.2)_1px,transparent_1px)] bg-[length:40px_40px] w-full h-full" />
        </div>

        <StaggerGroup className="w-full px-4">
          <section className="max-w-content mx-auto px-5 sm:px-8 py-8 sm:py-12 bg-white/95 rounded-[28px] border border-brand-gold/40 shadow-lg backdrop-blur-[1px] text-center relative">
            <div aria-hidden className="absolute -top-1 left-8 right-8 h-[3px] rounded-full bg-brand-gold/80 shadow-[0_1px_0_rgba(0,0,0,0.06)]" />

            <Reveal variants={fadeUp}>
              <h1 className="font-serif font-extrabold text-5xl md:text-6xl text-brand-green mb-4 tracking-tight">
                Happy Birthday, Fanny! 🌟
              </h1>
            </Reveal>

            <Reveal variants={fade}>
              <p className="font-sans text-xl md:text-2xl text-brand-blue mb-7 leading-relaxed">
                Today we celebrate not just the brilliant advisor and coach you are, but the luminous, loving soul behind it all.
                Your wisdom, heart, and strength uplift everyone around you. May you feel cherished, held, and deeply appreciated, because you are. Lova ya, sis 💛
              </p>
            </Reveal>

            <Reveal variants={fade}>
              <nav aria-label="Primary actions" className="flex flex-col items-center gap-2">
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link href="/en/services" aria-label="Explore services" className="px-8 py-3 bg-brand-green text-white rounded-full font-semibold border-2 border-brand-green hover:bg-brand-gold hover:text-brand-green transition inline-block">
                    Explore Services
                  </Link>
                  <Link href="/en/tools" aria-label="Browse tools" className="px-8 py-3 bg-transparent text-brand-blue rounded-full font-semibold border-2 border-brand-blue hover:bg-brand-blue hover:text-white transition inline-block">
                    Browse Tools
                  </Link>
                </div>
                <Link href="/en/contact?intent=hello" className="px-4 py-2 mt-1 rounded-full border border-brand-blue text-[15px] text-brand-blue hover:bg-brand-blue hover:text-white transition">
                  Start a conversation
                </Link>
              </nav>
            </Reveal>
          </section>
        </StaggerGroup>
      </header>

      {/* === Final Message Section Enhancement === */}
      <Reveal variants={fade}>
        <section className="py-16 text-center">
          <p className="text-brand-blue font-semibold text-lg mb-4">
            🎂 Fanny, on your birthday, we pause to honor the soul behind the service. Thank you for leading with heart, grace, and grounded clarity.
          </p>
          <h3 className="font-serif text-2xl md:text-3xl text-brand-green font-bold mb-3">Clarity grows from conversation.</h3>
          <p className="text-brand-body mb-5 max-w-xl mx-auto">No pressure, no rush—just thoughtful guidance when it’s right for you.</p>
          <Link href="/en/contact?intent=hello" aria-label="Start a conversation" className="px-8 py-3 bg-transparent text-brand-blue rounded-full font-semibold border-2 border-brand-blue hover:bg-brand-blue hover:text-white transition inline-block">
            Start a conversation
          </Link>
          <p className="text-xs text-brand-blue/70 mt-3 max-w-xl mx-auto">
            Human Design is optional—used only to personalize communication and pacing. It never replaces financial, tax, or legal fundamentals.
          </p>
        </section>
      </Reveal>
    </main>
  );
}
