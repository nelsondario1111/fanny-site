"use client";

import PageShell from "@/components/ui/PageShell";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginPageEn() {
  const router = useRouter();
  const sp = useSearchParams();
  const redirect = sp.get("redirect") || "/en/account";

  function signIn() {
    document.cookie = `fs_session=dev; Path=/; Max-Age=86400; SameSite=Lax`;
    router.replace(redirect);
  }

  return (
    <PageShell
      title="Sign In"
      subtitle="Temporary login for development. Production authentication will be connected next."
      maxWidthClass="max-w-xl"
    >
      <button onClick={signIn} className="w-full rounded-xl bg-emerald-600 text-white py-3">
        Continue
      </button>
    </PageShell>
  );
}
