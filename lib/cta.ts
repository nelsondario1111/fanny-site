// lib/cta.ts
export const CTA = {
  path: (lang: "en" | "es" = "en") => (lang === "es" ? "/es/reservar" : "/en/book"),
  label: (lang: "en" | "es" = "en") =>
    lang === "es" ? "Reserva una consulta gratuita" : "Book a Free Consultation",
};
