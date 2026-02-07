"use client";

import PageShell from "@/components/ui/PageShell";
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
    <PageShell
      title="Iniciar Sesión"
      subtitle="Acceso temporal para desarrollo. La autenticación de producción se integrará después."
      maxWidthClass="max-w-xl"
    >
      <button onClick={signIn} className="w-full rounded-xl bg-emerald-600 text-white py-3">
        Continuar
      </button>
    </PageShell>
  );
}
