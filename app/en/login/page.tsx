"use client";
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
    <main className="mx-auto max-w-md p-8">
      <h1 className="text-3xl font-serif font-bold text-brand-green mb-2">Sign in</h1>
      <p className="text-brand-body mb-6">Temporary login for development. We’ll hook up real auth next.</p>
      <button onClick={signIn} className="w-full rounded-xl bg-emerald-600 text-white py-3">
        Continue
      </button>
    </main>
  );
}
