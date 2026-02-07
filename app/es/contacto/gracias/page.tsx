"use client";

import Link from "next/link";
import PageShell from "@/components/ui/PageShell";
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
    <PageShell title={headline} maxWidthClass="max-w-3xl">
      {pkg ? (
        <p className="text-center text-brand-body">
          Solicitado: <strong>{pkg}</strong>
        </p>
      ) : null}
      <p className="mt-2 text-center text-brand-body">
        Recibimos tu mensaje y pronto te compartiremos los próximos pasos.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Link
          href="/es/iniciar-sesion?redirect=/es/cuenta"
          className="inline-flex items-center rounded-full bg-brand-green px-6 py-3 font-semibold text-white transition hover:bg-brand-blue"
        >
          Crear mi cuenta
        </Link>
        <Link
          href="/es/herramientas"
          className="inline-flex items-center rounded-full border border-brand-green px-6 py-3 font-semibold text-brand-green transition hover:bg-brand-green hover:text-white"
        >
          Ver herramientas públicas
        </Link>
      </div>
    </PageShell>
  );
}
