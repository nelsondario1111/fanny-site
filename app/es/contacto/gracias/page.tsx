"use client";

import { useSearchParams } from "next/navigation";

function usePlainSearch() {
  const sp = useSearchParams();
  // Re-materialize the proxy into a plain URLSearchParams
  return new URLSearchParams(sp?.toString() ?? "");
}

const safeDecode = (v: string | null) => {
  try { return v ? decodeURIComponent(v) : undefined; }
  catch { return v ?? undefined; }
};

export default function GraciasEs() {
  const ps = usePlainSearch();
  const intent = (ps.get("intent") ?? "consult") as
    | "consult"
    | "preapproval"
    | "question"
    | "package";
  const pkg = safeDecode(ps.get("package"));

  const headline =
    intent === "preapproval" ? "¡Gracias! — iniciaremos tu preaprobación"
    : intent === "question" ? "¡Gracias! — te responderemos pronto"
    : intent === "package" ? "¡Gracias! — te contactaremos sobre tu paquete"
    : "¡Gracias! — confirmaremos tu llamada de descubrimiento";

  return (
    <main className="mx-auto max-w-3xl p-8 text-center">
      <h1 className="text-3xl font-serif font-bold text-brand-green">{headline}</h1>
      {pkg && <p className="mt-2 text-brand-body">Solicitado: <b>{pkg}</b></p>}
      <p className="mt-4 text-brand-body">
        Hemos recibido tu mensaje y te enviaremos los próximos pasos. Si deseas adelantarte,
        crea tu cuenta para acceder a herramientas privadas.
      </p>

      <div className="mt-6 flex gap-3 justify-center">
        <a
          href="/es/iniciar-sesion?redirect=/es/cuenta"
          className="px-6 py-3 rounded-full bg-brand-green text-white"
        >
          Crear mi cuenta
        </a>
        <a
          href="/es/herramientas"
          className="px-6 py-3 rounded-full border border-brand-green text-brand-green hover:bg-brand-green hover:text-white transition"
        >
          Ver herramientas públicas
        </a>
      </div>
    </main>
  );
}
