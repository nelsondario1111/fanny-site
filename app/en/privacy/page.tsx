// app/en/privacy/page.tsx
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Fanny Samaniego",
  description:
    "Privacy Policy for Fanny Samaniego — Holistic Financial Coach & Mortgage Agent in Toronto. Learn how we collect, use, and protect your information.",
};

export default function PrivacyPage() {
  return (
    <main id="main-content" className="flex-1 pt-20">
      {/* Hero */}
      <section className="bg-white">
        <div className="max-w-5xl mx-auto px-4 py-10 sm:py-14">
          <div className="mb-4">
            <nav aria-label="Breadcrumb" className="text-sm">
              <ol className="flex items-center gap-2 text-brand-blue/70">
                <li>
                  <Link href="/en" className="hover:text-brand-gold underline-offset-2 hover:underline">
                    Home
                  </Link>
                </li>
                <li aria-hidden="true">/</li>
                <li className="text-brand-blue">Privacy Policy</li>
              </ol>
            </nav>
          </div>

          <h1 className="font-brand text-3xl sm:text-4xl font-bold text-brand-blue tracking-tight">
            Privacy Policy
          </h1>
          <p className="mt-3 text-brand-blue/80">
            Last updated: <time dateTime="2025-08-10">August 10, 2025</time>
          </p>
          <p className="mt-6 text-brand-blue/90 leading-relaxed">
            Your privacy matters. This policy explains what data we collect, how we use it, and the choices you have.
            It applies to{" "}
            <span className="font-semibold">Fanny Samaniego — Holistic Financial Coach & Mortgage Agent in Toronto</span>{" "}
            (“we”, “us”, “our”) and all services and pages under{" "}
            <span className="whitespace-nowrap">/en</span> on this website.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="bg-brand-beige/30">
        <div className="max-w-5xl mx-auto px-4 py-10 sm:py-14 space-y-8">
          {/* Quick links / TOC */}
          <div className="bg-white border border-brand-gold/30 rounded-2xl shadow-sm p-6">
            <h2 className="font-brand text-xl text-brand-blue font-semibold mb-3">What’s inside</h2>
            <ul className="list-disc ml-5 space-y-1 text-brand-blue/90">
              <li><a className="hover:text-brand-gold underline-offset-2 hover:underline" href="#data-we-collect">Data we collect</a></li>
              <li><a className="hover:text-brand-gold underline-offset-2 hover:underline" href="#how-we-use-data">How we use your data</a></li>
              <li><a className="hover:text-brand-gold underline-offset-2 hover:underline" href="#legal-basis">Legal basis</a></li>
              <li><a className="hover:text-brand-gold underline-offset-2 hover:underline" href="#cookies">Cookies & analytics</a></li>
              <li><a className="hover:text-brand-gold underline-offset-2 hover:underline" href="#sharing">Sharing & disclosure</a></li>
              <li><a className="hover:text-brand-gold underline-offset-2 hover:underline" href="#retention">Data retention</a></li>
              <li><a className="hover:text-brand-gold underline-offset-2 hover:underline" href="#your-rights">Your rights</a></li>
              <li><a className="hover:text-brand-gold underline-offset-2 hover:underline" href="#security">Security</a></li>
              <li><a className="hover:text-brand-gold underline-offset-2 hover:underline" href="#children">Children’s privacy</a></li>
              <li><a className="hover:text-brand-gold underline-offset-2 hover:underline" href="#contact">Contact us</a></li>
            </ul>
          </div>

          {/* Data we collect */}
          <article id="data-we-collect" className="bg-white border border-brand-gold/30 rounded-2xl shadow-sm p-6">
            <h2 className="font-brand text-2xl text-brand-blue font-semibold mb-4">Data we collect</h2>
            <p className="text-brand-blue/90 mb-3">
              We collect the minimum information needed to provide our services and improve your experience:
            </p>
            <ul className="list-disc ml-5 space-y-2 text-brand-blue/90">
              <li>
                <span className="font-semibold">Contact details</span> (e.g., name, email, phone) when you book a call,
                contact us, or subscribe to the newsletter.
              </li>
              <li>
                <span className="font-semibold">Booking details</span> you share voluntarily for consultations or coaching
                sessions.
              </li>
              <li>
                <span className="font-semibold">Website usage</span> such as pages visited and interactions (via cookies or
                analytics; see below).
              </li>
              <li>
                <span className="font-semibold">Email engagement</span> like opens or link clicks if you subscribe to our
                newsletter, used to understand what’s helpful.
              </li>
            </ul>
            <p className="text-brand-blue/80 mt-3">
              We do <span className="font-semibold">not</span> sell personal data.
            </p>
          </article>

          {/* How we use */}
          <article id="how-we-use-data" className="bg-white border border-brand-gold/30 rounded-2xl shadow-sm p-6">
            <h2 className="font-brand text-2xl text-brand-blue font-semibold mb-4">How we use your data</h2>
            <ul className="list-disc ml-5 space-y-2 text-brand-blue/90">
              <li>To provide services you request (e.g., calls, coaching, resources).</li>
              <li>To respond to inquiries and customer support requests.</li>
              <li>To send newsletters or updates if you opt in (you can unsubscribe anytime).</li>
              <li>To maintain website security, performance, and improve content.</li>
              <li>To comply with legal, regulatory, and audit requirements.</li>
            </ul>
          </article>

          {/* Legal basis */}
          <article id="legal-basis" className="bg-white border border-brand-gold/30 rounded-2xl shadow-sm p-6">
            <h2 className="font-brand text-2xl text-brand-blue font-semibold mb-4">Legal basis</h2>
            <p className="text-brand-blue/90">
              Where applicable (e.g., GDPR), our processing relies on one or more of the following legal bases:
            </p>
            <ul className="list-disc ml-5 space-y-2 text-brand-blue/90 mt-2">
              <li><span className="font-semibold">Consent</span> (e.g., newsletter subscription).</li>
              <li><span className="font-semibold">Contract</span> (to deliver services you’ve asked for).</li>
              <li><span className="font-semibold">Legitimate interests</span> (e.g., site security, service improvement).</li>
              <li><span className="font-semibold">Legal obligation</span> (e.g., tax, compliance, record-keeping).</li>
            </ul>
          </article>

          {/* Cookies */}
          <article id="cookies" className="bg-white border border-brand-gold/30 rounded-2xl shadow-sm p-6">
            <h2 className="font-brand text-2xl text-brand-blue font-semibold mb-4">Cookies & analytics</h2>
            <p className="text-brand-blue/90 mb-3">
              We may use essential cookies to enable core functionality and optional analytics to understand usage and
              improve content. You can control cookies through your browser settings. If we use analytics, we strive to
              do so in a privacy-conscious way (e.g., IP masking where available).
            </p>
            <p className="text-brand-blue/90">
              Newsletter emails may use privacy-respecting tracking to measure engagement. You can opt out at any time by
              clicking “unsubscribe” in any email.
            </p>
          </article>

          {/* Sharing */}
          <article id="sharing" className="bg-white border border-brand-gold/30 rounded-2xl shadow-sm p-6">
            <h2 className="font-brand text-2xl text-brand-blue font-semibold mb-4">Sharing & disclosure</h2>
            <p className="text-brand-blue/90 mb-3">
              We share data only with trusted providers who help us operate our website and services (e.g., web hosting,
              email delivery) and only to the extent necessary to perform their work for us.
            </p>
            <ul className="list-disc ml-5 space-y-2 text-brand-blue/90">
              <li>Service providers are bound by confidentiality and data protection obligations.</li>
              <li>We may disclose information if required by law or to protect our rights and users.</li>
              <li>We do not sell personal information.</li>
            </ul>
          </article>

          {/* Retention */}
          <article id="retention" className="bg-white border border-brand-gold/30 rounded-2xl shadow-sm p-6">
            <h2 className="font-brand text-2xl text-brand-blue font-semibold mb-4">Data retention</h2>
            <p className="text-brand-blue/90">
              We keep data only as long as necessary for the purposes described in this policy (or as required by law).
              When no longer needed, we take steps to delete or anonymize it.
            </p>
          </article>

          {/* Rights */}
          <article id="your-rights" className="bg-white border border-brand-gold/30 rounded-2xl shadow-sm p-6">
            <h2 className="font-brand text-2xl text-brand-blue font-semibold mb-4">Your rights</h2>
            <p className="text-brand-blue/90">
              Depending on your location, you may have rights to access, correct, delete, or restrict the processing of
              your personal data, and to withdraw consent. To make a request, contact us using the details below. We’ll
              respond within a reasonable timeframe.
            </p>
          </article>

          {/* Security */}
          <article id="security" className="bg-white border border-brand-gold/30 rounded-2xl shadow-sm p-6">
            <h2 className="font-brand text-2xl text-brand-blue font-semibold mb-4">Security</h2>
            <p className="text-brand-blue/90">
              We use reasonable organizational and technical measures to protect your data. However, no method of
              transmission or storage is 100% secure, so we cannot guarantee absolute security.
            </p>
          </article>

          {/* Children */}
          <article id="children" className="bg-white border border-brand-gold/30 rounded-2xl shadow-sm p-6">
            <h2 className="font-brand text-2xl text-brand-blue font-semibold mb-4">Children’s privacy</h2>
            <p className="text-brand-blue/90">
              Our services are intended for adults. If you believe a child provided us personal information without
              consent, please contact us and we’ll take appropriate action.
            </p>
          </article>

          {/* Contact */}
          <article id="contact" className="bg-white border border-brand-gold/30 rounded-2xl shadow-sm p-6">
            <h2 className="font-brand text-2xl text-brand-blue font-semibold mb-4">Contact us</h2>
            <p className="text-brand-blue/90">
              For privacy questions or requests, contact us at{" "}
              <a href="mailto:info@fannysamaniego.com" className="underline hover:text-brand-gold">
                info@fannysamaniego.com
              </a>{" "}
              or visit the{" "}
              <Link href="/en/contact" className="underline hover:text-brand-gold">
                contact page
              </Link>
              .
            </p>
            <p className="text-brand-blue/80 mt-3">
              Mortgage License #M22000490 · Zolo Realty
            </p>
          </article>

          {/* Locale link */}
          <div className="text-center">
            <Link
              href="/es/privacidad"
              className="inline-block px-4 py-2 rounded-full border-2 border-brand-gold text-brand-blue hover:bg-brand-gold hover:text-brand-green transition font-bold"
            >
              Ver Política de Privacidad (ES)
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
