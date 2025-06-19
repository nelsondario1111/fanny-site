// --- SEO METADATA (Next.js 13/14 App Router) --- //
export const metadata = {
  title: "Services | Fanny Samaniego Coaching – Holistic Financial Support",
  description:
    "Discover all holistic financial coaching services: private sessions, wellness packages, group circles, and workshops. Warm, practical, bilingual support for your journey.",
  openGraph: {
    title: "Services | Fanny Samaniego Coaching",
    description:
      "All holistic coaching services, from discovery calls and private sessions to group circles and workshops, in English and Spanish.",
    url: "https://fannysamaniego.com/en/services",
    siteName: "Fanny Samaniego Coaching",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Services | Fanny Samaniego Coaching",
    description: "Explore all financial coaching services, private sessions, packages, and group programs in English and Spanish.",
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
  },
  {
    name: "Financial Clarity Session",
    icon: <FaDollarSign className="text-brand-gold text-2xl" />,
    description:
      "A focused session to clarify your biggest financial question—budgeting, taxes, home buying, or any money challenge. Get personalized next steps and peace of mind.",
    color: "bg-brand-gold/10 border-brand-gold",
    cta: "Book Session",
    link: "/en/contact",
  },
  {
    name: "3-Month Wellness Package",
    icon: <FaLeaf className="text-brand-green text-2xl" />,
    description:
      "Guided support to build strong money habits, create a clear plan, and make real progress on your financial journey—together, step by step.",
    color: "bg-brand-green/10 border-brand-green",
    cta: "Learn More",
    link: "/en/investment",
  },
  {
    name: "6-Month Holistic Package",
    icon: <FaUsers className="text-brand-blue text-2xl" />,
    description:
      "Deep transformation and ongoing support for life changes, major financial goals, or holistic planning for you (and your partner or family).",
    color: "bg-brand-blue/10 border-brand-blue",
    cta: "Learn More",
    link: "/en/investment",
  },
  {
    name: "Ongoing Retainer (Alumni Only)",
    icon: <FaRegLightbulb className="text-brand-blue text-2xl" />,
    description:
      "Stay connected and supported with monthly check-ins and ongoing guidance for alumni clients. For steady growth and accountability.",
    color: "bg-brand-blue/10 border-brand-blue",
    cta: "Reconnect",
    link: "/en/contact",
  },
  {
    name: "Money Circle (Group, 4 Weeks)",
    icon: <FaComments className="text-brand-blue text-2xl" />,
    description:
      "A small, supportive group to learn, share, and grow together around money and abundance. Empowerment and community in a safe space.",
    color: "bg-brand-blue/10 border-brand-blue",
    cta: "Join Next Circle",
    link: "/en/contact",
  },
  {
    name: "Money Circle (Monthly)",
    icon: <FaComments className="text-brand-gold text-2xl" />,
    description:
      "Ongoing monthly group sessions for continued support, inspiration, and practical learning.",
    color: "bg-brand-gold/10 border-brand-gold",
    cta: "Join Monthly",
    link: "/en/contact",
  },
  {
    name: "Workshops (Public/Community)",
    icon: <FaHandshake className="text-brand-gold text-2xl" />,
    description:
      "Interactive workshops on budgeting, taxes, home buying, and more—for communities, organizations, and the public.",
    color: "bg-brand-gold/10 border-brand-gold",
    cta: "Request Info",
    link: "/en/contact",
  },
  {
    name: "Workshops (Corporate/Org)",
    icon: <FaHandshake className="text-brand-blue text-2xl" />,
    description:
      "Custom workshops for companies and organizations. Empower your team with financial wellness tools, English or Spanish.",
    color: "bg-brand-blue/10 border-brand-blue",
    cta: "Book Workshop",
    link: "/en/contact",
  },
];

export default function Services() {
  return (
    <main className="bg-brand-beige min-h-screen py-12 px-2">
      {/* Banner */}
      <section className="max-w-2xl mx-auto text-center mb-10">
        <h1 className="font-serif text-4xl md:text-5xl text-brand-green font-bold mb-3 flex items-center justify-center gap-2">
          <span aria-hidden="true">🪴</span>
          Ways I Can Guide You
        </h1>
        <p className="text-lg text-brand-blue mb-3">
          Warm, holistic, and practical support for your financial wellbeing.
        </p>
        <p className="text-brand-body mb-2">
          Whether you need focused advice, a transformational journey, or a supportive community, I offer guidance with compassion, clarity, and care—in English or Spanish.
        </p>
        <Link href="/en/investment" className="inline-block mt-4">
          <button
            type="button"
            className="bg-brand-gold text-brand-green px-6 py-2 rounded-full shadow hover:bg-brand-blue hover:text-white font-semibold text-base transition focus:outline-none focus:ring-2 focus:ring-brand-gold"
            aria-label="See Packages & Investment"
          >
            See Packages & Investment
          </button>
        </Link>
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

      {/* Invitation Note */}
      <section className="max-w-xl mx-auto bg-brand-beige border-l-4 border-brand-gold rounded-2xl p-6 shadow text-center mb-12">
        <p className="text-brand-body font-semibold">
          Every journey starts with an open invitation.
          <br />
          Book a free discovery call—no pressure, just a warm conversation.
        </p>
      </section>
    </main>
  );
}
