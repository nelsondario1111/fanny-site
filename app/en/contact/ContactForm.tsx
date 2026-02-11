"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

type Intent = "consult" | "preapproval" | "question" | "package";

type Props = {
  /** Optional overrides; if omitted, we read from the URL */
  defaultIntent?: Intent;
  defaultPackage?: string;
};

type ServiceOption = { slug: string; label: string };

/** Keep labels EXACTLY matching your Services page titles when used in TITLE_TO_SLUG_EN below */
const SERVICE_OPTIONS: ServiceOption[] = [
  // Current services (strategy funnel)
  { slug: "discovery-call-free", label: "Free Discovery Call (15 min)" },
  { slug: "clarity-direction-60", label: "Clarity & Direction Session (60 min)" },
  { slug: "clarity-direction-90", label: "Clarity & Direction Session - Extended (90 min)" },
  { slug: "strategic-map-tier-1", label: "Tier 1: Goal-Specific Strategic Map" },
  { slug: "strategic-map-tier-2", label: "Tier 2: Integrated Strategic Map" },
  { slug: "strategic-map-tier-3", label: "Tier 3: Holistic Life & Financial Strategic Map" },
  { slug: "coaching-foundations", label: "Coaching & Foundations" },
  { slug: "workshops-general", label: "Workshops" },
  { slug: "foundations-small-group", label: "Foundations & Small Group Programs" },
  { slug: "mortgage-preapproval-planning", label: "Pre-Approval Planning" },
  { slug: "mortgage-offer-financing", label: "Offer & Financing Strategy" },
  { slug: "business-cashflow-session", label: "Business Strategy & Cash Flow Session" },
  { slug: "tax-coordination-session", label: "Tax Planning Coordination Session" },

  // 1:1 Advisory
  { slug: "private-discovery-call", label: "Private Discovery Call" },
  { slug: "blueprint-90min", label: "90-Minute Blueprint Session" },
  { slug: "align-3-sessions", label: "Align (3-Session Package)" },
  { slug: "transform-6-sessions", label: "Transform (6-Session Package)" },
  { slug: "elevate-premium", label: "Elevate (Premium Transformation Package)" },
  { slug: "alumni-retainer-monthly", label: "Alumni Monthly Retainer" },

  // Wealth Foundations
  { slug: "family-wealth-blueprint-fhsa", label: "Family Wealth Blueprint (with FHSA Options)" },
  { slug: "pro-tune-up-90d", label: "Professional Financial Tune-Up (90 Days)" },

  // Mortgage & Property
  { slug: "mortgage-concierge-preapproval", label: "Mortgage Concierge — Readiness & Pre-Approval" },
  { slug: "refinance-renewal-strategy", label: "Refinance & Renewal Strategy" },
  { slug: "investment-starter-4-10-units", label: "Investment Starter: 4–10 Units (DSCR)" },

  // Business & Professionals
  { slug: "exec-wealth-teaming", label: "Executive Wealth Teaming (Founder/Professional)" },
  { slug: "incorporation-pay-yourself", label: "Incorporation / Pay-Yourself Clinic" },

  // Legacy & Tax Strategy
  { slug: "tax-session-personal-family", label: "Personal / Family Tax Strategy Session" },
  { slug: "legacy-tax-rhythm-annual", label: "Legacy & Tax Rhythm (Annual)" },
  { slug: "small-biz-setup-90d", label: "Small-Biz / Independent 90-Day Setup" },

  // Holistic Conversations (Family & Groups)
  { slug: "kitchen-table-4-week-cohort", label: "Kitchen Table Conversations — 4-Week Cohort" },
  { slug: "kitchen-table-monthly-circle", label: "Kitchen Table Conversations — Monthly Circle" },

  // Newcomers
  { slug: "newcomer-wealth-integration", label: "Newcomer Wealth Integration (30 Days)" },

  // Catch-alls
  { slug: "just-connect", label: "Just want to connect / Not sure yet" },
  { slug: "other", label: "Other (describe below)" },
];

