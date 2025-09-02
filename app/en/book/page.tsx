import Scheduler from "@/components/Scheduler";

export default function BookPageEn() {
  return (
    <main className="bg-brand-beige min-h-screen fade-in pt-24 pb-16 px-4">
      <section className="max-w-5xl mx-auto bg-white rounded-3xl shadow-2xl border border-brand-gold p-6 md:p-10">
        <Scheduler
          lang="en"
          tidycalPath="fanny-samaniego/intro-call-30" // <-- set your real TidyCal path
          title="Book a Free Consultation"
          subtitle="Pick a time that works for you—no back-and-forth emails."
        />
      </section>
    </main>
  );
}
