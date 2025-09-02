// app/es/reservar/page.tsx
import Scheduler from "@/components/Scheduler";

export default function BookPageEs() {
  return (
    <main className="bg-brand-beige min-h-screen fade-in pt-24 pb-16 px-4">
      <section className="max-w-5xl mx-auto bg-white rounded-3xl shadow-2xl border border-brand-gold p-6 md:p-10">
        <Scheduler
          lang="es"
          tidycalPath="fanny-samaniego/intro-call-30" // usa tu path real
          title="Reserva una Consulta Gratis"
          subtitle="Elige un horario que te acomode—sin correos de ida y vuelta."
        />
      </section>
    </main>
  );
}
