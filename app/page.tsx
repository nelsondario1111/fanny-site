// app/page.tsx
"use client";
import Link from "next/link";

export default function LanguageSelect() {
  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-brand-beige text-brand-blue">
      <h1 className="text-4xl font-serif font-bold mb-4">Welcome / Bienvenido</h1>
      <p className="mb-6 text-lg">Please choose your language:</p>
      <div className="flex gap-6">
        <Link href="/en" className="px-6 py-3 bg-brand-blue text-white rounded-full font-bold shadow hover:bg-brand-gold hover:text-brand-green transition mb-2">
          English
        </Link>
        <Link href="/es" className="px-6 py-3 bg-brand-gold text-brand-green rounded-full font-bold shadow hover:bg-brand-blue hover:text-white transition">
          Español
        </Link>
      </div>
    </div>
  );
}
