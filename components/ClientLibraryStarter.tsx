"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";

type Lang = "en" | "es";

type ClientLibraryStarterProps = {
  lang: Lang;
};

const STORAGE_KEY = "fs-client-library-unlocked";
const DEFAULT_CODE = "fanny-client";

export default function ClientLibraryStarter({ lang }: ClientLibraryStarterProps) {
  const isEn = lang === "en";
  const expectedCode = (process.env.NEXT_PUBLIC_CLIENT_LIBRARY_ACCESS_CODE || DEFAULT_CODE)
    .trim()
    .toLowerCase();
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [unlocked, setUnlocked] = useState(false);

  useEffect(() => {
    const existing = sessionStorage.getItem(`${STORAGE_KEY}-${lang}`);
    if (existing === "1") setUnlocked(true);
  }, [lang]);

  const onUnlock = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (code.trim().toLowerCase() === expectedCode) {
      setUnlocked(true);
      setError("");
      sessionStorage.setItem(`${STORAGE_KEY}-${lang}`, "1");
      return;
    }
    setError(
      isEn
        ? "Access code does not match. Use the one shared in your onboarding email."
        : "El codigo de acceso no coincide. Usa el codigo compartido en tu correo de onboarding."
    );
  };

  const paths = isEn
    ? {
        home: "/en",
        contact: "/en/contact?intent=question",
        checklist1: "/en/tools/newcomer-checklist",
        checklist2: "/en/tools/mortgage-readiness",
        checklist3: "/en/tools/tax-prep",
        intake: "/en/contact?intent=package",
      }
    : {
        home: "/es",
        contact: "/es/contacto?intent=pregunta",
        checklist1: "/es/herramientas/lista-recien-llegados",
        checklist2: "/es/herramientas/preparacion-hipoteca",
        checklist3: "/es/herramientas/preparacion-impuestos",
        intake: "/es/contacto?intent=package",
      };

  return (
    <main className="min-h-screen bg-white py-12">
      <section className="max-w-5xl mx-auto px-4">
        <div className="rounded-3xl border border-brand-gold/40 bg-brand-green/5 p-6 md:p-8">
          <h1 className="font-brand text-3xl md:text-4xl font-semibold tracking-tight text-brand-green">
            {isEn ? "Client Library" : "Biblioteca de Clientes"}
          </h1>
          <p className="mt-3 max-w-3xl text-brand-blue/90">
            {isEn
              ? "A lightweight client hub for checklists, document guidance, timelines, and intake links. This starter gate is intentionally simple while full account access is being built."
              : "Un hub ligero para clientes con checklists, guia documental, tiempos esperados y enlaces de intake. Esta puerta de acceso es simple mientras construimos el portal completo."}
          </p>
        </div>

        {!unlocked ? (
          <section className="mt-8 max-w-2xl rounded-3xl border border-brand-gold/40 bg-white p-6 shadow-sm">
            <h2 className="font-brand text-2xl text-brand-green">
              {isEn ? "Enter Access Code" : "Ingresar codigo de acceso"}
            </h2>
            <p className="mt-2 text-sm text-brand-blue/80">
              {isEn
                ? "Use the code from your onboarding email. If you need help, send a message and we will re-share it."
                : "Usa el codigo compartido en tu correo de onboarding. Si lo necesitas, escribenos y lo reenviamos."}
            </p>
            <form className="mt-4 flex flex-col gap-3 sm:flex-row" onSubmit={onUnlock}>
              <input
                type="password"
                value={code}
                onChange={(event) => setCode(event.target.value)}
                className="w-full rounded-xl border border-brand-gold/50 px-4 py-2.5 text-brand-blue focus:outline-none focus:ring-2 focus:ring-brand-gold"
                placeholder={isEn ? "Access code" : "Codigo de acceso"}
                aria-label={isEn ? "Client library access code" : "Codigo de acceso de biblioteca de clientes"}
              />
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-full border border-brand-green/20 bg-brand-green px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-gold hover:text-brand-green focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold"
              >
                {isEn ? "Unlock" : "Desbloquear"}
              </button>
            </form>
            {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
          </section>
        ) : (
          <section className="mt-8 grid gap-6 md:grid-cols-2">
            <article className="rounded-3xl border border-brand-gold/40 bg-white p-6 shadow-sm">
              <h2 className="font-brand text-2xl text-brand-green">
                {isEn ? "Checklist Library" : "Biblioteca de checklists"}
              </h2>
              <ul className="mt-4 list-disc space-y-2 pl-5 text-brand-blue/90">
                <li>
                  <Link href={paths.checklist1} className="underline underline-offset-4 hover:text-brand-green">
                    {isEn ? "Newcomer Checklist" : "Checklist para recien llegados"}
                  </Link>
                </li>
                <li>
                  <Link href={paths.checklist2} className="underline underline-offset-4 hover:text-brand-green">
                    {isEn ? "Mortgage Readiness Checklist" : "Checklist de preparacion hipotecaria"}
                  </Link>
                </li>
                <li>
                  <Link href={paths.checklist3} className="underline underline-offset-4 hover:text-brand-green">
                    {isEn ? "Tax Season Prep Checklist" : "Checklist de preparacion de impuestos"}
                  </Link>
                </li>
              </ul>
            </article>

            <article className="rounded-3xl border border-brand-gold/40 bg-white p-6 shadow-sm">
              <h2 className="font-brand text-2xl text-brand-green">
                {isEn ? "Document Upload Guidance" : "Guia para carga de documentos"}
              </h2>
              <ul className="mt-4 list-disc space-y-2 pl-5 text-brand-blue/90">
                <li>{isEn ? "Use clear photos or PDFs only." : "Usa fotos claras o PDF solamente."}</li>
                <li>{isEn ? "Label files with date + topic (YYYY-MM-DD-topic)." : "Nombra archivos con fecha + tema (AAAA-MM-DD-tema)."}</li>
                <li>{isEn ? "Do not send SIN or banking passwords by chat." : "No compartas SIN o contrasenas bancarias por chat."}</li>
                <li>{isEn ? "Use secure links provided in your intake email." : "Usa los enlaces seguros enviados en tu correo de intake."}</li>
              </ul>
            </article>

            <article className="rounded-3xl border border-brand-gold/40 bg-white p-6 shadow-sm">
              <h2 className="font-brand text-2xl text-brand-green">
                {isEn ? "What to Expect" : "Que esperar"}
              </h2>
              <ol className="mt-4 list-decimal space-y-2 pl-5 text-brand-blue/90">
                <li>{isEn ? "Discovery call + scope confirmation." : "Llamada inicial + confirmacion de alcance."}</li>
                <li>{isEn ? "Intake checklist + secure document exchange." : "Checklist de intake + intercambio seguro de documentos."}</li>
                <li>{isEn ? "Strategy walkthrough + written next steps." : "Revision estrategica + siguientes pasos por escrito."}</li>
              </ol>
            </article>

            <article className="rounded-3xl border border-brand-gold/40 bg-white p-6 shadow-sm">
              <h2 className="font-brand text-2xl text-brand-green">
                {isEn ? "Intake & Support Links" : "Enlaces de intake y soporte"}
              </h2>
              <div className="mt-4 flex flex-wrap gap-2">
                <Link
                  href={paths.intake}
                  className="inline-flex items-center justify-center rounded-full border border-brand-green/20 bg-brand-green px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-gold hover:text-brand-green focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold"
                >
                  {isEn ? "Open intake form" : "Abrir formulario de intake"}
                </Link>
                <Link
                  href={paths.contact}
                  className="inline-flex items-center justify-center rounded-full border border-brand-blue/40 bg-white px-4 py-2 text-sm font-semibold text-brand-blue transition hover:bg-brand-blue hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue/40"
                >
                  {isEn ? "Ask a question" : "Hacer una pregunta"}
                </Link>
                <Link
                  href={paths.home}
                  className="inline-flex items-center justify-center rounded-full border border-brand-gold/40 bg-white px-4 py-2 text-sm font-semibold text-brand-green transition hover:bg-brand-gold hover:text-brand-green focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold"
                >
                  {isEn ? "Back to home" : "Volver al inicio"}
                </Link>
              </div>
            </article>
          </section>
        )}
      </section>
    </main>
  );
}
