"use client";

import { useState } from "react";

export default function LeadCaptureForm({
  lang = "en",
}: {
  lang?: "en" | "es";
}) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle"
  );
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setMessage("");

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Unknown error");

      setStatus("success");
      setMessage(
        lang === "es"
          ? "✅ ¡Gracias! Tu información fue enviada correctamente."
          : "✅ Thank you! Your information has been submitted successfully."
      );
      setEmail("");
      setName("");
    } catch (err: any) {
      setStatus("error");
      setMessage(
        lang === "es"
          ? "❌ Hubo un error al enviar el formulario. Intenta nuevamente."
          : "❌ There was an issue submitting your form. Please try again."
      );
    } finally {
      setStatus("idle");
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto mb-10 space-y-4 text-left"
    >
      <label className="block">
        <span className="text-gray-700 font-medium">
          {lang === "es" ? "Nombre" : "Name"}
        </span>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          placeholder={lang === "es" ? "Tu nombre" : "Your name"}
          className="mt-1 w-full rounded-md border border-gray-300 px-4 py-2 focus:border-brand-green focus:ring-1 focus:ring-brand-green"
        />
      </label>

      <label className="block">
        <span className="text-gray-700 font-medium">
          {lang === "es" ? "Correo electrónico" : "Email"}
        </span>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder={
            lang === "es" ? "tu@correo.com" : "you@example.com"
          }
          className="mt-1 w-full rounded-md border border-gray-300 px-4 py-2 focus:border-brand-green focus:ring-1 focus:ring-brand-green"
        />
      </label>

      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full rounded-full bg-brand-green text-white py-2.5 font-semibold hover:opacity-90 transition disabled:opacity-60"
      >
        {status === "loading"
          ? lang === "es"
            ? "Enviando..."
            : "Submitting..."
          : lang === "es"
          ? "Enviar"
          : "Submit"}
      </button>

      {message && (
        <p
          className={`text-sm ${
            status === "error" ? "text-red-600" : "text-brand-green"
          }`}
        >
          {message}
        </p>
      )}
    </form>
  );
}
