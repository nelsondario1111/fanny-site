export default function CuentaEs() {
  return (
    <main className="mx-auto max-w-3xl p-6">
      <h1 className="text-3xl font-serif font-bold text-brand-green mb-2">Tu cuenta</h1>
      <p className="text-brand-body">Aquí tendrás tu información personal, documentos y herramientas/regalos privados.</p>

      <section className="mt-6 grid gap-4">
        <div className="rounded-xl border p-4">
          <h2 className="font-semibold text-brand-green">Herramientas y Regalos</h2>
          <p className="text-sm text-brand-body/80">Próximamente: descargas y trackers personalizados.</p>
        </div>
        <div className="rounded-xl border p-4">
          <h2 className="font-semibold text-brand-green">Documentos</h2>
          <p className="text-sm text-brand-body/80">Centro de subida y compartición segura (por añadir).</p>
        </div>
      </section>
    </main>
  );
}
