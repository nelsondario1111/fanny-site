import Link from "next/link";
import PageShell from "@/components/ui/PageShell";

export default function SuccessPageEn() {
  return (
    <PageShell
      title="Thank You for Your Payment"
      subtitle="Your payment was successful. You will receive a confirmation and receipt by email."
      maxWidthClass="max-w-xl"
    >
      <p className="text-center text-brand-body">
        We’re grateful to support your next step toward financial wellbeing.
      </p>
      <div className="mt-6 flex justify-center">
        <Link
          href="/en"
          className="inline-flex items-center rounded-full bg-brand-gold px-8 py-3 font-semibold text-brand-green shadow transition hover:bg-brand-blue hover:text-white"
        >
          Back to Home
        </Link>
      </div>
    </PageShell>
  );
}
