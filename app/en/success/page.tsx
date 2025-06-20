export default function SuccessPage() {
  return (
    <main className="bg-brand-beige min-h-screen flex items-center justify-center">
      <div className="bg-white/90 p-10 rounded-3xl shadow-xl border border-brand-gold max-w-xl text-center">
        <h1 className="text-3xl font-serif text-brand-green font-bold mb-4">Thank You for Your Payment!</h1>
        <p className="text-brand-body mb-6">
          Your payment was successful. A confirmation and receipt will be sent to your email. 
          <br />
          We look forward to supporting your financial wellness journey!
        </p>
        <a
          href="/en"
          className="inline-block px-6 py-3 bg-brand-gold text-brand-green rounded-full font-semibold shadow hover:bg-brand-blue hover:text-white transition"
        >
          Return Home
        </a>
      </div>
    </main>
  );
}