/** Map the exact package Title (from services page ?package=Title) → the dropdown slug above */
const TITLE_TO_SLUG_EN: Record<string, string> = {
  // Current services (strategy funnel)
  "Free Discovery Call": "discovery-call-free",
  "Free Discovery Call (15 min)": "discovery-call-free",
  "Clarity & Direction Session (60 min)": "clarity-direction-60",
  "Clarity & Direction Session - Extended (90 min)": "clarity-direction-90",
  "Tier 1: Goal-Specific Strategic Map": "strategic-map-tier-1",
  "Tier 2: Integrated Strategic Map": "strategic-map-tier-2",
  "Tier 3: Holistic Life & Financial Strategic Map": "strategic-map-tier-3",
  "Coaching & Foundations": "coaching-foundations",
  Workshops: "workshops-general",
  "Foundations & Small Group Programs": "foundations-small-group",
  "Pre-Approval Planning": "mortgage-preapproval-planning",
  "Offer & Financing Strategy": "mortgage-offer-financing",
  "Business Strategy & Cash Flow Session": "business-cashflow-session",
  "Tax Planning Coordination Session": "tax-coordination-session",

  // 1:1 Advisory
  "Private Discovery Call": "private-discovery-call",
  "90-Minute Blueprint Session": "blueprint-90min",
  "Align (3-Session Package)": "align-3-sessions",
  "Transform (6-Session Package)": "transform-6-sessions",
  "Elevate (Premium Transformation Package)": "elevate-premium",
  "Alumni Monthly Retainer": "alumni-retainer-monthly",

  // Wealth Foundations
  "Family Wealth Blueprint (with FHSA Options)": "family-wealth-blueprint-fhsa",
  "Professional Financial Tune-Up (90 Days)": "pro-tune-up-90d",

  // Mortgage & Property
  "Mortgage Concierge — Readiness & Pre-Approval": "mortgage-concierge-preapproval",
  "Refinance & Renewal Strategy": "refinance-renewal-strategy",
  "Investment Starter: 4–10 Units (DSCR)": "investment-starter-4-10-units",

  // Business & Professionals
  "Executive Wealth Teaming (Founder/Professional)": "exec-wealth-teaming",
  "Incorporation / Pay-Yourself Clinic": "incorporation-pay-yourself",

  // Legacy & Tax Strategy
  "Personal / Family Tax Strategy Session": "tax-session-personal-family",
  "Legacy & Tax Rhythm (Annual)": "legacy-tax-rhythm-annual",
  "Small-Biz / Independent 90-Day Setup": "small-biz-setup-90d",

  // Holistic Conversations
  "Kitchen Table Conversations — 4-Week Cohort": "kitchen-table-4-week-cohort",
  "Kitchen Table Conversations — Monthly Circle": "kitchen-table-monthly-circle",

  // Newcomers
  "Newcomer Wealth Integration (30 Days)": "newcomer-wealth-integration",

  // Backward-compatibility (older wording that might still be in some links)
  "Discovery Call": "private-discovery-call",
  "Discovery Call (Free)": "private-discovery-call",
  "Personal Blueprint Session": "blueprint-90min",
  "3-Month Alignment Package": "align-3-sessions",
  "6-Month Transformation Package": "transform-6-sessions",
  "Continued Guidance Retainer": "alumni-retainer-monthly",
  "Kitchen Table Conversations (4 Weeks)": "kitchen-table-4-week-cohort",
  "Kitchen Table Monthly": "kitchen-table-monthly-circle",
};

function usePlainSearch() {
  const sp = useSearchParams();
  // Clone to a stable URLSearchParams we control (avoids hydration mismatch)
  return new URLSearchParams(sp?.toString() ?? "");
}

const safeDecode = (v: string | null) => {
  try {
    return v ? decodeURIComponent(v) : undefined;
  } catch {
    return v ?? undefined;
  }
};

// Local helper type to allow keepalive without `any`
type RequestInitWithKeepAlive = RequestInit & { keepalive?: boolean };

