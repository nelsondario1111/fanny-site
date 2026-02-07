import PageShell from "@/components/ui/PageShell";

export default function AccountEn() {
  return (
    <PageShell
      title="Your Account"
      subtitle="This private area is where your personal documents, tools, and next steps will live."
      center={false}
      maxWidthClass="max-w-4xl"
    >
      <section className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-brand-gold/30 bg-white p-5 shadow-sm">
          <h2 className="font-serif text-xl font-semibold text-brand-green">
            Private Tools & Gifts
          </h2>
          <p className="mt-2 text-sm text-brand-body/80">
            Coming soon: your personalized downloads, trackers, and guided
            resources.
          </p>
        </div>
        <div className="rounded-2xl border border-brand-gold/30 bg-white p-5 shadow-sm">
          <h2 className="font-serif text-xl font-semibold text-brand-green">
            Documents
          </h2>
          <p className="mt-2 text-sm text-brand-body/80">
            Secure uploads and private document sharing will be available here.
          </p>
        </div>
      </section>
    </PageShell>
  );
}
