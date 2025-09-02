import Link from "next/link";
import ContactForm from "./ContactForm";
import ClientFade from "@/components/ui/ClientFade";

function Panel({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={["bg-white/95 rounded-[28px] border border-brand-gold shadow-xl backdrop-blur-[1px]", className].join(" ")}>
      {children}
    </div>
  );
}

export default function Contact() {
  return (
    <main className="bg-brand-beige min-h-screen">
      {/* Hero */}
      <section className="px-4 pt-12">
        <ClientFade>
          <div className="max-w-5xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-brand-green tracking-tight">
              Let’s connect and transform your financial life
            </h1>
            <div className="flex justify-center my-5" aria-hidden="true">
              <div className="w-20 h-[3px] rounded-full bg-brand-gold" />
            </div>
            <p className="text-brand-blue/90 text-lg md:text-xl max-w-3xl mx-auto">
              Book a free discovery call, or tell us what you’re working on. We’ll reply shortly with clear next steps.
            </p>

            <div className="mt-6 flex items-center justify-center gap-3">
              {/* Keep a fast-path CTA; the form below also preselects based on URL ?package= */}
              <Link href="/en/book" className="inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-serif font-bold shadow bg-brand-green text-white hover:opacity-90 transition">
                Book a Free Discovery Call
              </Link>
              <a href="mailto:info@fannysamaniego.com" className="inline-flex items-center justify-center rounded-full px-6 py-3 text-sm border-2 border-brand-green text-brand-green hover:bg-brand-green hover:text-white transition">
                Email Us
              </a>
            </div>
          </div>
        </ClientFade>
      </section>

      {/* Content grid */}
      <section className="px-4 py-10">
        <div className="max-w-5xl mx-auto grid gap-6 lg:grid-cols-[1.2fr,0.8fr]">
          {/* Left: Form */}
          <ClientFade>
            <Panel className="p-6 sm:p-8">
              <h2 className="sr-only">Contact Form</h2>
              <ContactForm />
              <p className="mt-4 text-xs text-brand-body/70">
                By submitting, you consent to being contacted regarding your inquiry. We respect your privacy and never share your information.
              </p>
            </Panel>
          </ClientFade>

          {/* Right: Details / Trust */}
          <ClientFade delay={0.08}>
            <div className="space-y-6">
              <Panel className="p-6 sm:p-8">
                <h2 className="text-xl font-serif font-bold text-brand-green">Contact details</h2>
                <ul className="mt-4 space-y-3 text-brand-green">
                  <li className="flex items-center justify-between gap-3">
                    <span className="font-semibold">Email</span>
                    <a className="underline hover:text-brand-blue transition" href="mailto:info@fannysamaniego.com">info@fannysamaniego.com</a>
                  </li>
                  <li className="flex items-center justify-between gap-3">
                    <span className="font-semibold">WhatsApp</span>
                    <a className="underline hover:text-brand-blue transition" href="https://wa.me/14167268420" target="_blank" rel="noopener noreferrer">
                      (416) 726-8420
                    </a>
                  </li>
                  <li className="flex items-center justify-between gap-3">
                    <span className="font-semibold">Phone</span>
                    <a className="underline hover:text-brand-blue transition" href="tel:14167268420">(416) 726-8420</a>
                  </li>
                </ul>

                <div className="mt-6 grid gap-3 sm:grid-cols-2 text-sm">
                  <div className="rounded-2xl border border-brand-gold/50 bg-white p-4">
                    <div className="text-brand-body/70">Office hours</div>
                    <div className="mt-1 font-medium text-brand-green">Mon–Fri · 9:00–17:00 (ET)</div>
                  </div>
                  <div className="rounded-2xl border border-brand-gold/50 bg-white p-4">
                    <div className="text-brand-body/70">Languages</div>
                    <div className="mt-1 font-medium text-brand-green">English · Español</div>
                  </div>
                </div>
              </Panel>

              <Panel className="p-6 sm:p-8">
                <h2 className="text-xl font-serif font-bold text-brand-green">Why book a call?</h2>
                <ul className="mt-3 space-y-2 text-brand-body">
                  <li className="flex gap-2"><span className="mt-1">•</span><span>Get a clear, actionable next step in 15–20 minutes.</span></li>
                  <li className="flex gap-2"><span className="mt-1">•</span><span>Discuss your goals around cash flow, debt, mortgages, or investments.</span></li>
                  <li className="flex gap-2"><span className="mt-1">•</span><span>Holistic, behaviour-aware guidance tailored to your situation.</span></li>
                </ul>
                <div className="mt-5 rounded-2xl border border-brand-gold/50 bg-brand-beige/60 p-4">
                  <p className="italic text-brand-green">“The blend of clarity, structure, and compassion helped us finally follow a plan that felt natural.”</p>
                  <p className="mt-1 text-sm text-brand-body/70">— Client, Toronto</p>
                </div>
                <div className="mt-6">
                  <Link href="/en/testimonials" className="inline-flex items-center rounded-full border bg-white px-4 py-2 text-sm font-medium text-brand-green border-brand-green hover:bg-brand-green hover:text-white transition">
                    Read client stories →
                  </Link>
                </div>
              </Panel>
            </div>
          </ClientFade>
        </div>
      </section>
    </main>
  );
}
