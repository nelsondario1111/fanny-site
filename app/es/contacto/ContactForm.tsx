"use client";
import React, { useState } from "react";

export default function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    setError(null);

    const form = e.currentTarget;
    const formData = {
      name: (form.elements.namedItem("name") as HTMLInputElement).value,
      email: (form.elements.namedItem("email") as HTMLInputElement).value,
      phone: (form.elements.namedItem("phone") as HTMLInputElement).value,
      service: (form.elements.namedItem("servicio") as HTMLSelectElement).value,
      message: (form.elements.namedItem("message") as HTMLTextAreaElement).value,
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setStatus("success");
        form.reset();
      } else {
        const { error } = await res.json();
        setStatus("error");
        setError(error || "Hubo un problema al enviar tu mensaje. Intenta de nuevo.");
      }
    } catch (err: any) {
      setStatus("error");
      setError(err.message || "Hubo un problema al enviar tu mensaje. Intenta de nuevo.");
    }
  }

  return (
    <form
      className="bg-brand-beige/70 rounded-2xl p-8 mb-12 shadow-lg border border-brand-gold/40 space-y-5 max-w-xl mx-auto"
      onSubmit={handleSubmit}
    >
      <div>
        <label className="block font-semibold mb-1 text-brand-blue" htmlFor="name">Nombre</label>
        <input
          className="w-full p-3 rounded-xl border border-brand-green/30 bg-white focus:border-brand-gold focus:ring-2 focus:ring-brand-gold transition text-brand-green"
          type="text"
          id="name"
          name="name"
          autoComplete="off"
          required
        />
      </div>
      <div>
        <label className="block font-semibold mb-1 text-brand-blue" htmlFor="email">Correo electrónico</label>
        <input
          className="w-full p-3 rounded-xl border border-brand-green/30 bg-white focus:border-brand-gold focus:ring-2 focus:ring-brand-gold transition text-brand-green"
          type="email"
          id="email"
          name="email"
          autoComplete="off"
          required
        />
      </div>
      <div>
        <label className="block font-semibold mb-1 text-brand-blue" htmlFor="phone">Teléfono</label>
        <input
          className="w-full p-3 rounded-xl border border-brand-green/30 bg-white focus:border-brand-gold focus:ring-2 focus:ring-brand-gold transition text-brand-green"
          type="tel"
          id="phone"
          name="phone"
          autoComplete="off"
        />
      </div>
      {/* Dropdown de Paquete/Servicio */}
      <div>
        <label className="block font-semibold mb-1 text-brand-blue" htmlFor="servicio">
          ¿Qué servicio o paquete te interesa?
        </label>
        <select
          className="w-full p-3 rounded-xl border border-brand-green/30 bg-white focus:border-brand-gold focus:ring-2 focus:ring-brand-gold transition text-brand-green"
          id="servicio"
          name="servicio"
          defaultValue=""
          required
        >
          <option value="" disabled>
            Selecciona una opción...
          </option>
          <option value="Solo quiero conectar">Solo quiero conectar / No estoy seguro aún</option>
          <option value="Llamada de Descubrimiento">Llamada de Descubrimiento (Gratis)</option>
          <option value="Sesión de Claridad Financiera">Sesión de Claridad Financiera</option>
          <option value="Paquete Bienestar 3 Meses">Paquete Bienestar 3 Meses</option>
          <option value="Paquete Holístico 6 Meses">Paquete Holístico 6 Meses</option>
          <option value="Retención Continua">Retención Continua (Solo ex-clientes)</option>
          <option value="Círculo de Dinero">Círculo de Dinero</option>
          <option value="Taller">Taller (Comunidad/Corporativo)</option>
          <option value="Otro">Otro (describir abajo)</option>
        </select>
      </div>
      <div>
        <label className="block font-semibold mb-1 text-brand-blue" htmlFor="message">Mensaje</label>
        <textarea
          className="w-full p-3 rounded-xl border border-brand-green/30 bg-white focus:border-brand-gold focus:ring-2 focus:ring-brand-gold transition text-brand-green"
          id="message"
          name="message"
          rows={4}
          placeholder="Cuéntame cómo puedo ayudarte, o deja cualquier pregunta."
        ></textarea>
      </div>

      {/* Estado del formulario */}
      {status === "success" && (
        <div className="text-green-700 bg-green-100 rounded-xl p-3 text-center mb-2">
          Tu mensaje ha sido enviado. ¡Gracias!
        </div>
      )}
      {status === "error" && (
        <div className="text-red-700 bg-red-100 rounded-xl p-3 text-center mb-2">
          {error || "Hubo un problema al enviar tu mensaje. Intenta de nuevo."}
        </div>
      )}
      <button
        type="submit"
        disabled={status === "sending"}
        className="w-full px-8 py-3 bg-brand-gold text-brand-green rounded-full font-serif font-bold shadow-lg hover:bg-brand-blue hover:text-white transition text-lg"
      >
        {status === "sending" ? "Enviando..." : "Invítame"}
      </button>
    </form>
  );
}
