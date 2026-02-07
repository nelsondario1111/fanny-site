import Link from "next/link";
import type { Metadata } from "next";
import { buildMetadata } from "@/app/metadata";
import PageShell from "@/components/ui/PageShell";

export const metadata: Metadata = buildMetadata({
  title: "Thanks for Subscribing",
  description: "Newsletter subscription confirmation.",
  path: "/en/thank-you",
  locale: "en",
  noIndex: true,
});

export default function ThankYouPageEn() {
  return (
    <PageShell
      title="Thanks for Subscribing"
      subtitle="You’re on the list. Watch your inbox for calm, practical guidance on money, mortgages, and tax readiness."
      maxWidthClass="max-w-3xl"
    >
      <p className="text-center text-brand-body">
        While you wait, you can explore our free tools and articles.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Link
          href="/en/resources"
          className="inline-flex items-center rounded-full bg-brand-green px-6 py-3 font-semibold text-white transition hover:bg-brand-blue"
        >
          Read Resources
        </Link>
        <Link
          href="/en/tools"
          className="inline-flex items-center rounded-full border border-brand-green px-6 py-3 font-semibold text-brand-green transition hover:bg-brand-green hover:text-white"
        >
          Open Tools
        </Link>
      </div>
    </PageShell>
  );
}
