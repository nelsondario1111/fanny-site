"use client";
import Link from "next/link";
import {
  FaLeaf,
  FaUsers,
  FaDollarSign,
  FaComments,
  FaHandshake,
  FaRegLightbulb,
  FaPhoneAlt,
} from "react-icons/fa";

// Stripe Price IDs for checkout (adjust or remove if not using Stripe)
const stripePriceIds: Record<string, string> = {
  "Financial Clarity Session": "price_1RbuXGGCaTZ2y7NiZPf427KX",
  "3-Month Wellness Package": "price_1RbucDGCaTZ2y7NiyiE14R3T",
  "6-Month Holistic Package": "price_1RbudEGCaTZ2y7NidoHDofUu",
  "Ongoing Retainer (Alumni Only)": "price_1RbuelGCaTZ2y7Nixqkwp1ao",
  "Money Circle (Group, 4 Weeks)": "price_1RbuiWGCaTZ2y7NiA3gZhEQ1",
  "Money Circle (Monthly)": "price_1RbujPGCaTZ2y7Ni8nes6Hyp",
  "Workshops (Public/Community)": "price_1RbukJGCaTZ2y7NiixcmYSTx",
  "Workshops (Corporate/Org)": "price_1Rbul2GCaTZ2y7NizItd4dkc",
};

const services = [
  {
    name: "Discovery Call",
    icon: <FaPhoneAlt className="text-brand-green text-2xl" />,
    description:
      "A complimentary, relaxed conversation to connect, understand your story, and see if we’re a good fit—no pressure or expectations.",
    color: "bg-brand-green/10 border-brand-green",
    price: "Free (30 min)",
    primary: true,
    cta: "Book Free Call",
    action: "link",
    link: "/en/contact",
  },
  {
    name: "Financial Clarity Session",
    icon: <FaDollarSign className="text-brand-gold text-2xl" />,
    description:
      "A focused session to bring light to your most important financial question—budgeting, taxes, home buying, or anything you wish. Receive gentle clarity and personalized next steps.",
    color: "bg-brand-gold/10 border-brand-gold",
    price: "$180 (90 min)",
    cta: "Book Now",
    action: "stripe",
  },
  {
    name: "3-Month Wellness Package",
    icon: <FaLeaf className="text-brand-green text-2xl" />,
    description:
      "Gentle guidance and support to grow healthier money habits, craft a clear plan, and make real, lasting progress—together, step by step.",
    color: "bg-brand-green/10 border-brand-green",
    price: "$480 (3 months, 3 sessions)",
    cta: "Book Now",
    action: "stripe",
  },
  {
    name: "6-Month Holistic Package",
    icon: <FaUsers className="text-brand-blue text-2xl" />,
    description:
      "Deep transformation and ongoing support for big life changes, major financial goals, or holistic planning—for you, and for your partner or family if you wish.",
    color: "bg-brand-blue/10 border-brand-blue",
    price: "$850 (6 months, 6 sessions)",
    cta: "Book Now",
    action: "stripe",
  },
  {
    name: "Ongoing Retainer (Alumni Only)",
    icon: <FaRegLightbulb className="text-brand-blue text-2xl" />,
    description:
      "Stay connected with monthly check-ins and gentle guidance for alumni clients—steady encouragement, clarity, and growth.",
    color: "bg-brand-blue/10 border-brand-blue",
    price: "$90/month (alumni only)",
    cta: "Book Now",
    action: "stripe",
  },
  {
    name: "Money Circle (Group, 4 Weeks)",
    icon: <FaComments className="text-brand-blue text-2xl" />,
    description:
      "A small, welcoming group for learning, sharing, and growing together around money and abundance. True empowerment, true community—always safe.",
    color: "bg-brand-blue/10 border-brand-blue",
    price: "$120 (4 weeks, group)",
    cta: "Join Now",
    action: "stripe",
  },
  {
    name: "Money Circle (Monthly)",
    icon: <FaComments className="text-brand-gold text-2xl" />,
    description:
      "Gentle monthly gatherings for continued support, inspiration, and practical learning—open community, whenever you need it.",
    color: "bg-brand-gold/10 border-brand-gold",
    price: "$35/month (group)",
    cta: "Join Now",
    action: "stripe",
  },
  {
    name: "Workshops (Public/Community)",
    icon: <FaHandshake className="text-brand-gold text-2xl" />,
    description:
      "Interactive, down-to-earth workshops on budgeting, taxes, home buying, and more—for communities, organizations, and the public.",
    color: "bg-brand-gold/10 border-brand-gold",
    price: "From $250 (custom)",
    cta: "Request Info",
    action: "link",
    link: "/en/contact",
  },
  {
    name: "Workshops (Corporate/Org)",
    icon: <FaHandshake className="text-brand-blue text-2xl" />,
    description:
      "Custom workshops for companies and organizations. Empower your team with holistic financial wellness—in English or Spanish.",
    color: "bg-brand-blue/10 border-brand-blue",
    price: "From $500 (custom)",
    cta: "Request Info",
    action: "link",
    link: "/en/contact",
  },
];

