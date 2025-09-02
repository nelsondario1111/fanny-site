// app/en/subscribe/page.tsx
import ClientFade from "@/components/ui/ClientFade";
import SubscribeForm from "@/components/SubscribeForm";

export default function SubscribePage() {
  return (
    <div className="px-4">
      <section className="mx-auto max-w-4xl pt-6 sm:pt-8">
        <ClientFade y={8}>
          <div className="rounded-[28px] border border-brand-gold/50 bg-white/92 shadow-lg backdrop-blur px-6 sm:px-10 py-8 sm:py-10">
            <h1 className="font-serif text-4xl md:text-5xl font-extrabold text-brand-green tracking-tight">
              Subscribe for a Clear, Calm Money Guide
            </h1>
            <p className="mt-4 text-brand-blue/90 text-base md:text-lg">
              Monthly bilingual tips on mortgages, money habits, and tax basics. No spam. Unsubscribe anytime.
            </p>
            <div className="mt-6">
              <SubscribeForm locale="en" />
            </div>
          </div>
        </ClientFade>
      </section>
    </div>
  );
}
