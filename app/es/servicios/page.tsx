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

// IDs de Stripe para los paquetes/servicios (ajusta si es necesario)
const stripePriceIds: Record<string, string> = {
  "Sesión de Claridad Financiera": "price_1RbuXGGCaTZ2y7NiZPf427KX",
  "Paquete de Bienestar (3 Meses)": "price_1RbucDGCaTZ2y7NiyiE14R3T",
  "Paquete Holístico (6 Meses)": "price_1RbudEGCaTZ2y7NidoHDofUu",
  "Retainer Continuo (Solo Alumni)": "price_1RbuelGCaTZ2y7Nixqkwp1ao",
  "Círculo de Dinero (4 Semanas)": "price_1RbuiWGCaTZ2y7NiA3gZhEQ1",
  "Círculo de Dinero (Mensual)": "price_1RbujPGCaTZ2y7Ni8nes6Hyp",
  "Talleres (Público/Comunidad)": "price_1RbukJGCaTZ2y7NiixcmYSTx",
  "Talleres (Empresas/Organizaciones)": "price_1Rbul2GCaTZ2y7NizItd4dkc",
};

const services = [
  {
    name: "Llamada de Descubrimiento",
    icon: <FaPhoneAlt className="text-brand-green text-2xl" />,
    description:
      "Una conversación gratuita y cercana para conocernos, entender tus necesidades y ver si somos el equipo ideal—sin presión ni compromiso.",
    color: "bg-brand-green/10 border-brand-green",
    price: "Gratis (30 min)",
    primary: true,
    cta: "Reservar llamada",
    action: "link",
    link: "/es/contacto",
  },
  {
    name: "Sesión de Claridad Financiera",
    icon: <FaDollarSign className="text-brand-gold text-2xl" />,
    description:
      "Sesión enfocada para aclarar tu mayor reto financiero—presupuesto, impuestos, compra de vivienda, o lo que tú necesites. Pasos claros y tranquilidad.",
    color: "bg-brand-gold/10 border-brand-gold",
    price: "$180 (90 min)",
    cta: "Agendar ahora",
    action: "stripe",
  },
  {
    name: "Paquete de Bienestar (3 Meses)",
    icon: <FaLeaf className="text-brand-green text-2xl" />,
    description:
      "Acompañamiento para crear hábitos sanos con el dinero, definir un plan claro y avanzar de verdad en tu camino financiero—juntos, paso a paso.",
    color: "bg-brand-green/10 border-brand-green",
    price: "$480 (3 meses, 3 sesiones)",
    cta: "Agendar ahora",
    action: "stripe",
  },
  {
    name: "Paquete Holístico (6 Meses)",
    icon: <FaUsers className="text-brand-blue text-2xl" />,
    description:
      "Transformación profunda y apoyo constante para grandes cambios, metas importantes o planificación holística—puede incluir a tu pareja o familia.",
    color: "bg-brand-blue/10 border-brand-blue",
    price: "$850 (6 meses, 6 sesiones)",
    cta: "Agendar ahora",
    action: "stripe",
  },
  {
    name: "Retainer Continuo (Solo Alumni)",
    icon: <FaRegLightbulb className="text-brand-blue text-2xl" />,
    description:
      "Mantén el acompañamiento con sesiones mensuales y guía continua para quienes ya han pasado por un proceso conmigo. Para crecimiento constante.",
    color: "bg-brand-blue/10 border-brand-blue",
    price: "$90/mes (solo alumni)",
    cta: "Agendar ahora",
    action: "stripe",
  },
  {
    name: "Círculo de Dinero (4 Semanas)",
    icon: <FaComments className="text-brand-blue text-2xl" />,
    description:
      "Un grupo pequeño y seguro para aprender, compartir y crecer en temas de dinero y abundancia. Empoderamiento y comunidad.",
    color: "bg-brand-blue/10 border-brand-blue",
    price: "$120 (4 semanas, grupal)",
    cta: "Unirme",
    action: "stripe",
  },
  {
    name: "Círculo de Dinero (Mensual)",
    icon: <FaComments className="text-brand-gold text-2xl" />,
    description:
      "Sesiones grupales mensuales para continuar el apoyo, la inspiración y el aprendizaje práctico—comunidad abierta, cuando la necesites.",
    color: "bg-brand-gold/10 border-brand-gold",
    price: "$35/mes (grupal)",
    cta: "Unirme",
    action: "stripe",
  },
  {
    name: "Talleres (Público/Comunidad)",
    icon: <FaHandshake className="text-brand-gold text-2xl" />,
    description:
      "Talleres interactivos sobre presupuesto, impuestos, compra de vivienda y más—para comunidades, organizaciones o público general.",
    color: "bg-brand-gold/10 border-brand-gold",
    price: "Desde $250 (personalizado)",
    cta: "Solicitar información",
    action: "link",
    link: "/es/contacto",
  },
  {
    name: "Talleres (Empresas/Organizaciones)",
    icon: <FaHandshake className="text-brand-blue text-2xl" />,
    description:
      "Talleres personalizados para empresas y organizaciones. Bienestar financiero en español o inglés.",
    color: "bg-brand-blue/10 border-brand-blue",
    price: "Desde $500 (personalizado)",
    cta: "Solicitar información",
    action: "link",
    link: "/es/contacto",
  },
];

