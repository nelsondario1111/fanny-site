import Link from "next/link";
import type { Metadata } from "next";
import { buildMetadata } from "@/app/metadata";
import PageShell from "@/components/ui/PageShell";

export const metadata: Metadata = buildMetadata({
  title: "Payment Canceled",
  description: "Payment cancellation confirmation.",
  path: "/en/cancel",
  locale: "en",
  noIndex: true,
});

export default function CancelPage() {
  return (
    <PageShell
      title="Transaction Canceled"
      subtitle="Your payment was canceled or not completed. No charge was made."
      maxWidthClass="max-w-xl"
    >
      <p className="text-center text-brand-body">
        If you need help choosing the right next step, Fanny and her team are
        here to support you.
      </p>
      <div className="mt-6 flex justify-center">
        <Link
          href="/en/services"
          className="inline-flex items-center rounded-full bg-brand-gold px-8 py-3 font-semibold text-brand-green shadow transition hover:bg-brand-blue hover:text-white"
        >
          Return to Services
        </Link>
      </div>
    </PageShell>
  );
}