export default function ContactForm(props: Props) {
  const ps = usePlainSearch();
  const urlIntent = (ps.get("intent") as Intent | null) ?? undefined;
  const urlPackage = safeDecode(ps.get("package"));

  const effectiveIntent: Intent = props.defaultIntent ?? urlIntent ?? "consult";
  const effectivePackage = props.defaultPackage ?? urlPackage;

  // Derive the initial slug just once for first render
  const derivedInitialSlug = useMemo(() => {
    if (effectiveIntent === "preapproval") return "mortgage-concierge-preapproval";
    if (effectiveIntent === "consult") {
      const mapped = effectivePackage ? TITLE_TO_SLUG_EN[effectivePackage] : undefined;
      return mapped ?? "private-discovery-call";
    }
    if (effectiveIntent === "question") return "just-connect";
    if (effectiveIntent === "package") {
      const mapped = effectivePackage ? TITLE_TO_SLUG_EN[effectivePackage] : undefined;
      return mapped ?? "private-discovery-call";
    }
    return "private-discovery-call";
  }, [effectiveIntent, effectivePackage]);

  // Make the select controlled (prevents “shows after refresh” issues)
  const [serviceSlug, setServiceSlug] = useState<string>(derivedInitialSlug);

  // If props/URL change (client-side nav), sync once
  useEffect(() => {
    setServiceSlug(derivedInitialSlug);
  }, [derivedInitialSlug]);

  const defaultMessage = useMemo(() => {
    if (!effectivePackage) return "";
    // Prefill so users see what they clicked
    return `Regarding: ${effectivePackage}\n`;
  }, [effectivePackage]);

  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "sending") return;

    setStatus("sending");
    setError(null);

    const form = e.currentTarget;

    const payload = {
      name: (form.elements.namedItem("name") as HTMLInputElement).value,
      email: (form.elements.namedItem("email") as HTMLInputElement).value,
      phone: (form.elements.namedItem("phone") as HTMLInputElement).value,
      service: SERVICE_OPTIONS.find((o) => o.slug === serviceSlug)?.label || "",
      serviceSlug,
      intent: effectiveIntent,
      pkg: effectivePackage ?? "",
      message: (form.elements.namedItem("message") as HTMLTextAreaElement).value,
      preferredContact:
        ((form.elements.namedItem("preferredContact") as RadioNodeList | null)?.value as
          | "email"
          | "whatsapp"
          | "phone"
          | undefined) || "email",
      pagePath:
        typeof window !== "undefined"
          ? window.location.pathname + window.location.search
          : "",
      referrer: typeof document !== "undefined" ? document.referrer || "" : "",
    };

    try {
      const fetchOpts: RequestInitWithKeepAlive = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        // use keepalive in browsers that support it, without `any`
        ...(typeof window !== "undefined" ? { keepalive: true } : {}),
      };

      const res = await fetch("/api/contact", fetchOpts);

      if (res.ok) {
        setStatus("success");
        form.reset();
        // Keep the selected option after success so context isn’t lost
        setServiceSlug(derivedInitialSlug);
        return;
      }

      const data: { error?: string } = await res.json().catch(() => ({} as { error?: string }));
      setStatus("error");
      setError(data?.error || "Something went wrong. Please try again.");
    } catch {
      setStatus("error");
      setError("There was an issue sending your message. Please try again.");
    }
  }

  const isPreapproval = effectiveIntent === "preapproval";

  return (
    <form
      className={[
        // Match the site “panel/table” look for perfect consistency
        "bg-white/95 rounded-[28px] border border-brand-gold/40 shadow-lg backdrop-blur-[1px]",
        "p-8 mb-12 space-y-5 max-w-xl mx-auto",
      ].join(" ")}
      onSubmit={handleSubmit}
      aria-label="Contact Fanny and her Team"
      noValidate
    >
      {/* Hidden fields for backend context */}
      <input type="hidden" name="intent" value={effectiveIntent} />
      {effectivePackage ? <input type="hidden" name="package" value={effectivePackage} /> : null}

      <div>
        <label className="block font-semibold mb-1 text-brand-blue" htmlFor="name">
          Name
        </label>
        <input
          className="w-full p-3 rounded-xl border border-brand-green/30 bg-white focus:border-brand-gold focus:ring-2 focus:ring-brand-gold transition text-brand-green"
          type="text"
          id="name"
          name="name"
          autoComplete="name"
          required
        />
      </div>

      <div>
        <label className="block font-semibold mb-1 text-brand-blue" htmlFor="email">
          Email
        </label>
        <input
          className="w-full p-3 rounded-xl border border-brand-green/30 bg-white focus:border-brand-gold focus:ring-2 focus:ring-brand-gold transition text-brand-green"
          type="email"
          id="email"
          name="email"
          autoComplete="email"
          required
        />
      </div>

      <div>
        <label className="block font-semibold mb-1 text-brand-blue" htmlFor="phone">
          Phone
        </label>
        <input
          className="w-full p-3 rounded-xl border border-brand-green/30 bg-white focus:border-brand-gold focus:ring-2 focus:ring-brand-gold transition text-brand-green"
          type="tel"
          id="phone"
          name="phone"
          inputMode="tel"
          autoComplete="tel"
        />
      </div>

      {/* Service/Package */}
      <div>
        <label className="block font-semibold mb-1 text-brand-blue" htmlFor="service">
          Which service or package are you interested in?
        </label>
        <select
          className="w-full p-3 rounded-xl border border-brand-green/30 bg-white focus:border-brand-gold focus:ring-2 focus:ring-brand-gold transition text-brand-green"
          id="service"
          name="service"
          value={serviceSlug}
          onChange={(e) => setServiceSlug(e.currentTarget.value)}
          required
        >
          {/* Accessible prompt */}
          <option value="" disabled>
            Please select...
          </option>
          {SERVICE_OPTIONS.map((opt) => (
            <option key={opt.slug} value={opt.slug}>
              {opt.label}
            </option>
          ))}
        </select>

        {isPreapproval && (
          <p className="mt-2 text-xs text-brand-body/80">
            Pre-approval checks mortgage eligibility. It’s not required for coaching clients.
          </p>
        )}
      </div>

      {/* Preferred contact method */}
      <fieldset className="rounded-xl border border-brand-green/20 p-3">
        <legend className="px-1 text-sm text-brand-blue/80">Preferred contact method</legend>
        <div className="flex flex-wrap gap-4 mt-1">
          <label className="inline-flex items-center gap-2">
            <input type="radio" name="preferredContact" value="email" defaultChecked />
            <span>Email</span>
          </label>
          <label className="inline-flex items-center gap-2">
            <input type="radio" name="preferredContact" value="whatsapp" />
            <span>WhatsApp</span>
          </label>
          <label className="inline-flex items-center gap-2">
            <input type="radio" name="preferredContact" value="phone" />
            <span>Phone</span>
          </label>
        </div>
      </fieldset>

      <div>
        <label className="block font-semibold mb-1 text-brand-blue" htmlFor="message">
          Message
        </label>
        <textarea
          className="w-full p-3 rounded-xl border border-brand-green/30 bg-white focus:border-brand-gold focus:ring-2 focus:ring-brand-gold transition text-brand-green"
          id="message"
          name="message"
          rows={4}
          placeholder="Tell us how we can help or ask any questions."
          defaultValue={defaultMessage}
        />
      </div>

      {/* Status */}
      {status === "success" && (
        <div className="text-green-700 bg-green-100 rounded-xl p-3 text-center mb-2">
          Your message has been sent. Thank you!
        </div>
      )}
      {status === "error" && (
        <div className="text-red-700 bg-red-100 rounded-xl p-3 text-center mb-2">
          {error || "There was an error sending your message. Please try again."}
        </div>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        className="w-full px-8 py-3 bg-brand-gold text-brand-green rounded-full font-serif font-bold shadow-lg hover:bg-brand-blue hover:text-white transition text-lg disabled:opacity-70"
      >
        {status === "sending" ? "Sending..." : "Request Info / Book"}
      </button>
    </form>
  );
}
