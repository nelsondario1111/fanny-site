export default function ExitoPage() {
  return (
    <main className="bg-brand-beige min-h-screen flex items-center justify-center">
      <div className="bg-white/90 p-10 rounded-3xl shadow-xl border border-brand-gold max-w-xl text-center">
        <h1 className="text-3xl font-serif text-brand-green font-bold mb-4">¡Gracias por tu Pago!</h1>
        <p className="text-brand-body mb-6">
          Tu pago fue exitoso. Recibirás una confirmación y recibo por correo electrónico.
          <br />
          ¡Esperamos acompañarte en tu camino hacia el bienestar financiero!
        </p>
        <a
          href="/es"
          className="inline-block px-6 py-3 bg-brand-gold text-brand-green rounded-full font-semibold shadow hover:bg-brand-blue hover:text-white transition"
        >
          Volver al Inicio
        </a>
      </div>
    </main>
  );
}
