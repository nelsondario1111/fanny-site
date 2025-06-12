import Link from "next/link";

export default function Testimonials() {
  return (
    <main className="bg-brand-beige min-h-screen py-20">
      <section className="max-w-3xl mx-auto bg-white/90 rounded-3xl shadow-xl p-10 border border-brand-gold">
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-brand-green mb-8 text-center tracking-tight">
          Stories of Financial Transformation
        </h1>
        <div className="flex justify-center mb-10">
          <div className="w-20 border-t-4 border-brand-gold rounded-full"></div>
        </div>

        <section className="space-y-8 mb-12">
          {/* Testimonial 1 */}
          <blockquote className="border-l-4 border-brand-green pl-6 py-4 bg-brand-beige/80 rounded-2xl shadow-lg">
            <p className="italic mb-2 text-lg md:text-xl text-brand-green">
              “Fanny’s thoughtful approach helped us see our finances clearly for the first time. We purchased our first investment property confidently, knowing every step was aligned with our values and long-term goals. Highly recommended!”
            </p>
            <div className="font-semibold text-brand-green">— Luisa & Javier, Toronto</div>
          </blockquote>
          {/* Testimonial 2 */}
          <blockquote className="border-l-4 border-brand-green pl-6 py-4 bg-brand-beige/80 rounded-2xl shadow-lg">
            <p className="italic mb-2 text-lg md:text-xl text-brand-green">
              “Working with Fanny transformed our financial anxiety into clarity and confidence. She combines expertise and compassion in a truly unique way.”
            </p>
            <div className="font-semibold text-brand-green">— Maria & Carlos, Toronto</div>
          </blockquote>
        </section>

        <div className="text-center mt-10">
          <Link href="/contact">
            <button className="px-10 py-4 bg-brand-gold text-brand-green font-serif font-bold rounded-full shadow-lg hover:bg-brand-blue hover:text-white transition text-lg tracking-wide">
              Schedule Your Own Discovery Call
            </button>
          </Link>
        </div>
      </section>
    </main>
  );
}
