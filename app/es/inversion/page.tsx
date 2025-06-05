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

const servicios = [
  {
    name: "Llamada de Descubrimiento",
    icon: <FaPhoneAlt className="text-brand-green text-2xl" />,
    description:
      "30 min de introducción (Zoom/teléfono). Conozcámonos y veamos tus objetivos, sin compromiso.",
    price: "Gratis",
    color: "bg-brand-green/10 border-brand-green",
    cta: "Solicitar llamada",
    link: "/contacto",
  },
  {
    name: "Sesión de Claridad Financiera",
    icon: <FaDollarSign className="text-brand-gold text-2xl" />,
    description:
      "Sesión privada de 60 min enfocada en tu pregunta principal: presupuesto, deudas, impuestos, compra de vivienda y más. Incluye resumen y pasos a seguir.",
    price: "$250 CAD",
    color: "bg-brand-gold/10 border-brand-gold",
    cta: "Reservar sesión",
    link: "/contacto",
  },
  {
    name: "Paquete Bienestar 3 Meses",
    icon: <FaLeaf className="text-brand-green text-2xl" />,
    description:
      "6 sesiones quincenales de coaching, plan personalizado, acompañamiento y herramientas prácticas. Perfecto para crear nuevos hábitos financieros.",
    price: "$1,500 CAD (o 3 × $540/mes)",
    color: "bg-brand-green/10 border-brand-green",
    cta: "Comenzar mi camino",
    link: "/contacto",
  },
  {
    name: "Paquete Holístico 6 Meses",
    icon: <FaUsers className="text-brand-blue text-2xl" />,
    description:
      "12 sesiones quincenales, plan financiero integral (presupuesto, impuestos, hipoteca). Soporte ilimitado por correo. Añade pareja/esposo: +$400.",
    price: "$3,000 CAD (o 6 × $540/mes)",
    color: "bg-brand-blue/10 border-brand-blue",
    cta: "Comenzar ahora",
    link: "/contacto",
  },
  {
    name: "Retención Continua (ex-clientes)",
    icon: <FaRegLightbulb className="text-brand-blue text-2xl" />,
    description:
      "1 sesión privada al mes + soporte continuo por correo. Solo para clientes que ya han pasado por algún paquete.",
    price: "$135/mes",
    color: "bg-brand-blue/10 border-brand-blue",
    cta: "Reconectar",
    link: "/contacto",
  },
  {
    name: "Círculo de Dinero (4 Semanas)",
    icon: <FaComments className="text-brand-blue text-2xl" />,
    description:
      "4 sesiones grupales de 90 min, comunidad de apoyo, cuaderno de trabajo. Crece y aprende junto a otros.",
    price: "$300/persona",
    color: "bg-brand-blue/10 border-brand-blue",
    cta: "Unirme al círculo",
    link: "/contacto",
  },
  {
    name: "Círculo Mensual de Dinero",
    icon: <FaComments className="text-brand-gold text-2xl" />,
    description:
      "Grupo mensual para apoyo y aprendizaje continuo. Temas nuevos cada mes.",
    price: "$80/persona/mes",
    color: "bg-brand-gold/10 border-brand-gold",
    cta: "Unirme al mensual",
    link: "/contacto",
  },
  {
    name: "Talleres (Comunidad/Público)",
    icon: <FaHandshake className="text-brand-gold text-2xl" />,
    description:
      "60–90 min sobre presupuesto, impuestos, compra de vivienda y más. Temas comunitarios: $0–$65/participante.",
    price: "$0–$65/participante",
    color: "bg-brand-gold/10 border-brand-gold",
    cta: "Solicitar información",
    link: "/contacto",
  },
  {
    name: "Talleres (Corporativo/Organización)",
    icon: <FaHandshake className="text-brand-blue text-2xl" />,
    description:
      "Sesiones personalizadas de 60–90 min para equipos o empresas. Disponible en inglés y español. Desde $675/sesión.",
    price: "Desde $675/sesión",
    color: "bg-brand-blue/10 border-brand-blue",
    cta: "Solicitar taller",
    link: "/contacto",
  },
];

