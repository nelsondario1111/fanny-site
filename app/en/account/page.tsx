export default function AccountEn() {
  return (
    <main className="mx-auto max-w-3xl p-6">
      <h1 className="text-3xl font-serif font-bold text-brand-green mb-2">Your account</h1>
      <p className="text-brand-body">This private area will hold your personal info, uploaded docs, and private tools/gifts.</p>

      <section className="mt-6 grid gap-4">
        <div className="rounded-xl border p-4">
          <h2 className="font-semibold text-brand-green">Private Tools & Gifts</h2>
          <p className="text-sm text-brand-body/80">Coming soon: your personalized downloads and trackers.</p>
        </div>
        <div className="rounded-xl border p-4">
          <h2 className="font-semibold text-brand-green">Documents</h2>
          <p className="text-sm text-brand-body/80">Upload center and secure sharing (to be added).</p>
        </div>
      </section>
    </main>
  );
}
