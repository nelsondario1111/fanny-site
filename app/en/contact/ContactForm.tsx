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
      service: (form.elements.namedItem("service") as HTMLSelectElement).value,
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
        setError(error || "Something went wrong. Please try again.");
      }
    } catch (err) {
  setStatus("error");
  // Typescript: err is unknown, but we can check for message property
  if (err && typeof err === "object" && "message" in err) {
    setError((err as { message: string }).message || "Hubo un problema al enviar tu mensaje. Intenta de nuevo.");
  } else {
    setError("Hubo un problema al enviar tu mensaje. Intenta de nuevo.");
  }
}

  }

  return (
    <form
      className="bg-brand-beige/70 rounded-2xl p-8 mb-12 shadow-lg border border-brand-gold/40 space-y-5 max-w-xl mx-auto"
      onSubmit={handleSubmit}
    >
      <div>
        <label className="block font-semibold mb-1 text-brand-blue" htmlFor="name">Name</label>
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
        <label className="block font-semibold mb-1 text-brand-blue" htmlFor="email">Email</label>
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
        <label className="block font-semibold mb-1 text-brand-blue" htmlFor="phone">Phone</label>
        <input
          className="w-full p-3 rounded-xl border border-brand-green/30 bg-white focus:border-brand-gold focus:ring-2 focus:ring-brand-gold transition text-brand-green"
          type="tel"
          id="phone"
          name="phone"
          autoComplete="off"
        />
      </div>
      <div>
        <label className="block font-semibold mb-1 text-brand-blue" htmlFor="service">
          Which service or package are you interested in?
        </label>
        <select
          className="w-full p-3 rounded-xl border border-brand-green/30 bg-white focus:border-brand-gold focus:ring-2 focus:ring-brand-gold transition text-brand-green"
          id="service"
          name="service"
          defaultValue=""
          required
        >
          <option value="" disabled>
            Please select...
          </option>
          <option value="Just want to connect">Just want to connect / Not sure yet</option>
          <option value="Discovery Call">Discovery Call (Free)</option>
          <option value="Financial Clarity Session">Financial Clarity Session</option>
          <option value="3-Month Wellness Package">3-Month Wellness Package</option>
          <option value="6-Month Holistic Package">6-Month Holistic Package</option>
          <option value="Ongoing Retainer">Ongoing Retainer (Alumni Only)</option>
          <option value="Money Circle">Money Circle</option>
          <option value="Workshop">Workshop (Community/Corporate)</option>
          <option value="Other">Other (describe below)</option>
        </select>
      </div>
      <div>
        <label className="block font-semibold mb-1 text-brand-blue" htmlFor="message">
          Message
        </label>
        <textarea
          className="w-full p-3 rounded-xl border border-brand-green/30 bg-white focus:border-brand-gold focus:ring-2 focus:ring-brand-gold transition text-brand-green"
          id="message"
          name="message"
          rows={4}
          placeholder="Tell me more about how I can help, or ask any questions!"
        ></textarea>
      </div>
      {/* Show status messages */}
      {status === "success" && (
        <div className="text-green-700 bg-green-100 rounded-xl p-3 text-center mb-2">
          Your message has been sent. Thank you!
        </div>
      )}
      {status === "error" && (
        <div className="text-red-700 bg-red-100 rounded-xl p-3 text-center mb-2">
          {error || "There was an error sending your message. Please try again."}
        </div>
      )}
      <button
        type="submit"
        disabled={status === "sending"}
        className="w-full px-8 py-3 bg-brand-gold text-brand-green rounded-full font-serif font-bold shadow-lg hover:bg-brand-blue hover:text-white transition text-lg"
      >
        {status === "sending" ? "Sending..." : "Invite me"}
      </button>
    </form>
  );
}