export default function Inversion() {
  return (
    <main className="bg-brand-beige min-h-screen py-12 px-2">
      {/* Banner */}
      <section className="max-w-2xl mx-auto text-center mb-10">
        <h1 className="font-serif text-4xl md:text-5xl text-brand-green font-bold mb-3">
          Inversión y Paquetes
        </h1>
        <p className="text-lg text-brand-blue mb-3">
          Precios transparentes y con corazón—para que siempre sepas qué esperar.
        </p>
        <p className="text-brand-body mb-2">
          Todos los servicios están disponibles en español o inglés.
          Siempre comenzamos con una llamada gratuita, sin presión ni compromiso.
        </p>
      </section>

      {/* Tabla comparativa */}
      <section className="max-w-5xl mx-auto mb-10 overflow-x-auto">
        <table className="w-full bg-white rounded-2xl shadow-lg border border-brand-gold text-left text-base">
          <thead>
            <tr className="bg-brand-green text-white">
              <th className="py-3 px-4 rounded-tl-2xl">Servicio</th>
              <th className="py-3 px-4">¿Qué Incluye?</th>
              <th className="py-3 px-4 rounded-tr-2xl">Inversión (CAD)</th>
            </tr>
          </thead>
          <tbody>
            {servicios.map((servicio) => (
              <tr key={servicio.name}>
                <td className="py-3 px-4 font-bold">{servicio.name}</td>
                <td className="py-3 px-4">{servicio.description}</td>
                <td className="py-3 px-4">{servicio.price}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Grid de tarjetas */}
      <section className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
        {servicios.map((servicio) => (
          <div
            key={servicio.name}
            className={`rounded-2xl border-2 ${servicio.color} shadow-xl p-8 flex flex-col items-center text-center transition hover:-translate-y-1 hover:shadow-2xl`}
          >
            <div className="mb-4 w-14 h-14 flex items-center justify-center rounded-full bg-white shadow-lg border">
              {servicio.icon}
            </div>
            <h3 className="font-serif text-xl font-bold mb-2">{servicio.name}</h3>
            <p className="text-brand-body mb-4">{servicio.description}</p>
            <p className="font-semibold text-brand-green text-lg mb-3">{servicio.price}</p>
            <Link href={servicio.link}>
              <button className="bg-brand-gold text-brand-green px-5 py-2 rounded-full shadow hover:bg-brand-blue hover:text-white font-semibold transition">
                {servicio.cta}
              </button>
            </Link>
          </div>
        ))}
      </section>

      {/* FAQ */}
      <section className="max-w-3xl mx-auto mb-12">
        <h2 className="text-2xl font-serif font-bold text-brand-green mb-4">Preguntas Frecuentes</h2>
        <div className="mb-3">
          <span className="font-semibold text-brand-blue">
            ¿Cómo sé cuál es el mejor paquete para mí?
          </span>
          <p className="text-brand-body ml-3">
            Empezamos con una llamada gratuita y lo decidimos juntos, sin presión.
          </p>
        </div>
        <div className="mb-3">
          <span className="font-semibold text-brand-blue">
            ¿Ofreces tarifa ajustable (sliding scale)?
          </span>
          <p className="text-brand-body ml-3">
            ¡Sí! La accesibilidad es fundamental para mí. Si el costo es un obstáculo, por favor avísame. Resevo algunos cupos ajustados cada temporada.
          </p>
        </div>
        <div className="mb-3">
          <span className="font-semibold text-brand-blue">
            ¿Puedo trabajar contigo en inglés?
          </span>
          <p className="text-brand-body ml-3">
            ¡Por supuesto! Todos los servicios están disponibles en inglés y español.
          </p>
        </div>
        <div className="mb-3">
          <span className="font-semibold text-brand-blue">
            ¿Pueden participar parejas o familias?
          </span>
          <p className="text-brand-body ml-3">
            Sí, solo házmelo saber. Me adapto para incluir a tu pareja o familia.
          </p>
        </div>
      </section>

      {/* Nota de accesibilidad */}
      <section className="max-w-xl mx-auto bg-brand-beige border-l-4 border-brand-gold rounded-2xl p-6 shadow text-center mb-12">
        <p className="text-brand-body font-semibold">
          <FaHandshake className="inline-block text-brand-gold text-xl mr-2" />
          La accesibilidad es importante para mí. Si el costo es un obstáculo, por favor avísame—ofrezco algunos cupos ajustados cada temporada.
        </p>
      </section>
    </main>
  );
}
