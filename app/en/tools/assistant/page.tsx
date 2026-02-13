import Link from "next/link";
import { MessageCircle, Sparkles, ArrowLeft } from "lucide-react";
import ToolShell from "@/components/ToolShell";

export default function AssistantToolPage() {
  return (
    <ToolShell
      lang="en"
      title="AI Assistant"
      subtitle="Guided beta support for mortgage, tax, and cash-flow questions."
    >
      <section className="tool-card-compact">
        <p className="inline-flex items-center gap-2 rounded-full border border-brand-gold/40 bg-brand-gold/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-brand-green">
          <Sparkles size={14} aria-hidden /> Beta utility
        </p>

        <p className="mt-4 text-brand-blue/90 leading-relaxed">
          For now, the fastest path to personalized guidance is to start a conversation and share what you want to solve.
        </p>

        <ul className="mt-6 list-disc pl-5 space-y-1.5 text-brand-blue/90">
          <li>Mortgage, tax, and cash-flow questions in one place</li>
          <li>Bilingual support (English / Spanish)</li>
          <li>Practical next steps based on your situation</li>
        </ul>

        <div className="mt-7 flex flex-wrap gap-3">
          <Link href="/en/contact?intent=assistant" className="tool-btn-primary">
            <MessageCircle size={14} aria-hidden />
            Start a conversation
          </Link>
          <Link href="/en/tools" className="tool-btn-blue">
            <ArrowLeft size={14} aria-hidden />
            Back to tools
          </Link>
        </div>
      </section>

      <section className="tool-card-compact mt-6">
        <p className="text-xs text-brand-blue/70">
          Educational support only. Guidance is general and not legal, tax, lending, or investment advice.
        </p>
      </section>
    </ToolShell>
  );
}
