// app/es/contacto/page.tsx
"use client";

import React from "react";
import Link from "next/link";
import ContactoForm from "./ContactoForm";
import { motion, useReducedMotion, type Transition } from "framer-motion";
import { HUB_TABLE_CLASS, PageHero, ctaButtonClass } from "@/components/sections/hub";

/* --- Desvanecido sutil, seguro para SSR (nunca oculta contenido) --- */
const easing: Transition["ease"] = [0.22, 1, 0.36, 1];

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
  return <div className={[HUB_TABLE_CLASS, className].join(" ")}>{children}</div>;
}

export default function Contacto() {
  return (
    <main className="bg-brand-beige min-h-screen">
      <PageHero
        homeHref="/es"
        homeLabel="Inicio"
        currentLabel="Contacto"
        title="Conectemos y transforma tu vida financiera"
        subtitle="Reserva una llamada de descubrimiento o cuéntanos en qué estás trabajando. Te responderemos pronto con próximos pasos claros."
        primaryCta={{ label: "Reservar llamada gratuita", href: "/es/reservar" }}
        secondaryCta={{ label: "Escribir un email", href: "mailto:info@fannysamaniego.com", variant: "secondary" }}
      />

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
                    className={ctaButtonClass("secondary")}
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
