// app/en/subscribe/page.tsx
import ClientFade from "@/components/ui/ClientFade";
import PageShell from "@/components/ui/PageShell";
import SubscribeForm from "@/components/SubscribeForm";

export default function SubscribePage() {
  return (
    <PageShell
      title="Subscribe for a Clear, Calm Money Guide"
      subtitle="Monthly bilingual tips on mortgages, money habits, and tax basics. No spam. Unsubscribe anytime."
      maxWidthClass="max-w-4xl"
    >
      <ClientFade y={8}>
        <SubscribeForm locale="en" />
      </ClientFade>
    </PageShell>
  );
}
