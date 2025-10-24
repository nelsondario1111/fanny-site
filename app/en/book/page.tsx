import Script from "next/script";

export default function BookPageEn() {
  return (
    <main className="bg-brand-beige min-h-screen fade-in pt-24 pb-16 px-4">
      <section className="max-w-5xl mx-auto bg-white rounded-3xl shadow-2xl border border-brand-gold p-6 md:p-10">
        <h1 className="text-3xl font-bold mb-2 text-center">Book a Free Consultation</h1>
        <p className="text-center mb-6">
          Pick a time that works for you—no back-and-forth emails.
        </p>

        {/* Calendly embed */}
        <div
          className="calendly-inline-widget"
          data-url="https://calendly.com/fannysamaniego/discovery-call?month=2025-10"
          style={{ minWidth: "320px", height: "700px" }}
        />

        {/* Calendly script */}
        <Script
          src="https://assets.calendly.com/assets/external/widget.js"
          strategy="lazyOnload"
        />
      </section>
    </main>
  );
}
