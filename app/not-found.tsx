import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "404 - Page Not Found",
  robots: {
    index: false,
    follow: false,
  },
};

export default function NotFound() {
  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-brand-beige text-brand-blue">
      <h1 className="text-6xl font-brand font-bold mb-4">404</h1>
      <p className="text-2xl mb-6">Sorry, this page could not be found.</p>
      <Link href="/en" className="px-6 py-3 bg-brand-blue text-white rounded-full font-bold shadow hover:bg-brand-gold hover:text-brand-green transition mb-2">
        Go to English Home
      </Link>
      <Link href="/es" className="px-6 py-3 bg-brand-gold text-brand-green rounded-full font-bold shadow hover:bg-brand-blue hover:text-white transition">
        Ir al Inicio (Español)
      </Link>
    </div>
  );
}
