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

const stripePriceIds: Record<string, string> = {
  "Sesión de Claridad Financiera": "price_1RbuXGGCaTZ2y7NiZPf427KX",
  "Paquete de Bienestar (3 Meses)": "price_1RbucDGCaTZ2y7NiyiE14R3T",
  "Paquete Holístico (6 Meses)": "price_1RbudEGCaTZ2y7NidoHDofUu",
  "Retención Continua (Solo Exalumnos)": "price_1RbuelGCaTZ2y7Nixqkwp1ao",
  "Círculo de Dinero (Grupo, 4 Semanas)": "price_1RbuiWGCaTZ2y7NiA3gZhEQ1",
  "Círculo de Dinero (Mensual)": "price_1RbujPGCaTZ2y7Ni8nes6Hyp",
  "Talleres (Público/Comunidad)": "price_1RbukJGCaTZ2y7NiixcmYSTx",
  "Talleres (Corporativo/Organización)": "price_1Rbul2GCaTZ2y7NizItd4dkc",
};

const services = [
  {
    name: "Llamada de Descubrimiento",
    icon: <FaPhoneAlt className="text-brand-green text-2xl" />,
    description:
      "Una conversación gratuita y cordial para conocerte, entender tus necesidades y tus metas—sin compromiso. Descubre si somos el equipo ideal.",
    color: "bg-brand-green/10 border-brand-green",
    cta: "Agendar Llamada Gratuita",
    link: "/es/contacto",
    price: "Gratis (30 min)",
  },
  {
    name: "Sesión de Claridad Financiera",
    icon: <FaDollarSign className="text-brand-gold text-2xl" />,
    description:
      "Sesión enfocada para aclarar tu mayor duda financiera—presupuesto, impuestos, compra de vivienda, o cualquier reto. Obtén pasos personalizados y tranquilidad.",
    color: "bg-brand-gold/10 border-brand-gold",
    cta: "Reservar Sesión",
    link: "/es/contacto",
    price: "$180 (90 min)",
  },
  {
    name: "Paquete de Bienestar (3 Meses)",
    icon: <FaLeaf className="text-brand-green text-2xl" />,
    description:
      "Acompañamiento para crear hábitos financieros sólidos, un plan claro, y avanzar de verdad en tu camino financiero—juntos, paso a paso.",
    color: "bg-brand-green/10 border-brand-green",
    cta: "Más Información",
    link: "/es/inversion",
    price: "$480 (3 meses, 3 sesiones)",
  },
  {
    name: "Paquete Holístico (6 Meses)",
    icon: <FaUsers className="text-brand-blue text-2xl" />,
    description:
      "Transformación profunda y acompañamiento continuo para grandes cambios, metas importantes, o planificación holística para ti (o en pareja/familia).",
    color: "bg-brand-blue/10 border-brand-blue",
    cta: "Más Información",
    link: "/es/inversion",
    price: "$850 (6 meses, 6 sesiones)",
  },
  {
    name: "Retención Continua (Solo Exalumnos)",
    icon: <FaRegLightbulb className="text-brand-blue text-2xl" />,
    description:
      "Sigue acompañado con chequeos mensuales y orientación continua solo para exalumnos. Para mantener tu avance y motivación.",
    color: "bg-brand-blue/10 border-brand-blue",
    cta: "Reconectar",
    link: "/es/contacto",
    price: "$90/mes (solo exalumnos)",
  },
  {
    name: "Círculo de Dinero (Grupo, 4 Semanas)",
    icon: <FaComments className="text-brand-blue text-2xl" />,
    description:
      "Un grupo pequeño y seguro para aprender, compartir y crecer juntos en abundancia. Empoderamiento y comunidad.",
    color: "bg-brand-blue/10 border-brand-blue",
    cta: "Unirme al Círculo",
    link: "/es/contacto",
    price: "$120 (4 semanas, grupo)",
  },
  {
    name: "Círculo de Dinero (Mensual)",
    icon: <FaComments className="text-brand-gold text-2xl" />,
    description:
      "Sesiones grupales mensuales para seguir aprendiendo, inspirándote y recibiendo apoyo práctico.",
    color: "bg-brand-gold/10 border-brand-gold",
    cta: "Unirme Mensual",
    link: "/es/contacto",
    price: "$35/mes (grupo)",
  },
  {
    name: "Talleres (Público/Comunidad)",
    icon: <FaHandshake className="text-brand-gold text-2xl" />,
    description:
      "Talleres interactivos de presupuesto, impuestos, compra de vivienda y más—para comunidades, organizaciones o el público.",
    color: "bg-brand-gold/10 border-brand-gold",
    cta: "Solicitar Info",
    link: "/es/contacto",
    price: "Desde $250 (a medida)",
  },
  {
    name: "Talleres (Corporativo/Organización)",
    icon: <FaHandshake className="text-brand-blue text-2xl" />,
    description:
      "Talleres personalizados para empresas y organizaciones. Fortalece a tu equipo con herramientas de bienestar financiero.",
    color: "bg-brand-blue/10 border-brand-blue",
    cta: "Reservar Taller",
    link: "/es/contacto",
    price: "Desde $500 (a medida)",
  },
];