export default function Services() {
  // Stripe checkout handler
  const handleCheckout = async (serviceName: string) => {
    const priceId = stripePriceIds[serviceName];
    if (!priceId) {
      window.location.href = "/en/contact";
      return;
    }
    const res = await fetch("/api/create-checkout-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ priceId }),
    });
    const { url } = await res.json();
    window.location.href = url;
  };

  return (
    <main className="bg-brand-beige min-h-screen py-12 px-2">
      {/* HERO */}
      <section className="max-w-5xl mx-auto bg-white/95 rounded-3xl shadow-xl border border-brand-gold p-8 md:p-12 mb-12">
        <div className="text-center mb-10">
          <h1 className="font-serif text-4xl md:text-5xl text-brand-green font-bold mb-3 flex items-center justify-center gap-2">
            
            Ways to Work Together
          </h1>
           <div className="flex justify-center mb-8">
          <div className="w-20 border-t-4 border-brand-gold rounded-full"></div>
        </div>
          <p className="text-lg text-brand-blue mb-3">
            Warm, holistic, and practical support for your financial wellbeing—transparent and always by invitation.
          </p>
          <p className="text-brand-body mb-2">
            Whether you’re seeking focused guidance, a transformational journey, or a nurturing community, I offer partnership with compassion, clarity, and care—in English or Spanish.
          </p>
        </div>

        {/* CARD GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {services.map((service) => (
            <div
              key={service.name}
              className={`rounded-2xl border-2 ${service.color} shadow-xl p-8 flex flex-col items-center text-center transition hover:-translate-y-1 hover:shadow-2xl`}
            >
              <div className="mb-4 w-14 h-14 flex items-center justify-center rounded-full bg-white shadow-lg border">
                {service.icon}
              </div>
              <h3 className="font-serif text-xl font-bold mb-2">{service.name}</h3>
              <p className="text-brand-body mb-2">{service.description}</p>
              <p className="font-semibold text-brand-green mb-4">{service.price}</p>
              {/* Action Button */}
              {service.action === "stripe" ? (
                <button
                  type="button"
                  onClick={() => handleCheckout(service.name)}
                  className="bg-brand-gold text-brand-green px-5 py-2 rounded-full shadow hover:bg-brand-blue hover:text-white font-semibold transition focus:outline-none focus:ring-2 focus:ring-brand-gold"
                  aria-label={service.cta}
                >
                  {service.cta}
                </button>
              ) : (
                <Link href={service.link || "#"}>
                  <button
                    type="button"
                    className="bg-brand-gold text-brand-green px-5 py-2 rounded-full shadow hover:bg-brand-blue hover:text-white font-semibold transition focus:outline-none focus:ring-2 focus:ring-brand-gold"
                    aria-label={service.cta}
                  >
                    {service.cta}
                  </button>
                </Link>
              )}
            </div>
          ))}
        </div>

        {/* Invitation Note */}
        <div className="bg-brand-beige border-l-4 border-brand-gold rounded-2xl p-6 shadow text-center mb-4">
          <p className="text-brand-body font-semibold">
            Every partnership starts with an open invitation.<br />
            Book a complimentary discovery call—no pressure, just a warm and genuine conversation.
          </p>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="max-w-3xl mx-auto mb-14 bg-white/95 rounded-2xl shadow-lg border border-brand-gold p-8">
        <h2 className="text-2xl font-serif font-bold text-brand-green mb-4 flex items-center gap-2">
          <span aria-hidden="true">❓</span>
          Frequently Asked Questions
        </h2>
        <div className="mb-3">
          <span className="font-semibold text-brand-blue">
            How do I know which package is right for me?
          </span>
          <p className="text-brand-body ml-3">
            Let’s start with a complimentary discovery call—my first invitation is always a real, no-pressure conversation.
          </p>
        </div>
        <div className="mb-3">
          <span className="font-semibold text-brand-blue">
            Do you offer sliding scale pricing?
          </span>
          <p className="text-brand-body ml-3">
            Yes! Accessibility is close to my heart. If cost is ever a concern, please reach out and let’s talk—I always reserve a few sliding-scale spots each season.
          </p>
        </div>
        <div className="mb-3">
          <span className="font-semibold text-brand-blue">
            Can I work with you in Spanish?
          </span>
          <p className="text-brand-body ml-3">
            ¡Por supuesto! All guidance is available in both English and Spanish—just let me know your preference.
          </p>
        </div>
        <div className="mb-3">
          <span className="font-semibold text-brand-blue">
            Can my partner or family join sessions?
          </span>
          <p className="text-brand-body ml-3">
            Absolutely—just share your situation and I’ll adapt the process to whatever you need.
          </p>
        </div>
      </section>

      {/* SLIDING SCALE / ACCESSIBILITY NOTE */}
      <section className="max-w-xl mx-auto bg-brand-beige border-l-4 border-brand-gold rounded-2xl p-6 shadow text-center mb-12">
        <p className="text-brand-body font-semibold">
          <FaHandshake className="inline-block text-brand-gold text-xl mr-2" />
          Accessibility is at the heart of my mission. If cost is ever a barrier, please reach out—there are always a few sliding-scale spots reserved for those who need them.
        </p>
      </section>
    </main>
  );
}
