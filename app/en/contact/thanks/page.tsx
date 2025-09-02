"use client";

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
    <main className="mx-auto max-w-3xl p-8 text-center">
      <h1 className="text-3xl font-serif font-bold text-brand-green">{headline}</h1>
      {pkg && <p className="mt-2 text-brand-body">Requested: <b>{pkg}</b></p>}
      <p className="mt-4 text-brand-body">
        We’ve received your note and will reply with next steps soon. If you’d like to prepare,
        you can create your account to access private tools.
      </p>

      <div className="mt-6 flex gap-3 justify-center">
        <a href="/en/login?redirect=/en/account" className="px-6 py-3 rounded-full bg-brand-green text-white">Create your account</a>
        <a href="/en/tools" className="px-6 py-3 rounded-full border border-brand-green text-brand-green hover:bg-brand-green hover:text-white transition">Browse public tools</a>
      </div>
    </main>
  );
}
