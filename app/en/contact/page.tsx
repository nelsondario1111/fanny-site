// app/en/contact/page.tsx
"use client";

import * as React from "react";
import Link from "next/link";
import ContactForm from "./ContactForm";

// Motion-safe primitives (now pass variants from useMotionPresets)
import { Reveal, StaggerGroup, useMotionPresets } from "@/components/motion-safe";
import { HUB_TABLE_CLASS, PageHero, ctaButtonClass } from "@/components/sections/hub";

/* --- Panel matches global “table” aesthetic site-wide --- */
function Panel({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={[HUB_TABLE_CLASS, className].join(" ")}>{children}</div>;
}

export default function Contact() {
  const { fade, fadeUp } = useMotionPresets();

  // JSON-LD: ContactPage + Organization + ContactPoint
  const jsonLd = React.useMemo(() => {
    return {
      "@context": "https://schema.org",
      "@type": "ContactPage",
      name: "Contact — Fanny Samaniego",
      url: "https://www.fannysamaniego.com/en/contact",
      mainEntity: {
        "@type": "Organization",
        name: "Fanny Samaniego",
        url: "https://www.fannysamaniego.com",
        contactPoint: [
          {
            "@type": "ContactPoint",
            contactType: "customer support",
            email: "info@fannysamaniego.com",
            telephone: "+1-416-726-8420",
            areaServed: "CA",
            availableLanguage: ["English", "Spanish"],
            hoursAvailable: {
              "@type": "OpeningHoursSpecification",
              dayOfWeek: [
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
              ],
              opens: "09:00",
              closes: "17:00",
            },
          },
        ],
      },
    };
  }, []);

  return (
    <main className="bg-brand-beige min-h-screen">
      <PageHero
        homeHref="/en"
        homeLabel="Home"
        currentLabel="Contact"
        title="Let’s Talk About Your Next Financial Step"
        subtitle="Book a free discovery call or tell us what you’re working on. We’ll reply with clear next steps."
      />

      {/* Content grid */}
      <section className="px-4 py-10">
        <div className="max-w-5xl mx-auto grid gap-6 lg:grid-cols-[1.2fr,0.8fr]">
          {/* Left: Form */}
          <Reveal variants={fade}>
            <Panel className="p-6 sm:p-8">
              <h2 className="sr-only">Contact Form</h2>
              <ContactForm />
              <p className="mt-4 text-xs text-brand-body/70">
                By submitting, you consent to being contacted regarding your
                inquiry. We respect your privacy and never share your
                information.
              </p>
            </Panel>
          </Reveal>

          {/* Right: Details / Trust */}
          <StaggerGroup className="space-y-6">
            <Reveal variants={fadeUp}>
              <Panel className="p-6 sm:p-8">
                <h2 className="text-xl font-brand font-semibold text-brand-green">
                  Contact details
                </h2>

                {/* Use <address> for accessible contact info (without italics) */}
                <address className="not-italic mt-4 text-brand-green">
                  <ul className="space-y-3">
                    <li className="flex items-center justify-between gap-3">
                      <span className="font-semibold">Email</span>
                      <a
                        className="underline hover:text-brand-blue transition"
                        href="mailto:info@fannysamaniego.com"
                      >
                        info@fannysamaniego.com
                      </a>
                    </li>
                    <li className="flex items-center justify-between gap-3">
                      <span className="font-semibold">WhatsApp</span>
                      <a
                        className="underline hover:text-brand-blue transition"
                        href="https://wa.me/14167268420"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        (416) 726-8420
                      </a>
                    </li>
                    <li className="flex items-center justify-between gap-3">
                      <span className="font-semibold">Phone</span>
                      <a
                        className="underline hover:text-brand-blue transition"
                        href="tel:14167268420"
                      >
                        (416) 726-8420
                      </a>
                    </li>
                  </ul>
                </address>

                <div className="mt-6 grid gap-3 sm:grid-cols-2 text-sm">
                  <div className="rounded-2xl border border-brand-gold/50 bg-white p-4">
                    <div className="text-brand-body/70">Office hours</div>
                    <div className="mt-1 font-medium text-brand-green">
                      Mon–Fri · 9:00–17:00 (ET)
                    </div>
                  </div>
                  <div className="rounded-2xl border border-brand-gold/50 bg-white p-4">
                    <div className="text-brand-body/70">Languages</div>
                    <div className="mt-1 font-medium text-brand-green">
                      English · Español
                    </div>
                  </div>
                </div>
              </Panel>
            </Reveal>

            <Reveal variants={fadeUp}>
              <Panel className="p-6 sm:p-8">
                <h2 className="text-xl font-brand font-semibold text-brand-green">
                  Why book a call?
                </h2>
                <ul className="mt-3 space-y-2 text-brand-body">
                  <li className="flex gap-2">
                    <span className="mt-1">•</span>
                    <span>
                      Get a clear, actionable next step in 15–20 minutes.
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <span className="mt-1">•</span>
                    <span>
                      Discuss your goals around cash flow, debt, mortgages, or
                      investments.
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <span className="mt-1">•</span>
                    <span>
                      Holistic, behaviour-aware guidance tailored to your
                      situation.
                    </span>
                  </li>
                </ul>
                <div className="mt-5 rounded-2xl border border-brand-gold/50 bg-brand-beige/60 p-4">
                  <p className="italic text-brand-green">
                    “The blend of clarity, structure, and compassion helped us
                    finally follow a plan that felt natural.”
                  </p>
                  <p className="mt-1 text-sm text-brand-body/70">— Client, Toronto</p>
                </div>
                <div className="mt-6">
                  <Link
                    href="/en/testimonials"
                    className={ctaButtonClass("secondary")}
                  >
                    Read client stories →
                  </Link>
                </div>
              </Panel>
            </Reveal>
          </StaggerGroup>
        </div>
      </section>

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </main>
  );
}
