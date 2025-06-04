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

        {/* Contact Form */}
        <form className="bg-brand-beige/70 rounded-2xl p-8 mb-12 shadow-lg border border-brand-gold/40 space-y-5 max-w-xl mx-auto">
          <div>
            <label className="block font-semibold mb-1 text-brand-blue" htmlFor="name">Name</label>
            <input className="w-full p-3 rounded-xl border border-brand-green/30 bg-white focus:border-brand-gold focus:ring-2 focus:ring-brand-gold transition text-brand-green" type="text" id="name" name="name" autoComplete="off" />
          </div>
          <div>
            <label className="block font-semibold mb-1 text-brand-blue" htmlFor="email">Email</label>
            <input className="w-full p-3 rounded-xl border border-brand-green/30 bg-white focus:border-brand-gold focus:ring-2 focus:ring-brand-gold transition text-brand-green" type="email" id="email" name="email" autoComplete="off" />
          </div>
          <div>
            <label className="block font-semibold mb-1 text-brand-blue" htmlFor="phone">Phone</label>
            <input className="w-full p-3 rounded-xl border border-brand-green/30 bg-white focus:border-brand-gold focus:ring-2 focus:ring-brand-gold transition text-brand-green" type="tel" id="phone" name="phone" autoComplete="off" />
          </div>
          <div>
            <label className="block font-semibold mb-1 text-brand-blue" htmlFor="message">Message</label>
            <textarea className="w-full p-3 rounded-xl border border-brand-green/30 bg-white focus:border-brand-gold focus:ring-2 focus:ring-brand-gold transition text-brand-green" id="message" name="message" rows={4}></textarea>
          </div>
          <button type="submit" className="w-full px-8 py-3 bg-brand-gold text-brand-green rounded-full font-serif font-bold shadow-lg hover:bg-brand-blue hover:text-white transition text-lg">
            Schedule Your Free Call Now
          </button>
        </form>

        {/* Direct Contact */}
        <div className="bg-white rounded-2xl p-6 shadow text-brand-green text-center space-y-2 border border-brand-gold/40">
          <div>
            <span className="font-semibold">Email:</span>{" "}
            <a className="underline hover:text-brand-blue transition" href="mailto:fanny.samaniego@zolo.ca">
              fanny.samaniego@zolo.ca
            </a>
          </div>
          <div>
            <span className="font-semibold">WhatsApp:</span>{" "}
            <a className="underline hover:text-brand-blue transition" href="https://wa.me/14167268420" target="_blank" rel="noopener noreferrer">
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
