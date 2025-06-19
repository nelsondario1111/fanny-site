// --- SEO METADATA --- //
export const metadata = {
  title: "Investment & Packages | Fanny Samaniego Coaching – Transparent Holistic Pricing",
  description:
    "Explore transparent, heart-centered pricing for all holistic financial coaching services. Compare packages, book a discovery call, or find group and corporate options in English or Spanish.",
  openGraph: {
    title: "Investment & Packages | Fanny Samaniego Coaching",
    description:
      "Compare holistic financial coaching packages, private sessions, group programs, and workshops with transparent pricing. All services available in English or Spanish.",
    url: "https://fannysamaniego.com/en/investment",
    siteName: "Fanny Samaniego Coaching",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Investment & Packages | Fanny Samaniego Coaching",
    description: "Transparent, heart-centered pricing for all holistic financial coaching services. Compare all options.",
  },
};

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

const services = [
  {
    name: "Discovery Call",
    icon: <FaPhoneAlt className="text-brand-green text-2xl" />,
    description:
      "A free, friendly conversation to get to know you, your needs, and your goals—no pressure, no commitment. Let's see if we're a fit.",
    color: "bg-brand-green/10 border-brand-green",
    cta: "Book Free Call",
    link: "/en/contact",
    price: "Free (30 min)",
  },
  {
    name: "Financial Clarity Session",
    icon: <FaDollarSign className="text-brand-gold text-2xl" />,
    description:
      "A focused session to clarify your biggest financial question—budgeting, taxes, home buying, or any money challenge. Get personalized next steps and peace of mind.",
    color: "bg-brand-gold/10 border-brand-gold",
    cta: "Book Session",
    link: "/en/contact",
    price: "$180 (90 min)",
  },
  {
    name: "3-Month Wellness Package",
    icon: <FaLeaf className="text-brand-green text-2xl" />,
    description:
      "Guided support to build strong money habits, create a clear plan, and make real progress on your financial journey—together, step by step.",
    color: "bg-brand-green/10 border-brand-green",
    cta: "Learn More",
    link: "/en/investment",
    price: "$480 (3 months, 3 sessions)",
  },
  {
    name: "6-Month Holistic Package",
    icon: <FaUsers className="text-brand-blue text-2xl" />,
    description:
      "Deep transformation and ongoing support for life changes, major financial goals, or holistic planning for you (and your partner or family).",
    color: "bg-brand-blue/10 border-brand-blue",
    cta: "Learn More",
    link: "/en/investment",
    price: "$850 (6 months, 6 sessions)",
  },
  {
    name: "Ongoing Retainer (Alumni Only)",
    icon: <FaRegLightbulb className="text-brand-blue text-2xl" />,
    description:
      "Stay connected and supported with monthly check-ins and ongoing guidance for alumni clients. For steady growth and accountability.",
    color: "bg-brand-blue/10 border-brand-blue",
    cta: "Reconnect",
    link: "/en/contact",
    price: "$90/month (alumni only)",
  },
  {
    name: "Money Circle (Group, 4 Weeks)",
    icon: <FaComments className="text-brand-blue text-2xl" />,
    description:
      "A small, supportive group to learn, share, and grow together around money and abundance. Empowerment and community in a safe space.",
    color: "bg-brand-blue/10 border-brand-blue",
    cta: "Join Next Circle",
    link: "/en/contact",
    price: "$120 (4 weeks, group)",
  },
  {
    name: "Money Circle (Monthly)",
    icon: <FaComments className="text-brand-gold text-2xl" />,
    description:
      "Ongoing monthly group sessions for continued support, inspiration, and practical learning.",
    color: "bg-brand-gold/10 border-brand-gold",
    cta: "Join Monthly",
    link: "/en/contact",
    price: "$35/month (group)",
  },
  {
    name: "Workshops (Public/Community)",
    icon: <FaHandshake className="text-brand-gold text-2xl" />,
    description:
      "Interactive workshops on budgeting, taxes, home buying, and more—for communities, organizations, and the public.",
    color: "bg-brand-gold/10 border-brand-gold",
    cta: "Request Info",
    link: "/en/contact",
    price: "From $250 (custom)",
  },
  {
    name: "Workshops (Corporate/Org)",
    icon: <FaHandshake className="text-brand-blue text-2xl" />,
    description:
      "Custom workshops for companies and organizations. Empower your team with financial wellness tools, English or Spanish.",
    color: "bg-brand-blue/10 border-brand-blue",
    cta: "Book Workshop",
    link: "/en/contact",
    price: "From $500 (custom)",
  },
];

