"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

type Locale = "en" | "es";

const COPY: Record<
  Locale,
  {
    firstNameLabel: string;
    firstNamePlaceholder: string;
    emailLabel: string;
    emailPlaceholder: string;
    consentLabel: React.ReactNode;
    submit: string;
    submitting: string;
    error: string;
    missingEmail: string;
    missingConsent: string;
  }
> = {
  en: {
    firstNameLabel: "First name (optional)",
    firstNamePlaceholder: "Your first name",
    emailLabel: "Email",
    emailPlaceholder: "Enter your email…",
    consentLabel: (
      <>
        I agree to receive occasional emails from Fanny Samaniego (you can unsubscribe anytime).
        We’ll never sell your data. See our{" "}
        <a className="underline" href="/en/privacy" target="_blank" rel="noopener noreferrer">
          Privacy Policy
        </a>.
      </>
    ),
    submit: "Subscribe",
    submitting: "Submitting…",
    error: "Something went wrong. Please try again.",
    missingEmail: "Email is required.",
    missingConsent: "Please accept consent.",
  },
  es: {
    firstNameLabel: "Nombre (opcional)",
    firstNamePlaceholder: "Tu nombre",
    emailLabel: "Correo electrónico",
    emailPlaceholder: "Ingresa tu correo…",
    consentLabel: (
      <>
        Acepto recibir correos ocasionales de Fanny Samaniego (puedo darme de baja en cualquier momento).
        Nunca venderemos tus datos. Consulta nuestra{" "}
        <a className="underline" href="/es/privacidad" target="_blank" rel="noopener noreferrer">
          Política de privacidad
        </a>.
      </>
    ),
    submit: "Suscribirme",
    submitting: "Enviando…",
    error: "Algo salió mal. Inténtalo de nuevo.",
    missingEmail: "El correo es obligatorio.",
    missingConsent: "Por favor acepta el consentimiento.",
  },
};

export default function SubscribeForm({
  locale = "en" as Locale,
  groupId,
}: {
  locale?: Locale;
  groupId?: string;
}) {
  const t = COPY[locale];
  const router = useRouter();

  const [firstName, setFirstName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [consent, setConsent] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [message, setMessage] = React.useState<{ type: "ok" | "err"; text: string } | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);

    if (!email) {
      setMessage({ type: "err", text: t.missingEmail });
      return;
    }
    if (!consent) {
      setMessage({ type: "err", text: t.missingConsent });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          name: firstName || undefined,
          groupId,
          locale,
          sourcePath: typeof window !== "undefined" ? window.location.pathname : undefined,
        }),
      });

      if (!res.ok) throw new Error(await res.text());

      // clear fields before redirect
      setFirstName("");
      setEmail("");
      setConsent(false);

      // redirect
      router.push(locale === "es" ? "/es/gracias" : "/en/thank-you");
    } catch {
      setMessage({ type: "err", text: t.error });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {/* First name (optional) */}
      <div>
        <label className="block text-sm font-medium text-brand-blue/80">{t.firstNameLabel}</label>
        <input
          type="text"
          inputMode="text"
          autoComplete="given-name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          placeholder={t.firstNamePlaceholder}
          className="mt-1 w-full rounded-2xl border border-brand-green/30 bg-white px-4 py-3 text-sm shadow-sm outline-none focus:ring-2 focus:ring-brand-gold"
        />
      </div>

      {/* Email (required) */}
      <div>
        <label className="block text-sm font-medium text-brand-blue/80">{t.emailLabel}</label>
        <input
          required
          type="email"
          inputMode="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t.emailPlaceholder}
          className="mt-1 w-full rounded-2xl border border-brand-green/30 bg-white px-4 py-3 text-sm shadow-sm outline-none focus:ring-2 focus:ring-brand-gold"
        />
        <p className="mt-1 text-xs text-brand-blue/70">
          {locale === "en"
            ? "We’ll only use your email to send the newsletter."
            : "Solo usaremos tu correo para enviarte el boletín."}
        </p>
      </div>

      {/* Consent (required) */}
      <label className="flex items-start gap-2 text-xs text-brand-blue/80">
        <input
          required
          type="checkbox"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          className="mt-1 h-4 w-4 rounded border-brand-green/40 text-brand-green focus:ring-brand-gold"
        />
        <span>{t.consentLabel}</span>
      </label>

      {/* Submit */}
      <div className="pt-1">
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-sans font-bold bg-brand-green text-white hover:opacity-90 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold min-h-[44px] disabled:opacity-60"
        >
          {loading ? t.submitting : t.submit}
        </button>
      </div>

      {/* Message */}
      {message && (
        <div
          className={[
            "text-sm rounded-xl px-3 py-2",
            message.type === "ok"
              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
              : "bg-rose-50 text-rose-700 border border-rose-200",
          ].join(" ")}
        >
          {message.text}
        </div>
      )}
    </form>
  );
}