export default function Services() {
  // Handler para Stripe checkout
  const handleCheckout = async (serviceName: string) => {
    const priceId = stripePriceIds[serviceName];
    if (!priceId) {
      window.location.href = "/es/contacto";
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
            
            Formas de Trabajar Juntos
          </h1>
          <p className="text-lg text-brand-blue mb-3">
            Acompañamiento cálido, holístico y práctico para tu bienestar financiero—transparente y siempre por invitación.
          </p>
          <p className="text-brand-body mb-2">
            Ya sea que busques una guía puntual, un proceso transformador o una comunidad que te apoye, te ofrezco acompañamiento con compasión, claridad y cuidado—en español o inglés.
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
              {/* Botón de acción */}
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

        {/* Nota de invitación */}
        <div className="bg-brand-beige border-l-4 border-brand-gold rounded-2xl p-6 shadow text-center mb-4">
          <p className="text-brand-body font-semibold">
            Cada proceso empieza con una invitación abierta.<br />
            Reserva una llamada de descubrimiento gratuita—sin presión, solo una conversación cercana y genuina.
          </p>
        </div>
      </section>

      {/* SECCIÓN FAQ */}
      <section className="max-w-3xl mx-auto mb-14 bg-white/95 rounded-2xl shadow-lg border border-brand-gold p-8">
        <h2 className="text-2xl font-serif font-bold text-brand-green mb-4 flex items-center gap-2">
          <span aria-hidden="true">❓</span>
          Preguntas Frecuentes
        </h2>
        <div className="mb-3">
          <span className="font-semibold text-brand-blue">
            ¿Cómo sé cuál paquete es el adecuado para mí?
          </span>
          <p className="text-brand-body ml-3">
            Comencemos con una llamada gratuita—la primera invitación siempre es conversar sin compromiso.
          </p>
        </div>
        <div className="mb-3">
          <span className="font-semibold text-brand-blue">
            ¿Ofreces tarifa ajustada según ingresos?
          </span>
          <p className="text-brand-body ml-3">
            ¡Sí! La accesibilidad es muy importante para mí. Si el costo es una barrera, escríbeme y lo conversamos—siempre reservo algunos cupos a tarifa ajustada cada temporada.
          </p>
        </div>
        <div className="mb-3">
          <span className="font-semibold text-brand-blue">
            ¿Puedo trabajar contigo en inglés?
          </span>
          <p className="text-brand-body ml-3">
            Of course! Todos los servicios están disponibles en español o inglés, solo dime tu preferencia.
          </p>
        </div>
        <div className="mb-3">
          <span className="font-semibold text-brand-blue">
            ¿Puede unirse mi pareja o familia a las sesiones?
          </span>
          <p className="text-brand-body ml-3">
            Por supuesto—solo cuéntame tu situación y adapto el proceso a lo que necesites.
          </p>
        </div>
      </section>

      {/* NOTA DE ACCESIBILIDAD */}
      <section className="max-w-xl mx-auto bg-brand-beige border-l-4 border-brand-gold rounded-2xl p-6 shadow text-center mb-12">
        <p className="text-brand-body font-semibold">
          <FaHandshake className="inline-block text-brand-gold text-xl mr-2" />
          La accesibilidad es parte esencial de mi misión. Si el costo es un obstáculo, escríbeme—siempre aparto algunos cupos con tarifa ajustada para quien lo necesite.
        </p>
      </section>
    </main>
  );
}
