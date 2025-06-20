import ContactForm from "./ContactForm";

export default function Contact() {
  return (
    <main className="bg-brand-beige min-h-screen py-12 px-2">
      <section className="max-w-3xl mx-auto bg-white/90 rounded-3xl shadow-xl p-10 border border-brand-gold">
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-brand-green mb-8 text-center tracking-tight">
          Let&apos;s Connect and Transform Your Financial Life
        </h1>
         <div className="flex justify-center mb-8">
            <div className="w-20 border-t-4 border-brand-gold rounded-full"></div>
          </div>
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
