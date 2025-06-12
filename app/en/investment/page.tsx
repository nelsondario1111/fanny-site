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
      "30-min intro (Zoom/phone). Let's connect, see your goals, and decide together—no obligation.",
    price: "Free",
    color: "bg-brand-green/10 border-brand-green",
    cta: "Book Free Call",
    link: "/contact",
  },
  {
    name: "Financial Clarity Session",
    icon: <FaDollarSign className="text-brand-gold text-2xl" />,
    description:
      "A focused, 60-min private session on your biggest financial question—budget, debt, taxes, home buying and more. Includes written next steps.",
    price: "$250 CAD",
    color: "bg-brand-gold/10 border-brand-gold",
    cta: "Book Session",
    link: "/contact",
  },
  {
    name: "3-Month Wellness Package",
    icon: <FaLeaf className="text-brand-green text-2xl" />,
    description:
      "6 biweekly coaching sessions + personalized plan, check-ins, and practical tools. Perfect for building new money habits.",
    price: "$1,500 CAD (or 3 × $540/mo)",
    color: "bg-brand-green/10 border-brand-green",
    cta: "Start Your Journey",
    link: "/contact",
  },
  {
    name: "6-Month Holistic Package",
    icon: <FaUsers className="text-brand-blue text-2xl" />,
    description:
      "12 biweekly sessions with a full holistic plan (budget, tax, mortgage prep). Unlimited email support. Add partner/spouse: +$400.",
    price: "$3,000 CAD (or 6 × $540/mo)",
    color: "bg-brand-blue/10 border-brand-blue",
    cta: "Let’s Begin",
    link: "/contact",
  },
  {
    name: "Ongoing Retainer (alumni only)",
    icon: <FaRegLightbulb className="text-brand-blue text-2xl" />,
    description:
      "1 private check-in per month + ongoing email support. Only for returning clients.",
    price: "$135/mo",
    color: "bg-brand-blue/10 border-brand-blue",
    cta: "Reconnect",
    link: "/contact",
  },
  {
    name: "Money Circle (Group, 4 Weeks)",
    icon: <FaComments className="text-brand-blue text-2xl" />,
    description:
      "4 × 90-min small group sessions, supportive community, and workbook. Build financial confidence together.",
    price: "$300/person",
    color: "bg-brand-blue/10 border-brand-blue",
    cta: "Join Next Circle",
    link: "/contact",
  },
  {
    name: "Money Circle (Ongoing, Monthly)",
    icon: <FaComments className="text-brand-gold text-2xl" />,
    description:
      "Stay connected with a monthly group for ongoing support, accountability, and new topics every time.",
    price: "$80/person/mo",
    color: "bg-brand-gold/10 border-brand-gold",
    cta: "Join Monthly",
    link: "/contact",
  },
  {
    name: "Workshops (Public/Community)",
    icon: <FaHandshake className="text-brand-gold text-2xl" />,
    description:
      "60–90 min on budgeting, taxes, home buying, and more. Community topics: $0–$65/attendee.",
    price: "$0–$65/attendee",
    color: "bg-brand-gold/10 border-brand-gold",
    cta: "Request Info",
    link: "/contact",
  },
  {
    name: "Workshops (Corporate/Org)",
    icon: <FaHandshake className="text-brand-blue text-2xl" />,
    description:
      "Tailored 60–90 min for organizations, teams, or companies. Available English/Spanish. From $675/session.",
    price: "From $675/session",
    color: "bg-brand-blue/10 border-brand-blue",
    cta: "Book Workshop",
    link: "/contact",
  },
];

export default function Investment() {
  return (
    <main className="bg-brand-beige min-h-screen py-12 px-2">
      {/* Banner */}
      <section className="max-w-2xl mx-auto text-center mb-10">
        <h1 className="font-serif text-4xl md:text-5xl text-brand-green font-bold mb-3">
          Investment & Packages
        </h1>
        <p className="text-lg text-brand-blue mb-3">
          Transparent, heart-centered pricing—so you always know what to expect.
        </p>
        <p className="text-brand-body mb-2">
          All services are available in English or Spanish.
          Every journey starts with a free, no-pressure discovery call.
        </p>
      </section>

      {/* Table for Quick Comparison */}
      <section className="max-w-5xl mx-auto mb-10 overflow-x-auto">
        <table className="w-full bg-white rounded-2xl shadow-lg border border-brand-gold text-left text-base">
          <thead>
            <tr className="bg-brand-green text-white">
              <th className="py-3 px-4 rounded-tl-2xl">Service</th>
              <th className="py-3 px-4">What’s Included</th>
              <th className="py-3 px-4 rounded-tr-2xl">Investment (CAD)</th>
            </tr>
          </thead>
          <tbody>
            {services.map((service) => (
              <tr key={service.name}>
                <td className="py-3 px-4 font-bold">{service.name}</td>
                <td className="py-3 px-4">{service.description}</td>
                <td className="py-3 px-4">{service.price}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Card Grid */}
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
              <button className="bg-brand-gold text-brand-green px-5 py-2 rounded-full shadow hover:bg-brand-blue hover:text-white font-semibold transition">
                {service.cta}
              </button>
            </Link>
          </div>
        ))}
      </section>

      {/* FAQ */}
      <section className="max-w-3xl mx-auto mb-12">
        <h2 className="text-2xl font-serif font-bold text-brand-green mb-4">FAQ</h2>
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

      {/* Sliding Scale Note */}
      <section className="max-w-xl mx-auto bg-brand-beige border-l-4 border-brand-gold rounded-2xl p-6 shadow text-center mb-12">
        <p className="text-brand-body font-semibold">
          <FaHandshake className="inline-block text-brand-gold text-xl mr-2" />
          Accessibility is important to me. If cost is a barrier, please reach out—I offer a limited number of sliding scale spots each season.
        </p>
      </section>
    </main>
  );
}
