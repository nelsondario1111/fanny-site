"use client";

import * as React from "react";
import dynamic from "next/dynamic";

// Solo tipo, para extraer las props del componente cliente sin forzar su carga en SSR.
import type RecursosClientType from "./RecursosClient";
type RecursosProps = React.ComponentProps<typeof RecursosClientType>;

/** Skeleton SSR-safe para que nunca se vea “en blanco” durante la hidratación */
function RecursosSkeleton() {
  return (
    <main className="bg-brand-beige min-h-screen">
      <section className="max-w-content mx-auto px-5 sm:px-8 py-8 sm:py-12 bg-white rounded-[28px] border border-brand-gold/60 shadow-sm">
        <div className="text-center mb-6">
          <h1 className="font-brand font-bold text-3xl md:text-4xl text-brand-green tracking-tight">
            Herramientas y Guías
          </h1>
          <div className="flex justify-center my-4" aria-hidden="true">
            <div className="w-16 h-[3px] rounded-full bg-brand-gold" />
          </div>
          <p className="text-brand-blue/90 text-lg md:text-xl max-w-3xl mx-auto">
            Cargando recursos…
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="rounded-3xl border border-brand-gold/60 bg-white shadow-sm p-6 animate-pulse"
            >
              <div className="w-full h-40 rounded-2xl bg-brand-beige/60 mb-3" />
              <div className="h-5 w-3/4 bg-brand-beige/60 rounded mb-2" />
              <div className="h-4 w-full bg-brand-beige/60 rounded mb-1.5" />
              <div className="h-4 w-5/6 bg-brand-beige/60 rounded" />
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

/** Carga solo en cliente (hidratación segura), igual al patrón de Home */
const CSRRecursos = dynamic(() => import("./RecursosClient").then(m => m.default), {
  ssr: false,
  loading: () => <RecursosSkeleton />,
});

export default function HydratedRecursos(props: RecursosProps) {
  return <CSRRecursos {...props} />;
}
