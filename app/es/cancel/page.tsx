export default function CancelarPage() {
  return (
    <main className="bg-brand-beige min-h-screen flex items-center justify-center">
      <div className="bg-white/90 p-10 rounded-3xl shadow-xl border border-brand-gold max-w-xl text-center">
        <h1 className="text-3xl font-serif text-brand-green font-bold mb-4">Transacción Cancelada</h1>
        <p className="text-brand-body mb-6">
          Tu pago fue cancelado o no se completó. ¡No hay problema! Puedes intentarlo de nuevo o contactarnos si tienes preguntas.
        </p>
        <a
          href="/es/inversion"
          className="inline-block px-6 py-3 bg-brand-gold text-brand-green rounded-full font-semibold shadow hover:bg-brand-blue hover:text-white transition"
        >
          Volver a Paquetes
        </a>
      </div>
    </main>
  );
}
