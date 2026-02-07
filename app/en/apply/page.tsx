import Link from "next/link";
import type { Metadata } from "next";
import { buildMetadata } from "@/app/metadata";
import PageShell from "@/components/ui/PageShell";

export const metadata: Metadata = buildMetadata({
  title: "Apply",
  description: "Application intake start page.",
  path: "/en/apply",
  locale: "en",
  noIndex: true,
});

export default function ApplyPageEn() {
  return (
    <PageShell
      title="Application Intake"
      subtitle="Share your goals and timeline, and we’ll guide you to the right service path."
      maxWidthClass="max-w-3xl"
    >
      <p className="text-center text-brand-body">
        Our full guided intake form is being finalized. For now, start with a
        short consultation so we can personalize your next steps.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Link
          href="/en/book"
          className="inline-flex items-center rounded-full bg-brand-green px-6 py-3 font-semibold text-white transition hover:bg-brand-blue"
        >
          Book a Consultation
        </Link>
        <Link
          href="/en/contact?intent=consult"
          className="inline-flex items-center rounded-full border border-brand-green px-6 py-3 font-semibold text-brand-green transition hover:bg-brand-green hover:text-white"
        >
          Contact the Team
        </Link>
      </div>
    </PageShell>
  );
}