export default function Investment() {
  return (
    <main className="bg-brand-beige min-h-screen py-20 px-2">
      {/* HERO / HEADER */}
      <section className="max-w-4xl mx-auto text-center mb-12">
        <h1 className="font-serif text-4xl md:text-5xl text-brand-green font-bold mb-3 flex items-center justify-center gap-2">
          <span aria-hidden="true">💸</span>
          Investment & Packages
        </h1>
        <p className="text-lg text-brand-blue mb-3">
          Transparent, heart-centered pricing—so you always know what to expect.
        </p>
        <p className="text-brand-body mb-2">
          All services are available in English or Spanish.<br />
          Every journey starts with a free, no-pressure discovery call.
        </p>
      </section>

      {/* COMPARISON TABLE */}
      <section className="max-w-6xl mx-auto mb-14 overflow-x-auto">
        <table className="w-full bg-white rounded-2xl shadow-lg border border-brand-gold text-left text-base">
          <thead>
            <tr className="bg-brand-green text-white">
              <th className="py-3 px-4 rounded-tl-2xl min-w-[120px]">Service</th>
              <th className="py-3 px-4">What’s Included</th>
              <th className="py-3 px-4 rounded-tr-2xl min-w-[140px]">Investment (CAD)</th>
            </tr>
          </thead>
          <tbody>
            {services.map((service) => (
              <tr key={service.name} className="border-t border-brand-gold/20">
                <td className="py-3 px-4 font-bold align-top">{service.name}</td>
                <td className="py-3 px-4 align-top">{service.description}</td>
                <td className="py-3 px-4 align-top font-semibold text-brand-green">{service.price}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* SERVICE CARD GRID */}
      <section className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
        {services.map((service) => (
          <div
            key={service.name}
            className={`rounded-2xl border-2 ${service.color} shadow-xl p-8 flex flex-col items-center text-center transition hover:-translate-y-1 hover:shadow-2xl`}
          >
            <div className="mb-4 w-14 h-14 flex items-center justify-center rounded-full bg-white shadow-lg border">
              {service.icon}
            </div>
            <h3 className="font-serif text-xl font-bold mb-2">{service.name}</h3>
            <p className="text-brand-body mb-4">{service.description}</p>
            <p className="font-semibold text-brand-green text-lg mb-3">{service.price}</p>
            <Link href={service.link}>
              <button
                type="button"
                className="bg-brand-gold text-brand-green px-5 py-2 rounded-full shadow hover:bg-brand-blue hover:text-white font-semibold transition focus:outline-none focus:ring-2 focus:ring-brand-gold"
                aria-label={service.cta}
              >
                {service.cta}
              </button>
            </Link>
          </div>
        ))}
      </section>

      {/* FAQ SECTION */}
      <section className="max-w-3xl mx-auto mb-14">
        <h2 className="text-2xl font-serif font-bold text-brand-green mb-4 flex items-center gap-2">
          <span aria-hidden="true">❓</span>
          FAQ
        </h2>
        <div className="mb-3">
          <span className="font-semibold text-brand-blue">
            How do I know which package is best?
          </span>
          <p className="text-brand-body ml-3">
            Let’s start with a free discovery call and figure it out together, no pressure.
          </p>
        </div>
        <div className="mb-3">
          <span className="font-semibold text-brand-blue">Do you offer a sliding scale?</span>
          <p className="text-brand-body ml-3">
            Yes! Accessibility matters to me. If cost is a barrier, please reach out. I reserve a few sliding-scale spots each season.
          </p>
        </div>
        <div className="mb-3">
          <span className="font-semibold text-brand-blue">
            Can I work with you in Spanish?
          </span>
          <p className="text-brand-body ml-3">
            ¡Por supuesto! All services are available in both English and Spanish.
          </p>
        </div>
        <div className="mb-3">
          <span className="font-semibold text-brand-blue">
            Can couples or families join sessions?
          </span>
          <p className="text-brand-body ml-3">
            Yes, just let me know. I’m happy to adapt sessions to include your partner or family.
          </p>
        </div>
      </section>

      {/* SLIDING SCALE / ACCESSIBILITY NOTE */}
      <section className="max-w-xl mx-auto bg-brand-beige border-l-4 border-brand-gold rounded-2xl p-6 shadow text-center mb-12">
        <p className="text-brand-body font-semibold">
          <FaHandshake className="inline-block text-brand-gold text-xl mr-2" />
          Accessibility is important to me. If cost is a barrier, please reach out—I offer a limited number of sliding scale spots each season.
        </p>
      </section>
    </main>
  );
}
