"use client";
import { useState } from "react";

export default function SubscribeForm({ language = "es" }: { language?: "es" | "en" }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  const placeholders = {
    es: {
      input: "Tu correo electrónico",
      button: "Suscribirme",
      success: "¡Gracias por suscribirte!",
      error: "Hubo un error al suscribirte. Intenta de nuevo.",
    },
    en: {
      input: "Your email address",
      button: "Subscribe",
      success: "Thank you for subscribing!",
      error: "There was an error subscribing. Please try again.",
    },
  };

  const t = placeholders[language];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    setError(null);

    const res = await fetch("/api/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    if (res.ok) {
      setStatus("success");
      setEmail("");
    } else {
      const data = await res.json();
      setError(data.error || t.error);
      setStatus("error");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-sm mx-auto">
      <input
        className="p-3 rounded-xl border border-brand-green/30"
        type="email"
        placeholder={t.input}
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
      />
      {status === "success" && (
        <div className="text-green-700 bg-green-100 rounded-xl p-3 text-center">
          {t.success}
        </div>
      )}
      {status === "error" && (
        <div className="text-red-700 bg-red-100 rounded-xl p-3 text-center">
          {error}
        </div>
      )}
      <button
        type="submit"
        disabled={status === "sending"}
        className="px-6 py-3 bg-brand-gold text-brand-green rounded-full font-bold"
      >
        {status === "sending" ? (language === "es" ? "Enviando..." : "Sending...") : t.button}
      </button>
    </form>
  );
}