export default function Inversion() {
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
    <main className="bg-brand-beige min-h-screen py-20 px-2">
      {/* HERO / HEADER */}
      <section className="max-w-4xl mx-auto text-center mb-12">
        <h1 className="font-serif text-4xl md:text-5xl text-brand-green font-bold mb-3 flex items-center justify-center gap-2">
          <span aria-hidden="true">💸</span>
          Inversión y Paquetes
        </h1>
        <p className="text-lg text-brand-blue mb-3">
          Precios claros y conscientes—siempre sabrás qué esperar.
        </p>
        <p className="text-brand-body mb-2">
          Todos los servicios disponibles en español o inglés.<br />
          Todo inicia con una llamada gratuita y sin compromiso.
        </p>
      </section>

      {/* COMPARISON TABLE */}
      <section className="max-w-6xl mx-auto mb-14 overflow-x-auto">
        <table className="w-full bg-white rounded-2xl shadow-lg border border-brand-gold text-left text-base">
          <thead>
            <tr className="bg-brand-green text-white">
              <th className="py-3 px-4 rounded-tl-2xl min-w-[120px]">Servicio</th>
              <th className="py-3 px-4">¿Qué Incluye?</th>
              <th className="py-3 px-4 rounded-tr-2xl min-w-[140px]">Inversión (CAD)</th>
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
            {stripePriceIds[service.name] ? (
              <button
                type="button"
                onClick={() => handleCheckout(service.name)}
                className="bg-brand-gold text-brand-green px-5 py-2 rounded-full shadow hover:bg-brand-blue hover:text-white font-semibold transition focus:outline-none focus:ring-2 focus:ring-brand-gold"
                aria-label={`Comprar ${service.name}`}
              >
                Comprar
              </button>
            ) : (
              <Link href={service.link}>
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
      </section>

      {/* FAQ SECTION */}
      <section className="max-w-3xl mx-auto mb-14">
        <h2 className="text-2xl font-serif font-bold text-brand-green mb-4 flex items-center gap-2">
          <span aria-hidden="true">❓</span>
          Preguntas Frecuentes
        </h2>
        <div className="mb-3">
          <span className="font-semibold text-brand-blue">
            ¿Cómo sé cuál paquete es el mejor para mí?
          </span>
          <p className="text-brand-body ml-3">
            Empecemos con una llamada de descubrimiento gratuita y lo resolvemos juntos, sin presión.
          </p>
        </div>
        <div className="mb-3">
          <span className="font-semibold text-brand-blue">¿Ofreces tarifa variable?</span>
          <p className="text-brand-body ml-3">
            ¡Sí! La accesibilidad es importante para mí. Si el costo es una barrera, escríbeme. Cada temporada reservo algunos lugares con tarifa flexible.
          </p>
        </div>
        <div className="mb-3">
          <span className="font-semibold text-brand-blue">
            ¿Puedo trabajar contigo en inglés?
          </span>
          <p className="text-brand-body ml-3">
            Of course! All services are available in both Spanish and English.
          </p>
        </div>
        <div className="mb-3">
          <span className="font-semibold text-brand-blue">
            ¿Pueden participar parejas o familias?
          </span>
          <p className="text-brand-body ml-3">
            Sí, solo avísame. Adapto las sesiones para incluir a tu pareja o familia.
          </p>
        </div>
      </section>

      {/* NOTA DE ACCESIBILIDAD */}
      <section className="max-w-xl mx-auto bg-brand-beige border-l-4 border-brand-gold rounded-2xl p-6 shadow text-center mb-12">
        <p className="text-brand-body font-semibold">
          <FaHandshake className="inline-block text-brand-gold text-xl mr-2" />
          La accesibilidad es fundamental para mí. Si el costo es una barrera, escríbeme—ofrezco algunos lugares de tarifa variable cada temporada.
        </p>
      </section>
    </main>
  );
}
