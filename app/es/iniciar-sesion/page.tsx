"use client";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginPageEs() {
  const router = useRouter();
  const sp = useSearchParams();
  const redirect = sp.get("redirect") || "/es/cuenta";

  function signIn() {
    document.cookie = `fs_session=dev; Path=/; Max-Age=86400; SameSite=Lax`;
    router.replace(redirect);
  }

  return (
    <main className="mx-auto max-w-md p-8">
      <h1 className="text-3xl font-serif font-bold text-brand-green mb-2">Ingresar</h1>
      <p className="text-brand-body mb-6">Inicio de sesión temporal para desarrollo. Integraremos el real después.</p>
      <button onClick={signIn} className="w-full rounded-xl bg-emerald-600 text-white py-3">
        Continuar
      </button>
    </main>
  );
}
