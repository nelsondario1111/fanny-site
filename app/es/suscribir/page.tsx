// app/es/suscribir/page.tsx
import type { Metadata } from "next";
import { buildMetadata } from "@/app/metadata";
import ClientFade from "@/components/ui/ClientFade";
import PageShell from "@/components/ui/PageShell";
import SubscribeForm from "@/components/SubscribeForm";

export const metadata: Metadata = buildMetadata({
  title: "Suscribir",
  description:
    "Suscríbete para recibir consejos mensuales bilingües sobre hipotecas, dinero e impuestos.",
  path: "/es/suscribir",
  locale: "es",
});

export default function SuscribirPage() {
  return (
    <PageShell
      title="Suscríbete para una guía financiera clara y serena"
      subtitle="Consejos mensuales y bilingües sobre hipotecas, hábitos de dinero y nociones básicas de impuestos. Sin spam. Puedes darte de baja cuando quieras."
      maxWidthClass="max-w-4xl"
    >
      <ClientFade y={8}>
        <SubscribeForm locale="es" />
      </ClientFade>
    </PageShell>
  );
}
