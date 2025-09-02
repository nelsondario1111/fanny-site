"use client";

import React, { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

type Intent = "consult" | "preapproval" | "question" | "package";

type Props = {
  /** Si no se pasan, se leen desde la URL */
  defaultIntent?: Intent;
  defaultPackage?: string;
};

type ServiceOption = { slug: string; label: string };

/**
 * IMPORTANTE:
 * Las etiquetas (label) DEBEN coincidir exactamente con los títulos en /es/servicios
 * cuando se usen en TITLE_TO_SLUG_ES para que el preseleccionado funcione.
 */
const SERVICE_OPTIONS: ServiceOption[] = [
  // Asesoría 1:1
  { slug: "consulta-descubrimiento-privada", label: "Consulta Privada de Descubrimiento" },
  { slug: "sesion-plano-90min", label: "Sesión Plano — 90 minutos" },
  { slug: "alinear-3-sesiones", label: "Alinear (Paquete 3 sesiones)" },
  { slug: "transformar-6-sesiones", label: "Transformar (Paquete 6 sesiones)" },
  { slug: "elevar-premium", label: "Elevar (Paquete de Transformación Premium)" },
  { slug: "alumni-mensual", label: "Acompañamiento Mensual — Alumni" },

  // Fundamentos de riqueza
  { slug: "plano-riqueza-familiar-fhsa", label: "Plano de Riqueza Familiar (con FHSA)" },
  { slug: "afinacion-profesional-90d", label: "Afinación Financiera Profesional (90 días)" },

  // Hipoteca & Propiedades
  { slug: "concierge-preaprobacion", label: "Concierge de Preaprobación — Listos para el ‘Sí’" },
  { slug: "estrategia-refi-renovacion", label: "Estrategia de Refi & Renovación" },
  { slug: "inversion-inicial-4-10-dscr", label: "Inversión Inicial: 4–10 Unidades (DSCR)" },

  // Negocios & Profesionales
  { slug: "alineacion-ejecutiva-equipo", label: "Alineación Ejecutiva & de Equipo (Founder/Pro)" },
  { slug: "clinica-incorporacion-pagarte", label: "Clínica: Incorporación / Cómo pagarte" },

  // Legado & Impuestos
  { slug: "estrategia-impuestos-personal-familiar", label: "Estrategia Personal/Familiar de Impuestos" },
  { slug: "ritmo-legado-impuestos-anual", label: "Ritmo de Legado & Impuestos (Anual)" },
  { slug: "pyme-configuracion-90d", label: "PyME / Independiente — Configuración 90 días" },

  // Conversaciones Holísticas (Familias & Grupos)
  { slug: "mesa-cohorte-4-semanas", label: "Conversaciones en la Mesa — Cohorte 4 semanas" },
  { slug: "mesa-circulo-mensual", label: "Conversaciones en la Mesa — Círculo mensual" },

  // Recién llegados
  { slug: "integracion-patrimonial-recien-llegados-30d", label: "Integración Patrimonial para Recién Llegados (30 días)" },

  // Genéricos
  { slug: "solo-conectar", label: "Solo quiero conectar / Aún no decido" },
  { slug: "otro", label: "Otro (describe abajo)" },
];

/** Mapa de TÍTULO EXACTO (desde /es/servicios ?package=) → slug del desplegable */
const TITLE_TO_SLUG_ES: Record<string, string> = {
  // Asesoría 1:1
  "Consulta Privada de Descubrimiento": "consulta-descubrimiento-privada",
  "Sesión Plano — 90 minutos": "sesion-plano-90min",
  "Alinear (Paquete 3 sesiones)": "alinear-3-sesiones",
  "Transformar (Paquete 6 sesiones)": "transformar-6-sesiones",
  "Elevar (Paquete de Transformación Premium)": "elevar-premium",
  "Acompañamiento Mensual — Alumni": "alumni-mensual",

  // Fundamentos de riqueza
  "Plano de Riqueza Familiar (con FHSA)": "plano-riqueza-familiar-fhsa",
  "Afinación Financiera Profesional (90 días)": "afinacion-profesional-90d",

  // Hipoteca & Propiedades
  "Concierge de Preaprobación — Listos para el ‘Sí’": "concierge-preaprobacion",
  "Estrategia de Refi & Renovación": "estrategia-refi-renovacion",
  "Inversión Inicial: 4–10 Unidades (DSCR)": "inversion-inicial-4-10-dscr",

  // Negocios & Profesionales
  "Alineación Ejecutiva & de Equipo (Founder/Pro)": "alineacion-ejecutiva-equipo",
  "Clínica: Incorporación / Cómo pagarte": "clinica-incorporacion-pagarte",

  // Legado & Impuestos
  "Estrategia Personal/Familiar de Impuestos": "estrategia-impuestos-personal-familiar",
  "Ritmo de Legado & Impuestos (Anual)": "ritmo-legado-impuestos-anual",
  "PyME / Independiente — Configuración 90 días": "pyme-configuracion-90d",

  // Conversaciones Holísticas
  "Conversaciones en la Mesa — Cohorte 4 semanas": "mesa-cohorte-4-semanas",
  "Conversaciones en la Mesa — Círculo mensual": "mesa-circulo-mensual",

  // Recién llegados
  "Integración Patrimonial para Recién Llegados (30 días)": "integracion-patrimonial-recien-llegados-30d",

  // Compatibilidad retro (posibles títulos antiguos que aún circulen en enlaces)
  "Llamada de descubrimiento (Gratis)": "consulta-descubrimiento-privada",
  "Llamada de descubrimiento": "consulta-descubrimiento-privada",
  "Sesión Blueprint Personal": "sesion-plano-90min",
  "Paquete Alineación 3 Meses": "alinear-3-sesiones",
  "Paquete Transformación 6 Meses": "transformar-6-sesiones",
  "Acompañamiento Continuo (Alumni)": "alumni-mensual",
  "Conversaciones de Mesa (4 semanas)": "mesa-cohorte-4-semanas",
  "Conversaciones de Mesa Mensual": "mesa-circulo-mensual",
  "Estrategia de Refinanciación y Renovación": "estrategia-refi-renovacion",
  "Preparación Hipotecaria y Preaprobación": "concierge-preaprobacion",
  "Estrategia para Propiedades de Inversión (4–10 unidades)": "inversion-inicial-4-10-dscr",
};

function usePlainSearch() {
  const sp = useSearchParams();
  return new URLSearchParams(sp?.toString() ?? "");
}
const safeDecode = (v: string | null) => {
  try { return v ? decodeURIComponent(v) : undefined; } catch { return v ?? undefined; }
};

export default function ContactoForm(props: Props) {
  const ps = usePlainSearch();
  const urlIntent = (ps.get("intent") as Intent | null) ?? undefined;
  const urlPackage = safeDecode(ps.get("package"));

  const effectiveIntent: Intent = props.defaultIntent ?? urlIntent ?? "consult";
  const effectivePackage = props.defaultPackage ?? urlPackage;

  const initialSlug = useMemo(() => {
    if (effectiveIntent === "preapproval") return "concierge-preaprobacion";
    if (effectiveIntent === "consult") return "consulta-descubrimiento-privada";
    if (effectiveIntent === "question") return "solo-conectar";
    if (effectiveIntent === "package") {
      const mapped = effectivePackage ? TITLE_TO_SLUG_ES[effectivePackage] : undefined;
      return mapped ?? "consulta-descubrimiento-privada";
    }
    return "consulta-descubrimiento-privada";
  }, [effectiveIntent, effectivePackage]);

  const defaultMessage = useMemo(() => {
    if (!effectivePackage) return "";
    return `Sobre: ${effectivePackage}\n`;
  }, [effectivePackage]);

  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    setError(null);

    const form = e.currentTarget;
    const serviceSlug = (form.elements.namedItem("serviceSlug") as HTMLInputElement)?.value || "";
    const serviceLabel = SERVICE_OPTIONS.find((o) => o.slug === serviceSlug)?.label || "";

    const payload = {
      nombre: (form.elements.namedItem("name") as HTMLInputElement).value,
      email: (form.elements.namedItem("email") as HTMLInputElement).value,
      telefono: (form.elements.namedItem("phone") as HTMLInputElement).value,
      servicio: serviceLabel || (form.elements.namedItem("service") as HTMLSelectElement)?.value,
      serviceSlug,
      intent: effectiveIntent,
      pkg: effectivePackage ?? "",
      mensaje: (form.elements.namedItem("message") as HTMLTextAreaElement).value,
      contactoPreferido: (form.elements.namedItem("preferredContact") as RadioNodeList)?.value || "email",
      pagePath: window.location.pathname + window.location.search,
      referrer: document.referrer || "",
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        setStatus("success");
        (form as HTMLFormElement).reset();
        return;
      } else {
        const { error } = await res.json().catch(() => ({ error: "" }));
        setStatus("error");
        setError(error || "Ocurrió un problema. Intenta nuevamente.");
      }
    } catch {
      setStatus("error");
      setError("Ocurrió un problema. Intenta nuevamente.");
    }
  }

  const isPreapproval = effectiveIntent === "preapproval";

  return (
    <form
      className="bg-brand-beige/70 rounded-2xl p-8 mb-12 shadow-lg border border-brand-gold/40 space-y-5 max-w-xl mx-auto"
      onSubmit={handleSubmit}
      aria-label="Contactar a Fanny y su equipo"
    >
      {/* Campos ocultos (contexto backend) */}
      <input type="hidden" name="intent" value={effectiveIntent} />
      {effectivePackage ? <input type="hidden" name="package" value={effectivePackage} /> : null}
      <input type="hidden" id="serviceSlug" name="serviceSlug" value={initialSlug} />

      <div>
        <label className="block font-semibold mb-1 text-brand-blue" htmlFor="name">Nombre</label>
        <input
          className="w-full p-3 rounded-xl border border-brand-green/30 bg-white focus:border-brand-gold focus:ring-2 focus:ring-brand-gold transition text-brand-green"
          type="text" id="name" name="name" autoComplete="name" required
        />
      </div>

      <div>
        <label className="block font-semibold mb-1 text-brand-blue" htmlFor="email">Email</label>
        <input
          className="w-full p-3 rounded-xl border border-brand-green/30 bg-white focus:border-brand-gold focus:ring-2 focus:ring-brand-gold transition text-brand-green"
          type="email" id="email" name="email" autoComplete="email" required
        />
      </div>

      <div>
        <label className="block font-semibold mb-1 text-brand-blue" htmlFor="phone">Teléfono</label>
        <input
          className="w-full p-3 rounded-xl border border-brand-green/30 bg-white focus:border-brand-gold focus:ring-2 focus:ring-brand-gold transition text-brand-green"
          type="tel" id="phone" name="phone" inputMode="tel" autoComplete="tel"
        />
      </div>

      {/* Servicio / Paquete */}
      <div>
        <label className="block font-semibold mb-1 text-brand-blue" htmlFor="service">
          ¿Qué servicio o paquete te interesa?
        </label>
        <select
          className="w-full p-3 rounded-xl border border-brand-green/30 bg-white focus:border-brand-gold focus:ring-2 focus:ring-brand-gold transition text-brand-green"
          id="service" name="service" defaultValue={initialSlug}
          onChange={(e) => {
            const hidden = document.getElementById("serviceSlug") as HTMLInputElement | null;
            if (hidden) hidden.value = e.currentTarget.value;
          }}
          required
        >
          <option value="" disabled>Selecciona una opción...</option>
          {SERVICE_OPTIONS.map((opt) => (
            <option key={opt.slug} value={opt.slug}>{opt.label}</option>
          ))}
        </select>

        {isPreapproval && (
          <p className="mt-2 text-xs text-brand-body/80">
            La preaprobación evalúa elegibilidad hipotecaria. No es necesaria para clientes de coaching.
          </p>
        )}
      </div>

      {/* Medio de contacto preferido */}
      <fieldset className="rounded-xl border border-brand-green/20 p-3">
        <legend className="px-1 text-sm text-brand-blue/80">Medio de contacto preferido</legend>
        <div className="flex flex-wrap gap-4 mt-1">
          <label className="inline-flex items-center gap-2">
            <input type="radio" name="preferredContact" value="email" defaultChecked /><span>Email</span>
          </label>
          <label className="inline-flex items-center gap-2">
            <input type="radio" name="preferredContact" value="whatsapp" /><span>WhatsApp</span>
          </label>
          <label className="inline-flex items-center gap-2">
            <input type="radio" name="preferredContact" value="phone" /><span>Teléfono</span>
          </label>
        </div>
      </fieldset>

      <div>
        <label className="block font-semibold mb-1 text-brand-blue" htmlFor="message">Mensaje</label>
        <textarea
          className="w-full p-3 rounded-xl border border-brand-green/30 bg-white focus:border-brand-gold focus:ring-2 focus:ring-brand-gold transition text-brand-green"
          id="message" name="message" rows={4}
          placeholder="Cuéntanos cómo podemos ayudarte o deja tus preguntas."
          defaultValue={defaultMessage}
        />
      </div>

      {/* Estado */}
      {status === "success" && (
        <div className="text-green-700 bg-green-100 rounded-xl p-3 text-center mb-2">
          ¡Tu mensaje ha sido enviado! Gracias.
        </div>
      )}
      {status === "error" && (
        <div className="text-red-700 bg-red-100 rounded-xl p-3 text-center mb-2">
          {error || "Hubo un error al enviar. Intenta nuevamente."}
        </div>
      )}

      <button
        type="submit" disabled={status === "sending"}
        className="w-full px-8 py-3 bg-brand-gold text-brand-green rounded-full font-serif font-bold shadow-lg hover:bg-brand-blue hover:text-white transition text-lg"
      >
        {status === "sending" ? "Enviando..." : "Solicitar info / Reservar"}
      </button>
    </form>
  );
}
