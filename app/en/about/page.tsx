import Image from "next/image";
import Link from "next/link";

export default function About() {
  return (
    <main className="bg-brand-beige min-h-screen py-12 px-2">
      {/* Hero/About Section */}
      <section className="max-w-5xl mx-auto bg-white/90 rounded-3xl shadow-xl p-10 flex flex-col md:flex-row items-center gap-10 mb-20 border border-brand-gold">
        {/* Portrait */}
        <div className="flex-shrink-0 flex justify-center">
          <Image
            src="/fanny-portrait.jpg"
            alt="Portrait of Fanny Samaniego, Holistic Financial Advisor and Coach in Toronto"
            width={260}
            height={340}
            className="rounded-3xl shadow-lg object-cover border-4 border-brand-gold"
            priority
          />
        </div>
        {/* Bio */}
        <div className="flex-1 md:pl-8">
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6 text-brand-green tracking-tight flex items-center gap-3">
            
            About Fanny: Holistic Financial Guidance by Invitation
          </h1>
           <div className="flex justify-center mb-8">
          <div className="w-20 border-t-4 border-brand-gold rounded-full"></div>
        </div>
          <p className="mb-4 text-lg md:text-xl text-brand-blue/90 leading-relaxed">
            My journey—from tax auditor to holistic financial advisor and coach—has taught me that prosperity is about more than numbers. It’s about clarity, compassion, and aligning every step with your deepest values and your vision for life.
          </p>
          <p className="mb-4 text-lg md:text-xl text-brand-body leading-relaxed">
            As a bilingual Financial Advisor, Holistic Coach, and Mortgage Agent, I help individuals and families discover financial clarity, inner calm, and empowerment in their decisions. My approach is rooted in deep listening, tailored strategies, and respect for your unique story—offered in both English and Spanish.
          </p>
          <p className="mb-4 text-lg md:text-xl text-brand-body leading-relaxed">
            The best results come from authentic connection and mutual fit. That’s why I work with a small number of clients at a time, and only when there’s true resonance. If you feel drawn to my approach, I warmly invite you to reach out and start a conversation.
          </p>
        </div>
      </section>

      {/* Commitment Section */}
      <section className="max-w-4xl mx-auto mb-16">
        <h2 className="text-2xl md:text-3xl font-serif font-semibold text-brand-blue mb-5 text-center flex items-center gap-2 justify-center">
          <span aria-hidden="true">💎</span>
          My Commitment to You
        </h2>
        <ul className="list-disc ml-8 md:ml-12 text-lg md:text-xl text-brand-green space-y-3 text-left">
          <li>Presence, integrity, and transparency in every interaction.</li>
          <li>Compassionate guidance—honoring your unique story and needs.</li>
          <li>Holistic strategies for mindful, sustainable financial well-being.</li>
          <li>
            <span className="text-brand-blue">
              An invitation-based practice, so our work is always built on real connection and mutual respect.
            </span>
          </li>
        </ul>
      </section>

      {/* Philosophy Mini-FAQ */}
      <section className="max-w-3xl mx-auto mb-12 bg-brand-beige rounded-2xl shadow p-8 border border-brand-green text-center">
        <h3 className="font-serif text-xl text-brand-green font-bold mb-2 flex items-center gap-2 justify-center">
          <span aria-hidden="true">💬</span>
          Why “Guidance by Invitation”?
        </h3>
        <p className="font-sans text-lg text-brand-body">
          Over years of guiding others, I’ve found the most meaningful work happens when both client and guide feel a natural connection. I focus on serving those truly ready for holistic support. That’s why I invite you to start with a conversation—no obligation, just openness—to see if we’re a great fit.
        </p>
        <p className="text-brand-body text-base mt-3 opacity-70">
          <em>
            (Curious? My “invitation” philosophy is inspired by Human Design, but always rooted in genuine human connection.)
          </em>
        </p>
      </section>

      {/* Call to Action */}
      <section className="text-center">
        <Link href="/en/contact">
          <button
            type="button"
            className="px-10 py-4 bg-brand-gold text-brand-green font-serif font-bold rounded-full shadow-lg hover:bg-brand-blue hover:text-white transition tracking-wide text-lg focus:outline-none focus:ring-2 focus:ring-brand-gold"
            aria-label="Request an Invitation to Connect"
          >
            Request an Invitation to Connect
          </button>
        </Link>
      </section>
    </main>
  );
}
