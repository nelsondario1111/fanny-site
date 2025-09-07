"use client";

import React from "react";
import Link from "next/link";
import ContactoForm from "./ContactoForm";
import { motion, useReducedMotion } from "framer-motion";

/* --- Desvanecido sutil, seguro para SSR (nunca oculta contenido) --- */
const easing: number[] = [0.22, 1, 0.36, 1];
function FadeIn({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) {
  const prefersReduced = useReducedMotion();
  return (
    <motion.div
      // Visible por defecto para evitar desajustes de hidratación/intersection
      initial="visible"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={{
        visible: {
          opacity: 1,
          y: 0,
          transition: prefersReduced
            ? { duration: 0 }
            : { duration: 0.45, ease: easing, delay },
        },
      }}
      style={{ willChange: "transform" }}
    >
      {children}
    </motion.div>
  );
}

/* --- Panel consistente con la estética “mesa” del sitio --- */
function Panel({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={[
        "bg-white/95 rounded-[28px] border border-brand-gold/40 shadow-lg backdrop-blur-[1px]",
        className,
      ].join(" ")}
    >
      {children}
    </div>
  );
}

export default function Contacto() {
  return (
    <main className="bg-brand-beige min-h-screen">
      {/* Hero (estilizado como otros paneles para consistencia) */}
      <section className="px-4 pt-12">
        <div className="max-w-5xl mx-auto">
          <FadeIn>
            <Panel className="px-6 sm:px-10 py-10 text-center">
              <h1 className="text-4xl md:text-5xl font-serif font-bold text-brand-green tracking-tight">
                Conectemos y transforma tu vida financiera
              </h1>
              <div className="flex justify-center my-5" aria-hidden="true">
                <div className="w-20 h-[3px] rounded-full bg-brand-gold" />
              </div>
              <p className="text-brand-blue/90 text-lg md:text-xl max-w-3xl mx-auto">
                Reserva una llamada de descubrimiento o cuéntanos en qué estás trabajando.
                Te responderemos pronto con próximos pasos claros.
              </p>

              <div className="mt-6 flex items-center justify-center gap-3">
                {/* Atajo; el formulario también preselecciona según ?package= */}
                <Link
                  href="/es/reservar"
                  className="inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-serif font-bold shadow bg-brand-green text-white hover:opacity-90 transition"
                >
                  Reservar llamada gratuita
                </Link>
                <a
                  href="mailto:info@fannysamaniego.com"
                  className="inline-flex items-center justify-center rounded-full px-6 py-3 text-sm border-2 border-brand-green text-brand-green hover:bg-brand-green hover:text-white transition"
                >
                  Escribir un email
                </a>
              </div>
            </Panel>
          </FadeIn>
        </div>
      </section>

      {/* Grid de contenido */}
      <section className="px-4 py-10">
        <div className="max-w-5xl mx-auto grid gap-6 lg:grid-cols-[1.2fr,0.8fr]">
          {/* Izquierda: Formulario */}
          <FadeIn>
            <Panel className="p-6 sm:p-8">
              <h2 className="sr-only">Formulario de contacto</h2>
              <ContactoForm />
              <p className="mt-4 text-xs text-brand-body/70">
                Al enviar aceptas ser contactad@ respecto a tu consulta.
                Respetamos tu privacidad y no compartimos tu información.
              </p>
            </Panel>
          </FadeIn>

          {/* Derecha: Datos / Confianza */}
          <FadeIn delay={0.08}>
            <div className="space-y-6">
              <Panel className="p-6 sm:p-8">
                <h2 className="text-xl font-serif font-bold text-brand-green">
                  Datos de contacto
                </h2>
                <ul className="mt-4 space-y-3 text-brand-green">
                  <li className="flex items-center justify-between gap-3">
                    <span className="font-semibold">Email</span>
                    <a
                      className="underline hover:text-brand-blue transition"
                      href="mailto:info@fannysamaniego.com"
                    >
                      info@fannysamaniego.com
                    </a>
                  </li>
                  <li className="flex items-center justify-between gap-3">
                    <span className="font-semibold">WhatsApp</span>
                    <a
                      className="underline hover:text-brand-blue transition"
                      href="https://wa.me/14167268420"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      (416) 726-8420
                    </a>
                  </li>
                  <li className="flex items-center justify-between gap-3">
                    <span className="font-semibold">Teléfono</span>
                    <a
                      className="underline hover:text-brand-blue transition"
                      href="tel:14167268420"
                    >
                      (416) 726-8420
                    </a>
                  </li>
                </ul>

                <div className="mt-6 grid gap-3 sm:grid-cols-2 text-sm">
                  <div className="rounded-2xl border border-brand-gold/50 bg-white p-4">
                    <div className="text-brand-body/70">Horario</div>
                    <div className="mt-1 font-medium text-brand-green">
                      Lun–Vie · 9:00–17:00 (ET)
                    </div>
                  </div>
                  <div className="rounded-2xl border border-brand-gold/50 bg-white p-4">
                    <div className="text-brand-body/70">Idiomas</div>
                    <div className="mt-1 font-medium text-brand-green">
                      Español · English
                    </div>
                  </div>
                </div>
              </Panel>

              <Panel className="p-6 sm:p-8">
                <h2 className="text-xl font-serif font-bold text-brand-green">
                  ¿Por qué reservar una llamada?
                </h2>
                <ul className="mt-3 space-y-2 text-brand-body">
                  <li className="flex gap-2">
                    <span className="mt-1">•</span>
                    <span>Un siguiente paso claro y accionable en 15–20 minutos.</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="mt-1">•</span>
                    <span>
                      Conversamos sobre flujo, deudas, hipotecas o inversiones.
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <span className="mt-1">•</span>
                    <span>
                      Guía holística y consciente del comportamiento, a tu medida.
                    </span>
                  </li>
                </ul>
                <div className="mt-5 rounded-2xl border border-brand-gold/50 bg-brand-beige/60 p-4">
                  <p className="italic text-brand-green">
                    “La mezcla de claridad, estructura y calidez nos ayudó a seguir
                    un plan que sí se sentía natural.”
                  </p>
                  <p className="mt-1 text-sm text-brand-body/70">— Clienta, Toronto</p>
                </div>
                <div className="mt-6">
                  <Link
                    href="/es/testimonios"
                    className="inline-flex items-center rounded-full border bg-white px-4 py-2 text-sm font-medium text-brand-green border-brand-green hover:bg-brand-green hover:text-white transition"
                  >
                    Leer historias de clientes →
                  </Link>
                </div>
              </Panel>
            </div>
          </FadeIn>
        </div>
      </section>
    </main>
  );
}
