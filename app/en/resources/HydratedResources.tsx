"use client";

import * as React from "react";
import dynamic from "next/dynamic";

// Type-only import to avoid pulling the client module server-side.
import type ResourcesClientType from "./ResourcesClient";
type ResourcesProps = React.ComponentProps<typeof ResourcesClientType>;

/** SSR-safe skeleton so the section never looks empty while hydrating */
function ResourcesSkeleton() {
  return (
    <main className="bg-white min-h-screen">
      <section className="max-w-content mx-auto px-5 sm:px-8 py-8 sm:py-12 bg-white rounded-[28px] border border-brand-gold/60 shadow-sm">
        <div className="text-center mb-6">
          <h1 className="font-serif font-extrabold text-3xl md:text-4xl text-brand-green tracking-tight">
            Helpful Tools &amp; Articles
          </h1>
          <div className="flex justify-center my-4" aria-hidden="true">
            <div className="w-16 h-[3px] rounded-full bg-brand-gold" />
          </div>
          <p className="text-brand-blue/90 text-lg md:text-xl max-w-3xl mx-auto">
            Loading resources…
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

/** Client-only load (hydration-safe), mirrors your Home page pattern */
const CSRClient = dynamic(() => import("./ResourcesClient").then(m => m.default), {
  ssr: false,
  loading: () => <ResourcesSkeleton />,
});

export default function HydratedResources(props: ResourcesProps) {
  return <CSRClient {...props} />;
}
