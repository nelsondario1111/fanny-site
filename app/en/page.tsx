import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <main className="bg-brand-beige min-h-screen">
      {/* Hero Section */}
      <section
        className="relative min-h-[65vh] flex items-center justify-center overflow-hidden
        bg-[url('/nature.jpg')] bg-cover bg-center bg-no-repeat bg-fixed"
      >
        <div className="z-10 relative bg-white/80 backdrop-blur-lg p-12 rounded-3xl shadow-2xl text-center max-w-2xl mx-auto border border-brand-gold">
          <h1 className="font-serif font-extrabold text-5xl md:text-6xl text-brand-green mb-4 drop-shadow-md">
            Guidance by Invitation. Clarity by Design.
          </h1>
          <p className="font-sans text-2xl text-brand-blue mb-8">
            When you’re ready for holistic, heart-centered financial guidance, I’m here to walk alongside you—offering support that honors your unique journey.
          </p>
          <Link href="/en/contact" legacyBehavior>
            <a>
              <button className="px-10 py-4 rounded-full bg-gradient-to-r from-brand-green to-brand-blue text-white font-semibold text-lg shadow-xl hover:scale-105 hover:from-brand-gold hover:to-brand-green transition-all duration-200 border-none">
                <span className="mr-2">🤝</span>Request an Invitation
              </button>
            </a>
          </Link>
        </div>
      </section>

      {/* About Brief */}
      <section className="py-24 bg-white flex flex-col md:flex-row items-center max-w-6xl mx-auto gap-12">
        <div className="md:w-1/2 flex justify-center">
          <Image
            src="/fanny.jpg"
            alt="Fanny Samaniego"
            width={340}
            height={340}
            className="rounded-full shadow-xl object-cover border-4 border-brand-green"
            priority
          />
        </div>
        <div className="md:w-1/2 md:pl-12">
          <h2 className="font-serif text-3xl md:text-4xl text-brand-green mb-4 font-bold">
            Invited Wisdom, Shared with Heart
          </h2>
          <p className="font-sans text-lg md:text-xl text-brand-body mb-8 leading-relaxed">
            I’m Fanny Samaniego—a bilingual Financial Guide, Mortgage Agent, and lifelong student of life’s cycles. My deepest work happens in true partnership with those who are ready for change—not just in their finances, but in their entire approach to abundance.
            <br /><br />
            Over the years, I’ve learned that real prosperity is about aligning your numbers with your heart, your values, and your vision for the future. I work with a limited number of clients at a time, so each receives focused, present guidance and genuine support.
          </p>
          <Link href="/en/about" legacyBehavior>
            <a>
              <button className="px-8 py-3 bg-brand-blue text-white rounded-full font-semibold shadow hover:bg-brand-green hover:text-brand-blue border-2 border-brand-gold transition-all">
                Discover My Journey
              </button>
            </a>
          </Link>
        </div>
      </section>

      {/* Why I Work by Invitation */}
      <section className="py-10 bg-brand-beige max-w-3xl mx-auto text-center rounded-2xl shadow-sm border border-brand-green my-8">
        <h3 className="font-serif text-2xl text-brand-green font-bold mb-3">
          Why I Work by Invitation
        </h3>
        <p className="font-sans text-lg text-brand-body mb-2">
          After years of experience, I’ve found that the most meaningful results happen when there’s genuine connection and trust. That’s why I work by invitation: every client relationship begins with a real conversation, so we can both feel if it’s the right fit.
        </p>
        <p className="text-brand-body text-base mt-3 opacity-60">
          <em>(My approach is inspired by a philosophy that values deep recognition and the right timing. If you’re curious, feel free to ask me more!)</em>
        </p>
      </section>

      {/* Core Services */}
      <section className="py-24 bg-gradient-to-b from-brand-beige to-white">
        <h2 className="font-serif text-3xl md:text-4xl text-brand-green text-center mb-16 font-bold">
          Ways I Can Guide You
        </h2>
        <div className="flex flex-col md:flex-row gap-10 justify-center max-w-6xl mx-auto">
          <div className="flex-1 bg-white rounded-2xl p-10 shadow-lg text-center border border-brand-gold flex flex-col items-center">
            <div className="w-14 h-14 mb-4 rounded-full bg-brand-green flex items-center justify-center text-white text-2xl">
              💡
            </div>
            <h3 className="font-serif text-2xl text-brand-blue mb-2 font-bold">
              Financial Guidance
            </h3>
            <p className="font-sans text-brand-body">
              Find clarity and confidence through honest, heart-centered conversations—no formulas, no pressure, just support for your unique path.
            </p>
          </div>
          <div className="flex-1 bg-white rounded-2xl p-10 shadow-lg text-center border border-brand-gold flex flex-col items-center">
            <div className="w-14 h-14 mb-4 rounded-full bg-brand-blue flex items-center justify-center text-white text-2xl">
              🌱
            </div>
            <h3 className="font-serif text-2xl text-brand-blue mb-2 font-bold">
              Holistic Tax Planning
            </h3>
            <p className="font-sans text-brand-body">
              Explore practical strategies rooted in your values. Together, we’ll co-create a plan that brings you lasting peace of mind.
            </p>
          </div>
          <div className="flex-1 bg-white rounded-2xl p-10 shadow-lg text-center border border-brand-gold flex flex-col items-center">
            <div className="w-14 h-14 mb-4 rounded-full bg-brand-gold flex items-center justify-center text-brand-green text-2xl">
              🏡
            </div>
            <h3 className="font-serif text-2xl text-brand-blue mb-2 font-bold">
              Mortgage Guidance
            </h3>
            <p className="font-sans text-brand-body">
              Guidance for every kind of mortgage journey—including investment and multi-unit properties—always with holistic, personalized care.
            </p>
          </div>
        </div>
        <div className="mt-16 text-center">
          <Link href="/en/services" legacyBehavior>
            <a>
              <button className="px-10 py-4 bg-brand-gold text-brand-green rounded-full font-semibold shadow-lg hover:bg-brand-green hover:text-white border-2 border-brand-blue transition-all duration-200">
                Ways to Invite Me In
              </button>
            </a>
          </Link>
        </div>
      </section>

      {/* Kitchen Table */}
      <section className="py-14 bg-white max-w-4xl mx-auto rounded-2xl shadow border border-brand-green my-8 text-center">
        <h3 className="font-serif text-2xl text-brand-green font-bold mb-2">
          Kitchen Table Conversations
        </h3>
        <p className="font-sans text-lg text-brand-body mb-4">
          Join a small group session—just like gathering around a kitchen table—where we share stories, answer questions, and support each other’s journeys. If you’d like to be invited to a future circle, reach out below.
        </p>
        <Link href="/en/contact" legacyBehavior>
          <a>
            <button className="px-8 py-3 bg-brand-blue text-white rounded-full font-semibold shadow hover:bg-brand-gold hover:text-brand-green border-2 border-brand-blue transition-all">
              Request to Join a Circle
            </button>
          </a>
        </Link>
      </section>

      {/* Tools */}
      <section className="py-20 bg-white max-w-6xl mx-auto">
        <h2 className="font-serif text-3xl md:text-4xl text-brand-green text-center mb-12 font-bold">
          Tools to Nourish Your Financial Journey
        </h2>
        <div className="flex flex-col md:flex-row gap-10">
          <div className="flex-1 bg-brand-blue/10 rounded-2xl p-10 shadow text-center border border-brand-gold">
            <h3 className="font-serif text-2xl text-brand-blue mb-2 font-bold">
              Holistic Budget Planner
            </h3>
            <p className="font-sans text-brand-body mb-6">
              Create a budget that feels nourishing, not restrictive—aligned with your values and unique life.
            </p>
            <Link href="/en/budget-calculator" legacyBehavior>
              <a>
                <button className="px-8 py-3 bg-brand-green text-white rounded-full font-semibold hover:bg-brand-gold hover:text-brand-green border-2 border-brand-blue transition">
                  Try the Budget Tool
                </button>
              </a>
            </Link>
          </div>
          <div className="flex-1 bg-brand-blue/10 rounded-2xl p-10 shadow text-center border border-brand-gold">
            <h3 className="font-serif text-2xl text-brand-blue mb-2 font-bold">
              Mortgage Insights
            </h3>
            <p className="font-sans text-brand-body mb-6">
              Estimate your payments and explore holistic strategies for your property journey—whether buying, refinancing, or investing.
            </p>
            <Link href="/en/mortgage-calculator" legacyBehavior>
              <a>
                <button className="px-8 py-3 bg-brand-green text-white rounded-full font-semibold hover:bg-brand-gold hover:text-brand-green border-2 border-brand-blue transition">
                  Explore Mortgage Tools
                </button>
              </a>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-brand-beige">
        <div className="max-w-2xl mx-auto text-center">
          <blockquote className="font-serif italic text-2xl text-brand-blue mb-8 border-l-4 border-brand-gold pl-6">
            “Being invited to work with Fanny brought me so much more than numbers—it brought me a sense of peace, security, and trust in my path. She listens, guides, and sees what you need, even before you do.”
          </blockquote>
          <div className="font-sans font-semibold text-lg text-brand-green mb-8">
            – Maria & Carlos, Toronto
          </div>
          <Link href="/en/testimonials" legacyBehavior>
            <a>
              <button className="px-10 py-3 bg-brand-green text-white rounded-full font-semibold shadow-md hover:bg-brand-gold hover:text-brand-green border-2 border-brand-gold transition-all duration-200">
                Stories of Invitation & Guidance
              </button>
            </a>
          </Link>
        </div>
      </section>
    </main>
  );
}
