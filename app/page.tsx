// app/page.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RedirectHome() {
  const router = useRouter();

  useEffect(() => {
    const userLang = navigator.language || navigator.languages[0] || "en";
    const langPrefix = userLang.toLowerCase().startsWith("es") ? "/es" : "/en";
    router.replace(langPrefix);
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-brand-beige text-brand-blue">
      <p className="text-xl font-semibold">Redirecting...</p>
    </div>
  );
}
