"use client";

import Link from "next/link";
import PageShell from "@/components/ui/PageShell";
import { useSearchParams } from "next/navigation";

function usePlainSearch() {
  const sp = useSearchParams();
  return new URLSearchParams(sp?.toString() ?? "");
}
const safeDecode = (v: string | null) => { try { return v ? decodeURIComponent(v) : undefined; } catch { return v ?? undefined; } };

export default function ThanksEn() {
  const ps = usePlainSearch();
  const intent = (ps.get("intent") ?? "consult") as "consult" | "preapproval" | "question" | "package";
  const pkg = safeDecode(ps.get("package"));

  const headline =
    intent === "preapproval" ? "Thanks — we’ll start your pre-approval"
    : intent === "question" ? "Thanks — we’ll get back to you shortly"
    : intent === "package" ? "Thanks — we’ll follow up about your package"
    : "Thanks — we’ll confirm your discovery call";

  return (
    <PageShell title={headline} maxWidthClass="max-w-3xl">
      {pkg ? (
        <p className="text-center text-brand-body">
          Requested package: <strong>{pkg}</strong>
        </p>
      ) : null}
      <p className="mt-2 text-center text-brand-body">
        We’ve received your message and will send your next steps soon.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Link
          href="/en/login?redirect=/en/account"
          className="inline-flex items-center rounded-full bg-brand-green px-6 py-3 font-semibold text-white transition hover:bg-brand-blue"
        >
          Create your account
        </Link>
        <Link
          href="/en/tools"
          className="inline-flex items-center rounded-full border border-brand-green px-6 py-3 font-semibold text-brand-green transition hover:bg-brand-green hover:text-white"
        >
          Browse public tools
        </Link>
      </div>
    </PageShell>
  );
}
