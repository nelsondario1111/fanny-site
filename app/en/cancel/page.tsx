export default function CancelPage() {
  return (
    <main className="bg-brand-beige min-h-screen flex items-center justify-center">
      <div className="bg-white/80 p-10 rounded-3xl shadow-xl border border-brand-gold max-w-xl text-center">
        <h1 className="text-3xl font-serif text-brand-green font-bold mb-4">Transaction Canceled</h1>
        <p className="text-brand-body mb-6">
          Your payment was canceled or not completed. No worries! You can try again or contact us if you have questions.
        </p>
        <a
          href="/en/investment"
          className="inline-block px-6 py-3 bg-brand-gold text-brand-green rounded-full font-semibold shadow hover:bg-brand-blue hover:text-white transition"
        >
          Return to Packages
        </a>
      </div>
    </main>
  );
}
