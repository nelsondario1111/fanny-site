import ContactForm from "./ContactForm";

// --- SEO METADATA (Next.js 13/14/15 App Router) --- //
export const metadata = {
  title: "Contact | Fanny Samaniego Coaching – Schedule Your Free Discovery Call",
  description:
    "Get in touch with Fanny Samaniego for holistic financial guidance. Schedule a free discovery call, ask your questions, or connect via WhatsApp or email—English or Spanish.",
  openGraph: {
    title: "Contact | Fanny Samaniego Coaching",
    description:
      "Connect with Fanny for holistic financial coaching. Book a free call, send questions, or reach out directly on WhatsApp or email.",
    url: "https://fannysamaniego.com/en/contact",
    siteName: "Fanny Samaniego Coaching",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact | Fanny Samaniego Coaching",
    description: "Book a free call or send your message to Fanny Samaniego, holistic financial coach.",
  },
};

export default function Contact() {
  return (
    <main className="bg-brand-beige min-h-screen py-20">
      <section className="max-w-3xl mx-auto bg-white/90 rounded-3xl shadow-xl p-10 border border-brand-gold">
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-brand-green mb-8 text-center tracking-tight">
          Let&apos;s Connect and Transform Your Financial Life
        </h1>
        <p className="mb-10 text-brand-green text-center text-lg">
          I’d love to hear from you. Schedule a free discovery call, send your questions, or reach out directly on WhatsApp.
        </p>

        <ContactForm />

        {/* Direct Contact */}
        <div className="bg-white rounded-2xl p-6 shadow text-brand-green text-center space-y-2 border border-brand-gold/40">
          <div>
            <span className="font-semibold">Email:</span>{" "}
            <a
              className="underline hover:text-brand-blue transition"
              href="mailto:info@fannysamaniego.com"
            >
              info@fannysamaniego.com
            </a>
          </div>
          <div>
            <span className="font-semibold">WhatsApp:</span>{" "}
            <a
              className="underline hover:text-brand-blue transition"
              href="https://wa.me/14167268420"
              target="_blank"
              rel="noopener noreferrer"
            >
              (416) 726-8420
            </a>
          </div>
          <div>
            <span className="font-semibold">Phone:</span> (416) 726-8420
          </div>
        </div>
      </section>
    </main>
  );
}
